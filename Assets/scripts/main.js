import { Game } from './modules/game.js'
import { UpgradeManager } from './modules/upgrades.js'
import { UI } from './modules/ui.js'
import { CapivariasManager } from './modules/capivarias.js'

async function init() {
  const response = await fetch('./Assets/scripts/data/config.json')
  const config = await response.json()

  const game = new Game(config)
  const upgradeManager = new UpgradeManager(config.upgrades)
  const ui = new UI()
  const capivariasManager = new CapivariasManager(config.capivarias)

  let multBuy = 1
  let firstClick = true

  ui.updateUpgradePrice('capivarias', upgradeManager.prices[0])
  ui.updateUpgradePrice('clickUp', upgradeManager.prices[1])

  document.querySelector('.capy').addEventListener('click', () => {
    game.click()
    ui.updateCapyCount(game.capyCount)

    if (firstClick) {
      ui.updateActionText('continue juntando capivaras!')
      firstClick = false
    }
  })

  document.querySelector('#capivarias').addEventListener('click', () => {
    const result = upgradeManager.buy(0, multBuy, game.capyCount)

    if (result.success) {
      game.capyCount -= result.cost
      game.capyPerSecond += multBuy

      for (let i = 0; i < multBuy; i++) {
        capivariasManager.addCapivaria()
      }

      ui.updateCapyCount(game.capyCount)
      ui.updateCapyPerSecond(game.capyPerSecond)
      ui.updateUpgradePrice('capivarias', upgradeManager.prices[0])
    }
  })

  document.querySelector('#clickUp').addEventListener('click', () => {
    const result = upgradeManager.buy(1, multBuy, game.capyCount)

    if (result.success) {
      game.capyCount -= result.cost
      game.clickValue += multBuy

      ui.updateCapyCount(game.capyCount)
      ui.updateUpgradePrice('capivarias', upgradeManager.prices[1])
    }
  })

  document.querySelector('#vezes').addEventListener('change', (e) => {
    multBuy = parseInt(e.target.value)

    const capivariasPrice = upgradeManager.calculateCost(0, multBuy)
    const clickUpPrice = upgradeManager.calculateCost(1, multBuy)

    ui.updateUpgradePrice('capivarias', capivariasPrice)
    ui.updateUpgradePrice('clickUp', clickUpPrice)
  })

  setInterval(() => {
    if (game.capyPerSecond > 0) {
      game.update()
      ui.updateCapyCount(game.capyCount)
    }
  }, 1000)
}

init()