import Patrol from "..";
import { InterfaceState } from "../../utils/StateMachine"

export default class RightState implements InterfaceState {
    private readonly patrol: Patrol
    readonly velocityX: number
    readonly stateKeyRight: string

    constructor(patrol: Patrol, velocityX: number, stateKeyRight: string = "right") {
        this.patrol = patrol
        this.velocityX = velocityX
        this.stateKeyRight = stateKeyRight
    }

    enter() {
        this.patrol.setFlipX(false)
        this.patrol.anims.play(this.patrol.getAnimKeyRun(), true)
    }

    execute() {
        if (this.patrol.body.blocked.left || this.patrol.groundAhead(false) == false) {
            this.patrol.setState(this.stateKeyRight)
        }

        this.patrol.setVelocityX(this.velocityX * -1)
    }
}