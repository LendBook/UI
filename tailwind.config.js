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
        primary: "#003F7D",
        secondary: "#677785", //"#002347",
        success: "#28a745",
        error: "#c9dae9", //"#bebebe",
        warning: "#ffc107",
        info: "#59748d",
        light: "#f8f9fa",
        dark: "#343a40", //"#677785", //"#343a40",

        black: "#333333",
        white: "#ffffff",

        bgBtn: "#003F7D",
        bgBtnHover: "#002347",
        borderColor: "#4ACFFF",

        bgLight: "#f0f2f5", //"#e9f4ff",
      },
    },
    screens: {
      "md-plus": { min: "1000px" }, // Définir une taille d'écran personnalisée légèrement au-dessus de md
    },
  },
  plugins: [],

  variants: {
    extend: {
      transform: ["hover", "group-hover"],
      transitionProperty: ["hover", "group-hover"],
      transitionDuration: ["hover", "group-hover"],
      rotate: ["hover", "group-hover"],
    },
  },
};
