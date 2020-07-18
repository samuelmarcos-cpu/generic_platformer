import { GameScene } from './GameScene'

const gameConfig: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  scale: {
    width: 400,
    height: 300
  },
  zoom: 2,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 300 },
      debug: true
    }
  },
  parent: 'game',
  backgroundColor: '#5b6ee1',
  scene: GameScene
}

export default new Phaser.Game(gameConfig)