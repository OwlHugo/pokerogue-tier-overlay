# Plano de implementação — companion in-game

> **Para quem for executar:** siga tarefa por tarefa, na ordem. Cada passo é uma ação de 2 a 5
> minutos. Os checkboxes acompanham o progresso.

**Objetivo:** transformar a badge da v2 num companion — clique nela e abre um hub com abas que
respondem o que a decisão daquele momento precisa, em batalha, na seleção de starter e na
escolha de bioma.

**Arquitetura:** `src/domain/` é puro e não conhece Phaser; `src/render/` desenha e não decide.
Existe **um** componente de UI novo, o `Hub`, reusado por todas as telas. Dado que o objeto de
runtime já entrega é lido de lá; o resto vem de tabelas geradas de dois upstreams pinados.

**Stack:** TypeScript strict, Vite + `vite-plugin-monkey`, Vitest, Biome, `tsx` nos geradores,
Puppeteer na verificação.

## Restrições globais

Valem em toda tarefa.

- `npm run typecheck` roda com `strict`, `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`
  e `verbatimModuleSyntax`. Índice de array e de `Record` devolve `T | undefined`.
- `npm run lint` é Biome; rode `npm run format` antes de commitar.
- **Nenhum comentário no código.** Decisão explícita do autor, registrada na spec da v2.
- Nomes de teste em português, no estilo dos existentes.
- Arquivos gerados vão em `data/*.generated.ts` e são commitados.
- Sem fallback, sem camada de compatibilidade, sem `try/catch` sem recuperação real.
- Falha do gerador é falha: nunca emita tabela parcial.
- O corte de entrega é A1–A11. A12 é incremento.

---

## Task A1: Resolver das duas fontes upstream

**Arquivos:** criar `data/pokerogue-source.json`, `tools/upstream.mts`, `tools/stubs/terrain.ts`,
`tools/pokerogue.tsconfig.json`, `tools/build-pokerogue-data.mts`, `test/upstream.test.ts`;
modificar `package.json`, `.gitignore`.

**Interfaces:** produz `parsePins(raw: string): Pins`, `readPins(): Pins`,
`fetchUpstream(name: string, pin: Pin, sparse: readonly string[]): string`.
`Pin = { repo: string; commit: string }`, `Pins = { pokerogue: Pin; locales: Pin }`.

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

`execFileSync` lança quando o `git` sai com código diferente de zero — pin inválido, rede
ausente ou repositório errado abortam ali. É AD-3, sem `try/catch`.

- [ ] **Passo 4: Rodar e confirmar que passa**

```bash
npx vitest run test/upstream.test.ts
```

Esperado: PASS, 3 testes.

- [ ] **Passo 5: Criar pin, stub e tsconfig do gerador**

Descubra os SHAs:

```bash
gh api repos/pagefaultgames/pokerogue/commits/main --jq .sha; gh api repos/pagefaultgames/pokerogue-locales/commits/main --jq .sha
```

`data/pokerogue-source.json`, com os SHAs colados:

```json
{
  "pokerogue": { "repo": "pagefaultgames/pokerogue", "commit": "SHA_DO_JOGO" },
  "locales": { "repo": "pagefaultgames/pokerogue-locales", "commit": "SHA_DOS_LOCALES" }
}
```

`tools/stubs/terrain.ts` — os arquivos de bioma importam `TerrainType` de `#data/terrain`, que
por transitividade puxa `i18next`, `#app/messages` e `#field/pokemon` e quebra em Node:

```ts
export enum TerrainType {
  NONE,
  MISTY,
  ELECTRIC,
  GRASSY,
  PSYCHIC,
}
```

`tools/pokerogue.tsconfig.json`:

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

`#data/terrain` vem antes de `#data/*` para ganhar da regra genérica.

Acrescente `.upstream/` ao `.gitignore`.

- [ ] **Passo 6: Escrever o esqueleto do gerador**

`tools/build-pokerogue-data.mts`:

```ts
import { readdirSync, readFileSync } from 'node:fs';
import { fetchUpstream, readPins } from './upstream.mts';

const pins = readPins();

const game = fetchUpstream('pokerogue', pins.pokerogue, [
  'src/data/balance/biomes',
  'src/data/balance/moves',
  'src/enums',
  'src/@types',
]);

const locales = fetchUpstream('locales', pins.locales, ['en']);

const biomeFiles = readdirSync(`${game}/src/data/balance/biomes`)
  .filter((file) => file.endsWith('.ts'))
  .sort();

const abilityKeys = Object.keys(JSON.parse(readFileSync(`${locales}/en/ability.json`, 'utf8')));

process.stdout.write(`${biomeFiles.length} biomas e ${abilityKeys.length} chaves de ability\n`);
```

O `.sort()` não é cosmético: sem ele a ordem de `readdirSync` varia entre sistemas de arquivos
e o arquivo gerado mudaria sem o dado ter mudado, quebrando AD-2.

- [ ] **Passo 7: Registrar o script e rodar**

Em `package.json`, ao lado de `build:tiers`:

```json
"build:data": "tsx --tsconfig tools/pokerogue.tsconfig.json tools/build-pokerogue-data.mts",
```

```bash
npm run build:data && npm run build:data
```

Esperado: a mesma linha nas duas execuções, algo como `31 biomas e 300+ chaves de ability`.

- [ ] **Passo 8: Confirmar que pin inválido aborta**

```bash
cp data/pokerogue-source.json /tmp/pin.bak && node -e "const f=require('fs'),p='data/pokerogue-source.json',o=JSON.parse(f.readFileSync(p,'utf8'));o.pokerogue.commit='0'.repeat(40);f.writeFileSync(p,JSON.stringify(o,null,2))" && npm run build:data; echo "codigo: $?"; cp /tmp/pin.bak data/pokerogue-source.json
```

Esperado: `codigo:` diferente de `0`, com o erro do `git` visível. O pin original volta ao final.

- [ ] **Passo 9: Commit**

```bash
npm run format && npm run typecheck && npm test
git add data/pokerogue-source.json tools test/upstream.test.ts package.json .gitignore
git commit -m "feat: resolver das fontes upstream pinadas do pokerogue"
```

---

## Task A2: Tabela de egg moves

**Arquivos:** modificar `tools/build-pokerogue-data.mts`; criar `data/egg-moves.generated.ts`
(gerado) e `test/egg-moves-data.test.ts`.

**Interfaces:** produz `export const EGG_MOVES: Record<number, readonly number[]>`, chave
`speciesId`, valor lista de `moveId`.

- [ ] **Passo 1: Escrever o teste que falha**

`test/egg-moves-data.test.ts`:

```ts
import { describe, expect, test } from 'vitest';
import { EGG_MOVES } from '../data/egg-moves.generated';

const entries = Object.entries(EGG_MOVES);

describe('tabela de egg moves', () => {
  test('cobre pelo menos 400 especies', () => {
    expect(entries.length).toBeGreaterThanOrEqual(400);
  });

  test('as chaves sao numero de especie', () => {
    for (const [key] of entries) {
      expect(key).toMatch(/^\d+$/);
      expect(Number.parseInt(key, 10)).toBeGreaterThan(0);
    }
  });

  test('todo valor e lista nao vazia de ids de move', () => {
    for (const [key, moves] of entries) {
      expect(moves.length, key).toBeGreaterThan(0);
      for (const move of moves) expect(Number.isInteger(move), key).toBe(true);
    }
  });

  test('Bulbasaur tem quatro egg moves', () => {
    expect(EGG_MOVES[1]).toHaveLength(4);
  });
});
```

- [ ] **Passo 2: Rodar e confirmar que falha**

```bash
npx vitest run test/egg-moves-data.test.ts
```

Esperado: FAIL, `Failed to resolve import "../data/egg-moves.generated"`.

- [ ] **Passo 3: Emitir a tabela**

Acrescente em `tools/build-pokerogue-data.mts`, trocando o `process.stdout.write`:

```ts
import { writeFileSync } from 'node:fs';

const eggModule = (await import(`${game}/src/data/balance/moves/egg-moves.ts`)) as {
  speciesEggMoves: Record<number, readonly number[]>;
};

const eggMoves: Record<number, readonly number[]> = {};
for (const [speciesId, moves] of Object.entries(eggModule.speciesEggMoves).sort(
  ([a], [b]) => Number(a) - Number(b),
)) {
  if (moves.length > 0) eggMoves[Number(speciesId)] = moves;
}

writeFileSync(
  new URL('../data/egg-moves.generated.ts', import.meta.url),
  `export const EGG_MOVES: Record<number, readonly number[]> = ${JSON.stringify(eggMoves)};\n`,
);

process.stdout.write(`${Object.keys(eggMoves).length} especies com egg move\n`);
```

- [ ] **Passo 4: Gerar e rodar o teste**

```bash
npm run build:data && npx vitest run test/egg-moves-data.test.ts
```

Esperado: contagem impressa, depois PASS com 4 testes.

- [ ] **Passo 5: Confirmar reprodutibilidade**

```bash
npm run build:data && git diff --exit-code data/egg-moves.generated.ts && echo identico
```

Esperado: `identico`.

- [ ] **Passo 6: Commit**

```bash
npm run format && npm run typecheck && npm test
git add tools/build-pokerogue-data.mts data/egg-moves.generated.ts test/egg-moves-data.test.ts
git commit -m "feat: tabela de egg moves gerada do upstream"
```

---

## Task A3: Índice de biomas e grafo de destinos

**Arquivos:** criar `src/domain/biome.ts`, `test/biome.test.ts`,
`test/biome-data.test.ts`; modificar `tools/build-pokerogue-data.mts`; gerar
`data/biome-index.generated.ts` e `data/biome-links.generated.ts`.

**Interfaces:** produz `Encounter`, `BiomeIndex`, `BiomeLinks`,
`encountersIn(index, speciesId, biomeId): readonly Encounter[]`,
`destinationsFrom(links, biomeId): readonly number[]`.

- [ ] **Passo 1: Escrever o teste do domínio**

`test/biome.test.ts`:

```ts
import { describe, expect, test } from 'vitest';
import { type BiomeIndex, type BiomeLinks, destinationsFrom, encountersIn } from '../src/domain/biome';

const index: BiomeIndex = {
  1: [
    { biome: 10, rarity: 0, timeOfDay: 4 },
    { biome: 10, rarity: 2, timeOfDay: 1 },
    { biome: 20, rarity: 4, timeOfDay: 4 },
  ],
};

const links: BiomeLinks = { 1: [2, 4, 9], 50: [] };

describe('encountersIn', () => {
  test('devolve todas as ocorrencias da especie no bioma consultado', () => {
    expect(encountersIn(index, 1, 10)).toHaveLength(2);
  });

  test('ignora ocorrencias de outros biomas', () => {
    expect(encountersIn(index, 1, 20)).toEqual([{ biome: 20, rarity: 4, timeOfDay: 4 }]);
  });

  test('especie ausente do bioma devolve lista vazia sem erro', () => {
    expect(encountersIn(index, 1, 99)).toEqual([]);
  });

  test('especie fora do indice devolve lista vazia sem erro', () => {
    expect(encountersIn(index, 999, 10)).toEqual([]);
  });

  test('bioma desconhecido devolve lista vazia', () => {
    expect(encountersIn(index, 1, null)).toEqual([]);
  });
});

describe('destinationsFrom', () => {
  test('devolve os destinos do bioma', () => {
    expect(destinationsFrom(links, 1)).toEqual([2, 4, 9]);
  });

  test('bioma terminal devolve lista vazia', () => {
    expect(destinationsFrom(links, 50)).toEqual([]);
  });

  test('bioma desconhecido devolve lista vazia sem erro', () => {
    expect(destinationsFrom(links, 999)).toEqual([]);
    expect(destinationsFrom(links, null)).toEqual([]);
  });
});
```

- [ ] **Passo 2: Rodar e confirmar que falha**

```bash
npx vitest run test/biome.test.ts
```

Esperado: FAIL, `Failed to resolve import "../src/domain/biome"`.

- [ ] **Passo 3: Escrever `src/domain/biome.ts`**

```ts
export interface Encounter {
  biome: number;
  rarity: number;
  timeOfDay: number;
}

export type BiomeIndex = Record<number, readonly Encounter[]>;
export type BiomeLinks = Record<number, readonly number[]>;

export function encountersIn(
  index: BiomeIndex,
  speciesId: number,
  biomeId: number | null,
): readonly Encounter[] {
  if (biomeId === null) return [];
  return (index[speciesId] ?? []).filter((encounter) => encounter.biome === biomeId);
}

export function destinationsFrom(links: BiomeLinks, biomeId: number | null): readonly number[] {
  return biomeId === null ? [] : (links[biomeId] ?? []);
}
```

- [ ] **Passo 4: Rodar e confirmar que passa**

```bash
npx vitest run test/biome.test.ts
```

Esperado: PASS, 8 testes.

- [ ] **Passo 5: Escrever o teste das tabelas geradas**

`test/biome-data.test.ts`:

```ts
import { describe, expect, test } from 'vitest';
import { BIOME_INDEX } from '../data/biome-index.generated';
import { BIOME_LINKS } from '../data/biome-links.generated';

describe('indice de biomas gerado', () => {
  const entries = Object.entries(BIOME_INDEX);

  test('cobre pelo menos 500 especies', () => {
    expect(entries.length).toBeGreaterThanOrEqual(500);
  });

  test('toda ocorrencia tem bioma, raridade e hora do dia inteiros', () => {
    for (const [key, encounters] of entries) {
      for (const encounter of encounters) {
        expect(Number.isInteger(encounter.biome), key).toBe(true);
        expect(Number.isInteger(encounter.rarity), key).toBe(true);
        expect(Number.isInteger(encounter.timeOfDay), key).toBe(true);
      }
    }
  });

  test('nenhuma especie entra com lista vazia', () => {
    for (const [key, encounters] of entries) expect(encounters.length, key).toBeGreaterThan(0);
  });
});

describe('grafo de destinos gerado', () => {
  test('cobre pelo menos 20 biomas', () => {
    expect(Object.keys(BIOME_LINKS).length).toBeGreaterThanOrEqual(20);
  });

  test('Plains leva a Grass, Metropolis e Lake', () => {
    expect(BIOME_LINKS[1]).toEqual(expect.arrayContaining([2, 4, 9]));
  });

  test('todo destino e um bioma conhecido do indice de links', () => {
    for (const [origin, destinations] of Object.entries(BIOME_LINKS)) {
      for (const destination of destinations) {
        expect(Number.isInteger(destination), origin).toBe(true);
      }
    }
  });
});
```

- [ ] **Passo 6: Rodar e confirmar que falha**

```bash
npx vitest run test/biome-data.test.ts
```

Esperado: FAIL, import não resolvido.

- [ ] **Passo 7: Emitir as duas tabelas**

Acrescente em `tools/build-pokerogue-data.mts`:

```ts
import type { BiomeIndex, BiomeLinks, Encounter } from '../src/domain/biome';

interface UpstreamBiome {
  biomeId: number;
  pokemonPool: Record<string, Record<string, readonly number[]>>;
  biomeLinks: readonly (number | readonly [number, number])[];
}

const rawIndex: Record<number, Encounter[]> = {};
const rawLinks: Record<number, number[]> = {};

for (const file of biomeFiles) {
  const loaded = (await import(`${game}/src/data/balance/biomes/${file}`)) as Record<string, unknown>;
  const biome = Object.values(loaded).find(
    (value): value is UpstreamBiome =>
      typeof value === 'object' && value !== null && 'biomeId' in value && 'pokemonPool' in value,
  );
  if (!biome) throw new Error(`bioma sem export reconhecivel: ${file}`);

  rawLinks[biome.biomeId] = biome.biomeLinks.map((link) =>
    typeof link === 'number' ? link : link[0],
  );

  for (const [rarity, byTime] of Object.entries(biome.pokemonPool)) {
    for (const [timeOfDay, speciesIds] of Object.entries(byTime)) {
      for (const speciesId of speciesIds) {
        (rawIndex[speciesId] ??= []).push({
          biome: biome.biomeId,
          rarity: Number(rarity),
          timeOfDay: Number(timeOfDay),
        });
      }
    }
  }
}

const byNumericKey = <T>(source: Record<number, T>): Record<number, T> =>
  Object.fromEntries(Object.entries(source).sort(([a], [b]) => Number(a) - Number(b))) as Record<number, T>;

const biomeIndex: BiomeIndex = byNumericKey(
  Object.fromEntries(
    Object.entries(rawIndex).map(([id, list]) => [
      Number(id),
      list.sort((a, b) => a.biome - b.biome || a.rarity - b.rarity || a.timeOfDay - b.timeOfDay),
    ]),
  ),
);

const biomeLinks: BiomeLinks = byNumericKey(rawLinks);

writeFileSync(
  new URL('../data/biome-index.generated.ts', import.meta.url),
  [
    `import type { BiomeIndex } from '../src/domain/biome';`,
    '',
    `export const BIOME_INDEX: BiomeIndex = ${JSON.stringify(biomeIndex)};`,
    '',
  ].join('\n'),
);

writeFileSync(
  new URL('../data/biome-links.generated.ts', import.meta.url),
  [
    `import type { BiomeLinks } from '../src/domain/biome';`,
    '',
    `export const BIOME_LINKS: BiomeLinks = ${JSON.stringify(biomeLinks)};`,
    '',
  ].join('\n'),
);
```

Um `biomeLink` pode vir como `BiomeId` ou como `[BiomeId, peso]`; o peso é probabilidade de
transição e não muda o conjunto de destinos oferecidos, então só o id entra.

- [ ] **Passo 8: Gerar, testar e conferir reprodutibilidade**

```bash
npm run build:data && npx vitest run test/biome-data.test.ts test/biome.test.ts
npm run build:data && git diff --exit-code data/biome-index.generated.ts data/biome-links.generated.ts && echo identico
```

Esperado: PASS nos dois arquivos, depois `identico`.

- [ ] **Passo 9: Commit**

```bash
npm run format && npm run typecheck && npm test
git add src/domain/biome.ts test/biome.test.ts test/biome-data.test.ts tools/build-pokerogue-data.mts data/biome-index.generated.ts data/biome-links.generated.ts
git commit -m "feat: indice de biomas por especie e grafo de destinos"
```

---

## Task A4: Tabelas de nome filtradas

**Arquivos:** modificar `tools/build-pokerogue-data.mts`; criar `data/names.generated.ts`
(gerado) e `test/names-data.test.ts`.

**Interfaces:** consome `EGG_MOVES` de A2 e `BIOME_INDEX` de A3. Produz `ABILITY_NAMES`,
`MOVE_NAMES`, `BIOME_NAMES`, `TYPE_NAMES`, todos `Record<number, string>`.

O JSON de locales é indexado por chave em camelCase (`trace`, `gigaDrain`), não por id. Os
enums `AbilityId`, `MoveId`, `BiomeId` e `PokemonType` do upstream dão o mapa id → rótulo em
`SCREAMING_SNAKE_CASE`. A ponte é converter o rótulo para camelCase e procurar a chave.

- [ ] **Passo 1: Escrever o teste que falha**

`test/names-data.test.ts`:

```ts
import { describe, expect, test } from 'vitest';
import { BIOME_INDEX } from '../data/biome-index.generated';
import { EGG_MOVES } from '../data/egg-moves.generated';
import { ABILITY_NAMES, BIOME_NAMES, MOVE_NAMES, TYPE_NAMES } from '../data/names.generated';

describe('tabelas de nome', () => {
  test('todo move que e egg move tem nome', () => {
    for (const [species, moves] of Object.entries(EGG_MOVES)) {
      for (const move of moves) expect(MOVE_NAMES[move], `${species}/${move}`).toBeTypeOf('string');
    }
  });

  test('todo bioma do indice tem nome', () => {
    const biomes = new Set(Object.values(BIOME_INDEX).flat().map((e) => e.biome));
    for (const biome of biomes) expect(BIOME_NAMES[biome], String(biome)).toBeTypeOf('string');
  });

  test('nenhum nome de move sobra sem uso', () => {
    const usados = new Set(Object.values(EGG_MOVES).flat());
    for (const key of Object.keys(MOVE_NAMES)) expect(usados.has(Number(key)), key).toBe(true);
  });

  test('as abilities cobrem pelo menos 200 entradas', () => {
    expect(Object.keys(ABILITY_NAMES).length).toBeGreaterThanOrEqual(200);
  });

  test('os 18 tipos tem nome', () => {
    expect(Object.keys(TYPE_NAMES).length).toBeGreaterThanOrEqual(18);
  });

  test('nenhum nome vazio', () => {
    for (const table of [ABILITY_NAMES, MOVE_NAMES, BIOME_NAMES, TYPE_NAMES]) {
      for (const [key, name] of Object.entries(table)) expect(name.length, key).toBeGreaterThan(0);
    }
  });
});
```

- [ ] **Passo 2: Rodar e confirmar que falha**

```bash
npx vitest run test/names-data.test.ts
```

Esperado: FAIL, import não resolvido.

- [ ] **Passo 3: Emitir as tabelas de nome**

```ts
const camel = (value: string): string =>
  value.toLowerCase().replace(/_(.)/g, (_, letter: string) => letter.toUpperCase());

async function namesFrom(
  enumFile: string,
  enumName: string,
  localeFile: string,
  keep: (id: number) => boolean,
): Promise<Record<number, string>> {
  const loaded = (await import(`${game}/src/enums/${enumFile}`)) as Record<string, unknown>;
  const ids = loaded[enumName] as Record<string, string | number>;
  const locale = JSON.parse(readFileSync(`${locales}/en/${localeFile}`, 'utf8')) as Record<
    string,
    { name?: string } | string
  >;

  const names: Record<number, string> = {};
  for (const [label, id] of Object.entries(ids)) {
    if (typeof id !== 'number' || !keep(id)) continue;
    const entry = locale[camel(label)];
    const name = typeof entry === 'string' ? entry : entry?.name;
    if (name) names[id] = name;
  }
  return byNumericKey(names);
}

const eggMoveIds = new Set(Object.values(eggMoves).flat());
const biomeIds = new Set(Object.values(biomeIndex).flat().map((e) => e.biome));

const moveNames = await namesFrom('move-id.ts', 'MoveId', 'move.json', (id) => eggMoveIds.has(id));
const biomeNames = await namesFrom('biome-id.ts', 'BiomeId', 'biomes.json', (id) => biomeIds.has(id));
const abilityNames = await namesFrom('ability-id.ts', 'AbilityId', 'ability.json', () => true);
const typeNames = await namesFrom('pokemon-type.ts', 'PokemonType', 'pokemon-info.json', () => true);

const table = (name: string, value: Record<number, string>): string =>
  `export const ${name}: Record<number, string> = ${JSON.stringify(value)};`;

writeFileSync(
  new URL('../data/names.generated.ts', import.meta.url),
  [
    table('ABILITY_NAMES', abilityNames),
    table('MOVE_NAMES', moveNames),
    table('BIOME_NAMES', biomeNames),
    table('TYPE_NAMES', typeNames),
    '',
  ].join('\n'),
);
```

O `keep` é AD-5: `MOVE_NAMES` só recebe move que é egg move, `BIOME_NAMES` só bioma presente
no índice. Abilities e tipos entram inteiros porque vêm do runtime e qualquer id pode aparecer.

- [ ] **Passo 4: Gerar e rodar o teste**

```bash
npm run build:data && npx vitest run test/names-data.test.ts
```

Esperado: PASS, 6 testes. Se um nome faltar, a chave do locale diverge do enum — imprima o par
e ajuste `camel` ou o nome do arquivo de locale antes de seguir. `pokemon-info.json` pode
aninhar os tipos sob outra chave; confirme a estrutura com
`node -e "console.log(Object.keys(require('./.upstream/locales/en/pokemon-info.json')))"`.

- [ ] **Passo 5: Medir o tamanho**

```bash
wc -c data/*.generated.ts
```

Esperado: soma bem abaixo de 400 KB. É o insumo do teto de AD-8.

- [ ] **Passo 6: Commit**

```bash
npm run format && npm run typecheck && npm test
git add tools/build-pokerogue-data.mts data/names.generated.ts test/names-data.test.ts
git commit -m "feat: tabelas de nome filtradas do repositorio de locales"
```

---

## Task A5: `domain/forms.ts`

**Arquivos:** criar `src/domain/forms.ts` e `test/forms.test.ts`.

**Interfaces:** produz `interface SpecialForm { key: string; label: string }` e
`formsOf(formKeys: readonly string[]): readonly SpecialForm[]`.

- [ ] **Passo 1: Escrever o teste que falha**

`test/forms.test.ts`:

```ts
import { describe, expect, test } from 'vitest';
import { formsOf } from '../src/domain/forms';

describe('formsOf', () => {
  test('reconhece mega e devolve rotulo legivel', () => {
    expect(formsOf(['', 'mega'])).toEqual([{ key: 'mega', label: 'Mega' }]);
  });

  test('reconhece mega-x e mega-y separadamente', () => {
    expect(formsOf(['', 'mega-x', 'mega-y']).map((f) => f.label)).toEqual(['Mega X', 'Mega Y']);
  });

  test('reconhece gigantamax, primal e eternamax', () => {
    expect(formsOf(['gigantamax', 'primal', 'eternamax']).map((f) => f.label)).toEqual([
      'Gigantamax',
      'Primal',
      'Eternamax',
    ]);
  });

  test('ignora forma vazia e formas regionais', () => {
    expect(formsOf(['', 'alola', 'galar', 'hisui', 'paldea'])).toEqual([]);
  });

  test('especie sem forma especial devolve lista vazia', () => {
    expect(formsOf([])).toEqual([]);
  });

  test('nao repete a mesma forma declarada duas vezes', () => {
    expect(formsOf(['mega', 'mega'])).toHaveLength(1);
  });
});
```

- [ ] **Passo 2: Rodar e confirmar que falha**

```bash
npx vitest run test/forms.test.ts
```

Esperado: FAIL, `Failed to resolve import "../src/domain/forms"`.

- [ ] **Passo 3: Escrever `src/domain/forms.ts`**

Os valores vêm do enum `SpeciesFormKey` do upstream. Copiá-los é deliberado: são a chave de
leitura de um dado de runtime, não uma tabela que muda com balanceamento, e importá-los
custaria arrastar o gerador para dentro do bundle.

```ts
export interface SpecialForm {
  key: string;
  label: string;
}

const LABELS: Record<string, string> = {
  mega: 'Mega',
  'mega-x': 'Mega X',
  'mega-y': 'Mega Y',
  'mega-z': 'Mega Z',
  'mega-original': 'Mega Original',
  'mega-curly': 'Mega Curly',
  'mega-droopy': 'Mega Droopy',
  'mega-stretchy': 'Mega Stretchy',
  primal: 'Primal',
  origin: 'Origin',
  therian: 'Therian',
  gigantamax: 'Gigantamax',
  'gigantamax-single': 'Gigantamax Single Strike',
  'gigantamax-rapid': 'Gigantamax Rapid Strike',
  eternamax: 'Eternamax',
};

export function formsOf(formKeys: readonly string[]): readonly SpecialForm[] {
  const seen = new Set<string>();
  const forms: SpecialForm[] = [];

  for (const key of formKeys) {
    const label = LABELS[key];
    if (!label || seen.has(key)) continue;
    seen.add(key);
    forms.push({ key, label });
  }

  return forms;
}
```

`incarnate` fica de fora de propósito: é a forma base das lendárias de força, não uma conquista
que muda a decisão do jogador.

- [ ] **Passo 4: Rodar e confirmar que passa**

```bash
npx vitest run test/forms.test.ts
```

Esperado: PASS, 6 testes.

- [ ] **Passo 5: Commit**

```bash
npm run format && npm run typecheck && npm test
git add src/domain/forms.ts test/forms.test.ts
git commit -m "feat: reconhecimento de formas especiais mega, gmax e primal"
```

---

## Task A6: `domain/team.ts` e `game/party.ts`

**Arquivos:** criar `src/domain/team.ts`, `src/game/party.ts`, `test/team.test.ts`; modificar
`src/game/pokerogue.ts`.

**Interfaces:** produz `TeamMember { speciesId: number; types: readonly number[] }`,
`TeamProfile { species: ReadonlySet<number>; types: ReadonlySet<number> }`,
`profileOf(members): TeamProfile`, `readTeam(scene: BattleScene): TeamMember[]`.

- [ ] **Passo 1: Escrever o teste que falha**

`test/team.test.ts`:

```ts
import { describe, expect, test } from 'vitest';
import { profileOf } from '../src/domain/team';

describe('profileOf', () => {
  test('time vazio devolve conjuntos vazios sem lancar', () => {
    const profile = profileOf([]);
    expect(profile.species.size).toBe(0);
    expect(profile.types.size).toBe(0);
  });

  test('reune as especies do time', () => {
    const profile = profileOf([
      { speciesId: 1, types: [12] },
      { speciesId: 4, types: [10] },
    ]);
    expect([...profile.species].sort((a, b) => a - b)).toEqual([1, 4]);
  });

  test('especie de tipo duplo contribui com os dois tipos', () => {
    expect(profileOf([{ speciesId: 1, types: [12, 8] }]).types.size).toBe(2);
  });

  test('especie repetida nao duplica o conjunto', () => {
    const profile = profileOf([
      { speciesId: 1, types: [12] },
      { speciesId: 1, types: [12] },
    ]);
    expect(profile.species.size).toBe(1);
    expect(profile.types.size).toBe(1);
  });
});
```

- [ ] **Passo 2: Rodar e confirmar que falha**

```bash
npx vitest run test/team.test.ts
```

Esperado: FAIL, `Failed to resolve import "../src/domain/team"`.

- [ ] **Passo 3: Escrever os dois módulos**

`src/domain/team.ts`:

```ts
export interface TeamMember {
  speciesId: number;
  types: readonly number[];
}

export interface TeamProfile {
  species: ReadonlySet<number>;
  types: ReadonlySet<number>;
}

export function profileOf(members: readonly TeamMember[]): TeamProfile {
  const species = new Set<number>();
  const types = new Set<number>();

  for (const member of members) {
    species.add(member.speciesId);
    for (const type of member.types) types.add(type);
  }

  return { species, types };
}
```

Em `src/game/pokerogue.ts`, acrescente `type1: number`, `type2: number | null` a
`PokeRogueSpecies`, e à `BattleScene` os campos `party: readonly PokeRoguePokemon[]` e
`arena: { biomeType: number } | null`.

`src/game/party.ts`:

```ts
import type { TeamMember } from '../domain/team';
import type { BattleScene } from './pokerogue';

export function readTeam(scene: BattleScene): TeamMember[] {
  return scene.party.map((pokemon) => ({
    speciesId: pokemon.species.speciesId,
    types: [pokemon.species.type1, pokemon.species.type2].filter(
      (type): type is number => type !== null,
    ),
  }));
}
```

- [ ] **Passo 4: Rodar e confirmar que passa**

```bash
npx vitest run test/team.test.ts
```

Esperado: PASS, 4 testes.

- [ ] **Passo 5: Commit**

```bash
npm run format && npm run typecheck && npm test
git add src/domain/team.ts src/game/party.ts src/game/pokerogue.ts test/team.test.ts
git commit -m "feat: perfil do time do jogador a partir da party da cena"
```

---

## Task A7: `domain/dossier.ts`

**Arquivos:** criar `src/domain/dossier.ts`, `src/game/facts.ts`, `test/dossier.test.ts`,
`test/facts.test.ts`; modificar `test/support/fake-pokerogue.ts`.

**Interfaces:** produz `RuntimeFacts`, `readRuntimeFacts(pokemon, biomeId)`, `DossierTables`,
`Dossier`, `dossierFor(facts, tables)`.

- [ ] **Passo 1: Escrever os testes que falham**

`test/facts.test.ts`:

```ts
import { describe, expect, test } from 'vitest';
import { readRuntimeFacts } from '../src/game/facts';
import { fakePokemon } from './support/fake-pokerogue';

describe('readRuntimeFacts', () => {
  test('le catch rate, hidden ability e formas da especie', () => {
    const facts = readRuntimeFacts(
      fakePokemon({ speciesId: 280, catchRate: 235, abilityHidden: 140, formKeys: ['', 'mega'] }),
      10,
    );
    expect(facts.catchRate).toBe(235);
    expect(facts.hiddenAbilityId).toBe(140);
    expect(facts.formKeys).toEqual(['', 'mega']);
    expect(facts.biomeId).toBe(10);
  });

  test('bioma nulo atravessa sem lancar', () => {
    expect(readRuntimeFacts(fakePokemon({ speciesId: 1 }), null).biomeId).toBeNull();
  });

  test('especie sem hidden ability devolve null', () => {
    expect(
      readRuntimeFacts(fakePokemon({ speciesId: 1, abilityHidden: 0 }), 1).hiddenAbilityId,
    ).toBeNull();
  });

  test('fusao junta os dois nomes e preenche a referencia secundaria', () => {
    const facts = readRuntimeFacts(
      fakePokemon({ speciesId: 280, name: 'Ralts', fusionName: 'Gyarados', fusionId: 130 }),
      1,
    );
    expect(facts.name).toBe('Ralts/Gyarados');
    expect(facts.fusion?.speciesId).toBe(130);
  });
});
```

Acrescente `fakePokemon` em `test/support/fake-pokerogue.ts`, seguindo o que já existe para os
alvos de batalha, com os campos `catchRate`, `abilityHidden`, `formKeys`, `name`, `fusionName`
e `fusionId`.

`test/dossier.test.ts`:

```ts
import { describe, expect, test } from 'vitest';
import { type DossierTables, dossierFor } from '../src/domain/dossier';
import type { RuntimeFacts } from '../src/game/facts';

const tables: DossierTables = {
  tiers: { '280': { tier: 'LC', bestTier: 'OU', bestName: 'Gardevoir' } },
  eggMoves: { 280: [1, 2] },
  biomes: { 280: [{ biome: 10, rarity: 2, timeOfDay: 4 }] },
  abilityNames: { 140: 'Trace' },
  moveNames: { 1: 'Memento', 2: 'Encore' },
};

const facts = (overrides: Partial<RuntimeFacts> = {}): RuntimeFacts => ({
  name: 'Ralts',
  primary: { speciesId: 280, formKey: '' },
  fusion: null,
  catchRate: 235,
  hiddenAbilityId: 140,
  formKeys: ['', 'mega'],
  biomeId: 10,
  ...overrides,
});

describe('dossierFor', () => {
  test('resolve nome de hidden ability e de egg move pelos ids', () => {
    const dossier = dossierFor(facts(), tables);
    expect(dossier.hiddenAbility).toBe('Trace');
    expect(dossier.eggMoves).toEqual(['Memento', 'Encore']);
  });

  test('expoe as formas especiais reconhecidas', () => {
    expect(dossierFor(facts(), tables).forms.map((f) => f.label)).toEqual(['Mega']);
  });

  test('filtra as ocorrencias pelo bioma atual', () => {
    expect(dossierFor(facts(), tables).encounters).toHaveLength(1);
    expect(dossierFor(facts({ biomeId: 99 }), tables).encounters).toEqual([]);
  });

  test('bioma nulo omite so a raridade e preserva o resto', () => {
    const dossier = dossierFor(facts({ biomeId: null }), tables);
    expect(dossier.encounters).toEqual([]);
    expect(dossier.catchRate).toBe(235);
    expect(dossier.hiddenAbility).toBe('Trace');
  });

  test('hidden ability desconhecida vira null em vez de texto de preenchimento', () => {
    expect(dossierFor(facts({ hiddenAbilityId: 999 }), tables).hiddenAbility).toBeNull();
  });

  test('especie sem egg move devolve lista vazia', () => {
    expect(
      dossierFor(facts({ primary: { speciesId: 1, formKey: '' } }), tables).eggMoves,
    ).toEqual([]);
  });

  test('fusao mantem o nome composto e os fatos da especie primaria', () => {
    const dossier = dossierFor(
      facts({ name: 'Ralts/Gyarados', fusion: { speciesId: 130, formKey: '' } }),
      tables,
    );
    expect(dossier.name).toBe('Ralts/Gyarados');
    expect(dossier.catchRate).toBe(235);
  });
});
```

- [ ] **Passo 2: Rodar e confirmar que falham**

```bash
npx vitest run test/facts.test.ts test/dossier.test.ts
```

Esperado: FAIL nos dois, imports não resolvidos.

- [ ] **Passo 3: Escrever `src/game/facts.ts`**

```ts
import type { SpeciesRef } from '../domain/species-key';
import { formKeyOf, type PokeRoguePokemon } from './pokerogue';

export interface RuntimeFacts {
  name: string;
  primary: SpeciesRef;
  fusion: SpeciesRef | null;
  catchRate: number | null;
  hiddenAbilityId: number | null;
  formKeys: readonly string[];
  biomeId: number | null;
}

export function readRuntimeFacts(pokemon: PokeRoguePokemon, biomeId: number | null): RuntimeFacts {
  const species = pokemon.species;
  const fusionSpecies = pokemon.fusionSpecies;

  return {
    name: fusionSpecies ? `${species.name}/${fusionSpecies.name}` : species.name,
    primary: { speciesId: species.speciesId, formKey: formKeyOf(species, pokemon.formIndex) },
    fusion: fusionSpecies
      ? {
          speciesId: fusionSpecies.speciesId,
          formKey: formKeyOf(fusionSpecies, pokemon.fusionFormIndex),
        }
      : null,
    catchRate: species.catchRate || null,
    hiddenAbilityId: species.abilityHidden || null,
    formKeys: (species.forms ?? []).map((form) => form.formKey),
    biomeId,
  };
}
```

- [ ] **Passo 4: Escrever `src/domain/dossier.ts`**

```ts
import type { RuntimeFacts } from '../game/facts';
import { type BiomeIndex, type Encounter, encountersIn } from './biome';
import { formsOf, type SpecialForm } from './forms';
import { type ResolvedTiers, resolveTiers, type TierTable } from './tier-table';

export interface DossierTables {
  tiers: TierTable;
  eggMoves: Record<number, readonly number[]>;
  biomes: BiomeIndex;
  abilityNames: Record<number, string>;
  moveNames: Record<number, string>;
}

export interface Dossier {
  name: string;
  tiers: ResolvedTiers;
  hiddenAbility: string | null;
  eggMoves: readonly string[];
  forms: readonly SpecialForm[];
  encounters: readonly Encounter[];
  catchRate: number | null;
}

export function dossierFor(facts: RuntimeFacts, tables: DossierTables): Dossier {
  const speciesId = facts.primary.speciesId;

  return {
    name: facts.name,
    tiers: resolveTiers(tables.tiers, facts.primary, facts.fusion),
    hiddenAbility:
      facts.hiddenAbilityId === null ? null : (tables.abilityNames[facts.hiddenAbilityId] ?? null),
    eggMoves: (tables.eggMoves[speciesId] ?? []).flatMap((id) => tables.moveNames[id] ?? []),
    forms: formsOf(facts.formKeys),
    encounters: encountersIn(tables.biomes, speciesId, facts.biomeId),
    catchRate: facts.catchRate,
  };
}
```

`dossier.ts` importa de `game/facts` apenas o `type` — nenhum valor atravessa a fronteira, e
AD-10 continua valendo.

- [ ] **Passo 5: Rodar e confirmar que passam**

```bash
npx vitest run test/facts.test.ts test/dossier.test.ts
```

Esperado: PASS, 4 e 7 testes.

- [ ] **Passo 6: Confirmar o isolamento do domínio**

```bash
grep -rn "from '\.\./render\|phaser" src/domain/ ; echo "codigo: $?"
```

Esperado: nenhuma linha, `codigo: 1`. É AD-10.

- [ ] **Passo 7: Commit**

```bash
npm run format && npm run typecheck && npm test
git add src/game/facts.ts src/domain/dossier.ts test/facts.test.ts test/dossier.test.ts test/support/fake-pokerogue.ts
git commit -m "feat: montagem do dossie a partir de fatos e tabelas"
```

---

## Task A8: `domain/advice.ts`

**Arquivos:** criar `src/domain/advice.ts` e `test/advice.test.ts`.

**Interfaces:** consome `BiomeIndex` de A3 e `TeamProfile` de A6. Produz
`AdviceTables { biomes: BiomeIndex; allTypes: readonly number[] }`, `BiomeAdvice`,
`biomeAdvice(destination: number, profile: TeamProfile, tables: AdviceTables): BiomeAdvice`.

- [ ] **Passo 1: Escrever o teste que falha**

`test/advice.test.ts`:

```ts
import { describe, expect, test } from 'vitest';
import { type AdviceTables, biomeAdvice } from '../src/domain/advice';
import { profileOf } from '../src/domain/team';

const tables: AdviceTables = {
  biomes: {
    1: [{ biome: 5, rarity: 0, timeOfDay: 4 }],
    2: [{ biome: 5, rarity: 0, timeOfDay: 4 }],
    3: [{ biome: 5, rarity: 2, timeOfDay: 4 }],
    9: [{ biome: 7, rarity: 0, timeOfDay: 4 }],
  },
  allTypes: [10, 11, 12],
};

describe('biomeAdvice', () => {
  test('agrupa as especies do destino por raridade', () => {
    const advice = biomeAdvice(5, profileOf([]), tables);
    expect(advice.byRarity.get(0)).toEqual([1, 2]);
    expect(advice.byRarity.get(2)).toEqual([3]);
  });

  test('ignora especies de outros biomas', () => {
    expect([...biomeAdvice(5, profileOf([]), tables).byRarity.values()].flat()).not.toContain(9);
  });

  test('marca como novas as especies que o time nao tem', () => {
    const profile = profileOf([{ speciesId: 1, types: [10] }]);
    expect(biomeAdvice(5, profile, tables).newSpecies).toEqual([2, 3]);
  });

  test('lista os tipos que o time ainda nao cobre', () => {
    const profile = profileOf([{ speciesId: 1, types: [10, 11] }]);
    expect(biomeAdvice(5, profile, tables).missingTypes).toEqual([12]);
  });

  test('time vazio devolve o conteudo sem parte comparativa e sem lancar', () => {
    const advice = biomeAdvice(5, profileOf([]), tables);
    expect(advice.newSpecies).toEqual([]);
    expect(advice.missingTypes).toEqual([]);
    expect(advice.byRarity.size).toBe(2);
  });

  test('bioma sem especie devolve estrutura vazia', () => {
    const advice = biomeAdvice(99, profileOf([]), tables);
    expect(advice.byRarity.size).toBe(0);
    expect(advice.biome).toBe(99);
  });
});
```

- [ ] **Passo 2: Rodar e confirmar que falha**

```bash
npx vitest run test/advice.test.ts
```

Esperado: FAIL, `Failed to resolve import "../src/domain/advice"`.

- [ ] **Passo 3: Escrever `src/domain/advice.ts`**

```ts
import type { BiomeIndex } from './biome';
import type { TeamProfile } from './team';

export interface AdviceTables {
  biomes: BiomeIndex;
  allTypes: readonly number[];
}

export interface BiomeAdvice {
  biome: number;
  byRarity: ReadonlyMap<number, readonly number[]>;
  newSpecies: readonly number[];
  missingTypes: readonly number[];
}

export function biomeAdvice(
  destination: number,
  profile: TeamProfile,
  tables: AdviceTables,
): BiomeAdvice {
  const byRarity = new Map<number, number[]>();

  for (const [speciesId, encounters] of Object.entries(tables.biomes)) {
    for (const encounter of encounters) {
      if (encounter.biome !== destination) continue;
      const bucket = byRarity.get(encounter.rarity) ?? [];
      if (!bucket.includes(Number(speciesId))) bucket.push(Number(speciesId));
      byRarity.set(encounter.rarity, bucket);
    }
  }

  const present = [...byRarity.values()].flat().sort((a, b) => a - b);
  const empty = profile.species.size === 0;

  return {
    biome: destination,
    byRarity,
    newSpecies: empty ? [] : present.filter((speciesId) => !profile.species.has(speciesId)),
    missingTypes: empty ? [] : tables.allTypes.filter((type) => !profile.types.has(type)),
  };
}
```

Time vazio devolve as listas comparativas vazias em vez de "tudo é novo": sem time, a
comparação não tem significado, e inventar uma seria opinião disfarçada de fato — exatamente o
que a spec proíbe.

- [ ] **Passo 4: Rodar e confirmar que passa**

```bash
npx vitest run test/advice.test.ts
```

Esperado: PASS, 6 testes.

- [ ] **Passo 5: Commit**

```bash
npm run format && npm run typecheck && npm test
git add src/domain/advice.ts test/advice.test.ts
git commit -m "feat: cruzamento entre conteudo do bioma e time do jogador"
```

---

## Task A9: Badge clicável

**Arquivos:** modificar `src/game/phaser.ts`, `src/render/badge-layer.ts`,
`test/support/fake-phaser.ts`, `test/badge-layer.test.ts`.

**Interfaces:** `BadgeSpec` ganha `onClick?: () => void`. `TextObject` ganha
`setInteractive(): this` e `on(event: 'pointerdown', handler: () => void): this`.

- [ ] **Passo 1: Escrever o teste que falha**

Acrescente em `test/badge-layer.test.ts`:

```ts
describe('BadgeLayer clicavel', () => {
  test('badge com onClick vira interativa e chama o handler', () => {
    const layer = new BadgeLayer(scene);
    let chamou = 0;
    layer.reconcile([spec('a', { onClick: () => { chamou += 1; } })]);

    scene.created[0]?.click();

    expect(chamou).toBe(1);
    expect(scene.created[0]?.interactive).toBe(true);
  });

  test('badge sem onClick nao vira interativa', () => {
    const layer = new BadgeLayer(scene);
    layer.reconcile([spec('a')]);

    expect(scene.created[0]?.interactive).toBe(false);
  });

  test('reconciliar de novo mantem o clique funcionando', () => {
    const layer = new BadgeLayer(scene);
    let chamou = 0;
    const onClick = () => { chamou += 1; };
    layer.reconcile([spec('a', { onClick })]);
    layer.reconcile([spec('a', { onClick, text: 'outro' })]);

    scene.created[0]?.click();

    expect(scene.created).toHaveLength(1);
    expect(chamou).toBe(1);
  });
});
```

Em `test/support/fake-phaser.ts`, acrescente à `FakeText`:

```ts
  interactive = false;
  private handlers: Array<() => void> = [];

  setInteractive(): this {
    this.interactive = true;
    return this;
  }

  on(_event: 'pointerdown', handler: () => void): this {
    this.handlers.push(handler);
    return this;
  }

  click(): void {
    for (const handler of this.handlers) handler();
  }
```

- [ ] **Passo 2: Rodar e confirmar que falha**

```bash
npx vitest run test/badge-layer.test.ts
```

Esperado: FAIL, `onClick` não existe em `BadgeSpec`.

- [ ] **Passo 3: Ampliar o shim e o layer**

Em `src/game/phaser.ts`, acrescente a `TextObject`:

```ts
  setInteractive(): this;
  on(event: 'pointerdown', handler: () => void): this;
```

Em `src/render/badge-layer.ts`, acrescente `onClick?: () => void;` a `BadgeSpec` e, em
`create`, depois do `setScale(spec.scale)`:

```ts
    if (spec.onClick) {
      object.setInteractive().on('pointerdown', () => this.badges.get(spec.key)?.spec.onClick?.());
    }
```

O handler consulta o spec **atual** pelo `key` em vez de fechar sobre o `onClick` do momento da
criação. Sem isso, reconciliar com um handler novo deixaria o clique chamando o antigo — é o
bug que o terceiro teste cobre.

- [ ] **Passo 4: Rodar e confirmar que passa**

```bash
npx vitest run test/badge-layer.test.ts
```

Esperado: PASS, incluindo os 3 novos.

- [ ] **Passo 5: Commit**

```bash
npm run format && npm run typecheck && npm test
git add src/game/phaser.ts src/render/badge-layer.ts test/support/fake-phaser.ts test/badge-layer.test.ts
git commit -m "feat: badge aceita clique sem registrar tecla nova"
```

---

## Task A10: `render/hub.ts`

**Arquivos:** criar `src/render/hub.ts`, `test/hub.test.ts`; modificar `src/render/palette.ts`.

**Interfaces:** produz `interface Tab { id: string; label: string; lines: readonly string[] }` e
`class Hub { open(owner, tabs): void; select(id): void; close(): void; get size(): number; get openFor(): DisplayContainer | null }`.

- [ ] **Passo 1: Escrever o teste que falha**

`test/hub.test.ts`:

```ts
import { beforeEach, describe, expect, test } from 'vitest';
import { Hub, type Tab } from '../src/render/hub';
import { type FakeContainer, FakeScene } from './support/fake-phaser';

let scene: FakeScene;
let owner: FakeContainer;

beforeEach(() => {
  scene = new FakeScene();
  owner = scene.makeContainer();
});

const tabs: Tab[] = [
  { id: 'dossie', label: 'Dossie', lines: ['Ralts', 'LC -> OU'] },
  { id: 'formas', label: 'Formas', lines: ['Mega'] },
];

describe('Hub', () => {
  test('fechado nao existe objeto nenhum na cena', () => {
    const hub = new Hub(scene);
    expect(hub.size).toBe(0);
    expect(hub.openFor).toBeNull();
  });

  test('abrir desenha rotulos das abas e as linhas da primeira', () => {
    const hub = new Hub(scene);
    hub.open(owner, tabs);

    expect(hub.size).toBe(4);
    expect(hub.openFor).toBe(owner);
  });

  test('trocar de aba nao recria os rotulos das abas', () => {
    const hub = new Hub(scene);
    hub.open(owner, tabs);
    const rotulos = scene.created.filter((o) => o.text === 'Dossie' || o.text === 'Formas');

    hub.select('formas');

    expect(rotulos.every((o) => !o.destroyed)).toBe(true);
    expect(hub.size).toBe(3);
  });

  test('abrir para outro dono fecha o anterior', () => {
    const hub = new Hub(scene);
    const outro = scene.makeContainer();
    hub.open(owner, tabs);

    hub.open(outro, tabs);

    expect(owner.children).toHaveLength(0);
    expect(hub.openFor).toBe(outro);
  });

  test('close destroi tudo e zera a contagem', () => {
    const hub = new Hub(scene);
    hub.open(owner, tabs);

    hub.close();

    expect(hub.size).toBe(0);
    expect(hub.openFor).toBeNull();
    expect(owner.children).toHaveLength(0);
    expect(scene.created.every((o) => o.destroyed)).toBe(true);
  });

  test('abrir e fechar vinte vezes nao deixa objeto orfao', () => {
    const hub = new Hub(scene);

    for (let round = 0; round < 20; round += 1) {
      hub.open(owner, tabs);
      hub.close();
    }

    expect(hub.size).toBe(0);
    expect(owner.children).toHaveLength(0);
  });

  test('selecionar aba inexistente nao muda nada', () => {
    const hub = new Hub(scene);
    hub.open(owner, tabs);
    const antes = hub.size;

    hub.select('nao-existe');

    expect(hub.size).toBe(antes);
  });
});
```

- [ ] **Passo 2: Rodar e confirmar que falha**

```bash
npx vitest run test/hub.test.ts
```

Esperado: FAIL, `Failed to resolve import "../src/render/hub"`.

- [ ] **Passo 3: Escrever `src/render/hub.ts`**

```ts
import type { DisplayContainer, Scene, TextObject } from '../game/phaser';
import { HUB_DEPTH, hubBodyStyle, hubTabStyle } from './palette';

export interface Tab {
  id: string;
  label: string;
  lines: readonly string[];
}

const LINE_HEIGHT = 14;
const ORIGIN = { x: 10, y: 10 };
const BODY_TOP = ORIGIN.y + LINE_HEIGHT;
const SCALE = 0.2;

export class Hub {
  private owner: DisplayContainer | null = null;
  private tabs: readonly Tab[] = [];
  private tabObjects: TextObject[] = [];
  private bodyObjects: TextObject[] = [];

  constructor(private readonly scene: Scene) {}

  get size(): number {
    return this.tabObjects.length + this.bodyObjects.length;
  }

  get openFor(): DisplayContainer | null {
    return this.owner;
  }

  open(owner: DisplayContainer, tabs: readonly Tab[]): void {
    this.close();
    if (tabs.length === 0) return;

    this.owner = owner;
    this.tabs = tabs;

    tabs.forEach((tab, index) => {
      const object = this.scene.add
        .text(ORIGIN.x + index * 40, ORIGIN.y, tab.label, hubTabStyle())
        .setOrigin(0, 0)
        .setDepth(HUB_DEPTH)
        .setScale(SCALE)
        .setInteractive()
        .on('pointerdown', () => this.select(tab.id));

      owner.add(object);
      this.tabObjects.push(object);
    });

    this.renderBody(tabs[0]?.lines ?? []);
  }

  select(id: string): void {
    const tab = this.tabs.find((candidate) => candidate.id === id);
    if (!tab) return;
    this.renderBody(tab.lines);
  }

  close(): void {
    for (const object of [...this.tabObjects, ...this.bodyObjects]) {
      this.owner?.remove(object);
      object.destroy();
    }
    this.tabObjects = [];
    this.bodyObjects = [];
    this.tabs = [];
    this.owner = null;
  }

  private renderBody(lines: readonly string[]): void {
    const owner = this.owner;
    if (!owner) return;

    for (const object of this.bodyObjects) {
      owner.remove(object);
      object.destroy();
    }
    this.bodyObjects = [];

    lines.forEach((line, index) => {
      const object = this.scene.add
        .text(ORIGIN.x, BODY_TOP + index * LINE_HEIGHT, line, hubBodyStyle())
        .setOrigin(0, 0)
        .setDepth(HUB_DEPTH)
        .setScale(SCALE);

      owner.add(object);
      this.bodyObjects.push(object);
    });
  }
}
```

`open` chama `close` primeiro: é o que dá AD-20 em batalha dupla sem nenhuma coordenação entre
badges. `renderBody` só toca no corpo, e é o que dá AD-19.

Em `src/render/palette.ts`, acrescente:

```ts
export const HUB_DEPTH = 1001;

export function hubTabStyle(): TextStyle {
  return {
    fontFamily: 'emerald',
    fontSize: '48px',
    color: '#fbbf24',
    backgroundColor: '#18181bee',
    padding: { x: 4, y: 2 },
  };
}

export function hubBodyStyle(): TextStyle {
  return {
    fontFamily: 'emerald',
    fontSize: '48px',
    color: '#ffffff',
    backgroundColor: '#18181bdd',
    padding: { x: 4, y: 2 },
  };
}
```

- [ ] **Passo 4: Rodar e confirmar que passa**

```bash
npx vitest run test/hub.test.ts
```

Esperado: PASS, 7 testes.

- [ ] **Passo 5: Commit**

```bash
npm run format && npm run typecheck && npm test
git add src/render/hub.ts src/render/palette.ts test/hub.test.ts
git commit -m "feat: hub com abas como unica superficie de interacao"
```

---

## Task A11: Batalha e starter

**Arquivos:** criar `src/surfaces/tabs.ts`, `test/tabs.test.ts`; modificar
`src/surfaces/battle-surface.ts`, `src/surfaces/starter-surface.ts`, `src/bootstrap.ts`,
`src/main.ts`.

**Interfaces:** produz `dossierTabs(dossier: Dossier, biomeNames: Record<number, string>): Tab[]`.

- [ ] **Passo 1: Escrever o teste que falha**

`test/tabs.test.ts`:

```ts
import { describe, expect, test } from 'vitest';
import type { Dossier } from '../src/domain/dossier';
import { dossierTabs } from '../src/surfaces/tabs';

const dossier = (overrides: Partial<Dossier> = {}): Dossier => ({
  name: 'Ralts',
  tiers: { tier: 'LC', bestTier: 'OU', bestName: 'Gardevoir' },
  hiddenAbility: 'Trace',
  eggMoves: ['Memento'],
  forms: [{ key: 'mega', label: 'Mega' }],
  encounters: [{ biome: 10, rarity: 2, timeOfDay: 4 }],
  catchRate: 235,
  ...overrides,
});

describe('dossierTabs', () => {
  test('monta as abas de dossie e formas', () => {
    expect(dossierTabs(dossier(), { 10: 'Town' }).map((t) => t.id)).toEqual(['dossie', 'formas']);
  });

  test('especie sem forma especial nao ganha aba de formas', () => {
    expect(dossierTabs(dossier({ forms: [] }), {}).map((t) => t.id)).toEqual(['dossie']);
  });

  test('campo vazio nao vira linha nem texto de preenchimento', () => {
    const tabs = dossierTabs(dossier({ hiddenAbility: null, eggMoves: [], encounters: [] }), {});
    const linhas = tabs[0]?.lines ?? [];
    expect(linhas.join(' ')).not.toMatch(/desconhecid|\?\?\?/i);
    expect(linhas).toHaveLength(3);
  });

  test('bioma sem nome na tabela nao produz linha de raridade', () => {
    const linhas = dossierTabs(dossier(), {})[0]?.lines ?? [];
    expect(linhas.some((l) => /Town/.test(l))).toBe(false);
  });
});
```

- [ ] **Passo 2: Rodar e confirmar que falha**

```bash
npx vitest run test/tabs.test.ts
```

Esperado: FAIL, import não resolvido.

- [ ] **Passo 3: Escrever `src/surfaces/tabs.ts`**

```ts
import type { Dossier } from '../domain/dossier';
import { fullLabel } from '../render/label';
import type { Tab } from '../render/hub';

const RARITY = ['Common', 'Uncommon', 'Rare', 'Super Rare', 'Ultra Rare', 'Boss'] as const;

export function dossierTabs(dossier: Dossier, biomeNames: Record<number, string>): Tab[] {
  const lines = [dossier.name, fullLabel(dossier.tiers)];

  if (dossier.hiddenAbility) lines.push(`HA ${dossier.hiddenAbility}`);
  if (dossier.eggMoves.length > 0) lines.push(`Egg ${dossier.eggMoves.join(', ')}`);

  for (const encounter of dossier.encounters) {
    const biome = biomeNames[encounter.biome];
    const rarity = RARITY[encounter.rarity];
    if (biome && rarity) lines.push(`${biome} ${rarity}`);
  }

  if (dossier.catchRate !== null) lines.push(`Catch ${dossier.catchRate}`);

  const tabs: Tab[] = [{ id: 'dossie', label: 'Dossie', lines }];

  if (dossier.forms.length > 0) {
    tabs.push({ id: 'formas', label: 'Formas', lines: dossier.forms.map((form) => form.label) });
  }

  return tabs;
}
```

- [ ] **Passo 4: Ligar nas surfaces**

`src/surfaces/battle-surface.ts` passa a receber hub e tabelas, e a badge ganha `onClick`:

```ts
import { dossierFor, type DossierTables } from '../domain/dossier';
import { readBattleTargets } from '../game/battle';
import type { GameContext } from '../game/context';
import { readRuntimeFacts } from '../game/facts';
import type { BadgeLayer } from '../render/badge-layer';
import type { Hub } from '../render/hub';
import { fullLabel } from '../render/label';
import { badgeSpecsFor } from './badge-specs';
import type { Surface } from './surface';
import { dossierTabs } from './tabs';

export class BattleSurface implements Surface {
  readonly name = 'battle';

  constructor(
    private readonly layer: BadgeLayer,
    private readonly hub: Hub,
    private readonly tables: DossierTables,
    private readonly biomeNames: Record<number, string>,
  ) {}

  matches(context: GameContext): boolean {
    return context.scene.currentBattle !== null;
  }

  sync(context: GameContext): void {
    const enemies = context.scene.getEnemyField();
    const biomeId = context.scene.arena?.biomeType ?? null;
    const specs = badgeSpecsFor(readBattleTargets(context.scene), this.tables.tiers, fullLabel);

    this.layer.reconcile(
      specs.map((spec, index) => {
        const enemy = enemies[index];
        if (!enemy) return spec;
        return {
          ...spec,
          onClick: () => {
            if (this.hub.openFor === spec.parent) {
              this.hub.close();
              return;
            }
            const dossier = dossierFor(readRuntimeFacts(enemy, biomeId), this.tables);
            this.hub.open(spec.parent, dossierTabs(dossier, this.biomeNames));
          },
        };
      }),
    );
  }

  clear(): void {
    this.layer.clear();
    this.hub.close();
  }
}
```

`StarterSurface` recebe o mesmo tratamento, usando `readStarterTargets` e o container do
starter como dono do hub. `bootstrap.ts` cria um `Hub` único, compartilhado pelas duas
surfaces — é o que garante que abrir numa tela feche o que estava aberto na outra:

```ts
function overlayFor(scene: BattleScene, tables: DossierTables): Overlay {
  const hub = new Hub(scene);

  return new Overlay(
    [
      new BattleSurface(new BadgeLayer(scene), hub, tables, BIOME_NAMES),
      new StarterSurface(new BadgeLayer(scene), hub, tables, BIOME_NAMES),
    ],
    () => contextOf(scene),
  );
}
```

`startOverlay` passa a receber `DossierTables` em vez de `TierTable`; ajuste a assinatura e o
`src/main.ts`, que monta as tabelas a partir dos quatro arquivos gerados.

- [ ] **Passo 5: Rodar tudo**

```bash
npm test && npm run typecheck
```

Esperado: PASS em todos os arquivos, incluindo `test/overlay.test.ts`, que já cobre AD-23
(`clear` chamado exatamente uma vez ao sair da tela).

- [ ] **Passo 6: Commit**

```bash
npm run format
git add src/surfaces src/bootstrap.ts src/main.ts test/tabs.test.ts
git commit -m "feat: hub ligado nas surfaces de batalha e de starter"
```

---

## Task A12: Escolha de bioma

**Arquivos:** criar `src/surfaces/biome-surface.ts`, `test/biome-surface.test.ts`; modificar
`src/bootstrap.ts`.

Esta tarefa é incremento sobre um produto que já funciona. O handler da tela de escolha é
descoberto em jogo, como foi feito para `StarterSelectUiHandler` na v2.

- [ ] **Passo 1: Descobrir o handler da tela de escolha**

```bash
npm run launch
```

Chegue a uma escolha de bioma e rode no console:

```js
const s = window.__p.game.scene.getScene('battle');
s.ui.handlers[s.ui.mode].constructor.name
```

Anote o nome — ele vira a constante `BIOME_SELECT_HANDLER`, no mesmo padrão de
`STARTER_SELECT_HANDLER` em `starter-surface.ts`.

- [ ] **Passo 2: Escrever o teste que falha**

`test/biome-surface.test.ts` cobre a montagem das abas, que é a parte com regra:

```ts
import { describe, expect, test } from 'vitest';
import { biomeAdvice } from '../src/domain/advice';
import { profileOf } from '../src/domain/team';
import { adviceTabs } from '../src/surfaces/biome-surface';

const tables = {
  biomes: { 1: [{ biome: 5, rarity: 0, timeOfDay: 4 }], 2: [{ biome: 7, rarity: 2, timeOfDay: 4 }] },
  allTypes: [10, 11],
};

const names = { 5: 'Forest', 7: 'Lake' };
const speciesNames = { 1: 'Bulbasaur', 2: 'Squirtle' };

describe('adviceTabs', () => {
  test('monta uma aba por destino', () => {
    const advices = [5, 7].map((d) => biomeAdvice(d, profileOf([]), tables));
    expect(adviceTabs(advices, names, speciesNames, {}).map((t) => t.label)).toEqual(['Forest', 'Lake']);
  });

  test('destino sem especie ainda produz aba, com corpo vazio', () => {
    const advices = [biomeAdvice(99, profileOf([]), tables)];
    expect(adviceTabs(advices, names, speciesNames, {})[0]?.lines).toEqual([]);
  });

  test('nenhum destino produz nenhuma aba', () => {
    expect(adviceTabs([], names, speciesNames, {})).toEqual([]);
  });
});
```

- [ ] **Passo 3: Rodar e confirmar que falha**

```bash
npx vitest run test/biome-surface.test.ts
```

Esperado: FAIL, import não resolvido.

- [ ] **Passo 4: Escrever `src/surfaces/biome-surface.ts`**

```ts
import type { BiomeAdvice } from '../domain/advice';
import type { Tab } from '../render/hub';

const RARITY = ['Common', 'Uncommon', 'Rare', 'Super Rare', 'Ultra Rare', 'Boss'] as const;

export function adviceTabs(
  advices: readonly BiomeAdvice[],
  biomeNames: Record<number, string>,
  speciesNames: Record<number, string>,
  typeNames: Record<number, string>,
): Tab[] {
  return advices.map((advice) => {
    const lines: string[] = [];

    for (const [rarity, speciesIds] of [...advice.byRarity].sort(([a], [b]) => a - b)) {
      const label = RARITY[rarity];
      const named = speciesIds.flatMap((id) => speciesNames[id] ?? []);
      if (label && named.length > 0) lines.push(`${label}: ${named.join(', ')}`);
    }

    if (advice.newSpecies.length > 0) lines.push(`Novos: ${advice.newSpecies.length}`);

    const missing = advice.missingTypes.flatMap((type) => typeNames[type] ?? []);
    if (missing.length > 0) lines.push(`Time sem: ${missing.join(', ')}`);

    return {
      id: String(advice.biome),
      label: biomeNames[advice.biome] ?? String(advice.biome),
      lines,
    };
  });
}
```

A classe `BiomeSurface` segue o padrão de `StarterSurface`: `matches` compara
`context.handlerName` com `BIOME_SELECT_HANDLER`, `sync` monta os `advices` com
`destinationsFrom` mais `readTeam`, e `clear` fecha o hub.

- [ ] **Passo 5: Rodar, ligar no bootstrap e verificar em jogo**

```bash
npx vitest run test/biome-surface.test.ts && npm test
npm run build && npm run launch
```

Esperado: PASS, e o hub abrindo na tela de escolha de bioma. **Screenshot.**

- [ ] **Passo 6: Commit**

```bash
npm run format && npm run typecheck
git add src/surfaces/biome-surface.ts src/bootstrap.ts test/biome-surface.test.ts
git commit -m "feat: hub na escolha de bioma cruzando destino com o time"
```

---

## Task A13: Workflow de drift

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
          game=$(gh api repos/pagefaultgames/pokerogue/commits/main --jq .sha)
          loc=$(gh api repos/pagefaultgames/pokerogue-locales/commits/main --jq .sha)
          node -e "
            const f=require('fs'), p='data/pokerogue-source.json';
            const o=JSON.parse(f.readFileSync(p,'utf8'));
            o.pokerogue.commit=process.argv[1];
            o.locales.commit=process.argv[2];
            f.writeFileSync(p, JSON.stringify(o,null,2)+'\n');
          " "$game" "$loc"

      - run: npm run build:data

      - uses: peter-evans/create-pull-request@v7
        with:
          branch: data-drift
          title: 'chore: atualizar tabelas geradas do PokeRogue'
          commit-message: 'chore: atualizar tabelas geradas do PokeRogue'
          body: |
            Gerado pelo workflow `data-drift`.
            Revise o diff antes do merge — o overlay nao se atualiza sozinho a partir de codigo de terceiro.
```

`create-pull-request` não abre PR quando não há diff, então semana sem mudança upstream não
gera ruído. O PR dispara o `ci.yml` existente, que atende AD-25.

- [ ] **Passo 2: Testar com pins antigos**

Aponte `data/pokerogue-source.json` para SHAs de alguns meses atrás num branch, e dispare o
workflow pelo `workflow_dispatch` na aba Actions.

Esperado: PR aberto com diff não vazio em `data/*.generated.ts`, com o CI rodando nele.

- [ ] **Passo 3: Commit**

```bash
git add .github/workflows/data-drift.yml
git commit -m "ci: workflow semanal de drift das tabelas geradas"
```

---

## Task A14: Verificação em jogo

Sem screenshot, nenhum item está pronto. É o padrão que a v2 estabeleceu na V9.

- [ ] **Passo 1: Subir o jogo com o bundle**

```bash
npm run build && npm run launch
```

- [ ] **Passo 2: Batalha simples**

Clique na badge do inimigo. **Screenshot.** O hub não pode cobrir a HUD nem a caixa de diálogo
(AD-21). Clique de novo e confirme que fecha (AD-18).

- [ ] **Passo 3: Batalha dupla**

Clique na badge do primeiro inimigo, depois na do segundo. **Screenshot de cada.** Abrir a
segunda tem que fechar a primeira (AD-20).

- [ ] **Passo 4: Starter com forma especial**

Na seleção de starter, clique na badge de uma espécie com mega — Venusaur, Charizard ou
Gardevoir. **Screenshot** da aba Formas (AD-15).

- [ ] **Passo 5: Escolha de bioma**

Numa escolha de bioma, abra o hub e percorra as abas de destino. **Screenshot.**

- [ ] **Passo 6: Celular**

```bash
npm run launch -- --late
```

Redimensione para 390×844 e repita o passo 2. **Screenshot.** O hub deve continuar legível sem
código de layout específico (AD-22).

- [ ] **Passo 7: Espécie sem egg move**

Abra o hub de uma espécie sem egg move. **Screenshot.** A linha não existe, e não há texto de
preenchimento no lugar (AD-11).

- [ ] **Passo 8: Commit das evidências**

```bash
git add docs/
git commit -m "docs: screenshots de verificacao em jogo do hub"
```

---

## Task A15: Licença, bundle e publicação

**Arquivos:** modificar `LICENSE`, `package.json`, `vite.config.ts`, `README.md`.

- [ ] **Passo 1: Trocar a licença**

Substitua `LICENSE` pelo texto integral da AGPL-3.0-only
(<https://www.gnu.org/licenses/agpl-3.0.txt>) e, em `package.json`, troque `"license": "MIT"`
por `"license": "AGPL-3.0-only"`.

- [ ] **Passo 2: Acompanhar no bloco de metadados**

Em `vite.config.ts`, dentro de `userscript`, troque `license: 'MIT'` por
`license: 'AGPL-3.0-only'`.

- [ ] **Passo 3: Creditar as fontes no README**

```markdown
## De onde vêm os dados

Tiers do Smogon via [`@pkmn/dex`](https://github.com/pkmn/ps) (MIT).

Egg moves, pools de bioma, grafo de destinos e os nomes exibidos são gerados de
[`pagefaultgames/pokerogue`](https://github.com/pagefaultgames/pokerogue) e
[`pagefaultgames/pokerogue-locales`](https://github.com/pagefaultgames/pokerogue-locales),
ambos AGPL-3.0-only. Por isso este projeto também é AGPL-3.0-only.

A fonte da verdade é o código do jogo, não a wiki nem o fórum: onde os dois divergirem, vale o
que efetivamente roda. As tabelas geradas são atualizadas por um workflow semanal que abre PR
quando o upstream muda.
```

Documente também que o hub abre no clique da badge, e o que cada aba mostra.

- [ ] **Passo 4: Verificar o bundle**

```bash
npm run build && wc -c dist/pokerogue-tier-overlay.user.js
grep -c "@require" dist/pokerogue-tier-overlay.meta.js; echo "esperado: 0"
```

Esperado: abaixo de 512000 bytes (AD-8) e nenhum `@require` (AD-7).

- [ ] **Passo 5: Suíte completa**

```bash
npm run lint && npm run typecheck && npm test && npm run build
```

Esperado: tudo verde (AD-26).

- [ ] **Passo 6: Commit**

```bash
git add LICENSE package.json vite.config.ts README.md
git commit -m "docs: relicencia para AGPL-3.0-only e credita as fontes upstream"
```

---

## Depois deste plano

Publicar no Greasyfork é passo manual seu — não consigo autenticar na sua conta.

Slice B (busca por atalho) não desenha UI nova: empurra outra aba para dentro do mesmo `Hub`,
alimentada pelo `StarterSelectUiHandler.allSpecies` que já foi mapeado em runtime.
