import React, { useState, useRef, useMemo } from 'react'
import EventHubNavbar from '../EventHubNavbar'
import EventHubSidebar from '../EventHubSidebar'
import { defaultCards, ContentCard } from '../EventHubContent'
import { InfoCircle, CodeBrowser, Globe01, Folder, Upload01, Plus, SearchLg, FilterLines, DotsVertical } from '@untitled-ui/icons-react'

export interface MediaFile {
  id: string
  name: string
  type: 'image' | 'document' | 'video' | 'other'
  file: File
  preview?: string
  folderId?: string
}

export interface MediaFolder {
  id: string
  name: string
  files: string[] // Array of file IDs
}

interface ResourceManagementPageProps {
  eventName?: string
  isDraft?: boolean
  onBackClick?: () => void
  userAvatarUrl?: string
  onCardClick?: (cardId: string) => void
}

const ResourceManagementPage: React.FC<ResourceManagementPageProps> = ({
  eventName,
  isDraft,
  onBackClick,
  userAvatarUrl,
  onCardClick
}) => {
  const [folders, setFolders] = useState<MediaFolder[]>([])
  const [files, setFiles] = useState<MediaFile[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [activeTab, setActiveTab] = useState('all')
  const [draggedFileId, setDraggedFileId] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleSearchClick = () => {
    console.log('Search clicked')
  }

  const handleNotificationClick = () => {
    console.log('Notification clicked')
  }

  const handleProfileClick = () => {
    console.log('Profile clicked')
  }

  // Convert cards to sidebar sub-items
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
    if (itemId === 'event-hub' && onBackClick) {
      onBackClick()
      return
    }
    
    if (itemId !== 'resource-management') {
      const isCardId = defaultCards.some((card) => card.id === itemId)
      if (isCardId && onCardClick) {
        onCardClick(itemId)
      }
    }
  }

  const handleCreateFolder = () => {
    const newFolder: MediaFolder = {
      id: `folder-${Date.now()}`,
      name: 'New folder',
      files: []
    }
    setFolders([...folders, newFolder])
  }

  const handleUploadClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = event.target.files
    if (!selectedFiles) return

    Array.from(selectedFiles).forEach((file) => {
      const fileId = `file-${Date.now()}-${Math.random()}`
      const fileExtension = file.name.split('.').pop()?.toLowerCase() || ''
      
      let fileType: 'image' | 'document' | 'video' | 'other' = 'other'
      if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(fileExtension)) {
        fileType = 'image'
      } else if (['pdf', 'doc', 'docx', 'xls', 'xlsx', 'txt'].includes(fileExtension)) {
        fileType = 'document'
      } else if (['mp4', 'avi', 'mov', 'wmv', 'flv'].includes(fileExtension)) {
        fileType = 'video'
      }

      const mediaFile: MediaFile = {
        id: fileId,
        name: file.name,
        type: fileType,
        file: file,
        preview: fileType === 'image' ? URL.createObjectURL(file) : undefined
      }

      setFiles((prev) => [...prev, mediaFile])
    })

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleDragStart = (fileId: string) => {
    setDraggedFileId(fileId)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDrop = (folderId: string) => {
    if (draggedFileId) {
      setFolders((prev) =>
        prev.map((folder) => {
          if (folder.id === folderId) {
            return {
              ...folder,
              files: folder.files.includes(draggedFileId)
                ? folder.files
                : [...folder.files, draggedFileId]
            }
          }
          return folder
        })
      )
      setFiles((prev) =>
        prev.map((file) => {
          if (file.id === draggedFileId) {
            return { ...file, folderId }
          }
          return file
        })
      )
      setDraggedFileId(null)
    }
  }

  const getFileIcon = (file: MediaFile) => {
    if (file.type === 'image') {
      return '🖼️'
    } else if (file.type === 'document') {
      if (file.name.toLowerCase().endsWith('.pdf')) return '📄'
      if (file.name.toLowerCase().endsWith('.xls') || file.name.toLowerCase().endsWith('.xlsx')) return '📊'
      return '📝'
    } else if (file.type === 'video') {
      return '🎥'
    }
    return '📎'
  }

  const filteredFiles = useMemo(() => {
    let filtered = files
    if (activeTab !== 'all') {
      filtered = files.filter((file) => file.type === activeTab)
    }
    if (searchQuery) {
      filtered = filtered.filter((file) =>
        file.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }
    return filtered
  }, [files, activeTab, searchQuery])

  const tabs = [
    { id: 'all', label: 'All media' }
  ]

  return (
    <div className="min-h-screen overflow-x-hidden bg-white">
      {/* Navbar */}
      <EventHubNavbar
        eventName={eventName}
        isDraft={isDraft}
        onBackClick={onBackClick}
        onSearchClick={handleSearchClick}
        onNotificationClick={handleNotificationClick}
        onProfileClick={handleProfileClick}
        userAvatarUrl={userAvatarUrl}
      />

      {/* Sidebar */}
      <EventHubSidebar
        items={sidebarItems}
        activeItemId="resource-management"
        onItemClick={handleSidebarItemClick}
      />

      {/* Main Content */}
      <div className="md:pl-[250px]">
        <div className="space-y-6 px-4 pb-12 pt-28 md:px-10 lg:px-16">
          {/* Header */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-6">
            <h1 className="text-[26px] font-semibold text-primary-dark">Resource Management</h1>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleUploadClick}
                className="inline-flex items-center justify-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-[#5A1684] transition"
              >
                <Upload01 className="h-4 w-4" />
                Upload media
              </button>
              <button
                type="button"
                onClick={handleCreateFolder}
                className="inline-flex items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-semibold text-black border border-slate-200 shadow-sm bg-white transition hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
              >
                <Plus className="h-4 w-4" />
                New folder
              </button>
            </div>
          </div>

          {/* Tabs, Search and Filter in same row */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
            {/* Tabs */}
            <div className="inline-flex items-center overflow-x-auto rounded-t-xl bg-white scrollbar-hide -mb-12">
              {tabs.map((tab) => {
                const isActive = activeTab === tab.id
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={`border px-4 py-2 text-sm font-semibold transition h-10 whitespace-nowrap ${
                      isActive
                        ? 'border-primary bg-white text-primary'
                        : 'border-transparent bg-slate-100 text-slate-500 hover:text-primary'
                    }`}
                  >
                    {tab.label}
                  </button>
                )
              })}
            </div>
            
            {/* Search and Filter - Right side */}
            <div className="flex w-full sm:w-auto flex-row items-center gap-2 ml-auto">
              <div className="flex flex-1 md:flex-none w-full md:w-auto max-w-2xl border border-slate-200 rounded-md overflow-hidden">
                <input
                  type="search"
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  placeholder="Search resources"
                  className="w-full md:w-[350px] px-3 py-2 text-sm text-slate-600 focus:outline-none min-w-0"
                  aria-label="Search resources"
                />
                <button
                  type="button"
                  className="inline-flex h-full -mr-1 items-center justify-center bg-primary px-3 py-2.5 text-white transition hover:bg-primary/90 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                  aria-label="Search"
                >
                  <SearchLg className="h-4 w-4" strokeWidth={2} />
                </button>
              </div>
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="inline-flex shrink-0 h-10 w-10 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-500 transition hover:border-primary/40 hover:text-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                aria-label="Filter resources"
              >
                <FilterLines className="h-4 w-4" strokeWidth={2} />
              </button>
            </div>
          </div>

          {/* Hidden file input */}
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.txt,video/*"
            onChange={handleFileChange}
            className="hidden"
          />

          {/* Content Area with Border */}
          <div className="border border-slate-200 rounded-lg bg-white p-4 md:p-8 min-h-[400px]">
            {/* Folders */}
            {folders.length > 0 && (
              <div className="flex flex-wrap gap-8 mb-6 -mt-4">
                {folders.map((folder) => (
                  <div
                    key={folder.id}
                    onDragOver={handleDragOver}
                    onDrop={() => handleDrop(folder.id)}
                    className="flex flex-col items-center gap-2 cursor-pointer group p-3 rounded-lg transition-colors duration-200 hover:bg-slate-100"
                  >
                    <div className="w-8 h-8 flex items-center justify-center">
                      <Folder className="h-20 w-20 text-primary" />
                    </div>
                    <span className="text-xs font-medium text-slate-700 text-center max-w-[100px] leading-tight">
                      {folder.name}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* Files */}
            {filteredFiles.length > 0 && (
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                {filteredFiles.map((file) => (
                  <div
                    key={file.id}
                    draggable
                    onDragStart={() => handleDragStart(file.id)}
                    className="group flex w-full cursor-move flex-col items-center justify-center gap-2 rounded-lg border border-[#D5D7DA] bg-white p-3"
                  >
                    <div className="relative flex h-40 flex-col items-end justify-between self-stretch rounded-xl pt-1.5 pr-1.5">
                      <div className="absolute left-0 top-0 inline-flex h-40 w-[calc(100%-6px)] items-center justify-center overflow-hidden rounded bg-white">
                        {file.type === 'image' && file.preview ? (
                          <img
                            src={file.preview}
                            alt={file.name}
                            className="relative h-full w-full flex-1 self-stretch rounded border border-black/8 object-cover"
                          />
                        ) : (
                          <div className="relative flex h-full w-full flex-1 items-center justify-center self-stretch rounded border border-black/8 bg-slate-100 text-5xl">
                            {getFileIcon(file)}
                          </div>
                        )}
                      </div>
                      <button
                        type="button"
                        className="relative z-10 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border-none bg-transparent p-0 transition-colors duration-200 group-hover:bg-black/40"
                        onClick={(e) => {
                          e.stopPropagation()
                          // Add menu action here if needed
                        }}
                        aria-label="More options"
                      >
                        <DotsVertical className="h-4 w-4 text-slate-600 transition-colors duration-200 group-hover:text-white" />
                      </button>
                    </div>
                    <div className="w-full break-words text-center text-base font-semibold leading-6 text-[#181D27]" style={{ fontFamily: 'Inter, sans-serif' }}>
                      {file.name}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Empty State */}
            {folders.length === 0 && filteredFiles.length === 0 && (
              <div className="flex min-h-[400px] items-center justify-center text-center">
                <div className="space-y-4">
                  <p className="text-lg font-medium text-slate-600">No resources yet</p>
                  <p className="text-sm text-slate-500">
                    Upload media files or create folders to get started
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

    </div>
  )
}

export default ResourceManagementPage

