const { getRandomWord, isValidWord, normalize } = require("./wordbank");
const { computeGuessStates } = require("./wordEngine");
const { getRoomDetails } = require("./roomHandlers");

const ROUND_END_DELAY_MS = 4000;
const ROUND_SCORE_POINTS = [10, 7, 5, 3, 2, 1];

function startGame(io, roomId) {
  const room = getRoomDetails(roomId);
  if (!room) return;

  room.status = "playing";
  room.game = {
    roundIndex: 0,
    scores: Object.fromEntries(room.players.map((id) => [id, 0])),
    timer: null,
    nextRoundTimer: null,
  };
  startRound(io, roomId);
}

function startRound(io, roomId) {
  const room = getRoomDetails(roomId);
  if (!room || !room.game) return;
  const { language, wordLength, timeLimit } = room.settings;

  clearTimeout(room.game.timer);
  clearTimeout(room.game.nextRoundTimer);

  room.status = "playing";
  room.game.roundIndex += 1;
  room.game.goal = getRandomWord(language, wordLength);
  room.game.startedAt = Date.now();
  room.game.playerStates = Object.fromEntries(
    room.players.map((id) => [
      id,
      { guesses: [], finished: false, won: false, finishedAt: null },
    ]),
  );

  if (timeLimit > 0) {
    room.game.timer = setTimeout(() => endRound(io, roomId), timeLimit * 1000);
  }

  io.to(roomId).emit("game:roundStart", {
    roundIndex: room.game.roundIndex,
    totalRounds: room.settings.rounds,
    wordLength,
    tries: room.settings.tries,
    timeLimit,
    language,
    startedAt: room.game.startedAt,
  });
}

function submitGuess(io, roomId, sessionId, rawGuess) {
  const room = getRoomDetails(roomId);
  if (!room || room.status !== "playing" || !room.game) return { valid: false };

  const { language, wordLength, tries } = room.settings;
  const playerState = room.game.playerStates[sessionId];
  if (!playerState || playerState.finished) return { valid: false };

  const guess = normalize(language, String(rawGuess || ""));
  if (guess.length !== wordLength || !isValidWord(language, wordLength, guess)) {
    return { valid: false };
  }

  const goal = normalize(language, room.game.goal);
  const states = computeGuessStates(guess, goal, wordLength);
  const correct = guess === goal;

  playerState.guesses.push({ guess, states });
  if (correct || playerState.guesses.length >= tries) {
    playerState.finished = true;
    playerState.won = correct;
    playerState.finishedAt = Date.now();
  }

  io.to(roomId).emit("game:progress", {
    sessionId,
    triesUsed: playerState.guesses.length,
    finished: playerState.finished,
    won: playerState.won,
    lastStates: states,
  });

  const allFinished = room.players.every((id) => room.game.playerStates[id]?.finished);
  if (allFinished) endRound(io, roomId);

  return { valid: true, states, correct };
}

function computeRoundScores(room) {
  const finishers = room.players
    .map((id) => ({ id, state: room.game.playerStates[id] }))
    .filter((p) => p.state?.won);

  if (room.settings.scoreMode === "fewerTries") {
    finishers.sort((a, b) => a.state.guesses.length - b.state.guesses.length);
  } else {
    finishers.sort((a, b) => a.state.finishedAt - b.state.finishedAt);
  }

  const roundScores = {};
  finishers.forEach((p, i) => {
    roundScores[p.id] = ROUND_SCORE_POINTS[i] ?? 1;
  });
  return roundScores;
}

function endRound(io, roomId) {
  const room = getRoomDetails(roomId);
  if (!room || room.status !== "playing" || !room.game) return;

  clearTimeout(room.game.timer);
  room.status = "roundEnd";

  const roundScores = computeRoundScores(room);
  for (const [id, points] of Object.entries(roundScores)) {
    room.game.scores[id] = (room.game.scores[id] || 0) + points;
  }

  const results = room.players.map((id) => ({
    sessionId: id,
    guesses: room.game.playerStates[id]?.guesses ?? [],
    won: room.game.playerStates[id]?.won ?? false,
    roundPoints: roundScores[id] ?? 0,
  }));

  io.to(roomId).emit("game:roundEnd", {
    goal: room.game.goal,
    results,
    scores: room.game.scores,
    roundIndex: room.game.roundIndex,
    totalRounds: room.settings.rounds,
  });

  const isFinalRound = room.game.roundIndex >= room.settings.rounds;
  room.game.nextRoundTimer = setTimeout(() => {
    const current = getRoomDetails(roomId);
    if (current?.status !== "roundEnd") return;
    if (isFinalRound) {
      current.status = "gameEnd";
      io.to(roomId).emit("game:over", { scores: current.game.scores });
    } else {
      startRound(io, roomId);
    }
  }, ROUND_END_DELAY_MS);
}

module.exports = { startGame, startRound, submitGuess, endRound };
