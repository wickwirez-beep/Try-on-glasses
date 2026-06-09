import { z } from "zod";
import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import {
  getAllGlassesFrames,
  getGlassesFrameById,
  getUserFavorites,
  addUserFavorite,
  removeUserFavorite,
  isFrameFavorited,
  createTryOnSession,
  updateTryOnSession,
} from "./db";
import {
  searchEyewearInventory,
  getEyewearProduct,
  getTrendingEyewear,
  getEyewearByStyle,
  getAllBrands,
  getAllStyles,
  getRecommendationsForFaceShape,
} from "./eyewear-inventory";

export const appRouter = router({
  system: systemRouter,

  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  glasses: router({
    list: publicProcedure
      .input(z.object({
        style: z.string().optional(),
        color: z.string().optional(),
      }))
      .query(async ({ input }) => {
        let frames = await getAllGlassesFrames();

        if (input.style) {
          frames = frames.filter(f => f.style === input.style);
        }
        if (input.color) {
          frames = frames.filter(f => f.color === input.color);
        }

        return frames;
      }),

    getById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return getGlassesFrameById(input.id);
      }),

    getStyles: publicProcedure.query(async () => {
      const frames = await getAllGlassesFrames();
      const stylesSet = new Set(frames.map(f => f.style));
      const styles = Array.from(stylesSet);
      return styles.sort();
    }),

    getColors: publicProcedure.query(async () => {
      const frames = await getAllGlassesFrames();
      const colorsSet = new Set(frames.map(f => f.color));
      const colors = Array.from(colorsSet);
      return colors.sort();
    }),
  }),

  favorites: router({
    list: protectedProcedure.query(async ({ ctx }) => {
      return getUserFavorites(ctx.user.id);
    }),

    add: protectedProcedure
      .input(z.object({ frameId: z.number() }))
      .mutation(async ({ ctx, input }) => {
        return addUserFavorite(ctx.user.id, input.frameId);
      }),

    remove: protectedProcedure
      .input(z.object({ frameId: z.number() }))
      .mutation(async ({ ctx, input }) => {
        return removeUserFavorite(ctx.user.id, input.frameId);
      }),

    isFavorited: protectedProcedure
      .input(z.object({ frameId: z.number() }))
      .query(async ({ ctx, input }) => {
        return isFrameFavorited(ctx.user.id, input.frameId);
      }),

    checkMultiple: protectedProcedure
      .input(z.object({ frameIds: z.array(z.number()) }))
      .query(async ({ ctx, input }) => {
        const results: Record<number, boolean> = {};
        for (const frameId of input.frameIds) {
          results[frameId] = await isFrameFavorited(ctx.user.id, frameId);
        }
        return results;
      }),
  }),

  tryOn: router({
    createSession: protectedProcedure
      .input(z.object({ uploadedImageUrl: z.string() }))
      .mutation(async ({ ctx, input }) => {
        return createTryOnSession(ctx.user.id, input.uploadedImageUrl);
      }),

    updateSession: protectedProcedure
      .input(z.object({
        sessionId: z.number(),
        resultImageUrl: z.string().optional(),
        selectedFrameId: z.number().optional(),
        rotation: z.number().optional(),
      }))
      .mutation(async ({ input }) => {
        return updateTryOnSession(input.sessionId, {
          resultImageUrl: input.resultImageUrl,
          selectedFrameId: input.selectedFrameId,
          rotation: input.rotation,
        });
      }),
  }),

  eyewear: router({
    search: publicProcedure
      .input(z.object({
        query: z.string().optional(),
        style: z.string().optional(),
        brand: z.string().optional(),
        maxPrice: z.number().optional(),
        minPrice: z.number().optional(),
        inStockOnly: z.boolean().optional(),
      }))
      .query(async ({ input }) => {
        return searchEyewearInventory(input.query || "", {
          style: input.style,
          brand: input.brand,
          maxPrice: input.maxPrice,
          minPrice: input.minPrice,
          inStockOnly: input.inStockOnly,
        });
      }),

    getById: publicProcedure
      .input(z.string())
      .query(async ({ input }) => {
        return getEyewearProduct(input);
      }),

    trending: publicProcedure
      .input(z.object({ limit: z.number().default(5) }))
      .query(async ({ input }) => {
        return getTrendingEyewear(input.limit);
      }),

    byStyle: publicProcedure
      .input(z.string())
      .query(async ({ input }) => {
        return getEyewearByStyle(input);
      }),

    brands: publicProcedure.query(async () => {
      return getAllBrands();
    }),

    styles: publicProcedure.query(async () => {
      return getAllStyles();
    }),

    recommendations: publicProcedure
      .input(z.object({
        faceShape: z.string(),
        limit: z.number().default(5),
      }))
      .query(async ({ input }) => {
        return getRecommendationsForFaceShape(input.faceShape, input.limit);
      }),
  }),
});

export type AppRouter = typeof appRouter;
