import { InterfaceState } from "../../utils/StateMachine"

export default class DeadState implements InterfaceState {
    private readonly obj: Phaser.Physics.Arcade.Sprite
    private readonly scene: Phaser.Scene

    constructor(obj: Phaser.Physics.Arcade.Sprite, scene: Phaser.Scene) {
        this.obj = obj
        this.scene = scene
    }

    enter() {
        this.obj.body.destroy()

        this.obj.anims.stop();
        this.scene.tweens.add({
            targets: this.obj,
            props: { alpha: 0 },
            duration: 1000
        });
    }

    execute() { }
}