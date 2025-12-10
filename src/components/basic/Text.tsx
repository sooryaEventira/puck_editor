import React from 'react'
import { TextProps } from '../../types'

const Text = ({ text, size = '16px', color = '#555', align = 'left', puck }: TextProps) => {
  const alignClass = align === 'center' ? 'text-center' : align === 'right' ? 'text-right' : 'text-left'
  
  return (
    <p 
      ref={puck?.dragRef}
      style={{ 
        color: color,
        fontSize: size
      }}
      className={`my-3 leading-relaxed ${alignClass}`}
    >
      {text}
    </p>
  )
}

export default Text
