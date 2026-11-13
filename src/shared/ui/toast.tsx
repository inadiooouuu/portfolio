/* eslint-disable react-refresh/only-export-components */
// ponytail: toast entry point — keeps the useToast() API, renders the Ding toaster
import * as React from "react";
import { Toaster, toast as dingToast } from "@yusufceng1z/ding-react";

interface ToastOptions {
  title?: string;
  description?: string;
  variant?: "default" | "destructive" | "success";
}

export function ToastProviderWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {children}
      {/* Ding shows one toast at a time and morphs it in place on new calls. */}
      <Toaster position="top-right" theme="light" />
    </>
  );
}

// Ding keeps errors on screen until dismissed by default; match the previous
// auto-dismiss behaviour for transient admin actions.
const DURATION = 5000;

export function useToast() {
  const toast = React.useCallback(
    ({ title, description, variant }: ToastOptions) => {
      const message = title ?? description ?? "";
      const options = {
        description: title ? description : undefined,
        duration: DURATION,
      };
      if (variant === "success") {
        dingToast.success(message, options);
      } else if (variant === "destructive") {
        dingToast.error(message, options);
      } else {
        dingToast.info(message, options);
      }
    },
    []
  );

  return { toast };
}

/** Imperative helpers usable outside React components. */
export const toast = {
  error: (title: string, description?: string) =>
    dingToast.error(title, { description, duration: DURATION }),
  success: (title: string, description?: string) =>
    dingToast.success(title, { description, duration: DURATION }),
  message: (title: string, description?: string) =>
    dingToast.info(title, { description, duration: DURATION }),
};
