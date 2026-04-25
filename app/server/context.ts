import type { FetchCreateContextFnOptions } from "@trpc/server/adapters/fetch";
import type { User } from "@db/schema";
import { verifyToken } from "./lib/jwt";
import { findUserById } from "./queries/users";

export type TrpcContext = {
  req: Request;
  resHeaders: Headers;
  user?: User;
};

export async function createContext(
  opts: FetchCreateContextFnOptions,
): Promise<TrpcContext> {
  const ctx: TrpcContext = { req: opts.req, resHeaders: opts.resHeaders };
  try {
    const authHeader = opts.req.headers.get("x-auth-token");
    const cookieHeader = opts.req.headers.get("cookie");
    let token = authHeader;

    if (!token && cookieHeader) {
      const match = cookieHeader.match(/auth-token=([^;]+)/);
      if (match) token = match[1];
    }

    if (token) {
      const payload = await verifyToken(token);
      if (payload && payload.userId) {
        const user = await findUserById(payload.userId);
        if (user) {
          ctx.user = user;
        }
      }
    }
  } catch {
    // Authentication is optional here
  }
  return ctx;
}
