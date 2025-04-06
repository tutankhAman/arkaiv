import React from 'react';

export const Button = ({ 
  children, 
  onClick, 
  disabled = false, 
  className = '', 
  variant = 'default' 
}) => {
  const baseStyles = 'px-4 py-2 rounded-md font-medium transition-colors';
  const variantStyles = {
    default: 'bg-primary text-white hover:bg-primary/90',
    outline: 'border border-gray-300 text-gray-700 hover:bg-gray-50',
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variantStyles[variant]} ${className} ${
        disabled ? 'opacity-50 cursor-not-allowed' : ''
      }`}
    >
      {children}
    </button>
  );
}; 