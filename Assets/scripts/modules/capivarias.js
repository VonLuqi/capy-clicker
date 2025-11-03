export class CapivariasManager {
  constructor(config) {
    this.config = config
    this.container = document.querySelector('.capivarias_container')
    this.count = 0
  }

  addCapivaria() {
    console.log('Adicionando capivaria:', this.count)

    const { size, spacing, rows, images, shinyChance, goldChance } = this.config
    const safetyMargin = 8

    const row = this.count % rows
    const col = Math.floor(this.count / rows)

    let y = safetyMargin + (row * spacing)

    let jitter = this.getRandomInt(-5, 5)
    let x = safetyMargin + (col * size) + jitter

    const novaCapy = document.createElement('img')

    const imgIndex = this.getRandomInt(0, images.length - 2)
    novaCapy.src = images[imgIndex]

    novaCapy.draggable = false
    novaCapy.style.top = `${y}px`
    novaCapy.style.left = `${x}px`

    const shinyRoll = this.getRandomInt(0, shinyChance)
    if (shinyRoll === 0) {
      novaCapy.style.filter = 'invert()'
    }

    const goldRoll = this.getRandomInt(0, goldChance)
    if (goldRoll === 0) {
      novaCapy.src = images[images.length - 1]
    }

    this.container.appendChild(novaCapy)
    this.count++
  }

  getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min
  }
}