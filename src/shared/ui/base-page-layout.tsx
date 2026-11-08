import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/shared/lib/utils";

export interface BasePageLayoutProps
  extends Omit<ComponentProps<"section">, "title"> {
  title?: ReactNode;
  subtitle?: ReactNode;
  headerAction?: ReactNode;
  backgrounded?: boolean;
  titleTestId?: string;
}

export function BasePageLayout({
  children,
  className,
  title,
  subtitle,
  headerAction,
  backgrounded = false,
  titleTestId,
  ...rest
}: BasePageLayoutProps) {
  const hasHeader = title || subtitle || headerAction;

  return (
    <div className="flex flex-col gap-6">
      {hasHeader && (
        <div className="flex flex-col gap-1.5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col space-y-2">
            {title && typeof title === "string" ? (
              <h1 className="text-2xl font-medium" data-testid={titleTestId}>
                {title}
              </h1>
            ) : (
              title
            )}
            {subtitle && typeof subtitle === "string" ? (
              <p className="text-md text-muted-foreground">{subtitle}</p>
            ) : (
              subtitle
            )}
          </div>
          {headerAction && (
            <div className="flex items-center gap-2 self-start sm:self-auto">
              {headerAction}
            </div>
          )}
        </div>
      )}

      <section
        className={cn(
          className,
          backgrounded ? "bg-card rounded-md p-5" : "",
        )}
        {...rest}
      >
        {children}
      </section>
    </div>
  );
}

export default BasePageLayout;
