import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { createRouter, authedQuery } from "./middleware";
import { createDesign, listDesignsByUser, listDesignsByGarment, selectDesign, getSelectedDesign } from "./queries/designs";
import { findGarmentById } from "./queries/garments";

const MOCK_DESIGNS = [
  {
    name: "The Minimalist Take",
    description: "Clean lines, modern silhouette — honoring the original texture with restrained elegance.",
    imageUrl: "/images/design-1.jpg",
    tags: ["Minimal", "Modern", "Elegant"],
  },
  {
    name: "The Avant-Garde Remix",
    description: "Bold restructuring with unexpected proportions. For those who dare to stand apart.",
    imageUrl: "/images/design-2.jpg",
    tags: ["Bold", "Avant-Garde", "Statement"],
  },
  {
    name: "The Bohemian Revival",
    description: "Flowing forms with natural textures. Romantic, free-spirited, and deeply personal.",
    imageUrl: "/images/design-3.jpg",
    tags: ["Bohemian", "Romantic", "Flowing"],
  },
  {
    name: "The Modern Classic",
    description: "Scandinavian simplicity meets timeless tailoring. Refined and effortlessly wearable.",
    imageUrl: "/images/design-4.jpg",
    tags: ["Classic", "Minimal", "Tailored"],
  },
];

export const designRouter = createRouter({
  generate: authedQuery
    .input(
      z.object({
        garmentId: z.number(),
        preferences: z.array(z.string()),
        styleDirection: z.string().optional(),
        colorPreference: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const garment = await findGarmentById(input.garmentId);
      if (!garment || garment.userId !== ctx.user.id) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Garment not found" });
      }

      // Simulate AI generation delay
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const designs = [];
      for (const mock of MOCK_DESIGNS) {
        const design = await createDesign({
          garmentId: input.garmentId,
          userId: ctx.user.id,
          name: mock.name,
          description: mock.description,
          imageUrl: mock.imageUrl,
          tags: mock.tags,
        });
        designs.push(design);
      }

      return designs;
    }),

  list: authedQuery.query(async ({ ctx }) => {
    return listDesignsByUser(ctx.user.id);
  }),

  listByGarment: authedQuery
    .input(z.object({ garmentId: z.number() }))
    .query(async ({ ctx, input }) => {
      return listDesignsByGarment(input.garmentId, ctx.user.id);
    }),

  select: authedQuery
    .input(z.object({ designId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      await selectDesign(input.designId, ctx.user.id);
      return { success: true };
    }),

  getSelected: authedQuery.query(async ({ ctx }) => {
    return getSelectedDesign(ctx.user.id);
  }),

  getById: authedQuery
    .input(z.object({ id: z.number() }))
    .query(async ({ ctx, input }) => {
      const designs = await listDesignsByUser(ctx.user.id);
      const design = designs.find((d) => d.id === input.id);
      if (!design) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Design not found" });
      }
      return design;
    }),
});
