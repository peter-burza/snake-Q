import { BLOCK_SIZE, GAMEFIELD_WIDTH, GAMEFIELD_HEIGHT } from './config.js'
import { getRndNum } from './Global_Functions.js'

export default class GameField {
  field
  constructor() {
    this.offset = BLOCK_SIZE / 10

    /* GET CANVAS CONTEXT */
    this.canvas = document.getElementById("canvas");
    this.ctx = this.canvas.getContext("2d");
    /* CANVAS STYLE DECLARATION */
    this.canvas.width = GAMEFIELD_WIDTH * BLOCK_SIZE;
    this.canvas.height = GAMEFIELD_HEIGHT * BLOCK_SIZE;
    
    //Create Game Field
    this.fillGameField()
  }
  
  init(snakeX, snakeY, snakeJoints, snakeColor, foodList, foodColor) {
    this.update(snakeX, snakeY, snakeJoints, snakeColor, foodList, foodColor)
    this.draw(snakeColor, foodColor)
  }

  // CREATE GAME FIELD
  fillGameField() {
    this.field = []
    for (let r = 0; r < GAMEFIELD_HEIGHT; r += 1) {
      for (let c = 0; c < GAMEFIELD_WIDTH; c += 1) {
        this.field.push({ x: c, y: r, info: 'free'})
      }
    }
  }
  
  update(snakeX, snakeY, snakeJoints, snakeColor, foodList, foodColor) {
    //if (snake === null && food === null) return

    for (const fieldPosition of this.field) {
      fieldPosition.info = 'free' // default to free

      if (snakeX !== null && (fieldPosition.x === snakeX && fieldPosition.y === snakeY || snakeJoints.some((joint) => joint.x === fieldPosition.x && joint.y === fieldPosition.y))) {
        fieldPosition.info = 'snake'
      }

      if (foodList !== null && fieldPosition.x === foodList[0].x && fieldPosition.y === foodList[0].y) {
        fieldPosition.info = 'food'
      }
    }
  }

  isThisPositionFree(pos2) {
    const posInfo = this.field.find(pos1 => po1.x === pos2.x && pos1.y === pos2.y)
    if (posInfo === 'free') return true;
    return false;
  }

  draw(snakeColor, foodColor) {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
    for (let i = 0; i < this.field.length; i++) {
      if (this.field[i].info === 'snake') { // draw snake
        this.ctx.fillStyle = snakeColor
        this.ctx.fillRect(this.px(this.field[i].x) + this.offset/2, this.px(this.field[i].y) + this.offset/2, BLOCK_SIZE - this.offset, BLOCK_SIZE - this.offset)
      }
      if (this.field[i].info === 'food') { // draw food
        this.ctx.fillStyle = foodColor
        this.ctx.fillRect(this.px(this.field[i].x) + this.offset / 2, this.px(this.field[i].y) + this.offset / 2, BLOCK_SIZE - this.offset, BLOCK_SIZE - this.offset)
      }
    }
  }
  
  px(num) { // returns the position in pixels
    return num * BLOCK_SIZE
  }

  // GET RANDOM FREE POSITION IN CANVAS
  getRndFreePos() {
    let rndNum = '';
    do {
      rndNum = getRndNum(0, this.field.length - 1);
    } while (this.field[rndNum].info !== 'free')
    const rndPos = { x: this.field[rndNum].x, y: this.field[rndNum].y };
    return rndPos;
  }
}