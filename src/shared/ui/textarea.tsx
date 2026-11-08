import * as React from "react";
import { Textarea as KumoTextarea } from "@cloudflare/kumo";
import { cn } from "@/shared/lib/utils";

/** Admin textarea built on Kumo's `Textarea`. */
export type TextareaProps = Omit<
  React.TextareaHTMLAttributes<HTMLTextAreaElement>,
  "size"
> & {
  variant?: "default" | "error";
};

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ variant = "default", className, ...props }, ref) => (
    <KumoTextarea ref={ref} variant={variant} className={cn("w-full", className)} {...props} />
  )
);
Textarea.displayName = "Textarea";
