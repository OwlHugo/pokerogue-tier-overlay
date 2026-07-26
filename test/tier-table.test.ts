import { describe, expect, test } from 'vitest';
import { keyFor } from '../src/domain/species-key';
import { resolveTiers, type TierTable } from '../src/domain/tier-table';

const table: TierTable = {
  '129': { tier: 'LC', bestTier: 'RU', bestName: 'Gyarados' },
  '10': { tier: 'LC', bestTier: 'ZU', bestName: 'Butterfree' },
  '26': { tier: 'ZU', bestTier: 'ZU', bestName: 'Raichu' },
  '26:alola': {
    tier: 'NU',
    bestTier: 'NU',
    bestName: 'Raichu-Alola',
  },
  '163': { tier: 'LC', bestTier: 'ZU', bestName: 'Noctowl' },
};

describe('keyFor', () => {
  test('usa so o numero da pokedex quando nao ha forma', () => {
    expect(keyFor(163, '')).toBe('163');
  });

  test('acrescenta a forma quando ela existe', () => {
    expect(keyFor(26, 'alola')).toBe('26:alola');
  });
});

describe('resolveTiers', () => {
  test('resolve a especie base', () => {
    expect(resolveTiers(table, { speciesId: 163, formKey: '' }, null)).toEqual({
      tier: 'LC',
      bestTier: 'ZU',
      bestName: 'Noctowl',
    });
  });

  test('prefere a entrada da forma regional', () => {
    expect(resolveTiers(table, { speciesId: 26, formKey: 'alola' }, null).bestTier).toBe('NU');
  });

  test('cai para a especie base quando a forma nao tem entrada propria', () => {
    expect(resolveTiers(table, { speciesId: 26, formKey: 'gigantamax' }, null).bestTier).toBe('ZU');
  });

  test('fusao usa o melhor tier entre as duas linhas', () => {
    const result = resolveTiers(
      table,
      { speciesId: 10, formKey: '' },
      { speciesId: 129, formKey: '' },
    );
    expect(result.bestTier).toBe('RU');
    expect(result.bestName).toBe('Gyarados');
  });

  test('fusao em empate mantem a especie primaria', () => {
    const result = resolveTiers(
      table,
      { speciesId: 163, formKey: '' },
      { speciesId: 10, formKey: '' },
    );
    expect(result.bestTier).toBe('ZU');
    expect(result.bestName).toBe('Noctowl');
  });

  test('especie desconhecida nao inventa tier', () => {
    expect(resolveTiers(table, { speciesId: 99999, formKey: '' }, null)).toEqual({
      tier: null,
      bestTier: null,
      bestName: null,
    });
  });
});
