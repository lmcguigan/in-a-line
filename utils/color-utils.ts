import { PlayerAColorOptions, PlayerBColorOptions } from '@/store/settingsSlice'
import convert from 'color-convert'
import { PlayerEnum, SlotValue } from './game-utils'
export const getShadowColor = (color: string) => {
    let arr
    if(color.startsWith('#')){
        arr = convert.hex.hsl(color.replace('#', ''))
    } else {
        arr = convert.keyword.hsl(color as any)
    }
    return `hsl(${arr[0]}, ${arr[1]}%, ${arr[2] - 10}%)`
}
export interface Palette {
    playerAColor: PlayerAColorOptions, playerBColor: PlayerBColorOptions, backgroundColor: string
}
export const getColor = (element: SlotValue, palette: Palette) => {
    switch (element) {
      case PlayerEnum.A:
        return palette.playerAColor
      case PlayerEnum.B:
        return palette.playerBColor
      default:
        return palette.backgroundColor
    }
  } 