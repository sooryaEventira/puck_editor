import React from 'react'
import { CardProps } from '../../types'

const Card = ({ title, description, backgroundColor = '#fff', titleColor, textColor }: CardProps) => {
  return (
    <div 
      style={{ backgroundColor }}
      className="border border-gray-300 rounded-lg p-5 my-4 shadow-sm"
    >
      <h3 
        style={{ color: titleColor || '#333' }}
        className="m-0 mb-3"
      >
        {title}
      </h3>
      <p 
        style={{ color: textColor || '#666' }}
        className="m-0 leading-relaxed"
      >
        {description}
      </p>
    </div>
  )
}

export default Card
