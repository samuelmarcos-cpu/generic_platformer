import Patrol from "..";
import { InterfaceState } from "../../utils/StateMachine"

export default class RightState implements InterfaceState {
    private readonly patrol: Patrol
    readonly velocityX: number
    readonly stateKeyLeft: string

    constructor(patrol: Patrol, velocityX: number, stateKeyLeft: string = "left") {
        this.patrol = patrol
        this.velocityX = velocityX
        this.stateKeyLeft = stateKeyLeft
    }

    enter() {
        this.patrol.setFlipX(true)
        this.patrol.anims.play(this.patrol.getAnimKeyRun(), true)
    }

    execute() {
        if (this.patrol.groundAhead(true) == false) {
            this.patrol.setState(this.stateKeyLeft)
        }

        this.patrol.setVelocityX(this.velocityX)
    }
}