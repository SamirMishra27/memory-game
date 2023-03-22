import { MutableRefObject, useRef } from 'react'

export default function GameSelectionModal(props: { initGame: (param: number) => void }) {
    const OPTIONS = [
        {
            cardsPerRow: 4,
            cardsPerColumn: 4,
            totalCards: 16,
        },
        {
            cardsPerRow: 4,
            cardsPerColumn: 6,
            totalCards: 24,
        },
        {
            cardsPerRow: 4,
            cardsPerColumn: 8,
            totalCards: 32,
        },
    ]
    const selectModalRef = useRef() as MutableRefObject<HTMLDivElement>

    return (
        <div
            className="select-level-menu absolute flex flex-col items-center justify-evenly bg-[#408E91] rounded-lg p-4 space-y-4 left-0 right-0 mx-auto w-[35rem]"
            ref={selectModalRef}>
            <h2 className="text-[#FFF2CC] font-semibold text-3xl">Choose the difficulty</h2>
            <div className="w-full flex items-center justify-evenly space-x-4">
                {OPTIONS.map((option) => (
                    <button
                        className="w-44 h-36 rounded-lg flex items-center justify-evenly text-center text-2xl font-semibold bg-[#CCD5AE] hover:bg-[#FFF2CC] duration-200 active:bg-[#CCD5AE] outline-transparent choice-btn-interact"
                        onClick={() => {
                            selectModalRef.current.classList.add('select-disappear')
                            props.initGame(option.totalCards)
                        }}>
                        {option.cardsPerRow} X {option.cardsPerColumn}
                        <br />
                        {option.totalCards} CARDS
                    </button>
                ))}
            </div>
        </div>
    )
}
