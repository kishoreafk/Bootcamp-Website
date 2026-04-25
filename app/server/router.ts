import { authRouter } from "./auth-router";
import { userRouter } from "./user-router";
import { garmentRouter } from "./garment-router";
import { designRouter } from "./design-router";
import { orderRouter } from "./order-router";
import { adminRouter } from "./admin-router";
import { createRouter, publicQuery } from "./middleware";

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
