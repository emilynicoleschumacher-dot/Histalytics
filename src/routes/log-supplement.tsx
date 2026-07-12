import { createFileRoute, useNavigate, useSearch } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { PageHeader } from "~/components/shared";
import { Card, CardBody } from "~/components/Card";
import { Button } from "~/components/Button";
import { Input, Textarea } from "~/components/Input";
import {
  logSupplement,
  saveFavorite,
  removeFavorite,
  getFavorites,
  isFavorite,
  getSupplementById,
  updateSupplement,
} from "~/lib/data-store";
import { FavoritesBar, SaveFavoriteToggle } from "~/components/FavoritesBar";

export const Route = createFileRoute("/log-supplement")({
  component: LogSupplement,
  validateSearch: (search: Record<string, unknown>) => ({
    edit: typeof search.edit === "string" ? search.edit : undefined,
  }),
});

const COMMON_ADDITIVES = [
  "Microcrystalline Cellulose",
  "Magnesium Stearate",
  "Silicon Dioxide",
  "Titanium Dioxide",
  "Gelatin",
  "Stearic Acid",
  "Crosscarmellose Sodium",
  "Talc",
  "Propylene Glycol",
  "PEG",
  "Soy Lecithin",
  "Sugar / Dextrose",
];

function nowISO() {
  return new Date().toISOString().slice(0, 16);
}

function LogSupplement() {
  const navigate = useNavigate();
  const { edit } = useSearch({ from: Route.id });

  const [supplementName, setSupplementName] = useState("");
  const [brand, setBrand] = useState("");
  const [dosage, setDosage] = useState("");
  const [ingredients, setIngredients] = useState("");
  const [notes, setNotes] = useState("");
  const [loggedAt, setLoggedAt] = useState(nowISO());
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [favoriteVersion, setFavoriteVersion] = useState(0);
  const [editId, setEditId] = useState<string | undefined>(edit);

  // Load existing entry for editing
  useEffect(() => {
    if (editId) {
      const entry = getSupplementById(editId);
      if (entry) {
        setSupplementName(entry.supplementName);
        if (entry.brand) setBrand(entry.brand);
        if (entry.dosage) setDosage(entry.dosage);
        if (entry.ingredients) setIngredients(entry.ingredients);
        if (entry.notes) setNotes(entry.notes);
        setLoggedAt(entry.loggedAt.slice(0, 16));
      }
    }
  }, [editId]);

  const label = supplementName.trim();
  const isFav = label ? isFavorite("supplement", label) : false;

  const handleFavoriteToggle = () => {
    if (!label) return;
    if (isFav) {
      const favs = getFavorites().filter((f) => f.type === "supplement" && f.label === label);
      favs.forEach((f) => removeFavorite(f.id));
    } else {
      saveFavorite({
        label,
        type: "supplement",
        supplementName: label,
        brand: brand.trim() || undefined,
        dosage: dosage.trim() || undefined,
        notes: notes.trim() || undefined,
      });
    }
    setFavoriteVersion((v) => v + 1);
  };

  const handleFavoriteSelect = (fav: { supplementName?: string; brand?: string; dosage?: string; notes?: string }) => {
    if (fav.supplementName) {
      setSupplementName(fav.supplementName);
      if (fav.brand) setBrand(fav.brand);
      if (fav.dosage) setDosage(fav.dosage);
      if (fav.notes) setNotes(fav.notes);
      setFavoriteVersion((v) => v + 1);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supplementName.trim()) return;
    setSubmitting(true);

    const data = {
      supplementName: supplementName.trim(),
      brand: brand.trim() || null,
      dosage: dosage.trim() || null,
      ingredients: ingredients.trim() || null,
      notes: notes.trim() || null,
      loggedAt: loggedAt ? new Date(loggedAt).toISOString() : null,
    };

    if (editId) {
      updateSupplement(editId, data);
    } else {
      await logSupplement(data);
    }

    setSubmitting(false);
    setSuccess(true);
    setTimeout(() => {
      setSuccess(false);
      if (editId) {
        navigate({ to: "/history" });
      } else {
        setEditId(undefined);
        setSupplementName("");
        setBrand("");
        setDosage("");
        setIngredients("");
        setNotes("");
        setLoggedAt(nowISO());
      }
    }, 3000);
  };

  return (
    <div className="container-narrow py-8 max-w-2xl mx-auto">
      <PageHeader
        title={editId ? "Edit Supplement" : "Log Supplement"}
        description={editId ? "Update a logged supplement entry." : "Track supplements, vitamins, and medications. Additives and fillers can be hidden MCAS triggers."}
      >
        {editId && (
          <Button variant="ghost" onClick={() => navigate({ to: "/history" })}>
            Cancel
          </Button>
        )}
      </PageHeader>

      {success && (
        <div className="mb-6 p-4 rounded-lg bg-green-50 border border-green-200 text-green-700 text-sm font-medium">
          ✓ Supplement {editId ? "updated" : "logged"} successfully!
        </div>
      )}

      <FavoritesBar type="supplement" onSelect={handleFavoriteSelect} />

      <form onSubmit={handleSubmit} className="space-y-6">
        <Input
          label="Supplement Name"
          placeholder="e.g. Vitamin D3, Quercetin, DAO"
          value={supplementName}
          onChange={(e) => setSupplementName(e.target.value)}
          required
        />
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Brand"
            placeholder="e.g. Pure Encapsulations, NOW"
            value={brand}
            onChange={(e) => setBrand(e.target.value)}
          />
          <Input
            label="Dosage"
            placeholder="e.g. 500mg, 1 capsule, 2 sprays"
            value={dosage}
            onChange={(e) => setDosage(e.target.value)}
          />
        </div>
        <Input
          label="Date & Time"
          type="datetime-local"
          value={loggedAt}
          onChange={(e) => setLoggedAt(e.target.value)}
          helperText="When did you take this?"
        />
        <Textarea
          label="Ingredients List (fillers, binders, excipients)"
          placeholder="List all ingredients from the label. Many supplements contain hidden triggers like microcrystalline cellulose, magnesium stearate, etc."
          value={ingredients}
          onChange={(e) => setIngredients(e.target.value)}
          helperText="Separate ingredients with commas. Even 'inactive' ingredients matter for MCAS."
        />
        <Textarea
          label="Notes"
          placeholder="Any reaction after taking this supplement? How did you feel?"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
        <div className="flex items-center justify-between">
          <SaveFavoriteToggle
            label={label}
            isFavorite={isFav}
            onToggle={handleFavoriteToggle}
          />
          <Button
            type="submit"
            size="lg"
            isLoading={submitting}
            disabled={!supplementName.trim()}
          >
            {editId ? "Update Supplement" : "Log Supplement"}
          </Button>
        </div>
      </form>

      {/* Quick-reference: Common supplement additives that trigger MCAS */}
      <Card elevated className="mt-10">
        <CardBody>
          <h3 className="text-sm font-semibold text-text-primary mb-3">
            Common supplement additives known to trigger MCAS
          </h3>
          <div className="flex flex-wrap gap-2">
            {COMMON_ADDITIVES.map((additive) => (
              <button
                key={additive}
                type="button"
                className="px-3 py-1.5 rounded-lg text-xs font-medium bg-purple-50 text-purple-700 border border-purple-200 hover:bg-purple-100 transition-colors"
                onClick={() => {
                  setIngredients((prev) =>
                    prev ? `${prev}, ${additive}` : additive
                  );
                }}
              >
                + {additive}
              </button>
            ))}
          </div>
        </CardBody>
      </Card>
    </div>
  );
}