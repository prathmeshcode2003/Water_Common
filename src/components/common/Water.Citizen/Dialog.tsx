import React, { useEffect } from "react";
import { X } from "lucide-react";

/* ----------------------------------------------------------
   GENERIC DIALOG COMPONENTS - CLIENT COMPONENTS (NO RADIX)
---------------------------------------------------------- */

export interface DialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
}

export function Dialog({ open, onOpenChange, children }: DialogProps) {
  // Prevent background scroll when dialog is open
  useEffect(() => {
    if (open) {
      const original = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = original;
      };
    }
  }, [open]);

  if (!open) return null;
  return <>{children}</>;
}

export interface DialogTriggerProps {
  children: React.ReactNode;
  onClick?: () => void;
}

export function DialogTrigger({ children, onClick }: DialogTriggerProps) {
  return (
    <span onClick={onClick} style={{ display: "inline-block", cursor: "pointer" }}>
      {children}
    </span>
  );
}

export interface DialogContentProps {
  children: React.ReactNode;
  className?: string;
  maxWidth?: string;
  onClose?: () => void;
}

export function DialogContent({
  children,
  className = "",
  maxWidth = "max-w-lg",
  onClose,
}: DialogContentProps) {
  return (
    <div>
      <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div
        className={`
          fixed left-1/2 top-1/2 z-50 w-full ${maxWidth}
          -translate-x-1/2 -translate-y-1/2 border bg-white p-6 shadow-lg duration-200
          sm:rounded-lg focus:outline-none ${className}
        `}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
      >
        {children}
        <button
          className="absolute right-4 top-4 rounded-full p-2 opacity-70 hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-blue-300"
          onClick={onClose}
          aria-label="Close"
          type="button"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

export interface DialogHeaderProps {
  children: React.ReactNode;
  className?: string;
}

export function DialogHeader({ children, className = "" }: DialogHeaderProps) {
  return (
    <div className={`flex flex-col space-y-1.5 text-center sm:text-left ${className}`}>
      {children}
    </div>
  );
}

export interface DialogTitleProps {
  children: React.ReactNode;
  className?: string;
}

export function DialogTitle({ children, className = "" }: DialogTitleProps) {
  return (
    <div className={`text-lg font-semibold leading-none tracking-tight ${className}`}>
      {children}
    </div>
  );
}

export interface DialogDescriptionProps {
  children: React.ReactNode;
  className?: string;
}

export function DialogDescription({ children, className = "" }: DialogDescriptionProps) {
  return (
    <div className={`text-sm text-gray-500 ${className}`}>
      {children}
    </div>
  );
}
