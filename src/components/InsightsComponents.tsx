import { useState, type ReactNode } from "react";
import { Badge } from "./Badge";

/* ── Page-wide Disclaimer Banner ── */

export function DisclaimerBanner() {
  return (
    <div className="flex items-start gap-3 p-4 rounded-xl bg-amber-50/80 border border-amber-200/60 mb-8">
      <div className="shrink-0 w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center text-amber-600">
        <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
        </svg>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-amber-800">
          These insights are based on patterns in your personal logs — not medical advice.
        </p>
        <p className="text-xs text-amber-600/80 mt-0.5">
          Share them with your provider to inform your care plan.
        </p>
      </div>
    </div>
  );
}

/* ── Info Tooltip (small "?" icon with popup) ── */

interface InfoTooltipProps {
  text: string;
  className?: string;
}

export function InfoTooltip({ text, className = "" }: InfoTooltipProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className={`relative inline-flex ${className}`}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        onBlur={() => setTimeout(() => setOpen(false), 200)}
        className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-brand-100 text-brand-500 hover:bg-brand-200 transition-colors"
        aria-label="More information"
      >
        <svg width="10" height="10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M12 18h.008v.008H12V18z" />
        </svg>
      </button>
      {open && (
        <div className="absolute z-10 bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-3 rounded-lg bg-gray-900 text-white text-xs leading-relaxed shadow-elevated">
          {text}
          <div className="absolute top-full left-1/2 -translate-x-1/2 w-2 h-2 bg-gray-900 rotate-45" />
        </div>
      )}
    </div>
  );
}

/* ── Footer Footnote ── */

export function InsightFootnote() {
  return (
    <p className="text-xs text-text-muted text-center mt-8 pt-6 border-t border-border-light">
      Patterns are based on your logs — talk to your doctor about what they might mean for you.
    </p>
  );
}

/* ── Time Range Toggle ── */

type TimeRange = "7d" | "14d" | "30d";

interface TimeToggleProps {
  value: TimeRange;
  onChange: (range: TimeRange) => void;
}

export function TimeToggle({ value, onChange }: TimeToggleProps) {
  const options: { key: TimeRange; label: string }[] = [
    { key: "7d", label: "7 days" },
    { key: "14d", label: "14 days" },
    { key: "30d", label: "30 days" },
  ];

  return (
    <div className="inline-flex bg-surface-card border border-border-light rounded-lg p-0.5">
      {options.map((opt) => (
        <button
          key={opt.key}
          type="button"
          onClick={() => onChange(opt.key)}
          className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
            value === opt.key
              ? "bg-brand-100 text-brand-700"
              : "text-text-muted hover:text-text-secondary"
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

/* ── Symptom Trend Chart (SVG multi-line) ── */

interface TrendPoint {
  date: string;
  label: string;
  values: { symptomName: string; severity: number }[];
}

interface SymptomTrendChartProps {
  data: TrendPoint[];
  className?: string;
}

const SYMPTOM_COLORS = ["#8b5cf6", "#14b8a6", "#f43f5e", "#f59e0b", "#6366f1"];

export function SymptomTrendChart({ data, className = "" }: SymptomTrendChartProps) {
  if (data.length === 0) {
    return (
      <EmptyInsight
        icon={
          <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
          </svg>
        }
        title="No trend data yet"
        description="Log a few symptoms over several days to see your trends here."
      />
    );
  }

  // Collect unique symptom names
  const symptomNames = [...new Set(data.flatMap((d) => d.values.map((v) => v.symptomName)))].slice(0, 5);
  const maxSeverity = 10;

  // SVG dimensions
  const width = 600;
  const height = 200;
  const padding = { top: 20, right: 20, bottom: 30, left: 40 };
  const chartW = width - padding.left - padding.right;
  const chartH = height - padding.top - padding.bottom;

  // Build paths
  const paths = symptomNames.map((name, si) => {
    const points = data.map((d, i) => {
      const found = d.values.find((v) => v.symptomName === name);
      const x = padding.left + (i / Math.max(data.length - 1, 1)) * chartW;
      const y = padding.top + chartH - (found ? (found.severity / maxSeverity) * chartH : 0);
      return { x, y, exists: !!found };
    });

    const validPoints = points.filter((p) => p.exists);
    if (validPoints.length === 0) return null;

    let pathD = "";
    validPoints.forEach((p, i) => {
      if (i === 0) pathD += `M ${p.x} ${p.y}`;
      else pathD += ` L ${p.x} ${p.y}`;
    });

    return { name, color: SYMPTOM_COLORS[si % SYMPTOM_COLORS.length], pathD, points };
  }).filter(Boolean);

  // Y-axis ticks
  const yTicks = [0, 2, 4, 6, 8, 10];

  return (
    <div className={className}>
      {/* Legend */}
      <div className="flex flex-wrap gap-3 mb-4">
        {symptomNames.map((name, i) => (
          <div key={name} className="flex items-center gap-1.5">
            <span
              className="w-2.5 h-2.5 rounded-full"
              style={{ backgroundColor: SYMPTOM_COLORS[i % SYMPTOM_COLORS.length] }}
            />
            <span className="text-xs font-medium text-text-secondary">{name}</span>
          </div>
        ))}
      </div>

      {/* SVG Chart */}
      <div className="w-full overflow-x-auto">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full max-w-full"
          style={{ minWidth: `${width}px`, maxHeight: `${height}px` }}
          role="img"
          aria-label="Symptom severity trends over time"
        >
          {/* Y-axis grid lines */}
          {yTicks.map((tick) => {
            const y = padding.top + chartH - (tick / maxSeverity) * chartH;
            return (
              <g key={tick}>
                <line
                  x1={padding.left}
                  y1={y}
                  x2={width - padding.right}
                  y2={y}
                  stroke="#e8e5f0"
                  strokeWidth="1"
                />
                <text
                  x={padding.left - 8}
                  y={y + 4}
                  textAnchor="end"
                  className="text-[10px] fill-text-muted"
                >
                  {tick}
                </text>
              </g>
            );
          })}

          {/* Data lines */}
          {paths.map((path) =>
            path ? (
              <path
                key={path.name}
                d={path.pathD}
                fill="none"
                stroke={path.color}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="transition-all duration-300"
              />
            ) : null
          )}

          {/* Data dots on hover (static for wireframe) */}
          {paths.map((path) =>
            path
              ? path.points
                  .filter((p) => p.exists)
                  .map((p, i) => (
                    <circle
                      key={`${path.name}-${i}`}
                      cx={p.x}
                      cy={p.y}
                      r="3"
                      fill={path.color}
                      stroke="white"
                      strokeWidth="2"
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                    />
                  ))
              : null
          )}
        </svg>
      </div>

      {/* X-axis labels */}
      <div className="flex justify-between mt-1 px-10">
        {data.length > 0 && (
          <>
            <span className="text-[10px] text-text-muted">{data[0].label}</span>
            {data.length > 2 && (
              <span className="text-[10px] text-text-muted">{data[Math.floor(data.length / 2)].label}</span>
            )}
            <span className="text-[10px] text-text-muted">{data[data.length - 1].label}</span>
          </>
        )}
      </div>
    </div>
  );
}

/* ── Flare Day Bar Chart ── */

interface FlareDayProps {
  day: string;
  value: number; // avg severity 0-10
  isFlare: boolean; // value >= 6
}

interface FlareDayChartProps {
  data: FlareDayProps[];
  flareCount: number;
  totalDays: number;
  className?: string;
}

export function FlareDayChart({ data, flareCount, totalDays, className = "" }: FlareDayChartProps) {
  const flarePercent = totalDays > 0 ? Math.round((flareCount / totalDays) * 100) : 0;

  return (
    <div className={className}>
      {/* Summary */}
      <div className="flex items-center gap-4 mb-5 p-4 rounded-xl bg-coral-50/60 border border-coral-200/50">
        <div className="w-12 h-12 rounded-xl bg-coral-100 flex items-center justify-center text-coral-500">
          <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.048 8.287 8.287 0 009 9.6a8.983 8.983 0 013.361-6.867 8.21 8.21 0 003 2.48z" />
          </svg>
        </div>
        <div>
          <p className="text-sm font-semibold text-text-primary">
            {flareCount} flare day{flareCount !== 1 ? "s" : ""} in the last {totalDays} days
          </p>
          <p className="text-xs text-text-muted">
            {flarePercent}% of days had elevated symptom severity (avg ≥ 6/10)
          </p>
        </div>
      </div>

      {/* Flare summary */}
      <div className="flex items-center gap-4 mb-5 p-4 rounded-xl bg-coral-50/60 border border-coral-200/50">
        <div className="w-12 h-12 rounded-xl bg-coral-100 flex items-center justify-center text-coral-500">
          <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.048 8.287 8.287 0 009 9.6a8.983 8.983 0 013.361-6.867 8.21 8.21 0 003 2.48z" />
          </svg>
        </div>
        <div>
          <p className="text-sm font-semibold text-text-primary">
            {flareCount} flare day{flareCount !== 1 ? "s" : ""} in the last {totalDays} days
          </p>
          <p className="text-xs text-text-muted">
            {flarePercent}% of days had elevated symptom severity (avg ≥ 6/10)
          </p>
        </div>
      </div>

      {/* Color key */}
      <div className="flex items-center gap-4 mb-4 text-xs text-text-muted">
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-green-400 inline-block" />
          Low (≤3)
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-yellow-400 inline-block" />
          Moderate
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-coral-400 inline-block" />
          Flare (≥6)
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-neutral-200 inline-block" />
          No data
        </span>
      </div>

      {/* Severity dots row */}
      <div className="flex items-end justify-between gap-2 py-2">
        {data.map((day) => {
          const dotColor = !day.value || (day.value === 0 && !day.isFlare)
            ? "bg-neutral-200 border border-neutral-300 text-transparent"
            : day.isFlare
              ? "bg-coral-400 text-white"
              : day.value > 3
                ? "bg-yellow-400 text-white"
                : "bg-green-400 text-white";
          const showValue = day.value > 0;
          return (
            <div key={day.day} className="flex-1 flex flex-col items-center gap-1.5">
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center text-[11px] font-bold shadow-sm transition-transform hover:scale-110 ${dotColor}`}
                title={`${day.day}: severity ${day.value}/10${day.isFlare ? " (flare)" : ""}`}
              >
                {showValue ? day.value : "—"}
              </div>
              <span className="text-[10px] text-text-muted truncate w-full text-center font-medium">
                {day.day}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ── Day-of-Week Breakdown ── */

interface DayOfWeekData {
  day: string;
  avgSeverity: number;
  logCount: number;
}

interface DayOfWeekBreakdownProps {
  data: DayOfWeekData[];
  className?: string;
}

export function DayOfWeekBreakdown({ data, className = "" }: DayOfWeekBreakdownProps) {
  return (
    <div className={className}>
      <div className="grid grid-cols-7 gap-2">
        {data.map((d) => {
          const intensity =
            d.avgSeverity === 0
              ? "bg-brand-50/40 text-text-muted"
              : d.avgSeverity <= 3
                ? "bg-green-50 text-green-700 border-green-200"
                : d.avgSeverity <= 6
                  ? "bg-yellow-50 text-yellow-700 border-yellow-200"
                  : "bg-coral-50 text-coral-700 border-coral-200";

          return (
            <div
              key={d.day}
              className={`flex flex-col items-center gap-1 p-3 rounded-xl border ${intensity} transition-all`}
            >
              <span className="text-[10px] font-semibold uppercase tracking-wider">{d.day.slice(0, 3)}</span>
              <span className="text-lg font-bold">{d.avgSeverity > 0 ? d.avgSeverity.toFixed(1) : "—"}</span>
              <span className="text-[10px] opacity-60">{d.logCount} log{d.logCount !== 1 ? "s" : ""}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ── Ingredient Correlation Bar (expandable) ── */

interface CorrelationItem {
  ingredientName: string;
  timesLogged: number;
  timesOnFlareDays: number;
  correlationPercent: number; // 0-100
  category: string;
  logDates?: string[];
}

interface CorrelationBarProps {
  item: CorrelationItem;
  defaultOpen?: boolean;
}

export function CorrelationBar({ item, defaultOpen = false }: CorrelationBarProps) {
  const [expanded, setExpanded] = useState(defaultOpen);

  const colorClass =
    item.correlationPercent > 60
      ? "bg-coral-400"
      : item.correlationPercent > 40
        ? "bg-amber-400"
        : "bg-brand-300";

  const labelClass =
    item.correlationPercent > 60
      ? "text-coral-700 bg-coral-50 border-coral-200"
      : item.correlationPercent > 40
        ? "text-amber-700 bg-amber-50 border-amber-200"
        : "text-text-muted bg-brand-50 border-brand-200";

  const correlationLabel =
    item.correlationPercent > 60
      ? "Frequent companion"
      : item.correlationPercent > 40
        ? "Often present"
        : "Low correlation";

  return (
    <div className="border border-border-light rounded-xl overflow-hidden transition-all">
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        className="w-full text-left px-4 py-3.5 hover:bg-brand-50/30 transition-colors"
      >
        <div className="flex items-center gap-3">
          {/* Correlation bar */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-2 min-w-0">
                <span className="text-sm font-medium text-text-primary truncate">
                  {item.ingredientName}
                </span>
                <span className="text-xs text-text-muted shrink-0">
                  {item.timesLogged}x
                </span>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full border ${labelClass}`}>
                  {item.correlationPercent}%
                </span>
                <svg
                  width="14"
                  height="14"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                  className={`text-text-muted transition-transform ${expanded ? "rotate-180" : ""}`}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                </svg>
              </div>
            </div>
            <div className="h-2 rounded-full bg-brand-100 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${colorClass}`}
                style={{ width: `${item.correlationPercent}%` }}
              />
            </div>
            <div className="flex justify-between mt-1">
              <span className="text-[10px] text-text-muted">{correlationLabel}</span>
              <span className="text-[10px] text-text-muted">
                {item.timesOnFlareDays} of {item.timesLogged} on flare days
              </span>
            </div>
          </div>
        </div>
      </button>

      {/* Expanded detail */}
      {expanded && (
        <div className="px-4 py-3 bg-brand-50/30 border-t border-border-light">
          <p className="text-xs font-medium text-text-muted mb-2">Individual logs where this ingredient was present:</p>
          {item.logDates && item.logDates.length > 0 ? (
            <div className="space-y-1">
              {item.logDates.map((date, i) => (
                <div key={i} className="flex items-center gap-2 text-xs text-text-secondary">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-400 shrink-0" />
                  {date}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-text-muted italic">No detailed log data available yet.</p>
          )}
        </div>
      )}
    </div>
  );
}

/* ── Combined Timeline ── */

type LogEntryType = "symptom" | "meal" | "product" | "supplement";

interface TimelineEntry {
  id: string;
  type: LogEntryType;
  title: string;
  subtitle: string;
  severity?: number;
  time: string;
  ingredients?: string[];
  notes?: string;
}

interface CombinedTimelineProps {
  entries: TimelineEntry[];
  className?: string;
}

const typeIcons: Record<LogEntryType, ReactNode> = {
  symptom: (
    <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
    </svg>
  ),
  meal: (
    <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" />
    </svg>
  ),
  product: (
    <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.994 15.994 0 011.622-3.395m3.42 3.42a15.995 15.995 0 004.764-4.648l3.876-5.814a1.151 1.151 0 00-1.597-1.597L14.146 6.32a15.996 15.996 0 00-4.649 4.763m3.42 3.42a6.776 6.776 0 00-3.42-3.42" />
    </svg>
  ),
  supplement: (
    <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5m8.25 3v6.75m0 0l-3-3m3 3l3-3M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
    </svg>
  ),
};

const typeColors: Record<LogEntryType, string> = {
  symptom: "bg-coral-50 text-coral-500",
  meal: "bg-teal-50 text-teal-500",
  product: "bg-brand-50 text-brand-500",
  supplement: "bg-amber-50 text-amber-600",
};

const typeBadgeVariant: Record<LogEntryType, "severe" | "teal" | "brand" | "outline"> = {
  symptom: "severe",
  meal: "teal",
  product: "brand",
  supplement: "outline",
};

export function CombinedTimeline({ entries, className = "" }: CombinedTimelineProps) {
  // Group by date
  const grouped: Record<string, TimelineEntry[]> = {};
  for (const entry of entries) {
    if (!grouped[entry.subtitle]) grouped[entry.subtitle] = [];
    grouped[entry.subtitle].push(entry);
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {Object.entries(grouped).map(([date, dayEntries]) => (
        <TimelineDay key={date} date={date} entries={dayEntries} />
      ))}
    </div>
  );
}

interface TimelineDayProps {
  date: string;
  entries: TimelineEntry[];
}

function TimelineDay({ date, entries }: TimelineDayProps) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div>
      <button
        type="button"
        onClick={() => setCollapsed(!collapsed)}
        className="flex items-center gap-2 w-full text-left mb-3"
      >
        <div className="h-px flex-1 bg-border-light" />
        <span className="text-xs font-semibold text-text-muted uppercase tracking-wider shrink-0">
          {date}
        </span>
        <div className="h-px flex-1 bg-border-light" />
        <svg
          width="14"
          height="14"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2"
          className={`text-text-muted transition-transform ${collapsed ? "" : "rotate-180"}`}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
        </svg>
      </button>

      {!collapsed && (
        <div className="space-y-2">
          {entries.map((entry) => (
            <div
              key={entry.id}
              className="flex items-start gap-3 px-4 py-3 rounded-xl border border-border-light bg-surface-card hover:bg-brand-50/20 transition-colors"
            >
              {/* Icon */}
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${typeColors[entry.type]}`}>
                {typeIcons[entry.type]}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium text-text-primary">{entry.title}</p>
                  <Badge variant={typeBadgeVariant[entry.type]}>{entry.type}</Badge>
                </div>
                {entry.ingredients && entry.ingredients.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-1">
                    {entry.ingredients.slice(0, 4).map((ing) => (
                      <span
                        key={ing}
                        className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-brand-50 text-brand-600"
                      >
                        {ing}
                      </span>
                    ))}
                    {entry.ingredients.length > 4 && (
                      <span className="text-[10px] text-text-muted self-center">+{entry.ingredients.length - 4}</span>
                    )}
                  </div>
                )}
                {entry.notes && (
                  <p className="text-xs text-text-muted mt-0.5">{entry.notes}</p>
                )}
              </div>

              {/* Time + severity */}
              <div className="shrink-0 text-right">
                <p className="text-xs text-text-muted">{entry.time}</p>
                {entry.severity !== undefined && (
                  <Badge
                    variant={
                      entry.severity <= 3 ? "mild" : entry.severity <= 6 ? "moderate" : "severe"
                    }
                  >
                    {entry.severity}/10
                  </Badge>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ── Empty insight state ── */

interface EmptyInsightProps {
  icon?: ReactNode;
  title: string;
  description: string;
  className?: string;
}

function EmptyInsight({ icon, title, description, className = "" }: EmptyInsightProps) {
  return (
    <div className={`flex flex-col items-center justify-center py-12 px-6 text-center ${className}`}>
      {icon && (
        <div className="mb-4 w-14 h-14 rounded-2xl bg-brand-50 text-brand-400 flex items-center justify-center">
          {icon}
        </div>
      )}
      <h3 className="text-base font-semibold text-text-primary mb-1">{title}</h3>
      <p className="text-sm text-text-muted max-w-xs">{description}</p>
    </div>
  );
}