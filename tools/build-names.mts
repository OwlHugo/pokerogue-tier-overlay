import { readFileSync, writeFileSync } from 'node:fs';
import { fetchUpstream, readPins } from './upstream.mts';

const LOCALES = ['pt-BR', 'en'] as const;
type Locale = (typeof LOCALES)[number];

const camel = (value: string): string =>
  value.toLowerCase().replace(/_(.)/g, (_, letter: string) => letter.toUpperCase());

const pins = readPins();
const game = fetchUpstream('pokerogue', pins.pokerogue, ['src/enums']);
const locales = fetchUpstream('locales', pins.locales, [...LOCALES]);

function localeOf(lang: Locale, file: string): Record<string, { name?: string } | string> {
  return JSON.parse(readFileSync(`${locales}/${lang}/${file}`, 'utf8'));
}

function sorted(names: Record<number, string>): Record<number, string> {
  return Object.fromEntries(
    Object.entries(names).sort(([a], [b]) => Number(a) - Number(b)),
  ) as Record<number, string>;
}

async function namesFrom(
  lang: Locale,
  enumFile: string,
  enumName: string,
  localeFile: string,
): Promise<Record<number, string>> {
  const loaded = (await import(`${game}/src/enums/${enumFile}`)) as Record<string, unknown>;
  const ids = loaded[enumName] as Record<string, string | number>;
  const locale = localeOf(lang, localeFile);

  const names: Record<number, string> = {};

  for (const [label, id] of Object.entries(ids)) {
    if (typeof id !== 'number' || id < 0) continue;
    const entry = locale[camel(label)];
    const name = typeof entry === 'string' ? entry : entry?.name;
    if (name) names[id] = name;
  }

  return sorted(names);
}

const porIdioma: Record<
  string,
  { abilities: Record<number, string>; biomes: Record<number, string> }
> = {};

for (const lang of LOCALES) {
  porIdioma[lang] = {
    abilities: await namesFrom(lang, 'ability-id.ts', 'AbilityId', 'ability.json'),
    biomes: await namesFrom(lang, 'biome-id.ts', 'BiomeId', 'biomes.json'),
  };
}

const chave = (lang: Locale) => (lang === 'pt-BR' ? 'pt' : 'en');

const bloco = (campo: 'abilities' | 'biomes') =>
  Object.fromEntries(LOCALES.map((lang) => [chave(lang), porIdioma[lang]?.[campo] ?? {}]));

writeFileSync(
  new URL('../data/names.generated.ts', import.meta.url),
  [
    `import type { NamesByLocale } from '../src/domain/names';`,
    '',
    `export const ABILITY_NAMES: NamesByLocale = ${JSON.stringify(bloco('abilities'))};`,
    `export const BIOME_NAMES: NamesByLocale = ${JSON.stringify(bloco('biomes'))};`,
    '',
  ].join('\n'),
);

process.stdout.write(`nomes gerados para ${LOCALES.join(', ')}\n`);
