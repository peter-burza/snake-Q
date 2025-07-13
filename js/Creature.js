import Moveable from './Moveable.js'
import { STARTING_BODY_LENGTH } from './config.js'

export default class Creature extends Moveable {
  constructor(creatureType, x, y, headColor, jointColor, controlButtons) {
    super(/*x, y, headColor, jointColor, */controlButtons)
    this.headPos = { x: x, y: y }
    this.joints = [] // array to store all joints of the snake
    this.alive = true
    this.headColor = headColor
    this.jointColor = jointColor
    this.startingBodyLength = STARTING_BODY_LENGTH
    this.actualBodyLength = this.startingBodyLength
    this.addJointRequest = false
    this.creatureType = creatureType
  }

  // assignPosition(newPosition) {
  //   const rndFreePos = newPosition
  //   this.position.x = rndFreePos.x
  //   this.position.y = rndFreePos.y
  // }

  draw() {
    const positionsToDraw = this.preparePositionsToDraw()
    super.draw(positionsToDraw)
  }

  preparePositionsToDraw() {
    const preparedPositions = []
    preparedPositions.push({ x: this.headPos.x, y: this.headPos.y, color: this.headColor }) // prepare head position
    this.joints.forEach(joint => preparedPositions.push({ x: joint.x, y: joint.y, color: this.jointColor })) // prepare all joints positions
    return preparedPositions
  }

  // ----------------- POSITION UPDATE ----------------- //
  updateHeadPos(upUpdate, downUpdate, leftUpdate, rightUpdate) {
    this.headPos[this.actualDir === this.directions.up || this.actualDir === this.directions.down ? 'y' : 'x'] +=
      this.actualDir === this.directions.up ? upUpdate :
        this.actualDir === this.directions.down ? downUpdate :
          this.actualDir === this.directions.left ? leftUpdate :
            rightUpdate;
  }

  updateJointsPos() {
    // update the position of all joints
    for (let i = this.joints.length - 1; i > 0; i--) {
      this.joints[i].x = this.joints[i - 1].x
      this.joints[i].y = this.joints[i - 1].y
    }

    // update the position of the first joint
    if (this.joints.length > 0) {
      this.joints[0].x = this.headPos.x
      this.joints[0].y = this.headPos.y
    }
  }

  getNextPosition(actualDir, posIncX, posIncY) {
    let posIncrementX = posIncX || 1
    let posIncrementY = posIncY || 1
    if (actualDir === this.directions.right) return { x: this.headPos.x + posIncrementX, y: this.headPos.y } // right
    if (actualDir === this.directions.left) return { x: this.headPos.x - posIncrementX, y: this.headPos.y }  // left
    if (actualDir === this.directions.up) return { x: this.headPos.x, y: this.headPos.y - posIncrementY }    // up
    return { x: this.headPos.x, y: this.headPos.y + posIncrementY }  // down 
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

  addJoint() {
    this.joints.unshift({ x: this.headPos.x, y: this.headPos.y })
  }
} 