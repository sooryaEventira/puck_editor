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
          // Use CSS variables so public pages can override theme easily.
          // Values are RGB triplets (e.g. "104 56 238") to support Tailwind opacity modifiers like bg-primary/90.
          DEFAULT: 'rgb(var(--color-primary) / <alpha-value>)',
          dark: 'rgb(var(--color-primary-dark) / <alpha-value>)'
        }
      },
      fontFamily: {
        manrope: ['Manrope', 'Helvetica Neue', 'Arial', 'sans-serif']
      }
    }
  },
  plugins: []
}

