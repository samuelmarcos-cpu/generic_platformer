import "phaser"

import Patrol from "./Patrol"
import GreenPatrol from "./GreenPatrol"
import Player from "./Player"

export default class BluePatrol extends Patrol {
    static readonly ANIM_RUN = "BluePatrolRun"
    static readonly VELOCITY_X = GreenPatrol.VELOCITY_X / 2
    static readonly COLLISION_JUMP = GreenPatrol.COLLISION_JUMP * 2

    constructor(
        scene: Phaser.Scene,
        x: number, y: number,
        tileWidth: number, tileHeight: number,
        layer: Phaser.Tilemaps.StaticTilemapLayer,
        enemy: Player
    ) {
        super(scene, x, y, tileWidth, tileHeight, layer, enemy,
            { velocityX: BluePatrol.VELOCITY_X, collisionJump: BluePatrol.COLLISION_JUMP })
    }

    static preload(scene: Phaser.Scene) {
        scene.load.image('BluePatrolRun1', "assets/characters/patrols/blue/walk1.png")
        scene.load.image('BluePatrolRun2', "assets/characters/patrols/blue/walk2.png")
        scene.load.image('BluePatrolRun3', "assets/characters/patrols/blue/walk3.png")
    }

    static animations(scene: Phaser.Scene) {
        scene.anims.create({
            key: BluePatrol.ANIM_RUN,
            frames: [
                { key: 'BluePatrolRun1', frame: 0 },
                { key: 'BluePatrolRun2', frame: 0 },
                { key: 'BluePatrolRun3', frame: 0 }
            ],
            frameRate: 8,
            repeat: -1
        })
    }

    getAnimKeyRun() {
        return BluePatrol.ANIM_RUN
    }
}