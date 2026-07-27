# Material de divulgação — fase 1

Rascunhos prontos para colar. **Nada aqui foi publicado** — publicar exige sua conta e sua
autorização explícita, item a item.

Regra que vale para todos os textos: mostrar o problema resolvido, não a lista de features.
Ninguém instala userscript por bullet point; instala porque reconheceu a própria dor.

---

## Descrição do Greasyfork — inglês (principal)

O público do PokéRogue é majoritariamente internacional. Esta é a versão que decide o teto de
instalações; a pt-BR é secundária.

> **Shows the best Smogon tier each Pokémon can reach — before you spend the Poké Ball.**
>
> A Magikarp is LC and looks like trash. It becomes Gyarados. The overlay tells you that
> while the ball is still in your bag.
>
> ```
> Hoothoot   LC → RU (Noctowl)
> ```
>
> PokéRogue unlocks Mega Evolution and Gigantamax, so the species tier is not the tier that
> matters: Mawile is ZU, Mawile-Mega is OU. Kangaskhan-Mega is Uber. Charizard-Gmax is AG.
> The overlay accounts for evolution, mega and gmax, and shows whichever is best.
>
> **Where it shows up**
> - Battle: a badge above each enemy Pokémon, current tier and best reachable tier
> - Starter select: the best reachable tier on every icon in the grid, following filters and scroll
> - Guide panel: tabs for Enemy, Team, Biome and Destinations — click a row for the evolution
>   line with the tier of every step, plus the moves Smogon actually uses
>
> It shows Nature but not EVs, IVs or held items: PokéRogue has no EVs, IVs are rolled at the
> encounter, and items come from a modifier pool. Showing them would be competitive trivia,
> not a decision you can act on.
>
> The panel is closed by default. Data appears when you ask for it; the game screen stays the
> game's.
>
> **No network calls.** Everything ships inside the script — no `@require`, no fetch, no
> telemetry. Read the source, it's AGPL-3.0.
>
> Fan project. Not affiliated with Nintendo, The Pokémon Company, Smogon or PokéRogue.

## Descrição do Greasyfork — pt-BR

> **Mostra o melhor tier do Smogon que cada Pokémon alcança — antes de você gastar a Pokébola.**
>
> Um Magikarp é LC e parece lixo. Ele vira Gyarados. O overlay diz isso enquanto a bola ainda
> está na mochila.
>
> ```
> Hoothoot   LC → RU (Noctowl)
> ```
>
> O PokéRogue libera Mega e Gigantamax, então o tier da espécie não é o que importa: Mawile é
> ZU, Mawile-Mega é OU. O overlay considera evolução, mega e gmax, e mostra o melhor dos três.
>
> Badge na batalha, sigla em cada ícone da seleção de starter, e um painel "Guia" com as abas
> Inimigo, Time, Bioma e Destinos. Fechado por padrão.
>
> Mostra Nature, mas não EVs, IVs nem item: o PokéRogue não tem EVs, IVs são sorteados no
> encontro e itens vêm de pool de modifier. O resto seria trivia, não decisão.
>
> **Zero chamada de rede.** Tudo embutido no script — sem `@require`, sem fetch, sem
> telemetria. AGPL-3.0, código aberto.
>
> Projeto de fã, sem vínculo com Nintendo, The Pokémon Company, Smogon ou PokéRogue.

---

## Post no r/pokerogue (inglês)

Antes de postar: ler as regras da sub sobre self-promotion e ferramentas de terceiros.
Post sem screenshot/GIF morre — anexar o GIF do painel abrindo.

> **Title:** I made an overlay that shows the best Smogon tier each Pokémon can reach,
> including Mega and Gmax
>
> Every run I'd stop and check whether the thing I just met was worth a ball. Magikarp is LC.
> Gyarados is not. The wiki knows that; the game doesn't tell you.
>
> So the overlay puts it above the enemy: current tier, and the best tier anything in that
> evolution line can reach — counting Mega and Gigantamax, since PokéRogue unlocks both.
> Mawile-Mega being OU changes what a ZU encounter is worth.
>
> It also has a guide panel (closed by default) with what spawns in the current biome by
> rarity, where the current biome can lead, and your team's missing type coverage.
>
> It deliberately drops most of a Smogon set. PokéRogue has no EVs, IVs are rolled at the
> encounter, held items come from a modifier pool. Nature stays, because Mints exist. Showing
> the rest would look thorough and help nobody.
>
> Runs as a userscript via Tampermonkey. No network calls, nothing collected — the tier data
> is compiled into the file. Source is AGPL-3.0, biome pools are generated straight from the
> PokéRogue repo at a pinned commit.
>
> [Greasyfork link] · [GitHub link]
>
> Known limitation, stated up front: Smogon tier measures the competitive metagame, which is
> not the same thing as strength in PokéRogue — passives, fusions and items aren't modeled.
> It's a signal, not a verdict.

## Mensagem no Discord do PokéRogue

Procurar canal de ferramentas/mods. **Confirmar se divulgação é permitida antes de postar** —
tomar ban no servidor oficial custa mais do que qualquer instalação ganha.

> Built a Tampermonkey overlay that shows the best Smogon tier each Pokémon's line can reach
> (Mega/Gmax included) on the enemy badge and the starter grid, plus a biome/route panel.
> No network calls, AGPL-3.0, source on GitHub. [link]

---

## Onde não divulgar

- Qualquer lugar que enquadre o projeto como produto ou cobre por ele. Tudo aqui é ferramenta
  de fã, gratuita, e o texto tem que deixar isso explícito — é o que mantém o projeto fora do
  radar jurídico da Nintendo.
- Comunidades de Pokémon oficiais (r/pokemon, Discord da TPC). PokéRogue é fan game; levar a
  ferramenta pra lá só antecipa atenção indesejada.
