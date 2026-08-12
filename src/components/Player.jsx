import { getStateColor } from "../utils";

function Player({ player, state, tries, isSelf }) {
  return (
    <div className="bg-neutral-800 m-1 rounded-lg p-2 flex items-center justify-between text-white">
      <span>
        {player.username}
        {isSelf ? " (you)" : ""}
        {player.isHost ? " 👑" : ""}
        {state?.finished ? (state.won ? " ✅" : " ❌") : ""}
      </span>
      <SmallGrid history={state?.history ?? []} tries={tries} />
    </div>
  );
}

function SmallGrid({ history, tries }) {
  const rows = Array.from({ length: tries }, (_, i) => history[i] ?? null);
  return (
    <div className="flex flex-col gap-[1px] mr-4">
      {rows.map((row, index) => (
        <div className="flex gap-[1px]" key={index}>
          {row
            ? row.map((s, i) => (
                <div className={`${getStateColor(s)} rounded-xs w-2 h-2`} key={i} />
              ))
            : (
                <div className="rounded-xs w-2 h-2 bg-neutral-700/50" />
              )}
        </div>
      ))}
    </div>
  );
}

export default Player;
