import React from "react";
import { useToast } from "@/hooks/use-toast";
import { CustomToast, ToastType } from "./CustomToast";

export function Toaster() {
  const { toasts } = useToast();

  return (
    <div className="fixed top-0 right-0 z-50 p-4 space-y-4 w-full max-w-md">
      {toasts.map(function ({ id, title, description, variant, ...props }) {
        // Map variant to our ToastType
        let type: ToastType = 'info';
        if (variant === 'destructive') type = 'error';
        else if (variant === 'default') type = 'info';
        
        return (
          <CustomToast
            key={id}
            message={title || description || "Notification"}
            type={type}
            onClose={() => props.onOpenChange?.(false)}
          />
        );
      })}
    </div>
  );
}
