// Box/key states: 0 = empty, 1 = absent, 2 = present (wrong spot), 3 = correct.
export function computeGuessStates(guess, goal, length) {
  const states = Array(length).fill(1);
  const goalChars = [...goal];
  const guessChars = [...guess];

  for (let i = 0; i < length; i++) {
    if (guessChars[i] === goalChars[i]) {
      states[i] = 3;
      goalChars[i] = null;
      guessChars[i] = null;
    }
  }

  for (let i = 0; i < length; i++) {
    if (guessChars[i] === null) continue;
    const idx = goalChars.indexOf(guessChars[i]);
    if (idx !== -1) {
      states[i] = 2;
      goalChars[idx] = null;
    }
  }

  return states;
}
