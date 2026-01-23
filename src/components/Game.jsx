import { useEffect, useRef, useState } from "react";
import Row from "../components/Row";
import WORD_LENGTH from "../constants";
import EndGameScreen from "../components/EndGameScreen";
import Grid from "../components/Grid";
import Keyboard from "../components/Keyboard";
import { resetKeyboard } from "../utils";
import { alpha } from "../utils";

function Game() {
  const [game, setGame] = useState(false);
  const [win, setWin] = useState(false);
  const [wordCount, setWordCount] = useState(0);
  const [words, setWords] = useState(["", "", "", "", "", ""]);
  const [isFocused, setIsFocused] = useState(false);

  const isFocusedRef = useRef(false);
  let wordsRef = useRef(["", "", "", "", "", ""]);
  let wordCountRef = useRef(0);

  const goal = "grave";

  useEffect(() => {
    const handleInput = (e) => {
      if (game) {
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
        wordCountRef.current++;
        setWordCount(wordCountRef.current);
        if (wordsRef.current[handlerWordCount] === goal) {
          setGame(true);
          setWin(true);
        }
      }
    };
    document.addEventListener("keyup", handleInput);
    return () => document.removeEventListener("keyup", handleInput);
  }, [game]);

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
      tabIndex={0} // Makes the div focusable
      onFocus={() => {
        setIsFocused(true);
        isFocusedRef.current = true;
      }}
      onBlur={() => {
        setIsFocused(false);
        isFocusedRef.current = false;
      }}
      className={`w-full flex flex-col items-center justify-center min-h-screen p-4`}
    >
      {game && (
        <EndGameScreen reset={resetGame} win={win} goal={goal} grid={grid} />
      )}
      {
        <h1 className="dark:text-white font-bold text-6xl m-5">
          Arabic Wordle !
        </h1>
      }
      {grid}
      <Keyboard words={words} goal={goal} wordCount={wordCount} />
    </div>
  );
}

export default Game;
