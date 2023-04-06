import { useState, useRef, MutableRefObject, MouseEvent } from 'react'
import './index.css'
import { Helmet } from 'react-helmet'

import GameStats from './components/GameStats'
import GameSelectionModal from './components/GameSelectionModal'

import { images } from './images'
import { shuffle } from './utils'
import { Stopwatch, EndGameStats } from './types'
import EndScreen from './components/EndScreen'

function App() {
    // Components ref
    const cardsRef = useRef() as MutableRefObject<HTMLDivElement>
    const modalBackdropRef = useRef() as MutableRefObject<HTMLDivElement>

    // Internal refs
    const resolveClick = useRef(true)
    const stopwatchTask = useRef<NodeJS.Timer | number>(0)
    const shuffledImages = useRef<string[]>([])

    // State - to update and set time elapsed
    const [lastUpdate, setUpdate] = useState(Date.now())
    const [stopwatch, setStopwatch] = useState<Stopwatch>({
        seconds: 0,
        minutes: 0,
    })

    // State - to control hidden modals
    const [selectBoardMenu, setSelectMenu] = useState(true)
    const [endGameStats, setEndGameStats] = useState<EndGameStats>({
        boardSize: 0,
        moves: 0,
        time: stopwatch,
    })

    // State - to manage the game
    const [gridConfig, setGridConfig] = useState<string[]>([])
    const [boardSize, setBoardSize] = useState(0)
    const [movesCount, setMovesCount] = useState(0)

    const [guessedCards, setGuessed] = useState<number[]>([]) // Array of card ids
    const [matchedCards, setMatched] = useState<string[]>([]) // Array of matched card names

    function showEndGameStats() {
        setEndGameStats({
            moves: movesCount,
            time: stopwatch,
            boardSize: boardSize,
        })
    }

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
            showEndGameStats()
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
            [16, [' grid-cols-4 grid-rows-4', ' w-full h-full md:w-28 md:h-28 lg:w-36 lg:h-36']],
            [
                24,
                [
                    ' grid-cols-6 grid-rows-4',
                    ' w-[97%] h-[97%] md:w-20 md:h-20 lg:w-24 lg:h-24 xl:w-32 xl:h-32',
                ],
            ],
            [32, [' grid-cols-8 grid-rows-4', '']],
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
        <div className="main w-full h-[100vh] max-h-full flex flex-col-reverse md:flex-row items-center justify-between relative">
            <Helmet>
                <meta property="og:site_name" content="Memory Game" data-react-helmet="true" />
                <meta
                    property="og:title"
                    content="Play A Memory Card Game"
                    data-react-helmet="true"
                />
                <meta
                    property="og:description"
                    content="How good are your memory skills?"
                    data-react-helmet="true"
                />

                <meta
                    property="og:image"
                    content="https://media.discordapp.net/attachments/795951827232358400/1092358566339428443/Screenshot_2023-03-23_012431.png"
                    data-react-helmet="true"
                />
                <meta property="og:image:type" content="image/png" data-react-helmet="true" />
                <meta
                    property="twitter:image:src"
                    content="https://media.discordapp.net/attachments/795951827232358400/1092358566339428443/Screenshot_2023-03-23_012431.png"
                    data-react-helmet="true"
                />
            </Helmet>
            <GameStats size={boardSize} moves={movesCount} stopwatch={stopwatch} />
            {boardSize && (
                <div
                    className={
                        'cards grid gap-[5px] sm:gap-2 lg:gap-4 bg-[#66347F] p-1 lg:p-3 rounded-2xl cards-border items-center justify-evenly w-[90%] md:w-auto transform' +
                        gridConfig[0]
                    }
                    ref={cardsRef}>
                    {shuffledImages.current.map((imageKey, index) => (
                        <div
                            className={
                                'card flex items-center justify-center m-auto bg-[#D5B4B4] border-[2px] sm:border-[3px] border-solid border-[#F5EBEB] rounded-lg w-[97%] h-full md:w-16 md:h-20 lg:w-24 lg:h-24 xl:w-28 xl:h-28' +
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
            {(!!selectBoardMenu || !!endGameStats.moves) && (
                <div
                    className={
                        'modal-backdrop w-full h-screen bg-[rgba(0,0,0,0.5)] absolute duration-200 transition' +
                        (endGameStats.boardSize ? ' fade-in opacity-0' : '')
                    }
                    ref={modalBackdropRef}
                />
            )}
            {!!selectBoardMenu && <GameSelectionModal initGame={initGame} />}
            {!!endGameStats.moves && <EndScreen endGameStats={endGameStats} />}
            <div className="empty-space w-0 lg:w-4 xl:w-20 h-0 md:h-full bg-slate-500" />
        </div>
    )
}

export default App
