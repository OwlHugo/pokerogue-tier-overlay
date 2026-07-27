import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import puppeteer from 'puppeteer';

const PROFILE = fileURLToPath(new URL('../.profile', import.meta.url));
const BUNDLE = readFileSync(
  new URL('../dist/pokerogue-tier-overlay.user.js', import.meta.url),
  'utf8',
);

const browser = await puppeteer.launch({
  headless: false,
  userDataDir: PROFILE,
  defaultViewport: null,
  args: ['--window-size=1280,900'],
});

const [page] = await browser.pages();
if (!page) throw new Error('sem aba');

await page.evaluateOnNewDocument(BUNDLE);
await page.goto('https://pokerogue.net/', { waitUntil: 'domcontentloaded' });

await page.waitForFunction(() => document.querySelector('canvas') !== null, { timeout: 120_000 });
await page.waitForFunction(() => 'Phaser' in window, { timeout: 120_000 });

await page.evaluate(() => {
  const w = window as unknown as {
    __g?: unknown;
    Phaser: { Scenes: { Systems: { prototype: { step: (...a: unknown[]) => unknown } } } };
  };
  const proto = w.Phaser.Scenes.Systems.prototype;
  const original = proto.step;
  proto.step = function (this: { game: unknown }, ...args: unknown[]) {
    w.__g ??= this.game;
    return original.apply(this, args);
  };
});

await page.waitForFunction(() => (window as unknown as { __g?: unknown }).__g !== undefined, {
  timeout: 60_000,
});

writeFileSync('/tmp/pokerogue-ws.txt', browser.wsEndpoint());
process.stdout.write(`pronto: ${browser.wsEndpoint()}\n`);

browser.on('disconnected', () => process.exit(0));
await new Promise(() => {});
