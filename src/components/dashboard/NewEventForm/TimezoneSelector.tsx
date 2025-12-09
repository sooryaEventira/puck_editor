import React, { useState, useRef, useEffect } from 'react'
import { SearchLg, X, ChevronDown } from '@untitled-ui/icons-react'

export interface TimezoneOption {
  value: string // IANA timezone identifier (e.g., "America/New_York")
  label: string // Display label with city, country, and offset (e.g., "New York, NY, USA (GMT-5)")
  city: string
  country: string
  offset: string // Formatted offset (e.g., "GMT-5" or "GMT+2")
  searchTerms: string[] // Terms for searching (city, country, common timezone names)
}

interface TimezoneSelectorProps {
  value: string
  onChange: (timezone: string) => void
  className?: string
}

// Comprehensive timezone list organized alphabetically by city
// Includes major cities with their IANA identifiers, countries, and offsets
const TIMEZONES: TimezoneOption[] = [
  // Americas
  { value: 'America/New_York', label: 'New York, NY, USA (GMT-5)', city: 'New York', country: 'USA', offset: 'GMT-5', searchTerms: ['New York', 'NYC', 'Eastern Time', 'ET', 'EST', 'EDT', 'America', 'United States', 'USA'] },
  { value: 'America/Chicago', label: 'Chicago, IL, USA (GMT-6)', city: 'Chicago', country: 'USA', offset: 'GMT-6', searchTerms: ['Chicago', 'Central Time', 'CT', 'CST', 'CDT'] },
  { value: 'America/Denver', label: 'Denver, CO, USA (GMT-7)', city: 'Denver', country: 'USA', offset: 'GMT-7', searchTerms: ['Denver', 'Mountain Time', 'MT', 'MST', 'MDT'] },
  { value: 'America/Los_Angeles', label: 'Los Angeles, CA, USA (GMT-8)', city: 'Los Angeles', country: 'USA', offset: 'GMT-8', searchTerms: ['Los Angeles', 'LA', 'Pacific Time', 'PT', 'PST', 'PDT', 'California'] },
  { value: 'America/Phoenix', label: 'Phoenix, AZ, USA (GMT-7)', city: 'Phoenix', country: 'USA', offset: 'GMT-7', searchTerms: ['Phoenix', 'Arizona', 'Mountain Standard Time'] },
  { value: 'America/Toronto', label: 'Toronto, ON, Canada (GMT-5)', city: 'Toronto', country: 'Canada', offset: 'GMT-5', searchTerms: ['Toronto', 'Canada', 'Eastern Time'] },
  { value: 'America/Vancouver', label: 'Vancouver, BC, Canada (GMT-8)', city: 'Vancouver', country: 'Canada', offset: 'GMT-8', searchTerms: ['Vancouver', 'Canada', 'Pacific Time'] },
  { value: 'America/Mexico_City', label: 'Mexico City, Mexico (GMT-6)', city: 'Mexico City', country: 'Mexico', offset: 'GMT-6', searchTerms: ['Mexico City', 'Mexico', 'Central Time'] },
  { value: 'America/Sao_Paulo', label: 'São Paulo, Brazil (GMT-3)', city: 'São Paulo', country: 'Brazil', offset: 'GMT-3', searchTerms: ['São Paulo', 'Sao Paulo', 'Brazil', 'Brasilia Time'] },
  { value: 'America/Buenos_Aires', label: 'Buenos Aires, Argentina (GMT-3)', city: 'Buenos Aires', country: 'Argentina', offset: 'GMT-3', searchTerms: ['Buenos Aires', 'Argentina'] },
  { value: 'America/Lima', label: 'Lima, Peru (GMT-5)', city: 'Lima', country: 'Peru', offset: 'GMT-5', searchTerms: ['Lima', 'Peru'] },
  
  // Europe
  { value: 'Europe/London', label: 'London, UK (GMT+0)', city: 'London', country: 'UK', offset: 'GMT+0', searchTerms: ['London', 'UK', 'United Kingdom', 'GMT', 'Greenwich', 'British Time'] },
  { value: 'Europe/Paris', label: 'Paris, France (GMT+1)', city: 'Paris', country: 'France', offset: 'GMT+1', searchTerms: ['Paris', 'France', 'Central European Time', 'CET', 'CEST'] },
  { value: 'Europe/Berlin', label: 'Berlin, Germany (GMT+1)', city: 'Berlin', country: 'Germany', offset: 'GMT+1', searchTerms: ['Berlin', 'Germany', 'Central European Time', 'CET', 'CEST'] },
  { value: 'Europe/Rome', label: 'Rome, Italy (GMT+1)', city: 'Rome', country: 'Italy', offset: 'GMT+1', searchTerms: ['Rome', 'Italy', 'Central European Time'] },
  { value: 'Europe/Madrid', label: 'Madrid, Spain (GMT+1)', city: 'Madrid', country: 'Spain', offset: 'GMT+1', searchTerms: ['Madrid', 'Spain', 'Central European Time'] },
  { value: 'Europe/Amsterdam', label: 'Amsterdam, Netherlands (GMT+1)', city: 'Amsterdam', country: 'Netherlands', offset: 'GMT+1', searchTerms: ['Amsterdam', 'Netherlands', 'Holland', 'Central European Time'] },
  { value: 'Europe/Brussels', label: 'Brussels, Belgium (GMT+1)', city: 'Brussels', country: 'Belgium', offset: 'GMT+1', searchTerms: ['Brussels', 'Belgium', 'Central European Time'] },
  { value: 'Europe/Stockholm', label: 'Stockholm, Sweden (GMT+1)', city: 'Stockholm', country: 'Sweden', offset: 'GMT+1', searchTerms: ['Stockholm', 'Sweden', 'Central European Time'] },
  { value: 'Europe/Zurich', label: 'Zurich, Switzerland (GMT+1)', city: 'Zurich', country: 'Switzerland', offset: 'GMT+1', searchTerms: ['Zurich', 'Switzerland', 'Central European Time'] },
  { value: 'Europe/Vienna', label: 'Vienna, Austria (GMT+1)', city: 'Vienna', country: 'Austria', offset: 'GMT+1', searchTerms: ['Vienna', 'Austria', 'Central European Time'] },
  { value: 'Europe/Warsaw', label: 'Warsaw, Poland (GMT+1)', city: 'Warsaw', country: 'Poland', offset: 'GMT+1', searchTerms: ['Warsaw', 'Poland', 'Central European Time'] },
  { value: 'Europe/Athens', label: 'Athens, Greece (GMT+2)', city: 'Athens', country: 'Greece', offset: 'GMT+2', searchTerms: ['Athens', 'Greece', 'Eastern European Time', 'EET'] },
  { value: 'Europe/Helsinki', label: 'Helsinki, Finland (GMT+2)', city: 'Helsinki', country: 'Finland', offset: 'GMT+2', searchTerms: ['Helsinki', 'Finland', 'Eastern European Time'] },
  { value: 'Europe/Dublin', label: 'Dublin, Ireland (GMT+0)', city: 'Dublin', country: 'Ireland', offset: 'GMT+0', searchTerms: ['Dublin', 'Ireland', 'GMT'] },
  { value: 'Europe/Lisbon', label: 'Lisbon, Portugal (GMT+0)', city: 'Lisbon', country: 'Portugal', offset: 'GMT+0', searchTerms: ['Lisbon', 'Portugal', 'GMT'] },
  { value: 'Europe/Moscow', label: 'Moscow, Russia (GMT+3)', city: 'Moscow', country: 'Russia', offset: 'GMT+3', searchTerms: ['Moscow', 'Russia', 'Moscow Time'] },
  
  // Asia
  { value: 'Asia/Dubai', label: 'Dubai, UAE (GMT+4)', city: 'Dubai', country: 'UAE', offset: 'GMT+4', searchTerms: ['Dubai', 'UAE', 'United Arab Emirates', 'Gulf Time'] },
  { value: 'Asia/Kolkata', label: 'Mumbai, India (GMT+5:30)', city: 'Mumbai', country: 'India', offset: 'GMT+5:30', searchTerms: ['Mumbai', 'Bombay', 'India', 'IST', 'Indian Standard Time', 'Delhi', 'Bangalore', 'Kolkata', 'Calcutta'] },
  { value: 'Asia/Bangkok', label: 'Bangkok, Thailand (GMT+7)', city: 'Bangkok', country: 'Thailand', offset: 'GMT+7', searchTerms: ['Bangkok', 'Thailand'] },
  { value: 'Asia/Singapore', label: 'Singapore (GMT+8)', city: 'Singapore', country: 'Singapore', offset: 'GMT+8', searchTerms: ['Singapore', 'SGT'] },
  { value: 'Asia/Hong_Kong', label: 'Hong Kong (GMT+8)', city: 'Hong Kong', country: 'Hong Kong', offset: 'GMT+8', searchTerms: ['Hong Kong', 'HKT'] },
  { value: 'Asia/Shanghai', label: 'Shanghai, China (GMT+8)', city: 'Shanghai', country: 'China', offset: 'GMT+8', searchTerms: ['Shanghai', 'China', 'Beijing', 'CST', 'China Standard Time'] },
  { value: 'Asia/Tokyo', label: 'Tokyo, Japan (GMT+9)', city: 'Tokyo', country: 'Japan', offset: 'GMT+9', searchTerms: ['Tokyo', 'Japan', 'JST', 'Japan Standard Time'] },
  { value: 'Asia/Seoul', label: 'Seoul, South Korea (GMT+9)', city: 'Seoul', country: 'South Korea', offset: 'GMT+9', searchTerms: ['Seoul', 'Korea', 'KST', 'Korean Standard Time'] },
  
  // Oceania
  { value: 'Australia/Sydney', label: 'Sydney, Australia (GMT+10)', city: 'Sydney', country: 'Australia', offset: 'GMT+10', searchTerms: ['Sydney', 'Australia', 'AEST', 'AEDT', 'Australian Eastern Time'] },
  { value: 'Australia/Melbourne', label: 'Melbourne, Australia (GMT+10)', city: 'Melbourne', country: 'Australia', offset: 'GMT+10', searchTerms: ['Melbourne', 'Australia', 'AEST', 'AEDT'] },
  { value: 'Australia/Brisbane', label: 'Brisbane, Australia (GMT+10)', city: 'Brisbane', country: 'Australia', offset: 'GMT+10', searchTerms: ['Brisbane', 'Australia', 'AEST'] },
  { value: 'Australia/Perth', label: 'Perth, Australia (GMT+8)', city: 'Perth', country: 'Australia', offset: 'GMT+8', searchTerms: ['Perth', 'Australia', 'AWST'] },
  { value: 'Pacific/Auckland', label: 'Auckland, New Zealand (GMT+12)', city: 'Auckland', country: 'New Zealand', offset: 'GMT+12', searchTerms: ['Auckland', 'New Zealand', 'NZST', 'NZDT'] },
  
  // Africa
  { value: 'Africa/Johannesburg', label: 'Johannesburg, South Africa (GMT+2)', city: 'Johannesburg', country: 'South Africa', offset: 'GMT+2', searchTerms: ['Johannesburg', 'South Africa', 'SAST'] },
  { value: 'Africa/Cairo', label: 'Cairo, Egypt (GMT+2)', city: 'Cairo', country: 'Egypt', offset: 'GMT+2', searchTerms: ['Cairo', 'Egypt', 'Eastern European Time'] },
  { value: 'Africa/Lagos', label: 'Lagos, Nigeria (GMT+1)', city: 'Lagos', country: 'Nigeria', offset: 'GMT+1', searchTerms: ['Lagos', 'Nigeria', 'West Africa Time', 'WAT'] },
]

// Helper function to get current offset for a timezone
const getCurrentOffset = (ianaTimezone: string): string => {
  try {
    const now = new Date()
    
    // Create two formatters - one for UTC and one for the timezone
    const utcFormatter = new Intl.DateTimeFormat('en-US', {
      timeZone: 'UTC',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    })
    
    const tzFormatter = new Intl.DateTimeFormat('en-US', {
      timeZone: ianaTimezone,
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    })
    
    // Get what time it is in both timezones for the same moment
    const utcParts = utcFormatter.formatToParts(now)
    const tzParts = tzFormatter.formatToParts(now)
    
    const utcHour = parseInt(utcParts.find(p => p.type === 'hour')?.value || '0', 10)
    const utcMin = parseInt(utcParts.find(p => p.type === 'minute')?.value || '0', 10)
    const tzHour = parseInt(tzParts.find(p => p.type === 'hour')?.value || '0', 10)
    const tzMin = parseInt(tzParts.find(p => p.type === 'minute')?.value || '0', 10)
    
    // Calculate offset in minutes
    const utcMinutes = utcHour * 60 + utcMin
    const tzMinutes = tzHour * 60 + tzMin
    const offsetMinutes = utcMinutes - tzMinutes
    
    // Handle day boundary cases
    let adjustedOffsetMinutes = offsetMinutes
    if (Math.abs(offsetMinutes) > 720) { // More than 12 hours difference, likely crossed day boundary
      adjustedOffsetMinutes = offsetMinutes > 0 ? offsetMinutes - 1440 : offsetMinutes + 1440
    }
    
    const offsetHours = Math.floor(Math.abs(adjustedOffsetMinutes) / 60)
    const offsetMinutesRemainder = Math.abs(adjustedOffsetMinutes) % 60
    const sign = adjustedOffsetMinutes >= 0 ? '+' : '-'
    
    if (offsetMinutesRemainder === 0) {
      return `GMT${sign}${offsetHours}`
    } else {
      return `GMT${sign}${offsetHours}:${offsetMinutesRemainder.toString().padStart(2, '0')}`
    }
  } catch {
    // Fallback to stored offset
    return TIMEZONES.find(tz => tz.value === ianaTimezone)?.offset || 'GMT+0'
  }
}

// Auto-detect user's timezone
const detectTimezone = (): string | null => {
  try {
    const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone
    return userTimezone
  } catch {
    return null
  }
}

const TimezoneSelector: React.FC<TimezoneSelectorProps> = ({ value, onChange, className = '' }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [detectedTimezone, setDetectedTimezone] = useState<string | null>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Detect user's timezone on mount
  useEffect(() => {
    const detected = detectTimezone()
    setDetectedTimezone(detected)
    // Auto-select detected timezone if no value is set
    if (!value && detected) {
      onChange(detected)
    }
  }, [])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
        setSearchQuery('')
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      // Focus search input when dropdown opens
      setTimeout(() => inputRef.current?.focus(), 0)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  // Filter timezones based on search query
  const filteredTimezones = TIMEZONES.filter(timezone => {
    if (!searchQuery.trim()) return true
    
    const query = searchQuery.toLowerCase()
    return (
      timezone.city.toLowerCase().includes(query) ||
      timezone.country.toLowerCase().includes(query) ||
      timezone.offset.toLowerCase().includes(query) ||
      timezone.searchTerms.some(term => term.toLowerCase().includes(query))
    )
  })

  // Get selected timezone display label
  const selectedTimezone = TIMEZONES.find(tz => tz.value === value)
  const displayValue = selectedTimezone 
    ? `${selectedTimezone.city}, ${selectedTimezone.country} (${getCurrentOffset(value)})`
    : value || 'Select timezone'

  const handleSelect = (timezone: string) => {
    onChange(timezone)
    setIsOpen(false)
    setSearchQuery('')
  }

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {/* Selected value display / trigger */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full appearance-none rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-700 shadow-sm transition placeholder:text-slate-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 flex items-center justify-between"
      >
        <span className={value ? 'text-slate-700' : 'text-slate-400'}>
          {displayValue}
        </span>
        <ChevronDown className={`h-4 w-4 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-slate-200 rounded-lg shadow-lg max-h-80 overflow-hidden flex flex-col">
          {/* Search input */}
          <div className="p-2 border-b border-slate-200">
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2">
                <SearchLg className="h-4 w-4 text-slate-400" />
              </div>
              <input
                ref={inputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by city, country, or timezone..."
                className="w-full pl-10 pr-8 py-2 text-sm border border-slate-300 rounded-md focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>

          {/* Detected timezone hint */}
          {detectedTimezone && detectedTimezone !== value && (
            <div className="px-4 py-2 text-xs text-slate-500 bg-slate-50 border-b border-slate-200">
              Your timezone: {TIMEZONES.find(tz => tz.value === detectedTimezone)?.label || detectedTimezone}
            </div>
          )}

          {/* Timezone list */}
          <div className="overflow-y-auto max-h-64">
            {filteredTimezones.length === 0 ? (
              <div className="px-4 py-3 text-sm text-slate-500 text-center">
                No timezones found
              </div>
            ) : (
              filteredTimezones.map((timezone) => {
                const currentOffset = getCurrentOffset(timezone.value)
                const isSelected = timezone.value === value
                const isDetected = timezone.value === detectedTimezone
                
                return (
                  <button
                    key={timezone.value}
                    type="button"
                    onClick={() => handleSelect(timezone.value)}
                    className={`w-full text-left px-4 py-2.5 text-sm hover:bg-slate-50 transition-colors ${
                      isSelected ? 'bg-primary/10 text-primary font-medium' : 'text-slate-700'
                    } ${isDetected && !isSelected ? 'bg-slate-50' : ''}`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">{timezone.city}, {timezone.country}</div>
                        <div className="text-xs text-slate-500 mt-0.5">
                          {currentOffset} {isDetected && <span className="text-primary">• Detected</span>}
                        </div>
                      </div>
                      {isSelected && (
                        <div className="ml-2 text-primary">
                          <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                      )}
                    </div>
                  </button>
                )
              })
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default TimezoneSelector

