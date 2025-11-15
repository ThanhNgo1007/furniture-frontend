import { createTheme } from "@mui/material";

const customTheme = createTheme({
    palette: {
        mode:"light",
        primary: {
            main: '#E27E6A',
        },
        secondary: {
            main: '#EAF0F1'
        
        },
        success: {
            main: '#00796B'
        },
        error: {
            main: '#f44336'
        },
        warning: {
            main: '#E27E6A'
        },
        info: {
            main: '#62afedff'
        },
        background: {
            default: '#ffffff',
            paper: '#f5f5f5'
        },
        text: {
            primary: '#212121'
        },
    }})
export default customTheme;