import { GRID_ROWS, GRID_COLUMNS } from './const.js'

export const checkIsInBounds = ([x, y]) => {
    return x >= 0 && y >= 0 && x < GRID_ROWS && y < GRID_COLUMNS
}

export const samePos = ([x1, y1], [x2, y2]) => {
    return x1 === x2 && y1 === y2
}

export const sumV2 = ([x1, y1], [x2, y2]) => {
    return [x1 + x2, y1 + y2]
}
