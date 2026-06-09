/**
 * Social Media Sharing Module
 * Enables users to share try-on results on Instagram, TikTok, Facebook, etc.
 */

import { z } from "zod";

export interface ShareableResult {
  id: string;
  userId: number;
  imageUrl: string;
  frameId: number;
  frameName: string;
  faceShape: string;
  createdAt: Date;
  shareUrl: string;
}

export interface SocialShareConfig {
  platform: "instagram" | "tiktok" | "facebook" | "twitter" | "pinterest";
  caption: string;
  hashtags: string[];
  imageUrl: string;
  shareUrl?: string;
}

/**
 * Generate shareable link for try-on result
 */
export async function generateShareableLink(
  userId: number,
  imageUrl: string,
  frameId: number,
  frameName: string,
  faceShape: string
): Promise<ShareableResult> {
  const shareId = `share_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  const shareUrl = `https://the-look.app/shared/${shareId}`;

  return {
    id: shareId,
    userId,
    imageUrl,
    frameId,
    frameName,
    faceShape,
    createdAt: new Date(),
    shareUrl,
  };
}

/**
 * Get Instagram share config
 */
export function getInstagramShareConfig(result: ShareableResult): SocialShareConfig {
  return {
    platform: "instagram",
    caption: `I found my perfect look! 👓✨\n\nFrame: ${result.frameName}\nFace Shape: ${result.faceShape}\n\nTry it yourself on The Look! 🔗`,
    hashtags: ["#TheGlassesLook", "#VirtualTryOn", "#GlassesStyle", "#FaceShape", "#EyewearFashion"],
    imageUrl: result.imageUrl,
    shareUrl: `https://www.instagram.com/`,
  };
}

/**
 * Get TikTok share config
 */
export function getTikTokShareConfig(result: ShareableResult): SocialShareConfig {
  return {
    platform: "tiktok",
    caption: `Found my perfect glasses! 👓 Try The Look app to find yours! #VirtualTryOn #GlassesStyle #FaceShape #EyewearFashion`,
    hashtags: ["#TheGlassesLook", "#VirtualTryOn", "#GlassesStyle", "#FaceShape"],
    imageUrl: result.imageUrl,
    shareUrl: `https://www.tiktok.com/`,
  };
}

/**
 * Get Facebook share config
 */
export function getFacebookShareConfig(result: ShareableResult): SocialShareConfig {
  return {
    platform: "facebook",
    caption: `I just found my perfect glasses using The Look virtual try-on app! 👓\n\nFrame: ${result.frameName}\nFace Shape: ${result.faceShape}\n\nTry it yourself and find your perfect look!`,
    hashtags: ["#TheGlassesLook", "#VirtualTryOn", "#GlassesStyle"],
    imageUrl: result.imageUrl,
    shareUrl: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(result.shareUrl)}`,
  };
}

/**
 * Get Twitter share config
 */
export function getTwitterShareConfig(result: ShareableResult): SocialShareConfig {
  return {
    platform: "twitter",
    caption: `Just found my perfect glasses with The Look! 👓 ${result.frameName} for my ${result.faceShape} face shape. Try it yourself! 🔗`,
    hashtags: ["#TheGlassesLook", "#VirtualTryOn", "#GlassesStyle"],
    imageUrl: result.imageUrl,
    shareUrl: `https://twitter.com/intent/tweet?text=${encodeURIComponent(`I found my perfect glasses with The Look! Try it: ${result.shareUrl}`)}`,
  };
}

/**
 * Get Pinterest share config
 */
export function getPinterestShareConfig(result: ShareableResult): SocialShareConfig {
  const caption = `${result.frameName} - Perfect for ${result.faceShape} face shape! Try The Look virtual try-on app to find your perfect glasses.`;
  return {
    platform: "pinterest",
    caption,
    hashtags: ["#TheGlassesLook", "#VirtualTryOn", "#GlassesStyle", "#EyewearFashion"],
    imageUrl: result.imageUrl,
    shareUrl: `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(result.shareUrl)}&media=${encodeURIComponent(result.imageUrl)}&description=${encodeURIComponent(caption)}`,
  };
}

/**
 * Get share config for any platform
 */
export function getShareConfig(platform: string, result: ShareableResult): SocialShareConfig | null {
  switch (platform.toLowerCase()) {
    case "instagram":
      return getInstagramShareConfig(result);
    case "tiktok":
      return getTikTokShareConfig(result);
    case "facebook":
      return getFacebookShareConfig(result);
    case "twitter":
      return getTwitterShareConfig(result);
    case "pinterest":
      return getPinterestShareConfig(result);
    default:
      return null;
  }
}

/**
 * Generate social media preview image
 */
export async function generateSocialPreview(
  imageUrl: string,
  frameName: string,
  faceShape: string
): Promise<{ success: boolean; previewUrl?: string; error?: string }> {
  try {
    // In production, use image processing service to add branding
    const previewUrl = `${imageUrl}?brand=the-look&frame=${encodeURIComponent(frameName)}&shape=${faceShape}`;

    return {
      success: true,
      previewUrl,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Track social share
 */
export async function trackSocialShare(
  userId: number,
  platform: string,
  shareId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    console.log(`User ${userId} shared on ${platform}: ${shareId}`);
    // In production, save to analytics database
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Get social share statistics
 */
export async function getSocialShareStats(shareId: string): Promise<{
  totalShares: number;
  sharesByPlatform: Record<string, number>;
  clicks: number;
}> {
  // Mock implementation - in production, query analytics database
  return {
    totalShares: 42,
    sharesByPlatform: {
      instagram: 18,
      tiktok: 15,
      facebook: 7,
      twitter: 2,
    },
    clicks: 156,
  };
}

/**
 * Generate referral link for shared result
 */
export async function generateReferralLink(
  shareId: string,
  userId: number
): Promise<{ referralUrl: string; referralCode: string }> {
  const referralCode = `ref_${userId}_${shareId.substring(0, 8)}`;
  const referralUrl = `https://the-look.app?ref=${referralCode}`;

  return {
    referralUrl,
    referralCode,
  };
}

/**
 * Get all available platforms
 */
export function getAvailablePlatforms(): Array<{
  id: string;
  name: string;
  icon: string;
  color: string;
}> {
  return [
    { id: "instagram", name: "Instagram", icon: "📷", color: "#E4405F" },
    { id: "tiktok", name: "TikTok", icon: "🎵", color: "#000000" },
    { id: "facebook", name: "Facebook", icon: "f", color: "#1877F2" },
    { id: "twitter", name: "Twitter", icon: "𝕏", color: "#000000" },
    { id: "pinterest", name: "Pinterest", icon: "📌", color: "#E60023" },
  ];
}

/**
 * Generate embed code for website
 */
export function generateEmbedCode(shareId: string): string {
  return `<iframe src="https://the-look.app/embed/${shareId}" width="400" height="600" frameborder="0" allowfullscreen></iframe>`;
}
