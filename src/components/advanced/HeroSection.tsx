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

  // NOTE: Inline editing is disabled for HeroSection.
  // This component should be edited from the property sidebar only (editor + preview/public).
  const currentBackgroundImage = backgroundImage
  
  // Container style - fixed height, full width
  const heroStyle: React.CSSProperties = {
    backgroundColor: currentBackgroundImage ? '#ffffff' : (backgroundColor || '#1a1a1a'),
    color: textColor,
    minHeight: currentBackgroundImage ? '500px' : '300px',
    height: currentBackgroundImage ? (height || '500px') : (height || '500px'),
    justifyContent: alignment === 'left' ? 'flex-start' : alignment === 'right' ? 'flex-end' : 'center',
    padding: 'clamp(40px, 8vw, 80px) clamp(20px, 4vw, 40px)',
    width: '100%',
    maxWidth: '100%',
    display: 'flex',
    position: 'relative',
    boxSizing: 'border-box',
    overflow: 'hidden',
    margin: 0
  }
  
  // Debug: Log what backgroundImage prop we received and what style is being applied
  useEffect(() => {
    const bgString = typeof heroStyle.background === 'string' ? heroStyle.background : ''
    console.log('🖼️ HeroSection render:', {
      backgroundImageProp: backgroundImage ? backgroundImage.substring(0, 50) + '...' : 'EMPTY',
      currentBackgroundImage: currentBackgroundImage ? currentBackgroundImage.substring(0, 50) + '...' : 'EMPTY',
      heroStyleBackground: bgString ? bgString.substring(0, 80) + '...' : '',
      title,
      subtitle
    })
  }, [backgroundImage, currentBackgroundImage, heroStyle.background, title, subtitle])

  const heroClassName = 'w-full flex items-center m-0 relative overflow-hidden block'

  const overlayStyle: React.CSSProperties = {
    backgroundColor: `rgba(0, 0, 0, ${overlayOpacity})`
  }

  const contentStyle: React.CSSProperties = {
    textAlign: alignment,
    maxWidth: '800px',
    padding: '0 clamp(10px, 2vw, 20px)'
  }

  const getButtonPadding = (size: 'small' | 'medium' | 'large') => {
    switch (size) {
      case 'small': return 'clamp(6px, 1.5vw, 8px) clamp(12px, 2vw, 16px)'
      case 'medium': return 'clamp(10px, 2vw, 12px) clamp(18px, 3vw, 24px)'
      case 'large': return 'clamp(12px, 2.5vw, 16px) clamp(24px, 4vw, 32px)'
      default: return 'clamp(12px, 2.5vw, 16px) clamp(24px, 4vw, 32px)'
    }
  }

  const getButtonFontSize = (size: 'small' | 'medium' | 'large') => {
    switch (size) {
      case 'small': return 'clamp(12px, 2vw, 14px)'
      case 'medium': return 'clamp(14px, 2.5vw, 16px)'
      case 'large': return 'clamp(14px, 3vw, 18px)'
      default: return 'clamp(14px, 3vw, 18px)'
    }
  }

  const getButtonStyle = (button: HeroButton): React.CSSProperties => ({
    backgroundColor: button.color || '#6938EF',
    color: button.textColor || 'white',
    padding: getButtonPadding(button.size || 'large'),
    border: (button.color || '#6938EF') === 'transparent' ? `2px solid ${button.textColor || 'white'}` : 'none',
    fontSize: getButtonFontSize(button.size || 'large'),
    boxShadow: (button.color || '#6938EF') === 'transparent' ? 'none' : '0 4px 12px rgba(0,0,0,0.3)',
    marginRight: buttonSpacing
  })

  const handleButtonHover = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.currentTarget.classList.add('-translate-y-0.5')
    const isTransparent = e.currentTarget.style.backgroundColor === 'transparent'
    if (isTransparent) {
      e.currentTarget.style.backgroundColor = e.currentTarget.style.color
      e.currentTarget.style.color = 'white'
    } else {
      e.currentTarget.style.boxShadow = '0 6px 16px rgba(0,0,0,0.4)'
    }
  }

  const handleButtonLeave = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.currentTarget.classList.remove('-translate-y-0.5')
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
    <div 
      style={heroStyle}
      className={heroClassName}
    >
      {/* Banner Image - using img tag with object-fit: cover to fill width and height */}
      {currentBackgroundImage && (
        <img
          src={currentBackgroundImage}
          alt="Hero banner"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover' as const,
            objectPosition: 'center center',
            zIndex: 0,
            display: 'block',
            margin: 0,
            padding: 0
          }}
          onError={(e) => {
            console.error('Error loading banner image')
            e.currentTarget.style.display = 'none'
          }}
        />
      )}
      {/* Overlay for text readability */}
      {currentBackgroundImage && <div style={overlayStyle} className="absolute inset-0 z-[1]" />}
      
      <div 
        style={contentStyle}
        className="z-[2] relative w-full"
      >
        <h1 
          className="m-0 mb-4 text-[clamp(1.75rem,4vw,3.5rem)] font-bold leading-tight text-white drop-shadow-[2px_2px_4px_rgba(0,0,0,0.5)]"
        >
          {title}
        </h1>
        {subtitle && (
          <p 
            className="m-0 mb-5 text-[clamp(0.875rem,2vw,1.25rem)] opacity-95 text-white drop-shadow-[1px_1px_2px_rgba(0,0,0,0.5)] leading-snug"
          >
            {subtitle}
          </p>
        )}
        {buttons && buttons.length > 0 && (
          <div 
            className="mt-[clamp(20px,4vw,30px)] flex flex-wrap"
            style={{ 
              gap: buttonSpacing,
              justifyContent: alignment === 'left' ? 'flex-start' : alignment === 'right' ? 'flex-end' : 'center'
            }}
          >
            {buttons.map((button, index) => (
              <a
                key={index}
                ref={(el) => {
                  buttonRefs.current[index] = el
                }}
                href={button.link || '#'}
                style={getButtonStyle(button)}
                className="rounded-lg cursor-pointer font-bold no-underline inline-block transition-all duration-300 uppercase tracking-wider"
                data-original-color={button.textColor}
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
