# Design — dossiê in-game

## Princípio herdado

A v2 separa domínio puro de render burro: `domain/` não conhece Phaser, `render/` não conhece
regra. Esta spec estende essa fronteira em vez de abrir exceção nela. `dossier.ts` é a peça
que sustenta o slice B (Ctrl+K) depois, sem reescrita — por isso ele recebe fatos já
extraídos, e não uma cena.

## O que foi verificado no jogo rodando

Antes de projetar, o jogo foi instrumentado em `pokerogue.net` com a mesma estratégia de
captura da v2 (hook em `Phaser.Scenes.Systems.prototype.step`). Quatro coisas mudaram o
desenho, e uma mudou o método.

**O objeto de espécie entrega mais do que a v2 usa.** `abilityHidden`, `catchRate`, `type1`,
`type2`, `baseStats`, `baseTotal`, `growthRate`, `legendary`, `category`, `forms`, além de
`getEvolutionLevels()`. O dossiê consome só `abilityHidden` e `catchRate`; o resto fica
anotado, porque escopo que ninguém pediu é escopo que ninguém revisa.

**`StarterSelectUiHandler.allSpecies` expõe as 572 espécies em runtime.** Não é usado nesta
spec — o dossiê descreve o alvo em batalha, que já vem pelo `getEnemyField()`. Fica
registrado porque é o caminho natural do slice B.

**`window.i18next` não existe.** Fecha a questão: nome de ability e de move só sai de tabela
gerada.

**A tela de starter já mostra Ability, Passive, Nature, Growth Rate, tipos e os slots de egg
move.** Um painel ali seria duplicação do jogo. Daí AD-25: a tela de starter não muda.

**O Browser pane do app não consegue rodar PokéRogue.** A página fica com
`document.hidden: true`, o `requestAnimationFrame` congela após poucos quadros e o Phaser
nunca termina o boot. Verificação exige Chrome headful — o que confirma `npm run launch`
como a ferramenta certa para as tarefas de tela.

## Por que hidratação híbrida, e não uma fonte só

O PokéRogue carrega tudo que precisamos no cliente, mas não entrega tudo pelo mesmo caminho.

`src/data/data-lists.ts` exporta `allAbilities`, `allMoves`, `catchableSpecies` e
`allBiomes`. São `const` de escopo de módulo, preenchidos no init. Não estão em `window`, e
num bundle minificado alcançá-los significaria depender de nomes manglados — que mudam a cada
build do jogo, silenciosamente. Caminho descartado.

Já o objeto que o overlay **já lê** carrega `catchRate` e `abilityHidden` diretamente. Ler
dali é grátis, reflete a versão exata que o jogador roda, e acompanha fusão e forma sem
código extra.

Daí a regra: **runtime quando o dado está no objeto que já lemos; tabela gerada só para o
resto.** Não é redundância — é reduzir ao mínimo o conjunto que pode ficar velho. Só o lado
gerado precisa do workflow de drift.

## Gerador de dados

`tools/build-pokerogue-data.mts`, irmão do `build-tier-table.mts` já existente.

### Duas fontes, não uma

Os dados estruturais estão no repositório do jogo; os **nomes** não. O texto exibido vem do
i18n, que vive em `pagefaultgames/pokerogue-locales` como JSON puro — sem cadeia de import
nenhuma. Nome não precisa de TypeScript, precisa de `JSON.parse`.

`data/pokerogue-source.json` pina os dois:

```json
{
  "pokerogue": { "repo": "pagefaultgames/pokerogue", "commit": "<sha>" },
  "locales": { "repo": "pagefaultgames/pokerogue-locales", "commit": "<sha>" }
}
```

Pin explícito é o que faz AD-2 (reprodutibilidade) valer e o que dá ao workflow semanal algo
concreto para comparar. Falha de resolução aborta o gerador (AD-3): tabela parcial mentiria
para o jogador, e o overlay tem o princípio de nunca inventar dado.

### Importar os dados estruturais, e os stubs que isso exige

Os arquivos de dado do PokéRogue são object literals TypeScript com referências a enums
(`SpeciesId.STARYU`, `BiomePoolTier.COMMON`, `TimeOfDay.NIGHT`). Com os path aliases
(`#enums/...`, `#data/...`) mapeados no tsconfig do gerador, o `tsx` importa os módulos e o
gerador lê estruturas reais, com os enums já resolvidos em número. `tsx` não faz type check,
então o `strict: false` do upstream é irrelevante aqui.

Só que isso **não vale para todos os arquivos**. `egg-moves.ts` importa apenas
`#enums/move-id` e `#enums/species-id` — limpo. Já `balance/biomes/*.ts` importa
`#data/terrain`, que importa `i18next`, `#app/messages` e `#field/pokemon`, arrastando Phaser
por transitividade e quebrando em Node.

A saída é aliasar os poucos módulos contaminados para stubs locais em `tools/stubs/`, que
reexportam só o enum de que os dados precisam. A lista fica declarada em um lugar só, e AD-22
põe um teto nela: passou de cinco entradas, o gerador troca importação por leitura de AST.

### Tabelas emitidas

| Arquivo | Forma | Origem upstream |
|---|---|---|
| `data/egg-moves.generated.ts` | `Record<number, readonly number[]>` | `pokerogue`: `src/data/balance/moves/egg-moves.ts` |
| `data/biome-index.generated.ts` | `Record<number, readonly Encounter[]>` | `pokerogue`: `src/data/balance/biomes/*.ts` |
| `data/names.generated.ts` | `ABILITY_NAMES`, `MOVE_NAMES`, `BIOME_NAMES`: `Record<number, string>` | `locales`: `en/ability.json`, `en/move.json`, `en/biomes.json` |

IDs numéricos como chave mantêm o bundle pequeno: cada nome aparece uma vez, na tabela de
nomes, em vez de repetido em cada entrada de espécie.

As tabelas de nome são filtradas (AD-21): entram só os nomes referenciados — as hidden
abilities que existem, os moves que são egg move, os ~30 biomas.

O índice de biomas é **invertido** na geração. O upstream é organizado por bioma
(`beach.ts` lista quem aparece na praia); a pergunta é a oposta. Inverter uma vez em build
time evita varrer 30 pools a cada frame. O índice fica plano — espécie → todas as ocorrências
— e o filtro pelo bioma atual acontece na consulta. Plano é mais simples de testar, e é a
forma que o slice B vai querer para listar todos os biomas.

Estimativa, e o build é `minify: false` — o número é do arquivo como distribuído:

| | |
|---|---|
| bundle atual | 99 KB |
| egg moves + índice de biomas + nomes filtrados | ~90–120 KB |
| **total esperado** | **~190–220 KB**, contra o teto de 500 KB de AD-6 |

## Módulos novos

```
src/domain/
  biome.ts      Encounter, encountersIn(index, speciesId, biomeId)
  dossier.ts    dossierFor(facts, tables): Dossier              ← puro, testável

src/game/
  pokerogue.ts  (+)  tipa catchRate e abilityHidden em PokeRogueSpecies
  facts.ts      readRuntimeFacts(pokemon, biomeId): RuntimeFacts
  focus.ts      FocusCycle: nenhum → alvo 0 → alvo 1 → nenhum
  keys.ts       binding da tecla, com repasse do evento ao jogo

src/render/
  panel.ts      container Phaser: backdrop + linhas. Sem regra de negócio.
```

A tela de starter não aparece nesta lista, e é de propósito (AD-25).

### Contratos

```ts
// domain/biome.ts
interface Encounter {
  biome: number;      // BiomeId
  rarity: number;     // BiomePoolTier: COMMON..ULTRA_RARE, BOSS
  timeOfDay: number;  // TimeOfDay
}

// game/facts.ts — tudo que vem do runtime, e nada além
interface RuntimeFacts {
  name: string;                    // "Ralts" ou "Ralts/Gyarados"
  primary: SpeciesRef;
  fusion: SpeciesRef | null;
  catchRate: number | null;
  hiddenAbilityId: number | null;
  biomeId: number | null;          // null quando o bioma não pôde ser lido (AD-24)
}

// domain/dossier.ts — puro
interface Dossier {
  name: string;
  tiers: ResolvedTiers;                  // reusa domain/tier-table.ts
  hiddenAbility: string | null;
  eggMoves: readonly string[];
  encounters: readonly Encounter[];      // já filtradas pelo bioma atual
  catchRate: number | null;
}
```

`dossierFor` não lança e não consulta nada externo: campo sem dado vem `null` ou vazio, e é o
`panel.ts` que decide não desenhar a linha (AD-8). Regra de fusão em AD-9: tier resolvido
entre as duas linhas como a v2 já faz, campos factuais da espécie primária.

Hora do dia só é exibida quando a ocorrência é restrita a um período — se a espécie aparece
em `TimeOfDay.ALL`, a linha mostra só a raridade. Assim o painel não depende de ler a hora do
jogo, que é dado que nada garante estar acessível.

## O bioma atual

`scene.arena.biomeType` é enum numérico e é a fonte. `window.gameInfo` também expõe o bioma,
mas como string de exibição e sob um `gameInfoVersion` próprio — contrato mais frágil, e
exigiria casar texto traduzido com id. Foi o `gameInfo` que revelou que o dado existia; o
`arena.biomeType` é por onde ele entra.

Bioma ilegível não é erro: a linha de raridade some e o resto do painel continua (AD-24).

## Fluxo

```
tick → BattleSurface.matches ─┬→ readBattleTargets → badgeSpecsFor → BadgeLayer.reconcile  (existente)
                              │
                              └→ focus.current → readRuntimeFacts
                                               → dossierFor(facts, tables)
                                               → Panel.render
```

O painel entra como segundo consumidor dos mesmos alvos, e só na `BattleSurface`. A interface
`Surface` **não muda** — `StarterSurface` não conhece foco nem painel, e não deve conhecer.

`Panel` segue a disciplina do `BadgeLayer`: reconcilia texto e posição, não destrói e recria
por frame. Fechado, `clear()` deixa `size === 0` (AD-11).

O painel é filho do container que o jogo desenha, como as badges. Posição, escala e
visibilidade são herdadas — é o que faz AD-16 (celular) sair sem código de layout próprio.

## A tecla

`keys.ts` registra o handler e **repassa** o evento ao jogo quando o painel não deve reagir
(diálogo aberto, sem alvo). O overlay nunca consome input que o jogo esperava.

Qual tecla satisfaz AD-12 é resultado de verificação em jogo (tarefa A5), não de suposição.
Já se observou na tela de starter que `C`, `G`, `N` e `U` estão ocupadas, além de setas,
Enter e Esc — escolher `Tab` no papel é o tipo de decisão que falha em produção.

## Manutenção: o workflow de drift

O risco real desta spec não é técnico, é temporal — o PokéRogue atualiza e a tabela gerada
passa a mentir. Mentir é pior que omitir, e o overlay já escolheu omitir (`?` do Smogon).

`.github/workflows/data-drift.yml`, semanal: roda o gerador contra a HEAD dos dois upstreams,
compara com as tabelas versionadas e, havendo diff, abre PR com as tabelas novas e os pins
atualizados. O PR passa pelo CI existente antes de ser mergeável (AD-19). Merge é decisão
humana — o overlay não se atualiza sozinho a partir de código de terceiro.

## Teste

| Alvo | Como |
|---|---|
| `biome.ts`, `dossier.ts` | Vitest puro: fusão, forma regional, espécie sem egg move, espécie ausente do bioma atual, bioma nulo, HA ausente |
| `panel.ts` | fake Phaser, no padrão de `test/badge-layer.test.ts`: criação, atualização, remoção, `size === 0` após `clear` |
| `focus.ts` | ciclo com 1 e 2 alvos, e alvo removido no meio do ciclo |
| tabelas geradas | cardinalidade e formato de chave, no padrão de `test/tier-table-data.test.ts` |
| gerador | reprodutibilidade (AD-2) e falha explícita sem fonte (AD-3) |
| in-game | **screenshot obrigatória**, padrão V9 da v2: painel em batalha simples e dupla sem cobrir HUD, em viewport de celular, tecla livre, e a tela de starter inalterada |

Sem screenshot, os critérios de tela não estão atendidos. Foi assim na v2 e continua sendo.

## Arquivos afetados

| Arquivo | Mudança |
|---|---|
| `src/game/pokerogue.ts` | tipa `catchRate` e `abilityHidden` em `PokeRogueSpecies`, e `biomeType` em `arena` |
| `src/surfaces/battle-surface.ts` | segundo consumidor dos alvos: `Panel.render` / `Panel.clear` |
| `src/bootstrap.ts` | monta `Panel`, `FocusCycle` e o binding de tecla na `BattleSurface` |
| `src/main.ts` | injeta as tabelas novas |
| `package.json` | script `build:data` |
| `tools/stubs/` | stubs dos módulos upstream contaminados por `i18next`/Phaser |
| `.github/workflows/` | `data-drift.yml` |
| `LICENSE` | MIT → AGPL-3.0-only (AD-23) |
| `vite.config.ts` | campo `license` do bloco de metadados acompanha |
| `README.md` | painel, tecla, origem dos dados e crédito aos repositórios AGPL |

`src/surfaces/starter-surface.ts` e `src/surfaces/surface.ts` **não** aparecem aqui (AD-25).
