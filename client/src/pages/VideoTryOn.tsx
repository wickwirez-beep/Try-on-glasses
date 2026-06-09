/**
 * Video Try-On Page
 * Real-time camera streaming with face detection and glasses overlay
 */

import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Video, VideoOff, Glasses, AlertCircle, Download, RotateCcw } from "lucide-react";
import { Link } from "wouter";
import { useVideoTryOn } from "@/hooks/useVideoTryOn";
import { trpc } from "@/lib/trpc";
import { CameraPermissionRequest } from "@/components/CameraPermissionRequest";

export default function VideoTryOn() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const [selectedFrameId, setSelectedFrameId] = useState<number | null>(null);
  const [rotation, setRotation] = useState(0);
  const [brightness, setBrightness] = useState(100);
  const [isMirrored, setIsMirrored] = useState(false);
  const [permissionRequested, setPermissionRequested] = useState(false);

  // Fetch glasses frames
  const { data: frames = [] } = trpc.glasses.list.useQuery({});

  // Video try-on hook
  const videoTryOn = useVideoTryOn({
    canvasRef,
    videoRef,
    glassesImageUrl: selectedFrameId
      ? frames.find((f) => f.id === selectedFrameId)?.imageUrl
      : undefined,
    rotation,
    brightness,
    isMirrored,
  });

  const selectedFrame = frames.find((f) => f.id === selectedFrameId);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* Navigation */}
      <nav className="border-b border-slate-200 dark:border-slate-700 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md sticky top-0 z-50 shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/try-on" className="flex items-center gap-3 hover:opacity-80 transition">
            <div className="w-10 h-10 bg-gradient-to-br from-slate-600 to-slate-400 rounded-xl flex items-center justify-center shadow-lg">
              <Glasses className="w-6 h-6 text-white" />
            </div>
            <div className="flex flex-col">
              <h1
                className="text-2xl font-black"
                style={{
                  WebkitTextStroke: "1.5px white",
                  color: "rgb(71, 85, 105)",
                }}
              >
                The Look
              </h1>
              <p className="text-xs font-semibold text-slate-600 dark:text-slate-400 -mt-1">
                Video Try-On
              </p>
            </div>
          </Link>
          <Link href="/try-on">
            <Button variant="outline" size="sm" className="border-slate-300 dark:border-slate-600">
              Back to Photo
            </Button>
          </Link>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Video Stream */}
          <div className="lg:col-span-2">
            <Card className="overflow-hidden shadow-lg">
              <div className="relative bg-black">
                {/* Hidden video element */}
                <video
                  ref={videoRef}
                  className="hidden"
                  playsInline
                  muted
                />

                {/* Canvas for rendering */}
                <canvas
                  ref={canvasRef}
                  className="w-full h-auto bg-slate-900"
                  style={{ maxHeight: "600px", objectFit: "contain" }}
                />

                {/* Status Overlay */}
                {videoTryOn.isStreaming && (
                  <div className="absolute top-4 left-4 flex items-center gap-2 bg-black/70 px-3 py-2 rounded-lg">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-xs font-semibold text-white">{videoTryOn.fps} FPS</span>
                  </div>
                )}

                {/* Permission Request Overlay */}
                {!permissionRequested && !videoTryOn.isCameraReady && !videoTryOn.isStreaming && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm">
                    <div className="w-full max-w-sm mx-4">
                      <CameraPermissionRequest
                        onRetry={() => {
                          setPermissionRequested(true);
                          videoTryOn.toggleStreaming();
                        }}
                        isLoading={videoTryOn.isStreaming}
                      />
                    </div>
                  </div>
                )}

                {/* Error Message */}
                {videoTryOn.error && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/80">
                    <div className="flex flex-col items-center gap-3 text-center">
                      <AlertCircle className="w-12 h-12 text-red-500" />
                      <p className="text-white font-semibold">{videoTryOn.error}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Controls */}
              <div className="p-6 bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 space-y-3">
                <Button
                  onClick={videoTryOn.toggleStreaming}
                  className={`w-full font-semibold text-lg py-6 ${
                    videoTryOn.isStreaming
                      ? "bg-red-600 hover:bg-red-700"
                      : "bg-green-600 hover:bg-green-700"
                  }`}
                >
                  {videoTryOn.isStreaming ? (
                    <>
                      <VideoOff className="w-5 h-5 mr-2" />
                      Stop Camera
                    </>
                  ) : (
                    <>
                      <Video className="w-5 h-5 mr-2" />
                      Start Camera
                    </>
                  )}
                </Button>

                {/* Camera Controls */}
                {videoTryOn.isStreaming && (
                  <div className="space-y-3 pt-3 border-t border-slate-200 dark:border-slate-700">
                    {/* Brightness Control */}
                    <div>
                      <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-2">
                        Brightness: {brightness}%
                      </label>
                      <input
                        type="range"
                        min="50"
                        max="150"
                        value={brightness}
                        onChange={(e) => setBrightness(Number(e.target.value))}
                        className="w-full"
                      />
                    </div>

                    {/* Flip Camera Button */}
                    <Button
                      variant="outline"
                      onClick={() => setIsMirrored(!isMirrored)}
                      className="w-full border-slate-300 dark:border-slate-600"
                    >
                      <RotateCcw className="w-4 h-4 mr-2" />
                      {isMirrored ? "Unflip" : "Flip"} Camera
                    </Button>

                    {/* Capture Frame Button */}
                    <Button
                      onClick={() => {
                        if (canvasRef.current) {
                          const link = document.createElement("a");
                          link.href = canvasRef.current.toDataURL("image/png");
                          link.download = `the-look-${Date.now()}.png`;
                          link.click();
                        }
                      }}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Capture Frame
                    </Button>
                  </div>
                )}
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Rotation Control */}
            <Card className="p-6 shadow-lg">
              <h3 className="font-bold text-lg mb-4 text-slate-900 dark:text-white">
                Face Rotation
              </h3>
              <div className="space-y-4">
                <Slider
                  value={[rotation]}
                  onValueChange={(value) => setRotation(value[0])}
                  min={-30}
                  max={30}
                  step={1}
                  className="w-full"
                />
                <div className="text-center">
                  <span className="text-2xl font-bold text-slate-600 dark:text-slate-300">
                    {rotation}°
                  </span>
                </div>
              </div>
            </Card>

            {/* Selected Frame */}
            {selectedFrame && (
              <Card className="p-6 shadow-lg border-2 border-slate-400 dark:border-slate-600">
                <h3 className="font-bold text-lg mb-4 text-slate-900 dark:text-white">
                  Selected Frame
                </h3>
                <div className="space-y-3">
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    <strong>Style:</strong> {selectedFrame.style}
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    <strong>Color:</strong> {selectedFrame.color}
                  </p>
                  <Button
                    variant="outline"
                    onClick={() => setSelectedFrameId(null)}
                    className="w-full mt-4"
                  >
                    Clear Selection
                  </Button>
                </div>
              </Card>
            )}

            {/* Frames List */}
            <Card className="p-6 shadow-lg">
              <h3 className="font-bold text-lg mb-4 text-slate-900 dark:text-white">
                Glasses Frames
              </h3>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {frames.map((frame) => (
                  <button
                    key={frame.id}
                    onClick={() => setSelectedFrameId(frame.id)}
                    className={`w-full text-left p-3 rounded-lg transition ${
                      selectedFrameId === frame.id
                        ? "bg-slate-400 dark:bg-slate-600 text-white"
                        : "bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-900 dark:text-white"
                    }`}
                  >
                    <p className="font-semibold text-sm">{frame.style}</p>
                    <p className="text-xs text-opacity-75">{frame.color}</p>
                  </button>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
