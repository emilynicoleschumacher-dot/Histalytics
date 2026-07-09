import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader, EmptyState } from "~/components/shared";
import { Card, CardBody, CardHeader } from "~/components/Card";
import { Badge } from "~/components/Badge";
import { Button } from "~/components/Button";
import { Input } from "~/components/Input";

export const Route = createFileRoute("/trigger-ingredients")({
  component: TriggerIngredients,
});

const defaultTriggerIngredients = [
  { name: "Aged cheese", category: "food", severity: "severe", notes: "Causes headache and flushing within 2 hours" },
  { name: "Soy sauce", category: "food", severity: "severe", notes: "High histamine, causes severe flushing" },
  { name: "Tomato", category: "food", severity: "moderate", notes: "Histamine liberator, causes brain fog" },
  { name: "Chocolate", category: "food", severity: "moderate", notes: "Causes palpitations and anxiety" },
  { name: "Fragrance", category: "chemical", severity: "severe", notes: "Found in many lotions and shampoos" },
  { name: "Sulfites", category: "preservative", severity: "moderate", notes: "Wine, dried fruits, some medications" },
  { name: "Avocado", category: "food", severity: "mild", notes: "High histamine, causes mild itching" },
  { name: "Spinach", category: "food", severity: "mild", notes: "High histamine, mild reaction" },
];

const categories = [
  { value: "all", label: "All categories" },
  { value: "food", label: "Food ingredients" },
  { value: "chemical", label: "Chemicals / Fragrances" },
  { value: "preservative", label: "Preservatives / Additives" },
  { value: "other", label: "Other" },
];

function TriggerIngredients() {
  const [filter, setFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [ingredients, setIngredients] = useState(defaultTriggerIngredients);

  const filteredIngredients = ingredients.filter((ing) => {
    if (filter !== "all" && ing.category !== filter) return false;
    if (searchQuery && !ing.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const removeIngredient = (name: string) => {
    setIngredients((prev) => prev.filter((i) => i.name !== name));
  };

  const categoryLabels: Record<string, string> = {
    food: "Food",
    chemical: "Chemical / Fragrance",
    preservative: "Preservative",
    other: "Other",
  };

  const categoryColors: Record<string, string> = {
    food: "bg-brand-50 text-brand-700 border-brand-200",
    chemical: "bg-coral-50 text-coral-700 border-coral-200",
    preservative: "bg-yellow-50 text-yellow-700 border-yellow-200",
    other: "bg-gray-50 text-gray-600 border-gray-200",
  };

  return (
    <div className="container-narrow py-8 max-w-3xl">
      <PageHeader
        title="Trigger Ingredients"
        description="Manage ingredients you've identified as personal triggers. Products containing these will show warnings."
      >
        <Badge variant="teal" dot>
          {ingredients.length} tracked
        </Badge>
      </PageHeader>

      {/* Info card */}
      <Card className="mb-6 p-4 sm:p-5 bg-gradient-to-r from-coral-50/50 to-brand-50/50 border-coral-100/50">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-coral-100 text-coral-500 flex items-center justify-center shrink-0">
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
            </svg>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-text-primary mb-1">
              How trigger ingredients work
            </h3>
            <p className="text-xs text-text-muted leading-relaxed">
              When you log meals or products with ingredients, Histalytics
              cross-references them against this list. Any product
              recommendation containing a trigger ingredient will display a
              warning badge. You can add or remove ingredients at any time.
            </p>
          </div>
        </div>
      </Card>

      {/* Search and filter */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="flex-1">
          <Input
            placeholder="Search ingredients..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            suffix={
              <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              </svg>
            }
          />
        </div>
        <div className="flex gap-1.5 overflow-x-auto pb-1">
          {categories.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setFilter(cat.value)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap border transition-all ${
                filter === cat.value
                  ? "bg-brand-100 border-brand-300 text-brand-700"
                  : "bg-surface-card border-border-default text-text-secondary hover:border-brand-200"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Ingredient list */}
      {filteredIngredients.length === 0 ? (
        <EmptyState
          title="No trigger ingredients found"
          description={
            searchQuery
              ? `No ingredients match "${searchQuery}". Try a different search term.`
              : "You haven't added any trigger ingredients yet. As you log meals and symptoms, we'll help identify patterns."
          }
          icon={
            <svg width="40" height="40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" />
            </svg>
          }
        />
      ) : (
        <div className="space-y-2">
          {filteredIngredients.map((ing) => (
            <Card
              key={ing.name}
              className="flex items-center gap-4 px-5 py-3.5"
            >
              {/* Severity indicator */}
              <div className="flex flex-col items-center gap-1">
                <span
                  className={`w-2 h-2 rounded-full ${
                    ing.severity === "severe"
                      ? "bg-red-400"
                      : ing.severity === "moderate"
                        ? "bg-yellow-400"
                        : "bg-green-400"
                  }`}
                />
                <span className="text-[10px] text-text-muted uppercase tracking-wider">
                  {ing.severity}
                </span>
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-sm font-semibold text-text-primary">
                    {ing.name}
                  </span>
                  <span
                    className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full border ${
                      categoryColors[ing.category] || categoryColors.other
                    }`}
                  >
                    {categoryLabels[ing.category] || ing.category}
                  </span>
                </div>
                {ing.notes && (
                  <p className="text-xs text-text-muted">{ing.notes}</p>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center gap-1">
                <button
                  onClick={() => removeIngredient(ing.name)}
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-text-muted hover:text-coral-500 hover:bg-coral-50 transition-colors"
                  aria-label={`Remove ${ing.name}`}
                >
                  <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                  </svg>
                </button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Add new ingredient */}
      <Card elevated className="mt-6">
        <CardHeader>
          <h2 className="text-base font-semibold text-text-primary">
            Add New Trigger Ingredient
          </h2>
        </CardHeader>
        <CardBody>
          <p className="text-sm text-text-muted mb-4">
            Not sure if an ingredient is a trigger? Check your{" "}
            <Link
              to="/dashboard"
              className="text-brand-600 hover:text-brand-700 font-medium"
            >
              Ingredient Trends
            </Link>{" "}
            for correlations, or add one manually below.
          </p>
          <div className="grid sm:grid-cols-2 gap-3">
            <Input label="Ingredient name" placeholder="e.g. Cinnamon, Sulfites" />
            <select
              className="block w-full rounded-lg border border-border-default px-3.5 py-2.5 text-sm bg-surface-card focus:border-brand-400 focus:ring-2 focus:ring-brand-100 transition-all duration-150"
              defaultValue=""
            >
              <option value="" disabled>Severity of reaction</option>
              <option value="mild">Mild</option>
              <option value="moderate">Moderate</option>
              <option value="severe">Severe</option>
            </select>
          </div>
          <div className="mt-3">
            <Button size="sm" variant="outline">
              Add to trigger list
            </Button>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}