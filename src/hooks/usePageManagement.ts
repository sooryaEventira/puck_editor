import { useState, useEffect } from 'react'
import { Page } from '../types'

// Default JSON data structure
const defaultJsonData: any = {
  home: {
    title: "Home",
    slug: "/",
    data: {
      "/": {
        root: {
          props: { title: "Puck + React Router 7 demo" },
        },
        content: [
          {
            type: "Heading",
            props: {
              text: "Edit this page by adding /edit to the end of the URL",
              level: 1,
              id: "HeadingBlock-1694032984497",
            },
          },
          {
            type: "Heading",
            props: {
              text: "Heading",
              level: 2,
              id: "HeadingBlock-f201eaff-4358-4d47-ae34-8147d6f52384",
            },
          },
          {
            type: "Checkbox",
            props: {
              label: "I agree to terms",
              checked: false,
              id: "CheckboxBlock-001"
            }
          }
          
        ],
        zones: {},
      },
    },
  },
  page1: {
    title: "Second Page",
    slug: "/page1",
    data: {
      "/": {
        root: {
          props: { title: "Puck + React Router 7 demo" },
        },
        content: [
          {
            type: "Heading",
            props: {
              text: "secondpage",
              level: 1,
              id: "HeadingBlock-1694032984497",
            },
          },
          {
            type: "Heading",
            props: {
              text: "Second page",
              level: 2,
              id: "HeadingBlock-f201eaff-4358-4d47-ae34-8147d6f52384",
            },
          },
          {
            type: "Heading",
            props: {
              text: "Second Page",
              level: 3,
              id: "HeadingBlock-255c9b3d-88be-4c5b-ace9-deeb71cb0c40",
            },
          },
        ],
        zones: {},
      },
    },
  }
}

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

export const usePageManagement = () => {
  const [currentData, setCurrentData] = useState<any>(() => 
    convertJsonToPuckData(defaultJsonData, 'home')
  )
  const [currentPage, setCurrentPage] = useState('home')
  const [currentPageName, setCurrentPageName] = useState('Home')
  const [pages, setPages] = useState<Page[]>(() => 
    convertJsonToPagesList(defaultJsonData)
  )
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
        // Merge with default pages
        const defaultPages = convertJsonToPagesList(defaultJsonData)
        setPages([...defaultPages, ...pageList])
      } else {
        // If server fails, use default pages
        setPages(convertJsonToPagesList(defaultJsonData))
      }
    } catch (error) {
      console.error('Error loading pages:', error)
      // If server fails, use default pages
      setPages(convertJsonToPagesList(defaultJsonData))
    }
  }

  // Function to load a specific page
  const loadPage = async (filename: string) => {
    try {
      // First check if it's a default page
      const pageId = filename.replace('.json', '')
      
      if (defaultJsonData[pageId]) {
        const pageData = convertJsonToPuckData(defaultJsonData, pageId)
        setCurrentData(pageData)
        setCurrentPage(pageId)
        setCurrentPageName(defaultJsonData[pageId].title)
        setShowPageManager(false)
        return pageData // Return the data for Events page to use
      }
      
      // Also check if the filename is just the page ID (without .json)
      if (defaultJsonData[filename]) {
        const pageData = convertJsonToPuckData(defaultJsonData, filename)
        setCurrentData(pageData)
        setCurrentPage(filename)
        setCurrentPageName(defaultJsonData[filename].title)
        setShowPageManager(false)
        return pageData // Return the data for Events page to use
      }

      // If not a default page, try to load from server
      const response = await fetch(`http://localhost:3001/api/pages/${filename}`)
      const result = await response.json()
      
      if (result.success) {
        setCurrentData(result.data)
        setCurrentPage(pageId)
        
        // Find the page name from the pages list
        const page = pages.find(p => p.filename === filename)
        if (page) {
          setCurrentPageName(page.name)
        } else {
          setCurrentPageName(pageId.replace('page-data-', '').replace(/-/g, ' '))
        }
        
        setShowPageManager(false)
        return result.data // Return the data for Events page to use
      }
    } catch (error) {
      console.error('Error loading page:', error)
    }
    return null // Return null if loading fails
  }

  // Function to create a new page
  const createNewPage = () => {
    // Create a proper Puck data structure with all required properties
    const newPageData = {
      content: [],
      root: {
        props: {}
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
