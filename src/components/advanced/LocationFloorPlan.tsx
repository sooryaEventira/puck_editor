import React, { useState } from 'react'

export interface LocationFloorPlanProps {
  title?: string | React.ReactElement
  subtitle?: string | React.ReactElement
  pdfUrl?: string
  imageUrl?: string
  backgroundColor?: string
  textColor?: string
  cardBackgroundColor?: string
  cardBorderColor?: string
  buttonColor?: string
  buttonTextColor?: string
  padding?: string
  borderRadius?: string
}

const LocationFloorPlan: React.FC<LocationFloorPlanProps> = ({
  title = 'Level 1: Conference Hall',
  subtitle = 'Overview of the venue layout',
  pdfUrl,
  imageUrl,
  backgroundColor = '#ffffff',
  textColor = '#1f2937',
  cardBackgroundColor = '#ffffff',
  cardBorderColor = '#e5e7eb',
  buttonColor = '#3b82f6',
  buttonTextColor = '#ffffff',
  padding = '4rem 2rem',
  borderRadius = '12px'
}) => {
  const [zoomLevel, setZoomLevel] = useState(1)
  const [isFullscreen, setIsFullscreen] = useState(false)

  const getStringValue = (prop: any): string => {
    if (typeof prop === 'string') return prop;
    if (prop && typeof prop === 'object' && 'props' in prop && prop.props && 'value' in prop.props) {
      return prop.props.value || '';
    }
    return '';
  };

  const titleValue = getStringValue(title);
  const subtitleValue = getStringValue(subtitle);

  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 0.25, 3))
  }

  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 0.25, 0.5))
  }

  const handleFullscreen = () => {
    if (!isFullscreen) {
      const container = document.getElementById('floorplan-container')
      if (container) {
        if (container.requestFullscreen) {
          container.requestFullscreen()
        } else if ((container as any).webkitRequestFullscreen) {
          (container as any).webkitRequestFullscreen()
        } else if ((container as any).msRequestFullscreen) {
          (container as any).msRequestFullscreen()
        }
      }
      setIsFullscreen(true)
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen()
      } else if ((document as any).webkitExitFullscreen) {
        (document as any).webkitExitFullscreen()
      } else if ((document as any).msExitFullscreen) {
        (document as any).msExitFullscreen()
      }
      setIsFullscreen(false)
    }
  }

  React.useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }
    document.addEventListener('fullscreenchange', handleFullscreenChange)
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange)
    document.addEventListener('msfullscreenchange', handleFullscreenChange)
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange)
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange)
      document.removeEventListener('msfullscreenchange', handleFullscreenChange)
    }
  }, [])

  const handleDownload = () => {
    const url = pdfUrl || imageUrl
    if (url) {
      const link = document.createElement('a')
      link.href = url
      link.download = url.split('/').pop() || 'floor-plan'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

  return (
    <section
      className="w-full"
      style={{
        backgroundColor,
        padding
      }}
    >
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        {(titleValue || subtitleValue) && (
          <div className="mb-8">
            {titleValue && (
              <h2
                className="text-2xl md:text-3xl font-bold mb-2"
                style={{ color: textColor }}
              >
                {title}
              </h2>
            )}
            {subtitleValue && (
              <p
                className="text-lg opacity-80"
                style={{ color: textColor }}
              >
                {subtitle}
              </p>
            )}
          </div>
        )}

        {/* Viewer Container */}
        <div
          id="floorplan-container"
          className="relative rounded-lg border overflow-hidden"
          style={{
            backgroundColor: cardBackgroundColor,
            borderColor: cardBorderColor,
            borderRadius,
            minHeight: '600px',
            position: 'relative'
          }}
        >
          {/* Document Viewer */}
          <div className="relative w-full h-full" style={{ minHeight: '600px' }}>
            {pdfUrl ? (
              <iframe
                src={pdfUrl}
                className="w-full h-full"
                style={{
                  minHeight: '600px',
                  border: 'none'
                }}
                title="Floor Plan PDF"
              />
            ) : imageUrl ? (
              <div
                className="w-full h-full flex items-center justify-center overflow-auto bg-gray-100"
                style={{
                  minHeight: '600px',
                  transform: `scale(${zoomLevel})`,
                  transformOrigin: 'center center'
                }}
              >
                <img
                  src={imageUrl}
                  alt={titleValue || 'Floor Plan'}
                  className="max-w-full h-auto"
                  style={{
                    maxHeight: '100%',
                    objectFit: 'contain'
                  }}
                />
              </div>
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center" style={{ minHeight: '600px' }}>
                <div className="text-center p-8">
                  <div className="mb-4">
                    <span className="text-6xl">📄</span>
                  </div>
                  <h3
                    className="text-2xl font-bold mb-2"
                    style={{ color: textColor }}
                  >
                    Conference
                  </h3>
                  <p
                    className="text-sm mb-4 opacity-60"
                    style={{ color: textColor }}
                  >
                    1 Floor Plan
                  </p>
                  <button
                    className="px-4 py-2 rounded text-sm font-medium border"
                    style={{
                      backgroundColor: cardBackgroundColor,
                      borderColor: cardBorderColor,
                      color: textColor
                    }}
                    disabled
                  >
                    Click to Zoom
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Download Button */}
          {(pdfUrl || imageUrl) && (
            <button
              onClick={handleDownload}
              className="absolute top-4 right-4 px-4 py-2 rounded-lg flex items-center gap-2 font-medium transition-opacity hover:opacity-90 z-10"
              style={{
                backgroundColor: buttonColor,
                color: buttonTextColor,
                boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
              }}
            >
              <span>📥</span>
              <span>Download PDF</span>
            </button>
          )}

          {/* Viewer Controls (only for images) */}
          {imageUrl && !pdfUrl && (
            <>
              {/* Vertical Toolbar */}
              <div
                className="absolute right-4 top-1/2 transform -translate-y-1/2 flex flex-col gap-2 z-10"
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  padding: '8px',
                  borderRadius: '8px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
                }}
              >
                {/* Menu (placeholder) */}
                <button
                  className="p-2 rounded hover:bg-gray-100 transition-colors"
                  style={{ color: textColor }}
                  title="Menu"
                >
                  <span className="text-lg">⋯</span>
                </button>

                {/* Zoom In */}
                <button
                  onClick={handleZoomIn}
                  className="p-2 rounded hover:bg-gray-100 transition-colors"
                  style={{ color: textColor }}
                  title="Zoom In"
                >
                  <span className="text-lg">🔍+</span>
                </button>

                {/* Zoom Out */}
                <button
                  onClick={handleZoomOut}
                  className="p-2 rounded hover:bg-gray-100 transition-colors"
                  style={{ color: textColor }}
                  title="Zoom Out"
                >
                  <span className="text-lg">🔍-</span>
                </button>

                {/* Fullscreen */}
                <button
                  onClick={handleFullscreen}
                  className="p-2 rounded hover:bg-gray-100 transition-colors"
                  style={{ color: textColor }}
                  title="Fullscreen"
                >
                  <span className="text-lg">⛶</span>
                </button>
              </div>

              {/* Zoom Level Indicator */}
              <div
                className="absolute bottom-4 left-1/2 transform -translate-x-1/2 px-3 py-1 rounded text-sm font-medium"
                style={{
                  backgroundColor: 'rgba(0, 0, 0, 0.7)',
                  color: '#ffffff'
                }}
              >
                {Math.round(zoomLevel * 100)}%
              </div>
            </>
          )}

          {/* Click to Zoom overlay for images */}
          {imageUrl && !pdfUrl && (
            <button
              onClick={handleZoomIn}
              className="absolute bottom-4 left-4 px-4 py-2 rounded text-sm font-medium border transition-opacity hover:opacity-90"
              style={{
                backgroundColor: cardBackgroundColor,
                borderColor: cardBorderColor,
                color: textColor
              }}
            >
              Click to Zoom
            </button>
          )}
        </div>
      </div>
    </section>
  )
}

export default LocationFloorPlan

