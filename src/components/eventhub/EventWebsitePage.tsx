import React, { useState, useMemo, useEffect } from 'react'
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
  const displayEventName = createdEvent?.eventName || eventData?.eventName
  const [activeSubItem, setActiveSubItem] = useState('website-pages')
  const [showPageCreationModal, setShowPageCreationModal] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<{ id: string; name: string } | null>(null)
  const [webpages, setWebpages] = useState<WebpageData[]>([])
  const [isLoadingWebpages, setIsLoadingWebpages] = useState(false)

  // Fetch webpages from backend
  useEffect(() => {
    const loadWebpages = async () => {
      if (!createdEvent?.uuid) {
        console.log('⚠️ EventWebsitePage: No event UUID available, skipping webpage fetch')
        return
      }

      console.log('📡 EventWebsitePage: Fetching webpages for event:', createdEvent.uuid)
      setIsLoadingWebpages(true)
      try {
        const fetchedWebpages = await fetchWebpages(createdEvent.uuid)
        console.log('✅ EventWebsitePage: Fetched webpages:', fetchedWebpages)
        setWebpages(fetchedWebpages)
      } catch (error) {
        console.error('❌ EventWebsitePage: Failed to load webpages:', error)
      } finally {
        setIsLoadingWebpages(false)
      }
    }

    loadWebpages()
  }, [createdEvent?.uuid])

  // Initialize pages based on template selection on mount
  useEffect(() => {
    // Check if pages are already initialized
    if (pages.length > 0) return

    // Check if we're creating from scratch
    const isFromScratch = localStorage.getItem('create-from-scratch') === 'true'
    
    if (isFromScratch) {
      initializePages('scratch')
    } else {
      // Default template - create Welcome page
      initializePages('default-template')
    }
  }, [pages.length, initializePages])

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
    console.log('Search clicked')
  }

  const handleNotificationClick = () => {
    console.log('Notification clicked')
  }

  const handleProfileClick = () => {
    console.log('Profile clicked')
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
    console.log('Preview clicked')
  }

  const handlePublishWebsite = () => {
    console.log('Publish website clicked')
  }

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
      //   console.error('Failed to save schedule page')
      // }
    } catch (error) {
      console.error('Error creating schedule page:', error)
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
        duplicatePage(pageId)
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

  const confirmDelete = () => {
    if (showDeleteConfirm) {
      deletePage(showDeleteConfirm.id)
      setShowDeleteConfirm(null)
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
                iconLeading={<Globe01 className="h-3.5 w-3.5 flex-shrink-0" />}
                data-modal-button="true"
                className="bg-[#6938EF] hover:bg-[#5925DC] text-white text-xs !min-w-[140px] px-8"
                style={{ whiteSpace: 'nowrap', display: 'inline-flex', alignItems: 'center' }}
              >
                Publish
              </Button>
            </div>
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
