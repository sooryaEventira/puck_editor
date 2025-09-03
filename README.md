# Puck Editor Learning Project

A simple React project for learning how to use the Puck editor - a visual page builder for React.

## What is Puck?

Puck is a visual page builder that allows you to create and edit React components through a drag-and-drop interface. It's perfect for building content management systems, landing pages, and any application where you need a visual editor.

## Features in this Project

- **Basic Components**: Heading, Text, and Button components
- **Visual Editor**: Drag and drop interface to build pages
- **Real-time Editing**: See changes as you make them
- **Property Panel**: Edit component properties through a user-friendly interface

## Getting Started

### Prerequisites

- Node.js (version 16 or higher)
- npm or yarn

### Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Open your browser and navigate to `http://localhost:3000`

## How to Use

1. **Drag Components**: Use the left sidebar to drag components onto the canvas
2. **Edit Properties**: Click on any component to edit its properties in the right panel
3. **Preview**: See your changes in real-time on the canvas
4. **Save**: The editor automatically saves your work

## Available Components

- **Heading**: Text headings with different levels (H1-H4)
- **Text**: Paragraph text with textarea editing
- **Button**: Interactive buttons with different variants

## Project Structure

```
src/
├── App.jsx          # Main application with Puck editor
├── main.jsx         # React entry point
└── index.css        # Global styles
```

## Learning Resources

- [Puck Documentation](https://puckeditor.com/docs)
- [Puck GitHub Repository](https://github.com/measuredco/puck)

## Next Steps

Try these exercises to learn more:

1. Add a new component (like an Image component)
2. Create custom fields for components
3. Add validation to component properties
4. Implement data fetching for dynamic content
5. Add custom styling options

## Troubleshooting

If you encounter any issues:

1. Make sure all dependencies are installed: `npm install`
2. Clear node_modules and reinstall: `rm -rf node_modules && npm install`
3. Check that you're using Node.js version 16 or higher

Happy learning! 🎉
