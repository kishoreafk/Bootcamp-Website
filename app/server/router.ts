import { authRouter } from "./auth-router.js";
import { userRouter } from "./user-router.js";
import { garmentRouter } from "./garment-router.js";
import { designRouter } from "./design-router.js";
import { orderRouter } from "./order-router.js";
import { adminRouter } from "./admin-router.js";
import { createRouter, publicQuery } from "./middleware.js";

export const appRouter = createRouter({
  ping: publicQuery.query(() => ({ ok: true, ts: Date.now() })),
  auth: authRouter,
  user: userRouter,
  garment: garmentRouter,
  design: designRouter,
  order: orderRouter,
  admin: adminRouter,
});

export type AppRouter = typeof appRouter;
