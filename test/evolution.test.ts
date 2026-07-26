import { describe, expect, test } from 'vitest';
import { bestOfLine, evolutionLine, type SpeciesSource } from '../src/domain/evolution';

const source = (nodes: Record<string, { prevo?: string; evos?: string[]; tier?: string }>) =>
  ({
    get: (name: string) => ({ name, ...nodes[name] }),
  }) satisfies SpeciesSource;

const karp = source({
  Magikarp: { evos: ['Gyarados'], tier: 'LC' },
  Gyarados: { prevo: 'Magikarp', tier: 'RU' },
});

const eevee = source({
  Eevee: { evos: ['Vaporeon', 'Jolteon'], tier: 'LC' },
  Vaporeon: { prevo: 'Eevee', tier: 'NU' },
  Jolteon: { prevo: 'Eevee', tier: 'OU' },
});

describe('evolutionLine', () => {
  test('sobe ate a raiz e desce por toda a linha', () => {
    expect(evolutionLine(karp, karp.get('Gyarados'))).toEqual(['Magikarp', 'Gyarados']);
    expect(evolutionLine(karp, karp.get('Magikarp'))).toEqual(['Magikarp', 'Gyarados']);
  });

  test('cobre ramificacoes a partir de qualquer membro', () => {
    expect(evolutionLine(eevee, eevee.get('Jolteon'))).toEqual(['Eevee', 'Vaporeon', 'Jolteon']);
  });

  test('especie sem evolucao vira linha de um elemento', () => {
    const solo = source({ Ditto: { tier: 'ZU' } });
    expect(evolutionLine(solo, solo.get('Ditto'))).toEqual(['Ditto']);
  });
});

describe('bestOfLine', () => {
  test('devolve o melhor tier da linha e quem o alcanca', () => {
    expect(bestOfLine(karp, ['Magikarp', 'Gyarados'])).toEqual({
      bestTier: 'RU',
      bestName: 'Gyarados',
    });
  });

  test('escolhe o melhor entre os ramos', () => {
    expect(bestOfLine(eevee, ['Eevee', 'Vaporeon', 'Jolteon'])).toEqual({
      bestTier: 'OU',
      bestName: 'Jolteon',
    });
  });

  test('ignora tier que o smogon nao cataloga', () => {
    const odd = source({ A: { tier: 'Illegal' }, B: { prevo: 'A', tier: 'Unreleased' } });
    expect(bestOfLine(odd, ['A', 'B'])).toEqual({ bestTier: null, bestName: null });
  });

  test('empate aponta o estagio mais evoluido, que e ate onde vale evoluir', () => {
    const tie = source({ A: { evos: ['B'], tier: 'NU' }, B: { prevo: 'A', tier: 'NU' } });
    expect(bestOfLine(tie, ['A', 'B'])).toEqual({ bestTier: 'NU', bestName: 'B' });
  });
});
