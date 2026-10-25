import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import CounterContextProvider from "./components/context/CounterContext.tsx";
import TokenContextProvider from "./components/context/TokenContext.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <TokenContextProvider>
      <CounterContextProvider>
        <App />
      </CounterContextProvider>
    </TokenContextProvider>
  </StrictMode>,
);
