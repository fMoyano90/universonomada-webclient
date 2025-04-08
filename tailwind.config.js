/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary-blue': '#3D667A',
        'primary-blue-light': '#4E7D94',
        'primary-blue-dark': '#2C4B5A',
        
        'primary-brown': '#7A553D',
        'primary-brown-light': '#96694C',
        'primary-brown-dark': '#5E412F',
        
        'primary-orange': '#FA5F00',
        'primary-orange-light': '#FF7A2A',
        'primary-orange-dark': '#CC4D00',
        
        'primary-green': '#00FAAC',
        'primary-green-light': '#26FFBC',
        'primary-green-dark': '#00CC8E',
        
        'primary-cyan': '#00A5FA',
        'primary-cyan-light': '#2CBCFF',
        'primary-cyan-dark': '#0084CC',
      }
    },
  },
  plugins: [
    require('@tailwindcss/container-queries'),
  ],
}
