import React, { ReactNode } from 'react';
import classNames from 'classnames';

type BadgeVariant = 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info';
type BadgeSize = 'sm' | 'md' | 'lg';

interface BadgeProps {
  children: ReactNode;
  variant?: BadgeVariant;
  size?: BadgeSize;
  outline?: boolean;
  className?: string;
}

const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  size = 'md',
  outline = false,
  className = '',
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-full';
  
  const variantClasses = {
    default: outline 
      ? 'bg-transparent text-text-light border border-border' 
      : 'bg-background-dark text-text',
    primary: outline 
      ? 'bg-transparent text-primary border border-primary' 
      : 'bg-primary text-white',
    secondary: outline 
      ? 'bg-transparent text-secondary border border-secondary' 
      : 'bg-secondary text-white',
    success: outline 
      ? 'bg-transparent text-success border border-success' 
      : 'bg-success text-white',
    warning: outline 
      ? 'bg-transparent text-warning border border-warning' 
      : 'bg-warning text-white',
    error: outline 
      ? 'bg-transparent text-error border border-error' 
      : 'bg-error text-white',
    info: outline 
      ? 'bg-transparent text-info border border-info' 
      : 'bg-info text-white',
  };
  
  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-2.5 py-1',
    lg: 'text-base px-3 py-1.5',
  };
  
  return (
    <span
      className={classNames(
        baseClasses,
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
    >
      {children}
    </span>
  );
};

export default Badge;