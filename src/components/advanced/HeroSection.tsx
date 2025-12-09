import React, { useRef, useEffect, useState } from 'react'
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
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string>('')

  // Register all buttons as overlay portals to keep them interactive
  useEffect(() => {
    buttonRefs.current.forEach((buttonRef) => {
      if (buttonRef) {
        registerOverlayPortal(buttonRef)
      }
    })
  }, [buttons])

  // Handle file upload
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        setUploadedImageUrl(result)
      }
      reader.readAsDataURL(file)
    }
  }


  // Get the current background image (uploaded or prop)
  const currentBackgroundImage = uploadedImageUrl || backgroundImage
  
  // Use contain to show full image without cropping, or cover if no image
  const backgroundSizeValue = currentBackgroundImage ? 'contain' : 'cover'
  
  const heroStyle: React.CSSProperties = {
    background: currentBackgroundImage 
      ? `${backgroundColor || '#1a1a1a'} url(${currentBackgroundImage})` 
      : backgroundColor,
    backgroundSize: backgroundSizeValue,
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    color: textColor,
    minHeight: currentBackgroundImage ? '600px' : '300px',
    height: currentBackgroundImage ? 'auto' : (height || '500px'),
    display: 'flex',
    alignItems: 'center',
    justifyContent: alignment === 'left' ? 'flex-start' : alignment === 'right' ? 'flex-end' : 'center',
    padding: 'clamp(40px, 8vw, 80px) clamp(20px, 4vw, 40px)',
    margin: '0',
    position: 'relative',
    overflow: 'hidden',
    width: '100%',
    aspectRatio: currentBackgroundImage ? 'auto' : undefined
  }

  // Add responsive height via CSS custom properties and media queries
  const heroClassName = 'w-full'

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
    width: '100%',
    padding: '0 clamp(10px, 2vw, 20px)'
  }

  const titleStyle: React.CSSProperties = {
    margin: '0 0 15px 0',
    fontSize: 'clamp(1.75rem, 4vw, 3.5rem)',
    fontWeight: 'bold',
    lineHeight: '1.1',
    color: '#FFFFFF',
    textShadow: '2px 2px 4px rgba(0,0,0,0.5)'
  }

  const subtitleStyle: React.CSSProperties = {
    margin: '0 0 20px 0',
    fontSize: 'clamp(0.875rem, 2vw, 1.25rem)',
    opacity: 0.95,
    color: '#FFFFFF',
    textShadow: '1px 1px 2px rgba(0,0,0,0.5)',
    lineHeight: '1.4'
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
    <div 
      style={heroStyle}
      className={heroClassName}
      onClick={() => fileInputRef.current?.click()}
      onMouseEnter={(e) => {
        e.currentTarget.style.cursor = 'pointer'
        e.currentTarget.style.opacity = '0.95'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.cursor = 'default'
        e.currentTarget.style.opacity = '1'
      }}
    >
      {currentBackgroundImage && <div style={overlayStyle} />}
      
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileUpload}
        style={{ display: 'none' }}
      />

      <div 
        style={contentStyle}
        onClick={(e) => e.stopPropagation()}
        onMouseEnter={(e) => {
          e.currentTarget.parentElement!.style.cursor = 'default'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.parentElement!.style.cursor = 'pointer'
        }}
      >
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
            marginTop: 'clamp(20px, 4vw, 30px)',
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
