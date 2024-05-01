import Bun from "bun";
import { app } from "./server/app";

Bun.serve({
    fetch: app.fetch,
})