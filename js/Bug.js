import { CREATURE_TYPES } from './config.js'
import Creature from './Creature.js'
import { getRndNum } from './Global_Functions.js'

export default class Bug extends Creature {
    constructor(x, y, headColor, jointColor) {
        super(CREATURE_TYPES.bug, x, y, headColor, jointColor)
    }

    tryChangeDirection(possibleField) {
        // let possibleDirections = Object.values(this.directions).filter(direction => direction !== this.actualDir) // OBJ.values - convert values of object into an array
        // const possibleDirections = Object.values(this.directions).filter(direction => !this.areOppositeDirections(direction, this.actualDir)) // Filter opposite directions
        const possibleDirections = []
        for (const possibleDirPlace of possibleField) {
            if (possibleDirPlace.place.isFree === true /*&& !this.areOppositeDirections(possibleDirPlace.dir, this.actualDir)*/) possibleDirections.push(possibleDirPlace.dir)
        }
        if (possibleDirections.length === 1) {
            this.actualDir = possibleDirections[0]
            return
        }
        this.actualDir = this.chooseRndDirection(possibleDirections)
    }

    // ----------------- HEAD POSITION UPDATE ----------------- //
    updateHeadPos() {
        let upUpdate = -1
        let downUpdate = 1
        let leftUpdate = upUpdate
        let rightUpdate = downUpdate
        super.updateHeadPos(upUpdate, downUpdate, leftUpdate, rightUpdate)
    }

    chooseRndDirection(directions) {
        return directions[getRndNum(0, directions.length)]
    }
}