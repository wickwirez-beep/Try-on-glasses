import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "sonner";
import { useGlassesOverlay, useFaceDetection } from "@/hooks/useFaceDetection";
import { GlassesBrowser } from "@/components/GlassesBrowser";
import { trpc } from "@/lib/trpc";
import { Upload, RotateCw, Download, Heart, Share2, ArrowLeft, Check, Glasses } from "lucide-react";
import { Link } from "wouter";

interface TryOnState {
  uploadedImageUrl: string | null;
  selectedFrameId: number | null;
  rotation: number;
}

export default function TryOn() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [state, setState] = useState<TryOnState>({
    uploadedImageUrl: null,
    selectedFrameId: null,
    rotation: 0,
  });

  const [selectedFrame, setSelectedFrame] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Face detection
  const { result: faceResult, loading: faceLoading, error: faceError } = useFaceDetection(
    state.uploadedImageUrl || undefined
  );

  // Glasses overlay
  const { isRendering, renderError } = useGlassesOverlay(
    canvasRef as React.RefObject<HTMLCanvasElement>,
    state.uploadedImageUrl,
    selectedFrame?.imageUrl || null,
    state.rotation
  );

  // Fetch selected frame details
  const frameQuery = trpc.glasses.getById.useQuery(
    { id: state.selectedFrameId || 0 },
    { enabled: !!state.selectedFrameId }
  );

  useEffect(() => {
    if (frameQuery.data) {
      setSelectedFrame(frameQuery.data);
    }
  }, [frameQuery.data]);

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setIsProcessing(true);

      if (!file.type.startsWith("image/")) {
        toast.error("Please upload an image file");
        return;
      }

      if (file.size > 10 * 1024 * 1024) {
        toast.error("Image must be smaller than 10MB");
        return;
      }

      const imageUrl = URL.createObjectURL(file);
      setState(prev => ({
        ...prev,
        uploadedImageUrl: imageUrl,
        rotation: 0,
      }));

      toast.success("Photo uploaded successfully");
    } catch (error) {
      toast.error("Failed to upload image");
      console.error(error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRotationChange = (value: number[]) => {
    setState(prev => ({
      ...prev,
      rotation: value[0],
    }));
  };

  const handleResetRotation = () => {
    setState(prev => ({
      ...prev,
      rotation: 0,
    }));
  };

  const handleDownloadResult = () => {
    if (!canvasRef.current) {
      toast.error("No image to download");
      return;
    }

    try {
      const link = document.createElement("a");
      link.href = canvasRef.current.toDataURL("image/png", 1.0);
      link.download = `the-look-${Date.now()}.png`;
      link.click();
      toast.success("Image downloaded successfully");
    } catch (error) {
      toast.error("Failed to download image");
      console.error(error);
    }
  };

  const handleSaveResult = () => {
    if (!canvasRef.current || !state.selectedFrameId) {
      toast.error("No try-on result to save");
      return;
    }

    try {
      const resultImageUrl = canvasRef.current.toDataURL("image/png");
      toast.success("Try-on result saved to your collection");
    } catch (error) {
      toast.error("Failed to save result");
      console.error(error);
    }
  };

  const handleShareResult = () => {
    if (!canvasRef.current) {
      toast.error("No image to share");
      return;
    }

    try {
      const resultImageUrl = canvasRef.current.toDataURL("image/png");
      const shareText = `Check out my virtual glasses try-on! I found the perfect look with ${selectedFrame?.name} on The Look.`;

      if (navigator.share) {
        navigator.share({
          title: "The Look - Virtual Try-On",
          text: shareText,
          url: window.location.origin,
        });
      } else {
        const shareUrl = `${window.location.origin}?frame=${state.selectedFrameId}`;
        navigator.clipboard.writeText(shareUrl);
        toast.success("Share link copied to clipboard");
      }
    } catch (error) {
      toast.error("Failed to share");
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100">
      {/* Navigation */}
      <nav className="border-b-2 border-blue-300 bg-white/95 backdrop-blur-md sticky top-0 z-40 shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition">
            <ArrowLeft className="w-5 h-5 text-blue-600" />
            <span className="text-sm font-bold text-blue-700">Back Home</span>
          </Link>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-500 rounded-lg flex items-center justify-center shadow-md">
              <Glasses className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-2xl font-black drop-shadow-sm" style={{
              WebkitTextStroke: '1.5px white',
              color: 'rgb(37, 99, 235)',
              textShadow: '0 0 0 2px rgba(147, 197, 253, 0.6), 0 0 0 4px rgba(191, 219, 254, 0.4)'
            }}>
              The Look
            </h1>
          </div>
          <Link href="/about" className="text-sm font-bold text-blue-600 hover:text-blue-700 bg-blue-50 px-3 py-1 rounded-full">
            About
          </Link>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Panel - Upload & Rotation */}
          <div className="lg:col-span-1">
            <Card className="p-6 sticky top-24 shadow-lg border-blue-200 bg-white">
              <h2 className="text-lg font-bold text-blue-900 mb-1">Upload Photo</h2>
              <p className="text-xs text-blue-600 mb-4">Clear, well-lit selfie works best</p>

              {!state.uploadedImageUrl ? (
                <button
                  onClick={() => fileInputRef.current?.click()}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      fileInputRef.current?.click();
                    }
                  }}
                  className="w-full border-2 border-dashed border-blue-300 rounded-lg p-6 text-center cursor-pointer hover:border-blue-500 hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 transition bg-blue-50/30"
                  aria-label="Upload photo for glasses try-on"
                >
                  <div className="flex justify-center mb-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-400 rounded-lg flex items-center justify-center">
                      <Upload className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <p className="text-sm font-bold text-blue-900">Click to upload</p>
                  <p className="text-xs text-blue-600 mt-2">PNG, JPG • Up to 10MB</p>
                </button>
              ) : (
                <div className="space-y-3">
                  <div className="relative rounded-lg overflow-hidden border-2 border-blue-200 shadow-md">
                    <img
                      src={state.uploadedImageUrl}
                      alt="Uploaded"
                      className="w-full rounded-lg"
                    />
                    {faceLoading && (
                      <div className="absolute inset-0 bg-black/20 flex items-center justify-center rounded-lg">
                        <Spinner className="w-6 h-6 text-white" />
                      </div>
                    )}
                  </div>
                  {faceResult && (
                    <div className="space-y-2">
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                        <div className="flex items-center gap-2">
                          <Check className="w-4 h-4 text-blue-600" />
                          <div>
                            <p className="text-xs font-bold text-blue-900">Face detected</p>
                            <p className="text-xs text-blue-700">Ready to try on glasses</p>
                          </div>
                        </div>
                      </div>

                      {/* Quality Score Display */}
                      <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-lg p-3 space-y-2">
                        <div className="flex items-center justify-between">
                          <p className="text-xs font-bold text-blue-900">Detection Quality</p>
                          <span className={`text-xs font-bold px-2 py-1 rounded ${
                            faceResult.qualityLevel === 'excellent' ? 'bg-green-100 text-green-700' :
                            faceResult.qualityLevel === 'good' ? 'bg-blue-100 text-blue-700' :
                            faceResult.qualityLevel === 'fair' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-red-100 text-red-700'
                          }`}>
                            {faceResult.qualityLevel.charAt(0).toUpperCase() + faceResult.qualityLevel.slice(1)}
                          </span>
                        </div>
                        
                        {/* Quality Score Bar */}
                        <div className="space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-blue-700">Score</span>
                            <span className="text-xs font-bold text-blue-900">{Math.round(faceResult.qualityScore)}%</span>
                          </div>
                          <div className="w-full bg-blue-200 rounded-full h-2 overflow-hidden">
                            <div
                              className={`h-full transition-all duration-300 ${
                                faceResult.qualityScore >= 85 ? 'bg-green-500' :
                                faceResult.qualityScore >= 70 ? 'bg-blue-500' :
                                faceResult.qualityScore >= 50 ? 'bg-yellow-500' :
                                'bg-red-500'
                              }`}
                              style={{ width: `${faceResult.qualityScore}%` }}
                            />
                          </div>
                        </div>

                        {/* Confidence Metrics */}
                        <div className="space-y-1 pt-1 border-t border-blue-300">
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-blue-700">Detection</span>
                            <span className="font-bold text-blue-900">{Math.round(faceResult.confidence * 100)}%</span>
                          </div>
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-blue-700">Presence</span>
                            <span className="font-bold text-blue-900">{Math.round(faceResult.facePresenceConfidence * 100)}%</span>
                          </div>
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-blue-700">Tracking</span>
                            <span className="font-bold text-blue-900">{Math.round(faceResult.trackingConfidence * 100)}%</span>
                          </div>
                        </div>

                        {/* Quality Feedback */}
                        {faceResult.qualityFeedback.length > 0 && (
                          <div className="pt-2 border-t border-blue-300 space-y-1">
                            <p className="text-xs font-bold text-blue-900">Tips to improve:</p>
                            {faceResult.qualityFeedback.map((feedback, idx) => (
                              <div key={idx} className="flex items-start gap-2">
                                <span className="text-blue-600 text-xs mt-0.5">•</span>
                                <p className="text-xs text-blue-700">{feedback}</p>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full border-blue-300 text-blue-600 hover:bg-blue-50"
                  >
                    Change Photo
                  </Button>
                </div>
              )}

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />

              {/* Rotation Controls */}
              {state.uploadedImageUrl && (
                <div className="mt-6 pt-6 border-t border-blue-200">
                  <h3 className="text-sm font-bold text-blue-900 mb-3">Face Angle</h3>
                  <div className="space-y-3">
                    <Slider
                      value={[state.rotation]}
                      onValueChange={handleRotationChange}
                      min={-30}
                      max={30}
                      step={1}
                      className="w-full"
                    />
                    <div className="flex items-center justify-between text-xs text-blue-700">
                      <span>Left</span>
                      <span className="font-bold text-blue-900 bg-blue-100 px-3 py-1 rounded">{state.rotation}°</span>
                      <span>Right</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleResetRotation}
                      className="w-full text-blue-600 hover:bg-blue-50"
                    >
                      <RotateCw className="w-4 h-4 mr-2" />
                      Reset
                    </Button>
                  </div>
                </div>
              )}

              {/* Status Messages */}
              {faceLoading && (
                <div className="mt-4 p-3 bg-blue-100 rounded-lg flex items-center gap-2 border border-blue-300">
                  <Spinner className="w-4 h-4 text-blue-600" />
                  <p className="text-sm font-medium text-blue-900">Detecting face...</p>
                </div>
              )}

              {faceError && (
                <div className="mt-4 p-3 bg-red-50 rounded-lg border border-red-200">
                  <p className="text-sm font-bold text-red-700">Face Detection</p>
                  <p className="text-xs text-red-600 mt-1">{faceError}</p>
                </div>
              )}
            </Card>
          </div>

          {/* Center Panel - Try-On Canvas */}
          <div className="lg:col-span-2 flex flex-col">
            <Card className="p-8 shadow-lg border-blue-200 bg-white flex-1">
              <h2 className="text-lg font-bold text-blue-900 mb-4">Try-On Preview</h2>

              {state.uploadedImageUrl && selectedFrame ? (
                <div className="space-y-4">
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg overflow-hidden border-2 border-blue-200 flex items-center justify-center shadow-md" style={{ minHeight: "500px" }}>
                    <canvas
                      ref={canvasRef}
                      className="max-w-full max-h-full"
                      style={{ maxHeight: "500px", objectFit: "contain" }}
                    />
                  </div>

                  {isRendering && (
                    <div className="flex items-center justify-center p-4 bg-blue-100 rounded-lg border border-blue-300">
                      <Spinner className="w-4 h-4 mr-2 text-blue-600" />
                      <p className="text-sm font-medium text-blue-900">Rendering glasses...</p>
                    </div>
                  )}

                  {renderError && (
                    <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                      <p className="text-sm font-bold text-red-700">Rendering Error</p>
                      <p className="text-sm text-red-600 mt-1">{renderError}</p>
                    </div>
                  )}

                  <div className="flex gap-2 flex-col">
                    <Button
                      onClick={handleDownloadResult}
                      size="lg"
                      className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-semibold shadow-md"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download Result
                    </Button>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="lg"
                        className="flex-1 border-blue-300 text-blue-600 hover:bg-blue-50 font-semibold"
                        onClick={handleSaveResult}
                      >
                        <Heart className="w-4 h-4 mr-2" />
                        Save
                      </Button>
                      <Button
                        variant="outline"
                        size="lg"
                        className="flex-1 border-blue-300 text-blue-600 hover:bg-blue-50 font-semibold"
                        onClick={handleShareResult}
                      >
                        <Share2 className="w-4 h-4 mr-2" />
                        Share
                      </Button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-12 text-center border-2 border-dashed border-blue-300 flex items-center justify-center" style={{ minHeight: "500px" }}>
                  <div>
                    <p className="text-blue-900 font-semibold text-lg">
                      {!state.uploadedImageUrl
                        ? "Upload a photo to get started"
                        : "Select a frame to try on"}
                    </p>
                    <p className="text-blue-700 text-sm mt-2">
                      {!state.uploadedImageUrl
                        ? "Choose a clear, well-lit selfie"
                        : "Browse the glasses on the right"}
                    </p>
                  </div>
                </div>
              )}
            </Card>
          </div>

          {/* Right Panel - Glasses Browser */}
          <div className="lg:col-span-1">
            <Card className="p-6 sticky top-24 shadow-lg border-blue-200 bg-white max-h-[calc(100vh-120px)] overflow-y-auto">
              <h2 className="text-lg font-bold text-blue-900 mb-4">Browse Glasses</h2>
              <GlassesBrowser
                onFrameSelect={(frameId) => {
                  setState(prev => ({ ...prev, selectedFrameId: frameId }));
                }}
                selectedFrameId={state.selectedFrameId || undefined}
              />
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
