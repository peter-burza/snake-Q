import Drawable from './Drawable.js';

export default class Food extends Drawable {
  list = [];
  constructor(gameField) {
    super();
    this.available = true;
    this.color = "#c90036";
    this.eaten = false;
    this.assignPosition(gameField);
  };

  assignPosition(gameField) {
    this.list[0] = this.getRndFreePos(gameField.field);
    gameField.update();
    
  }

  // UPDATE FOOD POSITION
  updatePos(gameField) {
    if (this.eaten) {
      const newRndPos = this.getRndFreePos(gameField);
      this.list[0].x = newRndPos.x;
      this.list[0].y = newRndPos.y;
      this.eaten = false;
    }
  };
}