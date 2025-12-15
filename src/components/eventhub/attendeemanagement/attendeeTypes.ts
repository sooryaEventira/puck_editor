export type AttendeeStatus = 'opened' | 'loggedin' | 'sent' | 'delivered' | 'active' | 'bounced'

export interface AttendeeGroup {
  id: string
  name: string
  variant?: 'primary' | 'info' | 'muted'
}

export interface Attendee {
  id: string
  name: string
  firstName?: string
  lastName?: string
  email: string
  avatarUrl?: string
  bannerUrl?: string
  status: AttendeeStatus
  inviteCode?: string
  groups: AttendeeGroup[]
  institute?: string
  post?: string
  emailVerified?: boolean
  emailVerifiedDate?: string
  feedbackIncomplete?: boolean
}

export interface Group {
  id: string
  name: string
  attendeeCount: number
}

export interface CustomField {
  id: string
  fieldName: string
  users: number
  fieldType: 'Text' | 'Dropdown' | 'PDF'
  visibility: 'Visible to attendees' | 'Invisible'
}

export type AttendeeTab = 'user' | 'groups' | 'custom-schedule'

export interface AttendeeTableRowData {
  attendee?: Attendee
  index: number
}

export interface GroupTableRowData {
  group?: Group
  index: number
}

export interface CustomFieldTableRowData {
  customField?: CustomField
  index: number
}

