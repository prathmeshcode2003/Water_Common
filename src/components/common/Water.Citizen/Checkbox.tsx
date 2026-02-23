import React from "react";
import clsx from "clsx";

export type CheckboxSize = "sm" | "md" | "lg";
export type CheckboxVariant = "default" | "outline";

export interface CheckboxProps {
  size?: CheckboxSize;
  variant?: CheckboxVariant;
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  disabled?: boolean;
  className?: string;
}

export function Checkbox({
  size = "md",
  variant = "default",
  checked = false,
  onChange,
  disabled = false,
  className = "",
}: CheckboxProps) {
  const sizeClasses: Record<CheckboxSize, string> = {
    sm: "h-4 w-4",
    md: "h-5 w-5",
    lg: "h-6 w-6",
  };

  const variantClasses: Record<CheckboxVariant, string> = {
    default: "border-gray-300 bg-white",
    outline: "border-2 border-gray-500",
  };

  return (
    <div
      role="checkbox"
      aria-checked={checked}
      onClick={() => !disabled && onChange?.(!checked)}
      className={clsx(
        "rounded cursor-pointer focus:ring-2 focus:ring-blue-500",
        sizeClasses[size],
        variantClasses[variant],
        { "opacity-50 cursor-not-allowed": disabled },
        className
      )}
    >
      {checked && <div className="bg-blue-600 w-full h-full rounded" />}
    </div>
  );
}
