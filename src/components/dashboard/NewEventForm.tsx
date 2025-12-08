import React, { useState } from 'react'
import logoImage from '../../assets/images/Logo.png'
import { ProgressSteps, type ProgressStep } from '../ui/untitled'
import EventDetailsStep from './NewEventForm/EventDetailsStep'
import DesignStep from './NewEventForm/DesignStep'

interface NewEventFormProps {
  onClose: () => void
  onSubmit: (data: EventFormData) => void
}

export interface EventFormData {
  // Step 1 - Event Details
  eventName: string
  startDate: string
  startTime: string
  startTimezone: string
  endDate: string
  endTime: string
  endTimezone: string
  fixTimezoneForAttendees: boolean
  location: string
  attendees: number
  eventExperience: 'in-person' | 'virtual' | 'hybrid'
  
  // Step 2 - Design
  colorScheme: string
  font: string
  logo: File | null
  banner: File | null
}

const NewEventForm: React.FC<NewEventFormProps> = ({ onClose, onSubmit }) => {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState<EventFormData>({
    eventName: '',
    startDate: '',
    startTime: '',
    startTimezone: 'UTC-5',
    endDate: '',
    endTime: '',
    endTimezone: 'UTC-5',
    fixTimezoneForAttendees: true,
    location: '',
    attendees: 0,
    eventExperience: 'in-person',
    colorScheme: '',
    font: 'Inter',
    logo: null,
    banner: null
  })

  const updateFormData = (updates: Partial<EventFormData>) => {
    setFormData(prev => ({ ...prev, ...updates }))
  }

  const handleNext = () => {
    if (currentStep === 1) {
      // Validate step 1
      if (
        formData.eventName &&
        formData.startDate &&
        formData.startTime &&
        formData.endDate &&
        formData.endTime &&
        formData.location &&
        formData.attendees > 0
      ) {
        setCurrentStep(2)
      }
    } else if (currentStep === 2) {
      // Submit form
      onSubmit(formData)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const isStep1Valid = () => {
    return !!(
      formData.eventName &&
      formData.startDate &&
      formData.startTime &&
      formData.endDate &&
      formData.endTime &&
      formData.location &&
      formData.attendees > 0
    )
  }

  return (
    <div className="min-h-screen w-full bg-white flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Header with Logo */}
        <div className="flex justify-center pt-6 pb-4">
          <img src={logoImage} alt="Logo" className="h-12 w-12 object-contain" />
        </div>
        
        {/* Title */}
        <div className="text-center mb-6">
          {currentStep === 1 ? (
            <h1 className="text-2xl font-semibold text-slate-900">Set up your event details.</h1>
          ) : (
            <h1 className="text-2xl font-semibold text-slate-900">Customize your design.</h1>
          )}
        </div>

        {/* Step Indicator */}
        <div className="px-6 mb-6">
          <ProgressSteps
            steps={[
              { title: 'Event details', description: 'Name and email' },
              { title: 'Design', description: 'Font and colours' }
            ]}
            currentStep={currentStep}
          />
        </div>

        {/* Form Content */}
        <div className="px-6 pb-6">
          {currentStep === 1 ? (
            <EventDetailsStep
              formData={formData}
              updateFormData={updateFormData}
            />
          ) : (
            <DesignStep
              formData={formData}
              updateFormData={updateFormData}
            />
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="px-6 py-4 border-t border-slate-200 flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={currentStep === 1 ? onClose : handlePrevious}
            className="px-4 py-2 rounded-lg text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
          >
            {currentStep === 1 ? 'Cancel' : 'Previous'}
          </button>
          <button
            type="button"
            onClick={handleNext}
            disabled={currentStep === 1 && !isStep1Valid()}
            className="px-4 py-2 rounded-lg text-sm font-semibold text-white bg-[#6938EF] hover:bg-[#5925DC] transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-[#6938EF]"
          >
            {currentStep === 2 ? 'Submit' : 'Next'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default NewEventForm

