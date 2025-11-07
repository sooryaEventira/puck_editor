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

  const getPageTitleFromData = (data: any): string | undefined => {
    if (!data || !data.root || !data.root.props) {
      return undefined
    }

    const { pageTitle, title } = data.root.props

    if (typeof pageTitle === 'string' && pageTitle.trim()) {
      return pageTitle.trim()
    }

    if (typeof title === 'string' && title.trim()) {
      return title.trim()
    }

    return undefined
  }

  const getCachedPageData = (pageId: string): any | null => {
    try {
      const cacheKey = `puck-page-${pageId}`
      const cachedString = localStorage.getItem(cacheKey)
      if (!cachedString) {
        return null
      }
      return JSON.parse(cachedString)
    } catch (error) {
      logger.debug('getCachedPageData: Failed to parse cached data for', pageId, error)
      return null
    }
  }

  const applyServerDataForPage = (pageId: string, serverData: any) => {
    if (!serverData) {
      return
    }

    const cacheKey = `puck-page-${pageId}`
    const cachedData = getCachedPageData(pageId)
    const cachedTitle = getPageTitleFromData(cachedData)

    let mergedDataForCache: any = null
    let resolvedTitle: string | undefined

    setCurrentData((prevData: any) => {
      const prevTitle = getPageTitleFromData(prevData)
      const serverTitle = getPageTitleFromData(serverData)

      const fallbackTitle = pageId === 'page1'
        ? 'Page 1'
        : pageId
            .replace(/^page-/, '')
            .replace(/-/g, ' ')

      resolvedTitle = cachedTitle || prevTitle || serverTitle || fallbackTitle

      const mergedProps = {
        ...(serverData?.root?.props || {})
      }

      if (resolvedTitle) {
        mergedProps.pageTitle = resolvedTitle
        if (!mergedProps.title || !mergedProps.title.trim() || mergedProps.title.trim() === serverTitle) {
          mergedProps.title = resolvedTitle
        }
      }

      mergedDataForCache = {
        ...serverData,
        root: {
          ...serverData?.root,
          props: mergedProps
        }
      }

      return mergedDataForCache
    })

    if (mergedDataForCache) {
      try {
        localStorage.setItem(cacheKey, JSON.stringify(mergedDataForCache))
      } catch (error) {
        logger.debug('applyServerDataForPage: Failed to cache merged data for', pageId, error)
      }
    }

    if (resolvedTitle && resolvedTitle !== currentPageName) {
      setCurrentPageName(resolvedTitle)
    }
  }

  // Keep page name state in sync with the currently loaded page data
  useEffect(() => {
    if (!currentPage || !currentData?.root?.props) {
      return
    }

    const rawTitle = currentData.root.props.pageTitle ?? currentData.root.props.title
    if (!rawTitle || typeof rawTitle !== 'string') {
      return
    }

    const normalizedTitle = rawTitle.trim()
    if (!normalizedTitle) {
      return
    }

    if (normalizedTitle !== currentPageName) {
      setCurrentPageName(normalizedTitle)
    }

    setPages(prevPages => {
      const pageId = currentPage
      const filename = pageId.endsWith('.json') ? pageId : `${pageId}.json`

      const existingIndex = prevPages.findIndex(
        page => page.id === pageId || page.filename === filename
      )

      if (existingIndex === -1) {
        return [
          ...prevPages,
          {
            id: pageId,
            name: normalizedTitle,
            filename,
            lastModified: new Date().toISOString()
          }
        ]
      }

      const existingPage = prevPages[existingIndex]
      if (existingPage.name === normalizedTitle) {
        return prevPages
      }

      const updatedPages = [...prevPages]
      updatedPages[existingIndex] = {
        ...existingPage,
        name: normalizedTitle,
        lastModified: new Date().toISOString()
      }

      return updatedPages
    })
  }, [currentData, currentPage, currentPageName])

  // Function to load all pages from server
  const loadPages = async () => {
    try {
      const response = await fetch(API_ENDPOINTS.GET_PAGES)
      const result = await response.json()
      
      if (result.success) {
        // Load page data for each page to get the actual pageTitle
        const pageListPromises = result.pages.map(async (page: any) => {
          let pageName = page.filename.replace('.json', '')
          const pageIdFromFilename = page.filename.replace('.json', '')
          
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
          
          const cachedData = getCachedPageData(pageIdFromFilename)
          const cachedTitle = getPageTitleFromData(cachedData)

          if (cachedTitle) {
            const trimmedCachedTitle = cachedTitle.trim()
            if (trimmedCachedTitle && trimmedCachedTitle !== pageName) {
              pageName = trimmedCachedTitle
            }
          }

          // Prefer cached local title if available (handles unsaved renames)
          if (!pageName || pageName === page.filename.replace('.json', '')) {
            if (cachedTitle) {
              pageName = cachedTitle
            }
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
        
        // Merge with existing pages to preserve pages that might not be on server yet
        setPages(prevPages => {
          logger.debug('loadPages: Merging pages. Prev pages:', prevPages.map(p => `${p.name} (${p.id})`), 'Server pages:', pageList.map((p: Page) => `${p.name} (${p.id})`))
          
          // Start with all existing pages - preserve everything
          const mergedMap = new Map<string, Page>()
          
          // Add all existing pages first (preserve them) - this is critical!
          // Pages that haven't been saved to server yet will be preserved
          prevPages.forEach(page => {
            mergedMap.set(page.id, page)
          })
          
          // Add/update with server pages (by ID)
          // This will update existing pages with server data, but won't remove pages not on server
          pageList.forEach((serverPage: Page) => {
            // If we already have a page with this ID, update it with server data
            // If not, add it as a new page from server
            if (mergedMap.has(serverPage.id)) {
              // Update existing page with server data (might have updated name, etc.)
              mergedMap.set(serverPage.id, serverPage)
            } else {
              // New page from server, add it
              mergedMap.set(serverPage.id, serverPage)
            }
          })
          
          // Also check for pages with same name but different ID (handle ID mismatches)
          pageList.forEach((serverPage: Page) => {
            const existingWithSameName = Array.from(mergedMap.values()).find(
              p => p.name === serverPage.name && p.id !== serverPage.id
            )
            if (existingWithSameName) {
              // If server page has newer data, update but keep the existing ID
              // This prevents duplicates when IDs don't match
              mergedMap.set(existingWithSameName.id, { ...serverPage, id: existingWithSameName.id })
            }
          })
          
          // Convert to array, remove duplicates, and sort
          const mergedPages = Array.from(mergedMap.values())
          const uniquePages = mergedPages.filter((page, index, self) => 
            self.findIndex(p => p.id === page.id) === index
          )
          
          const sortedPageList = uniquePages.sort((a, b) => {
            return a.name.localeCompare(b.name, undefined, { numeric: true, sensitivity: 'base' })
          })
          
          logger.debug('loadPages: Final merged pages:', sortedPageList.map(p => `${p.name} (${p.id})`))
          return sortedPageList
        })
      } else {
        // Don't clear pages on error - preserve existing pages
        logger.warn('loadPages: Server returned unsuccessful response, preserving existing pages')
      }
    } catch (error) {
      logger.error('Error loading pages:', error)
      // Don't clear pages on error - preserve existing pages
      // setPages([]) // Removed - this was causing pages to disappear
    }
  }

  // Function to load a specific page
  const loadPage = async (filename: string) => {
    logger.debug('loadPage called with filename:', filename)
    logger.debug('loadPage: Current pages array:', pages.map(p => `${p.name} (${p.id}) - ${p.filename}`))
    
    const pageId = filename.replace('.json', '')
    const serverFilename = filename.endsWith('.json') ? filename : `${filename}.json`
    
    // First, try to find the page in the pages array
    const pageInArray = pages.find(p => 
      p.filename === serverFilename || 
      p.filename === filename ||
      p.id === pageId ||
      p.id === filename
    )
    
    // If page is in array, try to load from localStorage first, then server
    if (pageInArray) {
      logger.debug('loadPage: Page found in array, checking localStorage first')
      
      // Check localStorage for cached data
      const cachedDataKey = `puck-page-${pageId}`
      const cachedData = localStorage.getItem(cachedDataKey)
      
      let initialData = null
      if (cachedData) {
        try {
          initialData = JSON.parse(cachedData)
          logger.debug('loadPage: Found cached data in localStorage')
        } catch (e) {
          logger.warn('loadPage: Failed to parse cached data:', e)
        }
      }
      
      // If no cached data, use default empty data
      if (!initialData) {
        initialData = {
          content: [],
          root: {
            props: {
              title: pageInArray.name,
              pageTitle: pageInArray.name
            }
          },
          zones: {}
        }
      }
      
      // Switch immediately with cached/default data
      setCurrentData(initialData)
      setCurrentPage(pageId)
      setCurrentPageName(pageInArray.name)
      setShowPageManager(false)
      
      // Try to load from server in background and update if successful
      fetch(API_ENDPOINTS.GET_PAGE(serverFilename))
        .then(response => {
          if (response.ok) {
            return response.json()
          }
          return null
        })
        .then(result => {
          if (result && result.success && result.data) {
            logger.debug('loadPage: Server data loaded, updating page data')
            applyServerDataForPage(pageId, result.data)
          }
        })
        .catch(error => {
          logger.debug('loadPage: Server load failed (using cached/default data):', error)
        })
      
      return initialData
    }
    
    // Page not in array, try to load from server with timeout
    try {
      logger.debug('Loading from server:', API_ENDPOINTS.GET_PAGE(serverFilename))
      
      // Create a timeout promise
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Request timeout')), 1000) // 1 second timeout
      })
      
      // Race between fetch and timeout
      const response = await Promise.race([
        fetch(API_ENDPOINTS.GET_PAGE(serverFilename)),
        timeoutPromise
      ]) as Response
      
      logger.debug('Server response status:', response.status)
      
      if (response.ok) {
        const result = await response.json()
        logger.debug('Server response data:', result)
        
        if (result.success) {
          applyServerDataForPage(pageId, result.data)
          setCurrentPage(pageId)
          
          // Get page name from the loaded data
          const pageTitle = getPageTitleFromData(result.data)
          
          if (pageTitle) {
            // Page not in array, but we have a title - add it to the array
            logger.debug('loadPage: Page not in array, adding it with title:', pageTitle)
            setCurrentPageName(pageTitle)
            
            // Add the page to the pages array so it shows in the sidebar
            setPages(prevPages => {
              const pageExists = prevPages.some(p => p.id === pageId || p.filename === serverFilename)
              if (!pageExists) {
                const newPage: Page = {
                  id: pageId,
                  name: pageTitle,
                  filename: serverFilename,
                  lastModified: new Date().toISOString()
                }
                logger.debug('loadPage: Adding page to array:', newPage)
                return [...prevPages, newPage]
              }
              return prevPages
            })
          } else {
            // Fallback: try to extract name from pageId
            const fallbackName = pageId.replace('page-data-', '').replace(/-/g, ' ')
            logger.debug('loadPage: Using fallback name:', fallbackName)
            setCurrentPageName(fallbackName)
          }
          
          setShowPageManager(false)
          return result.data
        } else {
          logger.error('Server returned error:', result.error)
          // Fall through to fallback logic
        }
      } else {
        logger.warn('Server response not ok:', response.status, response.statusText)
        // Fall through to fallback logic
      }
    } catch (error) {
      logger.error('Error loading page from server (will use fallback):', error)
      // Fall through to fallback logic
    }
    
    // Fallback: If server load failed, create default page
    // (Note: pageInArray check was already handled above with early return)
    {
      // Page not in array and couldn't load from server
      logger.warn('loadPage: Page not found in array and server load failed:', serverFilename)
      // Try to create a default page based on the filename
      const pageName = pageId === 'page1' ? 'Page 1' : pageId.replace('page-', '').replace(/-/g, ' ')
      const defaultData = {
        content: [],
        root: {
          props: {
            title: pageName,
            pageTitle: pageName
          }
        },
        zones: {}
      }
      setCurrentData(defaultData)
      setCurrentPage(pageId)
      setCurrentPageName(pageName)
      setShowPageManager(false)
      
      // Add to pages array
      setPages(prevPages => {
        const pageExists = prevPages.some(p => p.id === pageId || p.filename === serverFilename)
        if (!pageExists) {
          const newPage: Page = {
            id: pageId,
            name: pageName,
            filename: serverFilename,
            lastModified: new Date().toISOString()
          }
          return [...prevPages, newPage]
        }
        return prevPages
      })
      
      return defaultData
    }
  }

  // Function to create a new page
  const createNewPage = () => {
    // Calculate the next page number (Page 2, Page 3, etc.)
    setPages(prevPages => {
      logger.debug('createNewPage: Current pages before creating:', prevPages.map(p => `${p.name} (${p.id})`))
      
      // Ensure Page 1 is always in the array (check by ID, not name, since names can be changed)
      const page1Exists = prevPages.some(p => p.id === 'page1' || p.filename === 'page1.json')
      let pagesWithPage1 = prevPages
      if (!page1Exists) {
        // Try to get the actual name from existing page data, or use default
        const existingPage1 = prevPages.find(p => p.id === 'page1' || p.filename === 'page1.json')
        const page1Name = existingPage1?.name || 'Page 1'
        pagesWithPage1 = [...prevPages, {
          id: 'page1',
          name: page1Name,
          filename: 'page1.json',
          lastModified: new Date().toISOString()
        }]
      }
      
      // Find the highest page number
      let maxPageNum = 1
      pagesWithPage1.forEach(page => {
        const match = page.name.match(/^Page (\d+)$/)
        if (match) {
          const pageNum = parseInt(match[1], 10)
          if (pageNum > maxPageNum) {
            maxPageNum = pageNum
          }
        }
      })
      
      const nextPageNum = maxPageNum + 1
      const pageName = `Page ${nextPageNum}`
      const sanitizedName = pageName.toLowerCase().replace(/[^a-z0-9]/g, '-')
      const newPageId = `page-${sanitizedName}-${Date.now()}`
      
      // Create the page data
      const newPageData = {
        content: [],
        root: {
          props: {
            title: pageName,
            pageTitle: pageName
          }
        },
        zones: {}
      }
      
      // Add the new page to the array
      const newPage: Page = {
        id: newPageId,
        name: pageName,
        filename: `${newPageId}.json`,
        lastModified: new Date().toISOString()
      }
      
      const updatedPages = [...pagesWithPage1, newPage]
      logger.debug('createNewPage: Pages after creating:', updatedPages.map(p => `${p.name} (${p.id})`))
      
      // Update other states immediately (React will batch these)
      setCurrentData(newPageData)
      setCurrentPage(newPageId)
      setCurrentPageName(pageName)
      setShowPageManager(false)
      setShowPageNameDialog(false) // Don't show the dialog
      
      // Save to server asynchronously - IMPORTANT: Save immediately so it's on server
      fetch(API_ENDPOINTS.SAVE_PAGE, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          data: newPageData,
          filename: `${newPageId}.json`
        })
      }).then((response) => {
        if (response.ok) {
          logger.debug('createNewPage: Page saved successfully to server:', `${newPageId}.json`)
          // Don't reload pages immediately - the page is already in the array
          // This prevents overwriting pages that might not be on server yet
          // loadPages() will be called later when needed (e.g., on publish)
        } else {
          logger.error('createNewPage: Failed to save page to server:', response.status)
        }
      }).catch(error => {
        logger.error('Error saving new page:', error)
      })
      
      return updatedPages
    })
  }

  // Function to confirm new page creation
  const confirmNewPage = (pageName: string) => {
    setCurrentPageName(pageName)
    // Update the current page ID to use the sanitized page name
    const sanitizedName = pageName.toLowerCase().replace(/[^a-z0-9]/g, '-')
    const newPageId = `page-${sanitizedName}-${Date.now()}`
    const oldPageId = currentPage
    
    setCurrentPage(newPageId)
    
    // Update the canvas title to match the page name and save to server
    setCurrentData((prevData: any) => {
      const updatedData = {
        ...prevData,
        root: {
          ...prevData.root,
          props: {
            ...prevData.root?.props,
            title: pageName,
            pageTitle: pageName
          }
        }
      }
      
      // Save asynchronously without blocking
      fetch(API_ENDPOINTS.SAVE_PAGE, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          data: updatedData,
          filename: `${newPageId}.json`
        })
      }).then(() => {
        // Reload pages to sync with server
        loadPages()
      }).catch(error => {
        logger.error('Error saving new page:', error)
      })
      
      return updatedData
    })
    
    // Update the page in the pages array with the new name and ID
    setPages(prevPages => {
      // Remove the old temporary page entry
      const filteredPages = prevPages.filter(p => p.id !== oldPageId)
      
      // Ensure Page 1 is always in the array (check by ID, not name, since names can be changed)
      const page1Exists = filteredPages.some(p => p.id === 'page1' || p.filename === 'page1.json')
      let pagesWithPage1 = filteredPages
      if (!page1Exists) {
        // Try to get the actual name from existing page data, or use default
        const existingPage1 = filteredPages.find(p => p.id === 'page1' || p.filename === 'page1.json')
        const page1Name = existingPage1?.name || 'Page 1'
        pagesWithPage1 = [...filteredPages, {
          id: 'page1',
          name: page1Name,
          filename: 'page1.json',
          lastModified: new Date().toISOString()
        }]
      }
      
      // Add the new page with confirmed name
      const pageExists = pagesWithPage1.some(p => p.id === newPageId)
      if (!pageExists) {
        return [...pagesWithPage1, {
          id: newPageId,
          name: pageName,
          filename: `${newPageId}.json`,
          lastModified: new Date().toISOString()
        }]
      }
      return pagesWithPage1
    })
    
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
    
    // Add the new template page to the pages array, preserving ALL existing pages
    setPages(prev => {
      logger.debug('createPageFromTemplate: Current pages BEFORE adding template:', prev.map(p => `${p.name} (${p.id})`))
      logger.debug('createPageFromTemplate: Current page is:', currentPage, currentPageName)
      
      // Preserve ALL existing pages - don't filter anything out
      // Start with a copy of all existing pages
      const updatedPages = [...prev]
      
      // Ensure Page 1 is always in the array (check by ID only, since names can be changed)
      const page1Exists = updatedPages.some(p => p.id === 'page1' || p.filename === 'page1.json')
      if (!page1Exists) {
        // Try to get the actual name from existing page data, or use default
        const existingPage1 = updatedPages.find(p => p.id === 'page1' || p.filename === 'page1.json')
        const page1Name = existingPage1?.name || 'Page 1'
        updatedPages.push({
          id: 'page1',
          name: page1Name,
          filename: 'page1.json',
          lastModified: new Date().toISOString()
        })
      }
      
      // IMPORTANT: If the current page is not in the array, add it
      // This handles the case where Page 2 was created but not yet in the pages array
      const currentPageExists = updatedPages.some(p => p.id === currentPage || p.name === currentPageName)
      if (!currentPageExists && currentPage && currentPageName) {
        logger.debug('createPageFromTemplate: Current page not in array, adding it:', currentPage, currentPageName)
        updatedPages.push({
          id: currentPage,
          name: currentPageName,
          filename: `${currentPage}.json`,
          lastModified: new Date().toISOString()
        })
      }
      
      // Check if the new template page already exists
      const pageExists = updatedPages.some(p => p.id === pageId)
      if (!pageExists) {
        updatedPages.push(newPage)
      }
      
      logger.debug('createPageFromTemplate: Pages AFTER adding template:', updatedPages.map(p => `${p.name} (${p.id})`))
      return updatedPages
    })
    
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
        // Don't call loadPages() immediately as it might overwrite existing pages
        // The page is already added to the pages array above
        // The pages array already contains all pages including Page 1, Page 2, and the new template page
      }
    } catch (error) {
      logger.error('Error saving template page:', error)
    }
    
    return { pageId, pageName, newPageData }
  }

  useEffect(() => {
    const initializePage = async () => {
      // Load pages from server first
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
            
            // Ensure page1 is in the pages array (use actual pageTitle from data, which may be renamed)
            setPages(prevPages => {
              logger.debug('initializePage: Ensuring page1 exists. Current pages:', prevPages.map(p => `${p.name} (${p.id})`))
              const pageExists = prevPages.some(p => p.id === 'page1' || p.filename === 'page1.json')
              if (!pageExists) {
                // Use the actual pageTitle from the loaded data (which may be renamed)
                const updated = [...prevPages, {
                  id: 'page1',
                  name: pageTitle, // Use actual title, which may be renamed
                  filename: 'page1.json',
                  lastModified: new Date().toISOString()
                }]
                logger.debug('initializePage: Added page1. Updated pages:', updated.map(p => `${p.name} (${p.id})`))
                return updated
              } else {
                // Update the name if it has changed (page was renamed)
                const page1Index = prevPages.findIndex(p => p.id === 'page1' || p.filename === 'page1.json')
                if (page1Index >= 0 && prevPages[page1Index].name !== pageTitle) {
                  const updated = [...prevPages]
                  updated[page1Index] = { ...updated[page1Index], name: pageTitle }
                  logger.debug('initializePage: Updated page1 name. Updated pages:', updated.map(p => `${p.name} (${p.id})`))
                  return updated
                }
              }
              logger.debug('initializePage: page1 already exists')
              return prevPages
            })
          }
        } else {
          // Page1 doesn't exist, create it
          const page1Data = defaultPage1Data
          setCurrentData(page1Data)
          setCurrentPage('page1')
          setCurrentPageName('Page 1')
          
          // Add page1 to pages array immediately so it shows in sidebar
          setPages(prevPages => {
            const pageExists = prevPages.some(p => p.id === 'page1' || p.filename === 'page1.json')
            if (!pageExists) {
              return [...prevPages, {
                id: 'page1',
                name: 'Page 1',
                filename: 'page1.json',
                lastModified: new Date().toISOString()
              }]
            }
            return prevPages
          })
          
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
        // Even if there's an error, ensure page1 is in the pages array
        setPages(prevPages => {
          const pageExists = prevPages.some(p => p.id === 'page1' || p.filename === 'page1.json')
          if (!pageExists) {
            return [...prevPages, {
              id: 'page1',
              name: 'Page 1',
              filename: 'page1.json',
              lastModified: new Date().toISOString()
            }]
          }
          return prevPages
        })
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
