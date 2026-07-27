# PokéRogue Tier Overlay

Mostra, dentro do próprio jogo, **o melhor tier competitivo do Smogon que cada Pokémon
consegue alcançar** — contando evolução, Mega Evolução e Gigantamax.

Um Magikarp é LC e parece lixo. Ele vira Gyarados. O overlay diz isso antes de você decidir
gastar a Pokébola.

```
Hoothoot   LC → RU (Noctowl)
```

## Instalar

1. Instale [Tampermonkey](https://www.tampermonkey.net/) ou
   [Violentmonkey](https://violentmonkey.github.io/).
2. Instale o script pelo Greasyfork *(link após a publicação)*.
3. Abra [pokerogue.net](https://pokerogue.net/). Pronto.

Funciona em Chrome, Firefox, Edge e Safari no desktop, e no Firefox do Android.

### No celular, ou onde não dá para instalar extensão

O Chrome do Android não suporta extensão nenhuma, e o Kiwi Browser, que era a saída, foi
descontinuado. Para esses casos existe um bookmarklet: um favorito que você toca depois que
o jogo abre.

```bash
npm run build:bookmarklet
```

Isso gera `dist/bookmarklet.txt`. Crie um favorito e cole o conteúdo no campo de endereço.
Abra o PokéRogue, toque no favorito, e o overlay liga.

Ele funciona **porque a captura do jogo não depende de injeção precoce** (veja abaixo). A
contrapartida é que você precisa tocar o favorito a cada carregamento da página, e que a URL
tem cerca de 180 kB — alguns navegadores não gostam de favoritos tão longos.

## Onde aparece

| Tela | O que mostra |
|---|---|
| Batalha | Badge acima de cada Pokémon inimigo, com o tier atual e o melhor tier alcançável |
| Escolha de starter | A sigla do melhor tier em cada ícone da grade, acompanhando filtros e rolagem |
| Painel (botão "Tiers") | Abas de **Em campo**, **Meu time** e **Bioma** |

O painel fica fechado por padrão, como um botão pequeno no canto do jogo. Os dados só
aparecem quando você pede — a tela do jogo continua sendo do jogo.

### O que conta como "alcançável"

O PokéRogue libera Mega Evolução e Gigantamax, então o tier que importa não é só o da
espécie: **Mawile é ZU, mas Mawile-Mega é OU. Kangaskhan-Mega é Uber. Charizard-Gmax é AG.**
O overlay considera as três coisas — evolução, mega e gmax — e mostra qual delas dá o
melhor resultado.

O alcance conta apenas o que dá para obter **a partir daquele Pokémon**: um Vaporeon não
volta a ser Eevee, então ele não "alcança" o Gmax do Eevee nem os outros eeveelutions.

Pokémon fundidos mostram o melhor tier entre as duas linhas. Espécie que o Smogon não
cataloga aparece como `?` — o overlay nunca inventa um tier.

### Aba de bioma

Lista o que aparece no bioma atual, agrupado por raridade (Chefe, Ultra raro, … Comum) e
ordenado pelo melhor tier alcançável — para decidir se vale continuar ali ou trocar de rota.
Os pools de encontro são extraídos do próprio código do PokéRogue por
`npm run build:biomes`.

## Desenvolver

```bash
npm install
npm run build
```

| Comando | O que faz |
|---|---|
| `npm run build` | gera `dist/pokerogue-tier-overlay.user.js` |
| `npm run build:tiers` | regenera a tabela de tiers a partir do `@pkmn/dex` |
| `npm run build:biomes` | regenera os pools de encontro a partir do repositório do PokéRogue |
| `npm run build:bookmarklet` | gera `dist/bookmarklet.txt` |
| `npm test` | testes (Vitest) |
| `npm run typecheck` | TypeScript em modo strict |
| `npm run lint` | Biome |
| `npm run launch` | abre o jogo num Chrome com o bundle injetado |
| `npm run launch -- --late` | o mesmo, injetando **depois** do jogo carregar |

## Como funciona, e por que assim

O PokéRogue é um jogo Phaser desenhado em canvas: não existe DOM para ler. Ele também não
expõe a instância do `Phaser.Game` em nenhuma variável global. Três decisões saem daí, e
nenhuma é óbvia olhando só o código:

**A captura do jogo tem duas estratégias, e isso não é redundância.** A primeira intercepta
a atribuição de `window.Phaser` e depende de rodar antes do bundle do jogo. Só que o
`@run-at document-start` do Tampermonkey
[não é determinístico](https://github.com/Tampermonkey/tampermonkey/issues/211): às vezes o
script chega tarde. A segunda estratégia cobre esse caso, capturando o jogo em pleno
funcionamento pelo primeiro frame de qualquer scene. Sem ela, o overlay falharia de forma
intermitente e difícil de reproduzir.

**As badges são objetos Phaser, não elementos HTML.** A grade de starter tem 572 ícones.
Um overlay em HTML precisaria converter coordenadas do canvas, reagir a rolagem, a filtro e
a redimensionamento, e manter centenas de nós sincronizados. Como cada badge é filha do
container que o próprio jogo desenha, posição, escala, rolagem e visibilidade são herdadas.
O problema de sincronização não é resolvido — ele deixa de existir. É também o que faz o
overlay funcionar em tela de celular sem código extra.

**A identificação é sempre por `speciesId`, nunca por texto.** A interface do jogo é
traduzida; nomes de habilidade e bioma mudam com o idioma. O número da Pokédex não muda.

Detalhes de arquitetura e o que foi verificado em produção estão em
[`specs/userscript-v2/design.md`](specs/userscript-v2/design.md).

## Se aparecer um aviso vermelho

`tier overlay: nao capturou o jogo (...)` significa que nenhuma das estratégias encontrou a
instância do Phaser em 20 segundos — normalmente porque uma atualização do PokéRogue mudou a
forma como o jogo carrega. Abra uma issue com a versão do jogo.

O overlay falha de forma visível de propósito. Um painel silencioso mostrando tier errado
seria pior que nenhum painel.

## Limitações conhecidas

- Não sugere moveset nem analisa cobertura de tipos do time. O painel mostra tier e
  alcance; escolha de golpes ainda é com você.
- Formas exclusivas do PokéRogue sem equivalente no Smogon caem para a espécie base.
- Tier mede força no metagame competitivo do Smogon, que não é a mesma coisa que força no
  PokéRogue: o jogo tem passivas, fusões e itens que o Smogon não modela.
- Depende de nomes internos do PokéRogue, que não são uma API pública. Hoje eles não são
  minificados; se isso mudar, o overlay avisa em vez de mentir.
- `npm audit` acusa uma falha de DoS em `brace-expansion`, dependência transitiva de build
  do `vite-plugin-monkey`. Ela não entra no bundle distribuído, e o `audit fix` rebaixaria o
  plugin para uma versão incompatível com o Vite 8.

## De onde vêm os dados

Tiers do Smogon via [`@pkmn/dex`](https://github.com/pkmn/ps), que é MIT.

Pools de espécie por bioma são geradas de
[`pagefaultgames/pokerogue`](https://github.com/pagefaultgames/pokerogue), que é
**AGPL-3.0-only**.

A fonte da verdade é o código do jogo, não a wiki nem o fórum: onde os dois divergirem, vale o
que efetivamente roda na máquina do jogador.

## Licença

**AGPL-3.0-only**, porque o overlay embute dados derivados do repositório do PokéRogue, que é
AGPL-3.0-only. Distribuir isso sob MIT seria incompatível com a licença da fonte.

Este é um projeto de fã, sem vínculo com a Nintendo, a The Pokémon Company, o Smogon ou o
PokéRogue.
