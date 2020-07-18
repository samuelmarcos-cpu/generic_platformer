import Player from "..";
import { InterfaceState } from "../../utils/StateMachine"

export default class IdleState implements InterfaceState {
    private readonly player: Player
    readonly stateKeyMove: string
    readonly stateKeyJump: string

    constructor(player: Player, stateKeyMove: string = "move", stateKeyJump: string = "jump") {
        this.player = player
        this.stateKeyMove = stateKeyMove
        this.stateKeyJump = stateKeyJump
    }

    enter() {
        this.player.setVelocityX(0)
        this.player.anims.play(Player.ANIMS_IDLE, true)
    }

    execute() {
        const { left, right, up } = this.player.cursors

        if (up?.isDown) {
            this.player.setState(this.stateKeyJump, Player.VELOCITY_Y)
        } else if (left?.isDown || right?.isDown) {
            this.player.setState(this.stateKeyMove)
        } else if ((this.player.body.blocked.down && this.player.isTouchingGround) == false) {
            this.player.setState(this.stateKeyJump, Player.VELOCITY_Y, false)
        }
    }
}