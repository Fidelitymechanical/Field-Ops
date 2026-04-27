import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  disabled?: boolean;
}

const Input: React.FC<InputProps> = ({ label, error, disabled, className = '', ...props }) => {
  const baseStyle = 'w-full bg-nearBlack text-offWhite font-sans font-light border border-borderColor rounded px-4 py-2 focus:outline-none focus:border-gold transition duration-150';
  const disabledStyle = disabled ? 'opacity-50 cursor-not-allowed' : '';
  const errorStyle = error ? 'border-red-500' : '';

  return (
    <div className="w-full">
      {label && (
        <label className="block text-offWhite font-sans font-light mb-2 text-sm">
          {label}
        </label>
      )}
      <input {...props} disabled={disabled} className={`${baseStyle} ${disabledStyle} ${errorStyle} ${className}`} />
      {error && (
        <p className="text-red-500 text-xs mt-1 font-sans font-light">
          {error}
        </p>
      )}
    </div>
  );
};

export default Input;