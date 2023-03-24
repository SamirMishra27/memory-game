import { EndGameStats } from '../types'

export default function EndScreen(props: { endGameStats: EndGameStats }) {
    const { boardSize, moves, time } = props.endGameStats

    return (
        <div className="end-screen w-5/6 md:w-4/6 xl:w-2/6 h-[90%] tall:h-4/5 bg-[#408E91] flex flex-col items-center justify-center border-[#317476] border-[0.5rem] rounded-lg space-y-4 text-[#F5EBEB] left-0 right-0 top-0 bottom-0 m-auto text-center absolute z-10 ">
            <h2 className="text-3xl md:text-4xl font-semibold my-3md:my-8">🎉 WELL DONE! 🎉</h2>
            <h3 className="text-2xl md:text-3xl font-medium my-4">Final Stats</h3>

            <p className="text-xl m-1 w-52 h-10 rounded-lg bg-[#317476] flex items-center justify-center">
                Board Size: {boardSize} Cards
            </p>
            <p className="text-xl m-1 w-52 h-10 rounded-lg bg-[#317476] flex items-center justify-center">
                Total Moves: {moves}
            </p>
            <p className="text-xl m-1 w-52 h-10 rounded-lg bg-[#317476] flex items-center justify-center">
                Time Taken: {time.minutes.toString().padStart(2, '0')}:
                {time.seconds.toString().padStart(2, '0')}
            </p>
        </div>
    )
}
