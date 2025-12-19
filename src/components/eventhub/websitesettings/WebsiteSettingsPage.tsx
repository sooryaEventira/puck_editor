import React from 'react'

interface WebsiteSettingsPageProps {
  hideNavbarAndSidebar?: boolean
}

const WebsiteSettingsPage: React.FC<WebsiteSettingsPageProps> = ({
  hideNavbarAndSidebar
}) => {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-slate-900 mb-4">Website Settings</h1>
      <p className="text-slate-500">Website settings page coming soon...</p>
    </div>
  )
}

export default WebsiteSettingsPage

