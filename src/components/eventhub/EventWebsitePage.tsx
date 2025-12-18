import React, { useState, useMemo, useEffect } from 'react'
import { useEventForm } from '../../contexts/EventFormContext'
import EventHubNavbar from './EventHubNavbar'
import EventHubSidebar from './EventHubSidebar'
import { defaultCards, ContentCard } from './EventHubContent'
import PageCreationModal, { type PageType } from '../page/PageCreationModal'
import { API_ENDPOINTS } from '../../config/env'
import { 
  InfoCircle, 
  CodeBrowser, 
  Globe01,
  Copy01,
  Eye,
  Link03,
  Edit05,
  Trash01
} from '@untitled-ui/icons-react'

interface EventWebsitePageProps {
  onBackClick?: () => void
  userAvatarUrl?: string
  hideNavbarAndSidebar?: boolean
}

interface Page {
  id: string
  name: string
  isDisabled?: boolean
}

const EventWebsitePage: React.FC<EventWebsitePageProps> = ({
  onBackClick,
  userAvatarUrl,
  hideNavbarAndSidebar = false
}) => {
  const { eventData } = useEventForm()
  const [activeSubItem, setActiveSubItem] = useState('website-pages')
  const [pages, setPages] = useState<Page[]>([
    { id: 'welcome', name: 'Welcome' }
  ])
  const [showPageCreationModal, setShowPageCreationModal] = useState(false)

  // Load pages from API on mount
  useEffect(() => {
    loadPages()
  }, [])

  const loadPages = async () => {
    try {
      const apiUrl = API_ENDPOINTS.GET_PAGES || '/api/pages'
      const response = await fetch(apiUrl)
      
      if (response.ok) {
        const result = await response.json()
        if (result.success && result.pages) {
          // Convert API pages to Page format
          const loadedPages: Page[] = result.pages.map((page: any) => {
            // Try to get page name from filename or load page data
            let pageName = page.filename.replace('.json', '')
            const pageId = page.filename.replace('.json', '')
            
            // Try to load page data to get the actual pageTitle
            fetch(API_ENDPOINTS.GET_PAGE(page.filename) || `/api/pages/${page.filename}`)
              .then(pageResponse => {
                if (pageResponse.ok) {
                  return pageResponse.json()
                }
                return null
              })
              .then(pageResult => {
                if (pageResult?.success && pageResult.data?.root?.props) {
                  const pageTitle = pageResult.data.root.props.pageTitle || pageResult.data.root.props.title
                  if (pageTitle) {
                    setPages(prevPages => {
                      const existingPage = prevPages.find(p => p.id === pageId)
                      if (existingPage && existingPage.name !== pageTitle) {
                        return prevPages.map(p => p.id === pageId ? { ...p, name: pageTitle } : p)
                      }
                      return prevPages
                    })
                  }
                }
              })
              .catch(() => {
                // Ignore errors, use filename-based name
              })
            
            return {
              id: pageId,
              name: pageName
            }
          })
          
          // Ensure Welcome page is always included
          const welcomeExists = loadedPages.some(p => p.id === 'welcome' || p.name === 'Welcome')
          if (!welcomeExists) {
            loadedPages.unshift({ id: 'welcome', name: 'Welcome' })
          }
          
          setPages(loadedPages)
        }
      }
    } catch (error) {
      console.error('Error loading pages:', error)
      // Keep default Welcome page on error
    }
  }

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
    // When embedded in EventHubPage (hideNavbarAndSidebar=true), this handler shouldn't be called
    // as the sidebar won't be rendered. But if it is called, we'll handle it gracefully.
    if (hideNavbarAndSidebar) {
      // If embedded, navigation should be handled by parent EventHubPage
      // Don't do anything - let the parent handle it
      return
    }
    
    // Only handle navigation when EventWebsitePage is standalone (not embedded)
    // Handle Event Hub navigation - navigate to Event Hub page
    if (itemId === 'event-hub') {
      // Navigate to Event Hub page
      window.history.pushState({}, '', '/event/hub')
      window.dispatchEvent(new PopStateEvent('popstate'))
      return
    }
    
    // Handle Event Hub sub-items - navigate to Event Hub page with the section
    const isCardId = defaultCards.some((card) => card.id === itemId)
    if (isCardId) {
      // Navigate to Event Hub page with the section as a URL parameter
      window.history.pushState({ section: itemId }, '', `/event/hub?section=${itemId}`)
      window.dispatchEvent(new PopStateEvent('popstate'))
      return
    }
  }

  const handlePreview = () => {
    console.log('Preview clicked')
    // TODO: Implement preview functionality
  }

  const handlePublishWebsite = () => {
    console.log('Publish website clicked')
    // TODO: Implement publish functionality
  }

  const handleNewPage = () => {
    setShowPageCreationModal(true)
  }

  const handlePageTypeSelect = async (pageType: PageType) => {
    console.log('Selected page type:', pageType)
    setShowPageCreationModal(false)
    
    // Handle schedule page creation
    if (pageType === 'schedule') {
      await createSchedulePage()
    } else {
      // TODO: Implement other page types
      console.log('Page type not yet implemented:', pageType)
    }
  }

  const createSchedulePage = async () => {
    try {
      // Generate page ID and name
      const pageName = 'Schedule'
      const sanitizedName = pageName.toLowerCase().replace(/[^a-z0-9]/g, '-')
      const pageId = `page-${sanitizedName}-${Date.now()}`
      
      // Create schedule page template with SchedulePage component
      // Include default events matching the schedule interface shown in the image
      const schedulePageData = {
        content: [
          {
            type: 'SchedulePage',
            props: {
              title: 'Schedule',
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
                },
                {
                  id: "2",
                  title: "Poster presentation",
                  startTime: "08:00 AM",
                  endTime: "09:00 AM",
                  location: "Room B",
                  type: "In-Person",
                  description: "Poster presentation session",
                  participants: "",
                  tags: "",
                  attachments: 5,
                  isCompleted: false,
                  isExpanded: false,
                  parentSessionId: undefined
                },
                {
                  id: "3",
                  title: "Welcome Note",
                  startTime: "09:10 AM",
                  endTime: "10:10 AM",
                  location: "Drawing Room",
                  type: "Virtual",
                  description: "Welcome note from the chairman",
                  participants: "Chairman: Speaker 1, Others: Speaker 2, +2 more",
                  tags: "Poster",
                  attachments: 12,
                  isCompleted: false,
                  isExpanded: false,
                  parentSessionId: undefined
                },
                {
                  id: "4",
                  title: "Special topic",
                  startTime: "09:15 AM",
                  endTime: "09:30 AM",
                  location: "Drawing Room",
                  type: "Virtual",
                  description: "Special topic discussion",
                  participants: "Speakers: Speaker 1, Speaker 2",
                  tags: "",
                  attachments: 8,
                  isCompleted: false,
                  isExpanded: false,
                  parentSessionId: undefined
                },
                {
                  id: "5",
                  title: "Tea break",
                  startTime: "10:10 AM",
                  endTime: "10:30 AM",
                  location: "Cafeteria",
                  type: "In-Person",
                  description: "Tea break for networking",
                  participants: "",
                  tags: "break",
                  attachments: 0,
                  isCompleted: false,
                  isExpanded: false,
                  parentSessionId: undefined
                },
                {
                  id: "6",
                  title: "Workshop",
                  startTime: "10:30 AM",
                  endTime: "11:30 AM",
                  location: "Room B",
                  type: "In-Person",
                  description: "Interactive workshop session",
                  participants: "",
                  tags: "workshop",
                  attachments: 0,
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
      
      // Save page to server
      const apiUrl = API_ENDPOINTS.SAVE_PAGE || '/api/save-page'
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          data: schedulePageData,
          filename: `${pageId}.json`
        })
      })
      
      if (response.ok) {
        // Add the new schedule page to the pages list
        setPages(prevPages => {
          // Check if page already exists
          const pageExists = prevPages.some(p => p.id === pageId || p.name === pageName)
          if (!pageExists) {
            return [...prevPages, { id: pageId, name: pageName }]
          }
          return prevPages
        })
        
        // Reload pages to ensure we have the latest list
        await loadPages()
        
        // Navigate to editor with the new schedule page
        window.history.pushState({}, '', `/event/website/editor/${pageId}`)
        window.dispatchEvent(new PopStateEvent('popstate'))
      } else {
        console.error('Failed to save schedule page')
      }
    } catch (error) {
      console.error('Error creating schedule page:', error)
    }
  }

  const handlePageAction = (pageId: string, action: string) => {
    console.log(`Page action: ${action} for page: ${pageId}`)
    
    if (action === 'view') {
      // Navigate to preview page
      window.history.pushState({}, '', `/event/website/preview/${pageId}`)
      window.dispatchEvent(new PopStateEvent('popstate'))
    } else if (action === 'edit') {
      // Navigate to editor page
      window.history.pushState({}, '', `/event/website/editor/${pageId}`)
      window.dispatchEvent(new PopStateEvent('popstate'))
    }
    // TODO: Implement other page actions (duplicate, link, delete)
  }

  // Don't render sidebar/navbar if embedded
  if (hideNavbarAndSidebar) {
    return (
      <div className="w-full h-full">
        {/* Main Content */}
        <div className="flex-1 p-8 bg-white overflow-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-[26px] font-bold text-primary-dark">Event Website</h1>
            <div className="flex items-center gap-3">
              <button
                onClick={handlePreview}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 transition-colors"
              >
                <Eye className="h-4 w-4" />
                Preview
              </button>
              <button
                onClick={handlePublishWebsite}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 transition-colors"
              >
                <Globe01 className="h-4 w-4" />
                Publish Website
              </button>
              <button
                onClick={handleNewPage}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-white bg-[#6938EF] hover:bg-[#5925DC] transition-colors"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                New page
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-6 mb-6 border-b border-slate-200">
            <button
              onClick={() => setActiveSubItem('website-pages')}
              className={`pb-3 px-1 text-sm font-medium transition-colors relative ${
                activeSubItem === 'website-pages'
                  ? 'text-primary border-b-2 border-primary'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Website pages
            </button>
            <button
              onClick={() => setActiveSubItem('website-header')}
              className={`pb-3 px-1 text-sm font-medium transition-colors relative ${
                activeSubItem === 'website-header'
                  ? 'text-primary border-b-2 border-primary'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Website header
            </button>
          </div>

          {/* Content based on active tab */}
          {activeSubItem === 'website-pages' && (
            <div>
              {/* Pages List */}
              <div className="space-y-0">
                {pages.map((page) => (
                  <div
                    key={page.id}
                    className={`flex items-center justify-between py-4 px-4 border-b border-slate-200 hover:bg-slate-50 transition-colors ${
                      page.isDisabled ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    <span className={`text-sm font-medium ${page.isDisabled ? 'text-slate-400' : 'text-slate-900'}`}>
                      {page.name}
                    </span>
                    {!page.isDisabled && (
                      <div className="flex items-center gap-4">
                        <button
                          onClick={() => handlePageAction(page.id, 'duplicate')}
                          className="p-2 text-slate-400 hover:text-slate-600 transition-colors"
                          aria-label="Duplicate"
                        >
                          <Copy01 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handlePageAction(page.id, 'view')}
                          className="p-2 text-slate-400 hover:text-slate-600 transition-colors"
                          aria-label="View"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handlePageAction(page.id, 'link')}
                          className="p-2 text-slate-400 hover:text-slate-600 transition-colors"
                          aria-label="Copy link"
                        >
                          <Link03 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handlePageAction(page.id, 'edit')}
                          className="p-2 text-slate-400 hover:text-slate-600 transition-colors"
                          aria-label="Edit"
                        >
                          <Edit05 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handlePageAction(page.id, 'delete')}
                          className="p-2 text-slate-400 hover:text-red-600 transition-colors"
                          aria-label="Delete"
                        >
                          <Trash01 className="h-4 w-4" />
                        </button>
                      </div>
                    )}
                  </div>
                ))}
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
      </div>
    )
  }

  return (
    <div className="h-screen overflow-hidden bg-white">
      {/* Navbar */}
      <EventHubNavbar
        eventName={eventData?.eventName || 'Highly important conference of 2025'}
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
      <div className={`flex-1 p-8 bg-white overflow-auto ${hideNavbarAndSidebar ? "" : "ml-[250px] mt-16"}`}>
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-primary">Event Website</h1>
          <div className="flex items-center gap-3">
            <button
              onClick={handlePreview}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 transition-colors"
            >
              <Eye className="h-4 w-4" />
              Preview
            </button>
            <button
              onClick={handlePublishWebsite}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 transition-colors"
            >
              <Globe01 className="h-4 w-4" />
              Publish Website
            </button>
            <button
              onClick={handleNewPage}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-white bg-[#6938EF] hover:bg-[#5925DC] transition-colors"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              New page
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-6 mb-6 border-b border-slate-200">
          <button
            onClick={() => setActiveSubItem('website-pages')}
            className={`pb-3 px-1 text-sm font-medium transition-colors relative ${
              activeSubItem === 'website-pages'
                ? 'text-primary border-b-2 border-primary'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Website pages
          </button>
          <button
            onClick={() => setActiveSubItem('website-header')}
            className={`pb-3 px-1 text-sm font-medium transition-colors relative ${
              activeSubItem === 'website-header'
                ? 'text-primary border-b-2 border-primary'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Website header
          </button>
        </div>

        {/* Content based on active tab */}
        {activeSubItem === 'website-pages' && (
          <div>
            {/* Pages List */}
            <div className="space-y-0">
              {pages.map((page) => (
                <div
                  key={page.id}
                  className={`flex items-center justify-between py-4 px-4 border-b border-slate-200 hover:bg-slate-50 transition-colors ${
                    page.isDisabled ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  <span className={`text-sm font-medium ${page.isDisabled ? 'text-slate-400' : 'text-slate-900'}`}>
                    {page.name}
                  </span>
                  {!page.isDisabled && (
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => handlePageAction(page.id, 'duplicate')}
                        className="p-2 text-slate-400 hover:text-slate-600 transition-colors"
                        aria-label="Duplicate"
                      >
                        <Copy01 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handlePageAction(page.id, 'view')}
                        className="p-2 text-slate-400 hover:text-slate-600 transition-colors"
                        aria-label="View"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handlePageAction(page.id, 'link')}
                        className="p-2 text-slate-400 hover:text-slate-600 transition-colors"
                        aria-label="Copy link"
                      >
                        <Link03 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handlePageAction(page.id, 'edit')}
                        className="p-2 text-slate-400 hover:text-slate-600 transition-colors"
                        aria-label="Edit"
                      >
                        <Edit05 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handlePageAction(page.id, 'delete')}
                        className="p-2 text-slate-400 hover:text-red-600 transition-colors"
                        aria-label="Delete"
                      >
                        <Trash01 className="h-4 w-4" />
                      </button>
                    </div>
                  )}
                </div>
              ))}
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
    </div>
  )
}

export default EventWebsitePage
