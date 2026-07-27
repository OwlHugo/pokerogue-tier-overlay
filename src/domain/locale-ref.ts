import type { Locale } from './names';

export interface LocaleRef {
  current: Locale;
}

export function localeRef(initial: Locale): LocaleRef {
  return { current: initial };
}
