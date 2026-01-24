import React from 'react'

type ArticleSectionType = 'heading' | 'paragraph' | 'image' | 'links'

type ArticleLink = {
  id?: string
  label: string
  url: string
  openInNewTab: boolean
}

type ArticleSection = {
  id?: string
  type: ArticleSectionType
  heading?: string
  paragraph?: string
  imageUrl?: string
  imageHeight?: string
  links?: ArticleLink[]
  linkDisplayStyle?: 'list' | 'buttons'
}

interface ArticleSectionsFieldProps {
  value?: ArticleSection[]
  onChange?: (value: ArticleSection[]) => void
}

const makeId = (prefix: string) => `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`

const ArticleSectionsField: React.FC<ArticleSectionsFieldProps> = ({ value = [], onChange }) => {
  const sections = Array.isArray(value) ? value : []

  const setSections = (next: ArticleSection[]) => onChange?.(next)

  const patchSection = (index: number, patch: Partial<ArticleSection>) => {
    setSections(sections.map((s, i) => (i === index ? { ...s, ...patch } : s)))
  }

  const addSection = (type: ArticleSectionType) => {
    const base: ArticleSection = { id: makeId(type), type }
    const next =
      type === 'heading'
        ? { ...base, heading: 'New heading' }
        : type === 'paragraph'
          ? { ...base, paragraph: 'New paragraph...' }
          : type === 'image'
            ? { ...base, imageUrl: '', imageHeight: '400px' }
            : {
                ...base,
                linkDisplayStyle: 'list',
                links: [{ id: makeId('link'), label: 'Learn more', url: '#', openInNewTab: false }]
              }

    setSections([...sections, next])
  }

  const typeLabel = (type: ArticleSectionType) => {
    switch (type) {
      case 'heading':
        return 'Heading'
      case 'paragraph':
        return 'Paragraph'
      case 'image':
        return 'Image'
      case 'links':
        return 'Links'
      default:
        return 'Section'
    }
  }

  return (
    <div style={{ width: '100%' }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 12 }}>
        <button type="button" onClick={() => addSection('heading')} style={btnStyle}>
          + Heading
        </button>
        <button type="button" onClick={() => addSection('paragraph')} style={btnStyle}>
          + Paragraph
        </button>
        <button type="button" onClick={() => addSection('image')} style={btnStyle}>
          + Image
        </button>
        <button type="button" onClick={() => addSection('links')} style={btnStyle}>
          + Links
        </button>
      </div>

      {sections.length === 0 ? (
        <p style={{ fontSize: 12, color: '#6b7280', margin: 0 }}>No sections yet. Add a section above.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {sections.map((section, index) => (
            <div key={section.id || `${section.type}-${index}`} style={cardStyle}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#111827' }}>
                  {index + 1}. {typeLabel(section.type)}
                </div>
              </div>

              <div style={{ marginTop: 10 }}>
                {renderSectionEditor(section, index, patchSection)}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

const Field: React.FC<{ label: string; children: React.ReactNode; compact?: boolean }> = ({ label, children, compact }) => (
  <div>
    <div style={{ fontSize: compact ? 12 : 13, fontWeight: 500, color: '#374151', marginBottom: 6 }}>{label}</div>
    {children}
  </div>
)

const cardStyle: React.CSSProperties = {
  border: '1px solid #e5e7eb',
  borderRadius: 10,
  padding: 12,
  backgroundColor: '#ffffff'
}

const subCardStyle: React.CSSProperties = {
  border: '1px solid #eef2f7',
  borderRadius: 10,
  padding: 10,
  backgroundColor: '#f9fafb'
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '8px 10px',
  fontSize: 14,
  border: '1px solid #d1d5db',
  borderRadius: 8,
  backgroundColor: '#ffffff',
  color: '#111827',
  outline: 'none'
}

const btnStyle: React.CSSProperties = {
  padding: '8px 10px',
  fontSize: 13,
  fontWeight: 600,
  borderRadius: 8,
  border: '1px solid #d1d5db',
  backgroundColor: '#ffffff',
  color: '#111827',
  cursor: 'pointer'
}

export default ArticleSectionsField

function renderSectionEditor(
  section: ArticleSection,
  index: number,
  patchSection: (index: number, patch: Partial<ArticleSection>) => void
) {
  switch (section.type) {
    case 'paragraph':
      // Paragraph section: show ONLY Paragraph Text
      return (
        <Field label="Paragraph Text">
          <textarea
            value={section.paragraph || ''}
            onChange={(e) => patchSection(index, { paragraph: e.target.value })}
            placeholder="Enter your paragraph content here..."
            style={{ ...inputStyle, minHeight: 140, resize: 'vertical' }}
          />
        </Field>
      )

    case 'image':
      // Image section: show ONLY Image URL + Image Height (no heading/paragraph/links)
      return (
        <>
          <Field label="Image URL">
            <input
              value={section.imageUrl || ''}
              onChange={(e) => patchSection(index, { imageUrl: e.target.value })}
              placeholder="https://example.com/image.jpg"
              style={inputStyle}
            />
          </Field>
          <div style={{ height: 10 }} />
          <Field label="Image Height">
            <input
              value={section.imageHeight || ''}
              onChange={(e) => patchSection(index, { imageHeight: e.target.value })}
              placeholder="400px"
              style={inputStyle}
            />
          </Field>
        </>
      )

    case 'heading':
      return (
        <Field label="Heading Text">
          <input
            value={section.heading || ''}
            onChange={(e) => patchSection(index, { heading: e.target.value })}
            placeholder="Enter heading..."
            style={inputStyle}
          />
        </Field>
      )

    case 'links':
      return (
        <>
          <Field label="Link Display Style">
            <select
              value={section.linkDisplayStyle || 'list'}
              onChange={(e) => patchSection(index, { linkDisplayStyle: e.target.value as 'list' | 'buttons' })}
              style={inputStyle}
            >
              <option value="list">Vertical List</option>
              <option value="buttons">Inline Buttons</option>
            </select>
          </Field>
          <div style={{ height: 10 }} />
          <Field label="Links">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {(section.links || []).map((link, linkIndex) => (
                <div key={link.id || `link-${linkIndex}`} style={subCardStyle}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: '#111827' }}>Link {linkIndex + 1}</div>

                  <div style={{ marginTop: 8 }}>
                    <Field label="Label" compact>
                      <input
                        value={link.label || ''}
                        onChange={(e) => {
                          const nextLinks = (section.links || []).map((l, i) => (i === linkIndex ? { ...l, label: e.target.value } : l))
                          patchSection(index, { links: nextLinks })
                        }}
                        placeholder="Learn More"
                        style={inputStyle}
                      />
                    </Field>
                    <div style={{ height: 8 }} />
                    <Field label="URL" compact>
                      <input
                        value={link.url || ''}
                        onChange={(e) => {
                          const nextLinks = (section.links || []).map((l, i) => (i === linkIndex ? { ...l, url: e.target.value } : l))
                          patchSection(index, { links: nextLinks })
                        }}
                        placeholder="https://example.com or /page-path"
                        style={inputStyle}
                      />
                    </Field>
                    <div style={{ height: 8 }} />
                    <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: '#374151' }}>
                      <input
                        type="checkbox"
                        checked={!!link.openInNewTab}
                        onChange={(e) => {
                          const nextLinks = (section.links || []).map((l, i) => (i === linkIndex ? { ...l, openInNewTab: e.target.checked } : l))
                          patchSection(index, { links: nextLinks })
                        }}
                      />
                      Open in new tab
                    </label>
                  </div>
                </div>
              ))}

              <button
                type="button"
                onClick={() => {
                  const nextLinks = [...(section.links || []), { id: makeId('link'), label: 'New link', url: '#', openInNewTab: false }]
                  patchSection(index, { links: nextLinks })
                }}
                style={btnStyle}
              >
                + Add link
              </button>
            </div>
          </Field>
        </>
      )

    default:
      return null
  }
}

