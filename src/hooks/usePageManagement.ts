import { useState, useEffect } from 'react'
import { Page, PageData } from '../types'

export const usePageManagement = () => {
  const [currentData, setCurrentData] = useState<PageData>({ content: [], root: { props: {} } })
  const [currentPage, setCurrentPage] = useState('home')
  const [currentPageName, setCurrentPageName] = useState('Home Page')
  const [pages, setPages] = useState<Page[]>([])
  const [showPageManager, setShowPageManager] = useState(false)
  const [showPageNameDialog, setShowPageNameDialog] = useState(false)

  // Function to load all pages from server
  const loadPages = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/pages')
      const result = await response.json()
      
      if (result.success) {
        const pageList = result.pages.map((page: any) => {
          // Try to extract page name from filename or use a default
          let pageName = page.filename.replace('.json', '')
          if (pageName.startsWith('page-data-')) {
            pageName = pageName.replace('page-data-', '').replace(/-/g, ' ')
          }
          return {
            id: page.filename.replace('.json', ''),
            name: pageName,
            filename: page.filename,
            lastModified: page.modified
          }
        })
        setPages(pageList)
      }
    } catch (error) {
      console.error('Error loading pages:', error)
    }
  }

  // Function to load a specific page
  const loadPage = async (filename: string) => {
    try {
      const response = await fetch(`http://localhost:3001/api/pages/${filename}`)
      const result = await response.json()
      
      if (result.success) {
        setCurrentData(result.data)
        const pageId = filename.replace('.json', '')
        setCurrentPage(pageId)
        
        // Find the page name from the pages list
        const page = pages.find(p => p.filename === filename)
        if (page) {
          setCurrentPageName(page.name)
        } else {
          setCurrentPageName(pageId.replace('page-data-', '').replace(/-/g, ' '))
        }
        
        setShowPageManager(false)
      }
    } catch (error) {
      console.error('Error loading page:', error)
    }
  }

  // Function to create a new page
  const createNewPage = () => {
    setCurrentData({ content: [], root: { props: {} } })
    setCurrentPage('new-page')
    setCurrentPageName('New Page')
    setShowPageManager(false)
    setShowPageNameDialog(true)
  }

  // Function to confirm new page creation
  const confirmNewPage = (pageName: string) => {
    setCurrentPageName(pageName)
    setShowPageNameDialog(false)
  }

  // Load pages on component mount
  useEffect(() => {
    loadPages()
  }, [])

  return {
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
  }
}
