import React from 'react'
import { DividerProps } from '../../types'

const Divider = ({ color = '#ddd', thickness = '1px' }: DividerProps) => {
  return (
    <hr 
      style={{
        border: 'none',
        borderTop: `${thickness} solid ${color}`
      }}
      className="my-6"
    />
  )
}

export default Divider
