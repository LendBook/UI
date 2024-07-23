import { createTheme } from "@mui/material/styles";

const tailwindColors = {
  primary: "#6cc6a7", //"#98ff98", "#c5ebdf",
  secondary: "#677785", //"#002347",
  success: "#28a745",
  error: "#d8dfe5", //"#c9dae9",
  warning: "#f0f2f5", //"#ffc107", f6f8fc
  info: "#59748d",
  light: "#f0f2f5", //"#f8f9fa",
  dark: "#343a40", //"#677785", //"#343a40",

  black: "#111111",
  white: "#ffffff",

  bgBtn: "#003F7D",
  bgBtnHover: "#002347",
  borderColor: "#4ACFFF",

  bgLight: "#f9fafb", //"#f9fafb", f0f2f5 //"#e9f4ff",
};
// const tailwindColors = {
//   primary: "#003F7D",
//   secondary: "#677785", //"#002347",
//   success: "#28a745",
//   error: "#c9dae9",
//   warning: "#ffc107",
//   info: "#59748d",
//   light: "#f8f9fa",
//   dark: "#343a40", //"#677785", //"#343a40",

//   black: "#333333",
//   white: "#ffffff",

//   bgBtn: "#003F7D",
//   bgBtnHover: "#002347",
//   borderColor: "#4ACFFF",

//   bgLight: "#f0f2f5", //"#e9f4ff",
// };

const index = createTheme({
  palette: {
    primary: { main: tailwindColors.primary },
    secondary: { main: tailwindColors.secondary },
    error: { main: tailwindColors.error },
    warning: { main: tailwindColors.warning },
    info: { main: tailwindColors.info },
    success: { main: tailwindColors.success },
    common: {
      black: tailwindColors.black,
      white: tailwindColors.white,
    },
    background: {
      default: tailwindColors.bgLight,
      paper: tailwindColors.white,
    },
    text: {
      primary: tailwindColors.dark,
      secondary: tailwindColors.secondary,
    },
  },
  typography: {
    fontFamily: [
      "GothamPro-Regular",
      "GothamPro-Bold",
      "cocogoose",
      "-apple-system",
      "BlinkMacSystemFont",
      '"Segoe UI"',
      "Roboto",
      '"Helvetica Neue"',
      "Arial",
      "sans-serif",
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(","),
  },
  components: {
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderBottom: `1px solid ${tailwindColors.borderColor}`,
        },
      },
    },
  },
});

export default index;
