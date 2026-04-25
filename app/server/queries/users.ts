import { eq, desc, sql } from "drizzle-orm";
import * as schema from "../../db/schema.js";
import type { InsertUser } from "../../db/schema.js";
import { env } from "../lib/env.js";
import { getDb } from "./connection.js";
import {
  countDemoUsers,
  createDemoUser,
  findDemoUserById,
  findDemoUserByPhone,
  listDemoUsers,
  updateDemoUser,
} from "./demo-store.js";

export async function findUserByPhone(phone: string) {
  if (env.isDemoMode) {
    return findDemoUserByPhone(phone);
  }

  const rows = await getDb()
    .select()
    .from(schema.users)
    .where(eq(schema.users.phone, phone))
    .limit(1);
  return rows[0];
}

export async function findUserById(id: number) {
  if (env.isDemoMode) {
    return findDemoUserById(id);
  }

  const rows = await getDb()
    .select()
    .from(schema.users)
    .where(eq(schema.users.id, id))
    .limit(1);
  return rows[0];
}

export async function createUser(data: { phone: string; name?: string; role?: string }) {
  if (env.isDemoMode) {
    return createDemoUser(data);
  }

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
  if (env.isDemoMode) {
    await updateDemoUser(id, data);
    return;
  }

  await getDb()
    .update(schema.users)
    .set(data)
    .where(eq(schema.users.id, id));
}

export async function listUsers(limit = 50, offset = 0) {
  if (env.isDemoMode) {
    return listDemoUsers(limit, offset);
  }

  return getDb()
    .select()
    .from(schema.users)
    .orderBy(desc(schema.users.createdAt))
    .limit(limit)
    .offset(offset);
}

export async function countUsers() {
  if (env.isDemoMode) {
    return countDemoUsers();
  }

  const result = await getDb()
    .select({ count: sql`count(*)` })
    .from(schema.users);
  return Number(result[0]?.count || 0);
}
