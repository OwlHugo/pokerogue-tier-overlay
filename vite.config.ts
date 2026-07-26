import { defineConfig } from 'vite';
import monkey from 'vite-plugin-monkey';

const repository = 'https://github.com/hugoadriano/pokerogue-tier-overlay';

export default defineConfig({
  plugins: [
    monkey({
      entry: 'src/main.ts',
      userscript: {
        name: 'PokeRogue Tier Overlay',
        namespace: repository,
        description:
          'Mostra o melhor tier competitivo do Smogon que a linha evolutiva de cada Pokemon alcanca, na batalha e na selecao de starter',
        icon: 'https://pokerogue.net/logo512.png',
        match: ['https://pokerogue.net/*'],
        'run-at': 'document-start',
        license: 'MIT',
        homepageURL: repository,
        supportURL: `${repository}/issues`,
      },
      build: {
        fileName: 'pokerogue-tier-overlay.user.js',
        metaFileName: true,
      },
    }),
  ],
  build: {
    target: 'es2022',
    minify: false,
  },
});
