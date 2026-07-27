import { describe, expect, test } from 'vitest';
import { teamSpeciesOf } from '../src/domain/team-species';

describe('teamSpeciesOf', () => {
  test('time vazio devolve conjunto vazio', () => {
    expect(teamSpeciesOf([]).size).toBe(0);
  });

  test('reune as especies do time atual', () => {
    const team = teamSpeciesOf([{ speciesId: 1 }, { speciesId: 129 }]);
    expect([...team].sort((a, b) => a - b)).toEqual([1, 129]);
  });

  test('especie repetida no time conta uma vez', () => {
    expect(teamSpeciesOf([{ speciesId: 1 }, { speciesId: 1 }]).size).toBe(1);
  });
});
