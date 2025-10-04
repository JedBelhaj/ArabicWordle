import { useEffect, useRef, useState } from "react";
import Row from "../components/Row";
import WORD_LENGTH from "../constants";

function Main() {
    const [tries, setTries] = useState(0)
    const [game, setGame] = useState(false)
    const [key, setKey] = useState("")
    const [charCount, setCharCount] = useState(0)
    const [wordCount, setWordCount] = useState(0)
    const [words, setWords] = useState(["","","","","",""])
    const wordsRef = useRef(["","","","","",""]);
    const wordCountRef = useRef(0)
    const [keyPressed, setKeyPressed] = useState(false)

    const arabicAlphabet = 'Backspaceضصثقفغعهخحجدذشسيبلاتنمكطئءؤرلاىةوزظ'

    useEffect(() => {
        const handleInput = (e) => {
            const handlerWordCount = wordCountRef.current
            console.log("first word count:", handlerWordCount);
            
            console.log("words in handleinput begin: " , words);
            console.log("char", e.key)

            const updateWord = (nextWord) => {
                const nextWords = [...wordsRef.current]
                nextWords.splice(handlerWordCount, 1, nextWord)
                console.log("next words:", nextWords);
                setWords([...nextWords])
                wordsRef.current = [...nextWords]
            }
            
            if (e.key.length === 1 && wordsRef.current[handlerWordCount].length < WORD_LENGTH){
                const char = e.key
                const nextWord = wordsRef.current[handlerWordCount].concat(char)
                updateWord(nextWord)
            }
            else if (e.key === "Backspace" && wordsRef.current[handlerWordCount].length > 0) {
                const nextWord = wordsRef.current[handlerWordCount].substring(0, wordsRef.current[handlerWordCount].length - 1)
                updateWord(nextWord)
            } else if (e.key === "Enter" && wordsRef.current[handlerWordCount].length === WORD_LENGTH) {
                wordCountRef.current++
                setWordCount(wordCountRef.current)
                console.log("last word count:", handlerWordCount);
            }
        }
        document.addEventListener("keyup", handleInput)
        return () => document.removeEventListener("keyup",handleInput)
    },[])

    useEffect(() => {
        console.log("registered words :",words);
    }, [words])


    useEffect(()=> {
        if (tries == 4) {
            setGame(true)
        }
    }, [tries])

    
    
    
    return <div className="w-screen h-screen bg-neutral-100 flex justify-center items-center flex-col">
        {<h1 className="font-bold text-6xl m-5">Arabic Wordle !</h1>}
        <div id="char-grid" className="flex flex-col gap-2">
            {words.map((w, index) => 
                <Row word={w} key={index} />
            )}
        </div>
    </div>;
}

export default Main;