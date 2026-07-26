# PokéRogue Tier Overlay

Marca na tela, durante a batalha, o **melhor tier competitivo do Smogon que a linha
evolutiva do Pokémon inimigo alcança**. Serve para decidir se vale gastar Pokébola: um
Magikarp é LC, mas vira Gyarados.

```
Hoothoot · LC → RU (Noctowl)
```

## Rodar

```bash
npm install
npm start
```

Abre uma janela do Chrome no PokéRogue com o overlay já ativo. O login é salvo em
`.profile/` — só é pedido na primeira vez.

## Atualizar os tiers

Os tiers do Smogon mudam a cada shift. Para regerar:

```bash
npm run build:tiers
```

Lê o `@pkmn/dex` (dados oficiais do Showdown, geração 9) e reescreve `data/tiers.json`.
Nenhuma chamada de rede acontece durante o jogo — o JSON é embutido na injeção.

## Testes

```bash
npm test
```

## Como funciona

O PokéRogue é um jogo Phaser em canvas: não há DOM para ler. O jogo também **não expõe a
instância do `Phaser.Game`** em nenhuma variável global. Por isso o launcher usa
`page.evaluateOnNewDocument` do Puppeteer — o único momento em que dá para instalar um
interceptador em `window.Phaser` *antes* do bundle do jogo carregar. Feito isso, o overlay
lê `game.scene.getScene('battle').getEnemyField()` a cada 400 ms.

A identificação é sempre por `species.speciesId` (número da Pokédex nacional), nunca por
texto exibido — a interface do jogo é traduzida e os nomes mudam conforme o idioma.

## Se aparecer um aviso vermelho

| Aviso | Significado |
|---|---|
| `instancia do jogo nao capturada` | O jogo mudou a forma como carrega o Phaser. O hook em `src/overlay.js` precisa ser ajustado. |
| `scene "battle" mudou de formato` | Uma atualização do PokéRogue renomeou `getEnemyField` ou a scene `battle`. |

O overlay falha de forma visível de propósito: melhor um aviso do que um painel silencioso
mostrando tier errado.

## Limitações conhecidas

- Só marca inimigos em campo, não o seu time.
- Formas exclusivas do PokéRogue sem equivalente no Smogon caem para a espécie base; se nem
  isso existir, o tier aparece como `?` — nunca é inventado.
- Batalha dupla lista os dois inimigos no painel, sem badge colada em cada sprite.
