import * as Phaser from 'phaser'
import { Card } from '../components/Card'

export type Positions = {
  x: number;
  y: number;
};

const sceneConfig: Phaser.Types.Scenes.SettingsConfig = {
  active: false,
  visible: false,
  key: 'Game',
}

const cards = [1, 2, 3, 4, 5]

export class GameScene extends Phaser.Scene {
  positions!: Array<Positions>;

  cards!: Array<Phaser.GameObjects.Sprite>;

  openedCard!: Card | null;

  cardCounter!: number;

  constructor() {
    super(sceneConfig)
    this.positions = []
    this.cards = []
    this.openedCard = null
    this.cardCounter = 0
  }

  setCardPositions() {
    const ROWS = 2
    const COLUMNS = 5
    const cardTexture = this.textures.get('card').getSourceImage()

    const cardWidth = cardTexture.width
    const cardHeight = cardTexture.height
    const cardPadding = 4
    const offset = {
      x:
        ((this.sys.game.config.width as number)
          - (cardWidth + cardPadding) * 5)
          / 2
        + cardWidth / 2,
      y:
        ((this.sys.game.config.height as number)
          - (cardHeight + cardPadding) * 2)
          / 2
        + cardHeight / 2,
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

  createCards() {
    Phaser.Utils.Array.Shuffle(this.positions)
    for (let index = 0; index < cards.length; index++) {
      for (let i = 0; i < 2; i++) {
        this.cards.push(
          new Card(this, cards[index], this.positions.pop() as Positions),
        )
      }
    }

    this.input.on('gameobjectdown', this.handleCardClick, this)
  }

  createBackground() {
    this.add.sprite(0, 0, 'background').setOrigin(0, 0)
  }

  handleCardClick(pointer: Phaser.Input.Pointer, card: Card) {
    if (card.opened) {
      return
    }
    if (this.openedCard) {
      if (this.openedCard.value === card.value) {
        this.openedCard = null
        this.cardCounter += 1
      } else {
        this.openedCard.close()
        this.openedCard = card
      }
    } else {
      this.openedCard = card
    }
    card.open()
    if (this.cardCounter === cards.length) {
      this.restart()
    }
  }

  restart() {
    setTimeout(() => {
      this.openedCard = null
      this.cardCounter = 0
      this.scene.restart()
    }, 1500)
  }

  public preload() {
    console.log('preload')
    this.load.image('background', 'assets/sprites/background.png')
    this.load.image('card', 'assets/sprites/card.png')
    this.load.image('card1', 'assets/sprites/cards/card1.png')
    this.load.image('card2', 'assets/sprites/cards/card2.png')
    this.load.image('card3', 'assets/sprites/cards/card3.png')
    this.load.image('card4', 'assets/sprites/cards/card4.png')
    this.load.image('card5', 'assets/sprites/cards/card5.png')
  }

  public create() {
    console.log('create')
    this.createBackground()
    this.setCardPositions()
    this.createCards()
  }

  // public update() {
  //   console.log('update');
  // }
}
