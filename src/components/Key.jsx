import { getStateColor } from "../utils";

function Key(props) {
  const { char, state } = props;
  const color = getStateColor(state);
  return (
    <div
      className={`${color} h-13 w-13 uppercase flex items-center justify-center m-1 text-2xl font-semibold rounded-lg shadow-sm`}
    >
      {char}
    </div>
  );
}

export default Key;
