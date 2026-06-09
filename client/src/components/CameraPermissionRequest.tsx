import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { AlertCircle, Camera, RefreshCw } from "lucide-react";

interface CameraPermissionRequestProps {
  onRetry: () => void;
  isLoading?: boolean;
}

export function CameraPermissionRequest({ onRetry, isLoading = false }: CameraPermissionRequestProps) {
  const [showDeniedState, setShowDeniedState] = useState(false);

  const handleRequestPermission = async () => {
    try {
      // Test camera access
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" },
        audio: false,
      });

      // Stop the stream immediately
      stream.getTracks().forEach((track) => track.stop());

      // Permission granted, call retry
      onRetry();
    } catch (err) {
      const error = err as DOMException;
      if (error.name === "NotAllowedError") {
        setShowDeniedState(true);
      } else if (error.name === "NotFoundError") {
        // No camera found
        console.error("No camera device found");
      } else {
        console.error("Camera access error:", error);
      }
    }
  };

  if (showDeniedState) {
    return (
      <Card className="p-8 bg-gradient-to-br from-red-50 to-red-100 border-red-200 shadow-lg">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-red-900 mb-2">Camera Access Denied</h3>
            <p className="text-sm text-red-700 mb-4">
              We need camera access to enable live video try-on. Please enable camera permissions in your browser settings and try again.
            </p>
          </div>
          <div className="space-y-2 w-full">
            <p className="text-xs text-red-600 font-semibold">How to enable camera access:</p>
            <ol className="text-xs text-red-700 text-left space-y-1">
              <li>1. Click the lock icon in your browser's address bar</li>
              <li>2. Find "Camera" in the permissions list</li>
              <li>3. Change it from "Block" to "Allow"</li>
              <li>4. Refresh the page and try again</li>
            </ol>
          </div>
          <Button
            onClick={() => {
              setShowDeniedState(false);
              handleRequestPermission();
            }}
            className="w-full bg-red-600 hover:bg-red-700 text-white mt-4"
            disabled={isLoading}
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            {isLoading ? "Requesting..." : "Try Again"}
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-8 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 shadow-lg">
      <div className="flex flex-col items-center gap-4 text-center">
        <div className="w-16 h-16 bg-blue-200 rounded-full flex items-center justify-center">
          <Camera className="w-8 h-8 text-blue-600" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-blue-900 mb-2">Enable Camera for Live Try-On</h3>
          <p className="text-sm text-blue-700">
            We need access to your camera to show you how glasses look in real-time. Your camera feed is never recorded or stored.
          </p>
        </div>
        <Button
          onClick={handleRequestPermission}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white"
          disabled={isLoading}
        >
          <Camera className="w-4 h-4 mr-2" />
          {isLoading ? "Requesting..." : "Enable Camera"}
        </Button>
        <p className="text-xs text-blue-600">
          Your privacy is important. Camera access is only used for this session.
        </p>
      </div>
    </Card>
  );
}
