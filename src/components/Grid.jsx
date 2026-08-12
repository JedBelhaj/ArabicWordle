import Row from "./Row";

function Grid({ guesses, results, wordLength }) {
  return (
    <div className="flex flex-col gap-2">
      {guesses.map((word, index) => (
        <Row word={word} states={results[index]} wordLength={wordLength} key={index} />
      ))}
    </div>
  );
}

export default Grid;
