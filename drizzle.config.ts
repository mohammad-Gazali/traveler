import type { Config } from "drizzle-kit";

export default {
	schema: "./server/database/schema/index.ts",
	out: "./server/database/migrations",
	driver: "turso",
	dbCredentials: {
		url: process.env.DATABASE_URL!,
		authToken: process.env.DATABASE_AUTH_TOKEN,
	},
} satisfies Config;
