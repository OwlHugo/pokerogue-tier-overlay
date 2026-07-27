import type { Locale } from './names';

export type CatchDifficulty = 'muitoFacil' | 'facil' | 'media' | 'dificil' | 'muitoDificil';

const LABELS: Record<CatchDifficulty, Record<Locale, string>> = {
  muitoFacil: { pt: 'muito fácil', en: 'very easy' },
  facil: { pt: 'fácil', en: 'easy' },
  media: { pt: 'média', en: 'average' },
  dificil: { pt: 'difícil', en: 'hard' },
  muitoDificil: { pt: 'muito difícil', en: 'very hard' },
};

export function catchDifficultyOf(rate: number): CatchDifficulty {
  if (rate >= 190) return 'muitoFacil';
  if (rate >= 120) return 'facil';
  if (rate >= 60) return 'media';
  if (rate >= 30) return 'dificil';
  return 'muitoDificil';
}

export function catchText(rate: number | null, locale: Locale): string | null {
  if (rate === null) return null;
  return LABELS[catchDifficultyOf(rate)][locale];
}
