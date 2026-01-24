import type { ReactNode } from "react";

interface AvatarProps {
  className?: string;
  children: ReactNode;
}

export function Avatar({ className = "", children }: AvatarProps) {
  return (
    <div className={`relative inline-block rounded-full overflow-hidden ${className}`}>
      {children}
    </div>
  );
}

interface AvatarFallbackProps {
  className?: string;
  children: ReactNode;
}

export function AvatarFallback({ className = "", children }: AvatarFallbackProps) {
  return (
    <div className={`flex items-center justify-center w-full h-full ${className}`}>
      {children}
    </div>
  );
}
