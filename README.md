# PokéRogue Tier Overlay

Mostra, dentro do próprio jogo, **o melhor tier competitivo do Smogon que a linha evolutiva
de cada Pokémon alcança** — na batalha e na tela de escolha de starter.

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

Funciona em Chrome, Firefox, Edge e Safari no desktop, e no Firefox do Android. O Chrome do
Android não suporta extensão nenhuma — nesse caso, use o bookmarklet.

## Onde aparece

| Tela | O que mostra |
|---|---|
| Batalha | Badge acima de cada Pokémon inimigo, com o tier atual, o melhor tier da linha e qual evolução o alcança |
| Escolha de starter | A sigla do melhor tier em cada ícone da grade, acompanhando filtros e rolagem |

Pokémon fundidos mostram o melhor tier entre as duas linhas. Espécie que o Smogon não
cataloga aparece como `?` — o overlay nunca inventa um tier.

## Desenvolver

```bash
npm install
npm run build
```

| Comando | O que faz |
|---|---|
| `npm run build` | gera `dist/pokerogue-tier-overlay.user.js` |
| `npm run build:tiers` | regenera a tabela de tiers a partir do `@pkmn/dex` |
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

- Marca só os Pokémon inimigos em campo, não o seu time.
- Formas exclusivas do PokéRogue sem equivalente no Smogon caem para a espécie base.
- Depende de nomes internos do PokéRogue, que não são uma API pública. Hoje eles não são
  minificados; se isso mudar, o overlay avisa em vez de mentir.
- `npm audit` acusa uma falha de DoS em `brace-expansion`, dependência transitiva de build
  do `vite-plugin-monkey`. Ela não entra no bundle distribuído, e o `audit fix` rebaixaria o
  plugin para uma versão incompatível com o Vite 8.

## Licença

MIT. Este é um projeto de fã, sem vínculo com a Nintendo, a The Pokémon Company, o Smogon ou
o PokéRogue. Os dados de tier vêm do [`@pkmn/dex`](https://github.com/pkmn/ps), também MIT.
