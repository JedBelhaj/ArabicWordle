import Row from "./Row";

function Grid(props) {
  const { goal, words, wordCount } = props;
  return (
    <div className="flex flex-col gap-2">
      {words.map((w, index) => (
        <Row
          word={w}
          goal={goal}
          key={index}
          submitted={index < wordCount ? true : false}
        />
      ))}
    </div>
  );
}

export default Grid;
