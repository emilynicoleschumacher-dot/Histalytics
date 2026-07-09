import { type ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
  elevated?: boolean;
  onClick?: () => void;
  hoverable?: boolean;
}

export function Card({
  children,
  className = "",
  elevated = false,
  onClick,
  hoverable = false,
}: CardProps) {
  const Component = onClick ? "button" : "div";

  return (
    <Component
      className={`
        ${elevated ? "card-elevated" : "card"}
        ${hoverable ? "cursor-pointer hover:-translate-y-0.5 hover:shadow-elevated" : ""}
        ${onClick ? "text-left w-full" : ""}
        transition-all duration-200 ease-in-out
        ${className}
      `}
      onClick={onClick}
    >
      {children}
    </Component>
  );
}

export function CardHeader({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`px-5 pt-5 pb-3 border-b border-border-light ${className}`}>
      {children}
    </div>
  );
}

export function CardBody({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={`px-5 py-4 ${className}`}>{children}</div>;
}

export function CardFooter({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`px-5 py-3 border-t border-border-light ${className}`}
    >
      {children}
    </div>
  );
}