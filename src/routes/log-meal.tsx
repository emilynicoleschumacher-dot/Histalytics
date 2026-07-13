import { createFileRoute, useNavigate, useSearch } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { PageHeader } from "~/components/shared";
import { Card, CardBody, CardHeader } from "~/components/Card";
import { Button } from "~/components/Button";
import { Input, Textarea, Select } from "~/components/Input";
import { IngredientInput } from "~/components/IngredientInput";
import { ActivityLevelToggle } from "~/components/ActivityLevelToggle";
import {
  logMeal,
  saveFavorite,
  removeFavorite,
  getFavorites,
  isFavorite,
  getMealById,
  updateMeal,
  utcToLocalDatetime,
  type ActivityLevel,
} from "~/lib/data-store";
import { FavoritesBar, SaveFavoriteToggle } from "~/components/FavoritesBar";

export const Route = createFileRoute("/log-meal")({
  component: LogMeal,
  validateSearch: (search: Record<string, unknown>) => ({
    edit: typeof search.edit === "string" ? search.edit : undefined,
  }),
});

function nowISO() {
  return new Date().toISOString().slice(0, 16);
}

function LogMeal() {
  const navigate = useNavigate();
  const { edit } = useSearch({ from: Route.id });

  const [foodName, setFoodName] = useState("");
  const [mealType, setMealType] = useState("");
  const [portionSize, setPortionSize] = useState("");
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [activityLevel, setActivityLevel] = useState<ActivityLevel>(null);
  const [notes, setNotes] = useState("");
  const [loggedAt, setLoggedAt] = useState(nowISO());
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [favoriteVersion, setFavoriteVersion] = useState(0);
  const [editId, setEditId] = useState<string | undefined>(edit);

  // Load existing entry for editing
  useEffect(() => {
    if (editId) {
      const entry = getMealById(editId);
      if (entry) {
        setFoodName(entry.foodName);
        if (entry.mealType) setMealType(entry.mealType);
        if (entry.portionSize) setPortionSize(entry.portionSize);
        if (entry.ingredients) setIngredients(entry.ingredients);
        if (entry.activityLevel) setActivityLevel(entry.activityLevel);
        if (entry.notes) setNotes(entry.notes);
        setLoggedAt(utcToLocalDatetime(entry.loggedAt));
      }
    }
  }, [editId]);

  const label = foodName.trim();
  const isFav = label ? isFavorite("meal", label) : false;

  const handleFavoriteToggle = () => {
    if (!label) return;
    if (isFav) {
      const favs = getFavorites().filter((f) => f.type === "meal" && f.label === label);
      favs.forEach((f) => removeFavorite(f.id));
    } else {
      saveFavorite({
        label,
        type: "meal",
        foodName: label,
        mealType: mealType || undefined,
        ingredients: ingredients.length > 0 ? ingredients.join(", ") : undefined,
        portionSize: portionSize || undefined,
        notes: notes || undefined,
      });
    }
    setFavoriteVersion((v) => v + 1);
  };

  const handleFavoriteSelect = (fav: { foodName?: string; mealType?: string; ingredients?: string; portionSize?: string; notes?: string }) => {
    if (fav.foodName) {
      setFoodName(fav.foodName);
      if (fav.mealType) setMealType(fav.mealType);
      if (fav.ingredients) setIngredients(fav.ingredients.split(",").map((i) => i.trim()).filter(Boolean));
      if (fav.portionSize) setPortionSize(fav.portionSize);
      if (fav.notes) setNotes(fav.notes);
      setFavoriteVersion((v) => v + 1);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!foodName.trim()) return;
    setSubmitting(true);

    const data = {
      foodName: foodName.trim(),
      mealType: mealType || null,
      portionSize: portionSize || null,
      ingredients: ingredients.length > 0 ? ingredients : null,
      activityLevel,
      notes: notes || null,
      loggedAt: loggedAt ? new Date(loggedAt).toISOString() : null,
    };

    if (editId) {
      updateMeal(editId, data);
    } else {
      await logMeal(data);
    }

    setSubmitting(false);
    setSuccess(true);
    setTimeout(() => {
      setSuccess(false);
      if (editId) {
        navigate({ to: "/history" });
      } else {
        setEditId(undefined);
        setFoodName("");
        setMealType("");
        setPortionSize("");
        setIngredients([]);
        setNotes("");
        setLoggedAt(nowISO());
      }
    }, 2000);
  };

  return (
    <div className="container-narrow py-8 max-w-2xl mx-auto">
      <PageHeader
        title={editId ? "Edit Meal" : "Log Meal"}
        description={editId ? "Update a logged meal entry." : "Track what you ate to identify trigger foods and ingredients."}
      >
        {editId && (
          <Button variant="ghost" onClick={() => navigate({ to: "/history" })}>
            Cancel
          </Button>
        )}
      </PageHeader>

      {success && (
        <div className="mb-6 p-4 rounded-lg bg-green-50 border border-green-200 text-green-700 text-sm font-medium">
          ✓ Meal {editId ? "updated" : "logged"} successfully!
        </div>
      )}

      <FavoritesBar type="meal" onSelect={handleFavoriteSelect} />

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card elevated>
          <CardHeader>
            <h2 className="text-base font-semibold text-text-primary">
              Meal Details
            </h2>
          </CardHeader>
          <CardBody className="space-y-5">
            <Input
              label="Food / Meal Name"
              placeholder="e.g. Grilled chicken salad, oatmeal with blueberries"
              value={foodName}
              onChange={(e) => setFoodName(e.target.value)}
              required
            />

            <div className="grid grid-cols-2 gap-4">
              <Select
                label="Meal Type"
                placeholder="Select meal type..."
                options={[
                  { value: "breakfast", label: "Breakfast" },
                  { value: "lunch", label: "Lunch" },
                  { value: "dinner", label: "Dinner" },
                  { value: "snack", label: "Snack" },
                  { value: "other", label: "Other" },
                ]}
                value={mealType}
                onChange={(e) => setMealType(e.target.value)}
              />

              <Input
                label="Portion Size"
                placeholder="e.g. 1 cup, 6 oz, large bowl"
                value={portionSize}
                onChange={(e) => setPortionSize(e.target.value)}
              />
            </div>

            <Input
              label="Date & Time"
              type="datetime-local"
              value={loggedAt}
              onChange={(e) => setLoggedAt(e.target.value)}
              helperText="When did you eat this?"
            />
          </CardBody>
        </Card>

        {/* Ingredient input */}
        <Card elevated>
          <CardHeader>
            <div className="flex items-center justify-between">
              <h2 className="text-base font-semibold text-text-primary">
                Ingredients
              </h2>
              {ingredients.length > 0 && (
                <span className="text-xs text-text-muted">
                  {ingredients.length} ingredient{ingredients.length !== 1 ? "s" : ""}
                </span>
              )}
            </div>
          </CardHeader>
          <CardBody>
            <IngredientInput
              label=""
              placeholder="Type an ingredient and press Enter, or paste a comma-separated list..."
              value={ingredients}
              onChange={setIngredients}
              helperText="The more ingredients you log, the better we can identify your triggers."
            />
          </CardBody>
        </Card>

        <ActivityLevelToggle
          value={activityLevel}
          onChange={setActivityLevel}
        />

        <Textarea
          label="Notes"
          placeholder="Preparation method, any reactions noticed, brand names..."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />

        <div className="flex items-center justify-between">
          <SaveFavoriteToggle
            label={label}
            isFavorite={isFav}
            onToggle={handleFavoriteToggle}
          />
          <div className="flex gap-3">
            <Button
              type="submit"
              size="lg"
              isLoading={submitting}
              disabled={!foodName.trim()}
            >
              {editId ? "Update Meal" : "Log Meal"}
            </Button>
            {!editId && (
              <Button
                type="button"
                variant="ghost"
                size="lg"
                onClick={() => navigate({ to: "/log-product" })}
              >
                Log product
              </Button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}