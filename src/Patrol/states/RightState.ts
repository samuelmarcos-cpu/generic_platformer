import Patrol from "..";
import { InterfaceState } from "../../utils/StateMachine"

export default class RightState implements InterfaceState {
    private readonly patrol: Patrol
    readonly stateKeyLeft: string

    constructor(patrol: Patrol, stateKeyLeft: string = "left") {
        this.patrol = patrol
        this.stateKeyLeft = stateKeyLeft
    }

    enter() {
        this.patrol.setFlipX(true)
        this.patrol.anims.play(Patrol.ANIMS_RUN, true)
    }

    execute() {
        if (this.patrol.groundAhead(true) == false) {
            this.patrol.setState(this.stateKeyLeft)
        }

        this.patrol.setVelocityX(Patrol.VELOCITY_X)
    }
}