# Requirements — v2: userscript publicável

Sucessora da spec `pokerogue-tier-overlay/`. A v1 é um launcher Puppeteer pessoal; a v2 é um
userscript distribuível no Greasyfork.

## Objetivo

Transformar o overlay em software que outra pessoa instala em um clique, usa sem saber o que
é Node, e cujo código sustenta contribuição externa.

## Mudanças de escopo em relação à v1

| Área | v1 | v2 |
|---|---|---|
| Distribuição | launcher Puppeteer | userscript (Greasyfork) |
| Linguagem | JS solto | TypeScript |
| Render | painel DOM no canto | objetos Phaser dentro do jogo |
| Telas | só batalha | batalha + seleção de starter |
| Marcação | painel único | badge por Pokémon |
| Puppeteer | produto | ferramenta de desenvolvimento |
| Comentários no código | presentes | ausentes por decisão do autor |

## User stories

1. Como jogador, instalo pelo Greasyfork em um clique e o overlay funciona ao abrir o jogo.
2. Como jogador em batalha, vejo o tier logo acima de cada Pokémon inimigo, inclusive em
   batalha dupla, e a marcação acompanha o sprite.
3. Como jogador escolhendo starter, vejo o tier em cada ícone da grade, para escolher sem
   consultar o Smogon em outra aba.
4. Como jogador, o overlay não me atrapalha: não cobre texto do jogo, não pesa, e some
   quando não há o que marcar.
5. Como contribuidor, clono o repositório, rodo um comando e tenho ambiente de dev com
   recarga automática.

## Critérios de aceite

### Build e distribuição

- CA-1: `npm run build` gera `dist/pokerogue-tier-overlay.user.js` com bloco de metadados
  válido (`@name`, `@match https://pokerogue.net/*`, `@run-at document-start`,
  `@grant none`, `@version`, `@license MIT`).
- CA-2: O arquivo gerado é único e autocontido — sem `@require` externo, sem fetch em
  runtime. A tabela de tiers vai embutida.
- CA-3: `npm run typecheck` passa sem erro, em modo `strict`.
- CA-4: `npm run lint` passa.
- CA-5: `npm test` passa.
- CA-6: CI no GitHub Actions roda typecheck, lint, test e build a cada push.

### Captura do jogo

- CA-7: O overlay captura a instância do `Phaser.Game` quando carregado antes do bundle do
  jogo (caminho `document-start`).
- CA-8: O overlay captura a instância **também** quando carregado depois do jogo já estar
  rodando. Isto não é redundância: o `document-start` do Tampermonkey é reconhecidamente
  não determinístico, e sem a segunda estratégia o overlay falha de forma intermitente.
- CA-9: Se nenhuma estratégia capturar em 20s, uma mensagem de diagnóstico aparece na tela
  indicando qual estratégia falhou.

### Batalha

- CA-10: Cada Pokémon inimigo em campo recebe uma badge posicionada acima do seu sprite.
- CA-11: Em batalha dupla, cada inimigo recebe a sua própria badge.
- CA-12: A badge acompanha o sprite quando ele se move, e some quando o Pokémon deixa o
  campo.
- CA-13: A badge mostra o melhor tier da linha evolutiva; em fusão, o melhor entre as duas
  linhas.

### Seleção de starter

- CA-14: Na tela de seleção de starter, cada ícone visível da grade recebe a marcação do
  melhor tier da linha evolutiva daquela espécie.
- CA-15: A marcação acompanha a rolagem e os filtros da grade — ao filtrar por geração ou
  tipo, nenhuma marcação fica órfã sobre o ícone errado.
- CA-16: A marcação não cobre os elementos que o jogo já desenha no ícone (custo, ícone de
  shiny, ícone de favorito).
- CA-17: Sair da tela remove todas as marcações criadas por ela.

### Comportamento geral

- CA-18: Fora das telas suportadas, o overlay não desenha nada.
- CA-19: Nenhum vazamento: alternar entre telas 20 vezes não deixa objetos Phaser órfãos
  (contagem de objetos criados pelo overlay volta a zero ao sair).
- CA-20: A identificação de espécie continua por `speciesId`, nunca por texto exibido.

## Fora de escopo

- Extensão de Chrome / Web Store.
- Qualquer forma de cobrança, licenciamento ou servidor.
- Marcar o time do jogador.
- Pokédex, sumário, gacha de ovos e demais telas.
- Recomendação de counters, movesets ou estratégia.
- Traduzir o overlay (o conteúdo é sigla de tier e nome de Pokémon; ambos permanecem como
  no Smogon).

## Edge cases

| Caso | Comportamento |
|---|---|
| Userscript injetado tarde demais | Estratégia 2 captura o jogo no frame seguinte |
| Espécie sem tier no Smogon | Badge com `?`, nunca tier inventado |
| Grade de starter rolada | Marcações seguem os containers, que são objetos Phaser |
| Filtro reduz a grade | Marcações dos ícones ocultos ficam ocultas junto |
| Fusão em campo | Uma badge, melhor tier entre as duas linhas |
| Scene destruída pelo jogo | Marcações destruídas junto, sem referência pendente |
| Jogo atualiza e renomeia API interna | Diagnóstico nomeando o ponto que quebrou |

## Riscos aceitos

- **IP.** O projeto nomeia Pokémon e depende de um fangame não licenciado. Publicar
  gratuitamente com licença MIT e sem monetização é a postura de menor exposição. Cobrar
  aumentaria o risco sem retorno proporcional.
- **Timing do Tampermonkey.** Mitigado por CA-8, não eliminado.
- **API interna do PokéRogue.** O jogo não oferece API pública; toda leitura depende de
  nomes internos. Hoje eles não são minificados, o que foi verificado em produção. Se isso
  mudar, o overlay quebra de forma visível (CA-9).
