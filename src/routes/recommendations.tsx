import { createFileRoute, Link } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { getDb, getOrCreateDefaultUser } from "~/db/local";
import { PageHeader, EmptyState } from "~/components/shared";
import { Card, CardBody, CardHeader } from "~/components/Card";
import { Badge } from "~/components/Badge";
import { Button } from "~/components/Button";
import { TriggerWarningBadge } from "~/components/IngredientInput";

const getRecommendations = createServerFn({ method: "GET" }).handler(async () => {
  const db = getDb();
  const userId = getOrCreateDefaultUser();

  const frequentSymptoms = db.query(`
    SELECT symptom_id, symptom_name, COUNT(*) as count, AVG(severity) as avg_severity
    FROM symptom_logs WHERE user_id = $1
    GROUP BY symptom_id, symptom_name ORDER BY count DESC LIMIT 5
  `).all(userId) as any[];

  const products = db.query(`
    SELECT id, name, category, description, usage_notes, price_range, evidence_level
    FROM products ORDER BY
      CASE evidence_level WHEN 'strong' THEN 0 WHEN 'moderate' THEN 1 WHEN 'preliminary' THEN 2 WHEN 'anecdotal' THEN 3 END
    LIMIT 20
  `).all() as any[];

  return { frequentSymptoms, products };
});

export const Route = createFileRoute("/recommendations")({
  loader: () => getRecommendations(),
  component: Recommendations,
});

const categoryIcons: Record<string, string> = {
  supplement: "💊",
  "low-histamine-food": "🥗",
  "otc-relief": "🏥",
  "mast-cell-stabilizer": "🔬",
  other: "📋",
};

const categoryLabels: Record<string, string> = {
  supplement: "Supplement",
  "low-histamine-food": "Low-Histamine Food",
  "otc-relief": "OTC Relief",
  "mast-cell-stabilizer": "Mast Cell Stabilizer",
  other: "Other",
};

const evidenceColors: Record<string, string> = {
  strong: "bg-green-100 text-green-700 border-green-200",
  moderate: "bg-blue-100 text-blue-700 border-blue-200",
  preliminary: "bg-yellow-100 text-yellow-700 border-yellow-200",
  anecdotal: "bg-gray-100 text-gray-600 border-gray-200",
};

// Mock user trigger ingredients — in production this would come from the DB
const userTriggerIngredients = [
  "Fragrance", "Sulfites", "Artificial flavor", "Red 40",
  "Yellow 5", "MSG", "Soy", "Gluten",
];

// Mock product ingredients for demo purposes
const productIngredients: Record<string, { ingredients: string[]; triggerCount: number; triggerNames: string[] }> = {
  // Supplements
  "Quercetin": { ingredients: ["Quercetin", "Cellulose", "Vegetable capsule"], triggerCount: 0, triggerNames: [] },
  "Vitamin C": { ingredients: ["Ascorbic acid", "Cellulose", "Silica"], triggerCount: 0, triggerNames: [] },
  "DAO Enzymes": { ingredients: ["DAO enzyme", "Cellulose", "Magnesium stearate"], triggerCount: 0, triggerNames: [] },
  "Magnesium Glycinate": { ingredients: ["Magnesium glycinate", "Cellulose", "Vegetable capsule"], triggerCount: 0, triggerNames: [] },
  // Low-histamine foods
  "Fresh Chicken & Turkey": { ingredients: ["Chicken"], triggerCount: 0, triggerNames: [] },
  "Fresh Vegetables (most)": { ingredients: ["Broccoli", "Zucchini", "Carrots"], triggerCount: 0, triggerNames: [] },
  "Blueberries & Pomegranate": { ingredients: ["Blueberries", "Pomegranate"], triggerCount: 0, triggerNames: [] },
  "Fresh Wild Salmon": { ingredients: ["Salmon"], triggerCount: 0, triggerNames: [] },
  // OTC
  "H1 Antihistamines": { ingredients: ["Loratadine", "Lactose", "Corn starch", "Red 40"], triggerCount: 2, triggerNames: ["Lactose", "Red 40"] },
  "H2 Blockers": { ingredients: ["Famotidine", "Cellulose", "Silica", "Yellow 5"], triggerCount: 1, triggerNames: ["Yellow 5"] },
  "Cromolyn Sodium (Nasal)": { ingredients: ["Cromolyn sodium", "Purified water", "Fragrance"], triggerCount: 1, triggerNames: ["Fragrance"] },
  "Saline Nasal Spray": { ingredients: ["Sodium chloride", "Purified water"], triggerCount: 0, triggerNames: [] },
};

function Recommendations() {
  const { frequentSymptoms, products } = Route.useLoaderData();

  return (
    <div className="container-narrow py-8">
      <PageHeader
        title="Recommendations"
        description="Personalized product suggestions based on your symptom profile and trigger ingredients."
      />

      {/* Ingredient safety banner */}
      <Card className="mb-6 p-4 sm:p-5 bg-gradient-to-r from-teal-50/50 to-brand-50/50 border-teal-100/50">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-teal-100 text-teal-500 flex items-center justify-center shrink-0">
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-text-primary mb-1">
              Ingredient-aware recommendations
            </h3>
            <p className="text-xs text-text-muted leading-relaxed">
              Products are cross-referenced against your{" "}
              <Link to="/trigger-ingredients" className="text-brand-600 hover:text-brand-700 font-medium">
                trigger ingredient list
              </Link>
              . Any product containing a flagged ingredient will show a warning.
            </p>
          </div>
          <Link to="/trigger-ingredients">
            <Button variant="outline" size="sm" className="whitespace-nowrap">
              Manage triggers
            </Button>
          </Link>
        </div>
      </Card>

      {/* Frequent symptoms */}
      {frequentSymptoms.length > 0 && (
        <Card className="mb-8">
          <CardHeader>
            <h2 className="text-lg font-semibold text-text-primary">Your Top Symptoms</h2>
          </CardHeader>
          <CardBody>
            <div className="flex flex-wrap gap-2">
              {frequentSymptoms.map((s: any) => (
                <Badge key={s.symptom_id} variant="brand" dot>
                  {s.symptom_name} ({s.count}x)
                </Badge>
              ))}
            </div>
          </CardBody>
        </Card>
      )}

      {/* Products */}
      {products.length === 0 ? (
        <EmptyState
          title="No recommendations yet"
          description="The product database is being built. Check back soon for personalized recommendations."
          icon={
            <svg width="40" height="40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 10-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" />
            </svg>
          }
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map((p: any) => {
            const ingData = productIngredients[p.name] || { ingredients: [], triggerCount: 0, triggerNames: [] };
            return (
              <Card key={p.id} hoverable>
                <CardBody>
                  <div className="flex items-start justify-between mb-3">
                    <span className="text-2xl">{categoryIcons[p.category] || "📋"}</span>
                    <div className="flex items-center gap-1.5">
                      {ingData.triggerCount > 0 && (
                        <TriggerWarningBadge
                          triggerCount={ingData.triggerCount}
                          triggerNames={ingData.triggerNames}
                        />
                      )}
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full border ${evidenceColors[p.evidence_level] || evidenceColors.anecdotal}`}>
                        {p.evidence_level}
                      </span>
                    </div>
                  </div>
                  <h3 className="font-semibold text-text-primary mb-1">{p.name}</h3>
                  <p className="text-xs text-text-muted mb-1">{categoryLabels[p.category] || p.category}</p>
                  {p.description && <p className="text-sm text-text-secondary mt-2">{p.description}</p>}
                  {p.price_range && (
                    <p className="text-xs text-text-muted mt-2">{p.price_range}</p>
                  )}
                  {/* Ingredient list */}
                  {ingData.ingredients.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-border-light">
                      <div className="flex flex-wrap gap-1">
                        {ingData.ingredients.map((ing: string) => {
                          const isTrigger = userTriggerIngredients.includes(ing);
                          return (
                            <span
                              key={ing}
                              className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full border ${
                                isTrigger
                                  ? "bg-coral-50 border-coral-200 text-coral-700"
                                  : "bg-brand-50 border-brand-100 text-brand-600"
                              }`}
                            >
                              {ing}
                              {isTrigger && " ⚠"}
                            </span>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </CardBody>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}