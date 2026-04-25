import { eq, gt, and, desc } from "drizzle-orm";
import * as schema from "../../db/schema.js";
import { env } from "../lib/env.js";
import { getDb } from "./connection.js";
import {
  createDemoOTP,
  findValidDemoOTP,
  markDemoOTPVerified,
} from "./demo-store.js";

export async function createOTP(phone: string, code: string, expiresAt: Date) {
  if (env.isDemoMode) {
    return createDemoOTP(phone, code, expiresAt);
  }

  const result = await getDb()
    .insert(schema.otps)
    .values({
      phone,
      code,
      expiresAt,
      verified: 0,
    });
  return result;
}

export async function findValidOTP(phone: string, code: string) {
  if (env.isDemoMode) {
    return findValidDemoOTP(phone, code);
  }

  const now = new Date();
  const rows = await getDb()
    .select()
    .from(schema.otps)
    .where(
      and(
        eq(schema.otps.phone, phone),
        eq(schema.otps.code, code),
        eq(schema.otps.verified, 0),
        gt(schema.otps.expiresAt, now)
      )
    )
    .orderBy(desc(schema.otps.createdAt))
    .limit(1);
  return rows[0];
}

export async function markOTPVerified(id: number) {
  if (env.isDemoMode) {
    await markDemoOTPVerified(id);
    return;
  }

  await getDb()
    .update(schema.otps)
    .set({ verified: 1 })
    .where(eq(schema.otps.id, id));
}
