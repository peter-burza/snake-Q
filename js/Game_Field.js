import { BLOCK_SIZE, GAMEFIELD_WIDTH, GAMEFIELD_HEIGHT } from './config.js'
import Drawable from './Drawable.js';

export default class GameField extends Drawable {
  field;
  constructor() {
    super();
    this.offset = BLOCK_SIZE / 10;
    
    //Create Game Field
    this.fillGameField();
  };

  init(snake, food) {
    this.update(snake, food);
    this.draw(snake, food);
  }

  // CREATE GAME FIELD
  fillGameField() {
    this.field = [];
    for (let r = 0; r < GAMEFIELD_HEIGHT; r += 1) {
      for (let c = 0; c < GAMEFIELD_WIDTH; c += 1) {
        this.field.push({ x: c, y: r, info: 'free'});
      }
    }
  };
  
  update(snake = null, food = null) {
    if (snake === null && food === null) return;

    for (const fieldPosition of this.field) {
      fieldPosition.info = 'free'; // default to free

      if (snake !== null && (fieldPosition.x === snake.x && fieldPosition.y === snake.y || snake.joints.some((joint) => joint.x === fieldPosition.x && joint.y === fieldPosition.y))) {
        fieldPosition.info = 'snake';
      }

      if (food !== null && fieldPosition.x === food.list[0].x && fieldPosition.y === food.list[0].y) {
        fieldPosition.info = 'food';
      }
    }
  }

  draw(snake, food) {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    for (let i = 0; i < this.field.length; i++) {
      if (this.field[i].info === 'snake') { // draw snake
        this.ctx.fillStyle = snake.color;
        this.ctx.fillRect(this.px(this.field[i].x) + this.offset/2, this.px(this.field[i].y) + this.offset/2, BLOCK_SIZE - this.offset, BLOCK_SIZE - this.offset);
      }
      if (this.field[i].info === 'food') { // draw food
        this.ctx.fillStyle = food.color;
        this.ctx.fillRect(this.px(this.field[i].x) + this.offset / 2, this.px(this.field[i].y) + this.offset / 2, BLOCK_SIZE - this.offset, BLOCK_SIZE - this.offset);
      }
    }
  };
  px(num) { // returns the position in pixels
    return num * BLOCK_SIZE;
  }
}