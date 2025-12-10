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
        className="py-10 px-5 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 text-gray-500 text-center my-2.5 min-h-[200px] flex items-center justify-center"
      >
        <div>
          <strong className="block mb-2 text-base">
            No PDF selected
          </strong>
          <small className="text-sm">
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
      className={`${isPreview ? 'fixed inset-0 z-[9999] w-screen h-screen m-0 rounded-none shadow-none border-0' : `relative w-full my-5 rounded-lg shadow-sm border border-gray-200`} p-0 bg-white overflow-hidden flex flex-col`}
      style={{
        height: isPreview ? '100vh' : `${height}px`
      }}
    >
      {/* PDF Viewer */}
      <iframe
        src={embedUrl}
        width="100%"
        height="100%"
        frameBorder="0"
        className={`border-0 block flex-1 min-h-0 ${isPreview ? 'rounded-none' : 'rounded-lg'}`}
        title="PDF Viewer"
      >
        <div className="py-10 px-5 text-center h-full flex flex-col items-center justify-center">
          <div className="text-5xl mb-4">📄</div>
          <p className="mb-3 text-gray-500">
            Your browser does not support PDFs.
          </p>
          <a 
            href={pdfUrlFinal} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="inline-block py-3 px-6 bg-indigo-500 text-white no-underline rounded-md text-sm font-medium hover:bg-indigo-600 transition-colors"
          >
            Open PDF in New Tab
          </a>
        </div>
      </iframe>
    </div>
  )
}

export default PdfViewer

