# Event Hub Components

This directory contains the Event Hub page components for the Event Management System.

## Components

### 1. EventHubNavbar
The top navigation bar with event name, draft badge, and action icons.

**Props:**
- `eventName` (optional): The name of the event (default: "Highly important conference of 2025")
- `isDraft` (optional): Whether to show the draft badge (default: true)
- `onBackClick` (optional): Callback when back arrow is clicked
- `onSearchClick` (optional): Callback when search icon is clicked
- `onNotificationClick` (optional): Callback when notification bell is clicked
- `onProfileClick` (optional): Callback when profile avatar is clicked
- `userAvatarUrl` (optional): URL for the user's avatar image

### 2. EventHubSidebar
The left sidebar with navigation links.

**Props:**
- `items` (optional): Array of sidebar items with `{ id, label, icon }`
- `activeItemId` (optional): ID of the currently active item (default: 'event-hub')
- `onItemClick` (optional): Callback when a sidebar item is clicked

### 3. EventHubContent
The main content area with title and information cards.

**Props:**
- `title` (optional): The main title (default: "Event Hub")
- `cards` (optional): Array of card objects with `{ id, title, items, icon }`

### 4. EventHubPage
The complete page that combines all three components.

**Props:**
- `eventName` (optional): Event name to display in navbar
- `isDraft` (optional): Whether to show draft badge
- `onBackClick` (optional): Callback for back button
- `userAvatarUrl` (optional): User avatar URL

## Usage

### Basic Usage (Complete Page)

```tsx
import { EventHubPage } from '@/components/eventhub'

function MyApp() {
  return (
    <EventHubPage
      eventName="My Conference 2025"
      isDraft={true}
      onBackClick={() => console.log('Going back')}
    />
  )
}
```

### Using Individual Components

```tsx
import { 
  EventHubNavbar, 
  EventHubSidebar, 
  EventHubContent 
} from '@/components/eventhub'

function CustomEventHub() {
  return (
    <div>
      <EventHubNavbar
        eventName="Custom Event"
        onBackClick={() => history.back()}
      />
      
      <EventHubSidebar
        activeItemId="event-hub"
        onItemClick={(id) => navigate(id)}
      />
      
      <EventHubContent title="Dashboard" />
    </div>
  )
}
```

### Custom Sidebar Items

```tsx
const customSidebarItems = [
  { id: 'dashboard', label: 'Dashboard', icon: '📊' },
  { id: 'attendees', label: 'Attendees', icon: '👥' },
  { id: 'schedule', label: 'Schedule', icon: '📅' },
  { id: 'settings', label: 'Settings', icon: '⚙️' }
]

<EventHubSidebar
  items={customSidebarItems}
  activeItemId="dashboard"
/>
```

### Custom Content Cards

```tsx
const customCards = [
  {
    id: 'card1',
    title: 'Registrations',
    icon: '📝',
    items: [
      { label: 'Total registrations', value: '342' },
      { label: 'This week', value: '45' }
    ]
  },
  {
    id: 'card2',
    title: 'Revenue',
    icon: '💰',
    items: [
      { label: 'Total revenue', value: '$12,450' },
      { label: 'Average per ticket', value: '$36.40' }
    ]
  }
]

<EventHubContent
  title="Analytics Dashboard"
  cards={customCards}
/>
```

## Integration with App.tsx

To add the Event Hub page to your main App, you can add a new view state:

```tsx
import { EventHubPage } from '@/components/eventhub'

function App() {
  const [currentView, setCurrentView] = useState<'editor' | 'events' | 'event-hub'>('editor')

  if (currentView === 'event-hub') {
    return (
      <EventHubPage
        eventName="My Conference"
        onBackClick={() => setCurrentView('events')}
      />
    )
  }

  // ... rest of your app
}
```

## Styling

All components use inline styles for maximum portability and don't require any additional CSS files. The color scheme matches the design:

- **Navbar**: Dark purple (#5b21b6) background with white text
- **Sidebar**: Light gray (#f3f4f6) background with purple accent (#a78bfa)
- **Content**: White background with light gray cards (#f9fafb)

## Features

✅ Fully responsive components
✅ Hover effects on interactive elements
✅ Fixed positioning for navbar and sidebar
✅ Smooth transitions and animations
✅ Accessible button controls
✅ Customizable content and styling
✅ TypeScript support with full type definitions

