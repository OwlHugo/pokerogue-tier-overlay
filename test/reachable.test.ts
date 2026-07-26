import { describe, expect, test } from 'vitest';
import { bestReachable } from '../src/domain/reachable';
import type { TierEntry } from '../src/domain/tier-table';

const entry = (over: Partial<TierEntry> = {}): TierEntry => ({
  name: 'Teste',
  tier: 'LC',
  bestTier: 'ZU',
  bestName: 'Base',
  mega: null,
  gmax: null,
  ...over,
});

describe('bestReachable', () => {
  test('sem formas liberadas, o alcance e a propria linha evolutiva', () => {
    expect(bestReachable(entry())).toEqual({ tier: 'ZU', name: 'Base', source: 'line' });
  });

  test('a mega vence quando supera a linha', () => {
    const result = bestReachable(entry({ mega: { tier: 'OU', name: 'Mawile-Mega' } }));
    expect(result).toEqual({ tier: 'OU', name: 'Mawile-Mega', source: 'mega' });
  });

  test('a gmax vence quando supera a mega', () => {
    const result = bestReachable(
      entry({
        mega: { tier: 'OU', name: 'Charizard-Mega-X' },
        gmax: { tier: 'AG', name: 'Charizard-Gmax' },
      }),
    );
    expect(result.source).toBe('gmax');
    expect(result.tier).toBe('AG');
  });

  test('forma liberada pior que a linha nao rebaixa o alcance', () => {
    const result = bestReachable(
      entry({ bestTier: 'OU', bestName: 'Forte', mega: { tier: 'PU', name: 'Fraca-Mega' } }),
    );
    expect(result).toEqual({ tier: 'OU', name: 'Forte', source: 'line' });
  });

  test('especie sem tier algum nao inventa alcance', () => {
    expect(bestReachable(entry({ tier: null, bestTier: null, bestName: null }))).toEqual({
      tier: null,
      name: null,
      source: 'line',
    });
  });
});
