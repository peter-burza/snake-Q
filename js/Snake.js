import Moveable from './Moveable.js';
import { GAMEFIELD_WIDTH, GAMEFIELD_HEIGHT } from './config.js'

export default class Snake extends Moveable {
  x;
  y;
  constructor(food, gameField) {
    super();
    // position of left-top corner of the snake head block
    this.assignPosition(gameField);
    // other properties
    this.alive = true;
    this.color = "black";
    this.wallPassed = false
    this.dirList = [];
    this.joints = []; // array to store all joints of the snake

    this.food = food;
    
    window.addEventListener('keydown', this.addDirectionToQueue.bind(this));
  };
  
  assignPosition(gameField) {
    const rndFreePos = this.getRndFreePos(gameField.field); 
    this.x = rndFreePos.x;
    this.y = rndFreePos.y;
    gameField.update();
  };
  
  // ----------------- MOVEMENT ----------------- //
  addDirectionToQueue(event) {
    if (!Object.values(this.directions).some(value => value === event.code)) return; // if input key is valid
    if (this.dirList.length === 0) { // if dirList is empty
      if (event.code === this.actualDir) return; // if player set actual direction
      if (this.areOppositeDirections(this.actualDir, event.code)) return; // if player set opposite direction
    } else { // if dirList is not empty
      if (event.code === this.dirList[0]) return; // if player set actual direction
      if (this.areOppositeDirections(this.dirList[0], event.code)) return;// if player set opposite direction
    }
    this.dirList.unshift(event.code); // add the direction to queue
  };

  isChangeDirRequested() {
    if (this.dirList.length === 0) return false;
    return true;
  }
  
  tryChangeDirection() {
    if (!this.isChangeDirRequested()) return;
    this.actualDir = this.dirList[this.dirList.length - 1]; // actualDir = last element of dirList
    this.dirList.pop()
  };

  areOppositeDirections(dir1, dir2) {
    if (dir1 === this.directions.up && dir2 === this.directions.down ||
        dir1 === this.directions.left && dir2 === this.directions.right ||
        dir1 === this.directions.down && dir2 === this.directions.up ||
        dir1 === this.directions.right && dir2 === this.directions.left
    ) {
      return true;
    }
    return false;
  };


  // ----------------- POSITION UPDATE ----------------- //
  updatePosition() {    
    // UPDATE POS OF ALL JOINTS [poloha metody updateJointsPos je tu lebo po zmene 'pos of head' uz jej pozicia nie je znama]
    this.updateJointsPos();

    if (this.wallPassed) {
      this.wallPassed = false;
      switch (this.actualDir) {
        case this.directions.up:
          this.y = 14;
          break;
        case this.directions.down:
          this.y = 0;
          break;
        case this.directions.left:
          this.x = 19;
          break;
        case this.directions.right:
          this.x = 0;
          break;
      }
      return;
    }
    
    // UPDATE POS OF HEAD
    switch (this.actualDir) {
      case this.directions.up:
        this.y -= 1;
        break;
      case this.directions.down:
        this.y += 1;
        break;
      case this.directions.left:
        this.x -= 1;
        break;
      case this.directions.right:
        this.x += 1;
        break;
    }
  };

  updateJointsPos() {
    // update the position of all joints
    for (let i = this.joints.length - 1; i > 0; i--) {
      this.joints[i].x = this.joints[i - 1].x;
      this.joints[i].y = this.joints[i - 1].y;
    }

    // update the position of the first joint
    if (this.joints.length > 0) {
      this.joints[0].x = this.x;
      this.joints[0].y = this.y;
    }
  };

  addJoint() {
    if (this.joints.length === 0) {
      this.joints.push({ x: this.x, y: this.y });
      return;
    }
    this.joints.push({ x: this.joints[this.joints.length - 1].x, y: this.joints[this.joints.length - 1].y });
  };

  
  // ------------ COLLISION CHECK ------------ //
  collisionCheck(array, type) {
    if (type === 'snake' || type === 'food') {      
      for (let i = 0; i < array.length; i++) {
        if (this.y === array[i].y) { // vnorene dve podmienky budu relevantne iba ak je splnena aktualna podmienka
          if (
            this.x + 1 === array[i].x && this.actualDir === this.directions.right || // right
            this.x - 1 === array[i].x && this.actualDir === this.directions.left  || // left
            this.x - (GAMEFIELD_WIDTH - 1) === array[i].x && this.actualDir === this.directions.right || // right - wall pass
            this.x + (GAMEFIELD_WIDTH - 1) === array[i].x && this.actualDir === this.directions.left     // left - wall pass
          ) {
            if (type === 'snake') this.alive = false;
            if (type === 'food') this.food.eaten = true;
          }
        }
        if (this.x === array[i].x) { // vnorene dve podmienky budu relevantne iba ak je splnena aktualna podmienka
          if (
            this.y - 1 === array[i].y && this.actualDir === this.directions.up ||  // up
            this.y + 1 === array[i].y && this.actualDir === this.directions.down ||   // down
            this.y + (GAMEFIELD_HEIGHT - 1) === array[i].y && this.actualDir === this.directions.up ||   // up - wall pass
            this.y - (GAMEFIELD_HEIGHT - 1) === array[i].y && this.actualDir === this.directions.down   // down - wall pass
          ) {
            if (type === 'snake') this.alive = false;
            if (type === 'food') this.food.eaten = true;
          }
        }
      }
    }

    // WALL/SNAKE COLLISION
    if (type === 'wall' || type === 'infinite') {
      if (
        this.x >= GAMEFIELD_WIDTH - 1 && this.actualDir === this.directions.right || // right - kontroluje ci je prava strana kocky hlavy hada na pravej stene a zaroven dalsi smer pohybu hada je vpravo, cize koliduje
        this.x <= 0 && this.actualDir === this.directions.left || // left
        this.y >= GAMEFIELD_HEIGHT - 1 && this.actualDir === this.directions.down || // down
        this.y <= 0 && this.actualDir === this.directions.up // up
      )  {
        if (type === 'wall') {this.alive = false; console.log('wall coll detected.');}
        if (type === 'infinite') {this.wallPassed = true; console.log('wall pass detected.');}
      }
    }
  };

  hasColided(wallMode) {
    // SNAKE/WALL COLLISION
    this.collisionCheck(null, wallMode);

    //SNAKE/SNAKE COLLISION
    this.collisionCheck(this.joints, 'snake');

    // SNAKE/FOOD COLLISION
    this.collisionCheck(this.food.list, 'food');
  };

  getNewStartingPosition() {
    
  }
}