import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { createRouter, publicQuery, authedQuery } from "./middleware.js";
import { createOTP, findValidOTP, markOTPVerified } from "./queries/otps.js";
import { findUserByPhone, createUser, findUserById } from "./queries/users.js";
import { signToken, verifyToken } from "./lib/jwt.js";

export const authRouter = createRouter({
  sendOTP: publicQuery
    .input(z.object({ phone: z.string().min(5).max(20) }))
    .mutation(async ({ input }) => {
      const code = "123456"; // Demo: always 123456
      const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
      await createOTP(input.phone, code, expiresAt);
      return { success: true, message: "Verification code sent" };
    }),

  verifyOTP: publicQuery
    .input(z.object({ phone: z.string().min(5).max(20), code: z.string().length(6) }))
    .mutation(async ({ input }) => {
      const otp = await findValidOTP(input.phone, input.code);
      if (!otp) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Invalid or expired verification code",
        });
      }

      await markOTPVerified(otp.id);

      let user = await findUserByPhone(input.phone);
      let isNewUser = false;

      if (!user) {
        await createUser({ phone: input.phone });
        user = await findUserByPhone(input.phone);
        isNewUser = true;
      }

      if (!user) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create user",
        });
      }

      const token = signToken({
        userId: user.id,
        phone: user.phone,
        role: user.role,
      });

      return {
        success: true,
        token,
        user,
        isNewUser,
      };
    }),

  me: publicQuery.query(async ({ ctx }) => {
    const authHeader = ctx.req.headers.get("x-auth-token");
    if (!authHeader) return null;

    const payload = verifyToken(authHeader);
    if (!payload) return null;

    const user = await findUserById(payload.userId);
    return user || null;
  }),

  logout: authedQuery.mutation(() => {
    return { success: true };
  }),
});
