// index.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

import { GoogleOAuthProvider } from "@react-oauth/google";
import { CssBaseline } from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";
import rtlPlugin from "stylis-plugin-rtl";
import { prefixer } from "stylis";
import { CssVarsProvider } from "@mui/joy/styles";

const cacheRtl = createCache({
  key: "muirtl",
  stylisPlugins: [prefixer, rtlPlugin],
});

const theme = createTheme({
  direction: "rtl",
  typography: {
    fontFamily: "'Almarai', 'Roboto', 'Arial', sans-serif",
  },
});

document.body.setAttribute("dir", "rtl");

const clientId =
  "959657991397-bna1nmvurq1a0uhmmvevjhvheq8bp3da.apps.googleusercontent.com";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <CacheProvider value={cacheRtl}>
      <ThemeProvider theme={theme}>
        <GoogleOAuthProvider clientId={clientId}>
          <CssBaseline />
          <App />
        </GoogleOAuthProvider>
      </ThemeProvider>
    </CacheProvider>
  </React.StrictMode>
);
