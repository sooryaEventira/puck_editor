import React from 'react'
import { HeadingProps } from '../../types'

const Heading = ({ text, level = 1, color = '#333', align = 'left' }: HeadingProps) => {
  const headingStyle: React.CSSProperties = {
    margin: '16px 0',
    color: color,
    fontWeight: 'bold',
    textAlign: align
  }
  
  switch (level) {
    case 1: return <h1 style={headingStyle}>{text}</h1>
    case 2: return <h2 style={headingStyle}>{text}</h2>
    case 3: return <h3 style={headingStyle}>{text}</h3>
    case 4: return <h4 style={headingStyle}>{text}</h4>
    default: return <h1 style={headingStyle}>{text}</h1>
  }
}

export default Heading
