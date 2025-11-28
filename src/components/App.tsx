import React, { useState, useEffect } from 'react'

import { usePageManagement } from '../hooks/usePageManagement'
import { usePublish } from '../hooks/usePublish'
import { useAppHandlers } from '../hooks/useAppHandlers'
import { PageManager, PageNameDialog, PageCreationModal } from './page'
import { EventHubPage, EventHubNavbar, SchedulePage, CommunicationPage, ResourceManagementPage } from './eventhub'
import EditorView from './EditorView'
import { logger } from '../utils/logger'
import { setupPuckStyling } from '../utils/puckStyling'

const App: React.FC = () => {
  const [showPreview, setShowPreview] = useState(false)
  const [currentView, setCurrentView] = useState<'editor' | 'events' | 'schedule' | 'communication' | 'resource-management'>('editor')
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
    confirmNewPage,
    createPageFromTemplate
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

  // Handle card click from EventHubContent or sidebar
  const handleEventHubCardClick = (cardId: string) => {
    if (cardId === 'schedule-session') {
      // Navigate to schedule management view
      setCurrentView('schedule')
      logger.debug('📍 Navigating to schedule page from Event Hub card')
    } else if (cardId === 'communications') {
      // Navigate to communication page
      setCurrentView('communication')
      logger.debug('📍 Navigating to communication page from Event Hub card')
    } else if (cardId === 'resource-management') {
      // Navigate to resource management page
      setCurrentView('resource-management')
      logger.debug('📍 Navigating to resource management page from Event Hub card')
    } else {
      // Handle other card IDs (attendee-management, analytics, website-settings)
      logger.debug(`📍 Card clicked: ${cardId}`)
      // TODO: Implement navigation for other card types when their pages are created
    }
  }

  // Custom back to editor handler
  const handleBackToEditor = () => {
    setCurrentView('editor')
    logger.debug('📍 Navigating back to editor')
  }

  // Custom back to event hub handler
  const handleBackToEventHub = () => {
    setCurrentView('events')
    logger.debug('📍 Navigating back to event hub')
  }

  // Handle navigation to schedule page
  const handleNavigateToSchedule = () => {
    setCurrentView('schedule')
    logger.debug('📍 Navigating to schedule page')
  }

  // Apply Puck styling when not in preview mode
  useEffect(() => {
    if (!showPreview) {
      return setupPuckStyling()
    }
  }, [showPreview])

  // Listen for navigation to schedule page
  useEffect(() => {
    const handleNavigateToScheduleEvent = () => {
      setCurrentView('schedule')
      logger.debug('📍 Navigating to schedule page via event')
    }

    window.addEventListener('navigate-to-schedule', handleNavigateToScheduleEvent)
    
    return () => {
      window.removeEventListener('navigate-to-schedule', handleNavigateToScheduleEvent)
    }
  }, [])

  // Render Events Page (Event Hub)
  if (currentView === 'events') {
    logger.debug('📍 Rendering Event Hub Page');
    
    return (
      <EventHubPage
        eventName="Highly important conference of 2025"
        isDraft={true}
        onBackClick={handleBackToEditor}
        userAvatarUrl="" // Add user avatar URL here if available
        onCardClick={handleEventHubCardClick}
      />
    )
  }

  // Render Schedule Page
  if (currentView === 'schedule') {
    logger.debug('📍 Rendering Schedule Page');
    
    return (
      <SchedulePage
        eventName="Highly important conference of 2025"
        isDraft={true}
        onBackClick={handleBackToEventHub}
        userAvatarUrl=""
        scheduleName="Schedule 1"
        onCardClick={handleEventHubCardClick}
      />
    )
  }

  // Render Communication Page
  if (currentView === 'communication') {
    logger.debug('📍 Rendering Communication Page');
    
    return (
      <CommunicationPage
        eventName="Highly important conference of 2025"
        isDraft={true}
        onBackClick={handleBackToEventHub}
        userAvatarUrl=""
        onCardClick={handleEventHubCardClick}
      />
    )
  }

  // Render Resource Management Page
  if (currentView === 'resource-management') {
    logger.debug('📍 Rendering Resource Management Page');
    
    return (
      <ResourceManagementPage
        eventName="Highly important conference of 2025"
        isDraft={true}
        onBackClick={handleBackToEventHub}
        userAvatarUrl=""
        onCardClick={handleEventHubCardClick}
      />
    )
  }

  // Render Editor Page
  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Global Navbar - EventHubNavbar */}
      <EventHubNavbar
        eventName="Highly important conference of 2025"
        isDraft={true}
        onBackClick={handleBackToEditor}
        onSearchClick={() => {}}
        onNotificationClick={() => {}}
        onProfileClick={handleProfileClick}
        userAvatarUrl=""
      />

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
        onPreviewToggle={() => setShowPreview(!showPreview)}
        onBack={handleBackToEditor}
        onCreatePageFromTemplate={createPageFromTemplate}
        onCreateNewPage={createNewPage}
      />
    </div>
  )
}

export default App
