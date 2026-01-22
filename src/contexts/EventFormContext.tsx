import React, { createContext, useContext, useState, ReactNode } from 'react'
import { EventFormData } from '../components/dashboard/NewEventForm'
import { CreateEventResponseData } from '../services/eventService'

interface EventFormContextType {
  eventData: EventFormData | null
  setEventData: (data: EventFormData) => void
  clearEventData: () => void
  createdEvent: CreateEventResponseData | null
  setCreatedEvent: (event: CreateEventResponseData) => void
  clearCreatedEvent: () => void
}

const EventFormContext = createContext<EventFormContextType | undefined>(undefined)

export const EventFormProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [eventData, setEventDataState] = useState<EventFormData | null>(() => {
    // Load from localStorage on mount
    const stored = localStorage.getItem('event-form-data')
    if (stored) {
      try {
        const parsed = JSON.parse(stored)
        // Convert File objects back (they won't be preserved, but we handle it)
        return parsed
      } catch {
        return null
      }
    }
    return null
  })

  const [createdEvent, setCreatedEventState] = useState<CreateEventResponseData | null>(() => {
    // Load created event from localStorage on mount
    const stored = localStorage.getItem('created-event')
    if (stored) {
      try {
        return JSON.parse(stored)
      } catch {
        return null
      }
    }
    return null
  })

  const setEventData = (data: EventFormData) => {
    setEventDataState(data)
    // Store in localStorage (files won't be serialized, handle separately)
    const dataToStore = {
      ...data,
      logo: data.logo ? 'file://logo' : null,
      banner: data.banner ? 'file://banner' : null,
    }
    localStorage.setItem('event-form-data', JSON.stringify(dataToStore))
    // Store files separately
    if (data.logo) {
      const reader = new FileReader()
      reader.onload = () => {
        localStorage.setItem('event-form-logo', reader.result as string)
      }
      reader.readAsDataURL(data.logo)
    }
    if (data.banner) {
      const reader = new FileReader()
      reader.onload = () => {
        localStorage.setItem('event-form-banner', reader.result as string)
      }
      reader.readAsDataURL(data.banner)
    }
  }

  const clearEventData = () => {
    setEventDataState(null)
    localStorage.removeItem('event-form-data')
    localStorage.removeItem('event-form-logo')
    localStorage.removeItem('event-form-banner')
  }

  const setCreatedEvent = (event: CreateEventResponseData) => {
    // Update state first
    setCreatedEventState(event)
    
    // Then update localStorage synchronously to ensure consistency
    try {
      localStorage.setItem('created-event', JSON.stringify(event))
      // Also store the UUID separately for easy access
      localStorage.setItem('currentEventUuid', event.uuid)
    } catch (error) {
      // Error writing to localStorage
    }
  }

  const clearCreatedEvent = () => {
    setCreatedEventState(null)
    localStorage.removeItem('created-event')
    localStorage.removeItem('currentEventUuid')
  }

  return (
    <EventFormContext.Provider value={{ 
      eventData, 
      setEventData, 
      clearEventData,
      createdEvent,
      setCreatedEvent,
      clearCreatedEvent
    }}>
      {children}
    </EventFormContext.Provider>
  )
}

export const useEventForm = () => {
  const context = useContext(EventFormContext)
  if (context === undefined) {
    throw new Error('useEventForm must be used within an EventFormProvider')
  }
  return context
}
