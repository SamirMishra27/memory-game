import React from 'react'
import { Stopwatch } from '../types'

export default function GameStats(props: { size: number; moves: number; stopwatch: Stopwatch }) {
    const { size, moves, stopwatch } = props

    return (
        <div className="game-stats-bar w-72 h-full bg-[#393053] flex flex-col items-center justify-center text-center text-white">
            <h4 className="text-xl m-1">BOARD</h4>
            <div className="game-size text-3xl m-1 w-36 h-10 rounded-lg bg-[#271d44]">
                {size} Cards
            </div>

            <h3 className="text-xl m-1 mt-6">MOVES</h3>
            <div className="text-3xl m-1 w-36 h-10 rounded-lg bg-[#271d44]">{moves}</div>

            <h3 className="text-xl m-1 mt-6">TIMER</h3>
            <div className="text-3xl m-1 w-36 h-10 rounded-lg bg-[#271d44]">
                {stopwatch.minutes.toString().padStart(2, '0')} :{' '}
                {stopwatch.seconds.toString().padStart(2, '0')}
            </div>
        </div>
    )
}
