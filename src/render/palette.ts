import type { Tier } from '../domain/tier';
import type { TextStyle } from '../game/phaser';

export const BADGE_DEPTH = 1000;

const BACKGROUNDS: Record<Tier, string> = {
  AG: '#6d28d9',
  Uber: '#6d28d9',
  OU: '#b91c1c',
  UUBL: '#b91c1c',
  UU: '#b45309',
  RUBL: '#b45309',
  RU: '#b45309',
  NUBL: '#4d7c0f',
  NU: '#4d7c0f',
  PUBL: '#3f6212',
  PU: '#3f6212',
  ZUBL: '#44403c',
  ZU: '#44403c',
  NFE: '#44403c',
  LC: '#44403c',
};

const UNKNOWN_BACKGROUND = '#27272a';

export function backgroundFor(tier: Tier | null): string {
  return tier === null ? UNKNOWN_BACKGROUND : BACKGROUNDS[tier];
}

export function badgeStyle(tier: Tier | null): TextStyle {
  return {
    fontFamily: 'emerald',
    fontSize: '48px',
    color: '#ffffff',
    backgroundColor: backgroundFor(tier),
    padding: { x: 6, y: 3 },
  };
}
