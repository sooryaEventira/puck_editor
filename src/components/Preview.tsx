import React from 'react'
import { PageData } from '../types'
import { config } from '../config/puckConfig'

interface PreviewProps {
  data: PageData
}

const Preview: React.FC<PreviewProps> = ({ data }) => {
  console.log('Preview - data:', data)
  console.log('Preview - data.content:', data.content)
  console.log('Preview - data.content?.length:', data.content?.length)
  
  return (
    <div style={{ 
      height: '100%', 
      overflow: 'auto', 
      padding: '20px',
      backgroundColor: 'white'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {data.content?.length === 0 ? (
          <div style={{ 
            textAlign: 'center', 
            padding: '60px 20px', 
            color: '#6c757d',
            fontSize: '18px'
          }}>
            <h2>No content to preview</h2>
            <p>Switch back to edit mode to add components</p>
          </div>
        ) : (
          data.content?.map((item: any, index: number) => {
            console.log('Preview - rendering item:', item)
            const Component = config.components[item.type as keyof typeof config.components]?.render
            console.log('Preview - Component found:', Component)
            return Component ? (
              <div key={index}>
                <Component {...item.props} />
              </div>
            ) : (
              <div key={index} style={{ padding: '10px', border: '1px solid red', margin: '10px 0' }}>
                <p>Component not found: {item.type}</p>
                <pre>{JSON.stringify(item, null, 2)}</pre>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}

export default Preview