import React, { useState, useRef } from 'react'
import { Upload01, Download01 } from '@untitled-ui/icons-react'
import Button from '../../ui/untitled/Button'

interface UploadModalProps {
  isOpen: boolean
  onClose: () => void
  onAttachFiles?: (files: File[]) => void
}

const UploadModal: React.FC<UploadModalProps> = ({ isOpen, onClose, onAttachFiles }) => {
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  if (!isOpen) return null

  const handleFileSelect = (files: FileList | null) => {
    if (files && files.length > 0) {
      const fileArray = Array.from(files)
      onAttachFiles?.(fileArray)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX
    const y = e.clientY
    
    // Check if we're actually leaving the drop zone
    if (x < rect.left || x > rect.right || y < rect.top || y > rect.bottom) {
      setIsDragging(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
    handleFileSelect(e.dataTransfer.files)
  }

  const handleClickUpload = () => {
    fileInputRef.current?.click()
  }

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFileSelect(e.target.files)
  }

  const handleAttachFiles = () => {
    // Handle attach files logic here
    onClose()
  }

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  const handleBackdropDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleBackdropDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }

  return (
    <div
      className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/50 p-4"
      onClick={handleBackdropClick}
      onDragOver={handleBackdropDragOver}
      onDrop={handleBackdropDrop}
    >
      <div
        className="relative w-full max-w-[400px] overflow-hidden rounded-lg bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
        onDragOver={(e) => {
          e.preventDefault()
          e.stopPropagation()
        }}
        onDrop={(e) => {
          e.preventDefault()
          e.stopPropagation()
        }}
      >
        {/* Modal Header */}
        <div className="relative flex w-full flex-col items-center justify-start">
          <div className="flex w-full flex-col items-start justify-start gap-2 self-stretch px-6 pt-4">
            <div className="flex w-full flex-col items-start justify-start gap-0.5 self-stretch">
              <div className="w-full text-base font-semibold leading-6 text-[#181D27]" style={{ fontFamily: 'Inter' }}>
                Upload and attach files
              </div>

            </div>
          </div>

          {/* Close Button */}
          <button
            type="button"
            onClick={onClose}
            className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center overflow-hidden rounded-lg p-2"
          >
            <div className="relative h-5 w-5 overflow-hidden">
              <svg
                className="absolute left-1.5 top-1.5 h-3 w-3 text-[#A4A7AE]"
                viewBox="0 0 12 12"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M9 3L3 9M3 3L9 9"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </button>

          {/* Spacer */}
          <div className="h-3 w-full" />
        </div>

        {/* Modal Content */}
        <div className="flex w-full flex-col items-start justify-start gap-3 px-6">
          <div className="flex w-full flex-col items-start justify-start gap-3 self-stretch">
            {/* Template Download Section - Moved to top */}
            <div className="flex w-full flex-col items-start justify-start gap-2 self-stretch">
              <div className="relative flex w-full items-start justify-start gap-1 overflow-hidden rounded-xl border border-[#E9EAEB] bg-white p-4 outline outline-1 outline-[#E9EAEB] outline-offset-[-1px]">
                <div className="flex flex-1 items-start justify-start gap-3">
                  {/* XLSX Icon */}
                  <div className="relative h-10 w-10 flex-shrink-0">
                    <div className="absolute left-1 top-0 h-10 w-8">
                      <div className="absolute left-0 top-0 h-10 w-8 bg-[#079455]" />
                      <div className="absolute left-5 top-0 h-3 w-3 bg-white opacity-30" />
                    </div>
                    <div className="absolute left-1 top-[23px] w-8 text-center text-[9px] font-bold leading-none text-white" style={{ fontFamily: 'Inter' }}>
                      XLSX
                    </div>
                  </div>

                  {/* Template Info */}
                  <div className="flex flex-1 flex-col items-start justify-start gap-1">
                    <div className="flex w-full flex-col items-start justify-start gap-0.5 self-stretch">
                      <div className="w-full text-base font-semibold leading-6 text-[#181D27]" style={{ fontFamily: 'Inter' }}>
                        Template
                      </div>
                      <div className="inline-flex w-full items-center justify-start gap-2 self-stretch">
                        <span className="text-sm font-normal leading-5 text-[#535862]" style={{ fontFamily: 'Inter' }}>
                          Download template
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Download Button */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    // TODO: Implement template download
                    console.log('Download template')
                  }}
                  className="absolute right-2 top-2 flex items-center justify-center overflow-hidden rounded-md p-1.5 hover:bg-slate-100 transition-colors"
                >
                  <div className="relative h-4 w-4 overflow-hidden">
                    <Download01 className="absolute left-0.5 top-0.5 h-3 w-3 text-[#A4A7AE]" strokeWidth={1.5} />
                  </div>
                </button>
              </div>
            </div>

            {/* File Upload Area */}
            <div
              onDragEnter={handleDragEnter}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={handleClickUpload}
              className={`flex w-full cursor-pointer flex-col items-center justify-start gap-1 self-stretch rounded-xl border-2 border-dashed bg-white px-6 py-6 outline outline-2 outline-offset-[-2px] transition-colors ${
                isDragging
                  ? 'border-[#7A5AF8] outline-[#7A5AF8] bg-purple-50'
                  : 'border-[#7A5AF8] outline-[#7A5AF8] hover:bg-slate-50'
              }`}
            >
              <div className="flex w-full flex-col items-center justify-start gap-2 self-stretch pointer-events-none">
                {/* Upload Icon - Circular with arrow up */}
                <div className="relative h-10 w-10 flex items-center justify-center">
                  <div className="absolute inset-0 rounded-full bg-white border-2 border-[#7A5AF8]" />
                  <Upload01 className="relative h-5 w-5 text-[#7A5AF8]" strokeWidth={2} />
                </div>

                {/* Upload Text */}
                <div className="flex w-full flex-col items-center justify-start gap-1 self-stretch">
                  <div className="inline-flex w-full items-start justify-center gap-1 self-stretch">
                    <span className="text-sm font-semibold leading-5 text-[#5925DC] pointer-events-auto cursor-pointer" style={{ fontFamily: 'Inter' }} onClick={handleClickUpload}>
                      Click to upload
                    </span>
                    <span className="text-sm font-normal leading-5 text-[#535862]" style={{ fontFamily: 'Inter' }}>
                      , drag and drop xlsx
                    </span>
                  </div>
                  <div className="w-full text-center text-xs font-normal leading-[18px] text-[#535862]" style={{ fontFamily: 'Inter' }}>
                    XLSX files only
                  </div>
                </div>
              </div>
            </div>

            {/* Hidden File Input */}
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept=".xlsx,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
              onChange={handleFileInputChange}
              className="hidden"
            />

            {/* Instructions */}
            <div className="flex w-full flex-col items-start justify-start gap-1 self-stretch">
              <div className="text-sm font-normal leading-5 text-[#535862]" style={{ fontFamily: 'Inter' }}>
                Step 1: Download template
              </div>
              <div className="text-sm font-normal leading-5 text-[#535862]" style={{ fontFamily: 'Inter' }}>
                Step 2: Upload schedule
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex w-full flex-col items-start justify-start pt-4">
          <div className="inline-flex w-full items-start justify-start gap-3 self-stretch px-6 pb-4">
            {/* Cancel Button */}
            <Button
              type="button"
              variant="secondary"
              size="lg"
              onClick={onClose}
              className="flex-1"
              style={{ fontFamily: 'Inter' }}
            >
              Cancel
            </Button>

            {/* Attach Files Button */}
            <Button
              type="button"
              variant="primary"
              size="lg"
              onClick={handleAttachFiles}
              className="flex-1"
              style={{ fontFamily: 'Inter' }}
            >
              Attach files
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UploadModal

