import { useEffect, useState } from "react";
import Key from "./Key";
import { alpha, keyboardStates } from "../utils";

function Keyboard(props) {
  const { words, goal, wordCount } = props;

  const [states, setStates] = useState(keyboardStates);

  useEffect(() => {
    setStates(keyboardStates);
  }, [wordCount]);

  return (
    <div className="flex max-w-xl h-fit flex-wrap justify-center my-10">
      {[...alpha].map((char, i) => (
        <Key key={i} state={states[i]} char={char} />
      ))}
    </div>
  );
}

export default Keyboard;
