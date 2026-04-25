import { eq, desc, and } from "drizzle-orm";
import * as schema from "../../db/schema.js";
import { getDb } from "./connection.js";

export async function createDesign(data: {
  garmentId: number;
  userId: number;
  name: string;
  description?: string;
  imageUrl: string;
  tags?: string[];
}) {
  const result = await getDb()
    .insert(schema.designs)
    .values({
      garmentId: data.garmentId,
      userId: data.userId,
      name: data.name,
      description: data.description || null,
      imageUrl: data.imageUrl,
      tags: data.tags ? JSON.stringify(data.tags) : null,
    });
  const id = Number(result[0]?.insertId);
  return findDesignById(id);
}

export async function findDesignById(id: number) {
  const rows = await getDb()
    .select()
    .from(schema.designs)
    .where(eq(schema.designs.id, id))
    .limit(1);
  return rows.at(0);
}

export async function listDesignsByUser(userId: number) {
  return getDb()
    .select()
    .from(schema.designs)
    .where(eq(schema.designs.userId, userId))
    .orderBy(desc(schema.designs.createdAt));
}

export async function listDesignsByGarment(garmentId: number, userId: number) {
  return getDb()
    .select()
    .from(schema.designs)
    .where(and(eq(schema.designs.garmentId, garmentId), eq(schema.designs.userId, userId)))
    .orderBy(desc(schema.designs.createdAt));
}

export async function selectDesign(designId: number, userId: number) {
  // First deselect all for this user
  await getDb()
    .update(schema.designs)
    .set({ isSelected: 0 })
    .where(eq(schema.designs.userId, userId));

  // Then select the target
  await getDb()
    .update(schema.designs)
    .set({ isSelected: 1 })
    .where(and(eq(schema.designs.id, designId), eq(schema.designs.userId, userId)));

  return findDesignById(designId);
}

export async function getSelectedDesign(userId: number) {
  const rows = await getDb()
    .select()
    .from(schema.designs)
    .where(and(eq(schema.designs.userId, userId), eq(schema.designs.isSelected, 1)))
    .limit(1);
  return rows.at(0);
}

export async function listAllDesigns(limit = 50, offset = 0) {
  return getDb()
    .select()
    .from(schema.designs)
    .orderBy(desc(schema.designs.createdAt))
    .limit(limit)
    .offset(offset);
}
