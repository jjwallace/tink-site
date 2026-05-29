import React from "react";
import ReactDOM from "react-dom/client";
import { App } from "./App";
import { ScreenshotApp, type ScreenshotSection } from "./ScreenshotApp";
import { DisclosurePage } from "./ui/DisclosurePage";
import "./App.css";

// Lightweight router. The normal homepage is untouched at `/`.
//   `?mode=screenshot&section=<name>` → isolated README capture variant
//   `?page=disclosure`                → standalone disclosure lore page
const params = new URLSearchParams(window.location.search);
const isScreenshot = params.get("mode") === "screenshot";
const section = (params.get("section") as ScreenshotSection) || "hero";
const page = params.get("page");

function pick() {
  if (isScreenshot) return <ScreenshotApp section={section} />;
  if (page === "disclosure") return <DisclosurePage />;
  return <App />;
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>{pick()}</React.StrictMode>,
);
