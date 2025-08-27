import type { ReactNode } from 'react';

interface AppLayoutProps {
  children: ReactNode;
  className?: string;
}

export function AppLayout({ children, className = '' }: AppLayoutProps) {
  return (
    <div className={`min-h-screen p-4 bg-background ${className}`}>
      <div className="max-w-6xl mx-auto">
        {children}
      </div>
    </div>
  );
}