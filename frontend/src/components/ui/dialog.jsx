import React from 'react';

export const Dialog = ({ open, onOpenChange, children }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/50" onClick={onOpenChange} />
      <div className="relative z-50 w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
        {children}
      </div>
    </div>
  );
};

export const DialogContent = ({ children }) => (
  <div className="space-y-4">{children}</div>
);

export const DialogHeader = ({ children }) => (
  <div className="space-y-2">{children}</div>
);

export const DialogTitle = ({ children }) => (
  <h2 className="text-2xl font-bold">{children}</h2>
);

export const DialogDescription = ({ children }) => (
  <p className="text-gray-500">{children}</p>
);

export const DialogFooter = ({ children }) => (
  <div className="flex justify-end space-x-2">{children}</div>
); 