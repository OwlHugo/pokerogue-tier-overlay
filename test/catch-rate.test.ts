import { describe, expect, test } from 'vitest';
import { catchDifficultyOf, catchText } from '../src/domain/catch-rate';

describe('catchDifficultyOf', () => {
  test('255 e o mais facil que existe', () => {
    expect(catchDifficultyOf(255)).toBe('muitoFacil');
  });

  test('45, tipico de inicial evoluido, e dificil', () => {
    expect(catchDifficultyOf(45)).toBe('dificil');
  });

  test('3, tipico de lendario, e muito dificil', () => {
    expect(catchDifficultyOf(3)).toBe('muitoDificil');
  });

  test('as faixas nao deixam buraco entre 3 e 255', () => {
    for (let rate = 3; rate <= 255; rate += 1) {
      expect(catchDifficultyOf(rate)).toBeTypeOf('string');
    }
  });
});

describe('catchText', () => {
  test('traduz nos dois idiomas', () => {
    expect(catchText(255, 'pt')).toBe('muito fácil');
    expect(catchText(255, 'en')).toBe('very easy');
  });

  test('sem catch rate devolve null em vez de texto vazio', () => {
    expect(catchText(null, 'pt')).toBeNull();
  });
});
