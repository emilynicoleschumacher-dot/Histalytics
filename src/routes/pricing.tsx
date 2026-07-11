import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "~/components/shared";
import { Card, CardBody, CardHeader, CardFooter } from "~/components/Card";
import { Badge } from "~/components/Badge";
import { Button } from "~/components/Button";

const plans = [
  {
    name: "Monthly",
    price: "$4.99",
    period: "/month",
    description: "Everything you need to start tracking your symptoms",
    features: [
      "Unlimited symptom logging",
      "Unlimited meal & product logging",
      "Ingredient-level tracking",
      "Personal trigger discovery",
      "Full insights dashboard",
      "30-day history",
    ],
    cta: "Get started",
    popular: false,
  },
  {
    name: "Annual",
    price: "$55",
    period: "/year",
    description: "Save 8% with annual billing — commit to your health",
    features: [
      "Everything in Monthly",
      "Full history (unlimited)",
      "Advanced analytics & trends",
      "Priority support",
      "Early access to new features",
    ],
    cta: "Start free trial",
    popular: true,
    badge: "Best value",
  },
];

export const Route = createFileRoute("/pricing")({
  component: Pricing,
});

function Pricing() {
  return (
    <div className="container-narrow py-8">
      <PageHeader
        title="Simple, transparent pricing"
        description="Start tracking your symptoms today. No hidden fees."
        className="text-center"
      />

      <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto mt-4">
        {plans.map((plan) => (
          <Card
            key={plan.name}
            elevated={plan.popular}
            className={`relative flex flex-col ${plan.popular ? "ring-2 ring-brand-500 scale-[1.02]" : ""}`}
          >
            {plan.badge && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <Badge variant="brand" dot>
                  {plan.badge}
                </Badge>
              </div>
            )}

            <CardHeader>
              <h3 className="text-lg font-semibold text-text-primary">{plan.name}</h3>
              <div className="mt-3 flex items-baseline gap-1">
                <span className="text-4xl font-extrabold text-text-primary">{plan.price}</span>
                <span className="text-sm text-text-muted">{plan.period}</span>
              </div>
              <p className="mt-2 text-sm text-text-secondary">{plan.description}</p>
            </CardHeader>

            <CardBody className="flex-1">
              <ul className="space-y-3">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-text-secondary">
                    <svg className="w-5 h-5 text-green-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                    {f}
                  </li>
                ))}
              </ul>
            </CardBody>

            <CardFooter>
              <Button
                variant={plan.popular ? "primary" : "outline"}
                size="lg"
                fullWidth
              >
                {plan.cta}
              </Button>
              {plan.popular && (
                <p className="text-xs text-text-muted text-center mt-2">
                  Free 14-day trial. Cancel anytime.
                </p>
              )}
            </CardFooter>
          </Card>
        ))}
      </div>

      <div className="mt-12 text-center max-w-lg mx-auto">
        <Card>
          <CardBody>
            <h3 className="font-semibold text-text-primary mb-2">Need something different?</h3>
            <p className="text-sm text-text-secondary mb-4">
              We offer practitioner plans and group discounts for clinics and
              support groups. Contact us for custom pricing.
            </p>
            <Button variant="ghost">Contact us</Button>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}