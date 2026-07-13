import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader } from "~/components/shared";
import { Card, CardBody, CardHeader } from "~/components/Card";
import { Badge } from "~/components/Badge";
import { Button } from "~/components/Button";
import { Input, Select } from "~/components/Input";
import {
  getFullHistory,
  deleteSymptom,
  deleteMeal,
  deleteSupplement,
  deleteProduct,
} from "~/lib/data-store";

export const Route = createFileRoute("/history")({
  component: History,
});

const months = [
  { value: "2026-07", label: "July 2026" },
  { value: "2026-06", label: "June 2026" },
  { value: "2026-05", label: "May 2026" },
  { value: "2026-04", label: "April 2026" },
];

function SeverityBadge({ value }: { value: number }) {
  return (
    <span
      className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold ${
        value <= 3
          ? "bg-green-100 text-green-700"
          : value <= 6
            ? "bg-yellow-100 text-yellow-700"
            : "bg-red-100 text-red-700"
      }`}
    >
      {value}
    </span>
  );
}

function History() {
  const [viewMode, setViewMode] = useState<"calendar" | "list">("list");
  const [dataVersion, setDataVersion] = useState(0);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  // Refresh data when dataVersion changes
  const historyData = getFullHistory();
  const allSymptoms = historyData.symptoms;
  const allMeals = historyData.meals;
  const allSupplements = historyData.supplements;
  const allProducts = historyData.products;
  const hasData = allSymptoms.length > 0 || allMeals.length > 0 || allSupplements.length > 0 || allProducts.length > 0;

  const handleDelete = (id: string, type: string) => {
    let ok = false;
    switch (type) {
      case "symptom": ok = deleteSymptom(id); break;
      case "meal": ok = deleteMeal(id); break;
      case "supplement": ok = deleteSupplement(id); break;
      case "product": ok = deleteProduct(id); break;
    }
    if (ok) {
      setDataVersion((v) => v + 1);
      setDeleteConfirm(null);
    }
  };

  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

  const calendarDays = Array.from({ length: daysInMonth }, (_, i) => {
    const day = i + 1;
    const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    const daySymptoms = allSymptoms.filter((s) => s.loggedAt.startsWith(dateStr));
    const avgSeverity = daySymptoms.length
      ? Math.round(daySymptoms.reduce((sum, s) => sum + s.severity, 0) / daySymptoms.length)
      : null;
    return { day, severity: avgSeverity };
  });

  // Build timeline entries from real data with IDs for edit/delete
  const timelineEntries = [
    ...allSymptoms.map((s) => ({
      id: s.id,
      date: new Date(s.loggedAt).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      type: "symptom" as const,
      title: s.symptomName,
      severity: s.severity <= 3 ? "mild" as const : s.severity <= 6 ? "moderate" as const : "severe" as const,
      notes: s.notes || undefined,
      time: new Date(s.loggedAt).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }),
      ts: new Date(s.loggedAt).getTime(),
      editPath: `/log-symptom?edit=${s.id}`,
    })),
    ...allMeals.map((m) => ({
      id: m.id,
      date: new Date(m.loggedAt).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      type: "meal" as const,
      title: m.foodName,
      notes: m.notes || undefined,
      time: m.mealType || new Date(m.loggedAt).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }),
      ts: new Date(m.loggedAt).getTime(),
      editPath: `/log-meal?edit=${m.id}`,
    })),
    ...allSupplements.map((s) => ({
      id: s.id,
      date: new Date(s.loggedAt).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      type: "supplement" as const,
      title: s.name,
      notes: s.brand ? `${s.brand}${s.dosage ? ` — ${s.dosage}` : ""}` : s.dosage || undefined,
      time: new Date(s.loggedAt).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }),
      ts: new Date(s.loggedAt).getTime(),
      editPath: `/log-supplement?edit=${s.id}`,
    })),
    ...allProducts.map((p) => ({
      id: p.id,
      date: new Date(p.loggedAt).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      type: "product" as const,
      title: p.name,
      notes: p.brand ? `${p.brand}${p.productType ? ` — ${p.productType}` : ""}` : p.productType || undefined,
      time: new Date(p.loggedAt).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }),
      ts: new Date(p.loggedAt).getTime(),
      editPath: `/log-product?edit=${p.id}`,
    })),
  ].sort((a, b) => b.ts - a.ts);

  // Group by date
  const groupedEntries: Record<string, typeof timelineEntries> = {};
  for (const entry of timelineEntries) {
    if (!groupedEntries[entry.date]) groupedEntries[entry.date] = [];
    groupedEntries[entry.date].push(entry);
  }

  // If no data, show empty state
  if (!hasData) {
    return (
      <div className="container-narrow py-8">
        <PageHeader
          title="History"
          description="Browse your symptom, meal, supplement, and product history."
        />
        <Card elevated className="text-center py-12">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-brand-50 flex items-center justify-center">
            <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5" className="text-brand-400">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
            </svg>
          </div>
          <h2 className="text-lg font-semibold text-text-primary mb-2">
            No history yet
          </h2>
          <p className="text-sm text-text-muted mb-6 max-w-xs mx-auto">
            Start logging your symptoms, meals, supplements, and products to see your history here.
          </p>
          <div className="flex items-center justify-center gap-3">
            <Link to="/log-symptom">
              <Button variant="primary">Log Symptom</Button>
            </Link>
            <Link to="/log-meal">
              <Button variant="outline">Log Meal</Button>
            </Link>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="container-narrow py-8">
      <PageHeader
        title="History"
        description="Browse your symptom, meal, supplement, and product history."
      >
        <div className="flex items-center gap-2 bg-surface-card border border-border-light rounded-lg p-0.5">
          <button
            onClick={() => setViewMode("list")}
            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
              viewMode === "list"
                ? "bg-brand-100 text-brand-700"
                : "text-text-muted hover:text-text-secondary"
            }`}
          >
            List
          </button>
          <button
            onClick={() => setViewMode("calendar")}
            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
              viewMode === "calendar"
                ? "bg-brand-100 text-brand-700"
                : "text-text-muted hover:text-text-secondary"
            }`}
          >
            Calendar
          </button>
        </div>
      </PageHeader>

      {/* Delete confirmation modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <div className="bg-white rounded-2xl shadow-xl p-6 max-w-sm mx-4">
            <h3 className="text-base font-semibold text-text-primary mb-2">
              Delete this entry?
            </h3>
            <p className="text-sm text-text-muted mb-6">
              This action cannot be undone. The entry will be permanently removed.
            </p>
            <div className="flex gap-3 justify-end">
              <Button variant="ghost" onClick={() => setDeleteConfirm(null)}>
                Cancel
              </Button>
              <Button
                variant="primary"
                className="!bg-red-500 !text-white hover:!bg-red-600"
                onClick={() => {
                  const [id, type] = (deleteConfirm || "").split("|");
                  handleDelete(id, type);
                }}
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}

      {viewMode === "calendar" && (
        <Card elevated className="mb-8">
          <CardHeader>
            <div className="flex items-center justify-between">
              <Select
                options={months}
                value={`${currentYear}-${String(currentMonth + 1).padStart(2, "0")}`}
                className="w-40"
              />
              <div className="flex gap-1 text-xs text-text-muted">
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-green-400" /> Mild
                </span>
                <span className="flex items-center gap-1 ml-2">
                  <span className="w-2 h-2 rounded-full bg-yellow-400" /> Moderate
                </span>
                <span className="flex items-center gap-1 ml-2">
                  <span className="w-2 h-2 rounded-full bg-red-400" /> Severe
                </span>
              </div>
            </div>
          </CardHeader>
          <CardBody>
            {/* Day headers */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
                <div
                  key={d}
                  className="text-center text-xs font-medium text-text-muted py-1"
                >
                  {d}
                </div>
              ))}
            </div>
            {/* Calendar grid */}
            <div className="grid grid-cols-7 gap-1">
              {Array.from({ length: new Date(currentYear, currentMonth, 1).getDay() }, (_, i) => (
                <div key={`empty-${i}`} className="aspect-square rounded-lg" />
              ))}
              {calendarDays.map((day) => (
                <div
                  key={day.day}
                  className={`aspect-square rounded-lg flex flex-col items-center justify-center transition-colors ${
                    day.severity !== null
                      ? "hover:bg-brand-50 cursor-pointer"
                      : ""
                  }`}
                >
                  <span className="text-xs font-medium text-text-primary">
                    {day.day}
                  </span>
                  {day.severity !== null && (
                    <SeverityBadge value={day.severity} />
                  )}
                </div>
              ))}
            </div>
          </CardBody>
        </Card>
      )}

      {/* Timeline / List view */}
      <div className="space-y-6">
        {Object.entries(groupedEntries).map(([dateGroup, entries]) => (
          <div key={dateGroup}>
            <h3 className="text-sm font-semibold text-text-muted uppercase tracking-wider mb-3">
              {dateGroup}
            </h3>
            <div className="space-y-2">
              {entries.map((entry, i) => (
                <Card
                  key={`${entry.id}-${i}`}
                  hoverable
                  className="flex items-center gap-4 px-5 py-3.5"
                >
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                      entry.type === "symptom"
                        ? "bg-coral-50 text-coral-500"
                        : entry.type === "meal"
                          ? "bg-teal-50 text-teal-500"
                          : entry.type === "supplement"
                            ? "bg-purple-50 text-purple-500"
                            : "bg-amber-50 text-amber-500"
                    }`}
                  >
                    {entry.type === "symptom" ? (
                      <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                      </svg>
                    ) : entry.type === "meal" ? (
                      <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" />
                      </svg>
                    ) : entry.type === "supplement" ? (
                      <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                      </svg>
                    ) : (
                      <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.994 15.994 0 011.622-3.395m3.42 3.42a15.995 15.995 0 004.764-4.648l3.876-5.814a1.151 1.151 0 00-1.597-1.597L14.146 6.32a15.996 15.996 0 00-4.649 4.763m3.42 3.42a6.776 6.776 0 00-3.42-3.42" />
                      </svg>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-text-primary">
                      {entry.title}
                    </p>
                    {entry.notes && (
                      <p className="text-xs text-text-muted mt-0.5">
                        {entry.notes}
                      </p>
                    )}
                    <p className="text-xs text-text-muted mt-0.5">
                      {entry.time}
                    </p>
                  </div>

                  {entry.type === "symptom" && entry.severity && (
                    <Badge
                      variant={
                        entry.severity === "mild"
                          ? "mild"
                          : entry.severity === "moderate"
                            ? "moderate"
                            : "severe"
                      }
                    >
                      {entry.severity}
                    </Badge>
                  )}
                  {entry.type === "meal" && (
                    <Badge variant="teal">Meal</Badge>
                  )}
                  {entry.type === "supplement" && (
                    <Badge variant="primary">Supplement</Badge>
                  )}
                  {entry.type === "product" && (
                    <Badge variant="warning">Product</Badge>
                  )}

                  {/* Edit & Delete buttons */}
                  <div className="flex items-center gap-1 shrink-0">
                    <Link
                      to={entry.editPath}
                      className="w-7 h-7 rounded-lg flex items-center justify-center text-text-muted hover:text-brand-600 hover:bg-brand-50 transition-colors"
                      title="Edit"
                    >
                      <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                      </svg>
                    </Link>
                    <button
                      type="button"
                      onClick={() => setDeleteConfirm(`${entry.id}|${entry.type}`)}
                      className="w-7 h-7 rounded-lg flex items-center justify-center text-text-muted hover:text-red-500 hover:bg-red-50 transition-colors"
                      title="Delete"
                    >
                      <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                      </svg>
                    </button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}