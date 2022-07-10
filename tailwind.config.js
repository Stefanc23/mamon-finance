/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#F58148',
        secondary: '#FFD700',
        dark: '#151F28',
      },
    },
  },
  plugins: [require('tailwind-scrollbar-hide')],
};
