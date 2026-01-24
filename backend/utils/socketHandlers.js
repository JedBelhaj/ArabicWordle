const { addDataToSession, getSession } = require("../utils/auth.js");
const { createRoom, getRoomDetails } = require("./roomHandlers.js");
const handleSocketEvents = (io, socket) => {
  socket.on("test", (data) => {
    console.log("Received test event with data:", data);
    io.emit("testResponse", { message: "Test event received!" });
  });
  socket.on("room:create", ({ username }, ack) => {
    console.log(`Creating room for user: ${username}`);
    // Create session
    const sessionId = socket.sessionId;
    // Create room
    const roomId = createRoom(sessionId);
    console.log(`Room ${roomId} created with session ${sessionId}`);
    // Emit back to client
    addDataToSession(sessionId, { username, roomId });

    ack({ roomId, sessionId });
  });
  socket.on("room:details", ({ roomId }, ack) => {
    console.log(`Fetching details for room: ${roomId}`);
    const room = getRoomDetails(roomId);
    const players = room.players.map((sessionId) => {
      const s = getSession(sessionId);
      return {
        sessionId,
        username: s?.data?.username || "Unknown",
      };
    });
    if (room) {
      ack({ success: true, room: { players } });
    } else {
      ack({ success: false, message: "Room not found" });
    }
  });
};
module.exports = { handleSocketEvents };
