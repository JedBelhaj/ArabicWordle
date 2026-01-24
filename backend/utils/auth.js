const crypto = require("crypto");

const sessions = {};

/** @type {(username: string, socketId: string, timeout: Object, data: Object) => string} */
const createSession = (username, socketId) => {
  const sessionId = crypto.randomUUID();
  sessions[sessionId] = {
    username,
    socketId,
    timeout: null,
    data: {},
  };
  return sessionId;
};

const getSession = (sessionId) => sessions[sessionId];

const deleteSession = (sessionId) => {
  if (sessions[sessionId]?.timeout) clearTimeout(sessions[sessionId].timeout);
  delete sessions[sessionId];
};

const startDisconnectTimeout = (sessionId) => {
  if (!sessions[sessionId]) return;
  sessions[sessionId].timeout = setTimeout(() => {
    deleteSession(sessionId);
    console.log(`Session ${sessionId} expired after disconnect`);
  }, 120_000);
};

const reviveSession = (sessionId, socketId) => {
  const s = sessions[sessionId];
  if (!s) return false;
  s.socketId = socketId;
  if (s.timeout) {
    clearTimeout(s.timeout);
    s.timeout = null;
  }
  return true;
};

module.exports = {
  sessions,
  createSession,
  getSession,
  deleteSession,
  startDisconnectTimeout,
  reviveSession,
};
