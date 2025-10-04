function Box(props) {
    const {char} = props
    return ( <div className="box bg-neutral-300 h-24 w-24 rounded-3xl flex items-center justify-center text-6xl uppercase font-bold">
        {char}
    </div> );
}

export default Box;