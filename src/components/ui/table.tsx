import * as React from "react";
import { Table as KumoTable } from "@cloudflare/kumo";
import { cn } from "@/lib/utils";

type FixedSide = "left" | "right";

/**
 * Admin table built on Kumo's `Table` compound component.
 *
 * The legacy `fixed="left" | "right"` prop is kept for the existing admin
 * pages and mapped onto Kumo's `sticky` column support, which pins the column
 * to the scroll container and renders the matching fade/background.
 */
function Table({ className, ...props }: React.ComponentProps<"table">) {
  return (
    <div data-slot="table-container" className="relative w-full overflow-x-auto">
      <KumoTable
        data-slot="table"
        className={cn("caption-bottom text-sm", className)}
        {...props}
      />
    </div>
  );
}

function TableHeader({ className, ...props }: React.ComponentProps<"thead">) {
  return (
    <KumoTable.Header
      data-slot="table-header"
      className={cn(
        "[&_th]:text-[11px] [&_th]:font-semibold [&_th]:uppercase [&_th]:tracking-wider [&_th]:text-kumo-subtle",
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
      className={cn("[&_tr:last-child]:border-0", className)}
      {...props}
    />
  );
}

function TableFooter({ className, ...props }: React.ComponentProps<"tfoot">) {
  return (
    <KumoTable.Footer
      data-slot="table-footer"
      className={cn("border-t bg-kumo-tint/50 font-medium", className)}
      {...props}
    />
  );
}

function TableRow({ className, ...props }: React.ComponentProps<"tr">) {
  return (
    <KumoTable.Row
      data-slot="table-row"
      className={cn(
        "group/row border-b border-kumo-line/60 transition-colors hover:bg-kumo-tint/60",
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
      className={cn("whitespace-nowrap", className)}
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
      className={cn("whitespace-nowrap", className)}
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
