import { BIOME_TABLE } from '../data/biome-table.generated';
import { MOVESET_TABLE } from '../data/moveset-table.generated';
import { ABILITY_NAMES, BIOME_NAMES } from '../data/names.generated';
import { TIER_TABLE } from '../data/tier-table.generated';
import { startOverlay } from './bootstrap';
import { detectLocale } from './domain/strings';
import { armCapture } from './game/capture';
import type { PhaserHost } from './game/phaser';
import { reportFailure } from './render/diagnostics';

const LOCALE = detectLocale(navigator.language);
const TICK_INTERVAL_MS = 400;
const CAPTURE_TIMEOUT_MS = 20_000;

const armed = armCapture(window as PhaserHost, ({ game }) => {
  window.clearTimeout(timeout);
  const runner = startOverlay(
    game,
    TIER_TABLE,
    BIOME_TABLE,
    MOVESET_TABLE,
    BIOME_NAMES[LOCALE],
    ABILITY_NAMES,
    LOCALE,
  );
  window.setInterval(() => runner.tick(), TICK_INTERVAL_MS);
});

const timeout = window.setTimeout(() => {
  reportFailure(`tier overlay: nao capturou o jogo (${armed.join(', ')})`);
}, CAPTURE_TIMEOUT_MS);
