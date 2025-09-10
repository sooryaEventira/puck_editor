import React from 'react'
import { TextProps } from '../../types'

const Text = ({ text, size = '16px', color = '#555', align = 'left' }: TextProps) => {
  return (
    <p style={{ 
      margin: '12px 0', 
      lineHeight: '1.6', 
      color: color,
      fontSize: size,
      textAlign: align
    }}>
      {text}
    </p>
  )
}

export default Text
