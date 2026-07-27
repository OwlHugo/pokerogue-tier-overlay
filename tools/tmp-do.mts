import { readFileSync } from 'node:fs';
import puppeteer from 'puppeteer';

const SHOTS =
  '/private/tmp/claude-501/-Users-hugoadriano-work-seven-Seven-pokerogue-tier-overlay/abe2dcbc-6c9e-4b53-8dcf-da0f7b2b0d45/scratchpad';

const [, , shot, ...actions] = process.argv;

const browser = await puppeteer.connect({
  browserWSEndpoint: readFileSync('/tmp/pokerogue-ws.txt', 'utf8').trim(),
  defaultViewport: null,
});

async function findPage() {
  for (let i = 0; i < 20; i += 1) {
    const pages = await browser.pages();
    const found = pages.find((p) => p.url().includes('pokerogue'));
    if (found) return found;
    const target = browser.targets().find((t) => t.url().includes('pokerogue'));
    const viaTarget = await target?.page();
    if (viaTarget) return viaTarget;
    await new Promise((r) => setTimeout(r, 500));
  }
  throw new Error('nao achei a aba do pokerogue');
}

const page = await findPage();

for (const action of actions) {
  const [kind, value, repeatRaw] = action.split(':');
  const repeat = Number(repeatRaw ?? 1);

  for (let i = 0; i < repeat; i += 1) {
    if (kind === 'key') await page.keyboard.press(value as never);
    if (kind === 'click') await page.click(value as string);
    if (kind === 'wait') await new Promise((r) => setTimeout(r, Number(value)));
    if (kind === 'tab') {
      await page.evaluate((idx) => {
        document.querySelectorAll<HTMLElement>('.ptr-tab')[idx]?.click();
      }, Number(value));
    }
    if (kind !== 'wait') await new Promise((r) => setTimeout(r, 450));
  }
}

const estado = await page.evaluate(() => {
  const w = window as unknown as {
    __g: { scene: { getScene(k: string): Record<string, unknown> | null } };
    gameInfo?: { gameMode?: string; biome?: string; wave?: number };
  };
  const scene = w.__g.scene.getScene('battle');
  const ui = scene?.ui as
    | { mode: number; handlers: { constructor: { name: string } }[] }
    | undefined;
  const gameData = scene?.gameData as Record<string, unknown> | undefined;
  const dex = gameData?.dexData as Record<string, { caughtAttr?: unknown }> | undefined;

  return {
    tela: ui ? ui.handlers[ui.mode]?.constructor.name : null,
    bioma: (scene?.arena as { biomeId?: number } | null)?.biomeId ?? null,
    emBatalha: scene?.currentBattle !== null && scene?.currentBattle !== undefined,
    party: (scene?.party as unknown[] | undefined)?.length ?? 0,
    modo: w.gameInfo?.gameMode ?? null,
    wave: w.gameInfo?.wave ?? null,
    entradasDex: dex ? Object.keys(dex).length : null,
    capturados: dex
      ? Object.values(dex).filter((e) => {
          const a = e?.caughtAttr;
          return typeof a === 'bigint' ? a !== 0n : Number(a ?? 0) !== 0;
        }).length
      : null,
    painelAberto: !!document.querySelector('.ptr-panel')?.checkVisibility?.(),
  };
});

process.stdout.write(`${JSON.stringify(estado)}\n`);

if (shot && shot !== '-') {
  await page.screenshot({ path: `${SHOTS}/${shot}.png` });
  process.stdout.write(`screenshot: ${shot}.png\n`);
}

browser.disconnect();
