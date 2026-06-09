import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { Heart, Search, Zap } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

interface GlassesBrowserProps {
  onFrameSelect: (frameId: number) => void;
  selectedFrameId?: number;
}

const STYLES = [
  "aviator",
  "round",
  "square",
  "cat-eye",
  "wayfarer",
  "rimless",
  "clubmaster",
];

const COLORS = [
  "black",
  "brown",
  "gold",
  "silver",
  "rose-gold",
  "tortoiseshell",
];

export function GlassesBrowser({ onFrameSelect, selectedFrameId }: GlassesBrowserProps) {
  const [selectedStyle, setSelectedStyle] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch all frames
  const framesQuery = trpc.glasses.list.useQuery({
    style: selectedStyle || undefined,
    color: selectedColor || undefined,
  });

  // Fetch user favorites
  const favoritesQuery = trpc.favorites.list.useQuery();
  const favoriteIds = useMemo(
    () => new Set(favoritesQuery.data?.map(f => f.id) || []),
    [favoritesQuery.data]
  );

  // Favorite mutations
  const addFavoriteMutation = trpc.favorites.add.useMutation({
    onSuccess: () => {
      favoritesQuery.refetch();
      toast.success("❤️ Added to favorites");
    },
    onError: () => {
      toast.error("Failed to add to favorites");
    },
  });

  const removeFavoriteMutation = trpc.favorites.remove.useMutation({
    onSuccess: () => {
      favoritesQuery.refetch();
      toast.success("Removed from favorites");
    },
    onError: () => {
      toast.error("Failed to remove from favorites");
    },
  });

  // Filter frames by search query
  const filteredFrames = useMemo(() => {
    if (!framesQuery.data) return [];
    return framesQuery.data.filter(frame =>
      frame.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [framesQuery.data, searchQuery]);

  const handleToggleFavorite = (frameId: number, isFavorited: boolean) => {
    if (isFavorited) {
      removeFavoriteMutation.mutate({ frameId });
    } else {
      addFavoriteMutation.mutate({ frameId });
    }
  };

  return (
    <div className="space-y-6">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-3 w-5 h-5 text-blue-400" />
        <Input
          placeholder="Search glasses..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          className="w-full pl-10 border-2 border-blue-300 focus:border-blue-500 focus:ring-blue-500 font-semibold"
        />
      </div>

      {/* Filters */}
      <div className="space-y-5">
        {/* Style Filter */}
        <div>
          <h3 className="text-sm font-bold text-blue-900 mb-3 flex items-center gap-2">
            <Zap className="w-4 h-4 text-blue-600" />
            Style
          </h3>
          <div className="flex flex-wrap gap-2">
            <Button
              variant={selectedStyle === null ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedStyle(null)}
              className={selectedStyle === null ? "bg-gradient-to-r from-blue-600 to-blue-500 text-white font-bold shadow-md" : "border-2 border-blue-300 text-blue-600 hover:bg-blue-50 font-semibold"}
            >
              All
            </Button>
            {STYLES.map(style => (
              <Button
                key={style}
                variant={selectedStyle === style ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedStyle(style)}
                className={`capitalize font-semibold ${
                  selectedStyle === style
                    ? "bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-md"
                    : "border-2 border-blue-300 text-blue-600 hover:bg-blue-50"
                }`}
              >
                {style}
              </Button>
            ))}
          </div>
        </div>

        {/* Color Filter */}
        <div>
          <h3 className="text-sm font-bold text-blue-900 mb-3 flex items-center gap-2">
            <div className="w-4 h-4 bg-gradient-to-r from-blue-600 to-blue-400 rounded-full"></div>
            Color
          </h3>
          <div className="flex flex-wrap gap-2">
            <Button
              variant={selectedColor === null ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedColor(null)}
              className={selectedColor === null ? "bg-gradient-to-r from-blue-600 to-blue-500 text-white font-bold shadow-md" : "border-2 border-blue-300 text-blue-600 hover:bg-blue-50 font-semibold"}
            >
              All
            </Button>
            {COLORS.map(color => (
              <Button
                key={color}
                variant={selectedColor === color ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedColor(color)}
                className={`capitalize font-semibold ${
                  selectedColor === color
                    ? "bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-md"
                    : "border-2 border-blue-300 text-blue-600 hover:bg-blue-50"
                }`}
              >
                {color}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Frames Grid */}
      <div>
        <h3 className="text-sm font-bold text-blue-900 mb-4 flex items-center gap-2">
          <span className="inline-flex items-center justify-center w-6 h-6 bg-gradient-to-br from-blue-600 to-blue-500 text-white text-xs font-bold rounded-full">
            {filteredFrames.length}
          </span>
          Glasses Frames
        </h3>

        {framesQuery.isLoading ? (
          <div className="flex flex-col items-center justify-center py-12 space-y-3">
            <Spinner className="w-8 h-8 text-blue-600" />
            <p className="text-sm font-semibold text-blue-700">Loading glasses...</p>
          </div>
        ) : filteredFrames.length === 0 ? (
          <div className="text-center py-12 bg-blue-50 rounded-lg border-2 border-dashed border-blue-300">
            <p className="text-blue-700 font-semibold">No frames found</p>
            <p className="text-blue-600 text-sm mt-1">Try adjusting your filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 max-h-[500px] overflow-y-auto pr-2">
            {filteredFrames.map(frame => {
              const isFavorited = favoriteIds.has(frame.id);
              const isSelected = selectedFrameId === frame.id;

              return (
                <Card
                  key={frame.id}
                  className={`p-3 cursor-pointer transition-all duration-200 border-2 ${
                    isSelected
                      ? "ring-2 ring-blue-500 bg-gradient-to-br from-blue-100 to-blue-50 border-blue-500 shadow-lg"
                      : "border-blue-200 hover:border-blue-400 hover:shadow-md hover:scale-105"
                  }`}
                  onClick={() => onFrameSelect(frame.id)}
                >
                  <div className="space-y-2">
                    {/* Frame Image */}
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg h-24 flex items-center justify-center overflow-hidden border border-blue-200">
                      <img
                        src={frame.imageUrl}
                        alt={frame.name}
                        loading="lazy"
                        className="max-w-full max-h-full object-contain"
                      />
                    </div>

                    {/* Frame Info */}
                    <div className="space-y-2">
                      <p className="text-xs font-bold text-blue-900 truncate">
                        {frame.name}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex gap-1 text-xs text-blue-700 font-semibold">
                          <span className="capitalize bg-blue-100 px-2 py-1 rounded">{frame.style}</span>
                          <span className="capitalize bg-blue-100 px-2 py-1 rounded">{frame.color}</span>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleToggleFavorite(frame.id, isFavorited);
                          }}
                          className={`transition-all duration-200 transform hover:scale-125 ${
                            isFavorited
                              ? "text-red-500"
                              : "text-blue-300 hover:text-red-500"
                          }`}
                        >
                          <Heart
                            className="w-4 h-4"
                            fill={isFavorited ? "currentColor" : "none"}
                          />
                        </button>
                      </div>
                    </div>

                    {/* Selection Indicator */}
                    {isSelected && (
                      <div className="text-xs font-bold text-blue-600 text-center py-1 bg-blue-100 rounded">
                        ✓ Selected
                      </div>
                    )}
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
