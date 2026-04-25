import { Hono } from "hono";
import { bodyLimit } from "hono/body-limit";
import type { HttpBindings } from "@hono/node-server";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { Paths } from "../contracts/constants.js";
import { appRouter } from "./router.js";
import { createContext } from "./context.js";
import { createOAuthCallbackHandler } from "./kimi/auth.js";

const app = new Hono<{ Bindings: HttpBindings }>();

app.use(bodyLimit({ maxSize: 50 * 1024 * 1024 }));
app.get(Paths.oauthCallback, createOAuthCallbackHandler());
app.use("/api/trpc/*", async (c) => {
  return fetchRequestHandler({
    endpoint: "/api/trpc",
    req: c.req.raw,
    router: appRouter,
    createContext,
    onError({ error, path, type }) {
      console.error("[trpc]", {
        path,
        type,
        message: error.message,
        code: error.code,
        cause: error.cause,
      });
    },
  });
});
app.all("/api/*", (c) => c.json({ error: "Not Found" }, 404));

export default app;
