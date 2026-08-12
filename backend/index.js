const { Server } = require("socket.io");
const http = require("http");
const express = require("express");
const { handleSocketEvents } = require("./utils/socketHandlers");
const { handleAuth, getSession } = require("./utils/auth");

const PORT = process.env.PORT || 8000;
const CORS_ORIGIN = process.env.CORS_ORIGIN || "*";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: CORS_ORIGIN,
  },
});

io.on("connection", (socket) => {
  handleAuth(socket);

  // Rejoin the Socket.IO room on reconnect (e.g. page refresh mid-game) —
  // room membership above is per-connection, not persisted across sockets.
  const roomId = getSession(socket.sessionId)?.data?.roomId;
  if (roomId) socket.join(roomId);

  handleSocketEvents(io, socket);
});

server.listen(PORT, () => {
  console.log(`Socket.IO running on port ${PORT}`);
});
