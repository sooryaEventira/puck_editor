import React, { useState, useRef, useEffect } from 'react'
import { Button } from '../../ui/untitled'
import { XClose, Upload01, ChevronDown } from '@untitled-ui/icons-react'

const BrandingTab: React.FC = () => {
  // Get banner and logo from localStorage (stored during event creation)
  const [bannerUrl, setBannerUrl] = useState<string>(() => {
    return localStorage.getItem('event-form-banner') || ''
  })
  const [logoUrl, setLogoUrl] = useState<string>(() => {
    return localStorage.getItem('event-form-logo') || ''
  })
  
  const [primaryColor, setPrimaryColor] = useState('#6366f1')
  const [headingFont, setHeadingFont] = useState('Inter')
  const [bodyFont, setBodyFont] = useState('Inter')
  const [showThemeDropdown, setShowThemeDropdown] = useState(false)
  
  const bannerInputRef = useRef<HTMLInputElement>(null)
  const logoInputRef = useRef<HTMLInputElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Color options for the theme picker
  const themeColors = [
    { name: 'Indigo', hex: '#6366f1' },
    { name: 'Purple', hex: '#8b5cf6' },
    { name: 'Blue', hex: '#3b82f6' },
    { name: 'Teal', hex: '#14b8a6' },
    { name: 'Green', hex: '#10b981' },
    { name: 'Emerald', hex: '#059669' },
    { name: 'Rose', hex: '#f43f5e' },
    { name: 'Pink', hex: '#ec4899' },
    { name: 'Orange', hex: '#f97316' },
    { name: 'Amber', hex: '#f59e0b' }
  ]

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowThemeDropdown(false)
      }
    }

    if (showThemeDropdown) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showThemeDropdown])

  const handleThemeSelect = (hex: string) => {
    setPrimaryColor(hex)
    setShowThemeDropdown(false)
  }

  const handleBannerUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = () => {
        const result = reader.result as string
        setBannerUrl(result)
        localStorage.setItem('event-form-banner', result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = () => {
        const result = reader.result as string
        setLogoUrl(result)
        localStorage.setItem('event-form-logo', result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleRemoveBanner = () => {
    setBannerUrl('')
    localStorage.removeItem('event-form-banner')
    if (bannerInputRef.current) {
      bannerInputRef.current.value = ''
    }
  }

  const handleRemoveLogo = () => {
    setLogoUrl('')
    localStorage.removeItem('event-form-logo')
    if (logoInputRef.current) {
      logoInputRef.current.value = ''
    }
  }

  const fonts = ['Inter', 'Roboto', 'Open Sans', 'Lato', 'Montserrat', 'Poppins']

  return (
    <div className="space-y-8">
      {/* Banner Section */}
      <div className="space-y-4">
        <div>
          <label className="text-sm font-semibold text-slate-900">Banner</label>
          <p className="text-xs text-slate-500 mt-1">Recommended: 1920 × 400px</p>
        </div>
        {bannerUrl ? (
          <div className="relative w-full">
            <img
              src={bannerUrl}
              alt="Banner"
              className="w-full h-40 rounded-lg object-cover"
            />
            <button
              onClick={handleRemoveBanner}
              className="absolute top-2 right-2 h-6 w-6 rounded-full bg-white/90 backdrop-blur-sm border border-slate-300 flex items-center justify-center hover:bg-white transition shadow-sm"
            >
              <XClose className="h-4 w-4 text-slate-600" />
            </button>
          </div>
        ) : (
          <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center">
            <p className="text-sm text-slate-500 mb-4">No banner uploaded</p>
            <Button
              variant="secondary"
              onClick={() => bannerInputRef.current?.click()}
              iconLeading={<Upload01 className="h-4 w-4" />}
            >
              Upload Banner
            </Button>
          </div>
        )}
        <input
          ref={bannerInputRef}
          type="file"
          accept="image/*"
          onChange={handleBannerUpload}
          className="hidden"
        />
      </div>

      {/* Logo Section */}
      <div className="space-y-4">
        <div>
          <label className="text-sm font-semibold text-slate-900">Logo</label>
          <p className="text-xs text-slate-500 mt-1">Recommended: 500 x 500 px</p>
        </div>
        {logoUrl ? (
          <div className="relative inline-block">
            <img
              src={logoUrl}
              alt="Logo"
              className="h-32 w-32 rounded-lg object-cover"
            />
            <button
              onClick={handleRemoveLogo}
              className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-white border border-slate-300 flex items-center justify-center hover:bg-slate-50 transition"
            >
              <XClose className="h-4 w-4 text-slate-600" />
            </button>
          </div>
        ) : (
          <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center w-32 h-32 flex flex-col items-center justify-center gap-2">
            <p className="text-xs text-slate-500">No logo</p>
            <Button
              variant="secondary"
              onClick={() => logoInputRef.current?.click()}
              iconLeading={<Upload01 className="h-4 w-4" />}
              size="sm"
            >
              Upload
            </Button>
          </div>
        )}
        <input
          ref={logoInputRef}
          type="file"
          accept="image/*"
          onChange={handleLogoUpload}
          className="hidden"
        />
      </div>

      {/* Brand Colors Section */}
      <div className="space-y-4">
        <label className="text-sm font-semibold text-slate-900">Brand Colors</label>
        <div className="flex items-start gap-4">
          {/* Color Swatch */}
          <div
            className="h-20 w-20 rounded-lg border-2 border-slate-300 flex-shrink-0 flex items-center justify-center"
            style={{ backgroundColor: primaryColor }}
          >
            <span className="text-white text-sm font-medium">{primaryColor}</span>
          </div>
          
          {/* Right side content */}
          <div className="flex-1 space-y-2">
            <div className="relative" ref={dropdownRef}>
              <label className="flex w-full flex-col gap-1">
                <span className="text-xs font-medium uppercase tracking-wide text-slate-500">Primary Color</span>
                <div className="relative">
                  <input
                    type="text"
                    value={primaryColor}
                    onChange={(e) => setPrimaryColor(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 pr-32 text-sm text-slate-700 shadow-sm transition placeholder:text-slate-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                    placeholder="#6366f1"
                  />
                  <Button
                    variant="primary"
                    onClick={() => setShowThemeDropdown(!showThemeDropdown)}
                    iconTrailing={<ChevronDown className={`h-4 w-4 transition-transform ${showThemeDropdown ? 'rotate-180' : ''}`} />}
                    className="absolute right-1 top-1/2 -translate-y-1/2 h-8"
                    size="sm"
                  >
                    Pick theme
                  </Button>
                </div>
              </label>
              
              {/* Theme Dropdown */}
              {showThemeDropdown && (
                <div className="absolute right-0 top-full mt-1 w-64 rounded-lg border border-slate-200 bg-white shadow-lg z-50 max-h-80 overflow-y-auto">
                  <div className="p-2">
                    {themeColors.map((color) => (
                      <button
                        key={color.hex}
                        type="button"
                        onClick={() => handleThemeSelect(color.hex)}
                        className="w-full flex items-center gap-3 px-3 py-2 rounded-md hover:bg-slate-50 transition-colors text-left"
                      >
                        <div
                          className="h-8 w-8 rounded border border-slate-300 flex-shrink-0"
                          style={{ backgroundColor: color.hex }}
                        />
                        <div className="flex-1">
                          <div className="text-sm font-medium text-slate-900">{color.name}</div>
                          <div className="text-xs text-slate-500">{color.hex}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <p className="text-xs text-slate-500">Used for links, buttons.</p>
          </div>
        </div>
      </div>

      {/* Typography Section */}
      <div className="space-y-6">
        <label className="text-sm font-semibold text-slate-900">Typography</label>
        
        {/* Heading Font */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-slate-700">Heading Font</label>
          <select
            value={headingFont}
            onChange={(e) => setHeadingFont(e.target.value)}
            className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
          >
            {fonts.map((font) => (
              <option key={font} value={font}>
                {font}
              </option>
            ))}
          </select>
          <p className="text-sm text-slate-600" style={{ fontFamily: headingFont }}>
            Brown fox jumped through the loop
          </p>
        </div>

        {/* Body Font */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-slate-700">Body Font</label>
          <select
            value={bodyFont}
            onChange={(e) => setBodyFont(e.target.value)}
            className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
          >
            {fonts.map((font) => (
              <option key={font} value={font}>
                {font}
              </option>
            ))}
          </select>
          <p className="text-sm text-slate-600" style={{ fontFamily: bodyFont }}>
            Brown fox jumped through the loop
          </p>
        </div>
      </div>
    </div>
  )
}

export default BrandingTab

