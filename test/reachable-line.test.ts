import { describe, expect, test } from 'vitest';
import { reachableLine, type SpeciesSource } from '../src/domain/evolution';

const source = (nodes: Record<string, { prevo?: string; evos?: string[] }>) =>
  ({ get: (name: string) => ({ name, ...nodes[name] }) }) satisfies SpeciesSource;

const eevee = source({
  Eevee: { evos: ['Vaporeon', 'Jolteon'] },
  Vaporeon: { prevo: 'Eevee' },
  Jolteon: { prevo: 'Eevee' },
});

const karp = source({
  Magikarp: { evos: ['Gyarados'] },
  Gyarados: { prevo: 'Magikarp' },
});

describe('reachableLine', () => {
  test('a partir da base, alcanca todos os ramos', () => {
    expect(reachableLine(eevee, eevee.get('Eevee'))).toEqual(['Eevee', 'Vaporeon', 'Jolteon']);
  });

  test('quem ja evoluiu nao alcanca os irmaos nem volta para a base', () => {
    expect(reachableLine(eevee, eevee.get('Vaporeon'))).toEqual(['Vaporeon']);
  });

  test('estagio intermediario alcanca so o que vem depois', () => {
    expect(reachableLine(karp, karp.get('Magikarp'))).toEqual(['Magikarp', 'Gyarados']);
    expect(reachableLine(karp, karp.get('Gyarados'))).toEqual(['Gyarados']);
  });

  test('especie sem evolucao alcanca apenas ela mesma', () => {
    const solo = source({ Ditto: {} });
    expect(reachableLine(solo, solo.get('Ditto'))).toEqual(['Ditto']);
  });
});
