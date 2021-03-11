import * as Phaser from 'phaser'
import type { Positions } from '../scenes/GameScene'

const prefix = 'card'

export class Card extends Phaser.GameObjects.Sprite {
    scene!:Phaser.Scene

    value!: number

    opened!: boolean

    constructor(scene: Phaser.Scene, value: number, position: Positions) {
      super(scene, position.x, position.y, prefix)
      this.scene = scene
      this.value = value
      this.opened = false

      this.setOrigin(0.5, 0.5)
      this.scene.add.existing(this)
      this.setInteractive()
      // this.on('pointerdown', this.open, this)
    }

    open() {
      this.turnOver(() => this.setTexture(`${prefix}${this.value}`))
      this.opened = true
    }

    close() {
      this.turnOver(() => this.setTexture(prefix))
      this.opened = false
    }

    show() {
      this.scene.tweens.add({
        targets: this,
        scaleX: 1,
        ease: 'Linear',
        duration: 150,
      })
    }

    turnOver(callback: Function) {
      this.scene.tweens.add({
        targets: this,
        scaleX: 0,
        ease: 'Linear',
        duration: 150,
        onComplete: () => { callback(); this.show() },
      })
    }
}

// this.add.sprite(position.x, position.y, 'card').setOrigin(0, 0)

export default Card
