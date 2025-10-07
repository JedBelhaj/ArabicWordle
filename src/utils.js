export const getStateColor = (state) => {
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
            return "bg-green-400";
            break;
        default:
            return "bg-neutral-300";
            break;
    }
};

export default {getStateColor}