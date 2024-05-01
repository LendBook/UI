/** @type {import('tailwindcss').Config} */

module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],

  theme: {
    fontFamily: {
      "GothamPro-Regular": ["GothamPro-Regular"],
      "GothamPro-Bold": ["GothamPro-Bold"],
      cocogoose: ["cocogoose"],
    },
    extend: {
      colors: {
        primary: "#e9f4ff",
        secondary: "#6c757d",
        success: "#28a745",
        danger: "#dc3545",
        warning: "#ffc107",
        info: "#17a2b8",
        light: "#f8f9fa",
        dark: "#343a40",

        black: "#000000",
        white: "#ffffff",

        bgBtn: "#182B48",
        bgLight: "#f1f4f6",
        borderColor: "#4ACFFF",
      },
    },
  },
  plugins: [],
};
