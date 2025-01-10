import { PlayerEnum } from "@/utils/game-utils";
import { createSlice } from "@reduxjs/toolkit";
import { PURGE } from "redux-persist";

export interface Game {
    duration?: number // in ms
    winner: PlayerEnum
    moves?: number
    endTimestamp: number
}

interface GameWinningsState {
    games: Game[]
}

const initialState: GameWinningsState = {
    games: []
}

export const gameWinningsSlice = createSlice({
    name: 'gameWinnings',
    initialState,
    reducers: (create) => ({
        loadGames: create.reducer<Game[]>((state, action) => {
            state.games = action.payload
        }),
        addGame: create.reducer<Game>((state, action) => {
            state.games.push(action.payload)
        }),
        clearGames: create.reducer<void>((state) => {
            state.games = []
        })
    }),
    extraReducers: (builder) => {
        builder.addCase(PURGE, () => initialState)
    },
})

export const { addGame, loadGames, clearGames } = gameWinningsSlice.actions
export default gameWinningsSlice.reducer