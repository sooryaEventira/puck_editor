import React from 'react'
import { SpacerProps } from '../../types'

const Spacer = ({ height = '20px' }: SpacerProps) => {
  return (
    <div style={{
      height: height,
      width: '100%'
    }} />
  )
}

export default Spacer
