/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'horse-red': '#E60012',
        'horse-gold': '#FFD700',
        'horse-dark': '#8B0000',
      },
      fontFamily: {
        serif: ['"Noto Serif TC"', 'serif'],
      }
    },
  },
  plugins: [],
}
