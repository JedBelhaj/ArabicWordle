import { useState } from "react";

function EndGameScreen(props) {
  const [opacity, setOpacity] = useState("opacity-0");
  setTimeout(() => {
    setOpacity("opacity-100");
  }, 200);

  const { win, reset, goal, grid, strings } = props;

  return (
    <div
      className={`z-50 p-5 dark:text-white transition-all ${opacity} duration-300 absolute h-full w-3/4 bg-black/20 backdrop-blur-xs flex items-center justify-center`}
    >
      <div className="min-w-xl min-h-60 dark:bg-neutral-800 bg-neutral-50 rounded-4xl flex items-center justify-center flex-col">
        <h1 className=" font-bold text-6xl m-5 text-center">
          {win ? strings.win : strings.lose}
        </h1>
        <h1 className="text-2xl">{strings.wordWas + goal}</h1>
        <div className="scale-75 -m-10 text-black">{grid}</div>
        <div>
          <button
            onClick={reset}
            className="bg-green-600 px-6 py-3 mb-8 rounded-2xl text-white hover:cursor-pointer hover:scale-105 transition-transform duration-200 ease-in-out"
          >
            {strings.restart}
          </button>
        </div>
      </div>
    </div>
  );
}

export default EndGameScreen;
