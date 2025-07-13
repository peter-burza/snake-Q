import Drawable from './Drawable.js'

export default class Food extends Drawable {
  color = "#c90036"
  constructor(newPosition) {
    super()
    this.position = newPosition
    this.isEaten = false
  }

  draw() {
    super.draw({ x: this.position.x, y: this.position.y, color: this.color })
  }
}