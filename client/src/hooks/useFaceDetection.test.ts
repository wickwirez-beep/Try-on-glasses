import { describe, it, expect } from "vitest";
import { calculateGlassesPosition } from "./useFaceDetection";

describe("calculateGlassesPosition", () => {
  // Mock face landmarks (simplified for testing)
  const createMockLandmarks = (count: number = 478) => {
    const landmarks: Array<{ x: number; y: number; z: number }> = [];
    for (let i = 0; i < count; i++) {
      landmarks[i] = { x: 0.5, y: 0.5, z: 0.0 };
    }
    return landmarks;
  };

  const imageWidth = 640;
  const imageHeight = 480;

  it("should return a valid position object", () => {
    const landmarks = createMockLandmarks();
    const position = calculateGlassesPosition(landmarks, imageWidth, imageHeight);

    expect(position).toHaveProperty("eyeDistance");
    expect(position).toHaveProperty("eyeCenterX");
    expect(position).toHaveProperty("eyeCenterY");
    expect(position).toHaveProperty("noseBridgeX");
    expect(position).toHaveProperty("noseBridgeY");
    expect(position).toHaveProperty("faceRotation");
  });

  it("should calculate eye distance as a positive number", () => {
    const landmarks = createMockLandmarks();
    const position = calculateGlassesPosition(landmarks, imageWidth, imageHeight);

    expect(position.eyeDistance).toBeGreaterThanOrEqual(0);
    expect(typeof position.eyeDistance).toBe("number");
  });

  it("should calculate eye center within image bounds", () => {
    const landmarks = createMockLandmarks();
    const position = calculateGlassesPosition(landmarks, imageWidth, imageHeight);

    expect(position.eyeCenterX).toBeGreaterThanOrEqual(0);
    expect(position.eyeCenterX).toBeLessThanOrEqual(imageWidth);
    expect(position.eyeCenterY).toBeGreaterThanOrEqual(0);
    expect(position.eyeCenterY).toBeLessThanOrEqual(imageHeight);
  });

  it("should calculate nose bridge within image bounds", () => {
    const landmarks = createMockLandmarks();
    const position = calculateGlassesPosition(landmarks, imageWidth, imageHeight);

    expect(position.noseBridgeX).toBeGreaterThanOrEqual(0);
    expect(position.noseBridgeX).toBeLessThanOrEqual(imageWidth);
    expect(position.noseBridgeY).toBeGreaterThanOrEqual(0);
    expect(position.noseBridgeY).toBeLessThanOrEqual(imageHeight);
  });

  it("should calculate face rotation as a number", () => {
    const landmarks = createMockLandmarks();
    const position = calculateGlassesPosition(landmarks, imageWidth, imageHeight);

    expect(typeof position.faceRotation).toBe("number");
    expect(position.faceRotation).toBeGreaterThanOrEqual(-180);
    expect(position.faceRotation).toBeLessThanOrEqual(180);
  });

  it("should handle different image dimensions", () => {
    const landmarks = createMockLandmarks();
    const smallWidth = 320;
    const smallHeight = 240;

    const position = calculateGlassesPosition(landmarks, smallWidth, smallHeight);

    expect(position.eyeCenterX).toBeLessThanOrEqual(smallWidth);
    expect(position.eyeCenterY).toBeLessThanOrEqual(smallHeight);
  });

  it("should detect face rotation from eye positions", () => {
    const landmarks = createMockLandmarks();
    // Simulate left eye higher than right eye (face tilted right)
    landmarks[33] = { x: 0.3, y: 0.4, z: 0.0 }; // LEFT_EYE_OUTER
    landmarks[362] = { x: 0.7, y: 0.6, z: 0.0 }; // RIGHT_EYE_OUTER

    const position = calculateGlassesPosition(landmarks, imageWidth, imageHeight);

    // Should detect some rotation
    expect(Math.abs(position.faceRotation)).toBeGreaterThan(0);
  });

  it("should handle landmarks with different z-depth values", () => {
    const landmarks = createMockLandmarks();
    landmarks[33] = { x: 0.3, y: 0.45, z: 0.1 };
    landmarks[362] = { x: 0.7, y: 0.45, z: 0.1 };
    landmarks[6] = { x: 0.5, y: 0.3, z: 0.2 }; // NOSE_BRIDGE with depth

    const position = calculateGlassesPosition(landmarks, imageWidth, imageHeight);

    expect(position.eyeDistance).toBeGreaterThan(0);
    expect(position.noseBridgeX).toBeGreaterThan(0);
    expect(position.noseBridgeY).toBeGreaterThan(0);
  });

  it("should maintain consistency across multiple calls with same landmarks", () => {
    const landmarks = createMockLandmarks();
    const position1 = calculateGlassesPosition(landmarks, imageWidth, imageHeight);
    const position2 = calculateGlassesPosition(landmarks, imageWidth, imageHeight);

    expect(position1.eyeDistance).toBe(position2.eyeDistance);
    expect(position1.eyeCenterX).toBe(position2.eyeCenterX);
    expect(position1.eyeCenterY).toBe(position2.eyeCenterY);
    expect(position1.noseBridgeX).toBe(position2.noseBridgeX);
    expect(position1.noseBridgeY).toBe(position2.noseBridgeY);
    expect(position1.faceRotation).toBe(position2.faceRotation);
  });
});

describe("Glasses Positioning Edge Cases", () => {
  it("should handle very small image dimensions", () => {
    const landmarks: Array<{ x: number; y: number; z: number }> = [];
    for (let i = 0; i < 478; i++) {
      landmarks[i] = { x: 0.5, y: 0.5, z: 0.0 };
    }

    const position = calculateGlassesPosition(landmarks, 100, 100);

    expect(position.eyeCenterX).toBeGreaterThanOrEqual(0);
    expect(position.eyeCenterX).toBeLessThanOrEqual(100);
    expect(position.eyeCenterY).toBeGreaterThanOrEqual(0);
    expect(position.eyeCenterY).toBeLessThanOrEqual(100);
  });

  it("should handle very large image dimensions", () => {
    const landmarks: Array<{ x: number; y: number; z: number }> = [];
    for (let i = 0; i < 478; i++) {
      landmarks[i] = { x: 0.5, y: 0.5, z: 0.0 };
    }

    const position = calculateGlassesPosition(landmarks, 4000, 3000);

    expect(position.eyeCenterX).toBeGreaterThanOrEqual(0);
    expect(position.eyeCenterX).toBeLessThanOrEqual(4000);
    expect(position.eyeCenterY).toBeGreaterThanOrEqual(0);
    expect(position.eyeCenterY).toBeLessThanOrEqual(3000);
  });

  it("should handle landmarks at image boundaries", () => {
    const landmarks: Array<{ x: number; y: number; z: number }> = [];
    for (let i = 0; i < 478; i++) {
      landmarks[i] = { x: 0.0, y: 0.0, z: 0.0 };
    }
    // Set eyes at corners
    landmarks[33] = { x: 0.0, y: 0.0, z: 0.0 }; // LEFT_EYE_OUTER
    landmarks[362] = { x: 1.0, y: 1.0, z: 0.0 }; // RIGHT_EYE_OUTER

    const position = calculateGlassesPosition(landmarks, 640, 480);

    expect(position.eyeDistance).toBeGreaterThan(0);
    expect(position.eyeCenterX).toBeGreaterThanOrEqual(0);
    expect(position.eyeCenterY).toBeGreaterThanOrEqual(0);
  });
});
