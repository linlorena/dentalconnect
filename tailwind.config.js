/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        inria: ["Inria Sans", "sans-serif"],
      },
    },
  },
  theme: {
    extend: {
      colors: {
        'custom-teal': '#00B6BC',
      },
    },
  },  
  plugins: [],
};
