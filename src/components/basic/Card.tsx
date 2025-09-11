import React from 'react'
import { CardProps } from '../../types'

const Card = ({ title, description, backgroundColor = '#fff', titleColor, textColor }: CardProps) => {
  return (
    <div style={{
      backgroundColor: backgroundColor,
      border: '1px solid #ddd',
      borderRadius: '8px',
      padding: '20px',
      margin: '16px 0',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    }}>
      <h3 style={{ margin: '0 0 12px 0', color: titleColor || '#333' }}>{title}</h3>
      <p style={{ margin: '0', color: textColor || '#666', lineHeight: '1.5' }}>{description}</p>
    </div>
  )
}

export default Card
