import { PlayerAColorOptions, PlayerBColorOptions } from '@/store/settingsSlice'
import convert from 'color-convert'
import { PlayerEnum, SlotValue } from './game-utils'
const getColorHSLArray = (color: string) => {
  let arr
  if(color.startsWith('#')){
      arr = convert.hex.hsl(color.replace('#', ''))
  } else {
      arr = convert.keyword.hsl(color as any)
  }
  return arr
}
export const getShadowColor = (color: string) => {
    const arr = getColorHSLArray(color)
    return `hsl(${arr[0]}, ${arr[1]}%, ${arr[2] - 15}%)`
}
export const getRingColor = (color: string) => {
    const arr = getColorHSLArray(color)
    return `hsl(${arr[0]}, ${arr[1]}%, ${arr[2] + 30}%)`
}
export interface Palette {
    playerAColor: PlayerAColorOptions, playerBColor: PlayerBColorOptions, backgroundColor: string
}
export const getColor = (value: SlotValue, palette: Palette) => {
    switch (value) {
      case PlayerEnum.A:
        return palette.playerAColor
      case PlayerEnum.B:
        return palette.playerBColor
      default:
        return palette.backgroundColor
    }
  } 