# Design — v2: userscript publicável

## Reconhecimento adicional (verificado em produção, 2026-07-26)

Além do que a spec v1 já registrou:

| Fato | Valor |
|---|---|
| `scene.ui.handlers` | 48 handlers, **nomes de classe preservados** (`StarterSelectUiHandler`, `PokedexUiHandler`, `TitleUiHandler`) |
| `scene.ui.mode` | índice numérico dentro de `handlers`; `handlers[mode]` é o handler ativo |
| `StarterSelectUiHandler.starterContainers` | 572 containers, cada um com `species`, `icon`, `cost`, `label`, `x/y`, `visible` |
| `filteredStarterContainers` | subconjunto após os filtros da barra superior |
| Adicionar objeto Phaser em runtime | funciona: `scene.add.text(...)` com `setDepth` renderiza dentro do canvas, com a fonte `emerald` do jogo |
| `@grant none` (Tampermonkey) | roda no contexto real da página — requisito do hook |
| `@run-at document-start` | **não é determinístico** (issue conhecido do Tampermonkey) |

Duas consequências que definem a arquitetura da v2:

**1. O renderer deixa de ser DOM e passa a ser Phaser.** A grade de starter tem 572
containers; espelhar isso em DOM exigiria converter coordenadas, reagir a scroll, a filtro e
a resize, e manter centenas de nós sincronizados. Anexando um objeto Phaser *dentro* do
container do jogo, posição, escala, rolagem e visibilidade passam a ser herdadas de graça —
o problema de sincronização deixa de existir em vez de ser resolvido.

**2. A captura do jogo precisa de duas estratégias.** O `document-start` do Tampermonkey não
garante execução antes do bundle. Ambas as estratégias abaixo foram executadas com sucesso
em produção nesta sessão, em momentos diferentes do ciclo de vida da página.

## Estrutura

```
src/
  domain/
    tier.ts               Tier, TIER_ORDER, compareTier, bestOf
    species-key.ts        SpeciesKey, keyFor
    tier-table.ts         TierTable, lookup, resolveBest
  game/
    capture.ts            captureGame
    strategies.ts         interceptPhaserAssignment, patchSceneSystemsStep
    context.ts            GameContext, activeHandlerName
    battle.ts             readBattleTargets
    starter.ts            readStarterTargets
  render/
    palette.ts            colorFor
    badge-layer.ts        BadgeLayer
  surfaces/
    surface.ts            Surface
    battle-surface.ts     BattleSurface
    starter-surface.ts    StarterSurface
  overlay.ts              Overlay
  main.ts
data/
  tier-table.generated.ts
tools/
  build-tier-table.mts
  dev-launch.mts
test/
```

## Abstrações

### `Surface` — uma tela marcável

```ts
export interface Surface {
  readonly name: string;
  matches(context: GameContext): boolean;
  sync(context: GameContext): void;
  clear(): void;
}
```

O `Overlay` não conhece batalha nem starter select. Ele itera uma lista de surfaces,
pergunta a cada uma se a tela atual é a sua, sincroniza a que responder sim e limpa as que
deixaram de responder. Suportar uma tela nova é acrescentar um item à lista — o loop não
muda.

```ts
class Overlay {
  private active = new Set<Surface>();
  tick(): void {
    const context = this.readContext();
    for (const surface of this.surfaces) {
      if (surface.matches(context)) {
        surface.sync(context);
        this.active.add(surface);
      } else if (this.active.delete(surface)) {
        surface.clear();
      }
    }
  }
}
```

### `BadgeLayer` — reconciliação de badges

O ponto onde v1 teria acumulado bugs: criar, mover e destruir marcações conforme o jogo
muda. Em vez de espalhar isso por cada tela, uma única camada reconcilia uma lista desejada
contra o que existe, por chave.

```ts
export interface BadgeSpec {
  key: string;
  text: string;
  tier: Tier | null;
  parent: Phaser.GameObjects.Container;
  offset: { x: number; y: number };
  scale: number;
}

export class BadgeLayer {
  reconcile(specs: BadgeSpec[]): void;
  clear(): void;
  get size(): number;
}
```

`reconcile` cria o que falta, atualiza o que mudou, destrói o que sumiu. `size` existe para
o teste de vazamento (CA-19) poder afirmar que a contagem volta a zero.

Como cada badge é filha do container do jogo (`parent.add(badge)`), ela herda posição,
escala, rolagem e visibilidade. É por isso que CA-12 e CA-15 não têm código próprio: não há
nada para sincronizar.

### Captura em duas estratégias

```ts
export type CaptureStrategy = {
  readonly name: string;
  attempt(onCaptured: (game: Phaser.Game) => void): void;
};
```

- `interceptPhaserAssignment` — define um setter em `window.Phaser` e patcheia
  `Game.prototype.boot`. Só funciona se o script chegou antes do bundle.
- `patchSceneSystemsStep` — se `window.Phaser` já existe, patcheia
  `Phaser.Scenes.Systems.prototype.step`, que roda todo frame em toda scene, e captura
  `this.game` na primeira chamada, restaurando o método original em seguida.

`captureGame` dispara as duas e resolve na primeira que vencer, registrando qual foi. O
diagnóstico de CA-9 nomeia as estratégias tentadas.

### Leitura de alvos

Cada tela expõe uma função pura que traduz estado do jogo para uma lista neutra:

```ts
export interface Target {
  key: string;
  speciesId: number;
  formKey: string;
  name: string;
  fusion: { speciesId: number; formKey: string; name: string } | null;
  parent: Phaser.GameObjects.Container;
  offset: { x: number; y: number };
}
```

`readBattleTargets` percorre `scene.getEnemyField()`; `readStarterTargets` percorre
`handler.starterContainers` filtrando por `visible`. Ambas devolvem `Target[]`, então as
surfaces compartilham todo o caminho seguinte: resolver tier → montar `BadgeSpec` →
`reconcile`.

## Contratos do domínio

```ts
type Tier = 'AG' | 'Uber' | 'OU' | 'UUBL' | 'UU' | 'RUBL' | 'RU'
          | 'NUBL' | 'NU' | 'PUBL' | 'PU' | 'ZUBL' | 'ZU' | 'NFE' | 'LC';

interface TierEntry { tier: Tier | null; bestTier: Tier | null; bestName: string | null; line: string[] }
type TierTable = Record<SpeciesKey, TierEntry>;

compareTier(a: Tier | null, b: Tier | null): number;
bestOf(tiers: ReadonlyArray<Tier | null>): Tier | null;
resolveBest(table: TierTable, target: Target): { tier: Tier | null; best: Tier | null; bestName: string | null };
```

A tabela deixa de ser JSON lido em runtime e passa a ser `data/tier-table.generated.ts`,
importado pelo bundle — atende CA-2 (arquivo único, sem fetch) e dá tipagem à tabela.

## Estilo de código

Sem comentários, por decisão do autor. O que a v1 explicava em comentário passa a viver em
três lugares: nomes (`interceptPhaserAssignment` em vez de `patch` com comentário
explicando), tipos (`Tier` como união literal em vez de `string`), e este documento mais o
README para o que é contexto e não cabe em código — por que o hook existe, por que há duas
estratégias, por que `speciesId` e não nome.

Isso tem um custo real e vale registrar: quem abrir `strategies.ts` sem ler esta spec não
vai descobrir sozinho que a segunda estratégia existe por causa de um bug de timing do
Tampermonkey. A mitigação é o README apontar para cá.

## Ferramentas

| Ferramenta | Papel |
|---|---|
| TypeScript strict | contratos acima |
| Vite + `vite-plugin-monkey` | build do `.user.js`, metadados, dev server |
| Vitest | testes |
| Biome | lint e format |
| Puppeteer | `tools/dev-launch.mts` — abre o jogo com o bundle injetado |
| GitHub Actions | CI |

## Testes

Puros, sem browser:

- `domain/` — ordenação, `bestOf`, fusão, espécie desconhecida.
- `badge-layer` — reconciliação com fakes de Phaser: cria o que falta, atualiza o existente,
  destrói o removido, `size` volta a zero após `clear` (CA-19).
- `readBattleTargets` / `readStarterTargets` — fakes no shape capturado em produção,
  incluindo `currentBattle: null`, batalha dupla, fusão, e grade de starter com containers
  invisíveis.
- `Overlay.tick` — com surfaces falsas: só a que dá match sincroniza; a que deixou de dar
  match recebe `clear` exatamente uma vez.

Verificação em jogo real, via `tools/dev-launch.mts` e screenshot: badge sobre o sprite em
batalha, marcações na grade de starter, e captura pela estratégia 2 (injetando o bundle
depois do jogo carregado).

**Limite honesto:** injetar o bundle por Puppeteer reproduz o ambiente de `@grant none`, mas
não é o Tampermonkey. A instalação real no Tampermonkey/Violentmonkey precisa ser conferida
por você antes de publicar — eu não consigo instalar a extensão nem validar o timing real de
`document-start` daqui.

**Armadilha de verificação, descoberta na marra:** o PokéRogue mantém **uma sessão por
conta**. Abrir o jogo logado em mais de uma janela derruba as outras: o jogo continua com
`Phaser` carregado e o handler correto em `ui.mode`, mas a scene nunca monta a grade e o
canvas fica preto. Isso imita perfeitamente um bug do overlay — `starterContainers` com 572
itens e nenhum `visible`. Toda verificação em jogo real precisa de **uma única sessão ativa**,
senão o resultado é ruído.

## Migração da v1

- `src/overlay.js`, `src/launch.mjs`, `src/tier-rank.mjs`, `src/evo-line.mjs` saem.
- `scripts/build-tiers.mjs` vira `tools/build-tier-table.mts`, emitindo `.ts` em vez de JSON.
- A lógica de linha evolutiva é preservada: já é correta e coberta por testes.
- O launcher Puppeteer sobrevive como ferramenta de desenvolvimento, não como produto.
