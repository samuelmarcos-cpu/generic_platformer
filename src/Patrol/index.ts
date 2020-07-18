import "phaser"

import { State } from "../utils/StateMachine"
import RightState from "./states/RightState"
import LeftState from "./states/LeftState"
import Player from "../Player";
import DeadState from "./states/DeadState";

export default class Patrol extends Phaser.Physics.Arcade.Sprite {
    static readonly VELOCITY_X = 50

    static readonly ANIMS_RUN = "patrolRun"

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
        enemy: Player
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
                enemy.emit("spring-up", Player.VELOCITY_Y * 1.5)
            } else if (left || right) {
                enemy.emit("collider-horizontal-enemy", this)
            }
        })

        this.body.setSize(16, 10)
        this.body.offset.y = 6

        this.possibleStates = {
            right: new RightState(this),
            left: new LeftState(this),
            dead: new DeadState(this, this.scene)
        }
        this.setState("right")
    }

    static preload(scene: Phaser.Scene) {
        scene.load.image('patrolRun1', "assets/NPC's/blue patrol/azul1.png")
        scene.load.image('patrolRun2', "assets/NPC's/blue patrol/azul2.png")
        scene.load.image('patrolRun3', "assets/NPC's/blue patrol/azul3.png")
    }

    static animations(scene: Phaser.Scene) {
        scene.anims.create({
            key: Patrol.ANIMS_RUN,
            frames: [
                { key: 'patrolRun1', frame: 0 },
                { key: 'patrolRun2', frame: 0 },
                { key: 'patrolRun3', frame: 0 }
            ],
            frameRate: 8,
            repeat: -1
        })
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
}