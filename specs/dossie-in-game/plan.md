# Plano de implementação — dossiê in-game

> **Para quem for executar:** siga tarefa por tarefa, com os passos na ordem. Cada passo é uma
> ação de 2 a 5 minutos. Os checkboxes servem para acompanhar.

**Objetivo:** exibir, num painel aberto por tecla durante a batalha, a hidden ability, os egg
moves, a raridade da espécie no bioma atual e a catch rate do Pokémon inimigo.

**Arquitetura:** domínio puro (`src/domain/`) não conhece Phaser; render (`src/render/`) não
conhece regra. Dados que o objeto de runtime já entrega são lidos de lá; o resto vem de tabelas
geradas em build time a partir de dois repositórios upstream pinados.

**Stack:** TypeScript strict, Vite + `vite-plugin-monkey`, Vitest, Biome, `tsx` para os
geradores, Puppeteer para verificação em jogo.

## Restrições globais

Valem para toda tarefa, sem repetição em cada uma.

- `npm run typecheck` roda com `strict`, `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`
  e `verbatimModuleSyntax`. Índice de array e de `Record` retorna `T | undefined`.
- `npm run lint` é Biome. Rode `npm run format` antes de commitar.
- **Nenhum comentário no código.** É decisão explícita do autor, registrada na spec da v2.
- Nomes de teste em português, no estilo dos testes existentes: `test('cria uma badge por spec e anexa ao container do jogo', ...)`.
- Ficheiros gerados vão em `data/*.generated.ts` e são commitados.
- Não adicione fallback, camada de compatibilidade, nem `try/catch` sem recuperação real.
- Falha do gerador é falha: nunca emita tabela parcial.

---

## Task A1: Resolver das duas fontes upstream

**Arquivos:**
- Criar: `data/pokerogue-source.json`
- Criar: `tools/upstream.mts`
- Criar: `tools/stubs/terrain.ts`
- Criar: `tools/pokerogue.tsconfig.json`
- Criar: `tools/build-pokerogue-data.mts`
- Criar: `test/upstream.test.ts`
- Modificar: `package.json`, `.gitignore`

**Interfaces:**
- Produz: `readPins(): Pins` e `fetchUpstream(name: string, pin: Pin, sparse: readonly string[]): string`
  (devolve o caminho local do checkout). `Pin = { repo: string; commit: string }`,
  `Pins = { pokerogue: Pin; locales: Pin }`.

- [ ] **Passo 1: Escrever o teste que falha**

Cria `test/upstream.test.ts`. O teste cobre só a parte pura — validação dos pins. A parte de
rede é verificada rodando o script, no passo 7.

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
    expect(() => parsePins('{"pokerogue":{"repo":"a/b"},"locales":{"repo":"c/d","commit":"x"}}')).toThrow(
      /pokerogue/,
    );
  });

  test('recusa arquivo sem um dos repositorios', () => {
    expect(() => parsePins('{"pokerogue":{"repo":"a/b","commit":"abc"}}')).toThrow(/locales/);
  });
});
```

- [ ] **Passo 2: Rodar o teste e confirmar que falha**

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
ausente ou repositório errado abortam ali — é o AD-3, sem `try/catch`.

- [ ] **Passo 4: Rodar o teste e confirmar que passa**

```bash
npx vitest run test/upstream.test.ts
```

Esperado: PASS, 3 testes.

- [ ] **Passo 5: Criar o pin, o stub e o tsconfig do gerador**

`data/pokerogue-source.json` — descubra os SHAs de HEAD com
`gh api repos/pagefaultgames/pokerogue/commits/main --jq .sha` e o equivalente para
`pokerogue-locales`, e cole:

```json
{
  "pokerogue": { "repo": "pagefaultgames/pokerogue", "commit": "COLE_O_SHA_AQUI" },
  "locales": { "repo": "pagefaultgames/pokerogue-locales", "commit": "COLE_O_SHA_AQUI" }
}
```

`tools/stubs/terrain.ts` — os arquivos de bioma importam `TerrainType` de `#data/terrain`, que
por transitividade puxa `i18next`, `#app/messages` e `#field/pokemon`, e quebra em Node. O stub
reexporta só o enum, com os mesmos valores do upstream:

```ts
export enum TerrainType {
  NONE,
  MISTY,
  ELECTRIC,
  GRASSY,
  PSYCHIC,
}
```

`tools/pokerogue.tsconfig.json` — mapeia os aliases do upstream e desvia o módulo contaminado:

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

A ordem importa: `#data/terrain` vem antes de `#data/*` para ganhar da regra genérica.

`.gitignore` — acrescente:

```
.upstream/
```

- [ ] **Passo 6: Escrever o esqueleto do gerador**

`tools/build-pokerogue-data.mts`. Nesta tarefa ele só resolve as fontes e conta.

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

const biomeFiles = readdirSync(`${game}/src/data/balance/biomes`).filter((f) => f.endsWith('.ts'));
const abilityNames = Object.keys(JSON.parse(readFileSync(`${locales}/en/ability.json`, 'utf8')));

process.stdout.write(`${biomeFiles.length} biomas e ${abilityNames.length} chaves de ability\n`);
```

- [ ] **Passo 7: Registrar o script e rodar o gerador**

Em `package.json`, dentro de `scripts`, ao lado de `build:tiers`:

```json
"build:data": "tsx --tsconfig tools/pokerogue.tsconfig.json tools/build-pokerogue-data.mts",
```

```bash
npm run build:data
```

Esperado: uma linha como `31 biomas e 300+ chaves de ability`. Rode de novo e confirme que a
saída é idêntica — é AD-2 na prática.

- [ ] **Passo 8: Confirmar que pin inválido aborta**

```bash
node -e "const f=require('fs');const p='data/pokerogue-source.json';const o=JSON.parse(f.readFileSync(p));o.pokerogue.commit='0000000000000000000000000000000000000000';f.writeFileSync(p+'.bak',f.readFileSync(p));f.writeFileSync(p,JSON.stringify(o,null,2))" && npm run build:data; echo "saida: $?"; mv data/pokerogue-source.json.bak data/pokerogue-source.json
```

Esperado: o comando falha com saída diferente de `0` e o erro do `git` aparece. O pin original
é restaurado ao final.

- [ ] **Passo 9: Commit**

```bash
npm run format && npm run typecheck && npm test
git add data/pokerogue-source.json tools/upstream.mts tools/stubs tools/pokerogue.tsconfig.json tools/build-pokerogue-data.mts test/upstream.test.ts package.json .gitignore
git commit -m "feat: resolver das fontes upstream pinadas do pokerogue"
```

---

## Task A2: Tabela de egg moves

**Arquivos:**
- Modificar: `tools/build-pokerogue-data.mts`
- Criar: `data/egg-moves.generated.ts` (gerado)
- Criar: `test/egg-moves-data.test.ts`

**Interfaces:**
- Consome: `fetchUpstream`, `readPins` de A1.
- Produz: `export const EGG_MOVES: Record<number, readonly number[]>` em
  `data/egg-moves.generated.ts`, chave `speciesId`, valor lista de `moveId`.

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

  test('todo valor e uma lista nao vazia de ids de move', () => {
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

- [ ] **Passo 2: Rodar o teste e confirmar que falha**

```bash
npx vitest run test/egg-moves-data.test.ts
```

Esperado: FAIL, `Failed to resolve import "../data/egg-moves.generated"`.

- [ ] **Passo 3: Emitir a tabela**

Em `tools/build-pokerogue-data.mts`, troque a linha de `process.stdout.write` por:

```ts
import { writeFileSync } from 'node:fs';

const eggModule = (await import(`${game}/src/data/balance/moves/egg-moves.ts`)) as {
  speciesEggMoves: Record<number, readonly number[]>;
};

const eggMoves: Record<number, readonly number[]> = {};
for (const [speciesId, moves] of Object.entries(eggModule.speciesEggMoves)) {
  if (moves.length > 0) eggMoves[Number(speciesId)] = moves;
}

writeFileSync(
  new URL('../data/egg-moves.generated.ts', import.meta.url),
  `export const EGG_MOVES: Record<number, readonly number[]> = ${JSON.stringify(eggMoves)};\n`,
);

process.stdout.write(`${Object.keys(eggMoves).length} especies em data/egg-moves.generated.ts\n`);
```

- [ ] **Passo 4: Gerar e rodar o teste**

```bash
npm run build:data && npx vitest run test/egg-moves-data.test.ts
```

Esperado: a contagem impressa, depois PASS com 4 testes.

- [ ] **Passo 5: Confirmar reprodutibilidade**

```bash
npm run build:data && git diff --exit-code data/egg-moves.generated.ts && echo "identico"
```

Esperado: `identico`.

- [ ] **Passo 6: Commit**

```bash
npm run format && npm run typecheck && npm test
git add tools/build-pokerogue-data.mts data/egg-moves.generated.ts test/egg-moves-data.test.ts
git commit -m "feat: tabela de egg moves gerada do upstream"
```

---

## Task A3: Índice invertido de biomas

**Arquivos:**
- Criar: `src/domain/biome.ts`
- Criar: `test/biome.test.ts`
- Modificar: `tools/build-pokerogue-data.mts`
- Criar: `data/biome-index.generated.ts` (gerado)
- Criar: `test/biome-index-data.test.ts`

**Interfaces:**
- Produz: `interface Encounter { biome: number; rarity: number; timeOfDay: number }`,
  `type BiomeIndex = Record<number, readonly Encounter[]>`,
  `encountersIn(index: BiomeIndex, speciesId: number, biomeId: number | null): readonly Encounter[]`.
  Em `data/biome-index.generated.ts`: `export const BIOME_INDEX: BiomeIndex`.

- [ ] **Passo 1: Escrever o teste do domínio**

`test/biome.test.ts`:

```ts
import { describe, expect, test } from 'vitest';
import { type BiomeIndex, encountersIn } from '../src/domain/biome';

const index: BiomeIndex = {
  1: [
    { biome: 10, rarity: 0, timeOfDay: 4 },
    { biome: 10, rarity: 2, timeOfDay: 1 },
    { biome: 20, rarity: 4, timeOfDay: 4 },
  ],
  2: [],
};

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

export function encountersIn(
  index: BiomeIndex,
  speciesId: number,
  biomeId: number | null,
): readonly Encounter[] {
  if (biomeId === null) return [];
  return (index[speciesId] ?? []).filter((encounter) => encounter.biome === biomeId);
}
```

- [ ] **Passo 4: Rodar e confirmar que passa**

```bash
npx vitest run test/biome.test.ts
```

Esperado: PASS, 5 testes.

- [ ] **Passo 5: Escrever o teste da tabela gerada**

`test/biome-index-data.test.ts`:

```ts
import { describe, expect, test } from 'vitest';
import { BIOME_INDEX } from '../data/biome-index.generated';
import { encountersIn } from '../src/domain/biome';

const entries = Object.entries(BIOME_INDEX);

describe('indice de biomas gerado', () => {
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
    for (const [key, encounters] of entries) {
      expect(encounters.length, key).toBeGreaterThan(0);
    }
  });

  test('Krabby aparece na praia', () => {
    const beach = Object.values(BIOME_INDEX)
      .flat()
      .filter((e) => e.biome === BIOME_INDEX[98]?.[0]?.biome);
    expect(beach.length).toBeGreaterThan(0);
    expect(encountersIn(BIOME_INDEX, 98, BIOME_INDEX[98]?.[0]?.biome ?? -1).length).toBeGreaterThan(0);
  });
});
```

- [ ] **Passo 6: Rodar e confirmar que falha**

```bash
npx vitest run test/biome-index-data.test.ts
```

Esperado: FAIL, `Failed to resolve import "../data/biome-index.generated"`.

- [ ] **Passo 7: Emitir o índice invertido**

Acrescente em `tools/build-pokerogue-data.mts`, antes do `process.stdout.write` final:

```ts
import type { BiomeIndex, Encounter } from '../src/domain/biome';

interface UpstreamBiome {
  biomeId: number;
  pokemonPool: Record<string, Record<string, readonly number[]>>;
}

const biomeIndex: Record<number, Encounter[]> = {};

for (const file of biomeFiles) {
  const loaded = (await import(`${game}/src/data/balance/biomes/${file}`)) as Record<string, unknown>;
  const biome = Object.values(loaded).find(
    (value): value is UpstreamBiome =>
      typeof value === 'object' && value !== null && 'biomeId' in value && 'pokemonPool' in value,
  );
  if (!biome) throw new Error(`bioma sem export reconhecivel: ${file}`);

  for (const [rarity, byTime] of Object.entries(biome.pokemonPool)) {
    for (const [timeOfDay, speciesIds] of Object.entries(byTime)) {
      for (const speciesId of speciesIds) {
        (biomeIndex[speciesId] ??= []).push({
          biome: biome.biomeId,
          rarity: Number(rarity),
          timeOfDay: Number(timeOfDay),
        });
      }
    }
  }
}

const sortedIndex: BiomeIndex = Object.fromEntries(
  Object.entries(biomeIndex)
    .map(([id, list]) => [Number(id), list.sort((a, b) => a.biome - b.biome || a.rarity - b.rarity || a.timeOfDay - b.timeOfDay)] as const)
    .sort(([a], [b]) => a - b),
);

writeFileSync(
  new URL('../data/biome-index.generated.ts', import.meta.url),
  [
    `import type { BiomeIndex } from '../src/domain/biome';`,
    '',
    `export const BIOME_INDEX: BiomeIndex = ${JSON.stringify(sortedIndex)};`,
    '',
  ].join('\n'),
);
```

A ordenação é o que garante AD-2: sem ela, a ordem de `readdirSync` e de `Object.entries`
poderia variar entre máquinas e o arquivo mudaria sem o dado ter mudado.

- [ ] **Passo 8: Gerar e rodar os testes**

```bash
npm run build:data && npx vitest run test/biome-index-data.test.ts test/biome.test.ts
```

Esperado: PASS nos dois arquivos.

- [ ] **Passo 9: Confirmar reprodutibilidade**

```bash
npm run build:data && git diff --exit-code data/biome-index.generated.ts && echo "identico"
```

Esperado: `identico`.

- [ ] **Passo 10: Commit**

```bash
npm run format && npm run typecheck && npm test
git add src/domain/biome.ts test/biome.test.ts tools/build-pokerogue-data.mts data/biome-index.generated.ts test/biome-index-data.test.ts
git commit -m "feat: indice invertido de biomas por especie"
```

---

## Task A4: Tabelas de nome filtradas

**Arquivos:**
- Modificar: `tools/build-pokerogue-data.mts`
- Criar: `data/names.generated.ts` (gerado)
- Criar: `test/names-data.test.ts`

**Interfaces:**
- Consome: `EGG_MOVES` de A2, `BIOME_INDEX` de A3.
- Produz: `ABILITY_NAMES`, `MOVE_NAMES`, `BIOME_NAMES`, todos `Record<number, string>`.

O JSON de locales é indexado por chave em camelCase (`trace`, `gigaDrain`), não por id. Os
enums `AbilityId`, `MoveId` e `BiomeId` do upstream dão o mapa id → nome em
`SCREAMING_SNAKE_CASE`. A ponte é converter o nome do enum para camelCase e procurar a chave.

- [ ] **Passo 1: Escrever o teste que falha**

`test/names-data.test.ts`:

```ts
import { describe, expect, test } from 'vitest';
import { BIOME_INDEX } from '../data/biome-index.generated';
import { EGG_MOVES } from '../data/egg-moves.generated';
import { ABILITY_NAMES, BIOME_NAMES, MOVE_NAMES } from '../data/names.generated';

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

  test('nenhum nome vazio', () => {
    for (const table of [ABILITY_NAMES, MOVE_NAMES, BIOME_NAMES]) {
      for (const [key, name] of Object.entries(table)) expect(name.length, key).toBeGreaterThan(0);
    }
  });
});
```

- [ ] **Passo 2: Rodar e confirmar que falha**

```bash
npx vitest run test/names-data.test.ts
```

Esperado: FAIL, `Failed to resolve import "../data/names.generated"`.

- [ ] **Passo 3: Emitir as tabelas de nome**

Acrescente em `tools/build-pokerogue-data.mts`:

```ts
const camel = (value: string): string =>
  value.toLowerCase().replace(/_(.)/g, (_, letter: string) => letter.toUpperCase());

async function namesFrom(
  enumPath: string,
  enumName: string,
  localeFile: string,
  keep: (id: number) => boolean,
): Promise<Record<number, string>> {
  const loaded = (await import(`${game}/src/enums/${enumPath}`)) as Record<string, unknown>;
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
  return names;
}

const eggMoveIds = new Set(Object.values(eggMoves).flat());
const biomeIds = new Set(Object.values(sortedIndex).flat().map((e) => e.biome));

const MOVE_NAMES = await namesFrom('move-id.ts', 'MoveId', 'move.json', (id) => eggMoveIds.has(id));
const BIOME_NAMES = await namesFrom('biome-id.ts', 'BiomeId', 'biomes.json', (id) => biomeIds.has(id));
const ABILITY_NAMES = await namesFrom('ability-id.ts', 'AbilityId', 'ability.json', () => true);

const table = (name: string, value: Record<number, string>): string =>
  `export const ${name}: Record<number, string> = ${JSON.stringify(value)};`;

writeFileSync(
  new URL('../data/names.generated.ts', import.meta.url),
  [
    table('ABILITY_NAMES', ABILITY_NAMES),
    table('MOVE_NAMES', MOVE_NAMES),
    table('BIOME_NAMES', BIOME_NAMES),
    '',
  ].join('\n'),
);
```

O `keep` é o filtro de AD-21: `MOVE_NAMES` só recebe move que é egg move, `BIOME_NAMES` só
bioma presente no índice. Abilities entram inteiras porque `abilityHidden` vem do runtime e
qualquer id pode aparecer.

- [ ] **Passo 4: Gerar e rodar o teste**

```bash
npm run build:data && npx vitest run test/names-data.test.ts
```

Esperado: PASS, 5 testes. Se algum move ficar sem nome, a chave do locale diverge do enum —
imprima o par e ajuste `camel` antes de seguir.

- [ ] **Passo 5: Verificar o tamanho**

```bash
wc -c data/names.generated.ts data/egg-moves.generated.ts data/biome-index.generated.ts
```

Esperado: soma bem abaixo de 400 KB. É o insumo do teto de AD-6.

- [ ] **Passo 6: Commit**

```bash
npm run format && npm run typecheck && npm test
git add tools/build-pokerogue-data.mts data/names.generated.ts test/names-data.test.ts
git commit -m "feat: tabelas de nome filtradas do repositorio de locales"
```

---

## Task A5: A tecla e os fatos de runtime

**Arquivos:**
- Modificar: `src/game/pokerogue.ts`
- Criar: `src/game/facts.ts`
- Criar: `src/game/keys.ts`
- Criar: `test/facts.test.ts`
- Modificar: `test/support/fake-pokerogue.ts`

**Interfaces:**
- Produz: `readRuntimeFacts(pokemon: PokeRoguePokemon, biomeId: number | null): RuntimeFacts` e
  `bindPanelKey(target: KeyTarget, onPress: () => void): () => void`.
  `RuntimeFacts = { name, primary, fusion, catchRate, hiddenAbilityId, biomeId }`.

Esta tarefa tem uma parte empírica que **não pode ser pulada**: descobrir qual tecla o jogo não
consome. `C`, `G`, `N` e `U` já foram observadas ocupadas na tela de starter, além de setas,
Enter e Esc.

- [ ] **Passo 1: Descobrir a tecla livre no jogo real**

```bash
npm run launch
```

Com o jogo aberto, cole no console do Chrome e pressione as teclas candidatas durante uma
batalha:

```js
window.__keys = [];
addEventListener('keydown', (e) => window.__keys.push({ key: e.key, defaultPrevented: e.defaultPrevented }), true);
```

Depois leia `window.__keys` e escolha uma tecla cujo `defaultPrevented` continue `false` e que
não produza efeito visível. Anote a escolhida — ela vira a constante do passo 4.

- [ ] **Passo 2: Escrever o teste que falha**

`test/facts.test.ts`:

```ts
import { describe, expect, test } from 'vitest';
import { readRuntimeFacts } from '../src/game/facts';
import { fakePokemon } from './support/fake-pokerogue';

describe('readRuntimeFacts', () => {
  test('le catch rate e hidden ability da especie', () => {
    const facts = readRuntimeFacts(fakePokemon({ speciesId: 280, catchRate: 235, abilityHidden: 140 }), 10);
    expect(facts.catchRate).toBe(235);
    expect(facts.hiddenAbilityId).toBe(140);
    expect(facts.biomeId).toBe(10);
  });

  test('bioma nulo atravessa sem lancar', () => {
    expect(readRuntimeFacts(fakePokemon({ speciesId: 1 }), null).biomeId).toBeNull();
  });

  test('especie sem hidden ability devolve null', () => {
    expect(readRuntimeFacts(fakePokemon({ speciesId: 1, abilityHidden: 0 }), 1).hiddenAbilityId).toBeNull();
  });

  test('fusao junta os dois nomes e preenche a referencia secundaria', () => {
    const facts = readRuntimeFacts(fakePokemon({ speciesId: 280, name: 'Ralts', fusionName: 'Gyarados', fusionId: 130 }), 1);
    expect(facts.name).toBe('Ralts/Gyarados');
    expect(facts.fusion?.speciesId).toBe(130);
  });
});
```

Acrescente `fakePokemon` em `test/support/fake-pokerogue.ts`, seguindo o que já existe lá para
os alvos de batalha, com os campos `catchRate`, `abilityHidden`, `name`, `fusionName` e
`fusionId`.

- [ ] **Passo 3: Rodar e confirmar que falha**

```bash
npx vitest run test/facts.test.ts
```

Esperado: FAIL, `Failed to resolve import "../src/game/facts"`.

- [ ] **Passo 4: Escrever `facts.ts`, `keys.ts` e ampliar os tipos**

Em `src/game/pokerogue.ts`, acrescente aos tipos existentes:

```ts
export interface PokeRogueSpecies {
  speciesId: number;
  name: string;
  catchRate: number;
  abilityHidden: number;
  forms?: readonly SpeciesForm[];
}

export interface Arena {
  biomeType: number;
}
```

e em `BattleScene`, os campos `arena: Arena | null;` e `fieldUI: DisplayContainer;` — o
`fieldUI` é o container onde o painel é ancorado em A8, e foi confirmado existir na cena real.

`src/game/facts.ts`:

```ts
import type { SpeciesRef } from '../domain/species-key';
import { formKeyOf, type PokeRoguePokemon } from './pokerogue';

export interface RuntimeFacts {
  name: string;
  primary: SpeciesRef;
  fusion: SpeciesRef | null;
  catchRate: number | null;
  hiddenAbilityId: number | null;
  biomeId: number | null;
}

export function readRuntimeFacts(
  pokemon: PokeRoguePokemon,
  biomeId: number | null,
): RuntimeFacts {
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
    biomeId,
  };
}
```

`src/game/keys.ts` — troque `PANEL_KEY` pela tecla descoberta no passo 1:

```ts
export const PANEL_KEY = 'COLE_A_TECLA_AQUI';

export interface KeyTarget {
  addEventListener(type: 'keydown', listener: (event: KeyboardEvent) => void): void;
  removeEventListener(type: 'keydown', listener: (event: KeyboardEvent) => void): void;
}

export function bindPanelKey(target: KeyTarget, onPress: () => void): () => void {
  const listener = (event: KeyboardEvent): void => {
    if (event.key !== PANEL_KEY || event.repeat || event.ctrlKey || event.altKey || event.metaKey) {
      return;
    }
    onPress();
  };

  target.addEventListener('keydown', listener);
  return () => target.removeEventListener('keydown', listener);
}
```

O listener não chama `preventDefault` e não usa captura: qualquer tecla que não seja a nossa
segue para o jogo intacta, e a nossa também — é o repasse que AD-12 exige.

- [ ] **Passo 5: Rodar e confirmar que passa**

```bash
npx vitest run test/facts.test.ts
```

Esperado: PASS, 4 testes.

- [ ] **Passo 6: Verificar em jogo, com screenshot**

```bash
npm run launch
```

Com uma batalha na tela, pressione a tecla escolhida repetidas vezes e confirme que nada no
jogo reage. Depois abra um diálogo do jogo e pressione de novo. **Salve a screenshot** — é o
critério de pronto de AD-12.

- [ ] **Passo 7: Commit**

```bash
npm run format && npm run typecheck && npm test
git add src/game/pokerogue.ts src/game/facts.ts src/game/keys.ts test/facts.test.ts test/support/fake-pokerogue.ts
git commit -m "feat: leitura de fatos de runtime e binding da tecla do painel"
```

---

## Task A6: `domain/dossier.ts`

**Arquivos:**
- Criar: `src/domain/dossier.ts`
- Criar: `test/dossier.test.ts`

**Interfaces:**
- Consome: `RuntimeFacts` de A5, `encountersIn`/`BiomeIndex` de A3, `resolveTiers`/`TierTable`
  de `src/domain/tier-table.ts`.
- Produz: `dossierFor(facts: RuntimeFacts, tables: DossierTables): Dossier` e
  `interface DossierTables { tiers: TierTable; eggMoves: Record<number, readonly number[]>; biomes: BiomeIndex; abilityNames: Record<number, string>; moveNames: Record<number, string> }`.

- [ ] **Passo 1: Escrever o teste que falha**

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
  biomeId: 10,
  ...overrides,
});

describe('dossierFor', () => {
  test('resolve nome de hidden ability e de egg move pelos ids', () => {
    const dossier = dossierFor(facts(), tables);
    expect(dossier.hiddenAbility).toBe('Trace');
    expect(dossier.eggMoves).toEqual(['Memento', 'Encore']);
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
    expect(dossierFor(facts({ primary: { speciesId: 1, formKey: '' } }), tables).eggMoves).toEqual([]);
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

- [ ] **Passo 2: Rodar e confirmar que falha**

```bash
npx vitest run test/dossier.test.ts
```

Esperado: FAIL, `Failed to resolve import "../src/domain/dossier"`.

- [ ] **Passo 3: Escrever `src/domain/dossier.ts`**

```ts
import type { RuntimeFacts } from '../game/facts';
import { type BiomeIndex, type Encounter, encountersIn } from './biome';
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
    encounters: encountersIn(tables.biomes, speciesId, facts.biomeId),
    catchRate: facts.catchRate,
  };
}
```

`facts.ts` só declara tipos usados aqui, e `dossier.ts` importa apenas o `type` — a regra de
AD-7 continua valendo porque nenhum valor de `game/` atravessa.

- [ ] **Passo 4: Rodar e confirmar que passa**

```bash
npx vitest run test/dossier.test.ts
```

Esperado: PASS, 6 testes.

- [ ] **Passo 5: Confirmar o isolamento do domínio**

```bash
grep -rn "from '\.\./render\|phaser" src/domain/ ; echo "saida: $?"
```

Esperado: nenhuma linha e `saida: 1`. É AD-7.

- [ ] **Passo 6: Commit**

```bash
npm run format && npm run typecheck && npm test
git add src/domain/dossier.ts test/dossier.test.ts
git commit -m "feat: montagem do dossie a partir de fatos e tabelas"
```

---

## Task A7: `render/panel.ts`

**Arquivos:**
- Criar: `src/render/panel.ts`
- Criar: `test/panel.test.ts`
- Modificar: `src/render/palette.ts`

**Interfaces:**
- Consome: `Dossier` de A6, `Scene`/`DisplayContainer`/`TextObject` de `src/game/phaser.ts`.
- Produz: `class Panel { constructor(scene: Scene, parent: DisplayContainer); render(dossier: Dossier, biomeNames: Record<number, string>): void; clear(): void; get size(): number }`
  e `panelLines(dossier: Dossier, biomeNames: Record<number, string>): readonly string[]`.

- [ ] **Passo 1: Escrever o teste que falha**

`test/panel.test.ts`:

```ts
import { beforeEach, describe, expect, test } from 'vitest';
import type { Dossier } from '../src/domain/dossier';
import { Panel, panelLines } from '../src/render/panel';
import { type FakeContainer, FakeScene } from './support/fake-phaser';

let scene: FakeScene;
let field: FakeContainer;

beforeEach(() => {
  scene = new FakeScene();
  field = scene.makeContainer();
});

const dossier = (overrides: Partial<Dossier> = {}): Dossier => ({
  name: 'Ralts',
  tiers: { tier: 'LC', bestTier: 'OU', bestName: 'Gardevoir' },
  hiddenAbility: 'Trace',
  eggMoves: ['Memento'],
  encounters: [{ biome: 10, rarity: 2, timeOfDay: 4 }],
  catchRate: 235,
  ...overrides,
});

const names = { 10: 'Town' };

describe('panelLines', () => {
  test('monta uma linha por campo preenchido', () => {
    expect(panelLines(dossier(), names)).toHaveLength(5);
  });

  test('campo vazio nao vira linha, e nao vira texto de preenchimento', () => {
    const lines = panelLines(dossier({ hiddenAbility: null, eggMoves: [], encounters: [] }), names);
    expect(lines).toHaveLength(2);
    expect(lines.join(' ')).not.toMatch(/desconhecid|\?\?\?/i);
  });

  test('bioma sem nome na tabela nao produz linha de raridade', () => {
    expect(panelLines(dossier(), {}).some((l) => /Town/.test(l))).toBe(false);
  });
});

describe('Panel', () => {
  test('render cria uma linha por texto e anexa ao container', () => {
    const panel = new Panel(scene, field);
    panel.render(dossier(), names);

    expect(panel.size).toBe(5);
    expect(field.children.length).toBeGreaterThan(0);
  });

  test('render de novo com o mesmo dossie nao recria objetos', () => {
    const panel = new Panel(scene, field);
    panel.render(dossier(), names);
    const created = scene.created.length;

    panel.render(dossier(), names);

    expect(scene.created.length).toBe(created);
  });

  test('clear destroi tudo e zera a contagem', () => {
    const panel = new Panel(scene, field);
    panel.render(dossier(), names);

    panel.clear();

    expect(panel.size).toBe(0);
    expect(field.children).toHaveLength(0);
    expect(scene.created.every((object) => object.destroyed)).toBe(true);
  });

  test('abrir e fechar muitas vezes nao deixa objeto orfao', () => {
    const panel = new Panel(scene, field);

    for (let round = 0; round < 20; round += 1) {
      panel.render(dossier(), names);
      panel.clear();
    }

    expect(panel.size).toBe(0);
    expect(field.children).toHaveLength(0);
  });
});
```

- [ ] **Passo 2: Rodar e confirmar que falha**

```bash
npx vitest run test/panel.test.ts
```

Esperado: FAIL, `Failed to resolve import "../src/render/panel"`.

- [ ] **Passo 3: Escrever `src/render/panel.ts`**

```ts
import type { Dossier } from '../domain/dossier';
import type { DisplayContainer, Scene, TextObject } from '../game/phaser';
import { fullLabel } from './label';
import { PANEL_DEPTH, panelStyle } from './palette';

const RARITY = ['Common', 'Uncommon', 'Rare', 'Super Rare', 'Ultra Rare', 'Boss'] as const;
const LINE_HEIGHT = 14;
const ORIGIN = { x: 8, y: 8 };
const SCALE = 0.2;

export function panelLines(
  dossier: Dossier,
  biomeNames: Record<number, string>,
): readonly string[] {
  const lines = [dossier.name, fullLabel(dossier.tiers)];

  if (dossier.hiddenAbility) lines.push(`HA ${dossier.hiddenAbility}`);
  if (dossier.eggMoves.length > 0) lines.push(`Egg ${dossier.eggMoves.join(', ')}`);

  for (const encounter of dossier.encounters) {
    const biome = biomeNames[encounter.biome];
    const rarity = RARITY[encounter.rarity];
    if (biome && rarity) lines.push(`${biome} ${rarity}`);
  }

  if (dossier.catchRate !== null) lines.push(`Catch ${dossier.catchRate}`);

  return lines;
}

export class Panel {
  private readonly objects: TextObject[] = [];
  private rendered: readonly string[] = [];

  constructor(
    private readonly scene: Scene,
    private readonly parent: DisplayContainer,
  ) {}

  get size(): number {
    return this.objects.length;
  }

  render(dossier: Dossier, biomeNames: Record<number, string>): void {
    const lines = panelLines(dossier, biomeNames);
    if (this.same(lines)) return;

    this.clear();

    lines.forEach((line, index) => {
      const object = this.scene.add
        .text(ORIGIN.x, ORIGIN.y + index * LINE_HEIGHT, line, panelStyle())
        .setOrigin(0, 0)
        .setDepth(PANEL_DEPTH)
        .setScale(SCALE);

      this.parent.add(object);
      this.objects.push(object);
    });

    this.rendered = lines;
  }

  clear(): void {
    for (const object of this.objects) {
      this.parent.remove(object);
      object.destroy();
    }
    this.objects.length = 0;
    this.rendered = [];
  }

  private same(lines: readonly string[]): boolean {
    return (
      this.rendered.length === lines.length && this.rendered.every((line, i) => line === lines[i])
    );
  }
}
```

Em `src/render/palette.ts`, acrescente ao final:

```ts
export const PANEL_DEPTH = 1001;

export function panelStyle(): TextStyle {
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
npx vitest run test/panel.test.ts
```

Esperado: PASS, 7 testes.

- [ ] **Passo 5: Commit**

```bash
npm run format && npm run typecheck && npm test
git add src/render/panel.ts src/render/palette.ts test/panel.test.ts
git commit -m "feat: painel do dossie como objetos phaser"
```

---

## Task A8: Foco e integração na batalha

**Arquivos:**
- Criar: `src/game/focus.ts`
- Criar: `test/focus.test.ts`
- Modificar: `src/surfaces/battle-surface.ts`
- Modificar: `src/bootstrap.ts`
- Modificar: `test/surfaces.test.ts`

**Interfaces:**
- Consome: `Panel` de A7, `dossierFor`/`DossierTables` de A6, `readRuntimeFacts` de A5.
- Produz: `class FocusCycle { advance(count: number): void; get current(): number | null; reset(): void }`.

- [ ] **Passo 1: Escrever o teste que falha**

`test/focus.test.ts`:

```ts
import { describe, expect, test } from 'vitest';
import { FocusCycle } from '../src/game/focus';

describe('FocusCycle', () => {
  test('comeca fechado', () => {
    expect(new FocusCycle().current).toBeNull();
  });

  test('com um alvo alterna entre o alvo e fechado', () => {
    const cycle = new FocusCycle();
    cycle.advance(1);
    expect(cycle.current).toBe(0);
    cycle.advance(1);
    expect(cycle.current).toBeNull();
  });

  test('com dois alvos passa pelos dois antes de fechar', () => {
    const cycle = new FocusCycle();
    cycle.advance(2);
    expect(cycle.current).toBe(0);
    cycle.advance(2);
    expect(cycle.current).toBe(1);
    cycle.advance(2);
    expect(cycle.current).toBeNull();
  });

  test('alvo que sumiu fecha o painel em vez de apontar para fora da lista', () => {
    const cycle = new FocusCycle();
    cycle.advance(2);
    cycle.advance(2);
    expect(cycle.current).toBe(1);
    expect(cycle.clamp(1)).toBeNull();
  });

  test('sem alvo nenhum a tecla nao abre nada', () => {
    const cycle = new FocusCycle();
    cycle.advance(0);
    expect(cycle.current).toBeNull();
  });

  test('reset fecha', () => {
    const cycle = new FocusCycle();
    cycle.advance(2);
    cycle.reset();
    expect(cycle.current).toBeNull();
  });
});
```

- [ ] **Passo 2: Rodar e confirmar que falha**

```bash
npx vitest run test/focus.test.ts
```

Esperado: FAIL, `Failed to resolve import "../src/game/focus"`.

- [ ] **Passo 3: Escrever `src/game/focus.ts`**

```ts
export class FocusCycle {
  private index: number | null = null;

  get current(): number | null {
    return this.index;
  }

  advance(count: number): void {
    if (count <= 0) {
      this.index = null;
      return;
    }
    const next = this.index === null ? 0 : this.index + 1;
    this.index = next >= count ? null : next;
  }

  clamp(count: number): number | null {
    if (this.index !== null && this.index >= count) this.index = null;
    return this.index;
  }

  reset(): void {
    this.index = null;
  }
}
```

- [ ] **Passo 4: Rodar e confirmar que passa**

```bash
npx vitest run test/focus.test.ts
```

Esperado: PASS, 6 testes.

- [ ] **Passo 5: Ligar o painel na `BattleSurface`**

`src/surfaces/battle-surface.ts` passa a receber painel, ciclo e tabelas, e a `sync` ganha o
segundo consumidor. O `clear` limpa os dois e reseta o foco — é AD-17.

```ts
import { dossierFor, type DossierTables } from '../domain/dossier';
import { readBattleTargets } from '../game/battle';
import type { GameContext } from '../game/context';
import { readRuntimeFacts } from '../game/facts';
import type { FocusCycle } from '../game/focus';
import type { BadgeLayer } from '../render/badge-layer';
import { fullLabel } from '../render/label';
import type { Panel } from '../render/panel';
import { badgeSpecsFor } from './badge-specs';
import type { Surface } from './surface';

export class BattleSurface implements Surface {
  readonly name = 'battle';

  constructor(
    private readonly layer: BadgeLayer,
    private readonly panel: Panel,
    private readonly focus: FocusCycle,
    private readonly tables: DossierTables,
    private readonly biomeNames: Record<number, string>,
  ) {}

  matches(context: GameContext): boolean {
    return context.scene.currentBattle !== null;
  }

  sync(context: GameContext): void {
    const enemies = context.scene.getEnemyField();
    this.layer.reconcile(badgeSpecsFor(readBattleTargets(context.scene), this.tables.tiers, fullLabel));

    const index = this.focus.clamp(enemies.length);
    const enemy = index === null ? null : enemies[index];
    if (!enemy) {
      this.panel.clear();
      return;
    }

    const facts = readRuntimeFacts(enemy, context.scene.arena?.biomeType ?? null);
    this.panel.render(dossierFor(facts, this.tables), this.biomeNames);
  }

  clear(): void {
    this.layer.clear();
    this.panel.clear();
    this.focus.reset();
  }
}
```

`src/bootstrap.ts` — `overlayFor` monta as peças novas e liga a tecla. A `StarterSurface`
**não muda** (AD-25):

```ts
import { BIOME_NAMES } from '../data/names.generated';
import type { DossierTables } from './domain/dossier';
import { contextOf } from './game/context';
import { FocusCycle } from './game/focus';
import { bindPanelKey } from './game/keys';
import type { PhaserGame } from './game/phaser';
import type { BattleScene } from './game/pokerogue';
import { Overlay } from './overlay';
import { BadgeLayer } from './render/badge-layer';
import { Panel } from './render/panel';
import { BattleSurface } from './surfaces/battle-surface';
import { StarterSurface } from './surfaces/starter-surface';

function overlayFor(scene: BattleScene, tables: DossierTables): Overlay {
  const focus = new FocusCycle();
  const panel = new Panel(scene, scene.fieldUI);

  bindPanelKey(window, () => focus.advance(scene.getEnemyField().length));

  return new Overlay(
    [
      new BattleSurface(new BadgeLayer(scene), panel, focus, tables, BIOME_NAMES),
      new StarterSurface(new BadgeLayer(scene), tables.tiers),
    ],
    () => contextOf(scene),
  );
}
```

`startOverlay` passa a receber `DossierTables` em vez de `TierTable`; ajuste a assinatura e o
`src/main.ts` correspondente.

- [ ] **Passo 6: Provar que a starter não mudou**

Acrescente em `test/surfaces.test.ts`:

```ts
test('a surface de starter nao conhece painel nem foco', () => {
  const surface = new StarterSurface(layer, table);
  expect(Object.keys(surface)).toEqual(['name']);
});
```

- [ ] **Passo 7: Rodar toda a suíte**

```bash
npm test && npm run typecheck
```

Esperado: PASS em todos os arquivos, sem erro de tipo.

- [ ] **Passo 8: Commit**

```bash
npm run format
git add src/game/focus.ts test/focus.test.ts src/surfaces/battle-surface.ts src/bootstrap.ts src/main.ts test/surfaces.test.ts
git commit -m "feat: ciclo de foco e painel na surface de batalha"
```

---

## Task A9: Workflow de drift

**Arquivos:**
- Criar: `.github/workflows/data-drift.yml`

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
        env:
          GH_TOKEN: ${{ github.token }}

      - run: npm run build:data

      - uses: peter-evans/create-pull-request@v7
        with:
          branch: data-drift
          title: 'chore: atualizar tabelas geradas do PokeRogue'
          commit-message: 'chore: atualizar tabelas geradas do PokeRogue'
          body: |
            Gerado automaticamente pelo workflow `data-drift`.
            Revise o diff antes do merge — o overlay nao se atualiza sozinho a partir de codigo de terceiro.
```

O `create-pull-request` não abre PR quando não há diff, então semana sem mudança upstream não
gera ruído. O PR dispara o `ci.yml` existente, que atende AD-19.

- [ ] **Passo 2: Testar com pins antigos**

Edite `data/pokerogue-source.json` para SHAs de alguns meses atrás, faça commit num branch, e
dispare o workflow pelo `workflow_dispatch` na aba Actions.

Esperado: um PR aberto com diff não vazio em `data/*.generated.ts`, e o CI rodando nele.

- [ ] **Passo 3: Commit**

```bash
git add .github/workflows/data-drift.yml
git commit -m "ci: workflow semanal de drift das tabelas geradas"
```

---

## Task A10: Verificação em jogo

Sem screenshot, nenhum item desta tarefa está pronto. É o padrão que a v2 estabeleceu na V9.

- [ ] **Passo 1: Subir o jogo com o bundle**

```bash
npm run build && npm run launch
```

- [ ] **Passo 2: Batalha simples**

Entre numa batalha, pressione a tecla do painel. **Screenshot.** Confirme que o painel não
cobre a HUD nem a caixa de diálogo (AD-15).

- [ ] **Passo 3: Batalha dupla**

Numa batalha dupla, pressione a tecla três vezes. **Screenshot de cada estado.** Confirme
primeiro inimigo, segundo inimigo, fechado (AD-13).

- [ ] **Passo 4: Celular**

```bash
npm run launch -- --late
```

Redimensione a janela para 390×844 e repita o passo 2. **Screenshot.** O painel deve continuar
legível sem código de layout específico (AD-16).

- [ ] **Passo 5: Espécie sem egg move**

Encontre uma espécie sem egg move e abra o painel. **Screenshot.** A linha de egg moves não
deve existir, e não deve haver texto de preenchimento no lugar (AD-8).

- [ ] **Passo 6: Starter inalterada**

Abra a seleção de starter. **Screenshot.** Deve estar idêntica à da v2: badges de tier, nenhum
painel (AD-25).

- [ ] **Passo 7: Commit das evidências**

```bash
git add docs/
git commit -m "docs: screenshots de verificacao em jogo do painel"
```

---

## Task A11: Licença, bundle e publicação

**Arquivos:**
- Modificar: `LICENSE`, `vite.config.ts`, `README.md`, `package.json`

- [ ] **Passo 1: Trocar a licença**

Substitua o conteúdo de `LICENSE` pelo texto integral da AGPL-3.0-only
(<https://www.gnu.org/licenses/agpl-3.0.txt>), e em `package.json` troque
`"license": "MIT"` por `"license": "AGPL-3.0-only"`.

- [ ] **Passo 2: Acompanhar no bloco de metadados**

Em `vite.config.ts`, dentro de `userscript`, troque `license: 'MIT'` por
`license: 'AGPL-3.0-only'`.

- [ ] **Passo 3: Creditar as fontes no README**

Acrescente uma seção:

```markdown
## De onde vêm os dados

Tiers do Smogon via [`@pkmn/dex`](https://github.com/pkmn/ps) (MIT).

Egg moves, pools de bioma e os nomes exibidos são gerados de
[`pagefaultgames/pokerogue`](https://github.com/pagefaultgames/pokerogue) e
[`pagefaultgames/pokerogue-locales`](https://github.com/pagefaultgames/pokerogue-locales),
ambos AGPL-3.0-only. Por isso este projeto também é AGPL-3.0-only.

As tabelas geradas são atualizadas por um workflow semanal que abre PR quando o upstream muda.
```

Documente também a tecla do painel e o que ele mostra.

- [ ] **Passo 4: Verificar o bundle**

```bash
npm run build && wc -c dist/pokerogue-tier-overlay.user.js
grep -c "@require" dist/pokerogue-tier-overlay.meta.js; echo "esperado: 0"
```

Esperado: tamanho abaixo de 512000 bytes (AD-6) e nenhum `@require` (AD-5).

- [ ] **Passo 5: Suíte completa**

```bash
npm run lint && npm run typecheck && npm test && npm run build
```

Esperado: tudo verde (AD-20).

- [ ] **Passo 6: Commit**

```bash
git add LICENSE package.json vite.config.ts README.md
git commit -m "docs: relicencia para AGPL-3.0-only e credita as fontes upstream"
```

---

## Depois deste plano

Publicar a versão nova no Greasyfork é passo manual seu — não consigo autenticar na sua conta.

Slice B (Ctrl+K) reusa `panel.ts` e `dossier.ts` sem alteração, e ganha de graça o
`StarterSelectUiHandler.allSpecies` que já foi mapeado em runtime.
