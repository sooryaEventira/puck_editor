import React from 'react'
import { ListProps } from '../../types'

const List = ({ items, type = 'ul', textColor }: ListProps) => {
  const listItems = items.split('\n').filter(item => item.trim())
  
  if (type === 'ol') {
    return (
      <ol style={{ margin: '16px 0', paddingLeft: '20px' }}>
        {listItems.map((item, index) => (
          <li key={index} style={{ margin: '8px 0', color: textColor || '#555' }}>
            {item.trim()}
          </li>
        ))}
      </ol>
    )
  }
  
  return (
    <ul style={{ margin: '16px 0', paddingLeft: '20px' }}>
      {listItems.map((item, index) => (
        <li key={index} style={{ margin: '8px 0', color: textColor || '#555' }}>
          {item.trim()}
        </li>
      ))}
    </ul>
  )
}

export default List
