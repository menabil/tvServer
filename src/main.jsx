import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { ReactLenis } from "lenis/react";
import "./index.css";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <HelmetProvider>
      <BrowserRouter>
        <ReactLenis root>
          <App />
        </ReactLenis>
      </BrowserRouter>
    </HelmetProvider>
  </StrictMode>,
);
