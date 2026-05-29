import React from "react";
import ReactDOM from "react-dom/client";
import { App } from "./App";
import { ScreenshotApp, type ScreenshotSection } from "./ScreenshotApp";
import "./App.css";

// Lightweight router. The normal homepage is untouched at `/`.
// Visiting `?mode=screenshot&section=<name>` renders one isolated
// section large-text for README capture.
const params = new URLSearchParams(window.location.search);
const isScreenshot = params.get("mode") === "screenshot";
const section = (params.get("section") as ScreenshotSection) || "hero";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    {isScreenshot ? <ScreenshotApp section={section} /> : <App />}
  </React.StrictMode>,
);
