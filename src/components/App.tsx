import React, { useState } from 'react'
import { Puck } from '@measured/puck'
import '@measured/puck/puck.css'

import { config } from '../config/puckConfig'
import { usePageManagement } from '../hooks/usePageManagement'
import { usePublish } from '../hooks/usePublish'
import { PageManager, PageNameDialog } from './page'
import Preview from './Preview'

const App: React.FC = () => {
  const [showPreview, setShowPreview] = useState(false)
  
  const {
    currentData,
    setCurrentData,
    currentPage,
    setCurrentPage,
    currentPageName,
    setCurrentPageName,
    pages,
    showPageManager,
    setShowPageManager,
    showPageNameDialog,
    setShowPageNameDialog,
    loadPages,
    loadPage,
    createNewPage,
    confirmNewPage
  } = usePageManagement()

  const { handlePublish, handleDataChange } = usePublish(
    currentData,
    setCurrentData,
    currentPage,
    currentPageName,
    setCurrentPage,
    loadPages
  )

  // Function to toggle preview mode
  const togglePreview = () => {
    setShowPreview(!showPreview)
  }

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Controls */}
      <div style={{ 
        padding: '10px 20px', 
        backgroundColor: '#f8f9fa', 
        borderBottom: '1px solid #dee2e6',
        display: 'flex',
        gap: '10px',
        alignItems: 'center',
        flexWrap: 'wrap'
      }}>
        <button
          onClick={() => setShowPageManager(!showPageManager)}
          style={{
            padding: '8px 16px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '14px'
          }}
        >
          📄 Pages ({pages.length})
        </button>
        <button
          onClick={createNewPage}
          style={{
            padding: '8px 16px',
            backgroundColor: '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '14px'
          }}
        >
          ➕ New Page
        </button>
        <button
          onClick={togglePreview}
          style={{
            padding: '8px 16px',
            backgroundColor: showPreview ? '#dc3545' : '#6c757d',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '14px'
          }}
        >
          {showPreview ? '✏️ Edit Mode' : '👁️ Preview'}
        </button>
        <div style={{ marginLeft: 'auto', fontSize: '12px', color: '#6c757d' }}>
          {currentData.content?.length || 0} components • Page: {currentPageName}
        </div>
      </div>

      {/* Page Manager */}
      <PageManager
        pages={pages}
        currentPage={currentPage}
        onPageSelect={loadPage}
        isVisible={showPageManager}
      />

      {/* Page Name Dialog */}
      <PageNameDialog
        isVisible={showPageNameDialog}
        pageName={currentPageName}
        onPageNameChange={setCurrentPageName}
        onConfirm={confirmNewPage}
        onCancel={() => setShowPageNameDialog(false)}
      />

      {/* Main Content */}
      <div style={{ flex: 1, overflow: 'hidden' }}>
        {showPreview ? (
          <Preview data={currentData} />
        ) : (
          <Puck 
            config={config as any} 
            data={currentData}
            onPublish={handlePublish}
            onChange={handleDataChange}
          />
        )}
      </div>
    </div>
  )
}

export default App
