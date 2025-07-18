import React from "react";

interface CardProps {
  className?: string;
  children: React.ReactNode;
  [key: string]: any;
}

const Card: React.FC<CardProps> = ({ className = '', children, ...props }) => (
  <div className={`card ${className}`} {...props}>
    {children}
  </div>
);

const CardHeader: React.FC<CardProps> = ({ className = '', children, ...props }) => (
  <div className={`mb-20 ${className}`} {...props}>
    {children}
  </div>
);

const CardTitle: React.FC<CardProps> = ({ className = '', children, ...props }) => (
  <h3 className={`${className}`} {...props}>
    {children}
  </h3>
);

const CardDescription: React.FC<CardProps> = ({ className = '', children, ...props }) => (
  <p className={`${className}`} {...props}>
    {children}
  </p>
);

const CardContent: React.FC<CardProps> = ({ className = '', children, ...props }) => (
  <div className={`${className}`} {...props}>
    {children}
  </div>
);

export {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
};