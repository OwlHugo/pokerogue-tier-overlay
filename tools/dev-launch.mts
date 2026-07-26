import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import puppeteer from 'puppeteer';

const BUNDLE = new URL('../dist/pokerogue-tier-overlay.user.js', import.meta.url);
const PROFILE = fileURLToPath(new URL('../.profile', import.meta.url));
const GAME_URL = 'https://pokerogue.net/';

const injectLate = process.argv.includes('--late');
const bundle = readFileSync(BUNDLE, 'utf8');

const browser = await puppeteer.launch({
  headless: false,
  userDataDir: PROFILE,
  defaultViewport: null,
  args: ['--window-size=1280,900'],
});

const [page] = await browser.pages();
if (!page) throw new Error('puppeteer nao abriu nenhuma aba');

if (!injectLate) {
  await page.evaluateOnNewDocument(bundle);
}

await page.goto(GAME_URL, { waitUntil: 'domcontentloaded' });

if (injectLate) {
  await page.waitForFunction(() => 'Phaser' in window, { timeout: 60_000 });
  await page.evaluate(bundle);
}

process.stdout.write(
  `${injectLate ? 'injetado depois do jogo carregar' : 'injetado antes do bundle'}\n`,
);
browser.on('disconnected', () => process.exit(0));
