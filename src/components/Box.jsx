import { useEffect, useState } from "react";
import { getStateColor } from "../utils.js";

function Box(props) {
  const { char, state, delay } = props;
  const [scale, setScale] = useState("scale-100");
  const [color, setColor] = useState(getStateColor(0));

  useEffect(() => {
    if (char === "") return;
    setScale("scale-125");
    setTimeout(() => {
      setScale("scale-100");
    }, 100);
  }, [char]);

  useEffect(() => {
    console.log(scale);
  }, [scale]);

  useEffect(() => {
    setTimeout(
      () => {
        setColor(getStateColor(state));
      },
      state === 0 ? 0 : delay * 50
    );
  });

  return (
    <div
      className={`-z-[0] box ${color} ${scale} transition-all duration-300 h-22 w-22 rounded-3xl flex items-center justify-center text-6xl uppercase font-bold`}
    >
      {char}
    </div>
  );
}

export default Box;
