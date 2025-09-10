import React from 'react'
import { HeroSectionProps } from '../../types'

const HeroSection = ({ 
  title, 
  subtitle = '', 
  buttonText = 'Learn More', 
  buttonLink = '#', 
  backgroundColor = '#007bff', 
  textColor = 'white',
  backgroundImage = '',
  height = '400px',
  alignment = 'center'
}: HeroSectionProps) => {
  const heroStyle: React.CSSProperties = {
    background: backgroundImage ? `url(${backgroundImage})` : backgroundColor,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    color: textColor,
    height: height,
    display: 'flex',
    alignItems: 'center',
    justifyContent: alignment === 'left' ? 'flex-start' : alignment === 'right' ? 'flex-end' : 'center',
    padding: '60px 20px',
    margin: '16px 0',
    borderRadius: '8px',
    position: 'relative'
  }

  const contentStyle: React.CSSProperties = {
    textAlign: alignment,
    maxWidth: '600px',
    zIndex: 2,
    position: 'relative'
  }

  const buttonStyle: React.CSSProperties = {
    backgroundColor: textColor === 'white' ? 'white' : '#007bff',
    color: textColor === 'white' ? '#007bff' : 'white',
    padding: '12px 24px',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: 'bold',
    marginTop: '20px',
    textDecoration: 'none',
    display: 'inline-block'
  }

  return (
    <div style={heroStyle}>
      <div style={contentStyle}>
        <h1 style={{ margin: '0 0 16px 0', fontSize: '3rem', fontWeight: 'bold' }}>
          {title}
        </h1>
        {subtitle && (
          <p style={{ margin: '0 0 20px 0', fontSize: '1.2rem', opacity: 0.9 }}>
            {subtitle}
          </p>
        )}
        {buttonText && (
          <a href={buttonLink} style={buttonStyle}>
            {buttonText}
          </a>
        )}
      </div>
    </div>
  )
}

export default HeroSection
