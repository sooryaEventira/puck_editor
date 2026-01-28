import React, { useMemo } from 'react'

export interface ResourceAsset {
  uuid: string
  file: string
  name: string
  size?: number
  content_type?: string
  created_date?: string
}

export interface ResourceFolderSnapshot {
  folderUuid?: string
  folderName?: string
  assets?: ResourceAsset[]
}

export interface ResourceCardsProps {
  heading?: string
  source?: ResourceFolderSnapshot
  columns?: 2 | 3 | 4
  showMeta?: boolean
  headingAlign?: 'left' | 'center' | 'right'
  headingColor?: string
  cardBackgroundColor?: string
  cardBorderColor?: string
}

const formatBytes = (bytes?: number) => {
  const n = typeof bytes === 'number' && Number.isFinite(bytes) ? bytes : 0
  if (!n) return ''
  const kb = n / 1024
  if (kb < 1024) return `${Math.round(kb)} KB`
  const mb = kb / 1024
  return `${mb.toFixed(1)} MB`
}

const extFromName = (name: string) => {
  const parts = String(name || '').split('.')
  if (parts.length < 2) return ''
  return parts[parts.length - 1].toUpperCase()
}

const prettyTitleFromName = (name: string) => {
  const raw = String(name || '').trim()
  if (!raw) return 'Untitled'
  const lastDot = raw.lastIndexOf('.')
  const base = lastDot > 0 ? raw.slice(0, lastDot) : raw
  return base.replace(/[_-]+/g, ' ').trim() || raw
}

const isImage = (contentType?: string, name?: string) => {
  const ct = String(contentType || '').toLowerCase()
  if (ct.startsWith('image/')) return true
  const ext = extFromName(String(name || '')).toLowerCase()
  return ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(ext)
}

const isVideo = (contentType?: string, name?: string) => {
  const ct = String(contentType || '').toLowerCase()
  if (ct.startsWith('video/')) return true
  const ext = extFromName(String(name || '')).toLowerCase()
  return ['mp4', 'webm', 'mov', 'm4v'].includes(ext)
}

const ResourceCards: React.FC<ResourceCardsProps> = ({
  heading = '',
  source,
  columns = 3,
  showMeta = true,
  headingAlign = 'left',
  headingColor = '#0f172a',
  cardBackgroundColor = '#ffffff',
  cardBorderColor = '#e2e8f0'
}) => {
  const assets = Array.isArray(source?.assets) ? source!.assets! : []
  // Always prefer folder name as heading (requested behavior)
  const resolvedHeading = (source?.folderName || '').trim() || (heading || '').trim() || 'Resources'

  const colClass = columns === 2 ? 'md:grid-cols-2' : columns === 4 ? 'md:grid-cols-4' : 'md:grid-cols-3'

  const sorted = useMemo(() => {
    const copy = [...assets]
    copy.sort((a, b) => {
      const at = Date.parse(a.created_date || '') || 0
      const bt = Date.parse(b.created_date || '') || 0
      return bt - at
    })
    return copy
  }, [assets])

  return (
    <section className="w-full">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <div className="mb-6">
          {resolvedHeading ? (
            <h2 className="text-xl font-semibold" style={{ textAlign: headingAlign, color: headingColor }}>
              {resolvedHeading}
            </h2>
          ) : null}
        </div>

        {sorted.length === 0 ? (
          <div className="rounded-xl border border-slate-200 bg-white p-6 text-sm text-slate-600">
            No assets selected yet. Choose a folder in the sidebar and load assets.
          </div>
        ) : (
          <div className={`grid grid-cols-1 gap-4 sm:grid-cols-2 ${colClass}`}>
            {sorted.map((a) => {
              const title = prettyTitleFromName(a.name)
              const typeLabel = (a.content_type || extFromName(a.name) || 'FILE').toString()
              const sizeLabel = formatBytes(a.size)
              const meta = [typeLabel, sizeLabel].filter(Boolean).join(' • ')
              const href = a.file || '#'

              return (
                <a
                  key={a.uuid || `${a.file}-${a.name}`}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group overflow-hidden rounded-xl border bg-white transition hover:shadow-sm"
                  style={{ backgroundColor: cardBackgroundColor, borderColor: cardBorderColor }}
                >
                  <div className="aspect-[16/9] w-full bg-slate-50">
                    {isImage(a.content_type, a.name) ? (
                      <img src={a.file} alt={title} className="h-full w-full object-cover" />
                    ) : isVideo(a.content_type, a.name) ? (
                      <div className="flex h-full w-full items-center justify-center bg-slate-900/5 text-sm text-slate-600">
                        Video
                      </div>
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-slate-900/5 text-sm font-semibold text-slate-700">
                        {extFromName(a.name) || 'FILE'}
                      </div>
                    )}
                  </div>

                  <div className="p-4">
                    <div className="truncate text-sm font-semibold text-slate-900 group-hover:underline">{title}</div>
                    {showMeta ? <div className="mt-1 truncate text-xs text-slate-600">{meta}</div> : null}
                  </div>
                </a>
              )
            })}
          </div>
        )}
      </div>
    </section>
  )
}

export default ResourceCards

