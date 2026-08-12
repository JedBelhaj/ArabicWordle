import Player from "./Player";

function Players({ players, progress, tries, sessionId }) {
  return (
    <>
      {players.map((player) => (
        <Player
          key={player.sessionId}
          player={player}
          state={progress[player.sessionId]}
          tries={tries}
          isSelf={player.sessionId === sessionId}
        />
      ))}
    </>
  );
}

export default Players;
