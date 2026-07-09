import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader, EmptyState } from "~/components/shared";
import { Card, CardBody } from "~/components/Card";
import { Badge } from "~/components/Badge";
import { Button } from "~/components/Button";
import { Input } from "~/components/Input";
import { getKnownIngredients, logIngredient, getIngredientHistory, getIngredientTrends } from "~/lib/data-store";

export const Route = createFileRoute("/ingredients")({
  component: Ingredients,
});

function Ingredients() {
  const [search, setSearch] = useState("");
  const [showLogForm, setShowLogForm] = useState(false);
  const [ingName, setIngName] = useState("");
  const [ingCategory, setIngCategory] = useState("food");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const known = getKnownIngredients();
  const history = getIngredientHistory();
  const trends = getIngredientTrends();

  const filteredKnown = known.filter((ing) =>
    ing.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleLogIngredient = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ingName.trim()) return;
    setSubmitting(true);
    logIngredient({
      name: ingName.trim(),
      category: ingCategory,
      sourceType: "manual",
      notes: null,
    });
    setSubmitting(false);
    setSuccess(true);
    setTimeout(() => {
      setSuccess(false);
      setIngName("");
      setShowLogForm(false);
    }, 1500);
  };

  const quickLog = (name: string, category: string) => {
    logIngredient({ name, category, sourceType: "manual", notes: null });
    setSuccess(true);
    setTimeout(() => setSuccess(false), 1500);
  };

  return (
    <div className="container-narrow py-8">
      <PageHeader
        title="Ingredient Tracking"
        description="Track specific ingredients and identify your personal triggers"
      >
        <Button size="sm" onClick={() => setShowLogForm(!showLogForm)}>
          {showLogForm ? "Cancel" : "Log Ingredient"}
        </Button>
      </PageHeader>

      {success && (
        <div className="mb-6 p-4 rounded-lg bg-green-50 border border-green-200 text-green-700 text-sm font-medium">
          ✓ Ingredient logged!
        </div>
      )}

      {/* Quick log form */}
      {showLogForm && (
        <Card elevated className="mb-8">
          <CardBody>
            <form onSubmit={handleLogIngredient} className="space-y-4">
              <Input
                label="Ingredient Name"
                placeholder="e.g. MSG, Soy Lecithin, Fragrance"
                value={ingName}
                onChange={(e) => setIngName(e.target.value)}
                required
              />
              <div>
                <label className="block text-sm font-medium text-text-primary mb-1.5">
                  Category
                </label>
                <select
                  className="w-full px-3 py-2.5 rounded-xl border border-border-light bg-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-400"
                  value={ingCategory}
                  onChange={(e) => setIngCategory(e.target.value)}
                >
                  <option value="food">Food Ingredient</option>
                  <option value="food-additive">Food Additive</option>
                  <option value="personal-care">Personal Care</option>
                  <option value="environmental">Environmental</option>
                  <option value="medication">Medication</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <Button type="submit" size="sm" fullWidth isLoading={submitting}>
                Log Ingredient
              </Button>
            </form>
          </CardBody>
        </Card>
      )}

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Left: Known ingredients database */}
        <div>
          <h2 className="text-lg font-semibold text-text-primary mb-4">
            Known Trigger Ingredients
          </h2>
          <Input
            placeholder="Search ingredients..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="mb-4"
          />
          <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
            {filteredKnown.map((ing) => (
              <Card key={ing.id} elevated className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="text-sm font-medium text-text-primary">
                        {ing.name}
                      </h4>
                      <Badge
                        variant={
                          ing.histamine_level === "high"
                            ? "brand"
                            : ing.histamine_level === "moderate"
                            ? "teal"
                            : "default"
                        }
                        size="sm"
                      >
                        {ing.histamine_level}
                      </Badge>
                    </div>
                    <p className="text-xs text-text-muted mt-1">
                      <span className="font-medium">Found in:</span> {ing.common_in}
                    </p>
                    {ing.notes && (
                      <p className="text-xs text-text-secondary mt-1">
                        {ing.notes}
                      </p>
                    )}
                  </div>
                  <button
                    onClick={() => quickLog(ing.name, ing.category)}
                    className="shrink-0 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-brand-50 text-brand-600 hover:bg-brand-100 transition-colors"
                  >
                    + Log
                  </button>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Right: Your tracked ingredients */}
        <div>
          <h2 className="text-lg font-semibold text-text-primary mb-4">
            Your Tracked Ingredients
          </h2>

          {history.ingredients.length === 0 ? (
            <EmptyState
              title="No ingredients tracked yet"
              description="Log ingredients from the database on the left to start tracking your exposure."
            />
          ) : (
            <>
              {/* Top logged ingredients */}
              {trends.topIngredients.length > 0 && (
                <Card elevated className="mb-6">
                  <CardBody>
                    <h3 className="text-sm font-semibold text-text-primary mb-3">
                      Most Logged
                    </h3>
                    <div className="space-y-2">
                      {trends.topIngredients.slice(0, 8).map((ing) => (
                        <div
                          key={ing.name}
                          className="flex items-center justify-between text-sm"
                        >
                          <span className="text-text-secondary">{ing.name}</span>
                          <Badge size="sm">{ing.count}×</Badge>
                        </div>
                      ))}
                    </div>
                  </CardBody>
                </Card>
              )}

              {/* Recent ingredient logs */}
              <h3 className="text-sm font-semibold text-text-primary mb-3">
                Recent Logs
              </h3>
              <div className="space-y-2">
                {history.ingredients.slice(0, 20).map((ing) => (
                  <div
                    key={ing.id}
                    className="flex items-center justify-between px-4 py-2.5 rounded-xl bg-surface-alt/50 border border-border-light"
                  >
                    <div>
                      <span className="text-sm font-medium text-text-primary">
                        {ing.name}
                      </span>
                      <span className="text-xs text-text-muted ml-2">
                        {ing.category}
                      </span>
                    </div>
                    <span className="text-xs text-text-muted">
                      {new Date(ing.loggedAt).toLocaleDateString()}
                    </span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}