import React, { useState, useMemo, useEffect, useCallback } from 'react'
import { useEventForm } from '../../contexts/EventFormContext'
import { useWebsitePages } from '../../contexts/WebsitePagesContext'
import EventHubNavbar from './EventHubNavbar'
import EventHubSidebar from './EventHubSidebar'
import { defaultCards, ContentCard } from './EventHubContent'
import PageCreationModal, { type PageType } from '../page/PageCreationModal'
import { fetchWebpages, type WebpageData } from '../../services/webpageService'
import Button from '../ui/untitled/Button'
import { 
  InfoCircle, 
  CodeBrowser, 
  Globe01,
  Copy01,
  Eye,
  Edit05,
  Trash01,
  Plus
} from '@untitled-ui/icons-react'

interface EventWebsitePageProps {
  onBackClick?: () => void
  userAvatarUrl?: string
  hideNavbarAndSidebar?: boolean
}

const EventWebsitePage: React.FC<EventWebsitePageProps> = ({
  onBackClick,
  userAvatarUrl,
  hideNavbarAndSidebar = false
}) => {
  const { eventData, createdEvent } = useEventForm()
  const { pages, addPage, deletePage, duplicatePage, initializePages } = useWebsitePages()

  // Prioritize createdEvent data from API, fallback to eventData from form
  // Use useMemo to ensure we always get the latest value and prevent stale reads
  const displayEventName = useMemo(() => {
    const name = createdEvent?.eventName || eventData?.eventName
    return name
  }, [createdEvent?.eventName, createdEvent?.uuid, eventData?.eventName])
  const [activeSubItem, setActiveSubItem] = useState('website-pages')
  const [showPageCreationModal, setShowPageCreationModal] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<{ id: string; name: string } | null>(null)
  const [webpages, setWebpages] = useState<WebpageData[]>([])
  const [isLoadingWebpages, setIsLoadingWebpages] = useState(false)

  // Fetch webpages from backend
  const loadWebpages = useCallback(async () => {
    if (!createdEvent?.uuid) {
      // Clear webpages when event UUID is not available to prevent stale data
      setWebpages([])
      return
    }

    setIsLoadingWebpages(true)
    try {
      console.log('📋 [EventWebsitePage] Fetching webpages for event:', createdEvent.uuid)
      const fetchedWebpages = await fetchWebpages(createdEvent.uuid)
      console.log('📋 [EventWebsitePage] Fetched webpages:', fetchedWebpages.length, 'pages')
      console.log('📋 [EventWebsitePage] Webpage names:', fetchedWebpages.map(w => w.name))
      setWebpages(fetchedWebpages)
    } catch (error) {
      console.error('❌ [EventWebsitePage] Error fetching webpages:', error)
      // Error is handled by errorHandler
    } finally {
      setIsLoadingWebpages(false)
    }
  }, [createdEvent?.uuid])

  useEffect(() => {
    loadWebpages()
  }, [loadWebpages])

  // Listen for webpage-saved events to refresh the list
  useEffect(() => {
    const handleWebpageSaved = (event: CustomEvent) => {
      const { eventUuid } = event.detail
      // Only refresh if it's for the current event
      if (eventUuid === createdEvent?.uuid) {
        console.log('🔄 [EventWebsitePage] Webpage saved, refreshing list...')
        loadWebpages()
      }
    }

    window.addEventListener('webpage-saved', handleWebpageSaved as EventListener)
    return () => {
      window.removeEventListener('webpage-saved', handleWebpageSaved as EventListener)
    }
  }, [createdEvent?.uuid, loadWebpages])

  // Initialize pages based on template selection on mount
  useEffect(() => {
    // Check if we're creating from scratch (check URL param as flag may be cleared)
    const urlParams = new URLSearchParams(window.location.search)
    const isFromScratch = urlParams.get('mode') === 'blank' || 
                          localStorage.getItem('create-from-scratch') === 'true'
    
    // If creating from scratch, clear WebsitePagesContext and don't initialize
    // Pages should come from Puck's internal state (page1) only
    if (isFromScratch) {
      // Clear any existing pages in WebsitePagesContext (especially welcome pages)
      if (pages.length > 0) {
        pages.forEach(page => {
          // Delete all pages, especially welcome pages
          if (page.name?.toLowerCase() === 'welcome' || page.id?.toLowerCase() === 'welcome') {
            deletePage(page.id)
          } else {
            deletePage(page.id)
          }
        })
      }
      
      // Clear WebsitePagesContext localStorage cache
      try {
        localStorage.removeItem('website-pages')
      } catch (error) {
        console.error('Error clearing website-pages cache:', error)
      }
      
      // Initialize with only page1 for scratch mode
      if (pages.length === 0) {
        initializePages('scratch')
      }
      return
    }

    // Check if pages are already initialized (for template mode)
    if (pages.length > 0) return

    // Default template - create Welcome page
    initializePages('default-template')
  }, [pages.length, initializePages, deletePage])

  // Remove Schedule pages - only keep Welcome page
  useEffect(() => {
    const schedulePages = pages.filter(page => 
      page.name.toLowerCase() === 'schedule' || 
      (page as any).type === 'schedule'
    )
    
    if (schedulePages.length > 0) {
      schedulePages.forEach(schedulePage => {
        deletePage(schedulePage.id)
      })
    }
  }, [pages, deletePage])

  const handleSearchClick = () => {
    // TODO: Implement search functionality
  }

  const handleNotificationClick = () => {
    // TODO: Implement notification functionality
  }

  const handleProfileClick = () => {
    // TODO: Implement profile functionality
  }

  // Create sidebar items - Event Hub has sub-items, Event Website does not
  const sidebarItems = useMemo(() => {
    const eventHubSubItems = defaultCards.map((card: ContentCard) => ({
      id: card.id,
      label: card.title,
      icon: card.icon
    }))

    return [
      { id: 'overview', label: 'Overview', icon: <InfoCircle className="h-5 w-5" /> },
      { id: 'event-website', label: 'Event website', icon: <CodeBrowser className="h-5 w-5" /> },
      {
        id: 'event-hub',
        label: 'Event Hub',
        icon: <Globe01 className="h-5 w-5" />,
        subItems: eventHubSubItems
      }
    ]
  }, [])

  const handleSidebarItemClick = (itemId: string) => {
    if (hideNavbarAndSidebar) {
      return
    }
    
    if (itemId === 'event-hub') {
      window.history.pushState({}, '', '/event/hub')
      window.dispatchEvent(new PopStateEvent('popstate'))
      return
    }
    
    const isCardId = defaultCards.some((card) => card.id === itemId)
    if (isCardId) {
      window.history.pushState({ section: itemId }, '', `/event/hub?section=${itemId}`)
      window.dispatchEvent(new PopStateEvent('popstate'))
      return
    }
  }

  const handlePreview = () => {
    // Navigate to preview of the first webpage
    if (webpages.length > 0) {
      const firstWebpage = webpages[0]
      window.history.pushState({}, '', `/event/website/preview/${firstWebpage.uuid}`)
      window.dispatchEvent(new PopStateEvent('popstate'))
    }
  }

  const handlePublishWebsite = () => {
    // TODO: Implement publish website functionality
  }

  // Reusable header buttons component to avoid duplication
  const renderHeaderButtons = () => (
    <div className="flex items-center gap-3 flex-nowrap overflow-visible">
      <Button
        variant="secondary"
        size="md"
        onClick={handlePreview}
        iconLeading={<Eye className="h-4 w-4" />}
      >
        Preview
      </Button>
      <Button
              variant="primary"
              size="sm"
              onClick={handlePublishWebsite}
              data-modal-button="true"
              className="bg-[#6938EF] hover:bg-[#5925DC] text-white text-xs !min-w-[100px]"
              style={{ whiteSpace: 'nowrap', paddingTop: '10px', paddingBottom: '10px', minHeight: '38px' }}
            >
              <span className="flex items-center gap-1.5 pl-3">
                <Globe01 className="h-3.5 w-3.5 flex-shrink-0" />
                <span>Publish</span>
              </span>
            </Button>
    </div>
  )

  const handleNewPage = () => {
    setShowPageCreationModal(true)
  }

  // Get page name from PageType
  const getPageNameFromType = (pageType: PageType): string => {
    const pageTypeNames: Record<PageType, string> = {
      'attendee': 'Attendee page',
      'schedule': 'Schedule',
      'html-general': 'HTML/General page',
      'folder': 'Folder',
      'organization': 'Organization page',
      'hyperlink': 'Hyperlink',
      'qr-scanner': 'App QR Scanner',
      'documents': 'Documents list',
      'gallery': 'Gallery page',
      'forms': 'Forms',
      'meeting-room': 'Meeting room'
    }
    return pageTypeNames[pageType] || 'New Page'
  }

  const handlePageTypeSelect = async (pageType: PageType) => {
    setShowPageCreationModal(false)
    
    const pageName = getPageNameFromType(pageType)
    const pageId = `page-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    
    // Handle schedule page creation with special metadata
    if (pageType === 'schedule') {
      // Add Schedule page to context with correct metadata
      addPage({
        id: pageId,
        name: pageName,
        slug: pageName.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        source: 'advanced-component',
        type: 'schedule',
        component: 'SchedulePage'
      })
      await createSchedulePage(pageId, pageName)
    } else {
      // Add other page types to context
      addPage({
        id: pageId,
        name: pageName,
        slug: pageName.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        source: 'modal-created'
      })
      // For other page types, navigate to editor
      window.history.pushState({}, '', `/event/website/editor/${pageId}`)
      window.dispatchEvent(new PopStateEvent('popstate'))
    }
  }

  const createSchedulePage = async (pageId: string, pageName: string) => {
    try {
      const schedulePageData = {
        content: [
          {
            type: 'SchedulePage',
            props: {
              title: pageName,
              events: [
                {
                  id: "1",
                  title: "Welcome presentation",
                  startTime: "08:00 AM",
                  endTime: "09:00 AM",
                  location: "Room A",
                  type: "In-Person",
                  description: "Welcome presentation for all attendees",
                  participants: "",
                  tags: "",
                  attachments: 1,
                  isCompleted: false,
                  isExpanded: false,
                  parentSessionId: undefined
                }
              ]
            },
            id: `schedule-page-${Date.now()}`
          }
        ],
        root: {
          props: {
            title: pageName,
            pageTitle: pageName,
            pageType: 'schedule'
          }
        },
        zones: {}
      }
      
      // // Save page to server
      // const apiUrl = API_ENDPOINTS.SAVE_PAGE || '/api/save-page'
      // const response = await fetch(apiUrl, {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({
      //     data: schedulePageData,
      //     filename: `${pageId}.json`
      //   })
      // })
      
      // if (response.ok) {
      //   // Navigate to editor with the new schedule page
      //   window.history.pushState({}, '', `/event/website/editor/${pageId}`)
      //   window.dispatchEvent(new PopStateEvent('popstate'))
      // } else {
      //   // Handle error
      // }
    } catch (error) {
      // Error handled silently
    }
  }

  const handlePageAction = (pageId: string, action: string) => {
    const webpage = webpages.find(w => w.uuid === pageId)
    if (!webpage) return

    // Check if this is the welcome page (cannot be deleted)
    const isFirstPage = webpage.name.toLowerCase() === 'welcome'

    switch (action) {
      case 'view':
        // Navigate to preview page
        window.history.pushState({}, '', `/event/website/preview/${pageId}`)
        window.dispatchEvent(new PopStateEvent('popstate'))
        break
      case 'edit':
        // Navigate to editor page
        window.history.pushState({}, '', `/event/website/editor/${pageId}`)
        window.dispatchEvent(new PopStateEvent('popstate'))
        break
      case 'duplicate':
        // TODO: Implement backend API call to duplicate webpage
        // duplicatePage(pageId) // This is for local pages, not backend webpages
        break
      case 'delete':
        if (isFirstPage) {
          // Show error or prevent deletion
          alert('The welcome page cannot be deleted.')
          return
        }
        setShowDeleteConfirm({ id: pageId, name: webpage.name })
        break
      default:
        break
    }
  }

  const confirmDelete = async () => {
    if (showDeleteConfirm) {
      // TODO: Implement backend API call to delete webpage
      // deletePage(showDeleteConfirm.id) // This is for local pages, not backend webpages
      // For now, remove from local state and refresh the list
      setWebpages(prev => prev.filter(w => w.uuid !== showDeleteConfirm.id))
      setShowDeleteConfirm(null)
      // TODO: Call backend API to delete webpage: deleteWebpage(showDeleteConfirm.id, createdEvent?.uuid)
    }
  }

  // Render content for embedded mode (without navbar/sidebar)
  if (hideNavbarAndSidebar) {
    return (
      <div className="w-full h-full">
        <div className="flex-1 p-8 bg-white overflow-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 w-full">
            <h1 className="text-[26px] font-bold text-primary-dark">Event Website</h1>
            {renderHeaderButtons()}
          </div>

          {/* Tabs */}
          <div className="flex items-center justify-between mb-6 border-b border-slate-200">
            <div className="flex gap-6">
              <Button
                variant="tertiary"
                size="sm"
                onClick={() => setActiveSubItem('website-pages')}
                className={`pb-3 px-1 h-auto rounded-none border-b-2 transition-colors relative ${
                  activeSubItem === 'website-pages'
                    ? 'text-primary border-b-primary'
                    : 'text-slate-600 hover:text-slate-900 border-b-transparent'
                }`}
              >
                Website pages
              </Button>
              <Button
                variant="tertiary"
                size="sm"
                onClick={() => setActiveSubItem('website-header')}
                className={`pb-3 px-1 h-auto rounded-none border-b-2 transition-colors relative ${
                  activeSubItem === 'website-header'
                    ? 'text-primary border-b-primary'
                    : 'text-slate-600 hover:text-slate-900 border-b-transparent'
                }`}
              >
                Website header
              </Button>
            </div>
            <Button
              variant="primary"
              size="md"
              onClick={handleNewPage}
              iconLeading={<Plus className="h-4 w-4" />}
            >
              New page
            </Button>
          </div>

          {/* Content based on active tab */}
          {activeSubItem === 'website-pages' && (
            <div>
              {/* Pages List */}
              <div className="space-y-0 border border-slate-200 rounded-lg bg-white">
                {isLoadingWebpages ? (
                  <div className="flex items-center justify-center py-8 text-slate-500">
                    <p>Loading webpages...</p>
                  </div>
                ) : webpages.length === 0 ? (
                  <div className="flex items-center justify-center py-8 text-slate-500">
                    <p>No pages yet. Click "+ New Page" to create one.</p>
                  </div>
                ) : (
                  webpages.map((webpage) => {
                    const isFirstPage = webpage.name.toLowerCase() === 'welcome'
                    return (
                      <div
                        key={webpage.uuid}
                        className="flex items-center justify-between py-2 px-4 border-b border-slate-200 last:border-b-0 hover:bg-slate-50 transition-colors"
                      >
                        <span className="text-sm font-medium text-slate-900 capitalize">
                          {webpage.name}
                        </span>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="tertiary"
                            size="sm"
                            onClick={() => handlePageAction(webpage.uuid, 'view')}
                            className="p-2 text-slate-400 hover:text-slate-600"
                            aria-label="View"
                            iconLeading={<Eye className="h-4 w-4" />}
                          />
                          <Button
                            variant="tertiary"
                            size="sm"
                            onClick={() => handlePageAction(webpage.uuid, 'edit')}
                            className="p-2 text-slate-400 hover:text-slate-600"
                            aria-label="Edit"
                            iconLeading={<Edit05 className="h-4 w-4" />}
                          />
                          <Button
                            variant="tertiary"
                            size="sm"
                            onClick={() => handlePageAction(webpage.uuid, 'duplicate')}
                            className="p-2 text-slate-400 hover:text-slate-600"
                            aria-label="Duplicate"
                            iconLeading={<Copy01 className="h-4 w-4" />}
                          />
                          <Button
                            variant="tertiary"
                            size="sm"
                            onClick={() => handlePageAction(webpage.uuid, 'delete')}
                            className={`p-2 hover:text-red-600 ${
                              isFirstPage 
                                ? 'text-slate-300 cursor-not-allowed opacity-50' 
                                : 'text-slate-400'
                            }`}
                            aria-label="Delete"
                            disabled={isFirstPage}
                            iconLeading={<Trash01 className="h-4 w-4" />}
                          />
                        </div>
                      </div>
                    )
                  })
                )}
              </div>
            </div>
          )}

          {activeSubItem === 'website-header' && (
            <div>
              <p className="text-slate-600">Website header settings will be implemented here.</p>
            </div>
          )}
        </div>

        {/* Page Creation Modal */}
        <PageCreationModal
          isVisible={showPageCreationModal}
          onClose={() => setShowPageCreationModal(false)}
          onSelect={handlePageTypeSelect}
        />

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Delete Page</h3>
              <p className="text-sm text-slate-600 mb-6">
                Are you sure you want to delete "{showDeleteConfirm.name}"? This action cannot be undone.
              </p>
              <div className="flex justify-end gap-3">
                <Button
                  variant="secondary"
                  size="md"
                  onClick={() => setShowDeleteConfirm(null)}
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  size="md"
                  onClick={confirmDelete}
                  className="bg-red-600 hover:bg-red-700"
                >
                  Delete
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    )
  }

  // Render full page with navbar and sidebar
  return (
    <div className="h-screen overflow-hidden bg-white">
      {/* Navbar */}
      <EventHubNavbar
        key={createdEvent?.uuid || 'no-event'} // Force re-render when event changes
        eventName={displayEventName || 'Highly important conference of 2025'}
        isDraft={true}
        onBackClick={onBackClick}
        onSearchClick={handleSearchClick}
        onNotificationClick={handleNotificationClick}
        onProfileClick={handleProfileClick}
        userAvatarUrl={userAvatarUrl}
      />

      {/* Sidebar */}
      <EventHubSidebar
        items={sidebarItems}
        activeItemId="event-website"
        onItemClick={handleSidebarItemClick}
      />

      {/* Main Content */}
      <div className="flex-1 p-8 bg-white overflow-x-auto overflow-y-auto ml-[250px] mt-16 min-w-0">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 w-full">
          <h1 className="text-[26px] font-bold text-primary-dark">Event Website</h1>
          {renderHeaderButtons()}
        </div>

        {/* Tabs */}
        <div className="flex items-center justify-between mb-6 border-b border-slate-200">
          <div className="flex gap-6">
            <Button
              variant="tertiary"
              size="sm"
              onClick={() => setActiveSubItem('website-pages')}
              className={`pb-3 px-1 h-auto rounded-none border-b-2 transition-colors relative ${
                activeSubItem === 'website-pages'
                  ? 'text-primary border-b-primary'
                  : 'text-slate-600 hover:text-slate-900 border-b-transparent'
              }`}
            >
              Website pages
            </Button>
            <Button
              variant="tertiary"
              size="sm"
              onClick={() => setActiveSubItem('website-header')}
              className={`pb-3 px-1 h-auto rounded-none border-b-2 transition-colors relative ${
                activeSubItem === 'website-header'
                  ? 'text-primary border-b-primary'
                  : 'text-slate-600 hover:text-slate-900 border-b-transparent'
              }`}
            >
              Website header
            </Button>
          </div>
          <Button
            variant="primary"
            size="md"
            onClick={handleNewPage}
            iconLeading={<Plus className="h-4 w-4" />}
          >
            New page
          </Button>
        </div>

        {/* Content based on active tab */}
        {activeSubItem === 'website-pages' && (
          <div>
            {/* Pages List */}
            <div className="space-y-0 border border-slate-200 rounded-lg bg-white">
              {isLoadingWebpages ? (
                <div className="flex items-center justify-center py-8 text-slate-500">
                  <p>Loading webpages...</p>
                </div>
              ) : webpages.length === 0 ? (
                <div className="flex items-center justify-center py-8 text-slate-500">
                  <p>No pages yet. Click "+ New Page" to create one.</p>
                </div>
              ) : (
                webpages.map((webpage) => {
                  const isFirstPage = webpage.name.toLowerCase() === 'welcome'
                  return (
                    <div
                      key={webpage.uuid}
                      className="flex items-center justify-between py-2 px-4 border-b border-slate-200 last:border-b-0 hover:bg-slate-50 transition-colors"
                    >
                      <span className="text-sm font-medium text-slate-900 capitalize">
                        {webpage.name}
                      </span>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="tertiary"
                          size="sm"
                          onClick={() => handlePageAction(webpage.uuid, 'view')}
                          className="p-2 text-slate-400 hover:text-slate-600"
                          aria-label="View"
                          iconLeading={<Eye className="h-4 w-4" />}
                        />
                        <Button
                          variant="tertiary"
                          size="sm"
                          onClick={() => handlePageAction(webpage.uuid, 'edit')}
                          className="p-2 text-slate-400 hover:text-slate-600"
                          aria-label="Edit"
                          iconLeading={<Edit05 className="h-4 w-4" />}
                        />
                        <Button
                          variant="tertiary"
                          size="sm"
                          onClick={() => handlePageAction(webpage.uuid, 'duplicate')}
                          className="p-2 text-slate-400 hover:text-slate-600"
                          aria-label="Duplicate"
                          iconLeading={<Copy01 className="h-4 w-4" />}
                        />
                        <Button
                          variant="tertiary"
                          size="sm"
                          onClick={() => handlePageAction(webpage.uuid, 'delete')}
                          className={`p-2 hover:text-red-600 ${
                            isFirstPage 
                              ? 'text-slate-300 cursor-not-allowed opacity-50' 
                              : 'text-slate-400'
                          }`}
                          aria-label="Delete"
                          disabled={isFirstPage}
                          iconLeading={<Trash01 className="h-4 w-4" />}
                        />
                      </div>
                    </div>
                  )
                })
              )}
            </div>
          </div>
        )}

        {activeSubItem === 'website-header' && (
          <div>
            <p className="text-slate-600">Website header settings will be implemented here.</p>
          </div>
        )}
      </div>

      {/* Page Creation Modal */}
      <PageCreationModal
        isVisible={showPageCreationModal}
        onClose={() => setShowPageCreationModal(false)}
        onSelect={handlePageTypeSelect}
      />

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-slate-900 mb-2">Delete Page</h3>
            <p className="text-sm text-slate-600 mb-6">
              Are you sure you want to delete "{showDeleteConfirm.name}"? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <Button
                variant="secondary"
                size="md"
                onClick={() => setShowDeleteConfirm(null)}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                size="md"
                onClick={confirmDelete}
                className="bg-red-600 hover:bg-red-700"
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default EventWebsitePage
