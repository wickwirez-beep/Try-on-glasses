import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

const sampleFrames = [
  // Real glasses images from pngimg.com
  {
    name: "Classic Black Frames",
    style: "square",
    color: "black",
    lensTint: "clear",
    imageUrl: "/manus-storage/uGp4krzWy55P_36b7b7f9.png",
    imageWidth: 2000,
    imageHeight: 2000,
  },
  {
    name: "Round Clear Frames",
    style: "round",
    color: "black",
    lensTint: "clear",
    imageUrl: "/manus-storage/zOro1hAPC0iz_25ffc342.png",
    imageWidth: 512,
    imageHeight: 512,
  },
  {
    name: "Modern Black & Silver",
    style: "square",
    color: "black",
    lensTint: "clear",
    imageUrl: "/manus-storage/ShfSHyWnrQk1_41a35805.png",
    imageWidth: 1180,
    imageHeight: 700,
  },
  {
    name: "Classic Aviator Style",
    style: "aviator",
    color: "black",
    lensTint: "clear",
    imageUrl: "/manus-storage/0mxTYUkKgLFu_fecc2838.png",
    imageWidth: 2400,
    imageHeight: 1697,
  },
  {
    name: "Wayfarer Collection",
    style: "wayfarer",
    color: "black",
    lensTint: "clear",
    imageUrl: "/manus-storage/z0AzarITG20D_b3e216bc.png",
    imageWidth: 1670,
    imageHeight: 687,
  },
  {
    name: "Vintage Round Styles",
    style: "round",
    color: "black",
    lensTint: "clear",
    imageUrl: "/manus-storage/AHBGd2e3mbAu_d6845042.png",
    imageWidth: 4809,
    imageHeight: 1896,
  },
  {
    name: "Cat-Eye & Clubmaster",
    style: "cat-eye",
    color: "black",
    lensTint: "clear",
    imageUrl: "/manus-storage/ys5DBnZ2OaS9_198a7064.png",
    imageWidth: 3890,
    imageHeight: 1649,
  },
  {
    name: "Rimless & Modern Frames",
    style: "rimless",
    color: "silver",
    lensTint: "clear",
    imageUrl: "/manus-storage/Bb1TIc2iwOYd_edf1a283.png",
    imageWidth: 2053,
    imageHeight: 1360,
  },
  // Duplicate frames with different colors to reach 21 total
  {
    name: "Classic Black Frames - Gold",
    style: "square",
    color: "gold",
    lensTint: "amber",
    imageUrl: "/manus-storage/uGp4krzWy55P_36b7b7f9.png",
    imageWidth: 2000,
    imageHeight: 2000,
  },
  {
    name: "Round Clear Frames - Brown",
    style: "round",
    color: "brown",
    lensTint: "brown",
    imageUrl: "/manus-storage/zOro1hAPC0iz_25ffc342.png",
    imageWidth: 512,
    imageHeight: 512,
  },
  {
    name: "Modern Black & Silver - Rose",
    style: "square",
    color: "rose-gold",
    lensTint: "rose",
    imageUrl: "/manus-storage/ShfSHyWnrQk1_41a35805.png",
    imageWidth: 1180,
    imageHeight: 700,
  },
  {
    name: "Classic Aviator - Silver",
    style: "aviator",
    color: "silver",
    lensTint: "clear",
    imageUrl: "/manus-storage/0mxTYUkKgLFu_fecc2838.png",
    imageWidth: 2400,
    imageHeight: 1697,
  },
  {
    name: "Wayfarer - Tortoiseshell",
    style: "wayfarer",
    color: "tortoiseshell",
    lensTint: "brown",
    imageUrl: "/manus-storage/z0AzarITG20D_b3e216bc.png",
    imageWidth: 1670,
    imageHeight: 687,
  },
  {
    name: "Vintage Round - Gold",
    style: "round",
    color: "gold",
    lensTint: "amber",
    imageUrl: "/manus-storage/AHBGd2e3mbAu_d6845042.png",
    imageWidth: 4809,
    imageHeight: 1896,
  },
  {
    name: "Cat-Eye - Red",
    style: "cat-eye",
    color: "brown",
    lensTint: "red",
    imageUrl: "/manus-storage/ys5DBnZ2OaS9_198a7064.png",
    imageWidth: 3890,
    imageHeight: 1649,
  },
  {
    name: "Rimless - Gold",
    style: "rimless",
    color: "gold",
    lensTint: "clear",
    imageUrl: "/manus-storage/Bb1TIc2iwOYd_edf1a283.png",
    imageWidth: 2053,
    imageHeight: 1360,
  },
  {
    name: "Square Frames - Black",
    style: "square",
    color: "black",
    lensTint: "clear",
    imageUrl: "/manus-storage/uGp4krzWy55P_36b7b7f9.png",
    imageWidth: 2000,
    imageHeight: 2000,
  },
  {
    name: "Round Frames - Silver",
    style: "round",
    color: "silver",
    lensTint: "clear",
    imageUrl: "/manus-storage/zOro1hAPC0iz_25ffc342.png",
    imageWidth: 512,
    imageHeight: 512,
  },
  {
    name: "Clubmaster - Black",
    style: "clubmaster",
    color: "black",
    lensTint: "clear",
    imageUrl: "/manus-storage/ShfSHyWnrQk1_41a35805.png",
    imageWidth: 1180,
    imageHeight: 700,
  },
  {
    name: "Aviator - Gold",
    style: "aviator",
    color: "gold",
    lensTint: "amber",
    imageUrl: "/manus-storage/0mxTYUkKgLFu_fecc2838.png",
    imageWidth: 2400,
    imageHeight: 1697,
  },
  {
    name: "Wayfarer - Brown",
    style: "wayfarer",
    color: "brown",
    lensTint: "clear",
    imageUrl: "/manus-storage/z0AzarITG20D_b3e216bc.png",
    imageWidth: 1670,
    imageHeight: 687,
  },
];

async function seedGlasses() {
  try {
    const connection = await mysql.createConnection(process.env.DATABASE_URL);

    // Check if frames already exist
    const [existing] = await connection.execute("SELECT COUNT(*) as count FROM glasses_frames");
    if (existing[0].count > 0) {
      console.log("Glasses frames already exist in database. Deleting old frames and reseeding...");
      await connection.execute("DELETE FROM glasses_frames");
    }

    // Insert frames
    for (const frame of sampleFrames) {
      await connection.execute(
        `INSERT INTO glasses_frames (name, style, color, lensTint, imageUrl, imageWidth, imageHeight) 
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          frame.name,
          frame.style,
          frame.color,
          frame.lensTint,
          frame.imageUrl,
          frame.imageWidth,
          frame.imageHeight,
        ]
      );
    }

    console.log(`✓ Successfully seeded ${sampleFrames.length} glasses frames`);
    await connection.end();
  } catch (error) {
    console.error("Failed to seed glasses:", error);
    process.exit(1);
  }
}

seedGlasses();
