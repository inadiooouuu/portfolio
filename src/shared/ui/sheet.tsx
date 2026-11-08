import * as React from "react";
import { Dialog as SheetPrimitive } from "@cloudflare/kumo/primitives/dialog";
import { X } from "@phosphor-icons/react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/shared/lib/utils";

/**
 * Admin side sheet built on the dialog primitive re-exported by Kumo
 * (`@cloudflare/kumo/primitives/dialog`), styled with Kumo surface tokens.
 */
const Sheet = SheetPrimitive.Root;
const SheetTrigger = SheetPrimitive.Trigger;
const SheetClose = SheetPrimitive.Close;
const SheetPortal = SheetPrimitive.Portal;

const SheetOverlay = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Backdrop>,
  React.ComponentPropsWithoutRef<typeof SheetPrimitive.Backdrop>
>(({ className, ...props }, ref) => (
  <SheetPrimitive.Backdrop
    ref={ref}
    className={cn(
      "fixed inset-0 z-50 bg-black/30 transition-opacity duration-200 data-ending-style:opacity-0 data-starting-style:opacity-0",
      className
    )}
    {...props}
  />
));
SheetOverlay.displayName = "SheetOverlay";

const sheetVariants = cva(
  "fixed z-50 m-3 flex flex-col overflow-hidden bg-kumo-base text-kumo-default shadow-xl ring-1 ring-kumo-line transition duration-300 ease-in-out data-ending-style:opacity-0 data-starting-style:opacity-0",
  {
    variants: {
      side: {
        top: "inset-x-0 top-0 h-auto w-auto rounded-b-xl data-ending-style:-translate-y-[105%] data-starting-style:-translate-y-[105%]",
        bottom:
          "inset-x-0 bottom-0 h-auto w-auto rounded-t-xl data-ending-style:translate-y-[105%] data-starting-style:translate-y-[105%]",
        left: "inset-y-0 left-0 h-auto w-4/5 rounded-r-xl sm:max-w-sm data-ending-style:-translate-x-[105%] data-starting-style:-translate-x-[105%]",
        right:
          "inset-y-0 right-0 h-auto w-[calc(100%-1.5rem)] rounded-2xl sm:max-w-xl data-ending-style:translate-x-[105%] data-starting-style:translate-x-[105%]",
      },
    },
    defaultVariants: {
      side: "right",
    },
  }
);

export interface SheetContentProps
  extends React.ComponentPropsWithoutRef<typeof SheetPrimitive.Popup>,
    VariantProps<typeof sheetVariants> {}

const SheetContent = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Popup>,
  SheetContentProps
>(({ side = "right", className, children, ...props }, ref) => (
  <SheetPortal>
    <SheetOverlay />
    <SheetPrimitive.Popup
      ref={ref}
      className={cn(sheetVariants({ side }), className)}
      {...props}
    >
      <div className="flex shrink-0 items-center justify-start border-b border-kumo-line px-4 py-3">
        <SheetPrimitive.Close className="cursor-pointer rounded-sm p-1 text-kumo-subtle opacity-70 transition-opacity hover:text-kumo-default hover:opacity-100 focus:outline-none disabled:pointer-events-none">
          <X className="h-6 w-6" />
          <span className="sr-only">Close</span>
        </SheetPrimitive.Close>
      </div>
      {children}
    </SheetPrimitive.Popup>
  </SheetPortal>
));
SheetContent.displayName = "SheetContent";

const SheetHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex shrink-0 flex-col space-y-1.5 px-6 pt-6 text-left",
      className
    )}
    {...props}
  />
);
SheetHeader.displayName = "SheetHeader";

const SheetFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex shrink-0 flex-col-reverse gap-2 border-t border-kumo-line bg-kumo-base px-6 py-4 sm:flex-row sm:justify-end",
      className
    )}
    {...props}
  />
);
SheetFooter.displayName = "SheetFooter";

const SheetTitle = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof SheetPrimitive.Title>
>(({ className, ...props }, ref) => (
  <SheetPrimitive.Title
    ref={ref}
    className={cn(
      "text-2xl leading-none font-medium tracking-tight text-kumo-default",
      className
    )}
    {...props}
  />
));
SheetTitle.displayName = "SheetTitle";

const SheetDescription = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof SheetPrimitive.Description>
>(({ className, ...props }, ref) => (
  <SheetPrimitive.Description
    ref={ref}
    className={cn("text-lg text-kumo-subtle", className)}
    {...props}
  />
));
SheetDescription.displayName = "SheetDescription";

export {
  Sheet,
  SheetPortal,
  SheetOverlay,
  SheetTrigger,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
};
