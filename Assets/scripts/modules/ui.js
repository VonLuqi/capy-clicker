import { Game } from "./game.js"

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

  updateCapyPerSecond(cps, modPercent, modSum) {
    if (isNaN(cps)) cps = 0
    if (isNaN(modPercent)) modPercent = 1
    if (isNaN(modSum)) modSum = 0
    
    const totalCps = (cps / 10 + modSum) * modPercent
    const displayCps = totalCps >= 1000000 
      ? totalCps.toExponential(2) 
      : totalCps.toFixed(1)
    
    this.elements.capyPerSec.textContent = `${displayCps} capy/s`
  }

  updateActionText(text) {
    this.elements.actionText.textContent = text
  }
}