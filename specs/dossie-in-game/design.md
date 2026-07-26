# Design — companion in-game

## Estado: isto documenta código que já existe

Os commits `7f8f6a5`, `b584133` e `17fe810` já entregaram a maior parte desta spec. Este
documento descreve a arquitetura **como ela é**, e marca em cada seção o que ainda é proposta.
Verificado: 109 testes passando, `tsc --noEmit` limpo.

| Componente | Onde | Estado |
|---|---|---|
| Pílula clicável + painel com abas | `src/hud/panel.ts` | existe |
| Abas de campo, time e bioma | `src/hud/panel.ts`, `src/hud/views.ts` | existe |
| Mega e Gigantamax no alcance de tier | `src/domain/reachable.ts` | existe |
| Pools de espécie por bioma | `src/domain/biome.ts`, `tools/build-biomes.mts` | existe, sem pin |
| Badges de tier em batalha e starter | `src/render/`, `src/surfaces/` | herdado da v2 |
| Aba de destinos (escolha de mapa) | — | proposta |
| Egg moves, hidden ability, catch rate | — | proposta |
| Nomes vindos dos locales | `BIOME_LABELS` manual em `hud.ts` | proposta |
| Cobertura de tipos do time | — | proposta |
| Licença AGPL e workflow de drift | — | proposta |

## Duas camadas de render, e por que a divergência é deliberada

A v2 estabeleceu que **badges são objetos Phaser, não HTML**, e o motivo continua válido: a
grade de starter tem 572 ícones, e cada badge sendo filha do container que o jogo desenha faz
posição, escala, rolagem e visibilidade serem herdadas. O problema de sincronização não é
resolvido — ele deixa de existir.

O painel escolheu o caminho oposto: **DOM posicionado sobre o canvas**, ancorado por
`getBoundingClientRect` a cada tick (`Hud.place`). A divergência é defensável e fica registrada
como consciente:

- O painel é **um** retângulo, não 572. O custo de sincronizar é um `placeAt` por tick.
- Ele precisa de rolagem, `text-overflow`, `backdrop-filter` e um layout de linhas. Reproduzir
  isso em objetos Phaser custaria muito mais que o ganho.
- Badges continuam Phaser. Nenhuma das duas camadas invade a outra.

A regra que sobrevive intacta: **`src/domain/` não conhece nem Phaser nem DOM.** É o que
mantém `views.ts` e `reachable.ts` testáveis sem navegador.

## O padrão de interação

Fechado, o overlay é a badge da v2 mais uma pílula discreta. Nada é despejado na tela.

```
pílula  --clique-->  painel  --abas-->  conteúdo montado por funções puras de views.ts
```

Uma superfície de interação, reusada por todas as telas. É o que impede a feature de virar HUD
paralela — e é o que faz uma tela nova custar uma função pura que devolve linhas, não um
componente.

## O que foi verificado no jogo rodando

Instrumentado em `pokerogue.net` com a estratégia de captura da v2 (hook em
`Phaser.Scenes.Systems.prototype.step`).

**O objeto de espécie entrega mais do que o painel usa hoje** — `abilityHidden` (`140` no
Ralts), `catchRate` (`235`), `type1`/`type2`, `baseStats`, `growthRate`, `forms`, e
`getEvolutionLevels()` devolvendo `[[281,20],[282,30],[475,1]]`.

**Mega, GMax, Primal e Eternamax saem de `species.forms[].formKey`**, com os valores do enum
`SpeciesFormKey`. Runtime, não tabela: acompanha a versão do jogador de graça. É o que
`reachable.ts` já explora.

**O bioma atual é `scene.arena.biomeId`** — confirmado em `src/field/arena.ts:60` do upstream,
onde o campo é `public readonly biomeId: BiomeId`.

**`StarterSelectUiHandler.allSpecies` expõe as 572 espécies em runtime.** Não é usado hoje; é o
caminho de uma busca por atalho sem UI nova.

**`window.i18next` não existe.** Nome de ability, move e bioma só sai de tabela gerada.
`window.gameInfo` existe e expõe bioma, wave e party, mas como strings de exibição sob um
`gameInfoVersion` próprio — contrato mais frágil que os objetos da cena.

**O Browser pane do app não roda PokéRogue**: a página fica `document.hidden: true`, o
`requestAnimationFrame` congela após poucos quadros e o Phaser não termina o boot. Verificação
exige Chrome headful, o que confirma `npm run launch` como a ferramenta das tarefas de tela.

## Os dados

### O problema do gerador atual

`tools/build-biomes.mts` faz `fetch` em
`raw.githubusercontent.com/pagefaultgames/pokerogue/beta` e extrai os dados com expressões
regulares sobre o TypeScript. Dois defeitos:

- **`beta` é alvo móvel.** A tabela pode mudar entre duas execuções sem ninguém ter decidido
  nada, e não há como reproduzir uma geração anterior.
- **Regex sobre TypeScript quebra em silêncio.** Uma reformatação no upstream produz tabela
  vazia ou parcial sem erro.

### A correção proposta

Importar os módulos de verdade a partir de um commit pinado em `data/pokerogue-source.json`.
Os arquivos de dado são object literals com referências a enums; com os aliases (`#enums/*`,
`#data/*`) mapeados no tsconfig do gerador, o `tsx` importa e lê estruturas reais, com os enums
já resolvidos em número. `tsx` não faz type check, então o `strict: false` do upstream é
irrelevante.

Isso não vale para todos os arquivos: `egg-moves.ts` importa só enums e resolve direto, mas
`balance/biomes/*.ts` importa `#data/terrain`, que arrasta `i18next`, `#app/messages` e
`#field/pokemon` e quebra em Node. A saída é aliasar os módulos contaminados para stubs em
`tools/stubs/` — hoje **um só**, o `TerrainType`. O teto é cinco: passando disso, o gerador
troca importação por leitura de AST, para a gambiarra não crescer sem alguém decidir que ela
cresceu.

Ordenação determinística na emissão é o que torna a geração reprodutível: sem ela, a ordem de
`readdirSync` varia entre sistemas de arquivos e o arquivo mudaria sem o dado ter mudado.

### A escolha de mapa sai de graça

Cada bioma do upstream exporta um objeto completo:

```ts
interface Biome {
  biomeId: BiomeId;
  pokemonPool: Record<BiomePoolTier, Record<TimeOfDay, readonly SpeciesId[]>>;
  trainerPool: Record<BiomePoolTier, readonly TrainerType[]>;
  trainerChance: number;
  biomeLinks: readonly (BiomeId | readonly [BiomeId, number])[];
}
```

`biomeLinks` são "os biomas para onde se pode viajar a partir daqui" — Plains leva a Grass,
Metropolis e Lake. É literalmente a tela de escolha de mapa, e vem do mesmo `import` que já dá
as pools. A feature mais pedida custa um campo a mais na `BiomeEntry` e uma projeção em
`views.ts`.

Um link pode vir como `BiomeId` ou como `[BiomeId, peso]`; o peso é probabilidade de transição
e não muda o conjunto de destinos oferecidos, então só o id entra.

### Tabelas

| Arquivo | Forma | Estado |
|---|---|---|
| `data/tier-table.generated.ts` | tiers, mega e gmax por espécie | existe |
| `data/biome-table.generated.ts` | `Record<biomeId, { name, pools }>` | existe; ganha `links` |
| `data/egg-moves.generated.ts` | `Record<speciesId, moveId[]>` | proposta |
| `data/names.generated.ts` | `MOVE_NAMES`, `BIOME_NAMES`, `TYPE_NAMES` | proposta |

Ids numéricos como chave: cada nome aparece uma vez, na tabela de nomes, em vez de repetido em
cada entrada. As tabelas de nome entram filtradas — `move.json` tem 179 KB e usaríamos uma
fração.

## Domínio

```
src/domain/          puro: sem Phaser, sem DOM
  tier.ts            ordem canônica dos tiers                     existe
  tier-table.ts      resolução com fusão                          existe
  evolution.ts       linha evolutiva                              existe
  tier-cascade.ts    fallback de tier entre gerações              existe
  reachable.ts       melhor alcance: linha, mega ou gmax          existe
  biome.ts           BiomeTable, pools, ordem de raridade         existe; ganha links
  coverage.ts        missingTypes(time, todos)                    proposta

src/hud/             painel DOM
  panel.ts           pílula, abas, linhas                         existe
  views.ts           funções puras cena → linhas                  existe
  hud.ts             posicionamento e orquestração                existe
```

`views.ts` é a fronteira: recebe a cena e devolve estruturas de dado. É o que permite testar o
conteúdo do painel sem navegador, e é onde a aba de destinos entra.

Cobertura de tipo aqui é **presença**, não eficácia: quais tipos o time tem e quais não tem.
Tabela de efetividade e cálculo de dano são escopo separado, e enfiá-los aqui seria escopo que
ninguém revisou.

Time vazio devolve lista vazia em vez de "faltam todos os tipos": sem time, a comparação não
tem significado, e apresentá-la seria opinião disfarçada de fato — exatamente o que o overlay
recusa ao exibir `?` em vez de inventar tier.

## Licença

`pagefaultgames/pokerogue` e `pagefaultgames/pokerogue-locales` são **AGPL-3.0-only**, e
`data/biome-table.generated.ts` já é derivado do primeiro. O projeto se distribui como MIT.
Isso não é risco futuro: está no repositório agora.

Se a extração constitui obra derivada é ponto contestado — fato isolado não tem copyright, mas
a compilação (a seleção e o arranjo das pools de bioma) tem proteção em várias jurisdições, e o
gerador copia a compilação quase inteira. Em vez de apostar numa interpretação, o projeto adota
AGPL-3.0-only e a questão deixa de existir. É coerente com ser companion de um jogo AGPL, e o
Greasyfork aceita.

## Manutenção: o workflow de drift

O risco real não é técnico, é temporal — o PokéRogue atualiza e a tabela passa a mentir. Mentir
é pior que omitir, e o overlay já escolheu omitir (`?` do Smogon).

Só faz sentido **depois** do pin: sem commit fixo não há o que comparar. Workflow semanal roda o
gerador contra a HEAD dos dois upstreams e abre PR se as tabelas mudarem. O PR passa pelo CI
existente. Merge é decisão humana — o overlay não se atualiza sozinho a partir de código de
terceiro.

## Teste

| Alvo | Como |
|---|---|
| `reachable`, `biome`, `coverage`, `views` | Vitest puro, sem navegador |
| `panel` | `test/panel.test.ts`, sobre DOM em jsdom |
| tabelas geradas | cardinalidade e formato, padrão de `test/tier-table-data.test.ts` |
| gerador | reprodutibilidade e falha explícita sem fonte |
| in-game | **screenshot obrigatória** com `npm run launch`, padrão V9 da v2 |

Sem screenshot, os critérios de tela não estão atendidos. Foi assim na v2 e continua sendo.
