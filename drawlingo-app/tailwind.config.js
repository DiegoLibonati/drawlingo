/** @type {import('tailwindcss').Config} */

const config = {
  content: ["./index.html", "./src/**/*.{vue,ts,js}"],
  theme: {
    extend: {
      colors: {
        primary: "#222831",
        secondary: "#393E46",
        tertiary: "#00ADB5",
        quaternary: "#EEEEEE",
        white: "#FFFFFF",
        black: "#000000",
      },
      fontFamily: {
        primary: ['"Playwrite NZ"', "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
