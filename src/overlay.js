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
})();
