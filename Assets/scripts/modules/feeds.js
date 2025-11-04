export class FeedsManager {
  constructor(feedsConfig) {
    this.feeds = feedsConfig
    this.purchased = []
  }

  isUnlocked(feedId, gameState, feedsUnlocked = []) {
    const feed = this.feeds.find(f => f.id === feedId)
    if (!feed) return false

    if (feedsUnlocked.includes(feedId)) return true

    if (this.isPurchased(feedId)) return true

    const requirements = feed.requirements

    if (requirements.minCapyCount && gameState.capyCount < requirements.minCapyCount) {
      return false
    }

    if (requirements.qntCapivarias && gameState.upgradesOwned.capivarias < requirements.qntCapivarias) {
      return false
    }

    if (requirements.qntClickUpgrade && gameState.upgradesOwned.clickUp < requirements.qntClickUpgrade) {
      return false
    }

    if (requirements.feedsPurchased && requirements.feedsPurchased.length > 0) {
      for (let requiredFeedId of requirements.feedsPurchased) {
        if (!this.isPurchased(requiredFeedId)) {
          return false
        }
      }
    }

    feedsUnlocked.push(feedId)
    return true
  }

  canBuy(feedId, gameState, feedsUnlocked) {
    const feed = this.feeds.find(f => f.id === feedId)
    if (!feed) {
      return { canBuy: false, reason: 'Feed não encontrado' }
    }

    if (this.isPurchased(feedId)) {
      return { canBuy: false, reason: 'Já comprado' }
    }

    if (!this.isUnlocked(feedId, gameState, feedsUnlocked)) {
      return { canBuy: false, reason: 'Requisitos não cumpridos' }
    }

    if (gameState.capyCount < feed.basePrice) {
      return { canBuy: false, reason: 'Capys insuficientes' }
    }

    return { canBuy: true, reason: 'OK' }
  }

  buyFeed(feedId, gameState, feedsUnlocked) {
    const check = this.canBuy(feedId, gameState, feedsUnlocked)

    if (!check.canBuy) {
      return { success: false, reason: check.reason }
    }

    const feed = this.feeds.find(f => f.id === feedId)

    this.purchased.push(feedId)

    return {
      success: true,
      cost: feed.basePrice,
      effect: feed.effect,
      feedName: feed.name
    }
  }

  isPurchased(feedId) {
    return this.purchased.includes(feedId)
  }

  getAllFeeds() {
    return this.feeds
  }
}