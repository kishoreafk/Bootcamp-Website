import { eq, desc, and } from "drizzle-orm";
import * as schema from "../../db/schema.js";
import { env } from "../lib/env.js";
import { getDb } from "./connection.js";
import {
  createDemoGarment,
  deleteDemoGarment,
  findDemoGarmentById,
  listDemoGarmentsByUser,
  updateDemoGarmentImages,
} from "./demo-store.js";

export async function createGarment(data: {
  userId: number;
  name: string;
  originalPurpose: string | null;
  emotionalValue: string | null;
  images: string | null;
}) {
  if (env.isDemoMode) {
    return createDemoGarment(data);
  }

  const result = await getDb()
    .insert(schema.garments)
    .values(data);
  const id = Number(result[0]?.insertId);
  return findGarmentById(id);
}

export async function findGarmentById(id: number) {
  if (env.isDemoMode) {
    return findDemoGarmentById(id);
  }

  const rows = await getDb()
    .select()
    .from(schema.garments)
    .where(eq(schema.garments.id, id))
    .limit(1);
  return rows[0];
}

export async function listGarmentsByUser(userId: number) {
  if (env.isDemoMode) {
    return listDemoGarmentsByUser(userId);
  }

  return getDb()
    .select()
    .from(schema.garments)
    .where(eq(schema.garments.userId, userId))
    .orderBy(desc(schema.garments.createdAt));
}

export async function deleteGarment(id: number, userId: number) {
  if (env.isDemoMode) {
    await deleteDemoGarment(id, userId);
    return;
  }

  await getDb()
    .delete(schema.garments)
    .where(and(eq(schema.garments.id, id), eq(schema.garments.userId, userId)));
}

export async function updateGarmentImages(id: number, images: string[]) {
  if (env.isDemoMode) {
    await updateDemoGarmentImages(id, images);
    return;
  }

  await getDb()
    .update(schema.garments)
    .set({ images: JSON.stringify(images) })
    .where(eq(schema.garments.id, id));
}
