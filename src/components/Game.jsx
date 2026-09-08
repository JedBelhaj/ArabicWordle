import { useEffect, useRef, useState } from "react";
import EndGameScreen from "../components/EndGameScreen";
import Grid from "../components/Grid";
import Keyboard from "../components/Keyboard";
import { LANGUAGES, WORD_LENGTHS, getRandomWord, isValidWord, normalize } from "../lib/wordbank";
import { computeGuessStates } from "../lib/wordEngine";

const STRINGS = {
  arabic: {
    title: "ووردل",
    win: "لقد فزت! 🎉",
    lose: "لقد خسرت! ☹️",
    wordWas: "الكلمة كانت ",
    restart: "إعادة",
    notEnough: "لا توجد أحرف كافية",
    notInList: "الكلمة غير موجودة في القاموس",
    backspace: "⌫",
    enter: "إدخال",
    language: "اللغة",
    length: "طول الكلمة",
  },
  english: {
    title: "Wordle",
    win: "You win! 🎉",
    lose: "You lost! ☹️",
    wordWas: "the word was ",
    restart: "Restart",
    notEnough: "Not enough letters",
    notInList: "Not in word list",
    backspace: "⌫",
    enter: "Enter",
    language: "Language",
    length: "Word length",
  },
};

function mergeKeyboardStates(prev, alphabet, word, states) {
  const next = [...prev];
  for (let i = 0; i < word.length; i++) {
    const key = alphabet.indexOf(word[i]);
    if (key === -1) continue;
    if (states[i] > next[key]) next[key] = states[i];
  }
  return next;
}

function Game({ multiplayer }) {
  const isMultiplayer = Boolean(multiplayer);

  const [language, setLanguage] = useState(multiplayer?.language ?? "arabic");
  const [wordLength, setWordLength] = useState(multiplayer?.wordLength ?? 5);
  const tries = multiplayer?.tries ?? 6;
  const strings = STRINGS[language];
  const alphabet = LANGUAGES[language].alphabet;

  // Resuming a round after a reconnect (e.g. page refresh) means the server
  // hands back this player's guesses so far — prefill the board with them
  // instead of starting from a blank round the player already made progress in.
  const initialGuesses = multiplayer?.initialGuesses ?? [];

  const [goal, setGoal] = useState(() =>
    isMultiplayer ? null : getRandomWord(language, wordLength),
  );
  const [guesses, setGuesses] = useState(() => {
    const base = Array(tries).fill("");
    initialGuesses.forEach((g, i) => {
      if (i < tries) base[i] = g.guess;
    });
    return base;
  });
  const [results, setResults] = useState(() => {
    const base = Array(tries).fill(null);
    initialGuesses.forEach((g, i) => {
      if (i < tries) base[i] = g.states;
    });
    return base;
  });
  const [currentIndex, setCurrentIndex] = useState(() =>
    Math.min(initialGuesses.length, tries),
  );
  const [status, setStatus] = useState(() => {
    if (multiplayer?.initialFinished) return multiplayer.initialWon ? "won" : "lost";
    return "playing";
  }); // playing | won | lost
  const [keyboardStates, setKeyboardStates] = useState(() => {
    let states = Array(alphabet.length).fill(0);
    for (const g of initialGuesses) {
      states = mergeKeyboardStates(states, alphabet, g.guess, g.states);
    }
    return states;
  });
  const [error, setError] = useState("");
  const [shake, setShake] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [nowTick, setNowTick] = useState(() => Date.now());

  const isFocusedRef = useRef(true);
  const containerRef = useRef(null);
  const errorTimeoutRef = useRef(null);

  const timeLimit = multiplayer?.timeLimit ?? 0;
  const startedAt = multiplayer?.startedAt ?? null;

  useEffect(() => {
    if (!isMultiplayer || !timeLimit) return;
    const id = setInterval(() => setNowTick(Date.now()), 500);
    return () => clearInterval(id);
  }, [isMultiplayer, timeLimit, startedAt]);

  let remainingSeconds = null;
  let remainingRatio = 1;
  if (isMultiplayer && timeLimit && startedAt) {
    const remainingMs = Math.max(0, timeLimit * 1000 - (nowTick - startedAt));
    remainingSeconds = Math.ceil(remainingMs / 1000);
    remainingRatio = remainingMs / (timeLimit * 1000);
  }
  const timerLevel = remainingRatio > 0.5 ? "green" : remainingRatio > 0.2 ? "yellow" : "red";
  const timerTextClass = {
    green: "text-green-400",
    yellow: "text-yellow-400",
    red: "text-red-500",
  }[timerLevel];
  const timerBarClass = {
    green: "bg-green-400",
    yellow: "bg-yellow-400",
    red: "bg-red-500",
  }[timerLevel];

  useEffect(() => {
    containerRef.current?.focus();
  }, []);

  useEffect(() => {
    return () => clearTimeout(errorTimeoutRef.current);
  }, []);

  const flashError = (message) => {
    setError(message);
    setShake(true);
    clearTimeout(errorTimeoutRef.current);
    errorTimeoutRef.current = setTimeout(() => {
      setError("");
      setShake(false);
    }, 1200);
  };

  const resetGame = (nextLanguage = language, nextWordLength = wordLength) => {
    clearTimeout(errorTimeoutRef.current);
    setLanguage(nextLanguage);
    setWordLength(nextWordLength);
    setGoal(isMultiplayer ? null : getRandomWord(nextLanguage, nextWordLength));
    setGuesses(Array(tries).fill(""));
    setResults(Array(tries).fill(null));
    setCurrentIndex(0);
    setStatus("playing");
    setKeyboardStates(Array(LANGUAGES[nextLanguage].alphabet.length).fill(0));
    setError("");
    setShake(false);
    containerRef.current?.focus();
  };

  const handleChar = (char) => {
    if (status !== "playing" || submitting) return;
    setGuesses((prev) => {
      if (prev[currentIndex].length >= wordLength) return prev;
      const next = [...prev];
      next[currentIndex] = next[currentIndex] + char;
      return next;
    });
  };

  const handleBackspace = () => {
    if (status !== "playing" || submitting) return;
    setGuesses((prev) => {
      if (prev[currentIndex].length === 0) return prev;
      const next = [...prev];
      next[currentIndex] = next[currentIndex].slice(0, -1);
      return next;
    });
  };

  const handleEnter = async () => {
    if (status !== "playing" || submitting) return;
    const word = guesses[currentIndex];
    if (word.length !== wordLength) {
      flashError(strings.notEnough);
      return;
    }

    setSubmitting(true);
    try {
      let states, correct;
      if (isMultiplayer) {
        const res = await multiplayer.onGuess(word);
        if (!res.valid) {
          flashError(strings.notInList);
          return;
        }
        states = res.states;
        correct = res.correct;
      } else {
        if (!isValidWord(language, wordLength, word)) {
          flashError(strings.notInList);
          return;
        }
        const normalizedWord = normalize(language, word);
        const normalizedGoal = normalize(language, goal);
        states = computeGuessStates(normalizedWord, normalizedGoal, wordLength);
        correct = normalizedWord === normalizedGoal;
      }

      setResults((prev) => {
        const next = [...prev];
        next[currentIndex] = states;
        return next;
      });
      setKeyboardStates((prev) => mergeKeyboardStates(prev, alphabet, word, states));

      const nextIndex = currentIndex + 1;
      if (correct) {
        setStatus("won");
      } else if (nextIndex >= tries) {
        setStatus("lost");
      } else {
        setCurrentIndex(nextIndex);
      }
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    const handleKeyUp = (e) => {
      if (!isFocusedRef.current) return;
      if (e.key === "Backspace") {
        handleBackspace();
      } else if (e.key === "Enter") {
        handleEnter();
      } else if (e.key.length === 1 && alphabet.includes(normalize(language, e.key))) {
        handleChar(normalize(language, e.key));
      }
    };
    document.addEventListener("keyup", handleKeyUp);
    return () => document.removeEventListener("keyup", handleKeyUp);
  });

  const dir = LANGUAGES[language].dir;

  const grid = (
    <Grid guesses={guesses} results={results} wordLength={wordLength} />
  );

  return (
    <div
      ref={containerRef}
      dir={dir}
      tabIndex={0}
      onFocus={() => {
        isFocusedRef.current = true;
      }}
      onBlur={() => {
        isFocusedRef.current = false;
      }}
      className="w-full flex flex-col items-center justify-center min-h-screen p-4"
    >
      {status !== "playing" && !isMultiplayer && (
        <EndGameScreen
          reset={() => resetGame()}
          win={status === "won"}
          goal={goal}
          grid={grid}
          strings={strings}
        />
      )}

      <h1 className="dark:text-white font-bold text-6xl m-5">{strings.title} 😝</h1>

      {isMultiplayer && multiplayer.roundIndex && (
        <p className="text-gray-400 text-sm mb-2">
          Round {multiplayer.roundIndex} / {multiplayer.totalRounds}
        </p>
      )}

      {isMultiplayer && remainingSeconds !== null && (
        <div className="w-48 mb-3">
          <div className={`text-center text-sm font-semibold mb-1 ${timerTextClass}`}>
            {remainingSeconds}s
          </div>
          <div className="h-1.5 rounded-full bg-neutral-700 overflow-hidden">
            <div
              className={`h-full ${timerBarClass} transition-all duration-500 ease-linear`}
              style={{ width: `${Math.max(0, Math.min(100, remainingRatio * 100))}%` }}
            />
          </div>
        </div>
      )}

      {isMultiplayer && status !== "playing" && (
        <div className="mb-3 text-center dark:text-white">
          <p className="font-bold text-2xl">{status === "won" ? strings.win : strings.lose}</p>
          <p className="text-gray-400 text-sm mt-1">Waiting for other players…</p>
        </div>
      )}

      {!isMultiplayer && (
        <div className="flex gap-4 mb-4 dark:text-white text-sm">
          <label className="flex items-center gap-2">
            {strings.language}
            <select
              value={language}
              onChange={(e) => resetGame(e.target.value, wordLength)}
              className="bg-neutral-200 dark:bg-neutral-800 rounded-md px-2 py-1"
            >
              {Object.entries(LANGUAGES).map(([code, cfg]) => (
                <option key={code} value={code}>
                  {cfg.label}
                </option>
              ))}
            </select>
          </label>
          <label className="flex items-center gap-2">
            {strings.length}
            <select
              value={wordLength}
              onChange={(e) => resetGame(language, Number(e.target.value))}
              className="bg-neutral-200 dark:bg-neutral-800 rounded-md px-2 py-1"
            >
              {WORD_LENGTHS.map((len) => (
                <option key={len} value={len}>
                  {len}
                </option>
              ))}
            </select>
          </label>
        </div>
      )}

      {error && (
        <div className="mb-2 px-3 py-1 rounded-md bg-red-600 text-white text-sm">
          {error}
        </div>
      )}

      <div className={shake ? "animate-[shake_0.3s]" : ""}>{grid}</div>

      <Keyboard
        alphabet={alphabet}
        states={keyboardStates}
        onChar={handleChar}
        onBackspace={handleBackspace}
        onEnter={handleEnter}
        backspaceLabel={strings.backspace}
        enterLabel={strings.enter}
      />
    </div>
  );
}

export default Game;
