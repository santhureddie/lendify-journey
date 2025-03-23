
import { ReactNode } from 'react';

interface PageContainerProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
  className?: string;
}

const PageContainer = ({ title, subtitle, children, className = '' }: PageContainerProps) => {
  return (
    <div className={`page-transition max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 ${className}`}>
      <div className="mb-8 animate-slideDown">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{title}</h1>
        {subtitle && (
          <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">{subtitle}</p>
        )}
      </div>
      
      <div className="animate-slideUp">
        {children}
      </div>
    </div>
  );
};

export default PageContainer;
