import { useEffect, useState } from "react";
import Row from "../components/Row";

function Main() {
    const [tries, setTries] = useState(0)
    const [game, setGame] = useState(false)
    const [key, setKey] = useState("")
    const [charCount, setCharCount] = useState(0)
    const [wordCount, setWordCount] = useState(0)
    const [words, setWords] = useState([])
    const [keyPressed, setKeyPressed] = useState(false)

    const arabicAlphabet = 'Backspaceضصثقفغعهخحجدذشسيبلاتنمكطئءؤرلاىةوزظ'


    useEffect(() => {
        console.log("registered words :",words);
    }, [words])


    useEffect(()=> {
        if (tries == 4) {
            setGame(true)
        }
    }, [tries])

    useEffect(() => {
        console.log('this works once');
        setWords(["","","","","",""])
        window.addEventListener("keyup", handleInput)
    }, [])

    const handleInput = (e) => {
        console.log(words);
        
        if (e.key.length === 1){
            const char = e.key
            const nextWord = words[wordCount].concat(char)
            const nextWords = [...words]
            nextWords.splice(wordCount, 1, nextWord)         
            console.log("next words:", nextWords);
            setWords(nextWords)
        }
    }
    
    return <div className="w-screen h-screen bg-neutral-100 flex justify-center items-center flex-col">
        {<h1 className="font-bold text-6xl m-5">Arabic Wordle</h1>}
        <div id="char-grid" className="flex flex-col gap-2">
            {words.map((w, index) => 
                <Row word={w} key={index} />
            )}
        </div>
    </div>;
}

export default Main;