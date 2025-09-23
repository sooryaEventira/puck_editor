import { DropZone } from "@measured/puck"
import { GridContainerProps } from '../../types'
import { config } from '../../config/puckConfig'

const GridContainer = ({ columns = 2, gap = '16px', rowGap = '16px', puck, ...props }: GridContainerProps & { puck?: any; [key: string]: any }) => {
  // Create array of column indices
  const columnIndices = Array.from({ length: columns }, (_, i) => i)
  
  // Debug logging
  console.log('GridContainer - puck:', !!puck)
  console.log('GridContainer - props:', props)
  console.log('GridContainer - props keys:', Object.keys(props))
  
  // Check if we're in preview mode (when puck is not available or zone content is passed)
  const isPreviewMode = !puck || Object.keys(props).some(key => key.startsWith('column-'))
  console.log('GridContainer - isPreviewMode:', isPreviewMode)
  
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
      {columnIndices.map((index) => {
        const zoneName = `column-${index}`
        
        if (isPreviewMode) {
          // In preview mode, render zone content if available
          const zoneContent = props[zoneName] || []
          return (
            <div key={index} style={{ minHeight: '50px' }}>
              {zoneContent.length > 0 ? (
                zoneContent.map((item: any, itemIndex: number) => {
                  const Component = config.components[item.type as keyof typeof config.components]?.render
                  return Component ? (
                    <div key={itemIndex}>
                      <Component {...item.props} />
                    </div>
                  ) : null
                })
              ) : (
                <div style={{ 
                  minHeight: '50px', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  color: '#6b7280',
                  fontSize: '14px',
                  border: '1px dashed #d1d5db',
                  borderRadius: '4px'
                }}>
                  Column {index + 1}
                </div>
              )}
            </div>
          )
        } else {
          // In editor mode, use DropZone
          return (
            <div key={index} style={{ minHeight: '50px' }}>
              <DropZone zone={zoneName} />
            </div>
          )
        }
      })}
    </div>
  )
}

export default GridContainer
