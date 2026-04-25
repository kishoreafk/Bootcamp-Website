import { eq, desc, and } from "drizzle-orm";
import * as schema from "@db/schema";
import { getDb } from "./connection";

export async function createGarment(data: {
  userId: number;
  name: string;
  originalPurpose: string | null;
  emotionalValue: string | null;
  images: string | null;
}) {
  const result = await getDb()
    .insert(schema.garments)
    .values(data);
  const id = Number(result[0]?.insertId);
  return findGarmentById(id);
}

export async function findGarmentById(id: number) {
  const rows = await getDb()
    .select()
    .from(schema.garments)
    .where(eq(schema.garments.id, id))
    .limit(1);
  return rows.at(0);
}

export async function listGarmentsByUser(userId: number) {
  return getDb()
    .select()
    .from(schema.garments)
    .where(eq(schema.garments.userId, userId))
    .orderBy(desc(schema.garments.createdAt));
}

export async function deleteGarment(id: number, userId: number) {
  await getDb()
    .delete(schema.garments)
    .where(and(eq(schema.garments.id, id), eq(schema.garments.userId, userId)));
}

export async function updateGarmentImages(id: number, images: string[]) {
  await getDb()
    .update(schema.garments)
    .set({ images: JSON.stringify(images) })
    .where(eq(schema.garments.id, id));
}
