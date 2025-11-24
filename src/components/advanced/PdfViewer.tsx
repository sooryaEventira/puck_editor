import React, { useEffect, useState, useRef } from 'react'

export interface PdfViewerProps {
  pdfUrl?: string
  height?: number
  puck?: {
    dragRef?: React.RefObject<HTMLDivElement>
  }
}

const PdfViewer: React.FC<PdfViewerProps> = ({ 
  pdfUrl, 
  height = 600,
  puck 
}) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isPreview, setIsPreview] = useState(false)

  // Detect preview mode by checking multiple conditions
  useEffect(() => {
    // Check if we're in an iframe (common for preview)
    const inIframe = window.self !== window.top
    
    // Check if puck dragRef doesn't exist (editor mode typically has it)
    const noDragRef = !puck?.dragRef
    
    // Check URL for preview indicators
    const urlHasPreview = window.location.href.includes('preview') || 
                          window.location.search.includes('preview')
    
    // Check if parent has preview-related classes
    let hasPreviewClass = false
    if (containerRef.current) {
      let parent = containerRef.current.parentElement
      while (parent && parent !== document.body) {
        if (parent.classList.contains('puck-preview') || 
            parent.classList.contains('preview') ||
            parent.getAttribute('data-puck-preview') === 'true' ||
            parent.id === 'preview') {
          hasPreviewClass = true
          break
        }
        parent = parent.parentElement
      }
    }
    
    setIsPreview(inIframe || hasPreviewClass || noDragRef || urlHasPreview)
  }, [puck?.dragRef])

  if (!pdfUrl) {
    return (
      <div 
        ref={puck?.dragRef}
        style={{
          padding: '40px 20px',
          border: '2px dashed #d1d5db',
          borderRadius: '8px',
          backgroundColor: '#f9fafb',
          color: '#6b7280',
          textAlign: 'center',
          margin: '10px 0',
          minHeight: '200px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <div>
          <strong style={{ display: 'block', marginBottom: '8px', fontSize: '16px' }}>
            No PDF selected
          </strong>
          <small style={{ fontSize: '14px' }}>
            Please select a PDF from the property sidebar
          </small>
        </div>
      </div>
    )
  }

  // Construct the full URL for local PDFs
  const getPdfUrl = () => {
    if (pdfUrl.startsWith('http://') || pdfUrl.startsWith('https://')) {
      return pdfUrl
    }
    // For local PDFs, ensure they start with /
    return pdfUrl.startsWith('/') ? pdfUrl : `/${pdfUrl}`
  }

  const pdfUrlFinal = getPdfUrl()
  const isExternal = pdfUrl.startsWith('http://') || pdfUrl.startsWith('https://')

  // For external PDFs, use Google Docs Viewer as a proxy to embed
  const getEmbedUrl = () => {
    if (isExternal) {
      // Use Google Docs Viewer to embed external PDFs
      return `https://docs.google.com/viewer?url=${encodeURIComponent(pdfUrlFinal)}&embedded=true`
    }
    // For local PDFs, use direct URL
    return pdfUrlFinal
  }

  const embedUrl = getEmbedUrl()

  // Always show a working UI with PDF link
  return (
    <div 
      ref={(node) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ;(containerRef as any).current = node
        // Handle puck dragRef if provided (callback ref)
        if (puck?.dragRef && typeof puck.dragRef === 'function') {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          ;(puck.dragRef as any)(node)
        }
      }}
      style={{
        width: isPreview ? '100vw' : '100%',
        height: isPreview ? '100vh' : `${height}px`,
        margin: isPreview ? 0 : '20px 0',
        padding: 0,
        borderRadius: isPreview ? 0 : '8px',
        boxShadow: isPreview ? 'none' : '0 2px 8px rgba(0,0,0,0.1)',
        backgroundColor: '#ffffff',
        border: isPreview ? 'none' : '1px solid #e5e7eb',
        position: isPreview ? 'fixed' : 'relative',
        top: isPreview ? 0 : 'auto',
        left: isPreview ? 0 : 'auto',
        right: isPreview ? 0 : 'auto',
        bottom: isPreview ? 0 : 'auto',
        zIndex: isPreview ? 9999 : 'auto',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      {/* PDF Viewer */}
      <iframe
        src={embedUrl}
        width="100%"
        height="100%"
        frameBorder="0"
        style={{
          border: 'none',
          borderRadius: isPreview ? 0 : '8px',
          display: 'block',
          flex: 1,
          minHeight: 0
        }}
        title="PDF Viewer"
      >
        <div style={{ 
          padding: '40px 20px', 
          textAlign: 'center',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>📄</div>
          <p style={{ marginBottom: '12px', color: '#6b7280' }}>
            Your browser does not support PDFs.
          </p>
          <a 
            href={pdfUrlFinal} 
            target="_blank" 
            rel="noopener noreferrer" 
            style={{ 
              display: 'inline-block',
              padding: '12px 24px',
              backgroundColor: '#6366f1',
              color: '#ffffff',
              textDecoration: 'none',
              borderRadius: '6px',
              fontSize: '14px',
              fontWeight: 500
            }}
          >
            Open PDF in New Tab
          </a>
        </div>
      </iframe>
    </div>
  )
}

export default PdfViewer

