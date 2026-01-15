# 🚀 Puck Editor Setup

This project uses the Puck editor for page design and management.

## 📋 Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Start the Development Server
```bash
npm run dev
```

### 3. Use the Puck Editor
1. Open http://localhost:3000 in your browser
2. Design your page using the Puck editor
3. Click the **Publish** button
4. The page data will be saved to the Azure backend

## 🎯 How It Works

- The app connects directly to the Azure backend API
- All page data is saved and retrieved from the production backend
- No local server required

## 📁 File Structure
```
Eventita_ui/
├── src/
│   ├── components/
│   ├── pages/
│   ├── services/
│   └── config/
├── package.json
└── setup.md
```

## 🔧 API Configuration

The app is configured to use the Azure backend:
- All API endpoints point to the production Azure backend
- Authentication and page management are handled by the backend API

## 🛠️ Troubleshooting

### CORS Issues
If you encounter CORS errors:
1. Ensure the Azure backend has CORS properly configured
2. Check browser console for specific error messages
3. Verify the backend URL in `src/config/env.ts`

## ✨ Features

- ✅ **Direct backend integration** - All data saved to Azure backend
- ✅ **Authentication support** - Full auth flow with backend
- ✅ **Page management** - Create, edit, and manage pages
- ✅ **Production ready** - Configured for production deployment
