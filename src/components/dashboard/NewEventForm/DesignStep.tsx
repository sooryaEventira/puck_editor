import React from 'react'
import { Select, type SelectOption } from '../../ui/untitled'
import FileUpload from './FileUpload'
import type { EventFormData } from '../NewEventForm'

interface DesignStepProps {
  formData: EventFormData
  updateFormData: (updates: Partial<EventFormData>) => void
}

const colorSchemeOptions: SelectOption[] = [
  { value: '', label: 'Select color scheme' },
  { value: 'purple', label: 'Purple' },
  { value: 'blue', label: 'Blue' },
  { value: 'green', label: 'Green' },
  { value: 'red', label: 'Red' },
  { value: 'orange', label: 'Orange' }
]

const fontOptions: SelectOption[] = [
  { value: 'Inter', label: 'Inter' },
  { value: 'Roboto', label: 'Roboto' },
  { value: 'Open Sans', label: 'Open Sans' },
  { value: 'Lato', label: 'Lato' },
  { value: 'Montserrat', label: 'Montserrat' }
]

const DesignStep: React.FC<DesignStepProps> = ({ formData, updateFormData }) => {
  const fontFamily = formData.font || 'Inter'

  return (
    <div className="space-y-4">
      {/* Color Scheme */}
      <div className="flex flex-col gap-1">
        <label className="text-xs font-medium uppercase tracking-wide text-slate-500">
          Color scheme
        </label>
        <Select
          value={formData.colorScheme}
          onChange={(e) => updateFormData({ colorScheme: e.target.value })}
          options={colorSchemeOptions}
          className="w-full"
        />
      </div>

      {/* Font */}
      <div className="flex flex-col gap-1">
        <label className="text-xs font-medium uppercase tracking-wide text-slate-500">
          Font
        </label>
        <Select
          value={formData.font}
          onChange={(e) => updateFormData({ font: e.target.value })}
          options={fontOptions}
          className="w-full"
        />
        <div className="text-xs text-slate-500 mt-1" style={{ fontFamily }}>
          This is how the font will look like.
        </div>
      </div>

      {/* Logo Upload */}
      <FileUpload
        label="Logo"
        accept="image/*"
        maxSize="800×400px"
        value={formData.logo}
        onChange={(file) => updateFormData({ logo: file })}
        maxWidth="800"
        maxHeight="400"
      />

      {/* Banner Upload */}
      <FileUpload
        label="Banner"
        accept="image/*"
        maxSize="800×400px"
        value={formData.banner}
        onChange={(file) => updateFormData({ banner: file })}
        maxWidth="800"
        maxHeight="400"
      />
    </div>
  )
}

export default DesignStep

