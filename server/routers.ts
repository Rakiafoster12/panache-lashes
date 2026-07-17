import { TRPCError } from "@trpc/server";
import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { getGoogleProfile } from "./googlePlaces";
import {
  ConciergeRateLimitError,
  SlidingWindowRateLimiter,
  conciergeInputSchema,
  createConciergeReply,
} from "./panacheConcierge";

const conciergeRateLimiter = new SlidingWindowRateLimiter(12, 10 * 60 * 1000);

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),

  business: router({
    googleProfile: publicProcedure.query(async () => {
      const apiKey = process.env.GOOGLE_PLACES_API_KEY ?? "";
      if (!apiKey) return null;

      try {
        return await getGoogleProfile(apiKey);
      } catch (error) {
        console.error("[Google Places] Business profile unavailable:", error);
        return null;
      }
    }),
  }),

  concierge: router({
    chat: publicProcedure
      .input(conciergeInputSchema)
      .mutation(async ({ ctx, input }) => {
        const ip = ctx.req.ip || ctx.req.socket.remoteAddress || "unknown";
        try {
          conciergeRateLimiter.check(ip);
        } catch (error) {
          if (error instanceof ConciergeRateLimitError) {
            throw new TRPCError({
              code: "TOO_MANY_REQUESTS",
              message: error.message,
            });
          }
          throw error;
        }

        return createConciergeReply(input.messages);
      }),
  }),
});

export type AppRouter = typeof appRouter;
