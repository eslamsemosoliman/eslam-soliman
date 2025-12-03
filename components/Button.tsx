import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'gold';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  fullWidth = false,
  className = '',
  ...props 
}) => {
  const baseStyles = "font-bold rounded-lg transition-all duration-200 flex items-center justify-center gap-2";
  
  const variants = {
    primary: "bg-brand-dark text-white hover:bg-opacity-90",
    secondary: "bg-brand-primary text-white hover:bg-opacity-90",
    gold: "bg-brand-gold text-brand-text hover:bg-yellow-400 shadow-md",
    outline: "border-2 border-brand-primary text-brand-primary hover:bg-brand-primary hover:text-white"
  };

  const sizes = {
    sm: "px-3 py-1 text-sm",
    md: "px-6 py-2 text-base",
    lg: "px-8 py-3 text-lg"
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${fullWidth ? 'w-full' : ''} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};