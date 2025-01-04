import { getDiagonal, getDiagonals, getHasNInARow } from "./game-utils"

describe('Function that transposes an array', () => {
    it('should return a transposed array for a two-dimensional array', () => {
    })
})
describe('Function that checks for four in a row', () => {
    it('should return false if there are not four sequential values', () => {
        expect(getHasNInARow([1, 2, 3, 5, 6], 4)).toBeFalsy()
    })
    it('should return true if there are four sequential values', () => {
        expect(getHasNInARow([1, 2, 3, 4, 6], 4)).toBeTruthy()
    })
})
const array1 = [
    // rows length = 6
    // columns length = 5
    ['a', 'b', 'c', 'd', 'e'], // row 0
    ['f', 'g', 'h', 'i', 'j'], // row 1
    ['k', 'l', 'm', 'n', 'o'], // row 2
    ['p', 'q', 'r', 's', 't'], // row 3
    ['u', 'v', 'w', 'x', 'y'], // row 4
    ['z', '1', '2', '3', '4']  // row 5
]
const array2 = [
    ['~', '!', '@', '#', '$', '%', '^'],
    ['&', '*', '(', ')', '-', '=', '{'],
    ['a', 'b', 'c', 'd', 'e', 'f', 'g'],
    ['h', 'i', 'j', 'k', 'l', 'm', 'n'],
    ['o', 'p', 'q', 'r', 's', 't', 'u'], 
    ['v', 'w', 'x', 'y', 'z', '}', '|'] 
]
describe('Function that builds diagonals', () => {
    it('should handle top to bottom diagonals from the origin', () => {
        expect(getDiagonal(array1, 0, 0, 'topToBottom')).toStrictEqual(['a', 'g', 'm', 's', 'y'])
        expect(getDiagonal(array2, 0, 0, 'topToBottom')).toStrictEqual([ '~', '*', 'c', 'k', 's', '}' ])
    })
    it('should handle bottom to top diagonals from the bottom row', () => {
        expect(getDiagonal(array2, 0, 0, 'bottomToTop')).toStrictEqual(["v", "p", "j", "d", "-", "%"])
    })
    it('should correctly handle top To Bottom diagonals with vertical or horizontal offsets', () => {
        expect(getDiagonal(array1, 1, 0, 'topToBottom')).toStrictEqual(['b', 'h', 'n', 't'])
        expect(getDiagonal(array2, 2, 0, 'topToBottom')).toStrictEqual(['@', ')', 'e', 'm', 'u'])
        expect(getDiagonal(array2, 0, 1, 'topToBottom')).toStrictEqual(['&', 'b', 'j', 'r', 'z'])
    })
    it('should correctly handle bottom to top diagonals with vertical or horizontal offsets', () => {
        expect(getDiagonal(array1, 1, 0, 'bottomToTop')).toStrictEqual(["1", 'w', 's', 'o'])
    })
})
describe('Function that gets diagonals', () => {
    it('should get all the diagonals for an array of u cols and v rows that have at least n elements in them', () => {
        const diagonals = getDiagonals(array1, 4)
        console.log(diagonals)
        expect(diagonals.length).toBe(8)
        const moreDi = getDiagonals(array2, 4)
        console.log(moreDi)
    })
})