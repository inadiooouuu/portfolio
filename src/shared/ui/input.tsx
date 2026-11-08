import * as React from "react";
import { Input as KumoInput } from "@cloudflare/kumo";

/** Admin input built on Kumo's `Input`. */
export type InputProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "size"
> & {
  variant?: "default" | "error";
};

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ variant = "default", ...props }, ref) => (
    <KumoInput ref={ref} variant={variant} {...props} />
  )
);
Input.displayName = "Input";
