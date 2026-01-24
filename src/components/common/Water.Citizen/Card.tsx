import type { ReactNode } from "react";

export function Card({
  className = "",
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={`rounded-2xl p-6 ${className}`}>
      {children}
    </div>
  );
}
