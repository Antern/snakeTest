class FullScreenText {
    shouldBeDestroyed = false

    constructor(cw, ch, gridCellUnitPx, text) {
        this.text = text
        this.draw = (ctx) => {
            ctx.globalAlpha = 0.2
            ctx.fillStyle = '000'
            ctx.fillRect(0, 0, cw, ch)
            ctx.globalAlpha = 1
            ctx.font = '48px serif'
            ctx.fillStyle = 'white'
            ctx.textAlign = 'center'

            const lines = text.split('\n')
            const top = ch * 0.5 - gridCellUnitPx * lines.length * 0.5
            const lineHeihgt = gridCellUnitPx * 2

            lines.forEach((line, index) => {
                ctx.fillText(line, cw * 0.5, top + index * lineHeihgt)
            })
        }
    }

    update() {}

    destroy() {
        this.shouldBeDestroyed = true
    }
}

export default FullScreenText
