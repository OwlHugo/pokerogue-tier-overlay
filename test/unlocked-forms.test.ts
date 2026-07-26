import { describe, expect, test } from 'vitest';
import { TIER_TABLE } from '../data/tier-table.generated';
import { compareTier } from '../src/domain/tier';

const entry = (key: string) => TIER_TABLE[key];

describe('formas que o PokeRogue libera', () => {
  test('Mawile carrega o tier da mega, muito acima do dela', () => {
    const mawile = entry('303');
    expect(mawile?.mega?.tier).toBe('OU');
    expect(mawile?.mega?.name).toBe('Mawile-Mega');
    expect(compareTier(mawile?.mega?.tier ?? null, mawile?.bestTier ?? null)).toBeLessThan(0);
  });

  test('Kangaskhan chega a Uber com a mega', () => {
    expect(entry('115')?.mega?.tier).toBe('Uber');
  });

  test('Charizard tem mega e gmax', () => {
    const charizard = entry('6');
    expect(charizard?.mega?.tier).toBeTruthy();
    expect(charizard?.gmax?.tier).toBe('AG');
  });

  test('a forma alcancavel vale para a linha inteira, nao so para o estagio final', () => {
    const charmander = entry('4');
    expect(charmander?.mega?.name).toContain('Charizard-Mega');
  });

  test('especie sem mega nem gmax nao inventa forma', () => {
    const hoothoot = entry('163');
    expect(hoothoot?.mega).toBeNull();
    expect(hoothoot?.gmax).toBeNull();
  });

  test('toda mega registrada tem tier conhecido', () => {
    for (const [key, value] of Object.entries(TIER_TABLE)) {
      if (value.mega) expect(value.mega.tier, key).toBeTruthy();
      if (value.gmax) expect(value.gmax.tier, key).toBeTruthy();
    }
  });
});
