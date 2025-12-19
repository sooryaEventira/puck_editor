import React, { useState, useRef } from 'react'
import { Modal } from '../ui'
import { Upload01 } from '@untitled-ui/icons-react'

interface HtmlCodeModalProps {
  isVisible: boolean
  onClose: () => void
  onConvert: (htmlCode: string) => void
}

const HtmlCodeModal: React.FC<HtmlCodeModalProps> = ({
  isVisible,
  onClose,
  onConvert
}) => {
  const [htmlCode, setHtmlCode] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Calculate line count
  const lineCount = htmlCode ? htmlCode.split('\n').length : 0

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file && file.type === 'text/html') {
      const reader = new FileReader()
      reader.onload = (e) => {
        const content = e.target?.result as string
        setHtmlCode(content)
      }
      reader.readAsText(file)
    } else if (file) {
      // Also allow files without extension or with .html extension
      const fileName = file.name.toLowerCase()
      if (fileName.endsWith('.html') || fileName.endsWith('.htm')) {
        const reader = new FileReader()
        reader.onload = (e) => {
          const content = e.target?.result as string
          setHtmlCode(content)
        }
        reader.readAsText(file)
      } else {
        alert('Please upload an HTML file (.html or .htm)')
      }
    }
  }

  const handleFileButtonClick = () => {
    fileInputRef.current?.click()
  }

  const handleConvert = () => {
    if (htmlCode.trim()) {
      onConvert(htmlCode)
      setHtmlCode('')
      onClose()
    }
  }

  const handleClose = () => {
    setHtmlCode('')
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
    onClose()
  }

  const footer = (
    <div className="flex w-full items-center justify-end gap-3 px-6 pb-6 pt-1.5">
      <button
        type="button"
        onClick={handleClose}
        className="min-w-[80px] rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-400 hover:bg-slate-50"
      >
        Cancel
      </button>
      <button
        type="button"
        onClick={handleConvert}
        disabled={!htmlCode.trim()}
        className="min-w-[80px] rounded-md bg-[#6938EF] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#5925DC] disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Convert
      </button>
    </div>
  )

  return (
    <Modal
      isVisible={isVisible}
      onClose={handleClose}
      title="Paste HTML Code"
      subtitle="Paste your HTML code below to convert it into a template and display it on the editor."
      width={700}
      maxWidth={700}
      borderRadius={16}
      footer={footer}
      zIndex={10000}
      showCloseButton={true}
    >
      <div className="px-6 py-4 space-y-4">
        {/* File Upload Option and Line Count */}
        <div className="flex items-center gap-3">
          <input
            ref={fileInputRef}
            type="file"
            accept=".html,.htm,text/html"
            onChange={handleFileUpload}
            className="hidden"
          />
          <button
            type="button"
            onClick={handleFileButtonClick}
            className="flex items-center gap-2 rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-400 hover:bg-slate-50"
          >
            <Upload01 className="h-4 w-4" />
            Upload HTML File
          </button>
          {lineCount > 0 && (
            <div className="rounded-md border border-slate-300 bg-slate-100 px-3 py-1.5 text-sm font-medium text-slate-700">
              {lineCount} {lineCount === 1 ? 'line' : 'lines'}
            </div>
          )}
        </div>

        {/* Textarea */}
        <textarea
          value={htmlCode}
          onChange={(e) => setHtmlCode(e.target.value)}
          placeholder="Paste your HTML code here..."
          className="w-full h-[400px] rounded-lg border border-slate-300 bg-slate-50 px-4 py-3 text-sm font-mono resize-none focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary focus:bg-white"
        />
      </div>
    </Modal>
  )
}

export default HtmlCodeModal

