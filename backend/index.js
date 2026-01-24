const { Server } = require("socket.io");
const http = require("http");
const express = require("express");
const { handleSocketEvents } = require("./utils/socketHandlers");
const { handleAuth } = require("./utils/auth");

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

io.on("connection", (socket) => {
  handleAuth(socket);
  handleSocketEvents(io, socket);
  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

server.listen(8000, () => {
  console.log("Socket.IO running on port 8000");
});
