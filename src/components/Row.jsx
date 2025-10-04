import Box from "./Box";
import WORD_LENGTH from "../constants.js"

function Row(props) {
    const {word} = props
    return ( <div className="row flex gap-2">
        {Array(WORD_LENGTH).fill(true).map((_,i) => <Box char={word.length >= i ? word.charAt(i) : ""} key={i}/>)}
    </div> );
}

export default Row; 