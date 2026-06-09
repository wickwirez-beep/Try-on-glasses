import { describe, it, expect } from "vitest";
import {
  searchEyewearInventory,
  getEyewearProduct,
  getTrendingEyewear,
  getEyewearByStyle,
  getAllBrands,
  getAllStyles,
  getRecommendationsForFaceShape,
} from "./eyewear-inventory";

describe("Eyewear Inventory Functions", () => {
  it("should search eyewear by query", async () => {
    const results = await searchEyewearInventory("Ray-Ban");
    expect(results.length).toBeGreaterThan(0);
    expect(results[0].brand).toBe("Ray-Ban");
  });

  it("should filter eyewear by style", async () => {
    const results = await searchEyewearInventory("", { style: "Aviator" });
    expect(results.length).toBeGreaterThan(0);
    expect(results.every((p) => p.style === "Aviator")).toBe(true);
  });

  it("should filter eyewear by price range", async () => {
    const results = await searchEyewearInventory("", { minPrice: 100, maxPrice: 200 });
    expect(results.every((p) => p.price >= 100 && p.price <= 200)).toBe(true);
  });

  it("should get product by ID", async () => {
    const product = await getEyewearProduct("ray-ban-001");
    expect(product).not.toBeNull();
    expect(product?.brand).toBe("Ray-Ban");
  });

  it("should return null for non-existent product", async () => {
    const product = await getEyewearProduct("non-existent-id");
    expect(product).toBeNull();
  });

  it("should get trending eyewear", async () => {
    const trending = await getTrendingEyewear(3);
    expect(trending.length).toBeLessThanOrEqual(3);
    expect(trending.length).toBeGreaterThan(0);
    // Should be sorted by rating
    for (let i = 0; i < trending.length - 1; i++) {
      expect(trending[i].rating).toBeGreaterThanOrEqual(trending[i + 1].rating);
    }
  });

  it("should get eyewear by style", async () => {
    const results = await getEyewearByStyle("Round");
    expect(results.length).toBeGreaterThan(0);
    expect(results.every((p) => p.style === "Round")).toBe(true);
  });

  it("should get all brands", async () => {
    const brands = await getAllBrands();
    expect(brands.length).toBeGreaterThan(0);
    expect(brands).toContain("Ray-Ban");
  });

  it("should get all styles", async () => {
    const styles = await getAllStyles();
    expect(styles.length).toBeGreaterThan(0);
    expect(styles).toContain("Aviator");
  });

  it("should get recommendations for oval face shape", async () => {
    const recommendations = await getRecommendationsForFaceShape("OVAL", 3);
    expect(recommendations.length).toBeGreaterThan(0);
    expect(recommendations[0].style).toMatch(/Aviator|Cat-Eye|Round/);
  });

  it("should get recommendations for round face shape", async () => {
    const recommendations = await getRecommendationsForFaceShape("ROUND", 3);
    expect(recommendations.length).toBeGreaterThan(0);
    expect(recommendations[0].style).toMatch(/Square|Aviator|Wayfarer/);
  });

  it("should return empty array for unknown face shape", async () => {
    const recommendations = await getRecommendationsForFaceShape("UNKNOWN", 3);
    expect(recommendations.length).toBe(0);
  });

  it("should filter in-stock only", async () => {
    const results = await searchEyewearInventory("", { inStockOnly: true });
    expect(results.every((p) => p.inStock)).toBe(true);
  });

  it("should return empty array for impossible price range", async () => {
    const results = await searchEyewearInventory("", { minPrice: 10000, maxPrice: 20000 });
    expect(results.length).toBe(0);
  });
});
