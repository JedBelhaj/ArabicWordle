import Player from "./Player";
function Players() {
  function getRandomStates() {
    return Array(5)
      .fill(0)
      .map(() => Math.floor(Math.random() * 4));
  }

  const players = [
    {
      name: "Ali",
      status: true,
      states: Array(6).fill(0).map(getRandomStates),
    },
    {
      name: "Sara",
      status: false,
      states: Array(6).fill(0).map(getRandomStates),
    },
    {
      name: "Omar",
      status: true,
      states: Array(6).fill(0).map(getRandomStates),
    },
    {
      name: "Lina",
      status: false,
      states: Array(6).fill(0).map(getRandomStates),
    },
    {
      name: "Youssef",
      status: true,
      states: Array(6).fill(0).map(getRandomStates),
    },
    {
      name: "Youssef",
      status: true,
      states: Array(6).fill(0).map(getRandomStates),
    },
    {
      name: "Youssef",
      status: true,
      states: Array(6).fill(0).map(getRandomStates),
    },
    {
      name: "Youssef",
      status: true,
      states: Array(6).fill(0).map(getRandomStates),
    },
  ];
  return (
    <>
      {players.map((player, index) => (
        <Player data={player} key={index} />
      ))}
    </>
  );
}

export default Players;
