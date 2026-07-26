// Abre o PokeRogue num Chrome controlado, com o overlay injetado antes do bundle do jogo.
// evaluateOnNewDocument e o unico ponto em que da para instalar o hook do Phaser a tempo:
// o jogo nao expoe a instancia do Game em nenhum global.
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import puppeteer from 'puppeteer';

const root = new URL('..', import.meta.url);
const read = (path) => readFileSync(new URL(path, root), 'utf8');

const script = `window.__tierData = ${read('data/tiers.json')};\n${read('src/overlay.js')}`;

const browser = await puppeteer.launch({
  headless: false,
  // Mantem o login entre execucoes. Contem sessao autenticada — fora do git.
  userDataDir: fileURLToPath(new URL('.profile', root)),
  defaultViewport: null,
  args: ['--window-size=1280,900'],
});

const [page] = await browser.pages();
await page.evaluateOnNewDocument(script);
await page.goto('https://pokerogue.net/', { waitUntil: 'domcontentloaded' });

console.log('PokeRogue aberto com o tier overlay. Feche a janela para encerrar.');
browser.on('disconnected', () => process.exit(0));
