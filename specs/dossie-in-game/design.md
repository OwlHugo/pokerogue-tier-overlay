# Design — dossiê in-game

## Princípio herdado

A v2 separa domínio puro de render burro: `domain/` não conhece Phaser, `render/` não conhece
regra. Esta spec estende essa fronteira em vez de abrir exceção nela. `dossier.ts` é a peça
que sustenta o slice B (Ctrl+K) depois, sem reescrita — por isso ele recebe fatos já
extraídos, e não uma cena.

## Por que hidratação híbrida, e não uma fonte só

O PokéRogue carrega tudo que precisamos no cliente, mas não entrega tudo pelo mesmo caminho.

`src/data/data-lists.ts` exporta `allAbilities`, `allMoves`, `catchableSpecies` e
`allBiomes`. São `const` de escopo de módulo, preenchidos no init do jogo. Não estão em
`window`, e num bundle minificado alcançá-los significaria depender de nomes manglados —
que mudam a cada build do jogo, silenciosamente. Esse caminho está descartado.

Já o objeto que o overlay **já lê** hoje (`pokemon.species`) carrega `catchRate` e
`abilityHidden` diretamente. Ler dali é grátis, reflete a versão exata que o
jogador está rodando, e acompanha fusão e forma sem código extra.

Daí a regra: **runtime quando o dado está no objeto que já lemos; tabela gerada só para o
resto.** Não é redundância — é reduzir ao mínimo o conjunto de dados que pode ficar velho.
Só o lado gerado precisa do workflow de drift.

## Gerador de dados

`tools/build-pokerogue-data.mts`, irmão do `build-tier-table.mts` já existente.

### Duas fontes, não uma

Os dados estruturais estão no repositório do jogo; os **nomes** não. `allAbilities` e
`allMoves` são module-scope, e o texto exibido vem do i18n, que vive em outro repositório
(`pagefaultgames/pokerogue-locales`) como JSON puro — sem cadeia de import nenhuma. Nome não
precisa de TypeScript, precisa de `JSON.parse`.

`data/pokerogue-source.json` pina os dois:

```json
{
  "pokerogue": { "repo": "pagefaultgames/pokerogue", "commit": "<sha>" },
  "locales": { "repo": "pagefaultgames/pokerogue-locales", "commit": "<sha>" }
}
```

Pin explícito é o que faz AD-2 (reprodutibilidade) valer e o que dá ao workflow semanal algo
concreto para comparar e atualizar. Falha de resolução aborta o gerador (AD-3): tabela
parcial mentiria para o jogador, e o overlay tem o princípio de nunca inventar dado.

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
O teto existe para que a gambiarra não cresça sem alguém decidir que ela cresceu.

### Tabelas emitidas

| Arquivo | Forma | Origem upstream |
|---|---|---|
| `data/egg-moves.generated.ts` | `Record<number, readonly number[]>` | `pokerogue`: `src/data/balance/moves/egg-moves.ts` |
| `data/biome-index.generated.ts` | `Record<number, readonly Encounter[]>` | `pokerogue`: `src/data/balance/biomes/*.ts` |
| `data/names.generated.ts` | `ABILITY_NAMES`, `MOVE_NAMES`, `BIOME_NAMES`: `Record<number, string>` | `locales`: `en/ability.json`, `en/move.json`, `en/biomes.json` |

IDs numéricos como chave mantêm o bundle pequeno: cada nome aparece uma vez, na tabela de
nomes, em vez de repetido em cada entrada de espécie.

As tabelas de nome são filtradas (AD-21): entram só os nomes referenciados — as hidden
abilities que existem, os moves que são egg move, os ~30 biomas. `move.json` tem 179 KB e
usaríamos uma fração dele.

Estimativa, e o build é `minify: false` — o número é do arquivo como distribuído:

| | |
|---|---|
| bundle atual | 99 KB |
| egg moves + índice de biomas + nomes filtrados | ~90–120 KB |
| **total esperado** | **~190–220 KB**, contra o teto de 500 KB de AD-6 |

O índice de biomas é **invertido** na geração. O upstream é organizado por bioma
(`beach.ts` lista quem aparece na praia); a pergunta do jogador é a oposta ("onde acho este
Pokémon?"). Inverter uma vez em build time evita varrer 30 pools a cada frame.

## Módulos novos

```
src/domain/
  biome.ts      Encounter, BiomeIndex, encountersOf(index, speciesId)
  dossier.ts    dossierFor(facts, tables): Dossier

src/game/
  facts.ts      readRuntimeFacts(pokemon | starterContainer): RuntimeFacts
  focus.ts      FocusCycle: nenhum → alvo 0 → alvo 1 → nenhum
  keys.ts       binding da tecla, com guarda de conflito

src/render/
  panel.ts      Panel.render(dossier) / Panel.clear() / Panel.size
```

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
}

// domain/dossier.ts — puro
interface Dossier {
  name: string;
  tiers: ResolvedTiers;                  // reusa domain/tier-table.ts
  hiddenAbility: string | null;
  eggMoves: readonly string[];
  encounters: readonly Encounter[];
  catchRate: number | null;
}
```

`dossierFor` não lança e não consulta nada externo: campo sem dado vem `null` ou vazio, e é
o `panel.ts` que decide não desenhar a linha (AD-8). Regra de fusão em AD-9: tier resolvido
entre as duas linhas como a v2 já faz, campos factuais da espécie primária — que é o que o
runtime entrega.

## Fluxo

```
tick → surface.match → readTargets ─┬→ badgeSpecsFor → BadgeLayer.reconcile   (existente)
                                    │
                                    └→ focus.current → readRuntimeFacts
                                                     → dossierFor(facts, tables)
                                                     → Panel.render
```

O painel entra como um segundo consumidor dos mesmos alvos. `Surface` ganha `focusedTarget`;
`BattleSurface` resolve pelo `FocusCycle`, `StarterSurface` pelo cursor que o próprio jogo
mantém. `Overlay.tick` não ganha ramificação nova: chama `Panel.render` ou `Panel.clear`
pelo mesmo critério que já usa para as badges.

`Panel` segue a disciplina do `BadgeLayer`: reconcilia texto e posição, não destrói e recria
por frame. Fechado, `clear()` deixa `size === 0` (AD-11).

O painel é filho do container que o jogo desenha, como as badges. Posição, escala e
visibilidade são herdadas — é o que faz AD-16 (celular) sair sem código de layout próprio.

## A tecla

`keys.ts` registra o handler e **repassa** o evento ao jogo quando o painel não deve reagir
(diálogo aberto, tela sem alvo). O overlay nunca consome input que o jogo esperava.

Qual tecla satisfaz AD-12 é resultado de verificação em jogo (tarefa A6), não de suposição:
o PokéRogue usa o teclado para jogar, e escolher `Tab` no papel é o tipo de decisão que
falha em produção. A tarefa entrega a tecla e a evidência de que ela está livre nas duas
telas.

## Manutenção: o workflow de drift

O risco real desta spec não é técnico, é temporal — o PokéRogue atualiza e a tabela gerada
passa a mentir. Mentir é pior que omitir, e o overlay já escolheu omitir (`?` do Smogon).

`.github/workflows/data-drift.yml`, agendado semanalmente: roda o gerador contra a HEAD do
upstream, compara com as tabelas versionadas e, havendo diff, abre PR com as tabelas novas e
o pin atualizado. O PR passa pelo CI existente antes de ser mergeável (AD-19). Merge é
decisão humana — o overlay não se atualiza sozinho a partir de código de terceiro.

## Teste

| Alvo | Como |
|---|---|
| `biome.ts`, `dossier.ts` | Vitest puro: fusão, forma regional, espécie sem egg move, espécie em 0 e em N biomas, HA ausente |
| `panel.ts` | fake Phaser, no padrão de `test/badge-layer.test.ts`: criação, atualização, remoção, `size === 0` após `clear` |
| `focus.ts` | ciclo com 1 e 2 alvos, e alvo removido no meio do ciclo |
| tabelas geradas | cardinalidade e formato de chave, no padrão de `test/tier-table-data.test.ts` |
| gerador | reprodutibilidade (AD-2) e falha explícita sem fonte (AD-3) |
| in-game | **screenshot obrigatória**, padrão V9 da v2: painel em batalha simples e dupla sem cobrir HUD, na grade de starter, em viewport de celular, e a tecla livre |

Sem screenshot, os critérios de tela não estão atendidos. Foi assim na v2 e continua sendo.

## Arquivos afetados

| Arquivo | Mudança |
|---|---|
| `src/game/pokerogue.ts` | tipa `catchRate` e `abilityHidden` em `PokeRogueSpecies` |
| `src/surfaces/surface.ts` | `Surface` passa a expor `focusedTarget` |
| `src/surfaces/battle-surface.ts` | resolve foco pelo `FocusCycle` |
| `src/surfaces/starter-surface.ts` | resolve foco pelo cursor do jogo |
| `src/overlay.ts` | segundo consumidor dos alvos: `Panel.render` / `Panel.clear` |
| `src/main.ts` | injeta as tabelas novas |
| `package.json` | script `build:data` |
| `tools/stubs/` | stubs dos módulos upstream contaminados por `i18next`/Phaser |
| `.github/workflows/` | `data-drift.yml` |
| `LICENSE` | MIT → AGPL-3.0-only (AD-23) |
| `vite.config.ts` | campo `license` do bloco de metadados acompanha |
| `README.md` | painel, tecla, origem dos dados e crédito aos repositórios AGPL |
