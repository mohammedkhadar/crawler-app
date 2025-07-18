import React from "react";

interface BadgeProps {
  variant?: 'default' | 'success' | 'info' | 'warning' | 'destructive' | 'secondary';
  className?: string;
  children: React.ReactNode;
  [key: string]: any;
}

const Badge: React.FC<BadgeProps> = ({ variant = "default", className = '', children, ...props }) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'success':
        return { backgroundColor: '#28a745', color: 'white' };
      case 'info':
        return { backgroundColor: '#17a2b8', color: 'white' };
      case 'warning':
        return { backgroundColor: '#ffc107', color: 'black' };
      case 'destructive':
        return { backgroundColor: '#dc3545', color: 'white' };
      case 'secondary':
        return { backgroundColor: '#6c757d', color: 'white' };
      default:
        return { backgroundColor: '#6c757d', color: 'white' };
    }
  };

  return (
    <span 
      className={className}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        padding: '4px 8px',
        borderRadius: '4px',
        fontSize: '12px',
        fontWeight: '500',
        ...getVariantStyles()
      }}
      {...props}
    >
      {children}
    </span>
  );
};

export { Badge };