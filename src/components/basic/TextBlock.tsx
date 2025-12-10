import React from 'react'

interface TextBlockProps {
  text?: string
  puck?: {
    dragRef?: React.RefObject<HTMLDivElement>
  }
}

const TextBlock: React.FC<TextBlockProps> = ({ text, puck }) => {
  return (
    <div
      ref={puck?.dragRef}
      className="p-4 border border-gray-300 m-2 bg-gray-50 min-h-[50px] rounded transition-all duration-200"
    >
      <p className="m-0 leading-relaxed text-gray-800">
        {text || "Enter text here"}
      </p>
    </div>
  )
}

export default TextBlock
