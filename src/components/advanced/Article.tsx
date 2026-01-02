import React from 'react'

export interface ArticleProps {
  heading?: string | React.ReactElement
  content?: string | React.ReactElement
  linkUrl?: string
  linkText?: string | React.ReactElement
  imageUrl?: string
  backgroundColor?: string
  textColor?: string
  headingColor?: string
  linkColor?: string
  padding?: string
  maxWidth?: string
  imagePosition?: 'top' | 'bottom'
  imageHeight?: string
}

const Article: React.FC<ArticleProps> = ({
  heading,
  content,
  linkUrl,
  linkText,
  imageUrl,
  backgroundColor = '#ffffff',
  textColor = '#1f2937',
  headingColor = '#1f2937',
  linkColor = '#3b82f6',
  padding = '3rem 2rem',
  maxWidth = '800px',
  imagePosition = 'bottom',
  imageHeight = '400px'
}) => {
  // Extract string values from React elements (for Puck editor compatibility)
  const getStringValue = (prop: any): string => {
    if (typeof prop === 'string') return prop
    if (prop && typeof prop === 'object' && 'props' in prop && prop.props && 'value' in prop.props) {
      return prop.props.value || ''
    }
    return ''
  }

  const headingValue = getStringValue(heading)
  const contentValue = getStringValue(content)
  const linkTextValue = getStringValue(linkText)
  const imageUrlValue = getStringValue(imageUrl)

  // Split content into paragraphs (split by double newlines or single newlines)
  const paragraphs = contentValue
    ? contentValue.split(/\n\n+/).filter(p => p.trim())
    : []

  // Determine if link is external
  const isExternalLink = linkUrl && (linkUrl.startsWith('http://') || linkUrl.startsWith('https://'))
  
  // Handle link click
  const handleLinkClick = (e: React.MouseEvent) => {
    if (!linkUrl || linkUrl === '#') {
      e.preventDefault()
      return
    }
    if (isExternalLink) {
      // External links open in new tab
      e.preventDefault()
      window.open(linkUrl, '_blank', 'noopener,noreferrer')
    }
    // Internal links will use default anchor behavior
  }

  return (
    <article
      className="w-full"
      style={{
        backgroundColor,
        padding
      }}
    >
      <div
        className="mx-auto"
        style={{ maxWidth }}
      >
        {/* Image at top (if imagePosition is 'top') */}
        {imageUrlValue && imagePosition === 'top' && (
          <div
            className="w-full mb-8 rounded-lg overflow-hidden"
            style={{ height: imageHeight }}
          >
            <img
              src={imageUrlValue}
              alt={headingValue || 'Article image'}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.style.display = 'none'
              }}
            />
          </div>
        )}

        {/* Heading */}
        {headingValue && (
          <h1
            className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight"
            style={{ color: headingColor }}
          >
            {heading}
          </h1>
        )}

        {/* Content paragraphs */}
        {paragraphs.length > 0 && (
          <div className="prose prose-lg max-w-none mb-6">
            {paragraphs.map((paragraph, index) => (
              <p
                key={index}
                className="text-base md:text-lg leading-relaxed mb-4"
                style={{ color: textColor }}
              >
                {paragraph.trim()}
              </p>
            ))}
          </div>
        )}

        {/* Link */}
        {linkUrl && linkTextValue && (
          <div className="mb-6">
            <a
              href={linkUrl}
              onClick={handleLinkClick}
              className="inline-flex items-center gap-2 font-semibold transition-opacity hover:opacity-80 underline"
              style={{ color: linkColor }}
              {...(isExternalLink && { target: '_blank', rel: 'noopener noreferrer' })}
            >
              {linkText}
              {isExternalLink && (
                <span className="text-xs">↗</span>
              )}
            </a>
          </div>
        )}

        {/* Image at bottom (if imagePosition is 'bottom') */}
        {imageUrlValue && imagePosition === 'bottom' && (
          <div
            className="w-full mt-8 rounded-lg overflow-hidden"
            style={{ height: imageHeight }}
          >
            <img
              src={imageUrlValue}
              alt={headingValue || 'Article image'}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.style.display = 'none'
              }}
            />
          </div>
        )}
      </div>
    </article>
  )
}

export default Article

