import Game from "../components/Game.jsx";

function Main() {
  return (
    <div className="dark:bg-neutral-900 w-screen min-h-screen bg-neutral-100 flex justify-center items-center flex-col">
      <Game mode={1} />
    </div>
  );
}

export default Main;
