import React from "react";
import ReactDOM from "react-dom/client";
import "@fontsource-variable/inter";
import "@fontsource/tektur/500.css";
import "@fontsource/tektur/600.css";
import "@fontsource/tektur/700.css";
import "@fontsource/jetbrains-mono/500.css";
import { App } from "./App";
import "./styles/index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
