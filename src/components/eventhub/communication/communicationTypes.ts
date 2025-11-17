export type CommunicationStatus = 'sent' | 'scheduled' | 'draft'
export type CommunicationType = 'email' | 'notification'

export interface UserGroup {
  id: string
  name: string
  variant?: 'primary' | 'secondary' | 'muted'
}

export interface Communication {
  id: string
  title: string
  userGroups: UserGroup[]
  status: CommunicationStatus
  type: CommunicationType
  recipients: {
    sent: number
    total: number
  }
  scheduledDate?: string // ISO date string for scheduled communications
}

