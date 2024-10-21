/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}',  // Inclui arquivos .jsx
  ],
  theme: {
    extend: {},
  },
  plugins: [require('daisyui')],
}


