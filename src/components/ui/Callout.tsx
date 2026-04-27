import React from 'react';

interface CalloutProps {
  type?: 'info' | 'warning' | 'error' | 'success';
  children: React.ReactNode;
  className?: string;
}

const Callout: React.FC<CalloutProps> = ({ type = 'info', children, className = '' }) => {
  const typeStyles = {
    info: 'bg-blue-900 border-blue-500 text-blue-50',
    warning: 'bg-yellow-900 border-yellow-500 text-yellow-50',
    error: 'bg-red-900 border-red-500 text-red-50',
    success: 'bg-green-900 border-green-500 text-green-50',
  };

  return (
    <div className={`border-l-4 px-4 py-3 rounded font-sans font-light ${typeStyles[type]} ${className}`}> 
      {children} 
    </div>
  );
};

export default Callout;