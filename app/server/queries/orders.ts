import { eq, desc, sql } from "drizzle-orm";
import * as schema from "@db/schema";
import { getDb } from "./connection";

export async function createOrder(data: {
  userId: number;
  designId: number;
  garmentId: number;
  measurements: Record<string, unknown>;
  status?: string;
  estimatedDelivery?: string;
}) {
  const result = await getDb()
    .insert(schema.orders)
    .values({
      userId: data.userId,
      designId: data.designId,
      garmentId: data.garmentId,
      measurements: JSON.stringify(data.measurements),
      status: data.status || "placed",
      estimatedDelivery: data.estimatedDelivery || null,
    });
  const id = Number(result[0]?.insertId);
  return findOrderById(id);
}

export async function findOrderById(id: number) {
  const rows = await getDb()
    .select()
    .from(schema.orders)
    .where(eq(schema.orders.id, id))
    .limit(1);
  return rows.at(0);
}

export async function listOrdersByUser(userId: number) {
  return getDb()
    .select()
    .from(schema.orders)
    .where(eq(schema.orders.userId, userId))
    .orderBy(desc(schema.orders.createdAt));
}

export async function listAllOrders(limit = 50, offset = 0) {
  return getDb()
    .select()
    .from(schema.orders)
    .orderBy(desc(schema.orders.createdAt))
    .limit(limit)
    .offset(offset);
}

export async function updateOrderStatus(id: number, status: string) {
  await getDb()
    .update(schema.orders)
    .set({ status })
    .where(eq(schema.orders.id, id));
  return findOrderById(id);
}

export async function countOrders() {
  const result = await getDb()
    .select({ count: sql`count(*)` })
    .from(schema.orders);
  return Number(result[0]?.count || 0);
}

export async function countOrdersByStatus(status: string) {
  const result = await getDb()
    .select({ count: sql`count(*)` })
    .from(schema.orders)
    .where(eq(schema.orders.status, status));
  return Number(result[0]?.count || 0);
}
