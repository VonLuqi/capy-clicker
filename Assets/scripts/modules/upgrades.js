export class UpgradeManager {
  constructor(upgradesConfig) {
    this.upgrades = upgradesConfig
    this.prices = upgradesConfig.map(u => u.basePrice)
  }

  calculateCost(upgradeIndex, quantity) {
    let totalCost = 0
    let currentPrice = this.prices[upgradeIndex]

    for (let i = 0; i < quantity; i++) {
      totalCost += currentPrice
      currentPrice = Math.round(currentPrice * this.upgrades[upgradeIndex].priceMultiplier)
    }

    return totalCost
  }

  buy(upgradeIndex, quantity, currentCapys) {
    const cost = this.calculateCost(upgradeIndex, quantity)

    if (currentCapys >= cost) {
      this.prices[upgradeIndex] = Math.round(this.prices[upgradeIndex] * Math.pow(this.upgrades[upgradeIndex].priceMultiplier, quantity))
      return { success: true, cost }
    }

    return { success: false }
  }
}