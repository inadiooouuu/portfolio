import * as React from "react";
import { Textarea as KumoTextarea } from "@cloudflare/kumo";

/** Admin textarea built on Kumo's `Textarea`. */
export type TextareaProps = Omit<
  React.TextareaHTMLAttributes<HTMLTextAreaElement>,
  "size"
> & {
  variant?: "default" | "error";
};

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ variant = "default", ...props }, ref) => (
    <KumoTextarea ref={ref} variant={variant} {...props} />
  )
);
Textarea.displayName = "Textarea";
