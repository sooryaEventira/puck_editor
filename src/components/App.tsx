import React, { useState, useEffect } from 'react'
import { Puck } from '@measured/puck'
import '@measured/puck/puck.css'

import { config } from '../config/puckConfig'
import { usePageManagement } from '../hooks/usePageManagement'
import { usePublish } from '../hooks/usePublish'
import { PageManager, PageNameDialog } from './page'
import Preview from './Preview'
import { GlobalNavbar } from './layout'
import { EventsPage } from './pages'

const App: React.FC = () => {
  const [showPreview, setShowPreview] = useState(false)
  const [currentView, setCurrentView] = useState<'editor' | 'events'>('editor')
  
  const {
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
  } = usePageManagement()

  const { handlePublish, handleDataChange } = usePublish(
    currentData,
    setCurrentData,
    currentPage,
    currentPageName,
    setCurrentPage,
    loadPages
  )

  // Function to toggle preview mode
  const togglePreview = () => {
    setShowPreview(!showPreview)
  }

  // Navbar handlers
  const handleCreateEvent = () => {

    setCurrentView('events')
  }

  const handleProfileClick = () => {
  
    // TODO: Implement profile functionality
    alert('Profile clicked - This would typically open a profile menu or navigate to profile page')
  }

  const handleBackToEditor = () => {
    setCurrentView('editor')
  }

  // Function to force black text color on all Puck elements
  const forcePurpleText = () => {
    const stylePurpleText = (element: HTMLElement) => {
      element.style.color = '#000000'
      element.style.setProperty('color', '#000000', 'important')
      // Also try setting the computed style
      element.style.cssText += 'color: #000000 !important;'
    }

    
    
    // Try different selectors to find Puck elements
    const possibleSelectors = [
      '.puck',
      '[class*="puck"]',
      '[class*="Puck"]',
      '[class*="editor"]',
      '[class*="Editor"]',
      'div[class*="puck"]',
      'div[class*="Puck"]'
    ]
    
    let foundElements = 0
    possibleSelectors.forEach(selector => {
      const elements = document.querySelectorAll(selector)
      if (elements.length > 0) {
      
        elements.forEach(element => {
          if (element instanceof HTMLElement) {
            stylePurpleText(element)
            foundElements++
          }
        })
      }
    })

    // Find all text elements in any container that might be Puck
    const allElements = document.querySelectorAll('*')
    let textElementsStyled = 0
    
    allElements.forEach(element => {
      if (element instanceof HTMLElement && 
          element.textContent && 
          element.textContent.trim().length > 0 &&
          element.textContent.length < 100) { // Only short text elements (likely UI text)
        stylePurpleText(element)
        textElementsStyled++
      }
    })

    // Style Publish Button specifically
    stylePublishButton()

   
  }

  // Function to style the Publish button specifically
  const stylePublishButton = () => {

    
    // Multiple selectors to find the publish button
    const buttonSelectors = [
      'button',
      'button[type="submit"]',
      '.puck__button',
      '[data-puck-button]',
      'button[data-testid="publish"]',
      'button[aria-label*="Publish"]',
      'button[title*="Publish"]',
      '.puck__toolbar button',
      '.puck__header button',
      '.puck__actions button',
      '.puck__footer button',
      '[role="button"]',
      '[type="button"]',
      '[type="submit"]',
      '*[class*="button"]',
      '*[class*="Button"]',
      '*[class*="btn"]',
      '*[class*="Btn"]'
    ]
    
    let publishButtonsStyled = 0
    
    buttonSelectors.forEach(selector => {
      try {
        const buttons = document.querySelectorAll(selector)
        
        
        buttons.forEach(button => {
          if (button instanceof HTMLElement) {
            const buttonText = button.textContent?.trim().toLowerCase() || ''


            // Check if this button contains "publish" text specifically
            if (buttonText.includes('publish') || 
                button.getAttribute('data-testid') === 'publish' ||
                button.getAttribute('aria-label')?.toLowerCase().includes('publish') ||
                button.getAttribute('title')?.toLowerCase().includes('publish')) {
              
              // Apply purple background and white text
              button.style.backgroundColor = '#6f42c1'
              button.style.setProperty('background-color', '#6f42c1', 'important')
              button.style.color = 'white'
              button.style.setProperty('color', 'white', 'important')
              button.style.borderColor = '#6f42c1'
              button.style.setProperty('border-color', '#6f42c1', 'important')
              
              // Force override any existing styles
              button.setAttribute('style', button.getAttribute('style') + '; background-color: #6f42c1 !important; color: white !important; border-color: #6f42c1 !important;')
              
              // Style any child elements
              const childElements = button.querySelectorAll('*')
              childElements.forEach(child => {
                if (child instanceof HTMLElement) {
                  child.style.color = 'white'
                  child.style.setProperty('color', 'white', 'important')
                  child.style.backgroundColor = 'transparent'
                  child.style.setProperty('background-color', 'transparent', 'important')
                }
              })
              
              publishButtonsStyled++
             
            }
          }
        })
      } catch (e) {
      
      }
    })
    
  
  }

  // Apply purple text when component mounts and when not in preview mode
  useEffect(() => {
    if (!showPreview) {
      // Apply immediately
      forcePurpleText()
      
      // Apply multiple times with different delays to ensure Puck has loaded
      const timeouts = [
        setTimeout(forcePurpleText, 1000),
        setTimeout(forcePurpleText, 2000),
        setTimeout(forcePurpleText, 3000),
        setTimeout(forcePurpleText, 5000),
        setTimeout(forcePurpleText, 10000)
      ]
      
      // Apply when DOM changes (Puck loads new content)
      const observer = new MutationObserver(() => {
        forcePurpleText()
      })
      
      observer.observe(document.body, { childList: true, subtree: true })
      
      // Also apply every 2 seconds to catch any missed elements
      const interval = setInterval(forcePurpleText, 2000)
      
      return () => {
        timeouts.forEach(clearTimeout)
        observer.disconnect()
        clearInterval(interval)
      }
    }
  }, [showPreview])

  // Render Events Page
  if (currentView === 'events') {
    return (
      <div style={{ height: '100vh' }}>
        {/* Global Navbar */}
        <GlobalNavbar 
          onCreateEvent={handleCreateEvent}
          onProfileClick={handleProfileClick}
        />
        
        {/* Events Page Content */}
        <div style={{ marginTop: '64px', height: 'calc(100vh - 64px)' }}>
          <EventsPage onBackToEditor={handleBackToEditor} />
        </div>
      </div>
    )
  }

  // Render Editor Page
  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Global Navbar */}
      <GlobalNavbar 
        onCreateEvent={handleCreateEvent}
        onProfileClick={handleProfileClick}
      />
      
      {/* Controls */}
      <div style={{ 
        padding: '10px 20px', 
        backgroundColor: '#f8f9fa', 
        borderBottom: '1px solid #dee2e6',
        display: 'flex',
        gap: '10px',
        alignItems: 'center',
        flexWrap: 'wrap',
        marginTop: '64px' // Account for fixed navbar height
      }}>
        <button
          onClick={() => setShowPageManager(!showPageManager)}
          style={{
            padding: '8px 16px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '14px'
          }}
        >
          📄 Pages ({pages.length})
        </button>
        <button
          onClick={createNewPage}
          style={{
            padding: '8px 16px',
            backgroundColor: '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '14px'
          }}
        >
          ➕ New Page
        </button>
        <button
          onClick={togglePreview}
          style={{
            padding: '8px 16px',
            backgroundColor: showPreview ? '#dc3545' : '#6c757d',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '14px'
          }}
        >
          {showPreview ? '✏️ Edit Mode' : '👁️ Preview'}
        </button>
      </div>

      {/* Page Manager */}
      <PageManager
        pages={pages}
        currentPage={currentPage}
        onPageSelect={loadPage}
        isVisible={showPageManager}
      />

      {/* Page Name Dialog */}
      <PageNameDialog
        isVisible={showPageNameDialog}
        pageName={currentPageName}
        onPageNameChange={setCurrentPageName}
        onConfirm={confirmNewPage}
        onCancel={() => setShowPageNameDialog(false)}
      />

      {/* Main Content */}
      <div style={{ flex: 1, height: 'calc(100vh - 124px)' }}>
        {showPreview ? (
          <Preview data={currentData} isInteractive={true} onDataChange={setCurrentData} />
        ) : (
          <>
            <style>
              {`
                /* Fix Puck sidebar scrolling */
                .puck {
                  height: 100% !important;
                }
                .puck__sidebar {
                  height: 100% !important;
                  overflow-y: auto !important;
                  max-height: calc(100vh - 124px) !important;
                }
                .puck__sidebar-content {
                  height: auto !important;
                  min-height: 100% !important;
                }
                /* Ensure component list is scrollable */
                [class*="puck__component-list"],
                [class*="puck__components"],
                [class*="puck__component-categories"] {
                  max-height: none !important;
                  overflow-y: auto !important;
                }
                /* Fix any nested scrollable areas */
                .puck__sidebar [class*="scroll"],
                .puck__sidebar [class*="overflow"] {
                  overflow-y: auto !important;
                  max-height: none !important;
                }
              `}
            </style>
            <Puck 
              key={currentPage} // Force re-render when page changes
              config={config as any} 
              data={currentData}
              onPublish={handlePublish as any}
              onChange={handleDataChange as any}
            />
          </>
        )}
      </div>
    </div>
  )
}

export default App
