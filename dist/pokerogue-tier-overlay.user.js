// ==UserScript==
// @name         PokeRogue Tier Overlay
// @namespace    https://github.com/hugoadriano/pokerogue-tier-overlay
// @version      2.0.0
// @description  Mostra o melhor tier competitivo do Smogon que a linha evolutiva de cada Pokemon alcanca, na batalha e na selecao de starter
// @license      MIT
// @icon         https://pokerogue.net/logo512.png
// @homepageURL  https://github.com/hugoadriano/pokerogue-tier-overlay
// @supportURL   https://github.com/hugoadriano/pokerogue-tier-overlay/issues
// @match        https://pokerogue.net/*
// @grant        none
// @run-at       document-start
// ==/UserScript==

(function() {
	"use strict";
	var TIER_TABLE = {
		"1": {
			"tier": "LC",
			"bestTier": "PU",
			"bestName": "Venusaur",
			"mega": {
				"tier": "UUBL",
				"name": "Venusaur-Mega"
			},
			"gmax": {
				"tier": "AG",
				"name": "Venusaur-Gmax"
			}
		},
		"2": {
			"tier": "NFE",
			"bestTier": "PU",
			"bestName": "Venusaur",
			"mega": {
				"tier": "UUBL",
				"name": "Venusaur-Mega"
			},
			"gmax": {
				"tier": "AG",
				"name": "Venusaur-Gmax"
			}
		},
		"3": {
			"tier": "PU",
			"bestTier": "PU",
			"bestName": "Venusaur",
			"mega": {
				"tier": "UUBL",
				"name": "Venusaur-Mega"
			},
			"gmax": {
				"tier": "AG",
				"name": "Venusaur-Gmax"
			}
		},
		"4": {
			"tier": "LC",
			"bestTier": "ZU",
			"bestName": "Charizard",
			"mega": {
				"tier": "OU",
				"name": "Charizard-Mega-X"
			},
			"gmax": {
				"tier": "AG",
				"name": "Charizard-Gmax"
			}
		},
		"5": {
			"tier": "NFE",
			"bestTier": "ZU",
			"bestName": "Charizard",
			"mega": {
				"tier": "OU",
				"name": "Charizard-Mega-X"
			},
			"gmax": {
				"tier": "AG",
				"name": "Charizard-Gmax"
			}
		},
		"6": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Charizard",
			"mega": {
				"tier": "OU",
				"name": "Charizard-Mega-X"
			},
			"gmax": {
				"tier": "AG",
				"name": "Charizard-Gmax"
			}
		},
		"7": {
			"tier": "LC",
			"bestTier": "RUBL",
			"bestName": "Blastoise",
			"mega": {
				"tier": "RU",
				"name": "Blastoise-Mega"
			},
			"gmax": {
				"tier": "AG",
				"name": "Blastoise-Gmax"
			}
		},
		"8": {
			"tier": "NFE",
			"bestTier": "RUBL",
			"bestName": "Blastoise",
			"mega": {
				"tier": "RU",
				"name": "Blastoise-Mega"
			},
			"gmax": {
				"tier": "AG",
				"name": "Blastoise-Gmax"
			}
		},
		"9": {
			"tier": "RUBL",
			"bestTier": "RUBL",
			"bestName": "Blastoise",
			"mega": {
				"tier": "RU",
				"name": "Blastoise-Mega"
			},
			"gmax": {
				"tier": "AG",
				"name": "Blastoise-Gmax"
			}
		},
		"10": {
			"tier": "LC",
			"bestTier": "ZU",
			"bestName": "Butterfree",
			"mega": null,
			"gmax": {
				"tier": "AG",
				"name": "Butterfree-Gmax"
			}
		},
		"11": {
			"tier": "NFE",
			"bestTier": "ZU",
			"bestName": "Butterfree",
			"mega": null,
			"gmax": {
				"tier": "AG",
				"name": "Butterfree-Gmax"
			}
		},
		"12": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Butterfree",
			"mega": null,
			"gmax": {
				"tier": "AG",
				"name": "Butterfree-Gmax"
			}
		},
		"13": {
			"tier": "LC",
			"bestTier": "ZU",
			"bestName": "Beedrill",
			"mega": {
				"tier": "UU",
				"name": "Beedrill-Mega"
			},
			"gmax": null
		},
		"14": {
			"tier": "NFE",
			"bestTier": "ZU",
			"bestName": "Beedrill",
			"mega": {
				"tier": "UU",
				"name": "Beedrill-Mega"
			},
			"gmax": null
		},
		"15": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Beedrill",
			"mega": {
				"tier": "UU",
				"name": "Beedrill-Mega"
			},
			"gmax": null
		},
		"16": {
			"tier": "LC",
			"bestTier": "ZU",
			"bestName": "Pidgeot",
			"mega": {
				"tier": "UU",
				"name": "Pidgeot-Mega"
			},
			"gmax": null
		},
		"17": {
			"tier": "NFE",
			"bestTier": "ZU",
			"bestName": "Pidgeot",
			"mega": {
				"tier": "UU",
				"name": "Pidgeot-Mega"
			},
			"gmax": null
		},
		"18": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Pidgeot",
			"mega": {
				"tier": "UU",
				"name": "Pidgeot-Mega"
			},
			"gmax": null
		},
		"19": {
			"tier": "LC",
			"bestTier": "ZU",
			"bestName": "Raticate",
			"mega": null,
			"gmax": null
		},
		"20": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Raticate",
			"mega": null,
			"gmax": null
		},
		"21": {
			"tier": "LC",
			"bestTier": "ZU",
			"bestName": "Fearow",
			"mega": null,
			"gmax": null
		},
		"22": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Fearow",
			"mega": null,
			"gmax": null
		},
		"23": {
			"tier": "LC",
			"bestTier": "ZU",
			"bestName": "Arbok",
			"mega": null,
			"gmax": null
		},
		"24": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Arbok",
			"mega": null,
			"gmax": null
		},
		"25": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Raichu-Alola",
			"mega": null,
			"gmax": {
				"tier": "AG",
				"name": "Pikachu-Gmax"
			}
		},
		"26": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Raichu-Alola",
			"mega": null,
			"gmax": {
				"tier": "AG",
				"name": "Pikachu-Gmax"
			}
		},
		"27": {
			"tier": "LC",
			"bestTier": "ZU",
			"bestName": "Sandslash",
			"mega": null,
			"gmax": null
		},
		"28": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Sandslash",
			"mega": null,
			"gmax": null
		},
		"29": {
			"tier": "LC",
			"bestTier": "RU",
			"bestName": "Nidoqueen",
			"mega": null,
			"gmax": null
		},
		"30": {
			"tier": "NFE",
			"bestTier": "RU",
			"bestName": "Nidoqueen",
			"mega": null,
			"gmax": null
		},
		"31": {
			"tier": "RU",
			"bestTier": "RU",
			"bestName": "Nidoqueen",
			"mega": null,
			"gmax": null
		},
		"32": {
			"tier": "LC",
			"bestTier": "UU",
			"bestName": "Nidoking",
			"mega": null,
			"gmax": null
		},
		"33": {
			"tier": "NFE",
			"bestTier": "UU",
			"bestName": "Nidoking",
			"mega": null,
			"gmax": null
		},
		"34": {
			"tier": "UU",
			"bestTier": "UU",
			"bestName": "Nidoking",
			"mega": null,
			"gmax": null
		},
		"35": {
			"tier": "NFE",
			"bestTier": "OU",
			"bestName": "Clefable",
			"mega": null,
			"gmax": null
		},
		"36": {
			"tier": "OU",
			"bestTier": "OU",
			"bestName": "Clefable",
			"mega": null,
			"gmax": null
		},
		"37": {
			"tier": "NFE",
			"bestTier": "ZU",
			"bestName": "Ninetales",
			"mega": null,
			"gmax": null
		},
		"38": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Ninetales",
			"mega": null,
			"gmax": null
		},
		"39": {
			"tier": "NFE",
			"bestTier": "ZU",
			"bestName": "Wigglytuff",
			"mega": null,
			"gmax": null
		},
		"40": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Wigglytuff",
			"mega": null,
			"gmax": null
		},
		"41": {
			"tier": "LC",
			"bestTier": "RU",
			"bestName": "Crobat",
			"mega": null,
			"gmax": null
		},
		"42": {
			"tier": "NFE",
			"bestTier": "RU",
			"bestName": "Crobat",
			"mega": null,
			"gmax": null
		},
		"43": {
			"tier": "LC",
			"bestTier": "NU",
			"bestName": "Vileplume",
			"mega": null,
			"gmax": null
		},
		"44": {
			"tier": "NFE",
			"bestTier": "NU",
			"bestName": "Vileplume",
			"mega": null,
			"gmax": null
		},
		"45": {
			"tier": "NU",
			"bestTier": "NU",
			"bestName": "Vileplume",
			"mega": null,
			"gmax": null
		},
		"46": {
			"tier": "LC",
			"bestTier": "ZU",
			"bestName": "Parasect",
			"mega": null,
			"gmax": null
		},
		"47": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Parasect",
			"mega": null,
			"gmax": null
		},
		"48": {
			"tier": "LC",
			"bestTier": "ZUBL",
			"bestName": "Venomoth",
			"mega": null,
			"gmax": null
		},
		"49": {
			"tier": "ZUBL",
			"bestTier": "ZUBL",
			"bestName": "Venomoth",
			"mega": null,
			"gmax": null
		},
		"50": {
			"tier": "NFE",
			"bestTier": "ZU",
			"bestName": "Dugtrio",
			"mega": null,
			"gmax": null
		},
		"51": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Dugtrio",
			"mega": null,
			"gmax": null
		},
		"52": {
			"tier": "LC",
			"bestTier": "ZU",
			"bestName": "Persian",
			"mega": null,
			"gmax": {
				"tier": "AG",
				"name": "Meowth-Gmax"
			}
		},
		"53": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Persian",
			"mega": null,
			"gmax": {
				"tier": "AG",
				"name": "Meowth-Gmax"
			}
		},
		"54": {
			"tier": "LC",
			"bestTier": "ZU",
			"bestName": "Golduck",
			"mega": null,
			"gmax": null
		},
		"55": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Golduck",
			"mega": null,
			"gmax": null
		},
		"56": {
			"tier": "LC",
			"bestTier": "Uber",
			"bestName": "Annihilape",
			"mega": null,
			"gmax": null
		},
		"57": {
			"tier": "ZU",
			"bestTier": "Uber",
			"bestName": "Annihilape",
			"mega": null,
			"gmax": null
		},
		"58": {
			"tier": "LC",
			"bestTier": "PU",
			"bestName": "Arcanine",
			"mega": null,
			"gmax": null
		},
		"59": {
			"tier": "PU",
			"bestTier": "PU",
			"bestName": "Arcanine",
			"mega": null,
			"gmax": null
		},
		"60": {
			"tier": "LC",
			"bestTier": "NUBL",
			"bestName": "Politoed",
			"mega": null,
			"gmax": null
		},
		"61": {
			"tier": "NFE",
			"bestTier": "NUBL",
			"bestName": "Politoed",
			"mega": null,
			"gmax": null
		},
		"62": {
			"tier": "ZU",
			"bestTier": "NUBL",
			"bestName": "Politoed",
			"mega": null,
			"gmax": null
		},
		"63": {
			"tier": "LC",
			"bestTier": "UUBL",
			"bestName": "Alakazam",
			"mega": {
				"tier": "OU",
				"name": "Alakazam-Mega"
			},
			"gmax": null
		},
		"64": {
			"tier": "NFE",
			"bestTier": "UUBL",
			"bestName": "Alakazam",
			"mega": {
				"tier": "OU",
				"name": "Alakazam-Mega"
			},
			"gmax": null
		},
		"65": {
			"tier": "UUBL",
			"bestTier": "UUBL",
			"bestName": "Alakazam",
			"mega": {
				"tier": "OU",
				"name": "Alakazam-Mega"
			},
			"gmax": null
		},
		"66": {
			"tier": "LC",
			"bestTier": "NUBL",
			"bestName": "Machamp",
			"mega": null,
			"gmax": {
				"tier": "AG",
				"name": "Machamp-Gmax"
			}
		},
		"67": {
			"tier": "NFE",
			"bestTier": "NUBL",
			"bestName": "Machamp",
			"mega": null,
			"gmax": {
				"tier": "AG",
				"name": "Machamp-Gmax"
			}
		},
		"68": {
			"tier": "NUBL",
			"bestTier": "NUBL",
			"bestName": "Machamp",
			"mega": null,
			"gmax": {
				"tier": "AG",
				"name": "Machamp-Gmax"
			}
		},
		"69": {
			"tier": "LC",
			"bestTier": "ZU",
			"bestName": "Victreebel",
			"mega": null,
			"gmax": null
		},
		"70": {
			"tier": "NFE",
			"bestTier": "ZU",
			"bestName": "Victreebel",
			"mega": null,
			"gmax": null
		},
		"71": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Victreebel",
			"mega": null,
			"gmax": null
		},
		"72": {
			"tier": "LC",
			"bestTier": "NU",
			"bestName": "Tentacruel",
			"mega": null,
			"gmax": null
		},
		"73": {
			"tier": "NU",
			"bestTier": "NU",
			"bestName": "Tentacruel",
			"mega": null,
			"gmax": null
		},
		"74": {
			"tier": "LC",
			"bestTier": "ZU",
			"bestName": "Golem",
			"mega": null,
			"gmax": null
		},
		"75": {
			"tier": "NFE",
			"bestTier": "ZU",
			"bestName": "Golem",
			"mega": null,
			"gmax": null
		},
		"76": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Golem",
			"mega": null,
			"gmax": null
		},
		"77": {
			"tier": "LC",
			"bestTier": "ZU",
			"bestName": "Rapidash",
			"mega": null,
			"gmax": null
		},
		"78": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Rapidash",
			"mega": null,
			"gmax": null
		},
		"79": {
			"tier": "LC",
			"bestTier": "UU",
			"bestName": "Slowking",
			"mega": {
				"tier": "RUBL",
				"name": "Slowbro-Mega"
			},
			"gmax": null
		},
		"80": {
			"tier": "RU",
			"bestTier": "UU",
			"bestName": "Slowking",
			"mega": {
				"tier": "RUBL",
				"name": "Slowbro-Mega"
			},
			"gmax": null
		},
		"81": {
			"tier": "LC",
			"bestTier": "RU",
			"bestName": "Magnezone",
			"mega": null,
			"gmax": null
		},
		"82": {
			"tier": "ZU",
			"bestTier": "RU",
			"bestName": "Magnezone",
			"mega": null,
			"gmax": null
		},
		"83": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Farfetch’d",
			"mega": null,
			"gmax": null
		},
		"84": {
			"tier": "LC",
			"bestTier": "ZU",
			"bestName": "Dodrio",
			"mega": null,
			"gmax": null
		},
		"85": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Dodrio",
			"mega": null,
			"gmax": null
		},
		"86": {
			"tier": "LC",
			"bestTier": "ZU",
			"bestName": "Dewgong",
			"mega": null,
			"gmax": null
		},
		"87": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Dewgong",
			"mega": null,
			"gmax": null
		},
		"88": {
			"tier": "LC",
			"bestTier": "ZU",
			"bestName": "Muk",
			"mega": null,
			"gmax": null
		},
		"89": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Muk",
			"mega": null,
			"gmax": null
		},
		"90": {
			"tier": "LC",
			"bestTier": "NUBL",
			"bestName": "Cloyster",
			"mega": null,
			"gmax": null
		},
		"91": {
			"tier": "NUBL",
			"bestTier": "NUBL",
			"bestName": "Cloyster",
			"mega": null,
			"gmax": null
		},
		"92": {
			"tier": "NFE",
			"bestTier": "RU",
			"bestName": "Gengar",
			"mega": {
				"tier": "Uber",
				"name": "Gengar-Mega"
			},
			"gmax": {
				"tier": "AG",
				"name": "Gengar-Gmax"
			}
		},
		"93": {
			"tier": "NFE",
			"bestTier": "RU",
			"bestName": "Gengar",
			"mega": {
				"tier": "Uber",
				"name": "Gengar-Mega"
			},
			"gmax": {
				"tier": "AG",
				"name": "Gengar-Gmax"
			}
		},
		"94": {
			"tier": "RU",
			"bestTier": "RU",
			"bestName": "Gengar",
			"mega": {
				"tier": "Uber",
				"name": "Gengar-Mega"
			},
			"gmax": {
				"tier": "AG",
				"name": "Gengar-Gmax"
			}
		},
		"95": {
			"tier": "LC",
			"bestTier": "RU",
			"bestName": "Steelix",
			"mega": {
				"tier": "UU",
				"name": "Steelix-Mega"
			},
			"gmax": null
		},
		"96": {
			"tier": "LC",
			"bestTier": "ZU",
			"bestName": "Hypno",
			"mega": null,
			"gmax": null
		},
		"97": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Hypno",
			"mega": null,
			"gmax": null
		},
		"98": {
			"tier": "LC",
			"bestTier": "PUBL",
			"bestName": "Kingler",
			"mega": null,
			"gmax": {
				"tier": "AG",
				"name": "Kingler-Gmax"
			}
		},
		"99": {
			"tier": "PUBL",
			"bestTier": "PUBL",
			"bestName": "Kingler",
			"mega": null,
			"gmax": {
				"tier": "AG",
				"name": "Kingler-Gmax"
			}
		},
		"100": {
			"tier": "LC",
			"bestTier": "ZU",
			"bestName": "Electrode",
			"mega": null,
			"gmax": null
		},
		"101": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Electrode",
			"mega": null,
			"gmax": null
		},
		"102": {
			"tier": "LC",
			"bestTier": "ZU",
			"bestName": "Exeggutor-Alola",
			"mega": null,
			"gmax": null
		},
		"103": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Exeggutor-Alola",
			"mega": null,
			"gmax": null
		},
		"104": {
			"tier": "LC",
			"bestTier": "RU",
			"bestName": "Marowak-Alola",
			"mega": null,
			"gmax": null
		},
		"105": {
			"tier": "ZU",
			"bestTier": "RU",
			"bestName": "Marowak-Alola",
			"mega": null,
			"gmax": null
		},
		"106": {
			"tier": "PU",
			"bestTier": "PU",
			"bestName": "Hitmonlee",
			"mega": null,
			"gmax": null
		},
		"107": {
			"tier": "ZU",
			"bestTier": "PU",
			"bestName": "Hitmonlee",
			"mega": null,
			"gmax": null
		},
		"108": {
			"tier": "LC",
			"bestTier": "ZU",
			"bestName": "Lickilicky",
			"mega": null,
			"gmax": null
		},
		"109": {
			"tier": "LC",
			"bestTier": "OU",
			"bestName": "Weezing-Galar",
			"mega": null,
			"gmax": null
		},
		"110": {
			"tier": "ZU",
			"bestTier": "OU",
			"bestName": "Weezing-Galar",
			"mega": null,
			"gmax": null
		},
		"111": {
			"tier": "LC",
			"bestTier": "NU",
			"bestName": "Rhyperior",
			"mega": null,
			"gmax": null
		},
		"112": {
			"tier": "PU",
			"bestTier": "NU",
			"bestName": "Rhyperior",
			"mega": null,
			"gmax": null
		},
		"113": {
			"tier": "RU",
			"bestTier": "RU",
			"bestName": "Blissey",
			"mega": null,
			"gmax": null
		},
		"114": {
			"tier": "NFE",
			"bestTier": "UU",
			"bestName": "Tangrowth",
			"mega": null,
			"gmax": null
		},
		"115": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Kangaskhan",
			"mega": {
				"tier": "Uber",
				"name": "Kangaskhan-Mega"
			},
			"gmax": null
		},
		"116": {
			"tier": "LC",
			"bestTier": "ZUBL",
			"bestName": "Kingdra",
			"mega": null,
			"gmax": null
		},
		"117": {
			"tier": "NFE",
			"bestTier": "ZUBL",
			"bestName": "Kingdra",
			"mega": null,
			"gmax": null
		},
		"118": {
			"tier": "LC",
			"bestTier": "ZU",
			"bestName": "Seaking",
			"mega": null,
			"gmax": null
		},
		"119": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Seaking",
			"mega": null,
			"gmax": null
		},
		"120": {
			"tier": "LC",
			"bestTier": "NU",
			"bestName": "Starmie",
			"mega": null,
			"gmax": null
		},
		"121": {
			"tier": "NU",
			"bestTier": "NU",
			"bestName": "Starmie",
			"mega": null,
			"gmax": null
		},
		"122": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Mr. Rime",
			"mega": null,
			"gmax": null
		},
		"123": {
			"tier": "NU",
			"bestTier": "OU",
			"bestName": "Scizor",
			"mega": {
				"tier": "OU",
				"name": "Scizor-Mega"
			},
			"gmax": null
		},
		"124": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Jynx",
			"mega": null,
			"gmax": null
		},
		"125": {
			"tier": "NFE",
			"bestTier": "ZU",
			"bestName": "Electivire",
			"mega": null,
			"gmax": null
		},
		"126": {
			"tier": "NFE",
			"bestTier": "ZU",
			"bestName": "Magmortar",
			"mega": null,
			"gmax": null
		},
		"127": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Pinsir",
			"mega": {
				"tier": "UUBL",
				"name": "Pinsir-Mega"
			},
			"gmax": null
		},
		"128": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Tauros",
			"mega": null,
			"gmax": null
		},
		"129": {
			"tier": "LC",
			"bestTier": "RU",
			"bestName": "Gyarados",
			"mega": {
				"tier": "OU",
				"name": "Gyarados-Mega"
			},
			"gmax": null
		},
		"130": {
			"tier": "RU",
			"bestTier": "RU",
			"bestName": "Gyarados",
			"mega": {
				"tier": "OU",
				"name": "Gyarados-Mega"
			},
			"gmax": null
		},
		"131": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Lapras",
			"mega": null,
			"gmax": {
				"tier": "AG",
				"name": "Lapras-Gmax"
			}
		},
		"132": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Ditto",
			"mega": null,
			"gmax": null
		},
		"133": {
			"tier": "LC",
			"bestTier": "RU",
			"bestName": "Umbreon",
			"mega": null,
			"gmax": {
				"tier": "AG",
				"name": "Eevee-Gmax"
			}
		},
		"134": {
			"tier": "NU",
			"bestTier": "RU",
			"bestName": "Umbreon",
			"mega": null,
			"gmax": {
				"tier": "AG",
				"name": "Eevee-Gmax"
			}
		},
		"135": {
			"tier": "ZU",
			"bestTier": "RU",
			"bestName": "Umbreon",
			"mega": null,
			"gmax": {
				"tier": "AG",
				"name": "Eevee-Gmax"
			}
		},
		"136": {
			"tier": "ZU",
			"bestTier": "RU",
			"bestName": "Umbreon",
			"mega": null,
			"gmax": {
				"tier": "AG",
				"name": "Eevee-Gmax"
			}
		},
		"137": {
			"tier": "NFE",
			"bestTier": "NUBL",
			"bestName": "Porygon-Z",
			"mega": null,
			"gmax": null
		},
		"138": {
			"tier": "LC",
			"bestTier": "PUBL",
			"bestName": "Omastar",
			"mega": null,
			"gmax": null
		},
		"139": {
			"tier": "PUBL",
			"bestTier": "PUBL",
			"bestName": "Omastar",
			"mega": null,
			"gmax": null
		},
		"140": {
			"tier": "LC",
			"bestTier": "ZU",
			"bestName": "Kabutops",
			"mega": null,
			"gmax": null
		},
		"141": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Kabutops",
			"mega": null,
			"gmax": null
		},
		"142": {
			"tier": "NU",
			"bestTier": "NU",
			"bestName": "Aerodactyl",
			"mega": {
				"tier": "UU",
				"name": "Aerodactyl-Mega"
			},
			"gmax": null
		},
		"143": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Snorlax",
			"mega": null,
			"gmax": {
				"tier": "AG",
				"name": "Snorlax-Gmax"
			}
		},
		"144": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Articuno",
			"mega": null,
			"gmax": null
		},
		"145": {
			"tier": "OU",
			"bestTier": "OU",
			"bestName": "Zapdos",
			"mega": null,
			"gmax": null
		},
		"146": {
			"tier": "OU",
			"bestTier": "OU",
			"bestName": "Moltres",
			"mega": null,
			"gmax": null
		},
		"147": {
			"tier": "LC",
			"bestTier": "OU",
			"bestName": "Dragonite",
			"mega": null,
			"gmax": null
		},
		"148": {
			"tier": "NFE",
			"bestTier": "OU",
			"bestName": "Dragonite",
			"mega": null,
			"gmax": null
		},
		"149": {
			"tier": "OU",
			"bestTier": "OU",
			"bestName": "Dragonite",
			"mega": null,
			"gmax": null
		},
		"150": {
			"tier": "Uber",
			"bestTier": "Uber",
			"bestName": "Mewtwo",
			"mega": {
				"tier": "Uber",
				"name": "Mewtwo-Mega-X"
			},
			"gmax": null
		},
		"151": {
			"tier": "RU",
			"bestTier": "RU",
			"bestName": "Mew",
			"mega": null,
			"gmax": null
		},
		"152": {
			"tier": "LC",
			"bestTier": "ZU",
			"bestName": "Meganium",
			"mega": null,
			"gmax": null
		},
		"153": {
			"tier": "NFE",
			"bestTier": "ZU",
			"bestName": "Meganium",
			"mega": null,
			"gmax": null
		},
		"154": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Meganium",
			"mega": null,
			"gmax": null
		},
		"155": {
			"tier": "LC",
			"bestTier": "PU",
			"bestName": "Typhlosion-Hisui",
			"mega": null,
			"gmax": null
		},
		"156": {
			"tier": "NFE",
			"bestTier": "PU",
			"bestName": "Typhlosion-Hisui",
			"mega": null,
			"gmax": null
		},
		"157": {
			"tier": "ZU",
			"bestTier": "PU",
			"bestName": "Typhlosion-Hisui",
			"mega": null,
			"gmax": null
		},
		"158": {
			"tier": "LC",
			"bestTier": "NUBL",
			"bestName": "Feraligatr",
			"mega": null,
			"gmax": null
		},
		"159": {
			"tier": "NFE",
			"bestTier": "NUBL",
			"bestName": "Feraligatr",
			"mega": null,
			"gmax": null
		},
		"160": {
			"tier": "NUBL",
			"bestTier": "NUBL",
			"bestName": "Feraligatr",
			"mega": null,
			"gmax": null
		},
		"161": {
			"tier": "LC",
			"bestTier": "ZU",
			"bestName": "Furret",
			"mega": null,
			"gmax": null
		},
		"162": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Furret",
			"mega": null,
			"gmax": null
		},
		"163": {
			"tier": "LC",
			"bestTier": "ZU",
			"bestName": "Noctowl",
			"mega": null,
			"gmax": null
		},
		"164": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Noctowl",
			"mega": null,
			"gmax": null
		},
		"165": {
			"tier": "LC",
			"bestTier": "ZU",
			"bestName": "Ledian",
			"mega": null,
			"gmax": null
		},
		"166": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Ledian",
			"mega": null,
			"gmax": null
		},
		"167": {
			"tier": "LC",
			"bestTier": "ZU",
			"bestName": "Ariados",
			"mega": null,
			"gmax": null
		},
		"168": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Ariados",
			"mega": null,
			"gmax": null
		},
		"169": {
			"tier": "RU",
			"bestTier": "RU",
			"bestName": "Crobat",
			"mega": null,
			"gmax": null
		},
		"170": {
			"tier": "LC",
			"bestTier": "ZU",
			"bestName": "Lanturn",
			"mega": null,
			"gmax": null
		},
		"171": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Lanturn",
			"mega": null,
			"gmax": null
		},
		"172": {
			"tier": "LC",
			"bestTier": "ZU",
			"bestName": "Raichu-Alola",
			"mega": null,
			"gmax": {
				"tier": "AG",
				"name": "Pikachu-Gmax"
			}
		},
		"173": {
			"tier": "LC",
			"bestTier": "OU",
			"bestName": "Clefable",
			"mega": null,
			"gmax": null
		},
		"174": {
			"tier": "LC",
			"bestTier": "ZU",
			"bestName": "Wigglytuff",
			"mega": null,
			"gmax": null
		},
		"175": {
			"tier": "LC",
			"bestTier": "RU",
			"bestName": "Togekiss",
			"mega": null,
			"gmax": null
		},
		"176": {
			"tier": "NFE",
			"bestTier": "RU",
			"bestName": "Togekiss",
			"mega": null,
			"gmax": null
		},
		"177": {
			"tier": "LC",
			"bestTier": "NU",
			"bestName": "Xatu",
			"mega": null,
			"gmax": null
		},
		"178": {
			"tier": "NU",
			"bestTier": "NU",
			"bestName": "Xatu",
			"mega": null,
			"gmax": null
		},
		"179": {
			"tier": "LC",
			"bestTier": "ZU",
			"bestName": "Ampharos",
			"mega": {
				"tier": "RU",
				"name": "Ampharos-Mega"
			},
			"gmax": null
		},
		"180": {
			"tier": "NFE",
			"bestTier": "ZU",
			"bestName": "Ampharos",
			"mega": {
				"tier": "RU",
				"name": "Ampharos-Mega"
			},
			"gmax": null
		},
		"181": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Ampharos",
			"mega": {
				"tier": "RU",
				"name": "Ampharos-Mega"
			},
			"gmax": null
		},
		"182": {
			"tier": "ZU",
			"bestTier": "NU",
			"bestName": "Vileplume",
			"mega": null,
			"gmax": null
		},
		"183": {
			"tier": "NFE",
			"bestTier": "UU",
			"bestName": "Azumarill",
			"mega": null,
			"gmax": null
		},
		"184": {
			"tier": "UU",
			"bestTier": "UU",
			"bestName": "Azumarill",
			"mega": null,
			"gmax": null
		},
		"185": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Sudowoodo",
			"mega": null,
			"gmax": null
		},
		"186": {
			"tier": "NUBL",
			"bestTier": "NUBL",
			"bestName": "Politoed",
			"mega": null,
			"gmax": null
		},
		"187": {
			"tier": "LC",
			"bestTier": "ZU",
			"bestName": "Jumpluff",
			"mega": null,
			"gmax": null
		},
		"188": {
			"tier": "NFE",
			"bestTier": "ZU",
			"bestName": "Jumpluff",
			"mega": null,
			"gmax": null
		},
		"189": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Jumpluff",
			"mega": null,
			"gmax": null
		},
		"190": {
			"tier": "NFE",
			"bestTier": "PU",
			"bestName": "Ambipom",
			"mega": null,
			"gmax": null
		},
		"191": {
			"tier": "LC",
			"bestTier": "ZU",
			"bestName": "Sunflora",
			"mega": null,
			"gmax": null
		},
		"192": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Sunflora",
			"mega": null,
			"gmax": null
		},
		"193": {
			"tier": "NFE",
			"bestTier": "RUBL",
			"bestName": "Yanmega",
			"mega": null,
			"gmax": null
		},
		"194": {
			"tier": "LC",
			"bestTier": "RU",
			"bestName": "Quagsire",
			"mega": null,
			"gmax": null
		},
		"195": {
			"tier": "RU",
			"bestTier": "RU",
			"bestName": "Quagsire",
			"mega": null,
			"gmax": null
		},
		"196": {
			"tier": "PU",
			"bestTier": "RU",
			"bestName": "Umbreon",
			"mega": null,
			"gmax": {
				"tier": "AG",
				"name": "Eevee-Gmax"
			}
		},
		"197": {
			"tier": "RU",
			"bestTier": "RU",
			"bestName": "Umbreon",
			"mega": null,
			"gmax": {
				"tier": "AG",
				"name": "Eevee-Gmax"
			}
		},
		"198": {
			"tier": "NFE",
			"bestTier": "ZU",
			"bestName": "Honchkrow",
			"mega": null,
			"gmax": null
		},
		"199": {
			"tier": "UU",
			"bestTier": "UU",
			"bestName": "Slowking",
			"mega": {
				"tier": "RUBL",
				"name": "Slowbro-Mega"
			},
			"gmax": null
		},
		"200": {
			"tier": "NFE",
			"bestTier": "ZU",
			"bestName": "Mismagius",
			"mega": null,
			"gmax": null
		},
		"201": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Unown",
			"mega": null,
			"gmax": null
		},
		"202": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Wobbuffet",
			"mega": null,
			"gmax": null
		},
		"203": {
			"tier": "NFE",
			"bestTier": "ZU",
			"bestName": "Farigiraf",
			"mega": null,
			"gmax": null
		},
		"204": {
			"tier": "LC",
			"bestTier": "RU",
			"bestName": "Forretress",
			"mega": null,
			"gmax": null
		},
		"205": {
			"tier": "RU",
			"bestTier": "RU",
			"bestName": "Forretress",
			"mega": null,
			"gmax": null
		},
		"206": {
			"tier": "NFE",
			"bestTier": "PU",
			"bestName": "Dudunsparce-Three-Segment",
			"mega": null,
			"gmax": null
		},
		"207": {
			"tier": "NU",
			"bestTier": "OU",
			"bestName": "Gliscor",
			"mega": null,
			"gmax": null
		},
		"208": {
			"tier": "RU",
			"bestTier": "RU",
			"bestName": "Steelix",
			"mega": {
				"tier": "UU",
				"name": "Steelix-Mega"
			},
			"gmax": null
		},
		"209": {
			"tier": "LC",
			"bestTier": "ZU",
			"bestName": "Granbull",
			"mega": null,
			"gmax": null
		},
		"210": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Granbull",
			"mega": null,
			"gmax": null
		},
		"211": {
			"tier": "PU",
			"bestTier": "PU",
			"bestName": "Qwilfish",
			"mega": null,
			"gmax": null
		},
		"212": {
			"tier": "OU",
			"bestTier": "OU",
			"bestName": "Scizor",
			"mega": {
				"tier": "OU",
				"name": "Scizor-Mega"
			},
			"gmax": null
		},
		"213": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Shuckle",
			"mega": null,
			"gmax": null
		},
		"214": {
			"tier": "NU",
			"bestTier": "NU",
			"bestName": "Heracross",
			"mega": {
				"tier": "UUBL",
				"name": "Heracross-Mega"
			},
			"gmax": null
		},
		"215": {
			"tier": "NFE",
			"bestTier": "OU",
			"bestName": "Weavile",
			"mega": null,
			"gmax": null
		},
		"216": {
			"tier": "LC",
			"bestTier": "UUBL",
			"bestName": "Ursaluna",
			"mega": null,
			"gmax": null
		},
		"217": {
			"tier": "NFE",
			"bestTier": "UUBL",
			"bestName": "Ursaluna",
			"mega": null,
			"gmax": null
		},
		"218": {
			"tier": "LC",
			"bestTier": "ZU",
			"bestName": "Magcargo",
			"mega": null,
			"gmax": null
		},
		"219": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Magcargo",
			"mega": null,
			"gmax": null
		},
		"220": {
			"tier": "LC",
			"bestTier": "RU",
			"bestName": "Mamoswine",
			"mega": null,
			"gmax": null
		},
		"221": {
			"tier": "NFE",
			"bestTier": "RU",
			"bestName": "Mamoswine",
			"mega": null,
			"gmax": null
		},
		"222": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Corsola",
			"mega": null,
			"gmax": null
		},
		"223": {
			"tier": "LC",
			"bestTier": "ZU",
			"bestName": "Octillery",
			"mega": null,
			"gmax": null
		},
		"224": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Octillery",
			"mega": null,
			"gmax": null
		},
		"225": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Delibird",
			"mega": null,
			"gmax": null
		},
		"226": {
			"tier": "NU",
			"bestTier": "NU",
			"bestName": "Mantine",
			"mega": null,
			"gmax": null
		},
		"227": {
			"tier": "UU",
			"bestTier": "UU",
			"bestName": "Skarmory",
			"mega": null,
			"gmax": null
		},
		"228": {
			"tier": "LC",
			"bestTier": "ZU",
			"bestName": "Houndoom",
			"mega": {
				"tier": "RUBL",
				"name": "Houndoom-Mega"
			},
			"gmax": null
		},
		"229": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Houndoom",
			"mega": {
				"tier": "RUBL",
				"name": "Houndoom-Mega"
			},
			"gmax": null
		},
		"230": {
			"tier": "ZUBL",
			"bestTier": "ZUBL",
			"bestName": "Kingdra",
			"mega": null,
			"gmax": null
		},
		"231": {
			"tier": "LC",
			"bestTier": "UU",
			"bestName": "Donphan",
			"mega": null,
			"gmax": null
		},
		"232": {
			"tier": "UU",
			"bestTier": "UU",
			"bestName": "Donphan",
			"mega": null,
			"gmax": null
		},
		"233": {
			"tier": "ZUBL",
			"bestTier": "NUBL",
			"bestName": "Porygon-Z",
			"mega": null,
			"gmax": null
		},
		"234": {
			"tier": "NFE",
			"bestTier": "ZU",
			"bestName": "Wyrdeer",
			"mega": null,
			"gmax": null
		},
		"235": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Smeargle",
			"mega": null,
			"gmax": null
		},
		"236": {
			"tier": "LC",
			"bestTier": "PU",
			"bestName": "Hitmonlee",
			"mega": null,
			"gmax": null
		},
		"237": {
			"tier": "ZU",
			"bestTier": "PU",
			"bestName": "Hitmonlee",
			"mega": null,
			"gmax": null
		},
		"238": {
			"tier": "LC",
			"bestTier": "ZU",
			"bestName": "Jynx",
			"mega": null,
			"gmax": null
		},
		"239": {
			"tier": "LC",
			"bestTier": "ZU",
			"bestName": "Electivire",
			"mega": null,
			"gmax": null
		},
		"240": {
			"tier": "NFE",
			"bestTier": "ZU",
			"bestName": "Magmortar",
			"mega": null,
			"gmax": null
		},
		"241": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Miltank",
			"mega": null,
			"gmax": null
		},
		"242": {
			"tier": "RU",
			"bestTier": "RU",
			"bestName": "Blissey",
			"mega": null,
			"gmax": null
		},
		"243": {
			"tier": "NU",
			"bestTier": "NU",
			"bestName": "Raikou",
			"mega": null,
			"gmax": null
		},
		"244": {
			"tier": "RU",
			"bestTier": "RU",
			"bestName": "Entei",
			"mega": null,
			"gmax": null
		},
		"245": {
			"tier": "NUBL",
			"bestTier": "NUBL",
			"bestName": "Suicune",
			"mega": null,
			"gmax": null
		},
		"246": {
			"tier": "LC",
			"bestTier": "UU",
			"bestName": "Tyranitar",
			"mega": {
				"tier": "OU",
				"name": "Tyranitar-Mega"
			},
			"gmax": null
		},
		"247": {
			"tier": "NFE",
			"bestTier": "UU",
			"bestName": "Tyranitar",
			"mega": {
				"tier": "OU",
				"name": "Tyranitar-Mega"
			},
			"gmax": null
		},
		"248": {
			"tier": "UU",
			"bestTier": "UU",
			"bestName": "Tyranitar",
			"mega": {
				"tier": "OU",
				"name": "Tyranitar-Mega"
			},
			"gmax": null
		},
		"249": {
			"tier": "Uber",
			"bestTier": "Uber",
			"bestName": "Lugia",
			"mega": null,
			"gmax": null
		},
		"250": {
			"tier": "Uber",
			"bestTier": "Uber",
			"bestName": "Ho-Oh",
			"mega": null,
			"gmax": null
		},
		"251": {
			"tier": "RU",
			"bestTier": "RU",
			"bestName": "Celebi",
			"mega": null,
			"gmax": null
		},
		"252": {
			"tier": "LC",
			"bestTier": "ZU",
			"bestName": "Sceptile",
			"mega": {
				"tier": "RU",
				"name": "Sceptile-Mega"
			},
			"gmax": null
		},
		"253": {
			"tier": "NFE",
			"bestTier": "ZU",
			"bestName": "Sceptile",
			"mega": {
				"tier": "RU",
				"name": "Sceptile-Mega"
			},
			"gmax": null
		},
		"254": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Sceptile",
			"mega": {
				"tier": "RU",
				"name": "Sceptile-Mega"
			},
			"gmax": null
		},
		"255": {
			"tier": "LC",
			"bestTier": "UUBL",
			"bestName": "Blaziken",
			"mega": {
				"tier": "Uber",
				"name": "Blaziken-Mega"
			},
			"gmax": null
		},
		"256": {
			"tier": "NFE",
			"bestTier": "UUBL",
			"bestName": "Blaziken",
			"mega": {
				"tier": "Uber",
				"name": "Blaziken-Mega"
			},
			"gmax": null
		},
		"257": {
			"tier": "UUBL",
			"bestTier": "UUBL",
			"bestName": "Blaziken",
			"mega": {
				"tier": "Uber",
				"name": "Blaziken-Mega"
			},
			"gmax": null
		},
		"258": {
			"tier": "LC",
			"bestTier": "NU",
			"bestName": "Swampert",
			"mega": {
				"tier": "OU",
				"name": "Swampert-Mega"
			},
			"gmax": null
		},
		"259": {
			"tier": "NFE",
			"bestTier": "NU",
			"bestName": "Swampert",
			"mega": {
				"tier": "OU",
				"name": "Swampert-Mega"
			},
			"gmax": null
		},
		"260": {
			"tier": "NU",
			"bestTier": "NU",
			"bestName": "Swampert",
			"mega": {
				"tier": "OU",
				"name": "Swampert-Mega"
			},
			"gmax": null
		},
		"261": {
			"tier": "LC",
			"bestTier": "ZU",
			"bestName": "Mightyena",
			"mega": null,
			"gmax": null
		},
		"262": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Mightyena",
			"mega": null,
			"gmax": null
		},
		"263": {
			"tier": "NFE",
			"bestTier": "NUBL",
			"bestName": "Linoone",
			"mega": null,
			"gmax": null
		},
		"264": {
			"tier": "NUBL",
			"bestTier": "NUBL",
			"bestName": "Linoone",
			"mega": null,
			"gmax": null
		},
		"265": {
			"tier": "LC",
			"bestTier": "ZU",
			"bestName": "Dustox",
			"mega": null,
			"gmax": null
		},
		"266": {
			"tier": "NFE",
			"bestTier": "ZU",
			"bestName": "Dustox",
			"mega": null,
			"gmax": null
		},
		"267": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Dustox",
			"mega": null,
			"gmax": null
		},
		"268": {
			"tier": "NFE",
			"bestTier": "ZU",
			"bestName": "Dustox",
			"mega": null,
			"gmax": null
		},
		"269": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Dustox",
			"mega": null,
			"gmax": null
		},
		"270": {
			"tier": "LC",
			"bestTier": "ZU",
			"bestName": "Ludicolo",
			"mega": null,
			"gmax": null
		},
		"271": {
			"tier": "NFE",
			"bestTier": "ZU",
			"bestName": "Ludicolo",
			"mega": null,
			"gmax": null
		},
		"272": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Ludicolo",
			"mega": null,
			"gmax": null
		},
		"273": {
			"tier": "LC",
			"bestTier": "ZU",
			"bestName": "Shiftry",
			"mega": null,
			"gmax": null
		},
		"274": {
			"tier": "NFE",
			"bestTier": "ZU",
			"bestName": "Shiftry",
			"mega": null,
			"gmax": null
		},
		"275": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Shiftry",
			"mega": null,
			"gmax": null
		},
		"276": {
			"tier": "LC",
			"bestTier": "RU",
			"bestName": "Swellow",
			"mega": null,
			"gmax": null
		},
		"277": {
			"tier": "RU",
			"bestTier": "RU",
			"bestName": "Swellow",
			"mega": null,
			"gmax": null
		},
		"278": {
			"tier": "LC",
			"bestTier": "UUBL",
			"bestName": "Pelipper",
			"mega": null,
			"gmax": null
		},
		"279": {
			"tier": "UUBL",
			"bestTier": "UUBL",
			"bestName": "Pelipper",
			"mega": null,
			"gmax": null
		},
		"280": {
			"tier": "LC",
			"bestTier": "RU",
			"bestName": "Gallade",
			"mega": {
				"tier": "UUBL",
				"name": "Gardevoir-Mega"
			},
			"gmax": null
		},
		"281": {
			"tier": "NFE",
			"bestTier": "RU",
			"bestName": "Gallade",
			"mega": {
				"tier": "UUBL",
				"name": "Gardevoir-Mega"
			},
			"gmax": null
		},
		"282": {
			"tier": "RU",
			"bestTier": "RU",
			"bestName": "Gallade",
			"mega": {
				"tier": "UUBL",
				"name": "Gardevoir-Mega"
			},
			"gmax": null
		},
		"283": {
			"tier": "LC",
			"bestTier": "ZU",
			"bestName": "Masquerain",
			"mega": null,
			"gmax": null
		},
		"284": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Masquerain",
			"mega": null,
			"gmax": null
		},
		"285": {
			"tier": "LC",
			"bestTier": "NU",
			"bestName": "Breloom",
			"mega": null,
			"gmax": null
		},
		"286": {
			"tier": "NU",
			"bestTier": "NU",
			"bestName": "Breloom",
			"mega": null,
			"gmax": null
		},
		"287": {
			"tier": "LC",
			"bestTier": "ZU",
			"bestName": "Slaking",
			"mega": null,
			"gmax": null
		},
		"288": {
			"tier": "NFE",
			"bestTier": "ZU",
			"bestName": "Slaking",
			"mega": null,
			"gmax": null
		},
		"289": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Slaking",
			"mega": null,
			"gmax": null
		},
		"290": {
			"tier": "LC",
			"bestTier": "ZUBL",
			"bestName": "Ninjask",
			"mega": null,
			"gmax": null
		},
		"291": {
			"tier": "ZUBL",
			"bestTier": "ZUBL",
			"bestName": "Ninjask",
			"mega": null,
			"gmax": null
		},
		"292": {
			"tier": "ZU",
			"bestTier": "ZUBL",
			"bestName": "Ninjask",
			"mega": null,
			"gmax": null
		},
		"293": {
			"tier": "LC",
			"bestTier": "NU",
			"bestName": "Exploud",
			"mega": null,
			"gmax": null
		},
		"294": {
			"tier": "NFE",
			"bestTier": "NU",
			"bestName": "Exploud",
			"mega": null,
			"gmax": null
		},
		"295": {
			"tier": "NU",
			"bestTier": "NU",
			"bestName": "Exploud",
			"mega": null,
			"gmax": null
		},
		"296": {
			"tier": "LC",
			"bestTier": "PU",
			"bestName": "Hariyama",
			"mega": null,
			"gmax": null
		},
		"297": {
			"tier": "PU",
			"bestTier": "PU",
			"bestName": "Hariyama",
			"mega": null,
			"gmax": null
		},
		"298": {
			"tier": "LC",
			"bestTier": "UU",
			"bestName": "Azumarill",
			"mega": null,
			"gmax": null
		},
		"299": {
			"tier": "LC",
			"bestTier": "ZU",
			"bestName": "Probopass",
			"mega": null,
			"gmax": null
		},
		"300": {
			"tier": "LC",
			"bestTier": "ZU",
			"bestName": "Delcatty",
			"mega": null,
			"gmax": null
		},
		"301": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Delcatty",
			"mega": null,
			"gmax": null
		},
		"302": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Sableye",
			"mega": {
				"tier": "OU",
				"name": "Sableye-Mega"
			},
			"gmax": null
		},
		"303": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Mawile",
			"mega": {
				"tier": "OU",
				"name": "Mawile-Mega"
			},
			"gmax": null
		},
		"304": {
			"tier": "LC",
			"bestTier": "PU",
			"bestName": "Aggron",
			"mega": {
				"tier": "UU",
				"name": "Aggron-Mega"
			},
			"gmax": null
		},
		"305": {
			"tier": "NFE",
			"bestTier": "PU",
			"bestName": "Aggron",
			"mega": {
				"tier": "UU",
				"name": "Aggron-Mega"
			},
			"gmax": null
		},
		"306": {
			"tier": "PU",
			"bestTier": "PU",
			"bestName": "Aggron",
			"mega": {
				"tier": "UU",
				"name": "Aggron-Mega"
			},
			"gmax": null
		},
		"307": {
			"tier": "NFE",
			"bestTier": "ZU",
			"bestName": "Medicham",
			"mega": {
				"tier": "OU",
				"name": "Medicham-Mega"
			},
			"gmax": null
		},
		"308": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Medicham",
			"mega": {
				"tier": "OU",
				"name": "Medicham-Mega"
			},
			"gmax": null
		},
		"309": {
			"tier": "LC",
			"bestTier": "ZU",
			"bestName": "Manectric",
			"mega": {
				"tier": "UU",
				"name": "Manectric-Mega"
			},
			"gmax": null
		},
		"310": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Manectric",
			"mega": {
				"tier": "UU",
				"name": "Manectric-Mega"
			},
			"gmax": null
		},
		"311": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Plusle",
			"mega": null,
			"gmax": null
		},
		"312": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Minun",
			"mega": null,
			"gmax": null
		},
		"313": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Volbeat",
			"mega": null,
			"gmax": null
		},
		"314": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Illumise",
			"mega": null,
			"gmax": null
		},
		"315": {
			"tier": "NFE",
			"bestTier": "RU",
			"bestName": "Roserade",
			"mega": null,
			"gmax": null
		},
		"316": {
			"tier": "LC",
			"bestTier": "ZU",
			"bestName": "Swalot",
			"mega": null,
			"gmax": null
		},
		"317": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Swalot",
			"mega": null,
			"gmax": null
		},
		"318": {
			"tier": "LC",
			"bestTier": "RU",
			"bestName": "Sharpedo",
			"mega": {
				"tier": "UU",
				"name": "Sharpedo-Mega"
			},
			"gmax": null
		},
		"319": {
			"tier": "RU",
			"bestTier": "RU",
			"bestName": "Sharpedo",
			"mega": {
				"tier": "UU",
				"name": "Sharpedo-Mega"
			},
			"gmax": null
		},
		"320": {
			"tier": "LC",
			"bestTier": "ZU",
			"bestName": "Wailord",
			"mega": null,
			"gmax": null
		},
		"321": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Wailord",
			"mega": null,
			"gmax": null
		},
		"322": {
			"tier": "LC",
			"bestTier": "ZU",
			"bestName": "Camerupt",
			"mega": {
				"tier": "NUBL",
				"name": "Camerupt-Mega"
			},
			"gmax": null
		},
		"323": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Camerupt",
			"mega": {
				"tier": "NUBL",
				"name": "Camerupt-Mega"
			},
			"gmax": null
		},
		"324": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Torkoal",
			"mega": null,
			"gmax": null
		},
		"325": {
			"tier": "LC",
			"bestTier": "ZU",
			"bestName": "Grumpig",
			"mega": null,
			"gmax": null
		},
		"326": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Grumpig",
			"mega": null,
			"gmax": null
		},
		"327": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Spinda",
			"mega": null,
			"gmax": null
		},
		"328": {
			"tier": "LC",
			"bestTier": "NU",
			"bestName": "Flygon",
			"mega": null,
			"gmax": null
		},
		"329": {
			"tier": "NFE",
			"bestTier": "NU",
			"bestName": "Flygon",
			"mega": null,
			"gmax": null
		},
		"330": {
			"tier": "NU",
			"bestTier": "NU",
			"bestName": "Flygon",
			"mega": null,
			"gmax": null
		},
		"331": {
			"tier": "LC",
			"bestTier": "ZU",
			"bestName": "Cacturne",
			"mega": null,
			"gmax": null
		},
		"332": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Cacturne",
			"mega": null,
			"gmax": null
		},
		"333": {
			"tier": "LC",
			"bestTier": "NU",
			"bestName": "Altaria",
			"mega": {
				"tier": "UU",
				"name": "Altaria-Mega"
			},
			"gmax": null
		},
		"334": {
			"tier": "NU",
			"bestTier": "NU",
			"bestName": "Altaria",
			"mega": {
				"tier": "UU",
				"name": "Altaria-Mega"
			},
			"gmax": null
		},
		"335": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Zangoose",
			"mega": null,
			"gmax": null
		},
		"336": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Seviper",
			"mega": null,
			"gmax": null
		},
		"337": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Lunatone",
			"mega": null,
			"gmax": null
		},
		"338": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Solrock",
			"mega": null,
			"gmax": null
		},
		"339": {
			"tier": "LC",
			"bestTier": "ZU",
			"bestName": "Whiscash",
			"mega": null,
			"gmax": null
		},
		"340": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Whiscash",
			"mega": null,
			"gmax": null
		},
		"341": {
			"tier": "LC",
			"bestTier": "RU",
			"bestName": "Crawdaunt",
			"mega": null,
			"gmax": null
		},
		"342": {
			"tier": "RU",
			"bestTier": "RU",
			"bestName": "Crawdaunt",
			"mega": null,
			"gmax": null
		},
		"343": {
			"tier": "LC",
			"bestTier": "PU",
			"bestName": "Claydol",
			"mega": null,
			"gmax": null
		},
		"344": {
			"tier": "PU",
			"bestTier": "PU",
			"bestName": "Claydol",
			"mega": null,
			"gmax": null
		},
		"345": {
			"tier": "LC",
			"bestTier": "ZU",
			"bestName": "Cradily",
			"mega": null,
			"gmax": null
		},
		"346": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Cradily",
			"mega": null,
			"gmax": null
		},
		"347": {
			"tier": "LC",
			"bestTier": "ZU",
			"bestName": "Armaldo",
			"mega": null,
			"gmax": null
		},
		"348": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Armaldo",
			"mega": null,
			"gmax": null
		},
		"349": {
			"tier": "LC",
			"bestTier": "PU",
			"bestName": "Milotic",
			"mega": null,
			"gmax": null
		},
		"350": {
			"tier": "PU",
			"bestTier": "PU",
			"bestName": "Milotic",
			"mega": null,
			"gmax": null
		},
		"351": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Castform",
			"mega": null,
			"gmax": null
		},
		"352": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Kecleon",
			"mega": null,
			"gmax": null
		},
		"353": {
			"tier": "LC",
			"bestTier": "ZU",
			"bestName": "Banette",
			"mega": {
				"tier": "RU",
				"name": "Banette-Mega"
			},
			"gmax": null
		},
		"354": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Banette",
			"mega": {
				"tier": "RU",
				"name": "Banette-Mega"
			},
			"gmax": null
		},
		"355": {
			"tier": "LC",
			"bestTier": "ZU",
			"bestName": "Dusknoir",
			"mega": null,
			"gmax": null
		},
		"356": {
			"tier": "NFE",
			"bestTier": "ZU",
			"bestName": "Dusknoir",
			"mega": null,
			"gmax": null
		},
		"357": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Tropius",
			"mega": null,
			"gmax": null
		},
		"358": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Chimecho",
			"mega": null,
			"gmax": null
		},
		"359": {
			"tier": "PU",
			"bestTier": "PU",
			"bestName": "Absol",
			"mega": {
				"tier": "RUBL",
				"name": "Absol-Mega"
			},
			"gmax": null
		},
		"360": {
			"tier": "LC",
			"bestTier": "ZU",
			"bestName": "Wobbuffet",
			"mega": null,
			"gmax": null
		},
		"361": {
			"tier": "LC",
			"bestTier": "ZU",
			"bestName": "Froslass",
			"mega": {
				"tier": "NU",
				"name": "Glalie-Mega"
			},
			"gmax": null
		},
		"362": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Froslass",
			"mega": {
				"tier": "NU",
				"name": "Glalie-Mega"
			},
			"gmax": null
		},
		"363": {
			"tier": "LC",
			"bestTier": "ZU",
			"bestName": "Walrein",
			"mega": null,
			"gmax": null
		},
		"364": {
			"tier": "NFE",
			"bestTier": "ZU",
			"bestName": "Walrein",
			"mega": null,
			"gmax": null
		},
		"365": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Walrein",
			"mega": null,
			"gmax": null
		},
		"366": {
			"tier": "LC",
			"bestTier": "ZUBL",
			"bestName": "Gorebyss",
			"mega": null,
			"gmax": null
		},
		"367": {
			"tier": "ZU",
			"bestTier": "ZUBL",
			"bestName": "Gorebyss",
			"mega": null,
			"gmax": null
		},
		"368": {
			"tier": "ZUBL",
			"bestTier": "ZUBL",
			"bestName": "Gorebyss",
			"mega": null,
			"gmax": null
		},
		"369": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Relicanth",
			"mega": null,
			"gmax": null
		},
		"370": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Luvdisc",
			"mega": null,
			"gmax": null
		},
		"371": {
			"tier": "LC",
			"bestTier": "RU",
			"bestName": "Salamence",
			"mega": {
				"tier": "Uber",
				"name": "Salamence-Mega"
			},
			"gmax": null
		},
		"372": {
			"tier": "NFE",
			"bestTier": "RU",
			"bestName": "Salamence",
			"mega": {
				"tier": "Uber",
				"name": "Salamence-Mega"
			},
			"gmax": null
		},
		"373": {
			"tier": "RU",
			"bestTier": "RU",
			"bestName": "Salamence",
			"mega": {
				"tier": "Uber",
				"name": "Salamence-Mega"
			},
			"gmax": null
		},
		"374": {
			"tier": "LC",
			"bestTier": "UU",
			"bestName": "Metagross",
			"mega": {
				"tier": "Uber",
				"name": "Metagross-Mega"
			},
			"gmax": null
		},
		"375": {
			"tier": "NFE",
			"bestTier": "UU",
			"bestName": "Metagross",
			"mega": {
				"tier": "Uber",
				"name": "Metagross-Mega"
			},
			"gmax": null
		},
		"376": {
			"tier": "UU",
			"bestTier": "UU",
			"bestName": "Metagross",
			"mega": {
				"tier": "Uber",
				"name": "Metagross-Mega"
			},
			"gmax": null
		},
		"377": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Regirock",
			"mega": null,
			"gmax": null
		},
		"378": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Regice",
			"mega": null,
			"gmax": null
		},
		"379": {
			"tier": "RU",
			"bestTier": "RU",
			"bestName": "Registeel",
			"mega": null,
			"gmax": null
		},
		"380": {
			"tier": "UUBL",
			"bestTier": "UUBL",
			"bestName": "Latias",
			"mega": {
				"tier": "OU",
				"name": "Latias-Mega"
			},
			"gmax": null
		},
		"381": {
			"tier": "UU",
			"bestTier": "UU",
			"bestName": "Latios",
			"mega": {
				"tier": "UUBL",
				"name": "Latios-Mega"
			},
			"gmax": null
		},
		"382": {
			"tier": "Uber",
			"bestTier": "Uber",
			"bestName": "Kyogre",
			"mega": null,
			"gmax": null
		},
		"383": {
			"tier": "Uber",
			"bestTier": "Uber",
			"bestName": "Groudon",
			"mega": null,
			"gmax": null
		},
		"384": {
			"tier": "Uber",
			"bestTier": "Uber",
			"bestName": "Rayquaza",
			"mega": {
				"tier": "AG",
				"name": "Rayquaza-Mega"
			},
			"gmax": null
		},
		"385": {
			"tier": "RU",
			"bestTier": "RU",
			"bestName": "Jirachi",
			"mega": null,
			"gmax": null
		},
		"386": {
			"tier": "Uber",
			"bestTier": "Uber",
			"bestName": "Deoxys",
			"mega": null,
			"gmax": null
		},
		"387": {
			"tier": "LC",
			"bestTier": "PUBL",
			"bestName": "Torterra",
			"mega": null,
			"gmax": null
		},
		"388": {
			"tier": "NFE",
			"bestTier": "PUBL",
			"bestName": "Torterra",
			"mega": null,
			"gmax": null
		},
		"389": {
			"tier": "PUBL",
			"bestTier": "PUBL",
			"bestName": "Torterra",
			"mega": null,
			"gmax": null
		},
		"390": {
			"tier": "LC",
			"bestTier": "NU",
			"bestName": "Infernape",
			"mega": null,
			"gmax": null
		},
		"391": {
			"tier": "NFE",
			"bestTier": "NU",
			"bestName": "Infernape",
			"mega": null,
			"gmax": null
		},
		"392": {
			"tier": "NU",
			"bestTier": "NU",
			"bestName": "Infernape",
			"mega": null,
			"gmax": null
		},
		"393": {
			"tier": "LC",
			"bestTier": "RU",
			"bestName": "Empoleon",
			"mega": null,
			"gmax": null
		},
		"394": {
			"tier": "NFE",
			"bestTier": "RU",
			"bestName": "Empoleon",
			"mega": null,
			"gmax": null
		},
		"395": {
			"tier": "RU",
			"bestTier": "RU",
			"bestName": "Empoleon",
			"mega": null,
			"gmax": null
		},
		"396": {
			"tier": "LC",
			"bestTier": "NU",
			"bestName": "Staraptor",
			"mega": null,
			"gmax": null
		},
		"397": {
			"tier": "NFE",
			"bestTier": "NU",
			"bestName": "Staraptor",
			"mega": null,
			"gmax": null
		},
		"398": {
			"tier": "NU",
			"bestTier": "NU",
			"bestName": "Staraptor",
			"mega": null,
			"gmax": null
		},
		"399": {
			"tier": "LC",
			"bestTier": "ZU",
			"bestName": "Bibarel",
			"mega": null,
			"gmax": null
		},
		"400": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Bibarel",
			"mega": null,
			"gmax": null
		},
		"401": {
			"tier": "LC",
			"bestTier": "ZU",
			"bestName": "Kricketune",
			"mega": null,
			"gmax": null
		},
		"402": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Kricketune",
			"mega": null,
			"gmax": null
		},
		"403": {
			"tier": "LC",
			"bestTier": "ZU",
			"bestName": "Luxray",
			"mega": null,
			"gmax": null
		},
		"404": {
			"tier": "NFE",
			"bestTier": "ZU",
			"bestName": "Luxray",
			"mega": null,
			"gmax": null
		},
		"405": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Luxray",
			"mega": null,
			"gmax": null
		},
		"406": {
			"tier": "LC",
			"bestTier": "RU",
			"bestName": "Roserade",
			"mega": null,
			"gmax": null
		},
		"407": {
			"tier": "RU",
			"bestTier": "RU",
			"bestName": "Roserade",
			"mega": null,
			"gmax": null
		},
		"408": {
			"tier": "LC",
			"bestTier": "ZU",
			"bestName": "Rampardos",
			"mega": null,
			"gmax": null
		},
		"409": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Rampardos",
			"mega": null,
			"gmax": null
		},
		"410": {
			"tier": "LC",
			"bestTier": "ZU",
			"bestName": "Bastiodon",
			"mega": null,
			"gmax": null
		},
		"411": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Bastiodon",
			"mega": null,
			"gmax": null
		},
		"412": {
			"tier": "LC",
			"bestTier": "ZU",
			"bestName": "Mothim",
			"mega": null,
			"gmax": null
		},
		"413": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Mothim",
			"mega": null,
			"gmax": null
		},
		"414": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Mothim",
			"mega": null,
			"gmax": null
		},
		"415": {
			"tier": "LC",
			"bestTier": "ZU",
			"bestName": "Vespiquen",
			"mega": null,
			"gmax": null
		},
		"416": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Vespiquen",
			"mega": null,
			"gmax": null
		},
		"417": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Pachirisu",
			"mega": null,
			"gmax": null
		},
		"418": {
			"tier": "LC",
			"bestTier": "ZU",
			"bestName": "Floatzel",
			"mega": null,
			"gmax": null
		},
		"419": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Floatzel",
			"mega": null,
			"gmax": null
		},
		"420": {
			"tier": "NFE",
			"bestTier": "ZU",
			"bestName": "Cherrim",
			"mega": null,
			"gmax": null
		},
		"421": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Cherrim",
			"mega": null,
			"gmax": null
		},
		"422": {
			"tier": "LC",
			"bestTier": "RU",
			"bestName": "Gastrodon",
			"mega": null,
			"gmax": null
		},
		"423": {
			"tier": "RU",
			"bestTier": "RU",
			"bestName": "Gastrodon",
			"mega": null,
			"gmax": null
		},
		"424": {
			"tier": "PU",
			"bestTier": "PU",
			"bestName": "Ambipom",
			"mega": null,
			"gmax": null
		},
		"425": {
			"tier": "LC",
			"bestTier": "ZU",
			"bestName": "Drifblim",
			"mega": null,
			"gmax": null
		},
		"426": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Drifblim",
			"mega": null,
			"gmax": null
		},
		"427": {
			"tier": "LC",
			"bestTier": "ZU",
			"bestName": "Lopunny",
			"mega": {
				"tier": "OU",
				"name": "Lopunny-Mega"
			},
			"gmax": null
		},
		"428": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Lopunny",
			"mega": {
				"tier": "OU",
				"name": "Lopunny-Mega"
			},
			"gmax": null
		},
		"429": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Mismagius",
			"mega": null,
			"gmax": null
		},
		"430": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Honchkrow",
			"mega": null,
			"gmax": null
		},
		"431": {
			"tier": "LC",
			"bestTier": "ZU",
			"bestName": "Purugly",
			"mega": null,
			"gmax": null
		},
		"432": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Purugly",
			"mega": null,
			"gmax": null
		},
		"433": {
			"tier": "LC",
			"bestTier": "ZU",
			"bestName": "Chimecho",
			"mega": null,
			"gmax": null
		},
		"434": {
			"tier": "LC",
			"bestTier": "PU",
			"bestName": "Skuntank",
			"mega": null,
			"gmax": null
		},
		"435": {
			"tier": "PU",
			"bestTier": "PU",
			"bestName": "Skuntank",
			"mega": null,
			"gmax": null
		},
		"436": {
			"tier": "LC",
			"bestTier": "NU",
			"bestName": "Bronzong",
			"mega": null,
			"gmax": null
		},
		"437": {
			"tier": "NU",
			"bestTier": "NU",
			"bestName": "Bronzong",
			"mega": null,
			"gmax": null
		},
		"438": {
			"tier": "LC",
			"bestTier": "ZU",
			"bestName": "Sudowoodo",
			"mega": null,
			"gmax": null
		},
		"439": {
			"tier": "LC",
			"bestTier": "ZU",
			"bestName": "Mr. Rime",
			"mega": null,
			"gmax": null
		},
		"440": {
			"tier": "LC",
			"bestTier": "RU",
			"bestName": "Blissey",
			"mega": null,
			"gmax": null
		},
		"441": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Chatot",
			"mega": null,
			"gmax": null
		},
		"442": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Spiritomb",
			"mega": null,
			"gmax": null
		},
		"443": {
			"tier": "LC",
			"bestTier": "UUBL",
			"bestName": "Garchomp",
			"mega": {
				"tier": "OU",
				"name": "Garchomp-Mega"
			},
			"gmax": null
		},
		"444": {
			"tier": "NFE",
			"bestTier": "UUBL",
			"bestName": "Garchomp",
			"mega": {
				"tier": "OU",
				"name": "Garchomp-Mega"
			},
			"gmax": null
		},
		"445": {
			"tier": "UUBL",
			"bestTier": "UUBL",
			"bestName": "Garchomp",
			"mega": {
				"tier": "OU",
				"name": "Garchomp-Mega"
			},
			"gmax": null
		},
		"446": {
			"tier": "LC",
			"bestTier": "ZU",
			"bestName": "Snorlax",
			"mega": null,
			"gmax": {
				"tier": "AG",
				"name": "Snorlax-Gmax"
			}
		},
		"447": {
			"tier": "LC",
			"bestTier": "NUBL",
			"bestName": "Lucario",
			"mega": {
				"tier": "Uber",
				"name": "Lucario-Mega"
			},
			"gmax": null
		},
		"448": {
			"tier": "NUBL",
			"bestTier": "NUBL",
			"bestName": "Lucario",
			"mega": {
				"tier": "Uber",
				"name": "Lucario-Mega"
			},
			"gmax": null
		},
		"449": {
			"tier": "LC",
			"bestTier": "RU",
			"bestName": "Hippowdon",
			"mega": null,
			"gmax": null
		},
		"450": {
			"tier": "RU",
			"bestTier": "RU",
			"bestName": "Hippowdon",
			"mega": null,
			"gmax": null
		},
		"451": {
			"tier": "LC",
			"bestTier": "NU",
			"bestName": "Drapion",
			"mega": null,
			"gmax": null
		},
		"452": {
			"tier": "NU",
			"bestTier": "NU",
			"bestName": "Drapion",
			"mega": null,
			"gmax": null
		},
		"453": {
			"tier": "LC",
			"bestTier": "NU",
			"bestName": "Toxicroak",
			"mega": null,
			"gmax": null
		},
		"454": {
			"tier": "NU",
			"bestTier": "NU",
			"bestName": "Toxicroak",
			"mega": null,
			"gmax": null
		},
		"455": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Carnivine",
			"mega": null,
			"gmax": null
		},
		"456": {
			"tier": "LC",
			"bestTier": "ZU",
			"bestName": "Lumineon",
			"mega": null,
			"gmax": null
		},
		"457": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Lumineon",
			"mega": null,
			"gmax": null
		},
		"458": {
			"tier": "LC",
			"bestTier": "NU",
			"bestName": "Mantine",
			"mega": null,
			"gmax": null
		},
		"459": {
			"tier": "LC",
			"bestTier": "ZU",
			"bestName": "Abomasnow",
			"mega": {
				"tier": "NU",
				"name": "Abomasnow-Mega"
			},
			"gmax": null
		},
		"460": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Abomasnow",
			"mega": {
				"tier": "NU",
				"name": "Abomasnow-Mega"
			},
			"gmax": null
		},
		"461": {
			"tier": "OU",
			"bestTier": "OU",
			"bestName": "Weavile",
			"mega": null,
			"gmax": null
		},
		"462": {
			"tier": "RU",
			"bestTier": "RU",
			"bestName": "Magnezone",
			"mega": null,
			"gmax": null
		},
		"463": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Lickilicky",
			"mega": null,
			"gmax": null
		},
		"464": {
			"tier": "NU",
			"bestTier": "NU",
			"bestName": "Rhyperior",
			"mega": null,
			"gmax": null
		},
		"465": {
			"tier": "UU",
			"bestTier": "UU",
			"bestName": "Tangrowth",
			"mega": null,
			"gmax": null
		},
		"466": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Electivire",
			"mega": null,
			"gmax": null
		},
		"467": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Magmortar",
			"mega": null,
			"gmax": null
		},
		"468": {
			"tier": "RU",
			"bestTier": "RU",
			"bestName": "Togekiss",
			"mega": null,
			"gmax": null
		},
		"469": {
			"tier": "RUBL",
			"bestTier": "RUBL",
			"bestName": "Yanmega",
			"mega": null,
			"gmax": null
		},
		"470": {
			"tier": "ZU",
			"bestTier": "RU",
			"bestName": "Umbreon",
			"mega": null,
			"gmax": {
				"tier": "AG",
				"name": "Eevee-Gmax"
			}
		},
		"471": {
			"tier": "ZU",
			"bestTier": "RU",
			"bestName": "Umbreon",
			"mega": null,
			"gmax": {
				"tier": "AG",
				"name": "Eevee-Gmax"
			}
		},
		"472": {
			"tier": "OU",
			"bestTier": "OU",
			"bestName": "Gliscor",
			"mega": null,
			"gmax": null
		},
		"473": {
			"tier": "RU",
			"bestTier": "RU",
			"bestName": "Mamoswine",
			"mega": null,
			"gmax": null
		},
		"474": {
			"tier": "NUBL",
			"bestTier": "NUBL",
			"bestName": "Porygon-Z",
			"mega": null,
			"gmax": null
		},
		"475": {
			"tier": "RU",
			"bestTier": "RU",
			"bestName": "Gallade",
			"mega": {
				"tier": "UUBL",
				"name": "Gardevoir-Mega"
			},
			"gmax": null
		},
		"476": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Probopass",
			"mega": null,
			"gmax": null
		},
		"477": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Dusknoir",
			"mega": null,
			"gmax": null
		},
		"478": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Froslass",
			"mega": {
				"tier": "NU",
				"name": "Glalie-Mega"
			},
			"gmax": null
		},
		"479": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Rotom",
			"mega": null,
			"gmax": null
		},
		"480": {
			"tier": "PU",
			"bestTier": "PU",
			"bestName": "Uxie",
			"mega": null,
			"gmax": null
		},
		"481": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Mesprit",
			"mega": null,
			"gmax": null
		},
		"482": {
			"tier": "RU",
			"bestTier": "RU",
			"bestName": "Azelf",
			"mega": null,
			"gmax": null
		},
		"483": {
			"tier": "Uber",
			"bestTier": "Uber",
			"bestName": "Dialga",
			"mega": null,
			"gmax": null
		},
		"484": {
			"tier": "Uber",
			"bestTier": "Uber",
			"bestName": "Palkia",
			"mega": null,
			"gmax": null
		},
		"485": {
			"tier": "UU",
			"bestTier": "UU",
			"bestName": "Heatran",
			"mega": null,
			"gmax": null
		},
		"486": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Regigigas",
			"mega": null,
			"gmax": null
		},
		"487": {
			"tier": "Uber",
			"bestTier": "Uber",
			"bestName": "Giratina",
			"mega": null,
			"gmax": null
		},
		"488": {
			"tier": "NUBL",
			"bestTier": "NUBL",
			"bestName": "Cresselia",
			"mega": null,
			"gmax": null
		},
		"489": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Phione",
			"mega": null,
			"gmax": null
		},
		"490": {
			"tier": "UU",
			"bestTier": "UU",
			"bestName": "Manaphy",
			"mega": null,
			"gmax": null
		},
		"491": {
			"tier": "OU",
			"bestTier": "OU",
			"bestName": "Darkrai",
			"mega": null,
			"gmax": null
		},
		"492": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Shaymin",
			"mega": null,
			"gmax": null
		},
		"493": {
			"tier": "Uber",
			"bestTier": "Uber",
			"bestName": "Arceus",
			"mega": null,
			"gmax": null
		},
		"494": {
			"tier": "OU",
			"bestTier": "OU",
			"bestName": "Victini",
			"mega": null,
			"gmax": null
		},
		"495": {
			"tier": "NFE",
			"bestTier": "RUBL",
			"bestName": "Serperior",
			"mega": null,
			"gmax": null
		},
		"496": {
			"tier": "NFE",
			"bestTier": "RUBL",
			"bestName": "Serperior",
			"mega": null,
			"gmax": null
		},
		"497": {
			"tier": "RUBL",
			"bestTier": "RUBL",
			"bestName": "Serperior",
			"mega": null,
			"gmax": null
		},
		"498": {
			"tier": "LC",
			"bestTier": "ZUBL",
			"bestName": "Emboar",
			"mega": null,
			"gmax": null
		},
		"499": {
			"tier": "NFE",
			"bestTier": "ZUBL",
			"bestName": "Emboar",
			"mega": null,
			"gmax": null
		},
		"500": {
			"tier": "ZUBL",
			"bestTier": "ZUBL",
			"bestName": "Emboar",
			"mega": null,
			"gmax": null
		},
		"501": {
			"tier": "LC",
			"bestTier": "OU",
			"bestName": "Samurott-Hisui",
			"mega": null,
			"gmax": null
		},
		"502": {
			"tier": "NFE",
			"bestTier": "OU",
			"bestName": "Samurott-Hisui",
			"mega": null,
			"gmax": null
		},
		"503": {
			"tier": "ZU",
			"bestTier": "OU",
			"bestName": "Samurott-Hisui",
			"mega": null,
			"gmax": null
		},
		"504": {
			"tier": "LC",
			"bestTier": "ZU",
			"bestName": "Watchog",
			"mega": null,
			"gmax": null
		},
		"505": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Watchog",
			"mega": null,
			"gmax": null
		},
		"506": {
			"tier": "LC",
			"bestTier": "ZU",
			"bestName": "Stoutland",
			"mega": null,
			"gmax": null
		},
		"507": {
			"tier": "NFE",
			"bestTier": "ZU",
			"bestName": "Stoutland",
			"mega": null,
			"gmax": null
		},
		"508": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Stoutland",
			"mega": null,
			"gmax": null
		},
		"509": {
			"tier": "LC",
			"bestTier": "ZU",
			"bestName": "Liepard",
			"mega": null,
			"gmax": null
		},
		"510": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Liepard",
			"mega": null,
			"gmax": null
		},
		"511": {
			"tier": "LC",
			"bestTier": "ZU",
			"bestName": "Simisage",
			"mega": null,
			"gmax": null
		},
		"512": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Simisage",
			"mega": null,
			"gmax": null
		},
		"513": {
			"tier": "LC",
			"bestTier": "ZU",
			"bestName": "Simisear",
			"mega": null,
			"gmax": null
		},
		"514": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Simisear",
			"mega": null,
			"gmax": null
		},
		"515": {
			"tier": "LC",
			"bestTier": "ZU",
			"bestName": "Simipour",
			"mega": null,
			"gmax": null
		},
		"516": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Simipour",
			"mega": null,
			"gmax": null
		},
		"517": {
			"tier": "LC",
			"bestTier": "ZU",
			"bestName": "Musharna",
			"mega": null,
			"gmax": null
		},
		"518": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Musharna",
			"mega": null,
			"gmax": null
		},
		"519": {
			"tier": "LC",
			"bestTier": "ZU",
			"bestName": "Unfezant",
			"mega": null,
			"gmax": null
		},
		"520": {
			"tier": "NFE",
			"bestTier": "ZU",
			"bestName": "Unfezant",
			"mega": null,
			"gmax": null
		},
		"521": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Unfezant",
			"mega": null,
			"gmax": null
		},
		"522": {
			"tier": "LC",
			"bestTier": "ZU",
			"bestName": "Zebstrika",
			"mega": null,
			"gmax": null
		},
		"523": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Zebstrika",
			"mega": null,
			"gmax": null
		},
		"524": {
			"tier": "LC",
			"bestTier": "PU",
			"bestName": "Gigalith",
			"mega": null,
			"gmax": null
		},
		"525": {
			"tier": "NFE",
			"bestTier": "PU",
			"bestName": "Gigalith",
			"mega": null,
			"gmax": null
		},
		"526": {
			"tier": "PU",
			"bestTier": "PU",
			"bestName": "Gigalith",
			"mega": null,
			"gmax": null
		},
		"527": {
			"tier": "NFE",
			"bestTier": "ZU",
			"bestName": "Swoobat",
			"mega": null,
			"gmax": null
		},
		"528": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Swoobat",
			"mega": null,
			"gmax": null
		},
		"529": {
			"tier": "LC",
			"bestTier": "UU",
			"bestName": "Excadrill",
			"mega": null,
			"gmax": null
		},
		"530": {
			"tier": "UU",
			"bestTier": "UU",
			"bestName": "Excadrill",
			"mega": null,
			"gmax": null
		},
		"531": {
			"tier": "PU",
			"bestTier": "PU",
			"bestName": "Audino",
			"mega": {
				"tier": "NU",
				"name": "Audino-Mega"
			},
			"gmax": null
		},
		"532": {
			"tier": "LC",
			"bestTier": "UU",
			"bestName": "Conkeldurr",
			"mega": null,
			"gmax": null
		},
		"533": {
			"tier": "NFE",
			"bestTier": "UU",
			"bestName": "Conkeldurr",
			"mega": null,
			"gmax": null
		},
		"534": {
			"tier": "UU",
			"bestTier": "UU",
			"bestName": "Conkeldurr",
			"mega": null,
			"gmax": null
		},
		"535": {
			"tier": "LC",
			"bestTier": "RU",
			"bestName": "Seismitoad",
			"mega": null,
			"gmax": null
		},
		"536": {
			"tier": "NFE",
			"bestTier": "RU",
			"bestName": "Seismitoad",
			"mega": null,
			"gmax": null
		},
		"537": {
			"tier": "RU",
			"bestTier": "RU",
			"bestName": "Seismitoad",
			"mega": null,
			"gmax": null
		},
		"538": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Throh",
			"mega": null,
			"gmax": null
		},
		"539": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Sawk",
			"mega": null,
			"gmax": null
		},
		"540": {
			"tier": "LC",
			"bestTier": "ZU",
			"bestName": "Leavanny",
			"mega": null,
			"gmax": null
		},
		"541": {
			"tier": "NFE",
			"bestTier": "ZU",
			"bestName": "Leavanny",
			"mega": null,
			"gmax": null
		},
		"542": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Leavanny",
			"mega": null,
			"gmax": null
		},
		"543": {
			"tier": "LC",
			"bestTier": "RUBL",
			"bestName": "Scolipede",
			"mega": null,
			"gmax": null
		},
		"544": {
			"tier": "NFE",
			"bestTier": "RUBL",
			"bestName": "Scolipede",
			"mega": null,
			"gmax": null
		},
		"545": {
			"tier": "RUBL",
			"bestTier": "RUBL",
			"bestName": "Scolipede",
			"mega": null,
			"gmax": null
		},
		"546": {
			"tier": "LC",
			"bestTier": "ZU",
			"bestName": "Whimsicott",
			"mega": null,
			"gmax": null
		},
		"547": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Whimsicott",
			"mega": null,
			"gmax": null
		},
		"548": {
			"tier": "LC",
			"bestTier": "NUBL",
			"bestName": "Lilligant-Hisui",
			"mega": null,
			"gmax": null
		},
		"549": {
			"tier": "ZU",
			"bestTier": "NUBL",
			"bestName": "Lilligant-Hisui",
			"mega": null,
			"gmax": null
		},
		"550": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Basculin",
			"mega": null,
			"gmax": null
		},
		"551": {
			"tier": "LC",
			"bestTier": "RU",
			"bestName": "Krookodile",
			"mega": null,
			"gmax": null
		},
		"552": {
			"tier": "NFE",
			"bestTier": "RU",
			"bestName": "Krookodile",
			"mega": null,
			"gmax": null
		},
		"553": {
			"tier": "RU",
			"bestTier": "RU",
			"bestName": "Krookodile",
			"mega": null,
			"gmax": null
		},
		"554": {
			"tier": "LC",
			"bestTier": "UU",
			"bestName": "Darmanitan",
			"mega": null,
			"gmax": null
		},
		"555": {
			"tier": "UU",
			"bestTier": "UU",
			"bestName": "Darmanitan",
			"mega": null,
			"gmax": null
		},
		"556": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Maractus",
			"mega": null,
			"gmax": null
		},
		"557": {
			"tier": "LC",
			"bestTier": "ZU",
			"bestName": "Crustle",
			"mega": null,
			"gmax": null
		},
		"558": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Crustle",
			"mega": null,
			"gmax": null
		},
		"559": {
			"tier": "NFE",
			"bestTier": "NU",
			"bestName": "Scrafty",
			"mega": null,
			"gmax": null
		},
		"560": {
			"tier": "NU",
			"bestTier": "NU",
			"bestName": "Scrafty",
			"mega": null,
			"gmax": null
		},
		"561": {
			"tier": "NUBL",
			"bestTier": "NUBL",
			"bestName": "Sigilyph",
			"mega": null,
			"gmax": null
		},
		"562": {
			"tier": "LC",
			"bestTier": "ZU",
			"bestName": "Cofagrigus",
			"mega": null,
			"gmax": null
		},
		"563": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Cofagrigus",
			"mega": null,
			"gmax": null
		},
		"564": {
			"tier": "LC",
			"bestTier": "ZU",
			"bestName": "Carracosta",
			"mega": null,
			"gmax": null
		},
		"565": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Carracosta",
			"mega": null,
			"gmax": null
		},
		"566": {
			"tier": "LC",
			"bestTier": "PU",
			"bestName": "Archeops",
			"mega": null,
			"gmax": null
		},
		"567": {
			"tier": "PU",
			"bestTier": "PU",
			"bestName": "Archeops",
			"mega": null,
			"gmax": null
		},
		"568": {
			"tier": "LC",
			"bestTier": "PU",
			"bestName": "Garbodor",
			"mega": null,
			"gmax": {
				"tier": "AG",
				"name": "Garbodor-Gmax"
			}
		},
		"569": {
			"tier": "PU",
			"bestTier": "PU",
			"bestName": "Garbodor",
			"mega": null,
			"gmax": {
				"tier": "AG",
				"name": "Garbodor-Gmax"
			}
		},
		"570": {
			"tier": "LC",
			"bestTier": "PU",
			"bestName": "Zoroark",
			"mega": null,
			"gmax": null
		},
		"571": {
			"tier": "PU",
			"bestTier": "PU",
			"bestName": "Zoroark",
			"mega": null,
			"gmax": null
		},
		"572": {
			"tier": "LC",
			"bestTier": "NU",
			"bestName": "Cinccino",
			"mega": null,
			"gmax": null
		},
		"573": {
			"tier": "NU",
			"bestTier": "NU",
			"bestName": "Cinccino",
			"mega": null,
			"gmax": null
		},
		"574": {
			"tier": "LC",
			"bestTier": "ZU",
			"bestName": "Gothitelle",
			"mega": null,
			"gmax": null
		},
		"575": {
			"tier": "NFE",
			"bestTier": "ZU",
			"bestName": "Gothitelle",
			"mega": null,
			"gmax": null
		},
		"576": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Gothitelle",
			"mega": null,
			"gmax": null
		},
		"577": {
			"tier": "LC",
			"bestTier": "RU",
			"bestName": "Reuniclus",
			"mega": null,
			"gmax": null
		},
		"578": {
			"tier": "NFE",
			"bestTier": "RU",
			"bestName": "Reuniclus",
			"mega": null,
			"gmax": null
		},
		"579": {
			"tier": "RU",
			"bestTier": "RU",
			"bestName": "Reuniclus",
			"mega": null,
			"gmax": null
		},
		"580": {
			"tier": "LC",
			"bestTier": "ZU",
			"bestName": "Swanna",
			"mega": null,
			"gmax": null
		},
		"581": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Swanna",
			"mega": null,
			"gmax": null
		},
		"582": {
			"tier": "LC",
			"bestTier": "PUBL",
			"bestName": "Vanilluxe",
			"mega": null,
			"gmax": null
		},
		"583": {
			"tier": "NFE",
			"bestTier": "PUBL",
			"bestName": "Vanilluxe",
			"mega": null,
			"gmax": null
		},
		"584": {
			"tier": "PUBL",
			"bestTier": "PUBL",
			"bestName": "Vanilluxe",
			"mega": null,
			"gmax": null
		},
		"585": {
			"tier": "LC",
			"bestTier": "ZU",
			"bestName": "Sawsbuck",
			"mega": null,
			"gmax": null
		},
		"586": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Sawsbuck",
			"mega": null,
			"gmax": null
		},
		"587": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Emolga",
			"mega": null,
			"gmax": null
		},
		"588": {
			"tier": "LC",
			"bestTier": "NU",
			"bestName": "Escavalier",
			"mega": null,
			"gmax": null
		},
		"589": {
			"tier": "NU",
			"bestTier": "NU",
			"bestName": "Escavalier",
			"mega": null,
			"gmax": null
		},
		"590": {
			"tier": "LC",
			"bestTier": "PU",
			"bestName": "Amoonguss",
			"mega": null,
			"gmax": null
		},
		"591": {
			"tier": "PU",
			"bestTier": "PU",
			"bestName": "Amoonguss",
			"mega": null,
			"gmax": null
		},
		"592": {
			"tier": "LC",
			"bestTier": "PU",
			"bestName": "Jellicent",
			"mega": null,
			"gmax": null
		},
		"593": {
			"tier": "PU",
			"bestTier": "PU",
			"bestName": "Jellicent",
			"mega": null,
			"gmax": null
		},
		"594": {
			"tier": "OU",
			"bestTier": "OU",
			"bestName": "Alomomola",
			"mega": null,
			"gmax": null
		},
		"595": {
			"tier": "LC",
			"bestTier": "NU",
			"bestName": "Galvantula",
			"mega": null,
			"gmax": null
		},
		"596": {
			"tier": "NU",
			"bestTier": "NU",
			"bestName": "Galvantula",
			"mega": null,
			"gmax": null
		},
		"597": {
			"tier": "PU",
			"bestTier": "OU",
			"bestName": "Ferrothorn",
			"mega": null,
			"gmax": null
		},
		"598": {
			"tier": "OU",
			"bestTier": "OU",
			"bestName": "Ferrothorn",
			"mega": null,
			"gmax": null
		},
		"599": {
			"tier": "LC",
			"bestTier": "ZU",
			"bestName": "Klinklang",
			"mega": null,
			"gmax": null
		},
		"600": {
			"tier": "NFE",
			"bestTier": "ZU",
			"bestName": "Klinklang",
			"mega": null,
			"gmax": null
		},
		"601": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Klinklang",
			"mega": null,
			"gmax": null
		},
		"602": {
			"tier": "LC",
			"bestTier": "ZU",
			"bestName": "Eelektross",
			"mega": null,
			"gmax": null
		},
		"603": {
			"tier": "NFE",
			"bestTier": "ZU",
			"bestName": "Eelektross",
			"mega": null,
			"gmax": null
		},
		"604": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Eelektross",
			"mega": null,
			"gmax": null
		},
		"605": {
			"tier": "LC",
			"bestTier": "ZU",
			"bestName": "Beheeyem",
			"mega": null,
			"gmax": null
		},
		"606": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Beheeyem",
			"mega": null,
			"gmax": null
		},
		"607": {
			"tier": "LC",
			"bestTier": "NU",
			"bestName": "Chandelure",
			"mega": null,
			"gmax": null
		},
		"608": {
			"tier": "NFE",
			"bestTier": "NU",
			"bestName": "Chandelure",
			"mega": null,
			"gmax": null
		},
		"609": {
			"tier": "NU",
			"bestTier": "NU",
			"bestName": "Chandelure",
			"mega": null,
			"gmax": null
		},
		"610": {
			"tier": "LC",
			"bestTier": "RUBL",
			"bestName": "Haxorus",
			"mega": null,
			"gmax": null
		},
		"611": {
			"tier": "NFE",
			"bestTier": "RUBL",
			"bestName": "Haxorus",
			"mega": null,
			"gmax": null
		},
		"612": {
			"tier": "RUBL",
			"bestTier": "RUBL",
			"bestName": "Haxorus",
			"mega": null,
			"gmax": null
		},
		"613": {
			"tier": "LC",
			"bestTier": "ZU",
			"bestName": "Beartic",
			"mega": null,
			"gmax": null
		},
		"614": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Beartic",
			"mega": null,
			"gmax": null
		},
		"615": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Cryogonal",
			"mega": null,
			"gmax": null
		},
		"616": {
			"tier": "LC",
			"bestTier": "ZU",
			"bestName": "Accelgor",
			"mega": null,
			"gmax": null
		},
		"617": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Accelgor",
			"mega": null,
			"gmax": null
		},
		"618": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Stunfisk",
			"mega": null,
			"gmax": null
		},
		"619": {
			"tier": "LC",
			"bestTier": "NUBL",
			"bestName": "Mienshao",
			"mega": null,
			"gmax": null
		},
		"620": {
			"tier": "NUBL",
			"bestTier": "NUBL",
			"bestName": "Mienshao",
			"mega": null,
			"gmax": null
		},
		"621": {
			"tier": "PU",
			"bestTier": "PU",
			"bestName": "Druddigon",
			"mega": null,
			"gmax": null
		},
		"622": {
			"tier": "LC",
			"bestTier": "PU",
			"bestName": "Golurk",
			"mega": null,
			"gmax": null
		},
		"623": {
			"tier": "PU",
			"bestTier": "PU",
			"bestName": "Golurk",
			"mega": null,
			"gmax": null
		},
		"624": {
			"tier": "LC",
			"bestTier": "OU",
			"bestName": "Kingambit",
			"mega": null,
			"gmax": null
		},
		"625": {
			"tier": "RU",
			"bestTier": "OU",
			"bestName": "Kingambit",
			"mega": null,
			"gmax": null
		},
		"626": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Bouffalant",
			"mega": null,
			"gmax": null
		},
		"627": {
			"tier": "NFE",
			"bestTier": "NU",
			"bestName": "Braviary",
			"mega": null,
			"gmax": null
		},
		"628": {
			"tier": "NU",
			"bestTier": "NU",
			"bestName": "Braviary",
			"mega": null,
			"gmax": null
		},
		"629": {
			"tier": "LC",
			"bestTier": "UU",
			"bestName": "Mandibuzz",
			"mega": null,
			"gmax": null
		},
		"630": {
			"tier": "UU",
			"bestTier": "UU",
			"bestName": "Mandibuzz",
			"mega": null,
			"gmax": null
		},
		"631": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Heatmor",
			"mega": null,
			"gmax": null
		},
		"632": {
			"tier": "RUBL",
			"bestTier": "RUBL",
			"bestName": "Durant",
			"mega": null,
			"gmax": null
		},
		"633": {
			"tier": "LC",
			"bestTier": "RUBL",
			"bestName": "Hydreigon",
			"mega": null,
			"gmax": null
		},
		"634": {
			"tier": "NFE",
			"bestTier": "RUBL",
			"bestName": "Hydreigon",
			"mega": null,
			"gmax": null
		},
		"635": {
			"tier": "RUBL",
			"bestTier": "RUBL",
			"bestName": "Hydreigon",
			"mega": null,
			"gmax": null
		},
		"636": {
			"tier": "LC",
			"bestTier": "Uber",
			"bestName": "Volcarona",
			"mega": null,
			"gmax": null
		},
		"637": {
			"tier": "Uber",
			"bestTier": "Uber",
			"bestName": "Volcarona",
			"mega": null,
			"gmax": null
		},
		"638": {
			"tier": "UU",
			"bestTier": "UU",
			"bestName": "Cobalion",
			"mega": null,
			"gmax": null
		},
		"639": {
			"tier": "RU",
			"bestTier": "RU",
			"bestName": "Terrakion",
			"mega": null,
			"gmax": null
		},
		"640": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Virizion",
			"mega": null,
			"gmax": null
		},
		"641": {
			"tier": "NU",
			"bestTier": "NU",
			"bestName": "Tornadus",
			"mega": null,
			"gmax": null
		},
		"642": {
			"tier": "RUBL",
			"bestTier": "RUBL",
			"bestName": "Thundurus",
			"mega": null,
			"gmax": null
		},
		"643": {
			"tier": "Uber",
			"bestTier": "Uber",
			"bestName": "Reshiram",
			"mega": null,
			"gmax": null
		},
		"644": {
			"tier": "Uber",
			"bestTier": "Uber",
			"bestName": "Zekrom",
			"mega": null,
			"gmax": null
		},
		"645": {
			"tier": "Uber",
			"bestTier": "Uber",
			"bestName": "Landorus",
			"mega": null,
			"gmax": null
		},
		"646": {
			"tier": "OU",
			"bestTier": "OU",
			"bestName": "Kyurem",
			"mega": null,
			"gmax": null
		},
		"647": {
			"tier": "UU",
			"bestTier": "UU",
			"bestName": "Keldeo",
			"mega": null,
			"gmax": null
		},
		"648": {
			"tier": "NU",
			"bestTier": "NU",
			"bestName": "Meloetta",
			"mega": null,
			"gmax": null
		},
		"649": {
			"tier": "Uber",
			"bestTier": "Uber",
			"bestName": "Genesect",
			"mega": null,
			"gmax": null
		},
		"650": {
			"tier": "LC",
			"bestTier": "RU",
			"bestName": "Chesnaught",
			"mega": null,
			"gmax": null
		},
		"651": {
			"tier": "NFE",
			"bestTier": "RU",
			"bestName": "Chesnaught",
			"mega": null,
			"gmax": null
		},
		"652": {
			"tier": "RU",
			"bestTier": "RU",
			"bestName": "Chesnaught",
			"mega": null,
			"gmax": null
		},
		"653": {
			"tier": "LC",
			"bestTier": "PU",
			"bestName": "Delphox",
			"mega": null,
			"gmax": null
		},
		"654": {
			"tier": "NFE",
			"bestTier": "PU",
			"bestName": "Delphox",
			"mega": null,
			"gmax": null
		},
		"655": {
			"tier": "PU",
			"bestTier": "PU",
			"bestName": "Delphox",
			"mega": null,
			"gmax": null
		},
		"656": {
			"tier": "LC",
			"bestTier": "UU",
			"bestName": "Greninja",
			"mega": null,
			"gmax": null
		},
		"657": {
			"tier": "NFE",
			"bestTier": "UU",
			"bestName": "Greninja",
			"mega": null,
			"gmax": null
		},
		"658": {
			"tier": "UU",
			"bestTier": "UU",
			"bestName": "Greninja",
			"mega": null,
			"gmax": null
		},
		"659": {
			"tier": "LC",
			"bestTier": "RUBL",
			"bestName": "Diggersby",
			"mega": null,
			"gmax": null
		},
		"660": {
			"tier": "RUBL",
			"bestTier": "RUBL",
			"bestName": "Diggersby",
			"mega": null,
			"gmax": null
		},
		"661": {
			"tier": "LC",
			"bestTier": "RU",
			"bestName": "Talonflame",
			"mega": null,
			"gmax": null
		},
		"662": {
			"tier": "NFE",
			"bestTier": "RU",
			"bestName": "Talonflame",
			"mega": null,
			"gmax": null
		},
		"663": {
			"tier": "RU",
			"bestTier": "RU",
			"bestName": "Talonflame",
			"mega": null,
			"gmax": null
		},
		"664": {
			"tier": "LC",
			"bestTier": "ZU",
			"bestName": "Vivillon-Fancy",
			"mega": null,
			"gmax": null
		},
		"665": {
			"tier": "NFE",
			"bestTier": "ZU",
			"bestName": "Vivillon-Fancy",
			"mega": null,
			"gmax": null
		},
		"666": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Vivillon-Fancy",
			"mega": null,
			"gmax": null
		},
		"667": {
			"tier": "LC",
			"bestTier": "ZU",
			"bestName": "Pyroar",
			"mega": null,
			"gmax": null
		},
		"668": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Pyroar",
			"mega": null,
			"gmax": null
		},
		"669": {
			"tier": "LC",
			"bestTier": "PU",
			"bestName": "Florges",
			"mega": null,
			"gmax": null
		},
		"670": {
			"tier": "NFE",
			"bestTier": "PU",
			"bestName": "Florges",
			"mega": null,
			"gmax": null
		},
		"671": {
			"tier": "PU",
			"bestTier": "PU",
			"bestName": "Florges",
			"mega": null,
			"gmax": null
		},
		"672": {
			"tier": "LC",
			"bestTier": "ZU",
			"bestName": "Gogoat",
			"mega": null,
			"gmax": null
		},
		"673": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Gogoat",
			"mega": null,
			"gmax": null
		},
		"674": {
			"tier": "LC",
			"bestTier": "NUBL",
			"bestName": "Pangoro",
			"mega": null,
			"gmax": null
		},
		"675": {
			"tier": "NUBL",
			"bestTier": "NUBL",
			"bestName": "Pangoro",
			"mega": null,
			"gmax": null
		},
		"676": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Furfrou",
			"mega": null,
			"gmax": null
		},
		"677": {
			"tier": "LC",
			"bestTier": "ZU",
			"bestName": "Meowstic-F",
			"mega": null,
			"gmax": null
		},
		"678": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Meowstic-F",
			"mega": null,
			"gmax": null
		},
		"679": {
			"tier": "LC",
			"bestTier": "UUBL",
			"bestName": "Aegislash",
			"mega": null,
			"gmax": null
		},
		"680": {
			"tier": "PU",
			"bestTier": "UUBL",
			"bestName": "Aegislash",
			"mega": null,
			"gmax": null
		},
		"681": {
			"tier": "UUBL",
			"bestTier": "UUBL",
			"bestName": "Aegislash",
			"mega": null,
			"gmax": null
		},
		"682": {
			"tier": "LC",
			"bestTier": "PU",
			"bestName": "Aromatisse",
			"mega": null,
			"gmax": null
		},
		"683": {
			"tier": "PU",
			"bestTier": "PU",
			"bestName": "Aromatisse",
			"mega": null,
			"gmax": null
		},
		"684": {
			"tier": "NFE",
			"bestTier": "NUBL",
			"bestName": "Slurpuff",
			"mega": null,
			"gmax": null
		},
		"685": {
			"tier": "NUBL",
			"bestTier": "NUBL",
			"bestName": "Slurpuff",
			"mega": null,
			"gmax": null
		},
		"686": {
			"tier": "LC",
			"bestTier": "ZU",
			"bestName": "Malamar",
			"mega": null,
			"gmax": null
		},
		"687": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Malamar",
			"mega": null,
			"gmax": null
		},
		"688": {
			"tier": "LC",
			"bestTier": "NUBL",
			"bestName": "Barbaracle",
			"mega": null,
			"gmax": null
		},
		"689": {
			"tier": "NUBL",
			"bestTier": "NUBL",
			"bestName": "Barbaracle",
			"mega": null,
			"gmax": null
		},
		"690": {
			"tier": "LC",
			"bestTier": "PUBL",
			"bestName": "Dragalge",
			"mega": null,
			"gmax": null
		},
		"691": {
			"tier": "PUBL",
			"bestTier": "PUBL",
			"bestName": "Dragalge",
			"mega": null,
			"gmax": null
		},
		"692": {
			"tier": "LC",
			"bestTier": "ZU",
			"bestName": "Clawitzer",
			"mega": null,
			"gmax": null
		},
		"693": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Clawitzer",
			"mega": null,
			"gmax": null
		},
		"694": {
			"tier": "LC",
			"bestTier": "NU",
			"bestName": "Heliolisk",
			"mega": null,
			"gmax": null
		},
		"695": {
			"tier": "NU",
			"bestTier": "NU",
			"bestName": "Heliolisk",
			"mega": null,
			"gmax": null
		},
		"696": {
			"tier": "LC",
			"bestTier": "NU",
			"bestName": "Tyrantrum",
			"mega": null,
			"gmax": null
		},
		"697": {
			"tier": "NU",
			"bestTier": "NU",
			"bestName": "Tyrantrum",
			"mega": null,
			"gmax": null
		},
		"698": {
			"tier": "LC",
			"bestTier": "ZUBL",
			"bestName": "Aurorus",
			"mega": null,
			"gmax": null
		},
		"699": {
			"tier": "ZUBL",
			"bestTier": "ZUBL",
			"bestName": "Aurorus",
			"mega": null,
			"gmax": null
		},
		"700": {
			"tier": "NU",
			"bestTier": "RU",
			"bestName": "Umbreon",
			"mega": null,
			"gmax": {
				"tier": "AG",
				"name": "Eevee-Gmax"
			}
		},
		"701": {
			"tier": "UU",
			"bestTier": "UU",
			"bestName": "Hawlucha",
			"mega": null,
			"gmax": null
		},
		"702": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Dedenne",
			"mega": null,
			"gmax": null
		},
		"703": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Carbink",
			"mega": null,
			"gmax": null
		},
		"704": {
			"tier": "LC",
			"bestTier": "RU",
			"bestName": "Goodra-Hisui",
			"mega": null,
			"gmax": null
		},
		"705": {
			"tier": "NFE",
			"bestTier": "RU",
			"bestName": "Goodra-Hisui",
			"mega": null,
			"gmax": null
		},
		"706": {
			"tier": "PU",
			"bestTier": "RU",
			"bestName": "Goodra-Hisui",
			"mega": null,
			"gmax": null
		},
		"707": {
			"tier": "NU",
			"bestTier": "NU",
			"bestName": "Klefki",
			"mega": null,
			"gmax": null
		},
		"708": {
			"tier": "LC",
			"bestTier": "ZU",
			"bestName": "Trevenant",
			"mega": null,
			"gmax": null
		},
		"709": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Trevenant",
			"mega": null,
			"gmax": null
		},
		"710": {
			"tier": "LC",
			"bestTier": "ZU",
			"bestName": "Gourgeist",
			"mega": null,
			"gmax": null
		},
		"711": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Gourgeist",
			"mega": null,
			"gmax": null
		},
		"712": {
			"tier": "LC",
			"bestTier": "NU",
			"bestName": "Avalugg",
			"mega": null,
			"gmax": null
		},
		"713": {
			"tier": "NU",
			"bestTier": "NU",
			"bestName": "Avalugg",
			"mega": null,
			"gmax": null
		},
		"714": {
			"tier": "LC",
			"bestTier": "RU",
			"bestName": "Noivern",
			"mega": null,
			"gmax": null
		},
		"715": {
			"tier": "RU",
			"bestTier": "RU",
			"bestName": "Noivern",
			"mega": null,
			"gmax": null
		},
		"716": {
			"tier": "Uber",
			"bestTier": "Uber",
			"bestName": "Xerneas",
			"mega": null,
			"gmax": null
		},
		"717": {
			"tier": "Uber",
			"bestTier": "Uber",
			"bestName": "Yveltal",
			"mega": null,
			"gmax": null
		},
		"718": {
			"tier": "Uber",
			"bestTier": "Uber",
			"bestName": "Zygarde",
			"mega": null,
			"gmax": null
		},
		"719": {
			"tier": "NU",
			"bestTier": "NU",
			"bestName": "Diancie",
			"mega": {
				"tier": "OU",
				"name": "Diancie-Mega"
			},
			"gmax": null
		},
		"720": {
			"tier": "PU",
			"bestTier": "PU",
			"bestName": "Hoopa",
			"mega": null,
			"gmax": null
		},
		"721": {
			"tier": "RU",
			"bestTier": "RU",
			"bestName": "Volcanion",
			"mega": null,
			"gmax": null
		},
		"722": {
			"tier": "LC",
			"bestTier": "NU",
			"bestName": "Decidueye",
			"mega": null,
			"gmax": null
		},
		"723": {
			"tier": "NFE",
			"bestTier": "NU",
			"bestName": "Decidueye",
			"mega": null,
			"gmax": null
		},
		"724": {
			"tier": "NU",
			"bestTier": "NU",
			"bestName": "Decidueye",
			"mega": null,
			"gmax": null
		},
		"725": {
			"tier": "LC",
			"bestTier": "NU",
			"bestName": "Incineroar",
			"mega": null,
			"gmax": null
		},
		"726": {
			"tier": "NFE",
			"bestTier": "NU",
			"bestName": "Incineroar",
			"mega": null,
			"gmax": null
		},
		"727": {
			"tier": "NU",
			"bestTier": "NU",
			"bestName": "Incineroar",
			"mega": null,
			"gmax": null
		},
		"728": {
			"tier": "LC",
			"bestTier": "OU",
			"bestName": "Primarina",
			"mega": null,
			"gmax": null
		},
		"729": {
			"tier": "NFE",
			"bestTier": "OU",
			"bestName": "Primarina",
			"mega": null,
			"gmax": null
		},
		"730": {
			"tier": "OU",
			"bestTier": "OU",
			"bestName": "Primarina",
			"mega": null,
			"gmax": null
		},
		"731": {
			"tier": "LC",
			"bestTier": "ZU",
			"bestName": "Toucannon",
			"mega": null,
			"gmax": null
		},
		"732": {
			"tier": "NFE",
			"bestTier": "ZU",
			"bestName": "Toucannon",
			"mega": null,
			"gmax": null
		},
		"733": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Toucannon",
			"mega": null,
			"gmax": null
		},
		"734": {
			"tier": "LC",
			"bestTier": "ZU",
			"bestName": "Gumshoos",
			"mega": null,
			"gmax": null
		},
		"735": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Gumshoos",
			"mega": null,
			"gmax": null
		},
		"736": {
			"tier": "LC",
			"bestTier": "ZU",
			"bestName": "Vikavolt",
			"mega": null,
			"gmax": null
		},
		"737": {
			"tier": "NFE",
			"bestTier": "ZU",
			"bestName": "Vikavolt",
			"mega": null,
			"gmax": null
		},
		"738": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Vikavolt",
			"mega": null,
			"gmax": null
		},
		"739": {
			"tier": "LC",
			"bestTier": "ZU",
			"bestName": "Crabominable",
			"mega": null,
			"gmax": null
		},
		"740": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Crabominable",
			"mega": null,
			"gmax": null
		},
		"741": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Oricorio",
			"mega": null,
			"gmax": null
		},
		"742": {
			"tier": "NFE",
			"bestTier": "RU",
			"bestName": "Ribombee",
			"mega": null,
			"gmax": null
		},
		"743": {
			"tier": "RU",
			"bestTier": "RU",
			"bestName": "Ribombee",
			"mega": null,
			"gmax": null
		},
		"744": {
			"tier": "LC",
			"bestTier": "ZU",
			"bestName": "Lycanroc-Midnight",
			"mega": null,
			"gmax": null
		},
		"745": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Lycanroc-Midnight",
			"mega": null,
			"gmax": null
		},
		"746": {
			"tier": "PU",
			"bestTier": "PU",
			"bestName": "Wishiwashi",
			"mega": null,
			"gmax": null
		},
		"747": {
			"tier": "LC",
			"bestTier": "UU",
			"bestName": "Toxapex",
			"mega": null,
			"gmax": null
		},
		"748": {
			"tier": "UU",
			"bestTier": "UU",
			"bestName": "Toxapex",
			"mega": null,
			"gmax": null
		},
		"749": {
			"tier": "LC",
			"bestTier": "PU",
			"bestName": "Mudsdale",
			"mega": null,
			"gmax": null
		},
		"750": {
			"tier": "PU",
			"bestTier": "PU",
			"bestName": "Mudsdale",
			"mega": null,
			"gmax": null
		},
		"751": {
			"tier": "LC",
			"bestTier": "OU",
			"bestName": "Araquanid",
			"mega": null,
			"gmax": null
		},
		"752": {
			"tier": "OU",
			"bestTier": "OU",
			"bestName": "Araquanid",
			"mega": null,
			"gmax": null
		},
		"753": {
			"tier": "LC",
			"bestTier": "ZU",
			"bestName": "Lurantis",
			"mega": null,
			"gmax": null
		},
		"754": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Lurantis",
			"mega": null,
			"gmax": null
		},
		"755": {
			"tier": "LC",
			"bestTier": "ZU",
			"bestName": "Shiinotic",
			"mega": null,
			"gmax": null
		},
		"756": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Shiinotic",
			"mega": null,
			"gmax": null
		},
		"757": {
			"tier": "LC",
			"bestTier": "PU",
			"bestName": "Salazzle",
			"mega": null,
			"gmax": null
		},
		"758": {
			"tier": "PU",
			"bestTier": "PU",
			"bestName": "Salazzle",
			"mega": null,
			"gmax": null
		},
		"759": {
			"tier": "LC",
			"bestTier": "NUBL",
			"bestName": "Bewear",
			"mega": null,
			"gmax": null
		},
		"760": {
			"tier": "NUBL",
			"bestTier": "NUBL",
			"bestName": "Bewear",
			"mega": null,
			"gmax": null
		},
		"761": {
			"tier": "LC",
			"bestTier": "NU",
			"bestName": "Tsareena",
			"mega": null,
			"gmax": null
		},
		"762": {
			"tier": "NFE",
			"bestTier": "NU",
			"bestName": "Tsareena",
			"mega": null,
			"gmax": null
		},
		"763": {
			"tier": "NU",
			"bestTier": "NU",
			"bestName": "Tsareena",
			"mega": null,
			"gmax": null
		},
		"764": {
			"tier": "UU",
			"bestTier": "UU",
			"bestName": "Comfey",
			"mega": null,
			"gmax": null
		},
		"765": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Oranguru",
			"mega": null,
			"gmax": null
		},
		"766": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Passimian",
			"mega": null,
			"gmax": null
		},
		"767": {
			"tier": "LC",
			"bestTier": "RU",
			"bestName": "Golisopod",
			"mega": null,
			"gmax": null
		},
		"768": {
			"tier": "RU",
			"bestTier": "RU",
			"bestName": "Golisopod",
			"mega": null,
			"gmax": null
		},
		"769": {
			"tier": "LC",
			"bestTier": "PU",
			"bestName": "Palossand",
			"mega": null,
			"gmax": null
		},
		"770": {
			"tier": "PU",
			"bestTier": "PU",
			"bestName": "Palossand",
			"mega": null,
			"gmax": null
		},
		"771": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Pyukumuku",
			"mega": null,
			"gmax": null
		},
		"772": {
			"tier": "NFE",
			"bestTier": "ZU",
			"bestName": "Silvally",
			"mega": null,
			"gmax": null
		},
		"773": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Silvally",
			"mega": null,
			"gmax": null
		},
		"774": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Minior",
			"mega": null,
			"gmax": null
		},
		"775": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Komala",
			"mega": null,
			"gmax": null
		},
		"776": {
			"tier": "ZUBL",
			"bestTier": "ZUBL",
			"bestName": "Turtonator",
			"mega": null,
			"gmax": null
		},
		"777": {
			"tier": "PU",
			"bestTier": "PU",
			"bestName": "Togedemaru",
			"mega": null,
			"gmax": null
		},
		"778": {
			"tier": "RU",
			"bestTier": "RU",
			"bestName": "Mimikyu",
			"mega": null,
			"gmax": null
		},
		"779": {
			"tier": "PU",
			"bestTier": "PU",
			"bestName": "Bruxish",
			"mega": null,
			"gmax": null
		},
		"780": {
			"tier": "PUBL",
			"bestTier": "PUBL",
			"bestName": "Drampa",
			"mega": null,
			"gmax": null
		},
		"781": {
			"tier": "NU",
			"bestTier": "NU",
			"bestName": "Dhelmise",
			"mega": null,
			"gmax": null
		},
		"782": {
			"tier": "LC",
			"bestTier": "UUBL",
			"bestName": "Kommo-o",
			"mega": null,
			"gmax": null
		},
		"783": {
			"tier": "NFE",
			"bestTier": "UUBL",
			"bestName": "Kommo-o",
			"mega": null,
			"gmax": null
		},
		"784": {
			"tier": "UUBL",
			"bestTier": "UUBL",
			"bestName": "Kommo-o",
			"mega": null,
			"gmax": null
		},
		"785": {
			"tier": "OU",
			"bestTier": "OU",
			"bestName": "Tapu Koko",
			"mega": null,
			"gmax": null
		},
		"786": {
			"tier": "OU",
			"bestTier": "OU",
			"bestName": "Tapu Lele",
			"mega": null,
			"gmax": null
		},
		"787": {
			"tier": "UU",
			"bestTier": "UU",
			"bestName": "Tapu Bulu",
			"mega": null,
			"gmax": null
		},
		"788": {
			"tier": "OU",
			"bestTier": "OU",
			"bestName": "Tapu Fini",
			"mega": null,
			"gmax": null
		},
		"789": {
			"tier": "LC",
			"bestTier": "Uber",
			"bestName": "Lunala",
			"mega": null,
			"gmax": null
		},
		"790": {
			"tier": "NFE",
			"bestTier": "Uber",
			"bestName": "Lunala",
			"mega": null,
			"gmax": null
		},
		"791": {
			"tier": "Uber",
			"bestTier": "Uber",
			"bestName": "Lunala",
			"mega": null,
			"gmax": null
		},
		"792": {
			"tier": "Uber",
			"bestTier": "Uber",
			"bestName": "Lunala",
			"mega": null,
			"gmax": null
		},
		"793": {
			"tier": "UU",
			"bestTier": "UU",
			"bestName": "Nihilego",
			"mega": null,
			"gmax": null
		},
		"794": {
			"tier": "OU",
			"bestTier": "OU",
			"bestName": "Buzzwole",
			"mega": null,
			"gmax": null
		},
		"795": {
			"tier": "Uber",
			"bestTier": "Uber",
			"bestName": "Pheromosa",
			"mega": null,
			"gmax": null
		},
		"796": {
			"tier": "RU",
			"bestTier": "RU",
			"bestName": "Xurkitree",
			"mega": null,
			"gmax": null
		},
		"797": {
			"tier": "UU",
			"bestTier": "UU",
			"bestName": "Celesteela",
			"mega": null,
			"gmax": null
		},
		"798": {
			"tier": "OU",
			"bestTier": "OU",
			"bestName": "Kartana",
			"mega": null,
			"gmax": null
		},
		"799": {
			"tier": "PUBL",
			"bestTier": "PUBL",
			"bestName": "Guzzlord",
			"mega": null,
			"gmax": null
		},
		"800": {
			"tier": "NUBL",
			"bestTier": "NUBL",
			"bestName": "Necrozma",
			"mega": null,
			"gmax": null
		},
		"801": {
			"tier": "Uber",
			"bestTier": "Uber",
			"bestName": "Magearna",
			"mega": null,
			"gmax": null
		},
		"802": {
			"tier": "Uber",
			"bestTier": "Uber",
			"bestName": "Marshadow",
			"mega": null,
			"gmax": null
		},
		"803": {
			"tier": "NFE",
			"bestTier": "Uber",
			"bestName": "Naganadel",
			"mega": null,
			"gmax": null
		},
		"804": {
			"tier": "Uber",
			"bestTier": "Uber",
			"bestName": "Naganadel",
			"mega": null,
			"gmax": null
		},
		"805": {
			"tier": "NU",
			"bestTier": "NU",
			"bestName": "Stakataka",
			"mega": null,
			"gmax": null
		},
		"806": {
			"tier": "OU",
			"bestTier": "OU",
			"bestName": "Blacephalon",
			"mega": null,
			"gmax": null
		},
		"807": {
			"tier": "OU",
			"bestTier": "OU",
			"bestName": "Zeraora",
			"mega": null,
			"gmax": null
		},
		"808": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Meltan",
			"mega": null,
			"gmax": null
		},
		"809": {
			"tier": "OU",
			"bestTier": "OU",
			"bestName": "Melmetal",
			"mega": null,
			"gmax": {
				"tier": "AG",
				"name": "Melmetal-Gmax"
			}
		},
		"810": {
			"tier": "LC",
			"bestTier": "UUBL",
			"bestName": "Rillaboom",
			"mega": null,
			"gmax": {
				"tier": "AG",
				"name": "Rillaboom-Gmax"
			}
		},
		"811": {
			"tier": "NFE",
			"bestTier": "UUBL",
			"bestName": "Rillaboom",
			"mega": null,
			"gmax": {
				"tier": "AG",
				"name": "Rillaboom-Gmax"
			}
		},
		"812": {
			"tier": "UUBL",
			"bestTier": "UUBL",
			"bestName": "Rillaboom",
			"mega": null,
			"gmax": {
				"tier": "AG",
				"name": "Rillaboom-Gmax"
			}
		},
		"813": {
			"tier": "LC",
			"bestTier": "OU",
			"bestName": "Cinderace",
			"mega": null,
			"gmax": {
				"tier": "AG",
				"name": "Cinderace-Gmax"
			}
		},
		"814": {
			"tier": "NFE",
			"bestTier": "OU",
			"bestName": "Cinderace",
			"mega": null,
			"gmax": {
				"tier": "AG",
				"name": "Cinderace-Gmax"
			}
		},
		"815": {
			"tier": "OU",
			"bestTier": "OU",
			"bestName": "Cinderace",
			"mega": null,
			"gmax": {
				"tier": "AG",
				"name": "Cinderace-Gmax"
			}
		},
		"816": {
			"tier": "LC",
			"bestTier": "NU",
			"bestName": "Inteleon",
			"mega": null,
			"gmax": {
				"tier": "AG",
				"name": "Inteleon-Gmax"
			}
		},
		"817": {
			"tier": "NFE",
			"bestTier": "NU",
			"bestName": "Inteleon",
			"mega": null,
			"gmax": {
				"tier": "AG",
				"name": "Inteleon-Gmax"
			}
		},
		"818": {
			"tier": "NU",
			"bestTier": "NU",
			"bestName": "Inteleon",
			"mega": null,
			"gmax": {
				"tier": "AG",
				"name": "Inteleon-Gmax"
			}
		},
		"819": {
			"tier": "LC",
			"bestTier": "ZU",
			"bestName": "Greedent",
			"mega": null,
			"gmax": null
		},
		"820": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Greedent",
			"mega": null,
			"gmax": null
		},
		"821": {
			"tier": "LC",
			"bestTier": "OU",
			"bestName": "Corviknight",
			"mega": null,
			"gmax": {
				"tier": "AG",
				"name": "Corviknight-Gmax"
			}
		},
		"822": {
			"tier": "NFE",
			"bestTier": "OU",
			"bestName": "Corviknight",
			"mega": null,
			"gmax": {
				"tier": "AG",
				"name": "Corviknight-Gmax"
			}
		},
		"823": {
			"tier": "OU",
			"bestTier": "OU",
			"bestName": "Corviknight",
			"mega": null,
			"gmax": {
				"tier": "AG",
				"name": "Corviknight-Gmax"
			}
		},
		"824": {
			"tier": "LC",
			"bestTier": "ZU",
			"bestName": "Orbeetle",
			"mega": null,
			"gmax": {
				"tier": "AG",
				"name": "Orbeetle-Gmax"
			}
		},
		"825": {
			"tier": "NFE",
			"bestTier": "ZU",
			"bestName": "Orbeetle",
			"mega": null,
			"gmax": {
				"tier": "AG",
				"name": "Orbeetle-Gmax"
			}
		},
		"826": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Orbeetle",
			"mega": null,
			"gmax": {
				"tier": "AG",
				"name": "Orbeetle-Gmax"
			}
		},
		"827": {
			"tier": "LC",
			"bestTier": "ZU",
			"bestName": "Thievul",
			"mega": null,
			"gmax": null
		},
		"828": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Thievul",
			"mega": null,
			"gmax": null
		},
		"829": {
			"tier": "LC",
			"bestTier": "PU",
			"bestName": "Eldegoss",
			"mega": null,
			"gmax": null
		},
		"830": {
			"tier": "PU",
			"bestTier": "PU",
			"bestName": "Eldegoss",
			"mega": null,
			"gmax": null
		},
		"831": {
			"tier": "LC",
			"bestTier": "ZU",
			"bestName": "Dubwool",
			"mega": null,
			"gmax": null
		},
		"832": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Dubwool",
			"mega": null,
			"gmax": null
		},
		"833": {
			"tier": "LC",
			"bestTier": "NU",
			"bestName": "Drednaw",
			"mega": null,
			"gmax": {
				"tier": "AG",
				"name": "Drednaw-Gmax"
			}
		},
		"834": {
			"tier": "NU",
			"bestTier": "NU",
			"bestName": "Drednaw",
			"mega": null,
			"gmax": {
				"tier": "AG",
				"name": "Drednaw-Gmax"
			}
		},
		"835": {
			"tier": "LC",
			"bestTier": "ZU",
			"bestName": "Boltund",
			"mega": null,
			"gmax": null
		},
		"836": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Boltund",
			"mega": null,
			"gmax": null
		},
		"837": {
			"tier": "LC",
			"bestTier": "PU",
			"bestName": "Coalossal",
			"mega": null,
			"gmax": {
				"tier": "AG",
				"name": "Coalossal-Gmax"
			}
		},
		"838": {
			"tier": "NFE",
			"bestTier": "PU",
			"bestName": "Coalossal",
			"mega": null,
			"gmax": {
				"tier": "AG",
				"name": "Coalossal-Gmax"
			}
		},
		"839": {
			"tier": "PU",
			"bestTier": "PU",
			"bestName": "Coalossal",
			"mega": null,
			"gmax": {
				"tier": "AG",
				"name": "Coalossal-Gmax"
			}
		},
		"840": {
			"tier": "LC",
			"bestTier": "UU",
			"bestName": "Hydrapple",
			"mega": null,
			"gmax": {
				"tier": "AG",
				"name": "Flapple-Gmax"
			}
		},
		"841": {
			"tier": "ZU",
			"bestTier": "UU",
			"bestName": "Hydrapple",
			"mega": null,
			"gmax": {
				"tier": "AG",
				"name": "Flapple-Gmax"
			}
		},
		"842": {
			"tier": "ZU",
			"bestTier": "UU",
			"bestName": "Hydrapple",
			"mega": null,
			"gmax": {
				"tier": "AG",
				"name": "Flapple-Gmax"
			}
		},
		"843": {
			"tier": "LC",
			"bestTier": "ZU",
			"bestName": "Sandaconda",
			"mega": null,
			"gmax": {
				"tier": "AG",
				"name": "Sandaconda-Gmax"
			}
		},
		"844": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Sandaconda",
			"mega": null,
			"gmax": {
				"tier": "AG",
				"name": "Sandaconda-Gmax"
			}
		},
		"845": {
			"tier": "PU",
			"bestTier": "PU",
			"bestName": "Cramorant",
			"mega": null,
			"gmax": null
		},
		"846": {
			"tier": "LC",
			"bestTier": "NU",
			"bestName": "Barraskewda",
			"mega": null,
			"gmax": null
		},
		"847": {
			"tier": "NU",
			"bestTier": "NU",
			"bestName": "Barraskewda",
			"mega": null,
			"gmax": null
		},
		"848": {
			"tier": "LC",
			"bestTier": "NU",
			"bestName": "Toxtricity-Low-Key",
			"mega": null,
			"gmax": {
				"tier": "AG",
				"name": "Toxtricity-Gmax"
			}
		},
		"849": {
			"tier": "NU",
			"bestTier": "NU",
			"bestName": "Toxtricity-Low-Key",
			"mega": null,
			"gmax": {
				"tier": "AG",
				"name": "Toxtricity-Gmax"
			}
		},
		"850": {
			"tier": "LC",
			"bestTier": "ZUBL",
			"bestName": "Centiskorch",
			"mega": null,
			"gmax": {
				"tier": "AG",
				"name": "Centiskorch-Gmax"
			}
		},
		"851": {
			"tier": "ZUBL",
			"bestTier": "ZUBL",
			"bestName": "Centiskorch",
			"mega": null,
			"gmax": {
				"tier": "AG",
				"name": "Centiskorch-Gmax"
			}
		},
		"852": {
			"tier": "LC",
			"bestTier": "ZU",
			"bestName": "Grapploct",
			"mega": null,
			"gmax": null
		},
		"853": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Grapploct",
			"mega": null,
			"gmax": null
		},
		"854": {
			"tier": "LC",
			"bestTier": "UUBL",
			"bestName": "Polteageist",
			"mega": null,
			"gmax": null
		},
		"855": {
			"tier": "UUBL",
			"bestTier": "UUBL",
			"bestName": "Polteageist",
			"mega": null,
			"gmax": null
		},
		"856": {
			"tier": "LC",
			"bestTier": "OU",
			"bestName": "Hatterene",
			"mega": null,
			"gmax": {
				"tier": "AG",
				"name": "Hatterene-Gmax"
			}
		},
		"857": {
			"tier": "ZU",
			"bestTier": "OU",
			"bestName": "Hatterene",
			"mega": null,
			"gmax": {
				"tier": "AG",
				"name": "Hatterene-Gmax"
			}
		},
		"858": {
			"tier": "OU",
			"bestTier": "OU",
			"bestName": "Hatterene",
			"mega": null,
			"gmax": {
				"tier": "AG",
				"name": "Hatterene-Gmax"
			}
		},
		"859": {
			"tier": "LC",
			"bestTier": "PU",
			"bestName": "Grimmsnarl",
			"mega": null,
			"gmax": {
				"tier": "AG",
				"name": "Grimmsnarl-Gmax"
			}
		},
		"860": {
			"tier": "NFE",
			"bestTier": "PU",
			"bestName": "Grimmsnarl",
			"mega": null,
			"gmax": {
				"tier": "AG",
				"name": "Grimmsnarl-Gmax"
			}
		},
		"861": {
			"tier": "PU",
			"bestTier": "PU",
			"bestName": "Grimmsnarl",
			"mega": null,
			"gmax": {
				"tier": "AG",
				"name": "Grimmsnarl-Gmax"
			}
		},
		"862": {
			"tier": "RUBL",
			"bestTier": "RUBL",
			"bestName": "Obstagoon",
			"mega": null,
			"gmax": null
		},
		"863": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Perrserker",
			"mega": null,
			"gmax": {
				"tier": "AG",
				"name": "Meowth-Gmax"
			}
		},
		"864": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Cursola",
			"mega": null,
			"gmax": null
		},
		"865": {
			"tier": "NUBL",
			"bestTier": "NUBL",
			"bestName": "Sirfetch’d",
			"mega": null,
			"gmax": null
		},
		"866": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Mr. Rime",
			"mega": null,
			"gmax": null
		},
		"867": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Runerigus",
			"mega": null,
			"gmax": null
		},
		"868": {
			"tier": "LC",
			"bestTier": "ZUBL",
			"bestName": "Alcremie",
			"mega": null,
			"gmax": {
				"tier": "AG",
				"name": "Alcremie-Gmax"
			}
		},
		"869": {
			"tier": "ZUBL",
			"bestTier": "ZUBL",
			"bestName": "Alcremie",
			"mega": null,
			"gmax": {
				"tier": "AG",
				"name": "Alcremie-Gmax"
			}
		},
		"870": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Falinks",
			"mega": null,
			"gmax": null
		},
		"871": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Pincurchin",
			"mega": null,
			"gmax": null
		},
		"872": {
			"tier": "LC",
			"bestTier": "PU",
			"bestName": "Frosmoth",
			"mega": null,
			"gmax": null
		},
		"873": {
			"tier": "PU",
			"bestTier": "PU",
			"bestName": "Frosmoth",
			"mega": null,
			"gmax": null
		},
		"874": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Stonjourner",
			"mega": null,
			"gmax": null
		},
		"875": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Eiscue",
			"mega": null,
			"gmax": null
		},
		"876": {
			"tier": "PUBL",
			"bestTier": "PUBL",
			"bestName": "Indeedee",
			"mega": null,
			"gmax": null
		},
		"877": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Morpeko",
			"mega": null,
			"gmax": null
		},
		"878": {
			"tier": "LC",
			"bestTier": "NU",
			"bestName": "Copperajah",
			"mega": null,
			"gmax": {
				"tier": "AG",
				"name": "Copperajah-Gmax"
			}
		},
		"879": {
			"tier": "NU",
			"bestTier": "NU",
			"bestName": "Copperajah",
			"mega": null,
			"gmax": {
				"tier": "AG",
				"name": "Copperajah-Gmax"
			}
		},
		"880": {
			"tier": "UUBL",
			"bestTier": "UUBL",
			"bestName": "Dracozolt",
			"mega": null,
			"gmax": null
		},
		"881": {
			"tier": "UUBL",
			"bestTier": "UUBL",
			"bestName": "Arctozolt",
			"mega": null,
			"gmax": null
		},
		"882": {
			"tier": "Uber",
			"bestTier": "Uber",
			"bestName": "Dracovish",
			"mega": null,
			"gmax": null
		},
		"883": {
			"tier": "ZUBL",
			"bestTier": "ZUBL",
			"bestName": "Arctovish",
			"mega": null,
			"gmax": null
		},
		"884": {
			"tier": "PU",
			"bestTier": "Uber",
			"bestName": "Archaludon",
			"mega": null,
			"gmax": {
				"tier": "AG",
				"name": "Duraludon-Gmax"
			}
		},
		"885": {
			"tier": "LC",
			"bestTier": "OU",
			"bestName": "Dragapult",
			"mega": null,
			"gmax": null
		},
		"886": {
			"tier": "NFE",
			"bestTier": "OU",
			"bestName": "Dragapult",
			"mega": null,
			"gmax": null
		},
		"887": {
			"tier": "OU",
			"bestTier": "OU",
			"bestName": "Dragapult",
			"mega": null,
			"gmax": null
		},
		"888": {
			"tier": "Uber",
			"bestTier": "Uber",
			"bestName": "Zacian",
			"mega": null,
			"gmax": null
		},
		"889": {
			"tier": "OU",
			"bestTier": "OU",
			"bestName": "Zamazenta",
			"mega": null,
			"gmax": null
		},
		"890": {
			"tier": "Uber",
			"bestTier": "Uber",
			"bestName": "Eternatus",
			"mega": null,
			"gmax": null
		},
		"891": {
			"tier": "NFE",
			"bestTier": "Uber",
			"bestName": "Urshifu-Rapid-Strike",
			"mega": null,
			"gmax": {
				"tier": "AG",
				"name": "Urshifu-Gmax"
			}
		},
		"892": {
			"tier": "Uber",
			"bestTier": "Uber",
			"bestName": "Urshifu-Rapid-Strike",
			"mega": null,
			"gmax": {
				"tier": "AG",
				"name": "Urshifu-Gmax"
			}
		},
		"893": {
			"tier": "UU",
			"bestTier": "UU",
			"bestName": "Zarude",
			"mega": null,
			"gmax": null
		},
		"894": {
			"tier": "Uber",
			"bestTier": "Uber",
			"bestName": "Regieleki",
			"mega": null,
			"gmax": null
		},
		"895": {
			"tier": "NUBL",
			"bestTier": "NUBL",
			"bestName": "Regidrago",
			"mega": null,
			"gmax": null
		},
		"896": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Glastrier",
			"mega": null,
			"gmax": null
		},
		"897": {
			"tier": "Uber",
			"bestTier": "Uber",
			"bestName": "Spectrier",
			"mega": null,
			"gmax": null
		},
		"898": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Calyrex",
			"mega": null,
			"gmax": null
		},
		"899": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Wyrdeer",
			"mega": null,
			"gmax": null
		},
		"900": {
			"tier": "RU",
			"bestTier": "OU",
			"bestName": "Scizor",
			"mega": {
				"tier": "OU",
				"name": "Scizor-Mega"
			},
			"gmax": null
		},
		"901": {
			"tier": "UUBL",
			"bestTier": "UUBL",
			"bestName": "Ursaluna",
			"mega": null,
			"gmax": null
		},
		"902": {
			"tier": "NU",
			"bestTier": "RU",
			"bestName": "Basculegion-F",
			"mega": null,
			"gmax": null
		},
		"903": {
			"tier": "Uber",
			"bestTier": "Uber",
			"bestName": "Sneasler",
			"mega": null,
			"gmax": null
		},
		"904": {
			"tier": "NU",
			"bestTier": "NU",
			"bestName": "Overqwil",
			"mega": null,
			"gmax": null
		},
		"905": {
			"tier": "OU",
			"bestTier": "OU",
			"bestName": "Enamorus",
			"mega": null,
			"gmax": null
		},
		"906": {
			"tier": "LC",
			"bestTier": "UUBL",
			"bestName": "Meowscarada",
			"mega": null,
			"gmax": null
		},
		"907": {
			"tier": "NFE",
			"bestTier": "UUBL",
			"bestName": "Meowscarada",
			"mega": null,
			"gmax": null
		},
		"908": {
			"tier": "UUBL",
			"bestTier": "UUBL",
			"bestName": "Meowscarada",
			"mega": null,
			"gmax": null
		},
		"909": {
			"tier": "LC",
			"bestTier": "UU",
			"bestName": "Skeledirge",
			"mega": null,
			"gmax": null
		},
		"910": {
			"tier": "NFE",
			"bestTier": "UU",
			"bestName": "Skeledirge",
			"mega": null,
			"gmax": null
		},
		"911": {
			"tier": "UU",
			"bestTier": "UU",
			"bestName": "Skeledirge",
			"mega": null,
			"gmax": null
		},
		"912": {
			"tier": "LC",
			"bestTier": "UUBL",
			"bestName": "Quaquaval",
			"mega": null,
			"gmax": null
		},
		"913": {
			"tier": "NFE",
			"bestTier": "UUBL",
			"bestName": "Quaquaval",
			"mega": null,
			"gmax": null
		},
		"914": {
			"tier": "UUBL",
			"bestTier": "UUBL",
			"bestName": "Quaquaval",
			"mega": null,
			"gmax": null
		},
		"915": {
			"tier": "LC",
			"bestTier": "ZU",
			"bestName": "Oinkologne-F",
			"mega": null,
			"gmax": null
		},
		"916": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Oinkologne-F",
			"mega": null,
			"gmax": null
		},
		"917": {
			"tier": "LC",
			"bestTier": "ZU",
			"bestName": "Spidops",
			"mega": null,
			"gmax": null
		},
		"918": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Spidops",
			"mega": null,
			"gmax": null
		},
		"919": {
			"tier": "LC",
			"bestTier": "UU",
			"bestName": "Lokix",
			"mega": null,
			"gmax": null
		},
		"920": {
			"tier": "UU",
			"bestTier": "UU",
			"bestName": "Lokix",
			"mega": null,
			"gmax": null
		},
		"921": {
			"tier": "LC",
			"bestTier": "PU",
			"bestName": "Pawmot",
			"mega": null,
			"gmax": null
		},
		"922": {
			"tier": "NFE",
			"bestTier": "PU",
			"bestName": "Pawmot",
			"mega": null,
			"gmax": null
		},
		"923": {
			"tier": "PU",
			"bestTier": "PU",
			"bestName": "Pawmot",
			"mega": null,
			"gmax": null
		},
		"924": {
			"tier": "LC",
			"bestTier": "RU",
			"bestName": "Maushold-Four",
			"mega": null,
			"gmax": null
		},
		"925": {
			"tier": "RU",
			"bestTier": "RU",
			"bestName": "Maushold-Four",
			"mega": null,
			"gmax": null
		},
		"926": {
			"tier": "LC",
			"bestTier": "ZU",
			"bestName": "Dachsbun",
			"mega": null,
			"gmax": null
		},
		"927": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Dachsbun",
			"mega": null,
			"gmax": null
		},
		"928": {
			"tier": "LC",
			"bestTier": "ZU",
			"bestName": "Arboliva",
			"mega": null,
			"gmax": null
		},
		"929": {
			"tier": "NFE",
			"bestTier": "ZU",
			"bestName": "Arboliva",
			"mega": null,
			"gmax": null
		},
		"930": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Arboliva",
			"mega": null,
			"gmax": null
		},
		"931": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Squawkabilly",
			"mega": null,
			"gmax": null
		},
		"932": {
			"tier": "LC",
			"bestTier": "OU",
			"bestName": "Garganacl",
			"mega": null,
			"gmax": null
		},
		"933": {
			"tier": "NFE",
			"bestTier": "OU",
			"bestName": "Garganacl",
			"mega": null,
			"gmax": null
		},
		"934": {
			"tier": "OU",
			"bestTier": "OU",
			"bestName": "Garganacl",
			"mega": null,
			"gmax": null
		},
		"935": {
			"tier": "LC",
			"bestTier": "OU",
			"bestName": "Ceruledge",
			"mega": null,
			"gmax": null
		},
		"936": {
			"tier": "RU",
			"bestTier": "OU",
			"bestName": "Ceruledge",
			"mega": null,
			"gmax": null
		},
		"937": {
			"tier": "OU",
			"bestTier": "OU",
			"bestName": "Ceruledge",
			"mega": null,
			"gmax": null
		},
		"938": {
			"tier": "LC",
			"bestTier": "NU",
			"bestName": "Bellibolt",
			"mega": null,
			"gmax": null
		},
		"939": {
			"tier": "NU",
			"bestTier": "NU",
			"bestName": "Bellibolt",
			"mega": null,
			"gmax": null
		},
		"940": {
			"tier": "LC",
			"bestTier": "NU",
			"bestName": "Kilowattrel",
			"mega": null,
			"gmax": null
		},
		"941": {
			"tier": "NU",
			"bestTier": "NU",
			"bestName": "Kilowattrel",
			"mega": null,
			"gmax": null
		},
		"942": {
			"tier": "LC",
			"bestTier": "ZU",
			"bestName": "Mabosstiff",
			"mega": null,
			"gmax": null
		},
		"943": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Mabosstiff",
			"mega": null,
			"gmax": null
		},
		"944": {
			"tier": "LC",
			"bestTier": "PU",
			"bestName": "Grafaiai",
			"mega": null,
			"gmax": null
		},
		"945": {
			"tier": "PU",
			"bestTier": "PU",
			"bestName": "Grafaiai",
			"mega": null,
			"gmax": null
		},
		"946": {
			"tier": "LC",
			"bestTier": "NU",
			"bestName": "Brambleghast",
			"mega": null,
			"gmax": null
		},
		"947": {
			"tier": "NU",
			"bestTier": "NU",
			"bestName": "Brambleghast",
			"mega": null,
			"gmax": null
		},
		"948": {
			"tier": "LC",
			"bestTier": "ZU",
			"bestName": "Toedscruel",
			"mega": null,
			"gmax": null
		},
		"949": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Toedscruel",
			"mega": null,
			"gmax": null
		},
		"950": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Klawf",
			"mega": null,
			"gmax": null
		},
		"951": {
			"tier": "LC",
			"bestTier": "ZU",
			"bestName": "Scovillain",
			"mega": null,
			"gmax": null
		},
		"952": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Scovillain",
			"mega": null,
			"gmax": null
		},
		"953": {
			"tier": "LC",
			"bestTier": "ZU",
			"bestName": "Rabsca",
			"mega": null,
			"gmax": null
		},
		"954": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Rabsca",
			"mega": null,
			"gmax": null
		},
		"955": {
			"tier": "NFE",
			"bestTier": "Uber",
			"bestName": "Espathra",
			"mega": null,
			"gmax": null
		},
		"956": {
			"tier": "Uber",
			"bestTier": "Uber",
			"bestName": "Espathra",
			"mega": null,
			"gmax": null
		},
		"957": {
			"tier": "LC",
			"bestTier": "UU",
			"bestName": "Tinkaton",
			"mega": null,
			"gmax": null
		},
		"958": {
			"tier": "NFE",
			"bestTier": "UU",
			"bestName": "Tinkaton",
			"mega": null,
			"gmax": null
		},
		"959": {
			"tier": "UU",
			"bestTier": "UU",
			"bestName": "Tinkaton",
			"mega": null,
			"gmax": null
		},
		"960": {
			"tier": "LC",
			"bestTier": "ZU",
			"bestName": "Wugtrio",
			"mega": null,
			"gmax": null
		},
		"961": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Wugtrio",
			"mega": null,
			"gmax": null
		},
		"962": {
			"tier": "PU",
			"bestTier": "PU",
			"bestName": "Bombirdier",
			"mega": null,
			"gmax": null
		},
		"963": {
			"tier": "LC",
			"bestTier": "Uber",
			"bestName": "Palafin",
			"mega": null,
			"gmax": null
		},
		"964": {
			"tier": "Uber",
			"bestTier": "Uber",
			"bestName": "Palafin",
			"mega": null,
			"gmax": null
		},
		"965": {
			"tier": "LC",
			"bestTier": "UU",
			"bestName": "Revavroom",
			"mega": null,
			"gmax": null
		},
		"966": {
			"tier": "UU",
			"bestTier": "UU",
			"bestName": "Revavroom",
			"mega": null,
			"gmax": null
		},
		"967": {
			"tier": "RU",
			"bestTier": "RU",
			"bestName": "Cyclizar",
			"mega": null,
			"gmax": null
		},
		"968": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Orthworm",
			"mega": null,
			"gmax": null
		},
		"969": {
			"tier": "LC",
			"bestTier": "OU",
			"bestName": "Glimmora",
			"mega": null,
			"gmax": null
		},
		"970": {
			"tier": "OU",
			"bestTier": "OU",
			"bestName": "Glimmora",
			"mega": null,
			"gmax": null
		},
		"971": {
			"tier": "LC",
			"bestTier": "PU",
			"bestName": "Houndstone",
			"mega": null,
			"gmax": null
		},
		"972": {
			"tier": "PU",
			"bestTier": "PU",
			"bestName": "Houndstone",
			"mega": null,
			"gmax": null
		},
		"973": {
			"tier": "NU",
			"bestTier": "NU",
			"bestName": "Flamigo",
			"mega": null,
			"gmax": null
		},
		"974": {
			"tier": "LC",
			"bestTier": "NUBL",
			"bestName": "Cetitan",
			"mega": null,
			"gmax": null
		},
		"975": {
			"tier": "NUBL",
			"bestTier": "NUBL",
			"bestName": "Cetitan",
			"mega": null,
			"gmax": null
		},
		"976": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Veluza",
			"mega": null,
			"gmax": null
		},
		"977": {
			"tier": "OU",
			"bestTier": "OU",
			"bestName": "Dondozo",
			"mega": null,
			"gmax": null
		},
		"978": {
			"tier": "PU",
			"bestTier": "PU",
			"bestName": "Tatsugiri",
			"mega": null,
			"gmax": null
		},
		"979": {
			"tier": "Uber",
			"bestTier": "Uber",
			"bestName": "Annihilape",
			"mega": null,
			"gmax": null
		},
		"980": {
			"tier": "UU",
			"bestTier": "UU",
			"bestName": "Clodsire",
			"mega": null,
			"gmax": null
		},
		"981": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Farigiraf",
			"mega": null,
			"gmax": null
		},
		"982": {
			"tier": "PU",
			"bestTier": "PU",
			"bestName": "Dudunsparce-Three-Segment",
			"mega": null,
			"gmax": null
		},
		"983": {
			"tier": "OU",
			"bestTier": "OU",
			"bestName": "Kingambit",
			"mega": null,
			"gmax": null
		},
		"984": {
			"tier": "OU",
			"bestTier": "OU",
			"bestName": "Great Tusk",
			"mega": null,
			"gmax": null
		},
		"985": {
			"tier": "NU",
			"bestTier": "NU",
			"bestName": "Scream Tail",
			"mega": null,
			"gmax": null
		},
		"986": {
			"tier": "PU",
			"bestTier": "PU",
			"bestName": "Brute Bonnet",
			"mega": null,
			"gmax": null
		},
		"987": {
			"tier": "Uber",
			"bestTier": "Uber",
			"bestName": "Flutter Mane",
			"mega": null,
			"gmax": null
		},
		"988": {
			"tier": "UU",
			"bestTier": "UU",
			"bestName": "Slither Wing",
			"mega": null,
			"gmax": null
		},
		"989": {
			"tier": "UU",
			"bestTier": "UU",
			"bestName": "Sandy Shocks",
			"mega": null,
			"gmax": null
		},
		"990": {
			"tier": "OU",
			"bestTier": "OU",
			"bestName": "Iron Treads",
			"mega": null,
			"gmax": null
		},
		"991": {
			"tier": "Uber",
			"bestTier": "Uber",
			"bestName": "Iron Bundle",
			"mega": null,
			"gmax": null
		},
		"992": {
			"tier": "UUBL",
			"bestTier": "UUBL",
			"bestName": "Iron Hands",
			"mega": null,
			"gmax": null
		},
		"993": {
			"tier": "UU",
			"bestTier": "UU",
			"bestName": "Iron Jugulis",
			"mega": null,
			"gmax": null
		},
		"994": {
			"tier": "OU",
			"bestTier": "OU",
			"bestName": "Iron Moth",
			"mega": null,
			"gmax": null
		},
		"995": {
			"tier": "NUBL",
			"bestTier": "NUBL",
			"bestName": "Iron Thorns",
			"mega": null,
			"gmax": null
		},
		"996": {
			"tier": "LC",
			"bestTier": "Uber",
			"bestName": "Baxcalibur",
			"mega": null,
			"gmax": null
		},
		"997": {
			"tier": "NFE",
			"bestTier": "Uber",
			"bestName": "Baxcalibur",
			"mega": null,
			"gmax": null
		},
		"998": {
			"tier": "Uber",
			"bestTier": "Uber",
			"bestName": "Baxcalibur",
			"mega": null,
			"gmax": null
		},
		"999": {
			"tier": "LC",
			"bestTier": "OU",
			"bestName": "Gholdengo",
			"mega": null,
			"gmax": null
		},
		"1000": {
			"tier": "OU",
			"bestTier": "OU",
			"bestName": "Gholdengo",
			"mega": null,
			"gmax": null
		},
		"1001": {
			"tier": "PU",
			"bestTier": "PU",
			"bestName": "Wo-Chien",
			"mega": null,
			"gmax": null
		},
		"1002": {
			"tier": "Uber",
			"bestTier": "Uber",
			"bestName": "Chien-Pao",
			"mega": null,
			"gmax": null
		},
		"1003": {
			"tier": "OU",
			"bestTier": "OU",
			"bestName": "Ting-Lu",
			"mega": null,
			"gmax": null
		},
		"1004": {
			"tier": "Uber",
			"bestTier": "Uber",
			"bestName": "Chi-Yu",
			"mega": null,
			"gmax": null
		},
		"1005": {
			"tier": "Uber",
			"bestTier": "Uber",
			"bestName": "Roaring Moon",
			"mega": null,
			"gmax": null
		},
		"1006": {
			"tier": "OU",
			"bestTier": "OU",
			"bestName": "Iron Valiant",
			"mega": null,
			"gmax": null
		},
		"1007": {
			"tier": "Uber",
			"bestTier": "Uber",
			"bestName": "Koraidon",
			"mega": null,
			"gmax": null
		},
		"1008": {
			"tier": "AG",
			"bestTier": "AG",
			"bestName": "Miraidon",
			"mega": null,
			"gmax": null
		},
		"1009": {
			"tier": "OU",
			"bestTier": "OU",
			"bestName": "Walking Wake",
			"mega": null,
			"gmax": null
		},
		"1010": {
			"tier": "RUBL",
			"bestTier": "RUBL",
			"bestName": "Iron Leaves",
			"mega": null,
			"gmax": null
		},
		"1011": {
			"tier": "ZU",
			"bestTier": "UU",
			"bestName": "Hydrapple",
			"mega": null,
			"gmax": {
				"tier": "AG",
				"name": "Flapple-Gmax"
			}
		},
		"1012": {
			"tier": "LC",
			"bestTier": "UU",
			"bestName": "Sinistcha",
			"mega": null,
			"gmax": null
		},
		"1013": {
			"tier": "UU",
			"bestTier": "UU",
			"bestName": "Sinistcha",
			"mega": null,
			"gmax": null
		},
		"1014": {
			"tier": "UUBL",
			"bestTier": "UUBL",
			"bestName": "Okidogi",
			"mega": null,
			"gmax": null
		},
		"1015": {
			"tier": "NU",
			"bestTier": "NU",
			"bestName": "Munkidori",
			"mega": null,
			"gmax": null
		},
		"1016": {
			"tier": "UU",
			"bestTier": "UU",
			"bestName": "Fezandipiti",
			"mega": null,
			"gmax": null
		},
		"1017": {
			"tier": "RUBL",
			"bestTier": "RUBL",
			"bestName": "Ogerpon",
			"mega": null,
			"gmax": null
		},
		"1018": {
			"tier": "Uber",
			"bestTier": "Uber",
			"bestName": "Archaludon",
			"mega": null,
			"gmax": {
				"tier": "AG",
				"name": "Duraludon-Gmax"
			}
		},
		"1019": {
			"tier": "UU",
			"bestTier": "UU",
			"bestName": "Hydrapple",
			"mega": null,
			"gmax": {
				"tier": "AG",
				"name": "Flapple-Gmax"
			}
		},
		"1020": {
			"tier": "Uber",
			"bestTier": "Uber",
			"bestName": "Gouging Fire",
			"mega": null,
			"gmax": null
		},
		"1021": {
			"tier": "OU",
			"bestTier": "OU",
			"bestName": "Raging Bolt",
			"mega": null,
			"gmax": null
		},
		"1022": {
			"tier": "UUBL",
			"bestTier": "UUBL",
			"bestName": "Iron Boulder",
			"mega": null,
			"gmax": null
		},
		"1023": {
			"tier": "OU",
			"bestTier": "OU",
			"bestName": "Iron Crown",
			"mega": null,
			"gmax": null
		},
		"1024": {
			"tier": "Uber",
			"bestTier": "Uber",
			"bestName": "Terapagos",
			"mega": null,
			"gmax": null
		},
		"1025": {
			"tier": "OU",
			"bestTier": "OU",
			"bestName": "Pecharunt",
			"mega": null,
			"gmax": null
		},
		"19:alola": {
			"tier": "LC",
			"bestTier": "ZUBL",
			"bestName": "Raticate-Alola",
			"mega": null,
			"gmax": null
		},
		"20:alola": {
			"tier": "ZUBL",
			"bestTier": "ZUBL",
			"bestName": "Raticate-Alola",
			"mega": null,
			"gmax": null
		},
		"25:alola": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Pikachu-Alola",
			"mega": null,
			"gmax": {
				"tier": "AG",
				"name": "Pikachu-Gmax"
			}
		},
		"26:alola": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Raichu-Alola",
			"mega": null,
			"gmax": {
				"tier": "AG",
				"name": "Pikachu-Gmax"
			}
		},
		"27:alola": {
			"tier": "LC",
			"bestTier": "PU",
			"bestName": "Sandslash-Alola",
			"mega": null,
			"gmax": null
		},
		"28:alola": {
			"tier": "PU",
			"bestTier": "PU",
			"bestName": "Sandslash-Alola",
			"mega": null,
			"gmax": null
		},
		"37:alola": {
			"tier": "NFE",
			"bestTier": "NU",
			"bestName": "Ninetales-Alola",
			"mega": null,
			"gmax": null
		},
		"38:alola": {
			"tier": "NU",
			"bestTier": "NU",
			"bestName": "Ninetales-Alola",
			"mega": null,
			"gmax": null
		},
		"50:alola": {
			"tier": "LC",
			"bestTier": "ZU",
			"bestName": "Dugtrio-Alola",
			"mega": null,
			"gmax": null
		},
		"51:alola": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Dugtrio-Alola",
			"mega": null,
			"gmax": null
		},
		"52:alola": {
			"tier": "LC",
			"bestTier": "ZU",
			"bestName": "Persian-Alola",
			"mega": null,
			"gmax": {
				"tier": "AG",
				"name": "Meowth-Gmax"
			}
		},
		"52:galar": {
			"tier": "LC",
			"bestTier": "ZU",
			"bestName": "Perrserker",
			"mega": null,
			"gmax": {
				"tier": "AG",
				"name": "Meowth-Gmax"
			}
		},
		"53:alola": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Persian-Alola",
			"mega": null,
			"gmax": {
				"tier": "AG",
				"name": "Meowth-Gmax"
			}
		},
		"58:hisui": {
			"tier": "LC",
			"bestTier": "UU",
			"bestName": "Arcanine-Hisui",
			"mega": null,
			"gmax": null
		},
		"59:hisui": {
			"tier": "UU",
			"bestTier": "UU",
			"bestName": "Arcanine-Hisui",
			"mega": null,
			"gmax": null
		},
		"74:alola": {
			"tier": "LC",
			"bestTier": "ZU",
			"bestName": "Golem-Alola",
			"mega": null,
			"gmax": null
		},
		"75:alola": {
			"tier": "NFE",
			"bestTier": "ZU",
			"bestName": "Golem-Alola",
			"mega": null,
			"gmax": null
		},
		"76:alola": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Golem-Alola",
			"mega": null,
			"gmax": null
		},
		"77:galar": {
			"tier": "LC",
			"bestTier": "ZU",
			"bestName": "Rapidash-Galar",
			"mega": null,
			"gmax": null
		},
		"78:galar": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Rapidash-Galar",
			"mega": null,
			"gmax": null
		},
		"79:galar": {
			"tier": "LC",
			"bestTier": "OU",
			"bestName": "Slowking-Galar",
			"mega": {
				"tier": "RUBL",
				"name": "Slowbro-Mega"
			},
			"gmax": null
		},
		"80:galar": {
			"tier": "PU",
			"bestTier": "OU",
			"bestName": "Slowking-Galar",
			"mega": {
				"tier": "RUBL",
				"name": "Slowbro-Mega"
			},
			"gmax": null
		},
		"83:galar": {
			"tier": "LC",
			"bestTier": "NUBL",
			"bestName": "Sirfetch’d",
			"mega": null,
			"gmax": null
		},
		"88:alola": {
			"tier": "LC",
			"bestTier": "RU",
			"bestName": "Muk-Alola",
			"mega": null,
			"gmax": null
		},
		"89:alola": {
			"tier": "RU",
			"bestTier": "RU",
			"bestName": "Muk-Alola",
			"mega": null,
			"gmax": null
		},
		"100:hisui": {
			"tier": "NFE",
			"bestTier": "ZUBL",
			"bestName": "Electrode-Hisui",
			"mega": null,
			"gmax": null
		},
		"101:hisui": {
			"tier": "ZUBL",
			"bestTier": "ZUBL",
			"bestName": "Electrode-Hisui",
			"mega": null,
			"gmax": null
		},
		"103:alola": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Exeggutor-Alola",
			"mega": null,
			"gmax": null
		},
		"105:alola": {
			"tier": "RU",
			"bestTier": "RU",
			"bestName": "Marowak-Alola",
			"mega": null,
			"gmax": null
		},
		"110:galar": {
			"tier": "OU",
			"bestTier": "OU",
			"bestName": "Weezing-Galar",
			"mega": null,
			"gmax": null
		},
		"122:galar": {
			"tier": "NFE",
			"bestTier": "ZU",
			"bestName": "Mr. Rime",
			"mega": null,
			"gmax": null
		},
		"128:paldea": {
			"tier": "NU",
			"bestTier": "NU",
			"bestName": "Tauros-Paldea-Aqua",
			"mega": null,
			"gmax": null
		},
		"144:galar": {
			"tier": "PU",
			"bestTier": "PU",
			"bestName": "Articuno-Galar",
			"mega": null,
			"gmax": null
		},
		"145:galar": {
			"tier": "RU",
			"bestTier": "RU",
			"bestName": "Zapdos-Galar",
			"mega": null,
			"gmax": null
		},
		"146:galar": {
			"tier": "UUBL",
			"bestTier": "UUBL",
			"bestName": "Moltres-Galar",
			"mega": null,
			"gmax": null
		},
		"157:hisui": {
			"tier": "PU",
			"bestTier": "PU",
			"bestName": "Typhlosion-Hisui",
			"mega": null,
			"gmax": null
		},
		"194:paldea": {
			"tier": "LC",
			"bestTier": "UU",
			"bestName": "Clodsire",
			"mega": null,
			"gmax": null
		},
		"199:galar": {
			"tier": "OU",
			"bestTier": "OU",
			"bestName": "Slowking-Galar",
			"mega": {
				"tier": "RUBL",
				"name": "Slowbro-Mega"
			},
			"gmax": null
		},
		"211:hisui": {
			"tier": "PU",
			"bestTier": "NU",
			"bestName": "Overqwil",
			"mega": null,
			"gmax": null
		},
		"215:hisui": {
			"tier": "ZU",
			"bestTier": "Uber",
			"bestName": "Sneasler",
			"mega": null,
			"gmax": null
		},
		"222:galar": {
			"tier": "NFE",
			"bestTier": "ZU",
			"bestName": "Cursola",
			"mega": null,
			"gmax": null
		},
		"263:galar": {
			"tier": "LC",
			"bestTier": "RUBL",
			"bestName": "Obstagoon",
			"mega": null,
			"gmax": null
		},
		"264:galar": {
			"tier": "NFE",
			"bestTier": "RUBL",
			"bestName": "Obstagoon",
			"mega": null,
			"gmax": null
		},
		"503:hisui": {
			"tier": "OU",
			"bestTier": "OU",
			"bestName": "Samurott-Hisui",
			"mega": null,
			"gmax": null
		},
		"549:hisui": {
			"tier": "NUBL",
			"bestTier": "NUBL",
			"bestName": "Lilligant-Hisui",
			"mega": null,
			"gmax": null
		},
		"554:galar": {
			"tier": "LC",
			"bestTier": "Uber",
			"bestName": "Darmanitan-Galar",
			"mega": null,
			"gmax": null
		},
		"555:galar": {
			"tier": "Uber",
			"bestTier": "Uber",
			"bestName": "Darmanitan-Galar",
			"mega": null,
			"gmax": null
		},
		"562:galar": {
			"tier": "LC",
			"bestTier": "ZU",
			"bestName": "Runerigus",
			"mega": null,
			"gmax": null
		},
		"570:hisui": {
			"tier": "LC",
			"bestTier": "RUBL",
			"bestName": "Zoroark-Hisui",
			"mega": null,
			"gmax": null
		},
		"571:hisui": {
			"tier": "RUBL",
			"bestTier": "RUBL",
			"bestName": "Zoroark-Hisui",
			"mega": null,
			"gmax": null
		},
		"618:galar": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Stunfisk-Galar",
			"mega": null,
			"gmax": null
		},
		"628:hisui": {
			"tier": "PU",
			"bestTier": "NU",
			"bestName": "Braviary",
			"mega": null,
			"gmax": null
		},
		"705:hisui": {
			"tier": "NFE",
			"bestTier": "RU",
			"bestName": "Goodra-Hisui",
			"mega": null,
			"gmax": null
		},
		"706:hisui": {
			"tier": "RU",
			"bestTier": "RU",
			"bestName": "Goodra-Hisui",
			"mega": null,
			"gmax": null
		},
		"713:hisui": {
			"tier": "PU",
			"bestTier": "NU",
			"bestName": "Avalugg",
			"mega": null,
			"gmax": null
		},
		"724:hisui": {
			"tier": "PU",
			"bestTier": "NU",
			"bestName": "Decidueye",
			"mega": null,
			"gmax": null
		}
	};
	function activeHandlerName(ui) {
		return ui.handlers[ui.mode]?.constructor.name ?? null;
	}
	function contextOf(scene) {
		return {
			scene,
			handlerName: activeHandlerName(scene.ui)
		};
	}
	var Overlay = class {
		surfaces;
		readContext;
		active = new Set();
		constructor(surfaces, readContext) {
			this.surfaces = surfaces;
			this.readContext = readContext;
		}
		tick() {
			const context = this.readContext();
			for (const surface of this.surfaces) if (surface.matches(context)) {
				this.active.add(surface);
				surface.sync(context);
			} else if (this.active.delete(surface)) surface.clear();
		}
		destroy() {
			for (const surface of this.active) surface.clear();
			this.active.clear();
		}
	};
	var BADGE_DEPTH = 1e3;
	var BACKGROUNDS = {
		AG: "#6d28d9",
		Uber: "#6d28d9",
		OU: "#b91c1c",
		UUBL: "#b91c1c",
		UU: "#b45309",
		RUBL: "#b45309",
		RU: "#b45309",
		NUBL: "#4d7c0f",
		NU: "#4d7c0f",
		PUBL: "#3f6212",
		PU: "#3f6212",
		ZUBL: "#44403c",
		ZU: "#44403c",
		NFE: "#44403c",
		LC: "#44403c"
	};
	var UNKNOWN_BACKGROUND = "#27272a";
	function backgroundFor(tier) {
		return tier === null ? UNKNOWN_BACKGROUND : BACKGROUNDS[tier];
	}
	function badgeStyle(tier) {
		return {
			fontFamily: "emerald",
			fontSize: "48px",
			color: "#ffffff",
			backgroundColor: backgroundFor(tier),
			padding: {
				x: 6,
				y: 3
			}
		};
	}
	var BadgeLayer = class {
		scene;
		badges = new Map();
		constructor(scene) {
			this.scene = scene;
		}
		get size() {
			return this.badges.size;
		}
		reconcile(specs) {
			const wanted = new Set(specs.map((spec) => spec.key));
			for (const [key, badge] of this.badges) if (!wanted.has(key)) this.destroy(key, badge);
			for (const spec of specs) {
				const existing = this.badges.get(spec.key);
				if (existing && existing.spec.parent !== spec.parent) this.destroy(spec.key, existing);
				const current = this.badges.get(spec.key);
				if (current) this.update(current, spec);
				else this.create(spec);
			}
		}
		clear() {
			for (const [key, badge] of this.badges) this.destroy(key, badge);
		}
		create(spec) {
			const object = this.scene.add.text(spec.offset.x, spec.offset.y, spec.text, badgeStyle(spec.tier)).setOrigin(.5, 1).setDepth(BADGE_DEPTH).setScale(spec.scale);
			spec.parent.add(object);
			this.badges.set(spec.key, {
				spec,
				object
			});
		}
		update(badge, spec) {
			const previous = badge.spec;
			if (previous.text !== spec.text || previous.tier !== spec.tier) badge.object.setText(spec.text).setStyle(badgeStyle(spec.tier));
			if (previous.offset.x !== spec.offset.x || previous.offset.y !== spec.offset.y) badge.object.setPosition(spec.offset.x, spec.offset.y);
			if (previous.scale !== spec.scale) badge.object.setScale(spec.scale);
			badge.spec = spec;
		}
		destroy(key, badge) {
			badge.spec.parent.remove(badge.object);
			badge.object.destroy();
			this.badges.delete(key);
		}
	};
	function keyFor(speciesId, formKey) {
		return formKey ? `${speciesId}:${formKey}` : `${speciesId}`;
	}
	function formKeyOf(species, formIndex) {
		return species.forms?.[formIndex]?.formKey ?? "";
	}
	var NATIONAL_DEX_MAX = 1025;
	var FORM_ID_BASE = 1e3;
	var REGION_BY_PREFIX = {
		2: "alola",
		4: "galar",
		6: "hisui",
		8: "paldea"
	};
	function speciesRefOf(speciesId, formKey) {
		if (speciesId <= NATIONAL_DEX_MAX) return {
			speciesId,
			formKey
		};
		const prefix = Math.floor(speciesId / FORM_ID_BASE);
		return {
			speciesId: speciesId % FORM_ID_BASE,
			formKey: REGION_BY_PREFIX[prefix] ?? ""
		};
	}
	var BADGE_OFFSET$1 = {
		x: 0,
		y: -30
	};
	var BADGE_SCALE$1 = .16;
	function targetFor$1(pokemon, index) {
		const primary = speciesRefOf(pokemon.species.speciesId, formKeyOf(pokemon.species, pokemon.formIndex));
		const fusionSpecies = pokemon.fusionSpecies;
		const fusion = fusionSpecies ? speciesRefOf(fusionSpecies.speciesId, formKeyOf(fusionSpecies, pokemon.fusionFormIndex)) : null;
		const name = fusionSpecies ? `${pokemon.species.name}/${fusionSpecies.name}` : pokemon.species.name;
		return {
			key: `battle:${index}:${keyFor(primary.speciesId, primary.formKey)}`,
			name,
			primary,
			fusion,
			parent: pokemon,
			offset: BADGE_OFFSET$1,
			scale: BADGE_SCALE$1
		};
	}
	function readBattleTargets(scene) {
		if (!scene.currentBattle) return [];
		return scene.getEnemyField().map(targetFor$1);
	}
	var RANK = new Map([
		"AG",
		"Uber",
		"OU",
		"UUBL",
		"UU",
		"RUBL",
		"RU",
		"NUBL",
		"NU",
		"PUBL",
		"PU",
		"ZUBL",
		"ZU",
		"NFE",
		"LC"
	].map((tier, index) => [tier, index]));
	var UNRANKED = Number.MAX_SAFE_INTEGER;
	var rankOf = (tier) => tier === null ? UNRANKED : RANK.get(tier) ?? UNRANKED;
	function compareTier(a, b) {
		return rankOf(a) - rankOf(b);
	}
	function bestReachable(entry) {
		let best = {
			tier: entry.bestTier,
			name: entry.bestName,
			source: "line"
		};
		for (const [source, form] of [["mega", entry.mega], ["gmax", entry.gmax]]) {
			if (!form) continue;
			if (best.tier !== null && compareTier(best.tier, form.tier) <= 0) continue;
			best = {
				tier: form.tier,
				name: form.name,
				source
			};
		}
		return best;
	}
	var UNKNOWN = "?";
	var MARKER = {
		line: "",
		mega: "+M",
		gmax: "+G"
	};
	function shortLabel(resolved) {
		const reachable = bestReachable(resolved);
		if (!reachable.tier) return UNKNOWN;
		return `${reachable.tier}${MARKER[reachable.source]}`;
	}
	function fullLabel(resolved) {
		const reachable = bestReachable(resolved);
		if (!reachable.tier) return UNKNOWN;
		const current = resolved.tier ?? UNKNOWN;
		if (current === reachable.tier && reachable.source === "line") return reachable.tier;
		const via = reachable.name ? ` (${reachable.name})` : "";
		return `${current} \u2192 ${reachable.tier}${via}`;
	}
	var EMPTY = {
		tier: null,
		bestTier: null,
		bestName: null,
		mega: null,
		gmax: null
	};
	function lookup(table, ref) {
		return table[keyFor(ref.speciesId, ref.formKey)] ?? table[keyFor(ref.speciesId, "")] ?? null;
	}
	function resolveTiers(table, primary, fusion) {
		const first = lookup(table, primary);
		const second = fusion ? lookup(table, fusion) : null;
		if (!first && !second) return EMPTY;
		if (!first) return toResolved(second);
		if (!second) return toResolved(first);
		return compareTier(second.bestTier, first.bestTier) < 0 ? toResolved(second) : toResolved(first);
	}
	function toResolved(entry) {
		if (!entry) return EMPTY;
		return {
			tier: entry.tier,
			bestTier: entry.bestTier,
			bestName: entry.bestName,
			mega: entry.mega,
			gmax: entry.gmax
		};
	}
	function badgeSpecsFor(targets, table, label) {
		return targets.map((target) => {
			const resolved = resolveTiers(table, target.primary, target.fusion);
			return {
				key: target.key,
				text: label(resolved),
				tier: resolved.bestTier,
				parent: target.parent,
				offset: target.offset,
				scale: target.scale
			};
		});
	}
	var BattleSurface = class {
		layer;
		table;
		name = "battle";
		constructor(layer, table) {
			this.layer = layer;
			this.table = table;
		}
		matches(context) {
			return context.scene.currentBattle !== null;
		}
		sync(context) {
			const targets = readBattleTargets(context.scene);
			this.layer.reconcile(badgeSpecsFor(targets, this.table, fullLabel));
		}
		clear() {
			this.layer.clear();
		}
	};
	var BADGE_OFFSET = {
		x: 8,
		y: 15
	};
	var BADGE_SCALE = .085;
	function targetFor(container) {
		const primary = speciesRefOf(container.species.speciesId, "");
		return {
			key: `starter:${keyFor(primary.speciesId, primary.formKey)}`,
			name: container.species.name,
			primary,
			fusion: null,
			parent: container,
			offset: BADGE_OFFSET,
			scale: BADGE_SCALE
		};
	}
	function readStarterTargets(handler) {
		return handler.starterContainers.filter((container) => container.visible).map(targetFor);
	}
	var STARTER_SELECT_HANDLER = "StarterSelectUiHandler";
	function handlerOf(context) {
		const ui = context.scene.ui;
		const handler = ui.handlers[ui.mode];
		return handler?.starterContainers ? handler : null;
	}
	var StarterSurface = class {
		layer;
		table;
		name = "starter-select";
		constructor(layer, table) {
			this.layer = layer;
			this.table = table;
		}
		matches(context) {
			return context.handlerName === STARTER_SELECT_HANDLER;
		}
		sync(context) {
			const handler = handlerOf(context);
			if (!handler) return;
			this.layer.reconcile(badgeSpecsFor(readStarterTargets(handler), this.table, shortLabel));
		}
		clear() {
			this.layer.clear();
		}
	};
	function overlayFor(scene, table) {
		return new Overlay([new BattleSurface(new BadgeLayer(scene), table), new StarterSurface(new BadgeLayer(scene), table)], () => contextOf(scene));
	}
	function battleSceneOf(game) {
		return game.scene.getScene("battle") ?? null;
	}
	function startOverlay(game, table) {
		let overlay = null;
		return {
			get started() {
				return overlay !== null;
			},
			tick() {
				const scene = battleSceneOf(game);
				if (!scene) return;
				overlay ??= overlayFor(scene, table);
				overlay.tick();
			},
			destroy() {
				overlay?.destroy();
				overlay = null;
			}
		};
	}
	function patchSceneSystemsStep(namespace, capture) {
		const systems = namespace.Scenes.Systems.prototype;
		const original = systems.step;
		systems.step = function step(...args) {
			systems.step = original;
			capture({
				game: this.game,
				strategy: "patchSceneSystemsStep"
			});
			return original.apply(this, args);
		};
	}
	function patchGameBoot(namespace, capture) {
		const games = namespace.Game.prototype;
		const original = games.boot;
		games.boot = function boot(...args) {
			games.boot = original;
			capture({
				game: this,
				strategy: "interceptPhaserAssignment"
			});
			return original.apply(this, args);
		};
	}
	function interceptPhaserAssignment(host, capture) {
		let namespace;
		Object.defineProperty(host, "Phaser", {
			configurable: true,
			get: () => namespace,
			set(value) {
				namespace = value;
				patchGameBoot(value, capture);
			}
		});
	}
	function armCapture(host, onCaptured) {
		let done = false;
		const capture = (result) => {
			if (done) return;
			done = true;
			onCaptured(result);
		};
		if (host.Phaser) {
			patchSceneSystemsStep(host.Phaser, capture);
			return ["patchSceneSystemsStep"];
		}
		interceptPhaserAssignment(host, capture);
		return ["interceptPhaserAssignment"];
	}
	var STYLE = [
		"position:fixed",
		"top:8px",
		"left:8px",
		"z-index:2147483647",
		"pointer-events:none",
		"padding:6px 10px",
		"border-radius:4px",
		"background:#b91c1c",
		"color:#fff",
		"font:600 13px/1.4 ui-monospace,SFMono-Regular,Menlo,monospace"
	].join(";");
	function reportFailure(message) {
		const banner = document.createElement("div");
		banner.style.cssText = STYLE;
		banner.textContent = message;
		document.body.appendChild(banner);
	}
	var TICK_INTERVAL_MS = 400;
	var CAPTURE_TIMEOUT_MS = 2e4;
	var armed = armCapture(window, ({ game }) => {
		window.clearTimeout(timeout);
		const runner = startOverlay(game, TIER_TABLE);
		window.setInterval(() => runner.tick(), TICK_INTERVAL_MS);
	});
	var timeout = window.setTimeout(() => {
		reportFailure(`tier overlay: nao capturou o jogo (${armed.join(", ")})`);
	}, CAPTURE_TIMEOUT_MS);
})();
