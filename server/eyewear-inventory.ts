/**
 * Eyewear Inventory Integration
 * Integrates with real eyewear brand APIs and databases
 */

import { z } from "zod";

// Eyewear product schema
export const EyewearProductSchema = z.object({
  id: z.string(),
  brand: z.string(),
  model: z.string(),
  style: z.string(),
  color: z.string(),
  price: z.number().positive(),
  currency: z.string().default("USD"),
  imageUrl: z.string().url(),
  description: z.string(),
  material: z.string(),
  lensType: z.string(),
  frameWidth: z.number(),
  bridgeWidth: z.number(),
  armLength: z.number(),
  inStock: z.boolean(),
  rating: z.number().min(0).max(5),
  reviewCount: z.number().nonnegative(),
  purchaseUrl: z.string().url(),
  tags: z.array(z.string()),
});

export type EyewearProduct = z.infer<typeof EyewearProductSchema>;

// Mock eyewear inventory - in production, connect to real APIs
const MOCK_EYEWEAR_INVENTORY: EyewearProduct[] = [
  {
    id: "ray-ban-001",
    brand: "Ray-Ban",
    model: "Aviator Classic",
    style: "Aviator",
    color: "Gold",
    price: 154.95,
    currency: "USD",
    imageUrl: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500",
    description: "Classic aviator style with timeless appeal",
    material: "Metal",
    lensType: "Glass",
    frameWidth: 140,
    bridgeWidth: 23,
    armLength: 150,
    inStock: true,
    rating: 4.8,
    reviewCount: 2341,
    purchaseUrl: "https://www.ray-ban.com/usa/products/RB3025",
    tags: ["aviator", "classic", "metal", "gold"],
  },
  {
    id: "warby-parker-001",
    brand: "Warby Parker",
    model: "Percey",
    style: "Round",
    color: "Jet Black",
    price: 95.0,
    currency: "USD",
    imageUrl: "https://images.unsplash.com/photo-1591076482161-42ce6da69f67?w=500",
    description: "Modern round frame with minimalist design",
    material: "Acetate",
    lensType: "Polycarbonate",
    frameWidth: 135,
    bridgeWidth: 21,
    armLength: 145,
    inStock: true,
    rating: 4.6,
    reviewCount: 1852,
    purchaseUrl: "https://www.warbyparker.com/eyeglasses/percey",
    tags: ["round", "modern", "acetate", "affordable"],
  },
  {
    id: "oakley-001",
    brand: "Oakley",
    model: "Holbrook",
    style: "Square",
    color: "Matte Black",
    price: 198.0,
    currency: "USD",
    imageUrl: "https://images.unsplash.com/photo-1509695307050-d4066910ec1e?w=500",
    description: "Sporty square frame with UV protection",
    material: "O Matter",
    lensType: "Plutonite",
    frameWidth: 142,
    bridgeWidth: 24,
    armLength: 152,
    inStock: true,
    rating: 4.7,
    reviewCount: 3124,
    purchaseUrl: "https://www.oakley.com/en-us/product/holbrook",
    tags: ["square", "sporty", "uv-protection", "premium"],
  },
  {
    id: "zenni-001",
    brand: "Zenni",
    model: "Cat-Eye Classic",
    style: "Cat-Eye",
    color: "Tortoise",
    price: 65.0,
    currency: "USD",
    imageUrl: "https://images.unsplash.com/photo-1508296695146-367180be980e?w=500",
    description: "Trendy cat-eye frame at affordable price",
    material: "Plastic",
    lensType: "Polycarbonate",
    frameWidth: 138,
    bridgeWidth: 20,
    armLength: 148,
    inStock: true,
    rating: 4.5,
    reviewCount: 1456,
    purchaseUrl: "https://www.zennioptical.com/cat-eye-frames",
    tags: ["cat-eye", "trendy", "affordable", "plastic"],
  },
  {
    id: "gucci-001",
    brand: "Gucci",
    model: "GG0326S",
    style: "Oversized",
    color: "Gold",
    price: 385.0,
    currency: "USD",
    imageUrl: "https://images.unsplash.com/photo-1511499767150-a48a237f0816?w=500",
    description: "Luxury oversized frame with designer appeal",
    material: "Metal",
    lensType: "Glass",
    frameWidth: 150,
    bridgeWidth: 25,
    armLength: 155,
    inStock: true,
    rating: 4.9,
    reviewCount: 892,
    purchaseUrl: "https://www.gucci.com/us/en/pr/eyewear",
    tags: ["oversized", "luxury", "designer", "gold"],
  },
];

/**
 * Search eyewear inventory
 */
export async function searchEyewearInventory(
  query: string,
  filters?: {
    style?: string;
    brand?: string;
    maxPrice?: number;
    minPrice?: number;
    inStockOnly?: boolean;
  }
): Promise<EyewearProduct[]> {
  let results = MOCK_EYEWEAR_INVENTORY;

  // Filter by query
  if (query) {
    const lowerQuery = query.toLowerCase();
    results = results.filter(
      (p) =>
        p.brand.toLowerCase().includes(lowerQuery) ||
        p.model.toLowerCase().includes(lowerQuery) ||
        p.color.toLowerCase().includes(lowerQuery) ||
        p.tags.some((tag) => tag.toLowerCase().includes(lowerQuery))
    );
  }

  // Apply filters
  if (filters?.style) {
    results = results.filter((p) => p.style.toLowerCase() === filters.style?.toLowerCase());
  }
  if (filters?.brand) {
    results = results.filter((p) => p.brand.toLowerCase() === filters.brand?.toLowerCase());
  }
  if (filters?.maxPrice) {
    results = results.filter((p) => p.price <= filters.maxPrice!);
  }
  if (filters?.minPrice) {
    results = results.filter((p) => p.price >= filters.minPrice!);
  }
  if (filters?.inStockOnly) {
    results = results.filter((p) => p.inStock);
  }

  return results;
}

/**
 * Get product by ID
 */
export async function getEyewearProduct(id: string): Promise<EyewearProduct | null> {
  return MOCK_EYEWEAR_INVENTORY.find((p) => p.id === id) || null;
}

/**
 * Get trending eyewear
 */
export async function getTrendingEyewear(limit: number = 5): Promise<EyewearProduct[]> {
  return MOCK_EYEWEAR_INVENTORY.sort((a, b) => b.rating - a.rating).slice(0, limit);
}

/**
 * Get eyewear by style
 */
export async function getEyewearByStyle(style: string): Promise<EyewearProduct[]> {
  return MOCK_EYEWEAR_INVENTORY.filter((p) => p.style.toLowerCase() === style.toLowerCase());
}

/**
 * Get all brands
 */
export async function getAllBrands(): Promise<string[]> {
  const brands = new Set(MOCK_EYEWEAR_INVENTORY.map((p) => p.brand));
  return Array.from(brands);
}

/**
 * Get all styles
 */
export async function getAllStyles(): Promise<string[]> {
  const styles = new Set(MOCK_EYEWEAR_INVENTORY.map((p) => p.style));
  return Array.from(styles);
}

/**
 * Get eyewear recommendations based on face shape
 */
export async function getRecommendationsForFaceShape(
  faceShape: string,
  limit: number = 5
): Promise<EyewearProduct[]> {
  const recommendations: Record<string, string[]> = {
    OVAL: ["Aviator", "Cat-Eye", "Round"],
    ROUND: ["Square", "Aviator", "Wayfarer"],
    SQUARE: ["Round", "Cat-Eye", "Oversized"],
    HEART: ["Round", "Oversized", "Cat-Eye"],
    DIAMOND: ["Aviator", "Cat-Eye", "Round"],
    OBLONG: ["Aviator", "Oversized", "Round"],
  };

  const recommendedStyles = recommendations[faceShape] || [];
  let results = MOCK_EYEWEAR_INVENTORY.filter((p) => recommendedStyles.includes(p.style));

  // Sort by rating
  results.sort((a, b) => b.rating - a.rating);

  return results.slice(0, limit);
}
