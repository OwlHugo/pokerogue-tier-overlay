import { readFileSync, writeFileSync } from 'node:fs';
import { fetchUpstream, readPins } from './upstream.mts';

const ATRIBUTOS = ['PostVictoryStatStageChangeAbAttr', 'PostBattleInitStatStageChangeAbAttr'];

const pins = readPins();
const game = fetchUpstream('pokerogue', pins.pokerogue, ['src/enums', 'src/data/abilities']);

const { AbilityId } = (await import(`${game}/src/enums/ability-id.ts`)) as {
  AbilityId: Record<string, number>;
};

const fonte = readFileSync(`${game}/src/data/abilities/init-abilities.ts`, 'utf8');
const blocos = fonte.split('new AbBuilder(AbilityId.').slice(1);

const ids = new Set<number>();

for (const bloco of blocos) {
  const rotulo = bloco.slice(0, bloco.indexOf(',')).trim();
  const id = AbilityId[rotulo];
  if (typeof id !== 'number') continue;

  if (ATRIBUTOS.some((attr) => bloco.includes(attr))) ids.add(id);
}

if (ids.size === 0) throw new Error('nenhuma ability de snowball encontrada: o upstream mudou');

const ordenados = [...ids].sort((a, b) => a - b);

writeFileSync(
  new URL('../data/snowball.generated.ts', import.meta.url),
  [`export const SNOWBALL_ABILITIES: readonly number[] = ${JSON.stringify(ordenados)};`, ''].join(
    '\n',
  ),
);

process.stdout.write(
  `${ordenados.length} abilities que acumulam stat em data/snowball.generated.ts\n`,
);
