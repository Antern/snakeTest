const foodImg = new Image()
foodImg.src =
    'data:img/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAKCAMAAAC38k/IAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAOVBMVEX///8JJgDsLwDrLgDrLwDrLgDsLwBn/wBo/wAAAADsLwDnLgDoLgDrLwDrLgDnLQDpLgDlLQD///+X4fLXAAAAB3RSTlMAAQIBAQIBGLc12wAAAAFiS0dEAIgFHUgAAAAHdElNRQfoAwkSKw/1BpHzAAAATUlEQVQI10WLCw6AMAhDcf6gWjbvf1m7LdFHgJJSs8lpH4v7f4R7GWIFrnAAm1nRwt0H5BAJShK7HQRTrVIMSGY3WMYfapsRgRbxUOIFmDIDBS3ftboAAAAASUVORK5CYII='

class FoodRect {
    shouldBeDestroyed = false
    color
    centerPos
    gridPos

    constructor(gridPos, pos, cellSize, color = 'lightyellow') {
        this.gridPos = gridPos
        this.color = color
        this.centerPos = [pos[0] + cellSize * 0.5, pos[1] + cellSize * 0.5]
    }

    destroy() {
        this.shouldBeDestroyed = true
    }

    update() {}

    draw(ctx) {
        ctx.drawImage(
            foodImg,
            this.centerPos[0] - foodImg.width * 0.5,
            this.centerPos[1] - foodImg.height * 0.5,
            foodImg.width,
            foodImg.height,
        )
    }
}

export default FoodRect
