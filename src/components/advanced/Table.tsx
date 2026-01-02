import React from 'react'

export interface TableColumn {
  id: string
  label: string
  align?: 'left' | 'center' | 'right'
}

export interface TableRow {
  id: string
  [key: string]: string | React.ReactElement
}

export interface TableProps {
  title?: string | React.ReactElement
  description?: string | React.ReactElement
  columns?: TableColumn[]
  rows?: TableRow[]
  backgroundColor?: string
  headerBackgroundColor?: string
  headerTextColor?: string
  textColor?: string
  borderColor?: string
  linkColor?: string
  titleColor?: string
  descriptionColor?: string
  padding?: string
  maxWidth?: string
  showSerialNumber?: boolean
}

const Table: React.FC<TableProps> = ({
  title,
  description,
  columns = [],
  rows = [],
  backgroundColor = '#ffffff',
  headerBackgroundColor = '#f9fafb',
  headerTextColor = '#1f2937',
  textColor = '#1f2937',
  borderColor = '#e5e7eb',
  linkColor = '#3b82f6',
  titleColor = '#1f2937',
  descriptionColor = '#6b7280',
  padding = '3rem 2rem',
  maxWidth = '100%',
  showSerialNumber = true
}) => {
  // Extract string values from React elements (for Puck editor compatibility)
  const getStringValue = (prop: any): string => {
    if (typeof prop === 'string') return prop
    if (prop && typeof prop === 'object' && 'props' in prop && prop.props && 'value' in prop.props) {
      return prop.props.value || ''
    }
    return ''
  }

  const titleValue = getStringValue(title)
  const descriptionValue = getStringValue(description)

  // Determine if link is external
  const isExternalLink = (url: string) => {
    return url && (url.startsWith('http://') || url.startsWith('https://'))
  }

  // Handle link click
  const handleLinkClick = (e: React.MouseEvent, url: string) => {
    if (!url || url === '#') {
      e.preventDefault()
      return
    }
    if (isExternalLink(url)) {
      // External links open in new tab
      e.preventDefault()
      window.open(url, '_blank', 'noopener,noreferrer')
    }
    // Internal links will use default anchor behavior
  }

  // Default columns if none provided
  const defaultColumns: TableColumn[] = [
    ...(showSerialNumber ? [{ id: 'serial', label: 'Sr. No', align: 'left' as const }] : []),
    { id: 'title', label: 'Title', align: 'left' as const },
    { id: 'refNumber', label: 'Ref. Number', align: 'left' as const },
    { id: 'author', label: 'Author', align: 'left' as const },
    { id: 'link', label: 'Link', align: 'left' as const }
  ]

  // Use custom columns if provided, otherwise use defaults
  let displayColumns: TableColumn[]
  if (columns.length > 0) {
    displayColumns = columns
    // If showSerialNumber is true and serial column doesn't exist, prepend it
    if (showSerialNumber && !displayColumns.some(col => col.id === 'serial')) {
      displayColumns = [{ id: 'serial', label: 'Sr. No', align: 'left' as const }, ...displayColumns]
    }
  } else {
    displayColumns = defaultColumns
  }

  // Default rows if none provided
  const defaultRows: TableRow[] = [
    {
      id: '1',
      title: 'Digital Typography Standards',
      refNumber: 'PUB-2023-A1',
      author: 'W3C Working Group',
      link: '#',
      linkText: 'View'
    },
    {
      id: '2',
      title: 'Semantic HTML Structure Guide',
      refNumber: 'HTML-5.3-REF',
      author: 'Jane Doe',
      link: '#',
      linkText: 'Download'
    },
    {
      id: '3',
      title: 'Accessibility in Modern Web',
      refNumber: 'WCAG-2.1-AA',
      author: 'A11y Alliance',
      link: '#',
      linkText: 'View'
    },
    {
      id: '4',
      title: 'Responsive Layout Patterns',
      refNumber: 'CSS-GRID-09',
      author: 'Rachel Andrew',
      link: '#',
      linkText: 'View'
    }
  ]

  const displayRows = rows.length > 0 ? rows : defaultRows

  // Render cell content (handles links specially)
  const renderCellContent = (columnId: string, row: TableRow, index: number): React.ReactNode => {
    const value = row[columnId]

    // Special handling for serial number column
    if (columnId === 'serial' && showSerialNumber) {
      return String(index + 1).padStart(2, '0')
    }

    // Special handling for link column
    if (columnId === 'link') {
      const linkUrl = row.link || row[columnId]
      const linkText = row.linkText || 'View'
      const linkUrlValue = typeof linkUrl === 'string' ? linkUrl : getStringValue(linkUrl)
      const linkTextValue = typeof linkText === 'string' ? linkText : getStringValue(linkText)

      if (linkUrlValue && linkTextValue) {
        const isExternal = isExternalLink(linkUrlValue)
        return (
          <a
            href={linkUrlValue}
            onClick={(e) => handleLinkClick(e, linkUrlValue)}
            className="inline-flex items-center gap-1 font-medium transition-opacity hover:opacity-80 underline"
            style={{ color: linkColor }}
            {...(isExternal && { target: '_blank', rel: 'noopener noreferrer' })}
          >
            {linkTextValue}
            {isExternal && <span className="text-xs">↗</span>}
          </a>
        )
      }
      return null
    }

    // Regular cell content
    if (value === undefined || value === null) {
      return ''
    }
    if (typeof value === 'string') {
      return value
    }
    if (React.isValidElement(value)) {
      return value
    }
    return getStringValue(value) || ''
  }

  return (
    <div
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
        {/* Title */}
        {titleValue && (
          <h2
            className="text-2xl md:text-3xl font-bold mb-2"
            style={{ color: titleColor }}
          >
            {title}
          </h2>
        )}

        {/* Description */}
        {descriptionValue && (
          <p
            className="text-base mb-6"
            style={{ color: descriptionColor }}
          >
            {description}
          </p>
        )}

        {/* Table */}
        <div className="overflow-x-auto">
          <table
            className="w-full border-collapse"
            style={{
              borderColor
            }}
          >
            <thead>
              <tr
                style={{
                  backgroundColor: headerBackgroundColor
                }}
              >
                {displayColumns.map((column) => (
                  <th
                    key={column.id}
                    className="px-4 py-3 text-left font-semibold text-sm border-b"
                    style={{
                      color: headerTextColor,
                      borderColor,
                      textAlign: column.align || 'left'
                    }}
                  >
                    {column.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {displayRows.map((row, index) => (
                <tr
                  key={row.id}
                  className="border-b hover:bg-gray-50 transition-colors"
                  style={{
                    borderColor
                  }}
                >
                  {displayColumns.map((column) => (
                    <td
                      key={column.id}
                      className="px-4 py-3 text-sm"
                      style={{
                        color: textColor,
                        textAlign: column.align || 'left'
                      }}
                    >
                      {renderCellContent(column.id, row, index)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default Table

