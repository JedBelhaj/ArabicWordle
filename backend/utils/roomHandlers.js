const { randomUUID } = require("crypto");
const { getSession } = require("./auth.js");

const rooms = {};

const DEFAULT_SETTINGS = {
  language: "arabic", // arabic | english
  wordLength: 5, // 3 | 4 | 5
  tries: 6,
  rounds: 3,
  timeLimit: 60, // seconds, 0 = no limit
  scoreMode: "fastest", // fastest | fewerTries
  privacy: "public", // public | private
};

const createRoom = (sessionId) => {
  const roomId = randomUUID().slice(0, 4);
  if (rooms[roomId]) return createRoom(sessionId); // bad for now ignore
  rooms[roomId] = {
    players: [sessionId],
    settings: { ...DEFAULT_SETTINGS },
    status: "lobby",
    game: null,
    data: { host: sessionId },
  };
  return roomId;
};

const getRoomDetails = (roomId) => rooms[roomId];

const isHost = (roomId, sessionId) => {
  const room = getRoomDetails(roomId);
  return Boolean(room && room.data.host === sessionId);
};

const joinRoom = (roomId, sessionId) => {
  const room = getRoomDetails(roomId);
  if (!room) return { success: false, message: "Room not found" };
  if (room.status !== "lobby") {
    return { success: false, message: "Game already in progress" };
  }
  if (!room.players.includes(sessionId)) room.players.push(sessionId);
  return { success: true };
};

const removePlayer = (roomId, sessionId) => {
  const room = getRoomDetails(roomId);
  if (!room) return;
  room.players = room.players.filter((id) => id !== sessionId);

  if (room.players.length === 0) {
    delete rooms[roomId];
    return;
  }

  if (room.data.host === sessionId) {
    room.data.host = room.players[0];
  }
};

const getPlayersInfo = (roomId) => {
  const room = getRoomDetails(roomId);
  if (!room) return [];
  return room.players.map((sessionId) => {
    const session = getSession(sessionId);
    return {
      sessionId,
      username: session?.data?.username || "Guest",
      isHost: sessionId === room.data.host,
    };
  });
};

const VALID_LANGUAGES = ["arabic", "english"];
const VALID_WORD_LENGTHS = [3, 4, 5];
const VALID_SCORE_MODES = ["fastest", "fewerTries"];
const VALID_PRIVACY = ["public", "private"];

const clampInt = (value, min, max, fallback) => {
  const n = Number.parseInt(value, 10);
  if (Number.isNaN(n)) return fallback;
  return Math.min(max, Math.max(min, n));
};

const updateSettings = (roomId, sessionId, patch) => {
  const room = getRoomDetails(roomId);
  if (!room) return { success: false, message: "Room not found" };
  if (!isHost(roomId, sessionId)) {
    return { success: false, message: "Only the host can change settings" };
  }
  if (room.status !== "lobby") {
    return { success: false, message: "Cannot change settings mid-game" };
  }

  const next = { ...room.settings };
  if (patch.language && VALID_LANGUAGES.includes(patch.language)) {
    next.language = patch.language;
  }
  if (patch.wordLength && VALID_WORD_LENGTHS.includes(Number(patch.wordLength))) {
    next.wordLength = Number(patch.wordLength);
  }
  if (patch.tries !== undefined) {
    next.tries = clampInt(patch.tries, 1, 20, next.tries);
  }
  if (patch.rounds !== undefined) {
    next.rounds = clampInt(patch.rounds, 1, 50, next.rounds);
  }
  if (patch.timeLimit !== undefined) {
    next.timeLimit = clampInt(patch.timeLimit, 0, 300, next.timeLimit);
  }
  if (patch.scoreMode && VALID_SCORE_MODES.includes(patch.scoreMode)) {
    next.scoreMode = patch.scoreMode;
  }
  if (patch.privacy && VALID_PRIVACY.includes(patch.privacy)) {
    next.privacy = patch.privacy;
  }

  room.settings = next;
  return { success: true, settings: room.settings };
};

module.exports = {
  rooms,
  createRoom,
  joinRoom,
  removePlayer,
  getRoomDetails,
  getPlayersInfo,
  isHost,
  updateSettings,
};
