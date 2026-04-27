import React from 'react';

interface ButtonProps {
    variant?: 'primary' | 'secondary' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
    children: React.ReactNode;
    onClick?: () => void;
}

const Button: React.FC<ButtonProps> = ({ variant = 'primary', size = 'md', children, onClick }) => {
    const baseStyle = 'font-light focus:outline-none transition duration-150 ease-in-out';
    const variantStyles = {
        primary: 'bg-gold text-offWhite hover:bg-opacity-80',
        secondary: 'bg-offWhite text-nearBlack hover:bg-opacity-80',
        ghost: 'bg-transparent text-offWhite border border-offWhite hover:bg-opacity-20',
    }[variant];

    const sizeStyles = {
        sm: 'py-2 px-4 text-sm',
        md: 'py-3 px-6 text-base',
        lg: 'py-4 px-8 text-lg',
    }[size];

    return (
        <button 
            className={`${baseStyle} ${variantStyles} ${sizeStyles}`} 
            onClick={onClick} 
        >
            {children}
        </button>
    );
};

export default Button;