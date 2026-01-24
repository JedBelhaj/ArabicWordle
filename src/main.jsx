import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import Index from "./pages/Index.jsx";
import Multiplayer from "./pages/Multiplayer.jsx";
import { BrowserRouter, Route, Routes } from "react-router";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/singleplayer" element={<App />} />
      <Route path="/multiplayer/:roomId" element={<Multiplayer />} />
    </Routes>
  </BrowserRouter>,
);
