import "phaser"

export default class Chest extends Phaser.GameObjects.Sprite {
    static readonly TEXTURE = "atlas"
    static readonly FRAME_CLOSED = "chest_closed"
    static readonly FRAME_OPEN = "chest_open"
    static readonly DATA_OPEN = "open"

    constructor(
        scene: Phaser.Scene,
        x: number, y: number) {
        super(scene, x, y, Chest.TEXTURE, Chest.FRAME_CLOSED)

        this.setDataEnabled()
        this.setData(Chest.DATA_OPEN, false)

        this.addListener("open", this.open)
    }

    private open() {
        this.setData("open", true)
        this.setFrame(Chest.FRAME_OPEN)
    }
}