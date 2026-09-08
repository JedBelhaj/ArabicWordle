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

  checkRoundCompletion(io, roomId);

  return { valid: true, states, correct };
}

// Ends the round early once every remaining player has finished — called
// after a guess, and after a player leaves mid-round (their departure can
// itself complete the round for whoever's left).
function checkRoundCompletion(io, roomId) {
  const room = getRoomDetails(roomId);
  if (!room || room.status !== "playing" || !room.game) return;
  if (room.players.length === 0) return;
  const allFinished = room.players.every((id) => room.game.playerStates[id]?.finished);
  if (allFinished) endRound(io, roomId);
}

// Strips a departed player out of the in-progress game so they stop
// showing up in the live sidebar and the scoreboard.
function removePlayerFromGame(roomId, sessionId) {
  const room = getRoomDetails(roomId);
  if (!room || !room.game) return;
  delete room.game.playerStates?.[sessionId];
  delete room.game.scores?.[sessionId];
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

  const roundEndPayload = {
    goal: room.game.goal,
    results,
    scores: room.game.scores,
    roundIndex: room.game.roundIndex,
    totalRounds: room.settings.rounds,
  };
  room.lastRoundEnd = roundEndPayload;
  io.to(roomId).emit("game:roundEnd", roundEndPayload);

  const isFinalRound = room.game.roundIndex >= room.settings.rounds;
  room.game.nextRoundTimer = setTimeout(() => {
    const current = getRoomDetails(roomId);
    if (current?.status !== "roundEnd") return;
    if (isFinalRound) {
      current.status = "gameEnd";
      const gameOverPayload = { scores: current.game.scores };
      current.lastGameOver = gameOverPayload;
      io.to(roomId).emit("game:over", gameOverPayload);
    } else {
      startRound(io, roomId);
    }
  }, ROUND_END_DELAY_MS);
}

// Rebuilds everything a client needs to resume mid-game after a reconnect
// (page refresh) — the round's public config, every player's progress for
// the sidebar, this player's own guesses, and the last round-end/game-over
// payload in case they reconnect during one of those screens.
function getRoundRehydration(roomId, sessionId) {
  const room = getRoomDetails(roomId);
  if (!room || !room.game) return {};

  const rehydration = {
    round: {
      roundIndex: room.game.roundIndex,
      totalRounds: room.settings.rounds,
      wordLength: room.settings.wordLength,
      tries: room.settings.tries,
      timeLimit: room.settings.timeLimit,
      language: room.settings.language,
      startedAt: room.game.startedAt,
    },
    progress: Object.fromEntries(
      room.players.map((id) => {
        const state = room.game.playerStates?.[id];
        return [
          id,
          {
            sessionId: id,
            triesUsed: state?.guesses.length ?? 0,
            finished: state?.finished ?? false,
            won: state?.won ?? false,
            history: (state?.guesses ?? []).map((g) => g.states),
          },
        ];
      }),
    ),
    myGuesses: room.game.playerStates?.[sessionId]?.guesses ?? [],
    myFinished: room.game.playerStates?.[sessionId]?.finished ?? false,
    myWon: room.game.playerStates?.[sessionId]?.won ?? false,
  };

  if (room.lastRoundEnd) rehydration.roundEndInfo = room.lastRoundEnd;
  if (room.lastGameOver) rehydration.gameOverInfo = room.lastGameOver;

  return rehydration;
}

module.exports = {
  startGame,
  startRound,
  submitGuess,
  endRound,
  getRoundRehydration,
  checkRoundCompletion,
  removePlayerFromGame,
};
