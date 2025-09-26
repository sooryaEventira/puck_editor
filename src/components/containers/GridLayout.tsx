import React from 'react'

interface GridLayoutProps {
  numberOfColumns: number
  column1?: any
  column2?: any
  column3?: any
  column4?: any
}

const GridLayout: React.FC<GridLayoutProps> = ({ 
  numberOfColumns, 
  column1: Column1, 
  column2: Column2, 
  column3: Column3, 
  column4: Column4 
}) => {
  const columns = [Column1, Column2, Column3, Column4].slice(0, numberOfColumns)
  
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${numberOfColumns}, 1fr)`,
        gap: "16px",
        padding: "16px",
        backgroundColor: "#f0f0f0",
        borderRadius: 8,
        minHeight: "200px",
      }}
    >
      {columns.map((Column, index) => (
        <Column key={index} />
      ))}
    </div>
  )
}

export default GridLayout
