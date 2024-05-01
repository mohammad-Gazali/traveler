import type { MiddlewareHandler } from "hono";
import { jwt } from "hono/jwt";

export const authRequired: MiddlewareHandler = (ctx, next) => {
    return jwt({
        secret: process.env.JWT_SECRET!,
    })(ctx, next);
}