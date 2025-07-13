import { BLOCK_SIZE, GAMEFIELD_WIDTH, GAMEFIELD_HEIGHT } from './config.js'
import { getRndNum } from './Global_Functions.js'

export default class GameField {
  field
  constructor() {
    // /* GET CANVAS CONTEXT */
    this.canvas = document.getElementById("canvas")
    this.ctx = this.canvas.getContext("2d")
    // /* CANVAS STYLE DECLARATION */
    this.canvas.width = GAMEFIELD_WIDTH * BLOCK_SIZE
    this.canvas.height = GAMEFIELD_HEIGHT * BLOCK_SIZE
  }

  positionsStateUpdate(givenOcupiedPositions) {
    const ocupiedPositions = Array.isArray(givenOcupiedPositions) ? givenOcupiedPositions : [givenOcupiedPositions]
    this.field = []
    for (let y = 0; y < GAMEFIELD_HEIGHT; y++) {
      for (let x = 0; x < GAMEFIELD_WIDTH; x++) {
        let isNotOcupied = true
        for (const pos of ocupiedPositions) {
          if (pos.x === x && pos.y === y) isNotOcupied = false
        }
        this.field.push({ position: { x: x, y: y }, isFree: isNotOcupied })
      }
    }
  }

  ocupiePosition(position) {
    this.findPosition(position).isFree = false;
  }

  findPosition(position) {
    return this.field.find(place => place.position.x === position.x && place.position.y === position.y)
  }

  isThisPositionFree(position) {
    if (position.isFree === true) return true;
    return false;
  }

  // GET RANDOM FREE POSITION IN gameField
  getRndFreePos() {
    let rndNum
    do {
      rndNum = getRndNum(0, this.field.length)
    } while (this.field[rndNum].isFree === false)
    const rndPos = { x: this.field[rndNum].position.x, y: this.field[rndNum].position.y }
    return rndPos
  }
}