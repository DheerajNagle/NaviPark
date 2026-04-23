/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class', // enabling class-based dark mode
  theme: {
    extend: {
      colors: {
        background: {
          light: '#f8fafc',
          dark: '#0f172a'
        },
        surface: {
          light: '#ffffff',
          dark: '#1e293b'
        },
        primary: {
          light: '#0ea5e9',
          dark: '#38bdf8'
        }
      }
    },
  },
  plugins: [],
}
