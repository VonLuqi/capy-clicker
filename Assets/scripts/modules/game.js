export class Game {
  constructor(config) {
    this.capyCount = 0
    this.clickValue = 1
    this.capyPerSecond = 0
    this.config = config
  }

  click() {
    this.capyCount += this.clickValue
    return this.capyCount
  }

  update() {
    this.capyCount += this.capyPerSecond / 10
  }
}