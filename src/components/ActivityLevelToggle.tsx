import { type ActivityLevel } from "~/lib/data-store";

interface ActivityLevelToggleProps {
  value: ActivityLevel;
  onChange: (level: ActivityLevel) => void;
  label?: string;
}

const levels: { value: ActivityLevel; label: string; icon: string; color: string }[] = [
  {
    value: "low",
    label: "Low",
    icon: "🟢",
    color: "border-green-300 bg-green-50 text-green-700 hover:bg-green-100 data-[active=true]:ring-2 data-[active=true]:ring-green-400 data-[active=true]:border-green-500",
  },
  {
    value: "medium",
    label: "Medium",
    icon: "🟡",
    color: "border-amber-300 bg-amber-50 text-amber-700 hover:bg-amber-100 data-[active=true]:ring-2 data-[active=true]:ring-amber-400 data-[active=true]:border-amber-500",
  },
  {
    value: "high",
    label: "High",
    icon: "🔴",
    color: "border-coral-300 bg-coral-50 text-coral-700 hover:bg-coral-100 data-[active=true]:ring-2 data-[active=true]:ring-coral-400 data-[active=true]:border-coral-500",
  },
];

export function ActivityLevelToggle({
  value,
  onChange,
  label = "Activity Level",
}: ActivityLevelToggleProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-text-primary">{label}</label>
        {value && (
          <button
            type="button"
            onClick={() => onChange(null)}
            className="text-xs text-text-muted hover:text-text-secondary underline"
          >
            Clear
          </button>
        )}
      </div>
      <div className="flex gap-2">
        {levels.map((level) => (
          <button
            key={level.value}
            type="button"
            data-active={value === level.value}
            onClick={() => onChange(value === level.value ? null : level.value)}
            className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl border text-sm font-medium transition-all
              ${value === level.value ? level.color : "border-border-default bg-surface-card text-text-secondary hover:bg-brand-50/30 hover:border-brand-300"}
            `}
          >
            <span className="text-base">{level.icon}</span>
            <span>{level.label}</span>
          </button>
        ))}
      </div>
      <p className="text-xs text-text-muted">
        Optional — tag how active you've been today (e.g., rest day, normal day, strenuous)
      </p>
    </div>
  );
}