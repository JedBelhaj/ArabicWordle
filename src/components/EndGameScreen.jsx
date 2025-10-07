import { useState } from "react";

function EndGameScreen(props) {
  const [opacity, setOpacity] = useState(0);
  setTimeout(() => {
    setOpacity(100);
  }, 200);

  const { win, reset, goal } = props;
  return (
    <div
      className={`transition-all opacity-${opacity} duration-300 absolute w-screen h-svw bg-black/20 backdrop-blur-xs flex items-center justify-center`}
    >
      <div className="min-w-xl min-h-60 bg-neutral-50 rounded-4xl flex items-center justify-center flex-col">
        <h1 className="font-bold text-6xl m-5 text-center">
          You {win ? "win! 🎉" : "lost! ☹️"}
        </h1>
        <h1 className="mb-4 text-2xl">{"the word was " + goal}</h1>
        <div>
          <button
            onClick={reset}
            className="bg-green-600 px-6 py-3 rounded-2xl text-white hover:cursor-pointer hover:scale-105 transition-transform duration-200 ease-in-out"
          >
            Restart
          </button>
        </div>
      </div>
    </div>
  );
}

export default EndGameScreen;
