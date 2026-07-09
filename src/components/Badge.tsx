import { type ReactNode } from "react";

type BadgeVariant = "brand" | "teal" | "coral" | "mild" | "moderate" | "severe" | "outline";

interface BadgeProps {
  children: ReactNode;
  variant?: BadgeVariant;
  className?: string;
  dot?: boolean;
}

const variantStyles: Record<BadgeVariant, string> = {
  brand: "bg-brand-100 text-brand-700 border-brand-200",
  teal: "bg-teal-50 text-teal-700 border-teal-200",
  coral: "bg-coral-50 text-coral-700 border-coral-200",
  mild: "bg-green-50 text-green-700 border-green-200",
  moderate: "bg-yellow-50 text-yellow-700 border-yellow-200",
  severe: "bg-red-50 text-red-700 border-red-200",
  outline: "bg-transparent text-text-secondary border-border-default",
};

const dotColors: Record<BadgeVariant, string> = {
  brand: "bg-brand-500",
  teal: "bg-teal-500",
  coral: "bg-coral-500",
  mild: "bg-green-400",
  moderate: "bg-yellow-400",
  severe: "bg-red-400",
  outline: "bg-text-muted",
};

export function Badge({
  children,
  variant = "brand",
  className = "",
  dot = false,
}: BadgeProps) {
  return (
    <span
      className={`
        inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5
        text-xs font-medium border
        ${variantStyles[variant]}
        ${className}
      `}
    >
      {dot && (
        <span
          className={`inline-block w-1.5 h-1.5 rounded-full ${dotColors[variant]}`}
        />
      )}
      {children}
    </span>
  );
}