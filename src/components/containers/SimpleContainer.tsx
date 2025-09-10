import React from 'react'
import { SimpleContainerProps } from '../../types'

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

export default SimpleContainer
