import { useState, useEffect } from 'react'
import { Page } from '../types'
import { logger } from '../utils/logger'
import { API_ENDPOINTS } from '../config/env'

// Function to convert HeadingBlock to Heading for compatibility
const convertHeadingBlock = (item: any) => {
  if (item.type === "HeadingBlock") {
    return {
      type: "Heading",
      props: {
        text: item.props.title,
        level: 1,
        color: '#333',
        align: 'left' as const
      }
    }
  }
  return item
}

// Function to convert JSON structure to Puck-compatible format
const convertJsonToPuckData = (jsonData: any, pageKey: string = 'home') => {
  const page = jsonData[pageKey]
  if (!page || !page.data || !page.data["/"]) {
    return { content: [], root: { props: {} }, zones: {} }
  }
  
  const puckData = page.data["/"]
  const convertedContent = puckData.content?.map(convertHeadingBlock) || []
  
  // Ensure each content item has a proper id
  const contentWithIds = convertedContent.map((item: any, index: number) => ({
    ...item,
    id: item.id || `${item.type}-${index}-${Date.now()}`
  }))
  
  return {
    content: contentWithIds,
    root: {
      props: puckData.root?.props || {}
    },
    zones: puckData.zones || {}
  }
}

// Function to convert JSON structure to pages list
const convertJsonToPagesList = (jsonData: any): Page[] => {
  return Object.keys(jsonData).map(key => {
    const page = jsonData[key]
    return {
      id: key,
      name: page.title,
      filename: `${key}.json`,
      lastModified: new Date().toISOString()
    }
  })
}

const defaultPage1Data = {
  content: [],
  root: { props: { title: 'Page 1', pageTitle: 'Page 1' } },
  zones: {}
}

export const usePageManagement = () => {
  const [currentData, setCurrentData] = useState<any>(defaultPage1Data)
  const [currentPage, setCurrentPage] = useState('page1')
  const [currentPageName, setCurrentPageName] = useState('Page 1')
  const [pages, setPages] = useState<Page[]>([])
  const [showPageManager, setShowPageManager] = useState(false)
  const [showPageNameDialog, setShowPageNameDialog] = useState(false)

  // Function to load all pages from server
  const loadPages = async () => {
    try {
      const response = await fetch(API_ENDPOINTS.GET_PAGES)
      const result = await response.json()
      
      if (result.success) {
        // Load page data for each page to get the actual pageTitle
        const pageListPromises = result.pages.map(async (page: any) => {
          let pageName = page.filename.replace('.json', '')
          
          // Try to load the actual page data to get the pageTitle
          try {
            const pageResponse = await fetch(API_ENDPOINTS.GET_PAGE(page.filename))
            if (pageResponse.ok) {
              const pageResult = await pageResponse.json()
              if (pageResult.success && pageResult.data?.root?.props) {
                const pageTitle = pageResult.data.root.props.pageTitle || pageResult.data.root.props.title
                if (pageTitle) {
                  pageName = pageTitle
                }
              }
            }
          } catch (error) {
            // If loading fails, fall back to filename-based extraction
            logger.debug('Could not load page data for', page.filename, error)
          }
          
          // Fallback to filename-based extraction if no pageTitle found
          if (!pageName || pageName === page.filename.replace('.json', '')) {
            if (pageName.startsWith('page-data-')) {
              pageName = pageName.replace('page-data-', '').replace(/-/g, ' ')
            }
            if (pageName.startsWith('page-')) {
              pageName = pageName.replace('page-', '').replace(/-/g, ' ')
              // Remove timestamp pattern (digits at the end)
              pageName = pageName.replace(/-\d+$/, '').replace(/-/g, ' ')
            }
            // Capitalize first letter
            pageName = pageName.charAt(0).toUpperCase() + pageName.slice(1)
          }
          
          return {
            id: page.filename.replace('.json', ''),
            name: pageName,
            filename: page.filename,
            lastModified: page.modified
          }
        })
        
        const pageList = await Promise.all(pageListPromises)
        // Sort pages in ascending order by name (alphabetically)
        const sortedPageList = pageList.sort((a, b) => {
          return a.name.localeCompare(b.name, undefined, { numeric: true, sensitivity: 'base' })
        })
        setPages(sortedPageList)
      } else {
        setPages([])
      }
    } catch (error) {
      logger.error('Error loading pages:', error)
      setPages([])
    }
  }

  // Function to load a specific page
  const loadPage = async (filename: string) => {
    logger.debug('loadPage called with filename:', filename)
    try {
      const pageId = filename.replace('.json', '')
      
      // Load from server
      const serverFilename = filename.endsWith('.json') ? filename : `${filename}.json`
      logger.debug('Loading from server:', API_ENDPOINTS.GET_PAGE(serverFilename))
      const response = await fetch(API_ENDPOINTS.GET_PAGE(serverFilename))
      logger.debug('Server response status:', response.status)
      
      if (response.ok) {
        const result = await response.json()
        logger.debug('Server response data:', result)
        
        if (result.success) {
          setCurrentData(result.data)
          setCurrentPage(pageId)
          
          // Find the page name from the pages list
          const page = pages.find(p => p.filename === serverFilename || p.filename === filename)
          if (page) {
            setCurrentPageName(page.name)
          } else {
            const pageTitle = result.data?.root?.props?.pageTitle || result.data?.root?.props?.title
            if (pageTitle) {
              setCurrentPageName(pageTitle)
            } else {
              setCurrentPageName(pageId.replace('page-data-', '').replace(/-/g, ' '))
            }
          }
          
          setShowPageManager(false)
          return result.data
        } else {
          logger.error('Server returned error:', result.error)
        }
      } else {
        logger.error('Server response not ok:', response.status, response.statusText)
      }
    } catch (error) {
      logger.error('Error loading page:', error)
    }
    return null // Return null if loading fails
  }

  // Function to create a new page
  const createNewPage = () => {
    // Create a proper Puck data structure with all required properties
    const newPageData = {
      content: [],
      root: {
        props: {
          title: 'New Page'
        }
      },
      zones: {}
    }
    // Force a complete reset by setting data first, then updating page info
    setCurrentData(newPageData)
    setCurrentPage(`new-page-${Date.now()}`) // Use timestamp to ensure unique page ID
    setCurrentPageName('New Page')
    setShowPageManager(false)
    setShowPageNameDialog(true)
  }

  // Function to confirm new page creation
  const confirmNewPage = (pageName: string) => {
    setCurrentPageName(pageName)
    // Update the current page ID to use the sanitized page name
    const sanitizedName = pageName.toLowerCase().replace(/[^a-z0-9]/g, '-')
    setCurrentPage(`new-page-${sanitizedName}`)
    // Update the canvas title to match the page name
    setCurrentData((prevData: any) => ({
      ...prevData,
      root: {
        ...prevData.root,
        props: {
          ...prevData.root?.props,
          title: pageName
        }
      }
    }))
    setShowPageNameDialog(false)
  }

  const createPageFromTemplate = async (templateType: string) => {
    const templateNames: Record<string, string> = {
      'schedule': 'Schedule',
      'sponsor': 'Sponsor',
      'floor-plan': 'Floor plan',
      'lists': 'Lists'
    }
    
    const pageName = templateNames[templateType] || templateType
    const sanitizedName = pageName.toLowerCase().replace(/[^a-z0-9]/g, '-')
    const pageId = `page-${sanitizedName}-${Date.now()}`
    
    const newPageData = {
      content: [],
      root: {
        props: {
          title: pageName,
          pageTitle: pageName,
          ...(templateType === 'schedule' ? { pageType: 'schedule' } : {})
        }
      },
      zones: {}
    }
    
    setCurrentData(newPageData)
    setCurrentPage(pageId)
    setCurrentPageName(pageName)
    
    const newPage: Page = {
      id: pageId,
      name: pageName,
      filename: `${pageId}.json`,
      lastModified: new Date().toISOString()
    }
    
    setPages(prev => [...prev, newPage])
    
    try {
      const response = await fetch(API_ENDPOINTS.SAVE_PAGE, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          data: newPageData,
          filename: `${pageId}.json`
        })
      })
      
      if (response.ok) {
        await loadPages()
      }
    } catch (error) {
      logger.error('Error saving template page:', error)
    }
    
    return { pageId, pageName, newPageData }
  }

  useEffect(() => {
    const initializePage = async () => {
      await loadPages()
      
      // Try to load page1 if it exists, otherwise create it
      try {
        const response = await fetch(API_ENDPOINTS.GET_PAGE('page1.json'))
        if (response.ok) {
          const result = await response.json()
          if (result.success) {
            setCurrentData(result.data)
            setCurrentPage('page1')
            const pageTitle = result.data?.root?.props?.pageTitle || result.data?.root?.props?.title || 'Page 1'
            setCurrentPageName(pageTitle)
          }
        } else {
          // Page1 doesn't exist, create it
          const page1Data = defaultPage1Data
          setCurrentData(page1Data)
          setCurrentPage('page1')
          setCurrentPageName('Page 1')
          
          // Save page1 to server
          try {
            await fetch(API_ENDPOINTS.SAVE_PAGE, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                data: page1Data,
                filename: 'page1.json'
              })
            })
            await loadPages()
          } catch (error) {
            logger.error('Error creating page1:', error)
          }
        }
      } catch (error) {
        logger.error('Error initializing page1:', error)
      }
    }
    
    initializePage()
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
    confirmNewPage,
    createPageFromTemplate
  }
}
