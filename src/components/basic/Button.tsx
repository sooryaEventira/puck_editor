import React from 'react'
import { ButtonProps } from '../../types'

const Button = ({ text, variant = 'primary', size = 'medium' }: ButtonProps) => {
  const sizeStyles: Record<string, React.CSSProperties> = {
    small: { padding: '8px 16px', fontSize: '14px' },
    medium: { padding: '12px 24px', fontSize: '16px' },
    large: { padding: '16px 32px', fontSize: '18px' }
  }
  
  const variantStyles: Record<string, React.CSSProperties> = {
    primary: { backgroundColor: '#007bff', color: 'white' },
    secondary: { backgroundColor: '#6c757d', color: 'white' },
    success: { backgroundColor: '#28a745', color: 'white' },
    danger: { backgroundColor: '#dc3545', color: 'white' }
  }
  
  return (
    <button 
      style={{
        ...sizeStyles[size],
        ...variantStyles[variant],
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        margin: '8px 0'
      }}
    >
      {text}
    </button>
  )
}

export default Button
