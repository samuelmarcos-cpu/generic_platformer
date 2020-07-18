import Player from "..";
import { InterfaceState } from "../../utils/StateMachine"

export default class JumpState implements InterfaceState {
    private readonly player: Player
    readonly stateKeyIdle: string
    readonly stateKeyMove: string
    readonly stateKeyJump: string

    constructor(player: Player, stateKeyIdle: string = "idle", stateKeyMove: string = "move", stateKeyJump: string = "jump") {
        this.player = player
        this.stateKeyIdle = stateKeyIdle
        this.stateKeyMove = stateKeyMove
        this.stateKeyJump = stateKeyJump
    }

    enter(velocityY: number, physicJump: boolean = true) {
        physicJump && this.player.setVelocityY(velocityY * -1)
        this.player.anims.play(Player.ANIMS_JUMP, true)
    }

    execute() {
        const { left, right, up } = this.player.cursors

        if (up?.isDown && this.player.isClimbing) {
            this.player.setState(this.stateKeyJump, Player.VELOCITY_Y)
        } else if (this.player.body.blocked.down && this.player.isTouchingGround) {
            if (up?.isDown) {
                this.player.setState(this.stateKeyJump, Player.VELOCITY_Y)
            } else if (left?.isDown || right?.isDown) {
                this.player.setState(this.stateKeyMove)
            } else {
                this.player.setState(this.stateKeyIdle)
            }
        }

        if (left?.isDown || right?.isDown) {
            const direction = left?.isDown ? -1 : 1
            this.player.setVelocityX(Player.VELOCITY_X * direction)
            this.player.setFlipX(left?.isDown ? true : false)
        } else {
            this.player.setVelocityX(0)
        }
    }
}