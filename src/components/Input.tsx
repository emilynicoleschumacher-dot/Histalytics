import { type InputHTMLAttributes, type ReactNode } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  suffix?: ReactNode;
}

export function Input({
  label,
  error,
  helperText,
  suffix,
  className = "",
  id,
  ...props
}: InputProps) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className="space-y-1.5">
      {label && (
        <label
          htmlFor={inputId}
          className="block text-sm font-medium text-text-primary"
        >
          {label}
        </label>
      )}
      <div className="relative">
        <input
          id={inputId}
          className={`
            block w-full rounded-lg border px-3.5 py-2.5 text-sm
            transition-all duration-150 ease-in-out
            placeholder:text-text-muted
            bg-surface-card
            ${error
              ? "border-coral-300 focus:border-coral-400 focus:ring-2 focus:ring-coral-100"
              : "border-border-default focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
            }
            ${suffix ? "pr-10" : ""}
            ${className}
          `}
          {...props}
        />
        {suffix && (
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-text-muted">
            {suffix}
          </div>
        )}
      </div>
      {error && <p className="text-xs text-coral-500">{error}</p>}
      {helperText && !error && (
        <p className="text-xs text-text-muted">{helperText}</p>
      )}
    </div>
  );
}

/* ── Textarea ── */
interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export function Textarea({
  label,
  error,
  className = "",
  id,
  ...props
}: TextareaProps) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className="space-y-1.5">
      {label && (
        <label
          htmlFor={inputId}
          className="block text-sm font-medium text-text-primary"
        >
          {label}
        </label>
      )}
      <textarea
        id={inputId}
        className={`
          block w-full rounded-lg border px-3.5 py-2.5 text-sm resize-y min-h-[80px]
          transition-all duration-150 ease-in-out
          placeholder:text-text-muted
          bg-surface-card
          ${error
            ? "border-coral-300 focus:border-coral-400 focus:ring-2 focus:ring-coral-100"
            : "border-border-default focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
          }
          ${className}
        `}
        {...props}
      />
      {error && <p className="text-xs text-coral-500">{error}</p>}
    </div>
  );
}

/* ── Select ── */
interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { value: string; label: string }[];
  placeholder?: string;
}

export function Select({
  label,
  error,
  options,
  placeholder,
  className = "",
  id,
  ...props
}: SelectProps) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className="space-y-1.5">
      {label && (
        <label
          htmlFor={inputId}
          className="block text-sm font-medium text-text-primary"
        >
          {label}
        </label>
      )}
      <select
        id={inputId}
        className={`
          block w-full rounded-lg border px-3.5 py-2.5 text-sm
          transition-all duration-150 ease-in-out
          bg-surface-card
          ${error
            ? "border-coral-300 focus:border-coral-400 focus:ring-2 focus:ring-coral-100"
            : "border-border-default focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
          }
          ${className}
        `}
        {...props}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && <p className="text-xs text-coral-500">{error}</p>}
    </div>
  );
}