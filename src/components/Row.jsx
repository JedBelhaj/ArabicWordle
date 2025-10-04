import Box from "./Box";
import WORD_LENGTH from "../constants.js";

function Row(props) {
  const { word, goal, submitted } = props;
  console.log(props);

  let states = [0, 0, 0, 0, 0];
  const charState = () => {
    // 0 unsubmitted, 1 char doesnt exist, 2 char in incorrect place, 3 char in correct place
    // return in this form [1, 1, 2, 3, 1]
    tracks = {};
    for (let i = 0; i < WORD_LENGTH; i++) {
      if (word[i] == goal[i]) {
        states[i] = 3;
      } else if (goal.indexOf(word[i]) === -1) {
        states[i] = 1;
      } else {
        states[i] = 2;
      }
      console.log(states);
    }
  };
  if (submitted) {
    charState();
  }

  return (
    <div className="row flex gap-2">
      {Array(WORD_LENGTH)
        .fill(true)
        .map((_, i) => (
          <Box
            char={word.length >= i ? word.charAt(i) : ""}
            state={states[i]}
            key={i}
          />
        ))}
    </div>
  );
}

export default Row;
