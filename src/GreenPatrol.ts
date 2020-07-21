import "phaser"

import Patrol from "./Patrol"
import Player from "./Player"

export default class GreenPatrol extends Patrol {
    static readonly ANIM_RUN = "GreenPatrolRun"
    static readonly VELOCITY_X = 50
    static readonly COLLISION_JUMP = 1.5

    constructor(
        scene: Phaser.Scene,
        x: number, y: number,
        tileWidth: number, tileHeight: number,
        layer: Phaser.Tilemaps.StaticTilemapLayer,
        enemy: Player
    ) {
        super(scene, x, y, tileWidth, tileHeight, layer, enemy,
            { velocityX: GreenPatrol.VELOCITY_X, collisionJump: GreenPatrol.COLLISION_JUMP })
    }

    static preload(scene: Phaser.Scene) {
        scene.load.image('GreenPatrolRun1', "assets/characters/patrols/green/walk1.png")
        scene.load.image('GreenPatrolRun2', "assets/characters/patrols/green/walk2.png")
        scene.load.image('GreenPatrolRun3', "assets/characters/patrols/green/walk3.png")
    }

    static animations(scene: Phaser.Scene) {
        scene.anims.create({
            key: GreenPatrol.ANIM_RUN,
            frames: [
                { key: 'GreenPatrolRun1', frame: 0 },
                { key: 'GreenPatrolRun2', frame: 0 },
                { key: 'GreenPatrolRun3', frame: 0 }
            ],
            frameRate: 8,
            repeat: -1
        })
    }

    getAnimKeyRun() {
        return GreenPatrol.ANIM_RUN
    }
}