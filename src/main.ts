import { BIOME_TABLE } from '../data/biome-table.generated';
import { TIER_TABLE } from '../data/tier-table.generated';
import { startOverlay } from './bootstrap';
import { armCapture } from './game/capture';
import type { PhaserHost } from './game/phaser';
import { reportFailure } from './render/diagnostics';

const TICK_INTERVAL_MS = 400;
const CAPTURE_TIMEOUT_MS = 20_000;

const armed = armCapture(window as PhaserHost, ({ game }) => {
  window.clearTimeout(timeout);
  const runner = startOverlay(game, TIER_TABLE, BIOME_TABLE);
  window.setInterval(() => runner.tick(), TICK_INTERVAL_MS);
});

const timeout = window.setTimeout(() => {
  reportFailure(`tier overlay: nao capturou o jogo (${armed.join(', ')})`);
}, CAPTURE_TIMEOUT_MS);
