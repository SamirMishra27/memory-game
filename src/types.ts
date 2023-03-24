export interface ImagesDict {
    [key: string]: string
}

export interface Stopwatch {
    minutes: number
    seconds: number
}

export interface BoardStyleOptions {
    number: string
}

export interface EndGameStats {
    moves: number
    time: Stopwatch
    boardSize: number
}
