import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader, EmptyState } from "~/components/shared";
import { Card, CardBody, CardHeader } from "~/components/Card";
import { Badge } from "~/components/Badge";
import { Button } from "~/components/Button";
import { TriggerWarningBadge } from "~/components/IngredientInput";
import { getRecommendations } from "~/lib/data-store";

export const Route = createFileRoute("/recommendations")({
  component: Recommendations,
});

const data = getRecommendations();

function Recommendations() {
  const { frequentSymptoms, matchedProducts, discoveryProducts, totalProducts } = data;

  const hasSymptoms = frequentSymptoms.length > 0;

  return (
    <div className="container-narrow py-8">
      <PageHeader
        title="Product References"
        description="Educational reference of products matched to your symptom profile"
      />

      {/* Medical disclaimer */}
      <div className="flex items-start gap-3 p-4 rounded-xl bg-amber-50/80 border border-amber-200/60 mb-8">
        <div className="shrink-0 w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center text-amber-600">
          <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
          </svg>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-amber-800">
            These are research-backed references — not medical recommendations.
          </p>
          <p className="text-xs text-amber-600/80 mt-0.5">
            Always discuss supplements and medications with your healthcare provider before trying them.
          </p>
        </div>
      </div>

      {!hasSymptoms ? (
        <EmptyState
          title="No symptom data yet"
          description="Log some symptoms first and we'll match you with products that can help."
          action={
            <Link to="/log-symptom">
              <Button>Log Your First Symptom</Button>
            </Link>
          }
        />
      ) : (
        <div className="space-y-8">
          {/* Your symptoms summary */}
          <Card elevated>
            <CardHeader>
              <div className="flex items-center justify-between">
                <h2 className="text-base font-semibold text-text-primary">
                  Your Symptom Profile
                </h2>
                <Badge variant="brand">{frequentSymptoms.length} tracked</Badge>
              </div>
            </CardHeader>
            <CardBody>
              <div className="flex flex-wrap gap-2">
                {frequentSymptoms.map((s) => (
                  <Badge key={s.symptom_id} variant="teal" dot>
                    {s.symptom_name}
                  </Badge>
                ))}
              </div>
            </CardBody>
          </Card>

          {/* Matched products */}
          {matchedProducts.length > 0 ? (
            <div>
              <h2 className="text-lg font-semibold text-text-primary mb-4">
                Best Matches ({matchedProducts.length})
              </h2>
              <div className="space-y-4">
                {matchedProducts.map((product) => (
                  <Card key={product.id} elevated>
                    <CardBody>
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="text-base font-semibold text-text-primary">
                              {product.name}
                            </h3>
                            <Badge
                              variant={product.evidence_level === "strong" ? "brand" : product.evidence_level === "moderate" ? "teal" : "default"}
                              size="sm"
                            >
                              {product.evidence_level}
                            </Badge>
                          </div>

                          {product.mechanism && (
                            <p className="mt-1 text-sm text-text-secondary">
                              {product.mechanism}
                            </p>
                          )}

                          {product.matching_symptoms.length > 0 && (
                            <div className="mt-3">
                              <p className="text-xs font-medium text-text-muted mb-1.5">
                                Matches your symptoms:
                              </p>
                              <div className="flex flex-wrap gap-1.5">
                                {product.matching_symptoms.map((s) => (
                                  <Badge key={s.id} variant="teal" size="sm" dot>
                                    {s.name}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}

                          {product.typical_dose && (
                            <p className="mt-3 text-xs text-text-muted">
                              <span className="font-medium">Typical dose:</span>{" "}
                              {product.typical_dose}
                            </p>
                          )}

                          {product.common_brands && product.common_brands.length > 0 && (
                            <p className="mt-1 text-xs text-text-muted">
                              <span className="font-medium">Brands:</span>{" "}
                              {product.common_brands.slice(0, 3).join(", ")}
                            </p>
                          )}

                          {product.notes && (
                            <p className="mt-2 text-xs text-amber-700 bg-amber-50 px-3 py-2 rounded-lg">
                              ⚠️ {product.notes}
                            </p>
                          )}
                        </div>

                        <div className="shrink-0 flex flex-col items-center">
                          <div className="w-12 h-12 rounded-full bg-brand-50 border-2 border-brand-200 flex items-center justify-center">
                            <span className="text-lg font-bold text-brand-600">
                              {product.score}
                            </span>
                          </div>
                          <span className="text-[10px] text-text-muted mt-1">
                            match
                          </span>
                        </div>
                      </div>
                    </CardBody>
                  </Card>
                ))}
              </div>
            </div>
          ) : (
            <Card elevated>
              <CardBody>
                <div className="text-center py-6">
                  <p className="text-text-secondary">
                    No products matched your specific symptoms yet.
                  </p>
                  <p className="text-sm text-text-muted mt-1">
                    Try logging more symptoms for better recommendations.
                  </p>
                </div>
              </CardBody>
            </Card>
          )}

          {/* Discovery products */}
          {discoveryProducts.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold text-text-primary mb-4">
                Explore ({discoveryProducts.length})
              </h2>
              <p className="text-sm text-text-muted mb-4">
                Evidence-ranked products for general MCAS support
              </p>
              <div className="grid sm:grid-cols-2 gap-4">
                {discoveryProducts.map((product) => (
                  <Card key={product.id} elevated className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="shrink-0 w-8 h-8 rounded-lg bg-teal-50 border border-teal-200 flex items-center justify-center">
                        <Badge
                          variant={product.evidence_level === "strong" ? "brand" : product.evidence_level === "moderate" ? "teal" : "default"}
                          size="sm"
                        >
                          {product.evidence_level === "strong" ? "S" : product.evidence_level === "moderate" ? "M" : "P"}
                        </Badge>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-text-primary">
                          {product.name}
                        </h4>
                        <p className="text-xs text-text-muted mt-0.5">
                          {product.mechanism}
                        </p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          <p className="text-xs text-text-muted text-center">
            Based on {totalProducts} products in our database.{" "}
            Always consult your healthcare provider before starting new supplements or medications.
          </p>
        </div>
      )}
    </div>
  );
}