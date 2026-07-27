import { describe, expect, test } from 'vitest';
import { parsePins } from '../tools/upstream.mts';

describe('pins do upstream', () => {
  test('aceita os dois repositorios com commit', () => {
    const pins = parsePins(
      '{"pokerogue":{"repo":"a/b","commit":"abc"},"locales":{"repo":"c/d","commit":"def"}}',
    );
    expect(pins.pokerogue.commit).toBe('abc');
    expect(pins.locales.repo).toBe('c/d');
  });

  test('recusa pin sem commit em vez de seguir com fonte indefinida', () => {
    expect(() =>
      parsePins('{"pokerogue":{"repo":"a/b"},"locales":{"repo":"c/d","commit":"x"}}'),
    ).toThrow(/pokerogue/);
  });

  test('recusa arquivo sem um dos repositorios', () => {
    expect(() => parsePins('{"pokerogue":{"repo":"a/b","commit":"abc"}}')).toThrow(/locales/);
  });

  test('recusa commit vazio', () => {
    expect(() =>
      parsePins('{"pokerogue":{"repo":"a/b","commit":""},"locales":{"repo":"c/d","commit":"x"}}'),
    ).toThrow(/pokerogue/);
  });
});
