import { useEffect, useState } from "react";
import { LANGUAGES, WORD_LENGTHS } from "../lib/wordbank";

function WaitingRoom({ roomId, players, settings, isHost, onStart, onUpdateSettings }) {
  const [form, setForm] = useState(settings);
  const [startError, setStartError] = useState("");

  useEffect(() => {
    setForm(settings);
  }, [settings]);

  if (!form) return null;

  const pushUpdate = (patch) => {
    setForm((prev) => ({ ...prev, ...patch }));
    if (isHost) onUpdateSettings(patch);
  };

  const handleStart = () => {
    setStartError("");
    onStart((res) => {
      if (!res.success) setStartError(res.message || "Could not start game");
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b">
      <div className="w-full max-w-4xl bg-gray-800/60 backdrop-blur-md border border-gray-700 rounded-2xl shadow-xl overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <div>
            <h1 className="text-white text-2xl font-semibold">
              Waiting for players
            </h1>
            <p className="text-gray-400 text-sm mt-1">
              Players joined:{" "}
              <span className="text-indigo-300 font-medium">
                {players.length}
              </span>
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <button className="cursor-pointer px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-md text-sm border border-gray-600">
              Room Id : {roomId}
            </button>
            {isHost ? (
              <button
                onClick={handleStart}
                className="cursor-pointer px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-md text-sm shadow"
              >
                Start game
              </button>
            ) : (
              <span className="px-4 py-2 text-gray-400 text-sm">
                Waiting for host to start…
              </span>
            )}
          </div>
        </div>

        {startError && (
          <div className="mx-6 mt-4 p-2 bg-red-600 text-white rounded-md text-sm">
            {startError}
          </div>
        )}

        <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 bg-gradient-to-b from-gray-800/40 to-gray-800/20 rounded-lg border border-gray-700 p-5">
            <h2 className="text-white font-medium mb-4">Game Settings</h2>

            <fieldset disabled={!isHost} className="contents">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-300 block mb-2">
                    Word length
                  </label>
                  <select
                    value={form.wordLength}
                    onChange={(e) => pushUpdate({ wordLength: Number(e.target.value) })}
                    className="w-full bg-gray-900/40 border border-gray-700 text-white rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 disabled:opacity-60"
                  >
                    {WORD_LENGTHS.map((len) => (
                      <option key={len} value={len}>
                        {len} letters
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-sm text-gray-300 block mb-2">
                    Tries
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="20"
                    value={form.tries}
                    onChange={(e) => setForm((prev) => ({ ...prev, tries: e.target.value }))}
                    onBlur={(e) => pushUpdate({ tries: Number(e.target.value) })}
                    className="w-full bg-gray-900/40 border border-gray-700 text-white rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 disabled:opacity-60"
                  />
                </div>

                <div>
                  <label className="text-sm text-gray-300 block mb-2">
                    Rounds
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="50"
                    value={form.rounds}
                    onChange={(e) => setForm((prev) => ({ ...prev, rounds: e.target.value }))}
                    onBlur={(e) => pushUpdate({ rounds: Number(e.target.value) })}
                    className="w-full bg-gray-900/40 border border-gray-700 text-white rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 disabled:opacity-60"
                  />
                </div>

                <div>
                  <label className="text-sm text-gray-300 block mb-2">
                    Time limit (seconds)
                  </label>
                  <select
                    value={form.timeLimit}
                    onChange={(e) => pushUpdate({ timeLimit: Number(e.target.value) })}
                    className="w-full bg-gray-900/40 border border-gray-700 text-white rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 disabled:opacity-60"
                  >
                    <option value="30">30s</option>
                    <option value="45">45s</option>
                    <option value="60">60s</option>
                    <option value="90">90s</option>
                    <option value="120">120s</option>
                    <option value="0">No limit</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="text-sm text-gray-300 block mb-2">
                    Language
                  </label>
                  <select
                    value={form.language}
                    onChange={(e) => pushUpdate({ language: e.target.value })}
                    className="w-full bg-gray-900/40 border border-gray-700 text-white rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 disabled:opacity-60"
                  >
                    {Object.entries(LANGUAGES).map(([code, cfg]) => (
                      <option key={code} value={code}>
                        {cfg.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <span className="text-sm text-gray-300 block mb-2">
                    Score counting
                  </span>
                  <div className="flex flex-wrap gap-3">
                    <label className="inline-flex items-center bg-gray-900/30 border border-gray-700 rounded-md px-3 py-2 text-sm text-gray-300">
                      <input
                        type="radio"
                        name="scoreMode"
                        value="fastest"
                        checked={form.scoreMode === "fastest"}
                        onChange={() => pushUpdate({ scoreMode: "fastest" })}
                        className="form-radio text-indigo-500 mr-2"
                      />
                      Fastest time
                    </label>
                    <label className="inline-flex items-center bg-gray-900/30 border border-gray-700 rounded-md px-3 py-2 text-sm text-gray-300">
                      <input
                        type="radio"
                        name="scoreMode"
                        value="fewerTries"
                        checked={form.scoreMode === "fewerTries"}
                        onChange={() => pushUpdate({ scoreMode: "fewerTries" })}
                        className="form-radio text-indigo-500 mr-2"
                      />
                      Fewer tries per word
                    </label>
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <span className="text-sm text-gray-300 block mb-2">
                    Game privacy
                  </span>
                  <div className="flex flex-wrap gap-3">
                    <label className="inline-flex items-center bg-gray-900/30 border border-gray-700 rounded-md px-3 py-2 text-sm text-gray-300">
                      <input
                        type="radio"
                        name="privacy"
                        value="public"
                        checked={form.privacy === "public"}
                        onChange={() => pushUpdate({ privacy: "public" })}
                        className="form-radio text-indigo-500 mr-2"
                      />
                      Public (joinable)
                    </label>
                    <label className="inline-flex items-center bg-gray-900/30 border border-gray-700 rounded-md px-3 py-2 text-sm text-gray-300">
                      <input
                        type="radio"
                        name="privacy"
                        value="private"
                        checked={form.privacy === "private"}
                        onChange={() => pushUpdate({ privacy: "private" })}
                        className="form-radio text-indigo-500 mr-2"
                      />
                      Private (invite only)
                    </label>
                  </div>
                </div>
              </div>
            </fieldset>
          </div>

          <div className="bg-gradient-to-b from-gray-800/25 to-transparent rounded-lg border border-gray-700 p-5 flex flex-col justify-between">
            <div>
              <h3 className="text-white font-medium mb-2">Players</h3>
              <ul className="text-sm text-gray-300 space-y-2">
                {players.map((player) => (
                  <li
                    key={player.sessionId}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <span className="h-8 w-8 rounded-full bg-indigo-600 flex items-center justify-center text-sm font-medium">
                        {player.username.charAt(0).toUpperCase()}
                      </span>
                      <span>
                        {player.username}
                        {player.isHost ? " (host)" : ""}
                      </span>
                    </div>
                    <span className="text-xs text-green-400">Ready</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default WaitingRoom;
