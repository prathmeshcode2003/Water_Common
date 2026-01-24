import { forwardRef } from "react";

export const Input = forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement> & { variant?: "light" | "dark" }
>(({ className = "", variant = "light", ...props }, ref) => {
  const base =
    "w-full px-3 py-2 rounded-lg outline-none transition border";
  const light = "bg-white text-gray-900 border-gray-300 focus:ring-2 focus:ring-blue-500";
  const dark =
    "bg-white/10 text-white placeholder:text-white/60 border-white/20 focus:ring-2 focus:ring-white/30";

  return (
    <input
      {...props}
      ref={ref}
      className={`${base} ${variant === "dark" ? dark : light} ${className}`}
    />
  );
});

Input.displayName = "Input";

