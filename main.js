let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");

// changes
// GAME OBJECT DECLARATION
const game = {
  width: 20,
  height: 15,
  speed: 400,
  speedIncrement: 30,
  gameOver: false,
  blockSize: 20,
  score: 0,
  state: 'play',
  speedIncrease: false,
  field: [],

  // CREATE GAME FIELD
  fillGameField() {
    for (let r = 0; r < this.height * this.blockSize; r += this.blockSize) {
      for (let c = 0; c < this.width * this.blockSize; c += this.blockSize) {
        this.field.push({x: c, y: r, info: 'free',});
      }
    }
  },

  // UPDATE GAME FIELD
  updateGameField() {
    for (let i = 0; i < this.field.length; i++) {
      // SNAKE HEAD 
      if (this.field[i].x === snake.x && this.field[i].y === snake.y) {
        this.field[i].info = 'snake';
        continue;
      }
      // SNAKE JOINTS
      for (let j = 0; j < snake.joints.length; j++) {
        if (this.field[i].x === snake.joints[j].x && this.field[i].y === snake.joints[j].y) {
          this.field[i].info = 'snake';
          continue;
        }
      }
      // FOOD
      if (this.field[i].x === food.list[0].x && this.field[i].y === food.list[0].y) {
        this.field[i].info = 'food';
        continue;
      }
    }
  },

  report() {

  },

  // --- GAME LOOP --- //
  loop() {
    // GAME STATE
    if (game.state === 'play') {
      // UPDATE
      snake.updatePosition();
      game.updateGameField();
      //snakecollisionCheck();
      //updateScore();

      // RENDER
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      snake.draw();
      food.draw();
      //drawScore();

      // REPORT
      game.report();

      // CHECKING IF IT IS GAME OVER
      if (game.gameOver) {
        console.log('Game Over!');
        clearInterval(gameInterval);
        return;
      }

      // INCREASE THE GAME SPEED
      if (game.speedIncrease) {
        game.speed -= game.speedIncrement;
        console.log(game.speed);
        game.speedIncrease = false;
        clearInterval(gameInterval);
        gameInterval = setInterval(game.loop, game.speed);
      }
    }

    // MENU STATE
    if (game.state === 'menu') {
      clearInterval(gameInterval);
      menu.draw();
    }
  },

  // DRAW INITIAL GAME ENVIRONMENT
  drawInitialEnv() {
    game.fillGameField();
    snake.draw(); // DRAWING THE SNAKE ON ITS STARTING POSITION
    food.draw();  // DRAWING THE FOOD ON ITS FIRST POSITION
  },

  getRndNum(min, max) {
    let rndNum = Math.floor(Math.random() * (max - min) ) + min;
    return rndNum;
  },

  // GET RANDOM FREE POSITION IN CANVAS
  getRndFreePos() {
    let rndNum = this.getRndNum(0, this.field.length - 1);
    console.log(this.field);
    do {
      rndNum = this.getRndNum(0, this.field.length - 1);
      if (this.field[rndNum].info === 'free') 
        return {x: this.field[rndNum].x, y: this.field[rndNum].y};
    } while (this.field[rndNum].info !== 'free')
  },

  updateScore() {
    snake.addJoint();
  },

  // COLLISION CHECK
  collisionCheck(x, y, array, type) {
    if (type === 'snake' || type === 'food') {
      for (let i = 0; i < array.length; i++) {
        if (y === array[i].y) { // vnorene dve podmienky budu relevantne iba ak je splnena aktualna podmienka
          if (
            x + game.blockSize === array[i].x && snake.actualDir === 'd' || // prava
            x - game.blockSize === array[i].x && snake.actualDir === 'a'    // lava
          ) {
            if (type === 'snake') snake.alive = false;
            if (type === 'food') food.eaten = true;
          }
        }
        if (x === array[i].x) { // vnorene dve podmienky budu relevantne iba ak je splnena aktualna podmienka
          if (
            y - game.blockSize === array[i].y && snake.actualDir === 'w' ||  // horna
            y + game.blockSize === array[i].y && snake.actualDir === 's'     // spodna
          ) {
            if (type === 'snake') snake.alive = false;
            if (type === 'food') food.eaten = true;
          }
        }
      }
    }

    // WALL/SNAKE COLLISION
    if (type === 'wall') {
      if (
        x + game.blockSize >= wall.width && snake.actualDir === 'd' || // prava - kontroluje ci je prava strana kocky hlavy hada na pravej stene a zaroven dalsi smer pohybu hada je vpravo, cize koliduje
        x <= wall.x && snake.actualDir === 'a' || // lava
        y + game.blockSize >= wall.height && snake.actualDir === 's' || // horna
        y <= wall.y  && snake.actualDir === 'w' // spodna
      ) snake.alive = false;
    }
  },
}

/* CANVAS STYLE DECLARATION (Why it is here? Cause when it was in style.css it causes 
   resolution problems with rectFill()) */
   canvas.width = game.width * game.blockSize;
   canvas.height = game.height * game.blockSize;

// MENU OBJECT DECLARATION
const menu = {
  draw() {
    console.log('im in manu draw func');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'grey';
    ctx.fillRect(canvas.width * 0.2, canvas.height * 0.25, canvas.width * 0.6, canvas.height * 0.5);
    ctx.font = '24px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#fff';
    ctx.fillText('Menu', canvas.width / 2, canvas.height / 2);
    this.drawButton(50, 50, 100, 50);
    canvas.addEventListener('click', (event) => {
      const rect = canvas.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
    
      if (x >= 50 && x <= 150 && y >= 50 && y <= 100) {
        console.log('Button clicked!');
      }
    });
  },

  drawButton(x, y, width, height, text) {
    ctx.fillStyle = 'lightblue';
    ctx.fillRect(x, y, width, height);
    ctx.fillStyle = 'black';
    ctx.font = '16px Arial';
    ctx.fillText(text, x + width / 2 - ctx.measureText(text).width / 2, y + height / 2 + 8);
  }
}

// SNAKE OBJECT DECLARATION
const snake = {
  // position of left-top corner
  x: 100,
  y: 140,
  // measures
  offset: game.blockSize / 10,
  // other properties
  alive: true,
  snakeColor: "black",
  borderColor: "#cbd6cb",
  bodyLength: 1,
  directions: ['w', 'a', 's', 'd'],
  actualDir: 'd',
  nextDir: 'd',
  joints: [{x: 80, y: 140}], // array to store all joints of the snake

  // DRAW THE SNAKE
  draw() {
    //DRAWING SNAKE BODY BORDER
    ctx.fillStyle = this.borderColor;
    ctx.fillRect(this.x, this.y, game.blockSize, game.blockSize); // draw head border
    for (let i = 0; i < this.joints.length; i++) { //draw all joints border
      ctx.fillRect(this.joints[i].x, this.joints[i].y, game.blockSize, game.blockSize);
    }
    // DRAWING SNAKE
    ctx.fillStyle = this.snakeColor;
    ctx.fillRect(this.x + this.offset/2, this.y + this.offset/2, game.blockSize - this.offset, game.blockSize - this.offset); // draw head
    for (let i = 0; i < this.joints.length; i++) { //draw all joints
      ctx.fillRect(this.joints[i].x + this.offset/2, this.joints[i].y + this.offset/2, game.blockSize - this.offset, game.blockSize - this.offset);
    }
  },
  updatePosition() {
        // CHANGING THE DIRECTION
    document.addEventListener('keydown', function(event) { // Is it possible to leave a function itself here, and the document.get.... move on the top of the file?
      if (!snake.directions.includes(event.key)) return; // if input key is valid
      if (event.key === snake.actualDir) return; // if player set oposited direction
      if (snake.actualDir === 'w' && event.key === 's' ||
          snake.actualDir === 'a' && event.key === 'd' ||
          snake.actualDir === 's' && event.key === 'w' ||
          snake.actualDir === 'd' && event.key === 'a'
        ) return;
      const indexOfDirection = snake.directions.indexOf(event.key);
      snake.nextDir = snake.directions[indexOfDirection]; // actualDir update
      }
    );

    // SET SNAKE DIRECTION
    this.actualDir = this.nextDir;
    
    this.collCheck();

    // CHECKING IF THE SNAKE DIED
    if (!this.alive) {
      game.gameOver = true;
      return;
    }

    // FOOD POSITION UPDATE, ADD SNAKE JOINT
    food.updatePos();

    // UPDATE POS OF ALL JOINTS [poloha metody updateJointsPos je tu lebo po zmene 'pos of head' uy nie je znama]
    this.updateJointsPos();

    // UPDATE POS OF HEAD
    switch (this.actualDir) {
      case this.directions[0]:
        this.y -= game.blockSize
        break;
      case this.directions[2]:
        this.y += game.blockSize;
        break;
      case this.directions[1]:
        this.x -= game.blockSize;
        break;
      case this.directions[3]:
        this.x += game.blockSize;
        break;
    }
  },
  collCheck() {
    // SNAKE/WALL COLLISION
    game.collisionCheck(this.x, this.y, null, 'wall');

    //SNAKE/SNAKE COLLISION
    game.collisionCheck(this.x, this.y, this.joints, 'snake');

    // SNAKE/FOOD COLLISION
    game.collisionCheck(this.x, this.y, food.list, 'food');
  },
  addJoint() {
    this.joints.push({x: this.joints[this.joints.length - 1].x, y: this.joints[this.joints.length - 1].y});
    if (snake.joints.length % 5 === 0) game.speedIncrease = true;
  },
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
  },
}

// WALL OBJECT DECLARATION
const wall = {
  x: 1,
  y: 1,
  width: canvas.width,
  height: canvas.height,
}

// APPLE OBJECT DECLARATION
const food = {
  list: [{x: 240, y: 120}],
  size: game.blockSize - snake.offset,
  available: true,
  color: "#c90036",
  eaten: false,

  draw() {
    if (this.available) {
      ctx.fillStyle = this.color;
      for (let i = 0; i < this.list.length; i++) {
        ctx.fillRect(this.list[i].x + snake.offset/2, this.list[i].y + snake.offset/2, this.size, this.size); // draw food block
      }
    }
  },

  updatePos() {
    if (this.eaten) {
      const newRndPos = game.getRndFreePos(1, canvas.width, 1, canvas.height);
      this.list[0].x = newRndPos.x;
      this.list[0].y = newRndPos.y;
      game.updateScore();
      this.eaten = false;
    }
  },
}

game.drawInitialEnv();
let gameInterval = setInterval(game.loop, game.speed);