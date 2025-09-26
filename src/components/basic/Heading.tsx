import React from 'react'
import { HeadingProps } from '../../types'

const Heading = ({ text, level = 1, size, color = '#333', align = 'left', puck }: HeadingProps) => {
  // Size mapping
  const getSizeValue = (size?: string) => {
    switch (size) {
      case 'XXXL': return '4rem'
      case 'XXL': return '3.5rem'
      case 'XL': return '3rem'
      case 'L': return '2.5rem'
      case 'M': return '2rem'
      case 'S': return '1.5rem'
      case 'XS': return '1.25rem'
      default: return undefined // Use default browser sizing
    }
  }

  const headingStyle: React.CSSProperties = {
    margin: '16px 0',
    color: color,
    fontWeight: 'bold',
    textAlign: align,
    fontSize: getSizeValue(size)
  }
  
  switch (level) {
    case 1: return <h1 ref={puck?.dragRef} style={headingStyle}>{text}</h1>
    case 2: return <h2 ref={puck?.dragRef} style={headingStyle}>{text}</h2>
    case 3: return <h3 ref={puck?.dragRef} style={headingStyle}>{text}</h3>
    case 4: return <h4 ref={puck?.dragRef} style={headingStyle}>{text}</h4>
    case 5: return <h5 ref={puck?.dragRef} style={headingStyle}>{text}</h5>
    case 6: return <h6 ref={puck?.dragRef} style={headingStyle}>{text}</h6>
    default: return <h1 ref={puck?.dragRef} style={headingStyle}>{text}</h1>
  }
}

export default Heading
