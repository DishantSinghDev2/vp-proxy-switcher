/** @type {import('tailwindcss').Config} */
module.exports = {
  mode: 'jit',
  darkMode: 'class',
  content: ['./**/*.tsx'],
  theme: {
    extend: {
      colors: {
        brand: {
          green: '#22c55e',
          'green-light': '#4ade80',
          'green-dark': '#16a34a',
        },
      },
    },
  },
  plugins: [],
}
