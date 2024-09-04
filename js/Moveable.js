import Drawable from './Drawable.js';

export default class Moveable extends Drawable {
  constructor() {
    super();
    this.directions = {up: 'KeyW', down: 'KeyS', left: 'KeyA', right: 'KeyD'};
    let randomDirection = this.directions[Object.keys(this.directions)[this.getRndNum(0, Object.keys(this.directions).length)]]; // returns random value from this.directions
    this.actualDir = randomDirection;
  }
}