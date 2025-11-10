<div align="center">

# CAPY CLICKER

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT) [![maintenance](https://img.shields.io/badge/maintenance-active-green.svg)](https://github.com/VonLuqi/capy-clicker) [![version](https://img.shields.io/badge/version-1.3.0-blue)](https://github.com/VonLuqi/capy-clicker)

[![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat&logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/HTML) [![CSS](https://img.shields.io/badge/CSS-563d7c?&style=flat&logo=css3&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS) [![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)

[![Discord](https://img.shields.io/badge/Discord-5865F2?style=flat&logo=discord&logoColor=white)](https://discord.gg/R7ZzJtjj)

</div>

## Sobre o Capy Clicker

>Capy Clicker é um jogo idle/clicker divertido e viciante inspirado em Cookie Clicker, onde você coleciona capivaras clicando em uma capivara gigante! Quanto mais você joga, mais capivaras você acumula e pode desbloquear melhorias para automatizar sua produção de capivaras.

## Funcionalidades

- **Sistema de Cliques**: Clique na capivara para ganhar capivaras
  - **Partículas Animadas (NOVO)**: Mini-capivaras explodem do cursor a cada clique, com quantidade proporcional ao poder do clique
- **Melhorias Disponíveis**:
  - **Capivarias**: Gera capivaras automaticamente ao longo do tempo (capy/s)
  - **Upgrade de Clique**: Aumenta a quantidade de capivaras ganhas por clique
- **Feeds**: Poderosos itens únicos que desbloqueiam com requisitos e aplicam efeitos especiais permanentes após a compra
  - **Capivárias Especiais (NOVO)**: Alguns feeds desbloqueiam capivárias únicas que aparecem no topo do gramado com animação flutuante defasada
- **Compra em Lote**: Compre melhorias de uma vez em quantidades de x1, x10 ou x100 (preferência persistida entre sessões)
- **Sistema de Gramado**: Visualize suas capivaras aparecendo em um gramado conforme você compra capivarias
- **Capivaras Especiais**: Chance de aparecer capivaras brilhantes (invertidas) ou douradas raras com bônus de produção!
- **Sistema de Preços Progressivos**: Os preços aumentam conforme você compra mais melhorias
- **Auto‑save**: Salvamento automático a cada 1s + salvamento imediato após compras para garantir persistência

## Como Jogar

1. Clique na capivara principal para começar a coletar capivaras
2. Use suas capivaras para comprar melhorias:
   - **Capivarias**: Produzem capivaras automaticamente
   - **Upgrade de Clique**: Aumentam o valor de cada clique
3. Selecione quantas unidades deseja comprar (x1, x10, x100)
4. Desbloqueie e compre **Feeds** quando aparecerem à direita
5. Continue expandindo sua coleção de capivaras!

## Sistema de Feeds 🧃

Os Feeds são cartões únicos que aparecem na coluna da direita quando você cumpre seus requisitos. Depois que um Feed é desbloqueado, ele continua visível até você comprá‑lo (mesmo se seu total de capys cair abaixo do requisito).

### Capivárias Especiais

Alguns feeds podem desbloquear **capivárias especiais** que aparecem no topo do gramado:

- **Layout Automático Inteligente (NOVO)**: Múltiplas capivárias especiais são automaticamente distribuídas no centro do gramado sem sobreposição
- **Posicionamento Dinâmico**: O sistema calcula automaticamente espaçamento baseado no tamanho do container e das capivárias
- **Animação Flutuante**: Cada capivária tem animação `float` independente com efeito visual suave
- **Persistência Completa**: Posição e layout são restaurados automaticamente ao recarregar o jogo
- **Suporte a Customização**: Cada capivária pode ter brilho (glow), tamanho e sprite únicos

Para configurar no `config.json`, adicione um objeto `capivariaEspecial` ao feed:

```json
"capivariaEspecial": {
  "imagem": "./Assets/images/capivarias/capivariaMotivadora.png",
  "tamanho": {
    "width": "40px",
    "height": "40px"
  },
  "posicao": {
    "top": "var(--gap)",
    "left": "50%"
  },
  "position": "top-center",
  "animacao": "float",
  "glowColor": "gold"
}
```

**Campos suportados**:

- `imagem` ou `image`: caminho para a sprite
- `tamanho` ou `size`: objeto `{width, height}` ou número (px)
- `posicao` ou `position`: objeto `{top, left}` ou string `"top-center"`
- `glowColor`: cor do brilho (ex: `"gold"`, `"#FFD700"`, `"rgba(255,215,0,0.8)"`)

O sistema detecta automaticamente capivárias com `position: "top-center"` e as agrupa para distribuição centralizada.

### Como funcionam

- Cada Feed possui:
  - `basePrice`: custo único para comprar
  - `requirements`: condições para desbloquear o cartão
  - `effect`: o efeito aplicado ao jogo quando comprado
- Estados visuais do card:
  - `locked` (invisível): requisitos ainda não cumpridos
  - `available` (destacado): requisitos cumpridos e você tem capys suficientes
  - `cannot-afford` (visível, mas sem saldo): requisitos ok, falta dinheiro
  - `purchased`: comprado (some permanentemente, mesmo após recarregar a página)

### Tipos de efeitos suportados

- `production_multiplier`: multiplica a produção por segundo (capy/s)
- `production_sum`: adiciona valor fixo à produção por segundo
- `click_multiplier`: multiplica o valor por clique
- `click_sum`: adiciona valor fixo ao clique

Internamente, a produção total considera somas e multiplicadores, tanto para clique quanto para capy/s, garantindo que diferentes Feeds possam se combinar e criar estratégias variadas.

### Requisitos possíveis (qualquer combinação)

- `minCapyCount`: ter ao menos X capys já acumulados uma vez
- `qntCapivarias`: possuir pelo menos N Capivarias
- `qntClickUpgrade`: possuir pelo menos N Upgrades de Clique
- `feedsPurchased`: lista de Feeds que precisam ter sido comprados antes

Quando os requisitos são cumpridos pela primeira vez, o Feed é marcado como desbloqueado e permanece visível até a compra.

### Onde configurar

Os Feeds ficam em `Assets/scripts/data/config.json`. Exemplo resumido:

```json
{
  "id": "feed_production_001",
  "name": "Capivárias Turbinadas",
  "description": "Aumenta a produção em 50%",
  "basePrice": 250,
  "effect": { "type": "production_multiplier", "value": 0.5 },
  "image": "./Assets/images/feeds/01.webp",
  "requirements": {
    "minCapyCount": 100,
    "qntCapivarias": 10,
    "qntClickUpgrade": 0,
    "feedsPurchased": []
  }
}
```

> Dica: use IDs únicos e imagens em `Assets/images/feeds/`.

## Salvamento e continuidade

- **Salvamento híbrido**:
  - Automático a cada 1 segundo
  - Imediato após cada compra (upgrades, Feeds)
- **Dados persistidos**: capys, upgrades, Capivarias posicionadas, Feeds comprados, Feeds desbloqueados, **Capivárias Especiais com layout**, multiplicador de compra (x1/x10/x100)
- **Proteção contra corrupção**: o jogo detecta e limpa saves corrompidos automaticamente
- **Reset manual**: no `init()` há uma linha comentada para apagar o save e recarregar a página

## Efeitos Visuais e Animações ✨

### Partículas de Clique

A cada clique na capivara principal, mini-capivaras explodem do cursor em todas as direções (360°):

- **Quantidade**: proporcional ao poder do clique (limitada para performance)
- **Dispersão**: explosão radial com alcance e rotação aleatórios
- **Animação**: fade-in/fade-out com scale e rotação suave
- **Configuração**: ajustável via `spawnCapyParticlesAtPointer()` em `animations.js`

Variáveis principais:

- `spread`: distância máxima (px) que as partículas voam
- `duration`: tempo (ms) de vida da animação
- `size`: tamanho das mini-capivaras
- `count`: número de partículas por clique

### Animação das Capivárias Especiais

- **Efeito flutuante vertical suave (`float`)** com animação CSS
- **Layout Automático Responsivo**: Sistema inteligente que distribui múltiplas capivárias especiais horizontalmente no centro do gramado
- **Evita Sobreposição**: Calcula automaticamente o espaçamento baseado no tamanho do container e largura das capivárias
- **Suporte a Brilho Customizado**: `drop-shadow` configurável para cada capivária
- **Agrupamento por Posição**: Capivárias com `position: "top-center"` são agrupadas e redistribuídas automaticamente

## Estrutura do Projeto

```plaintext
Test/
├── index.html
├── Assets/
│   ├── css/
│   │   ├── _reset.css
│   │   ├── default.css
│   │   └── style.css
│   ├── images/
│   │   ├── capivarias/
│   │   └── feeds/
│   └── scripts/
│       ├── main.js
│       ├── data/
│       │   └── config.json
│       └── modules/
│           ├── animations.js  ← Sistema de partículas
│           ├── capivarias.js
│           ├── feeds.js
│           ├── game.js
│           ├── ui.js
│           └── upgrades.js
├── package.json
└── README.md
```

## Tecnologias Utilizadas

- **HTML5**: estrutura semântica
- **CSS3**: variáveis CSS, animações, keyframes, Flexbox
- **JavaScript ES6+**: módulos, async/await, classes
- **LocalStorage API**: persistência de dados

## 🎮 Link para Jogar

**[▶️ Jogar Capy Clicker](https://capy-clicker.vercel.app/)**

---

<div align="center">

### Desenvolvido por **LUQI** ✨

[![GitHub](https://img.shields.io/badge/GitHub-VonLuqi-181717?style=flat&logo=github)](https://github.com/VonLuqi)

</div>
