import {
  mysqlTable,
  mysqlEnum,
  serial,
  varchar,
  text,
  timestamp,
  int,
  bigint,
} from "drizzle-orm/mysql-core";

export const users = mysqlTable("users", {
  id: serial("id").primaryKey(),
  phone: varchar("phone", { length: 50 }).notNull().unique(),
  name: varchar("name", { length: 255 }),
  stylePreference: varchar("stylePreference", { length: 100 }),
  preferredFit: varchar("preferredFit", { length: 50 }),
  sustainabilityPriority: int("sustainabilityPriority"),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});

export const otps = mysqlTable("otps", {
  id: serial("id").primaryKey(),
  phone: varchar("phone", { length: 50 }).notNull(),
  code: varchar("code", { length: 10 }).notNull(),
  expiresAt: timestamp("expiresAt").notNull(),
  verified: int("verified").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const garments = mysqlTable("garments", {
  id: serial("id").primaryKey(),
  userId: bigint("userId", { mode: "number", unsigned: true }).notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  originalPurpose: varchar("originalPurpose", { length: 100 }),
  emotionalValue: text("emotionalValue"),
  images: text("images"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const designs = mysqlTable("designs", {
  id: serial("id").primaryKey(),
  garmentId: bigint("garmentId", { mode: "number", unsigned: true }).notNull(),
  userId: bigint("userId", { mode: "number", unsigned: true }).notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  imageUrl: varchar("imageUrl", { length: 500 }).notNull(),
  tags: text("tags"),
  isSelected: int("isSelected").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const orders = mysqlTable("orders", {
  id: serial("id").primaryKey(),
  userId: bigint("userId", { mode: "number", unsigned: true }).notNull(),
  designId: bigint("designId", { mode: "number", unsigned: true }).notNull(),
  garmentId: bigint("garmentId", { mode: "number", unsigned: true }).notNull(),
  measurements: text("measurements"),
  status: varchar("status", { length: 50 }).default("placed").notNull(),
  estimatedDelivery: varchar("estimatedDelivery", { length: 100 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;
export type Garment = typeof garments.$inferSelect;
export type Design = typeof designs.$inferSelect;
export type Order = typeof orders.$inferSelect;
