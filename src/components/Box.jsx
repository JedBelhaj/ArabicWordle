import { useEffect, useState } from "react";
import { getStateColor } from "../utils.js";

function Box(props) {
  const { char, state } = props;
  const [scale, setScale] = useState("100");

  useEffect(() => {
    if (char === "") return;
    setScale("125");
    setTimeout(() => {
      setScale("100");
    }, 100);
  }, [char]);

  useEffect(() => {
    console.log(scale);
  }, [scale]);

  const color = getStateColor(state);
  return (
    <div
      className={`box ${color} scale-${scale} transition-all duration-150 h-22 w-22 rounded-3xl flex items-center justify-center text-6xl uppercase font-bold shadow-sm`}
    >
      {char}
    </div>
  );
}

export default Box;
