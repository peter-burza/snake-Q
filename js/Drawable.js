import { BLOCK_SIZE, GAMEFIELD_WIDTH, GAMEFIELD_HEIGHT } from './config.js'

export default class Drawable {
  constructor() {    
    /* GET CANVAS CONTEXT */
    this.canvas = document.getElementById("canvas");
    this.ctx = this.canvas.getContext("2d");
    /* CANVAS STYLE DECLARATION */
    this.canvas.width = GAMEFIELD_WIDTH * BLOCK_SIZE;
    this.canvas.height = GAMEFIELD_HEIGHT * BLOCK_SIZE;
  }

  getRndNum(min, max) {
    let rndNum = Math.floor(Math.random() * (max - min)) + min;
    return rndNum;
  };

  // GET RANDOM FREE POSITION IN CANVAS
  getRndFreePos(field) {
    let rndNum = '';
    do {
      rndNum = this.getRndNum(0, field.length - 1);
    } while (field[rndNum].info !== 'free')
    const rndPos = { x: field[rndNum].x, y: field[rndNum].y };
    return rndPos;
  };
}