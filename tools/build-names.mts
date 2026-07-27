import { readFileSync, writeFileSync } from 'node:fs';
import { fetchUpstream, readPins } from './upstream.mts';

const LOCALE = 'pt-BR';

const camel = (value: string): string =>
  value.toLowerCase().replace(/_(.)/g, (_, letter: string) => letter.toUpperCase());

const pins = readPins();
const game = fetchUpstream('pokerogue', pins.pokerogue, ['src/enums']);
const locales = fetchUpstream('locales', pins.locales, [LOCALE]);

function localeOf(file: string): Record<string, { name?: string } | string> {
  return JSON.parse(readFileSync(`${locales}/${LOCALE}/${file}`, 'utf8'));
}

function sorted(names: Record<number, string>): Record<number, string> {
  return Object.fromEntries(
    Object.entries(names).sort(([a], [b]) => Number(a) - Number(b)),
  ) as Record<number, string>;
}

async function namesFrom(
  enumFile: string,
  enumName: string,
  localeFile: string,
): Promise<Record<number, string>> {
  const loaded = (await import(`${game}/src/enums/${enumFile}`)) as Record<string, unknown>;
  const ids = loaded[enumName] as Record<string, string | number>;
  const locale = localeOf(localeFile);

  const names: Record<number, string> = {};

  for (const [label, id] of Object.entries(ids)) {
    if (typeof id !== 'number' || id < 0) continue;
    const entry = locale[camel(label)];
    const name = typeof entry === 'string' ? entry : entry?.name;
    if (name) names[id] = name;
  }

  return sorted(names);
}

const abilityNames = await namesFrom('ability-id.ts', 'AbilityId', 'ability.json');
const biomeNames = await namesFrom('biome-id.ts', 'BiomeId', 'biomes.json');

const table = (name: string, value: Record<number, string>): string =>
  `export const ${name}: Record<number, string> = ${JSON.stringify(value)};`;

writeFileSync(
  new URL('../data/names.generated.ts', import.meta.url),
  [table('ABILITY_NAMES', abilityNames), table('BIOME_NAMES', biomeNames), ''].join('\n'),
);

process.stdout.write(
  `${Object.keys(abilityNames).length} abilities e ${Object.keys(biomeNames).length} biomas em data/names.generated.ts\n`,
);
