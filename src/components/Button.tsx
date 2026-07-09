import { type ButtonHTMLAttributes, type ReactNode } from "react";

type Variant = "primary" | "secondary" | "outline" | "ghost" | "danger";
type Size = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  children: ReactNode;
  isLoading?: boolean;
  fullWidth?: boolean;
}

const variantStyles: Record<Variant, string> = {
  primary:
    "bg-brand-600 text-white hover:bg-brand-700 active:bg-brand-800 shadow-soft hover:shadow-card",
  secondary:
    "bg-teal-500 text-white hover:bg-teal-600 active:bg-teal-700 shadow-soft",
  outline:
    "border-2 border-brand-200 text-brand-700 hover:bg-brand-50 active:bg-brand-100",
  ghost:
    "text-text-secondary hover:text-brand-600 hover:bg-brand-50 active:bg-brand-100",
  danger:
    "bg-coral-500 text-white hover:bg-coral-600 active:bg-coral-700 shadow-soft",
};

const sizeStyles: Record<Size, string> = {
  sm: "px-3 py-1.5 text-sm gap-1.5",
  md: "px-4 py-2.5 text-sm gap-2",
  lg: "px-6 py-3 text-base gap-2",
};

export function Button({
  variant = "primary",
  size = "md",
  children,
  isLoading = false,
  fullWidth = false,
  className = "",
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      className={`
        inline-flex items-center justify-center font-medium
        rounded-lg transition-all duration-150 ease-in-out
        focus-visible:outline-2 focus-visible:outline-offset-2
        focus-visible:outline-brand-500/60
        disabled:opacity-50 disabled:cursor-not-allowed
        select-none
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${fullWidth ? "w-full" : ""}
        ${className}
      `}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && (
        <svg
          className="animate-spin h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      )}
      {children}
    </button>
  );
}