import Grid from "./Grid";
import { getStateColor } from "../utils";

function Player({ data }) {
  return (
    <div className="bg-neutral-800 m-1 rounded-lg p-2 flex items-center justify-between text-white">
      {data.name} <SmallGrid states={data.states} />
    </div>
  );
}

function SmallGrid({ states }) {
  return (
    <div className="flex flex-col gap-[1px] mr-4">
      {states.map((state, index) => (
        <div className="flex gap-[1px]" key={index}>
          {state.map((s, i) => (
            <div
              className={`${getStateColor(s)} rounded-xs w-2 h-2`}
              key={i}
            ></div>
          ))}
        </div>
      ))}
    </div>
  );
}

export default Player;
