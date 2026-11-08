import * as React from "react";
import { Label as KumoLabel } from "@cloudflare/kumo";

/** Admin label built on Kumo's `Label`. */
export interface LabelProps {
  children: React.ReactNode;
  className?: string;
  htmlFor?: string;
}

export function Label({ children, className, htmlFor }: LabelProps) {
  return (
    <KumoLabel className={className} htmlFor={htmlFor}>
      {children}
    </KumoLabel>
  );
}
