import "phaser"

import { State } from "../utils/StateMachine"
import IdleState from "./states/IdleState"
import MoveState from "./states/MoveState"
import JumpState from "./states/JumpState"
import DeadState from "../Patrol/states/DeadState"

import Chest from "../Chest"

export default class Player extends Phaser.Physics.Arcade.Sprite {
    static readonly VELOCITY_X = 100
    static readonly VELOCITY_Y = 100

    static readonly ANIMS_IDLE = "idle"
    static readonly ANIMS_RUN = "run"
    static readonly ANIMS_JUMP = "jump"

    static readonly DATA_KEYS = "keys"

    private readonly layer: Phaser.Tilemaps.StaticTilemapLayer
    private readonly possibleStates: { [key: string]: State }
    readonly cursors: Phaser.Types.Input.Keyboard.CursorKeys
    private txtStatus: Phaser.GameObjects.Text

    private _isClimbing = false
    get isClimbing() {
        return this._isClimbing
    }
    private _isTouchingGround = false
    get isTouchingGround() {
        return this._isTouchingGround
    }

    constructor(
        scene: Phaser.Scene,
        layer: Phaser.Tilemaps.StaticTilemapLayer,
        x: number, y: number,
        keys: Phaser.Physics.Arcade.StaticGroup,
        chests: Phaser.Physics.Arcade.StaticGroup
    ) {
        super(scene, x, y, "idle1")
        this.scene.add.existing(this)
        this.scene.physics.add.existing(this)

        this.setBounce(0.25)
        this.body.setSize(12, 26)
        this.body.offset.y = 5

        this.setDataEnabled()
        this.scene.physics.add.overlap(this, keys, Player.overlapKey)
        this.scene.physics.add.overlap(this, chests, Player.overlapChest)

        this.layer = layer
        this.scene.physics.add.collider(this, this.layer, () => this._isTouchingGround = true)

        this.cursors = this.scene.input.keyboard.createCursorKeys()

        this.possibleStates = {
            idle: new IdleState(this),
            move: new MoveState(this),
            jump: new JumpState(this),
            dead: new DeadState(this, this.scene)
        }
        this.state = "idle"

        this.addListener("spring-up", (velocityY: number) => {
            this.setState('jump', velocityY)
        })
        this.addListener("collider-horizontal-enemy", () => {
            this.setState("dead")
        })

        this.txtStatus = this.scene.add.text(0, 0, "")
    }

    static filterScalableTiles = (tile: Phaser.Tilemaps.Tile) => tile.properties.scalable

    static overlapKey: ArcadePhysicsCallback = (player, key) => {
        key.destroy()
        player.incData(Player.DATA_KEYS)
    }

    static overlapChest: ArcadePhysicsCallback = (player, chest) => {
        const keys = player.getData(Player.DATA_KEYS)
        if (chest.getData(Chest.DATA_OPEN) == false && keys > 0) {
            player.setData(Player.DATA_KEYS, keys - 1)
            chest.emit("open")
        }
    }

    static dataToString(data: Phaser.Data.DataManager) {
        let dataStr = ""
        data.each((_, key, value) => {
            dataStr += `${key}: ${value}\n`
        })
        return dataStr
    }

    static preload(scene: Phaser.Scene) {
        scene.load.image('idle1', 'assets/characters/player/idle/anim1.png')
        scene.load.image('idle2', 'assets/characters/player/idle/anim2.png')
        scene.load.image('idle3', 'assets/characters/player/idle/anim3.png')
        scene.load.image('idle4', 'assets/characters/player/idle/anim4.png')

        scene.load.image('jump1', 'assets/characters/player/jump/anim8.png')
        scene.load.image('jump2', 'assets/characters/player/jump/anim11.png')

        scene.load.image('run1', 'assets/characters/player/run/anim5.png')
        scene.load.image('run2', 'assets/characters/player/run/anim6.png')
        scene.load.image('run3', 'assets/characters/player/run/anim7.png')
        scene.load.image('run4', 'assets/characters/player/run/anim8.png')
        scene.load.image('run5', 'assets/characters/player/run/anim9.png')
        scene.load.image('run6', 'assets/characters/player/run/anim10.png')
        scene.load.image('run7', 'assets/characters/player/run/anim11.png')
        scene.load.image('run8', 'assets/characters/player/run/anim12.png')
    }

    static animations(scene: Phaser.Scene) {
        scene.anims.create({
            key: Player.ANIMS_IDLE,
            frames: [
                { key: 'idle1', frame: 0 },
                { key: 'idle2', frame: 0 },
                { key: 'idle3', frame: 0 },
                { key: 'idle4', frame: 0 },
            ],
            frameRate: 8,
            repeat: -1
        })

        scene.anims.create({
            key: Player.ANIMS_JUMP,
            frames: [
                { key: 'jump1', frame: 0 },
                { key: 'jump2', frame: 0 },
            ],
            frameRate: 8,
            repeat: 0
        })

        scene.anims.create({
            key: Player.ANIMS_RUN,
            frames: [
                { key: 'run1', frame: 0 },
                { key: 'run2', frame: 0 },
                { key: 'run3', frame: 0 },
                { key: 'run4', frame: 0 },
                { key: 'run5', frame: 0 },
                { key: 'run6', frame: 0 },
                { key: 'run7', frame: 0 },
                { key: 'run8', frame: 0 },
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

    preUpdate(time: number, delta: number) {
        super.preUpdate(time, delta)

        this._isTouchingGround = false

        this._isClimbing = false
        const tilesScalable = this.layer.filterTiles(Player.filterScalableTiles)
        this.scene.physics.overlapTiles(this, tilesScalable, () => this._isClimbing = true)
    }

    update() {
        super.update()
        this.possibleStates[this.state].execute()

        this.txtStatus.text = this.state.toString()
    }
}