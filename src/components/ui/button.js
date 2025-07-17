import React from "react";

const Button = ({ variant = "default", size = "default", className, children, ...props }) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'destructive':
        return { backgroundColor: '#dc3545', color: 'white' };
      case 'outline':
        return { backgroundColor: 'transparent', color: '#007bff', border: '1px solid #007bff' };
      case 'secondary':
        return { backgroundColor: '#6c757d', color: 'white' };
      case 'ghost':
        return { backgroundColor: 'transparent', color: '#333', border: 'none' };
      default:
        return { backgroundColor: '#007bff', color: 'white' };
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return { padding: '4px 8px', fontSize: '12px' };
      case 'lg':
        return { padding: '12px 24px', fontSize: '16px' };
      default:
        return { padding: '8px 16px', fontSize: '14px' };
    }
  };

  return (
    <button 
      className={`${className || ''}`}
      style={{
        border: '1px solid transparent',
        borderRadius: '4px',
        cursor: 'pointer',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        ...getVariantStyles(),
        ...getSizeStyles()
      }}
      {...props}
    >
      {children}
    </button>
  );
};

export { Button };