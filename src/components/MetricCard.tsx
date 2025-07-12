import React from 'react';
import classNames from 'classnames';
import Badge from './Badge';

interface MetricCardProps {
  title: string |React.ReactNode;
  value: string | number;
  icon?: React.ReactNode;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  status?: 'good' | 'warning' | 'critical' | 'neutral';
  className?: string;
  onClick?: () => void;
}

const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  icon,
  trend,
  trendValue,
  status = 'neutral',
  className = '',
  onClick,
}) => {
  const statusColors = {
    good: 'text-success',
    warning: 'text-warning',
    critical: 'text-error',
    neutral: 'text-text-light',
  };

  const trendIcons = {
    up: (
      <svg className="w-4 h-4 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
      </svg>
    ),
    down: (
      <svg className="w-4 h-4 text-error" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
      </svg>
    ),
    neutral: (
      <svg className="w-4 h-4 text-text-light" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14" />
      </svg>
    ),
  };

  const statusBadges = {
    good: <Badge variant="success" size="sm">Good</Badge>,
    warning: <Badge variant="warning" size="sm">Warning</Badge>,
    critical: <Badge variant="error" size="sm">Critical</Badge>,
    neutral: null,
  };

  return (
    <div 
      className={classNames(
        'bg-white rounded-lg p-4 shadow-card border border-border-light hover:shadow-md transition-shadow duration-200',
        onClick ? 'cursor-pointer' : '',
        className
      )}
      onClick={onClick}
    >
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-sm font-medium text-text-light">{title}</h3>
        {status !== 'neutral' && statusBadges[status]}
      </div>
      
      <div className="flex items-end justify-between">
        <div className="flex items-center">
          {icon && <span className="mr-2 text-primary">{icon}</span>}
          <span className="text-xl font-semibold text-text">{value}</span>
        </div>
        
        {trend && trendValue && (
          <div className="flex items-center">
            {trendIcons[trend]}
            <span className={classNames('ml-1 text-xs', {
              'text-success': trend === 'up',
              'text-error': trend === 'down',
              'text-text-light': trend === 'neutral',
            })}>
              {trendValue}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default MetricCard;