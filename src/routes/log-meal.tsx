import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader } from "~/components/shared";
import { Card, CardBody, CardHeader } from "~/components/Card";
import { Button } from "~/components/Button";
import { Input, Textarea, Select } from "~/components/Input";
import { IngredientInput } from "~/components/IngredientInput";
import { logMeal } from "~/lib/data-store";

export const Route = createFileRoute("/log-meal")({
  component: LogMeal,
});

function LogMeal() {
  const navigate = useNavigate();
  const [foodName, setFoodName] = useState("");
  const [mealType, setMealType] = useState("");
  const [portionSize, setPortionSize] = useState("");
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!foodName.trim()) return;
    setSubmitting(true);
    await logMeal({
      foodName: foodName.trim(),
      mealType: mealType || null,
      portionSize: portionSize || null,
      notes: notes || null,
    });
    setSubmitting(false);
    setSuccess(true);
    setTimeout(() => {
      setSuccess(false);
      setFoodName("");
      setMealType("");
      setPortionSize("");
      setIngredients([]);
      setNotes("");
    }, 2000);
  };

  return (
    <div className="container-narrow py-8 max-w-2xl mx-auto">
      <PageHeader
        title="Log Meal"
        description="Track what you ate to identify trigger foods and ingredients."
      />

      {success && (
        <div className="mb-6 p-4 rounded-lg bg-green-50 border border-green-200 text-green-700 text-sm font-medium">
          ✓ Meal logged successfully!
        </div>
      )}

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

        <Textarea
          label="Notes"
          placeholder="Preparation method, any reactions noticed, brand names..."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />

        <div className="flex gap-3">
          <Button
            type="submit"
            size="lg"
            className="flex-1"
            isLoading={submitting}
            disabled={!foodName.trim()}
          >
            Log Meal
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="lg"
            onClick={() => navigate({ to: "/log-product" })}
          >
            Log product
          </Button>
        </div>
      </form>
    </div>
  );
}