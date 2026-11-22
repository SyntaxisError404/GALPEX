/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          900: '#0b132b',
          950: '#070c1d',
          800: '#1c2541',
          700: '#3a506b',
        },
        brand: {
          blue: '#1d4ed8',
          cyan: '#0284c7',
          emerald: '#059669',
          amber: '#d97706',
        }
      }
    },
  },
  plugins: [],
}
