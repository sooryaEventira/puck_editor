/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        primary: '#6838EE'
      },
      fontFamily: {
        manrope: ['Manrope', 'Helvetica Neue', 'Arial', 'sans-serif']
      }
    }
  },
  plugins: []
}

