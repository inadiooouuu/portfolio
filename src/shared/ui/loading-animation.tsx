import { useLayoutEffect, useRef } from "react"
import { cn } from "@/shared/lib/utils"
import { gsap } from "gsap"

interface LoadingAnimationProps {
  className?: string
}

const BLOCK = 32
const GAP = 6
const GRID = BLOCK * 2 + GAP

// Four equal tiles in a symmetric 2x2 grid. Animating borderRadius + scale
// (instead of left/width) keeps the morph on the compositor and perfectly
// centred, so the diamond never drifts or reflows while it spins up.
const SHAPES = [
  { key: "red", color: "#FF4229", position: { left: 0, top: 0 } },
  { key: "cream", color: "#FFF0D4", position: { left: BLOCK + GAP, top: 0 } },
  { key: "purple", color: "#C6B0FF", position: { left: 0, top: BLOCK + GAP } },
  {
    key: "blue",
    color: "#7C9FFE",
    position: { left: BLOCK + GAP, top: BLOCK + GAP },
  },
] as const

const CLOCKWISE_ORDER = [0, 1, 3, 2]

function LoadingAnimation({ className }: LoadingAnimationProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const innerRef = useRef<HTMLDivElement>(null)
  const shapeRefs = useRef<(HTMLDivElement | null)[]>([])

  useLayoutEffect(() => {
    const container = containerRef.current
    const inner = innerRef.current
    if (!container || !inner) return

    const tiles = CLOCKWISE_ORDER.map((i) => shapeRefs.current[i]).filter(
      Boolean,
    ) as HTMLDivElement[]

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches
    if (prefersReducedMotion) return

    const ctx = gsap.context(() => {
      gsap.set(inner, { rotation: 45 })

      const timeline = gsap.timeline({
        repeat: -1,
        yoyo: true,
        repeatDelay: 0.25,
      })

      // Morph the tiles to circles in a clockwise wave while the whole grid
      // breathes — both transform/paint only, no layout properties.
      timeline.to(
        tiles,
        {
          borderRadius: "50%",
          scale: 0.84,
          duration: 0.55,
          stagger: { each: 0.08, from: "start" },
          ease: "power2.inOut",
        },
        0,
      )

      timeline.to(
        inner,
        {
          scale: 1.05,
          duration: 1.15,
          ease: "sine.inOut",
        },
        0,
      )
    }, container)

    return () => ctx.revert()
  }, [])

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative flex h-40 w-40 items-center justify-center",
        className,
      )}
      role="status"
      aria-label="Loading"
    >
      {/* 2x2 rotated container box */}
      <div
        ref={innerRef}
        className="relative"
        style={{
          width: GRID,
          height: GRID,
          transform: "rotate(45deg)",
        }}
      >
        {SHAPES.map((shape, index) => (
          <div
            key={shape.key}
            ref={(el) => {
              shapeRefs.current[index] = el
            }}
            className="absolute"
            style={{
              left: shape.position.left,
              top: shape.position.top,
              width: BLOCK,
              height: BLOCK,
              borderRadius: 10,
              backgroundColor: shape.color,
            }}
          />
        ))}
      </div>
    </div>
  )
}

export { LoadingAnimation }
