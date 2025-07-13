import Creature from './Creature.js'
import { GAMEFIELD_WIDTH, GAMEFIELD_HEIGHT, GAME_MODE, CREATURE_TYPES } from './config.js'

export default class Snake extends Creature {
  constructor(name, x, y, headColor, jointColor, controlButtons) {
    super(CREATURE_TYPES.snake, x, y, headColor, jointColor, controlButtons)
    this.wallTeleport = false
    this.dirList = []
    this.name = name
    this.actualBodyLength = 2

    window.addEventListener('keydown', this.addDirectionToQueue.bind(this))
  }

  // ----------------- MOVEMENT ----------------- //
  addDirectionToQueue(event) {
    if (!Object.values(this.directions).some(value => value === event.code)) return // if input key is valid
    if (this.dirList.length === 0) { // if dirList is empty
      if (event.code === this.actualDir) return // if player set actual direction
      if (this.areOppositeDirections(this.actualDir, event.code)) return // if player set opposite direction
    } else { // if dirList is not empty
      if (event.code === this.dirList[0]) return // if player set actual direction
      if (this.areOppositeDirections(this.dirList[0], event.code)) return// if player set opposite direction
    }
    this.dirList.unshift(event.code) // add the direction to queue
  }

  isChangeDirRequested() {
    if (this.dirList.length === 0) return false
    return true
  }

  tryChangeDirection() {
    if (!this.isChangeDirRequested()) return
    this.actualDir = this.dirList[this.dirList.length - 1] // actualDir = last element of dirList
    this.dirList.pop()
  }

  // ----------------- HEAD POSITION UPDATE ----------------- //
  updateHeadPos() {
    let upUpdate = -1
    let downUpdate = 1
    let leftUpdate = upUpdate
    let rightUpdate = downUpdate
    if (this.wallTeleport) { // wall passing
      this.wallTeleport = false;
      upUpdate = GAMEFIELD_HEIGHT - 1
      downUpdate = - GAMEFIELD_HEIGHT + 1
      leftUpdate = GAMEFIELD_WIDTH - 1
      rightUpdate = - GAMEFIELD_WIDTH + 1
    }
    super.updateHeadPos(upUpdate, downUpdate, leftUpdate, rightUpdate)
  }

  getNextPosition() {
    let posIncrementX
    let posIncrementY
    if (this.wallTeleport) { posIncrementX = - GAMEFIELD_WIDTH + 1; posIncrementY = - GAMEFIELD_HEIGHT + 1 }
    return super.getNextPosition(this.actualDir, posIncrementX, posIncrementY)
  }

  checkWallMeet() { // Checks if snake will collide/pass the wall, depends on the game mode
    if (this.headPos.x < GAMEFIELD_WIDTH - 1 && this.actualDir === this.directions.right || // right - kontroluje ci je prava strana kocky hlavy hada na pravej stene a zaroven dalsi smer pohybu hada je vpravo, cize koliduje
      this.headPos.x > 0 && this.actualDir === this.directions.left || // left
      this.headPos.y < GAMEFIELD_HEIGHT - 1 && this.actualDir === this.directions.down || // down
      this.headPos.y > 0 && this.actualDir === this.directions.up) // up
      return;
    if (GAME_MODE === 'infinite') {
      this.wallTeleport = true;
      return;
    }
    this.alive = false
  }

}