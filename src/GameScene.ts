import "phaser";

import Player from "./Player";
import GreenPatrol from "./GreenPatrol";
import BluePatrol from "./BluePatrol";
import RedPatrol from "./RedPatrol";
import Chest from "./Chest";
import Trap from "./Trap";

export class GameScene extends Phaser.Scene {
    private player?: Player
    private green?: Phaser.Physics.Arcade.Sprite
    private blue?: Phaser.Physics.Arcade.Sprite
    private red?: Phaser.Physics.Arcade.Sprite
    private trap?: Trap

    constructor() {
        super({
            key: "GameScene"
        })
    }

    static getTiledXY(obj: Phaser.Types.Tilemaps.TiledObject) {
        const x = obj.x || 0
        const width = obj.width || 0
        const y = obj.y || 0
        const height = obj.height || 0
        return {
            x: x + (width / 2),
            y: y + (height / 2),
        }
    }

    preload() {
        this.load.atlas('atlas', 'assets/atlas.png', 'assets/atlas.json')

        this.load.image('tiles', 'assets/atlas.png')
        this.load.tilemapTiledJSON('map', 'assets/map/map.json')

        Player.preload(this)
        GreenPatrol.preload(this)
        BluePatrol.preload(this)
        RedPatrol.preload(this)
    }

    create() {
        Player.animations(this)
        GreenPatrol.animations(this)
        BluePatrol.animations(this)
        RedPatrol.animations(this)

        const map = this.make.tilemap({ key: 'map' })
        const tiles = map.addTilesetImage('generic_platformer_atlas', 'tiles')

        map.createStaticLayer('bot', tiles, 0, 0)
        const mainLayer = map.createStaticLayer('main', tiles, 0, 0)
        map.createStaticLayer('top', tiles, 0, 0)

        const objKeys = map.createFromObjects("objects", "key", { key: "atlas", frame: "key" })
        const keys = this.physics.add.staticGroup()
        keys.addMultiple(objKeys)

        const objects = map.getObjectLayer('objects').objects

        // const objChests = map.createFromObjects("objects", "chest", { key: "atlas", frame: "chest" })
        const objChests = objects
            .filter(obj => obj.name == "chest")
            .map(obj => {
                const tiledXY = GameScene.getTiledXY(obj)
                return this.add.existing(new Chest(this,
                    tiledXY.x,
                    tiledXY.y))
            })
        const chests = this.physics.add.staticGroup()
        chests.addMultiple(objChests)

        const playerOrigin = objects
            .filter(obj => obj.name == "playerOrigin")
            .pop()

        mainLayer.setCollisionByProperty({ collides: true })
        this.player = new Player(this, mainLayer,
            playerOrigin?.x || 0,
            playerOrigin?.y || 0,
            keys, chests)
        // this.physics.add.collider(this.player, mainLayer)

        this.green = new GreenPatrol(this, 200, 80, map.tileWidth, map.tileHeight, mainLayer, this.player)
        this.blue = new BluePatrol(this, 100, 80, map.tileWidth, map.tileHeight, mainLayer, this.player)
        this.red = new RedPatrol(this, 375, 80, map.tileWidth, map.tileHeight, mainLayer, this.player)
        this.trap = new Trap(this, map, 'trap', tiles, this.player)
    }

    update() {
        this.player?.update()
        this.green?.update()
        this.blue?.update()
        this.red?.update()
        this.trap?.update()
    }
}