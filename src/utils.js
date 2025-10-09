export const getStateColor = (state) => {
  switch (state) {
    case 0:
      return "bg-neutral-300 dark:bg-neutral-500";
      break;
    case 1:
      return "bg-neutral-400 dark:bg-neutral-700";
      break;
    case 2:
      return "bg-yellow-400";
      break;
    case 3:
      return "bg-green-400";
      break;
    default:
      return "bg-neutral-300 dark:bg-neutral-500";
      break;
  }
};

export const alpha = "abcdefghijklmnopqrstuvwxyz";
export let keyboardStates = [...alpha].map((x) => 0);

export const resetKeyboard = () => {
  keyboardStates = [...alpha].map((x) => 0);
};

export const setKeyboardStates = (word, states) => {
  console.log("setting kb states: ", word, states);

  for (let i = 0; i < word.length; i++) {
    setKeyState(alpha.indexOf(word[i]), states[i]);
  }
};

export const setKeyState = (key, state) => {
  if (state > keyboardStates[key]) {
    keyboardStates[key] = state;
  }
};

export default { getStateColor, keyboardStates, alpha };
