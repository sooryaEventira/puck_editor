import React from 'react'

interface SimpleImageProps {
  src?: string
  alt?: string
  width?: string
  height?: string
  borderRadius?: string
  objectFit?: 'cover' | 'contain' | 'fill' | 'scale-down' | 'none'
  alignment?: 'left' | 'center' | 'right'
  caption?: string
  showCaption?: boolean
}

const ImageSimple = ({ 
  src = 'https://picsum.photos/400/300', 
  alt = 'Test image',
  width = '100%',
  height = 'auto',
  borderRadius = '0px',
  objectFit = 'cover',
  alignment = 'center',
  caption = '',
  showCaption = false
}: SimpleImageProps) => {
  const containerStyle: React.CSSProperties = {
    margin: '16px 0',
    textAlign: alignment,
    display: 'flex',
    flexDirection: 'column',
    alignItems: alignment === 'left' ? 'flex-start' : alignment === 'right' ? 'flex-end' : 'center'
  }

  const imageStyle: React.CSSProperties = {
    width: width,
    height: height,
    borderRadius: borderRadius,
    objectFit: objectFit,
    maxWidth: '100%',
    display: 'block'
  }

  const captionStyle: React.CSSProperties = {
    marginTop: '8px',
    fontSize: '14px',
    color: '#666',
    fontStyle: 'italic',
    textAlign: alignment
  }

  return (
    <div style={containerStyle}>
      {src ? (
        <img 
          src={src} 
          alt={alt}
          style={imageStyle}
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjBmMGYwIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlIG5vdCBmb3VuZDwvdGV4dD48L3N2Zz4=';
          }}
        />
      ) : (
        <div style={{
          ...imageStyle,
          backgroundColor: '#f8f9fa',
          border: '2px dashed #dee2e6',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#6c757d',
          fontSize: '14px',
          minHeight: '200px'
        }}>
          📷 No image URL provided
        </div>
      )}
      {showCaption && caption && (
        <div style={captionStyle}>
          {caption}
        </div>
      )}
    </div>
  )
}

export default ImageSimple
