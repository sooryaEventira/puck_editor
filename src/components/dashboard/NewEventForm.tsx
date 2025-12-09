import React, { useState } from 'react'
import logoImage from '../../assets/images/Logo.png'
import { ProgressSteps } from '../ui/untitled'
import EventDetailsStep from './NewEventForm/EventDetailsStep'
import DesignStep from './NewEventForm/DesignStep'
import { useEventForm } from '../../contexts/EventFormContext'

interface NewEventFormProps {
  onClose: () => void
  onSubmit: (data: EventFormData) => void
}

export interface EventFormData {
  // Step 1 - Event Details
  eventName: string
  startDate: string
  endDate: string
  timezone: string
  fixTimezoneForAttendees: boolean
  location: string
  attendees: number
  eventExperience: 'in-person' | 'virtual' | 'hybrid' | ''
  
  // Step 2 - Design
  logo: File | null
  banner: File | null
}

// Total steps - update this as you add more steps
// Currently: Step 1 (Event Details), Step 2 (Design)
const TOTAL_STEPS = 2

const NewEventForm: React.FC<NewEventFormProps> = ({ onClose, onSubmit }) => {
  const { setEventData } = useEventForm()
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState<EventFormData>({
    eventName: '',
    startDate: '',
    endDate: '',
    timezone: '', // Will be auto-detected by TimezoneSelector component
    fixTimezoneForAttendees: true,
    location: '',
    attendees: 0,
    eventExperience: '',
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
        formData.endDate &&
        formData.timezone &&
        formData.location &&
        formData.attendees > 0
      ) {
        setCurrentStep(2)
      }
    } else if (currentStep === TOTAL_STEPS) {
      // Step 2 (Design) - Save data and navigate to template selection
      // Save to global context
      setEventData(formData)

      // Log form data to console
      console.log('Form Data for Backend:', formData)

      // Navigate to template selection page
      window.history.pushState({}, '', '/event/create/template')
      window.dispatchEvent(new PopStateEvent('popstate'))
    } else {
      // Intermediate steps - move to next step
      // Add validation here for future steps if needed
      setCurrentStep(currentStep + 1)
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
      formData.endDate &&
      formData.timezone &&
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
            Next
          </button>
        </div>
      </div>
    </div>
  )
}

export default NewEventForm

