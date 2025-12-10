import React from 'react'
import { FlexContainerProps } from '../../types'

const FlexContainer = ({ children, direction = 'row', justify = 'flex-start', align = 'stretch', gap = '16px', wrap = 'nowrap' }: FlexContainerProps) => {
  const directionClass = direction === 'column' ? 'flex-col' : 'flex-row'
  const justifyClasses: Record<string, string> = {
    'flex-start': 'justify-start',
    'flex-end': 'justify-end',
    'center': 'justify-center',
    'space-between': 'justify-between',
    'space-around': 'justify-around',
    'space-evenly': 'justify-evenly'
  }
  const alignClasses: Record<string, string> = {
    'stretch': 'items-stretch',
    'flex-start': 'items-start',
    'flex-end': 'items-end',
    'center': 'items-center',
    'baseline': 'items-baseline'
  }
  const wrapClass = wrap === 'wrap' ? 'flex-wrap' : 'flex-nowrap'

  return (
    <div 
      style={{ gap }}
      className={`flex ${directionClass} ${justifyClasses[justify] || 'justify-start'} ${alignClasses[align] || 'items-stretch'} ${wrapClass} p-4 my-4 bg-gray-50 rounded-lg border border-gray-200`}
    >
      {children}
    </div>
  )
}

export default FlexContainer
