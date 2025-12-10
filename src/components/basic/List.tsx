import React from 'react'
import { ListProps } from '../../types'

const List = ({ items, type = 'ul', textColor }: ListProps) => {
  const listItems = items.split('\n').filter(item => item.trim())
  
  if (type === 'ol') {
    return (
      <ol className="my-4 pl-5">
        {listItems.map((item, index) => (
          <li key={index} style={{ color: textColor || '#555' }} className="my-2">
            {item.trim()}
          </li>
        ))}
      </ol>
    )
  }
  
  return (
    <ul className="my-4 pl-5">
      {listItems.map((item, index) => (
        <li key={index} style={{ color: textColor || '#555' }} className="my-2">
          {item.trim()}
        </li>
      ))}
    </ul>
  )
}

export default List
