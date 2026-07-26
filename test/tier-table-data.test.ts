import { describe, expect, test } from 'vitest';
import { TIER_TABLE } from '../data/tier-table.generated';
import { TIER_ORDER } from '../src/domain/tier';
import { resolveTiers } from '../src/domain/tier-table';

const entries = Object.entries(TIER_TABLE);
const tiers = new Set<string>(TIER_ORDER);

describe('tabela gerada', () => {
  test('cobre pelo menos 1000 especies', () => {
    expect(entries.length).toBeGreaterThanOrEqual(1000);
  });

  test('as chaves sao numero da pokedex com forma regional opcional', () => {
    for (const [key] of entries) {
      expect(key).toMatch(/^\d+(:(alola|galar|hisui|paldea))?$/);
    }
  });

  test('todo tier presente pertence a ordem canonica', () => {
    for (const [key, entry] of entries) {
      if (entry.tier !== null) expect(tiers, key).toContain(entry.tier);
      if (entry.bestTier !== null) expect(tiers, key).toContain(entry.bestTier);
    }
  });

  test('nenhum pokemon inventado pelo smogon entrou na tabela', () => {
    for (const [key] of entries) {
      expect(Number.parseInt(key, 10)).toBeGreaterThan(0);
    }
  });

  test('Magikarp herda o tier do Gyarados', () => {
    const magikarp = TIER_TABLE['129'];
    expect(magikarp?.bestName).toBe('Gyarados');
  });

  test('Raichu de Alola tem entrada propria distinta da base', () => {
    expect(TIER_TABLE['26:alola']).toBeDefined();
    expect(TIER_TABLE['26:alola']?.bestName).toBe('Raichu-Alola');
  });

  test('resolve um Hoothoot como foi visto em batalha real', () => {
    const result = resolveTiers(TIER_TABLE, { speciesId: 163, formKey: '' }, null);
    expect(result.bestName).toBe('Noctowl');
    expect(result.bestTier).not.toBeNull();
  });
});
