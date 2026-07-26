# Requirements — PokéRogue Tier Overlay

## Objetivo

Ao jogar PokéRogue, saber imediatamente se o Pokémon inimigo em campo vale a pena capturar,
com base no melhor tier competitivo do Smogon que a **linha evolutiva** dele alcança.

Exemplo: um Magikarp selvagem é LC (lixo competitivo), mas evolui para Gyarados, que é tier
alto. O overlay marca isso na tela durante a batalha.

## User stories

1. Como jogador, quero abrir o jogo por um comando único e já ter o overlay ativo, sem
   instalar extensão nem repetir login a cada sessão.
2. Como jogador, quero ver na tela, durante a batalha, o melhor tier da linha evolutiva de
   cada Pokémon inimigo em campo, para decidir se gasto Pokébola.
3. Como jogador, quero que o overlay funcione com Pokémon fundidos (fusão do PokéRogue),
   mostrando o melhor tier considerando as duas espécies.
4. Como jogador, quero que os dados de tier venham do Smogon na geração mais recente e
   possam ser atualizados por um comando, sem depender de rede durante o jogo.

## Critérios de aceite

Todos checáveis por comando ou observação direta.

### Dados

- CA-1: `npm run build:tiers` termina com exit code 0 e grava `data/tiers.json`.
- CA-2: `data/tiers.json` contém pelo menos 1000 entradas.
- CA-3: Toda entrada tem as chaves `tier`, `bestTier`, `bestName`, `line`.
- CA-4: Para Magikarp (chave `129`), `bestTier` é igual ao `tier` de Gyarados e é
  estritamente melhor que o `tier` de Magikarp segundo o ranking definido em design.md.
  (Asserção relacional — não fixa o valor literal do tier, que muda a cada shift do Smogon.)
- CA-5: Para uma espécie sem evolução (ex.: Ditto, chave `132`), `bestTier === tier` e
  `line` tem exatamente 1 elemento.
- CA-6: Formas regionais têm chave própria no formato `<dex>:<formKey>` (ex.: `26:alola`).

### Lógica

- CA-7: `npm test` passa (node:test, sem dependência externa de runner).
- CA-8: `extractEnemies(scene)` com uma scene falsa contendo 1 inimigo retorna 1 objeto com
  `{ speciesId, formIndex, name, fusion }`.
- CA-9: `extractEnemies(scene)` retorna `[]` quando `scene.currentBattle` é `null`
  (estado de tela de título — observado em produção).
- CA-10: Para um inimigo com `fusionSpecies` preenchido, o tier resolvido é o melhor entre
  as duas linhas evolutivas.

### Runtime

- CA-11: `npm start` abre uma janela do Chrome em `https://pokerogue.net/`.
- CA-12: O login persiste entre execuções (segunda execução de `npm start` não pede login).
- CA-13: Quando há batalha ativa, aparece na tela um painel com uma linha por inimigo em
  campo, no formato `<Nome> · <tier atual> → <melhor tier> (<melhor da linha>)`.
- CA-14: Quando não há batalha ativa (tela de título, menus), o painel não aparece.
- CA-15: Se o hook não conseguir capturar a instância do jogo em até 15s, o painel exibe
  aviso de falha visível em vermelho. Falha explícita, nunca silêncio.
- CA-16: O painel fica ancorado ao canvas e se reposiciona ao redimensionar a janela, sem
  cobrir a barra de HP do inimigo nem a caixa de comandos.

## Fora de escopo

- Marcar o time do jogador (só inimigos em campo).
- Marcar shiny, boss, IVs, natures, abilities — o jogo já sinaliza ou não foi pedido.
- Recomendação de estratégia, counters, movesets.
- Doubles com posicionamento individual por sprite (o painel lista os dois, mas não desenha
  badge colada em cada sprite).
- Userscript / extensão de Chrome. Puppeteer launcher apenas — decisão explícita do usuário.
- Publicação em store, distribuição, CI.

## Edge cases

| Caso | Comportamento esperado |
|---|---|
| Tela de título / menu (`currentBattle === null`) | Painel oculto |
| Batalha dupla | Painel lista os dois inimigos |
| Pokémon fundido | Uma linha, melhor tier entre as duas linhas, nome mostra `A/B` |
| Forma regional sem entrada própria no dex | Cai para a entrada base do número da Pokédex |
| Espécie sem tier no Smogon (ex.: forma exclusiva do PokéRogue) | Mostra `?` — nunca inventa tier |
| Tier `Illegal` / `Unreleased` no dex | Tratado como ausente, não entra no ranking |
| Canvas ainda não montado quando o overlay inicia | Overlay espera o canvas antes de posicionar |
| Usuário troca de aba e volta | Loop de polling continua; nada a fazer |
| PokéRogue renomeia `getEnemyField` numa atualização | CA-15 dispara: aviso vermelho, não crash silencioso |

## Restrições

- A interface do jogo pode estar traduzida (observado: PT-BR — "Supercrescimento",
  "Cidade", "Infinito"). Logo, **nenhuma lógica pode depender de texto exibido**; toda
  identificação usa `species.speciesId` (número da Pokédex nacional).
- Nada de rede em runtime: `tiers.json` é gerado offline e commitado.
