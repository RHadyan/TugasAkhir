'use client';

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'danger' | 'success';
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  className?: string;
  icon?: React.ReactNode;
}

export default function Button({
  children,
  onClick,
  variant = 'primary',
  type = 'button',
  disabled = false,
  className = '',
  icon,
}: ButtonProps) {
  const baseStyles = 'px-4 py-2 rounded-lg font-medium flex items-center gap-2 justify-center transition-all disabled:opacity-50 disabled:cursor-not-allowed';

  const variants = {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/30 hover:shadow-blue-600/50',
    secondary: 'bg-gray-600 hover:bg-gray-700 text-white',
    danger: 'bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-600/30 hover:shadow-red-600/50',
    success: 'bg-green-600 hover:bg-green-700 text-white shadow-lg shadow-green-600/30 hover:shadow-green-600/50',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variants[variant]} ${className}`}
    >
      {icon && <span>{icon}</span>}
      {children}
    </button>
  );
}
