import Drawable from './Drawable.js'

export default class Moveable extends Drawable {
  constructor(/*x, y, headColor, jointColor, */initialControlButtons) {
    super()
    const controlButtons = initialControlButtons || [0, 1, 2, 3]
    this.directions = { up: controlButtons[0], down: controlButtons[1], left: controlButtons[2], right: controlButtons[3] }
    //let randomDirection = this.directions[Object.keys(this.directions)[getRndNum(0, Object.keys(this.directions).length)]]; // returns random value from this.directions
    //this.actualDir = randomDirection
    this.actualDir = this.directions.down
  }
}