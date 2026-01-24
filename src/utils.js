import { io } from "socket.io-client";

const socket = io("http://localhost:8000", {
  autoConnect: true,
  transports: ["websocket", "polling"],
});

socket.emit("test", { data: "Hello from client!" });
socket.on("testResponse", (data) => {
  console.log("Received from server:", data);
});

console.log(socket);

export const getStateColor = (state) => {
  switch (state) {
    case 0:
      return "bg-neutral-500";
      break;
    case 1:
      return "bg-neutral-700";
      break;
    case 2:
      return "bg-yellow-400";
      break;
    case 3:
      return "bg-green-400";
      break;
    default:
      return "bg-neutral-500";
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

export const isEnglishWord = (word) => {
  const isEnglish = (text) => franc(text) === "eng";
  console.log(isEnglish("hello world"));
  alert(isEnglish(word));
  return isEnglish(word);
};

export default { getStateColor, keyboardStates, alpha, socket };
