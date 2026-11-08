import * as React from "react";
import { Input as KumoInput } from "@cloudflare/kumo";
import { cn } from "@/shared/lib/utils";

/** Admin input built on Kumo's `Input`. */
export type InputProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "size"
> & {
  variant?: "default" | "error";
};

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ variant = "default", className, ...props }, ref) => (
    <KumoInput ref={ref} variant={variant} className={cn("w-full", className)} {...props} />
  )
);
Input.displayName = "Input";
