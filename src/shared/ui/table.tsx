import * as React from "react";
import { Table as KumoTable } from "@cloudflare/kumo";
import { cn } from "@/shared/lib/utils";

type FixedSide = "left" | "right";

interface TableProps extends React.ComponentProps<"table"> {
  /** Viewport-ish cap for the scroll body. Defaults to 58vh like the reference. */
  maxHeight?: string;
  containerClassName?: string;
}

/**
 * Admin table built on Kumo's `Table` compound component.
 *
 * The table owns its scroll frame: a bordered, rounded container with a
 * capped height, a sticky header and sticky left/right columns. The legacy
 * `fixed="left" | "right"` prop maps onto Kumo's `sticky` column support.
 */
function Table({
  className,
  containerClassName,
  maxHeight = "58vh",
  ...props
}: TableProps) {
  return (
    <div
      data-slot="table-container"
      className={cn(
        "relative w-full overflow-hidden rounded-lg border border-kumo-line bg-kumo-base shadow-sm",
        containerClassName
      )}
    >
      <div className="overflow-auto overscroll-contain" style={{ maxHeight }}>
        <KumoTable
          data-slot="table"
          className={cn("isolate w-full caption-bottom text-sm", className)}
          {...props}
        />
      </div>
    </div>
  );
}

function TableHeader({ className, ...props }: React.ComponentProps<"thead">) {
  return (
    <KumoTable.Header
      sticky
      data-slot="table-header"
      className={cn(
        "group/header",
        "[&_th]:text-sm! [&_th]:font-medium [&_th]:capitalize [&_th]:tracking-wide [&_th]:text-neutral-600 dark:[&_th]:text-neutral-400",
        className
      )}
      {...props}
    />
  );
}

function TableBody({ className, ...props }: React.ComponentProps<"tbody">) {
  return (
    <KumoTable.Body
      data-slot="table-body"
      className={cn("[&_tr:last-child]:border-0 [&_td]:text-sm! [&_td]:text-neutral-700 dark:[&_td]:text-neutral-100", className)}
      {...props}
    />
  );
}

function TableFooter({ className, ...props }: React.ComponentProps<"tfoot">) {
  return (
    <KumoTable.Footer
      data-slot="table-footer"
      className={cn("border-t bg-kumo-tint/50 font-medium text-sm", className)}
      {...props}
    />
  );
}

function TableRow({ className, ...props }: React.ComponentProps<"tr">) {
  return (
    <KumoTable.Row
      data-slot="table-row"
      className={cn(
        "group/row border-b border-kumo-line/60 transition-colors hover:bg-kumo-tint/60 text-sm",
        className
      )}
      {...props}
    />
  );
}

function TableHead({
  className,
  fixed,
  ...props
}: React.ComponentProps<"th"> & { fixed?: FixedSide }) {
  return (
    <KumoTable.Head
      data-slot="table-head"
      data-fixed={fixed}
      sticky={fixed}
      className={cn("whitespace-nowrap text-sm font-medium", fixed && "z-2!", className)}
      {...props}
    />
  );
}

function TableCell({
  className,
  fixed,
  ...props
}: React.ComponentProps<"td"> & { fixed?: FixedSide }) {
  return (
    <KumoTable.Cell
      data-slot="table-cell"
      data-fixed={fixed}
      sticky={fixed}
      className={cn("whitespace-nowrap text-sm", className)}
      {...props}
    />
  );
}

function TableCaption({
  className,
  ...props
}: React.ComponentProps<"caption">) {
  return (
    <caption
      data-slot="table-caption"
      className={cn("mt-4 text-sm text-kumo-subtle", className)}
      {...props}
    />
  );
}

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
};
export type { FixedSide };
