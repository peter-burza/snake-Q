import { getRndNum } from './Global_Functions.js'

export default class Moveable {
  constructor() {
    this.directions = {up: 'KeyW', down: 'KeyS', left: 'KeyA', right: 'KeyD'};
    let randomDirection = this.directions[Object.keys(this.directions)[getRndNum(0, Object.keys(this.directions).length)]]; // returns random value from this.directions
    this.actualDir = randomDirection;
  }
}