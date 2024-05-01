import { password } from "bun";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { sign } from "hono/jwt";
import { DrizzleError } from "drizzle-orm";
import { z } from "zod";
import { db, users } from "../database";
import { LibsqlError } from "@libsql/client";
import { authRequired } from "../middlewares";

export const authRoutes = new Hono();

const authSchema = z.object({
	username: z.string(),
	password: z.string(),
});

authRoutes.post("/login", zValidator("json", authSchema), async (ctx) => {
	const body = ctx.req.valid("json");

	const user = await db.query.users.findFirst({
		where: (users, { eq }) => eq(users.username, body.username),
	});

	if (!user) {
		ctx.status(404);
		return ctx.json({
			error: "User not found",
		});
	}

	const passwordMatch = await password.verify(body.password, user.password);

	if (!passwordMatch) {
		ctx.status(400);
		return ctx.json({
			error: "Invalid credentials",
		});
	}

	const token = await sign(
		{
			userId: user.id,
			exp: Math.floor(Date.now() / 1000) + 60 * 60, // expire in 1 hour
		},
		process.env.JWT_SECRET!
	);

	return ctx.json({
		token,
	});
});

authRoutes.post("/sign-up", zValidator("json", authSchema), async (ctx) => {
	const body = ctx.req.valid("json");

	const hashedPassword = await password.hash(body.password);

	try {
		const userId = (
			await db
				.insert(users)
				.values({
					username: body.username,
					password: hashedPassword,
				})
				.returning({ id: users.id })
		)[0].id;

		const token = await sign(
			{
				userId,
				exp: Math.floor(Date.now() / 1000) + 60 * 60, // expire in 1 hour
			},
			process.env.JWT_SECRET!
		);

		return ctx.json({
			token,
		});
	} catch (err) {
		if (err instanceof LibsqlError) {
			ctx.status(400);
			return ctx.json({
				error: "Username exists before, please choose another one",
			});
		}

		ctx.status(500)
		return ctx.json({
			error: "Something went wrong",
		});
	}
});

authRoutes.get("/user-details", authRequired, async (ctx) => {
	const userId: number = ctx.get("jwtPayload").userId;

	const user = await db.query.users.findFirst({
		where: (users, { eq }) => eq(users.id, userId),
		columns: {
			password: false,
		},
		with: {
			travels: true,
		}
	})

	if (!user) {
		ctx.status(404);
		return ctx.json({
			error: 'User not found',
		})
	}

	return ctx.json(user);
})