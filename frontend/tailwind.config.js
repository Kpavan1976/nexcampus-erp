/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        obsidian: '#0B0F19',
        surface: '#111827'
      }
    }
  },
  plugins: []
};