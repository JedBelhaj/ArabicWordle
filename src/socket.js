import { io } from "socket.io-client";

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:8000";

export const socket = io(SOCKET_URL, {
  auth: {
    sessionId: localStorage.getItem("sessionId"),
  },
  autoConnect: true,
  transports: ["websocket", "polling"],
});

socket.on("sessionCreated", ({ sessionId }) => {
  localStorage.setItem("sessionId", sessionId);
});

export const getSessionId = () => {
  return localStorage.getItem("sessionId");
};
