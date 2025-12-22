import React, { useState, useRef } from 'react'
import { Button, Input } from '../../ui/untitled'
import { XClose, Upload01 } from '@untitled-ui/icons-react'

const SeoTab: React.FC = () => {
  const [pageTitle, setPageTitle] = useState('')
  const [metaDescription, setMetaDescription] = useState('')
  const [googleAnalyticsId, setGoogleAnalyticsId] = useState('G-XXXXXXXXXX')
  const [socialImageUrl, setSocialImageUrl] = useState<string>(() => {
    return localStorage.getItem('event-form-banner') || ''
  })
  
  const socialImageInputRef = useRef<HTMLInputElement>(null)

  const handleSocialImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = () => {
        const result = reader.result as string
        setSocialImageUrl(result)
        localStorage.setItem('event-form-social-image', result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleRemoveSocialImage = () => {
    setSocialImageUrl('')
    localStorage.removeItem('event-form-social-image')
    if (socialImageInputRef.current) {
      socialImageInputRef.current.value = ''
    }
  }

  const pageTitleLength = pageTitle.length
  const metaDescriptionLength = metaDescription.length
  const maxPageTitleLength = 60
  const maxMetaDescriptionLength = 160

  return (
    <div className="space-y-8">
      {/* Meta Information Section */}
      <div className="space-y-6">
        <label className="text-sm font-semibold text-slate-900">Meta Information</label>
        
        {/* Page Title */}
        <div className="space-y-2">
          <Input
            label="Page Title"
            type="text"
            value={pageTitle}
            onChange={(e) => setPageTitle(e.target.value)}
            placeholder="Enter page title"
            maxLength={maxPageTitleLength}
            className="[&>label>span:first-child]:normal-case [&>label>span:first-child]:text-sm [&>label>span:first-child]:font-medium [&>label>span:first-child]:text-slate-700 [&>label>span:first-child]:tracking-normal"
          />
          <div className="flex justify-end">
            <span className={`text-xs ${
              pageTitleLength > maxPageTitleLength * 0.9 
                ? 'text-rose-500' 
                : 'text-slate-500'
            }`}>
              {pageTitleLength}/{maxPageTitleLength} characters
            </span>
          </div>
        </div>

        {/* Meta Description */}
        <div className="space-y-2">
          <label className="flex w-full flex-col gap-1">
            <span className="text-xs font-medium uppercase tracking-wide text-slate-500">Meta Description</span>
            <textarea
              value={metaDescription}
              onChange={(e) => setMetaDescription(e.target.value)}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 shadow-sm transition placeholder:text-slate-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
              placeholder="Enter meta description"
              rows={3}
              maxLength={maxMetaDescriptionLength}
            />
          </label>
          <div className="flex justify-end">
            <span className={`text-xs ${
              metaDescriptionLength > maxMetaDescriptionLength * 0.9 
                ? 'text-rose-500' 
                : 'text-slate-500'
            }`}>
              {metaDescriptionLength}/{maxMetaDescriptionLength} characters
            </span>
          </div>
        </div>
      </div>

      {/* Analytics Section */}
      <div className="space-y-4">
        <label className="text-sm font-semibold text-slate-900">Analytics</label>
        <Input
          label="Google analytics ID"
          type="text"
          value={googleAnalyticsId}
          onChange={(e) => setGoogleAnalyticsId(e.target.value)}
          placeholder="G-XXXXXXXXXX"
          className="[&>label>span:first-child]:normal-case [&>label>span:first-child]:text-sm [&>label>span:first-child]:font-medium [&>label>span:first-child]:text-slate-700 [&>label>span:first-child]:tracking-normal"
        />
      </div>

      {/* Social Sharing Image Section */}
      <div className="space-y-4">
        <div>
          <label className="text-sm font-semibold text-slate-900">Social Sharing Image</label>
          <p className="text-xs text-slate-500 mt-1">Recommended: 500 × 500 px</p>
        </div>
        {socialImageUrl ? (
          <div className="relative inline-block">
            <img
              src={socialImageUrl}
              alt="Social Sharing Image"
              className="h-[500px] w-[500px] rounded-lg object-cover"
            />
            <button
              onClick={handleRemoveSocialImage}
              className="absolute top-2 right-2 h-6 w-6 rounded-full bg-white/90 backdrop-blur-sm border border-slate-300 flex items-center justify-center hover:bg-white transition shadow-sm"
            >
              <XClose className="h-4 w-4 text-slate-600" />
            </button>
          </div>
        ) : (
          <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center">
            <p className="text-sm text-slate-500 mb-4">No social sharing image uploaded</p>
            <Button
              variant="secondary"
              onClick={() => socialImageInputRef.current?.click()}
              iconLeading={<Upload01 className="h-4 w-4" />}
            >
              Upload Image
            </Button>
          </div>
        )}
        {/* {socialImageUrl && (
          <Button
            variant="secondary"
            onClick={() => socialImageInputRef.current?.click()}
            iconLeading={<Upload01 className="h-4 w-4" />}
          >
            Upload Image
          </Button>
        )} */}
        <input
          ref={socialImageInputRef}
          type="file"
          accept="image/*"
          onChange={handleSocialImageUpload}
          className="hidden"
        />
      </div>
    </div>
  )
}

export default SeoTab

