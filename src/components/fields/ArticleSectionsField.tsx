import React, { useEffect, useMemo, useState } from 'react'
import { UploadModal } from '../ui'
import { fetchAllFolders, fetchFiles, uploadFile, type FileData } from '../../services/resourceService'

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
  headingColor?: string
  headingAlign?: 'left' | 'center' | 'right'
  headingSize?: 1 | 2 | 3
  paragraph?: string
  paragraphColor?: string
  imageUrl?: string
  imageHeight?: string
  links?: ArticleLink[]
  linkDisplayStyle?: 'list' | 'buttons'
  linkColor?: string
  buttonColor?: string
  buttonTextColor?: string
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

  const removeSection = (index: number) => {
    setSections(sections.filter((_, i) => i !== index))
  }

  const [imagePickerIndex, setImagePickerIndex] = useState<number | null>(null)
  const [uploadIndex, setUploadIndex] = useState<number | null>(null)

  const addSection = (type: ArticleSectionType) => {
    const base: ArticleSection = { id: makeId(type), type }
    const next =
      type === 'heading'
        ? { ...base, heading: 'New heading', headingSize: 3, headingAlign: 'left', headingColor: '#111827' }
        : type === 'paragraph'
          ? { ...base, paragraph: 'New paragraph...', paragraphColor: '#111827' }
          : type === 'image'
            ? { ...base, imageUrl: '', imageHeight: '400px' }
            : {
                ...base,
                linkDisplayStyle: 'list',
                linkColor: '#3b82f6',
                buttonColor: '#3b82f6',
                buttonTextColor: '#ffffff',
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
                <button
                  type="button"
                  onClick={() => removeSection(index)}
                  style={{
                    padding: '6px 8px',
                    fontSize: 12,
                    fontWeight: 700,
                    borderRadius: 8,
                    border: '1px solid #fecaca',
                    backgroundColor: '#fff1f2',
                    color: '#b91c1c',
                    cursor: 'pointer'
                  }}
                >
                  Delete
                </button>
              </div>

              <div style={{ marginTop: 10 }}>
                {renderSectionEditor({
                  section,
                  index,
                  patchSection,
                  openImagePicker: () => setImagePickerIndex(index),
                  openUpload: () => setUploadIndex(index)
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      <ImagePickerModal
        isOpen={imagePickerIndex !== null}
        onClose={() => setImagePickerIndex(null)}
        onSelect={(url) => {
          if (imagePickerIndex === null) return
          patchSection(imagePickerIndex, { imageUrl: url })
          setImagePickerIndex(null)
        }}
      />

      <UploadModal
        isOpen={uploadIndex !== null}
        onClose={() => setUploadIndex(null)}
        onUpload={async (files) => {
          if (uploadIndex === null) return
          const eventUuid = localStorage.getItem('currentEventUuid') || ''
          if (!eventUuid) {
            alert('Event UUID not found. Please open the editor from an event context first.')
            return
          }
          if (!files || files.length === 0) return

          const file = files[0]
          const uploaded = await uploadFile({ file, event_uuid: eventUuid, parent: null })
          patchSection(uploadIndex, { imageUrl: uploaded.file })
          setUploadIndex(null)
        }}
        title="Upload image"
        description="Upload an image to Resource Manager and attach it."
        uploadText="Click to upload or drag and drop"
        accept="image/*"
        multiple={false}
        showTemplate={false}
        buttonText="Attach image"
        cancelButtonText="Cancel"
        instructions={['PNG, JPG, SVG, or GIF']}
      />
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

const isHexColor = (value: string) => /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(value.trim())
const toHex6 = (value: string) => {
  const v = value.trim()
  if (/^#[0-9a-fA-F]{6}$/.test(v)) return v
  if (/^#[0-9a-fA-F]{3}$/.test(v)) {
    const r = v[1]
    const g = v[2]
    const b = v[3]
    return `#${r}${r}${g}${g}${b}${b}`
  }
  return '#000000'
}

const ColorField: React.FC<{ label: string; value?: string; onChange: (next: string) => void }> = ({ label, value = '#111827', onChange }) => {
  const safeText = value || '#111827'
  const safeSwatch = isHexColor(safeText) ? toHex6(safeText) : '#000000'
  return (
    <Field label={label}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <input value={safeText} onChange={(e) => onChange(e.target.value)} placeholder="#111827" style={inputStyle} />
        <input
          type="color"
          value={safeSwatch}
          onChange={(e) => onChange(e.target.value)}
          style={{
            width: 44,
            height: 38,
            border: '1px solid #d1d5db',
            borderRadius: 8,
            backgroundColor: '#ffffff',
            padding: 2,
            cursor: 'pointer',
            flexShrink: 0
          }}
          aria-label={`${label} color picker`}
        />
      </div>
    </Field>
  )
}

function renderSectionEditor(args: {
  section: ArticleSection
  index: number
  patchSection: (index: number, patch: Partial<ArticleSection>) => void
  openImagePicker: () => void
  openUpload: () => void
}) {
  const { section, index, patchSection, openImagePicker, openUpload } = args

  switch (section.type) {
    case 'paragraph':
      return (
        <>
          <Field label="Paragraph Text (supports HTML paste for bold/italic)">
            <textarea
              value={section.paragraph || ''}
              onChange={(e) => patchSection(index, { paragraph: e.target.value })}
              onPaste={(e) => {
                const html = e.clipboardData?.getData('text/html')
                if (!html) return
                e.preventDefault()
                try {
                  const doc = new DOMParser().parseFromString(html, 'text/html')
                  const bodyHtml = (doc.body?.innerHTML || '').trim()
                  const target = e.currentTarget
                  const start = target.selectionStart ?? (section.paragraph || '').length
                  const end = target.selectionEnd ?? start
                  const current = section.paragraph || ''
                  const next = current.slice(0, start) + bodyHtml + current.slice(end)
                  patchSection(index, { paragraph: next })
                } catch {
                  // Fallback to plain paste
                }
              }}
              placeholder="Type text or paste rich text (bold/italic) here..."
              style={{ ...inputStyle, minHeight: 140, resize: 'vertical' }}
            />
          </Field>
          <div style={{ height: 10 }} />
          <ColorField label="Paragraph Color (hex)" value={section.paragraphColor || '#111827'} onChange={(v) => patchSection(index, { paragraphColor: v })} />
        </>
      )

    case 'image':
      return (
        <>
          <Field label="Image (Resource Manager URL or direct link)">
            <input
              value={section.imageUrl || ''}
              onChange={(e) => patchSection(index, { imageUrl: e.target.value })}
              placeholder="https://example.com/image.jpg"
              style={inputStyle}
            />
          </Field>
          <div style={{ height: 10 }} />
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <button type="button" onClick={openImagePicker} style={btnStyle}>
              Choose from Resource Manager
            </button>
            <button type="button" onClick={openUpload} style={btnStyle}>
              Upload image
            </button>
          </div>
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
        <>
          <Field label="Heading Text">
            <input
              value={section.heading || ''}
              onChange={(e) => patchSection(index, { heading: e.target.value })}
              placeholder="Enter heading..."
              style={inputStyle}
            />
          </Field>
          <div style={{ height: 10 }} />
          <ColorField label="Heading Color (hex)" value={section.headingColor || '#111827'} onChange={(v) => patchSection(index, { headingColor: v })} />
          <div style={{ height: 10 }} />
          <Field label="Heading Alignment">
            <select
              value={section.headingAlign || 'left'}
              onChange={(e) => patchSection(index, { headingAlign: e.target.value as 'left' | 'center' | 'right' })}
              style={inputStyle}
            >
              <option value="left">Left</option>
              <option value="center">Center</option>
              <option value="right">Right</option>
            </select>
          </Field>
          <div style={{ height: 10 }} />
          <Field label="Heading Size (3 options)">
            <select
              value={String(section.headingSize || 3)}
              onChange={(e) => patchSection(index, { headingSize: Number(e.target.value) as 1 | 2 | 3 })}
              style={inputStyle}
            >
              <option value="1">Size 1 (small)</option>
              <option value="2">Size 2 (medium)</option>
              <option value="3">Size 3 (large)</option>
            </select>
          </Field>
        </>
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

          {(section.linkDisplayStyle || 'list') === 'list' ? (
            <ColorField label="Link Color (hex)" value={section.linkColor || '#3b82f6'} onChange={(v) => patchSection(index, { linkColor: v })} />
          ) : (
            <>
              <ColorField label="Button Color (hex)" value={section.buttonColor || '#3b82f6'} onChange={(v) => patchSection(index, { buttonColor: v })} />
              <div style={{ height: 10 }} />
              <ColorField label="Button Text Color (hex)" value={section.buttonTextColor || '#ffffff'} onChange={(v) => patchSection(index, { buttonTextColor: v })} />
            </>
          )}

          <div style={{ height: 10 }} />
          <Field label="Links">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {(section.links || []).map((link, linkIndex) => (
                <div key={link.id || `link-${linkIndex}`} style={subCardStyle}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8 }}>
                    <div style={{ fontSize: 12, fontWeight: 600, color: '#111827' }}>Link {linkIndex + 1}</div>
                    <button
                      type="button"
                      onClick={() => {
                        const nextLinks = (section.links || []).filter((_, i) => i !== linkIndex)
                        patchSection(index, { links: nextLinks })
                      }}
                      style={{
                        padding: '6px 8px',
                        fontSize: 12,
                        fontWeight: 700,
                        borderRadius: 8,
                        border: '1px solid #fecaca',
                        backgroundColor: '#fff1f2',
                        color: '#b91c1c',
                        cursor: 'pointer'
                      }}
                    >
                      Delete
                    </button>
                  </div>

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

const isImageFile = (file: FileData) => {
  const ext = (file.name.split('.').pop() || '').toLowerCase()
  if (file.content_type?.startsWith('image/')) return true
  return ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(ext)
}

const ImagePickerModal: React.FC<{
  isOpen: boolean
  onClose: () => void
  onSelect: (url: string) => void
}> = ({ isOpen, onClose, onSelect }) => {
  const [isLoading, setIsLoading] = useState(false)
  const [files, setFiles] = useState<FileData[]>([])
  const [query, setQuery] = useState('')

  useEffect(() => {
    if (!isOpen) return
    let cancelled = false

    const load = async () => {
      setIsLoading(true)
      try {
        const eventUuid = localStorage.getItem('currentEventUuid') || ''
        const folders = eventUuid ? await fetchAllFolders(eventUuid) : []
        const folderIds: Array<string | null | undefined> = [null, ...folders.map((f) => f.uuid)]

        const results = await Promise.allSettled(folderIds.map((id) => fetchFiles(id)))
        const merged = results.flatMap((r) => (r.status === 'fulfilled' ? r.value : []))

        const byId = new Map<string, FileData>()
        for (const f of merged) byId.set(f.uuid, f)
        const deduped = Array.from(byId.values()).filter(isImageFile)

        if (!cancelled) setFiles(deduped)
      } catch {
        if (!cancelled) setFiles([])
      } finally {
        if (!cancelled) setIsLoading(false)
      }
    }

    load()
    return () => {
      cancelled = true
    }
  }, [isOpen])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return files
    return files.filter((f) => (f.name || '').toLowerCase().includes(q))
  }, [files, query])

  if (!isOpen) return null

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0,0,0,0.5)',
        zIndex: 2000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div style={{ width: 'min(900px, 100%)', maxHeight: '80vh', overflow: 'auto', background: '#fff', borderRadius: 12, padding: 14 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: '#111827' }}>Choose an image from Resource Manager</div>
          <button type="button" onClick={onClose} style={btnStyle}>
            Close
          </button>
        </div>

        <div style={{ height: 10 }} />

        <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search images…" style={inputStyle} />

        <div style={{ height: 12 }} />

        {isLoading ? (
          <div style={{ fontSize: 12, color: '#6b7280' }}>Loading images…</div>
        ) : filtered.length === 0 ? (
          <div style={{ fontSize: 12, color: '#6b7280' }}>No images found.</div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 12 }}>
            {filtered.map((f) => (
              <button
                key={f.uuid}
                type="button"
                onClick={() => onSelect(f.file)}
                style={{
                  textAlign: 'left',
                  border: '1px solid #e5e7eb',
                  borderRadius: 10,
                  background: '#fff',
                  padding: 10,
                  cursor: 'pointer'
                }}
              >
                <div style={{ width: '100%', aspectRatio: '16/10', borderRadius: 8, overflow: 'hidden', background: '#f3f4f6' }}>
                  <img src={f.file} alt={f.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <div
                  style={{
                    marginTop: 8,
                    fontSize: 12,
                    fontWeight: 600,
                    color: '#111827',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  }}
                >
                  {f.name}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
