import GameField from './Game_Field.js';
import Snake from './Snake.js';
import Food from './Food.js';

export default class Game {
  highScore = null;
  paused = false;
  mode = '';
  isPlaying = null;
  speedincrease = false;
  score = null;
  
  constructor() {
    // CLASS REFERENCES
    this.gameField = new GameField();
    this.food = new Food(this.gameField);
    this.snake = new Snake(this.food, this.gameField);
    // EVENT LISTENERS
    window.addEventListener('keydown', (event) => this.togglePlayPause(event));
    document.getElementById("highScoreReset").addEventListener("click", () => this.resetHighScore());
    document.getElementById("reset").addEventListener("click", () => this.resetGame());
  };

  init() {
    // GAMEPLAY
    this.mode = 'infinite';
    this.isPlaying = false;
    // SPEED
    this.speed = 200;
    this.speedIncrement = 30;
    this.loadHighScore();
    this.gameField.init(this.snake, this.food);
    document.getElementById("startingDirection").innerHTML = Object.keys(this.snake.directions).find(key => this.snake.directions[key] === this.snake.actualDir);
  }
  
  togglePlayPause(event) {
    if (event.key !== 'p') return;
    if (!this.snake.alive) return;

    if (this.isPlaying) {
      this.isPlaying = false;
      clearInterval(this.gameInterval);
      return;
    }
    this.isPlaying = true;
    clearInterval(this.gameInterval);
    this.gameInterval = setInterval(() => this.loop(), this.speed);
  }

  gameOver() {
    console.log('Game Over... :(');
    clearInterval(this.gameInterval);
    //this.updateScore(this.highScore);
  };

  resetGame() {
    this.gameField.fillGameField();
    this.food = new Food(this.gameField);
    this.snake = new Snake(this.food, this.gameField);
    this.score = 0;
    this.gameField.init(this.snake, this.food);
    this.isPlaying = false;
    document.getElementById("startingDirection").innerHTML = Object.keys(this.snake.directions).find(key => this.snake.directions[key] === this.snake.actualDir);
    clearInterval(this.gameInterval);
    this.gameInterval = setInterval(() => this.loop(), this.speed);
    //this.init();
  };

  // --- GAME LOOP --- //
  loop() {
    // GAME STATE
    if (!this.isPlaying) return;

    // SET SNAKE DIRECTION
    this.snake.tryChangeDirection();
    
    // CHECK FOR COLLISIONS
    this.snake.hasColided(this.mode);

    // CHECKING IF IT IS GAME OVER
    if (!this.snake.alive) {
      this.gameOver();
      return;
    }
    
    // ADD SNAKE JOINT / update score
    if (this.food.eaten) this.updateScore()
    
    // UPDATE
    this.snake.updatePosition();
    this.food.updatePos(this.gameField.field);
    this.gameField.update(this.snake, this.food);

    // RENDER
    this.gameField.draw(this.snake, this.food);

    // INCREASE THE GAME SPEED
    if (this.speedincrease) {
      this.speed -= this.speedIncrement;
      this.speedincrease = false;
      clearInterval(this.gameInterval);
      this.gameInterval = setInterval(() => this.loop(), this.speed);
    }
  };

  saveHighScore(highScore) { // Save high score to local storage
    this.highScore = highScore;
    localStorage.setItem("highScore", this.highScore);
    document.getElementById("highscore").innerHTML = this.highScore;
  };

  loadHighScore() { // Load high score from local storage
    this.highScore = localStorage.getItem("highScore");
    if (this.highScore === null) this.highScore = 0;
    document.getElementById("highscore").innerHTML = this.highScore;
  };

  resetHighScore() { // Sets the high score to 0
    let decision = confirm("Are you sure you want to reset your high score?"); // asks the Question. Returns true false, depending on what the user sets OK/Cancel
    if (!decision) return;
    
    this.saveHighScore(0);
  };

  updateScore () {
    // if (highScore !== null) {
    //   document.getElementById("highscore").innerHTML = this.highScore;
    //   return;
    // }
    this.snake.addJoint();
    this.score += 1;
    document.getElementById("score").innerHTML = this.score;

    if (this.score > this.highScore) {
      this.saveHighScore(this.score);
    }
  };
}