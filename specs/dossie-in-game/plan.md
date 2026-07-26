# Plano de implementação — delta sobre o HUD existente

> **Para quem for executar:** siga tarefa por tarefa, na ordem. Cada passo é uma ação de 2 a 5
> minutos.

## Este plano não é greenfield

O repositório **já implementa** a maior parte do que a spec pede. Commits `7f8f6a5`,
`b584133` e `17fe810` entregaram:

| Já existe | Onde |
|---|---|
| Pílula clicável que abre painel com abas | `src/hud/panel.ts` (DOM sobre o canvas) |
| Abas de campo, time e bioma | `src/hud/panel.ts`, `src/hud/views.ts` |
| Mega e Gigantamax no alcance de tier | `src/domain/reachable.ts`, `tools/unlocked-forms.mts` |
| Pools de espécie por bioma | `src/domain/biome.ts`, `data/biome-table.generated.ts` |
| Badges de tier em batalha e starter | herdado da v2 |

Estado verificado: **109 testes passando, `tsc --noEmit` limpo**.

O painel é **DOM posicionado sobre o canvas**, não objetos Phaser. Isso contraria a decisão da
v2 ("as badges são objetos Phaser, não elementos HTML"), e a divergência é defensável: a v2
sincronizava 572 badges minúsculas herdando transformação do container, enquanto o painel é um
retângulo só, ancorado por `getBoundingClientRect`. O custo do DOM aqui é um `placeAt` por
tick; o custo de fazer uma lista rolável de 40 linhas em objetos Phaser seria muito maior.
**A decisão fica registrada como consciente, e as badges continuam Phaser.**

Este plano cobre só o que falta.

**Objetivo do delta:** tornar o dado reprodutível e auditável, resolver a exposição de licença
que já está no ar, e fechar as lacunas de conteúdo — egg moves, hidden ability, catch rate,
escolha de mapa e cobertura de tipos.

## Restrições globais

- `npm run typecheck` roda com `strict`, `noUncheckedIndexedAccess`,
  `exactOptionalPropertyTypes` e `verbatimModuleSyntax`.
- `npm run lint` é Biome; rode `npm run format` antes de commitar.
- **Nenhum comentário no código.** Decisão explícita do autor.
- Nomes de teste em português, no estilo dos existentes.
- Sem fallback, sem camada de compatibilidade, sem `try/catch` sem recuperação real.
- A suíte tem que continuar em 109 testes ou mais, sempre verde.

---

## Task B1: Relicenciar para AGPL-3.0-only

**Por que primeiro:** `data/biome-table.generated.ts` já é derivado de
`pagefaultgames/pokerogue`, que é **AGPL-3.0-only**, e o projeto se distribui como MIT. Isso
não é risco futuro — está no repositório agora. As outras tarefas ampliam o dado derivado, e
ampliar antes de resolver seria aumentar a exposição de propósito.

**Arquivos:** modificar `LICENSE`, `package.json`, `vite.config.ts`, `README.md`.

- [ ] **Passo 1: Trocar o texto da licença**

```bash
curl -sS https://www.gnu.org/licenses/agpl-3.0.txt -o LICENSE && head -3 LICENSE
```

Esperado: `GNU AFFERO GENERAL PUBLIC LICENSE`.

- [ ] **Passo 2: Acompanhar nos metadados**

Em `package.json`, troque `"license": "MIT"` por `"license": "AGPL-3.0-only"`.
Em `vite.config.ts`, dentro de `userscript`, troque `license: 'MIT'` por
`license: 'AGPL-3.0-only'`.

- [ ] **Passo 3: Creditar as fontes no README**

Acrescente:

```markdown
## De onde vêm os dados

Tiers do Smogon via [`@pkmn/dex`](https://github.com/pkmn/ps) (MIT).

Pools de bioma, egg moves e nomes exibidos são gerados de
[`pagefaultgames/pokerogue`](https://github.com/pagefaultgames/pokerogue) e
[`pagefaultgames/pokerogue-locales`](https://github.com/pagefaultgames/pokerogue-locales),
ambos AGPL-3.0-only. Por isso este projeto também é AGPL-3.0-only.

A fonte da verdade é o código do jogo, não a wiki nem o fórum: onde os dois divergirem, vale
o que efetivamente roda.
```

- [ ] **Passo 4: Verificar e commitar**

```bash
npm run build && grep -c "AGPL" dist/pokerogue-tier-overlay.meta.js
```

Esperado: pelo menos `1`.

```bash
git add LICENSE package.json vite.config.ts README.md
git commit -m "docs: relicencia para AGPL-3.0-only e credita as fontes upstream"
```

---

## Task B2: Pinar as fontes e tornar o gerador reprodutível

`tools/build-biomes.mts` hoje faz `fetch` em
`raw.githubusercontent.com/pagefaultgames/pokerogue/beta` e extrai os dados com expressões
regulares. Dois problemas: `beta` é alvo móvel, então a tabela muda sem ninguém decidir; e
regex sobre TypeScript quebra em silêncio quando o upstream reformata.

A troca é importar os módulos de verdade a partir de um commit pinado. Verificado: os arquivos
de bioma são object literals com referências a enums, e o único import que arrasta `i18next` e
Phaser por transitividade é `#data/terrain`, que precisa de um stub.

**Arquivos:** criar `data/pokerogue-source.json`, `tools/upstream.mts`, `tools/stubs/terrain.ts`,
`tools/pokerogue.tsconfig.json`, `test/upstream.test.ts`; reescrever `tools/build-biomes.mts`;
modificar `package.json`, `.gitignore`.

**Interfaces:** produz `parsePins(raw): Pins`, `readPins(): Pins`,
`fetchUpstream(name, pin, sparse): string`. `Pin = { repo: string; commit: string }`,
`Pins = { pokerogue: Pin; locales: Pin }`.

- [ ] **Passo 1: Escrever o teste que falha**

`test/upstream.test.ts`:

```ts
import { describe, expect, test } from 'vitest';
import { parsePins } from '../tools/upstream.mts';

describe('pins do upstream', () => {
  test('aceita os dois repositorios com commit', () => {
    const pins = parsePins(
      '{"pokerogue":{"repo":"a/b","commit":"abc"},"locales":{"repo":"c/d","commit":"def"}}',
    );
    expect(pins.pokerogue.commit).toBe('abc');
    expect(pins.locales.repo).toBe('c/d');
  });

  test('recusa pin sem commit em vez de seguir com fonte indefinida', () => {
    expect(() =>
      parsePins('{"pokerogue":{"repo":"a/b"},"locales":{"repo":"c/d","commit":"x"}}'),
    ).toThrow(/pokerogue/);
  });

  test('recusa arquivo sem um dos repositorios', () => {
    expect(() => parsePins('{"pokerogue":{"repo":"a/b","commit":"abc"}}')).toThrow(/locales/);
  });
});
```

- [ ] **Passo 2: Rodar e confirmar que falha**

```bash
npx vitest run test/upstream.test.ts
```

Esperado: FAIL, `Failed to resolve import "../tools/upstream.mts"`.

- [ ] **Passo 3: Escrever `tools/upstream.mts`**

```ts
import { execFileSync } from 'node:child_process';
import { mkdirSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

export interface Pin {
  repo: string;
  commit: string;
}

export interface Pins {
  pokerogue: Pin;
  locales: Pin;
}

const NAMES = ['pokerogue', 'locales'] as const;

export function parsePins(raw: string): Pins {
  const parsed = JSON.parse(raw) as Partial<Record<string, Partial<Pin>>>;

  for (const name of NAMES) {
    const pin = parsed[name];
    if (!pin?.repo || !pin?.commit) {
      throw new Error(`pokerogue-source.json: pin invalido para ${name}`);
    }
  }

  return parsed as Pins;
}

export function readPins(): Pins {
  return parsePins(readFileSync(new URL('../data/pokerogue-source.json', import.meta.url), 'utf8'));
}

export function fetchUpstream(name: string, pin: Pin, sparse: readonly string[]): string {
  const dir = fileURLToPath(new URL(`../.upstream/${name}/`, import.meta.url));
  mkdirSync(dir, { recursive: true });

  const git = (...args: string[]): void => {
    execFileSync('git', args, { cwd: dir, stdio: ['ignore', 'ignore', 'pipe'] });
  };

  git('init', '--quiet');
  execFileSync('git', ['remote', 'remove', 'origin'], { cwd: dir, stdio: 'ignore' });
  git('remote', 'add', 'origin', `https://github.com/${pin.repo}.git`);
  git('sparse-checkout', 'init', '--cone');
  git('sparse-checkout', 'set', ...sparse);
  git('fetch', '--quiet', '--depth', '1', '--filter=blob:none', 'origin', pin.commit);
  git('checkout', '--quiet', '--force', pin.commit);

  return dir;
}
```

`execFileSync` lança quando o `git` sai com código diferente de zero. Pin inválido, rede
ausente ou repositório errado abortam ali, sem `try/catch` e sem tabela parcial.

- [ ] **Passo 4: Rodar e confirmar que passa**

```bash
npx vitest run test/upstream.test.ts
```

Esperado: PASS, 3 testes.

- [ ] **Passo 5: Criar pin, stub e tsconfig**

```bash
gh api repos/pagefaultgames/pokerogue/commits/beta --jq .sha; gh api repos/pagefaultgames/pokerogue-locales/commits/main --jq .sha
```

`data/pokerogue-source.json`, com os SHAs colados. O branch continua sendo `beta`, que é o que
o jogo em produção usa — o que muda é que agora é um commit específico, não a ponta.

```json
{
  "pokerogue": { "repo": "pagefaultgames/pokerogue", "commit": "SHA_DO_JOGO" },
  "locales": { "repo": "pagefaultgames/pokerogue-locales", "commit": "SHA_DOS_LOCALES" }
}
```

`tools/stubs/terrain.ts`:

```ts
export enum TerrainType {
  NONE,
  MISTY,
  ELECTRIC,
  GRASSY,
  PSYCHIC,
}
```

`tools/pokerogue.tsconfig.json` — `#data/terrain` vem antes de `#data/*` para ganhar da regra
genérica:

```json
{
  "extends": "../tsconfig.json",
  "compilerOptions": {
    "baseUrl": "..",
    "paths": {
      "#data/terrain": ["tools/stubs/terrain.ts"],
      "#enums/*": [".upstream/pokerogue/src/enums/*"],
      "#types/*": [".upstream/pokerogue/src/@types/*"],
      "#data/*": [".upstream/pokerogue/src/data/*"]
    }
  },
  "include": ["stubs"]
}
```

Acrescente `.upstream/` ao `.gitignore`.

- [ ] **Passo 6: Reescrever `tools/build-biomes.mts` sem regex**

Cada arquivo de bioma exporta um objeto com `biomeId`, `pokemonPool` e `biomeLinks`. Emite a
mesma `BiomeTable` de hoje, para não quebrar `views.ts` nem `hud.ts`:

```ts
import { readdirSync, writeFileSync } from 'node:fs';
import type { BiomeEntry, BiomeTable, PoolTier } from '../src/domain/biome';
import { fetchUpstream, readPins } from './upstream.mts';

const POOL_TIERS: readonly PoolTier[] = [
  'COMMON',
  'UNCOMMON',
  'RARE',
  'SUPER_RARE',
  'ULTRA_RARE',
  'BOSS',
];

interface UpstreamBiome {
  biomeId: number;
  pokemonPool: Record<string, Record<string, readonly number[]>>;
  biomeLinks: readonly (number | readonly [number, number])[];
}

const pins = readPins();
const game = fetchUpstream('pokerogue', pins.pokerogue, [
  'src/data/balance/biomes',
  'src/enums',
  'src/@types',
]);

const biomeNames = (await import(`${game}/src/enums/biome-id.ts`)) as {
  BiomeId: Record<string, number>;
};
const nameById = new Map(Object.entries(biomeNames.BiomeId).map(([name, id]) => [id, name]));

const files = readdirSync(`${game}/src/data/balance/biomes`)
  .filter((file) => file.endsWith('.ts'))
  .sort();

const table: BiomeTable = {};

for (const file of files) {
  const loaded = (await import(`${game}/src/data/balance/biomes/${file}`)) as Record<string, unknown>;
  const biome = Object.values(loaded).find(
    (value): value is UpstreamBiome =>
      typeof value === 'object' && value !== null && 'biomeId' in value && 'pokemonPool' in value,
  );
  if (!biome) throw new Error(`bioma sem export reconhecivel: ${file}`);

  const pools: BiomeEntry['pools'] = {};
  POOL_TIERS.forEach((label, tier) => {
    const ids = [...new Set(Object.values(biome.pokemonPool[tier] ?? {}).flat())].sort(
      (a, b) => a - b,
    );
    if (ids.length > 0) pools[label] = ids;
  });

  table[biome.biomeId] = { name: nameById.get(biome.biomeId) ?? String(biome.biomeId), pools };
}

const sorted = Object.fromEntries(
  Object.entries(table).sort(([a], [b]) => Number(a) - Number(b)),
) as BiomeTable;

writeFileSync(
  new URL('../data/biome-table.generated.ts', import.meta.url),
  [
    `import type { BiomeTable } from '../src/domain/biome';`,
    '',
    `export const BIOME_TABLE: BiomeTable = ${JSON.stringify(sorted)};`,
    '',
  ].join('\n'),
);

process.stdout.write(`${Object.keys(sorted).length} biomas em data/biome-table.generated.ts\n`);
```

O `.sort()` nos arquivos e nos ids não é cosmético: sem ele a ordem varia entre sistemas de
arquivos e o arquivo gerado mudaria sem o dado ter mudado.

Ajuste o script em `package.json` para
`"build:biomes": "tsx --tsconfig tools/pokerogue.tsconfig.json tools/build-biomes.mts"`.

- [ ] **Passo 7: Gerar, comparar e confirmar reprodutibilidade**

```bash
npm run build:biomes && npm test
npm run build:biomes && git diff --exit-code data/biome-table.generated.ts && echo identico
```

Esperado: os 109 testes continuam verdes, depois `identico`. Se a tabela mudar em relação à
gerada por regex, **inspecione o diff antes de aceitar** — pode ser correção real do parser ou
regressão.

- [ ] **Passo 8: Confirmar que pin inválido aborta**

```bash
cp data/pokerogue-source.json /tmp/pin.bak && node -e "const f=require('fs'),p='data/pokerogue-source.json',o=JSON.parse(f.readFileSync(p,'utf8'));o.pokerogue.commit='0'.repeat(40);f.writeFileSync(p,JSON.stringify(o,null,2))" && npm run build:biomes; echo "codigo: $?"; cp /tmp/pin.bak data/pokerogue-source.json
```

Esperado: `codigo:` diferente de `0`.

- [ ] **Passo 9: Commit**

```bash
npm run format && npm run typecheck && npm test
git add data/pokerogue-source.json tools test/upstream.test.ts package.json .gitignore data/biome-table.generated.ts
git commit -m "refactor: gera tabela de biomas de commit pinado em vez de regex sobre beta"
```

---

## Task B3: Grafo de destinos e aba de mapa

`biomeLinks` já vem no mesmo objeto que o gerador de B2 importa: são os biomas para onde se
pode viajar a partir daqui. Plains leva a Grass, Metropolis e Lake. É a tela de escolha de
mapa, e custa uma segunda projeção sobre dados já em mãos.

**Arquivos:** modificar `src/domain/biome.ts`, `tools/build-biomes.mts`, `src/hud/views.ts`,
`src/hud/panel.ts`, `src/hud/hud.ts`; criar `test/destinations.test.ts`.

**Interfaces:** `BiomeEntry` ganha `links: readonly number[]`. Produz
`destinationsView(biomeId, biomes, tiers): DestinationGroup[]`, com
`DestinationGroup { biome: number; name: string; highlights: PokemonRow[] }`.

- [ ] **Passo 1: Escrever o teste que falha**

`test/destinations.test.ts`:

```ts
import { describe, expect, test } from 'vitest';
import type { BiomeTable } from '../src/domain/biome';
import { destinationsView } from '../src/hud/views';

const biomes: BiomeTable = {
  1: { name: 'PLAINS', pools: { COMMON: [1] }, links: [2, 9] },
  2: { name: 'GRASS', pools: { COMMON: [2], BOSS: [3] }, links: [] },
  9: { name: 'LAKE', pools: {}, links: [] },
};

const tiers = {
  '1': { tier: 'LC', bestTier: 'PU', bestName: 'Venusaur', mega: null, gmax: null, name: 'Bulbasaur' },
  '2': { tier: 'LC', bestTier: 'OU', bestName: 'Ivysaur', mega: null, gmax: null, name: 'Ivysaur' },
  '3': { tier: 'OU', bestTier: 'OU', bestName: 'Venusaur', mega: null, gmax: null, name: 'Venusaur' },
} as never;

describe('destinationsView', () => {
  test('monta um grupo por destino do bioma atual', () => {
    expect(destinationsView(1, biomes, tiers).map((g) => g.name)).toEqual(['GRASS', 'LAKE']);
  });

  test('destino sem pool aparece com destaques vazios', () => {
    expect(destinationsView(1, biomes, tiers)[1]?.highlights).toEqual([]);
  });

  test('bioma sem destino devolve lista vazia', () => {
    expect(destinationsView(2, biomes, tiers)).toEqual([]);
  });

  test('bioma desconhecido devolve lista vazia sem lancar', () => {
    expect(destinationsView(99, biomes, tiers)).toEqual([]);
  });

  test('os destaques vem ordenados pelo melhor alcance', () => {
    const highlights = destinationsView(1, biomes, tiers)[0]?.highlights ?? [];
    expect(highlights[0]?.reachTier).toBe('OU');
  });
});
```

- [ ] **Passo 2: Rodar e confirmar que falha**

```bash
npx vitest run test/destinations.test.ts
```

Esperado: FAIL, `destinationsView` não exportado.

- [ ] **Passo 3: Levar `links` até a tabela**

Em `src/domain/biome.ts`, acrescente a `BiomeEntry`:

```ts
  links: readonly number[];
```

Em `tools/build-biomes.mts`, dentro do laço, antes do `table[biome.biomeId] = ...`:

```ts
  const links = [
    ...new Set(biome.biomeLinks.map((link) => (typeof link === 'number' ? link : link[0]))),
  ].sort((a, b) => a - b);
```

e inclua `links` no objeto atribuído. Um link pode vir como `BiomeId` ou como
`[BiomeId, peso]`; o peso é probabilidade de transição e não muda o conjunto de destinos
oferecidos, então só o id entra.

- [ ] **Passo 4: Escrever `destinationsView`**

Em `src/hud/views.ts`, reusando o `rowFor` e o `byReach` que já existem no arquivo:

```ts
export interface DestinationGroup {
  biome: number;
  name: string;
  highlights: PokemonRow[];
}

const HIGHLIGHT_LIMIT = 6;

export function destinationsView(
  biomeId: number,
  biomes: BiomeTable,
  table: TierTable,
): DestinationGroup[] {
  const current = biomes[biomeId];
  if (!current) return [];

  return current.links.flatMap((destination) => {
    const entry = biomes[destination];
    if (!entry) return [];

    const highlights = Object.values(entry.pools)
      .flat()
      .map((speciesId) => {
        const known = table[`${speciesId}`];
        return rowFor(known?.name ?? `#${speciesId}`, speciesId, null, table);
      })
      .sort(byReach)
      .slice(0, HIGHLIGHT_LIMIT);

    return [{ biome: destination, name: entry.name, highlights }];
  });
}
```

O corte em seis não é arbitrário nem silencioso: o painel tem 310px e a pergunta na escolha de
mapa é "o que de melhor tem lá", não "liste tudo". O rótulo da aba deixa isso explícito no
passo seguinte.

- [ ] **Passo 5: Ligar a aba no painel**

Em `src/hud/panel.ts`, acrescente `'destinos'` a `TabId`, `'Para onde'` a `TAB_LABELS`, e
`destinations: DestinationGroup[]` a `PanelContent`. O corpo da aba reusa `rowElement` sob um
cabeçalho `ptr-group` por destino, com o texto `${nome} — melhores ${n}`.

Em `src/hud/hud.ts`, no `panel.update`, acrescente
`destinations: biomeId === undefined ? [] : destinationsView(biomeId, this.biomes, this.tiers)`.

- [ ] **Passo 6: Rodar tudo e commitar**

```bash
npx vitest run test/destinations.test.ts && npm test && npm run typecheck
npm run format
git add src/domain/biome.ts tools/build-biomes.mts src/hud data/biome-table.generated.ts test/destinations.test.ts
git commit -m "feat: aba de destinos com o melhor de cada bioma alcancavel"
```

---

## Task B4: Egg moves, hidden ability e catch rate

Verificado em jogo: `species.abilityHidden` e `species.catchRate` vêm do runtime — Ralts
devolveu `140` e `235`. Egg moves não estão no objeto do Pokémon e precisam de tabela gerada;
`egg-moves.ts` do upstream importa só enums e resolve direto.

**Arquivos:** modificar `tools/build-biomes.mts` (ou criar `tools/build-moves.mts`),
`src/game/pokerogue.ts`, `src/hud/views.ts`, `src/hud/panel.ts`; criar
`data/egg-moves.generated.ts`, `data/names.generated.ts`, `test/egg-moves-data.test.ts`.

- [ ] **Passo 1: Escrever o teste dos dados**

`test/egg-moves-data.test.ts`:

```ts
import { describe, expect, test } from 'vitest';
import { EGG_MOVES } from '../data/egg-moves.generated';
import { MOVE_NAMES } from '../data/names.generated';

const entries = Object.entries(EGG_MOVES);

describe('tabela de egg moves', () => {
  test('cobre pelo menos 400 especies', () => {
    expect(entries.length).toBeGreaterThanOrEqual(400);
  });

  test('as chaves sao numero de especie e os valores sao listas nao vazias', () => {
    for (const [key, moves] of entries) {
      expect(key).toMatch(/^\d+$/);
      expect(moves.length, key).toBeGreaterThan(0);
    }
  });

  test('todo egg move tem nome na tabela de nomes', () => {
    for (const [key, moves] of entries) {
      for (const move of moves) expect(MOVE_NAMES[move], `${key}/${move}`).toBeTypeOf('string');
    }
  });

  test('nenhum nome de move sobra sem uso', () => {
    const usados = new Set(Object.values(EGG_MOVES).flat());
    for (const key of Object.keys(MOVE_NAMES)) expect(usados.has(Number(key)), key).toBe(true);
  });
});
```

- [ ] **Passo 2: Rodar e confirmar que falha**

```bash
npx vitest run test/egg-moves-data.test.ts
```

Esperado: FAIL, imports não resolvidos.

- [ ] **Passo 3: Emitir egg moves e nomes**

Acrescente ao gerador, com `locales` resolvido por `fetchUpstream('locales', pins.locales, ['en'])`.
Os nomes vivem no repositório de locales como JSON puro, indexados por chave em camelCase; os
enums do jogo dão o mapa id → rótulo em `SCREAMING_SNAKE_CASE`:

```ts
const camel = (value: string): string =>
  value.toLowerCase().replace(/_(.)/g, (_, letter: string) => letter.toUpperCase());

const eggModule = (await import(`${game}/src/data/balance/moves/egg-moves.ts`)) as {
  speciesEggMoves: Record<number, readonly number[]>;
};

const eggMoves: Record<number, readonly number[]> = {};
for (const [speciesId, moves] of Object.entries(eggModule.speciesEggMoves).sort(
  ([a], [b]) => Number(a) - Number(b),
)) {
  if (moves.length > 0) eggMoves[Number(speciesId)] = moves;
}

const usedMoves = new Set(Object.values(eggMoves).flat());
const moveEnum = (await import(`${game}/src/enums/move-id.ts`)) as { MoveId: Record<string, number> };
const moveLocale = JSON.parse(readFileSync(`${locales}/en/move.json`, 'utf8')) as Record<
  string,
  { name?: string } | string
>;

const moveNames: Record<number, string> = {};
for (const [label, id] of Object.entries(moveEnum.MoveId)) {
  if (typeof id !== 'number' || !usedMoves.has(id)) continue;
  const entry = moveLocale[camel(label)];
  const name = typeof entry === 'string' ? entry : entry?.name;
  if (name) moveNames[id] = name;
}
```

Emita os dois arquivos com `JSON.stringify` sobre as chaves já ordenadas. O filtro por
`usedMoves` é deliberado: `move.json` tem 179 KB e usaríamos uma fração.

- [ ] **Passo 4: Ler HA e catch rate do runtime**

Em `src/game/pokerogue.ts`, acrescente a `PokeRogueSpecies`:

```ts
  catchRate: number;
  abilityHidden: number;
```

Em `src/hud/views.ts`, `PokemonRow` ganha três campos, e `rowForPokemon` os preenche a partir
de `pokemon.species`. Campo sem dado vem `null` e **não vira linha** no painel — não existe
texto de preenchimento:

```ts
  hiddenAbility: string | null;
  eggMoves: readonly string[];
  catchRate: number | null;
```

`rowFor`, que também serve às listas de bioma, preenche esses campos com `null` e `[]`: ali não
há instância de Pokémon, só id de espécie.

- [ ] **Passo 5: Exibir no painel**

Em `src/hud/panel.ts`, `rowElement` ganha uma segunda linha, renderizada só quando houver
conteúdo — HA, egg moves e catch rate, separados por `·`. Linha sem conteúdo não é criada.

- [ ] **Passo 6: Rodar e commitar**

```bash
npm run build:biomes && npm test && npm run typecheck
npm run format
git add data tools src/game/pokerogue.ts src/hud test/egg-moves-data.test.ts
git commit -m "feat: egg moves, hidden ability e catch rate no painel"
```

---

## Task B5: Nomes de bioma vindos dos locales

`src/hud/hud.ts` tem hoje um `BIOME_LABELS` com 35 traduções escritas à mão. Elas envelhecem
sem aviso quando o upstream adiciona bioma, e existem só em português.

**Arquivos:** modificar `tools/build-biomes.mts`, `src/hud/hud.ts`; criar
`test/biome-names.test.ts`.

- [ ] **Passo 1: Escrever o teste que falha**

```ts
import { describe, expect, test } from 'vitest';
import { BIOME_TABLE } from '../data/biome-table.generated';
import { BIOME_NAMES } from '../data/names.generated';

describe('nomes de bioma', () => {
  test('todo bioma da tabela tem nome legivel', () => {
    for (const key of Object.keys(BIOME_TABLE)) {
      expect(BIOME_NAMES[Number(key)], key).toBeTypeOf('string');
    }
  });

  test('nenhum nome vazio', () => {
    for (const [key, name] of Object.entries(BIOME_NAMES)) {
      expect(name.length, key).toBeGreaterThan(0);
    }
  });
});
```

- [ ] **Passo 2: Emitir `BIOME_NAMES` de `en/biomes.json`**

Mesma ponte enum → camelCase → locale do passo B4.

- [ ] **Passo 3: Remover `BIOME_LABELS` do `hud.ts`**

Troque o `BIOME_LABELS.get(biome.name) ?? biome.name` por `BIOME_NAMES[biomeId] ?? biome.name`.
As 35 linhas de tradução saem do código.

- [ ] **Passo 4: Rodar e commitar**

```bash
npm run build:biomes && npm test && npm run typecheck && npm run format
git add tools src/hud/hud.ts data test/biome-names.test.ts
git commit -m "refactor: nomes de bioma vem dos locales em vez de tabela manual"
```

---

## Task B6: Cobertura de tipos do time

A aba "Meu time" lista o time. A pergunta que ela ainda não responde é qual buraco o time tem —
e é o que transforma a aba de destinos em decisão.

**Arquivos:** criar `src/domain/coverage.ts`, `test/coverage.test.ts`; modificar
`src/game/pokerogue.ts`, `src/hud/views.ts`, `src/hud/panel.ts`.

**Interfaces:** produz `missingTypes(team: readonly TeamMember[], allTypes: readonly number[]): readonly number[]`,
com `TeamMember { types: readonly number[] }`.

- [ ] **Passo 1: Escrever o teste que falha**

```ts
import { describe, expect, test } from 'vitest';
import { missingTypes } from '../src/domain/coverage';

const todos = [10, 11, 12];

describe('missingTypes', () => {
  test('time vazio devolve lista vazia em vez de todos os tipos', () => {
    expect(missingTypes([], todos)).toEqual([]);
  });

  test('lista os tipos que ninguem no time tem', () => {
    expect(missingTypes([{ types: [10] }], todos)).toEqual([11, 12]);
  });

  test('tipo duplo cobre os dois', () => {
    expect(missingTypes([{ types: [10, 11] }], todos)).toEqual([12]);
  });

  test('time que cobre tudo devolve lista vazia', () => {
    expect(missingTypes([{ types: [10, 11, 12] }], todos)).toEqual([]);
  });
});
```

Time vazio devolve lista vazia, não "faltam todos": sem time, a comparação não tem significado,
e apresentar uma seria opinião disfarçada de fato.

- [ ] **Passo 2: Escrever `src/domain/coverage.ts`**

```ts
export interface TeamMember {
  types: readonly number[];
}

export function missingTypes(
  team: readonly TeamMember[],
  allTypes: readonly number[],
): readonly number[] {
  if (team.length === 0) return [];
  const present = new Set(team.flatMap((member) => member.types));
  return allTypes.filter((type) => !present.has(type));
}
```

- [ ] **Passo 3: Ligar no painel**

`PokeRogueSpecies` ganha `type1: number` e `type2: number | null`. `partyView` passa a devolver
também os tipos, e o rodapé da aba "Meu time" mostra `Sem cobertura: ...` usando `TYPE_NAMES`,
emitido pelo gerador a partir do enum `PokemonType` e do locale correspondente. Linha só
aparece quando há tipo faltando.

- [ ] **Passo 4: Rodar e commitar**

```bash
npx vitest run test/coverage.test.ts && npm test && npm run typecheck && npm run format
git add src/domain/coverage.ts src/game/pokerogue.ts src/hud test/coverage.test.ts data tools
git commit -m "feat: cobertura de tipos do time na aba do time"
```

---

## Task B7: Workflow de drift

O risco desta spec não é técnico, é temporal — o PokéRogue atualiza e a tabela passa a mentir.
Mentir é pior que omitir, e o overlay já escolheu omitir (`?` do Smogon). Com o pin de B2, o
drift vira detectável.

**Arquivos:** criar `.github/workflows/data-drift.yml`.

- [ ] **Passo 1: Escrever o workflow**

```yaml
name: Data drift

on:
  schedule:
    - cron: '0 6 * * 1'
  workflow_dispatch:

permissions:
  contents: write
  pull-requests: write

jobs:
  drift:
    runs-on: ubuntu-latest
    env:
      PUPPETEER_SKIP_DOWNLOAD: 'true'
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: npm

      - run: npm ci

      - name: Atualizar os pins para a HEAD dos upstreams
        env:
          GH_TOKEN: ${{ github.token }}
        run: |
          game=$(gh api repos/pagefaultgames/pokerogue/commits/beta --jq .sha)
          loc=$(gh api repos/pagefaultgames/pokerogue-locales/commits/main --jq .sha)
          node -e "
            const f=require('fs'), p='data/pokerogue-source.json';
            const o=JSON.parse(f.readFileSync(p,'utf8'));
            o.pokerogue.commit=process.argv[1];
            o.locales.commit=process.argv[2];
            f.writeFileSync(p, JSON.stringify(o,null,2)+'\n');
          " "$game" "$loc"

      - run: npm run build:biomes

      - uses: peter-evans/create-pull-request@v7
        with:
          branch: data-drift
          title: 'chore: atualizar tabelas geradas do PokeRogue'
          commit-message: 'chore: atualizar tabelas geradas do PokeRogue'
          body: |
            Gerado pelo workflow `data-drift`.
            Revise o diff antes do merge — o overlay nao se atualiza sozinho a partir de codigo de terceiro.
```

`create-pull-request` não abre PR quando não há diff, então semana sem mudança não gera ruído.
O PR dispara o `ci.yml` existente. Merge é decisão humana: o overlay não se atualiza sozinho a
partir de código de terceiro.

- [ ] **Passo 2: Testar com pin antigo e commitar**

Aponte o pin para um SHA de meses atrás num branch e dispare por `workflow_dispatch`.

Esperado: PR com diff não vazio em `data/*.generated.ts`, com o CI rodando nele.

```bash
git add .github/workflows/data-drift.yml
git commit -m "ci: workflow semanal de drift das tabelas geradas"
```

---

## Task B8: Verificação em jogo

O Browser pane do app **não serve** para isto: a página fica com `document.hidden: true`, o
`requestAnimationFrame` congela após poucos quadros e o Phaser não termina o boot. Use
`npm run launch`, que abre Chrome headful.

Sem screenshot, nenhum item está pronto. É o padrão que a v2 estabeleceu na V9.

- [ ] **Passo 1: Subir**

```bash
npm run build && npm run launch
```

- [ ] **Passo 2: Pílula e painel em batalha**

Clique na pílula. **Screenshot.** O painel não pode cobrir a HUD nem a caixa de diálogo.
Percorra as quatro abas.

- [ ] **Passo 3: Aba de destinos numa escolha de bioma**

**Screenshot** da aba "Para onde", com os destaques de cada destino.

- [ ] **Passo 4: HA, egg moves e catch rate**

Abra a aba "Em campo" com um inimigo que tenha hidden ability e egg moves. **Screenshot.**
Depois um sem egg move: a linha não existe, e não há texto de preenchimento.

- [ ] **Passo 5: Cobertura de tipos**

Com time montado, **screenshot** do rodapé de "Meu time".

- [ ] **Passo 6: Celular**

```bash
npm run launch -- --late
```

Redimensione para 390×844 e repita o passo 2. **Screenshot.**

- [ ] **Passo 7: Commit das evidências**

```bash
git add docs/
git commit -m "docs: screenshots de verificacao em jogo do painel"
```

---

## Task B9: Fechamento

- [ ] **Passo 1: Suíte completa**

```bash
npm run lint && npm run typecheck && npm test && npm run build
```

Esperado: tudo verde, com contagem de testes maior que os 109 de partida.

- [ ] **Passo 2: Tamanho do bundle**

```bash
wc -c dist/pokerogue-tier-overlay.user.js
grep -c "@require" dist/pokerogue-tier-overlay.meta.js; echo "esperado: 0"
```

Esperado: abaixo de 512000 bytes, e nenhum `@require`.

- [ ] **Passo 3: README**

Documente a pílula, as quatro abas e o que cada uma responde.

```bash
git add README.md && git commit -m "docs: documenta as abas do painel"
```

---

## Depois deste plano

Publicar no Greasyfork é passo manual seu — não consigo autenticar na sua conta.

O que fica mapeado e não entra aqui: `StarterSelectUiHandler.allSpecies` expõe as 572 espécies
em runtime, que é o caminho de uma busca por atalho sem UI nova; e `getEvolutionLevels()`
devolve os níveis de evolução, que alimentariam uma aba de planejamento.
