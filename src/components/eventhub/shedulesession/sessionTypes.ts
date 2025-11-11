export interface SessionSection {
  id: string
  /**
   * Machine readable section type derived from SectionOption.id
   */
  type: string
  /**
   * Human readable section title shown in the UI.
   */
  title: string
  /**
   * Optional description/content for sections such as text blocks.
   */
  description?: string
}

export interface SectionOption {
  id: string
  label: string
}

export interface SessionDraft {
  title: string
  startTime: string
  startPeriod: 'AM' | 'PM'
  endTime: string
  endPeriod: 'AM' | 'PM'
  location: string
  sessionType: string
  tags: string[]
  sections: SessionSection[]
}

export interface SavedSchedule {
  id: string
  name: string
  session: SessionDraft
}
