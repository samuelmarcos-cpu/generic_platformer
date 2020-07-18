import Patrol from "..";
import { InterfaceState } from "../../utils/StateMachine"

export default class RightState implements InterfaceState {
    private readonly patrol: Patrol
    readonly stateKeyRight: string

    constructor(patrol: Patrol, stateKeyRight: string = "right") {
        this.patrol = patrol
        this.stateKeyRight = stateKeyRight
    }

    enter() {
        this.patrol.setFlipX(false)
        this.patrol.anims.play(Patrol.ANIMS_RUN, true)
    }

    execute() {
        if (this.patrol.groundAhead(false) == false) {
            this.patrol.setState(this.stateKeyRight)
        }

        this.patrol.setVelocityX(Patrol.VELOCITY_X * -1)
    }
}