import { int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

export const glassesFrames = mysqlTable("glasses_frames", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  style: varchar("style", { length: 100 }).notNull(), // aviator, round, square, cat-eye, wayfarer, rimless, clubmaster, etc.
  color: varchar("color", { length: 100 }).notNull(), // black, brown, gold, silver, rose-gold, tortoiseshell, etc.
  lensTint: varchar("lensTint", { length: 100 }).notNull(), // clear, light-blue, dark-gray, brown, rose, etc.
  genderTag: varchar("genderTag", { length: 50 }), // unisex, mens, womens, or null
  ageTag: varchar("ageTag", { length: 50 }), // adult, teen, or null
  imageUrl: text("imageUrl").notNull(), // URL to transparent PNG image
  imageWidth: int("imageWidth").notNull(), // pixel width of the glasses image
  imageHeight: int("imageHeight").notNull(), // pixel height of the glasses image
  description: text("description"), // optional description
  recommendedFaceShapes: text("recommendedFaceShapes"), // JSON array of face shapes this frame suits
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type GlassesFrame = typeof glassesFrames.$inferSelect;
export type InsertGlassesFrame = typeof glassesFrames.$inferInsert;

export const userFavorites = mysqlTable("user_favorites", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  frameId: int("frameId").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type UserFavorite = typeof userFavorites.$inferSelect;
export type InsertUserFavorite = typeof userFavorites.$inferInsert;

export const tryOnSessions = mysqlTable("try_on_sessions", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  uploadedImageUrl: text("uploadedImageUrl").notNull(), // URL to user's uploaded photo
  resultImageUrl: text("resultImageUrl"), // URL to final try-on result image
  selectedFrameId: int("selectedFrameId"), // which frame was being tried on
  rotation: int("rotation").default(0), // rotation angle in degrees
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type TryOnSession = typeof tryOnSessions.$inferSelect;
export type InsertTryOnSession = typeof tryOnSessions.$inferInsert;