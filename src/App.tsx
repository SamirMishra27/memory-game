import { useState, useRef, MutableRefObject, MouseEvent } from 'react'
import './index.css'

import GameStats from './components/GameStats'
import GameSelectionModal from './components/GameSelectionModal'

import { images } from './images'
import { shuffle } from './utils'
import { Stopwatch } from './types'

function App() {
    // Components ref
    const cardsRef = useRef() as MutableRefObject<HTMLDivElement>
    const modalBackdropRef = useRef() as MutableRefObject<HTMLDivElement>

    // Internal refs
    const resolveClick = useRef(true)
    const stopwatchTask = useRef(0)
    const shuffledImages = useRef<string[]>([])

    // State - to control hidden modals
    const [selectBoardMenu, setSelectMenu] = useState(true)
    const [endGameStats, setEndGameStats] = useState(false)

    // State - to update and set time elapsed
    const [lastUpdate, setUpdate] = useState(Date.now())
    const [stopwatch, setStopwatch] = useState<Stopwatch>({
        seconds: 0,
        minutes: 0,
    })

    // State - to manage the game
    const [gridConfig, setGridConfig] = useState<string[]>([])
    const [boardSize, setBoardSize] = useState(0) //useState(16)
    const [movesCount, setMovesCount] = useState(0)

    const [guessedCards, setGuessed] = useState<number[]>([]) // Array of card ids
    const [matchedCards, setMatched] = useState<string[]>([]) // Array of matched card names

    function matchCards() {
        const [index1, index2] = [guessedCards[0], guessedCards[1]]

        if (shuffledImages.current[index1] === shuffledImages.current[index2]) {
            matchedCards.push(shuffledImages.current[index1])
            setMatched(matchedCards)
        }

        // Reset guessed and update moves
        setGuessed([])
        setUpdate(Date.now())
        setMovesCount(movesCount + 1)

        // Check endgame
        if (shuffledImages.current.length / 2 === matchedCards.length) {
            clearInterval(stopwatchTask.current)
        } else resolveClick.current = true
    }

    function handleCardClick(event: MouseEvent<HTMLDivElement>) {
        if (!resolveClick.current) return
        if (!(event.target instanceof HTMLDivElement)) return

        const cardNumber = event.target.dataset.cardNo
        if (cardNumber) guessedCards.push(Number(cardNumber))

        setGuessed(guessedCards)
        setUpdate(Date.now())

        if (guessedCards.length === 2) {
            resolveClick.current = false
            setTimeout(() => matchCards(), 2 * 1000)
        }
    }

    function updateStopwatch() {
        if (stopwatch.seconds >= 59) {
            stopwatch.seconds = 0
            stopwatch.minutes += 1
        } else stopwatch.seconds += 1
        setStopwatch({
            minutes: stopwatch.minutes,
            seconds: stopwatch.seconds,
        })
    }

    function initGame(totalCards: number) {
        const boardStyleOptions = new Map([
            [16, [' grid-cols-4 grid-rows-4', ' w-36 h-36']],
            [24, [' grid-cols-6 grid-rows-4', ' w-32 h-32']],
            [32, [' grid-cols-8 grid-rows-4', ' w-28 h-28']],
        ])
        const imagesNeeded = Object.entries(images).slice(0, Number(totalCards / 2))
        shuffledImages.current = shuffle([
            ...imagesNeeded.map((elem) => elem[0]),
            ...imagesNeeded.map((elem) => elem[0]),
        ])

        setGridConfig(boardStyleOptions.get(totalCards) as string[])
        setBoardSize(totalCards)

        modalBackdropRef.current.style.opacity = '0'
        setTimeout(() => setSelectMenu(false), 0.3 * 1000)

        if (!stopwatchTask.current)
            stopwatchTask.current = setInterval(() => updateStopwatch(), 1 * 1000)
    }

    return (
        <div className="main w-full h-[100vh] flex items-center justify-between">
            <GameStats size={boardSize} moves={movesCount} stopwatch={stopwatch} />
            {boardSize && (
                <div
                    className={
                        'cards grid gap-4 bg-[#66347F] p-3 rounded-2xl cards-border items-center justify-evenly' +
                        gridConfig[0]
                    }
                    ref={cardsRef}>
                    {shuffledImages.current.map((imageKey, index) => (
                        <div
                            className={
                                'card flex items-center justify-center m-auto bg-[#D5B4B4] border-[3px] border-solid border-[#F5EBEB] rounded-lg' +
                                gridConfig[1] +
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
            )}
            {(selectBoardMenu || endGameStats) && (
                <div
                    className="modal-backdrop w-full h-full bg-[rgba(0,0,0,0.5)] absolute duration-200 transition"
                    ref={modalBackdropRef}
                />
            )}
            {selectBoardMenu && <GameSelectionModal initGame={initGame} />}
            <div className="empty-space w-28 h-full bg-slate-500" />
        </div>
    )
}

export default App
