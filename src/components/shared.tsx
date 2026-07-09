import { type ReactNode } from "react";

interface PageHeaderProps {
  title: string;
  description?: string;
  children?: ReactNode;
  className?: string;
}

export function PageHeader({
  title,
  description,
  children,
  className = "",
}: PageHeaderProps) {
  return (
    <div
      className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 ${className}`}
    >
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-text-primary tracking-tight">
          {title}
        </h1>
        {description && (
          <p className="mt-1 text-text-secondary max-w-xl">{description}</p>
        )}
      </div>
      {children && <div className="flex items-center gap-3 shrink-0">{children}</div>}
    </div>
  );
}

/* ── Empty state ── */
interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description: string;
  action?: ReactNode;
  className?: string;
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  className = "",
}: EmptyStateProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center py-16 px-6 text-center ${className}`}
    >
      {icon && (
        <div className="mb-4 w-16 h-16 rounded-2xl bg-brand-50 text-brand-400 flex items-center justify-center">
          {icon}
        </div>
      )}
      <h3 className="text-lg font-semibold text-text-primary mb-1">{title}</h3>
      <p className="text-sm text-text-muted max-w-sm mb-6">{description}</p>
      {action}
    </div>
  );
}

/* ── Severity slider ── */
interface SeveritySliderProps {
  value: number;
  onChange: (value: number) => void;
  label?: string;
}

export function SeveritySlider({
  value,
  onChange,
  label,
}: SeveritySliderProps) {
  const severityLabel =
    value === 0
      ? "None"
      : value <= 3
        ? "Mild"
        : value <= 6
          ? "Moderate"
          : "Severe";

  const barColor =
    value === 0
      ? "bg-gray-200"
      : value <= 3
        ? "bg-green-400"
        : value <= 6
          ? "bg-yellow-400"
          : "bg-red-400";

  return (
    <div className="space-y-2">
      {label && (
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-text-primary">
            {label}
          </label>
          <span
            className={`text-xs font-medium px-2 py-0.5 rounded-full ${
              value === 0
                ? "bg-gray-100 text-gray-500"
                : value <= 3
                  ? "bg-green-50 text-green-700"
                  : value <= 6
                    ? "bg-yellow-50 text-yellow-700"
                    : "bg-red-50 text-red-700"
            }`}
          >
            {severityLabel}
          </span>
        </div>
      )}
      <div className="relative pt-1">
        <input
          type="range"
          min="0"
          max="10"
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="
            w-full h-2 rounded-full appearance-none cursor-pointer
            bg-gray-200 accent-brand-500
            [&::-webkit-slider-thumb]:appearance-none
            [&::-webkit-slider-thumb]:w-5
            [&::-webkit-slider-thumb]:h-5
            [&::-webkit-slider-thumb]:rounded-full
            [&::-webkit-slider-thumb]:bg-white
            [&::-webkit-slider-thumb]:border-2
            [&::-webkit-slider-thumb]:border-brand-500
            [&::-webkit-slider-thumb]:shadow-soft
            [&::-webkit-slider-thumb]:cursor-pointer
            [&::-webkit-slider-thumb]:transition-transform
            [&::-webkit-slider-thumb]:hover:scale-110
            [&::-moz-range-thumb]:w-5
            [&::-moz-range-thumb]:h-5
            [&::-moz-range-thumb]:rounded-full
            [&::-moz-range-thumb]:bg-white
            [&::-moz-range-thumb]:border-2
            [&::-moz-range-thumb]:border-brand-500
            [&::-moz-range-thumb]:shadow-soft
            [&::-moz-range-thumb]:cursor-pointer
          "
        />
        {/* Color fill behind the thumb */}
        <div
          className={`absolute top-1 left-0 h-2 rounded-full pointer-events-none transition-all ${barColor}`}
          style={{ width: `${(value / 10) * 100}%` }}
        />
      </div>
      <div className="flex justify-between text-xs text-text-muted">
        <span>None</span>
        <span>Mild</span>
        <span>Moderate</span>
        <span>Severe</span>
      </div>
    </div>
  );
}

/* ── Stat card ── */
interface StatCardProps {
  label: string;
  value: string | number;
  trend?: "up" | "down" | "neutral";
  trendLabel?: string;
  icon?: ReactNode;
}

export function StatCard({
  label,
  value,
  trend,
  trendLabel,
  icon,
}: StatCardProps) {
  return (
    <div className="card p-4 sm:p-5">
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-sm text-text-muted">{label}</p>
          <p className="text-2xl sm:text-3xl font-bold text-text-primary">
            {value}
          </p>
          {trend && trendLabel && (
            <p
              className={`text-xs flex items-center gap-1 ${
                trend === "up"
                  ? "text-coral-500"
                  : trend === "down"
                    ? "text-green-500"
                    : "text-text-muted"
              }`}
            >
              {trend === "up" && "↑"}
              {trend === "down" && "↓"}
              {trend === "neutral" && "→"}
              {trendLabel}
            </p>
          )}
        </div>
        {icon && (
          <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-500 flex items-center justify-center shrink-0">
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}