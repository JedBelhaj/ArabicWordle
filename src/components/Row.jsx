import Box from "./Box";

function Row({ word, states, wordLength }) {
  return (
    <div className="row flex gap-2">
      {Array(wordLength)
        .fill(true)
        .map((_, i) => (
          <Box
            char={word.length > i ? word.charAt(i) : ""}
            state={states ? states[i] : 0}
            delay={i}
            key={i}
          />
        ))}
    </div>
  );
}

export default Row;
