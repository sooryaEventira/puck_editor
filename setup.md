# 🚀 Puck Editor with Direct File Saving

This setup allows you to save Puck editor page data directly to your project directory without manual file moving.

## 📋 Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Start the Development Environment

#### Option A: Start Both Frontend and Backend
```bash
npm run dev:full
```
This will start both the React app (port 3000) and the data server (port 3001).

#### Option B: Start Separately
```bash
# Terminal 1 - Start the data server
npm run server

# Terminal 2 - Start the React app
npm run dev
```

### 3. Use the Puck Editor
1. Open http://localhost:3000 in your browser
2. Design your page using the Puck editor
3. Click the **Publish** button
4. The JSON data will be saved directly to `src/data/pages/` in your project!

## 🎯 How It Works

### Direct File Saving
- When you click "Publish", the app sends the page data to a local API server
- The server saves the JSON file directly to `src/data/pages/`
- No manual file moving required!

### Fallback Method
- If the server isn't running, it falls back to downloading the file
- You can then manually move it to the project directory

## 📁 File Structure
```
Eventira/
├── src/
│   ├── data/
│   │   └── pages/          # Your saved page JSON files
│   └── App.tsx
├── server.js               # Express server for file operations
├── package.json
└── setup.md
```

## 🔧 API Endpoints

The server provides these endpoints:
- `POST /api/save-page` - Save page data
- `GET /api/pages` - List all saved pages
- `GET /api/pages/:filename` - Load specific page

## 💡 Usage in Your Code

```javascript
// Import saved page data
import pageData from './data/pages/page-data-2025-01-08.json';

// Use the data
console.log(pageData.content); // Array of components
console.log(pageData.root);    // Root props
```

## 🛠️ Troubleshooting

### Server Not Running
If you see "API server not running" message:
1. Make sure you ran `npm run server` or `npm run dev:full`
2. Check that port 3001 is available
3. The app will fall back to downloading files

### CORS Issues
The server includes CORS headers, but if you have issues:
1. Make sure the server is running on port 3001
2. Check browser console for errors
3. Restart both the server and the React app

## ✨ Benefits

- ✅ **Direct saving** - No manual file moving
- ✅ **Automatic organization** - Files saved to proper directory
- ✅ **Fallback support** - Works even if server is down
- ✅ **Easy integration** - Simple import in your code
- ✅ **Development friendly** - Perfect for local development
