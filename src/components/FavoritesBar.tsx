import { useState } from "react";
import { Card, CardBody, CardHeader } from "~/components/Card";
import { Button } from "~/components/Button";
import { getFavorites, removeFavorite, type FavoriteEntry } from "~/lib/data-store";

interface FavoritesBarProps {
  type: "symptom" | "meal" | "supplement" | "product";
  onSelect: (favorite: FavoriteEntry) => void;
}

export function FavoritesBar({ type, onSelect }: FavoritesBarProps) {
  const [favorites, setFavorites] = useState(() => getFavorites().filter((f) => f.type === type));

  if (favorites.length === 0) return null;

  return (
    <Card elevated className="mb-6">
      <CardHeader>
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-text-primary">
            ⭐ Saved Favorites
          </h3>
          <span className="text-xs text-text-muted">{favorites.length} saved</span>
        </div>
      </CardHeader>
      <CardBody>
        <div className="flex flex-wrap gap-2">
          {favorites.map((fav) => (
            <div key={fav.id} className="group relative">
              <button
                type="button"
                onClick={() => onSelect(fav)}
                className="px-3 py-1.5 rounded-lg text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100 transition-colors"
              >
                {fav.label}
              </button>
              <button
                type="button"
                onClick={() => {
                  removeFavorite(fav.id);
                  setFavorites(getFavorites().filter((f) => f.type === type));
                }}
                className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-red-400 text-white text-[9px] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500"
                title="Remove favorite"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      </CardBody>
    </Card>
  );
}

interface SaveFavoriteToggleProps {
  label: string;
  isFavorite: boolean;
  onToggle: () => void;
}

export function SaveFavoriteToggle({ label, isFavorite, onToggle }: SaveFavoriteToggleProps) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
        isFavorite
          ? "bg-amber-100 text-amber-700 border border-amber-300"
          : "bg-gray-50 text-text-muted border border-border-light hover:bg-amber-50 hover:text-amber-600"
      }`}
    >
      <span>{isFavorite ? "⭐" : "☆"}</span>
      {isFavorite ? "Saved as favorite" : "Save as favorite"}
    </button>
  );
}