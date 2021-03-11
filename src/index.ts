import * as Phaser from 'phaser'
import { GameScene } from './scenes/GameScene'

export const gameConfig: Phaser.Types.Core.GameConfig = {
  title: 'Sample',

  type: Phaser.CANVAS,

  scale: {
    width: 1280,
    height: 720,
  },

  physics: {
    default: 'arcade',
    arcade: {
      debug: true,
    },
  },

  parent: 'game',
  backgroundColor: '#000000',
  scene: GameScene,
}

export const game = new Phaser.Game(gameConfig)
