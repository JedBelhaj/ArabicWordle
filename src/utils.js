export const getStateColor = (state) => {
  switch (state) {
    case 0:
      return "bg-neutral-500";
    case 1:
      return "bg-neutral-700";
    case 2:
      return "bg-yellow-400";
    case 3:
      return "bg-green-400";
    default:
      return "bg-neutral-500";
  }
};

export default { getStateColor };
