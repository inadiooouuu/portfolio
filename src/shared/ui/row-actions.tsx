import type { ReactNode } from "react";
import { EllipsisVertical } from "lucide-react";
import { DropdownMenu } from "@cloudflare/kumo";

export interface RowAction {
  key: string;
  label: string;
  icon?: ReactNode;
  onSelect: () => void;
  variant?: "default" | "danger";
  disabled?: boolean;
}

interface RowActionsProps {
  actions: RowAction[];
  label?: string;
  align?: "start" | "end";
}

function RowActions({
  actions,
  label = "Row actions",
  align = "end",
}: RowActionsProps) {
  if (actions.length === 0) return null;

  return (
    <DropdownMenu>
      <DropdownMenu.Trigger
        aria-label={label}
        className="inline-flex size-5 shrink-0 cursor-pointer items-center justify-center rounded-sm border border-kumo-line bg-kumo-base text-kumo-subtle outline-none transition hover:bg-kumo-tint hover:text-kumo-strong focus-visible:ring-2 focus-visible:ring-kumo-brand/40 disabled:pointer-events-none disabled:opacity-50"
      >
        <EllipsisVertical size={12} />
      </DropdownMenu.Trigger>
      <DropdownMenu.Content align={align} className="min-w-48">
        {actions.map((action) => (
          <DropdownMenu.Item
            key={action.key}
            icon={action.icon}
            variant={action.variant}
            disabled={action.disabled}
            onClick={action.onSelect}
          >
            {action.label}
          </DropdownMenu.Item>
        ))}
      </DropdownMenu.Content>
    </DropdownMenu>
  );
}

export { RowActions };
export type { RowActionsProps };
