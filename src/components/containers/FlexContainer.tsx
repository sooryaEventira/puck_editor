import React from 'react'
import { FlexContainerProps } from '../../types'

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

export default FlexContainer
