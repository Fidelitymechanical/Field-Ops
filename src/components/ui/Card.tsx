import React from 'react';

interface CardProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
}

const Card: React.FC<CardProps> = ({ title, children, className = '' }) => {
  return (
    <div className={`bg-nearBlack border border-borderColor rounded p-6 ${className}`}> 
      {title && (
        <h3 className="text-offWhite font-serif text-lg font-light mb-4">
          {title}
        </h3>
      )}
      <div className="text-offWhite font-sans font-light">
        {children}
      </div>
    </div>
  );
};

export default Card;