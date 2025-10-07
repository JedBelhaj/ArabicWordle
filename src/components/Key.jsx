function Key(props) {
  const { char, state } = props;
  const color = state === 0 ? "bg-neutral-500" : "bg-neutral-300";
  return (
    <div
      className={`${color} h-13 w-13 uppercase flex items-center justify-center m-1 text-2xl font-semibold rounded-lg shadow-sm`}
    >
      {char}
    </div>
  );
}

export default Key;
