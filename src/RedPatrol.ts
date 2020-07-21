import "phaser"

import Patrol from "./Patrol"
import GreenPatrol from "./GreenPatrol"
import Player from "./Player"

export default class RedPatrol extends Patrol {
    static readonly ANIM_RUN = "RedPatrolRun"
    static readonly VELOCITY_X = GreenPatrol.VELOCITY_X * 2
    static readonly COLLISION_JUMP = GreenPatrol.COLLISION_JUMP / 2

    constructor(
        scene: Phaser.Scene,
        x: number, y: number,
        tileWidth: number, tileHeight: number,
        layer: Phaser.Tilemaps.StaticTilemapLayer,
        enemy: Player
    ) {
        super(scene, x, y, tileWidth, tileHeight, layer, enemy,
            { velocityX: RedPatrol.VELOCITY_X, collisionJump: RedPatrol.COLLISION_JUMP })
    }

    static preload(scene: Phaser.Scene) {
        scene.load.image('RedPatrolRun1', "assets/characters/patrols/red/walk1.png")
        scene.load.image('RedPatrolRun2', "assets/characters/patrols/red/walk2.png")
        scene.load.image('RedPatrolRun3', "assets/characters/patrols/red/walk3.png")
    }

    static animations(scene: Phaser.Scene) {
        scene.anims.create({
            key: RedPatrol.ANIM_RUN,
            frames: [
                { key: 'RedPatrolRun1', frame: 0 },
                { key: 'RedPatrolRun2', frame: 0 },
                { key: 'RedPatrolRun3', frame: 0 }
            ],
            frameRate: 8,
            repeat: -1
        })
    }

    getAnimKeyRun() {
        return RedPatrol.ANIM_RUN
    }
}