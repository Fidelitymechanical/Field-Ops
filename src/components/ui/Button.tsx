import React from 'react';

interface ButtonProps {
    variant?: 'primary' | 'secondary' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
    children: React.ReactNode;
    onClick?: () => void;
    disabled?: boolean;
    type?: 'button' | 'submit' | 'reset';
}

const Button: React.FC<ButtonProps> = ({ variant = 'primary', size = 'md', children, onClick, disabled, type = 'button' }) => {
    const baseStyle = 'font-light focus:outline-none transition duration-150 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed';
    const variantStyles = {
        primary: 'bg-gold text-offWhite hover:bg-opacity-80',
        secondary: 'bg-offWhite text-nearBlack hover:bg-opacity-80',
        ghost: 'bg-transparent text-offWhite border border-offWhite hover:bg-white hover:bg-opacity-10',
    }[variant];

    const sizeStyles = {
        sm: 'py-2 px-4 text-sm',
        md: 'py-3 px-6 text-base',
        lg: 'py-4 px-8 text-lg',
    }[size];

    return (
        <button
            type={type}
            className={`${baseStyle} ${variantStyles} ${sizeStyles}`}
            onClick={onClick}
            disabled={disabled}
        >
            {children}
        </button>
    );
};

export default Button;