import React, { useRef, useEffect } from 'react'
import { registerOverlayPortal } from '@measured/puck'
import { HeroSectionProps, HeroButton } from '../../types'

const HeroSection = ({ 
  title, 
  subtitle = '', 
  buttons = [
    {
      text: 'Register Now',
      link: '#',
      color: '#8b5cf6',
      textColor: 'white',
      size: 'large' as const
    }
  ],
  backgroundColor = '#1a1a1a', 
  textColor = '#FFFFFF',
  backgroundImage = '',
  height = '500px',
  alignment = 'center',
  overlayOpacity = 0.4,
  titleSize = '3.5rem',
  subtitleSize = '1.25rem',
  buttonSpacing = '12px'
}: HeroSectionProps) => {
  const buttonRefs = useRef<(HTMLAnchorElement | null)[]>([])

  // Register all buttons as overlay portals to keep them interactive
  useEffect(() => {
    buttonRefs.current.forEach((buttonRef) => {
      if (buttonRef) {
        registerOverlayPortal(buttonRef)
      }
    })
  }, [buttons])
  const heroStyle: React.CSSProperties = {
    background: backgroundImage ? `url(${backgroundImage})` : backgroundColor,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    color: textColor,
    height: height,
    display: 'flex',
    alignItems: 'center',
    justifyContent: alignment === 'left' ? 'flex-start' : alignment === 'right' ? 'flex-end' : 'center',
    padding: '80px 40px',
    margin: '0',
    position: 'relative',
    overflow: 'hidden'
  }

  const overlayStyle: React.CSSProperties = {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: `rgba(0, 0, 0, ${overlayOpacity})`,
    zIndex: 1
  }

  const contentStyle: React.CSSProperties = {
    textAlign: alignment,
    maxWidth: '800px',
    zIndex: 2,
    position: 'relative',
    width: '100%'
  }

  const titleStyle: React.CSSProperties = {
    margin: '0 0 20px 0',
    fontSize: titleSize,
    fontWeight: 'bold',
    lineHeight: '1.1',
    color: '#FFFFFF',
    textShadow: '2px 2px 4px rgba(0,0,0,0.5)'
  }

  const subtitleStyle: React.CSSProperties = {
    margin: '0 0 30px 0',
    fontSize: subtitleSize,
    opacity: 0.95,
    color: '#FFFFFF',
    textShadow: '1px 1px 2px rgba(0,0,0,0.5)',
    lineHeight: '1.4'
  }

  const getButtonPadding = (size: 'small' | 'medium' | 'large') => {
    switch (size) {
      case 'small': return '8px 16px'
      case 'medium': return '12px 24px'
      case 'large': return '16px 32px'
      default: return '16px 32px'
    }
  }

  const getButtonFontSize = (size: 'small' | 'medium' | 'large') => {
    switch (size) {
      case 'small': return '14px'
      case 'medium': return '16px'
      case 'large': return '18px'
      default: return '18px'
    }
  }

  const getButtonStyle = (button: HeroButton): React.CSSProperties => ({
    backgroundColor: button.color || '#6938EF',
    color: button.textColor || 'white',
    padding: getButtonPadding(button.size || 'large'),
    border: (button.color || '#6938EF') === 'transparent' ? `2px solid ${button.textColor || 'white'}` : 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: getButtonFontSize(button.size || 'large'),
    fontWeight: 'bold',
    textDecoration: 'none',
    display: 'inline-block',
    transition: 'all 0.3s ease',
    boxShadow: (button.color || '#6938EF') === 'transparent' ? 'none' : '0 4px 12px rgba(0,0,0,0.3)',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    marginRight: buttonSpacing
  })

  const handleButtonHover = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.currentTarget.style.transform = 'translateY(-2px)'
    const isTransparent = e.currentTarget.style.backgroundColor === 'transparent'
    if (isTransparent) {
      e.currentTarget.style.backgroundColor = e.currentTarget.style.color
      e.currentTarget.style.color = 'white'
    } else {
      e.currentTarget.style.boxShadow = '0 6px 16px rgba(0,0,0,0.4)'
    }
  }

  const handleButtonLeave = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.currentTarget.style.transform = 'translateY(0)'
    const isTransparent = e.currentTarget.style.backgroundColor === 'transparent'
    if (isTransparent) {
      e.currentTarget.style.backgroundColor = 'transparent'
      e.currentTarget.style.color = e.currentTarget.dataset.originalColor || 'white'
    } else {
      e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.3)'
    }
  }

  const handleButtonClick = (e: React.MouseEvent<HTMLAnchorElement>, button: HeroButton) => {
    // Prevent default behavior for empty links or hash-only links
    if (!button.link || button.link === '#' || button.link.startsWith('#')) {
      e.preventDefault()
      console.log('Button clicked:', button.text, 'Link:', button.link)
      // You can add custom logic here for button clicks
    }
  }

  return (
    <div style={heroStyle}>
      {backgroundImage && <div style={overlayStyle} />}
      <div style={contentStyle}>
        <h1 
          style={titleStyle} 
          data-puck-field="title"
          contentEditable
          suppressContentEditableWarning={true}
        >
          {title}
        </h1>
        {subtitle && (
          <p 
            style={subtitleStyle} 
            data-puck-field="subtitle"
            contentEditable
            suppressContentEditableWarning={true}
          >
            {subtitle}
          </p>
        )}
        {buttons && buttons.length > 0 && (
          <div style={{ 
            marginTop: '30px',
            display: 'flex',
            flexWrap: 'wrap',
            gap: buttonSpacing,
            justifyContent: alignment === 'left' ? 'flex-start' : alignment === 'right' ? 'flex-end' : 'center'
          }}>
            {buttons.map((button, index) => (
              <a
                key={index}
                ref={(el) => {
                  buttonRefs.current[index] = el
                }}
                href={button.link || '#'}
                style={getButtonStyle(button)}
                data-original-color={button.textColor}
                data-puck-field={`buttons[${index}].text`}
                contentEditable
                suppressContentEditableWarning={true}
                onMouseEnter={handleButtonHover}
                onMouseLeave={handleButtonLeave}
                onClick={(e) => handleButtonClick(e, button)}
              >
                {button.text}
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default HeroSection
