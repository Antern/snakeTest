import Player from './player.js'
import FoodRect from './foodRect.js'
import FullScreenText from './fullScreenText.js'
import { checkIsInBounds, samePos, sumV2 } from './utils.js'
import { GRID_COLUMNS, GRID_ROWS } from './const.js'

// 0 - top
// 1 - right
// 2 - bottom
// 3 - left
var DIR_ARR = [
    [0, -1],
    [+1, 0],
    [0, +1],
    [-1, 0],
]

const EMPTY_CELL = 0
const SNAKE_CELL = 1
const FOOD_CELL = 2

class GameLogic {
    shouldResetOnResume = true
    renderingPausePromise = null
    score = 0

    foodList = []
    player
    ctx
    ch
    cw
    getGridPosInPx
    gridCellUnitPx

    totalCells = GRID_COLUMNS * GRID_ROWS

    field = null

    constructor(ctx, cw, ch, gridCellUnitPx, getGridPosInPx, forceUpdate) {
        this.ctx = ctx
        this.forceUpdate = forceUpdate
        this.getGridPosInPx = getGridPosInPx
        this.gridCellUnitPx = gridCellUnitPx
        this.cw = cw
        this.ch = ch
    }

    setField([x, y], cellType) {
        this.field[x][y] = cellType
    }

    schedulePause(resolveCallbackFn = () => {}) {
        this.renderingPausePromise = new Promise((resolve) => {
            this._pausePromiseResolve = () => {
                this.renderingPausePromise = null
                this._pausePromiseResolve = null
                resolveCallbackFn()
                resolve()
            }
        })
    }

    resume() {
        if (!this._pausePromiseResolve) {
            return
        }
        this._pausePromiseResolve()
        if (this.shouldResetOnResume) {
            this.shouldResetOnResume = false
            this.reset(DIR_ARR[1])
        }
    }

    drawPauseMessage(text) {
        var obj = new FullScreenText(this.cw, this.ch, this.gridCellUnitPx, text)
        this.loadObject(obj)
        this.schedulePause(() => obj.destroy())
    }

    showStartScreen() {
        this.drawPauseMessage('<Space> to start')
    }

    showPauseScreen() {
        this.drawPauseMessage('<Space> to resume')
    }

    showFinalScore() {
        this.shouldResetOnResume = true
        this.drawPauseMessage(`Score: ${this.score}\n<Space> to restart`)
    }

    spawnFood() {
        var freeCellsNumber = this.totalCells - this.player.snakeLength() - this.foodList.length

        if (freeCellsNumber < 1) {
            this.showFinalScore()
            return
        }

        let placeForFood = Math.floor(Math.random() * freeCellsNumber)
        for (let i = 0; i < GRID_ROWS; i++) {
            for (let j = 0; j < GRID_COLUMNS; j++) {
                if (!placeForFood) {
                    this.setField([i, j], FOOD_CELL)
                    const newFood = new FoodRect([i, j], this.getGridPosInPx([i, j]), this.gridCellUnitPx)
                    this.foodList.push(newFood)
                    this.loadObject(newFood)
                    return
                }

                if (this.field[i][j] === EMPTY_CELL) {
                    placeForFood--
                }
            }
        }
    }

    eatCell([x, y], tailPos) {
        if (!checkIsInBounds([x, y])) {
            this.showFinalScore()
            return false
        }

        // clear tail
        this.setField(tailPos, EMPTY_CELL)

        switch (this.field[x][y]) {
            case SNAKE_CELL:
                this.showFinalScore()
                return false

            case FOOD_CELL:
                var foodIndex = this.foodList.findIndex((food) => samePos(food.gridPos, [x, y]))
                this.score += 100
                if (foodIndex >= 0) {
                    this.foodList.at(foodIndex).destroy()
                    this.foodList.splice(foodIndex, 1)
                }
                this.spawnFood()
                return true

            case EMPTY_CELL:
            default:
                return false
        }
    }

    handleDirection(newDir) {
        if (!newDir) {
            return
        }

        var dirDiff = sumV2(this.player.dir, newDir)
        if (dirDiff[0] === 0 && dirDiff[1] === 0) {
            return
        }

        this.player.dir = newDir
        this.forceUpdate()
    }

    handleKeyPress(e) {
        if (!this.renderingPausePromise) {
            switch (e.code) {
                case 'ArrowUp':
                    this.handleDirection(DIR_ARR[0])
                    return
                case 'ArrowRight':
                    this.handleDirection(DIR_ARR[1])
                    return
                case 'ArrowDown':
                    this.handleDirection(DIR_ARR[2])
                    return
                case 'ArrowLeft':
                    this.handleDirection(DIR_ARR[3])
                    return
                case 'Space':
                    this.showPauseScreen()
                    return
                default:
                    return
            }
        }

        // pause handler
        switch (e.code) {
            case 'Space':
                this.resume()
                break
        }
    }

    reset(dir = [0, 0]) {
        this.field = new Array(GRID_ROWS).fill(0).map(() => new Array(GRID_COLUMNS).fill(EMPTY_CELL))
        if (this.player) {
            this.player.destroy()
        }
        this.foodList.forEach((food) => food.destroy())

        this.score = 0
        this.foodList = []
        this.player = new Player(this.gridCellUnitPx, this.getGridPosInPx)
        const snakePosList = [
            [2, 0],
            [1, 0],
            [0, 0],
        ]
        this.player.init(this.eatCell.bind(this), snakePosList, dir)
        snakePosList.forEach((pos) => this.setField(pos, SNAKE_CELL))
        this.spawnFood()
        this.loadObject(this.player)
    }

    run(loadObject) {
        this.loadObject = loadObject
        this.shouldResetOnResume = true
        this.showStartScreen()

        window.addEventListener('keydown', (e) => {
            // too lazy to handle unsub properly
            this.handleKeyPress(e)
        })
    }

    stop() {
        this.shouldStop = true
    }

    update(tick) {
        if (this.renderingPausePromise || !this.player || (tick != 0 && tick != 30)) {
            return
        }

        if (this.player.shouldBeDestroyed || !checkIsInBounds(this.player.headPos())) {
            this.showFinalScore()
            return
        }

        // reflect objects to the field.
        this.foodList.forEach((food) => this.setField(food.gridPos, FOOD_CELL))
        this.setField(this.player.headPos(), SNAKE_CELL)
        this.setField(this.player.tailPos(), SNAKE_CELL)
    }
}

export default GameLogic
