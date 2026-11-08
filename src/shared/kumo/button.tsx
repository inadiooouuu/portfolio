import * as React from "react";
import { Button as KumoButton } from "@cloudflare/kumo";
import { cn } from "@/shared/lib/utils";

/**
 * Admin button adapter.
 *
 * The admin console keeps the legacy variant/size names used across its pages,
 * but renders the real Kumo `Button` underneath so emphasis colors, rings,
 * sizing and focus states match Cloudflare's dashboard.
 */
export type ButtonVariant =
  | "default"
  | "emphasis"
  | "destructive"
  | "outline"
  | "secondary"
  | "ghost"
  | "link";

export type ButtonSize = "default" | "sm" | "lg" | "icon" | "icon-sm";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
}

type KumoButtonCompatProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?:
    | "primary"
    | "secondary"
    | "ghost"
    | "destructive"
    | "secondary-destructive"
    | "outline";
  size?: "xs" | "sm" | "base" | "lg";
  shape?: "base" | "square" | "circle";
  loading?: boolean;
  title?: React.ReactNode;
};

const KumoButtonCompat = KumoButton as unknown as React.ForwardRefExoticComponent<
  KumoButtonCompatProps & React.RefAttributes<HTMLButtonElement>
>;

const variantMap = {
  default: "primary",
  emphasis: "primary",
  destructive: "secondary-destructive",
  outline: "outline",
  secondary: "secondary",
  ghost: "ghost",
  link: "ghost",
} as const;

const sizeMap = {
  default: "base",
  sm: "sm",
  lg: "lg",
  icon: "base",
  "icon-sm": "sm",
} as const;

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { variant = "default", size = "default", className, type = "button", ...props },
    ref
  ) => {
    const isIcon = size === "icon" || size === "icon-sm";

    return (
      <KumoButtonCompat
        ref={ref}
        type={type}
        variant={variantMap[variant]}
        size={sizeMap[size]}
        shape={isIcon ? "square" : "base"}
        className={cn("font-medium", className)}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";
