export class Game {
  constructor(config) {
    this.capyCount = 0
    this.clickValue = config.valuePerClick
    this.clickModPercent = 1
    this.clickModSum = 0
    this.capyPerSecond = 0
    this.capyPerSecModPercent = 1
    this.capyPerSecModSum = 0
    this.config = config

    this.upgradesOwned = {
      capivarias: 0,
      clickUp: 0
    }
  }

  click() {
    this.capyCount += (this.clickValue + this.clickModSum) * this.clickModPercent
    return this.capyCount
  }

  update() {
    this.capyCount += (this.capyPerSecond / 10 + this.capyPerSecModSum) * this.capyPerSecModPercent
  }

  addUpgrade(upgradeType, quantity = 1) {
    if (this.upgradesOwned[upgradeType] !== undefined) {
      this.upgradesOwned[upgradeType] += quantity
    }
  }

  getGameState() {
    return {
      capyCount: this.capyCount,
      upgradesOwned: this.upgradesOwned
    }
  }
}