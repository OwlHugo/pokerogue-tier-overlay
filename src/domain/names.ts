export type Locale = 'pt' | 'en';

export type NamesByLocale = Readonly<Record<Locale, Record<number, string>>>;

export function nameOf(table: NamesByLocale, locale: Locale, id: number): string | null {
  return table[locale][id] ?? table.en[id] ?? null;
}
