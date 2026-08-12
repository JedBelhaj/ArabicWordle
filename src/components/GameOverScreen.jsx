function GameOverScreen({ gameOverInfo, players, isHost, onPlayAgain, onLeave }) {
  const { scores } = gameOverInfo;
  const usernames = Object.fromEntries(players.map((p) => [p.sessionId, p.username]));
  const ranked = Object.entries(scores).sort((a, b) => b[1] - a[1]);
  const topScore = ranked[0]?.[1] ?? 0;
  const winners = ranked.filter(([, score]) => score === topScore && score > 0);

  return (
    <div className="text-white flex flex-col items-center p-8 max-w-lg">
      <h1 className="font-bold text-5xl mb-2">Game over 🏁</h1>
      {winners.length === 1 && (
        <p className="text-indigo-300 mb-6">
          🏆 {usernames[winners[0][0]] ?? "Guest"} wins!
        </p>
      )}
      {winners.length > 1 && (
        <p className="text-indigo-300 mb-6">🏆 It's a tie!</p>
      )}
      {winners.length === 0 && (
        <p className="text-gray-400 mb-6">No one scored this game.</p>
      )}

      <div className="w-full bg-neutral-900/60 rounded-xl p-4 mb-6">
        <h2 className="font-semibold mb-2">Final scores</h2>
        <ul className="space-y-1 text-sm">
          {ranked.map(([sessionId, score], i) => (
            <li key={sessionId} className="flex justify-between">
              <span>
                #{i + 1} {usernames[sessionId] ?? "Guest"}
              </span>
              <span>{score}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="flex gap-3">
        {isHost ? (
          <button
            onClick={() => onPlayAgain()}
            className="bg-green-600 px-6 py-3 rounded-2xl hover:cursor-pointer hover:scale-105 transition-transform duration-200 ease-in-out"
          >
            Play again
          </button>
        ) : (
          <span className="text-gray-400 self-center text-sm">
            Waiting for host to start a new game…
          </span>
        )}
        <button
          onClick={onLeave}
          className="bg-neutral-700 px-6 py-3 rounded-2xl hover:cursor-pointer hover:scale-105 transition-transform duration-200 ease-in-out"
        >
          Back home
        </button>
      </div>
    </div>
  );
}

export default GameOverScreen;
