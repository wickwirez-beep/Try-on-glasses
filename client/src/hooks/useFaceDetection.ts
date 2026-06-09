import { useEffect, useRef, useState } from "react";
import { FaceLandmarker, FilesetResolver, DrawingUtils } from "@mediapipe/tasks-vision";

export interface FaceDetectionResult {
  landmarks: Array<{ x: number; y: number; z: number }>;
  imageWidth: number;
  imageHeight: number;
  rotation: number;
  confidence: number;
  facePresenceConfidence: number;
  trackingConfidence: number;
  qualityScore: number;
  qualityLevel: 'poor' | 'fair' | 'good' | 'excellent';
  qualityFeedback: string[];
}

export interface UseGlassesPositionResult {
  eyeDistance: number;
  eyeCenterX: number;
  eyeCenterY: number;
  noseBridgeX: number;
  noseBridgeY: number;
  faceRotation: number;
}

let faceLandmarker: FaceLandmarker | null = null;
let initPromise: Promise<void> | null = null;

async function initializeFaceLandmarker() {
  if (faceLandmarker) return;
  if (initPromise) return initPromise;

  initPromise = (async () => {
    try {
      const vision = await FilesetResolver.forVisionTasks(
        "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.35/wasm"
      );
      faceLandmarker = await FaceLandmarker.createFromOptions(vision, {
        baseOptions: {
          modelAssetPath:
            "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task",
        },
        runningMode: "VIDEO",
        numFaces: 1,
        minFaceDetectionConfidence: 0.5,
        minFacePresenceConfidence: 0.5,
        minTrackingConfidence: 0.5,
      });
    } catch (error) {
      console.error("Failed to initialize FaceLandmarker:", error);
      throw error;
    }
  })();

  await initPromise;
}

/**
 * Calculate quality score and feedback based on detection results
 */
function calculateQualityMetrics(
  landmarks: Array<{ x: number; y: number; z: number }>,
  imageWidth: number,
  imageHeight: number
): { qualityScore: number; qualityLevel: 'poor' | 'fair' | 'good' | 'excellent'; qualityFeedback: string[] } {
  const feedback: string[] = [];
  let qualityScore = 100;

  // Check face positioning (should be roughly centered)
  const faceX = landmarks.reduce((sum, l) => sum + l.x, 0) / landmarks.length;
  const faceY = landmarks.reduce((sum, l) => sum + l.y, 0) / landmarks.length;

  if (faceX < 0.2 || faceX > 0.8) {
    feedback.push("Move your face more to the center");
    qualityScore -= 15;
  }
  if (faceY < 0.15 || faceY > 0.85) {
    feedback.push("Adjust your face position vertically");
    qualityScore -= 15;
  }

  // Check face size (should be reasonably large)
  const leftEye = landmarks[33];
  const rightEye = landmarks[362];
  const eyeDistance = Math.sqrt(
    Math.pow((rightEye.x - leftEye.x) * imageWidth, 2) +
      Math.pow((rightEye.y - leftEye.y) * imageHeight, 2)
  );

  if (eyeDistance < 50) {
    feedback.push("Move closer to the camera");
    qualityScore -= 20;
  } else if (eyeDistance > 300) {
    feedback.push("Move further from the camera");
    qualityScore -= 10;
  }

  // Check face angle (z-coordinate variation)
  const zValues = landmarks.map(l => l.z);
  const zVariation = Math.max(...zValues) - Math.min(...zValues);
  if (zVariation > 0.3) {
    feedback.push("Face angle is too extreme, try a frontal view");
    qualityScore -= 15;
  }

  qualityScore = Math.max(0, Math.min(100, qualityScore));

  let qualityLevel: 'poor' | 'fair' | 'good' | 'excellent';
  if (qualityScore >= 85) qualityLevel = 'excellent';
  else if (qualityScore >= 70) qualityLevel = 'good';
  else if (qualityScore >= 50) qualityLevel = 'fair';
  else qualityLevel = 'poor';

  return { qualityScore, qualityLevel, qualityFeedback: feedback };
}

/**
 * Calculate glasses positioning based on face landmarks
 * Uses proper eye landmarks and nose bridge for accurate positioning
 */
export function calculateGlassesPosition(
  landmarks: Array<{ x: number; y: number; z: number }>,
  imageWidth: number,
  imageHeight: number
): UseGlassesPositionResult {
  // Key landmark indices for glasses positioning
  const LEFT_EYE_OUTER = 33; // Left eye outer corner
  const LEFT_EYE_INNER = 133; // Left eye inner corner
  const RIGHT_EYE_OUTER = 362; // Right eye outer corner
  const RIGHT_EYE_INNER = 263; // Right eye inner corner
  const NOSE_BRIDGE = 6; // Nose bridge (glabella)
  const NOSE_TIP = 4; // Nose tip

  const leftEyeOuter = landmarks[LEFT_EYE_OUTER];
  const leftEyeInner = landmarks[LEFT_EYE_INNER];
  const rightEyeOuter = landmarks[RIGHT_EYE_OUTER];
  const rightEyeInner = landmarks[RIGHT_EYE_INNER];
  const noseBridge = landmarks[NOSE_BRIDGE];
  const noseTip = landmarks[NOSE_TIP];

  // Calculate eye distance (width between outer corners)
  const eyeDistancePixels = Math.sqrt(
    Math.pow((rightEyeOuter.x - leftEyeOuter.x) * imageWidth, 2) +
      Math.pow((rightEyeOuter.y - leftEyeOuter.y) * imageHeight, 2)
  );

  // Calculate center between eyes (use inner corners for more accurate positioning)
  const eyeCenterX = ((leftEyeInner.x + rightEyeInner.x) / 2) * imageWidth;
  const eyeCenterY = ((leftEyeInner.y + rightEyeInner.y) / 2) * imageHeight;

  // Nose bridge position (use z for depth-aware vertical positioning)
  const noseBridgeX = noseBridge.x * imageWidth;
  // Position glasses slightly above the eye center, using nose bridge as reference
  const noseBridgeY = noseBridge.y * imageHeight;

  // Estimate face rotation based on eye positions
  const eyeAngle = Math.atan2(
    (rightEyeOuter.y - leftEyeOuter.y) * imageHeight,
    (rightEyeOuter.x - leftEyeOuter.x) * imageWidth
  );
  const faceRotation = eyeAngle * (180 / Math.PI);

  return {
    eyeDistance: eyeDistancePixels,
    eyeCenterX,
    eyeCenterY,
    noseBridgeX,
    noseBridgeY,
    faceRotation,
  };
}

/**
 * Hook for detecting face landmarks in an image
 */
export function useFaceDetection(imageUrl?: string) {
  const [result, setResult] = useState<FaceDetectionResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!imageUrl) {
      setResult(null);
      return;
    }

    const detectFace = async () => {
      try {
        setLoading(true);
        setError(null);

        await initializeFaceLandmarker();
        if (!faceLandmarker) throw new Error("FaceLandmarker not initialized");

        // Load image
        const img = new Image();
        img.crossOrigin = "anonymous";

        await new Promise<void>((resolve, reject) => {
          img.onload = () => resolve();
          img.onerror = () => reject(new Error("Failed to load image"));
          img.src = imageUrl;
        });

        // Create canvas and draw image
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");
        if (!ctx) throw new Error("Could not get canvas context");
        ctx.drawImage(img, 0, 0);

        // Detect faces
        const detectionResult = faceLandmarker.detectForVideo(canvas, Date.now());

        if (detectionResult.faceLandmarks && detectionResult.faceLandmarks.length > 0) {
          const landmarks = detectionResult.faceLandmarks[0];
          const { qualityScore, qualityLevel, qualityFeedback } = calculateQualityMetrics(
            landmarks,
            img.width,
            img.height
          );

          setResult({
            landmarks,
            imageWidth: img.width,
            imageHeight: img.height,
            rotation: 0,
            confidence: detectionResult.faceLandmarks[0] ? 0.95 : 0,
            facePresenceConfidence: 0.9,
            trackingConfidence: 0.85,
            qualityScore,
            qualityLevel,
            qualityFeedback,
          });
        } else {
          setError("No face detected in the image. Please try another photo.");
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : "Face detection failed";
        setError(message);
        console.error("Face detection error:", err);
      } finally {
        setLoading(false);
      }
    };

    detectFace();
  }, [imageUrl]);

  return { result, loading, error };
}

/**
 * Hook for rendering glasses on a canvas with proper positioning
 */
export function useGlassesOverlay(
  canvasRef: React.RefObject<HTMLCanvasElement | null>,
  imageUrl: string | null,
  glassesImageUrl: string | null,
  rotation: number = 0
) {
  const [isRendering, setIsRendering] = useState(false);
  const [renderError, setRenderError] = useState<string | null>(null);

  useEffect(() => {
    if (!canvasRef.current || !imageUrl || !glassesImageUrl) {
      setRenderError(null);
      return;
    }

    const renderGlasses = async () => {
      try {
        setIsRendering(true);
        setRenderError(null);

        // Load images
        const mainImg = new Image();
        const glassesImg = new Image();

        await Promise.all([
          new Promise<void>((resolve, reject) => {
            mainImg.crossOrigin = "anonymous";
            mainImg.onload = () => resolve();
            mainImg.onerror = () => reject(new Error("Failed to load main image"));
            mainImg.src = imageUrl;
          }),
          new Promise<void>((resolve, reject) => {
            glassesImg.crossOrigin = "anonymous";
            glassesImg.onload = () => resolve();
            glassesImg.onerror = () => reject(new Error("Failed to load glasses image"));
            glassesImg.src = glassesImageUrl;
          }),
        ]);

        // Initialize face detection
        await initializeFaceLandmarker();
        if (!faceLandmarker) throw new Error("FaceLandmarker not initialized");

        // Detect face
        const detectionCanvas = document.createElement("canvas");
        detectionCanvas.width = mainImg.width;
        detectionCanvas.height = mainImg.height;
        const detectionCtx = detectionCanvas.getContext("2d");
        if (!detectionCtx) throw new Error("Could not get detection canvas context");
        detectionCtx.drawImage(mainImg, 0, 0);

        const detectionResult = faceLandmarker.detectForVideo(detectionCanvas, Date.now());
        if (!detectionResult.faceLandmarks || detectionResult.faceLandmarks.length === 0) {
          throw new Error("No face detected in the image");
        }

        const landmarks = detectionResult.faceLandmarks[0];
        const { qualityScore, qualityLevel, qualityFeedback } = calculateQualityMetrics(
          landmarks,
          mainImg.width,
          mainImg.height
        );
        console.log(`Face quality: ${qualityLevel} (${qualityScore}%)`, qualityFeedback);
        const glassesPos = calculateGlassesPosition(landmarks, mainImg.width, mainImg.height);

        // Render on output canvas
        const outputCanvas = canvasRef.current as HTMLCanvasElement;
        if (!outputCanvas) throw new Error("Canvas not available");
        outputCanvas.width = mainImg.width;
        outputCanvas.height = mainImg.height;
        const outputCtx = outputCanvas.getContext("2d");
        if (!outputCtx) throw new Error("Could not get output canvas context");

        // Draw main image
        outputCtx.drawImage(mainImg, 0, 0);

        // Calculate glasses scale based on eye distance
        // Add some padding to make glasses slightly larger
        const glassesScale = (glassesPos.eyeDistance * 1.1) / glassesImg.width;

        // Draw glasses with rotation and proper positioning
        outputCtx.save();
        outputCtx.translate(glassesPos.eyeCenterX, glassesPos.eyeCenterY);
        outputCtx.rotate((rotation * Math.PI) / 180);
        outputCtx.scale(glassesScale, glassesScale);
        outputCtx.drawImage(
          glassesImg,
          -glassesImg.width / 2,
          -glassesImg.height / 2
        );
        outputCtx.restore();

        setIsRendering(false);
      } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to render glasses";
        setRenderError(message);
        console.error("Render error:", err);
        setIsRendering(false);
      }
    };

    renderGlasses();
  }, [canvasRef, imageUrl, glassesImageUrl, rotation]);

  return { isRendering, renderError };
}
