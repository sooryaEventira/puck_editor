import React from 'react'
import { ButtonProps } from '../../types'

const Button: React.FC<ButtonProps> = ({ text, variant = 'primary', size = 'medium', textColor, backgroundColor, onClick }) => {
  const sizeClasses: Record<string, string> = {
    small: 'py-2 px-4 text-sm',
    medium: 'py-3 px-6 text-base',
    large: 'py-4 px-8 text-lg'
  }
  
  const variantClasses: Record<string, string> = {
    primary: 'bg-blue-500',
    secondary: 'bg-gray-500',
    success: 'bg-green-500',
    danger: 'bg-red-500'
  }
  
  // Dynamic styles that need to remain inline
  const dynamicStyle: React.CSSProperties = {
    ...(backgroundColor && { backgroundColor }),
    ...(textColor && { color: textColor })
  }
  
  return (
    <button 
      onClick={onClick}
      style={dynamicStyle}
      className={`${sizeClasses[size]} ${variantClasses[variant]} ${textColor ? '' : 'text-white'} border-none rounded cursor-pointer my-2`}
    >
      {text}
    </button>
  )
}

export default Button
