import { Game } from './modules/game.js'
import { UpgradeManager } from './modules/upgrades.js'
import { UI } from './modules/ui.js'
import { CapivariasManager } from './modules/capivarias.js'
import { FeedsManager } from './modules/feeds.js'

async function init() {
  // Para resetar o save, descomente e comente novamente a linha abaixo
  // localStorage.removeItem('capySave'); location.reload()

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

  let feedsUnlocked = []
  if (saveData && saveData.feedsUnlocked) {
    feedsUnlocked = saveData.feedsUnlocked
  }

  const game = new Game(config)
  const upgradeManager = new UpgradeManager(config.upgrades)
  const ui = new UI()
  const capivariasManager = new CapivariasManager(config.capivarias)
  const feedsManager = new FeedsManager(config.feeds)
  
  let multBuy = 1

  const vezesSelect = document.querySelector('#vezes')
  if (saveData && Number.isFinite(saveData.byMultiplier)) {
    multBuy = saveData.buyMultiplier

    vezesSelect.value = String(multBuy)
  } else {
    vezesSelect.value = String(multBuy)
  }

  let firstClick = true
  let currentActionText = 'clique para algo acontecer'

  if (saveData) {
    game.capyCount = saveData.capyCount
    game.capyPerSecModPercent = Number.isFinite(saveData?.capyPerSecModPercent)
    ? saveData.capyPerSecModPercent
    : 1
    game.capyPerSecModSum = Number.isFinite(saveData?.capyPerSecModSum)
    ? saveData.capyPerSecModSum
    : 0
    game.clickValue = saveData.clickValue
    game.clickModPercent = Number.isFinite(saveData?.clickModPercent)
    ? saveData.clickModPercent
    : 1
    game.clickModSum = Number.isFinite(saveData?.clickModSum)
    ? saveData.clickModSum
    : 0
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

      const baseProduction = capivariasManager.capivarias.length
      const bonus = capivariasManager.calculateTotalBonus()
      game.capyPerSecond = baseProduction + bonus
    }

    if (saveData.feedsPurchased) {
      feedsManager.purchased = saveData.feedsPurchased
    }

    if (saveData.specialCapivarias && saveData.specialCapivarias.length > 0) {
      saveData.specialCapivarias.forEach(feedId => {
        const feed = feedsManager.feeds.find(f => f.id === feedId)
        if (feed && feed.capivariaEspecial) {
          addSpecialCapivaria(feed.capivariaEspecial, feed.id)
        }
      })
    }

    if (saveData.upgradesOwned) {
      game.upgradesOwned = saveData.upgradesOwned
    }
  }

  ui.updateCapyCount(game.capyCount)
  ui.updateCapyPerSecond(game.capyPerSecond, game.capyPerSecModPercent, game.capyPerSecModSum)
  ui.updateUpgradePrice('capivarias', upgradeManager.prices[0])
  ui.updateUpgradePrice('clickUp', upgradeManager.prices[1])
  ui.updateActionText(currentActionText)

  saveProgress()

  function createFeedCards() {
    const container = document.querySelector('.feeds_container')
    container.innerHTML = ''

    feedsManager.getAllFeeds().forEach(feed => {
      const feedCard = document.createElement('div')
      feedCard.className = 'feed_card'
      feedCard.id = feed.id
      feedCard.dataset.price = feed.basePrice.toString()

      const img = document.createElement('img')
      img.src = feed.image
      img.alt = feed.name
      img.draggable = false

      const name = document.createElement('p')
      name.className = 'feed_name'
      name.textContent = feed.name

      const desc = document.createElement('p')
      desc.className = 'feed_desc'
      desc.textContent = feed.description

      feedCard.appendChild(img)
      feedCard.appendChild(name)
      feedCard.appendChild(desc)
      container.appendChild(feedCard)

      feedCard.addEventListener('click', () => {
        handleFeedPurchase(feed.id)
      })
    })
  }

  createFeedCards()

  function updateFeedsUI() {
    const gameState = game.getGameState()

    feedsManager.getAllFeeds().forEach(feed => {
      const feedCard = document.querySelector(`#${feed.id}`)
      if (!feedCard) return

      const isUnlocked = feedsManager.isUnlocked(feed.id, gameState, feedsUnlocked)
      const isPurchased = feedsManager.isPurchased(feed.id)
      const canBuy = feedsManager.canBuy(feed.id, gameState, feedsUnlocked)

      feedCard.classList.remove('locked', 'purchased', 'available', 'cannot-afford')

      if (isPurchased) {
        feedCard.classList.add('purchased')
        feedCard.style.display = 'none'
        return
      } else {
        feedCard.style.removeProperty('display')
      }

      if (!isUnlocked) {
        feedCard.classList.add('locked')
      } else if (canBuy.canBuy) {
        feedCard.classList.add('available')
      } else {
        feedCard.classList.add('cannot-afford')
      }
    })
  }

  updateFeedsUI()

  function addSpecialCapivaria(capivariaConfig, feedId) {
    if (document.querySelector(`.special-capivaria[data-feed-id="${feedId}"]`)) return;
    const container = document.querySelector('.capivarias_container');
    const specialCapy = document.createElement('img');
    specialCapy.src = capivariaConfig.imagem || capivariaConfig.image;
    specialCapy.draggable = false;
    specialCapy.classList.add('special-capivaria');
    specialCapy.dataset.feedId = feedId;

    const pos = capivariaConfig.posicao || capivariaConfig.position;
    if (pos) {
      if (pos.top) specialCapy.style.top = pos.top;
      if (pos.left) specialCapy.style.left = pos.left;
      if (typeof pos === 'string' && pos === 'top-center') {
        specialCapy.style.top = 'var(--gap)';
        specialCapy.style.left = '50%';
      }
    }

    const tam = capivariaConfig.tamanho || capivariaConfig.size;
    if (tam) {
      if (tam.width) specialCapy.style.width = tam.width;
      if (tam.height) specialCapy.style.height = tam.height;
      if (typeof tam === 'number' || typeof tam === 'string') {
        specialCapy.style.width = `${tam}px`;
        specialCapy.style.height = `${tam}px`;
      }
    }

    specialCapy.style.zIndex = '100';

    if (capivariaConfig.glowColor) {
      specialCapy.style.filter = `drop-shadow(0 0 16px ${capivariaConfig.glowColor})`;
    }

    container.appendChild(specialCapy);
  }

  function handleFeedPurchase(feedId) {
    const gameState = game.getGameState()
    
    const result = feedsManager.buyFeed(feedId, gameState, feedsUnlocked)

    const feed = feedsManager.feeds.find(f => f.id === feedId)

    if (result.success) {
      game.capyCount -= result.cost

      applyFeedEffect(result.effect, feed)

      ui.updateCapyCount(game.capyCount)
      ui.updateCapyPerSecond(game.capyPerSecond, game.capyPerSecModPercent, game.capyPerSecModSum)

      saveProgress()

      const feedCard = document.getElementById(feedId)
      if (feedCard) {
        feedCard.classList.add('fade-out')

        feedCard.addEventListener('animationend', () => {
          feedCard.style.display = 'none'
        }, { once: true })
      }
    } else {
      console.log('Não foi possível comprar:', result.reason)
    }
  }

  function applyFeedEffect(effect, feed) {
    switch (effect.type) {
      case 'production_multiplier':
        const multProd = effect.value <= 1
        ? 1 + effect.value
        : effect.value
        game.capyPerSecModPercent *= multProd
        break

      case 'production_sum':
        game.capyPerSecModSum += effect.value
        break

      case 'click_multiplier':
        const multClick = effect.value <= 1
        ? 1 + effect.value
        : effect.value
        game.clickModPercent *= multClick
        break

      case 'click_sum':
        game.clickModSum += effect.value
        break

      default:
        console.warn('Efeito desconhecido:', effect.type)
    }

    if (feed && feed.capivariaEspecial) {
      addSpecialCapivaria(feed.capivariaEspecial, feed.id)
    }
  }

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
      game.addUpgrade('capivarias', multBuy)

      for (let i = 0; i < multBuy; i++) {
        const productionValue = capivariasManager.addCapivaria()
        game.capyPerSecond += productionValue
      }

      ui.updateCapyCount(game.capyCount)
      ui.updateCapyPerSecond(game.capyPerSecond, game.capyPerSecModPercent, game.capyPerSecModSum)
      
      const newCapivariasPrice = upgradeManager.calculateCost(0, multBuy)
      ui.updateUpgradePrice('capivarias', newCapivariasPrice)
      
      saveProgress()
    }
  })

  document.querySelector('#clickUp').addEventListener('click', () => {
    const result = upgradeManager.buy(1, multBuy, game.capyCount)

    if (result.success) {
      game.capyCount -= result.cost
      game.clickValue += multBuy
      game.addUpgrade('clickUp', multBuy)

      ui.updateCapyCount(game.capyCount)
      
      const newClickUpPrice = upgradeManager.calculateCost(1, multBuy)
      ui.updateUpgradePrice('clickUp', newClickUpPrice)
      
      saveProgress()
    }
  })

  document.querySelector('#vezes').addEventListener('change', (e) => {
    multBuy = parseInt(e.target.value)

    const capivariasPrice = upgradeManager.calculateCost(0, multBuy)
    const clickUpPrice = upgradeManager.calculateCost(1, multBuy)

    ui.updateUpgradePrice('capivarias', capivariasPrice)
    ui.updateUpgradePrice('clickUp', clickUpPrice)

    saveProgress()
  })

  setInterval(() => {
    if (game.capyPerSecond > 0) {
      game.update()
      ui.updateCapyCount(game.capyCount)
    }

    updateFeedsUI()
  }, 1000)

  function saveProgress() {
    localStorage.setItem('capySave', JSON.stringify({
      capyCount: game.capyCount,
      clickValue: game.clickValue,
      clickModPercent: game.clickModPercent,
      clickModSum: game.clickModSum,
      capyPerSecond: game.capyPerSecond,
      capyPerSecModPercent: game.capyPerSecModPercent,
      capyPerSecModSum: game.capyPerSecModSum,
      upgrades: upgradeManager.prices,
      capivarias: capivariasManager.capivarias,
      actionText: currentActionText,
      feedsPurchased: feedsManager.purchased,
      upgradesOwned: game.upgradesOwned,
      feedsUnlocked: feedsUnlocked,
      buyMultiplier: multBuy,
      specialCapivarias: feedsManager.purchased.filter(feedId => {
        const feed = feedsManager.feeds.find(f => f.id === feedId)
        return feed && feed.capivariaEspecial
      })
    }))
  }

  setInterval(saveProgress, 1000)
}

init()