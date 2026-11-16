import { useLayoutEffect, useRef } from "react"
import { cn } from "@/shared/lib/utils"
import { gsap } from "gsap"

interface LoadingAnimationProps {
  className?: string
}

const TILE_SIZE = 22
const WHEEL_SIZE = 72
const CENTER = WHEEL_SIZE / 2
const RADIUS = 22

const SHAPES = [
  { key: "red", color: "#FF4229" },
  { key: "cream", color: "#FFF0D4" },
  { key: "purple", color: "#C6B0FF" },
  { key: "blue", color: "#7C9FFE" },
  { key: "orange", color: "#FFAA70" },
] as const

// Five equally spaced points on a regular pentagon.
const getPointPosition = (index: number) => {
  const angle = ((index * 72 - 90) * Math.PI) / 180

  return {
    left: CENTER + RADIUS * Math.cos(angle) - TILE_SIZE / 2,
    top: CENTER + RADIUS * Math.sin(angle) - TILE_SIZE / 2,
  }
}

function LoadingAnimation({ className }: LoadingAnimationProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const wheelRef = useRef<HTMLDivElement>(null)
  const tileRefs = useRef<(HTMLDivElement | null)[]>([])

  useLayoutEffect(() => {
    const container = containerRef.current
    const wheel = wheelRef.current
    if (!container || !wheel) return

    const tiles = tileRefs.current.filter(
      (tile): tile is HTMLDivElement => tile !== null,
    )

    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)")
    if (motionQuery.matches) return

    const context = gsap.context(() => {
      gsap.set(wheel, {
        rotation: 0,
        scale: 1,
        transformOrigin: "50% 50%",
        force3D: true,
      })

      gsap.set(tiles, {
        transformOrigin: "50% 50%",
        force3D: true,
      })

      // Faster, eased wheel rotation with a seamless full-turn loop.
      const ROTATION_DURATION = 1.8
      gsap.to(wheel, {
        rotation: 360,
        duration: ROTATION_DURATION,
        ease: "none",
        repeat: -1,
      })

      // Zoom follows rotation in a wave along circle order.
      // ponytail: fixed scale range 0.85 - 1.15, add config prop if callers need different depth.
      tiles.forEach((tile, index) => {
        gsap.fromTo(
          tile,
          { scale: 0.85 },
          {
            scale: 1.15,
            duration: ROTATION_DURATION / 2,
            ease: "sine.inOut",
            yoyo: true,
            repeat: -1,
            delay: (index / tiles.length) * ROTATION_DURATION,
          },
        )
      })
    }, container)

    return () => context.revert()
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
      <div
        ref={wheelRef}
        className="relative"
        style={{
          width: WHEEL_SIZE,
          height: WHEEL_SIZE,
        }}
      >
        {SHAPES.map((shape, index) => {
          const position = getPointPosition(index)

          return (
            <div
              key={shape.key}
              ref={(element) => {
                tileRefs.current[index] = element
              }}
              className="absolute"
              style={{
                left: position.left,
                top: position.top,
                width: TILE_SIZE,
                height: TILE_SIZE,
                borderRadius: "50%",
                backgroundColor: shape.color,
                willChange: "transform",
              }}
            />
          )
        })}
      </div>
    </div>
  )
}

export { LoadingAnimation }
