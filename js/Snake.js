import Moveable from './Moveable.js'
import { GAMEFIELD_WIDTH, GAMEFIELD_HEIGHT, GAME_MODE } from './config.js'

export default class Snake extends Moveable {
  color = "black"
  constructor() {
    super()
    this.position = {x: 4, y: 10}
    this.alive = true
    this.wallTeleport = false
    this.dirList = []
    this.joints = [] // array to store all joints of the snake
    
    window.addEventListener('keydown', this.addDirectionToQueue.bind(this))
  }
  
  /*assignPosition(newPosition) {
    const rndFreePos = newPosition
    this.position.x = rndFreePos.x
    this.position.y = rndFreePos.y
  }

  resetSnake(newPosition) {
    this.joints = []
    this.assignPosition(newPosition)
  }*/
  
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

  areOppositeDirections(dir1, dir2) {
    if (dir1 === this.directions.up && dir2 === this.directions.down ||
        dir1 === this.directions.left && dir2 === this.directions.right ||
        dir1 === this.directions.down && dir2 === this.directions.up ||
        dir1 === this.directions.right && dir2 === this.directions.left
    ) {
      return true
    }
    return false
  }


  // ----------------- POSITION UPDATE ----------------- //
  updatePosition() {    
    // UPDATE POS OF ALL JOINTS [poloha metody updateJointsPos je tu lebo po zmene 'pos of head' uz jej pozicia nie je znama]
    this.updateJointsPos()

    if (this.wallTeleport) {
      this.wallTeleport = false
      switch (this.actualDir) {
        case this.directions.up:
          this.position.y = 14
          break
        case this.directions.down:
          this.position.y = 0
          break
        case this.directions.left:
          this.position.x = 19
          break
        case this.directions.right:
          this.position.x = 0
          break
      }
      return
    }
    
    // UPDATE POS OF HEAD
    switch (this.actualDir) {
      case this.directions.up:
        this.position.y -= 1
        break
      case this.directions.down:
        this.position.y += 1
        break
      case this.directions.left:
        this.position.x -= 1
        break
      case this.directions.right:
        this.position.x += 1
        break
    }
  }

  updateJointsPos() {
    // update the position of all joints
    for (let i = this.joints.length - 1; i > 0; i--) {
      this.joints[i].x = this.joints[i - 1].x
      this.joints[i].y = this.joints[i - 1].y
    }

    // update the position of the first joint
    if (this.joints.length > 0) {
      this.joints[0].x = this.position.x
      this.joints[0].y = this.position.y
    }
  }

  addJoint() {
    if (this.joints.length === 0) {
      this.joints.push({ x: this.position.x, y: this.position.y })
      return
    }
    this.joints.push({ x: this.joints[this.joints.length - 1].x, y: this.joints[this.joints.length - 1].y })
  }
}