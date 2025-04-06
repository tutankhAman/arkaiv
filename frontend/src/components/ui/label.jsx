import React from 'react';

export const Label = ({ 
  htmlFor, 
  children, 
  className = '' 
}) => {
  return (
    <label
      htmlFor={htmlFor}
      className={`block text-sm font-medium text-gray-700 ${className}`}
    >
      {children}
    </label>
  );
}; 