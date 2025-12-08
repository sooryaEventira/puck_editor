import React from 'react'
import { DatePicker } from '../../ui/untitled'
import { Select, type SelectOption } from '../../ui/untitled'
import { SearchLg, X } from '@untitled-ui/icons-react'
import type { EventFormData } from '../NewEventForm'

interface EventDetailsStepProps {
  formData: EventFormData
  updateFormData: (updates: Partial<EventFormData>) => void
}

const timezoneOptions: SelectOption[] = [
  { value: 'UTC-12', label: 'UTC-12' },
  { value: 'UTC-11', label: 'UTC-11' },
  { value: 'UTC-10', label: 'UTC-10' },
  { value: 'UTC-9', label: 'UTC-9' },
  { value: 'UTC-8', label: 'UTC-8' },
  { value: 'UTC-7', label: 'UTC-7' },
  { value: 'UTC-6', label: 'UTC-6' },
  { value: 'UTC-5', label: 'UTC-5' },
  { value: 'UTC-4', label: 'UTC-4' },
  { value: 'UTC-3', label: 'UTC-3' },
  { value: 'UTC-2', label: 'UTC-2' },
  { value: 'UTC-1', label: 'UTC-1' },
  { value: 'UTC+0', label: 'UTC+0' },
  { value: 'UTC+1', label: 'UTC+1' },
  { value: 'UTC+2', label: 'UTC+2' },
  { value: 'UTC+3', label: 'UTC+3' },
  { value: 'UTC+4', label: 'UTC+4' },
  { value: 'UTC+5', label: 'UTC+5' },
  { value: 'UTC+6', label: 'UTC+6' },
  { value: 'UTC+7', label: 'UTC+7' },
  { value: 'UTC+8', label: 'UTC+8' },
  { value: 'UTC+9', label: 'UTC+9' },
  { value: 'UTC+10', label: 'UTC+10' },
  { value: 'UTC+11', label: 'UTC+11' },
  { value: 'UTC+12', label: 'UTC+12' }
]

const EventDetailsStep: React.FC<EventDetailsStepProps> = ({ formData, updateFormData }) => {
  return (
    <div className="space-y-4">
      {/* Event name */}
      <div className="flex flex-col gap-1">
        <label className="text-xs font-medium uppercase tracking-wide text-slate-500">
          Event name<span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={formData.eventName}
          onChange={(e) => updateFormData({ eventName: e.target.value })}
          placeholder="Highly important conference of 2025"
          className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
        />
      </div>

      {/* Start Date and Time */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium uppercase tracking-wide text-slate-500">
            Start date<span className="text-red-500">*</span>
          </label>
          <DatePicker
            id="start-date"
            value={formData.startDate}
            onChange={(value) => updateFormData({ startDate: value })}
            placeholder="Select date"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium uppercase tracking-wide text-slate-500">
            Start time<span className="text-red-500">*</span>
          </label>
          <input
            type="time"
            value={formData.startTime}
            onChange={(e) => updateFormData({ startTime: e.target.value })}
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium uppercase tracking-wide text-slate-500">
            Start timezone<span className="text-red-500">*</span>
          </label>
          <Select
            value={formData.startTimezone}
            onChange={(e) => updateFormData({ startTimezone: e.target.value })}
            options={timezoneOptions}
            className="w-full"
          />
        </div>
      </div>

      {/* End Date and Time */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium uppercase tracking-wide text-slate-500">
            End date<span className="text-red-500">*</span>
          </label>
          <DatePicker
            id="end-date"
            value={formData.endDate}
            onChange={(value) => updateFormData({ endDate: value })}
            placeholder="Select date"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium uppercase tracking-wide text-slate-500">
            End time<span className="text-red-500">*</span>
          </label>
          <input
            type="time"
            value={formData.endTime}
            onChange={(e) => updateFormData({ endTime: e.target.value })}
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium uppercase tracking-wide text-slate-500">
            End timezone<span className="text-red-500">*</span>
          </label>
          <Select
            value={formData.endTimezone}
            onChange={(e) => updateFormData({ endTimezone: e.target.value })}
            options={timezoneOptions}
            className="w-full"
          />
        </div>
      </div>

      {/* Fix timezone checkbox */}
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="fix-timezone"
          checked={formData.fixTimezoneForAttendees}
          onChange={(e) => updateFormData({ fixTimezoneForAttendees: e.target.checked })}
          className="w-4 h-4 rounded border-slate-300 text-primary focus:ring-2 focus:ring-primary/20"
        />
        <label htmlFor="fix-timezone" className="text-sm text-slate-700">
          Fix timezone for attendees
        </label>
      </div>

      {/* Location */}
      <div className="flex flex-col gap-1">
        <label className="text-xs font-medium uppercase tracking-wide text-slate-500">
          Location<span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <div className="absolute left-3 top-1/2 -translate-y-1/2">
            <SearchLg className="h-4 w-4 text-slate-400" />
          </div>
          <input
            type="text"
            value={formData.location}
            onChange={(e) => updateFormData({ location: e.target.value })}
            placeholder="New York, NY"
            className="w-full rounded-lg border border-slate-300 bg-white pl-10 pr-10 py-2 text-sm text-slate-700 shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
          {formData.location && (
            <button
              type="button"
              onClick={() => updateFormData({ location: '' })}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {/* Attendees */}
      <div className="flex flex-col gap-1">
        <label className="text-xs font-medium uppercase tracking-wide text-slate-500">
          Attendees<span className="text-red-500">*</span>
        </label>
        <input
          type="number"
          value={formData.attendees || ''}
          onChange={(e) => updateFormData({ attendees: parseInt(e.target.value) || 0 })}
          placeholder="120"
          min="0"
          className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
        />
      </div>

      {/* Event Experience */}
      <div className="flex flex-col gap-2">
        <label className="text-xs font-medium uppercase tracking-wide text-slate-500">
          Event experience
        </label>
        <div className="flex gap-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="eventExperience"
              value="in-person"
              checked={formData.eventExperience === 'in-person'}
              onChange={(e) => updateFormData({ eventExperience: e.target.value as 'in-person' })}
              className="w-4 h-4 text-primary focus:ring-2 focus:ring-primary/20"
            />
            <span className="text-sm text-slate-700">In-person</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="eventExperience"
              value="virtual"
              checked={formData.eventExperience === 'virtual'}
              onChange={(e) => updateFormData({ eventExperience: e.target.value as 'virtual' })}
              className="w-4 h-4 text-primary focus:ring-2 focus:ring-primary/20"
            />
            <span className="text-sm text-slate-700">Virtual</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="eventExperience"
              value="hybrid"
              checked={formData.eventExperience === 'hybrid'}
              onChange={(e) => updateFormData({ eventExperience: e.target.value as 'hybrid' })}
              className="w-4 h-4 text-primary focus:ring-2 focus:ring-primary/20"
            />
            <span className="text-sm text-slate-700">Hybrid</span>
          </label>
        </div>
      </div>
    </div>
  )
}

export default EventDetailsStep

