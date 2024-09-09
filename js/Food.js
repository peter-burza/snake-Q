export default class Food {
  color = "#c90036"
  constructor(newPosition) {
    this.eaten = false
    this.list = []
    this.assignPosition(newPosition);
  }

  assignPosition(newPosition) {
    this.list[0] = newPosition
  }
  /*resetFood(newPosition) {
    this.list = []
    this.assignPosition(newPosition)
  }*/

  // UPDATE FOOD POSITION
  updatePos(newPosition) {
    if (this.eaten) {
      this.list[0].x = newPosition.x
      this.list[0].y = newPosition.y
      this.eaten = false
    }
  };
}