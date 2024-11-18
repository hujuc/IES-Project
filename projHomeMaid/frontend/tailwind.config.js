/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        'home-maid': "url('public/HomeMaid.png')", // Path to your image
      },
    },
  },
  plugins: [
    require('daisyui'),
  ],
}

