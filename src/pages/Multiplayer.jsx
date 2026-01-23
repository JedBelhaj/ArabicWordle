import Chat from "../components/Chat";
import Game from "../components/Game";
import Players from "../components/Players";
function Multiplayer() {
  return (
    <div className="dark:bg-neutral-900 w-screen min-h-screen bg-neutral-100 flex">
      {/* Board Section */}
      <div className="w-3/4 h-screen bg-neutral-800 flex items-center justify-center flex-col">
        <Game />
      </div>
      {/* /* Players & Chat Section */}
      <div className="w-1/4 h-screen border-l border-neutral-700">
        <div className="h-1/2 max-h-1/2 bg-neutral-900 overflow-y-auto border-b border-neutral-700">
          <Players />
        </div>
        {/* Chat Section */}
        <div className="h-1/2 bg-neutral-80">
          <Chat />
        </div>
      </div>
    </div>
  );
}

export default Multiplayer;
