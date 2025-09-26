import React from 'react'
import { RadioButtonProps } from '../../types'

const RadioButton = ({ label, value, selected, onChange }: RadioButtonProps) => {
  const handleClick = () => {
    if (onChange) {
      onChange(value)
    }
  }

  return (
    <div
      role="radio"
      aria-checked={selected}
      aria-label={label}
      onClick={handleClick}
      className="flex items-center cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded p-1"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          handleClick()
        }
      }}
    >
      {/* Radio circle */}
      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
        selected 
          ? 'border-blue-500 bg-blue-50' 
          : 'border-gray-400 hover:border-gray-500'
      }`}>
        {selected && (
          <div className="w-2.5 h-2.5 bg-blue-500 rounded-full" />
        )}
      </div>
      
      {/* Label */}
      <span className="ml-2 text-sm text-gray-700 select-none">
        {label}
      </span>
    </div>
  )
}

export default RadioButton
