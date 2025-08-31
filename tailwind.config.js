/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./utils/**/*.{js,ts,jsx,tsx}",
    "./services/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        'sans': ['Barlow', 'system-ui', 'sans-serif'],
        'condensed': ['Barlow Condensed', 'system-ui', 'sans-serif'],
        'semi-condensed': ['Barlow Semi Condensed', 'system-ui', 'sans-serif'],
        'mono': ['JetBrains Mono', 'monospace'],
      },
      backdropBlur: {
        xs: '2px',
      }
    },
  },
  plugins: [],
}