import React from 'react'
import { PositionedElementProps } from '../../types'

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

export default PositionedElement
