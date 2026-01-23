import { useEffect, useRef, useState } from "react";
import WORD_LENGTH from "../constants";
import EndGameScreen from "../components/EndGameScreen";
import Grid from "../components/Grid";
import Keyboard from "../components/Keyboard";
import { resetKeyboard } from "../utils";
import { alpha } from "../utils";

function Game({ mode }) {
  const [game, setGame] = useState(false);
  const [win, setWin] = useState(false);
  const [wordCount, setWordCount] = useState(0);
  const [words, setWords] = useState(["", "", "", "", "", ""]);
  const [goal, setGoal] = useState("");

  const isFocusedRef = useRef(false);
  const containerRef = useRef(null);
  let wordsRef = useRef(["", "", "", "", "", ""]);
  let wordCountRef = useRef(0);

  useEffect(() => {
    fetch("https://random-word-api.vercel.app/api?words=1&length=5")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setGoal(data[0]);
        }
      });
  }, []);

  // autofocus the game container once the goal word is ready
  useEffect(() => {
    if (goal && containerRef.current) {
      containerRef.current.focus();
      isFocusedRef.current = true;
    }
  }, [goal]);

  useEffect(() => {
    const handleInput = (e) => {
      // Only allow input if goal is set and game is not over
      if (!goal || game) {
        document.removeEventListener("keyup", handleInput);
        return;
      }
      if (!isFocusedRef.current) return;

      const handlerWordCount = wordCountRef.current;

      const updateWord = (nextWord) => {
        const nextWords = [...wordsRef.current];
        nextWords.splice(handlerWordCount, 1, nextWord);
        setWords([...nextWords]);
        wordsRef.current = [...nextWords];
      };
      if (
        e.key.length === 1 &&
        wordsRef.current[handlerWordCount].length < WORD_LENGTH &&
        e.key !== " " &&
        alpha.indexOf(e.key) !== -1
      ) {
        const char = e.key;
        const nextWord = wordsRef.current[handlerWordCount].concat(char);
        updateWord(nextWord);
      } else if (
        e.key === "Backspace" &&
        wordsRef.current[handlerWordCount].length > 0
      ) {
        const nextWord = wordsRef.current[handlerWordCount].substring(
          0,
          wordsRef.current[handlerWordCount].length - 1,
        );
        updateWord(nextWord);
      } else if (
        e.key === "Enter" &&
        wordsRef.current[handlerWordCount].length === WORD_LENGTH
      ) {
        const currentWord = wordsRef.current[handlerWordCount];
        // Increment wordCount first so Grid knows to color this row
        wordCountRef.current++;
        setWordCount(wordCountRef.current);

        // Then check if it's a winning guess
        if (currentWord === goal) {
          setGame(true);
          setWin(true);
        }
      }
    };
    document.addEventListener("keyup", handleInput);
    return () => document.removeEventListener("keyup", handleInput);
  }, [game, goal]);

  useEffect(() => {
    if (wordCount == 6) {
      setGame(true);
    }
  }, [wordCount]);

  const resetGame = () => {
    setGame(false);
    setWin(false);
    setWordCount(0);
    setWords(["", "", "", "", "", ""]);
    wordsRef.current = ["", "", "", "", "", ""];
    wordCountRef.current = 0;
    resetKeyboard();
  };

  const grid = <Grid words={words} wordCount={wordCount} goal={goal} />;

  return (
    <div
      tabIndex={goal ? 0 : -1} // Only focusable if goal is set
      onFocus={() => {
        isFocusedRef.current = true;
      }}
      onBlur={() => {
        isFocusedRef.current = false;
      }}
      className={`w-full flex flex-col items-center justify-center min-h-screen p-4`}
    >
      {game && (
        <EndGameScreen reset={resetGame} win={win} goal={goal} grid={grid} />
      )}
      {
        <h1 className="dark:text-white font-bold text-6xl m-5">
          The word is {goal}
        </h1>
      }
      {grid}
      <Keyboard words={words} goal={goal} wordCount={wordCount} />
    </div>
  );
}

export default Game;
