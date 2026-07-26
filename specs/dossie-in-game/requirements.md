# Requirements — dossiê in-game

Sucessora da spec `userscript-v2/`. A v2 entrega uma badge com o melhor tier da linha
evolutiva. Esta spec entrega o **dossiê de batalha**: o resto do que o jogador precisa para
decidir se gasta a Pokébola.

Critérios desta spec usam o prefixo `AD-`. Referências a `CA-` apontam para
`userscript-v2/requirements.md`.

## Objetivo

Responder, no momento em que o Pokémon selvagem aparece, o que hoje exige abrir a wiki em
outra aba: qual a hidden ability, quais os egg moves, quão raro ele é **no bioma atual**, e
qual a catch rate.

## Escopo

Slice A de uma decomposição maior. Fora desta spec, cada um com spec própria: busca
instantânea in-game (Ctrl+K), calculadoras de catch e dano, site/wiki, API pública, login e
sincronização de runs.

## Decisões que moldam tudo abaixo

Cada uma saiu de verificação no jogo rodando, não de suposição.

**A badge continua mínima.** O dossiê não cabe acima de um sprite em batalha dupla sem
violar CA-15 e CA-16. Ele vive num painel que só existe quando o jogador pede.

**O painel é só de batalha.** A tela de starter já mostra Ability, Passive, Nature, Growth
Rate, tipos e os slots de egg move na coluna esquerda. Um painel ali repetiria o jogo. Na
batalha o jogo mostra quase nada e a decisão é irreversível — é onde o dossiê vale.

**O painel é factual.** Todo campo é fato verificável extraído do jogo ou do Smogon.
Veredito de captura e nature recomendada são opinião e ficam fora — quando uma opinião erra,
ela derruba a confiança nos fatos acima dela.

**Raridade é contextual, não uma lista.** Em vez de listar todos os biomas onde a espécie
aparece, o painel diz a raridade dela no bioma em que o jogador está. É a informação que a
decisão precisa, e reduz o que precisa ser exibido.

**Egg moves aparecem, mesmo travados no save.** O jogo os esconde como `???` até o
desbloqueio. Revelar contorna uma progressão deliberada dos desenvolvedores, e isso foi
levantado e decidido conscientemente: o dado é público no repositório AGPL deles, e o
overlay o trata como qualquer outro. Fica registrado aqui para que a decisão seja
rastreável, não redebatida.

**Runtime é a fonte quando alcança; tabela gerada só para o que ele não alcança.** Minimiza
a superfície que envelhece quando o PokéRogue atualiza.

## O que o runtime entrega, verificado em jogo

Lido ao vivo do objeto de espécie do Ralts em `pokerogue.net`:

| Campo | Valor observado |
|---|---|
| `abilityHidden` | `140` |
| `catchRate` | `235` |
| `type1`, `type2` | `13`, `17` |
| `baseStats` | `[28,25,25,45,35,40]` |
| `getEvolutionLevels()` | `[[281,20],[282,30],[475,1]]` |

Também disponíveis: `ability1`, `ability2`, `baseTotal`, `growthRate`, `legendary`,
`mythical`, `subLegendary`, `category`, `forms`. O dossiê usa apenas `abilityHidden` e
`catchRate` — o resto fica anotado para slices futuros, e entrar agora seria escopo que
ninguém pediu.

`window.i18next` **não** existe. Confirma que nome de ability e de move só pode vir de
tabela gerada.

## Origem de cada dado

| Dado | Fonte | Por quê |
|---|---|---|
| `catchRate`, `abilityHidden` (id) | runtime, via `pokemon.species` | já alcançado; acompanha a versão que o jogador roda, e reflete fusão e forma |
| bioma atual | runtime, via `scene.arena.biomeType` | enum numérico, estável. `window.gameInfo.biome` também expõe, mas como string de exibição e sob um `gameInfoVersion` próprio — contrato menos estável |
| egg moves por espécie | gerada de `pokerogue` | `src/data/balance/moves/egg-moves.ts` |
| raridade por bioma e hora do dia | gerada de `pokerogue` | `src/data/balance/biomes/*.ts` |
| nome de ability, move e bioma | gerada de `pokerogue-locales` | os nomes não estão em `src/data`: `allAbilities` e `allMoves` são module-scope, e o texto vive no repositório de locales como JSON |
| tier Smogon da linha | gerada de `@pkmn/dex` | já é assim na v2 |

São **duas** fontes upstream pinadas, `pagefaultgames/pokerogue` e
`pagefaultgames/pokerogue-locales`, mais o `@pkmn/dex` que já era dependência.

## Licença

Ambos os repositórios upstream são **AGPL-3.0-only**. Esta spec passa a embutir dados
derivados deles no bundle distribuído, o que a v2 não fazia — o `@pkmn/dex` é MIT.

Se a extração constitui obra derivada é ponto genuinamente contestado: fato isolado não tem
copyright, mas a compilação (a seleção e o arranjo das pools de bioma e da lista de egg
moves) tem proteção em várias jurisdições, e o gerador copia a compilação quase inteira. Em
vez de apostar numa interpretação, o projeto adota AGPL-3.0-only e a questão deixa de
existir. É coerente com ser companion de um jogo AGPL, e o Greasyfork aceita.

## User stories

1. Como jogador em batalha, aperto uma tecla e vejo o dossiê do inimigo à minha frente, sem
   trocar de aba.
2. Como jogador em batalha dupla, alterno o dossiê entre os dois inimigos com a mesma tecla.
3. Como jogador, vejo quão raro aquele Pokémon é **no bioma onde estou**, não uma lista de
   biomas que eu teria que interpretar.
4. Como jogador, o painel não me atrapalha: fechado não ocupa pixel nenhum, aberto não cobre
   a HUD, e a tecla nunca rouba um comando do jogo.
5. Como jogador, se o overlay não sabe algo, ele **omite** — nunca preenche com palpite.
6. Como mantenedor, quando o PokéRogue atualiza os dados, recebo um PR com a tabela nova em
   vez de descobrir pelo relato de um usuário.

## Critérios de aceite

### Geração de dados

- AD-1: `npm run build:data` gera `data/names.generated.ts`, `data/egg-moves.generated.ts` e
  `data/biome-index.generated.ts`, todos tipados, e `npm run typecheck` continua passando.
- AD-2: O gerador lê de commits **pinados** dos dois repositórios upstream, registrados em
  `data/pokerogue-source.json`. Rodar o gerador duas vezes sem mudar os pins produz arquivos
  byte a byte idênticos.
- AD-3: Se o gerador não conseguir resolver uma fonte upstream, ele **falha** com erro
  explícito. Não emite tabela parcial e não reaproveita a tabela anterior.
- AD-4: Testes de dados confirmam, para cada tabela gerada, cardinalidade mínima e formato
  das chaves, no padrão de `test/tier-table-data.test.ts`.
- AD-21: As tabelas de nome são **filtradas**: só entram nomes referenciados pelas outras
  tabelas ou pelo runtime — hidden abilities, moves que são egg move, e biomas. `move.json`
  tem 179 KB e usaríamos uma fração.
- AD-22: Módulos upstream que arrastam `i18next` ou Phaser por transitividade são resolvidos
  por stubs locais declarados em um único lugar. Passando de cinco entradas, o gerador troca
  importação por leitura de AST — o teto existe para a gambiarra não crescer sem alguém
  decidir que ela cresceu.

### Empacotamento e licença

- AD-5: O bundle continua único e autocontido, sem `@require` e sem fetch em runtime
  (mantém CA-2).
- AD-6: O `.user.js` gerado permanece abaixo de 500 KB. O build é `minify: false`, então a
  medida é do arquivo como distribuído, sem contar com compressão.
- AD-23: `LICENSE` passa a AGPL-3.0-only, o campo `license` do bloco de metadados do
  userscript acompanha, e o README credita `pagefaultgames/pokerogue` e
  `pagefaultgames/pokerogue-locales` como origem dos dados, com a licença deles.

### Domínio

- AD-7: `dossier.ts` não importa nada de `render/`, `game/` ou Phaser. Recebe fatos de
  runtime mais tabelas, devolve struct.
- AD-8: Quando um dado não existe para a espécie, o campo vem vazio e a linha **não é
  renderizada**. Não existe texto de preenchimento como "desconhecido". A ausência de tier
  Smogon continua exibindo `?`, como na v2.
- AD-9: Para um Pokémon fundido, o painel mostra os dois nomes, resolve o tier entre as duas
  linhas como a v2 já faz, e exibe os campos factuais da espécie primária — que é o que o
  objeto de runtime entrega.
- AD-10: Dado o bioma atual e a espécie, o índice devolve a raridade e a hora do dia, ou
  nada. Espécie que não aparece naquele bioma não produz linha, e isso não é erro — pode ser
  encontro de evento, de fusão ou de troca de bioma.
- AD-24: Se o bioma atual não puder ser lido, a linha de raridade é omitida. O painel
  continua exibindo os demais campos.

### Painel

- AD-11: Com o painel fechado, nenhum objeto do painel existe na cena — verificável por
  `size === 0`, no padrão de CA-19.
- AD-12: A tecla que abre o painel **não é consumida pelo jogo** em batalha. O requisito é a
  ausência de conflito, não uma tecla específica; qual tecla satisfaz isso é determinado por
  verificação em jogo na tarefa A5. Já se sabe que `C`, `G`, `N` e `U` estão ocupadas na
  tela de starter, além de setas, Enter e Esc.
- AD-13: Em batalha dupla, acionar a tecla de novo alterna o painel para o outro inimigo, e
  uma terceira vez o fecha. O ciclo pula alvos já derrotados.
- AD-15: O painel aberto não cobre a HUD de batalha nem o texto de diálogo do jogo, em
  batalha simples e dupla (estende CA-15 e CA-16).
- AD-16: O painel é legível em viewport de celular, sem código de layout específico para
  mobile — herda escala do container do jogo, como as badges já fazem.
- AD-17: Sair da batalha com o painel aberto limpa o painel exatamente uma vez, no padrão de
  CA-18.
- AD-25: A tela de seleção de starter permanece **inalterada** — só a badge de tier que a v2
  já entrega. Nenhum painel, nenhuma tecla nova ali.

### Manutenção

- AD-18: Um workflow agendado semanalmente roda o gerador contra a HEAD dos dois upstreams
  e, se as tabelas mudarem, abre um PR com o diff e os pins atualizados.
- AD-19: O PR aberto pelo workflow passa por typecheck, lint, test e build antes de ser
  mergeável — reusa o CI de CA-6.
- AD-20: `npm test`, `npm run typecheck` e `npm run lint` passam.

## Edge cases

| Caso | Comportamento esperado |
|---|---|
| Espécie sem hidden ability | linha de HA ausente |
| Espécie sem egg move | linha de egg moves ausente |
| Espécie que não aparece no bioma atual | linha de raridade ausente (AD-10) |
| Bioma atual ilegível | linha de raridade ausente, resto do painel intacto (AD-24) |
| Pokémon fundido | dois nomes, tier resolvido entre as linhas, fatos da primária (AD-9) |
| Forma regional | chave espécie+forma resolve normal; sem entrada, cai para a espécie base, como `tier-table.ts` já faz |
| Tecla pressionada durante diálogo do jogo | painel não abre e a tecla é repassada ao jogo |
| Espécie nova, ausente da tabela gerada | campos gerados ausentes; campos de runtime continuam aparecendo |
| Batalha dupla com um inimigo derrotado | o ciclo só alterna entre alvos vivos (AD-13) |

## Fora de escopo

- Veredito de captura, nature recomendada, IVs recomendados, builds, sinergias.
- Tipos, base stats e níveis de evolução: alcançáveis em runtime, mas ninguém pediu. Anotados
  para slices futuros.
- Qualquer alteração na tela de starter (AD-25).
- Calculadora de catch e de dano — dependem deste dossiê e vêm no slice C.
- Busca por tecla (Ctrl+K) — slice B, reusa `panel.ts` e `dossier.ts` sem alteração.
- Qualquer backend, conta de usuário ou sincronização.
