import React from 'react';

export const Dialog = ({ open, onOpenChange, children }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={onOpenChange} />
      <div className="relative z-50 w-full max-w-md rounded-lg bg-black/80 backdrop-blur-md p-6 shadow-lg border border-zinc-800/50">
        {children}
      </div>
    </div>
  );
};

export const DialogContent = ({ children, className }) => (
  <div className={`space-y-4 ${className}`}>{children}</div>
);

export const DialogHeader = ({ children }) => (
  <div className="space-y-2">{children}</div>
);

export const DialogTitle = ({ children, className }) => (
  <h2 className={`text-2xl font-bold text-white ${className}`}>{children}</h2>
);

export const DialogDescription = ({ children, className }) => (
  <p className={`text-zinc-300 ${className}`}>{children}</p>
);

export const DialogFooter = ({ children }) => (
  <div className="flex justify-end space-x-2">{children}</div>
); 