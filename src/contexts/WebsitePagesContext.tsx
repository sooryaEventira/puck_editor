import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'

export interface WebsitePage {
  id: string
  name: string
  slug: string
  source: 'default-template' | 'scratch' | 'modal-created' | 'advanced-component'
  createdAt: string
  type?: string // e.g., 'schedule', 'welcome'
  component?: string // e.g., 'SchedulePage'
}

interface WebsitePagesContextType {
  pages: WebsitePage[]
  addPage: (page: Omit<WebsitePage, 'createdAt'>) => void
  updatePage: (id: string, updates: Partial<WebsitePage>) => void
  deletePage: (id: string) => void
  duplicatePage: (id: string) => void
  getPageById: (id: string) => WebsitePage | undefined
  initializePages: (templateType: 'default-template' | 'scratch') => void
}

const WebsitePagesContext = createContext<WebsitePagesContextType | undefined>(undefined)

const STORAGE_KEY = 'website-pages'

// Helper to generate slug from name
const generateSlug = (name: string): string => {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

// Helper to ensure unique page name
const ensureUniqueName = (name: string, existingPages: WebsitePage[]): string => {
  let uniqueName = name
  let counter = 1
  
  while (existingPages.some(p => p.name === uniqueName)) {
    uniqueName = `${name} ${counter}`
    counter++
  }
  
  return uniqueName
}

export const WebsitePagesProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [pages, setPages] = useState<WebsitePage[]>(() => {
    // Load from localStorage on mount
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      try {
        return JSON.parse(stored)
      } catch {
        return []
      }
    }
    return []
  })

  // Save to localStorage whenever pages change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(pages))
  }, [pages])

  const addPage = (page: Omit<WebsitePage, 'createdAt'>) => {
    setPages(prev => {
      const uniqueName = ensureUniqueName(page.name, prev)
      const newPage: WebsitePage = {
        ...page,
        name: uniqueName,
        slug: generateSlug(uniqueName),
        createdAt: new Date().toISOString()
      }
      return [...prev, newPage]
    })
  }

  const updatePage = (id: string, updates: Partial<WebsitePage>) => {
    setPages(prev =>
      prev.map(page => {
        if (page.id === id) {
          const updated = { ...page, ...updates }
          // Regenerate slug if name changed
          if (updates.name && updates.name !== page.name) {
            updated.slug = generateSlug(updates.name)
          }
          return updated
        }
        return page
      })
    )
  }

  const deletePage = (id: string) => {
    setPages(prev => prev.filter(page => page.id !== id))
  }

  const duplicatePage = (id: string) => {
    setPages(prev => {
      const pageToDuplicate = prev.find(p => p.id === id)
      if (!pageToDuplicate) return prev

      const baseName = pageToDuplicate.name
      const uniqueName = ensureUniqueName(baseName, prev)
      
      const duplicatedPage: WebsitePage = {
        id: `page-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        name: uniqueName,
        slug: generateSlug(uniqueName),
        source: 'modal-created', // Duplicated pages are considered modal-created
        createdAt: new Date().toISOString()
      }
      
      return [...prev, duplicatedPage]
    })
  }

  const getPageById = (id: string) => {
    return pages.find(p => p.id === id)
  }

  const initializePages = (templateType: 'default-template' | 'scratch') => {
    // Only initialize if pages array is empty
    if (pages.length > 0) return

    if (templateType === 'default-template') {
      // Create Welcome page for default template
      const welcomePage: WebsitePage = {
        id: 'welcome',
        name: 'Welcome',
        slug: 'welcome',
        source: 'default-template',
        createdAt: new Date().toISOString()
      }
      setPages([welcomePage])
    } else {
      // Create Page1 for scratch
      const page1: WebsitePage = {
        id: 'page1',
        name: 'Page1',
        slug: 'page1',
        source: 'scratch',
        createdAt: new Date().toISOString()
      }
      setPages([page1])
    }
  }

  return (
    <WebsitePagesContext.Provider
      value={{
        pages,
        addPage,
        updatePage,
        deletePage,
        duplicatePage,
        getPageById,
        initializePages
      }}
    >
      {children}
    </WebsitePagesContext.Provider>
  )
}

export const useWebsitePages = () => {
  const context = useContext(WebsitePagesContext)
  if (context === undefined) {
    throw new Error('useWebsitePages must be used within a WebsitePagesProvider')
  }
  return context
}

