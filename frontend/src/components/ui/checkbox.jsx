import React from 'react';

export const Checkbox = ({ 
  id, 
  checked, 
  onCheckedChange,
  className = ''
}) => {
  return (
    <input
      type="checkbox"
      id={id}
      checked={checked}
      onChange={(e) => onCheckedChange(e.target.checked)}
      className={`h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary ${className}`}
    />
  );
}; 