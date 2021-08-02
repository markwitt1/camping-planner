import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import "./index.css";
import { SnackbarProvider } from "material-ui-snackbar-provider";

ReactDOM.render(
  <React.StrictMode>
    <SnackbarProvider>
      <App />
    </SnackbarProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
