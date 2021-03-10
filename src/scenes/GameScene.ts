import * as Phaser from 'phaser'

type Positions = {
  x: number;
  y: number;
};

const sceneConfig: Phaser.Types.Scenes.SettingsConfig = {
  active: false,
  visible: false,
  key: 'Game',
}

export class GameScene extends Phaser.Scene {
  positions!: Array<Positions>;

  constructor() {
    super(sceneConfig)
    this.positions = []
  }

  createPositions() {
    const ROWS = 2
    const COLUMNS = 5
    const cardTexture = this.textures.get('card').getSourceImage()

    const cardWidth = cardTexture.width
    const cardHeight = cardTexture.height
    const cardPadding = 4
    const offset = {
      x: ((this.sys.game.config.width as number) - (cardWidth + cardPadding) * 5) / 2,
      y:
        ((this.sys.game.config.height as number)
        - (cardHeight + cardPadding) * 2) / 2,
    }
    for (let row = 0; row < ROWS; row++) {
      for (let column = 0; column < COLUMNS; column++) {
        this.positions.push({
          x: column * (cardWidth + cardPadding) + offset.x,
          y: row * (cardHeight + cardPadding) + offset.y,
        })
      }
    }
  }

  renderCards() {
    for (let index = 0; index < this.positions.length; index++) {
      const position = this.positions[index]
      this.add.sprite(position.x, position.y, 'card').setOrigin(0, 0)
    }
  }

  public preload() {
    this.load.image('background', 'assets/sprites/background.png')
    this.load.image('card', 'assets/sprites/card.png')
  }

  public create() {
    this.add.sprite(0, 0, 'background').setOrigin(0, 0)
    this.createPositions()
    this.renderCards()
  }

  // public update() {
  //   console.log('update');
  // }
}
