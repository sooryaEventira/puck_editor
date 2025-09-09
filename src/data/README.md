# Page Data Directory

This directory contains the JSON data files exported from the Puck editor.

## Structure

```
src/data/
├── pages/           # Page data JSON files
│   ├── page-data-2025-01-08.json
│   └── ...
└── README.md        # This file
```

## Usage

### 1. Export from Puck Editor
- Click the "Publish" button in the Puck editor
- The JSON data will be downloaded and also logged to browser console
- Follow the instructions in the alert dialog

### 2. Save to Project Directory
You have several options:

#### Option A: Manual Save
1. Copy the JSON data from browser console
2. Create a new file in `src/data/pages/`
3. Paste the JSON data and save

#### Option B: Use the Helper Script
1. Copy the JSON data from browser console
2. Run: `node save-page-data.js "your-json-data-here"`
3. The file will be automatically saved to `src/data/pages/`

#### Option C: Direct Import
```javascript
// Import page data in your React components
import pageData from './data/pages/page-data-2025-01-08.json';

// Use the data
console.log(pageData.content); // Array of components
console.log(pageData.root);    // Root props
```

## File Format

Each JSON file contains:
- `content`: Array of page components with their props
- `root`: Root-level properties
- `meta`: Optional metadata (timestamp, etc.)

## Example Usage in React

```jsx
import React from 'react';
import pageData from './data/pages/page-data-2025-01-08.json';

function MyPage() {
  return (
    <div>
      {pageData.content.map((component, index) => (
        <div key={index}>
          {/* Render your components based on component.type and component.props */}
        </div>
      ))}
    </div>
  );
}
```
