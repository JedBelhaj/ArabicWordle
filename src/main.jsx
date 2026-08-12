import { StrictMode, Suspense, lazy } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter, Route, Routes } from "react-router";

// Lazy-loaded because these pages pull in socket.js (opens a live connection
// to the backend on import) — the single-player route should never need it.
const Index = lazy(() => import("./pages/Index.jsx"));
const Multiplayer = lazy(() => import("./pages/Multiplayer.jsx"));

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <Suspense fallback={null}>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/singleplayer" element={<App />} />
        <Route path="/multiplayer/:roomId" element={<Multiplayer />} />
      </Routes>
    </Suspense>
  </BrowserRouter>,
);
