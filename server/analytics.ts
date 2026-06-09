/**
 * Analytics Tracking Module
 * Tracks user behavior, try-on events, and recommendations
 */

import { z } from "zod";

export interface AnalyticsEvent {
  userId: number;
  eventType: string;
  eventData: Record<string, unknown>;
  timestamp: Date;
  sessionId: string;
  userAgent: string;
  ipAddress?: string;
}

export interface UserBehavior {
  userId: number;
  totalTryOns: number;
  favoriteFrames: number;
  averageSessionDuration: number;
  lastActive: Date;
  preferredStyles: string[];
  preferredColors: string[];
  averagePrice: number;
}

export interface AnalyticsMetrics {
  totalUsers: number;
  totalTryOns: number;
  averageSessionDuration: number;
  conversionRate: number;
  topFrameStyles: Array<{ style: string; count: number }>;
  topBrands: Array<{ brand: string; count: number }>;
  userRetentionRate: number;
}

// In-memory analytics storage (in production, use database)
const analyticsEvents: AnalyticsEvent[] = [];
const userBehaviorMap = new Map<number, UserBehavior>();

/**
 * Track an analytics event
 */
export async function trackEvent(event: AnalyticsEvent): Promise<void> {
  analyticsEvents.push(event);

  // Update user behavior
  const existing = userBehaviorMap.get(event.userId) || {
    userId: event.userId,
    totalTryOns: 0,
    favoriteFrames: 0,
    averageSessionDuration: 0,
    lastActive: new Date(),
    preferredStyles: [],
    preferredColors: [],
    averagePrice: 0,
  };

  if (event.eventType === "try_on_started") {
    existing.totalTryOns++;
  } else if (event.eventType === "frame_favorited") {
    existing.favoriteFrames++;
  }

  existing.lastActive = new Date();
  userBehaviorMap.set(event.userId, existing);
}

/**
 * Get user behavior analytics
 */
export async function getUserBehavior(userId: number): Promise<UserBehavior | null> {
  return userBehaviorMap.get(userId) || null;
}

/**
 * Get all analytics metrics
 */
export async function getAnalyticsMetrics(): Promise<AnalyticsMetrics> {
  const uniqueUsers = new Set(analyticsEvents.map((e) => e.userId)).size;
  const tryOnEvents = analyticsEvents.filter((e) => e.eventType === "try_on_started");

  // Calculate style popularity
  const styleCount = new Map<string, number>();
  analyticsEvents
    .filter((e) => e.eventType === "frame_selected")
    .forEach((e) => {
      const style = (e.eventData.style as string) || "Unknown";
      styleCount.set(style, (styleCount.get(style) || 0) + 1);
    });

  const topFrameStyles = Array.from(styleCount.entries())
    .map(([style, count]) => ({ style, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  // Calculate brand popularity
  const brandCount = new Map<string, number>();
  analyticsEvents
    .filter((e) => e.eventType === "frame_selected")
    .forEach((e) => {
      const brand = (e.eventData.brand as string) || "Unknown";
      brandCount.set(brand, (brandCount.get(brand) || 0) + 1);
    });

  const topBrands = Array.from(brandCount.entries())
    .map(([brand, count]) => ({ brand, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  // Calculate average session duration
  const sessionDurations: number[] = [];
  const sessionMap = new Map<string, number[]>();

  analyticsEvents.forEach((e) => {
    if (!sessionMap.has(e.sessionId)) {
      sessionMap.set(e.sessionId, []);
    }
    sessionMap.get(e.sessionId)!.push(e.timestamp.getTime());
  });

  sessionMap.forEach((times) => {
    if (times.length > 1) {
      const duration = Math.max(...times) - Math.min(...times);
      sessionDurations.push(duration);
    }
  });

  const averageSessionDuration =
    sessionDurations.length > 0
      ? sessionDurations.reduce((a, b) => a + b, 0) / sessionDurations.length / 1000
      : 0;

  // Calculate conversion rate (users who favorited / total users)
  const favoritedUsers = new Set(
    analyticsEvents.filter((e) => e.eventType === "frame_favorited").map((e) => e.userId)
  ).size;

  const conversionRate = uniqueUsers > 0 ? (favoritedUsers / uniqueUsers) * 100 : 0;

  return {
    totalUsers: uniqueUsers,
    totalTryOns: tryOnEvents.length,
    averageSessionDuration,
    conversionRate,
    topFrameStyles,
    topBrands,
    userRetentionRate: 0.65, // Mock value
  };
}

/**
 * Track try-on event
 */
export async function trackTryOn(userId: number, frameId: number, sessionId: string): Promise<void> {
  await trackEvent({
    userId,
    eventType: "try_on_started",
    eventData: { frameId },
    timestamp: new Date(),
    sessionId,
    userAgent: "browser",
  });
}

/**
 * Track frame selection
 */
export async function trackFrameSelection(
  userId: number,
  frameId: number,
  style: string,
  brand: string,
  sessionId: string
): Promise<void> {
  await trackEvent({
    userId,
    eventType: "frame_selected",
    eventData: { frameId, style, brand },
    timestamp: new Date(),
    sessionId,
    userAgent: "browser",
  });
}

/**
 * Track frame favorited
 */
export async function trackFrameFavorited(
  userId: number,
  frameId: number,
  sessionId: string
): Promise<void> {
  await trackEvent({
    userId,
    eventType: "frame_favorited",
    eventData: { frameId },
    timestamp: new Date(),
    sessionId,
    userAgent: "browser",
  });
}

/**
 * Track download
 */
export async function trackDownload(userId: number, frameId: number, sessionId: string): Promise<void> {
  await trackEvent({
    userId,
    eventType: "result_downloaded",
    eventData: { frameId },
    timestamp: new Date(),
    sessionId,
    userAgent: "browser",
  });
}

/**
 * Get user preferences based on behavior
 */
export async function getUserPreferences(userId: number): Promise<{
  preferredStyles: string[];
  preferredColors: string[];
  averagePrice: number;
} | null> {
  const behavior = await getUserBehavior(userId);
  if (!behavior) return null;

  return {
    preferredStyles: behavior.preferredStyles,
    preferredColors: behavior.preferredColors,
    averagePrice: behavior.averagePrice,
  };
}

/**
 * Get recommended frames based on user behavior
 */
export async function getRecommendedFrames(userId: number): Promise<string[]> {
  const behavior = await getUserBehavior(userId);
  if (!behavior || behavior.preferredStyles.length === 0) {
    return ["Aviator", "Round", "Wayfarer"];
  }

  return behavior.preferredStyles.slice(0, 3);
}
