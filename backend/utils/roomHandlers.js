const { time } = require("console");
const { randomUUID } = require("crypto");
const rooms = {
  fuck: {
    players: [],
    settings: {},
    timeout: null,
    data: {
      test: "FUCK ROOM DATA IS BEING COLLECTED",
    },
  },
};

/** @type {(playerIds: Array, settings: Object, timeout: Object, data: Object) => string} */

const createRoom = (sessionId) => {
  const roomId = randomUUID().slice(0, 4);
  if (rooms[roomId]) return createRoom(sessionId); // bad for now ignore
  rooms[roomId] = {
    players: [sessionId],
    settings: {},
    timeout: null,
    data: { host: sessionId },
  };
  return roomId;
};

const getRoomDetails = (roomId) => {
  return rooms[roomId];
};
module.exports = { createRoom, rooms, getRoomDetails };
