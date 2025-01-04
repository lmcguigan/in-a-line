import { createSlice } from "@reduxjs/toolkit";

export enum PlayerAColorOptions {
    COLOR1 = '#bf1717',
    COLOR2 = '#bf5050',
    COLOR3 = '#9f55c2',
    COLOR4 = '#c97e3c',
    COLOR5 = '#3c7ec9'
}

export enum PlayerBColorOptions {
    COLOR1 = '#3e48fa',
    COLOR2 = '#589bad',
    COLOR3 = '#358562',
    COLOR4 = '#095450',
    COLOR5 = 'pink'
}

export enum RackColorOptions {
    COLOR1 = '#dbb418',
    COLOR2 = '#c9ba77',
    COLOR3 = '#5f6a70',
    COLOR4 = '#a4b3a6',
    COLOR5 = '#572f2e'
}

interface SettingsState {
    playerAColor: PlayerAColorOptions,
    playerBColor: PlayerBColorOptions,
    rackColor: RackColorOptions,
}

const initialState: SettingsState = {
    playerAColor: PlayerAColorOptions.COLOR1,
    playerBColor: PlayerBColorOptions.COLOR1,
    rackColor: RackColorOptions.COLOR1

}

export const settingsSlice = createSlice({
    name: 'settings',
    initialState,
    reducers: (create) => ({
        updatePlayerAColor: create.reducer<PlayerAColorOptions>((state, action) => {
            state.playerAColor = action.payload
        }),
        updatePlayerBColor: create.reducer<PlayerBColorOptions>((state, action) => {
            state.playerBColor = action.payload
        }),
        updateRackColor: create.reducer<RackColorOptions>((state, action) => {
            state.rackColor = action.payload
        })
    })
})

export const { updatePlayerAColor, updatePlayerBColor, updateRackColor } = settingsSlice.actions
export default settingsSlice.reducer