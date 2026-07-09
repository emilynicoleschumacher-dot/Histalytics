import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader, EmptyState } from "~/components/shared";
import { Card, CardBody, CardHeader } from "~/components/Card";
import { Badge } from "~/components/Badge";
import { Button } from "~/components/Button";
import { Input, Select } from "~/components/Input";

export const Route = createFileRoute("/history")({
  component: History,
});

const months = [
  { value: "2026-07", label: "July 2026" },
  { value: "2026-06", label: "June 2026" },
  { value: "2026-05", label: "May 2026" },
  { value: "2026-04", label: "April 2026" },
];

// Mock calendar data
const calendarDays = Array.from({ length: 31 }, (_, i) => ({
  day: i + 1,
  severity: [null, null, 3, null, 6, 8, 4, null, 2, 5, null, null, 7, 3, null, 1, null, 4, 6, null, null, 2, null, null, 5, 3, null, 8, 4, null, 1][i] as number | null,
}));

const historyEntries = [
  {
    date: "Today",
    type: "symptom",
    title: "Fatigue",
    severity: "moderate",
    time: "2:30 PM",
  },
  {
    date: "Today",
    type: "meal",
    title: "Lunch — Chicken salad",
    notes: "Contained avocado (high histamine)",
    time: "12:15 PM",
  },
  {
    date: "Today",
    type: "symptom",
    title: "Headache",
    severity: "mild",
    time: "9:45 AM",
  },
  {
    date: "Yesterday",
    type: "symptom",
    title: "Skin flushing",
    severity: "severe",
    time: "6:20 PM",
  },
  {
    date: "Yesterday",
    type: "meal",
    title: "Dinner — Salmon with rice",
    time: "7:00 PM",
  },
  {
    date: "Yesterday",
    type: "symptom",
    title: "Brain fog",
    severity: "moderate",
    time: "3:10 PM",
  },
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

  return (
    <div className="container-narrow py-8">
      <PageHeader
        title="History"
        description="Browse your symptom and meal history."
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

      {viewMode === "calendar" && (
        <Card elevated className="mb-8">
          <CardHeader>
            <div className="flex items-center justify-between">
              <Select
                options={months}
                value="2026-07"
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
            {/* Calendar grid — July 2026 starts on Wednesday */}
            <div className="grid grid-cols-7 gap-1">
              {Array.from({ length: 4 }, (_, i) => (
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
        {["Today", "Yesterday"].map((dateGroup) => (
          <div key={dateGroup}>
            <h3 className="text-sm font-semibold text-text-muted uppercase tracking-wider mb-3">
              {dateGroup}
            </h3>
            <div className="space-y-2">
              {historyEntries
                .filter((e) => e.date === dateGroup)
                .map((entry, i) => (
                  <Card
                    key={i}
                    hoverable
                    className="flex items-center gap-4 px-5 py-3.5"
                  >
                    {/* Icon */}
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                        entry.type === "symptom"
                          ? "bg-coral-50 text-coral-500"
                          : "bg-teal-50 text-teal-500"
                      }`}
                    >
                      {entry.type === "symptom" ? (
                        <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                        </svg>
                      ) : (
                        <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" />
                        </svg>
                      )}
                    </div>

                    {/* Content */}
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

                    {/* Badge */}
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
                  </Card>
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}