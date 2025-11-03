import { Game } from './modules/game.js'
import { UpgradeManager } from './modules/upgrades.js'
import { UI } from './modules/ui.js'
import { CapivariasManager } from './modules/capivarias.js'
import { FeedsManager } from './modules/feeds.js'

async function init() {
  const response = await fetch('./Assets/scripts/data/config.json')
  const config = await response.json()

  const save = localStorage.getItem('capySave')
  let saveData = null
  if (save) {
    try {
      saveData = JSON.parse(save)
      if (isNaN(saveData.capyCount) || isNaN(saveData.clickValue) || isNaN(saveData.capyPerSecond)) {
        console.warn('Save corrompido detectado, resetando...')
        localStorage.removeItem('capySave')
        saveData = null
      }
    } catch (e) {
      console.error('Erro ao carregar save:', e)
      localStorage.removeItem('capySave')
      saveData = null
    }
  }

  const game = new Game(config)
  const upgradeManager = new UpgradeManager(config.upgrades)
  const ui = new UI()
  const capivariasManager = new CapivariasManager(config.capivarias)
  const feedsManager = new FeedsManager(config.feeds)
  
  let multBuy = 1
  let firstClick = true
  let currentActionText = 'clique para algo acontecer'

  if (saveData) {
    game.capyCount = saveData.capyCount
    game.clickValue = saveData.clickValue
    game.capyPerSecond = saveData.capyPerSecond
    upgradeManager.prices = saveData.upgrades

    if (saveData.actionText) {
      currentActionText = saveData.actionText
      firstClick = false
    }

    if (saveData.capivarias) {
      saveData.capivarias.forEach(capyData => {
        capivariasManager.restoreCapivaria(capyData)
      })
    }
  }

  ui.updateCapyCount(game.capyCount)
  ui.updateCapyPerSecond(game.capyPerSecond)
  ui.updateUpgradePrice('capivarias', upgradeManager.prices[0])
  ui.updateUpgradePrice('clickUp', upgradeManager.prices[1])
  ui.updateActionText(currentActionText)

  saveProgress()

  document.querySelector('.capy').addEventListener('click', () => {
    game.click()
    ui.updateCapyCount(game.capyCount)

    if (firstClick) {
      currentActionText = 'continue juntando capivaras!'
      ui.updateActionText(currentActionText)
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
      ui.updateUpgradePrice('clickUp', upgradeManager.prices[1])
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
  
  function saveProgress() {
    localStorage.setItem('capySave', JSON.stringify({
      capyCount: game.capyCount,
      clickValue: game.clickValue,
      capyPerSecond: game.capyPerSecond,
      upgrades: upgradeManager.prices,
      capivarias: capivariasManager.capivarias,
      actionText: currentActionText
    }))
  }

  setInterval(saveProgress, 1000)
}

init()