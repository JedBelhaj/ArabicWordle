import { useEffect, useState } from "react";
import Key from "./Key";

function Keyboard(props) {
  const { words, goal, wordCount } = props;
  const engChars = "abcdefghijklmnopqrstuvwxyz";
  const [states, setStates] = useState([...engChars].map((x) => -1));

  const getStates = () => {
    const wordChars = [...words].map((x) => [...x]).flat();

    console.log(wordChars);

    const goalChars = [...goal];
    console.log(goalChars);

    return [...engChars].map((char) => {
      if (wordChars.indexOf(char) !== -1) {
        if (goalChars.indexOf(char) !== -1) {
          return 1; // exists
        } else {
          return 0; // doesnt exist
        }
      } else {
        return -1; // not typed yet
      }
    });
  };
  useEffect(() => {
    setStates(getStates);
    console.log(states);
  }, [wordCount]);
  console.log(states);

  return (
    <div className="flex max-w-xl h-fit flex-wrap justify-center my-10">
      {[...engChars].map((char, i) => (
        <Key key={i} state={states[i]} char={char} />
      ))}
    </div>
  );
}

export default Keyboard;
