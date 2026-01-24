import { io } from "socket.io-client";

export const socket = io("http://localhost:8000", {
  auth: {
    sessionId: localStorage.getItem("sessionId"),
  },
  autoConnect: true,
  transports: ["websocket", "polling"],
});

socket.on("sessionCreated", ({ sessionId }) => {
  localStorage.setItem("sessionId", sessionId);
  console.log("Session created with ID:", sessionId);
});

socket.emit("test", { data: "Hello from client!" });

socket.on("testResponse", (data) => {
  console.log("Received from server:", data);
});

export const getSessionId = () => {
  return localStorage.getItem("sessionId");
};
