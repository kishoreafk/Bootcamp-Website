import jwt from "jsonwebtoken";
import { env } from "./env.js";

type AuthTokenPayload = {
  userId: number;
  phone: string;
  role: string;
};

export function signToken(payload: AuthTokenPayload) {
  return jwt.sign(payload, env.jwtSecret, { expiresIn: "7d" });
}

export function verifyToken(token: string): AuthTokenPayload | null {
  try {
    return jwt.verify(token, env.jwtSecret) as AuthTokenPayload;
  } catch {
    return null;
  }
}
