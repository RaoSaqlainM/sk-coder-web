/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'sk-dark': '#0f172a',
        'sk-darker': '#0a0e27',
        'sk-accent': '#3b82f6',
      }
    },
  },
  plugins: [],
}
