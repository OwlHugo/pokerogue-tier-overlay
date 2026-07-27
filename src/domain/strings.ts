import type { Locale } from './names';

export type StringKey =
  | 'tabField'
  | 'tabParty'
  | 'tabBiome'
  | 'tabDestinations'
  | 'hintField'
  | 'hintParty'
  | 'hintBiome'
  | 'hintDestinations'
  | 'path'
  | 'inGame'
  | 'abilities'
  | 'recommended'
  | 'smogonBuilds'
  | 'topMoves'
  | 'noSets'
  | 'noEnemy'
  | 'emptyTeam'
  | 'noBiome'
  | 'noRoutes'
  | 'allOwned'
  | 'noEncounters'
  | 'inTeam'
  | 'becomes'
  | 'catch'
  | 'coverage'
  | 'newOf';

const STRINGS: Record<StringKey, Record<Locale, string>> = {
  tabField: { pt: 'Inimigo', en: 'Enemy' },
  tabParty: { pt: 'Time', en: 'Team' },
  tabBiome: { pt: 'Bioma', en: 'Biome' },
  tabDestinations: { pt: 'Destinos', en: 'Routes' },
  hintField: { pt: 'Quem está na sua frente agora.', en: 'What you are facing right now.' },
  hintParty: {
    pt: 'Os seis que você carrega, e o que falta neles.',
    en: 'The six you carry, and what they lack.',
  },
  hintBiome: {
    pt: 'Tudo que pode aparecer no bioma onde você está.',
    en: 'Everything that can show up in your current biome.',
  },
  hintDestinations: {
    pt: 'Para onde dá pra viajar daqui, e o que tem de novo em cada lugar.',
    en: 'Where you can travel from here, and what is new in each place.',
  },
  path: { pt: 'Como chega lá', en: 'How it gets there' },
  inGame: { pt: 'No jogo', en: 'In game' },
  abilities: { pt: 'Habilidades', en: 'Abilities' },
  recommended: { pt: 'recomendada', en: 'recommended' },
  smogonBuilds: { pt: 'Como o Smogon monta', en: 'How Smogon builds it' },
  topMoves: { pt: 'Golpes mais usados', en: 'Most used moves' },
  noSets: { pt: 'Sem sets catalogados pelo Smogon', en: 'No Smogon sets on record' },
  noEnemy: { pt: 'Nenhum inimigo em campo', en: 'No enemy on the field' },
  emptyTeam: { pt: 'Time vazio', en: 'Empty team' },
  noBiome: { pt: 'Entre numa run para ver o bioma', en: 'Start a run to see the biome' },
  noRoutes: { pt: 'Nenhuma rota a partir daqui', en: 'No route from here' },
  allOwned: { pt: 'Você já tem todos daqui', en: 'You already have all of these' },
  noEncounters: { pt: 'Sem encontros catalogados', en: 'No encounters on record' },
  inTeam: { pt: 'no time', en: 'on team' },
  becomes: { pt: 'vira', en: 'becomes' },
  catch: { pt: 'Captura', en: 'Catch' },
  coverage: { pt: 'Sem cobertura', en: 'Missing types' },
  newOf: { pt: 'novos de', en: 'new of' },
};

export function t(key: StringKey, locale: Locale): string {
  return STRINGS[key][locale];
}

export function detectLocale(language: string): Locale {
  return language.toLowerCase().startsWith('pt') ? 'pt' : 'en';
}
