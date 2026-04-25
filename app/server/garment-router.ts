import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { createRouter, authedQuery } from "./middleware";
import { createGarment, findGarmentById, listGarmentsByUser, deleteGarment } from "./queries/garments";

export const garmentRouter = createRouter({
  create: authedQuery
    .input(
      z.object({
        name: z.string().min(1).max(255),
        originalPurpose: z.string().max(100).optional(),
        emotionalValue: z.string().optional(),
        images: z.array(z.string()).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const garment = await createGarment({
        userId: ctx.user.id,
        name: input.name,
        originalPurpose: input.originalPurpose || null,
        emotionalValue: input.emotionalValue || null,
        images: input.images ? JSON.stringify(input.images) : null,
      });
      return garment;
    }),

  list: authedQuery.query(async ({ ctx }) => {
    return listGarmentsByUser(ctx.user.id);
  }),

  getById: authedQuery
    .input(z.object({ id: z.number() }))
    .query(async ({ ctx, input }) => {
      const garment = await findGarmentById(input.id);
      if (!garment || garment.userId !== ctx.user.id) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Garment not found" });
      }
      return garment;
    }),

  delete: authedQuery
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      await deleteGarment(input.id, ctx.user.id);
      return { success: true };
    }),
});
