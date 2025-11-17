/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
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

