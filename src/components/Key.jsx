import { getStateColor } from "../utils";

function Key(props) {
  const { char, state } = props;
  const color = getStateColor(state);
  return (
    <div
      className={`${color} h-9 w-9 uppercase flex items-center justify-center m-1 text-lg font-semibold rounded-lg shadow-sm`}
    >
      {char}
    </div>
  );
}

export default Key;
