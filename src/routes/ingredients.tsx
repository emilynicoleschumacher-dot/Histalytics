import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { getDb, getOrCreateDefaultUser } from "~/db/local";
import { readFile } from "node:fs/promises";
import { PageHeader, EmptyState } from "~/components/shared";
import { Card, CardBody } from "~/components/Card";
import { Badge } from "~/components/Badge";
import { Button } from "~/components/Button";
import { Input } from "~/components/Input";

const getIngredientData = createServerFn({ method: "GET" }).handler(async () => {
  const db = getDb();
  const userId = getOrCreateDefaultUser();

  const known = db.query("SELECT id, name, category, histamine_level, common_in, notes FROM known_ingredients ORDER BY name").all();
  const topLogged = db.query(`
    SELECT name, COUNT(*) as count, category
    FROM ingredient_logs WHERE user_id = $1
    GROUP BY name ORDER BY count DESC LIMIT 10
  `).all(userId);

  const flareCorrelations = db.query(`
    SELECT il.name, COUNT(*) as flare_count, ROUND(AVG(sl.severity), 1) as avg_severity
    FROM ingredient_logs il
    JOIN ingredient_flare_links ifl ON il.id = ifl.ingredient_log_id
    JOIN symptom_logs sl ON ifl.symptom_log_id = sl.id
    WHERE il.user_id = $1
    GROUP BY il.name ORDER BY flare_count DESC LIMIT 10
  `).all(userId);

  return { known, topLogged, flareCorrelations };
});

export const Route = createFileRoute("/ingredients")({
  loader: () => getIngredientData(),
  component: Ingredients,
});

const logIng = createServerFn({ method: "POST" }).handler(async (data: unknown) => {
  const { name, histamineLevel, notes } = data as any;
  const db = getDb();
  const userId = getOrCreateDefaultUser();
  db.query(`
    INSERT INTO ingredient_logs (user_id, name, category, source_type, histamine_level, notes)
    VALUES ($1, $2, 'food', 'manual', $3, $4)
  `).run(userId, name, histamineLevel ?? "unknown", notes ?? null);
  return { success: true };
});

const categoryColors: Record<string, string> = {
  "food-additive": "bg-orange-100 text-orange-700 border-orange-200",
  "preservative": "bg-amber-100 text-amber-700 border-amber-200",
  "color": "bg-pink-100 text-pink-700 border-pink-200",
  "fragrance": "bg-purple-100 text-purple-700 border-purple-200",
  "chemical": "bg-slate-100 text-slate-700 border-slate-200",
  "botanical": "bg-green-100 text-green-700 border-green-200",
  "other": "bg-gray-100 text-gray-600 border-gray-200",
};

const histColors: Record<string, string> = {
  high: "bg-red-100 text-red-700 border-red-200",
  moderate: "bg-yellow-100 text-yellow-700 border-yellow-200",
  low: "bg-green-100 text-green-700 border-green-200",
  unknown: "bg-gray-100 text-gray-500 border-gray-200",
};

function Ingredients() {
  const { known, topLogged, flareCorrelations } = Route.useLoaderData() as any;
  const [search, setSearch] = useState("");
  const [logMode, setLogMode] = useState<string | null>(null);
  const [logName, setLogName] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const filtered = known.filter((k: any) =>
    k.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleQuickLog = async (name: string) => {
    setSubmitting(true);
    await logIng({ name, histamineLevel: "unknown" });
    setSubmitting(false);
    setLogMode(null);
  };

  const handleCustomLog = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!logName.trim()) return;
    setSubmitting(true);
    await logIng({ name: logName.trim() });
    setSubmitting(false);
    setLogName("");
    setLogMode(null);
  };

  return (
    <div className="container-narrow py-8">
      <PageHeader title="Ingredients" description="Track ingredients and identify your personal triggers">
        <Button variant="outline" size="sm" onClick={() => setLogMode(logMode === "manual" ? null : "manual")}>
          {logMode === "manual" ? "Cancel" : "+ Log Ingredient"}
        </Button>
      </PageHeader>

      {/* Manual log form */}
      {logMode === "manual" && (
        <Card className="mb-8">
          <CardBody>
            <form onSubmit={handleCustomLog} className="flex gap-3">
              <div className="flex-1">
                <Input
                  placeholder="Ingredient name (e.g. Sodium Benzoate, Sulfites)"
                  value={logName}
                  onChange={(e) => setLogName(e.target.value)}
                />
              </div>
              <Button type="submit" isLoading={submitting} disabled={!logName.trim()}>
                Log
              </Button>
            </form>
          </CardBody>
        </Card>
      )}

      {/* Flare correlations */}
      {flareCorrelations.length > 0 && (
        <Card className="mb-8">
          <CardBody>
            <h2 className="text-lg font-semibold text-text-primary mb-3">🔥 Likely Trigger Ingredients</h2>
            <p className="text-sm text-text-muted mb-4">Ingredients linked to your symptom flares</p>
            <div className="space-y-3">
              {flareCorrelations.map((fc: any) => (
                <div key={fc.name} className="flex items-center justify-between py-2 border-b border-border-light last:border-0">
                  <span className="font-medium text-text-primary text-sm">{fc.name}</span>
                  <div className="flex items-center gap-3">
                    <Badge variant="severe">{fc.flare_count} flares</Badge>
                    <Badge variant="moderate">avg {fc.avg_severity}/10</Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>
      )}

      {/* Top logged ingredients */}
      {topLogged.length > 0 && (
        <Card className="mb-8">
          <CardBody>
            <h2 className="text-lg font-semibold text-text-primary mb-3">📊 Your Most Tracked Ingredients</h2>
            <div className="flex flex-wrap gap-2">
              {topLogged.map((t: any) => (
                <Badge key={t.name} variant="brand" dot>
                  {t.name} ({t.count}x)
                </Badge>
              ))}
            </div>
          </CardBody>
        </Card>
      )}

      {/* Known ingredient database */}
      <div>
        <h2 className="text-lg font-semibold text-text-primary mb-3">Known MCAS-Triggering Ingredients</h2>
        <Input
          placeholder="Search ingredients..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="mb-4"
        />

        {filtered.length === 0 ? (
          <EmptyState title="No ingredients found" description="Try a different search term." />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {filtered.map((ing: any) => (
              <Card key={ing.id}>
                <CardBody>
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-medium text-text-primary text-sm">{ing.name}</h3>
                    <Badge variant={ing.histamine_level === "high" ? "severe" : ing.histamine_level === "moderate" ? "moderate" : "mild"} dot>
                      {ing.histamine_level}
                    </Badge>
                  </div>
                  <div className="flex gap-1.5 mb-2">
                    <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full border ${categoryColors[ing.category] || categoryColors.other}`}>
                      {ing.category.replace("-", " ")}
                    </span>
                  </div>
                  {ing.common_in && (
                    <p className="text-xs text-text-muted mb-2">
                      Found in: {JSON.parse(ing.common_in).join(", ")}
                    </p>
                  )}
                  <p className="text-xs text-text-secondary mb-3">{ing.notes}</p>
                  <Button variant="ghost" size="sm" onClick={() => handleQuickLog(ing.name)} isLoading={submitting}>
                    + Log exposure
                  </Button>
                </CardBody>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}