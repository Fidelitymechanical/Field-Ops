import React from 'react';

interface TextProps {
  variant?: 'h1' | 'h2' | 'h3' | 'p' | 'label' | 'caption';
  children: React.ReactNode;
  className?: string;
}

const Text: React.FC<TextProps> = ({ variant = 'p', children, className = '' }) => {
  const variantStyles = {
    h1: 'text-4xl font-serif font-light text-gold',
    h2: 'text-3xl font-serif font-light text-offWhite',
    h3: 'text-2xl font-serif font-light text-offWhite',
    p: 'text-base font-sans font-light text-offWhite',
    label: 'text-sm font-mono font-light text-gold uppercase',
    caption: 'text-xs font-sans font-light text-gray-400',
  };

  const Element = variant as keyof JSX.IntrinsicElements;
  return (
    <Element className={`${variantStyles[variant]} ${className}`}> 
      {children} 
    </Element>
  );
};

export default Text;