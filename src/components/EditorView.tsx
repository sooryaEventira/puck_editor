import React, { useEffect, useState, createContext, useContext } from 'react'
import { Puck } from '@measured/puck'
import '@measured/puck/puck.css'

import { config } from '../config/puckConfig'
import { PageSidebar } from './page'
import PageCreationModal from './page/PageCreationModal'
import BlockTypeSelectionModal from './page/BlockTypeSelectionModal'
import TemplateSelectionModal from './page/TemplateSelectionModal'
import Preview from './Preview'
import { NavigationProvider } from '../contexts/NavigationContext'
import { Page } from '../types'

// Context to provide current data to custom fields
const PuckDataContext = createContext<any>(null)
export const usePuckData = () => useContext(PuckDataContext)

interface EditorViewProps {
  currentData: any
  currentPage: string
  currentPageName: string
  pages: Page[]
  puckUi: any
  showPreview: boolean
  showLeftSidebar: boolean
  showRightSidebar: boolean
  showPageManager: boolean
  onPublish: (data: any) => void
  onChange: (data: any) => void
  onDataChange: (data: any) => void
  onPageSelect: (filename: string) => Promise<any>
  onAddPage: () => void
  onManagePages: () => void
  onNavigateToEditor: () => void
  onAddComponent: (componentType: string, props?: any) => void
  onPreviewToggle: () => void
  onBack?: () => void
  onCreatePageFromTemplate?: (templateType: string) => Promise<any>
  onCreateNewPage?: () => void
}

export const EditorView: React.FC<EditorViewProps> = ({
  currentData,
  currentPage,
  currentPageName,
  pages,
  puckUi,
  showPreview,
  showLeftSidebar,
  showRightSidebar,
  onPublish,
  onChange,
  onDataChange,
  onPageSelect,
  onAddPage,
  onManagePages,
  onNavigateToEditor,
  onAddComponent,
  onPreviewToggle,
  onBack,
  onCreatePageFromTemplate,
  onCreateNewPage,
}) => {
  // Initially show default COMPONENTS sidebar, canvas, and property sidebar with Page 1
  // Custom sidebar only appears after "Create from scratch" is selected
  const [showCustomSidebar, setShowCustomSidebar] = useState(false)
  const [showPageCreationModal, setShowPageCreationModal] = useState(false)
  const [showBlockTypeModal, setShowBlockTypeModal] = useState(false)
  const [showTemplateModal, setShowTemplateModal] = useState(false)

  const handleBackButtonClick = () => {
    setShowCustomSidebar(prev => !prev)
  }

  const handlePageCreationSelect = (mode: 'scratch' | 'template' | 'html', blockType?: string) => {
    if (mode === 'template') {
      setShowTemplateModal(true)
      return
    }
    
    if (mode === 'scratch') {
      // Keep component sidebar visible (don't show custom sidebar) and create new page
      setShowCustomSidebar(false)
      if (onCreateNewPage) {
        onCreateNewPage()
      }
      return
    }
  }

  const handleBlockTypeSelect = (blockType: string) => {
    setShowBlockTypeModal(false)
    setShowCustomSidebar(false)
  }

  const handleTemplateSelect = async (templateType: string) => {
    setShowTemplateModal(false)
    
    if (onCreatePageFromTemplate) {
      await onCreatePageFromTemplate(templateType)
    }
    
    setShowCustomSidebar(true)
  }

  useEffect(() => {
    if (!showCustomSidebar) {
      const sidebarSelectors = [
        'aside[class*="puck__sidebar--left"]',
        'aside[class*="Sidebar--left"]:not([class*="right"])',
        'nav[class*="puck__sidebar--left"]',
      ]
      
      sidebarSelectors.forEach(selector => {
        const elements = document.querySelectorAll(selector)
        elements.forEach((el: Element) => {
          const htmlEl = el as HTMLElement
          htmlEl.style.removeProperty('display')
          htmlEl.style.removeProperty('width')
          htmlEl.style.removeProperty('visibility')
          htmlEl.style.removeProperty('opacity')
        })
      })
      return
    }
    
    const hideDefaultSidebar = () => {
      const sidebarSelectors = [
        'aside[class*="puck__sidebar--left"]',
        'aside[class*="Sidebar--left"]:not([class*="right"])',
        'nav[class*="puck__sidebar--left"]',
        '[class*="ComponentList"]',
        '[class*="component-list"]',
      ]
      
      sidebarSelectors.forEach(selector => {
        const elements = document.querySelectorAll(selector)
        elements.forEach((el: Element) => {
          const htmlEl = el as HTMLElement
          const rect = htmlEl.getBoundingClientRect()
          if (rect.left < 350 && rect.width > 100) {
            htmlEl.style.setProperty('display', 'none', 'important')
            htmlEl.style.setProperty('width', '0', 'important')
            htmlEl.style.setProperty('visibility', 'hidden', 'important')
            htmlEl.style.setProperty('opacity', '0', 'important')
            htmlEl.style.setProperty('pointer-events', 'none', 'important')
          }
        })
      })
    }
    
    hideDefaultSidebar()
    const interval = setInterval(hideDefaultSidebar, 100)
    
    return () => clearInterval(interval)
  }, [showCustomSidebar])

  return (
    <div style={{ flex: 1, height: 'calc(100vh - 64px)', display: 'flex', marginTop: '64px', position: 'relative' }}>
      {showPreview ? (
        <NavigationProvider onNavigateToEditor={onNavigateToEditor} onAddComponent={onAddComponent}>
          <Preview data={currentData} isInteractive={true} onDataChange={onDataChange} />
        </NavigationProvider>
      ) : (
        <NavigationProvider onNavigateToEditor={onNavigateToEditor} onAddComponent={onAddComponent}>
          {showCustomSidebar && (() => {
            // Log for debugging
            console.log('Custom sidebar - All pages:', pages.map(p => `${p.name} (${p.id})`))
            console.log('Custom sidebar - Current page:', currentPage, currentPageName)
            
            // Start with ALL pages from the pages array - don't filter anything
            const pagesForSidebar = pages.map(page => ({ id: page.id, name: page.name }))
            
            // Always ensure Page 1 is in the sidebar if it exists (check by ID, not name, since names can be changed)
            const page1Exists = pagesForSidebar.some(p => p.id === 'page1')
            if (!page1Exists) {
              // Try to get the actual name from pages array, or use default
              const page1 = pages.find(p => p.id === 'page1')
              const page1Name = page1?.name || 'Page 1'
              pagesForSidebar.push({ id: 'page1', name: page1Name })
            }
            
            // Ensure current page is included if not already in the list
            const currentPageExists = pagesForSidebar.some(p => p.id === currentPage || p.name === currentPageName)
            if (!currentPageExists && currentPage && currentPageName) {
              pagesForSidebar.push({ id: currentPage, name: currentPageName })
            }
            
            console.log('Custom sidebar - Pages to display:', pagesForSidebar.map(p => `${p.name} (${p.id})`))
            
            return (
              <div style={{
                position: 'absolute',
                left: 0,
                top: 0,
                bottom: 0,
                width: '280px',
                zIndex: 1000,
                backgroundColor: 'white',
                borderRight: '1px solid #e5e7eb'
              }}>
                <PageSidebar
                  pages={pagesForSidebar}
                  currentPage={currentPage}
                  currentPageName={currentPageName}
                  onPageSelect={async (pageId) => {
                    console.log('PageSidebar: Page selected:', pageId)
                    console.log('PageSidebar: Current page:', currentPage)
                    console.log('PageSidebar: Available pages:', pages.map(p => `${p.name} (${p.id})`))
                    
                    // Don't reload if clicking the same page
                    if (pageId === currentPage) {
                      console.log('PageSidebar: Same page selected, skipping')
                      return
                    }
                    
                    try {
                      // Try to find the page in the pages array
                      const page = pages.find(p => p.id === pageId)
                      if (page) {
                        console.log('PageSidebar: Found page in array, loading:', page.filename)
                        await onPageSelect(page.filename)
                      } else {
                        // Page not in array, but try to load it anyway using the pageId
                        // This handles cases where Page 1 or Page 2 might not be in the array yet
                        console.log('PageSidebar: Page not in array, trying to load by ID:', pageId)
                        const filename = pageId.endsWith('.json') ? pageId : `${pageId}.json`
                        console.log('PageSidebar: Calling onPageSelect with filename:', filename)
                        await onPageSelect(filename)
                      }
                      console.log('PageSidebar: Page load completed')
                    } catch (error) {
                      console.error('PageSidebar: Error loading page:', error)
                    }
                  }}
                  onAddPage={() => setShowPageCreationModal(true)}
                  onManagePages={onManagePages}
                />
              </div>
            )
          })()}
          
          <div style={{ 
            flex: 1, 
            height: '100%', 
            overflow: 'hidden',
            marginLeft: showCustomSidebar ? '280px' : '0',
            transition: 'margin-left 0.2s'
          }}>
            <style>
              {`
                ${showCustomSidebar ? `
                  aside[class*="puck__sidebar--left"],
                  aside[class*="Sidebar--left"]:not([class*="right"]),
                  nav[class*="puck__sidebar--left"] {
                    display: none !important;
                    width: 0 !important;
                    visibility: hidden !important;
                    opacity: 0 !important;
                  }
                ` : ''}
                
                ${!showRightSidebar ? `
                  aside[class*="Sidebar--right"],
                  aside[class*="Sidebar_Sidebar--right_"] {
                    display: none !important;
                    width: 0 !important;
                  }
                ` : ''}
                
                [class*="DragHandle"],
                [class*="dragHandle"],
                [class*="ResizeHandle"],
                [class*="resizeHandle"],
                [class*="Sidebar__dragHandle"],
                [class*="Sidebar_Sidebar__dragHandle"],
                button[class*="dragHandle"],
                div[class*="dragHandle"],
                [data-drag-handle],
                [role="separator"] {
                  display: none !important;
                  width: 0 !important;
                  opacity: 0 !important;
                  pointer-events: none !important;
                  visibility: hidden !important;
                }
                
                .puck,
                [class*="Puck"],
                [class*="puck"] {
                  padding: 0 !important;
                  
                  gap: 0 !important;
                }
                
                main,
                main[class*="Canvas"],
                [class*="Canvas"],
                [class*="Frame"],
                section {
                  padding-left: 0 !important;
                  margin-left: 0 !important;
                }
                
                [class*="Puck"] > div,
                [class*="Puck"] section {
                  padding: 0 !important;
                 
                  gap: 0 !important;
                }

                button[data-hidden-publish-btn="true"],
                span[data-hidden-publish-btn="true"],
                button[data-testid="publish"]:not([data-custom-publish-button]),
                button[data-testid*="publish"]:not([data-custom-publish-button]),
                span[data-testid="publish"]:not([data-custom-publish-button]),
                span[data-testid*="publish"]:not([data-custom-publish-button]),
                button[aria-label*="Publish"]:not([data-custom-publish-button]),
                button[aria-label*="publish"]:not([data-custom-publish-button]),
                span[aria-label*="Publish"]:not([data-custom-publish-button]),
                span[aria-label*="publish"]:not([data-custom-publish-button]),
                button[title*="Publish"]:not([data-custom-publish-button]),
                button[title*="publish"]:not([data-custom-publish-button]),
                span[title*="Publish"]:not([data-custom-publish-button]),
                span[title*="publish"]:not([data-custom-publish-button]),
                span[class*="Button--primary"][style*="rgb(111, 66, 193)"]:not([data-custom-publish-button]),
                span[class*="Button--primary"][style*="6f42c1"]:not([data-custom-publish-button]),
                span[class*="Button--primary"]:not([data-custom-publish-button]) {
                  display: none !important;
                  visibility: hidden !important;
                  opacity: 0 !important;
                  pointer-events: none !important;
                  position: absolute !important;
                  left: -9999px !important;
                  width: 0 !important;
                  height: 0 !important;
                  padding: 0 !important;
                  margin: 0 !important;
                  overflow: hidden !important;
                }
                
                [class*="PuckHeader-inner"] {
                  display: flex !important;                 
                  white-space: nowrap !important;
                  
                }
                
                [class*="PuckHeader-title"] {
                 margin-left: auto !important;
                 margin-right: auto !important;
                }
                



                /* Style action buttons container */
                [data-action-buttons] {
                  display: flex !important;
                  align-items: center !important;
                  gap: 0 !important;
                  border-left: 1px solid #e5e7eb !important;
                  margin-left: 8px !important;
                  padding-left: 8px !important;
                  flex-shrink: 0 !important;
                }

                .puck {
                  height: 100% !important;
                }
                .puck__sidebar {
                  height: 100% !important;
                  overflow-y: auto !important;
                  max-height: calc(100vh - 64px) !important;
                }
                .puck__sidebar-content {
                  height: auto !important;
                  min-height: 100% !important;
                }
                [class*="puck__component-list"],
                [class*="puck__components"],
                [class*="puck__component-categories"] {
                  max-height: none !important;
                  overflow-y: auto !important;
                }
                .puck__sidebar [class*="scroll"],
                .puck__sidebar [class*="overflow"] {
                  overflow-y: auto !important;
                  max-height: none !important;
                }
                
                [data-puck-interactive="true"],
                [data-puck-interactive="true"] * {
                  pointer-events: auto !important;
                  cursor: pointer !important;
                }
                
                [data-puck-interactive="true"] {
                  position: relative !important;
                  z-index: 999 !important;
                }
              `}
            </style>
            <PuckDataContext.Provider value={{ data: currentData, onChange }}>
              <Puck 
                key={`${currentPage}-sidebar-${showCustomSidebar}`}
                config={config as any} 
                data={currentData}
                ui={showCustomSidebar ? {
                  ...puckUi,
                  leftSideBarVisible: false,
                  rightSideBarVisible: true,
                  drawer: null
                } : {
                  ...puckUi,
                  leftSideBarVisible: true,
                  rightSideBarVisible: showRightSidebar,
                }}
                onChange={onChange as any}
              />
            </PuckDataContext.Provider>
            <PuckHeaderButtons
              onPreviewToggle={onPreviewToggle}
              onPublish={() => onPublish(currentData)}
              showPreview={showPreview}
              onBack={handleBackButtonClick}
            />
          </div>
        </NavigationProvider>
      )}

      <PageCreationModal
        isVisible={showPageCreationModal}
        onClose={() => {
          setShowPageCreationModal(false)
        }}
        onSelect={handlePageCreationSelect}
      />

      <BlockTypeSelectionModal
        isVisible={showBlockTypeModal}
        onClose={() => setShowBlockTypeModal(false)}
        onSelect={handleBlockTypeSelect}
      />

      <TemplateSelectionModal
        isVisible={showTemplateModal}
        onClose={() => setShowTemplateModal(false)}
        onSelect={handleTemplateSelect}
      />
    </div>
  )
}

const PuckHeaderButtons: React.FC<{
  onPreviewToggle: () => void
  onPublish: () => void
  showPreview: boolean
  onBack?: () => void
}> = ({ onPreviewToggle, onPublish, showPreview, onBack }) => {
  useEffect(() => {
    const waitForPageReady = () => {
      return new Promise<void>((resolve) => {
        if (document.readyState === 'complete') {
          resolve()
        } else {
          window.addEventListener('load', () => resolve(), { once: true })
        }
      })
    }

    const findAndInjectButtons = () => {
      const headerSelectors = [
        '[class*="Header"]',
        'header',
        '[class*="puck__header"]',
        '[data-puck-header]',
      ]

      let header: HTMLElement | null = null
      for (const selector of headerSelectors) {
        const elements = document.querySelectorAll(selector)
        for (const el of Array.from(elements)) {
          if (el.querySelector('button') || el.textContent?.includes('Publish')) {
            header = el as HTMLElement
            break
          }
        }
        if (header) break
      }

      if (!header) return

      const existingLeftContainer = header.querySelector('[data-puck-header-left]')
      const existingPreviewBtn = header.querySelector('[data-custom-preview-button]')
      const existingPublishBtn = header.querySelector('[data-custom-publish-button]')
      
      if (existingLeftContainer && existingPreviewBtn && existingPublishBtn) {
        return
      }
      
      if (existingPreviewBtn && existingPreviewBtn.parentNode) {
        existingPreviewBtn.parentNode.removeChild(existingPreviewBtn)
      }
      if (existingPublishBtn && existingPublishBtn.parentNode) {
        existingPublishBtn.parentNode.removeChild(existingPublishBtn)
      }

      const allButtons = Array.from(header.querySelectorAll('button'))
      
      const publishButtons = allButtons.filter(btn => {
        const text = btn.textContent || ''
        const ariaLabel = btn.getAttribute('aria-label') || ''
        const title = btn.getAttribute('title') || ''
        const testId = btn.getAttribute('data-testid') || ''
        return testId.includes('publish') ||
               text.toLowerCase().includes('publish') || 
               ariaLabel.toLowerCase().includes('publish') ||
               title.toLowerCase().includes('publish') ||
               btn.className.includes('publish') ||
               btn.className.includes('Publish')
      }) as HTMLElement[]

      publishButtons.forEach(publishButton => {
        if (!publishButton.hasAttribute('data-custom-publish-button')) {
          publishButton.style.display = 'none'
          publishButton.style.visibility = 'hidden'
          publishButton.setAttribute('data-hidden-publish-btn', 'true')
        }
      })

      const menuBarInner = header.querySelector('[class*="MenuBar-inner"]') as HTMLElement
      if (menuBarInner) {
        menuBarInner.style.setProperty('margin-left', 'auto', 'important')
        menuBarInner.style.setProperty('flex-shrink', '0', 'important')
        menuBarInner.style.setProperty('white-space', 'nowrap', 'important')
        
        const menuBarParent = menuBarInner.parentElement
        if (menuBarParent) {
          const parentStyle = window.getComputedStyle(menuBarParent)
          if (parentStyle.display !== 'flex') {
            menuBarParent.style.setProperty('display', 'flex', 'important')
            menuBarParent.style.setProperty('align-items', 'center', 'important')
            menuBarParent.style.setProperty('width', '100%', 'important')
          }
        }
      }

      const headerInner = header.querySelector('[class*="PuckHeader-inner"]') as HTMLElement
      
      if (!headerInner) return

      const allInnerElements = Array.from(headerInner.querySelectorAll('*')) as HTMLElement[]
      const panelToggleButtons = allInnerElements.filter(el => {
        const svg = el.querySelector('svg')
        if (svg) {
          const svgClass = svg.getAttribute('class') || ''
          return svgClass.includes('lucide-panel') || 
                 svgClass.includes('panel-right') || 
                 svgClass.includes('panel-left') ||
                 svg.getAttribute('data-lucide')?.includes('panel')
        }
        let elClass = ''
        if (typeof el.className === 'string') {
          elClass = el.className
        } else if (el.className && typeof el.className === 'object') {
          elClass = String(el.className) || ''
        }
        const ariaLabel = (el.getAttribute('aria-label') || '').toLowerCase()
        const title = (el.getAttribute('title') || '').toLowerCase()
        return elClass.includes('lucide-panel') ||
               elClass.includes('panel-right') ||
               elClass.includes('panel-left') ||
               ariaLabel.includes('panel') ||
               title.includes('panel')
      })

      const existingBackButton = headerInner.querySelector('[data-custom-back-button]')

      if (onBack && panelToggleButtons.length > 0 && !existingBackButton) {
        const firstPanelButton = panelToggleButtons[0]
        
        const backButton = document.createElement('button')
        backButton.setAttribute('data-custom-back-button', 'true')
        backButton.setAttribute('title', 'Back')
        backButton.setAttribute('aria-label', 'Back')
        backButton.style.cssText = `
          background: none;
          border: none;
          color: #6b7280;
          cursor: pointer;
          padding: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 4px;
          transition: all 0.2s ease;
          flex-shrink: 0;
        `
        
        const backIcon = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
        backIcon.setAttribute('width', '20')
        backIcon.setAttribute('height', '20')
        backIcon.setAttribute('viewBox', '0 0 24 24')
        backIcon.setAttribute('fill', 'none')
        backIcon.setAttribute('stroke', 'currentColor')
        backIcon.setAttribute('stroke-width', '2')
        backIcon.setAttribute('stroke-linecap', 'round')
        backIcon.setAttribute('stroke-linejoin', 'round')
        backIcon.innerHTML = '<path d="M19 12H5M12 19l-7-7 7-7"/>'
        backButton.appendChild(backIcon)
        
        backButton.addEventListener('click', (e) => {
          e.preventDefault()
          e.stopPropagation()
          onBack()
        })
        
        backButton.addEventListener('mouseenter', () => {
          backButton.style.backgroundColor = '#f3f4f6'
          backButton.style.color = '#374151'
        })
        backButton.addEventListener('mouseleave', () => {
          backButton.style.backgroundColor = 'transparent'
          backButton.style.color = '#6b7280'
        })

        const backDivider = document.createElement('div')
        backDivider.setAttribute('data-back-button-divider', 'true')
        backDivider.style.cssText = `
          width: 1px;
          height: 24px;
          background-color: #e5e7eb;
          margin: 0 8px;
          flex-shrink: 0;
        `

        const panelButtonParent = firstPanelButton.parentElement
        if (panelButtonParent === headerInner) {
          headerInner.insertBefore(backDivider, firstPanelButton)
          headerInner.insertBefore(backButton, backDivider)
        } else if (panelButtonParent) {
          panelButtonParent.insertBefore(backDivider, firstPanelButton)
          panelButtonParent.insertBefore(backButton, backDivider)
        } else {
          headerInner.insertBefore(backDivider, headerInner.firstChild)
          headerInner.insertBefore(backButton, backDivider)
        }
      }

      const allHeaderButtons = Array.from(header.querySelectorAll('button, [role="button"], span[class*="Button"]')) as HTMLElement[]
      let undoButton = allHeaderButtons.find(btn => {
        const ariaLabel = (btn.getAttribute('aria-label') || '').toLowerCase()
        const title = (btn.getAttribute('title') || '').toLowerCase()
        return ariaLabel.includes('undo') || title.includes('undo')
      })
      
      let redoButton = allHeaderButtons.find(btn => {
        const ariaLabel = (btn.getAttribute('aria-label') || '').toLowerCase()
        const title = (btn.getAttribute('title') || '').toLowerCase()
        return ariaLabel.includes('redo') || title.includes('redo')
      })
      
      let insertAfterElement: HTMLElement | null = null
      if (redoButton && redoButton.parentElement) {
        insertAfterElement = redoButton.parentElement
      } else if (undoButton && undoButton.parentElement) {
        insertAfterElement = undoButton.parentElement
      } else if (redoButton) {
        insertAfterElement = redoButton
      } else if (undoButton) {
        insertAfterElement = undoButton
      }
      
      let leftContainer = header.querySelector('[data-puck-header-left]') as HTMLElement
      
      if (!leftContainer) {
        leftContainer = document.createElement('div')
        leftContainer.setAttribute('data-puck-header-left', 'true')
        leftContainer.style.display = 'flex'
        leftContainer.style.alignItems = 'center'
        leftContainer.style.gap = '0'
        leftContainer.setAttribute('data-styles-set', 'true')
        if (insertAfterElement && insertAfterElement.nextSibling) {
          insertAfterElement.parentElement?.insertBefore(leftContainer, insertAfterElement.nextSibling)
        } else if (insertAfterElement) {
          insertAfterElement.parentElement?.appendChild(leftContainer)
        } else {
          header.insertBefore(leftContainer, header.firstChild)
        }
      }

      if (existingPreviewBtn && existingPublishBtn) {
        return
      }

      const existingActionContainer = leftContainer.querySelector('[data-action-buttons]')
      if (existingActionContainer) {
        existingActionContainer.remove()
      }
      
      const actionButtonsContainer = document.createElement('div')
      actionButtonsContainer.setAttribute('data-action-buttons', 'true')
      actionButtonsContainer.style.cssText = `
        display: flex;
        align-items: center;
        border-left: 1px solid #e5e7eb;
      `

      const previewContainer = document.createElement('div')
      previewContainer.setAttribute('data-preview-container', 'true')
      previewContainer.style.cssText = `
        display: flex;
        align-items: center;
        border-left: 1px solid #e5e7eb;
      `

      if (!existingPreviewBtn) {
        const previewBtn = document.createElement('button')
        previewBtn.setAttribute('data-custom-preview-button', 'true')
        previewBtn.setAttribute('title', showPreview ? 'Exit Preview' : 'Preview')
        previewBtn.style.cssText = `
          background: ${showPreview ? '#7c3aed' : 'transparent'};
          border: none;
          color: ${showPreview ? '#ffffff' : '#6b7280'};
          cursor: pointer;
          padding: 8px 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 0;
        `
        
        const previewIcon = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
        previewIcon.setAttribute('width', '20')
        previewIcon.setAttribute('height', '20')
        previewIcon.setAttribute('viewBox', '0 0 24 24')
        previewIcon.setAttribute('fill', 'none')
        previewIcon.setAttribute('stroke', 'currentColor')
        previewIcon.setAttribute('stroke-width', '2')
        previewIcon.innerHTML = '<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle>'
        previewBtn.appendChild(previewIcon)
        
        previewBtn.addEventListener('click', onPreviewToggle)
        previewBtn.addEventListener('mouseenter', () => {
          if (!showPreview) {
            previewBtn.style.backgroundColor = '#f3f4f6'
            previewBtn.style.color = '#7c3aed'
          }
        })
        previewBtn.addEventListener('mouseleave', () => {
          if (!showPreview) {
            previewBtn.style.backgroundColor = 'transparent'
            previewBtn.style.color = '#6b7280'
          } else {
            previewBtn.style.backgroundColor = '#7c3aed'
            previewBtn.style.color = '#ffffff'
          }
        })

        previewContainer.appendChild(previewBtn)
        actionButtonsContainer.appendChild(previewContainer)
      }

      if (!existingPublishBtn) {
        const publishBtn = document.createElement('button')
        publishBtn.setAttribute('data-custom-publish-button', 'true')
        publishBtn.setAttribute('title', 'Publish')
        publishBtn.style.cssText = `
          background: #7c3aed;
          border: none;
          color: #ffffff;
          cursor: pointer;
          padding: 8px 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 0;
          transition: all 0.2s ease;
        `
        
        const publishIcon = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
        publishIcon.setAttribute('width', '20')
        publishIcon.setAttribute('height', '20')
        publishIcon.setAttribute('viewBox', '0 0 24 24')
        publishIcon.setAttribute('fill', 'none')
        publishIcon.setAttribute('stroke', 'currentColor')
        publishIcon.setAttribute('stroke-width', '2')
        publishIcon.setAttribute('stroke-linecap', 'round')
        publishIcon.setAttribute('stroke-linejoin', 'round')
        publishIcon.innerHTML = '<circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>'
        publishBtn.appendChild(publishIcon)
        
        publishBtn.addEventListener('click', onPublish)
        publishBtn.addEventListener('mouseenter', () => {
          publishBtn.style.backgroundColor = '#6d28d9'
          publishBtn.style.opacity = '0.9'
        })
        publishBtn.addEventListener('mouseleave', () => {
          publishBtn.style.backgroundColor = '#7c3aed'
          publishBtn.style.opacity = '1'
        })

        const publishDivider = document.createElement('div')
        publishDivider.setAttribute('data-publish-divider', 'true')
        publishDivider.style.cssText = `
          width: 1px;
          height: 24px;
          background-color: #e5e7eb;
          margin: 0 8px;
        `

        actionButtonsContainer.appendChild(publishDivider)
        actionButtonsContainer.appendChild(publishBtn)
      }

      if (actionButtonsContainer.children.length > 0) {
        leftContainer.appendChild(actionButtonsContainer)
      }

    }

    const hideAllPublishButtons = () => {
      const puckHeaders = document.querySelectorAll('[class*="puck"]:not([data-puck-header-left]), [class*="Puck"]:not([data-puck-header-left]), header:not([data-puck-header-left]), [class*="Header"]:not([data-puck-header-left]), [class*="Toolbar"]:not([data-puck-header-left]), [class*="toolbar"]:not([data-puck-header-left]), [class*="PuckHeader"]:not([data-puck-header-left])')
      const puckHeaderButtons: HTMLElement[] = []
      puckHeaders.forEach(header => {
        if (header.hasAttribute('data-puck-header-left') || header.querySelector('[data-puck-header-left]')) {
          return
        }
        const buttons = header.querySelectorAll('button:not([data-puck-header-left] *), span[class*="Button"]:not([data-puck-header-left] *), span[class*="button"]:not([data-puck-header-left] *), div[class*="Button"]:not([data-puck-header-left] *), div[class*="button"]:not([data-puck-header-left] *), [role="button"]:not([data-puck-header-left] *)')
        buttons.forEach(btn => {
          if (!btn.closest('[data-puck-header-left]')) {
            puckHeaderButtons.push(btn as HTMLElement)
          }
        })
      })
      
      const allDocumentButtons = Array.from(document.querySelectorAll('button:not([data-puck-header-left] *), span[class*="Button"]:not([data-puck-header-left] *), span[class*="button"]:not([data-puck-header-left] *), [role="button"]:not([data-puck-header-left] *)')) as HTMLElement[]
      const filteredButtons = allDocumentButtons.filter(btn => !btn.closest('[data-puck-header-left]'))
      
      const buttonsToCheck = [...new Set([...puckHeaderButtons, ...filteredButtons])]
      
      buttonsToCheck.forEach(btn => {
        if (btn.hasAttribute('data-custom-publish-button') ||
            btn.hasAttribute('data-custom-preview-button')) {
          return
        }
        
        if (btn.hasAttribute('data-hidden-publish-btn')) {
          const isVisible = window.getComputedStyle(btn).display !== 'none'
          if (!isVisible) return
          btn.removeAttribute('data-hidden-publish-btn')
        }
        
        const text = (btn.textContent || '').trim()
        const innerHTML = btn.innerHTML || ''
        const ariaLabel = btn.getAttribute('aria-label') || ''
        const title = btn.getAttribute('title') || ''
        const testId = btn.getAttribute('data-testid') || ''
        const className = btn.className || ''
        const style = btn.getAttribute('style') || ''
        
        const computedStyle = window.getComputedStyle(btn)
        const bgColor = computedStyle.backgroundColor
        const isPurpleButton = bgColor.includes('124, 58, 237') ||
                               bgColor.includes('111, 66, 193') ||
                               bgColor.includes('purple') ||
                               style.includes('7c3aed') ||
                               style.includes('6f42c1')
        
        const isProtectedButton = 
          text.toLowerCase().includes('toggle') ||
          text.toLowerCase().includes('sidebar') ||
          text.toLowerCase().includes('menu') ||
          text.toLowerCase() === 'undo' ||
          text.toLowerCase() === 'redo' ||
          text.toLowerCase().includes('undo') ||
          text.toLowerCase().includes('redo') ||
          className.includes('IconButton') && !isPurpleButton
        
        if (isProtectedButton) {
          return
        }
        
        const hasPublishText = 
          testId.toLowerCase().includes('publish') ||
          text.toLowerCase() === 'publish' ||
          text.toLowerCase().includes('publish') || 
          ariaLabel.toLowerCase().includes('publish') ||
          title.toLowerCase().includes('publish') ||
          className.toLowerCase().includes('publish') ||
          innerHTML.toLowerCase().includes('publish')
        
        const svgElement = btn.querySelector('svg')
        const hasGlobeIcon = svgElement && (
          svgElement.innerHTML.includes('globe') ||
          svgElement.innerHTML.includes('Globe') ||
          (svgElement.innerHTML.includes('circle') && hasPublishText)
        )
        
        const isPublishButton = 
          hasPublishText ||
          (isPurpleButton && (hasPublishText || hasGlobeIcon)) ||
          (hasGlobeIcon && hasPublishText)
        
        if (isPublishButton) {
          try {
            const parent = btn.parentElement
            const grandParent = parent?.parentElement
            
            btn.remove()
            
            if (parent && parent.children.length === 0) {
              parent.remove()
            }
            
            if (grandParent && grandParent.children.length === 0) {
              grandParent.remove()
            }
            
            return
          } catch (removeError) {
          }
          
          btn.style.cssText = 'display: none !important; visibility: hidden !important; opacity: 0 !important; pointer-events: none !important; position: absolute !important; left: -9999px !important; width: 0 !important; height: 0 !important; padding: 0 !important; margin: 0 !important; border: none !important; outline: none !important; overflow: hidden !important;'
          
          btn.style.setProperty('display', 'none', 'important')
          btn.style.setProperty('visibility', 'hidden', 'important')
          btn.style.setProperty('opacity', '0', 'important')
          btn.style.setProperty('pointer-events', 'none', 'important')
          btn.style.setProperty('position', 'absolute', 'important')
          btn.style.setProperty('left', '-9999px', 'important')
          btn.style.setProperty('width', '0', 'important')
          btn.style.setProperty('height', '0', 'important')
          btn.style.setProperty('padding', '0', 'important')
          btn.style.setProperty('margin', '0', 'important')
          btn.style.setProperty('border', 'none', 'important')
          btn.style.setProperty('outline', 'none', 'important')
          btn.style.setProperty('overflow', 'hidden', 'important')
          btn.setAttribute('data-hidden-publish-btn', 'true')
          
          btn.setAttribute('aria-hidden', 'true')
          btn.setAttribute('tabindex', '-1')
          
          try {
            const parent = btn.parentElement
            if (parent) {
              const parentText = parent.textContent?.toLowerCase().trim() || ''
              const hasOnlyPublish = parent.children.length === 1 && 
                                     (parentText === 'publish' || parentText.includes('publish'))
              if (hasOnlyPublish) {
                parent.remove()
              } else {
                const visibleChildren = Array.from(parent.children).filter((child: Element) => {
                  const childStyle = window.getComputedStyle(child as HTMLElement)
                  return childStyle.display !== 'none'
                })
                if (visibleChildren.length === 0) {
                  parent.style.setProperty('display', 'none', 'important')
                }
              }
            }
          } catch (e) {
          }
        }
        
        if (!isPublishButton && !btn.hasAttribute('data-custom-publish-button') && !btn.hasAttribute('data-hidden-publish-btn') && !isProtectedButton) {
          const btnParent = btn.closest('header, [class*="Header"], [class*="Toolbar"], [class*="toolbar"], [class*="puck"], [class*="PuckHeader"]')
          if (btnParent) {
            const computedBg = window.getComputedStyle(btn).backgroundColor
            const btnText = (btn.textContent || '').trim().toLowerCase()
            const tagName = btn.tagName.toUpperCase()
            const hasButtonClass = className.includes('Button')
            
            const isPurpleColored = computedBg.includes('124, 58, 237') ||
                                   computedBg.includes('111, 66, 193') ||
                                   computedBg.includes('139, 92, 246') ||
                                   computedBg.includes('147, 51, 234') ||
                                   btn.getAttribute('style')?.includes('7c3aed') ||
                                   btn.getAttribute('style')?.includes('6f42c1') ||
                                   btn.getAttribute('style')?.includes('8b5cf6')
            
            if ((isPurpleColored && btnText.includes('publish')) ||
                (tagName === 'SPAN' && hasButtonClass && btnText.includes('publish') && isPurpleColored)) {
              try {
                btn.remove()
              } catch (e) {
                btn.style.setProperty('display', 'none', 'important')
                btn.style.setProperty('visibility', 'hidden', 'important')
                btn.style.setProperty('opacity', '0', 'important')
                btn.style.setProperty('width', '0', 'important')
                btn.style.setProperty('height', '0', 'important')
                btn.style.setProperty('position', 'absolute', 'important')
                btn.style.setProperty('left', '-9999px', 'important')
                btn.setAttribute('data-hidden-publish-btn', 'true')
              }
            }
          }
        }
      })
    }

    const observer = new MutationObserver((mutations) => {
      let shouldCheck = false
      mutations.forEach((mutation) => {
        if (mutation.addedNodes.length > 0) {
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType === 1) {
              const element = node as HTMLElement
              const tagName = element.tagName.toUpperCase()
              const isButtonLike = tagName === 'BUTTON' || 
                                   tagName === 'SPAN' ||
                                   element.classList.toString().includes('Button') ||
                                   element.getAttribute('role') === 'button'
              
              if (isButtonLike) {
                const text = (element.textContent || '').toLowerCase()
                if (text.includes('publish')) {
                  hideAllPublishButtons()
                  shouldCheck = true
                }
              } else if (element.querySelector('button, span[class*="Button"], [role="button"]')) {
                shouldCheck = true
              }
            }
          })
        }
        
        if (mutation.type === 'attributes' && mutation.target) {
          const target = mutation.target as HTMLElement
          const tagName = target.tagName.toUpperCase()
          const isButtonLike = tagName === 'BUTTON' || 
                               tagName === 'SPAN' ||
                               target.classList.toString().includes('Button') ||
                               target.getAttribute('role') === 'button'
          
          if (isButtonLike && !target.hasAttribute('data-custom-publish-button')) {
            const text = (target.textContent || '').toLowerCase()
            if (text.includes('publish')) {
              hideAllPublishButtons()
            }
          }
        }
      })
      if (shouldCheck) {
        setTimeout(hideAllPublishButtons, 0)
        setTimeout(hideAllPublishButtons, 50)
      }
    })

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['style', 'class', 'data-testid']
    })

    waitForPageReady().then(() => {
      requestAnimationFrame(() => {
        findAndInjectButtons()
        hideAllPublishButtons()
      })
    })
    
    let rafId: number | null = null
    let intervalId: ReturnType<typeof setInterval> | null = null
    let timeoutIds: ReturnType<typeof setTimeout>[] = []
    let buttonsInjected = false
    
    waitForPageReady().then(() => {
      timeoutIds = [
        setTimeout(() => { hideAllPublishButtons() }, 0),
        setTimeout(() => { hideAllPublishButtons() }, 10),
        setTimeout(() => { hideAllPublishButtons() }, 50),
        setTimeout(() => { hideAllPublishButtons() }, 100),
        setTimeout(() => { hideAllPublishButtons() }, 200),
        setTimeout(() => { hideAllPublishButtons() }, 500),
        setTimeout(() => { hideAllPublishButtons() }, 1000)
      ]
      
      const timeout = setTimeout(() => {
        findAndInjectButtons()
        hideAllPublishButtons()
        const existingPreview = document.querySelector('[data-custom-preview-button]')
        const existingPublish = document.querySelector('[data-custom-publish-button]')
        if (existingPreview && existingPublish) {
          buttonsInjected = true
        }
      }, 100)
      timeoutIds.push(timeout)
      
      const checkWithRAF = () => {
        if (!buttonsInjected) {
          hideAllPublishButtons()
          rafId = requestAnimationFrame(checkWithRAF)
        } else {
          rafId = null
        }
      }
      checkWithRAF()
      
      const createInterval = (slow: boolean) => {
        if (intervalId !== null) {
          clearInterval(intervalId)
        }
        intervalId = setInterval(() => {
          if (!buttonsInjected) {
            const existingPreview = document.querySelector('[data-custom-preview-button]')
            const existingPublish = document.querySelector('[data-custom-publish-button]')
            if (!existingPreview || !existingPublish) {
              hideAllPublishButtons()
              findAndInjectButtons()
            } else {
              buttonsInjected = true
              createInterval(true)
            }
          } else {
            hideAllPublishButtons()
          }
        }, slow ? 2000 : 100)
      }
      createInterval(false)
    })

    return () => {
      timeoutIds.forEach(t => clearTimeout(t))
      if (intervalId !== null) {
        clearInterval(intervalId)
      }
      if (rafId !== null) {
        cancelAnimationFrame(rafId)
      }
      observer.disconnect()
      const existingButtons = document.querySelector('[data-custom-buttons="true"]')
      if (existingButtons) {
        existingButtons.remove()
      }
    }
   }, [onPreviewToggle, onPublish, showPreview, onBack])

  return null
}

export default EditorView
