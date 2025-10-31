import React, { useState, useEffect } from 'react'

import { usePageManagement } from '../hooks/usePageManagement'
import { usePublish } from '../hooks/usePublish'
import { useAppHandlers } from '../hooks/useAppHandlers'
import { PageManager, PageNameDialog, PageCreationModal } from './page'
import { GlobalNavbar } from './layout'
import { EventHubPage } from './eventhub'
import EditorView from './EditorView'
import { logger } from '../utils/logger'
import { setupPuckStyling } from '../utils/puckStyling'

const App: React.FC = () => {
  const [showPreview, setShowPreview] = useState(false)
  const [currentView, setCurrentView] = useState<'editor' | 'events'>('editor')
  const [puckUi, setPuckUi] = useState<any>(undefined)
  const [showLeftSidebar, setShowLeftSidebar] = useState(true)
  const [showRightSidebar, setShowRightSidebar] = useState(true)
  const [showPageCreationModal, setShowPageCreationModal] = useState(false)
  
  logger.debug('🔄 App component rendering, currentView:', currentView);
  
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

  // App event handlers
  const {
    handleCreateEvent,
    handleProfileClick,
    handleBackToEditor,
    handlePageCreationSelect,
    handleNavigateToEditor,
    handleAddComponent,
  } = useAppHandlers({
    setCurrentView,
    setCurrentData,
    setPuckUi,
    setShowPreview,
    createNewPage,
  })

  // Apply Puck styling when not in preview mode
  useEffect(() => {
    if (!showPreview) {
      return setupPuckStyling()
    }
  }, [showPreview])

  // Render Events Page (Event Hub)
  if (currentView === 'events') {
    logger.debug('📍 Rendering Event Hub Page');
    
    return (
      <EventHubPage
        eventName="Highly important conference of 2025"
        isDraft={true}
        onBackClick={handleBackToEditor}
        userAvatarUrl="" // Add user avatar URL here if available
      />
    )
  }

  // Render Editor Page
  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Global Navbar */}
      <GlobalNavbar 
        onCreateEvent={handleCreateEvent}
        onProfileClick={handleProfileClick}
      />
      
      {/* Controls */}
      {/* <div style={{ 
        padding: '10px 20px', 
        backgroundColor: '#f8f9fa', 
        borderBottom: '1px solid #dee2e6',
        display: 'flex',
        gap: '10px',
        alignItems: 'center',
        flexWrap: 'wrap',
        marginTop: '64px' // Account for fixed navbar height
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
      </div> */}

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

      {/* Page Creation Modal */}
      <PageCreationModal
        isVisible={showPageCreationModal}
        onClose={() => setShowPageCreationModal(false)}
        onSelect={handlePageCreationSelect}
      />

      {/* Main Content - Editor View */}
      <EditorView
        currentData={currentData}
        currentPage={currentPage}
        currentPageName={currentPageName}
        pages={pages}
        puckUi={puckUi}
        showPreview={showPreview}
        showLeftSidebar={showLeftSidebar}
        showRightSidebar={showRightSidebar}
        showPageManager={showPageManager}
        onPublish={handlePublish}
        onChange={handleDataChange}
        onDataChange={setCurrentData}
        onPageSelect={loadPage}
        onAddPage={() => setShowPageCreationModal(true)}
        onManagePages={() => setShowPageManager(!showPageManager)}
        onNavigateToEditor={handleNavigateToEditor}
        onAddComponent={handleAddComponent}
      />
    </div>
  )
}

export default App
