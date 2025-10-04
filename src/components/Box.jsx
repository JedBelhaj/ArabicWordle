function Box(props) {
  const { char, state } = props;
  const color = (() => {
    switch (state) {
      case 0:
        return "bg-neutral-300";
        break;
      case 1:
        return "bg-neutral-400";
        break;
      case 2:
        return "bg-yellow-400";
        break;
      case 3:
        return "bg-green-300";
        break;

      default:
        return "bg-neutral-300";
        break;
    }
  })();
  return (
    <div
      className={`box ${color} bg-ne h-24 w-24 rounded-3xl flex items-center justify-center text-6xl uppercase font-bold`}
    >
      {char}
    </div>
  );
}

export default Box;
