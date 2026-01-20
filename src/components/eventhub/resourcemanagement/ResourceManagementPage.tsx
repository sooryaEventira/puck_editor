import React, { useState, useRef, useMemo } from 'react'
import { useEventForm } from '../../../contexts/EventFormContext'
import EventHubNavbar from '../EventHubNavbar'
import EventHubSidebar from '../EventHubSidebar'
import { defaultCards, ContentCard } from '../EventHubContent'
import { InfoCircle, CodeBrowser, Globe01, Folder, Upload01, Plus, DotsVertical, ChevronRight, File01, Image01, SearchLg, FilterLines } from '@untitled-ui/icons-react'
import { Button } from '../../ui/untitled'
import ResourceContextMenu from './ResourceContextMenu'
import MoveToFolderModal from './MoveToFolderModal'
import DeleteConfirmationModal from './DeleteConfirmationModal'
import GalleryShortcutModal from './GalleryShortcutModal'
import RestrictAccessModal from './RestrictAccessModal'
import CreateFolderModal from './CreateFolderModal'

export interface MediaFile {
  id: string
  name: string
  type: 'image' | 'document' | 'video' | 'other'
  file: File
  preview?: string
  folderId?: string | null
}

export interface MediaFolder {
  id: string
  name: string
  files: string[] // Array of file IDs
  parentId?: string | null
}

interface ResourceManagementPageProps {
  eventName?: string
  isDraft?: boolean
  onBackClick?: () => void
  userAvatarUrl?: string
  onCardClick?: (cardId: string) => void
  hideNavbarAndSidebar?: boolean
}

const ResourceManagementPage: React.FC<ResourceManagementPageProps> = ({
  eventName: propEventName,
  isDraft: propIsDraft,
  onBackClick,
  userAvatarUrl,
  onCardClick,
  hideNavbarAndSidebar = false
}) => {
  // Get eventData from context to maintain consistency with EventHubPage navbar
  const { eventData } = useEventForm()
  
  // Use eventData from context, fallback to props if not available
  const eventName = eventData?.eventName || propEventName || 'Highly important conference of 2025'
  const isDraft = propIsDraft !== undefined ? propIsDraft : true
  const [folders, setFolders] = useState<MediaFolder[]>([])
  const [files, setFiles] = useState<MediaFile[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [activeTab, setActiveTab] = useState('all')
  const [draggedFileId, setDraggedFileId] = useState<string | null>(null)
  const [currentFolderId, setCurrentFolderId] = useState<string | null>(null)
  const [contextMenu, setContextMenu] = useState<{
    isOpen: boolean
    x: number
    y: number
    type: 'file' | 'folder'
    id: string
  } | null>(null)
  const [showMoveModal, setShowMoveModal] = useState(false)
  const [fileToMove, setFileToMove] = useState<MediaFile | null>(null)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [itemToDelete, setItemToDelete] = useState<{ id: string; name: string; type: 'folder' | 'file' } | null>(null)
  const [showGalleryShortcutModal, setShowGalleryShortcutModal] = useState(false)
  const [fileForShortcut, setFileForShortcut] = useState<MediaFile | null>(null)
  const [showRestrictAccessModal, setShowRestrictAccessModal] = useState(false)
  const [itemForRestriction, setItemForRestriction] = useState<{ id: string; name: string; type: 'folder' | 'file' } | null>(null)
  const [showCreateFolderModal, setShowCreateFolderModal] = useState(false)
  const [editingFolderId, setEditingFolderId] = useState<string | null>(null)
  const [editingFolderName, setEditingFolderName] = useState('')
  const [editingFileId, setEditingFileId] = useState<string | null>(null)
  const [editingFileName, setEditingFileName] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)
  const folderInputRef = useRef<HTMLInputElement>(null)
  const fileRenameInputRef = useRef<HTMLInputElement>(null)
  const folderCardRefs = useRef<{ [key: string]: HTMLDivElement | null }>({})
  const fileCardRefs = useRef<{ [key: string]: HTMLDivElement | null }>({})

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
    // Open the create folder modal
    setShowCreateFolderModal(true)
  }

  const handleFolderCreate = (folderName: string) => {
    // Generate unique folder name if the provided name already exists
    let finalFolderName = folderName
    let counter = 1
    while (folders.some((f) => f.name === finalFolderName && f.parentId === currentFolderId)) {
      finalFolderName = `${folderName} ${counter}`
      counter++
    }

    const newFolder: MediaFolder = {
      id: `folder-${Date.now()}`,
      name: finalFolderName,
      files: [],
      parentId: currentFolderId
    }
    setFolders([...folders, newFolder])
    setShowCreateFolderModal(false)
  }

  const handleFolderClick = (folderId: string) => {
    setCurrentFolderId(folderId)
  }

  const handleFolderContextMenu = (e: React.MouseEvent, folderId: string) => {
    e.preventDefault()
    e.stopPropagation()
    setContextMenu({
      isOpen: true,
      x: e.clientX,
      y: e.clientY,
      type: 'folder',
      id: folderId
    })
  }

  const handleFileContextMenu = (e: React.MouseEvent, fileId: string) => {
    e.preventDefault()
    e.stopPropagation()
    setContextMenu({
      isOpen: true,
      x: e.clientX,
      y: e.clientY,
      type: 'file',
      id: fileId
    })
  }

  const handleRenameFolder = (folderId: string, newName: string) => {
    if (newName.trim()) {
      setFolders((prev) =>
        prev.map((folder) =>
          folder.id === folderId ? { ...folder, name: newName.trim() } : folder
        )
      )
    }
    setEditingFolderId(null)
    setEditingFolderName('')
  }

  const handleStartRenameFolder = (folderId: string) => {
    const folder = folders.find((f) => f.id === folderId)
    if (folder) {
      setEditingFolderId(folderId)
      setEditingFolderName(folder.name)
      setTimeout(() => {
        folderInputRef.current?.focus()
        folderInputRef.current?.select()
      }, 0)
    }
  }

  const handleCancelRename = () => {
    setEditingFolderId(null)
    setEditingFolderName('')
  }

  const handleRenameKeyDown = (e: React.KeyboardEvent, folderId: string) => {
    if (e.key === 'Enter') {
      handleRenameFolder(folderId, editingFolderName)
    } else if (e.key === 'Escape') {
      handleCancelRename()
    }
  }

  const handleDeleteFolder = (folderId: string) => {
    // Delete all files inside the folder
    setFiles((prev) => prev.filter((file) => file.folderId !== folderId))
    // Delete folder
    setFolders((prev) => prev.filter((folder) => folder.id !== folderId))
  }

  const handleRenameFile = (fileId: string, newName: string) => {
    if (newName.trim()) {
      setFiles((prev) =>
        prev.map((file) => (file.id === fileId ? { ...file, name: newName.trim() } : file))
      )
    }
    setEditingFileId(null)
    setEditingFileName('')
  }

  const handleStartRenameFile = (fileId: string) => {
    const file = files.find((f) => f.id === fileId)
    if (file) {
      setEditingFileId(fileId)
      setEditingFileName(file.name)
      setTimeout(() => {
        fileRenameInputRef.current?.focus()
        fileRenameInputRef.current?.select()
      }, 0)
    }
  }

  const handleCancelRenameFile = () => {
    setEditingFileId(null)
    setEditingFileName('')
  }

  const handleRenameFileKeyDown = (e: React.KeyboardEvent, fileId: string) => {
    if (e.key === 'Enter') {
      handleRenameFile(fileId, editingFileName)
    } else if (e.key === 'Escape') {
      handleCancelRenameFile()
    }
  }

  const handleMoveFile = (fileId: string, targetFolderId: string | null) => {
    setFiles((prev) =>
      prev.map((file) =>
        file.id === fileId ? { ...file, folderId: targetFolderId } : file
      )
    )
  }

  const handleDuplicateFile = (fileId: string) => {
    const file = files.find((f) => f.id === fileId)
    if (file) {
      const duplicatedFile: MediaFile = {
        ...file,
        id: `file-${Date.now()}-${Math.random()}`,
        name: `${file.name.replace(/\.[^/.]+$/, '')} (copy)${file.name.match(/\.[^/.]+$/)?.[0] || ''}`
      }
      setFiles((prev) => [...prev, duplicatedFile])
    }
  }

  const handleDeleteFile = (fileId: string) => {
    setFiles((prev) => prev.filter((file) => file.id !== fileId))
  }

  const getBreadcrumbs = () => {
    const breadcrumbs: Array<{ id: string | null; name: string }> = [
      { id: null, name: 'All media' }
    ]

    if (currentFolderId) {
      const currentFolder = folders.find((f) => f.id === currentFolderId)
      if (currentFolder) {
        breadcrumbs.push({ id: currentFolder.id, name: currentFolder.name })
      }
    }

    return breadcrumbs
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
      if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(fileExtension)) {
        fileType = 'image'
      } else if (['pdf', 'doc', 'docx', 'xls', 'xlsx', 'txt'].includes(fileExtension)) {
        fileType = 'document'
      } else if (['mp4', 'avi', 'mov', 'wmv', 'flv', 'webm'].includes(fileExtension)) {
        fileType = 'video'
      }

      const mediaFile: MediaFile = {
        id: fileId,
        name: file.name,
        type: fileType,
        file: file,
        preview: fileType === 'image' ? URL.createObjectURL(file) : undefined,
        folderId: currentFolderId
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
      return <Image01 className="h-12 w-12 text-slate-400" />
    } else if (file.type === 'document') {
      return <File01 className="h-12 w-12 text-slate-400" />
    } else if (file.type === 'video') {
      return <File01 className="h-12 w-12 text-slate-400" />
    }
    return <File01 className="h-12 w-12 text-slate-400" />
  }

  const getContextMenuOptions = () => {
    if (!contextMenu) return []

    if (contextMenu.type === 'folder') {
      const folder = folders.find((f) => f.id === contextMenu.id)
      if (!folder) return []

      return [
        {
          label: 'Rename',
          action: () => {
            handleStartRenameFolder(folder.id)
          }
        },
        {
          label: 'Delete',
          action: () => {
            setItemToDelete({ id: folder.id, name: folder.name, type: 'folder' })
            setShowDeleteModal(true)
          },
          variant: 'destructive' as const
        }
      ]
    } else {
      const file = files.find((f) => f.id === contextMenu.id)
      if (!file) return []

      return [
        {
          label: 'Rename',
          action: () => {
            handleStartRenameFile(file.id)
          }
        },
        {
          label: 'Move to folder',
          action: () => {
            setFileToMove(file)
            setShowMoveModal(true)
          }
        },
        {
          label: 'Duplicate',
          action: () => handleDuplicateFile(file.id)
        },
        {
          label: 'Share/Gallery shortcut',
          action: () => {
            setFileForShortcut(file)
            setShowGalleryShortcutModal(true)
          }
        },
        {
          label: 'Restrict access',
          action: () => {
            setItemForRestriction({ id: file.id, name: file.name, type: 'file' })
            setShowRestrictAccessModal(true)
          }
        },
        {
          label: 'Delete',
          action: () => {
            setItemToDelete({ id: file.id, name: file.name, type: 'file' })
            setShowDeleteModal(true)
          },
          variant: 'destructive' as const
        }
      ]
    }
  }

  const filteredFolders = useMemo(() => {
    let filtered = folders.filter((folder) => folder.parentId === currentFolderId)
    if (searchQuery) {
      filtered = filtered.filter((folder) =>
        folder.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }
    return filtered
  }, [folders, currentFolderId, searchQuery])

  const filteredFiles = useMemo(() => {
    let filtered = files.filter((file) => file.folderId === currentFolderId)
    if (activeTab !== 'all') {
      filtered = filtered.filter((file) => file.type === activeTab)
    }
    if (searchQuery) {
      filtered = filtered.filter((file) =>
        file.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }
    return filtered
  }, [files, currentFolderId, activeTab, searchQuery])

  const handleFilterClick = () => {
    // TODO: Implement filter functionality
    console.log('Filter clicked')
  }

  return (
    <div className="min-h-screen overflow-x-hidden bg-white">
      {!hideNavbarAndSidebar && (
        <>
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
        </>
      )}

      {/* Main Content */}
      <div className={hideNavbarAndSidebar ? "" : "md:pl-[250px]"}>
        <div className="space-y-6 px-4 pb-12 pt-8 md:px-10 lg:px-16">
          {/* Header */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-6">
            <h1 className="text-[26px] font-bold text-primary-dark">Resource Management</h1>
            <div className="flex items-center gap-3">
              <Button
                variant="secondary"
                onClick={handleUploadClick}
                iconLeading={<Upload01 className="h-4 w-4" />}
              >
                Upload
              </Button>
              <Button
                variant="primary"
                onClick={handleCreateFolder}
                iconLeading={<Plus className="h-4 w-4" />}
              >
                New folder
              </Button>
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

          {/* Tab, Search and Filter - Outside Border */}
          <div className="flex flex-col sm:flex-row items-end sm:items-center justify-between gap-3 mb-0">
            {/* Tab */}
            <div className="flex items-end -mb-16">
              <button
                type="button"
                onClick={() => setActiveTab('all')}
                className={`text-sm font-medium transition-colors pb-2 ${
                  activeTab === 'all'
                    ? 'text-primary border-b-2 border-primary'
                    : 'text-slate-600 hover:text-primary'
                }`}
              >
                All media
              </button>
            </div>

            {/* Search and Filter */}
            <div className="flex items-center gap-2 w-full sm:w-auto">
              {/* Search Input with Button */}
              <div className="flex flex-1 sm:flex-none items-center border border-slate-200 rounded-lg overflow-hidden bg-white">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search resources"
                  className="px-3 py-2 text-sm text-slate-600 placeholder:text-slate-400 focus:outline-none w-full sm:w-[300px] border-0"
                />
                <button
                  type="button"
                  className="inline-flex h-10 w-10 items-center justify-center bg-primary text-white transition hover:bg-primary/90 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 flex-shrink-0 rounded-none"
                  aria-label="Search"
                >
                  <SearchLg className="h-4 w-4" strokeWidth={2} />
                </button>
              </div>

              {/* Filter Button */}
              <button
                type="button"
                onClick={handleFilterClick}
                className="inline-flex shrink-0 h-10 w-10 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 transition hover:border-primary/40 hover:text-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                aria-label="Filter resources"
              >
                <FilterLines className="h-4 w-4" strokeWidth={2} />
              </button>
            </div>
          </div>

          {/* Content Area with Border */}
          <div className="border border-slate-200 rounded-lg bg-white min-h-[400px]">
            
            {/* Breadcrumbs */}
            {currentFolderId && (
              <div className="px-4 md:px-8 pt-4 pb-2 border-b border-slate-200">
                <div className="flex items-center gap-2 text-sm">
                  {getBreadcrumbs().map((crumb, index) => (
                    <React.Fragment key={crumb.id || 'root'}>
                      {index > 0 && <ChevronRight className="h-4 w-4 text-slate-400" />}
                      <button
                        type="button"
                        onClick={() => setCurrentFolderId(crumb.id)}
                        className={`${
                          index === getBreadcrumbs().length - 1
                            ? 'text-slate-900 font-medium'
                            : 'text-slate-600 hover:text-primary'
                        }`}
                      >
                        {crumb.name}
                      </button>
                    </React.Fragment>
                  ))}
                </div>
              </div>
            )}
            
            {/* Content */}
            <div className="p-4 md:p-8">
              {/* Folders */}
              {filteredFolders.length > 0 && (
                <div className="flex flex-wrap gap-4 mb-6">
                  {filteredFolders.map((folder) => (
                    <div
                      key={folder.id}
                      ref={(el) => (folderCardRefs.current[folder.id] = el)}
                      className="group relative inline-flex flex-col items-center gap-2 p-3 hover:bg-primary/10 bg-white  hover:shadow-md transition-all "
                      onContextMenu={(e) => handleFolderContextMenu(e, folder.id)}
                      onDragOver={handleDragOver}
                      onDrop={() => handleDrop(folder.id)}
                    >
                      <div 
                        className="w-10 h-10 flex items-center justify-center cursor-pointer"
                        onClick={() => {
                          if (editingFolderId !== folder.id) {
                            handleFolderClick(folder.id)
                          }
                        }}
                      >
                        <Folder className="h-8 w-8 text-primary" />
                      </div>
                      {editingFolderId === folder.id ? (
                        <input
                          ref={folderInputRef}
                          type="text"
                          value={editingFolderName}
                          onChange={(e) => setEditingFolderName(e.target.value)}
                          onBlur={() => handleRenameFolder(folder.id, editingFolderName)}
                          onKeyDown={(e) => handleRenameKeyDown(e, folder.id)}
                          className="text-sm font-medium text-slate-700 text-center max-w-[80px] px-1 py-0.5  focus:outline-none focus:ring-1 focus:ring-primary"
                          onClick={(e) => e.stopPropagation()}
                        />
                      ) : (
                        <span 
                          className="text-sm font-medium text-slate-700 text-center max-w-[100px] line-clamp-2 cursor-pointer"
                          onClick={() => {
                            if (editingFolderId !== folder.id) {
                              handleFolderClick(folder.id)
                            }
                          }}
                        >
                          {folder.name}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Files */}
              {filteredFiles.length > 0 && (
                <div className="grid grid-cols-2  sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8">
                  {filteredFiles.map((file) => (
                    <div
                      key={file.id}
                      ref={(el) => (fileCardRefs.current[file.id] = el)}
                      draggable
                      onDragStart={() => handleDragStart(file.id)}
                      className="group relative flex w-32 cursor-move flex-col items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white p-2 hover:shadow-md transition-all"
                      onContextMenu={(e) => handleFileContextMenu(e, file.id)}
                    >
                      <div className="relative flex h-24 w-full flex-col items-end justify-between rounded-lg overflow-hidden bg-slate-50 flex-shrink-0">
                        {file.type === 'image' && file.preview ? (
                          <img
                            src={file.preview}
                            alt={file.name}
                            className="absolute inset-0 h-full w-full object-cover"
                          />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center">
                            {getFileIcon(file)}
                          </div>
                        )}
                        <button
                          type="button"
                          className="relative z-10 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-white/90 backdrop-blur-sm border border-slate-300 p-0 transition-all opacity-0 group-hover:opacity-100 hover:bg-white"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleFileContextMenu(e, file.id)
                          }}
                          aria-label="More options"
                        >
                          <DotsVertical className="h-4 w-4 text-slate-600" />
                        </button>
                      </div>
                      {editingFileId === file.id ? (
                        <input
                          ref={fileRenameInputRef}
                          type="text"
                          value={editingFileName}
                          onChange={(e) => setEditingFileName(e.target.value)}
                          onBlur={() => handleRenameFile(file.id, editingFileName)}
                          onKeyDown={(e) => handleRenameFileKeyDown(e, file.id)}
                          className="w-full text-xs font-medium text-slate-700 text-center px-1 py-0.5 rounded border border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                          onClick={(e) => e.stopPropagation()}
                        />
                      ) : (
                        <div className="w-full break-words text-center text-xs font-medium text-slate-700 line-clamp-2 min-h-[2rem] flex items-center justify-center">
                          {file.name}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Empty State */}
              {filteredFolders.length === 0 && filteredFiles.length === 0 && (
                <div className="flex min-h-[400px] items-center justify-center text-center">
                  <div className="space-y-4">
                    <Folder className="h-16 w-16 text-slate-400 mx-auto" />
                    <div>
                      <p className="text-lg font-medium text-slate-600">No files found</p>
                      <p className="text-sm text-slate-500 mt-1">
                        {searchQuery
                          ? 'Try adjusting your search terms'
                          : 'Upload media files or create folders to get started'}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Context Menu */}
          {contextMenu && (
            <ResourceContextMenu
              isOpen={contextMenu.isOpen}
              onClose={() => setContextMenu(null)}
              options={getContextMenuOptions()}
              position={{ x: contextMenu.x, y: contextMenu.y }}
            />
          )}

          {/* Move to Folder Modal */}
          <MoveToFolderModal
            isVisible={showMoveModal}
            onClose={() => {
              setShowMoveModal(false)
              setFileToMove(null)
            }}
            onMove={(folderId) => {
              if (fileToMove) {
                handleMoveFile(fileToMove.id, folderId)
                setFileToMove(null)
              }
            }}
            folders={folders}
            currentFolderId={fileToMove?.folderId || undefined}
            fileName={fileToMove?.name || ''}
          />

          {/* Delete Confirmation Modal */}
          <DeleteConfirmationModal
            isVisible={showDeleteModal}
            onClose={() => {
              setShowDeleteModal(false)
              setItemToDelete(null)
            }}
            onConfirm={() => {
              if (itemToDelete) {
                if (itemToDelete.type === 'folder') {
                  handleDeleteFolder(itemToDelete.id)
                } else {
                  handleDeleteFile(itemToDelete.id)
                }
              }
            }}
            itemName={itemToDelete?.name || ''}
            itemType={itemToDelete?.type || 'file'}
          />

          {/* Gallery/Shortcut Modal */}
          <GalleryShortcutModal
            isVisible={showGalleryShortcutModal}
            onClose={() => {
              setShowGalleryShortcutModal(false)
              setFileForShortcut(null)
            }}
            onSave={(shortcutName, displayType) => {
              // TODO: Implement save shortcut functionality
              console.log('Save shortcut:', { shortcutName, displayType, file: fileForShortcut?.name })
            }}
            fileName={fileForShortcut?.name}
          />

          {/* Restrict Access Modal */}
          <RestrictAccessModal
            isVisible={showRestrictAccessModal}
            onClose={() => {
              setShowRestrictAccessModal(false)
              setItemForRestriction(null)
            }}
            onSave={(visibility, groups, applyToSubFolders) => {
              // TODO: Implement restrict access functionality
              console.log('Restrict access:', { visibility, groups, applyToSubFolders, item: itemForRestriction })
            }}
            itemName={itemForRestriction?.name}
            itemType={itemForRestriction?.type || 'folder'}
          />

          {/* Create Folder Modal */}
          <CreateFolderModal
            isVisible={showCreateFolderModal}
            onClose={() => setShowCreateFolderModal(false)}
            onCreate={handleFolderCreate}
          />
        </div>
      </div>
    </div>
  )
}

export default ResourceManagementPage

