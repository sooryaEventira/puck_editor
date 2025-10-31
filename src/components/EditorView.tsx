/**
 * Editor View Component
 * Renders the Puck editor with custom sidebars and page management
 */

import React from 'react'
import { Puck } from '@measured/puck'
import '@measured/puck/puck.css'

import { config } from '../config/puckConfig'
import { PageSidebar } from './page'
import Preview from './Preview'
import { NavigationProvider } from '../contexts/NavigationContext'
import { Page } from '../types'

interface EditorViewProps {
  // Data props
  currentData: any
  currentPage: string
  currentPageName: string
  pages: Page[]
  puckUi: any
  
  // Display states
  showPreview: boolean
  showLeftSidebar: boolean
  showRightSidebar: boolean
  showPageManager: boolean
  
  // Callbacks
  onPublish: (data: any) => void
  onChange: (data: any) => void
  onDataChange: (data: any) => void
  onPageSelect: (filename: string) => Promise<any>
  onAddPage: () => void
  onManagePages: () => void
  onNavigateToEditor: () => void
  onAddComponent: (componentType: string, props?: any) => void
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
}) => {
  return (
    <div style={{ flex: 1, height: 'calc(100vh - 64px)', display: 'flex', marginTop: '64px' }}>
      {showPreview ? (
        <NavigationProvider onNavigateToEditor={onNavigateToEditor} onAddComponent={onAddComponent}>
          <Preview data={currentData} isInteractive={true} onDataChange={onDataChange} />
        </NavigationProvider>
      ) : (
        <NavigationProvider onNavigateToEditor={onNavigateToEditor} onAddComponent={onAddComponent}>
          {/* Custom Left Sidebar */}
          {showLeftSidebar && (
            <PageSidebar
              pages={pages}
              currentPage={currentPage}
              currentPageName={currentPageName}
              onPageSelect={onPageSelect}
              onAddPage={onAddPage}
              onManagePages={onManagePages}
            />
          )}
          
          {/* Puck Editor */}
          <div style={{ flex: 1, height: '100%', overflow: 'hidden' }}>
            <style>
              {`
                /* Completely remove the default Puck left sidebar and its space */
                aside[class*="Sidebar--left"],
                aside[class*="Sidebar_Sidebar--left_"] {
                  display: none !important;
                  width: 0 !important;
                  min-width: 0 !important;
                  max-width: 0 !important;
                  flex: 0 !important;
                  padding: 0 !important;
                  margin: 0 !important;
                }
                
                /* Control right sidebar visibility */
                ${!showRightSidebar ? `
                  aside[class*="Sidebar--right"],
                  aside[class*="Sidebar_Sidebar--right_"] {
                    display: none !important;
                    width: 0 !important;
                  }
                ` : ''}
                
                /* Hide all resize/drag handles for sidebars */
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
                
                /* Remove all spacing from Puck's main layout */
                .puck,
                [class*="Puck"],
                [class*="puck"] {
                  padding: 0 !important;
                  margin: 0 !important;
                  gap: 0 !important;
                }
                
                /* Remove spacing from main content area */
                main,
                main[class*="Canvas"],
                [class*="Canvas"],
                [class*="Frame"],
                section {
                  padding-left: 0 !important;
                  margin-left: 0 !important;
                }
                
                /* Ensure canvas takes full available width */
                [class*="Puck"] > div,
                [class*="Puck"] section {
                  padding: 0 !important;
                  margin: 0 !important;
                  gap: 0 !important;
                }
                
                /* Ensure Puck header is visible and positioned correctly */
                [class*="Header_Header"],
                [class*="puck__header"],
                header[class*="Header"] {
                  position: relative !important;
                  z-index: 100 !important;
                }
                
                /* Fix Puck sidebar scrolling */
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
                
                /* Allow interactive elements to work inside Puck canvas */
                [data-puck-interactive="true"],
                [data-puck-interactive="true"] * {
                  pointer-events: auto !important;
                  cursor: pointer !important;
                }
                
                /* Prevent Puck drag overlay from blocking interactive elements */
                [data-puck-interactive="true"] {
                  position: relative !important;
                  z-index: 999 !important;
                }
              `}
            </style>
            <Puck 
              key={currentPage} // Force re-render when page changes
              config={config as any} 
              data={currentData}
              ui={puckUi}
              onPublish={onPublish as any}
              onChange={onChange as any}
              overrides={{
                drawer: () => <></>, // Hide default drawer
              }}
            />
          </div>
        </NavigationProvider>
      )}
    </div>
  )
}

export default EditorView

