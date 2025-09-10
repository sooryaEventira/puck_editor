import React from 'react'
import { Page } from '../../types'

interface PageManagerProps {
  pages: Page[]
  currentPage: string
  onPageSelect: (filename: string) => void
  isVisible: boolean
}

const PageManager: React.FC<PageManagerProps> = ({ 
  pages, 
  currentPage, 
  onPageSelect, 
  isVisible 
}) => {
  if (!isVisible) return null

  return (
    <div style={{
      padding: '20px',
      backgroundColor: '#fff',
      borderBottom: '1px solid #dee2e6',
      maxHeight: '300px',
      overflow: 'auto'
    }}>
      <h3 style={{ margin: '0 0 15px 0', color: '#333' }}>📄 Page Manager</h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '15px' }}>
        {pages.map((page) => (
          <div
            key={page.id}
            style={{
              padding: '15px',
              border: '1px solid #dee2e6',
              borderRadius: '8px',
              backgroundColor: currentPage === page.id ? '#e3f2fd' : '#f8f9fa',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
            onClick={() => onPageSelect(page.filename)}
          >
            <h4 style={{ margin: '0 0 8px 0', color: '#333', fontSize: '16px' }}>
              {page.name}
            </h4>
            <p style={{ margin: '0 0 8px 0', color: '#666', fontSize: '12px' }}>
              Modified: {new Date(page.lastModified).toLocaleDateString()}
            </p>
            <p style={{ margin: '0', color: '#888', fontSize: '11px' }}>
              {page.filename}
            </p>
          </div>
        ))}
        {pages.length === 0 && (
          <div style={{
            gridColumn: '1 / -1',
            textAlign: 'center',
            padding: '40px',
            color: '#666'
          }}>
            <p>No pages created yet. Click "New Page" to get started!</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default PageManager
