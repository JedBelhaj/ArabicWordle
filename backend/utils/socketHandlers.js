const handleSocketEvents = (io, socket) => {
  socket.on("test", (data) => {
    console.log("Received test event with data:", data);
    io.emit("testResponse", { message: "Test event received!" });
  });
};
module.exports = { handleSocketEvents };
