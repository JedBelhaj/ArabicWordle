import { useParams } from "react-router";

function WaitingRoom({ roomDetails }) {
  const roomId = useParams().roomId;
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b ">
      <div className="w-full max-w-4xl bg-gray-800/60 backdrop-blur-md border border-gray-700 rounded-2xl shadow-xl overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <div>
            <h1 className="text-white text-2xl font-semibold">
              Waiting for players
            </h1>
            <p className="text-gray-400 text-sm mt-1">
              Players joined:{" "}
              <span className="text-indigo-300 font-medium">
                {roomDetails?.players.length || 0}
              </span>{" "}
              / 6
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <button className="cursor-pointer px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-md text-sm border border-gray-600">
              Room Id : {roomId}
            </button>
            <button className="cursor-pointer px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-md text-sm shadow">
              Start game
            </button>
          </div>
        </div>

        <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 bg-gradient-to-b from-gray-800/40 to-gray-800/20 rounded-lg border border-gray-700 p-5">
            <h2 className="text-white font-medium mb-4">Game Settings</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="wordLength"
                  className="text-sm text-gray-300 block mb-2"
                >
                  Word length
                </label>
                <select
                  id="wordLength"
                  name="wordLength"
                  defaultValue="5"
                  className="w-full bg-gray-900/40 border border-gray-700 text-white rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                >
                  <option value="3">3 letters</option>
                  <option value="4">4 letters</option>
                  <option value="5">5 letters</option>
                  <option value="6">6 letters</option>
                  <option value="7">7 letters</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="tries"
                  className="text-sm text-gray-300 block mb-2"
                >
                  Tries
                </label>
                <input
                  id="tries"
                  name="tries"
                  type="number"
                  min="1"
                  max="20"
                  defaultValue="6"
                  className="w-full bg-gray-900/40 border border-gray-700 text-white rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                />
              </div>

              <div>
                <label
                  htmlFor="rounds"
                  className="text-sm text-gray-300 block mb-2"
                >
                  Rounds
                </label>
                <input
                  id="rounds"
                  name="rounds"
                  type="number"
                  min="1"
                  max="50"
                  defaultValue="3"
                  className="w-full bg-gray-900/40 border border-gray-700 text-white rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                />
              </div>

              <div>
                <label
                  htmlFor="timeLimit"
                  className="text-sm text-gray-300 block mb-2"
                >
                  Time limit (seconds)
                </label>
                <select
                  id="timeLimit"
                  name="timeLimit"
                  defaultValue="60"
                  className="w-full bg-gray-900/40 border border-gray-700 text-white rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
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
                <label
                  htmlFor="language"
                  className="text-sm text-gray-300 block mb-2"
                >
                  Language
                </label>
                <select
                  id="language"
                  name="language"
                  defaultValue="arabic"
                  className="w-full bg-gray-900/40 border border-gray-700 text-white rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                >
                  <option value="arabic">Arabic</option>
                  <option value="english">English</option>
                  <option value="spanish">Spanish</option>
                  <option value="french">French</option>
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
                      defaultChecked
                      className="form-radio text-indigo-500 mr-2"
                    />
                    Fastest time
                  </label>
                  <label className="inline-flex items-center bg-gray-900/30 border border-gray-700 rounded-md px-3 py-2 text-sm text-gray-300">
                    <input
                      type="radio"
                      name="scoreMode"
                      value="fewerTries"
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
                      defaultChecked
                      className="form-radio text-indigo-500 mr-2"
                    />
                    Public (joinable)
                  </label>
                  <label className="inline-flex items-center bg-gray-900/30 border border-gray-700 rounded-md px-3 py-2 text-sm text-gray-300">
                    <input
                      type="radio"
                      name="privacy"
                      value="private"
                      className="form-radio text-indigo-500 mr-2"
                    />
                    Private (invite only)
                  </label>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-b from-gray-800/25 to-transparent rounded-lg border border-gray-700 p-5 flex flex-col justify-between">
            <div>
              <h3 className="text-white font-medium mb-2">Players</h3>
              <ul className="text-sm text-gray-300 space-y-2">
                {roomDetails?.players.map((player, index) => (
                  <li key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="h-8 w-8 rounded-full bg-indigo-600 flex items-center justify-center text-sm font-medium">
                        {player.username.charAt(0).toUpperCase()}
                      </span>
                      <span>
                        {player.username}
                        {index === 0 ? " (host)" : ""}
                      </span>
                    </div>
                    <span className="text-xs text-green-400">Ready</span>
                  </li>
                ))}
                <li className="flex items-center justify-between text-gray-500">
                  <div className="flex items-center gap-3">
                    <span className="h-8 w-8 rounded-full bg-gray-700 flex items-center justify-center text-sm font-medium">
                      –
                    </span>
                    <span>Waiting for players…</span>
                  </div>
                  <span className="text-xs text-gray-500">—</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default WaitingRoom;
