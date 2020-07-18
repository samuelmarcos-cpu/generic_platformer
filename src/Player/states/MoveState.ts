import Player from "..";
import { InterfaceState } from "../../utils/StateMachine"

export default class MoveState implements InterfaceState {
    private readonly player: Player
    readonly stateKeyIdle: string
    readonly stateKeyJump: string

    constructor(player: Player, stateKeyIdle: string = "idle", stateKeyJump: string = "jump") {
        this.player = player
        this.stateKeyIdle = stateKeyIdle
        this.stateKeyJump = stateKeyJump
    }

    enter() {
        this.player.anims.play(Player.ANIMS_RUN, true)
    }

    execute() {
        const { left, right, up } = this.player.cursors

        if ((this.player.body.blocked.down && this.player.isTouchingGround) == false) {
            this.player.setState(this.stateKeyJump, Player.VELOCITY_Y, false)
        } else if ((left?.isDown || right?.isDown || up?.isDown) == false) {
            this.player.setState(this.stateKeyIdle)
        } else if (up?.isDown) {
            this.player.setState(this.stateKeyJump, Player.VELOCITY_Y)
        } else if (left?.isDown || right?.isDown) {
            const direction = left?.isDown ? -1 : 1
            this.player.setVelocityX(Player.VELOCITY_X * direction)
            this.player.setFlipX(left?.isDown ? true : false)
        } else {
            this.player.setVelocityX(0)
        }
    }
}