import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "@/index.css";
import App from "@/App";
import { ThemeProvider } from "@/hooks/useTheme";
import { CartProvider } from "@/hooks/useCart";
import { CompareProvider } from "@/hooks/useCompare";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ThemeProvider>
      <CartProvider>
        <CompareProvider>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </CompareProvider>
      </CartProvider>
    </ThemeProvider>
  </React.StrictMode>,
);
