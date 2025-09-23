import React, { useState, useEffect } from 'react'
import { usePageManagement } from '../../hooks/usePageManagement'
import Preview from '../Preview'

interface EventsPageProps {
  onBackToEditor?: () => void
}

const EventsPage: React.FC<EventsPageProps> = ({ onBackToEditor }) => {
  const [isWebpageMenuOpen, setIsWebpageMenuOpen] = useState(true)
  const [selectedPageId, setSelectedPageId] = useState<string | null>(null)
  const [selectedPageData, setSelectedPageData] = useState<any>(null)
  const [activeTab, setActiveTab] = useState<'edit' | 'settings'>('edit')
  
  const { pages, loadPage } = usePageManagement()

  // Debug logging
  console.log('EventsPage - pages:', pages)
  console.log('EventsPage - pages.length:', pages.length)

  // Auto-select first page when menu opens
  useEffect(() => {
    console.log('EventsPage useEffect - isWebpageMenuOpen:', isWebpageMenuOpen, 'pages.length:', pages.length, 'selectedPageId:', selectedPageId)
    if (isWebpageMenuOpen && pages.length > 0 && selectedPageId === null) {
      const firstPage = pages[0]
      console.log('EventsPage - selecting first page:', firstPage)
      setSelectedPageId(firstPage.id)
      loadPageData(firstPage.id)
    }
  }, [isWebpageMenuOpen, pages, selectedPageId])

  const loadPageData = async (pageId: string) => {
    console.log('EventsPage - loadPageData called with pageId:', pageId)
    try {
      const pageData = await loadPage(pageId)
      console.log('EventsPage - loaded page data:', pageData)
      console.log('EventsPage - pageData type:', typeof pageData)
      console.log('EventsPage - pageData content length:', pageData?.content?.length)
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

  const handleViewWebpage = () => {
    if (selectedPageData) {
      // Open preview in new tab
      const previewWindow = window.open('', '_blank')
      if (previewWindow) {
        const selectedPage = pages.find(p => p.id === selectedPageId)
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
        <div style={{ padding: '0 20px 20px' }}>
        
        </div>

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
              
              {pages.map((page) => (
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
      </div>

      {/* Right Content Area */}
      <div style={contentAreaStyle}>
        {/* Header with Webpage Name and Tabs */}
        <div style={headerStyle}>
          <div>
            <h1 style={{ margin: 0, fontSize: '24px', color: '#333' }}>
              {selectedPageId ? pages.find(p => p.id === selectedPageId)?.name || 'Untitled Page' : 'Select a Page'}
            </h1>
            <p style={{ margin: '5px 0 0 0', color: '#666', fontSize: '14px' }}>
              {selectedPageId ? '' : 'Choose a webpage from the sidebar'}
            </p>
          </div>
          <div>
            {/* <button
              onClick={onBackToEditor}
              style={{
                padding: '8px 16px',
                backgroundColor: '#6c757d',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                marginRight: '10px',
                fontSize: '14px'
              }}
            >
              ← Back to Editor
            </button> */}
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
                // Navigate to Puck editor with current page
                if (onBackToEditor) {
                  onBackToEditor();
                }
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
              ➕ ADD
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
                  overflow: 'auto'
                }}>
                  <Preview data={selectedPageData} />
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
                      value={pages.find(p => p.id === selectedPageId)?.name || ''}
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
    </div>
  )
}

export default EventsPage
