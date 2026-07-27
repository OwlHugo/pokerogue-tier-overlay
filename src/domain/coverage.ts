import type { Locale } from './names';

export interface TypedMember {
  types: readonly number[];
}

const TYPE_NAMES: Record<number, Record<Locale, string>> = {
  0: { pt: 'Normal', en: 'Normal' },
  1: { pt: 'Lutador', en: 'Fighting' },
  2: { pt: 'Voador', en: 'Flying' },
  3: { pt: 'Venenoso', en: 'Poison' },
  4: { pt: 'Terrestre', en: 'Ground' },
  5: { pt: 'Pedra', en: 'Rock' },
  6: { pt: 'Inseto', en: 'Bug' },
  7: { pt: 'Fantasma', en: 'Ghost' },
  8: { pt: 'Aço', en: 'Steel' },
  9: { pt: 'Fogo', en: 'Fire' },
  10: { pt: 'Água', en: 'Water' },
  11: { pt: 'Planta', en: 'Grass' },
  12: { pt: 'Elétrico', en: 'Electric' },
  13: { pt: 'Psíquico', en: 'Psychic' },
  14: { pt: 'Gelo', en: 'Ice' },
  15: { pt: 'Dragão', en: 'Dragon' },
  16: { pt: 'Sombrio', en: 'Dark' },
  17: { pt: 'Fada', en: 'Fairy' },
};

const TYPE_COLORS: Record<number, string> = {
  0: '#9098a1',
  1: '#c03028',
  2: '#a890f0',
  3: '#a040a0',
  4: '#e0c068',
  5: '#b8a038',
  6: '#a8b820',
  7: '#705898',
  8: '#8f9fa0',
  9: '#f08030',
  10: '#6890f0',
  11: '#78c850',
  12: '#f8d030',
  13: '#f85888',
  14: '#98d8d8',
  15: '#7038f8',
  16: '#705848',
  17: '#ee99ac',
};

export const ALL_TYPES: readonly number[] = Object.keys(TYPE_NAMES).map(Number);

export function typeColorOf(type: number): string {
  return TYPE_COLORS[type] ?? '#9098a1';
}

export function typeNameOf(type: number, locale: Locale): string | null {
  return TYPE_NAMES[type]?.[locale] ?? null;
}

export function missingTypes(team: readonly TypedMember[]): readonly number[] {
  if (team.length === 0) return [];
  const present = new Set(team.flatMap((member) => member.types));
  return ALL_TYPES.filter((type) => !present.has(type));
}
