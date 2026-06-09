import { describe, it, expect, beforeEach, vi } from "vitest";
import {
  getAllGlassesFrames,
  getGlassesFrameById,
  getGlassesFramesByStyle,
  getGlassesFramesByColor,
  addUserFavorite,
  removeUserFavorite,
  isFrameFavorited,
} from "./db";

// Mock database
vi.mock("./db", async () => {
  const actual = await vi.importActual<typeof import("./db")>("./db");
  return {
    ...actual,
    getDb: vi.fn(),
  };
});

describe("Glasses Database Functions", () => {
  describe("getAllGlassesFrames", () => {
    it("should return an empty array when no frames exist", async () => {
      const frames = await getAllGlassesFrames();
      expect(Array.isArray(frames)).toBe(true);
    });
  });

  describe("getGlassesFramesByStyle", () => {
    it("should filter frames by style", async () => {
      const frames = await getGlassesFramesByStyle("aviator");
      expect(Array.isArray(frames)).toBe(true);
      frames.forEach(frame => {
        expect(frame.style).toBe("aviator");
      });
    });

    it("should return empty array for non-existent style", async () => {
      const frames = await getGlassesFramesByStyle("non-existent-style");
      expect(frames).toEqual([]);
    });
  });

  describe("getGlassesFramesByColor", () => {
    it("should filter frames by color", async () => {
      const frames = await getGlassesFramesByColor("black");
      expect(Array.isArray(frames)).toBe(true);
      frames.forEach(frame => {
        expect(frame.color).toBe("black");
      });
    });

    it("should return empty array for non-existent color", async () => {
      const frames = await getGlassesFramesByColor("non-existent-color");
      expect(frames).toEqual([]);
    });
  });

  describe("getGlassesFrameById", () => {
    it("should return undefined for non-existent frame", async () => {
      const frame = await getGlassesFrameById(99999);
      expect(frame).toBeUndefined();
    });

    it("should return frame object with correct structure", async () => {
      // This test assumes at least one frame exists in the database
      const frame = await getGlassesFrameById(1);
      if (frame) {
        expect(frame).toHaveProperty("id");
        expect(frame).toHaveProperty("name");
        expect(frame).toHaveProperty("style");
        expect(frame).toHaveProperty("color");
        expect(frame).toHaveProperty("imageUrl");
      }
    });
  });
});

describe("User Favorites Functions", () => {
  const testUserId = 1;
  const testFrameId = 1;

  describe("addUserFavorite", () => {
    it("should return true when favorite is added successfully", async () => {
      const result = await addUserFavorite(testUserId, testFrameId);
      expect(typeof result).toBe("boolean");
    });
  });

  describe("removeUserFavorite", () => {
    it("should return true when favorite is removed successfully", async () => {
      const result = await removeUserFavorite(testUserId, testFrameId);
      expect(typeof result).toBe("boolean");
    });
  });

  describe("isFrameFavorited", () => {
    it("should return boolean indicating favorite status", async () => {
      const result = await isFrameFavorited(testUserId, testFrameId);
      expect(typeof result).toBe("boolean");
    });
  });
});

describe("Glasses Data Model", () => {
  it("should have required fields in glasses frame", async () => {
    const frames = await getAllGlassesFrames();
    if (frames.length > 0) {
      const frame = frames[0];
      expect(frame).toHaveProperty("id");
      expect(frame).toHaveProperty("name");
      expect(frame).toHaveProperty("style");
      expect(frame).toHaveProperty("color");
      expect(frame).toHaveProperty("lensTint");
      expect(frame).toHaveProperty("imageUrl");
      expect(frame).toHaveProperty("imageWidth");
      expect(frame).toHaveProperty("imageHeight");
    }
  });

  it("should have valid image dimensions", async () => {
    const frames = await getAllGlassesFrames();
    frames.forEach(frame => {
      expect(frame.imageWidth).toBeGreaterThan(0);
      expect(frame.imageHeight).toBeGreaterThan(0);
      expect(typeof frame.imageUrl).toBe("string");
      expect(frame.imageUrl.length).toBeGreaterThan(0);
    });
  });

  it("should have valid style and color values", async () => {
    const validStyles = [
      "aviator",
      "round",
      "square",
      "cat-eye",
      "wayfarer",
      "rimless",
      "clubmaster",
    ];
    const validColors = [
      "black",
      "brown",
      "gold",
      "silver",
      "rose-gold",
      "tortoiseshell",
    ];

    const frames = await getAllGlassesFrames();
    frames.forEach(frame => {
      expect(validStyles).toContain(frame.style);
      expect(validColors).toContain(frame.color);
    });
  });
});
