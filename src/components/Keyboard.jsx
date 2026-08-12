import Key from "./Key";

function Keyboard({ alphabet, states, onChar, onBackspace, onEnter, backspaceLabel, enterLabel }) {
  return (
    <div className="flex flex-col items-center gap-2 my-9">
      <div className="flex max-w-2xl flex-wrap justify-center">
        {alphabet.map((char, i) => (
          <Key key={char} state={states[i] ?? 0} char={char} onClick={() => onChar(char)} />
        ))}
      </div>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={onBackspace}
          className="px-4 py-2 bg-neutral-500 hover:brightness-110 active:scale-95 transition rounded-lg font-semibold text-white cursor-pointer"
        >
          {backspaceLabel}
        </button>
        <button
          type="button"
          onClick={onEnter}
          className="px-4 py-2 bg-neutral-500 hover:brightness-110 active:scale-95 transition rounded-lg font-semibold text-white cursor-pointer"
        >
          {enterLabel}
        </button>
      </div>
    </div>
  );
}

export default Keyboard;
