import type { Locale } from './names';
import type { Tier } from './tier';

export type Rating = 'excepcional' | 'muitoBom' | 'bom' | 'mediano' | 'fraco' | 'cresce';

const BY_TIER: Record<Tier, Rating> = {
  AG: 'excepcional',
  Uber: 'excepcional',
  OU: 'muitoBom',
  UUBL: 'muitoBom',
  UU: 'bom',
  RUBL: 'bom',
  RU: 'bom',
  NUBL: 'mediano',
  NU: 'mediano',
  PUBL: 'fraco',
  PU: 'fraco',
  ZUBL: 'fraco',
  ZU: 'fraco',
  NFE: 'cresce',
  LC: 'cresce',
};

const LABELS: Record<Rating, Record<Locale, string>> = {
  excepcional: { pt: 'Excepcional', en: 'Exceptional' },
  muitoBom: { pt: 'Muito bom', en: 'Very good' },
  bom: { pt: 'Bom', en: 'Good' },
  mediano: { pt: 'Mediano', en: 'Average' },
  fraco: { pt: 'Fraco', en: 'Weak' },
  cresce: { pt: 'Ainda cresce', en: 'Still grows' },
};

const COLORS: Record<Rating, string> = {
  excepcional: '#a855f7',
  muitoBom: '#ef4444',
  bom: '#f97316',
  mediano: '#eab308',
  fraco: '#64748b',
  cresce: '#22c55e',
};

export function ratingOf(tier: Tier | null): Rating | null {
  return tier === null ? null : BY_TIER[tier];
}

export function ratingLabel(rating: Rating | null, locale: Locale): string {
  return rating === null ? '?' : LABELS[rating][locale];
}

export function ratingColor(rating: Rating | null): string {
  return rating === null ? '#3f3f46' : COLORS[rating];
}
