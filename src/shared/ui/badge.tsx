import * as React from "react";
import { Badge as KumoBadge } from "@cloudflare/kumo";
import { cn } from "@/shared/lib/utils";

/**
 * Admin badge wrapper around Kumo's `Badge`.
 * Legacy variant names are mapped onto Kumo's semantic badge variants.
 */
export type BadgeVariant = "default" | "secondary" | "destructive" | "outline";

export interface BadgeProps {
  variant?: BadgeVariant;
  className?: string;
  children: React.ReactNode;
}

const variantMap = {
  default: "primary",
  secondary: "secondary",
  destructive: "error",
  outline: "outline",
} as const;

export function Badge({
  variant = "secondary",
  className,
  children,
}: BadgeProps) {
  return (
    <KumoBadge variant={variantMap[variant]} className={cn(className)}>
      {children}
    </KumoBadge>
  );
}
