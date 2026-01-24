const crypto = require("crypto");

const sessions = {};

/** @type {(socketId: string, timeout: Object, data: Object) => string} */
const createSession = (socketId) => {
  const sessionId = crypto.randomUUID();
  sessions[sessionId] = {
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

const handleAuth = (socket) => {
  const sessionId = socket.handshake.auth?.sessionId;
  console.log("old session id", sessionId);

  if (sessionId && reviveSession(sessionId, socket.id)) {
    socket.sessionId = sessionId;
    console.log(`Session ${sessionId} revived for socket ${socket.id}`);
  } else {
    const newSessionId = createSession(socket.id);
    socket.sessionId = newSessionId;
    socket.emit("sessionCreated", { sessionId: newSessionId });
    console.log(`New session ${newSessionId} created for socket ${socket.id}`);
  }
};

const addDataToSession = (sessionId, data) => {
  if (sessions[sessionId]) {
    sessions[sessionId].data = {
      ...sessions[sessionId].data,
      ...data,
    };
  }
};

module.exports = {
  sessions,
  createSession,
  getSession,
  deleteSession,
  startDisconnectTimeout,
  reviveSession,
  handleAuth,
  addDataToSession,
};
