import React from 'react'
import clsx from 'clsx'
import { Page } from '../../types'

interface PageManagerProps {
  pages: Page[]
  currentPage: string
  onPageSelect: (filename: string) => void
  isVisible: boolean
}

const PageManager: React.FC<PageManagerProps> = ({
  pages,
  currentPage,
  onPageSelect,
  isVisible
}) => {
  if (!isVisible) return null

  return (
    <div className="max-h-[300px] overflow-y-auto border-b border-slate-200 bg-white p-5">
      <h3 className="mb-4 text-base font-semibold text-slate-800">📄 Page Manager</h3>
      <div className="grid gap-4 [grid-template-columns:repeat(auto-fill,minmax(240px,1fr))]">
        {pages.map((page) => {
          const isActive = currentPage === page.id
          return (
            <button
              key={page.id}
              type="button"
              onClick={() => onPageSelect(page.filename)}
              className={clsx(
                'flex w-full flex-col rounded-lg border p-4 text-left transition-colors duration-200',
                isActive
                  ? 'border-primary/60 bg-primary/5 shadow-sm'
                  : 'border-slate-200 bg-slate-50 hover:border-primary/40 hover:bg-primary/5'
              )}
            >
              <h4 className="mb-2 text-base font-semibold text-slate-800">{page.name}</h4>
              <p className="mb-1 text-xs text-slate-500">
                Modified: {new Date(page.lastModified).toLocaleDateString()}
              </p>
              <p className="text-[11px] text-slate-400">{page.filename}</p>
            </button>
          )
        })}

        {pages.length === 0 && (
          <div className="col-span-full rounded-lg border border-dashed border-slate-200 bg-slate-50 p-10 text-center text-sm text-slate-500">
            No pages created yet. Click "New Page" to get started!
          </div>
        )}
      </div>
    </div>
  )
}

export default PageManager
