/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "node_modules/flowbite-react/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        coinSinoTextColor: " #f4f4f4",
        coinSinoTextColor2: "#727a80",
        coinSinoGreen: " #00c080",
        coinSinoPink: "#d33493",
        coinSinoPurpleNav: "#20094d",
        coinSinoPurple: "#300a66",
      },
      backgroundImage: {
        "hero-pattern":
          "url('https://static.vecteezy.com/system/resources/previews/002/937/791/non_2x/dark-purple-pink-abstract-blur-background-vector.jpg')",
      },
    },
  },
  plugins: [require("flowbite/plugin"),  require('tailwind-scrollbar-hide')],
};
