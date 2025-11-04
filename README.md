<div align="center">

# CAPY CLICKER

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT) [![maintenance](https://img.shields.io/badge/maintenance-experimental-blue.svg)](https://github.com/VonLuqi/capy-clicker) [![version](https://img.shields.io/badge/version-1.0.0-blue)](https://github.com/VonLuqi/capy-clicker)

[![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat&logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/HTML) [![CSS](https://img.shields.io/badge/CSS-563d7c?&style=flat&logo=css3&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS) [![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)

[![Discord](https://img.shields.io/badge/Discord-5865F2?style=flat&logo=discord&logoColor=white)](https://discord.gg/R7ZzJtjj)

</div>

## Sobre o Capy Clicker

>Capy Clicker é um jogo idle/clicker divertido e viciante inspirado em Cookie Clicker, onde você coleciona capivaras clicando em uma capivara gigante! Quanto mais você joga, mais capivaras você acumula e pode desbloquear melhorias para automatizar sua produção de capivaras.

## Funcionalidades

- **Sistema de Cliques**: Clique na capivara para ganhar capivaras
- **Melhorias Disponíveis**:
  - **Capivarias**: Gera capivaras automaticamente ao longo do tempo (capy/s)
  - **Upgrade de Clique**: Aumenta a quantidade de capivaras ganhas por clique
- **Feeds (NOVO)**: Poderosos itens únicos que desbloqueiam com requisitos e aplicam efeitos especiais permanentes após a compra
- **Compra em Lote**: Compre melhorias de uma vez em quantidades de x1, x10 ou x100
- **Sistema de Gramado**: Visualize suas capivaras aparecendo em um gramado conforme você compra capivarias
- **Capivaras Especiais**: Chance de aparecer capivaras brilhantes (invertidas) ou douradas raras!
- **Sistema de Preços Progressivos**: Os preços aumentam conforme você compra mais melhorias
- **Auto‑save**: Salvamento automático a cada 1s e recuperação defensiva de save corrompido

## Como Jogar

1. Clique na capivara principal para começar a coletar capivaras
2. Use suas capivaras para comprar melhorias:
   - **Capivarias**: Produzem capivaras automaticamente
   - **Upgrade de Clique**: Aumentam o valor de cada clique
3. Selecione quantas unidades deseja comprar (x1, x10, x100)
4. Desbloqueie e compre **Feeds** quando aparecerem à direita
5. Continue expandindo sua coleção de capivaras!

## Novidades: Sistema de Feeds 🧃

Os Feeds são cartões únicos que aparecem na coluna da direita quando você cumpre seus requisitos. Depois que um Feed é desbloqueado, ele continua visível até você comprá‑lo (mesmo se seu total de capys cair abaixo do requisito).

### Como funcionam

- Cada Feed possui:
  - `basePrice`: custo único para comprar
  - `requirements`: condições para desbloquear o cartão
  - `effect`: o efeito aplicado ao jogo quando comprado
- Estados visuais do card:
  - `locked` (cinza): requisitos ainda não cumpridos
  - `available` (destacado): requisitos cumpridos e você tem capys suficientes
  - `cannot-afford` (visível, mas sem saldo): requisitos ok, falta dinheiro
  - `purchased`: comprado (some com uma animação sutil)

### Tipos de efeitos suportados

- `production_multiplier`: multiplica a produção por segundo (capy/s)
- `production_sum`: adiciona valor fixo à produção por segundo
- `click_multiplier`: multiplica o valor por clique
- `click_sum`: adiciona valor fixo ao clique

Internamente, a produção total considera somas e multiplicadores, tanto para clique quanto para capy/s, garantindo que diferentes Feeds possam se combinar.

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

- Salvamento automático a cada 1 segundo
- Persistimos: capys, upgrades, Capivarias posicionadas, Feeds comprados e Feeds desbloqueados
- O jogo detecta e limpa saves corrompidos para evitar travamentos
- Para resetar manualmente: no `init()` há uma linha comentada para apagar o save e recarregar a página

## Tecnologias Utilizadas

- HTML5
- CSS3 (com variáveis CSS e animações)
- JavaScript Vanilla

## 🎮 Link para Jogar

**[▶️ Jogar Capy Clicker](https://capy-clicker.vercel.app/)**

---

<div align="center">

### Desenvolvido por **LUQI** ✨

[![GitHub](https://img.shields.io/badge/GitHub-VonLuqi-181717?style=flat&logo=github)](https://github.com/VonLuqi)

</div>
