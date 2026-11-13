import { cn } from "@/shared/lib/utils";
import { LoadingAnimation } from "@/shared/ui/loading-animation";

interface FullScreenLoaderProps {
  className?: string;
  /** When false the overlay fades out instead of disappearing abruptly. */
  visible?: boolean;
}

/** Viewport-fixed loader that matches the home page splash positioning. */
function FullScreenLoader({ className, visible = true }: FullScreenLoaderProps) {
  return (
    <div
      className={cn(
        "fixed inset-0 z-50 flex items-center justify-center bg-white transition-opacity duration-500 ease-out",
        visible ? "opacity-100" : "pointer-events-none opacity-0",
        className
      )}
      role="status"
      aria-label="Loading"
      aria-hidden={!visible}
    >
      <LoadingAnimation />
    </div>
  );
}

export { FullScreenLoader };
