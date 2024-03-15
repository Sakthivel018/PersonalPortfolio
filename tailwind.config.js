/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["*.html", "./*/*/*.{html,js,css,svg}"],
  theme: {
    extend: {
      fontFamily: {
        'poppins': ['Poppins', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
