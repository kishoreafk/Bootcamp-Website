import { relations } from "drizzle-orm";
import { users, garments, designs, orders } from "./schema.js";

export const usersRelations = relations(users, ({ many }) => ({
  garments: many(garments),
  designs: many(designs),
  orders: many(orders),
}));

export const garmentsRelations = relations(garments, ({ one, many }) => ({
  user: one(users, { fields: [garments.userId], references: [users.id] }),
  designs: many(designs),
  orders: many(orders),
}));

export const designsRelations = relations(designs, ({ one }) => ({
  user: one(users, { fields: [designs.userId], references: [users.id] }),
  garment: one(garments, { fields: [designs.garmentId], references: [garments.id] }),
}));

export const ordersRelations = relations(orders, ({ one }) => ({
  user: one(users, { fields: [orders.userId], references: [users.id] }),
  design: one(designs, { fields: [orders.designId], references: [designs.id] }),
  garment: one(garments, { fields: [orders.garmentId], references: [garments.id] }),
}));
