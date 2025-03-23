
import React from 'react';

export interface PageContainerProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}

const PageContainer = ({ title, subtitle, children, action, className }: PageContainerProps) => {
  return (
    <div className={`container px-4 py-8 mx-auto max-w-7xl ${className || ''}`}>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
          {subtitle && <p className="mt-2 text-lg text-muted-foreground">{subtitle}</p>}
        </div>
        {action && <div className="mt-4 sm:mt-0">{action}</div>}
      </div>
      <div className="mt-6">{children}</div>
    </div>
  );
};

export default PageContainer;
