import React, { useState, useEffect, useRef } from 'react'
import { useEventForm } from '../../../contexts/EventFormContext'
import { XClose, ChevronDown } from '@untitled-ui/icons-react'
import Button from '../../ui/untitled/Button'
import Select from '../../ui/untitled/Select'

interface WebsiteSettingsPageProps {
  hideNavbarAndSidebar?: boolean
}

const WebsiteSettingsPage: React.FC<WebsiteSettingsPageProps> = ({
  hideNavbarAndSidebar: _hideNavbarAndSidebar = false
}) => {
  const { eventData } = useEventForm()
  const [activeTab, setActiveTab] = useState<'branding' | 'domain' | 'seo' | 'access'>('branding')
  const [bannerUrl, setBannerUrl] = useState<string>('')
  const [logoUrl, setLogoUrl] = useState<string>('')
  const [primaryColor, setPrimaryColor] = useState('#6366f1')
  const [headingFont, setHeadingFont] = useState('Inter')
  const [bodyFont, setBodyFont] = useState('Inter')
  const [showThemeDropdown, setShowThemeDropdown] = useState(false)
  const themeDropdownRef = useRef<HTMLDivElement>(null)
  const [subdomainName, setSubdomainName] = useState('eventira/ HIC2025')
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [pageTitle, setPageTitle] = useState('Highly Important Conference of 2025.')
  const [metaDescription, setMetaDescription] = useState('Join us for the most anticipated conference of 2025.')
  const [googleAnalyticsId, setGoogleAnalyticsId] = useState('G-XXXXXXXXXX')
  const [socialSharingImageUrl, setSocialSharingImageUrl] = useState<string>('')
  const [visibility, setVisibility] = useState<'public' | 'private' | 'hidden'>('public')
  const [pages, setPages] = useState({
    page1: false
  })
  const [requireRegistration, setRequireRegistration] = useState(false)

  // Load banner and logo from localStorage or eventData
  useEffect(() => {
    // Load banner
    if (eventData?.banner && eventData.banner instanceof File) {
      const reader = new FileReader()
      reader.onload = () => {
        setBannerUrl(reader.result as string)
      }
      reader.readAsDataURL(eventData.banner)
    } else {
      const storedBanner = localStorage.getItem('event-form-banner')
      if (storedBanner) {
        setBannerUrl(storedBanner)
      }
    }

    // Load logo
    if (eventData?.logo && eventData.logo instanceof File) {
      const reader = new FileReader()
      reader.onload = () => {
        setLogoUrl(reader.result as string)
      }
      reader.readAsDataURL(eventData.logo)
    } else {
      const storedLogo = localStorage.getItem('event-form-logo')
      if (storedLogo) {
        setLogoUrl(storedLogo)
      }
    }
  }, [eventData])

  const handleBannerRemove = () => {
    setBannerUrl('')
    localStorage.removeItem('event-form-banner')
  }

  const handleLogoRemove = () => {
    setLogoUrl('')
    localStorage.removeItem('event-form-logo')
  }

  const handleBannerUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = () => {
        const dataUrl = reader.result as string
        setBannerUrl(dataUrl)
        localStorage.setItem('event-form-banner', dataUrl)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = () => {
        const dataUrl = reader.result as string
        setLogoUrl(dataUrl)
        localStorage.setItem('event-form-logo', dataUrl)
      }
      reader.readAsDataURL(file)
    }
  }

  const fontOptions = [
    { value: 'Inter', label: 'Inter' },
    { value: 'Arial', label: 'Arial' },
    { value: 'Helvetica', label: 'Helvetica' },
    { value: 'Roboto', label: 'Roboto' },
    { value: 'Open Sans', label: 'Open Sans' },
    { value: 'Lato', label: 'Lato' },
    { value: 'Montserrat', label: 'Montserrat' },
    { value: 'Poppins', label: 'Poppins' }
  ]

  const themeColors = [
    { name: 'Indigo', value: '#6366f1' },
    { name: 'Purple', value: '#7c3aed' },
    { name: 'Blue', value: '#3b82f6' },
    { name: 'Teal', value: '#14b8a6' },
    { name: 'Green', value: '#10b981' },
    { name: 'Emerald', value: '#059669' },
    { name: 'Rose', value: '#f43f5e' },
    { name: 'Pink', value: '#ec4899' },
    { name: 'Orange', value: '#f97316' },
    { name: 'Amber', value: '#f59e0b' }
  ]

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showThemeDropdown && themeDropdownRef.current && !themeDropdownRef.current.contains(event.target as Node)) {
        setShowThemeDropdown(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showThemeDropdown])

  const handleThemeSelect = (color: string) => {
    setPrimaryColor(color)
    setShowThemeDropdown(false)
  }

  const handleSocialSharingImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = () => {
        const dataUrl = reader.result as string
        setSocialSharingImageUrl(dataUrl)
        localStorage.setItem('event-form-social-sharing-image', dataUrl)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSocialSharingImageRemove = () => {
    setSocialSharingImageUrl('')
    localStorage.removeItem('event-form-social-sharing-image')
  }

  // Load social sharing image from localStorage
  useEffect(() => {
    const storedImage = localStorage.getItem('event-form-social-sharing-image')
    if (storedImage) {
      setSocialSharingImageUrl(storedImage)
    }
  }, [])

  return (
    <div className="w-full">
      <div className="p-8 bg-white pb-16">
        {/* Header */}
        <h1 className="text-[26px] font-bold text-primary-dark mb-6">Website Settings</h1>

        {/* Tabs */}
        <div className="flex gap-6 mb-6 border-b border-slate-200">
          <Button
            type="button"
            variant="tertiary"
            size="sm"
            onClick={() => setActiveTab('branding')}
            className={`pb-3 px-1 h-auto rounded-none border-b-2 transition-colors relative ${
              activeTab === 'branding'
                ? 'text-primary border-b-primary'
                : 'text-slate-600 hover:text-slate-900 border-b-transparent'
            }`}
          >
            Branding
          </Button>
          <Button
            type="button"
            variant="tertiary"
            size="sm"
            onClick={() => setActiveTab('domain')}
            className={`pb-3 px-1 h-auto rounded-none border-b-2 transition-colors relative ${
              activeTab === 'domain'
                ? 'text-primary border-b-primary'
                : 'text-slate-600 hover:text-slate-900 border-b-transparent'
            }`}
          >
            Domain & URL
          </Button>
          <Button
            type="button"
            variant="tertiary"
            size="sm"
            onClick={() => setActiveTab('seo')}
            className={`pb-3 px-1 h-auto rounded-none border-b-2 transition-colors relative ${
              activeTab === 'seo'
                ? 'text-primary border-b-primary'
                : 'text-slate-600 hover:text-slate-900 border-b-transparent'
            }`}
          >
            SEO
          </Button>
          <Button
            type="button"
            variant="tertiary"
            size="sm"
            onClick={() => setActiveTab('access')}
            className={`pb-3 px-1 h-auto rounded-none border-b-2 transition-colors relative ${
              activeTab === 'access'
                ? 'text-primary border-b-primary'
                : 'text-slate-600 hover:text-slate-900 border-b-transparent'
            }`}
          >
            Access control
          </Button>
        </div>

        {/* Content */}
        {activeTab === 'branding' && (
          <div className="space-y-8">
            {/* Banner Section */}
            <div className="space-y-3">
              <div>
                <label className="text-sm font-semibold text-slate-900">Banner</label>
                <p className="text-xs text-slate-500 mt-1">Recommended: 1920 x 400px</p>
              </div>
              {bannerUrl ? (
                <div className="relative w-full h-48 rounded-lg border border-slate-200 overflow-hidden bg-slate-50">
                  <img
                    src={bannerUrl}
                    alt="Banner"
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={handleBannerRemove}
                    className="absolute top-2 right-2 flex h-6 w-6 items-center justify-center rounded-full bg-white/90 text-slate-600 shadow-sm hover:bg-white transition-colors"
                    aria-label="Remove banner"
                  >
                    <XClose className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <div className="relative">
                  <div className="w-full h-48 rounded-lg border-2 border-dashed border-slate-300 bg-slate-50 flex items-center justify-center">
                    <div className="text-center">
                      <p className="text-sm text-slate-600 mb-2">No banner uploaded</p>
                      <label className="inline-block cursor-pointer">
                        <input
                          id="banner-upload"
                          type="file"
                          accept="image/*"
                          onChange={handleBannerUpload}
                          className="hidden"
                        />
                        <Button
                          type="button"
                          variant="secondary"
                          size="sm"
                          onClick={() => document.getElementById('banner-upload')?.click()}
                        >
                          Upload Banner
                        </Button>
                      </label>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Logo Section */}
            <div className="space-y-3">
              <div>
                <label className="text-sm font-semibold text-slate-900">Logo</label>
                <p className="text-xs text-slate-500 mt-1">Recommended: 500 x 500 px</p>
              </div>
              {logoUrl ? (
                <div className="relative w-32 h-32 rounded-lg border border-slate-200 overflow-hidden bg-slate-50">
                  <img
                    src={logoUrl}
                    alt="Logo"
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={handleLogoRemove}
                    className="absolute top-1 right-1 flex h-5 w-5 items-center justify-center rounded-full bg-white/90 text-slate-600 shadow-sm hover:bg-white transition-colors"
                    aria-label="Remove logo"
                  >
                    <XClose className="h-3 w-3" />
                  </button>
                </div>
              ) : (
                <div className="relative">
                  <div className="w-32 h-32 rounded-lg border-2 border-dashed border-slate-300 bg-slate-50 flex items-center justify-center">
                    <div className="text-center">
                      <label className="inline-block cursor-pointer">
                        <input
                          id="logo-upload"
                          type="file"
                          accept="image/*"
                          onChange={handleLogoUpload}
                          className="hidden"
                        />
                        <Button
                          type="button"
                          variant="secondary"
                          size="sm"
                          onClick={() => document.getElementById('logo-upload')?.click()}
                        >
                          Upload Logo
                        </Button>
                      </label>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Brand Colors Section */}
            <div className="space-y-3">
              <label className="text-sm font-semibold text-slate-900">Brand Colors</label>
              <div className="space-y-3">
                <div className="flex items-start gap-4">
                  {/* Color Swatch */}
                  <div
                    className="w-20 h-20 rounded-lg border border-slate-200 flex items-center justify-center text-white font-medium text-sm shadow-sm flex-shrink-0"
                    style={{ backgroundColor: primaryColor }}
                  >
                    {primaryColor}
                  </div>
                  
                  {/* Right side content */}
                  <div className="flex-1 space-y-3">
                    {/* Primary Color Label */}
                    <div>
                      <div className="text-sm font-medium text-slate-900">Primary Color</div>
                    </div>
                    
                    {/* Input with integrated Pick theme button */}
                    <div className="relative" ref={themeDropdownRef}>
                      <input
                        type="text"
                        value={primaryColor}
                        onChange={(e) => {
                          const value = e.target.value
                          if (/^#[0-9A-Fa-f]{0,6}$/.test(value)) {
                            setPrimaryColor(value)
                          }
                        }}
                        className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 pr-32 text-sm text-slate-700 shadow-sm transition placeholder:text-slate-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                        placeholder="#6366f1"
                      />
                      <Button
                        type="button"
                        variant="primary"
                        size="sm"
                        onClick={() => setShowThemeDropdown(!showThemeDropdown)}
                        className="absolute right-1 top-1/2 -translate-y-1/2"
                        iconTrailing={<ChevronDown className={`h-4 w-4 transition-transform ${showThemeDropdown ? 'rotate-180' : ''}`} />}
                      >
                        Pick theme
                      </Button>
                      
                      {/* Theme Dropdown */}
                      {showThemeDropdown && (
                        <div className="absolute right-0 top-full mt-1 z-50 w-64 rounded-lg border border-slate-200 bg-white shadow-lg max-h-80 overflow-y-auto">
                          <div className="p-2">
                            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide px-2 py-1.5">
                              Theme Colors
                            </div>
                            <div className="space-y-1">
                              {themeColors.map((theme) => (
                                <button
                                  key={theme.value}
                                  type="button"
                                  onClick={() => handleThemeSelect(theme.value)}
                                  className="w-full flex items-center gap-3 px-3 py-2 rounded-md hover:bg-slate-50 transition-colors text-left"
                                >
                                  <div
                                    className="w-8 h-8 rounded border border-slate-200 flex-shrink-0"
                                    style={{ backgroundColor: theme.value }}
                                  />
                                  <div className="flex-1">
                                    <div className="text-sm font-medium text-slate-900">{theme.name}</div>
                                    <div className="text-xs text-slate-500">{theme.value}</div>
                                  </div>
                                  {primaryColor === theme.value && (
                                    <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0" />
                                  )}
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    {/* Description */}
                    <div className="text-xs text-slate-500">Used for links, buttons.</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Typography Section */}
            <div className="space-y-6">
              <label className="text-sm font-semibold text-slate-900">Typography</label>
              
              {/* Heading Font */}
              <div className="space-y-3">
                <Select
                  label="Heading Font"
                  value={headingFont}
                  onChange={(e) => setHeadingFont(e.target.value)}
                  options={fontOptions}
                />
                <div
                  className="text-sm  text-slate-500"
                  style={{ fontFamily: headingFont }}
                >
                  Brown fox jumped through the loop
                </div>
              </div>

              {/* Body Font */}
              <div className="space-y-3">
                <Select
                  label="Body Font"
                  value={bodyFont}
                  onChange={(e) => setBodyFont(e.target.value)}
                  options={fontOptions}
                />
                <div
                  className="text-sm text-slate-500"
                  style={{ fontFamily: bodyFont }}
                >
                  Brown fox jumped through the loop
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'domain' && (
          <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-sm">
            {/* Subdomain Section */}
            <div className="space-y-3">
              <label className="text-sm font-semibold text-slate-900">Subdomain</label>
              
              {/* Name Input with .com suffix */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Name</label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={subdomainName}
                    onChange={(e) => setSubdomainName(e.target.value)}
                    className="flex-1 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 shadow-sm transition placeholder:text-slate-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                    placeholder="eventira/ HIC2025"
                  />
                  <div className="px-4 py-2 rounded-lg bg-slate-100 border border-slate-200 text-sm font-medium text-slate-700 flex-shrink-0">
                    .com
                  </div>
                </div>
              </div>

              {/* Advanced Link */}
              <button
                type="button"
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="flex items-center gap-1 text-sm text-primary hover:text-primary-dark transition-colors"
              >
                Advanced
                <ChevronDown className={`h-4 w-4 transition-transform ${showAdvanced ? 'rotate-180' : ''}`} />
              </button>

              {/* Advanced Section (Collapsible) */}
              {showAdvanced && (
                <div className="mt-4 pt-4 border-t border-slate-200 space-y-4">
                  <p className="text-sm text-slate-600">Advanced domain settings will be displayed here.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'seo' && (
          <div className="space-y-8">
            {/* Meta Information Section */}
            <div className="space-y-6">
              <label className="text-sm font-semibold text-slate-900">Meta Information</label>
              
              {/* Page Title */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Page Title</label>
                <input
                  type="text"
                  value={pageTitle}
                  onChange={(e) => setPageTitle(e.target.value)}
                  maxLength={60}
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 shadow-sm transition placeholder:text-slate-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  placeholder="Enter page title"
                />
                <div className="text-xs text-slate-500">
                  {pageTitle.length}/60 characters
                </div>
              </div>

              {/* Meta Description */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Meta Description</label>
                <textarea
                  value={metaDescription}
                  onChange={(e) => setMetaDescription(e.target.value)}
                  maxLength={160}
                  rows={3}
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 shadow-sm transition placeholder:text-slate-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
                  placeholder="Enter meta description"
                />
                <div className="text-xs text-slate-500">
                  {metaDescription.length}/160 characters
                </div>
              </div>
            </div>

            {/* Analytics Section */}
            <div className="space-y-6">
              <label className="text-sm font-semibold text-slate-900">Analytics</label>
              
              {/* Google Analytics ID */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Google analytics ID</label>
                <input
                  type="text"
                  value={googleAnalyticsId}
                  onChange={(e) => setGoogleAnalyticsId(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 shadow-sm transition placeholder:text-slate-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  placeholder="G-XXXXXXXXXX"
                />
              </div>
            </div>

            {/* Social Sharing Image Section */}
            <div className="space-y-3">
              <div>
                <label className="text-sm font-semibold text-slate-900">Social Sharing Image</label>
                <p className="text-xs text-slate-500 mt-1">Recommended: 500 x 500 px</p>
              </div>
              {socialSharingImageUrl ? (
                <div className="relative w-full max-w-md rounded-lg border border-slate-200 overflow-hidden bg-slate-50">
                  <img
                    src={socialSharingImageUrl}
                    alt="Social Sharing Image"
                    className="w-full h-auto object-cover"
                  />
                  <button
                    type="button"
                    onClick={handleSocialSharingImageRemove}
                    className="absolute top-2 right-2 flex h-6 w-6 items-center justify-center rounded-full bg-white/90 text-slate-600 shadow-sm hover:bg-white transition-colors"
                    aria-label="Remove social sharing image"
                  >
                    <XClose className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <div className="relative">
                  <div className="w-full max-w-md h-64 rounded-lg border-2 border-dashed border-slate-300 bg-slate-50 flex items-center justify-center">
                    <div className="text-center">
                      <p className="text-sm text-slate-600 mb-2">No image uploaded</p>
                      <label className="inline-block cursor-pointer">
                        <input
                          id="social-sharing-image-upload"
                          type="file"
                          accept="image/*"
                          onChange={handleSocialSharingImageUpload}
                          className="hidden"
                        />
                        <Button
                          type="button"
                          variant="secondary"
                          size="sm"
                          onClick={() => document.getElementById('social-sharing-image-upload')?.click()}
                        >
                          Upload Image
                        </Button>
                      </label>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'access' && (
          <div className="space-y-8">
            {/* Visibility Section */}
            <div className="space-y-4">
              <label className="text-sm font-semibold text-slate-900">Visibility</label>
              <div className="flex gap-4">
                {/* Public Option */}
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="visibility"
                    value="public"
                    checked={visibility === 'public'}
                    onChange={(e) => setVisibility(e.target.value as 'public' | 'private' | 'hidden')}
                    className="sr-only"
                  />
                  <div className={`flex items-center justify-center w-32 h-12 rounded-lg border-2 transition-all ${
                    visibility === 'public'
                      ? 'border-primary bg-primary/5'
                      : 'border-slate-300 bg-white hover:border-slate-400'
                  }`}>
                    <div className={`w-4 h-4 rounded-full border-2 mr-2 flex items-center justify-center ${
                      visibility === 'public'
                        ? 'border-primary bg-primary'
                        : 'border-slate-400 bg-white'
                    }`}>
                      {visibility === 'public' && (
                        <div className="w-2 h-2 rounded-full bg-white" />
                      )}
                    </div>
                    <span className={`text-sm font-medium ${
                      visibility === 'public' ? 'text-primary' : 'text-slate-700'
                    }`}>
                      Public
                    </span>
                  </div>
                </label>

                {/* Private Option */}
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="visibility"
                    value="private"
                    checked={visibility === 'private'}
                    onChange={(e) => setVisibility(e.target.value as 'public' | 'private' | 'hidden')}
                    className="sr-only"
                  />
                  <div className={`flex items-center justify-center w-32 h-12 rounded-lg border-2 transition-all ${
                    visibility === 'private'
                      ? 'border-primary bg-primary/5'
                      : 'border-slate-300 bg-white hover:border-slate-400'
                  }`}>
                    <div className={`w-4 h-4 rounded-full border-2 mr-2 flex items-center justify-center ${
                      visibility === 'private'
                        ? 'border-primary bg-primary'
                        : 'border-slate-400 bg-white'
                    }`}>
                      {visibility === 'private' && (
                        <div className="w-2 h-2 rounded-full bg-white" />
                      )}
                    </div>
                    <span className={`text-sm font-medium ${
                      visibility === 'private' ? 'text-primary' : 'text-slate-700'
                    }`}>
                      Private
                    </span>
                  </div>
                </label>

                {/* Hidden Option */}
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="visibility"
                    value="hidden"
                    checked={visibility === 'hidden'}
                    onChange={(e) => setVisibility(e.target.value as 'public' | 'private' | 'hidden')}
                    className="sr-only"
                  />
                  <div className={`flex items-center justify-center w-32 h-12 rounded-lg border-2 transition-all ${
                    visibility === 'hidden'
                      ? 'border-primary bg-primary/5'
                      : 'border-slate-300 bg-white hover:border-slate-400'
                  }`}>
                    <div className={`w-4 h-4 rounded-full border-2 mr-2 flex items-center justify-center ${
                      visibility === 'hidden'
                        ? 'border-primary bg-primary'
                        : 'border-slate-400 bg-white'
                    }`}>
                      {visibility === 'hidden' && (
                        <div className="w-2 h-2 rounded-full bg-white" />
                      )}
                    </div>
                    <span className={`text-sm font-medium ${
                      visibility === 'hidden' ? 'text-primary' : 'text-slate-700'
                    }`}>
                      Hidden
                    </span>
                  </div>
                </label>
              </div>
            </div>

            {/* Pages Section */}
            <div className="space-y-4">
              <label className="text-sm font-semibold text-slate-900">Pages</label>
              <div className="space-y-3">
                {/* Page 1 */}
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={pages.page1}
                    onChange={(e) => setPages({ ...pages, page1: e.target.checked })}
                    className="sr-only"
                  />
                  <div className={`w-5 h-5 rounded border-2 mr-3 flex items-center justify-center transition-all ${
                    pages.page1
                      ? 'border-primary bg-primary'
                      : 'border-slate-300 bg-white'
                  }`}>
                    {pages.page1 && (
                      <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                  <span className="text-sm font-medium text-slate-700">Page 1</span>
                </label>
              </div>
            </div>

            {/* Require Registration Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-semibold text-slate-900 block mb-1">Require registration</label>
                  <p className="text-xs text-slate-500">Attendees must register to view content</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={requireRegistration}
                    onChange={(e) => setRequireRegistration(e.target.checked)}
                    className="sr-only"
                  />
                  <div className={`w-11 h-6 rounded-full transition-colors ${
                    requireRegistration ? 'bg-primary' : 'bg-slate-300'
                  }`}>
                    <div className={`w-5 h-5 bg-white rounded-full shadow-sm transform transition-transform ${
                      requireRegistration ? 'translate-x-5' : 'translate-x-0.5'
                    } mt-0.5`} />
                  </div>
                </label>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default WebsiteSettingsPage

