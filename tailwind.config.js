/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,jsx}"],
  // content: [
  //   './pages/**/*.jsx',
  //   './components/**/*.jsx',
  // ],
  theme: {
    screens: {
      "lt-650": { max: "650px" },
      // => @media (max-width: 650px) { ... }

      xs: "320px",
      // => @media (min-width: 340px) { ... }

      sm: "640px",
      // => @media (min-width: 640px) { ... }

      md: "768px",
      // => @media (min-width: 768px) { ... }

      lg: "1024px",
      // => @media (min-width: 1024px) { ... }

      xl: "1280px",
      // => @media (min-width: 1280px) { ... }

      "2xl": "1336px",
      // => @media (min-width: 1536px) { ... }
    },
    extend: {
      backgroundColor: {
        primary: "var(--primary-green)",
      },
      colors: {
        primary: "var(--primary-green)",
      },
    },
  },
  plugins: [require("@tailwindcss/forms"), require("tw-elements/dist/plugin")],
};
