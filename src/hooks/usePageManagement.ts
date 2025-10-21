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
  'simple-page': {
    title: "HTML Page",
    slug: "/simple-page",
    type: "html",
    data: {
      "/": {
        root: {
          props: { title: "HTML Page" },
        },
        content: [
          {
            type: "HTMLContent",
            props: {
              htmlContent: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Simple Event Page</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
        }
        
        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 20px;
        }
        
        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 2rem 0;
            text-align: center;
        }
        
        .header h1 {
            font-size: 3rem;
            margin-bottom: 1rem;
            font-weight: 700;
        }
        
        .header p {
            font-size: 1.2rem;
            opacity: 0.9;
        }
        
        .section {
            padding: 4rem 0;
        }
        
        .section:nth-child(even) {
            background-color: #f8f9fa;
        }
        
        .section h2 {
            text-align: center;
            font-size: 2.5rem;
            margin-bottom: 2rem;
            color: #2d3748;
        }
        
        .section p {
            text-align: center;
            font-size: 1.1rem;
            max-width: 600px;
            margin: 0 auto 2rem;
            color: #4a5568;
        }
        
        .features {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 2rem;
            margin-top: 3rem;
        }
        
        .feature {
            background: white;
            padding: 2rem;
            border-radius: 10px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            text-align: center;
            transition: transform 0.3s ease;
        }
        
        .feature:hover {
            transform: translateY(-5px);
        }
        
        .feature h3 {
            color: #667eea;
            margin-bottom: 1rem;
            font-size: 1.5rem;
        }
        
        .cta {
            background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
            color: white;
            text-align: center;
            padding: 3rem 0;
        }
        
        .cta h2 {
            color: white;
            margin-bottom: 1rem;
        }
        
        .btn {
            display: inline-block;
            background: white;
            color: #667eea;
            padding: 1rem 2rem;
            border-radius: 50px;
            text-decoration: none;
            font-weight: 600;
            font-size: 1.1rem;
            transition: all 0.3s ease;
            margin-top: 1rem;
        }
        
        .btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 15px rgba(0, 0, 0, 0.2);
        }
        
        .footer {
            background: #2d3748;
            color: white;
            text-align: center;
            padding: 2rem 0;
        }
        
        @media (max-width: 768px) {
            .header h1 {
                font-size: 2rem;
            }
            
            .section h2 {
                font-size: 2rem;
            }
            
            .features {
                grid-template-columns: 1fr;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <header class="header">
            <h1>Welcome to Our Event</h1>
            <p>Join us for an amazing experience</p>
        </header>
        
        <section class="section">
            <h2>About the Event</h2>
            <p>This is a simple HTML page that demonstrates how we can render static HTML content within our Puck editor. The page includes modern styling and responsive design.</p>
            
            <div class="features">
                <div class="feature">
                    <h3>🎯 Interactive</h3>
                    <p>Engage with dynamic content and interactive elements throughout the event.</p>
                </div>
                <div class="feature">
                    <h3>📱 Responsive</h3>
                    <p>Perfect viewing experience on all devices, from mobile to desktop.</p>
                </div>
                <div class="feature">
                    <h3>⚡ Fast</h3>
                    <p>Optimized for speed and performance to ensure smooth user experience.</p>
                </div>
            </div>
        </section>
        
        <section class="section">
            <h2>Event Details</h2>
            <p>Discover all the exciting features and activities we have planned for this special event. From keynote speakers to interactive workshops, there's something for everyone.</p>
        </section>
        
        <section class="cta">
            <h2>Ready to Join?</h2>
            <p>Don't miss out on this incredible opportunity. Register now and be part of something amazing!</p>
            <a href="#register" class="btn">Register Now</a>
        </section>
    </div>
    
    <footer class="footer">
        <p>&copy; 2024 Event Company. All rights reserved.</p>
    </footer>
</body>
</html>`,
              id: "HTMLContent-001"
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
  const [currentData, setCurrentData] = useState<any>(() => ({
    content: [],
    root: { props: {} },
    zones: {}
  }))
  const [currentPage, setCurrentPage] = useState('new-page')
  const [currentPageName, setCurrentPageName] = useState('New Page')
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
    console.log('loadPage called with filename:', filename)
    try {
      // First check if it's a default page
      const pageId = filename.replace('.json', '')
      console.log('Checking default pages for pageId:', pageId)
      
      if (defaultJsonData[pageId]) {
        console.log('Found in default pages:', pageId)
        const pageData = convertJsonToPuckData(defaultJsonData, pageId)
        setCurrentData(pageData)
        setCurrentPage(pageId)
        setCurrentPageName(defaultJsonData[pageId].title)
        setShowPageManager(false)
        return pageData // Return the data for Events page to use
      }
      
      // Also check if the filename is just the page ID (without .json)
      if (defaultJsonData[filename]) {
        console.log('Found in default pages with filename:', filename)
        const pageData = convertJsonToPuckData(defaultJsonData, filename)
        setCurrentData(pageData)
        setCurrentPage(filename)
        setCurrentPageName(defaultJsonData[filename].title)
        setShowPageManager(false)
        return pageData // Return the data for Events page to use
      }

      // If not a default page, try to load from server
      // Ensure we're using the correct filename format
      const serverFilename = filename.endsWith('.json') ? filename : `${filename}.json`
      console.log('Loading from server:', `http://localhost:3001/api/pages/${serverFilename}`)
      const response = await fetch(`http://localhost:3001/api/pages/${serverFilename}`)
      console.log('Server response status:', response.status)
      
      if (response.ok) {
        const result = await response.json()
        console.log('Server response data:', result)
        
        if (result.success) {
          setCurrentData(result.data)
          setCurrentPage(pageId)
          
          // Find the page name from the pages list
          const page = pages.find(p => p.filename === serverFilename || p.filename === filename)
          if (page) {
            setCurrentPageName(page.name)
          } else {
            setCurrentPageName(pageId.replace('page-data-', '').replace(/-/g, ' '))
          }
          
          setShowPageManager(false)
          return result.data // Return the data for Events page to use
        } else {
          console.error('Server returned error:', result.error)
        }
      } else {
        console.error('Server response not ok:', response.status, response.statusText)
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
