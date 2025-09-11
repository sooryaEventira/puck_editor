import React from 'react'
import { PageData } from '../types'
import { config } from '../config/puckConfig'

interface PreviewProps {
  data: PageData
}

const Preview: React.FC<PreviewProps> = ({ data }) => {
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
            const Component = config.components[item.type as keyof typeof config.components]?.render
            return Component ? (
              <div key={index}>
                <Component {...item.props} />
              </div>
            ) : null
          })
        )}
      </div>
    </div>
  )
}

export default Preview