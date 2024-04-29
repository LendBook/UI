import { createTheme } from '@mui/material/styles';

const tailwindColors = {
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
};

const index = createTheme({
    palette: {
        primary: { main: tailwindColors.primary },
        secondary: { main: tailwindColors.secondary },
        error: { main: tailwindColors.danger },
        warning: { main: tailwindColors.warning },
        info: { main: tailwindColors.info },
        success: { main: tailwindColors.success },
        common: {
            black: tailwindColors.black,
            white: tailwindColors.white,
        },
        background: {
            default: tailwindColors.bgLight,
            paper: tailwindColors.light,
        },
        text: {
            primary: tailwindColors.dark,
            secondary: tailwindColors.secondary,
        },
    },
    typography: {
        fontFamily: [
            'GothamPro-Regular',
            'GothamPro-Bold',
            'cocogoose',
            '-apple-system',
            'BlinkMacSystemFont',
            '"Segoe UI"',
            'Roboto',
            '"Helvetica Neue"',
            'Arial',
            'sans-serif',
            '"Apple Color Emoji"',
            '"Segoe UI Emoji"',
            '"Segoe UI Symbol"'
        ].join(','),
    },
    components: {
        MuiTableCell: {
            styleOverrides: {
                root: {
                    borderBottom: `1px solid ${tailwindColors.borderColor}`
                }
            }
        },
    },
});

export default index;
