import { z } from "zod";
import { createRouter, authedQuery } from "./middleware.js";
import { findUserById, updateUser } from "./queries/users.js";

export const userRouter = createRouter({
  createProfile: authedQuery
    .input(
      z.object({
        name: z.string().min(1).max(255),
        stylePreference: z.string().min(1).max(100),
        preferredFit: z.enum(["fitted", "relaxed", "oversized"]),
        sustainabilityPriority: z.number().min(1).max(10),
      })
    )
    .mutation(async ({ ctx, input }) => {
      await updateUser(ctx.user.id, {
        name: input.name,
        stylePreference: input.stylePreference,
        preferredFit: input.preferredFit,
        sustainabilityPriority: input.sustainabilityPriority,
      });
      const user = await findUserById(ctx.user.id);
      return user;
    }),

  updateProfile: authedQuery
    .input(
      z.object({
        name: z.string().min(1).max(255).optional(),
        stylePreference: z.string().min(1).max(100).optional(),
        preferredFit: z.enum(["fitted", "relaxed", "oversized"]).optional(),
        sustainabilityPriority: z.number().min(1).max(10).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      await updateUser(ctx.user.id, input);
      const user = await findUserById(ctx.user.id);
      return user;
    }),

  getProfile: authedQuery.query(async ({ ctx }) => {
    const user = await findUserById(ctx.user.id);
    return user;
  }),
});
