import * as Phaser from 'phaser'
import { Card } from '../components/Card'

export type Positions = {
  x: number;
  y: number;
};

type Sounds = {
  theme: Phaser.Sound.BaseSound;
  card: Phaser.Sound.BaseSound;
  complete: Phaser.Sound.BaseSound;
  success: Phaser.Sound.BaseSound;
  timeout: Phaser.Sound.BaseSound;
};

const sceneConfig: Phaser.Types.Scenes.SettingsConfig = {
  active: false,
  visible: false,
  key: 'Game',
}

const cards = [1, 2, 3, 4, 5]

const INITIAL_TIMER_COUNT = 30

export class GameScene extends Phaser.Scene {
  positions!: Array<Positions>;

  cards!: Array<Phaser.GameObjects.Sprite>;

  openedCard!: Card | null;

  cardCounter!: number;

  timerCount!: number;

  timerText!: Phaser.GameObjects.Text | null;

  sounds!: Sounds | null;

  constructor() {
    super(sceneConfig)
    this.positions = []
    this.cards = []
    this.openedCard = null
    this.cardCounter = 0
    this.timerCount = INITIAL_TIMER_COUNT
    this.timerText = null
    this.sounds = null
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

  createText() {
    const textX = (this.sys.game.config.width as number) / 2
    const textY = (this.sys.game.config.height as number) - 10
    this.timerText = this.add.text(textX, textY, `Time: ${this.timerCount}`, {
      font: '36px',
      color: '#fff',
    })
    this.timerText.setOrigin(0.5, 1)
  }

  createTimer() {
    this.time.addEvent({
      delay: 1000,
      callback: this.handleTimerChange.bind(this),
      loop: true,
    })
  }

  createSounds() {
    this.sounds = {
      theme: this.sound.add('theme'),
      card: this.sound.add('card'),
      complete: this.sound.add('complete'),
      success: this.sound.add('success'),
      timeout: this.sound.add('timeout'),
    }
    this.sounds.theme.play({ volume: 0.1 })
  }

  handleCardClick(pointer: Phaser.Input.Pointer, card: Card) {
    if (card.opened) {
      return
    }
    this.sounds?.card.play()
    if (this.openedCard) {
      if (this.openedCard.value === card.value) {
        this.openedCard = null
        this.cardCounter += 1
        this.sounds?.success.play()
      } else {
        this.openedCard.close()
        this.openedCard = card
      }
    } else {
      this.openedCard = card
    }
    card.open()
    if (this.cardCounter === cards.length) {
      this.time.addEvent({
        delay: 1500,
        callback: () => this.sounds?.complete.play(),
      })

      this.time.addEvent({
        delay: 2000,
        callback: this.restart.bind(this),
      })
    }
  }

  handleTimerChange() {
    if (this.timerCount === 0) {
      this.sounds?.timeout.play()
      this.restart()
    }
    if (this.timerCount !== 0) {
      this.timerCount -= 1
      this.timerText?.setText(`Time: ${this.timerCount}`)
    }
  }

  restart() {
    this.sounds?.theme.stop()
    this.openedCard = null
    this.timerCount = INITIAL_TIMER_COUNT
    this.cardCounter = 0
    this.scene.restart()
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

    this.load.audio('theme', 'assets/sounds/theme.mp3')
    this.load.audio('card', 'assets/sounds/card.mp3')
    this.load.audio('complete', 'assets/sounds/complete.mp3')
    this.load.audio('success', 'assets/sounds/success.mp3')
    this.load.audio('timeout', 'assets/sounds/timeout.mp3')
  }

  public create() {
    console.log('create')
    this.createBackground()
    this.setCardPositions()
    this.createCards()
    this.createText()
    this.createTimer()
    this.createSounds()
  }

  // public update() {
  //   console.log('update');
  // }
}
