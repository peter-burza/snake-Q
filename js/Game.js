import { GAME_MODE, GAMEFIELD_WIDTH, GAMEFIELD_HEIGHT} from './config.js'
import GameField from './Game_Field.js'
import Snake from './Snake.js'
import Food from './Food.js'

export default class Game {
  highScore = null
  paused = false
  isPlaying = null
  speedincrease = false
  score = null
  
  constructor() {
    // CLASS REFERENCES
    this.gameField = new GameField()
    // GAME INIT
    this.speed = 200
    this.speedIncrement = 30
    this.loadHighScore()
    // EVENT LISTENERS
    window.addEventListener('keydown', (event) => this.togglePlayPause(event))
    document.getElementById("highScoreReset").addEventListener("click", () => this.resetHighScore())
    document.getElementById("reset").addEventListener("click", () => this.resetGame())
  }

  init() {
    // ASSIGN NEW POSITIONS
    //this.food.resetSnake(this.gameField.getRndFreePos())
    //this.snake.assignPosition(this.gameField.getRndFreePos())
    this.food = new Food(this.gameField.getRndFreePos())
    this.snake = new Snake()
    this.gameField.init(this.snake.position.x, this.snake.position.y, this.snake.joints, this.snake.color, this.food.list, this.food.color)
    this.isPlaying = false
    this.score = 0
    this.refreshScore()
    document.getElementById("startingDirection").innerHTML = Object.keys(this.snake.directions).find(key => this.snake.directions[key] === this.snake.actualDir)
  }

  resetGame() {
    this.gameField.fillGameField()
    this.init()
    clearInterval(this.gameInterval)
    this.gameInterval = setInterval(() => this.loop(), this.speed)
  }
  
  togglePlayPause(event) {
    if (event.key !== 'p') return
    if (!this.snake.alive) return

    if (this.isPlaying) {
      this.isPlaying = false
      clearInterval(this.gameInterval)
      return
    }
    this.isPlaying = true
    clearInterval(this.gameInterval)
    this.gameInterval = setInterval(() => this.loop(), this.speed)
  }

  gameOver() {
    console.log('Game Over... :(')
    clearInterval(this.gameInterval)
  }

  // --- GAME LOOP --- //
  loop() {
    // GAME STATE
    if (!this.isPlaying) return

    // SET SNAKE DIRECTION
    this.snake.tryChangeDirection()
    
    // SNAKE/WALL MEET
    this.checkWallMeet()
    //SNAKE/SNAKE COLLISION
    if (this.snake.joints.some((joint) => { return this.collisionCheck(this.snake.position, {x: joint.x, y: joint.y}, this.snake.actualDir)})) this.snake.alive = false;
    // SNAKE/FOOD COLLISION
    if (this.food.list.some((food) => { return this.collisionCheck(this.snake.position, {x: food.x, y: food.y}, this.snake.actualDir)})) this.food.eaten = true;
    
    // CHECKING IF IT IS GAME OVER
    if (!this.snake.alive) {
      this.gameOver()
      return
    }
    
    // ADD SNAKE JOINT / update score
    if (this.food.eaten) this.updateScore()
    
    // UPDATE
    this.snake.updatePosition()
    this.food.updatePos(this.gameField.getRndFreePos())
    this.gameField.update(this.snake.position.x, this.snake.position.y, this.snake.joints, this.snake.color, this.food.list, this.food.color)
    // RENDER
    this.gameField.draw(this.snake.color, this.food.color)

    // INCREASE THE GAME SPEED
    if (this.speedincrease) {
      this.speed -= this.speedIncrement
      this.speedincrease = false
      clearInterval(this.gameInterval)
      this.gameInterval = setInterval(() => this.loop(), this.speed)
    }
  }

  saveHighScore(highScore) { // Save high score to local storage
    this.highScore = highScore
    localStorage.setItem("highScore", this.highScore)
    this.refreshScore()
  }

  loadHighScore() { // Load high score from local storage
    this.highScore = localStorage.getItem("highScore")
    if (this.highScore === null) this.highScore = 0
      this.refreshScore()
  }

  resetHighScore() { // Sets the high score to 0
    let decision = confirm("Are you sure you want to reset your high score?") // asks the Question. Returns true false, depending on what the user sets OK/Cancel
    if (!decision) return
    
    this.saveHighScore(0)
  }

  refreshScore() {
    document.getElementById("highscore").innerHTML = this.highScore
    document.getElementById("score").innerHTML = this.score
  }

  updateScore () {
    // if (highScore !== null) {
    //   document.getElementById("highscore").innerHTML = this.highScore
    //   return
    // }
    this.snake.addJoint()
    this.score += 1
    this.refreshScore()

    if (this.score > this.highScore) {
      this.saveHighScore(this.score)
    }
  }

  collisionCheck(pos1, pos2, actualSnakeDirection) {
    if (pos1.y === pos2.y) { // vnorene dve podmienky budu relevantne iba ak je splnena aktualna podmienka
      if (
        pos1.x + 1 === pos2.x && actualSnakeDirection === this.snake.directions.right || // right
        pos1.x - 1 === pos2.x && actualSnakeDirection === this.snake.directions.left     // left
      ) return true
    } else if (pos1.x === pos2.x) { // vnorene dve podmienky budu relevantne iba ak je splnena aktualna podmienka
      if (
        pos1.y - 1 === pos2.y && actualSnakeDirection === this.snake.directions.up ||  // up
        pos1.y + 1 === pos2.y && actualSnakeDirection === this.snake.directions.down   // down
      ) return true
    }
    return false
  }

  checkWallMeet() { // Checks if snake will collide/pass the wall, depends on the game mode
    if (
      this.snake.position.x >= GAMEFIELD_WIDTH - 1 && this.snake.actualDir === this.snake.directions.right || // right - kontroluje ci je prava strana kocky hlavy hada na pravej stene a zaroven dalsi smer pohybu hada je vpravo, cize koliduje
      this.snake.position.x <= 0 && this.snake.actualDir === this.snake.directions.left || // left
      this.snake.position.y >= GAMEFIELD_HEIGHT - 1 && this.snake.actualDir === this.snake.directions.down || // down
      this.snake.position.y <= 0 && this.snake.actualDir === this.snake.directions.up // up
    )  {
      if (GAME_MODE === 'wall') {
        this.snake.alive = false
        return;
      } else {
        this.snake.wallTeleport = true;
      }
    }
  }
}