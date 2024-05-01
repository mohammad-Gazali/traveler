import { Hono } from "hono";
import { logger } from "hono/logger";
import { authRoutes } from "./routes";

export const app = new Hono().basePath("/api");

app.use(logger());

app.route("/auth", authRoutes);