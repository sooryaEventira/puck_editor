import React from 'react'
import { Puck } from '@measured/puck'
import { DropZone } from "@measured/puck";
import '@measured/puck/puck.css'

// Type definitions for component props
interface HeadingProps {
  text: string
  level?: 1 | 2 | 3 | 4
  color?: string
  align?: 'left' | 'center' | 'right' | 'justify'
}

interface TextProps {
  text: string
  size?: string
  color?: string
  align?: 'left' | 'center' | 'right' | 'justify'
}

interface ButtonProps {
  text: string
  variant?: 'primary' | 'secondary' | 'success' | 'danger'
  size?: 'small' | 'medium' | 'large'
}

interface CardProps {
  title: string
  description: string
  backgroundColor?: string
}

interface ListProps {
  items: string
  type?: 'ul' | 'ol'
}

interface DividerProps {
  color?: string
  thickness?: string
}

interface SpacerProps {
  height?: string
}

interface ContainerProps {
  children?: React.ReactNode
  backgroundColor?: string
  padding?: string
  layout?: 'vertical' | 'horizontal' | 'grid' | 'centered'
  gap?: string
}

interface FlexContainerProps {
  children?: React.ReactNode
  direction?: 'row' | 'column' | 'row-reverse' | 'column-reverse'
  justify?: 'flex-start' | 'center' | 'flex-end' | 'space-between' | 'space-around' | 'space-evenly'
  align?: 'stretch' | 'flex-start' | 'center' | 'flex-end' | 'baseline'
  gap?: string
  wrap?: 'nowrap' | 'wrap' | 'wrap-reverse'
}

interface GridContainerProps {
  children?: React.ReactNode
  columns?: number
  gap?: string
  rowGap?: string
}

interface SimpleContainerProps {
  children?: React.ReactNode
  backgroundColor?: string
  padding?: string
}

interface PositionedElementProps {
  children?: React.ReactNode
  position?: 'static' | 'relative' | 'absolute' | 'fixed' | 'sticky'
  top?: string
  left?: string
  right?: string
  bottom?: string
  zIndex?: string
}

interface HeroSectionProps {
  title: string
  subtitle?: string
  buttonText?: string
  buttonLink?: string
  backgroundColor?: string
  textColor?: string
  backgroundImage?: string
  height?: string
  alignment?: 'left' | 'center' | 'right'
}

interface SliderProps {
  slides: string
  autoplay?: boolean
  autoplaySpeed?: number
  showDots?: boolean
  showArrows?: boolean
  height?: string
  backgroundColor?: string
}

interface ImageProps {
  src: string
  alt?: string
  width?: string
  height?: string
  borderRadius?: string
  objectFit?: 'cover' | 'contain' | 'fill' | 'scale-down' | 'none'
  alignment?: 'left' | 'center' | 'right'
  caption?: string
  showCaption?: boolean
}

// Component implementations
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

const Button = ({ text, variant = 'primary', size = 'medium' }: ButtonProps) => {
  const sizeStyles: Record<string, React.CSSProperties> = {
    small: { padding: '8px 16px', fontSize: '14px' },
    medium: { padding: '12px 24px', fontSize: '16px' },
    large: { padding: '16px 32px', fontSize: '18px' }
  }
  
  const variantStyles: Record<string, React.CSSProperties> = {
    primary: { backgroundColor: '#007bff', color: 'white' },
    secondary: { backgroundColor: '#6c757d', color: 'white' },
    success: { backgroundColor: '#28a745', color: 'white' },
    danger: { backgroundColor: '#dc3545', color: 'white' }
  }
  
  return (
    <button 
      style={{
        ...sizeStyles[size],
        ...variantStyles[variant],
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        margin: '8px 0'
      }}
    >
      {text}
    </button>
  )
}

const Card = ({ title, description, backgroundColor = '#fff' }: CardProps) => {
  return (
    <div style={{
      backgroundColor: backgroundColor,
      border: '1px solid #ddd',
      borderRadius: '8px',
      padding: '20px',
      margin: '16px 0',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    }}>
      <h3 style={{ margin: '0 0 12px 0', color: '#333' }}>{title}</h3>
      <p style={{ margin: '0', color: '#666', lineHeight: '1.5' }}>{description}</p>
    </div>
  )
}

const List = ({ items, type = 'ul' }: ListProps) => {
  const listItems = items.split('\n').filter(item => item.trim())
  
  if (type === 'ol') {
    return (
      <ol style={{ margin: '16px 0', paddingLeft: '20px' }}>
        {listItems.map((item, index) => (
          <li key={index} style={{ margin: '8px 0', color: '#555' }}>
            {item.trim()}
          </li>
        ))}
      </ol>
    )
  }
  
  return (
    <ul style={{ margin: '16px 0', paddingLeft: '20px' }}>
      {listItems.map((item, index) => (
        <li key={index} style={{ margin: '8px 0', color: '#555' }}>
          {item.trim()}
        </li>
      ))}
    </ul>
  )
}

const Divider = ({ color = '#ddd', thickness = '1px' }: DividerProps) => {
  return (
    <hr style={{
      border: 'none',
      borderTop: `${thickness} solid ${color}`,
      margin: '24px 0'
    }} />
  )
}

const Spacer = ({ height = '20px' }: SpacerProps) => {
  return (
    <div style={{
      height: height,
      width: '100%'
    }} />
  )
}

// Container Component with flexible positioning
const Container = ({ children, backgroundColor = 'transparent', padding = '20px', layout = 'vertical', gap = '16px' }: ContainerProps) => {
  const layoutStyles: Record<string, React.CSSProperties> = {
    vertical: {
      display: 'flex',
      flexDirection: 'column',
      gap: gap
    },
    horizontal: {
      display: 'flex',
      flexDirection: 'row',
      gap: gap,
      alignItems: 'center'
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: gap
    },
    centered: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: gap
    }
  }

  return (
    <div style={{
      backgroundColor: backgroundColor,
      padding: padding,
      margin: '16px 0',
      borderRadius: '8px',
      border: backgroundColor === 'transparent' ? '1px dashed #ccc' : 'none',
      ...layoutStyles[layout]
    }}>
      {children}
    </div>
  )
}

const FlexContainer = ({ children, direction = 'row', justify = 'flex-start', align = 'stretch', gap = '16px', wrap = 'nowrap' }: FlexContainerProps) => {
  return (
    <div style={{
      display: 'flex',
      flexDirection: direction,
      justifyContent: justify,
      alignItems: align,
      gap: gap,
      flexWrap: wrap,
      padding: '16px',
      margin: '16px 0',
      backgroundColor: '#f8f9fa',
      borderRadius: '8px',
      border: '1px solid #e9ecef'
    }}>
      {children}
    </div>
  )
}

// Grid Container Component
const GridContainer = ({ columns = 2, gap = '16px', rowGap = '16px' }: GridContainerProps) => {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: `repeat(${columns}, 1fr)`,
      gap: gap,
      rowGap: rowGap,
      padding: '16px',
      margin: '16px 0',
      backgroundColor: '#f8f9fa',
      borderRadius: '8px',
      border: '1px solid #e9ecef',
      minHeight: '100px'
    }}>
      <DropZone zone="children" />
    </div>
  )
}

// Simple Container Component for testing
const SimpleContainer = ({ children, backgroundColor = '#f0f8ff', padding = '20px' }: SimpleContainerProps) => {
  return (
    <div style={{
      backgroundColor: backgroundColor,
      padding: padding,
      margin: '16px 0',
      borderRadius: '8px',
      border: '2px dashed #007bff',
      minHeight: '100px'
    }}>
      {children}
    </div>
  )
}

// Positioned Component
const PositionedElement = ({ children, position = 'static', top = 'auto', left = 'auto', right = 'auto', bottom = 'auto', zIndex = 'auto' }: PositionedElementProps) => {
  return (
    <div style={{
      position: position,
      top: top,
      left: left,
      right: right,
      bottom: bottom,
      zIndex: zIndex,
      margin: '16px 0'
    }}>
      {children}
    </div>
  )
}

// Custom Hero Section Component
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

// Custom Slider Component
const Slider = ({ 
  slides, 
  autoplay = true, 
  autoplaySpeed = 3000, 
  showDots = true, 
  showArrows = true,
  height = '400px',
  backgroundColor = '#f8f9fa'
}: SliderProps) => {
  const [currentSlide, setCurrentSlide] = React.useState(0)
  const slideList = slides.split('\n').filter(slide => slide.trim())
  
  React.useEffect(() => {
    if (autoplay && slideList.length > 1) {
      const interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % slideList.length)
      }, autoplaySpeed)
      return () => clearInterval(interval)
    }
  }, [autoplay, autoplaySpeed, slideList.length])

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slideList.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slideList.length) % slideList.length)
  }

  const goToSlide = (index: number) => {
    setCurrentSlide(index)
  }

  const sliderStyle: React.CSSProperties = {
    position: 'relative',
    height: height,
    backgroundColor: backgroundColor,
    margin: '16px 0',
    borderRadius: '8px',
    overflow: 'hidden',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  }

  const slideStyle: React.CSSProperties = {
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '40px',
    textAlign: 'center',
    fontSize: '1.5rem',
    fontWeight: 'bold',
    color: '#333',
    background: `linear-gradient(135deg, ${backgroundColor} 0%, #e9ecef 100%)`
  }

  const arrowStyle: React.CSSProperties = {
    position: 'absolute',
    top: '50%',
    transform: 'translateY(-50%)',
    backgroundColor: 'rgba(0,0,0,0.5)',
    color: 'white',
    border: 'none',
    borderRadius: '50%',
    width: '40px',
    height: '40px',
    cursor: 'pointer',
    fontSize: '18px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2
  }

  const dotsStyle: React.CSSProperties = {
    position: 'absolute',
    bottom: '20px',
    left: '50%',
    transform: 'translateX(-50%)',
    display: 'flex',
    gap: '8px',
    zIndex: 2
  }

  const dotStyle: React.CSSProperties = {
    width: '12px',
    height: '12px',
    borderRadius: '50%',
    backgroundColor: 'rgba(255,255,255,0.5)',
    cursor: 'pointer',
    transition: 'background-color 0.3s'
  }

  const activeDotStyle: React.CSSProperties = {
    ...dotStyle,
    backgroundColor: 'white'
  }

  if (slideList.length === 0) {
    return (
      <div style={sliderStyle}>
        <div style={slideStyle}>
          Add slide content (one per line)
        </div>
      </div>
    )
  }

  return (
    <div style={sliderStyle}>
      {/* Current Slide */}
      <div style={slideStyle}>
        {slideList[currentSlide] || 'No slides available'}
      </div>

      {/* Navigation Arrows */}
      {showArrows && slideList.length > 1 && (
        <>
          <button 
            style={{ ...arrowStyle, left: '20px' }}
            onClick={prevSlide}
          >
            ‹
          </button>
          <button 
            style={{ ...arrowStyle, right: '20px' }}
            onClick={nextSlide}
          >
            ›
          </button>
        </>
      )}

      {/* Dots Navigation */}
      {showDots && slideList.length > 1 && (
        <div style={dotsStyle}>
          {slideList.map((_, index) => (
            <button
              key={index}
              style={index === currentSlide ? activeDotStyle : dotStyle}
              onClick={() => goToSlide(index)}
            />
          ))}
        </div>
      )}
    </div>
  )
}

// Custom Image Component
const Image = ({ 
  src, 
  alt = '', 
  width = '100%', 
  height = 'auto', 
  borderRadius = '0px',
  objectFit = 'cover',
  alignment = 'center',
  caption = '',
  showCaption = false
}: ImageProps) => {
  const containerStyle: React.CSSProperties = {
    margin: '16px 0',
    textAlign: alignment,
    display: 'flex',
    flexDirection: 'column',
    alignItems: alignment === 'left' ? 'flex-start' : alignment === 'right' ? 'flex-end' : 'center'
  }

  const imageStyle: React.CSSProperties = {
    width: width,
    height: height,
    borderRadius: borderRadius,
    objectFit: objectFit,
    maxWidth: '100%',
    display: 'block'
  }

  const captionStyle: React.CSSProperties = {
    marginTop: '8px',
    fontSize: '14px',
    color: '#666',
    fontStyle: 'italic',
    textAlign: alignment
  }

  // Fallback image for errors
  const fallbackImage = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjBmMGYwIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlIG5vdCBmb3VuZDwvdGV4dD48L3N2Zz4=';

  return (
    <div style={containerStyle}>
      {src ? (
        <img 
          src={src} 
          alt={alt}
          style={imageStyle}
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = fallbackImage;
          }}
        />
      ) : (
        <div style={{
          ...imageStyle,
          backgroundColor: '#f8f9fa',
          border: '2px dashed #dee2e6',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#6c757d',
          fontSize: '14px',
          minHeight: '200px'
        }}>
          📷 No image URL provided
        </div>
      )}
      {showCaption && caption && (
        <div style={captionStyle}>
          {caption}
        </div>
      )}
    </div>
  )
}

// Enhanced config with multiple components
const config = {
  components: {
    Heading: {
      fields: {
        text: { type: 'text' as const },
        level: { 
          type: 'select' as const, 
          options: [
            { label: 'H1', value: 1 },
            { label: 'H2', value: 2 },
            { label: 'H3', value: 3 },
            { label: 'H4', value: 4 }
          ]
        },
        color: { type: 'text' as const },
        align: {
          type: 'select' as const,
          options: [
            { label: 'Left', value: 'left' },
            { label: 'Center', value: 'center' },
            { label: 'Right', value: 'right' },
            { label: 'Justify', value: 'justify' }
          ]
        }
      },
      defaultProps: {
        text: 'Heading',
        level: 1,
        color: '#333',
        align: 'left' as const
      },
      render: Heading
    },
    Text: {
      fields: {
        text: { type: 'textarea' as const },
        size: { 
          type: 'select' as const, 
          options: [
            { label: 'Small (14px)', value: '14px' },
            { label: 'Medium (16px)', value: '16px' },
            { label: 'Large (18px)', value: '18px' }
          ]
        },
        color: { type: 'text' as const },
        align: {
          type: 'select' as const,
          options: [
            { label: 'Left', value: 'left' },
            { label: 'Center', value: 'center' },
            { label: 'Right', value: 'right' },
            { label: 'Justify', value: 'justify' }
          ]
        }
      },
      defaultProps: {
        text: 'This is some sample text. You can edit this content using the Puck editor!',
        size: '16px',
        color: '#555',
        align: 'left' as const
      },
      render: Text
    },
    Button: {
      fields: {
        text: { type: 'text' as const },
        variant: { 
          type: 'select' as const, 
          options: [
            { label: 'Primary', value: 'primary' },
            { label: 'Secondary', value: 'secondary' },
            { label: 'Success', value: 'success' },
            { label: 'Danger', value: 'danger' }
          ]
        },
        size: { 
          type: 'select' as const, 
          options: [
            { label: 'Small', value: 'small' },
            { label: 'Medium', value: 'medium' },
            { label: 'Large', value: 'large' }
          ]
        }
      },
      defaultProps: {
        text: 'Click me',
        variant: 'primary' as const,
        size: 'medium' as const
      },
      render: Button
    },
    Card: {
      fields: {
        title: { type: 'text' as const },
        description: { type: 'textarea' as const },
        backgroundColor: { type: 'text' as const }
      },
      defaultProps: {
        title: 'Card Title',
        description: 'This is a card component with a title and description. You can customize the background color and content.',
        backgroundColor: '#fff'
      },
      render: Card
    },
    List: {
      fields: {
        items: { type: 'textarea' as const },
        type: { 
          type: 'select' as const, 
          options: [
            { label: 'Unordered List', value: 'ul' },
            { label: 'Ordered List', value: 'ol' }
          ]
        }
      },
      defaultProps: {
        items: 'First item\nSecond item\nThird item',
        type: 'ul' as const
      },
      render: List
    },
    Divider: {
      fields: {
        color: { type: 'text' as const },
        thickness: { 
          type: 'select' as const, 
          options: [
            { label: 'Thin (1px)', value: '1px' },
            { label: 'Medium (2px)', value: '2px' },
            { label: 'Thick (3px)', value: '3px' }
          ]
        }
      },
      defaultProps: {
        color: '#ddd',
        thickness: '1px'
      },
      render: Divider
    },
    Spacer: {
      fields: {
        height: { 
          type: 'select' as const, 
          options: [
            { label: 'Small (10px)', value: '10px' },
            { label: 'Medium (20px)', value: '20px' },
            { label: 'Large (40px)', value: '40px' },
            { label: 'Extra Large (60px)', value: '60px' }
          ]
        }
      },
      defaultProps: {
        height: '20px'
      },
      render: Spacer
    },
    Container: {
      fields: {
        backgroundColor: { type: 'text' as const },
        padding: { 
          type: 'select' as const, 
          options: [
            { label: 'Small (10px)', value: '10px' },
            { label: 'Medium (20px)', value: '20px' },
            { label: 'Large (30px)', value: '30px' },
            { label: 'Extra Large (40px)', value: '40px' }
          ]
        },
        layout: {
          type: 'select' as const,
          options: [
            { label: 'Vertical', value: 'vertical' },
            { label: 'Horizontal', value: 'horizontal' },
            { label: 'Grid', value: 'grid' },
            { label: 'Centered', value: 'centered' }
          ]
        },
        gap: {
          type: 'select' as const,
          options: [
            { label: 'Small (8px)', value: '8px' },
            { label: 'Medium (16px)', value: '16px' },
            { label: 'Large (24px)', value: '24px' },
            { label: 'Extra Large (32px)', value: '32px' }
          ]
        }
      },
      defaultProps: {
        backgroundColor: 'transparent',
        padding: '20px',
        layout: 'vertical' as const,
        gap: '16px'
      },
      render: Container,
      acceptsChildren: true
    },
    FlexContainer: {
      fields: {
        direction: {
          type: 'select' as const,
          options: [
            { label: 'Row', value: 'row' },
            { label: 'Column', value: 'column' },
            { label: 'Row Reverse', value: 'row-reverse' },
            { label: 'Column Reverse', value: 'column-reverse' }
          ]
        },
        justify: {
          type: 'select' as const,
          options: [
            { label: 'Flex Start', value: 'flex-start' },
            { label: 'Center', value: 'center' },
            { label: 'Flex End', value: 'flex-end' },
            { label: 'Space Between', value: 'space-between' },
            { label: 'Space Around', value: 'space-around' },
            { label: 'Space Evenly', value: 'space-evenly' }
          ]
        },
        align: {
          type: 'select' as const,
          options: [
            { label: 'Stretch', value: 'stretch' },
            { label: 'Flex Start', value: 'flex-start' },
            { label: 'Center', value: 'center' },
            { label: 'Flex End', value: 'flex-end' },
            { label: 'Baseline', value: 'baseline' }
          ]
        },
        gap: {
          type: 'select' as const,
          options: [
            { label: 'Small (8px)', value: '8px' },
            { label: 'Medium (16px)', value: '16px' },
            { label: 'Large (24px)', value: '24px' },
            { label: 'Extra Large (32px)', value: '32px' }
          ]
        },
        wrap: {
          type: 'select' as const,
          options: [
            { label: 'No Wrap', value: 'nowrap' },
            { label: 'Wrap', value: 'wrap' },
            { label: 'Wrap Reverse', value: 'wrap-reverse' }
          ]
        }
      },
      defaultProps: {
        direction: 'row' as const,
        justify: 'flex-start' as const,
        align: 'stretch' as const,
        gap: '16px',
        wrap: 'nowrap' as const
      },
      render: FlexContainer,
      acceptsChildren: true
    },
    
    GridContainer: {
      fields: {
        columns: {
          type: 'select' as const,
          options: [
            { label: '1 Column', value: 1 },
            { label: '2 Columns', value: 2 },
            { label: '3 Columns', value: 3 },
            { label: '4 Columns', value: 4 },
            { label: '5 Columns', value: 5 },
            { label: '6 Columns', value: 6 }
          ]
        },
        gap: {
          type: 'select' as const,
          options: [
            { label: 'Small (8px)', value: '8px' },
            { label: 'Medium (16px)', value: '16px' },
            { label: 'Large (24px)', value: '24px' },
            { label: 'Extra Large (32px)', value: '32px' }
          ]
        },
        rowGap: {
          type: 'select' as const,
          options: [
            { label: 'Small (8px)', value: '8px' },
            { label: 'Medium (16px)', value: '16px' },
            { label: 'Large (24px)', value: '24px' },
            { label: 'Extra Large (32px)', value: '32px' }
          ]
        }
      },
      defaultProps: {
        columns: 2,
        gap: '16px',
        rowGap: '16px'
      },
      render: GridContainer,
      zones: {
        children: ['Text', 'Button', 'Heading', 'Card'], // ✅ move allowed components here
      },
    },
    SimpleContainer: {
      fields: {
        backgroundColor: { type: 'text' as const },
        padding: { 
          type: 'select' as const, 
          options: [
            { label: 'Small (10px)', value: '10px' },
            { label: 'Medium (20px)', value: '20px' },
            { label: 'Large (30px)', value: '30px' }
          ]
        }
      },
      defaultProps: {
        backgroundColor: '#f0f8ff',
        padding: '20px'
      },
      render: SimpleContainer,
      acceptsChildren: true
    },
    PositionedElement: {
      fields: {
        position: {
          type: 'select' as const,
          options: [
            { label: 'Static', value: 'static' },
            { label: 'Relative', value: 'relative' },
            { label: 'Absolute', value: 'absolute' },
            { label: 'Fixed', value: 'fixed' },
            { label: 'Sticky', value: 'sticky' }
          ]
        },
        top: { type: 'text' as const },
        left: { type: 'text' as const },
        right: { type: 'text' as const },
        bottom: { type: 'text' as const },
        zIndex: { type: 'text' as const }
      },
      defaultProps: {
        position: 'static' as const,
        top: 'auto',
        left: 'auto',
        right: 'auto',
        bottom: 'auto',
        zIndex: 'auto'
      },
      render: PositionedElement,
      acceptsChildren: true
    },
    HeroSection: {
      fields: {
        title: { type: 'text' as const },
        subtitle: { type: 'textarea' as const },
        buttonText: { type: 'text' as const },
        buttonLink: { type: 'text' as const },
        backgroundColor: { type: 'text' as const },
        textColor: { 
          type: 'select' as const,
          options: [
            { label: 'White', value: 'white' },
            { label: 'Black', value: 'black' },
            { label: 'Blue', value: '#007bff' },
            { label: 'Green', value: '#28a745' }
          ]
        },
        backgroundImage: { type: 'text' as const },
        height: { 
          type: 'select' as const,
          options: [
            { label: 'Small (300px)', value: '300px' },
            { label: 'Medium (400px)', value: '400px' },
            { label: 'Large (500px)', value: '500px' },
            { label: 'Extra Large (600px)', value: '600px' }
          ]
        },
        alignment: {
          type: 'select' as const,
          options: [
            { label: 'Left', value: 'left' },
            { label: 'Center', value: 'center' },
            { label: 'Right', value: 'right' }
          ]
        }
      },
      defaultProps: {
        title: 'Welcome to Our Amazing Product',
        subtitle: 'Discover the future of web development with our innovative solutions and cutting-edge technology.',
        buttonText: 'Get Started',
        buttonLink: '#',
        backgroundColor: '#007bff',
        textColor: 'white' as const,
        backgroundImage: '',
        height: '400px' as const,
        alignment: 'center' as const
      },
      render: HeroSection
    },
    Slider: {
      fields: {
        slides: { 
          type: 'textarea' as const,
          label: 'Slide Content (one per line)'
        },
        autoplay: { 
          type: 'radio' as const,
          options: [
            { label: 'Yes', value: true },
            { label: 'No', value: false }
          ]
        },
        autoplaySpeed: { 
          type: 'select' as const,
          options: [
            { label: 'Fast (2s)', value: 2000 },
            { label: 'Normal (3s)', value: 3000 },
            { label: 'Slow (5s)', value: 5000 },
            { label: 'Very Slow (8s)', value: 8000 }
          ]
        },
        showDots: { 
          type: 'radio' as const,
          options: [
            { label: 'Yes', value: true },
            { label: 'No', value: false }
          ]
        },
        showArrows: { 
          type: 'radio' as const,
          options: [
            { label: 'Yes', value: true },
            { label: 'No', value: false }
          ]
        },
        height: { 
          type: 'select' as const,
          options: [
            { label: 'Small (300px)', value: '300px' },
            { label: 'Medium (400px)', value: '400px' },
            { label: 'Large (500px)', value: '500px' },
            { label: 'Extra Large (600px)', value: '600px' }
          ]
        },
        backgroundColor: { 
          type: 'select' as const,
          options: [
            { label: 'Light Gray', value: '#f8f9fa' },
            { label: 'Blue', value: '#007bff' },
            { label: 'Green', value: '#28a745' },
            { label: 'Purple', value: '#6f42c1' },
            { label: 'Orange', value: '#fd7e14' }
          ]
        }
      },
      defaultProps: {
        slides: 'Welcome to Slide 1\nThis is Slide 2\nAnd here is Slide 3',
        autoplay: true,
        autoplaySpeed: 3000,
        showDots: true,
        showArrows: true,
        height: '400px' as const,
        backgroundColor: '#f8f9fa' as const
      },
      render: Slider
    },
    Image: {
      fields: {
        src: { 
          type: 'text' as const,
          label: 'Image URL'
        },
        alt: { 
          type: 'text' as const,
          label: 'Alt Text (for accessibility)'
        },
        width: { 
          type: 'select' as const,
          options: [
            { label: 'Auto', value: 'auto' },
            { label: '100%', value: '100%' },
            { label: '75%', value: '75%' },
            { label: '50%', value: '50%' },
            { label: '25%', value: '25%' },
            { label: '300px', value: '300px' },
            { label: '400px', value: '400px' },
            { label: '500px', value: '500px' }
          ]
        },
        height: { 
          type: 'select' as const,
          options: [
            { label: 'Auto', value: 'auto' },
            { label: '200px', value: '200px' },
            { label: '300px', value: '300px' },
            { label: '400px', value: '400px' },
            { label: '500px', value: '500px' }
          ]
        },
        borderRadius: { 
          type: 'select' as const,
          options: [
            { label: 'None', value: '0px' },
            { label: 'Small (4px)', value: '4px' },
            { label: 'Medium (8px)', value: '8px' },
            { label: 'Large (16px)', value: '16px' },
            { label: 'Round', value: '50%' }
          ]
        },
        objectFit: { 
          type: 'select' as const,
          options: [
            { label: 'Cover (fill)', value: 'cover' },
            { label: 'Contain (fit)', value: 'contain' },
            { label: 'Fill (stretch)', value: 'fill' },
            { label: 'Scale Down', value: 'scale-down' },
            { label: 'None', value: 'none' }
          ]
        },
        alignment: { 
          type: 'select' as const,
          options: [
            { label: 'Left', value: 'left' },
            { label: 'Center', value: 'center' },
            { label: 'Right', value: 'right' }
          ]
        },
        showCaption: { 
          type: 'radio' as const,
          options: [
            { label: 'Yes', value: true },
            { label: 'No', value: false }
          ]
        },
        caption: { 
          type: 'text' as const,
          label: 'Image Caption'
        }
      },
      defaultProps: {
        src: 'https://picsum.photos/400/300',
        alt: 'Image description',
        width: '100%' as const,
        height: 'auto' as const,
        borderRadius: '8px' as const,
        objectFit: 'cover' as const,
        alignment: 'center' as const,
        showCaption: false,
        caption: ''
      },
      render: Image
    }
  }
}

const initialData = {
  content: [

  ],
  root: { props: {} }
}

const App: React.FC = () => {
  const [currentData, setCurrentData] = React.useState(initialData)
  const [showPreview, setShowPreview] = React.useState(false)
  const [currentPage, setCurrentPage] = React.useState('home')
  const [currentPageName, setCurrentPageName] = React.useState('Home Page')
  const [pages, setPages] = React.useState<Array<{id: string, name: string, filename: string, lastModified: string}>>([])
  const [showPageManager, setShowPageManager] = React.useState(false)
  const [showPageNameDialog, setShowPageNameDialog] = React.useState(false)

  // Function to load all pages from server
  const loadPages = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/pages')
      const result = await response.json()
      
      if (result.success) {
        const pageList = result.pages.map((page: any) => {
          // Try to extract page name from filename or use a default
          let pageName = page.filename.replace('.json', '')
          if (pageName.startsWith('page-data-')) {
            pageName = pageName.replace('page-data-', '').replace(/-/g, ' ')
          }
          return {
            id: page.filename.replace('.json', ''),
            name: pageName,
            filename: page.filename,
            lastModified: page.modified
          }
        })
        setPages(pageList)
      }
    } catch (error) {
      console.error('Error loading pages:', error)
    }
  }

  // Function to load a specific page
  const loadPage = async (filename: string) => {
    try {
      const response = await fetch(`http://localhost:3001/api/pages/${filename}`)
      const result = await response.json()
      
      if (result.success) {
        setCurrentData(result.data)
        const pageId = filename.replace('.json', '')
        setCurrentPage(pageId)
        
        // Find the page name from the pages list
        const page = pages.find(p => p.filename === filename)
        if (page) {
          setCurrentPageName(page.name)
        } else {
          setCurrentPageName(pageId.replace('page-data-', '').replace(/-/g, ' '))
        }
        
        setShowPageManager(false)
      }
    } catch (error) {
      console.error('Error loading page:', error)
    }
  }

  // Function to create a new page
  const createNewPage = () => {
    setCurrentData(initialData)
    setCurrentPage('new-page')
    setCurrentPageName('New Page')
    setShowPageManager(false)
    setShowPageNameDialog(true)
  }

  // Function to confirm new page creation
  const confirmNewPage = (pageName: string) => {
    setCurrentPageName(pageName)
    setShowPageNameDialog(false)
  }

  // Function to handle publish and save JSON data directly to project
  const handlePublish = async (data: any) => {
    try {
      const timestamp = new Date().toISOString().split('T')[0]
      
      // Create a unique filename based on page name
      let filename: string
      if (currentPage === 'new-page') {
        // For new pages, create filename from page name
        const sanitizedName = currentPageName.toLowerCase().replace(/[^a-z0-9]/g, '-')
        filename = `${sanitizedName}-${timestamp}.json`
      } else {
        // For existing pages, keep the same filename
        filename = `${currentPage}.json`
      }
      
      // Save to localStorage for backup
      localStorage.setItem('puck-page-data', JSON.stringify(data, null, 2))
      localStorage.setItem('puck-page-timestamp', timestamp)
      
      // Try to save directly to project directory via API
      try {
        const response = await fetch('http://localhost:3001/api/save-page', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            data: data,
            filename: filename
          })
        })
        
        const result = await response.json()
        
        if (result.success) {
          // Reload pages list after saving
          await loadPages()
          
          // Update current page ID after saving
          if (currentPage === 'new-page') {
            const newPageId = filename.replace('.json', '')
            setCurrentPage(newPageId)
          }
          
          alert(`✅ Page "${currentPageName}" saved successfully!
          
📁 File saved to: ${result.path}
📊 Components: ${result.components}
📝 Filename: ${result.filename}

The data has been saved directly to your project directory!`)
          
          console.log('=== PUCK PAGE DATA SAVED ===')
          console.log('✅ Saved directly to project directory')
          console.log('📁 Path:', result.path)
          console.log('📊 Components:', result.components)
          console.log('============================')
        } else {
          throw new Error(result.message || 'Failed to save via API')
        }
        
      } catch (apiError) {
        console.warn('API save failed, falling back to download method:', apiError)
        
        // Fallback: Create downloadable file
        const jsonData = JSON.stringify(data, null, 2)
        const blob = new Blob([jsonData], { type: 'application/json' })
        const link = document.createElement('a')
        link.download = filename
        link.href = window.URL.createObjectURL(blob)
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        
        alert(`⚠️ API server not running - File downloaded instead
        
📁 Please start the server: npm run server
📄 File downloaded: ${filename}
📂 Move to: src/data/pages/${filename}`)
      }
      
    } catch (error) {
      console.error('Error saving page data:', error)
      alert('Error saving page data. Please try again.')
    }
  }

  // Function to handle data changes
  const handleDataChange = (data: any) => {
    setCurrentData(data)
  }

  // Function to toggle preview mode
  const togglePreview = () => {
    setShowPreview(!showPreview)
  }

  // Load pages on component mount
  React.useEffect(() => {
    loadPages()
  }, [])

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Controls */}
      <div style={{ 
        padding: '10px 20px', 
        backgroundColor: '#f8f9fa', 
        borderBottom: '1px solid #dee2e6',
        display: 'flex',
        gap: '10px',
        alignItems: 'center',
        flexWrap: 'wrap'
      }}>
        <button
          onClick={() => setShowPageManager(!showPageManager)}
          style={{
            padding: '8px 16px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '14px'
          }}
        >
          📄 Pages ({pages.length})
        </button>
        <button
          onClick={createNewPage}
          style={{
            padding: '8px 16px',
            backgroundColor: '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '14px'
          }}
        >
          ➕ New Page
        </button>
        <button
          onClick={togglePreview}
          style={{
            padding: '8px 16px',
            backgroundColor: showPreview ? '#dc3545' : '#6c757d',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '14px'
          }}
        >
          {showPreview ? '✏️ Edit Mode' : '👁️ Preview'}
        </button>
        <div style={{ marginLeft: 'auto', fontSize: '12px', color: '#6c757d' }}>
          {currentData.content?.length || 0} components • Page: {currentPageName}
        </div>
      </div>

      {/* Page Manager */}
      {showPageManager && (
        <div style={{
          padding: '20px',
          backgroundColor: '#fff',
          borderBottom: '1px solid #dee2e6',
          maxHeight: '300px',
          overflow: 'auto'
        }}>
          <h3 style={{ margin: '0 0 15px 0', color: '#333' }}>📄 Page Manager</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '15px' }}>
            {pages.map((page) => (
              <div
                key={page.id}
                style={{
                  padding: '15px',
                  border: '1px solid #dee2e6',
                  borderRadius: '8px',
                  backgroundColor: currentPage === page.id ? '#e3f2fd' : '#f8f9fa',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
                onClick={() => loadPage(page.filename)}
              >
                <h4 style={{ margin: '0 0 8px 0', color: '#333', fontSize: '16px' }}>
                  {page.name}
                </h4>
                <p style={{ margin: '0 0 8px 0', color: '#666', fontSize: '12px' }}>
                  Modified: {new Date(page.lastModified).toLocaleDateString()}
                </p>
                <p style={{ margin: '0', color: '#888', fontSize: '11px' }}>
                  {page.filename}
                </p>
              </div>
            ))}
            {pages.length === 0 && (
              <div style={{
                gridColumn: '1 / -1',
                textAlign: 'center',
                padding: '40px',
                color: '#666'
              }}>
                <p>No pages created yet. Click "New Page" to get started!</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Page Name Dialog */}
      {showPageNameDialog && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '30px',
            borderRadius: '8px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
            minWidth: '400px',
            maxWidth: '500px'
          }}>
            <h3 style={{ margin: '0 0 20px 0', color: '#333' }}>📝 Name Your New Page</h3>
            <p style={{ margin: '0 0 15px 0', color: '#666' }}>
              Give your page a descriptive name (e.g., "Home", "About Us", "Contact")
            </p>
            <input
              type="text"
              value={currentPageName}
              onChange={(e) => setCurrentPageName(e.target.value)}
              placeholder="Enter page name..."
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '16px',
                marginBottom: '20px'
              }}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  confirmNewPage(currentPageName)
                }
              }}
              autoFocus
            />
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
              <button
                onClick={() => setShowPageNameDialog(false)}
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#6c757d',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
              <button
                onClick={() => confirmNewPage(currentPageName)}
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#007bff',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Create Page
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div style={{ flex: 1, overflow: 'hidden' }}>
        {showPreview ? (
          <div style={{ 
            height: '100%', 
            overflow: 'auto', 
            padding: '20px',
            backgroundColor: 'white'
          }}>
            <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
              {currentData.content?.length === 0 ? (
                <div style={{ 
                  textAlign: 'center', 
                  padding: '60px 20px', 
                  color: '#6c757d',
                  fontSize: '18px'
                }}>
                  <h2>No content to preview</h2>
                  <p>Switch back to edit mode to add components</p>
                </div>
              ) : (
                currentData.content?.map((item: any, index: number) => {
                  const Component = config.components[item.type as keyof typeof config.components]?.render
                  return Component ? (
                    <div key={index}>
                      <Component {...item.props} />
                    </div>
                  ) : null
                })
              )}
            </div>
          </div>
        ) : (
          <Puck 
            config={config as any} 
            data={currentData}
            onPublish={handlePublish}
            onChange={handleDataChange}
          />
        )}
      </div>
    </div>
  )
}

export default App
