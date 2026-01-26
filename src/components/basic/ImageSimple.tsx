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
  showCaption = false,
}: SimpleImageProps) => {
  // Dynamic styles that need to remain inline
  const imageStyle: React.CSSProperties = {
    width,
    height,
    borderRadius,
    objectFit,
  }

  const alignmentClasses = {
    left: 'text-left items-start',
    right: 'text-right items-end',
    center: 'text-center items-center',
  }

  return (
    <div className={`my-4 ${alignmentClasses[alignment]} flex flex-col`}>
      {src ? (
        <img
          src={src}
          alt={alt}
          style={imageStyle}
          className="max-w-full block"
          onError={(e) => {
            const target = e.target as HTMLImageElement
            target.src =
              'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjBmMGYwIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlIG5vdCBmb3VuZDwvdGV4dD48L3N2Zz4='
          }}
        />
      ) : (
        <div
          style={imageStyle}
          className="bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center text-gray-600 text-sm min-h-[200px] max-w-full block"
        >
          📷 No image URL provided
        </div>
      )}
      {showCaption && caption && (
        <div className={`mt-2 text-sm text-gray-600 italic ${alignmentClasses[alignment]}`}>{caption}</div>
      )}
    </div>
  )
}

export default ImageSimple

