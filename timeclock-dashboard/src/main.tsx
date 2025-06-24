import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ConvexAuthProvider } from "@convex-dev/auth/react";
import { ConvexReactClient } from "convex/react";
import {
  createTheme,
  CssBaseline,
  type ThemeOptions,
  ThemeProvider,
} from "@mui/material";
import "./index.css";
import App from "./App.tsx";

const convex = new ConvexReactClient(import.meta.env.VITE_CONVEX_URL);

export const themeOptions: ThemeOptions = {
  palette: {
    mode: "dark",
    background: {
      default: "#121212",
      paper: "#1e1e1e",
    },
    primary: {
      main: "#ff8811",
    },
    secondary: {
      main: "#47FF44",
    },
  },
};

const theme = createTheme(themeOptions);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <ConvexAuthProvider client={convex}>
        <CssBaseline />
        <App />
      </ConvexAuthProvider>
    </ThemeProvider>
  </StrictMode>
);
