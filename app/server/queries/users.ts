import { eq, desc, sql } from "drizzle-orm";
import * as schema from "@db/schema";
import type { InsertUser } from "@db/schema";
import { getDb } from "./connection";

export async function findUserByPhone(phone: string) {
  const rows = await getDb()
    .select()
    .from(schema.users)
    .where(eq(schema.users.phone, phone))
    .limit(1);
  return rows.at(0);
}

export async function findUserById(id: number) {
  const rows = await getDb()
    .select()
    .from(schema.users)
    .where(eq(schema.users.id, id))
    .limit(1);
  return rows.at(0);
}

export async function createUser(data: { phone: string; name?: string; role?: string }) {
  const result = await getDb()
    .insert(schema.users)
    .values({
      phone: data.phone,
      name: data.name || null,
      role: (data.role as "user" | "admin") || "user",
    });
  return result;
}

export async function updateUser(id: number, data: Partial<InsertUser>) {
  await getDb()
    .update(schema.users)
    .set(data)
    .where(eq(schema.users.id, id));
}

export async function listUsers(limit = 50, offset = 0) {
  return getDb()
    .select()
    .from(schema.users)
    .orderBy(desc(schema.users.createdAt))
    .limit(limit)
    .offset(offset);
}

export async function countUsers() {
  const result = await getDb()
    .select({ count: sql`count(*)` })
    .from(schema.users);
  return Number(result[0]?.count || 0);
}

// Legacy compatibility stubs for framework
export async function findUserByUnionId(_unionId: string) {
  const users = await listUsers(1, 0);
  return users[0] || null;
}

export async function upsertUser(data: Record<string, unknown>) {
  const cleanData: Record<string, unknown> = {};
  const validKeys = ["id", "phone", "name", "stylePreference", "preferredFit", "sustainabilityPriority", "role", "createdAt", "updatedAt"];
  for (const key of Object.keys(data)) {
    if (validKeys.includes(key)) {
      cleanData[key] = data[key];
    }
  }
  if (cleanData.phone) {
    const existing = await findUserByPhone(cleanData.phone as string);
    if (existing) {
      await updateUser(existing.id, cleanData as Partial<InsertUser>);
      return;
    }
  }
  await getDb().insert(schema.users).values(cleanData as InsertUser);
}
