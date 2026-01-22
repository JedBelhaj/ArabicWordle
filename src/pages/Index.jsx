import { useNavigate } from "react-router";
import RainDropEffect from "../components/effects/RainDropEffect";
function Index() {
  const navigate = useNavigate();

  return (
    <div className="bg-gradient-to-t from-slate-900 to-zinc-900 w-screen min-h-screen flex justify-center items-center flex-col">
      <div className="flex flex-col justify-center items-center z-10">
        <h1 className="text-white text-5xl font-bold">
          Welcome to Wordle Multiplayer!
        </h1>
        <div className="m-10 gap-5 flex">
          <button
            onClick={() => navigate("/singleplayer")}
            className="bg-green-400 p-4 rounded-2xl font-bold hover:scale-105 transition-all duration-300 cursor-pointer hover:bg-red-500"
          >
            Single Player
          </button>
          <button className="bg-yellow-400 p-4 rounded-2xl font-bold hover:scale-105 transition-all duration-300 cursor-pointer hover:bg-red-500">
            Multiplayer
          </button>
        </div>
      </div>

      <RainDropEffect letterCount={30} />
    </div>
  );
}

export default Index;
