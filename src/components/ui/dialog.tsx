import React from "react";

interface DialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
}

interface DialogComponentProps {
  className?: string;
  children: React.ReactNode;
  [key: string]: any;
}

const Dialog: React.FC<DialogProps> = ({ open, onOpenChange, children }) => {
  if (!open) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onOpenChange(false);
    }
  };

  return (
    <div className="modal" onClick={handleBackdropClick}>
      {children}
    </div>
  );
};

const DialogContent: React.FC<DialogComponentProps> = ({ className = '', children, ...props }) => (
  <div className={`modal-content ${className}`} {...props}>
    {children}
  </div>
);

const DialogHeader: React.FC<DialogComponentProps> = ({ className = '', children, ...props }) => (
  <div className={`mb-20 ${className}`} {...props}>
    {children}
  </div>
);

const DialogTitle: React.FC<DialogComponentProps> = ({ className = '', children, ...props }) => (
  <h2 className={`text-center ${className}`} {...props}>
    {children}
  </h2>
);

const DialogDescription: React.FC<DialogComponentProps> = ({ className = '', children, ...props }) => (
  <p className={`text-center ${className}`} {...props}>
    {children}
  </p>
);

const DialogClose: React.FC<DialogComponentProps> = ({ className = '', children, ...props }) => (
  <button className={`${className}`} {...props}>
    {children}
  </button>
);

export {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
};