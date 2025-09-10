import React from 'react'
import { ContainerProps } from '../../types'

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

export default Container
