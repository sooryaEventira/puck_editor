import React, { useState, useMemo } from 'react'
import { useEventForm } from '../../contexts/EventFormContext'
import EventHubNavbar from './EventHubNavbar'
import EventHubSidebar from './EventHubSidebar'
import { defaultCards, ContentCard } from './EventHubContent'
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
  const [pages] = useState<Page[]>([
    { id: 'welcome', name: 'Welcome' }
  ])

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
    console.log('New page clicked')
    // TODO: Implement new page functionality
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
    </div>
  )
}

export default EventWebsitePage
