import React from "react";

interface ButtonProps {
  onClick: () => void;
  children: React.ReactNode;
  className?: string;
}

const Button: React.FC<ButtonProps> = ({ onClick, children, className }) => {
  return (
    <button
      onClick={onClick}
      className={`p-2 rounded-md shadow-md flex items-center gap-1 ${className}`}>
      {children}
    </button>
  );
};

export default Button;
