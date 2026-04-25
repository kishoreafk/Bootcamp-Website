import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "weaver-secret-key-change-in-production";

export function signToken(payload: { userId: number; phone: string; role: string }) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
}

export function verifyToken(token: string): { userId: number; phone: string; role: string } | null {
  try {
    return jwt.verify(token, JWT_SECRET) as { userId: number; phone: string; role: string };
  } catch {
    return null;
  }
}
