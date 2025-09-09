const fs = require('fs');
const path = require('path');

// Function to save page data to project directory
function savePageData(pageData, filename = null) {
  try {
    // Create data directory if it doesn't exist
    const dataDir = path.join(__dirname, 'src', 'data', 'pages');
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
      console.log('✅ Created directory: src/data/pages/');
    }

    // Generate filename if not provided
    if (!filename) {
      const timestamp = new Date().toISOString().split('T')[0];
      filename = `page-data-${timestamp}.json`;
    }

    // Save the data
    const filePath = path.join(dataDir, filename);
    fs.writeFileSync(filePath, JSON.stringify(pageData, null, 2));
    
    console.log(`✅ Page data saved to: ${filePath}`);
    console.log(`📁 File: ${filename}`);
    console.log(`📊 Components: ${pageData.content?.length || 0}`);
    
    return filePath;
  } catch (error) {
    console.error('❌ Error saving page data:', error.message);
    return null;
  }
}

// Function to load page data from localStorage backup
function loadFromLocalStorage() {
  console.log('💡 To use this script:');
  console.log('1. Open your browser console on the Puck editor page');
  console.log('2. Copy the JSON data from the console log');
  console.log('3. Run: node save-page-data.js "your-json-data-here"');
  console.log('4. Or manually call: savePageData(yourDataObject)');
}

// Command line usage
if (process.argv.length > 2) {
  try {
    const jsonData = process.argv[2];
    const pageData = JSON.parse(jsonData);
    savePageData(pageData);
  } catch (error) {
    console.error('❌ Invalid JSON data provided');
    loadFromLocalStorage();
  }
} else {
  loadFromLocalStorage();
}

module.exports = { savePageData };
