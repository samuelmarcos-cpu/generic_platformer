export default class Trap extends Phaser.Tilemaps.DynamicTilemapLayer {
    private readonly sprite: Phaser.GameObjects.Sprite

    constructor(scene: Phaser.Scene,
        tilemap: Phaser.Tilemaps.Tilemap,
        layerIndex: string,
        tileset: string | string[] | Phaser.Tilemaps.Tileset | Phaser.Tilemaps.Tileset[],
        sprite: Phaser.GameObjects.Sprite
    ) {
        super(scene, tilemap, tilemap.getLayerIndexByName(layerIndex), tileset, 0, 0)
        this.scene.add.existing(this)
        this.sprite = sprite
    }

    update() {
        super.update()
        const tileTrap = this.getTileAtWorldXY(this.sprite.x, this.sprite.y)
        if (tileTrap) {
            this.alpha = 0.25
        } else {
            this.alpha = 1
        }
    }
}