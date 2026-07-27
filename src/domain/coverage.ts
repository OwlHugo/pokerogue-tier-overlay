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

export const ALL_TYPES: readonly number[] = Object.keys(TYPE_NAMES).map(Number);

export function typeNameOf(type: number): string | null {
  return TYPE_NAMES[type] ?? null;
}

export function missingTypes(team: readonly TypedMember[]): readonly number[] {
  if (team.length === 0) return [];
  const present = new Set(team.flatMap((member) => member.types));
  return ALL_TYPES.filter((type) => !present.has(type));
}
