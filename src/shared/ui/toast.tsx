/* eslint-disable react-refresh/only-export-components */
// ponytail: toast entry point — keeps the useToast() API but renders Kumo's Toasty viewport
import * as React from "react";
import {
  Toasty,
  createKumoToastManager,
  useKumoToastManager,
} from "@cloudflare/kumo";

interface ToastOptions {
  title?: React.ReactNode;
  description?: React.ReactNode;
  variant?: "default" | "destructive" | "success";
}

/** Minimal structural type shared by the context hook and the global manager. */
interface ToastManagerLike {
  add: (options: {
    title?: React.ReactNode;
    description?: React.ReactNode;
    variant?: "default" | "success" | "error";
  }) => unknown;
}

/**
 * Shared manager instance so imperative helpers (used by non-React mutation
 * functions) and the React `useToast` hook all feed the same Kumo viewport.
 */
export const kumoToastManager = createKumoToastManager();

function addToast(manager: ToastManagerLike, { title, description, variant }: ToastOptions) {
  manager.add({
    title,
    description,
    variant:
      variant === "success"
        ? "success"
        : variant === "destructive"
          ? "error"
          : "default",
  });
}

export function ToastProviderWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return <Toasty toastManager={kumoToastManager}>{children}</Toasty>;
}

export function useToast() {
  const manager = useKumoToastManager();

  const toast = React.useCallback(
    (options: ToastOptions) => addToast(manager, options),
    [manager]
  );

  return { toast };
}

/** Imperative toast helpers usable outside React components. */
export const toast = {
  error: (title: React.ReactNode, description?: React.ReactNode) =>
    addToast(kumoToastManager, { title, description, variant: "destructive" }),
  success: (title: React.ReactNode, description?: React.ReactNode) =>
    addToast(kumoToastManager, { title, description, variant: "success" }),
  message: (title: React.ReactNode, description?: React.ReactNode) =>
    addToast(kumoToastManager, { title, description, variant: "default" }),
};
