import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { createRouter, authedQuery } from "./middleware";
import { createOrder, findOrderById, listOrdersByUser } from "./queries/orders";
import { getSelectedDesign } from "./queries/designs";
import { findGarmentById } from "./queries/garments";

export const orderRouter = createRouter({
  create: authedQuery
    .input(
      z.object({
        designId: z.number(),
        garmentId: z.number(),
        measurements: z.object({
          height: z.string().optional(),
          chest: z.string().optional(),
          waist: z.string().optional(),
          hips: z.string().optional(),
          shoulderWidth: z.string().optional(),
          preferredLength: z.string().optional(),
          fitNotes: z.string().optional(),
        }),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const design = await getSelectedDesign(ctx.user.id);
      if (!design || design.id !== input.designId) {
        // Allow if design exists
        const designs = await import("./queries/designs").then((m) => m.listDesignsByUser(ctx.user.id));
        const found = designs.find((d) => d.id === input.designId);
        if (!found) {
          throw new TRPCError({ code: "NOT_FOUND", message: "Design not found" });
        }
      }

      const garment = await findGarmentById(input.garmentId);
      if (!garment || garment.userId !== ctx.user.id) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Garment not found" });
      }

      // Calculate estimated delivery (2-3 weeks from now)
      const now = new Date();
      const deliveryStart = new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000);
      const deliveryEnd = new Date(now.getTime() + 21 * 24 * 60 * 60 * 1000);
      const estimatedDelivery = `${deliveryStart.toLocaleDateString("en-US", { month: "short", day: "numeric" })}-${deliveryEnd.toLocaleDateString("en-US", { month: "short", day: "numeric" })}`;

      const order = await createOrder({
        userId: ctx.user.id,
        designId: input.designId,
        garmentId: input.garmentId,
        measurements: input.measurements,
        estimatedDelivery,
      });

      return order;
    }),

  list: authedQuery.query(async ({ ctx }) => {
    return listOrdersByUser(ctx.user.id);
  }),

  getById: authedQuery
    .input(z.object({ id: z.number() }))
    .query(async ({ ctx, input }) => {
      const order = await findOrderById(input.id);
      if (!order || order.userId !== ctx.user.id) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Order not found" });
      }
      return order;
    }),
});
