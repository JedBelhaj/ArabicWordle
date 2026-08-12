function RoundEndScreen({ roundEndInfo, players }) {
  const { goal, results, scores, roundIndex, totalRounds } = roundEndInfo;
  const usernames = Object.fromEntries(players.map((p) => [p.sessionId, p.username]));

  const sortedResults = [...results].sort((a, b) => b.roundPoints - a.roundPoints);
  const sortedScores = Object.entries(scores).sort((a, b) => b[1] - a[1]);

  return (
    <div className="text-white flex flex-col items-center p-8 max-w-lg">
      <p className="text-gray-400 mb-2">
        Round {roundIndex} / {totalRounds}
      </p>
      <h1 className="font-bold text-5xl mb-6">{goal}</h1>

      <div className="w-full bg-neutral-900/60 rounded-xl p-4 mb-4">
        <h2 className="font-semibold mb-2">Round results</h2>
        <ul className="space-y-1 text-sm">
          {sortedResults.map((r) => (
            <li key={r.sessionId} className="flex justify-between">
              <span>
                {usernames[r.sessionId] ?? "Guest"} {r.won ? "✅" : "❌"} ({r.guesses.length} tries)
              </span>
              <span className="text-indigo-300">+{r.roundPoints}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="w-full bg-neutral-900/60 rounded-xl p-4">
        <h2 className="font-semibold mb-2">Total score</h2>
        <ul className="space-y-1 text-sm">
          {sortedScores.map(([sessionId, score]) => (
            <li key={sessionId} className="flex justify-between">
              <span>{usernames[sessionId] ?? "Guest"}</span>
              <span>{score}</span>
            </li>
          ))}
        </ul>
      </div>

      <p className="text-gray-400 text-sm mt-6">Next round starting…</p>
    </div>
  );
}

export default RoundEndScreen;
