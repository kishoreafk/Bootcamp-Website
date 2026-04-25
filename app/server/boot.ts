import { serve } from "@hono/node-server";
import app from "./app.js";
import { serveStaticFiles } from "./lib/vite.js";

serveStaticFiles(app);

const port = parseInt(process.env.PORT || "3000", 10);

serve({ fetch: app.fetch, port }, () => {
  console.log(`Server running on http://localhost:${port}/`);
});
