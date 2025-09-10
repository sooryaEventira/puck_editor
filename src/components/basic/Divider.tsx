import React from 'react'
import { DividerProps } from '../../types'

const Divider = ({ color = '#ddd', thickness = '1px' }: DividerProps) => {
  return (
    <hr style={{
      border: 'none',
      borderTop: `${thickness} solid ${color}`,
      margin: '24px 0'
    }} />
  )
}

export default Divider
