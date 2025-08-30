import type { ReactNode } from "react";

interface AppLayoutProps {
  children: ReactNode;
  className?: string;
}

export function AppLayout({ children, className = "" }: AppLayoutProps) {
  return (
    <div className={`h-screen overflow-hidden flex flex-col p-4 bg-background ${className}`}>
      <div className="max-w-7xl mx-auto w-full flex-1 flex flex-col overflow-hidden">{children}</div>
    </div>
  );
}
