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
    this.list[0] = this.getRndFreePos(gameField);
    //gameField.update();
    
  }

  // UPDATE FOOD POSITION
  updatePos(newPosition) {
      this.list[0].x = newPosition.x;
      this.list[0].y = newPosition.y;
      this.eaten = false;
  };
}