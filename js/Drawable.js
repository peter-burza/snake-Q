import { BLOCK_SIZE } from './config.js'

export default class Drawable {
    constructor() {
        this.offset = BLOCK_SIZE / 10
        /* GET CANVAS CONTEXT */
        this.canvas = document.getElementById("canvas")
        this.ctx = this.canvas.getContext("2d")
    }

    draw(positionsToDraw) {
        if (!Array.isArray(positionsToDraw)) positionsToDraw = [positionsToDraw]
        for (const position of positionsToDraw) {
            this.drawPosition(position.x, position.y, position.color)
        }
    }

    drawPosition(x, y, color) {
        this.ctx.fillStyle = color
        this.ctx.fillRect(this.px(x) + this.offset / 2, this.px(y) + this.offset / 2, BLOCK_SIZE - this.offset, BLOCK_SIZE - this.offset)
    }

    px(num) { // returns the position in pixels
        return num * BLOCK_SIZE
    }
}


// export default class Drawable {
//     constructor(x, y, color) {
//         this.positionsToDraw = [{ x: x, y: y, color: color }]
//         this.offset = BLOCK_SIZE / 10
//         /* GET CANVAS CONTEXT */
//         this.canvas = document.getElementById("canvas")
//         this.ctx = this.canvas.getContext("2d")
//     }

//     draw(/*positionsToDraw*/) {
//         for (const position of this.positionsToDraw) {
//             this.drawPosition(position.x, position.y, position.color)
//         }
//     }

//     drawPosition(x, y, color) {
//         this.ctx.fillStyle = color
//         this.ctx.fillRect(this.px(x) + this.offset / 2, this.px(y) + this.offset / 2, BLOCK_SIZE - this.offset, BLOCK_SIZE - this.offset)
//     }

//     px(num) { // returns the position in pixels
//         return num * BLOCK_SIZE
//     }
// }