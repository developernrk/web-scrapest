import React, { useState } from 'react';
import classNames from 'classnames';

interface ExpandableDetailProps {
  title: string;
  children: React.ReactNode;
  initialExpanded?: boolean;
  className?: string;
  titleClassName?: string;
  contentClassName?: string;
  icon?: React.ReactNode;
}

const ExpandableDetail: React.FC<ExpandableDetailProps> = ({
  title,
  children,
  initialExpanded = false,
  className = '',
  titleClassName = '',
  contentClassName = '',
  icon,
}) => {
  const [isExpanded, setIsExpanded] = useState(initialExpanded);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className={classNames('border border-border rounded-lg overflow-hidden mb-3', className)}>
      <button
        onClick={toggleExpand}
        className={classNames(
          'w-full flex items-center justify-between p-3 text-left bg-background-card hover:bg-background-dark transition-colors duration-200',
          titleClassName
        )}
      >
        <div className="flex items-center">
          {icon && <span className="mr-2">{icon}</span>}
          <span className="font-medium text-text">{title}</span>
        </div>
        <svg
          className={classNames('w-5 h-5 text-text-light transition-transform duration-200', {
            'transform rotate-180': isExpanded,
          })}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      <div
        className={classNames(
          'overflow-hidden transition-all duration-300 ease-in-out',
          {
            'max-h-0 opacity-0': !isExpanded,
            'max-h-screen opacity-100': isExpanded,
          },
          contentClassName
        )}
      >
        <div className="p-3 bg-white border-t border-border">{children}</div>
      </div>
    </div>
  );
};

export default ExpandableDetail;