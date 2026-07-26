# Design — companion in-game

## Princípio herdado

A v2 separa domínio puro de render burro: `domain/` não conhece Phaser, `render/` não conhece
regra. Esta spec estende a fronteira em vez de abrir exceção nela.

## Uma superfície de interação, não três

O maior risco desta spec não é técnico: é virar uma HUD paralela competindo com a do jogo.
A defesa é arquitetural, não de disciplina — **existe um único componente de UI**, o `Hub`, e
toda tela o reusa. Não há painel de batalha, painel de starter e painel de mapa; há o hub,
alimentado por abas diferentes.

```
badge (v2, já existe)  --clique-->  Hub  --abas-->  conteúdo montado pelo domínio
```

Consequência prática: o slice B (busca por atalho) não desenha nada novo — ele só empurra
outra aba para dentro do mesmo hub. E o custo de adicionar uma tela é uma função pura que
devolve linhas.

## O que foi verificado no jogo rodando

O jogo foi instrumentado em `pokerogue.net` com a estratégia de captura da v2 (hook em
`Phaser.Scenes.Systems.prototype.step`). Cinco coisas mudaram o desenho.

**O objeto de espécie entrega bem mais do que a v2 usa** — `abilityHidden`, `catchRate`,
`type1`, `type2`, `baseStats`, `growthRate`, `forms`, `getEvolutionLevels()`.

**Mega, GMax, Primal e Eternamax saem de `species.forms[].formKey`**, com os valores do enum
`SpeciesFormKey` do upstream. Runtime, não tabela: acompanha a versão do jogador de graça.

**`StarterSelectUiHandler.allSpecies` expõe as 572 espécies em runtime.** Não é necessário
aqui, mas é o caminho do slice B.

**`window.i18next` não existe.** Nomes só saem de tabela gerada.

**O Browser pane do app não roda PokéRogue**: a página fica `document.hidden: true`, o
`requestAnimationFrame` congela e o Phaser não termina o boot. Verificação exige Chrome
headful — o que confirma `npm run launch` como a ferramenta das tarefas de tela.

## Os dados, e por que a escolha de mapa sai de graça

Cada bioma do upstream exporta um objeto `Biome` completo:

```ts
interface Biome {
  biomeId: BiomeId;
  pokemonPool: Record<BiomePoolTier, Record<TimeOfDay, readonly SpeciesId[]>>;
  trainerPool: Record<BiomePoolTier, readonly TrainerType[]>;
  trainerChance: number;
  weatherPool: ...;
  biomeLinks: readonly (BiomeId | readonly [BiomeId, number])[];
}
```

`biomeLinks` é o grafo de destinos — Plains leva a Grass, Metropolis e Lake. É literalmente a
tela de escolha de mapa, e vem do mesmo `import` que já dá as pools de espécie. A feature mais
pedida desta spec custa uma segunda projeção sobre dados que o gerador já tem em mãos.

O upstream inclusive já declara o formato invertido que precisamos —
`CatchableSpecies = Record<SpeciesId, readonly BiomeTierTimeOfDay[]>` — o que confirma o
desenho, ainda que a instância seja module-scope e inalcançável.

### Tabelas emitidas

| Arquivo | Forma |
|---|---|
| `data/egg-moves.generated.ts` | `Record<number, readonly number[]>` |
| `data/biome-index.generated.ts` | `Record<number, readonly Encounter[]>` |
| `data/biome-links.generated.ts` | `Record<number, readonly number[]>` |
| `data/names.generated.ts` | `ABILITY_NAMES`, `MOVE_NAMES`, `BIOME_NAMES`, `TYPE_NAMES` |

Ids numéricos como chave: cada nome aparece uma vez, na tabela de nomes, em vez de repetido
em cada entrada. As tabelas de nome são filtradas (AD-5) — `move.json` tem 179 KB e usaríamos
uma fração.

Estimativa, com `minify: false`, medida no arquivo distribuído: bundle atual 99 KB, tabelas
~90–130 KB, total ~200–230 KB contra o teto de 500 KB de AD-8.

### O gerador

`tools/build-pokerogue-data.mts`, irmão do `build-tier-table.mts`. Duas fontes pinadas em
`data/pokerogue-source.json`: o repositório do jogo, para estrutura, e
`pagefaultgames/pokerogue-locales`, para nomes — que são JSON puro, sem cadeia de import.

Os arquivos de dado são object literals com referências a enums. Com os aliases (`#enums/*`,
`#data/*`) mapeados no tsconfig do gerador, o `tsx` importa os módulos e lê estruturas reais,
com os enums já resolvidos em número. `tsx` não faz type check, então o `strict: false` do
upstream é irrelevante.

Isso **não vale para todos os arquivos**: `egg-moves.ts` importa só enums e resolve direto,
mas `balance/biomes/*.ts` importa `#data/terrain`, que arrasta `i18next`, `#app/messages` e
`#field/pokemon`, e quebra em Node. A saída é aliasar os módulos contaminados para stubs em
`tools/stubs/` — hoje **um só**, o `TerrainType`. AD-6 põe teto de cinco: passando disso, o
gerador troca importação por leitura de AST, para a gambiarra não crescer sem alguém decidir.

Ordenação determinística na emissão é o que faz AD-2 valer: sem ela, a ordem de `readdirSync`
variaria entre máquinas e o arquivo mudaria sem o dado ter mudado.

## Módulos

```
src/domain/            puro, testável, sem Phaser
  biome.ts       Encounter, encountersIn, destinationsFrom
  forms.ts       formsOf(formKeys): SpecialForm[]        ← mega, gmax, primal, eternamax
  team.ts        profileOf(members): TeamProfile          ← tipos presentes, espécies possuídas
  dossier.ts     dossierFor(facts, tables): Dossier
  advice.ts      biomeAdvice(destino, profile, tables): BiomeAdvice

src/game/              leitura do runtime, nada mais
  facts.ts       readRuntimeFacts(pokemon, biomeId)
  party.ts       readTeam(scene): TeamMember[]

src/render/            desenho, sem regra
  hub.ts         Hub: abas, linhas, abrir/fechar
  badge-layer.ts (+)  badge passa a aceitar clique

src/surfaces/
  battle-surface.ts   (+hub)
  starter-surface.ts  (+hub)
  biome-surface.ts    (novo)
```

### Contratos

```ts
// domain/biome.ts
interface Encounter { biome: number; rarity: number; timeOfDay: number }
type BiomeIndex = Record<number, readonly Encounter[]>;
type BiomeLinks = Record<number, readonly number[]>;
encountersIn(index: BiomeIndex, speciesId: number, biomeId: number | null): readonly Encounter[];
destinationsFrom(links: BiomeLinks, biomeId: number | null): readonly number[];

// domain/forms.ts
interface SpecialForm { key: string; label: string }
formsOf(formKeys: readonly string[]): readonly SpecialForm[];

// domain/team.ts
interface TeamMember { speciesId: number; types: readonly number[] }
interface TeamProfile { species: ReadonlySet<number>; types: ReadonlySet<number> }
profileOf(members: readonly TeamMember[]): TeamProfile;

// domain/advice.ts
interface BiomeAdvice {
  biome: number;
  byRarity: ReadonlyMap<number, readonly number[]>;
  newSpecies: readonly number[];
  missingTypes: readonly number[];
}
biomeAdvice(destination: number, profile: TeamProfile, tables: AdviceTables): BiomeAdvice;
```

`formsOf` filtra pelos valores do enum `SpeciesFormKey` e ignora formas comuns e regionais —
uma espécie sem forma especial devolve lista vazia, e a aba de formas nem é oferecida (AD-15).

`biomeAdvice` com time vazio devolve o conteúdo do bioma sem a parte comparativa. Não lança,
e não inventa recomendação — `missingTypes` é fato derivado (os 18 tipos menos os presentes no
time), não julgamento.

Cobertura de tipo aqui é **presença**, não eficácia: quais tipos o time tem, e quais não tem.
Tabela de efetividade e cálculo de dano são o slice C, e enfiá-los aqui seria escopo que
ninguém revisou.

## O hub

`Hub` é o único componente de UI novo. Ele tem uma badge dona (a que foi clicada), um conjunto
de abas e um corpo de linhas.

```ts
interface Tab { id: string; label: string; lines: readonly string[] }
class Hub {
  open(owner: DisplayContainer, tabs: readonly Tab[]): void;
  select(id: string): void;
  close(): void;
  get size(): number;
  get openFor(): DisplayContainer | null;
}
```

Regras que caem direto dos critérios:

- Fechado, `size === 0` e nenhum objeto existe na cena (AD-17).
- `select` troca só as linhas do corpo; os objetos das abas permanecem (AD-19).
- `open` para outro dono fecha o anterior — é o que dá AD-20 em batalha dupla sem código de
  coordenação entre badges.
- O hub é filho do container que o jogo desenha, como as badges. Posição, escala e
  visibilidade são herdadas, e é isso que faz AD-22 sair sem layout de mobile.

A badge vira interativa (`setInteractive` mais `pointerdown`), o que exige ampliar o shim em
`src/game/phaser.ts`. Nenhuma tecla nova é registrada — o overlay não disputa teclado com o
jogo, e o clique só é consumido quando cai sobre a badge (AD-18).

## Fluxo

```
tick → surface.matches ─┬→ readTargets → badgeSpecs → BadgeLayer.reconcile      (v2)
                        │
                        └→ onBadgeClick(target) → tabsFor(target, contexto) → Hub.open
```

`tabsFor` é onde cada surface difere, e é sempre uma função pura:

| Surface | Abas |
|---|---|
| batalha | Dossiê, Linha, Formas |
| starter | Dossiê, Linha, Formas |
| bioma | uma aba por destino do `biomeLinks` |

A interface `Surface` ganha só o repasse do clique. `Overlay.tick` não ganha ramificação: ele
já chama `sync` e `clear`, e `clear` passa a fechar o hub (AD-23).

## Teste

| Alvo | Como |
|---|---|
| `biome`, `forms`, `team`, `dossier`, `advice` | Vitest puro: fusão, forma regional, espécie sem egg move, espécie fora do bioma, bioma nulo, time vazio, espécie sem forma especial |
| `hub` | fake Phaser, padrão de `test/badge-layer.test.ts`: abrir, trocar aba sem recriar, abrir para outro dono fechando o anterior, `size === 0` após `close` |
| tabelas geradas | cardinalidade e formato, padrão de `test/tier-table-data.test.ts` |
| gerador | reprodutibilidade (AD-2) e falha explícita sem fonte (AD-3) |
| in-game | **screenshot obrigatória**, padrão V9 da v2 |

Sem screenshot, os critérios de tela não estão atendidos. Foi assim na v2 e continua sendo.

## Manutenção: o workflow de drift

O risco real não é técnico, é temporal — o PokéRogue atualiza e a tabela passa a mentir.
Mentir é pior que omitir, e o overlay já escolheu omitir (`?` do Smogon).

`.github/workflows/data-drift.yml`, semanal: roda o gerador contra a HEAD dos dois upstreams e
abre PR com tabelas e pins atualizados se houver diff. O PR passa pelo CI existente (AD-25).
Merge é decisão humana — o overlay não se atualiza sozinho a partir de código de terceiro.

## Arquivos afetados

| Arquivo | Mudança |
|---|---|
| `src/game/phaser.ts` | shim ganha `setInteractive` e `on('pointerdown')` |
| `src/game/pokerogue.ts` | tipa `catchRate`, `abilityHidden`, `type1/2`, `forms`, `arena.biomeType`, party |
| `src/render/badge-layer.ts` | `BadgeSpec` ganha `onClick` opcional |
| `src/surfaces/*.ts` | repasse do clique; `biome-surface.ts` é novo |
| `src/bootstrap.ts`, `src/main.ts` | montagem do hub e injeção das tabelas |
| `package.json` | script `build:data` |
| `tools/stubs/` | stub do `TerrainType` |
| `.github/workflows/` | `data-drift.yml` |
| `LICENSE`, `vite.config.ts`, `README.md` | AGPL-3.0-only e crédito às fontes (AD-9) |
