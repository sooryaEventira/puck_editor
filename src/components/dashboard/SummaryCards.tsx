import React from 'react'
import { Calendar, Activity, Edit03 } from '@untitled-ui/icons-react'

interface SummaryCardProps {
  title: string
  value: number
  icon: React.ReactNode
  iconBgColor: string
}

const SummaryCard: React.FC<SummaryCardProps> = ({ title, value, icon, iconBgColor }) => {
  return (
    <div className="w-full h-full bg-white inline-flex flex-col items-start justify-start p-5 rounded-xl border border-[#E9EAEB] gap-5 shadow-[0px_1px_2px_rgba(10,12.67,18,0.05)] transition-all duration-300 hover:shadow-[0px_4px_8px_rgba(10,12.67,18,0.1)]">
      {/* Icon and Label Row */}
      <div className="self-stretch inline-flex items-center justify-start gap-2">
        {/* Icon Container */}
        <div
          className="flex items-center justify-center overflow-hidden w-12 h-12 rounded-full"
          style={{
            background: iconBgColor
          }}
        >
          <div className="w-6 h-6">
            {icon}
          </div>
        </div>

        {/* Label */}
        <div className="flex-1 text-[#181D27] text-base font-semibold leading-6 break-words" style={{ fontFamily: 'Inter, sans-serif' }}>
          {title}
        </div>
      </div>

      {/* Number Section */}
      <div className="self-stretch inline-flex items-end justify-start gap-4">
        <div className="flex-1 flex flex-col items-start justify-start gap-3">
          <div className="self-stretch text-[#181D27] text-[30px] font-semibold leading-[38px] break-words" style={{ fontFamily: 'Inter, sans-serif' }}>
            {value}
          </div>
        </div>
      </div>
    </div>
  )
}

interface SummaryCardsProps {
  totalEvents?: number
  liveEvents?: number
  eventDrafts?: number
}

const SummaryCards: React.FC<SummaryCardsProps> = ({
  totalEvents = 15,
  liveEvents = 2,
  eventDrafts = 3
}) => {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      <SummaryCard
        title="Total Events"
        value={totalEvents}
        icon={<Calendar className="h-6 w-6 text-[#4A1FB8]" />}
        iconBgColor="#EBE9FE"
      />
      <SummaryCard
        title="Live Events"
        value={liveEvents}
        icon={<Activity className="h-6 w-6 text-[#0E9384]" />}
        iconBgColor="#EBE9FE"
      />
      <SummaryCard
        title="Event Drafts"
        value={eventDrafts}
        icon={<Edit03 className="h-6 w-6 text-[#C01048]" />}
        iconBgColor="#EBE9FE"
      />
    </div>
  )
}

export default SummaryCards

