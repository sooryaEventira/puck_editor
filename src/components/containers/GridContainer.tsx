import { DropZone } from "@measured/puck"
import { GridContainerProps } from '../../types'
import { config } from '../../config/puckConfig'

const GridContainer = ({ columns = 2, gap = '16px', rowGap = '16px', puck, ...props }: GridContainerProps & { puck?: any; [key: string]: any }) => {
  // Create array of column indices
  const columnIndices = Array.from({ length: columns }, (_, i) => i)
  
  // Check if we have zone content in props (preview mode)
  const hasZoneContent = Object.keys(props).some(key => key.startsWith('column-') && Array.isArray(props[key]))
  
  return (
    <div 
      style={{
        gridTemplateColumns: `repeat(${columns}, 1fr)`,
        gap: gap,
        rowGap: rowGap
      }}
      className="grid p-4 my-4 bg-gray-50 rounded-lg border border-gray-200 min-h-[100px]"
    >
      {columnIndices.map((index) => {
        const zoneName = `column-${index}`
        
        if (hasZoneContent) {
          // In preview mode, render zone content if available
          const zoneContent = props[zoneName] || []
          return (
            <div key={index} className="min-h-[50px]">
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
                <div className="min-h-[50px] flex items-center justify-center text-gray-500 text-sm border border-dashed border-gray-300 rounded">
                  Column {index + 1}
                </div>
              )}
            </div>
          )
        } else {
          // In editor mode, use DropZone
          return (
            <div key={index} className="min-h-[50px]">
              <DropZone zone={zoneName} />
            </div>
          )
        }
      })}
    </div>
  )
}

export default GridContainer
