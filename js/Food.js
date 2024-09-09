export default class Food {
  list = [];
  constructor() {
    this.color = "#c90036";
    this.eaten = false;
  };

  assignPosition(newPosition) {
    this.list[0] = newPosition;
  }

  // UPDATE FOOD POSITION
  updatePos(newPosition) {
    if (this.eaten) {
      this.list[0].x = newPosition.x;
      this.list[0].y = newPosition.y;
      this.eaten = false;
    }
  };
}