/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",],
  theme: {
    extend: {
      gridTemplateColumns: {
        'custom': 'repeat(2, minmax(90vh, 100vh))',
      },
    },
  },
  plugins: [],
}

