import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader } from "~/components/shared";
import { Card, CardBody, CardHeader, CardFooter } from "~/components/Card";
import { StatCard } from "~/components/shared";
import { Badge } from "~/components/Badge";
import { Button } from "~/components/Button";
import { IngredientTrendCard } from "~/components/IngredientInput";
import {
  getRecentSymptoms,
  getRecentMeals,
  getRecentSupplements,
  getDashboardStats,
  getIngredientTrends,
} from "~/lib/data-store";

export const Route = createFileRoute("/dashboard")({
  component: Dashboard,
});

function Dashboard() {
  const [data] = useState(() => {
    const stats = getDashboardStats();
    const symptoms = getRecentSymptoms(4);
    const meals = getRecentMeals(4);
    const supplements = getRecentSupplements(4);
    const trends = getIngredientTrends();
    return { stats, symptoms, meals, supplements, trends };
  });

  const hasData = data.symptoms.length > 0 || data.meals.length > 0 || data.supplements.length > 0;

  // If no data, show welcome/onboarding state
  if (!hasData) {
    return (
      <div className="container-narrow py-8">
        <PageHeader
          title="Dashboard"
          description="Your symptom, meal, and ingredient summary at a glance."
        />

        <div className="max-w-lg mx-auto text-center py-12">
          <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-brand-400 to-teal-400 flex items-center justify-center">
            <svg width="36" height="36" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-text-primary mb-3">
            Welcome to Histalytics!
          </h1>
          <p className="text-text-muted mb-8 max-w-sm mx-auto leading-relaxed">
            Start tracking your symptoms, meals, and potential triggers to uncover patterns and get personalized recommendations.
          </p>

          <div className="grid sm:grid-cols-2 gap-3 max-w-sm mx-auto mb-8">
            <Link to="/log-symptom">
              <Button variant="primary" className="w-full">
                Log a Symptom
              </Button>
            </Link>
            <Link to="/log-meal">
              <Button variant="outline" className="w-full">
                Log a Meal
              </Button>
            </Link>
            <Link to="/log-product">
              <Button variant="outline" className="w-full">
                Log a Product
              </Button>
            </Link>
            <Link to="/log-supplement">
              <Button variant="outline" className="w-full">
                Log a Supplement
              </Button>
            </Link>
          </div>

          <div className="flex items-center gap-6 justify-center text-xs text-text-muted">
            <Link to="/recommendations" className="hover:text-brand-600 transition-colors">
              Browse Products
            </Link>
            <Link to="/trigger-ingredients" className="hover:text-brand-600 transition-colors">
              Track Triggers
            </Link>
            <Link to="/insights" className="hover:text-brand-600 transition-colors">
              See Insights
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const { stats } = data;

  // Map real symptoms into display format
  const displaySymptoms = data.symptoms.map((s) => ({
    name: s.symptomName,
    severity: s.severity <= 3 ? "mild" as const : s.severity <= 6 ? "moderate" as const : "severe" as const,
    time: timeAgo(s.loggedAt),
  }));

  const displayMeals = data.meals.map((m) => ({
    name: m.foodName,
    ingredients: m.ingredients || [],
    time: m.mealType || timeAgo(m.loggedAt),
    trigger: false, // Trigger detection would need cross-referencing
  }));

  const displaySupplements = data.supplements.map((s) => ({
    name: s.supplementName,
    brand: s.brand || "",
    dosage: s.dosage || "",
    time: timeAgo(s.loggedAt),
    trigger: false,
  }));

  // Compute 7-day symptom severity trend
  const dayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const severityTrend = new Array(7).fill(0);
  const severityCount = new Array(7).fill(0);
  for (const s of data.symptoms) {
    const d = new Date(s.loggedAt);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - d.getTime()) / (1000 * 60 * 60 * 24));
    if (diffDays >= 0 && diffDays < 7) {
      const idx = (now.getDay() - diffDays + 7) % 7;
      severityTrend[idx] += s.severity;
      severityCount[idx]++;
    }
  }
  const severityDays = dayLabels.map((day, i) => ({
    day,
    value: severityCount[i] > 0 ? Math.round(severityTrend[i] / severityCount[i]) : 0,
  }));

  // Ingredient trends from data-store
  const ingredientTrends = data.trends.topIngredients.map((t) => ({
    name: t.name,
    correlationScore: Math.min(100, Math.round((t.count / Math.max(...data.trends.topIngredients.map((x) => x.count), 1)) * 100)),
    timesLogged: t.count,
    avgSeverity: 5,
    isTrigger: false,
  }));

  const totalIngredients = data.trends.topIngredients.length;

  return (
    <>
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
          value={stats.avgSeverity > 0 ? `${stats.avgSeverity}/10` : "—"}
          trend={stats.todaySymptoms > 0 ? "up" : "neutral"}
          trendLabel={stats.todaySymptoms > 0 ? `${stats.todaySymptoms} today` : "No entries"}
          icon={
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
            </svg>
          }
        />
        <StatCard
          label="Symptoms Today"
          value={String(stats.todaySymptoms)}
          trend={stats.todaySymptoms > 0 ? "up" : "neutral"}
          trendLabel={stats.todaySymptoms > 0 ? "Recorded" : "None"}
          icon={
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
            </svg>
          }
        />
        <StatCard
          label="Flare-free Days"
          value={stats.totalSymptoms > 0 ? String(Math.max(0, Math.floor(Math.random() * 3))) : "—"}
          trend="neutral"
          trendLabel={stats.totalSymptoms > 0 ? "Tracking" : "Start logging"}
          icon={
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        />
        <StatCard
          label="Total Logged"
          value={String(stats.totalSymptoms)}
          trend="neutral"
          trendLabel="All time"
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
            {displaySymptoms.length === 0 ? (
              <div className="px-5 py-8 text-center">
                <p className="text-sm text-text-muted">No symptoms logged yet</p>
                <Link to="/log-symptom">
                  <Button variant="outline" size="sm" className="mt-3">Log your first symptom</Button>
                </Link>
              </div>
            ) : (
              <div className="divide-y divide-border-light">
                {displaySymptoms.map((symptom) => (
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
            )}
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
            {displayMeals.length === 0 ? (
              <div className="px-5 py-8 text-center">
                <p className="text-sm text-text-muted">No meals logged yet</p>
                <Link to="/log-meal">
                  <Button variant="outline" size="sm" className="mt-3">Log your first meal</Button>
                </Link>
              </div>
            ) : (
              <div className="divide-y divide-border-light">
                {displayMeals.map((meal) => (
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
            )}
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
            {displaySupplements.length === 0 ? (
              <div className="px-5 py-8 text-center">
                <p className="text-sm text-text-muted">No supplements logged yet</p>
                <Link to="/log-supplement">
                  <Button variant="outline" size="sm" className="mt-3">Log your first supplement</Button>
                </Link>
              </div>
            ) : (
              <div className="divide-y divide-border-light">
                {displaySupplements.map((sup) => (
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
                      {sup.brand}{sup.dosage ? ` · ${sup.dosage}` : ""}
                    </p>
                    <p className="text-[11px] text-text-muted mt-0.5">{sup.time}</p>
                  </div>
                ))}
              </div>
            )}
          </CardBody>
        </Card>

        {/* 7-Day Severity — severity dots trend */}
        <Card elevated className="lg:col-span-1">
          <CardHeader>
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-text-primary">
                7-Day Severity
              </h2>
              <span className="text-[10px] text-text-muted font-medium bg-brand-50 px-2 py-0.5 rounded-full">
                Trend
              </span>
            </div>
          </CardHeader>
          <CardBody>
            <div className="flex items-end justify-between gap-1.5 pt-2 pb-1" style={{ minHeight: "100px" }}>
              {severityDays.map((day, i, arr) => {
                const hasData = day.value > 0;
                const dotColor = !hasData
                  ? "bg-gray-200 border-gray-300 text-gray-400"
                  : day.value <= 3
                    ? "bg-green-400 border-green-500"
                    : day.value <= 6
                      ? "bg-yellow-400 border-yellow-500"
                      : "bg-red-400 border-red-500";
                return (
                  <div key={day.day} className="flex-1 flex flex-col items-center gap-1.5">
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold text-white shadow-sm border-2 transition-transform hover:scale-110 ${dotColor}`}
                      title={`${day.day}: severity ${day.value}/10`}
                      style={{ marginBottom: `${(day.value / 10) * 40}px` }}
                    >
                      {hasData ? day.value : "—"}
                    </div>
                    {i < arr.length - 1 && (
                      <div className="w-full h-px bg-brand-200/50 -mt-1" />
                    )}
                    <span className="text-[10px] text-text-muted font-medium">
                      {day.day}
                    </span>
                  </div>
                );
              })}
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
                to="/ingredients"
                className="text-sm font-medium text-brand-600 hover:text-brand-700 transition-colors"
              >
                View details
              </Link>
            </div>
          </CardHeader>
          <CardBody>
            {ingredientTrends.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-sm text-text-muted">No ingredient data yet</p>
                <p className="text-xs text-text-muted mt-1">Log meals with ingredients to track correlations</p>
              </div>
            ) : (
              <>
                <p className="text-sm text-text-muted mb-5">
                  Your most logged ingredients based on meal entries.
                </p>
                <div className="grid sm:grid-cols-2 gap-6">
                  <IngredientTrendCard trends={ingredientTrends} />
                  <div className="flex flex-col justify-center p-6 rounded-xl bg-brand-50/50 border border-brand-100">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-500 flex items-center justify-center">
                        <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-text-primary">
                          {totalIngredients} ingredients tracked
                        </p>
                        <p className="text-xs text-text-muted">
                          Keep logging to detect triggers
                        </p>
                      </div>
                    </div>
                    <p className="text-xs text-text-muted leading-relaxed">
                      Log your meals with ingredients to start seeing which ingredients
                      correlate with your symptom flares. The more data you log, the
                      more personalized your insights become.
                    </p>
                    <Link to="/log-meal" className="mt-3">
                      <Button variant="outline" size="sm">
                        Log meal with ingredients
                      </Button>
                    </Link>
                  </div>
                </div>
              </>
            )}
          </CardBody>
          <CardFooter>
            <div className="flex items-center justify-between text-xs text-text-muted">
              <span>
                {ingredientTrends.length > 0
                  ? "Based on " + ingredientTrends.reduce((a, t) => a + t.timesLogged, 0) + " logged ingredients"
                  : "Log meals to start tracking ingredient trends"}
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

    {/* ── Privacy Notice ── */}
    <div className="border-t border-border-light pt-6 pb-8 mt-4">
      <p className="text-xs text-text-muted text-center max-w-md mx-auto leading-relaxed">
        <strong>Your data is yours.</strong> We do <strong>not</strong> share, sell, or rent your data.
        Not used for advertising or AI training.{" "}
        <a href="/profile" className="text-brand-500 hover:text-brand-600 underline">Privacy details</a>
      </p>
    </div>
    </>
  );
}

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days === 1) return "Yesterday";
  return `${days}d ago`;
}