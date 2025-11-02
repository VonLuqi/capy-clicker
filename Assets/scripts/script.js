const qntCapy = document.querySelector('.qntCapy')
const capy = document.querySelector('.capy')
const actionText = document.querySelector('.action')
const upCapivarias = document.querySelector('#capivarias')
const vezesBuy = document.querySelector('#vezes')
const clickUp = document.querySelector('#clickUp')
const capyPerSec = document.querySelector('.capyPerSecond')
const gramado = document.querySelector('.capivarias_container')

let clickValue = 1

let qnt = 0
let totalCapysAll = qnt
let first = true

let capivarasPorSegundo = 0
let multBuy = 1

let pricesUpgrades = [
  10,
  100
]

let capysNoGramado = 0
const capySize = 25
let imagesCapivarias = [
  './Assets/images/capivarias/01.png',
  './Assets/images/capivarias/02.png',
  './Assets/images/capivarias/03.png',
  './Assets/images/capivarias/04.png',
  './Assets/images/capivarias/gold.png'
]

atualizarPriceUpgrades(upCapivarias, 10)
atualizarPriceUpgrades(clickUp, 100)

document.addEventListener('contextmenu', function(evento) {
  if (evento.target.tagName === 'IMG') {
    evento.preventDefault()
  }
})

capy.addEventListener('click', () => {
  qnt += clickValue
  totalCapysAll += clickValue
  console.log(clickValue)
  atualizarContadorCapy()
  
  if (first) {
    actionText.textContent = 'continue juntando capivaras!'
    first = false
  }
})

upCapivarias.addEventListener('click', () => {
  let currentPrice = pricesUpgrades[0]
  let totalCost = 0
  let nextBasePrice = currentPrice

  for (let i = 0; i < multBuy; i++) {
    totalCost += nextBasePrice
    nextBasePrice = Math.round(nextBasePrice * 1.1)
  }
  
  if (qnt >= totalCost) {
    qnt -= totalCost
    capivarasPorSegundo += multBuy
    pricesUpgrades[0] = nextBasePrice

    atualizarContadorCapy()
    atualizarCapyPerSec()

    let displayCost = 0
    let displayPrice = pricesUpgrades[0]
    for (let i = 0; i < multBuy; i++) {
      displayCost += displayPrice
      displayPrice = Math.round(displayPrice * 1.1)
    }
    atualizarPriceUpgrades(upCapivarias, displayCost)

    for (let i = 0; i < multBuy; i++) {
      adicionarCapyGramado()
    }
  }
})

clickUp.addEventListener('click', () => {
  let currentPrice = pricesUpgrades[1]
  let totalCost = 0
  let nextBasePrice = currentPrice

  for (let i = 0; i < multBuy; i++) {
    totalCost += nextBasePrice
    nextBasePrice = Math.round(nextBasePrice * 2)
  }
  
  if (qnt >= totalCost) {
    qnt -= totalCost
    clickValue += multBuy
    pricesUpgrades[1] = nextBasePrice

    atualizarContadorCapy()

    let displayCost = 0
    let displayPrice = pricesUpgrades[1]
    for (let i = 0; i < multBuy; i++) {
      displayCost += displayPrice
      displayPrice = Math.round(displayPrice * 2)
    }
    atualizarPriceUpgrades(clickUp, displayCost)
  }
})

vezesBuy.addEventListener('change', () => {
  multBuy = parseInt(vezesBuy.value)

  let totalCostCps = 0
  let currentPriceCps = pricesUpgrades[0]
  for (let i = 0; i < multBuy; i++) {
    totalCostCps += currentPriceCps
    currentPriceCps = Math.round(currentPriceCps * 1.1)
  }
  atualizarPriceUpgrades(upCapivarias, totalCostCps)

  let totalCostClick = 0
  let currentPriceClick = pricesUpgrades[1]
  for (let i = 0; i < multBuy; i++) {
    totalCostClick += currentPriceClick
    currentPriceClick = Math.round(currentPriceClick * 2)
  }
  atualizarPriceUpgrades(clickUp, totalCostClick)
})

setInterval(function() {
  if (capivarasPorSegundo > 0) {
    qnt += capivarasPorSegundo / 10
    totalCapysAll += capivarasPorSegundo / 10
    atualizarContadorCapy()
  }
}, 1000)

function atualizarContadorCapy() {
  let qntAtual = Math.floor(qnt)

  if (qntAtual >= 1000000) {
    qntCapy.textContent = qntAtual.toExponential(2)
  } else {
    qntCapy.textContent = qntAtual
  }
}

function atualizarPriceUpgrades(obj, totalCost) {
  let actualCost = Math.floor(totalCost)

  if (actualCost >= 1000000) {
    obj.dataset.price = `${actualCost.toExponential(2)} Capys`
  } else {
    obj.dataset.price = `${actualCost} Capys`
  }
}

function atualizarCapyPerSec() {
  capyPerSec.textContent = `${capivarasPorSegundo / 10} capy/s`
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function adicionarCapyGramado() {

  const capySpacing = 20
  const safetyMargin = 8

  const numRows = 9

  const row = capysNoGramado % numRows
  const col = Math.floor(capysNoGramado / numRows)

  let y = safetyMargin + (row * capySpacing)

  let jitter = getRandomInt(-5, 5)
  let x = safetyMargin + (col * capySize) + jitter

  const novaCapy = document.createElement('img')

  const imgIndex = getRandomInt(0, imagesCapivarias.length -2)
  novaCapy.src = imagesCapivarias[imgIndex]

  novaCapy.draggable = false

  novaCapy.style.top = `${y}px`
  novaCapy.style.left = `${x}px`

  const shinySort = getRandomInt(0, 50)
  const goldSort = getRandomInt(0, 1000)

  if (shinySort === 0) {
    novaCapy.style.filter = 'invert()'
  }

  if (goldSort === 0) {
    novaCapy.src = imagesCapivarias[imagesCapivarias.length - 1]
  }

  gramado.appendChild(novaCapy)
  capysNoGramado++
}
