import "phaser"

import { State } from "../utils/StateMachine"
import RightState from "./states/RightState"
import LeftState from "./states/LeftState"
import DeadState from "./states/DeadState"
import Player from "../Player"

type PatrolOptions = {
    velocityX: number,
    collisionJump: number
}

export default abstract class Patrol extends Phaser.Physics.Arcade.Sprite {
    private readonly layer: Phaser.Tilemaps.StaticTilemapLayer
    private readonly tileWidth: number
    private readonly tileHeight: number
    private readonly enemy: Player

    private readonly possibleStates: { [key: string]: State }

    constructor(
        scene: Phaser.Scene,
        x: number, y: number,
        tileWidth: number, tileHeight: number,
        layer: Phaser.Tilemaps.StaticTilemapLayer,
        enemy: Player,
        options: PatrolOptions
    ) {
        super(scene, x, y, "patrolRun1")
        this.scene.add.existing(this)
        this.scene.physics.add.existing(this)

        this.tileWidth = tileWidth
        this.tileHeight = tileHeight

        this.layer = layer
        this.scene.physics.add.collider(this, this.layer)

        this.enemy = enemy
        const hitHead = this.scene.physics.add.collider(this, this.enemy, () => {
            const { up, left, right } = this.body.touching
            if (up) {
                hitHead.destroy()
                this.setState("dead")
                enemy.emit("spring-up", Player.VELOCITY_Y * options.collisionJump)
            } else if (left || right) {
                enemy.emit("collider-horizontal-enemy", this)
            }
        })

        this.body.setSize(16, 10)
        this.body.offset.y = 6
        this.body.offset.x = 0

        this.possibleStates = {
            right: new RightState(this, options.velocityX),
            left: new LeftState(this, options.velocityX),
            dead: new DeadState(this, this.scene)
        }
        this.setState("right")
    }

    setState(value: string | number, ...args: any[]) {
        super.setState(value)
        this.possibleStates[this.state].enter(...args)
        return this
    }

    tileAhead(right: boolean = true) {
        let x = this.x
        x += right ? this.tileWidth : this.tileHeight * -1
        return this.layer.getTileAtWorldXY(x, this.y + this.tileHeight)
    }

    groundAhead(right: boolean = true) {
        const tile = this.tileAhead(right)
        return tile != null && tile.properties.collides == true
    }

    update() {
        super.update()
        this.possibleStates[this.state].execute()
    }

    abstract getAnimKeyRun(): string;
}