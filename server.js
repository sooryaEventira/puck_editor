const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = 3001;

// Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Log all requests for debugging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Ensure data directory exists
const dataDir = path.join(__dirname, 'src', 'data', 'pages');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
  console.log('✅ Created directory: src/data/pages/');
}

// API endpoint to save page data
app.post('/api/save-page', (req, res) => {
  try {
    const { data, filename } = req.body;
    
    if (!data) {
      return res.status(400).json({ error: 'No data provided' });
    }

    // Generate filename if not provided
    const timestamp = new Date().toISOString().split('T')[0];
    const finalFilename = filename || `page-data-${timestamp}.json`;
    
    // Ensure filename has .json extension
    const jsonFilename = finalFilename.endsWith('.json') ? finalFilename : `${finalFilename}.json`;
    
    // Save to project directory
    const filePath = path.join(dataDir, jsonFilename);
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    
    console.log(`✅ Page data saved to: ${filePath}`);
    console.log(`📊 Components: ${data.content?.length || 0}`);
    
    res.json({
      success: true,
      message: 'Page data saved successfully',
      filename: jsonFilename,
      path: filePath,
      components: data.content?.length || 0
    });
    
  } catch (error) {
    console.error('❌ Error saving page data:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to save page data',
      message: error.message
    });
  }
});

// API endpoint to get saved pages
app.get('/api/pages', (req, res) => {
  try {
    const files = fs.readdirSync(dataDir)
      .filter(file => file.endsWith('.json'))
      .map(file => {
        const filePath = path.join(dataDir, file);
        const stats = fs.statSync(filePath);
        return {
          filename: file,
          path: filePath,
          size: stats.size,
          created: stats.birthtime,
          modified: stats.mtime
        };
      })
      .sort((a, b) => new Date(b.modified) - new Date(a.modified));
    
    res.json({
      success: true,
      pages: files
    });
  } catch (error) {
    console.error('❌ Error reading pages:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to read pages',
      message: error.message
    });
  }
});

// API endpoint to load a specific page
app.get('/api/pages/:filename', (req, res) => {
  try {
    const { filename } = req.params;
    const filePath = path.join(dataDir, filename);
    
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        success: false,
        error: 'Page not found'
      });
    }
    
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    
    res.json({
      success: true,
      data: data
    });
  } catch (error) {
    console.error('❌ Error loading page:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to load page',
      message: error.message
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Puck Data Server running on http://localhost:${PORT}`);
  console.log(`📁 Saving files to: ${dataDir}`);
  console.log(`📋 Available endpoints:`);
  console.log(`   POST /api/save-page - Save page data`);
  console.log(`   GET  /api/pages - List saved pages`);
  console.log(`   GET  /api/pages/:filename - Load specific page`);
});
