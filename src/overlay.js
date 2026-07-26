// Injetado como texto em pokerogue.net antes de qualquer script do jogo.
// Sem import/export: precisa rodar como script solto na pagina.
(() => {
  const TIER_ORDER = [
    'AG', 'Uber', 'OU', 'UUBL', 'UU', 'RUBL', 'RU',
    'NUBL', 'NU', 'PUBL', 'PU', 'ZUBL', 'ZU', 'NFE', 'LC',
  ];
  const RANK = Object.fromEntries(TIER_ORDER.map((t, i) => [t, i]));
  const rankOf = (tier) => RANK[String(tier ?? '').replace(/[()]/g, '')];

  function betterTier(a, b) {
    const ra = rankOf(a);
    const rb = rankOf(b);
    if (ra === undefined) return rb === undefined ? null : b;
    if (rb === undefined) return a;
    return ra <= rb ? a : b;
  }

  // A UI do jogo e traduzivel, entao nada aqui depende de texto exibido:
  // a identificacao e sempre por species.speciesId (numero da Pokedex nacional).
  function extractEnemies(scene) {
    if (!scene || !scene.currentBattle) return [];
    return scene.getEnemyField().map((p) => ({
      speciesId: p.species.speciesId,
      formIndex: p.formIndex,
      name: p.species.name,
      formKey: (p.species.forms?.[p.formIndex] ?? {}).formKey ?? '',
      fusion: p.fusionSpecies
        ? {
            speciesId: p.fusionSpecies.speciesId,
            name: p.fusionSpecies.name,
            formKey: (p.fusionSpecies.forms?.[p.fusionFormIndex] ?? {}).formKey ?? '',
          }
        : null,
    }));
  }

  const lookup = (data, speciesId, formKey) =>
    (formKey && data[`${speciesId}:${formKey}`]) || data[String(speciesId)] || null;

  function resolve(mon, data) {
    const self = lookup(data, mon.speciesId, mon.formKey);
    const other = mon.fusion ? lookup(data, mon.fusion.speciesId, mon.fusion.formKey) : null;
    const name = mon.fusion ? `${mon.name}/${mon.fusion.name}` : mon.name;

    if (!self && !other) return { name, tier: '?', bestTier: '?', bestName: null };

    const selfBest = self?.bestTier ?? null;
    const best = betterTier(selfBest, other?.bestTier ?? null);
    // betterTier devolve o primeiro argumento no empate; o nome segue a mesma escolha.
    const bestName = best !== null && best === selfBest ? self.bestName : other?.bestName;

    return {
      name,
      tier: betterTier(self?.tier ?? null, other?.tier ?? null) ?? '?',
      bestTier: best ?? '?',
      bestName: bestName ?? null,
    };
  }

  globalThis.__tierOverlay = { extractEnemies, resolve, betterTier };

  // Fora do browser (testes em node) para por aqui: so as funcoes puras acima.
  if (typeof window === 'undefined' || typeof document === 'undefined') return;

  // --- Hook -----------------------------------------------------------------
  // O jogo nao expoe a instancia do Phaser.Game em nenhum global. Este script roda
  // antes do bundle, entao intercepta o momento em que ele define window.Phaser e
  // patcheia o boot do Game para guardar a instancia.
  let phaser;
  Object.defineProperty(window, 'Phaser', {
    configurable: true,
    get: () => phaser,
    set(value) {
      phaser = value;
      const boot = value.Game.prototype.boot;
      value.Game.prototype.boot = function bootWithTierHook() {
        window.__tierGame = this;
        return boot.apply(this, arguments);
      };
    },
  });

  // --- Render ---------------------------------------------------------------
  const COLORS = {
    AG: '#8b2fd6', Uber: '#8b2fd6',
    OU: '#c62828', UUBL: '#c62828',
    UU: '#b45309', RUBL: '#b45309', RU: '#b45309',
    NUBL: '#4d7c0f', NU: '#4d7c0f',
  };
  const HOOK_TIMEOUT_MS = 15000;

  let panel = null;
  let lastKey = null;
  const startedAt = Date.now();

  function ensurePanel() {
    if (panel) return panel;
    if (!document.body) return null;
    panel = document.createElement('div');
    panel.style.cssText = [
      'position:fixed',
      'z-index:2147483647',
      'pointer-events:none',
      'display:none',
      'font:600 13px/1.5 ui-monospace,SFMono-Regular,Menlo,monospace',
      'color:#fff',
      'text-align:right',
      'text-shadow:0 1px 2px rgba(0,0,0,.8)',
    ].join(';');
    document.body.appendChild(panel);
    return panel;
  }

  // Ancora no canvas, nao na janela: o jogo e letterboxed e a janela muda de tamanho.
  // A faixa usada e o ceu logo abaixo do texto de bioma/dinheiro, que fica vazio.
  function position() {
    const canvas = document.querySelector('canvas');
    if (!canvas || !panel) return;
    const r = canvas.getBoundingClientRect();
    panel.style.top = `${r.top + r.height * 0.12}px`;
    panel.style.left = `${r.left}px`;
    panel.style.width = `${r.width}px`;
    panel.style.paddingRight = `${r.width * 0.02}px`;
    panel.style.boxSizing = 'border-box';
  }

  function row(bg, text) {
    const div = document.createElement('div');
    div.style.cssText = `display:inline-block;margin-bottom:3px;padding:3px 8px;border-radius:4px;background:${bg};`;
    div.textContent = text;
    return div;
  }

  function render(entries) {
    if (!ensurePanel()) return;
    panel.replaceChildren();
    if (entries.length === 0) {
      panel.style.display = 'none';
      return;
    }
    for (const e of entries) {
      const bg = COLORS[String(e.bestTier).replace(/[()]/g, '')] ?? '#3f3f46';
      const best = e.bestName && e.bestName !== e.name ? ` (${e.bestName})` : '';
      panel.appendChild(row(bg, `${e.name} · ${e.tier ?? '?'} → ${e.bestTier}${best}`));
      panel.appendChild(document.createElement('br'));
    }
    panel.style.display = 'block';
    position();
  }

  function fail(message) {
    if (!ensurePanel()) return;
    panel.replaceChildren(row('#b91c1c', message));
    panel.style.display = 'block';
    position();
  }

  function tick() {
    const game = window.__tierGame;
    if (!game) {
      if (Date.now() - startedAt > HOOK_TIMEOUT_MS) {
        clearInterval(timer);
        fail('tier-overlay: instancia do jogo nao capturada');
      }
      return;
    }

    const scene = game.scene.getScene('battle');
    if (!scene || typeof scene.getEnemyField !== 'function') {
      clearInterval(timer);
      fail('tier-overlay: scene "battle" mudou de formato');
      return;
    }

    const enemies = extractEnemies(scene);
    const key = enemies
      .map((e) => `${e.speciesId}/${e.formIndex}/${e.fusion ? e.fusion.speciesId : ''}`)
      .join('|');

    if (key === lastKey) {
      position();
      return;
    }
    lastKey = key;
    render(enemies.map((e) => resolve(e, window.__tierData ?? {})));
  }

  const timer = setInterval(tick, 400);
  window.addEventListener('resize', position);
})();

