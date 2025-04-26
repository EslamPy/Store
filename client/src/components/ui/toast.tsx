import * as React from "react"

// Simple component versions to avoid dependency on Radix UI
export const ToastProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  return <>{children}</>;
};

export const ToastViewport: React.FC = () => {
  return null;
};

export const Toast: React.FC<React.PropsWithChildren> = ({ children }) => {
  return <div className="toast">{children}</div>;
};

export const ToastTitle: React.FC<React.PropsWithChildren> = ({ children }) => {
  return <div className="toast-title">{children}</div>;
};

export const ToastDescription: React.FC<React.PropsWithChildren> = ({ children }) => {
  return <div className="toast-description">{children}</div>;
};

export const ToastClose: React.FC = () => {
  return <button className="toast-close">×</button>;
};

export const ToastAction: React.FC<React.PropsWithChildren> = ({ children }) => {
  return <div className="toast-action">{children}</div>;
};

// Types needed for compatibility
export type ToastProps = React.ComponentPropsWithoutRef<typeof Toast>;
export type ToastActionElement = React.ReactElement<typeof ToastAction>;
