const { createSession } = require("../utils/auth.js");
const { createRoom } = require("./roomHandlers.js");
const handleSocketEvents = (io, socket) => {
  socket.on("test", (data) => {
    console.log("Received test event with data:", data);
    io.emit("testResponse", { message: "Test event received!" });
  });
  socket.on("room:create", (username) => {
    console.log(`Creating room for user: ${username}`);
    // Create session
    const sessionId = createSession(username, socket.id);
    // Create room
    const roomId = createRoom(sessionId);
    console.log(`Room ${roomId} created with session ${sessionId}`);
    // Emit back to client
    socket.emit("room:created", { roomId, sessionId });
  });
};
module.exports = { handleSocketEvents };
