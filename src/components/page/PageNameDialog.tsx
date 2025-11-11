import React from 'react'

interface PageNameDialogProps {
  isVisible: boolean
  pageName: string
  onPageNameChange: (name: string) => void
  onConfirm: (name: string) => void
  onCancel: () => void
}

const PageNameDialog: React.FC<PageNameDialogProps> = ({
  isVisible,
  pageName,
  onPageNameChange,
  onConfirm,
  onCancel
}) => {
  if (!isVisible) return null

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      onConfirm(pageName)
    }
  }

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-lg rounded-lg bg-white p-8 shadow-2xl">
        <h3 className="mb-3 text-xl font-semibold text-slate-800">📝 Name Your New Page</h3>
        <p className="mb-5 text-sm text-slate-500">
          Give your page a descriptive name (e.g., "Home", "About Us", "Contact")
        </p>
        <input
          type="text"
          value={pageName}
          onChange={(e) => onPageNameChange(e.target.value)}
          placeholder="Enter page name..."
          className="mb-6 w-full rounded-md border border-slate-300 px-4 py-3 text-base text-slate-700 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40"
          onKeyPress={handleKeyPress}
          autoFocus
        />
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-md bg-slate-500 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-slate-600"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => onConfirm(pageName)}
            className="rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-white transition hover:bg-primary/90"
          >
            Create Page
          </button>
        </div>
      </div>
    </div>
  )
}

export default PageNameDialog
