import { useState, useRef, type KeyboardEvent } from "react";
import { Badge } from "./Badge";

/**
 * IngredientInput — a text input where users can type or paste
 * ingredient lists. Ingredients are parsed into removable chips/tags.
 * Auto-suggests from known ingredients as the user types.
 */

// Common MCAS-relevant ingredients for auto-suggestion
const commonIngredients = [
  "Salt", "Sugar", "Garlic", "Onion", "Tomato", "Lemon juice",
  "Olive oil", "Coconut oil", "Butter", "Eggs", "Milk", "Cream",
  "Wheat flour", "Rice flour", "Almond flour", "Yeast",
  "Baking soda", "Baking powder", "Vinegar", "Soy sauce",
  "Fish sauce", "Cinnamon", "Turmeric", "Ginger", "Basil",
  "Parsley", "Cilantro", "Rosemary", "Thyme", "Black pepper",
  "Chili powder", "Paprika", "Mustard", "Honey", "Maple syrup",
  "Vanilla extract", "Chocolate", "Cocoa", "Coffee", "Tea",
  "Gelatin", "Pectin", "Xanthan gum", "Guar gum",
  "Citric acid", "Ascorbic acid", "Sorbic acid",
  "Sulfites", "Nitrates", "MSG", "Tyramine",
  "Gluten", "Lactose", "Soy", "Corn syrup",
  "High-fructose corn syrup", "Artificial flavor",
  "Natural flavor", "Food coloring", "Red 40", "Yellow 5",
];

interface IngredientInputProps {
  label?: string;
  placeholder?: string;
  value: string[];
  onChange: (ingredients: string[]) => void;
  helperText?: string;
}

export function IngredientInput({
  label = "Ingredients",
  placeholder = "Type an ingredient and press Enter, or paste a list...",
  value,
  onChange,
  helperText,
}: IngredientInputProps) {
  const [inputValue, setInputValue] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const parseIngredients = (text: string): string[] => {
    // Split by commas, semicolons, newlines, or "and"
    return text
      .split(/[,;\n]| and /)
      .map((s) => s.trim())
      .filter((s) => s.length > 0);
  };

  const addIngredient = (ingredient: string) => {
    const trimmed = ingredient.trim();
    if (trimmed && !value.includes(trimmed)) {
      onChange([...value, trimmed]);
    }
    setInputValue("");
    setSuggestions([]);
    setSelectedSuggestionIndex(-1);
    inputRef.current?.focus();
  };

  const removeIngredient = (ingredient: string) => {
    onChange(value.filter((v) => v !== ingredient));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setInputValue(val);

    if (val.length >= 1) {
      // Check if value contains separators (paste a list)
      if (/[,;\n]/.test(val)) {
        const parsed = parseIngredients(val);
        if (parsed.length > 1 || val.includes(",") || val.includes(";")) {
          // Add all parsed ingredients
          const newIngredients = [...value];
          for (const ing of parsed) {
            if (ing && !newIngredients.includes(ing)) {
              newIngredients.push(ing);
            }
          }
          onChange(newIngredients);
          setInputValue("");
          setSuggestions([]);
          return;
        }
      }

      // Show suggestions
      const matches = commonIngredients
        .filter((ing) => ing.toLowerCase().startsWith(val.toLowerCase()))
        .slice(0, 8);
      setSuggestions(matches);
      setSelectedSuggestionIndex(-1);
    } else {
      setSuggestions([]);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (selectedSuggestionIndex >= 0 && suggestions[selectedSuggestionIndex]) {
        addIngredient(suggestions[selectedSuggestionIndex]);
      } else if (inputValue.trim()) {
        addIngredient(inputValue.trim());
      }
    } else if (e.key === "Backspace" && !inputValue && value.length > 0) {
      // Remove last ingredient on backspace
      removeIngredient(value[value.length - 1]);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedSuggestionIndex((prev) =>
        prev < suggestions.length - 1 ? prev + 1 : prev,
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedSuggestionIndex((prev) => (prev > 0 ? prev - 1 : -1));
    } else if (e.key === "Escape") {
      setSuggestions([]);
      setSelectedSuggestionIndex(-1);
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    const pasted = e.clipboardData.getData("text");
    if (/[,;\n]/.test(pasted)) {
      e.preventDefault();
      const parsed = parseIngredients(pasted);
      const newIngredients = [...value];
      for (const ing of parsed) {
        if (ing && !newIngredients.includes(ing)) {
          newIngredients.push(ing);
        }
      }
      onChange(newIngredients);
    }
  };

  return (
    <div className="space-y-1.5">
      {label && (
        <label className="block text-sm font-medium text-text-primary">
          {label}
        </label>
      )}

      <div className="relative" ref={containerRef}>
        <div
          className="flex flex-wrap gap-1.5 rounded-lg border border-border-default bg-surface-card px-3 py-2 min-h-[44px] cursor-text focus-within:border-brand-400 focus-within:ring-2 focus-within:ring-brand-100 transition-all duration-150"
          onClick={() => inputRef.current?.focus()}
        >
          {value.map((ingredient) => (
            <span
              key={ingredient}
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-brand-50 border border-brand-200 text-xs font-medium text-brand-700"
            >
              {ingredient}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  removeIngredient(ingredient);
                }}
                className="inline-flex items-center justify-center w-3.5 h-3.5 rounded-full hover:bg-brand-200 text-brand-500 transition-colors"
                aria-label={`Remove ${ingredient}`}
              >
                <svg width="10" height="10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </span>
          ))}
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onPaste={handlePaste}
            placeholder={value.length === 0 ? placeholder : "Add more..."}
            className="flex-1 min-w-[120px] border-0 bg-transparent p-0 text-sm text-text-primary outline-none placeholder:text-text-muted"
          />
        </div>

        {/* Auto-suggest dropdown */}
        {suggestions.length > 0 && (
          <div className="absolute z-10 left-0 right-0 mt-1 rounded-lg bg-surface-card border border-border-default shadow-elevated overflow-hidden">
            {suggestions.map((suggestion, index) => (
              <button
                key={suggestion}
                type="button"
                onClick={() => addIngredient(suggestion)}
                onMouseEnter={() => setSelectedSuggestionIndex(index)}
                className={`w-full text-left px-3 py-2 text-sm transition-colors ${
                  index === selectedSuggestionIndex
                    ? "bg-brand-50 text-brand-700"
                    : "text-text-secondary hover:bg-brand-50/50"
                }`}
              >
                {suggestion}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Quick-add common trigger ingredients */}
      {value.length === 0 && (
        <div className="pt-1">
          <p className="text-xs text-text-muted mb-1.5">
            Quick add common triggers:
          </p>
          <div className="flex flex-wrap gap-1.5">
            {["Gluten", "Lactose", "Soy", "Eggs", "Sulfites"].map(
              (ing) => (
                <button
                  key={ing}
                  type="button"
                  onClick={() => addIngredient(ing)}
                  className="px-2 py-0.5 rounded text-[11px] font-medium border border-border-default text-text-muted hover:border-coral-200 hover:text-coral-600 hover:bg-coral-50 transition-all"
                >
                  + {ing}
                </button>
              ),
            )}
          </div>
        </div>
      )}

      {helperText && (
        <p className="text-xs text-text-muted">{helperText}</p>
      )}
    </div>
  );
}

/* ── Ingredient list display (read-only) ── */
interface IngredientListProps {
  ingredients: string[];
  triggerIngredients?: string[];
  max?: number;
}

export function IngredientList({
  ingredients,
  triggerIngredients = [],
  max = 10,
}: IngredientListProps) {
  const display = max ? ingredients.slice(0, max) : ingredients;
  const remaining = ingredients.length - display.length;

  return (
    <div className="flex flex-wrap gap-1">
      {display.map((ing) => {
        const isTrigger = triggerIngredients.includes(ing);
        return (
          <Badge
            key={ing}
            variant={isTrigger ? "coral" : "outline"}
            dot={isTrigger}
          >
            {ing}
          </Badge>
        );
      })}
      {remaining > 0 && (
        <span className="text-xs text-text-muted self-center">
          +{remaining} more
        </span>
      )}
    </div>
  );
}

/* ── Ingredient Trend Card ── */
interface IngredientTrend {
  name: string;
  correlationScore: number; // 0-100 how strongly linked to flares
  timesLogged: number;
  avgSeverity: number; // 1-10
  isTrigger?: boolean;
}

interface IngredientTrendCardProps {
  trends: IngredientTrend[];
  className?: string;
}

export function IngredientTrendCard({
  trends,
  className = "",
}: IngredientTrendCardProps) {
  const maxScore = Math.max(...trends.map((t) => t.correlationScore), 1);

  return (
    <div className={`space-y-3 ${className}`}>
      {trends.length === 0 ? (
        <div className="py-8 text-center">
          <div className="w-12 h-12 rounded-xl bg-brand-50 text-brand-400 flex items-center justify-center mx-auto mb-3">
            <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5m.75-9l3-3 2.148 2.148A12.061 12.061 0 0116.5 7.605" />
            </svg>
          </div>
          <p className="text-sm text-text-muted">
            Log more meals and symptoms to see ingredient trends
          </p>
        </div>
      ) : (
        trends.map((trend) => {
          const barWidth = (trend.correlationScore / maxScore) * 100;
          const severityColor =
            trend.avgSeverity <= 3
              ? "bg-green-400"
              : trend.avgSeverity <= 6
                ? "bg-yellow-400"
                : "bg-red-400";

          return (
            <div key={trend.name} className="space-y-1">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2 min-w-0">
                  {trend.isTrigger && (
                    <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="#f43f5e" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                    </svg>
                  )}
                  <span className="font-medium text-text-primary truncate">
                    {trend.name}
                  </span>
                  <span className="text-xs text-text-muted shrink-0">
                    {trend.timesLogged}x
                  </span>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className={`w-2 h-2 rounded-full ${severityColor}`} />
                  <span className="text-xs font-medium text-text-secondary">
                    {trend.correlationScore}%
                  </span>
                </div>
              </div>
              {/* Correlation bar */}
              <div className="h-2 rounded-full bg-brand-100 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    trend.isTrigger ? "bg-coral-400" : "bg-brand-400"
                  }`}
                  style={{ width: `${barWidth}%` }}
                />
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}

/* ── Trigger Warning Badge ── */
interface TriggerWarningBadgeProps {
  triggerCount: number;
  triggerNames?: string[];
  className?: string;
}

export function TriggerWarningBadge({
  triggerCount,
  triggerNames,
  className = "",
}: TriggerWarningBadgeProps) {
  if (triggerCount === 0) return null;

  return (
    <div
      className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-coral-50 border border-coral-200 text-coral-700 text-xs font-medium ${className}`}
      title={
        triggerNames
          ? `Contains trigger ingredients: ${triggerNames.join(", ")}`
          : undefined
      }
    >
      <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
      </svg>
      <span>
        {triggerCount} trigger ingredient{triggerCount !== 1 ? "s" : ""}
      </span>
    </div>
  );
}