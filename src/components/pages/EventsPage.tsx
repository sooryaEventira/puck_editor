import React, { useState, useEffect } from 'react'
import { usePageManagement } from '../../hooks/usePageManagement'
import Preview from '../Preview'
import SchedulePage from '../advanced/SchedulePage'

interface EventsPageProps {
  onBackToEditor?: () => void
  onNavigateToEditor?: () => void
}

const EventsPage: React.FC<EventsPageProps> = ({ onBackToEditor, onNavigateToEditor }) => {
  const [isWebpageMenuOpen, setIsWebpageMenuOpen] = useState(true)
  const [selectedPageId, setSelectedPageId] = useState<string | null>(null)
  const [selectedPageData, setSelectedPageData] = useState<any>(null)
  const [activeTab, setActiveTab] = useState<'edit' | 'settings'>('edit')
  const [localPages, setLocalPages] = useState<any[]>([])
  const [showSchedulePage, setShowSchedulePage] = useState(false)
  
  const { pages, loadPage } = usePageManagement()

  // Debug: Check if onNavigateToEditor is received
  React.useEffect(() => {
    console.log('EventsPage: onNavigateToEditor prop:', onNavigateToEditor);
    console.log('EventsPage: onNavigateToEditor type:', typeof onNavigateToEditor);
  }, [onNavigateToEditor]);

  // Update local pages when pages from hook change
  React.useEffect(() => {
    setLocalPages(pages)
  }, [pages])

  // Auto-select first page when menu opens
  useEffect(() => {
    if (isWebpageMenuOpen && localPages.length > 0 && selectedPageId === null) {
      const firstPage = localPages[0]
      setSelectedPageId(firstPage.id)
      loadPageData(firstPage.id)
    }
  }, [isWebpageMenuOpen, localPages, selectedPageId])

  const loadPageData = async (pageId: string) => {
    try {
      const pageData = await loadPage(pageId)
      setSelectedPageData(pageData)
    } catch (error) {
      console.error('Error loading page:', error)
      setSelectedPageData(null)
    }
  }

  const handleWebpageSelect = (pageId: string) => {
    setSelectedPageId(pageId)
    loadPageData(pageId)
  }

  const handleCreateNewPage = async () => {
    try {
      const timestamp = new Date().toLocaleTimeString()
      const pageName = `Page ${timestamp}`
      const pageId = `page-${Date.now()}`
      
      const newPage = {
        id: pageId,
        name: pageName,
        filename: `${pageId}.json`,
        lastModified: new Date().toISOString()
      }
      
      setLocalPages(prevPages => [...prevPages, newPage])
      setSelectedPageId(pageId)
      
      setSelectedPageData({
        content: [],
        root: { props: { title: pageName } },
        zones: {}
      })
    } catch (error) {
      console.error('Error creating page:', error)
    }
  }

  const handleViewWebpage = () => {
    if (selectedPageData) {
      // Open preview in new tab
      const previewWindow = window.open('', '_blank')
      if (previewWindow) {
        const selectedPage = localPages.find(p => p.id === selectedPageId)
        previewWindow.document.write(`
          <!DOCTYPE html>
          <html>
            <head>
              <title>${selectedPage?.name || 'Page Preview'}</title>
              <style>
                body { margin: 0; padding: 20px; font-family: Arial, sans-serif; }
                .preview-container { max-width: 1200px; margin: 0 auto; }
                .preview-content {

                  padding: 20px;
                  background: white;
                }
              </style>
            </head>
            <body>
              <div class="preview-container">
                <div class="preview-content">
                  ${selectedPageData.content?.map((item: any) => {
                    // Render Heading components
                    if (item.type === 'Heading') {
                      const level = item.props?.level || 1
                      const text = item.props?.text || ''
                      const color = item.props?.color || '#333'
                      const align = item.props?.align || 'left'
                      const headingStyle = `margin: 16px 0; color: ${color}; font-weight: bold; text-align: ${align};`
                      return `<h${level} style="${headingStyle}">${text}</h${level}>`
                    }
                    // Render Checkbox components
                    if (item.type === 'Checkbox') {
                      const label = item.props?.label || ''
                      const checked = typeof item.props?.checked === 'string' ? item.props.checked === 'true' : Boolean(item.props?.checked)
                      return `
                        <div style="padding: 8px;  margin: 8px 0;">
                          <label style="display: flex; align-items: center; cursor: pointer; margin: 0; font-size: 14px; color: #374151;">
                            <input type="checkbox" ${checked ? 'checked' : ''} style="margin-right: 8px; width: 16px; height: 16px;" readonly />
                            ${label}
                          </label>
                        </div>
                      `
                    }
                    // Fallback for other components
                    return `<div style="margin: 10px 0; padding: 10px; background: white; border-left: 3px solid #007bff;">
                      <strong>${item.type}:</strong> ${item.props?.text || item.props?.title || item.props?.content || 'No content'}
                    </div>`
                  }).join('') || '<p>No content available</p>'}
                </div>
              </div>
            </body>
          </html>
        `)
        previewWindow.document.close()
      }
    }
  }

  const sidebarStyle: React.CSSProperties = {
    width: '200px',
    backgroundColor: '#f8f9fa',
    borderRight: '1px solid #dee2e6',
    height: '100vh',
    overflowY: 'auto',
    padding: '20px 0'
  }

  const contentAreaStyle: React.CSSProperties = {
    flex: 1,
    height: '100vh',
    display: 'flex',
    flexDirection: 'column'
  }

  const headerStyle: React.CSSProperties = {
    padding: '20px',
    borderBottom: '1px solid #dee2e6',
    backgroundColor: '#ffffff',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  }

  const menuItemStyle: React.CSSProperties = {
    padding: '12px 20px',
    cursor: 'pointer',
    borderBottom: '1px solid #e9ecef',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#ffffff',
    transition: 'background-color 0.2s ease'
  }

  const submenuItemStyle: React.CSSProperties = {
    padding: '10px 20px 10px 40px',
    cursor: 'pointer',
    borderBottom: '1px solid #f1f3f4',
    backgroundColor: '#f8f9fa',
    transition: 'background-color 0.2s ease',
    fontSize: '14px'
  }

  const selectedSubmenuItemStyle: React.CSSProperties = {
    ...submenuItemStyle,
    backgroundColor: '#e3f2fd',
    borderLeft: '3px solid #2196f3',
    fontWeight: '500'
  }

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      {/* Left Sidebar */}
      <div style={sidebarStyle}>
        <div style={{ padding: '0 20px 20px' }}></div>

        {/* Webpage Menu */}
        <div>
          <div
            style={menuItemStyle}
            onClick={() => setIsWebpageMenuOpen(!isWebpageMenuOpen)}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#e9ecef'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#ffffff'}
          >
            <span style={{ fontWeight: '600', color: '#333' }}>
              🌐 Webpage
            </span>
            <span style={{ fontSize: '12px', color: '#666' }}>
              {isWebpageMenuOpen ? '▼' : '▶'}
            </span>
          </div>



          {/* Submenu Items */}
          {isWebpageMenuOpen && (
            <div>
              {localPages.map((page) => (
                <div
                  key={page.id}
                  style={
                    selectedPageId === page.id
                      ? selectedSubmenuItemStyle
                      : submenuItemStyle
                  }
                  onClick={() => handleWebpageSelect(page.id)}
                  onMouseEnter={(e) => {
                    if (selectedPageId !== page.id) {
                      e.currentTarget.style.backgroundColor = '#e9ecef'
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (selectedPageId !== page.id) {
                      e.currentTarget.style.backgroundColor = '#f8f9fa'
                    }
                  }}
                >
                  📄 {page.name}
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* New Page Menu Item */}
        <div
          style={{
            ...menuItemStyle,
            backgroundColor: '#e8f5e8',
            borderLeft: '3px solid #28a745'
          }}
          onClick={handleCreateNewPage}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#d4edda'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#e8f5e8'}
        >
          <span style={{ fontWeight: '600', color: '#28a745' }}>
            ➕ New Page
          </span>
        </div>
      </div>

      {/* Right Content Area */}
      <div style={contentAreaStyle}>
        {/* Header with Webpage Name and Tabs */}
        <div style={headerStyle}>
          <div>
            <h1 style={{ margin: 0, fontSize: '24px', color: '#333' }}>
              {selectedPageId ? localPages.find(p => p.id === selectedPageId)?.name || 'Untitled Page' : 'Select a Page'}
            </h1>
            <p style={{ margin: '5px 0 0 0', color: '#666', fontSize: '14px' }}>
              {selectedPageId ? '' : 'Choose a webpage from the sidebar'}
            </p>
          </div>
          <div>
            <button
              onClick={handleViewWebpage}
              disabled={!selectedPageData}
              style={{
                padding: '10px 20px',
                backgroundColor: selectedPageData ? '#28a745' : '#6c757d',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: selectedPageData ? 'pointer' : 'not-allowed',
                fontSize: '14px',
                fontWeight: '500'
              }}
            >
              👁️ View Webpage
            </button>
          </div>
        </div>

        {/* Tabs */}
        {selectedPageId && (
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderBottom: '1px solid #e9ecef',
            backgroundColor: '#f8f9fa',
            padding: '0 20px'
          }}>
            <div style={{ display: 'flex' }}>
              <button
                onClick={() => setActiveTab('edit')}
                style={{
                  padding: '12px 24px',
                  border: 'none',
                  backgroundColor: 'transparent',
                  color: activeTab === 'edit' ? '#007bff' : '#6c757d',
                  borderBottom: activeTab === 'edit' ? '2px solid #007bff' : '2px solid transparent',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: activeTab === 'edit' ? '600' : '400',
                  transition: 'all 0.2s ease'
                }}
              >
                ✏️ Edit
              </button>
              <button
                onClick={() => setActiveTab('settings')}
                style={{
                  padding: '12px 24px',
                  border: 'none',
                  backgroundColor: 'transparent',
                  color: activeTab === 'settings' ? '#007bff' : '#6c757d',
                  borderBottom: activeTab === 'settings' ? '2px solid #007bff' : '2px solid transparent',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: activeTab === 'settings' ? '600' : '400',
                  transition: 'all 0.2s ease'
                }}
              >
                ⚙️ Settings
              </button>
            </div>
            <button
              onClick={() => {
                setShowSchedulePage(true);
              }}
              style={{
                padding: '8px 16px',
                backgroundColor: '#28a745',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '500',
                transition: 'background-color 0.2s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#218838'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#28a745'}
            >
              ➕ ADD SESSION
            </button>
          </div>
        )}

        {/* Tab Content */}
        <div style={{ flex: 1 }}>
          {selectedPageData ? (
            <div style={{ height: '100%', padding: '20px', backgroundColor: '#f8f9fa' }}>
              {activeTab === 'edit' ? (
                <div style={{ 
                  backgroundColor: 'white', 
                  borderRadius: '8px', 
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                  height: '100%',
                  overflow: 'auto',
                  position: 'relative'
                }}>
                  {selectedPageData.content && selectedPageData.content.length > 0 ? (
                    <Preview data={selectedPageData} />
                  ) : (
                    // Show Add button when page is empty
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      height: '100%',
                      minHeight: '400px'
                    }}>
                      <button
                        onClick={() => {
                          // TODO: Add content picker or editor functionality
                        }}
                        style={{
                          padding: '16px 32px',
                          backgroundColor: '#28a745',
                          color: 'white',
                          border: 'none',
                          borderRadius: '8px',
                          fontSize: '16px',
                          fontWeight: '600',
                          cursor: 'pointer',
                          boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                          transition: 'all 0.3s ease',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = '#218838'
                          e.currentTarget.style.transform = 'translateY(-2px)'
                          e.currentTarget.style.boxShadow = '0 6px 12px rgba(0,0,0,0.15)'
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = '#28a745'
                          e.currentTarget.style.transform = 'translateY(0)'
                          e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.1)'
                        }}
                      >
                        ➕ Add Content
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div style={{ 
                  backgroundColor: 'white', 
                  borderRadius: '8px', 
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                  height: '100%',
                  padding: '20px',
                  overflow: 'auto'
                }}>
                  <h3 style={{ margin: '0 0 20px 0', color: '#333' }}>Page Settings</h3>
                  <div style={{ marginBottom: '20px' }}>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#555' }}>
                      Page Name
                    </label>
                    <input
                      type="text"
                      value={localPages.find(p => p.id === selectedPageId)?.name || ''}
                      readOnly
                      style={{
                        width: '100%',
                        padding: '8px 12px',
                        border: '1px solid #ddd',
                        borderRadius: '4px',
                        backgroundColor: '#f8f9fa',
                        color: '#666'
                      }}
                    />
                  </div>

                </div>
              )}
            </div>
          ) : selectedPageId ? (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
              color: '#666',
              fontSize: '18px'
            }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '48px', marginBottom: '20px' }}>⚠️</div>
                <div>Failed to load page data</div>
                <div style={{ fontSize: '14px', marginTop: '10px', color: '#999' }}>
                  Check console for error details
                </div>
                <button 
                  onClick={() => loadPageData(selectedPageId)}
                  style={{
                    marginTop: '20px',
                    padding: '10px 20px',
                    backgroundColor: '#007bff',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  Retry Loading
                </button>
              </div>
            </div>
          ) : (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
              color: '#666',
              fontSize: '18px'
            }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '48px', marginBottom: '20px' }}>📄</div>
                <div>Select a webpage from the sidebar to view preview</div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* SchedulePage Modal */}
      {showSchedulePage && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '8px',
            width: '90vw',
            height: '90vh',
            position: 'relative'
          }}>
            <button
              onClick={() => setShowSchedulePage(false)}
              style={{
                position: 'absolute',
                top: '10px',
                right: '10px',
                background: '#dc3545',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                padding: '8px 12px',
                cursor: 'pointer',
                zIndex: 1001
              }}
            >
              ✕ Close
            </button>
            <SchedulePage 
              onNavigateToEditor={() => {
                console.log('EventsPage: onNavigateToEditor wrapper called');
                setShowSchedulePage(false);
                if (onNavigateToEditor) {
                  console.log('EventsPage: Calling parent onNavigateToEditor');
                  onNavigateToEditor();
                } else {
                  console.error('EventsPage ERROR: onNavigateToEditor is undefined!');
                  alert('Error: Navigation function is not available. Please check the console.');
                }
              }}
            />
          </div>
        </div>
      )}

    </div>
  )
}

export default EventsPage
