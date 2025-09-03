import React from 'react'
import { Puck } from '@measured/puck'
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

// Component implementations
const Heading: React.FC<HeadingProps> = ({ text, level = 1, color = '#333', align = 'left' }) => {
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

const Text: React.FC<TextProps> = ({ text, size = '16px', color = '#555', align = 'left' }) => {
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

const Button: React.FC<ButtonProps> = ({ text, variant = 'primary', size = 'medium' }) => {
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

const Card: React.FC<CardProps> = ({ title, description, backgroundColor = '#fff' }) => {
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

const List: React.FC<ListProps> = ({ items, type = 'ul' }) => {
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

const Divider: React.FC<DividerProps> = ({ color = '#ddd', thickness = '1px' }) => {
  return (
    <hr style={{
      border: 'none',
      borderTop: `${thickness} solid ${color}`,
      margin: '24px 0'
    }} />
  )
}

const Spacer: React.FC<SpacerProps> = ({ height = '20px' }) => {
  return (
    <div style={{
      height: height,
      width: '100%'
    }} />
  )
}

// Container Component with flexible positioning
const Container: React.FC<ContainerProps> = ({ children, backgroundColor = 'transparent', padding = '20px', layout = 'vertical', gap = '16px' }) => {
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

const FlexContainer: React.FC<FlexContainerProps> = ({ children, direction = 'row', justify = 'flex-start', align = 'stretch', gap = '16px', wrap = 'nowrap' }) => {
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
const GridContainer: React.FC<GridContainerProps> = ({ children, columns = 2, gap = '16px', rowGap = '16px' }) => {
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
      {children}
    </div>
  )
}

// Simple Container Component for testing
const SimpleContainer: React.FC<SimpleContainerProps> = ({ children, backgroundColor = '#f0f8ff', padding = '20px' }) => {
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
const PositionedElement: React.FC<PositionedElementProps> = ({ children, position = 'static', top = 'auto', left = 'auto', right = 'auto', bottom = 'auto', zIndex = 'auto' }) => {
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
      acceptsChildren: true
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
    }
  }
}

const initialData = {
  content: [
    
  ],
  root: { props: {} }
}

const App: React.FC = () => {
  return (
    <div style={{ height: '100vh' }}>
      <Puck config={config} data={initialData} />
    </div>
  )
}

export default App
