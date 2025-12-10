import React from 'react'
import { SimpleContainerProps } from '../../types'

const SimpleContainer = ({ children, backgroundColor = '#f0f8ff', padding = '20px' }: SimpleContainerProps) => {
  return (
    <div 
      style={{
        backgroundColor: backgroundColor,
        padding: padding,
        border: '2px dashed #007bff'
      }}
      className="my-4 rounded-lg min-h-[100px]"
    >
      {children}
    </div>
  )
}

export default SimpleContainer
