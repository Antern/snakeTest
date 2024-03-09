import GameLogic from './gameLogic.js'
import { GRID_CELL_SIZE, GRID_GAP, GRID_ROWS } from './const.js'

const gameInstance = ((canvas) => {
    var tick = ~~-1
    var objectQueue = []
    var ctx = canvas.getContext('2d')
    const { width: cw, height: ch } = canvas.getBoundingClientRect()

    const gridVerUnits = GRID_ROWS * GRID_CELL_SIZE + (GRID_ROWS + 1) * GRID_GAP
    // assume square
    // const gridHorUnits = GRID_COLUMNS * GRID_CELL_SIZE + (GRID_COLUMNS + 1) * GRID_GAP;
    const gridGapUnitPx = (cw * GRID_GAP) / gridVerUnits
    const gridCellUnitPx = (cw * GRID_CELL_SIZE) / gridVerUnits

    var getGridPosInPx = ([rowIndex, colIndex]) => [
        gridGapUnitPx + rowIndex * (gridGapUnitPx + gridCellUnitPx),
        gridGapUnitPx + colIndex * (gridGapUnitPx + gridCellUnitPx),
    ]

    var gameLogic = new GameLogic(ctx, cw, ch, gridCellUnitPx, getGridPosInPx, () => {
        tick = -1
    })

    var clear = (color = 'purple') => {
        ctx.fillStyle = color
        ctx.fillRect(0, 0, cw, ch)
    }

    var loadObject = (obj) => {
        objectQueue.push(obj)
    }

    var doTick = () => {
        tick = (tick + 5) & 0x3f
        tick = ((((tick - 4) >> 31) & 4) | (tick & ~((tick - 4) >> 31))) - 4

        clear()

        objectQueue = objectQueue.filter((obj) => !obj.shouldBeDestroyed)
        objectQueue.forEach((obj) => obj.update && obj.update(tick))

        gameLogic.update(tick)

        objectQueue = objectQueue.filter((obj) => !obj.shouldBeDestroyed)
        objectQueue.forEach((obj) => obj.draw(ctx))

        if (!gameLogic.renderingPausePromise) {
            requestAnimationFrame(doTick)
        } else {
            gameLogic.renderingPausePromise.then(() => {
                doTick()
            })
        }
    }

    var run = () => {
        clear('#000')

        gameLogic.run(loadObject)

        requestAnimationFrame(doTick)
    }

    return {
        run,
    }
})(document.getElementById('mainCanvas'))

document.getElementById('mainCanvas').focus()

gameInstance.run()
