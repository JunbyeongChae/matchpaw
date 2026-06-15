import { HTMLAttributes } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  padding?: boolean;
}

export default function Card({ padding = true, className = '', children, ...props }: CardProps) {
  return (
    <div
      className={`bg-surface-card rounded-card ${padding ? 'p-4' : ''} ${className}`}
      style={{ boxShadow: '0px 4px 20px 0px rgba(74, 63, 53, 0.06)' }}
      {...props}
    >
      {children}
    </div>
  );
}
