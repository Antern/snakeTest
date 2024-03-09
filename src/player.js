class Player {
    shouldBeDestroyed = false
    eatCellFn

    constructor(cellSize, getGridPosInPx) {
        this.cellSize = cellSize
        this.getGridPosInPx = getGridPosInPx
        this.snakePosList = []
    }

    // custom

    init(eatCellFn, snakePosList, dir) {
        this.snakePosList = snakePosList
        this.eatCellFn = eatCellFn
        this.dir = dir
    }

    headPos() {
        return this.snakePosList.at(0)
    }

    tailPos() {
        return this.snakePosList.at(-1)
    }

    snakeLength() {
        return this.snakePosList.length
    }

    drawCell(ctx, pos) {
        ctx.fillStyle = 'lightgreen'
        ctx.fillRect(pos[0], pos[1], this.cellSize, this.cellSize)
    }

    drawEye(ctx, centerPos) {
        // eye size 3x3
        ctx.fillStyle = 'yellow'
        ctx.strokeStyle = 'black'
        ctx.lineWidth = 1
        ctx.beginPath()
        ctx.ellipse(centerPos[0], centerPos[1], 6, 3, 0, 0, 2 * Math.PI)
        ctx.fill()
        ctx.stroke()
        ctx.fillStyle = 'red'
        ctx.fillRect(centerPos[0] - 2, centerPos[1] - 3, 3, 6)
    }

    _getRotDeg() {
        switch (true) {
            case this.dir[1] === -1:
                return 180
            case this.dir[0] === 1:
                return -90
            case this.dir[1] === 1:
                return 0
            case this.dir[0] === -1:
                return 90
        }
    }

    drawHead(ctx, pos) {
        this.drawCell(ctx, pos)
        this.drawEye(ctx, [pos[0] + this.cellSize * 0.3, pos[1] + this.cellSize * 0.5])
        this.drawEye(ctx, [pos[0] + this.cellSize * 0.7, pos[1] + this.cellSize * 0.5])
    }

    // gameObject

    destroy() {
        this.shouldBeDestroyed = true
    }

    update(tick) {
        if (tick != 0 && tick != 30) {
            return
        }

        var headPos = this.headPos()
        var newPos = [headPos[0] + this.dir[0], headPos[1] + this.dir[1]]

        const hasFood = this.eatCellFn(newPos, this.tailPos())

        this.snakePosList.unshift(newPos)
        if (!hasFood) {
            this.snakePosList.pop()
        }
    }

    draw(ctx) {
        this.snakePosList.slice(0, 1).forEach((cell) => this.drawHead(ctx, this.getGridPosInPx(cell)))
        this.snakePosList.slice(1).forEach((cell) => this.drawCell(ctx, this.getGridPosInPx(cell)))
    }
}

export default Player
