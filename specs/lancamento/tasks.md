# Lançamento — fase 1 (distribuição)

Meta única desta fase: **1.000 instalações no Greasyfork**. Monetização não entra aqui.
Enquanto o número não existir, discutir preço é chute.

Regra que atravessa tudo: o overlay não faz nenhuma chamada de rede (`grant: none`, zero
`@require` externo). Isso é o que faz alguém confiar em colar um userscript. Nada nesta
fase pode quebrar isso — sem telemetria, sem ads dentro do jogo, sem "phone home".

## 1. Limpar a árvore

- [ ] Apagar `tools/tmp-do.mts` e `tools/tmp-open.mts` (scratch, não versionar)
- [ ] Commitar ou descartar o trabalho pendente em `spec/companion-in-game`
- [ ] Mergear em `main` o que for pra release
- **Pronto quando:** `git status` limpo em `main`, `npm test && npm run typecheck && npm run lint` passam

## 2. Repo público no GitHub

O `vite.config.ts` já aponta `namespace`, `homepageURL` e `supportURL` para
`https://github.com/OwlHugo/pokerogue-tier-overlay`.

- [ ] Criar o repo **público** com esse nome exato (se mudar o nome, atualizar o vite.config)
- [ ] `git remote add origin` + push de `main`
- [ ] Descrição e topics: `pokerogue`, `userscript`, `tampermonkey`, `smogon`, `pokemon`
- **Pronto quando:** README renderiza no GitHub e o CI (`ci.yml`) passa verde no push

## 3. Release com URL estável

`dist/` está no `.gitignore` (correto). Greasyfork consegue sincronizar sozinho a partir de
uma URL — mas precisa de uma que não mude a cada versão.

- [ ] Workflow `release.yml`: em `push` de tag `v*`, roda build e anexa
      `dist/pokerogue-tier-overlay.user.js` ao GitHub Release
- [ ] Tag `v2.0.0`
- **Pronto quando:** existe uma URL raw do `.user.js` que instala direto no Tampermonkey

Alternativa mais simples se não quiser CI de release: colar o código direto no Greasyfork a
cada versão. Funciona, mas você vai esquecer de atualizar.

## 4. Publicar no Greasyfork

- [ ] Conta no Greasyfork (login via GitHub)
- [ ] Publicar apontando para a URL do release, ou colando o bundle
- [ ] Descrição em pt-BR **e** en — rascunhos prontos em [`divulgacao.md`](divulgacao.md).
      A maior parte do público do PokéRogue é internacional; só pt-BR corta o teto
- [ ] Bundle abaixo de 500 KB — critério AD-8 de `dossie-in-game`. O último build deu
      **527 KB**, acima do limite. Resolver antes de tagear
- [ ] Confirmar que a licença declarada bate: `AGPL-3.0-only`
- **Pronto quando:** a página do script está no ar e instala num browser limpo

Notas: Greasyfork rejeita código ofuscado — o build já usa `minify: false`, mantenha assim.
Conta nova tem limite de posts por dia; publique uma vez, sem retrabalho.

## 5. Fechar o loop no README

- [ ] Trocar `*(link após a publicação)*` pelo link real do Greasyfork
- [ ] Adicionar screenshot/GIF do painel — é o que converte na página do Greasyfork e no
      Reddit; texto sozinho não vende overlay
- **Pronto quando:** alguém consegue instalar sem te perguntar nada

## 6. Divulgação

Ordem importa: publique primeiro, divulgue depois. Link quebrado no primeiro post queima a
única chance de atenção.

- [ ] r/pokerogue — post mostrando o problema resolvido (o exemplo do Magikarp → Gyarados),
      não a lista de features. Ler as regras de self-promo antes
- [ ] Discord oficial do PokéRogue — procurar canal de ferramentas/mods; conferir se
      divulgação é permitida antes de postar
- [ ] Wiki do PokéRogue — ver se aceita link em página de recursos da comunidade
- **Pronto quando:** primeiro feedback externo chegou (issue, comentário ou instalação de
      alguém que você não conhece)

## 7. Sponsors, sem pedir nada

- [ ] `.github/FUNDING.yml` com GitHub Sponsors e/ou Ko-fi
- [ ] Uma linha no rodapé do README. **Nada dentro do overlay** — nag num userscript de fã
      é o caminho mais rápido pra desinstalação e pra atenção jurídica indesejada
- **Pronto quando:** existe onde doar e nenhum lugar onde é pedido

## 8. Medir

Sem telemetria, de propósito. O que dá pra ler de fora:

- [ ] Contador de instalações do Greasyfork (diário e total)
- [ ] Stars e issues do GitHub
- [ ] Anotar o número 30 e 90 dias após o lançamento

**Gate para a fase 2:** 1.000 instalações. Abaixo disso, o problema é distribuição, e
construir mais feature não resolve distribuição.

## Fora de escopo nesta fase

- Qualquer feature nova (é fase 2, e só depois do gate)
- Site, SEO, ads (fase 3)
- Premium/paywall — userscript é código aberto no browser do usuário, não tem como impor.
  Só faz sentido se um dia houver servidor, e servidor com receita sobre conteúdo Pokémon é
  exatamente o que atrai DMCA
