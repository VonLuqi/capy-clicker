export class UI {
  constructor() {
    this.elements = {
      qntCapy: document.querySelector('.qntCapy'),
      capy: document.querySelector('.capy'),
      actionText: document.querySelector('.action'),
      capyPerSec: document.querySelector('.capyPerSecond')
    }
  }

  updateCapyCount(count) {
    if (isNaN(count)) count = 0
    
    const displayCount = Math.floor(count)
    const text = displayCount >= 1000000 
    ? displayCount.toExponential(2) 
    : displayCount

    this.elements.qntCapy.textContent = `${text} capy`
  }

  updateUpgradePrice(upgradeId, price) {
    if (isNaN(price)) price = 0
    
    const upgradeElement = document.querySelector(`#${upgradeId}`)
    const displayPrice = Math.floor(price)

    upgradeElement.dataset.price = displayPrice >= 1000000
    ? `${displayPrice.toExponential(2)} capys`
    : `${displayPrice} capys`
  }

  updateCapyPerSecond(cps) {
    if (isNaN(cps)) cps = 0
    
    this.elements.capyPerSec.textContent = `${cps / 10} capy/s`
  }

  updateActionText(text) {
    this.elements.actionText.textContent = text
  }
}