export enum PlayerEnum {
    A = 'a',
    B = 'b'
}

export type SlotValue = PlayerEnum | undefined | string

export type Board = Array<SlotValue>[]

export const determineRowPlacementInColumn = (array: Board, column: number) => {
    let placement
    let i = 5 // num colums - 1
    while(placement === undefined && i > -1){
        const columnValInRow = array[i][column]
        if(columnValInRow === undefined){
            // slot in row i is empty
            placement = i
        } else {
            i--;
        }
    }
    return placement
}

export const getUpdatedRows = (array: Board, column: number, turn: PlayerEnum) => {
    let rowNumber = determineRowPlacementInColumn(array, column);
    const updated = array.map((row, i) => {
        if(i === rowNumber){
            return row.map((val, col) => col === column ? turn : val)
        } else {
            return row
        }
    })
    return updated
}

export const transpose = (array: Board) => {
    return array[0].map((_, index) => array.map((arr) => arr[index]))
}
export const getDiagonal = (array: Board, horizontalOffset: number, verticalOffset: number, direction: 'topToBottom' | 'bottomToTop') => {
    const line = []
    const numColumns = array[0].length
    const numRows = array.length
    for(let i = 0; i < Math.min(numColumns, numRows); i++){
        const startingPoint = direction === 'topToBottom' ? i : array.length - 1 - i
        if(startingPoint + verticalOffset < numRows && i + horizontalOffset < numColumns){
            if(array[startingPoint + verticalOffset]){
                line.push(array[startingPoint + verticalOffset][i + horizontalOffset])
            }
        }
    }
    return line
}
export const getDiagonals = (array: Board, n: number) => {
    const numColumns = array[0].length
    const numRows = array.length
    const additionalRows = numRows - n
    const additionalColumns = numColumns - n
    const topToBottoms = []
    const bottomToTops = []
    for(let i = 0; i < additionalColumns + 1; i++){
        topToBottoms.push(getDiagonal(array, i, 0, 'topToBottom'))
        bottomToTops.push(getDiagonal(array, i, 0, 'bottomToTop'))
    }
    for(let j = 1; j < additionalRows + 1; j++){
        topToBottoms.push(getDiagonal(array, 0, j, 'topToBottom'))
        bottomToTops.push(getDiagonal(array, 0, -j, 'bottomToTop'))
    }
    return topToBottoms.concat(bottomToTops)
}

export const getHasNInARow = (arr: number[], n: number): boolean => {
    // start with the first value in the array already in the list
    let rowOfFour = [arr[0]]
    // start by checking the second value against the first
    let i = 1;
    while (rowOfFour.length < n && i < arr.length) {
        // if the value at index (i - 1) is equal to the value at index i, minus 1, then they are sequential
        if(arr[i - 1] === arr[i] - 1){
            // push to array, with the goal of getting four
            rowOfFour.push(arr[i])
        } else {
            // otherwise start over with the value at index i
            rowOfFour = [arr[i]]
        }
        i++
    }
    return rowOfFour.length === n
}

export const mapLine = (i: number, row: SlotValue[], player: PlayerEnum) => {
    const playersSlots = row.map((e, i) => ({index: i, player: e})).filter(e => e.player === player).map(e => e.index)
    return playersSlots
}

export const checkDirectionForWinner = (lines: SlotValue[][], n: number): undefined | PlayerEnum => {
    let winner = undefined
    lines.forEach((line, i) => {
        const playerAHasLine = getHasNInARow(mapLine(i, line, PlayerEnum.A), n)
        const playerBHasLine = getHasNInARow(mapLine(i, line, PlayerEnum.B), n)
        if(playerAHasLine){
            winner = PlayerEnum.A
        }
        if(playerBHasLine){
            winner = PlayerEnum.B
        }
    })
    return winner
}

export const checkForWinner = (array: Board, n: number): undefined | PlayerEnum => {
    let winner = undefined
    // check horizontally 
    const horizontalWinner = checkDirectionForWinner(array, n)
    if(horizontalWinner !== undefined){
        winner = horizontalWinner
    }
    // check vertically
    const verticalWinner = checkDirectionForWinner(transpose(array), n)
    if(verticalWinner !== undefined){
        winner = verticalWinner
    }
    // check diagonals
    const diagonalWinner = checkDirectionForWinner(getDiagonals(array, n), n)
    if(diagonalWinner !== undefined){
        winner = diagonalWinner
    }
    return winner
}