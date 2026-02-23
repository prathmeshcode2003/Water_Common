'use client';  
import React, { useRef, useEffect } from "react";


export interface PopoverProps {
  children: React.ReactNode;
}

export function Popover({ children }: PopoverProps) {
  return <>{children}</>;
}

export interface PopoverTriggerProps {
  children: React.ReactNode;
  onClick?: () => void;
}

export function PopoverTrigger({ children, onClick }: PopoverTriggerProps) {
  return (
    <span onClick={onClick} style={{ display: "inline-block", cursor: "pointer" }}>
      {children}
    </span>
  );
}

export interface PopoverContentProps {
  children: React.ReactNode;
  className?: string;
  open?: boolean;
  onClose?: () => void;
  width?: string;
  padding?: string;
  anchorRef?: React.RefObject<HTMLElement>;
  style?: React.CSSProperties;
}

export function PopoverContent({
  children,
  className = "",
  open = false,
  onClose,
  width = "w-80",
  padding = "p-4",
  anchorRef,
  style,
}: PopoverContentProps) {
  const contentRef = useRef<HTMLDivElement>(null);

  // Close popover on outside click
  useEffect(() => {
    if (!open) return;
    function handleClick(event: MouseEvent) {
      if (
        contentRef.current &&
        !contentRef.current.contains(event.target as Node) &&
        (!anchorRef || !anchorRef.current || !anchorRef.current.contains(event.target as Node))
      ) {
        onClose && onClose();
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open, onClose, anchorRef]);

  if (!open) return null;
  return (
    <div
      ref={contentRef}
      className={`
        absolute z-50 ${width} rounded-md border bg-white ${padding} shadow-md outline-none
        ${className}
      `}
      style={style}
      tabIndex={-1}
      role="dialog"
    >
      {children}
    </div>
  );
}
