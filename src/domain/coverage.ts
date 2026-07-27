export interface TypedMember {
  types: readonly number[];
}

const TYPE_NAMES: Record<number, string> = {
  0: 'Normal',
  1: 'Lutador',
  2: 'Voador',
  3: 'Venenoso',
  4: 'Terrestre',
  5: 'Pedra',
  6: 'Inseto',
  7: 'Fantasma',
  8: 'Aço',
  9: 'Fogo',
  10: 'Água',
  11: 'Planta',
  12: 'Elétrico',
  13: 'Psíquico',
  14: 'Gelo',
  15: 'Dragão',
  16: 'Sombrio',
  17: 'Fada',
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

export function typeNameOf(type: number): string | null {
  return TYPE_NAMES[type] ?? null;
}

export function missingTypes(team: readonly TypedMember[]): readonly number[] {
  if (team.length === 0) return [];
  const present = new Set(team.flatMap((member) => member.types));
  return ALL_TYPES.filter((type) => !present.has(type));
}
