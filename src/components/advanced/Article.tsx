import React from 'react'

export interface ArticleLink {
  id?: string
  label: string
  url: string
  openInNewTab: boolean
}

export interface ArticleSection {
  id?: string
  type: 'heading' | 'paragraph' | 'image' | 'links'
  // For heading section
  heading?: string | React.ReactElement
  // For paragraph section
  paragraph?: string | React.ReactElement
  // For image section
  imageUrl?: string
  imageHeight?: string
  // For links section
  links?: ArticleLink[]
  linkDisplayStyle?: 'list' | 'buttons'
}

export interface ArticleProps {
  sections?: ArticleSection[]
  backgroundColor?: string
  textColor?: string
  headingColor?: string
  linkColor?: string
  padding?: string
  maxWidth?: string
}

const Article: React.FC<ArticleProps> = ({
  sections = [],
  backgroundColor = '#ffffff',
  textColor = '#1f2937',
  headingColor = '#1f2937',
  linkColor = '#3b82f6',
  padding = '3rem 2rem',
  maxWidth = '800px'
}) => {
  // Extract string values from React elements (for Puck editor compatibility)
  const getStringValue = (prop: any): string => {
    if (typeof prop === 'string') return prop
    if (prop && typeof prop === 'object' && 'props' in prop && prop.props && 'value' in prop.props) {
      return prop.props.value || ''
    }
    return ''
  }

  // Handle link click
  const handleLinkClick = (e: React.MouseEvent, link: ArticleLink) => {
    if (!link.url || link.url === '#') {
      e.preventDefault()
      return
    }
    if (link.openInNewTab) {
      e.preventDefault()
      window.open(link.url, '_blank', 'noopener,noreferrer')
    }
  }

  // Normalize common non-direct image URLs (e.g. Unsplash photo page URLs) into an image src.
  const normalizeImageSrc = (raw: string): string => {
    const url = raw?.trim()
    if (!url) return ''

    try {
      const u = new URL(url)

      // Unsplash photo page URLs are HTML. Convert them to a direct image source URL.
      // Example: https://unsplash.com/photos/mailbox-and-sign-for-strawberry-hill-farm-TQSvFz7NHuo
      if (u.hostname.endsWith('unsplash.com')) {
        const match = u.pathname.match(/\/photos\/([^/?#]+)/)
        if (match) {
          const slug = match[1]
          const photoId = slug.split('-').pop()
          if (photoId) {
            // Source endpoint serves the image via redirect and works well in <img src="...">
            return `https://source.unsplash.com/${photoId}/1600x900`
          }
        }
      }

      return url
    } catch {
      // If it's not a valid URL (or relative), leave it unchanged
      return url
    }
  }

  // Render a section based on its type
  const renderSection = (section: ArticleSection, index: number) => {
    switch (section.type) {
      case 'heading': {
        const headingValue = getStringValue(section.heading)
        if (!headingValue) return null
        
        return (
          <h1
            key={section.id || `heading-${index}`}
            className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight"
            style={{ color: headingColor }}
          >
            {section.heading}
          </h1>
        )
      }

      case 'paragraph': {
        const paragraphValue = getStringValue(section.paragraph)
        if (!paragraphValue) return null
        
        // Split paragraph by double newlines for multiple paragraphs
        const paragraphs = paragraphValue.split(/\n\n+/).filter(p => p.trim())
        
        return (
          <div key={section.id || `paragraph-${index}`} className="prose prose-lg max-w-none mb-6">
            {paragraphs.map((paragraph, pIndex) => (
              <p
                key={pIndex}
                className="text-base md:text-lg leading-relaxed mb-4"
                style={{ color: textColor }}
              >
                {paragraph.trim()}
              </p>
            ))}
          </div>
        )
      }

      case 'image': {
        const imageUrlValue = getStringValue(section.imageUrl)
        const normalizedSrc = normalizeImageSrc(imageUrlValue)
        if (!normalizedSrc) return null
        
        const imageHeight = section.imageHeight || '400px'
        
        return (
          <div
            key={section.id || `image-${index}`}
            className="w-full mb-8 rounded-lg overflow-hidden"
            style={{ height: imageHeight }}
          >
            <img
              src={normalizedSrc}
              alt="Article image"
              className="w-full h-full object-cover"
              // If the previous URL errored, it may have hidden the img element.
              // Reset visibility on successful load so changing Image URL works.
              onLoad={(e) => {
                e.currentTarget.style.display = ''
              }}
              onError={(e) => {
                e.currentTarget.style.display = 'none'
              }}
            />
          </div>
        )
      }

      case 'links': {
        const links = section.links || []
        if (links.length === 0) return null
        
        const displayStyle = section.linkDisplayStyle || 'list'
        
        return (
          <div key={section.id || `links-${index}`} className="mb-6">
            {displayStyle === 'list' ? (
              // Vertical list style
              <ul className="space-y-3">
                {links.map((link, linkIndex) => (
                  <li key={link.id || `link-${linkIndex}`}>
                    <a
                      href={link.url}
                      onClick={(e) => handleLinkClick(e, link)}
                      className="inline-flex items-center gap-2 font-semibold transition-opacity hover:opacity-80 underline"
                      style={{ color: linkColor }}
                      {...(link.openInNewTab && { target: '_blank', rel: 'noopener noreferrer' })}
                    >
                      {link.label}
                      {link.openInNewTab && (
                        <span className="text-xs">↗</span>
                      )}
                    </a>
                  </li>
                ))}
              </ul>
            ) : (
              // Inline buttons style
              <div className="flex flex-wrap gap-3">
                {links.map((link, linkIndex) => (
                  <a
                    key={link.id || `link-${linkIndex}`}
                    href={link.url}
                    onClick={(e) => handleLinkClick(e, link)}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all hover:opacity-90"
                    style={{
                      backgroundColor: linkColor,
                      color: '#ffffff'
                    }}
                    {...(link.openInNewTab && { target: '_blank', rel: 'noopener noreferrer' })}
                  >
                    {link.label}
                    {link.openInNewTab && (
                      <span className="text-xs">↗</span>
                    )}
                  </a>
                ))}
              </div>
            )}
          </div>
        )
      }

      default:
        return null
    }
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
        {sections.length > 0 ? (
          sections.map((section, index) => renderSection(section, index))
        ) : (
          <div className="text-center py-12">
            <p style={{ color: textColor, opacity: 0.5 }}>
              No sections added yet. Add sections in the property sidebar.
            </p>
          </div>
        )}
      </div>
    </article>
  )
}

export default Article
