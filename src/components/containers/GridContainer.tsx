import React from 'react'
import { DropZone } from "@measured/puck"
import { GridContainerProps } from '../../types'

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

export default GridContainer
