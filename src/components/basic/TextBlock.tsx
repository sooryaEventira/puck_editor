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
      style={{
        padding: "16px",
        border: "1px solid #ccc",
        margin: "8px",
        backgroundColor: "#f9f9f9",
        minHeight: "50px",
        borderRadius: "4px",
        transition: "all 0.2s ease"
      }}
    >
      <p style={{ 
        margin: 0, 
        lineHeight: "1.5",
        color: "#333"
      }}>
        {text || "Enter text here"}
      </p>
    </div>
  )
}

export default TextBlock
