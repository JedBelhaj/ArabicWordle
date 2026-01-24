import { useNavigate } from "react-router";
import RainDropEffect from "../components/effects/RainDropEffect";
import { socket } from "../socket";
import { useEffect, useState } from "react";
function Index() {
  const [name, setName] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    socket.on("room:created", ({ roomId, sessionId }) => {
      localStorage.setItem("sessionId", sessionId);
      console.log("Room created with ID:", roomId);
      navigate(`/multiplayer/${roomId}`);
    });
  }, []);

  const handleMultiplayerClick = () => {
    socket.emit("room:create", name || "Guest");
  };

  return (
    <div className="bg-gradient-to-t from-slate-900 to-zinc-900 w-screen min-h-screen flex justify-center items-center flex-col">
      <div className="flex flex-col justify-center items-center z-10">
        <h1 className="text-white text-5xl font-bold">
          Welcome to Wordle Multiplayer!
        </h1>
        <input
          type="text"
          placeholder="Enter your name"
          className="mt-5 p-3 rounded-lg bg-slate-900 text-white font-semibold placeholder:font-normal placeholder:text-gray-500"
          onChange={(e) => setName(e.target.value)}
        />
        <div className="m-10 gap-5 flex">
          <button
            onClick={() => navigate("/singleplayer")}
            className="bg-green-400 p-4 rounded-2xl font-bold hover:scale-105 transition-all duration-300 cursor-pointer hover:bg-red-500"
          >
            Single Player
          </button>
          <button
            onClick={handleMultiplayerClick}
            className="bg-yellow-400 p-4 rounded-2xl font-bold hover:scale-105 transition-all duration-300 cursor-pointer hover:bg-red-500"
          >
            Multiplayer
          </button>
        </div>
      </div>

      <RainDropEffect letterCount={100} />
    </div>
  );
}

export default Index;
