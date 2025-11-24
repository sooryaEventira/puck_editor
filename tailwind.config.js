const breakpoints = require('./src/config/breakpoints.json')

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      screens: {
        'xs': `${breakpoints.mobile}px`,
        'sm': '640px', // Keep Tailwind default
        'md': `${breakpoints.tablet}px`,
        'lg': `${breakpoints.desktop}px`,
        'xl': '1280px', // Keep Tailwind default
        '2xl': `${breakpoints.wide}px`,
      },
      colors: {
        primary: {
          DEFAULT: '#6838EE',
          dark: '#3E1C96'
        }
      },
      fontFamily: {
        manrope: ['Manrope', 'Helvetica Neue', 'Arial', 'sans-serif']
      }
    }
  },
  plugins: []
}

