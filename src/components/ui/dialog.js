import React from "react";

const Dialog = ({ open, onOpenChange, children }) => {
  if (!open) return null;

  const handleBackdropClick = (e) => {
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

const DialogContent = ({ className, children, ...props }) => (
  <div className={`modal-content ${className || ''}`} {...props}>
    {children}
  </div>
);

const DialogHeader = ({ className, children, ...props }) => (
  <div className={`mb-20 ${className || ''}`} {...props}>
    {children}
  </div>
);

const DialogTitle = ({ className, children, ...props }) => (
  <h2 className={`text-center ${className || ''}`} {...props}>
    {children}
  </h2>
);

const DialogDescription = ({ className, children, ...props }) => (
  <p className={`text-center ${className || ''}`} {...props}>
    {children}
  </p>
);

const DialogClose = ({ className, children, ...props }) => (
  <button className={`${className || ''}`} {...props}>
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