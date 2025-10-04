import Box from "./Box";
import WORD_LENGTH from "../constants.js";

function Row(props) {
  const { word, goal, submitted } = props;
  console.log(props);

  let states = [0, 0, 0, 0, 0];
  const charState = () => {
    let goal_ = [...goal];
    let word_ = [...word];
    for (let i = 0; i < WORD_LENGTH; i++) {
      if (word_[i] == goal_[i]) {
        states[i] = 3;
        goal_[i] = "_";
        word_[i] = "_";
      } else if (goal_.indexOf(word_[i]) === -1) {
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
