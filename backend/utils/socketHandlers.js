const { addDataToSession, getSession, startDisconnectTimeout } = require("./auth.js");
const {
  createRoom,
  joinRoom,
  removePlayer,
  getRoomDetails,
  getPlayersInfo,
  isHost,
  updateSettings,
} = require("./roomHandlers.js");
const { startGame, submitGuess } = require("./gameHandlers.js");

const DISCONNECT_ROOM_GRACE_MS = 5000;

const handleSocketEvents = (io, socket) => {
  socket.on("room:create", ({ username }, ack) => {
    const sessionId = socket.sessionId;
    const roomId = createRoom(sessionId);
    addDataToSession(sessionId, { username, roomId });
    socket.join(roomId);
    ack({ success: true, roomId, sessionId });
  });

  socket.on("room:join", ({ roomId, username }, ack) => {
    const sessionId = socket.sessionId;
    const result = joinRoom(roomId, sessionId);

    if (result.success) {
      addDataToSession(sessionId, { username, roomId });
      socket.join(roomId);
      io.to(roomId).emit("room:update", { players: getPlayersInfo(roomId) });
      ack({ success: true, roomId, sessionId });
    } else {
      ack({ success: false, message: result.message });
    }
  });

  socket.on("room:details", ({ roomId }, ack) => {
    const room = getRoomDetails(roomId);
    if (!room) {
      ack({ success: false, message: "Room not found" });
      return;
    }
    ack({
      success: true,
      room: {
        players: getPlayersInfo(roomId),
        settings: room.settings,
        status: room.status,
        hostSessionId: room.data.host,
      },
    });
  });

  socket.on("room:updateSettings", ({ roomId, settings }, ack) => {
    const result = updateSettings(roomId, socket.sessionId, settings || {});
    if (result.success) {
      io.to(roomId).emit("room:settings", result.settings);
    }
    if (ack) ack(result);
  });

  socket.on("room:start", ({ roomId }, ack) => {
    const room = getRoomDetails(roomId);
    if (!room) return ack?.({ success: false, message: "Room not found" });
    if (!isHost(roomId, socket.sessionId)) {
      return ack?.({ success: false, message: "Only the host can start the game" });
    }
    if (room.players.length < 1) {
      return ack?.({ success: false, message: "Need at least one player" });
    }
    startGame(io, roomId);
    ack?.({ success: true });
  });

  socket.on("game:guess", ({ roomId, guess }, ack) => {
    const result = submitGuess(io, roomId, socket.sessionId, guess);
    ack?.(result);
  });

  socket.on("chat:message", ({ roomId, text }) => {
    if (!roomId || !text || !text.trim()) return;
    const session = getSession(socket.sessionId);
    io.to(roomId).emit("chat:message", {
      sessionId: socket.sessionId,
      username: session?.data?.username || "Guest",
      text: text.trim().slice(0, 500),
      ts: Date.now(),
    });
  });

  socket.on("room:leave", ({ roomId }) => {
    socket.leave(roomId);
    removePlayer(roomId, socket.sessionId);
    const room = getRoomDetails(roomId);
    if (room) io.to(roomId).emit("room:update", { players: getPlayersInfo(roomId) });
  });

  socket.on("disconnect", () => {
    const sessionId = socket.sessionId;
    const session = getSession(sessionId);
    const roomId = session?.data?.roomId;
    startDisconnectTimeout(sessionId);

    if (!roomId) return;
    setTimeout(() => {
      const current = getSession(sessionId);
      // Only drop them from the room if they never reconnected with a new socket.
      if (current && current.socketId === socket.id) {
        removePlayer(roomId, sessionId);
        const room = getRoomDetails(roomId);
        if (room) io.to(roomId).emit("room:update", { players: getPlayersInfo(roomId) });
      }
    }, DISCONNECT_ROOM_GRACE_MS);
  });
};

module.exports = { handleSocketEvents };
