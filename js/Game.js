import { GAME_MODE } from './config.js'
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
    this.food = new Food(this.gameField.field)
    this.snake = new Snake(this.food, this.gameField)
    // EVENT LISTENERS
    window.addEventListener('keydown', (event) => this.togglePlayPause(event))
    document.getElementById("highScoreReset").addEventListener("click", () => this.resetHighScore())
    document.getElementById("reset").addEventListener("click", () => this.resetGame())
  }

  init() {
    // GAMEPLAY
    this.isPlaying = false
    // SPEED
    this.speed = 200
    this.score = 0
    this.speedIncrement = 30
    this.loadHighScore()
    this.refreshScore()
    this.gameField.init(this.snake.x, this.snake.y, this.snake.joints, this.snake.color, this.food.list, this.food.color)
    document.getElementById("startingDirection").innerHTML = Object.keys(this.snake.directions).find(key => this.snake.directions[key] === this.snake.actualDir)
    console.log(this.food.list)
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

  resetGame() {
    this.gameField.fillGameField()
    this.food = new Food(this.gameField)
    this.snake = new Snake(this.food, this.gameField)
    this.score = 0
    this.refreshScore()
    this.gameField.init(this.snake, this.food)
    this.isPlaying = false
    document.getElementById("startingDirection").innerHTML = Object.keys(this.snake.directions).find(key => this.snake.directions[key] === this.snake.actualDir)
    clearInterval(this.gameInterval)
    this.gameInterval = setInterval(() => this.loop(), this.speed)
    //this.init()
  }

  // --- GAME LOOP --- //
  loop() {
    // GAME STATE
    if (!this.isPlaying) return

    // SET SNAKE DIRECTION
    this.snake.tryChangeDirection()
    
    // CHECK FOR COLLISIONS
    this.snake.hasColided(GAME_MODE)

    // CHECKING IF IT IS GAME OVER
    if (!this.snake.alive) {
      this.gameOver()
      return
    }
    
    // ADD SNAKE JOINT / update score
    if (this.food.eaten) this.updateScore()
    
    // UPDATE
    this.snake.updatePosition()
    this.food.updatePos(this.food.getRndFreePos(this.gameField.field))
    this.gameField.update(this.snake.x, this.snake.y, this.snake.joints, this.snake.color, this.food.list, this.food.color)
console.log(this.food.list)
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
}