// ponytail: shared confirmation dialog replacing window.confirm across admin pages
// Built on Kumo's alert dialog so the overlay, panel and buttons match the
// Cloudflare dashboard. The dialog stays open until the caller closes it (on
// success); pass `loading` to show a spinner and block interactions.
import { Dialog } from "@cloudflare/kumo";
import { Button } from "@/shared/kumo/button";

interface ConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  /** Disables actions and shows a spinner on the confirm button; caller closes the dialog on success */
  loading?: boolean;
  /** Optional middle action, e.g. "Soft delete" alongside a permanent delete */
  secondaryAction?: {
    label: string;
    onAction: () => void;
  };
}

export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel = "Delete",
  cancelLabel = "Cancel",
  onConfirm,
  loading = false,
  secondaryAction,
}: ConfirmDialogProps) {
  return (
    <Dialog.Root role="alertdialog" open={open} onOpenChange={onOpenChange}>
      <Dialog size="base" className="p-6">
        <Dialog.Title className="text-lg font-semibold text-kumo-default">
          {title}
        </Dialog.Title>
        <Dialog.Description className="mt-2 text-sm text-kumo-subtle">
          {description}
        </Dialog.Description>

        <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <Dialog.Close
            render={<Button variant="outline" disabled={loading} />}
          >
            {cancelLabel}
          </Dialog.Close>

          {secondaryAction && (
            <Button
              variant="secondary"
              disabled={loading}
              onClick={() => {
                if (!loading) secondaryAction.onAction();
              }}
            >
              {secondaryAction.label}
            </Button>
          )}

          <Button
            variant="default"
            loading={loading}
            className="!bg-red-600 !ring-red-700 hover:!bg-red-650"
            onClick={() => {
              if (!loading) onConfirm();
            }}
          >
            {confirmLabel}
          </Button>
        </div>
      </Dialog>
    </Dialog.Root>
  );
}
