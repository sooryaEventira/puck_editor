# Schedule JSON Format Example

## Complete JSON Structure for ScheduleContent (WeekDateSelector + ScheduleGrid with Child Sessions)

This JSON format includes:
- **WeekDateSelector**: For date navigation
- **ScheduleGrid**: For displaying sessions
- **Child/Parallel Sessions**: Sessions that belong to a parent session

## Example JSON Payload

```json
{
  "data": {
    "content": [
      {
        "type": "ScheduleContent",
        "props": {
          "scheduleName": "Conference Schedule 2025",
          "selectedDate": "2025-01-15T00:00:00.000Z",
          "sessions": [
            {
              "id": "session-001",
              "title": "Welcome & Opening Keynote",
              "startTime": "09:00",
              "startPeriod": "AM",
              "endTime": "10:00",
              "endPeriod": "AM",
              "location": "Main Hall",
              "sessionType": "keynote",
              "tags": ["welcome", "opening", "keynote"],
              "sections": [
                {
                  "id": "section-001",
                  "type": "text",
                  "title": "Description",
                  "description": "Opening keynote address by the conference chair"
                }
              ],
              "date": "2025-01-15T00:00:00.000Z",
              "parentId": null
            },
            {
              "id": "session-002",
              "title": "Poster Presentation Session",
              "startTime": "10:00",
              "startPeriod": "AM",
              "endTime": "11:30",
              "endPeriod": "AM",
              "location": "Exhibition Hall",
              "sessionType": "workshop",
              "tags": ["poster", "presentation"],
              "sections": [
                {
                  "id": "section-002",
                  "type": "text",
                  "title": "Description",
                  "description": "Poster presentations from various research groups"
                }
              ],
              "date": "2025-01-15T00:00:00.000Z",
              "parentId": null
            },
            {
              "id": "session-003",
              "title": "Parallel Session A - AI & Machine Learning",
              "startTime": "10:00",
              "startPeriod": "AM",
              "endTime": "11:30",
              "endPeriod": "AM",
              "location": "Room A",
              "sessionType": "keynote",
              "tags": ["ai", "ml", "parallel"],
              "sections": [
                {
                  "id": "section-003",
                  "type": "text",
                  "title": "Description",
                  "description": "Deep dive into AI and Machine Learning trends"
                }
              ],
              "date": "2025-01-15T00:00:00.000Z",
              "parentId": "session-002"
            },
            {
              "id": "session-004",
              "title": "Parallel Session B - Data Science Workshop",
              "startTime": "10:00",
              "startPeriod": "AM",
              "endTime": "11:30",
              "endPeriod": "AM",
              "location": "Room B",
              "sessionType": "workshop",
              "tags": ["data-science", "workshop", "parallel"],
              "sections": [
                {
                  "id": "section-004",
                  "type": "text",
                  "title": "Description",
                  "description": "Hands-on workshop on data science techniques"
                }
              ],
              "date": "2025-01-15T00:00:00.000Z",
              "parentId": "session-002"
            },
            {
              "id": "session-005",
              "title": "Lunch Break",
              "startTime": "12:00",
              "startPeriod": "PM",
              "endTime": "01:00",
              "endPeriod": "PM",
              "location": "Cafeteria",
              "sessionType": "workshop",
              "tags": ["break", "lunch"],
              "sections": [
                {
                  "id": "section-005",
                  "type": "text",
                  "title": "Description",
                  "description": "Networking lunch for all attendees"
                }
              ],
              "date": "2025-01-15T00:00:00.000Z",
              "parentId": null
            },
            {
              "id": "session-006",
              "title": "Panel Discussion: Future of Technology",
              "startTime": "02:00",
              "startPeriod": "PM",
              "endTime": "03:30",
              "endPeriod": "PM",
              "location": "Main Hall",
              "sessionType": "keynote",
              "tags": ["panel", "discussion", "technology"],
              "sections": [
                {
                  "id": "section-006",
                  "type": "text",
                  "title": "Description",
                  "description": "Expert panel discussing emerging technologies"
                }
              ],
              "date": "2025-01-15T00:00:00.000Z",
              "parentId": null
            },
            {
              "id": "session-007",
              "title": "Parallel Session C - Cloud Computing",
              "startTime": "02:00",
              "startPeriod": "PM",
              "endTime": "03:30",
              "endPeriod": "PM",
              "location": "Room C",
              "sessionType": "keynote",
              "tags": ["cloud", "computing", "parallel"],
              "sections": [
                {
                  "id": "section-007",
                  "type": "text",
                  "title": "Description",
                  "description": "Exploring cloud computing architectures"
                }
              ],
              "date": "2025-01-15T00:00:00.000Z",
              "parentId": "session-006"
            },
            {
              "id": "session-008",
              "title": "Parallel Session D - Cybersecurity",
              "startTime": "02:00",
              "startPeriod": "PM",
              "endTime": "03:30",
              "endPeriod": "PM",
              "location": "Room D",
              "sessionType": "workshop",
              "tags": ["cybersecurity", "parallel"],
              "sections": [
                {
                  "id": "section-008",
                  "type": "text",
                  "title": "Description",
                  "description": "Best practices in cybersecurity"
                }
              ],
              "date": "2025-01-15T00:00:00.000Z",
              "parentId": "session-006"
            }
          ]
        },
        "id": "schedule-content-schedule-1234567890"
      }
    ],
    "root": {
      "props": {
        "title": "Conference Schedule 2025",
        "pageTitle": "Conference Schedule 2025",
        "pageType": "schedule"
      }
    },
    "zones": {}
  },
  "filename": "schedule-schedule-1234567890.json"
}
```

## Key Points:

### 1. **Parent Sessions** (No `parentId`):
- `session-001`: Welcome & Opening Keynote
- `session-002`: Poster Presentation Session (has children)
- `session-005`: Lunch Break
- `session-006`: Panel Discussion (has children)

### 2. **Child/Parallel Sessions** (Has `parentId`):
- `session-003`: Parallel Session A (child of `session-002`)
- `session-004`: Parallel Session B (child of `session-002`)
- `session-007`: Parallel Session C (child of `session-006`)
- `session-008`: Parallel Session D (child of `session-006`)

### 3. **Date Format**:
- All dates are in ISO 8601 format: `"2025-01-15T00:00:00.000Z"`
- `selectedDate` determines which week is shown in WeekDateSelector

### 4. **Time Format**:
- `startTime` and `endTime`: 24-hour format as strings: `"09:00"`, `"10:00"`
- `startPeriod` and `endPeriod`: `"AM"` or `"PM"`

### 5. **Session Structure**:
```json
{
  "id": "unique-session-id",
  "title": "Session Title",
  "startTime": "09:00",
  "startPeriod": "AM",
  "endTime": "10:00",
  "endPeriod": "AM",
  "location": "Room Name",
  "sessionType": "keynote" | "workshop",
  "tags": ["tag1", "tag2"],
  "sections": [
    {
      "id": "section-id",
      "type": "text",
      "title": "Section Title",
      "description": "Section content"
    }
  ],
  "date": "ISO-date-string",
  "parentId": "parent-session-id" | null
}
```

## How ScheduleGrid Renders This:

1. **WeekDateSelector** shows the week containing `selectedDate`
2. **ScheduleGrid** groups sessions by time:
   - Sessions with the same start time are grouped together
   - Parent sessions are shown first
   - Child sessions (with `parentId`) are nested under their parent
   - Child sessions can be expanded/collapsed

## Visual Structure:

```
09:00 AM - 10:00 AM
  └─ Welcome & Opening Keynote (Main Hall)

10:00 AM - 11:30 AM
  ├─ Poster Presentation Session (Exhibition Hall) [Expandable]
  │   ├─ Parallel Session A - AI & ML (Room A) [Child]
  │   └─ Parallel Session B - Data Science (Room B) [Child]
  
12:00 PM - 01:00 PM
  └─ Lunch Break (Cafeteria)

02:00 PM - 03:30 PM
  ├─ Panel Discussion (Main Hall) [Expandable]
  │   ├─ Parallel Session C - Cloud Computing (Room C) [Child]
  │   └─ Parallel Session D - Cybersecurity (Room D) [Child]
```

## Usage in Code:

```typescript
import { convertScheduleToPuckFormat } from '../utils/scheduleToPuck'

const schedule = {
  id: 'schedule-1234567890',
  name: 'Conference Schedule 2025',
  sessions: [
    // ... sessions array as shown above
  ]
}

const selectedDate = new Date('2025-01-15')
const puckData = convertScheduleToPuckFormat(schedule, selectedDate)

// Send to backend
fetch('/api/save-page', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    data: puckData,
    filename: 'schedule-schedule-1234567890.json'
  })
})
```

