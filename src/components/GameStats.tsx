import React from 'react'
import { Stopwatch } from '../types'

export default function GameStats(props: { size: number; moves: number; stopwatch: Stopwatch }) {
    const { size, moves, stopwatch } = props

    return (
        <div className="game-stats-bar w-full md:w-52 lg:w-72 h-40 md:h-full bg-[#393053] flex flex-row md:flex-col items-center justify-evenly md:justify-center text-center text-white flex-wrap md:flex-nowrap">
            <h1 className="absolute top-6 text-3xl font-light font-title text-slate-50">
                MEMORY GAME!
            </h1>

            <div className="py-2 flex flex-col items-center justify-evenly m-1">
                <h4 className="text-lg md:text-xl">BOARD</h4>
                <div className="game-size text-xl md:text-3xl m-1 w-24 md:w-36 md:h-10 rounded-lg bg-[#271d44]">
                    {size} Cards
                </div>
            </div>

            <div className="py-2 flex flex-col items-center justify-evenly m-1 md:mt-6">
                <h3 className="text-lg md:text-xl">MOVES</h3>
                <div className="text-xl md:text-3xl m-1 w-20 md:w-36 md:h-10 rounded-lg bg-[#271d44]">
                    {moves}
                </div>
            </div>

            <div className="py-2 flex flex-col items-center justify-evenly m-1 md:mt-6">
                <h3 className="text-lg md:text-xl">TIMER</h3>
                <div className="text-xl md:text-3xl m-1 w-20 md:w-36 md:h-10 rounded-lg bg-[#271d44]">
                    {stopwatch.minutes.toString().padStart(2, '0')} :{' '}
                    {stopwatch.seconds.toString().padStart(2, '0')}
                </div>
            </div>
        </div>
    )
}
