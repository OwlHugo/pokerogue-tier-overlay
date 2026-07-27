import { describe, expect, test } from 'vitest';
import { detectLocale, t } from '../src/domain/strings';

describe('detectLocale', () => {
  test('reconhece portugues em qualquer variante', () => {
    expect(detectLocale('pt-BR')).toBe('pt');
    expect(detectLocale('pt')).toBe('pt');
    expect(detectLocale('PT-pt')).toBe('pt');
  });

  test('qualquer outro idioma cai em ingles', () => {
    expect(detectLocale('en-US')).toBe('en');
    expect(detectLocale('ja')).toBe('en');
    expect(detectLocale('')).toBe('en');
  });
});

describe('t', () => {
  test('traduz nos dois idiomas', () => {
    expect(t('tabField', 'pt')).toBe('Inimigo');
    expect(t('tabField', 'en')).toBe('Enemy');
  });

  test('nenhuma chave fica sem texto em nenhum idioma', () => {
    const keys = ['tabField', 'hintParty', 'path', 'noSets', 'catch'] as const;
    for (const key of keys) {
      expect(t(key, 'pt').length).toBeGreaterThan(0);
      expect(t(key, 'en').length).toBeGreaterThan(0);
    }
  });
});
