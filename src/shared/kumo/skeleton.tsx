import { SkeletonLine } from "@cloudflare/kumo";
import { cn } from "@/shared/lib/utils";

/**
 * Admin skeleton built on Kumo's `SkeletonLine`, keeping the legacy
 * `<Skeleton className="..." />` call sites working.
 */
export function Skeleton({ className }: { className?: string }) {
  return (
    <SkeletonLine
      minWidth={100}
      maxWidth={100}
      className={cn("h-4 w-full rounded-md", className)}
    />
  );
}
