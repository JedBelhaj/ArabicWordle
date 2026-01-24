import { io } from "socket.io-client";

export const socket = io("http://localhost:8000", {
  autoConnect: true,
  transports: ["websocket", "polling"],
});

socket.emit("test", { data: "Hello from client!" });

socket.on("testResponse", (data) => {
  console.log("Received from server:", data);
});
