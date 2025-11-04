export function spawnCapyParticlesAtPointer(e, {
  count = 5,
  sprite = './Assets/images/capivarias/01.png',
  size = 20,
  spread = 60,
  duration = 800
} = {}) {
  const originX = e.clientX
  const originY = e.clientY

  for (let i = 0; i < count; i++) {
    const img = document.createElement('img')
    img.src = sprite
    img.draggable = false
    img.className = 'capy-particle'

    img.style.position = 'fixed'
    img.style.left = `${originX}px`
    img.style.top = `${originY}px`
    img.style.zIndex = '200'
    img.style.pointerEvents = 'none'

    if (typeof size === 'number') {
      img.style.width = `${size}px`;
      img.style.height = `${size}px`;
    } else if (typeof size === 'string') {
      img.style.width = size;
      img.style.height = size;
    }

    const angle = Math.random() * Math.PI * 2

    const power = 0.4 + Math.random() * 0.8
    const distance = spread * power

    const dx = Math.cos(angle) * distance
    const dy = Math.sin(angle) * distance


    const rot = (Math.random() * 120 - 60)

    img.style.setProperty('--dx', `${dx}px`)
    img.style.setProperty('--dy', `${dy}px`)
    img.style.setProperty('--rot', `${rot}deg`)

    const d = duration + Math.floor(Math.random() * 200)
    const delay = Math.floor(Math.random() * 90)
    img.style.animationDuration = `${d}ms`
    img.style.animationDelay = `${delay}ms`

    document.body.appendChild(img)

    requestAnimationFrame(() => {
      img.classList.add('capy-particle--animate')
    })

    img.addEventListener('animationend', () => {
      img.remove()
    }, { once: true })
  }
}