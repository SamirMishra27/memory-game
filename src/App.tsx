import { useState, useRef, MutableRefObject, MouseEvent } from 'react'
import './index.css'

import { images } from './images'
import { shuffle } from './utils'

const shuffledImages = shuffle([...Object.keys(images), ...Object.keys(images)])

function App() {
    const cardsRef = useRef() as MutableRefObject<HTMLDivElement>
    const resolveClick = useRef(true)
    const [lastUpdate, setUpdate] = useState(Date.now())

    const [guessedCards, setGuessed] = useState<number[]>([]) // Array of cad ids
    const [matchedCards, setMatched] = useState<string[]>([]) // Array of matched card names

    function matchCards() {
        const [index1, index2] = [guessedCards[0], guessedCards[1]]

        if (shuffledImages[index1] === shuffledImages[index2]) {
            matchedCards.push(shuffledImages[index1])
            setMatched(matchedCards)
        } // else setGuessed([])

        setGuessed([])
        setUpdate(Date.now())

        // Check endgame
        if (shuffledImages.length / 2 === matchedCards.length) {
            // Do nothing
        } else resolveClick.current = true
    }

    function handleCardClick(event: MouseEvent<HTMLDivElement>) {
        if (!resolveClick.current) return
        if (!(event.target instanceof HTMLDivElement)) return

        const cardNumber = event.target.dataset.cardNo
        if (cardNumber) guessedCards.push(Number(cardNumber))

        setGuessed(guessedCards)
        setUpdate(Date.now())
        // console.log(cardNumber)

        if (guessedCards.length === 2) {
            resolveClick.current = false
            setTimeout(() => matchCards(), 2 * 1000)
        }
    }

    return (
        <div className="main w-full h-[100vh] flex items-center justify-center">
            <div
                className="cards grid grid-cols-4 grid-rows-4 gap-4 bg-[#66347F] p-3 rounded-2xl cards-border items-center justify-evenly"
                ref={cardsRef}>
                {shuffledImages.map((imageKey, index) => (
                    <div
                        className={
                            'card w-36 h-36 flex items-center justify-center m-auto bg-[#D5B4B4] border-[3px] border-solid border-[#F5EBEB] rounded-lg' +
                            (guessedCards.includes(index) ? ' guessed' : '') +
                            (matchedCards.includes(imageKey) ? ' matched' : '')
                        }
                        key={index}
                        data-card-no={index}
                        data-last-update={lastUpdate}
                        onClick={(event) => handleCardClick(event)}>
                        <img
                            src={images[imageKey]}
                            alt="card image"
                            className={
                                'w-[95%] h-auto object-contain opacity-0 transition' +
                                (guessedCards.includes(index) ? ' guessed opacity-100' : '') +
                                (matchedCards.includes(imageKey) ? ' opacity-100' : '')
                            }
                            onClick={(event) => {
                                const target = event.target as HTMLImageElement
                                target.parentElement?.click()
                            }}
                        />
                    </div>
                ))}
            </div>
        </div>
    )
}

export default App
