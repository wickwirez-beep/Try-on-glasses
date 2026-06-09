import { and, eq, inArray } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, glassesFrames, userFavorites, tryOnSessions, InsertTryOnSession } from "../drizzle/schema";
import { ENV } from "./_core/env";

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

export async function getAllGlassesFrames() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(glassesFrames);
}

export async function getGlassesFrameById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(glassesFrames).where(eq(glassesFrames.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getGlassesFramesByStyle(style: string) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(glassesFrames).where(eq(glassesFrames.style, style));
}

export async function getGlassesFramesByColor(color: string) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(glassesFrames).where(eq(glassesFrames.color, color));
}

export async function getUserFavorites(userId: number) {
  const db = await getDb();
  if (!db) return [];
  const favorites = await db.select().from(userFavorites).where(eq(userFavorites.userId, userId));
  const frameIds = favorites.map(f => f.frameId);
  if (frameIds.length === 0) return [];
  return db.select().from(glassesFrames).where(inArray(glassesFrames.id, frameIds));
}

export async function addUserFavorite(userId: number, frameId: number) {
  const db = await getDb();
  if (!db) return false;
  try {
    await db.insert(userFavorites).values({ userId, frameId });
    return true;
  } catch (error) {
    console.error("Failed to add favorite:", error);
    return false;
  }
}

export async function removeUserFavorite(userId: number, frameId: number) {
  const db = await getDb();
  if (!db) return false;
  try {
    await db.delete(userFavorites).where(
      and(eq(userFavorites.userId, userId), eq(userFavorites.frameId, frameId))
    );
    return true;
  } catch (error) {
    console.error("Failed to remove favorite:", error);
    return false;
  }
}

export async function isFrameFavorited(userId: number, frameId: number) {
  const db = await getDb();
  if (!db) return false;
  const result = await db.select().from(userFavorites).where(
    and(eq(userFavorites.userId, userId), eq(userFavorites.frameId, frameId))
  ).limit(1);
  return result.length > 0;
}

export async function createTryOnSession(userId: number, uploadedImageUrl: string) {
  const db = await getDb();
  if (!db) return undefined;
  try {
    const result = await db.insert(tryOnSessions).values({
      userId,
      uploadedImageUrl,
    });
    return result;
  } catch (error) {
    console.error("Failed to create try-on session:", error);
    return undefined;
  }
}

export async function updateTryOnSession(sessionId: number, data: Partial<InsertTryOnSession>) {
  const db = await getDb();
  if (!db) return false;
  try {
    await db.update(tryOnSessions).set(data).where(eq(tryOnSessions.id, sessionId));
    return true;
  } catch (error) {
    console.error("Failed to update try-on session:", error);
    return false;
  }
}
