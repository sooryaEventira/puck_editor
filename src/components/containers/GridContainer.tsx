import { DropZone } from "@measured/puck"
import { GridContainerProps } from '../../types'

const GridContainer = ({ columns = 2, gap = '16px', rowGap = '16px', puck }: GridContainerProps & { puck?: any }) => {
  // Create array of column indices
  const columnIndices = Array.from({ length: columns }, (_, i) => i)
  
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
      {columnIndices.map((index) => (
        <div key={index} style={{ minHeight: '50px' }}>
          <DropZone zone={`column-${index}`} />
        </div>
      ))}
    </div>
  )
}

export default GridContainer
