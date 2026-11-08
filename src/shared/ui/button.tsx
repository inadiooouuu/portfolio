import * as React from "react"
import { tv, type VariantProps } from "tailwind-variants"
import { cn } from "@/shared/lib/utils"

// Cloudflare Kumo-inspired buttons. The `default` variant mirrors the
// dashboard's emphasis button: compact height, subtle ring, and a glossy
// orange gradient with an inset highlight.
const buttonVariants = tv({
  base: "group relative inline-flex shrink-0 cursor-pointer select-none items-center justify-center gap-1 overflow-hidden whitespace-nowrap rounded-md border-0 font-medium outline-none transition-[color,background-color,box-shadow,opacity] focus-visible:ring-2 disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50 [&_svg:not([class*='size-'])]:size-3.5 [&_svg]:pointer-events-none [&_svg]:shrink-0",
  variants: {
    variant: {
      default:
        "bg-(--kumo-button-emphasis-bg) bg-linear-to-b from-(--kumo-button-emphasis-gradient-start) to-(--kumo-button-emphasis-gradient-end) text-white shadow-[inset_0_1px_0_0_var(--kumo-button-emphasis-bg)] ring-1 ring-(--kumo-button-emphasis-ring) hover:from-(--kumo-button-emphasis-bg) focus-visible:ring-(--kumo-button-emphasis-ring) active:ring-(--kumo-button-emphasis-ring)",
      emphasis:
        "bg-(--kumo-button-emphasis-bg) bg-linear-to-b from-(--kumo-button-emphasis-gradient-start) to-(--kumo-button-emphasis-gradient-end) text-white shadow-[inset_0_1px_0_0_var(--kumo-button-emphasis-bg)] ring-1 ring-(--kumo-button-emphasis-ring) hover:from-(--kumo-button-emphasis-bg) focus-visible:ring-(--kumo-button-emphasis-ring) active:ring-(--kumo-button-emphasis-ring)",
      destructive:
        "bg-(--kumo-button-danger-bg) bg-linear-to-b from-(--kumo-button-danger-gradient-start) to-(--kumo-button-danger-gradient-end) text-white shadow-[inset_0_1px_0_0_var(--kumo-button-danger-bg)] ring-1 ring-(--kumo-button-danger-ring) hover:from-(--kumo-button-danger-bg) focus-visible:ring-(--kumo-button-danger-ring) active:ring-(--kumo-button-danger-ring)",
      outline:
        "border border-border bg-background text-foreground shadow-xs hover:bg-muted focus-visible:ring-ring/50",
      secondary:
        "border border-border bg-secondary text-secondary-foreground shadow-xs hover:bg-[color-mix(in_oklch,var(--secondary),var(--foreground)_5%)] focus-visible:ring-ring/50",
      ghost:
        "text-foreground hover:bg-muted focus-visible:ring-ring/50",
      link: "text-primary underline-offset-4 hover:underline focus-visible:ring-ring/50",
    },
    size: {
      default: "h-6.5 px-2 pb-px text-xs",
      sm: "h-6 gap-1 px-2 text-[11px]",
      lg: "h-9 gap-1.5 px-4 text-sm",
      icon: "size-7",
      "icon-sm": "size-6.5",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "default",
  },
})

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  href?: string
}

const Button = React.forwardRef<HTMLButtonElement | HTMLAnchorElement, ButtonProps>(
  ({ className, variant, size, asChild = false, href, type = "button", ...props }, ref) => {
    if (href) {
      return (
        <a
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          ref={ref as any}
          className={cn(buttonVariants({ variant, size, className }))}
          href={href}
          {...(props as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
        >
          {props.children}
        </a>
      )
    }

    return (
      <button
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ref={ref as any}
        className={cn(buttonVariants({ variant, size, className }))}
        type={type}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
