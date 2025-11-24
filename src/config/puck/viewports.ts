/**
 * Viewport configurations for responsive design preview
 */

import breakpoints from '../breakpoints.json'

export const viewports = [
  { width: breakpoints.mobile, height: 'auto', label: `Mobile (${breakpoints.mobile}px)`, icon: '📱' },
  { width: breakpoints.tablet, height: 'auto', label: `Tablet (${breakpoints.tablet}px)`, icon: '📱' },
  { width: breakpoints.desktop, height: 'auto', label: `Desktop (${breakpoints.desktop}px)`, icon: '💻' },
  { width: breakpoints.wide, height: 'auto', label: `Large Desktop (${breakpoints.wide}px)`, icon: '🖥️' },
  { width: '100%', height: 'auto', label: 'Full Width', icon: '↔️' }
]

