import { GAMEFIELD_WIDTH, GAMEFIELD_HEIGHT, SNAKE_COLORS, CONTROL_BUTTONS, SNAKE_NAMES, CREATURE_TYPES } from './config.js'
import GameField from './Game_Field.js'
import Snake from './Snake.js'
import Food from './Food.js'
import Bug from './Bug.js'
import { getRndNum } from './Global_Functions.js'

export default class Game {
  paused = false
  isPlaying = null
  snakes = []
  bugs = []
  playersCount
  globalScore = 10
  loopIndex = 0
  // playerCount
  constructor() {
    // CLASS REFERENCES
    this.gameField = new GameField()
    // GAME INIT
    this.speedIncrement = 10
    this.init()
    // EVENT LISTENERS
    window.addEventListener('keydown', (event) => this.keyDownEventChoose(event))
    document.getElementById("player-count-select").onchange = () => this.restartGame()
  }

  init() {
    this.playersCount = document.getElementById("player-count-select").value
    this.snakes = []
    this.bugs = []
    this.globalScore = 10
    for (let i = 0; i < this.playersCount; i++) {
      const startingPos = this.getNewSnakeHeadStartingPos(i)
      const rndColor = this.getRndColor()
      this.snakes.push(new Snake(this.getRndName(), startingPos.x, startingPos.y, rndColor[0], rndColor[1], CONTROL_BUTTONS[i].buttons))
    }

    this.gameField.positionsStateUpdate(this.getEntitiesInfo('snakes', 'headPos'))
    this.generateFood(this.gameField.getRndFreePos())

    // DRAW SECTION
    this.draw()

    this.isPlaying = false
    this.refreshScore()
    this.displayNames()
    this.speed = 150
    this.speedIncCountDown = 13
  }

  draw() {
    this.snakes[0].ctx.clearRect(0, 0, this.snakes[0].canvas.width, this.snakes[0].canvas.height)
    this.snakes.forEach(snake => snake.draw())
    // this.bugs.forEach(bug => bug.draw())
    this.food.draw()
  }

  keyDownEventChoose(event) {
    if (event.key.toLowerCase() === 'p') this.togglePlayPause()
    if (event.key.toLowerCase() === 'r') this.restartGame(event)
  }

  togglePlayPause() {
    if (!this.isAnySnakeAlive()) return

    if (this.isPlaying) {
      this.isPlaying = false
      clearInterval(this.gameInterval)
      return
    }
    this.isPlaying = true
    clearInterval(this.gameInterval)
    this.gameInterval = setInterval(() => this.loop(), this.speed)
  }

  restartGame() {
    this.init()
    clearInterval(this.gameInterval)
    this.gameInterval = setInterval(() => this.loop(), this.speed)
  }

  changePlayersCount(event) {
    this.playerCount = event.value
  }

  generateFood(pos) {
    this.food = new Food(pos)
    this.gameField.ocupiePosition(pos)
  }

  gameOver() {
    console.log('Game Over... :(')
    clearInterval(this.gameInterval)
  }

  // --- GAME LOOP --- //
  loop() {
    // GAME STATE
    if (!this.isPlaying) return
    this.loopIndex++
    // const allCreatures = this.snakes.concat(this.bugs)

    // __________________________________________________________________________________________________________________________

    // Snakes check section
    for (const snake of this.snakes) {
      if (!snake.alive) continue
      // SET SNAKE DIRECTION
      snake.tryChangeDirection()

      // Check snake collision
      const colidedCreatures = this.tryGetCollidedCreatures(snake)
      if (colidedCreatures.length !== 0) { // Check if there is any collision
        if (colidedCreatures[0].creatureType === CREATURE_TYPES.snake
          && colidedCreatures[1].creatureType === CREATURE_TYPES.snake) {
            snake.alive = false
            continue
        }
      }                                                                                                   // Snakes Check Section

      // SNAKE/WALL MEET
      snake.checkWallMeet(snake)

      // Check if the snake eaten the Food
      if (this.isEqualPositions(snake.getNextPosition(snake.actualDir), this.food.position)) {
        // ADD SNAKE JOINT / update score
        snake.actualBodyLength++
        this.generateFood(this.gameField.getRndFreePos())
        // this.globalScore++
        this.refreshScore()
        this.speedIncCountDown--
      }


    }

    // __________________________________________________________________________________________________________________________

    // if (this.globalScore >= 0) { // Check if it is time to manage
    if (this.loopIndex % 2 === 0) {
      // Bugs addition
      if (this.globalScore % 10 === 0) {
        this.globalScore = 11
        const startingPos = this.gameField.getRndFreePos()
        const rndColor = this.getRndColor()
        this.bugs.push(new Bug(startingPos.x, startingPos.y, rndColor[0], rndColor[1]))
      }                                                                                                      // Bugs Addition and Check Section
      // Bugs check section

      for (const bug of this.bugs) {
        if (!bug.alive) continue

        // Get all positions around the head of the bug
        const positionsAroundHead = []
        this.gameField.field.forEach(place => {
          Object.values(bug.directions).forEach(direction => {
            if (this.isEqualPositions(place.position, bug.getNextPosition(direction))) {
              if (!bug.areOppositeDirections(direction, bug.actualDir)) positionsAroundHead.push({ dir: direction, place: place })
            }
          })
        })

        bug.tryChangeDirection(positionsAroundHead)

        // Check if the bug eaten the Food
        if (this.isEqualPositions(bug.getNextPosition(bug.actualDir), this.food.position)) {
          // ADD BUG JOINT / update score
          bug.actualBodyLength++
          this.generateFood(this.gameField.getRndFreePos())
          // this.globalScore++
          this.speedIncCountDown--
        }
      }
    }
    // }

    // __________________________________________________________________________________________________________________________

    // Checks if the game is over depending on the players count
    const aliveSnakesCount = this.snakes.filter(creature => creature.alive).length
    if (this.snakes.length > 1 && aliveSnakesCount <= 1 || this.snakes.length === 1 && aliveSnakesCount <= 0) {
      this.gameOver()                                                                                              // Game Over check
      return
    }

    // __________________________________________________________________________________________________________________________

    // Snake Update section
    for (const snake of this.snakes) {
      if (!snake.alive) continue

      // Check if there is need of add Joint
      if (snake.joints.length < snake.actualBodyLength) {
        snake.addJoint()
      } else {                                                                                              // Snakes Update  Section
        snake.updateJointsPos() // UPDATE JOINTS POSITION
      }
      snake.updateHeadPos() // UPDATE HEAD POSITION// Check if it is time to manage 
    }

    // __________________________________________________________________________________________________________________________

    // Bugs update section
    // if (this.globalScore >= 0) { // Check if it is time to manage
    if (this.loopIndex % 2 === 0) {
      for (const bug of this.bugs) {
        if (!bug.alive) continue

        // Check if there is need of add Joint
        if (bug.joints.length < bug.actualBodyLength) {
          bug.addJoint()
        } else {                                                                                              // Bugs Update  Section
          bug.updateJointsPos() // UPDATE JOINTS POSITION
        }
        bug.updateHeadPos() // UPDATE HEAD POSITION// Check if it is time to manage 
      }
    }
    // }

    // __________________________________________________________________________________________________________________________

    // UPDATE GAMEFIELD POSITIONS STATUS (free/ocupied)
    const ocupiedPositions = [...this.getEntitiesInfo('snakes', 'headPos'), ...this.getEntitiesInfo('snakes', 'joints').flat(), this.food.position]
    this.gameField.positionsStateUpdate(ocupiedPositions)

    // DRAW THE GAME 
    this.draw()


    // INCREASE THE GAME SPEED
    if (this.speedIncCountDown <= 0) {
      this.speedIncCountDown = 7
      this.speed -= this.speedIncrement
      clearInterval(this.gameInterval)
      this.gameInterval = setInterval(() => this.loop(), this.speed)
    }
  }

  getEntitiesInfo(entities, request) {
    const resultArray = []
    this[entities].every(entity => resultArray.push(entity[request]))
    return resultArray
  }

  getEntitiesColors(entities) {
    const resultColorsArray = []
    this[entities].every(snake => resultColorsArray.push({ head: snake.headColor, joint: snake.jointColor }))
    return resultColorsArray
  }

  tryGetCollidedCreatures(testingCreature) {
    const allCreatures = this.snakes.concat(this.bugs)
    const otherCreatures = allCreatures.filter(creature => creature.name !== testingCreature.name)
    const testCreatureNextPos = testingCreature.getNextPosition(testingCreature.actualDir)
    const result = []


    // check fot head/head next positions collision
    for (const creature of otherCreatures) {
      if (creature.alive === false) continue
      if (this.isEqualPositions(testCreatureNextPos, creature.getNextPosition(creature.actualDir))) result.push(testingCreature, creature)
    }

    // Check for head/head actual positions collision
    for (const creature of otherCreatures) {
      if (this.isEqualPositions(testCreatureNextPos, creature.headPos) && creature.joints.length > 0) result.push(testingCreature, creature)
    }

    // Check for head/joint actual positions collision (except the last joints of alive creatures)
    for (const creature of allCreatures) {
      if (creature.joints.length <= 0) continue
      const relevantCreatureJoints = creature.joints
      if (creature.alive) relevantCreatureJoints.slice(0, -1) // If the creature is alive, than remove the last joint from relevant joints
      relevantCreatureJoints.forEach(joint => {
        if (this.isEqualPositions(testCreatureNextPos, joint)) result.push(testingCreature, creature)
      })
    }

    return result
  }

  isEqualPositions(pos1, pos2) {
    return pos1.x === pos2.x
      && pos1.y === pos2.y
  }

  refreshScore() {
    for (let i = 0; i < this.snakes.length; i++) {
      document.getElementById(`Score${CONTROL_BUTTONS[i].id}`).innerHTML = this.snakes[i].actualBodyLength - this.snakes[i].startingBodyLength
    }
  }

  displayNames() {
    const innerHTMLSelectors = [
      document.querySelectorAll('table.score td span[id^="Name"]'), // stores all elements that has id starting on Name
      document.querySelectorAll('table.score td span[id^="Score"]'), // stores all elements that has id starting on Score
      document.querySelectorAll('table.score td span[id^="Controls"]') // stores all elements that has id starting on Controls
    ]

    for (let i = 0; i < innerHTMLSelectors.length; i++) { // iterate through every HTML selector
      for (let j = 0; j < innerHTMLSelectors[i].length; j++) { // iterate through each tag that has specifis id
        if (j >= this.snakes.length) { // if concrete tag is useless
          innerHTMLSelectors[i][j].parentElement.style.display = 'none'
        } else {
          innerHTMLSelectors[i][j].parentElement.style.display = 'table-cell' // if concrete tag is useable
        }
      }
    }

    for (let i = 0; i < this.snakes.length; i++) {
      document.getElementById(`Name${CONTROL_BUTTONS[i].id}`).innerHTML = this.snakes[i].name
    }
  }

  getNewSnakeHeadStartingPos(snakeIndex) {
    if (snakeIndex < 0 || snakeIndex > 3) {
      console.log("Snake index out of range. Maximum 4 snakes allowed.")
      return
    }

    const corners = [
      { x: 2, y: 2 }, // top-left
      { x: GAMEFIELD_WIDTH - 3, y: GAMEFIELD_HEIGHT - 3 }, // bottom-right
      { x: GAMEFIELD_WIDTH - 3, y: 2 }, // top-right
      { x: 2, y: GAMEFIELD_HEIGHT - 3 } // bottom-left
    ];

    return corners[snakeIndex]
  }

  isAnySnakeAlive() {
    console.log(this.snakes.map(snake => ({ name: snake.name, isAlive: snake.alive })))
    return this.snakes.some(snake => snake.alive === true)
  }

  getRndName() {
    let rndValue
    do {
      rndValue = SNAKE_NAMES[getRndNum(0, SNAKE_NAMES.length)]
    } while (this.snakes.some(snake => snake.name === rndValue))
    return rndValue
  }

  getRndColor() {
    let rndValue
    do {
      rndValue = SNAKE_COLORS[getRndNum(0, SNAKE_COLORS.length)]
    } while (this.snakes.some(snake => snake.headColor === rndValue[0]))
    return rndValue
  }
}