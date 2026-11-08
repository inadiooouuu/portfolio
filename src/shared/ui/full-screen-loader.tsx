import { cn } from "@/shared/lib/utils";
import { LoadingAnimation } from "@/shared/ui/loading-animation";

interface FullScreenLoaderProps {
  className?: string;
}

/** Viewport-fixed loader that matches the home page splash positioning. */
function FullScreenLoader({ className }: FullScreenLoaderProps) {
  return (
    <div
      className={cn(
        "fixed inset-0 z-50 flex items-center justify-center bg-white",
        className
      )}
      role="status"
      aria-label="Loading"
    >
      <LoadingAnimation />
    </div>
  );
}

export { FullScreenLoader };
