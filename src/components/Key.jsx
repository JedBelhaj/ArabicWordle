import { getStateColor } from "../utils";

function Key({ char, state, onClick }) {
  const color = getStateColor(state);
  return (
    <button
      type="button"
      onClick={onClick}
      className={`${color} h-9 w-9 uppercase flex items-center justify-center m-1 text-lg font-semibold rounded-lg shadow-sm cursor-pointer hover:brightness-110 active:scale-95 transition`}
    >
      {char}
    </button>
  );
}

export default Key;
