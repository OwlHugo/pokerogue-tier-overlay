import { execFileSync } from 'node:child_process';
import { mkdirSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

export interface Pin {
  repo: string;
  commit: string;
}

export interface Pins {
  pokerogue: Pin;
  locales: Pin;
}

export function parsePins(raw: string): Pins {
  const parsed = JSON.parse(raw) as Record<string, Partial<Pin> | undefined>;

  const pinFor = (name: string): Pin => {
    const pin = parsed[name];
    if (!pin?.repo || !pin?.commit) {
      throw new Error(`pokerogue-source.json: pin invalido para ${name}`);
    }
    return { repo: pin.repo, commit: pin.commit };
  };

  return { pokerogue: pinFor('pokerogue'), locales: pinFor('locales') };
}

export function readPins(): Pins {
  return parsePins(readFileSync(new URL('../data/pokerogue-source.json', import.meta.url), 'utf8'));
}

export function fetchUpstream(name: string, pin: Pin, sparse: readonly string[]): string {
  const dir = fileURLToPath(new URL(`../.upstream/${name}/`, import.meta.url));
  mkdirSync(dir, { recursive: true });

  const git = (...args: string[]): void => {
    execFileSync('git', args, { cwd: dir, stdio: ['ignore', 'ignore', 'inherit'] });
  };

  git('init', '--quiet');
  git('config', 'remote.origin.url', `https://github.com/${pin.repo}.git`);
  git('config', 'remote.origin.fetch', '+refs/heads/*:refs/remotes/origin/*');
  git('config', 'extensions.partialClone', 'origin');
  git('config', 'remote.origin.promisor', 'true');
  git('config', 'remote.origin.partialclonefilter', 'blob:none');
  git('sparse-checkout', 'init', '--cone');
  git('sparse-checkout', 'set', ...sparse);
  git('fetch', '--quiet', '--depth', '1', 'origin', pin.commit);
  git('checkout', '--quiet', '--force', pin.commit);

  return dir;
}
