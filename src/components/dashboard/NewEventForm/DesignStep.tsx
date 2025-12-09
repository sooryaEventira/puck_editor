import React from 'react'
import FileUpload from './FileUpload'
import type { EventFormData } from '../NewEventForm'

interface DesignStepProps {
  formData: EventFormData
  updateFormData: (updates: Partial<EventFormData>) => void
}

const DesignStep: React.FC<DesignStepProps> = ({ formData, updateFormData }) => {
  return (
    <div className="space-y-4">
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

