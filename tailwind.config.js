/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        foreground: '#000000',
        'muted-foreground': '#666666',
        'base-background': '#ffffff',
        'base-border': '#E4E4E7',
      }
    },
  },
  plugins: [],
}
