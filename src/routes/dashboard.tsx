import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader } from "~/components/shared";
import { Card, CardBody, CardHeader, CardFooter } from "~/components/Card";
import { StatCard } from "~/components/shared";
import { Badge } from "~/components/Badge";
import { Button } from "~/components/Button";
import { IngredientTrendCard } from "~/components/IngredientInput";

export const Route = createFileRoute("/dashboard")({
  component: Dashboard,
});

const recentSymptoms = [
  { name: "Headache", severity: "moderate", time: "2h ago" },
  { name: "Fatigue", severity: "severe", time: "4h ago" },
  { name: "Skin flushing", severity: "mild", time: "6h ago" },
  { name: "Brain fog", severity: "moderate", time: "Yesterday" },
];

const recentMeals = [
  { name: "Oatmeal with blueberries", ingredients: ["Oats", "Blueberries", "Honey"], time: "Breakfast", trigger: false },
  { name: "Grilled chicken salad", ingredients: ["Chicken", "Lettuce", "Olive oil", "Lemon juice"], time: "Lunch", trigger: false },
  { name: "Salmon with rice", ingredients: ["Salmon", "White rice", "Broccoli", "Butter"], time: "Dinner", trigger: false },
  { name: "Aged cheese", ingredients: ["Aged cheddar", "Salt"], time: "Snack", trigger: true },
];

const recentSupplements = [
  { name: "Vitamin D3", brand: "Pure Encapsulations", dosage: "2000 IU", time: "Today", trigger: false },
  { name: "Quercetin", brand: "NOW Foods", dosage: "500mg", time: "Yesterday", trigger: false },
  { name: "DAO Enzyme", brand: "Seeking Health", dosage: "1 capsule", time: "2 days ago", trigger: false },
];

// Mock ingredient trend data
const ingredientTrends = [
  { name: "Aged cheese", correlationScore: 92, timesLogged: 6, avgSeverity: 7, isTrigger: true },
  { name: "Tomato", correlationScore: 78, timesLogged: 8, avgSeverity: 6, isTrigger: true },
  { name: "Avocado", correlationScore: 65, timesLogged: 4, avgSeverity: 5, isTrigger: false },
  { name: "Spinach", correlationScore: 58, timesLogged: 5, avgSeverity: 4, isTrigger: false },
  { name: "Chocolate", correlationScore: 45, timesLogged: 3, avgSeverity: 6, isTrigger: true },
  { name: "Soy sauce", correlationScore: 82, timesLogged: 4, avgSeverity: 8, isTrigger: true },
];

function Dashboard() {
  return (
    <div className="container-narrow py-8">
      <PageHeader
        title="Dashboard"
        description="Your symptom, meal, and ingredient summary at a glance."
      >
        <Link to="/log-symptom">
          <Button>Log Symptom</Button>
        </Link>
      </PageHeader>

      {/* Stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          label="Today's Flare Severity"
          value="Moderate"
          trend="down"
          trendLabel="20% from yesterday"
          icon={
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
            </svg>
          }
        />
        <StatCard
          label="Symptoms Today"
          value="4"
          trend="down"
          trendLabel="2 vs yesterday"
          icon={
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
            </svg>
          }
        />
        <StatCard
          label="Flare-free Days"
          value="3"
          trend="up"
          trendLabel="Streak active"
          icon={
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        />
        <StatCard
          label="Meals Logged"
          value="8"
          trend="neutral"
          trendLabel="Today"
          icon={
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" />
            </svg>
          }
        />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent symptoms */}
        <Card elevated className="lg:col-span-1">
          <CardHeader>
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-text-primary">
                Recent Symptoms
              </h2>
              <Link
                to="/history"
                className="text-sm font-medium text-brand-600 hover:text-brand-700 transition-colors"
              >
                View all
              </Link>
            </div>
          </CardHeader>
          <CardBody className="p-0">
            <div className="divide-y divide-border-light">
              {recentSymptoms.map((symptom) => (
                <div
                  key={symptom.name}
                  className="flex items-center gap-4 px-5 py-3.5 hover:bg-brand-50/30 transition-colors"
                >
                  <span className={`severity-dot ${symptom.severity}`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-text-primary truncate">
                      {symptom.name}
                    </p>
                    <p className="text-xs text-text-muted">{symptom.time}</p>
                  </div>
                  <Badge
                    variant={
                      symptom.severity === "mild"
                        ? "mild"
                        : symptom.severity === "moderate"
                          ? "moderate"
                          : "severe"
                    }
                  >
                    {symptom.severity}
                  </Badge>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>

        {/* Recent meals */}
        <Card elevated className="lg:col-span-1">
          <CardHeader>
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-text-primary">
                Recent Meals
              </h2>
              <Link
                to="/log-meal"
                className="text-sm font-medium text-brand-600 hover:text-brand-700 transition-colors"
              >
                Log meal
              </Link>
            </div>
          </CardHeader>
          <CardBody className="p-0">
            <div className="divide-y divide-border-light">
              {recentMeals.map((meal) => (
                <div
                  key={meal.name}
                  className="px-5 py-3.5 hover:bg-brand-50/30 transition-colors"
                >
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm font-medium text-text-primary truncate">
                      {meal.name}
                    </p>
                    {meal.trigger && (
                      <Badge variant="coral" dot>
                        Trigger
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-text-muted mb-1.5">{meal.time}</p>
                  <div className="flex flex-wrap gap-1">
                    {meal.ingredients.slice(0, 3).map((ing) => (
                      <span
                        key={ing}
                        className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-brand-50 text-brand-600"
                      >
                        {ing}
                      </span>
                    ))}
                    {meal.ingredients.length > 3 && (
                      <span className="text-[10px] text-text-muted self-center">
                        +{meal.ingredients.length - 3}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>

        {/* Recent supplements */}
        <Card elevated className="lg:col-span-1">
          <CardHeader>
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-text-primary">
                Recent Supplements
              </h2>
              <Link
                to="/log-supplement"
                className="text-sm font-medium text-brand-600 hover:text-brand-700 transition-colors"
              >
                Log supplement
              </Link>
            </div>
          </CardHeader>
          <CardBody className="p-0">
            <div className="divide-y divide-border-light">
              {recentSupplements.map((sup) => (
                <div
                  key={sup.name}
                  className="px-5 py-3.5 hover:bg-brand-50/30 transition-colors"
                >
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm font-medium text-text-primary truncate">
                      {sup.name}
                    </p>
                    {sup.trigger && (
                      <Badge variant="coral" dot>
                        Trigger
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-text-muted">
                    {sup.brand} · {sup.dosage}
                  </p>
                  <p className="text-[11px] text-text-muted mt-0.5">{sup.time}</p>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>

        {/* Severity trend */}
        <Card elevated className="lg:col-span-1">
          <CardHeader>
            <h2 className="text-lg font-semibold text-text-primary">
              7-Day Severity
            </h2>
          </CardHeader>
          <CardBody>
            <div className="flex items-end gap-2 h-32 pt-2">
              {[
                { day: "Mon", value: 6 },
                { day: "Tue", value: 8 },
                { day: "Wed", value: 5 },
                { day: "Thu", value: 3 },
                { day: "Fri", value: 4 },
                { day: "Sat", value: 2 },
                { day: "Sun", value: 3 },
              ].map((day) => (
                <div
                  key={day.day}
                  className="flex-1 flex flex-col items-center gap-1"
                >
                  <div className="relative w-full max-w-[32px] flex-1 flex items-end">
                    <div
                      className={`w-full rounded-lg transition-all duration-500 ${
                        day.value <= 3
                          ? "bg-green-400"
                          : day.value <= 6
                            ? "bg-yellow-400"
                            : "bg-red-400"
                      }`}
                      style={{
                        height: `${(day.value / 10) * 100}%`,
                        minHeight: "8px",
                      }}
                    />
                  </div>
                  <span className="text-[10px] text-text-muted">{day.day}</span>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>

        {/* Ingredient Trends — full width row */}
        <Card elevated className="lg:col-span-3">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-semibold text-text-primary">
                  Ingredient Trends
                </h2>
                <Badge variant="teal" dot>New</Badge>
              </div>
              <Link
                to="/trigger-ingredients"
                className="text-sm font-medium text-brand-600 hover:text-brand-700 transition-colors"
              >
                Manage triggers
              </Link>
            </div>
          </CardHeader>
          <CardBody>
            <p className="text-sm text-text-muted mb-5">
              Ingredients most frequently associated with flare-ups. Higher
              percentage = stronger correlation with your symptoms.
            </p>
            <div className="grid sm:grid-cols-2 gap-6">
              <IngredientTrendCard trends={ingredientTrends} />
              <div className="flex flex-col justify-center p-6 rounded-xl bg-brand-50/50 border border-brand-100">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-coral-100 text-coral-500 flex items-center justify-center">
                    <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-text-primary">
                      4 confirmed triggers
                    </p>
                    <p className="text-xs text-text-muted">
                      2 under observation
                    </p>
                  </div>
                </div>
                <p className="text-xs text-text-muted leading-relaxed">
                  We've detected strong correlations between your flare-ups and
                  aged cheese, soy sauce, tomato, and chocolate. Consider
                  elimination trials for these ingredients.
                </p>
                <Link to="/trigger-ingredients" className="mt-3">
                  <Button variant="outline" size="sm">
                    View trigger list
                  </Button>
                </Link>
              </div>
            </div>
          </CardBody>
          <CardFooter>
            <div className="flex items-center justify-between text-xs text-text-muted">
              <span>
                Based on {ingredientTrends.reduce((a, t) => a + t.timesLogged, 0)}{" "}
                logged meals with ingredients
              </span>
              <Link
                to="/log-meal"
                className="text-brand-600 hover:text-brand-700 font-medium"
              >
                Log meal with ingredients
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}