import React from 'react'

interface ButtonProps {
  type?: 'button' | 'submit' | 'reset';
  text: string;
  fullWidth?: boolean;
}

const Button: React.FC<ButtonProps> = ({ text, type, fullWidth }) => {
  return (
    <button
      type={type}
      className={`${fullWidth ? 'w-full' : 'px-4'} py-2 font-semibold text-white bg-blue-800 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
    >
      {text}
    </button>
  )
}

export default Button;