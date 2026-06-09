/**
 * Video Try-On Hook
 * Real-time camera streaming with face detection and glasses overlay
 */

import { useEffect, useRef, useState, useCallback } from "react";
import { FaceLandmarker, FilesetResolver } from "@mediapipe/tasks-vision";

export interface VideoTryOnState {
  isStreaming: boolean;
  isCameraReady: boolean;
  error: string | null;
  frameCount: number;
  fps: number;
}

export interface UseVideoTryOnOptions {
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  videoRef: React.RefObject<HTMLVideoElement | null>;
  glassesImageUrl?: string;
  rotation?: number;
  brightness?: number;
  isMirrored?: boolean;
  onFrameProcessed?: (frameCount: number) => void;
}

export function useVideoTryOn(options: UseVideoTryOnOptions) {
  const { canvasRef, videoRef, glassesImageUrl, rotation = 0, brightness = 100, isMirrored = false, onFrameProcessed } = options;

  const [state, setState] = useState<VideoTryOnState>({
    isStreaming: false,
    isCameraReady: false,
    error: null,
    frameCount: 0,
    fps: 0,
  });

  const faceLandmarkerRef = useRef<FaceLandmarker | null>(null);
  const glassesImageRef = useRef<HTMLImageElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(Date.now());
  const frameCountRef = useRef<number>(0);

  // Initialize MediaPipe Face Landmarker
  useEffect(() => {
    const initializeFaceLandmarker = async () => {
      try {
        const filesetResolver = await FilesetResolver.forVisionTasks(
          "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.0/wasm"
        );

        const landmarker = await FaceLandmarker.createFromOptions(filesetResolver, {
          baseOptions: {
            modelAssetPath:
              "https://storage.googleapis.com/mediapipe-models/image_classifier/efficientnet_lite0/float32/1/efficientnet_lite0.tflite",
          },
          runningMode: "VIDEO",
          numFaces: 1,
        });

        faceLandmarkerRef.current = landmarker;
      } catch (err) {
        setState((prev) => ({
          ...prev,
          error: `Failed to initialize face detection: ${err instanceof Error ? err.message : "Unknown error"}`,
        }));
      }
    };

    initializeFaceLandmarker();

    return () => {
      if (faceLandmarkerRef.current) {
        faceLandmarkerRef.current.close();
      }
    };
  }, []);

  // Load glasses image
  useEffect(() => {
    if (!glassesImageUrl) return;

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      glassesImageRef.current = img;
    };
    img.onerror = () => {
      setState((prev) => ({
        ...prev,
        error: "Failed to load glasses image",
      }));
    };
    img.src = glassesImageUrl;
  }, [glassesImageUrl]);

  // Start camera stream
  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: false,
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          videoRef.current?.play();
          setState((prev) => ({ ...prev, isCameraReady: true, error: null }));
          startProcessing();
        };
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to access camera. Please check permissions.";
      setState((prev) => ({
        ...prev,
        error: errorMessage,
        isCameraReady: false,
      }));
    }
  }, [videoRef]);

  // Stop camera stream
  const stopCamera = useCallback(() => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }

    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }

    setState((prev) => ({
      ...prev,
      isStreaming: false,
      isCameraReady: false,
    }));
  }, [videoRef]);

  // Process video frames
  const processFrame = useCallback(async () => {
    if (!videoRef.current || !canvasRef.current || !faceLandmarkerRef.current) {
      animationFrameRef.current = requestAnimationFrame(processFrame);
      return;
    }

    try {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      const ctx = canvas.getContext("2d");

      if (!ctx) {
        animationFrameRef.current = requestAnimationFrame(processFrame);
        return;
      }

      // Set canvas size to match video
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      // Apply mirror effect if enabled
      if (isMirrored) {
        ctx.scale(-1, 1);
        ctx.translate(-canvas.width, 0);
      }

      // Draw video frame
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      // Apply brightness effect
      if (brightness !== 100) {
        const brightnessAdjustment = (brightness - 100) / 100;
        ctx.fillStyle = `rgba(255, 255, 255, ${brightnessAdjustment > 0 ? brightnessAdjustment * 0.5 : 0})`;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        if (brightnessAdjustment < 0) {
          ctx.fillStyle = `rgba(0, 0, 0, ${Math.abs(brightnessAdjustment) * 0.5})`;
          ctx.fillRect(0, 0, canvas.width, canvas.height);
        }
      }

      // Note: Keep mirror transform active for face detection and glasses rendering
      // This ensures the overlay stays aligned with the mirrored video feed

      // Detect faces
      const results = faceLandmarkerRef.current.detectForVideo(video, Date.now());

      if (results.faceLandmarks && results.faceLandmarks.length > 0 && glassesImageRef.current) {
        const landmarks = results.faceLandmarks[0];

        // Get eye positions (landmarks 33 and 263 are eye centers)
        const leftEye = landmarks[33];
        const rightEye = landmarks[263];
        const noseBridge = landmarks[6];

        if (leftEye && rightEye && noseBridge) {
          // Calculate glasses position and size
          const eyeDistance = Math.hypot(rightEye.x - leftEye.x, rightEye.y - leftEye.y);
          const glassesWidth = eyeDistance * 2.5;
          const glassesHeight = glassesWidth * 0.5;

          // Center between eyes
          const centerX = (leftEye.x + rightEye.x) / 2;
          const centerY = (leftEye.y + rightEye.y) / 2;

          // Draw glasses with rotation
          ctx.save();
          ctx.translate(centerX * canvas.width, centerY * canvas.height);
          ctx.rotate((rotation * Math.PI) / 180);

          ctx.drawImage(
            glassesImageRef.current,
            (-glassesWidth * canvas.width) / 2,
            (-glassesHeight * canvas.height) / 2,
            glassesWidth * canvas.width,
            glassesHeight * canvas.height
          );

          ctx.restore();
        }
      }

      // Update FPS
      frameCountRef.current++;
      const now = Date.now();
      const elapsed = now - lastTimeRef.current;

      if (elapsed >= 1000) {
        const fps = Math.round((frameCountRef.current * 1000) / elapsed);
        setState((prev) => ({
          ...prev,
          frameCount: frameCountRef.current,
          fps,
        }));
        frameCountRef.current = 0;
        lastTimeRef.current = now;
      }

      onFrameProcessed?.(frameCountRef.current);
    } catch (err) {
      console.error("Error processing frame:", err);
    }

    animationFrameRef.current = requestAnimationFrame(processFrame);
  }, [videoRef, canvasRef, rotation, brightness, isMirrored, onFrameProcessed]);

  // Start processing
  const startProcessing = useCallback(() => {
    setState((prev) => ({ ...prev, isStreaming: true }));
    animationFrameRef.current = requestAnimationFrame(processFrame);
  }, [processFrame]);

  // Toggle streaming
  const toggleStreaming = useCallback(async () => {
    if (state.isStreaming) {
      stopCamera();
    } else {
      await startCamera();
    }
  }, [state.isStreaming, startCamera, stopCamera]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, [stopCamera]);

  return {
    ...state,
    startCamera,
    stopCamera,
    toggleStreaming,
  };
}
