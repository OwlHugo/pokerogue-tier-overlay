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
			"bestName": "Venusaur"
		},
		"2": {
			"tier": "NFE",
			"bestTier": "PU",
			"bestName": "Venusaur"
		},
		"3": {
			"tier": "PU",
			"bestTier": "PU",
			"bestName": "Venusaur"
		},
		"4": {
			"tier": "LC",
			"bestTier": "ZU",
			"bestName": "Charizard"
		},
		"5": {
			"tier": "NFE",
			"bestTier": "ZU",
			"bestName": "Charizard"
		},
		"6": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Charizard"
		},
		"7": {
			"tier": "LC",
			"bestTier": "RUBL",
			"bestName": "Blastoise"
		},
		"8": {
			"tier": "NFE",
			"bestTier": "RUBL",
			"bestName": "Blastoise"
		},
		"9": {
			"tier": "RUBL",
			"bestTier": "RUBL",
			"bestName": "Blastoise"
		},
		"10": {
			"tier": "LC",
			"bestTier": "ZU",
			"bestName": "Butterfree"
		},
		"11": {
			"tier": "NFE",
			"bestTier": "ZU",
			"bestName": "Butterfree"
		},
		"12": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Butterfree"
		},
		"13": {
			"tier": "LC",
			"bestTier": "ZU",
			"bestName": "Beedrill"
		},
		"14": {
			"tier": "NFE",
			"bestTier": "ZU",
			"bestName": "Beedrill"
		},
		"15": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Beedrill"
		},
		"16": {
			"tier": "LC",
			"bestTier": "ZU",
			"bestName": "Pidgeot"
		},
		"17": {
			"tier": "NFE",
			"bestTier": "ZU",
			"bestName": "Pidgeot"
		},
		"18": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Pidgeot"
		},
		"19": {
			"tier": "LC",
			"bestTier": "ZU",
			"bestName": "Raticate"
		},
		"20": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Raticate"
		},
		"21": {
			"tier": "LC",
			"bestTier": "ZU",
			"bestName": "Fearow"
		},
		"22": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Fearow"
		},
		"23": {
			"tier": "LC",
			"bestTier": "ZU",
			"bestName": "Arbok"
		},
		"24": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Arbok"
		},
		"25": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Raichu-Alola"
		},
		"26": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Raichu-Alola"
		},
		"27": {
			"tier": "LC",
			"bestTier": "ZU",
			"bestName": "Sandslash"
		},
		"28": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Sandslash"
		},
		"29": {
			"tier": "LC",
			"bestTier": "RU",
			"bestName": "Nidoqueen"
		},
		"30": {
			"tier": "NFE",
			"bestTier": "RU",
			"bestName": "Nidoqueen"
		},
		"31": {
			"tier": "RU",
			"bestTier": "RU",
			"bestName": "Nidoqueen"
		},
		"32": {
			"tier": "LC",
			"bestTier": "UU",
			"bestName": "Nidoking"
		},
		"33": {
			"tier": "NFE",
			"bestTier": "UU",
			"bestName": "Nidoking"
		},
		"34": {
			"tier": "UU",
			"bestTier": "UU",
			"bestName": "Nidoking"
		},
		"35": {
			"tier": "NFE",
			"bestTier": "OU",
			"bestName": "Clefable"
		},
		"36": {
			"tier": "OU",
			"bestTier": "OU",
			"bestName": "Clefable"
		},
		"37": {
			"tier": "NFE",
			"bestTier": "ZU",
			"bestName": "Ninetales"
		},
		"38": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Ninetales"
		},
		"39": {
			"tier": "NFE",
			"bestTier": "ZU",
			"bestName": "Wigglytuff"
		},
		"40": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Wigglytuff"
		},
		"41": {
			"tier": "LC",
			"bestTier": "RU",
			"bestName": "Crobat"
		},
		"42": {
			"tier": "NFE",
			"bestTier": "RU",
			"bestName": "Crobat"
		},
		"43": {
			"tier": "LC",
			"bestTier": "NU",
			"bestName": "Vileplume"
		},
		"44": {
			"tier": "NFE",
			"bestTier": "NU",
			"bestName": "Vileplume"
		},
		"45": {
			"tier": "NU",
			"bestTier": "NU",
			"bestName": "Vileplume"
		},
		"46": {
			"tier": "LC",
			"bestTier": "ZU",
			"bestName": "Parasect"
		},
		"47": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Parasect"
		},
		"48": {
			"tier": "LC",
			"bestTier": "ZUBL",
			"bestName": "Venomoth"
		},
		"49": {
			"tier": "ZUBL",
			"bestTier": "ZUBL",
			"bestName": "Venomoth"
		},
		"50": {
			"tier": "NFE",
			"bestTier": "ZU",
			"bestName": "Dugtrio"
		},
		"51": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Dugtrio"
		},
		"52": {
			"tier": "LC",
			"bestTier": "ZU",
			"bestName": "Persian"
		},
		"53": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Persian"
		},
		"54": {
			"tier": "LC",
			"bestTier": "ZU",
			"bestName": "Golduck"
		},
		"55": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Golduck"
		},
		"56": {
			"tier": "LC",
			"bestTier": "Uber",
			"bestName": "Annihilape"
		},
		"57": {
			"tier": "ZU",
			"bestTier": "Uber",
			"bestName": "Annihilape"
		},
		"58": {
			"tier": "LC",
			"bestTier": "PU",
			"bestName": "Arcanine"
		},
		"59": {
			"tier": "PU",
			"bestTier": "PU",
			"bestName": "Arcanine"
		},
		"60": {
			"tier": "LC",
			"bestTier": "NUBL",
			"bestName": "Politoed"
		},
		"61": {
			"tier": "NFE",
			"bestTier": "NUBL",
			"bestName": "Politoed"
		},
		"62": {
			"tier": "ZU",
			"bestTier": "NUBL",
			"bestName": "Politoed"
		},
		"63": {
			"tier": "LC",
			"bestTier": "UUBL",
			"bestName": "Alakazam"
		},
		"64": {
			"tier": "NFE",
			"bestTier": "UUBL",
			"bestName": "Alakazam"
		},
		"65": {
			"tier": "UUBL",
			"bestTier": "UUBL",
			"bestName": "Alakazam"
		},
		"66": {
			"tier": "LC",
			"bestTier": "NUBL",
			"bestName": "Machamp"
		},
		"67": {
			"tier": "NFE",
			"bestTier": "NUBL",
			"bestName": "Machamp"
		},
		"68": {
			"tier": "NUBL",
			"bestTier": "NUBL",
			"bestName": "Machamp"
		},
		"69": {
			"tier": "LC",
			"bestTier": "ZU",
			"bestName": "Victreebel"
		},
		"70": {
			"tier": "NFE",
			"bestTier": "ZU",
			"bestName": "Victreebel"
		},
		"71": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Victreebel"
		},
		"72": {
			"tier": "LC",
			"bestTier": "NU",
			"bestName": "Tentacruel"
		},
		"73": {
			"tier": "NU",
			"bestTier": "NU",
			"bestName": "Tentacruel"
		},
		"74": {
			"tier": "LC",
			"bestTier": "ZU",
			"bestName": "Golem"
		},
		"75": {
			"tier": "NFE",
			"bestTier": "ZU",
			"bestName": "Golem"
		},
		"76": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Golem"
		},
		"77": {
			"tier": "LC",
			"bestTier": "ZU",
			"bestName": "Rapidash"
		},
		"78": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Rapidash"
		},
		"79": {
			"tier": "LC",
			"bestTier": "UU",
			"bestName": "Slowking"
		},
		"80": {
			"tier": "RU",
			"bestTier": "UU",
			"bestName": "Slowking"
		},
		"81": {
			"tier": "LC",
			"bestTier": "RU",
			"bestName": "Magnezone"
		},
		"82": {
			"tier": "ZU",
			"bestTier": "RU",
			"bestName": "Magnezone"
		},
		"83": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Farfetch’d"
		},
		"84": {
			"tier": "LC",
			"bestTier": "ZU",
			"bestName": "Dodrio"
		},
		"85": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Dodrio"
		},
		"86": {
			"tier": "LC",
			"bestTier": "ZU",
			"bestName": "Dewgong"
		},
		"87": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Dewgong"
		},
		"88": {
			"tier": "LC",
			"bestTier": "ZU",
			"bestName": "Muk"
		},
		"89": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Muk"
		},
		"90": {
			"tier": "LC",
			"bestTier": "NUBL",
			"bestName": "Cloyster"
		},
		"91": {
			"tier": "NUBL",
			"bestTier": "NUBL",
			"bestName": "Cloyster"
		},
		"92": {
			"tier": "NFE",
			"bestTier": "RU",
			"bestName": "Gengar"
		},
		"93": {
			"tier": "NFE",
			"bestTier": "RU",
			"bestName": "Gengar"
		},
		"94": {
			"tier": "RU",
			"bestTier": "RU",
			"bestName": "Gengar"
		},
		"95": {
			"tier": "LC",
			"bestTier": "RU",
			"bestName": "Steelix"
		},
		"96": {
			"tier": "LC",
			"bestTier": "ZU",
			"bestName": "Hypno"
		},
		"97": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Hypno"
		},
		"98": {
			"tier": "LC",
			"bestTier": "PUBL",
			"bestName": "Kingler"
		},
		"99": {
			"tier": "PUBL",
			"bestTier": "PUBL",
			"bestName": "Kingler"
		},
		"100": {
			"tier": "LC",
			"bestTier": "ZU",
			"bestName": "Electrode"
		},
		"101": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Electrode"
		},
		"102": {
			"tier": "LC",
			"bestTier": "ZU",
			"bestName": "Exeggutor-Alola"
		},
		"103": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Exeggutor-Alola"
		},
		"104": {
			"tier": "LC",
			"bestTier": "RU",
			"bestName": "Marowak-Alola"
		},
		"105": {
			"tier": "ZU",
			"bestTier": "RU",
			"bestName": "Marowak-Alola"
		},
		"106": {
			"tier": "PU",
			"bestTier": "PU",
			"bestName": "Hitmonlee"
		},
		"107": {
			"tier": "ZU",
			"bestTier": "PU",
			"bestName": "Hitmonlee"
		},
		"108": {
			"tier": "LC",
			"bestTier": "ZU",
			"bestName": "Lickilicky"
		},
		"109": {
			"tier": "LC",
			"bestTier": "OU",
			"bestName": "Weezing-Galar"
		},
		"110": {
			"tier": "ZU",
			"bestTier": "OU",
			"bestName": "Weezing-Galar"
		},
		"111": {
			"tier": "LC",
			"bestTier": "NU",
			"bestName": "Rhyperior"
		},
		"112": {
			"tier": "PU",
			"bestTier": "NU",
			"bestName": "Rhyperior"
		},
		"113": {
			"tier": "RU",
			"bestTier": "RU",
			"bestName": "Blissey"
		},
		"114": {
			"tier": "NFE",
			"bestTier": "UU",
			"bestName": "Tangrowth"
		},
		"115": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Kangaskhan"
		},
		"116": {
			"tier": "LC",
			"bestTier": "ZUBL",
			"bestName": "Kingdra"
		},
		"117": {
			"tier": "NFE",
			"bestTier": "ZUBL",
			"bestName": "Kingdra"
		},
		"118": {
			"tier": "LC",
			"bestTier": "ZU",
			"bestName": "Seaking"
		},
		"119": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Seaking"
		},
		"120": {
			"tier": "LC",
			"bestTier": "NU",
			"bestName": "Starmie"
		},
		"121": {
			"tier": "NU",
			"bestTier": "NU",
			"bestName": "Starmie"
		},
		"122": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Mr. Rime"
		},
		"123": {
			"tier": "NU",
			"bestTier": "OU",
			"bestName": "Scizor"
		},
		"124": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Jynx"
		},
		"125": {
			"tier": "NFE",
			"bestTier": "ZU",
			"bestName": "Electivire"
		},
		"126": {
			"tier": "NFE",
			"bestTier": "ZU",
			"bestName": "Magmortar"
		},
		"127": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Pinsir"
		},
		"128": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Tauros"
		},
		"129": {
			"tier": "LC",
			"bestTier": "RU",
			"bestName": "Gyarados"
		},
		"130": {
			"tier": "RU",
			"bestTier": "RU",
			"bestName": "Gyarados"
		},
		"131": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Lapras"
		},
		"132": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Ditto"
		},
		"133": {
			"tier": "LC",
			"bestTier": "RU",
			"bestName": "Umbreon"
		},
		"134": {
			"tier": "NU",
			"bestTier": "RU",
			"bestName": "Umbreon"
		},
		"135": {
			"tier": "ZU",
			"bestTier": "RU",
			"bestName": "Umbreon"
		},
		"136": {
			"tier": "ZU",
			"bestTier": "RU",
			"bestName": "Umbreon"
		},
		"137": {
			"tier": "NFE",
			"bestTier": "NUBL",
			"bestName": "Porygon-Z"
		},
		"138": {
			"tier": "LC",
			"bestTier": "PUBL",
			"bestName": "Omastar"
		},
		"139": {
			"tier": "PUBL",
			"bestTier": "PUBL",
			"bestName": "Omastar"
		},
		"140": {
			"tier": "LC",
			"bestTier": "ZU",
			"bestName": "Kabutops"
		},
		"141": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Kabutops"
		},
		"142": {
			"tier": "NU",
			"bestTier": "NU",
			"bestName": "Aerodactyl"
		},
		"143": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Snorlax"
		},
		"144": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Articuno"
		},
		"145": {
			"tier": "OU",
			"bestTier": "OU",
			"bestName": "Zapdos"
		},
		"146": {
			"tier": "OU",
			"bestTier": "OU",
			"bestName": "Moltres"
		},
		"147": {
			"tier": "LC",
			"bestTier": "OU",
			"bestName": "Dragonite"
		},
		"148": {
			"tier": "NFE",
			"bestTier": "OU",
			"bestName": "Dragonite"
		},
		"149": {
			"tier": "OU",
			"bestTier": "OU",
			"bestName": "Dragonite"
		},
		"150": {
			"tier": "Uber",
			"bestTier": "Uber",
			"bestName": "Mewtwo"
		},
		"151": {
			"tier": "RU",
			"bestTier": "RU",
			"bestName": "Mew"
		},
		"152": {
			"tier": "LC",
			"bestTier": "ZU",
			"bestName": "Meganium"
		},
		"153": {
			"tier": "NFE",
			"bestTier": "ZU",
			"bestName": "Meganium"
		},
		"154": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Meganium"
		},
		"155": {
			"tier": "LC",
			"bestTier": "PU",
			"bestName": "Typhlosion-Hisui"
		},
		"156": {
			"tier": "NFE",
			"bestTier": "PU",
			"bestName": "Typhlosion-Hisui"
		},
		"157": {
			"tier": "ZU",
			"bestTier": "PU",
			"bestName": "Typhlosion-Hisui"
		},
		"158": {
			"tier": "LC",
			"bestTier": "NUBL",
			"bestName": "Feraligatr"
		},
		"159": {
			"tier": "NFE",
			"bestTier": "NUBL",
			"bestName": "Feraligatr"
		},
		"160": {
			"tier": "NUBL",
			"bestTier": "NUBL",
			"bestName": "Feraligatr"
		},
		"161": {
			"tier": "LC",
			"bestTier": "ZU",
			"bestName": "Furret"
		},
		"162": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Furret"
		},
		"163": {
			"tier": "LC",
			"bestTier": "ZU",
			"bestName": "Noctowl"
		},
		"164": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Noctowl"
		},
		"165": {
			"tier": "LC",
			"bestTier": "ZU",
			"bestName": "Ledian"
		},
		"166": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Ledian"
		},
		"167": {
			"tier": "LC",
			"bestTier": "ZU",
			"bestName": "Ariados"
		},
		"168": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Ariados"
		},
		"169": {
			"tier": "RU",
			"bestTier": "RU",
			"bestName": "Crobat"
		},
		"170": {
			"tier": "LC",
			"bestTier": "ZU",
			"bestName": "Lanturn"
		},
		"171": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Lanturn"
		},
		"172": {
			"tier": "LC",
			"bestTier": "ZU",
			"bestName": "Raichu-Alola"
		},
		"173": {
			"tier": "LC",
			"bestTier": "OU",
			"bestName": "Clefable"
		},
		"174": {
			"tier": "LC",
			"bestTier": "ZU",
			"bestName": "Wigglytuff"
		},
		"175": {
			"tier": "LC",
			"bestTier": "RU",
			"bestName": "Togekiss"
		},
		"176": {
			"tier": "NFE",
			"bestTier": "RU",
			"bestName": "Togekiss"
		},
		"177": {
			"tier": "LC",
			"bestTier": "NU",
			"bestName": "Xatu"
		},
		"178": {
			"tier": "NU",
			"bestTier": "NU",
			"bestName": "Xatu"
		},
		"179": {
			"tier": "LC",
			"bestTier": "ZU",
			"bestName": "Ampharos"
		},
		"180": {
			"tier": "NFE",
			"bestTier": "ZU",
			"bestName": "Ampharos"
		},
		"181": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Ampharos"
		},
		"182": {
			"tier": "ZU",
			"bestTier": "NU",
			"bestName": "Vileplume"
		},
		"183": {
			"tier": "NFE",
			"bestTier": "UU",
			"bestName": "Azumarill"
		},
		"184": {
			"tier": "UU",
			"bestTier": "UU",
			"bestName": "Azumarill"
		},
		"185": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Sudowoodo"
		},
		"186": {
			"tier": "NUBL",
			"bestTier": "NUBL",
			"bestName": "Politoed"
		},
		"187": {
			"tier": "LC",
			"bestTier": "ZU",
			"bestName": "Jumpluff"
		},
		"188": {
			"tier": "NFE",
			"bestTier": "ZU",
			"bestName": "Jumpluff"
		},
		"189": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Jumpluff"
		},
		"190": {
			"tier": "NFE",
			"bestTier": "PU",
			"bestName": "Ambipom"
		},
		"191": {
			"tier": "LC",
			"bestTier": "ZU",
			"bestName": "Sunflora"
		},
		"192": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Sunflora"
		},
		"193": {
			"tier": "NFE",
			"bestTier": "RUBL",
			"bestName": "Yanmega"
		},
		"194": {
			"tier": "LC",
			"bestTier": "RU",
			"bestName": "Quagsire"
		},
		"195": {
			"tier": "RU",
			"bestTier": "RU",
			"bestName": "Quagsire"
		},
		"196": {
			"tier": "PU",
			"bestTier": "RU",
			"bestName": "Umbreon"
		},
		"197": {
			"tier": "RU",
			"bestTier": "RU",
			"bestName": "Umbreon"
		},
		"198": {
			"tier": "NFE",
			"bestTier": "ZU",
			"bestName": "Honchkrow"
		},
		"199": {
			"tier": "UU",
			"bestTier": "UU",
			"bestName": "Slowking"
		},
		"200": {
			"tier": "NFE",
			"bestTier": "ZU",
			"bestName": "Mismagius"
		},
		"201": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Unown"
		},
		"202": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Wobbuffet"
		},
		"203": {
			"tier": "NFE",
			"bestTier": "ZU",
			"bestName": "Farigiraf"
		},
		"204": {
			"tier": "LC",
			"bestTier": "RU",
			"bestName": "Forretress"
		},
		"205": {
			"tier": "RU",
			"bestTier": "RU",
			"bestName": "Forretress"
		},
		"206": {
			"tier": "NFE",
			"bestTier": "PU",
			"bestName": "Dudunsparce-Three-Segment"
		},
		"207": {
			"tier": "NU",
			"bestTier": "OU",
			"bestName": "Gliscor"
		},
		"208": {
			"tier": "RU",
			"bestTier": "RU",
			"bestName": "Steelix"
		},
		"209": {
			"tier": "LC",
			"bestTier": "ZU",
			"bestName": "Granbull"
		},
		"210": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Granbull"
		},
		"211": {
			"tier": "PU",
			"bestTier": "PU",
			"bestName": "Qwilfish"
		},
		"212": {
			"tier": "OU",
			"bestTier": "OU",
			"bestName": "Scizor"
		},
		"213": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Shuckle"
		},
		"214": {
			"tier": "NU",
			"bestTier": "NU",
			"bestName": "Heracross"
		},
		"215": {
			"tier": "NFE",
			"bestTier": "OU",
			"bestName": "Weavile"
		},
		"216": {
			"tier": "LC",
			"bestTier": "UUBL",
			"bestName": "Ursaluna"
		},
		"217": {
			"tier": "NFE",
			"bestTier": "UUBL",
			"bestName": "Ursaluna"
		},
		"218": {
			"tier": "LC",
			"bestTier": "ZU",
			"bestName": "Magcargo"
		},
		"219": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Magcargo"
		},
		"220": {
			"tier": "LC",
			"bestTier": "RU",
			"bestName": "Mamoswine"
		},
		"221": {
			"tier": "NFE",
			"bestTier": "RU",
			"bestName": "Mamoswine"
		},
		"222": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Corsola"
		},
		"223": {
			"tier": "LC",
			"bestTier": "ZU",
			"bestName": "Octillery"
		},
		"224": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Octillery"
		},
		"225": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Delibird"
		},
		"226": {
			"tier": "NU",
			"bestTier": "NU",
			"bestName": "Mantine"
		},
		"227": {
			"tier": "UU",
			"bestTier": "UU",
			"bestName": "Skarmory"
		},
		"228": {
			"tier": "LC",
			"bestTier": "ZU",
			"bestName": "Houndoom"
		},
		"229": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Houndoom"
		},
		"230": {
			"tier": "ZUBL",
			"bestTier": "ZUBL",
			"bestName": "Kingdra"
		},
		"231": {
			"tier": "LC",
			"bestTier": "UU",
			"bestName": "Donphan"
		},
		"232": {
			"tier": "UU",
			"bestTier": "UU",
			"bestName": "Donphan"
		},
		"233": {
			"tier": "ZUBL",
			"bestTier": "NUBL",
			"bestName": "Porygon-Z"
		},
		"234": {
			"tier": "NFE",
			"bestTier": "ZU",
			"bestName": "Wyrdeer"
		},
		"235": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Smeargle"
		},
		"236": {
			"tier": "LC",
			"bestTier": "PU",
			"bestName": "Hitmonlee"
		},
		"237": {
			"tier": "ZU",
			"bestTier": "PU",
			"bestName": "Hitmonlee"
		},
		"238": {
			"tier": "LC",
			"bestTier": "ZU",
			"bestName": "Jynx"
		},
		"239": {
			"tier": "LC",
			"bestTier": "ZU",
			"bestName": "Electivire"
		},
		"240": {
			"tier": "NFE",
			"bestTier": "ZU",
			"bestName": "Magmortar"
		},
		"241": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Miltank"
		},
		"242": {
			"tier": "RU",
			"bestTier": "RU",
			"bestName": "Blissey"
		},
		"243": {
			"tier": "NU",
			"bestTier": "NU",
			"bestName": "Raikou"
		},
		"244": {
			"tier": "RU",
			"bestTier": "RU",
			"bestName": "Entei"
		},
		"245": {
			"tier": "NUBL",
			"bestTier": "NUBL",
			"bestName": "Suicune"
		},
		"246": {
			"tier": "LC",
			"bestTier": "UU",
			"bestName": "Tyranitar"
		},
		"247": {
			"tier": "NFE",
			"bestTier": "UU",
			"bestName": "Tyranitar"
		},
		"248": {
			"tier": "UU",
			"bestTier": "UU",
			"bestName": "Tyranitar"
		},
		"249": {
			"tier": "Uber",
			"bestTier": "Uber",
			"bestName": "Lugia"
		},
		"250": {
			"tier": "Uber",
			"bestTier": "Uber",
			"bestName": "Ho-Oh"
		},
		"251": {
			"tier": "RU",
			"bestTier": "RU",
			"bestName": "Celebi"
		},
		"252": {
			"tier": "LC",
			"bestTier": "ZU",
			"bestName": "Sceptile"
		},
		"253": {
			"tier": "NFE",
			"bestTier": "ZU",
			"bestName": "Sceptile"
		},
		"254": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Sceptile"
		},
		"255": {
			"tier": "LC",
			"bestTier": "UUBL",
			"bestName": "Blaziken"
		},
		"256": {
			"tier": "NFE",
			"bestTier": "UUBL",
			"bestName": "Blaziken"
		},
		"257": {
			"tier": "UUBL",
			"bestTier": "UUBL",
			"bestName": "Blaziken"
		},
		"258": {
			"tier": "LC",
			"bestTier": "NU",
			"bestName": "Swampert"
		},
		"259": {
			"tier": "NFE",
			"bestTier": "NU",
			"bestName": "Swampert"
		},
		"260": {
			"tier": "NU",
			"bestTier": "NU",
			"bestName": "Swampert"
		},
		"261": {
			"tier": "LC",
			"bestTier": "ZU",
			"bestName": "Mightyena"
		},
		"262": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Mightyena"
		},
		"263": {
			"tier": "NFE",
			"bestTier": "NUBL",
			"bestName": "Linoone"
		},
		"264": {
			"tier": "NUBL",
			"bestTier": "NUBL",
			"bestName": "Linoone"
		},
		"265": {
			"tier": "LC",
			"bestTier": "ZU",
			"bestName": "Dustox"
		},
		"266": {
			"tier": "NFE",
			"bestTier": "ZU",
			"bestName": "Dustox"
		},
		"267": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Dustox"
		},
		"268": {
			"tier": "NFE",
			"bestTier": "ZU",
			"bestName": "Dustox"
		},
		"269": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Dustox"
		},
		"270": {
			"tier": "LC",
			"bestTier": "ZU",
			"bestName": "Ludicolo"
		},
		"271": {
			"tier": "NFE",
			"bestTier": "ZU",
			"bestName": "Ludicolo"
		},
		"272": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Ludicolo"
		},
		"273": {
			"tier": "LC",
			"bestTier": "ZU",
			"bestName": "Shiftry"
		},
		"274": {
			"tier": "NFE",
			"bestTier": "ZU",
			"bestName": "Shiftry"
		},
		"275": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Shiftry"
		},
		"276": {
			"tier": "LC",
			"bestTier": "RU",
			"bestName": "Swellow"
		},
		"277": {
			"tier": "RU",
			"bestTier": "RU",
			"bestName": "Swellow"
		},
		"278": {
			"tier": "LC",
			"bestTier": "UUBL",
			"bestName": "Pelipper"
		},
		"279": {
			"tier": "UUBL",
			"bestTier": "UUBL",
			"bestName": "Pelipper"
		},
		"280": {
			"tier": "LC",
			"bestTier": "RU",
			"bestName": "Gallade"
		},
		"281": {
			"tier": "NFE",
			"bestTier": "RU",
			"bestName": "Gallade"
		},
		"282": {
			"tier": "RU",
			"bestTier": "RU",
			"bestName": "Gallade"
		},
		"283": {
			"tier": "LC",
			"bestTier": "ZU",
			"bestName": "Masquerain"
		},
		"284": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Masquerain"
		},
		"285": {
			"tier": "LC",
			"bestTier": "NU",
			"bestName": "Breloom"
		},
		"286": {
			"tier": "NU",
			"bestTier": "NU",
			"bestName": "Breloom"
		},
		"287": {
			"tier": "LC",
			"bestTier": "ZU",
			"bestName": "Slaking"
		},
		"288": {
			"tier": "NFE",
			"bestTier": "ZU",
			"bestName": "Slaking"
		},
		"289": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Slaking"
		},
		"290": {
			"tier": "LC",
			"bestTier": "ZUBL",
			"bestName": "Ninjask"
		},
		"291": {
			"tier": "ZUBL",
			"bestTier": "ZUBL",
			"bestName": "Ninjask"
		},
		"292": {
			"tier": "ZU",
			"bestTier": "ZUBL",
			"bestName": "Ninjask"
		},
		"293": {
			"tier": "LC",
			"bestTier": "NU",
			"bestName": "Exploud"
		},
		"294": {
			"tier": "NFE",
			"bestTier": "NU",
			"bestName": "Exploud"
		},
		"295": {
			"tier": "NU",
			"bestTier": "NU",
			"bestName": "Exploud"
		},
		"296": {
			"tier": "LC",
			"bestTier": "PU",
			"bestName": "Hariyama"
		},
		"297": {
			"tier": "PU",
			"bestTier": "PU",
			"bestName": "Hariyama"
		},
		"298": {
			"tier": "LC",
			"bestTier": "UU",
			"bestName": "Azumarill"
		},
		"299": {
			"tier": "LC",
			"bestTier": "ZU",
			"bestName": "Probopass"
		},
		"300": {
			"tier": "LC",
			"bestTier": "ZU",
			"bestName": "Delcatty"
		},
		"301": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Delcatty"
		},
		"302": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Sableye"
		},
		"303": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Mawile"
		},
		"304": {
			"tier": "LC",
			"bestTier": "PU",
			"bestName": "Aggron"
		},
		"305": {
			"tier": "NFE",
			"bestTier": "PU",
			"bestName": "Aggron"
		},
		"306": {
			"tier": "PU",
			"bestTier": "PU",
			"bestName": "Aggron"
		},
		"307": {
			"tier": "NFE",
			"bestTier": "ZU",
			"bestName": "Medicham"
		},
		"308": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Medicham"
		},
		"309": {
			"tier": "LC",
			"bestTier": "ZU",
			"bestName": "Manectric"
		},
		"310": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Manectric"
		},
		"311": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Plusle"
		},
		"312": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Minun"
		},
		"313": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Volbeat"
		},
		"314": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Illumise"
		},
		"315": {
			"tier": "NFE",
			"bestTier": "RU",
			"bestName": "Roserade"
		},
		"316": {
			"tier": "LC",
			"bestTier": "ZU",
			"bestName": "Swalot"
		},
		"317": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Swalot"
		},
		"318": {
			"tier": "LC",
			"bestTier": "RU",
			"bestName": "Sharpedo"
		},
		"319": {
			"tier": "RU",
			"bestTier": "RU",
			"bestName": "Sharpedo"
		},
		"320": {
			"tier": "LC",
			"bestTier": "ZU",
			"bestName": "Wailord"
		},
		"321": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Wailord"
		},
		"322": {
			"tier": "LC",
			"bestTier": "ZU",
			"bestName": "Camerupt"
		},
		"323": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Camerupt"
		},
		"324": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Torkoal"
		},
		"325": {
			"tier": "LC",
			"bestTier": "ZU",
			"bestName": "Grumpig"
		},
		"326": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Grumpig"
		},
		"327": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Spinda"
		},
		"328": {
			"tier": "LC",
			"bestTier": "NU",
			"bestName": "Flygon"
		},
		"329": {
			"tier": "NFE",
			"bestTier": "NU",
			"bestName": "Flygon"
		},
		"330": {
			"tier": "NU",
			"bestTier": "NU",
			"bestName": "Flygon"
		},
		"331": {
			"tier": "LC",
			"bestTier": "ZU",
			"bestName": "Cacturne"
		},
		"332": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Cacturne"
		},
		"333": {
			"tier": "LC",
			"bestTier": "NU",
			"bestName": "Altaria"
		},
		"334": {
			"tier": "NU",
			"bestTier": "NU",
			"bestName": "Altaria"
		},
		"335": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Zangoose"
		},
		"336": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Seviper"
		},
		"337": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Lunatone"
		},
		"338": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Solrock"
		},
		"339": {
			"tier": "LC",
			"bestTier": "ZU",
			"bestName": "Whiscash"
		},
		"340": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Whiscash"
		},
		"341": {
			"tier": "LC",
			"bestTier": "RU",
			"bestName": "Crawdaunt"
		},
		"342": {
			"tier": "RU",
			"bestTier": "RU",
			"bestName": "Crawdaunt"
		},
		"343": {
			"tier": "LC",
			"bestTier": "PU",
			"bestName": "Claydol"
		},
		"344": {
			"tier": "PU",
			"bestTier": "PU",
			"bestName": "Claydol"
		},
		"345": {
			"tier": "LC",
			"bestTier": "ZU",
			"bestName": "Cradily"
		},
		"346": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Cradily"
		},
		"347": {
			"tier": "LC",
			"bestTier": "ZU",
			"bestName": "Armaldo"
		},
		"348": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Armaldo"
		},
		"349": {
			"tier": "LC",
			"bestTier": "PU",
			"bestName": "Milotic"
		},
		"350": {
			"tier": "PU",
			"bestTier": "PU",
			"bestName": "Milotic"
		},
		"351": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Castform"
		},
		"352": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Kecleon"
		},
		"353": {
			"tier": "LC",
			"bestTier": "ZU",
			"bestName": "Banette"
		},
		"354": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Banette"
		},
		"355": {
			"tier": "LC",
			"bestTier": "ZU",
			"bestName": "Dusknoir"
		},
		"356": {
			"tier": "NFE",
			"bestTier": "ZU",
			"bestName": "Dusknoir"
		},
		"357": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Tropius"
		},
		"358": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Chimecho"
		},
		"359": {
			"tier": "PU",
			"bestTier": "PU",
			"bestName": "Absol"
		},
		"360": {
			"tier": "LC",
			"bestTier": "ZU",
			"bestName": "Wobbuffet"
		},
		"361": {
			"tier": "LC",
			"bestTier": "ZU",
			"bestName": "Froslass"
		},
		"362": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Froslass"
		},
		"363": {
			"tier": "LC",
			"bestTier": "ZU",
			"bestName": "Walrein"
		},
		"364": {
			"tier": "NFE",
			"bestTier": "ZU",
			"bestName": "Walrein"
		},
		"365": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Walrein"
		},
		"366": {
			"tier": "LC",
			"bestTier": "ZUBL",
			"bestName": "Gorebyss"
		},
		"367": {
			"tier": "ZU",
			"bestTier": "ZUBL",
			"bestName": "Gorebyss"
		},
		"368": {
			"tier": "ZUBL",
			"bestTier": "ZUBL",
			"bestName": "Gorebyss"
		},
		"369": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Relicanth"
		},
		"370": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Luvdisc"
		},
		"371": {
			"tier": "LC",
			"bestTier": "RU",
			"bestName": "Salamence"
		},
		"372": {
			"tier": "NFE",
			"bestTier": "RU",
			"bestName": "Salamence"
		},
		"373": {
			"tier": "RU",
			"bestTier": "RU",
			"bestName": "Salamence"
		},
		"374": {
			"tier": "LC",
			"bestTier": "UU",
			"bestName": "Metagross"
		},
		"375": {
			"tier": "NFE",
			"bestTier": "UU",
			"bestName": "Metagross"
		},
		"376": {
			"tier": "UU",
			"bestTier": "UU",
			"bestName": "Metagross"
		},
		"377": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Regirock"
		},
		"378": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Regice"
		},
		"379": {
			"tier": "RU",
			"bestTier": "RU",
			"bestName": "Registeel"
		},
		"380": {
			"tier": "UUBL",
			"bestTier": "UUBL",
			"bestName": "Latias"
		},
		"381": {
			"tier": "UU",
			"bestTier": "UU",
			"bestName": "Latios"
		},
		"382": {
			"tier": "Uber",
			"bestTier": "Uber",
			"bestName": "Kyogre"
		},
		"383": {
			"tier": "Uber",
			"bestTier": "Uber",
			"bestName": "Groudon"
		},
		"384": {
			"tier": "Uber",
			"bestTier": "Uber",
			"bestName": "Rayquaza"
		},
		"385": {
			"tier": "RU",
			"bestTier": "RU",
			"bestName": "Jirachi"
		},
		"386": {
			"tier": "Uber",
			"bestTier": "Uber",
			"bestName": "Deoxys"
		},
		"387": {
			"tier": "LC",
			"bestTier": "PUBL",
			"bestName": "Torterra"
		},
		"388": {
			"tier": "NFE",
			"bestTier": "PUBL",
			"bestName": "Torterra"
		},
		"389": {
			"tier": "PUBL",
			"bestTier": "PUBL",
			"bestName": "Torterra"
		},
		"390": {
			"tier": "LC",
			"bestTier": "NU",
			"bestName": "Infernape"
		},
		"391": {
			"tier": "NFE",
			"bestTier": "NU",
			"bestName": "Infernape"
		},
		"392": {
			"tier": "NU",
			"bestTier": "NU",
			"bestName": "Infernape"
		},
		"393": {
			"tier": "LC",
			"bestTier": "RU",
			"bestName": "Empoleon"
		},
		"394": {
			"tier": "NFE",
			"bestTier": "RU",
			"bestName": "Empoleon"
		},
		"395": {
			"tier": "RU",
			"bestTier": "RU",
			"bestName": "Empoleon"
		},
		"396": {
			"tier": "LC",
			"bestTier": "NU",
			"bestName": "Staraptor"
		},
		"397": {
			"tier": "NFE",
			"bestTier": "NU",
			"bestName": "Staraptor"
		},
		"398": {
			"tier": "NU",
			"bestTier": "NU",
			"bestName": "Staraptor"
		},
		"399": {
			"tier": "LC",
			"bestTier": "ZU",
			"bestName": "Bibarel"
		},
		"400": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Bibarel"
		},
		"401": {
			"tier": "LC",
			"bestTier": "ZU",
			"bestName": "Kricketune"
		},
		"402": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Kricketune"
		},
		"403": {
			"tier": "LC",
			"bestTier": "ZU",
			"bestName": "Luxray"
		},
		"404": {
			"tier": "NFE",
			"bestTier": "ZU",
			"bestName": "Luxray"
		},
		"405": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Luxray"
		},
		"406": {
			"tier": "LC",
			"bestTier": "RU",
			"bestName": "Roserade"
		},
		"407": {
			"tier": "RU",
			"bestTier": "RU",
			"bestName": "Roserade"
		},
		"408": {
			"tier": "LC",
			"bestTier": "ZU",
			"bestName": "Rampardos"
		},
		"409": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Rampardos"
		},
		"410": {
			"tier": "LC",
			"bestTier": "ZU",
			"bestName": "Bastiodon"
		},
		"411": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Bastiodon"
		},
		"412": {
			"tier": "LC",
			"bestTier": "ZU",
			"bestName": "Mothim"
		},
		"413": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Mothim"
		},
		"414": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Mothim"
		},
		"415": {
			"tier": "LC",
			"bestTier": "ZU",
			"bestName": "Vespiquen"
		},
		"416": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Vespiquen"
		},
		"417": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Pachirisu"
		},
		"418": {
			"tier": "LC",
			"bestTier": "ZU",
			"bestName": "Floatzel"
		},
		"419": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Floatzel"
		},
		"420": {
			"tier": "NFE",
			"bestTier": "ZU",
			"bestName": "Cherrim"
		},
		"421": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Cherrim"
		},
		"422": {
			"tier": "LC",
			"bestTier": "RU",
			"bestName": "Gastrodon"
		},
		"423": {
			"tier": "RU",
			"bestTier": "RU",
			"bestName": "Gastrodon"
		},
		"424": {
			"tier": "PU",
			"bestTier": "PU",
			"bestName": "Ambipom"
		},
		"425": {
			"tier": "LC",
			"bestTier": "ZU",
			"bestName": "Drifblim"
		},
		"426": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Drifblim"
		},
		"427": {
			"tier": "LC",
			"bestTier": "ZU",
			"bestName": "Lopunny"
		},
		"428": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Lopunny"
		},
		"429": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Mismagius"
		},
		"430": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Honchkrow"
		},
		"431": {
			"tier": "LC",
			"bestTier": "ZU",
			"bestName": "Purugly"
		},
		"432": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Purugly"
		},
		"433": {
			"tier": "LC",
			"bestTier": "ZU",
			"bestName": "Chimecho"
		},
		"434": {
			"tier": "LC",
			"bestTier": "PU",
			"bestName": "Skuntank"
		},
		"435": {
			"tier": "PU",
			"bestTier": "PU",
			"bestName": "Skuntank"
		},
		"436": {
			"tier": "LC",
			"bestTier": "NU",
			"bestName": "Bronzong"
		},
		"437": {
			"tier": "NU",
			"bestTier": "NU",
			"bestName": "Bronzong"
		},
		"438": {
			"tier": "LC",
			"bestTier": "ZU",
			"bestName": "Sudowoodo"
		},
		"439": {
			"tier": "LC",
			"bestTier": "ZU",
			"bestName": "Mr. Rime"
		},
		"440": {
			"tier": "LC",
			"bestTier": "RU",
			"bestName": "Blissey"
		},
		"441": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Chatot"
		},
		"442": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Spiritomb"
		},
		"443": {
			"tier": "LC",
			"bestTier": "UUBL",
			"bestName": "Garchomp"
		},
		"444": {
			"tier": "NFE",
			"bestTier": "UUBL",
			"bestName": "Garchomp"
		},
		"445": {
			"tier": "UUBL",
			"bestTier": "UUBL",
			"bestName": "Garchomp"
		},
		"446": {
			"tier": "LC",
			"bestTier": "ZU",
			"bestName": "Snorlax"
		},
		"447": {
			"tier": "LC",
			"bestTier": "NUBL",
			"bestName": "Lucario"
		},
		"448": {
			"tier": "NUBL",
			"bestTier": "NUBL",
			"bestName": "Lucario"
		},
		"449": {
			"tier": "LC",
			"bestTier": "RU",
			"bestName": "Hippowdon"
		},
		"450": {
			"tier": "RU",
			"bestTier": "RU",
			"bestName": "Hippowdon"
		},
		"451": {
			"tier": "LC",
			"bestTier": "NU",
			"bestName": "Drapion"
		},
		"452": {
			"tier": "NU",
			"bestTier": "NU",
			"bestName": "Drapion"
		},
		"453": {
			"tier": "LC",
			"bestTier": "NU",
			"bestName": "Toxicroak"
		},
		"454": {
			"tier": "NU",
			"bestTier": "NU",
			"bestName": "Toxicroak"
		},
		"455": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Carnivine"
		},
		"456": {
			"tier": "LC",
			"bestTier": "ZU",
			"bestName": "Lumineon"
		},
		"457": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Lumineon"
		},
		"458": {
			"tier": "LC",
			"bestTier": "NU",
			"bestName": "Mantine"
		},
		"459": {
			"tier": "LC",
			"bestTier": "ZU",
			"bestName": "Abomasnow"
		},
		"460": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Abomasnow"
		},
		"461": {
			"tier": "OU",
			"bestTier": "OU",
			"bestName": "Weavile"
		},
		"462": {
			"tier": "RU",
			"bestTier": "RU",
			"bestName": "Magnezone"
		},
		"463": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Lickilicky"
		},
		"464": {
			"tier": "NU",
			"bestTier": "NU",
			"bestName": "Rhyperior"
		},
		"465": {
			"tier": "UU",
			"bestTier": "UU",
			"bestName": "Tangrowth"
		},
		"466": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Electivire"
		},
		"467": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Magmortar"
		},
		"468": {
			"tier": "RU",
			"bestTier": "RU",
			"bestName": "Togekiss"
		},
		"469": {
			"tier": "RUBL",
			"bestTier": "RUBL",
			"bestName": "Yanmega"
		},
		"470": {
			"tier": "ZU",
			"bestTier": "RU",
			"bestName": "Umbreon"
		},
		"471": {
			"tier": "ZU",
			"bestTier": "RU",
			"bestName": "Umbreon"
		},
		"472": {
			"tier": "OU",
			"bestTier": "OU",
			"bestName": "Gliscor"
		},
		"473": {
			"tier": "RU",
			"bestTier": "RU",
			"bestName": "Mamoswine"
		},
		"474": {
			"tier": "NUBL",
			"bestTier": "NUBL",
			"bestName": "Porygon-Z"
		},
		"475": {
			"tier": "RU",
			"bestTier": "RU",
			"bestName": "Gallade"
		},
		"476": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Probopass"
		},
		"477": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Dusknoir"
		},
		"478": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Froslass"
		},
		"479": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Rotom"
		},
		"480": {
			"tier": "PU",
			"bestTier": "PU",
			"bestName": "Uxie"
		},
		"481": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Mesprit"
		},
		"482": {
			"tier": "RU",
			"bestTier": "RU",
			"bestName": "Azelf"
		},
		"483": {
			"tier": "Uber",
			"bestTier": "Uber",
			"bestName": "Dialga"
		},
		"484": {
			"tier": "Uber",
			"bestTier": "Uber",
			"bestName": "Palkia"
		},
		"485": {
			"tier": "UU",
			"bestTier": "UU",
			"bestName": "Heatran"
		},
		"486": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Regigigas"
		},
		"487": {
			"tier": "Uber",
			"bestTier": "Uber",
			"bestName": "Giratina"
		},
		"488": {
			"tier": "NUBL",
			"bestTier": "NUBL",
			"bestName": "Cresselia"
		},
		"489": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Phione"
		},
		"490": {
			"tier": "UU",
			"bestTier": "UU",
			"bestName": "Manaphy"
		},
		"491": {
			"tier": "OU",
			"bestTier": "OU",
			"bestName": "Darkrai"
		},
		"492": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Shaymin"
		},
		"493": {
			"tier": "Uber",
			"bestTier": "Uber",
			"bestName": "Arceus"
		},
		"494": {
			"tier": "OU",
			"bestTier": "OU",
			"bestName": "Victini"
		},
		"495": {
			"tier": "NFE",
			"bestTier": "RUBL",
			"bestName": "Serperior"
		},
		"496": {
			"tier": "NFE",
			"bestTier": "RUBL",
			"bestName": "Serperior"
		},
		"497": {
			"tier": "RUBL",
			"bestTier": "RUBL",
			"bestName": "Serperior"
		},
		"498": {
			"tier": "LC",
			"bestTier": "ZUBL",
			"bestName": "Emboar"
		},
		"499": {
			"tier": "NFE",
			"bestTier": "ZUBL",
			"bestName": "Emboar"
		},
		"500": {
			"tier": "ZUBL",
			"bestTier": "ZUBL",
			"bestName": "Emboar"
		},
		"501": {
			"tier": "LC",
			"bestTier": "OU",
			"bestName": "Samurott-Hisui"
		},
		"502": {
			"tier": "NFE",
			"bestTier": "OU",
			"bestName": "Samurott-Hisui"
		},
		"503": {
			"tier": "ZU",
			"bestTier": "OU",
			"bestName": "Samurott-Hisui"
		},
		"504": {
			"tier": "LC",
			"bestTier": "ZU",
			"bestName": "Watchog"
		},
		"505": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Watchog"
		},
		"506": {
			"tier": "LC",
			"bestTier": "ZU",
			"bestName": "Stoutland"
		},
		"507": {
			"tier": "NFE",
			"bestTier": "ZU",
			"bestName": "Stoutland"
		},
		"508": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Stoutland"
		},
		"509": {
			"tier": "LC",
			"bestTier": "ZU",
			"bestName": "Liepard"
		},
		"510": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Liepard"
		},
		"511": {
			"tier": "LC",
			"bestTier": "ZU",
			"bestName": "Simisage"
		},
		"512": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Simisage"
		},
		"513": {
			"tier": "LC",
			"bestTier": "ZU",
			"bestName": "Simisear"
		},
		"514": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Simisear"
		},
		"515": {
			"tier": "LC",
			"bestTier": "ZU",
			"bestName": "Simipour"
		},
		"516": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Simipour"
		},
		"517": {
			"tier": "LC",
			"bestTier": "ZU",
			"bestName": "Musharna"
		},
		"518": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Musharna"
		},
		"519": {
			"tier": "LC",
			"bestTier": "ZU",
			"bestName": "Unfezant"
		},
		"520": {
			"tier": "NFE",
			"bestTier": "ZU",
			"bestName": "Unfezant"
		},
		"521": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Unfezant"
		},
		"522": {
			"tier": "LC",
			"bestTier": "ZU",
			"bestName": "Zebstrika"
		},
		"523": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Zebstrika"
		},
		"524": {
			"tier": "LC",
			"bestTier": "PU",
			"bestName": "Gigalith"
		},
		"525": {
			"tier": "NFE",
			"bestTier": "PU",
			"bestName": "Gigalith"
		},
		"526": {
			"tier": "PU",
			"bestTier": "PU",
			"bestName": "Gigalith"
		},
		"527": {
			"tier": "NFE",
			"bestTier": "ZU",
			"bestName": "Swoobat"
		},
		"528": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Swoobat"
		},
		"529": {
			"tier": "LC",
			"bestTier": "UU",
			"bestName": "Excadrill"
		},
		"530": {
			"tier": "UU",
			"bestTier": "UU",
			"bestName": "Excadrill"
		},
		"531": {
			"tier": "PU",
			"bestTier": "PU",
			"bestName": "Audino"
		},
		"532": {
			"tier": "LC",
			"bestTier": "UU",
			"bestName": "Conkeldurr"
		},
		"533": {
			"tier": "NFE",
			"bestTier": "UU",
			"bestName": "Conkeldurr"
		},
		"534": {
			"tier": "UU",
			"bestTier": "UU",
			"bestName": "Conkeldurr"
		},
		"535": {
			"tier": "LC",
			"bestTier": "RU",
			"bestName": "Seismitoad"
		},
		"536": {
			"tier": "NFE",
			"bestTier": "RU",
			"bestName": "Seismitoad"
		},
		"537": {
			"tier": "RU",
			"bestTier": "RU",
			"bestName": "Seismitoad"
		},
		"538": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Throh"
		},
		"539": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Sawk"
		},
		"540": {
			"tier": "LC",
			"bestTier": "ZU",
			"bestName": "Leavanny"
		},
		"541": {
			"tier": "NFE",
			"bestTier": "ZU",
			"bestName": "Leavanny"
		},
		"542": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Leavanny"
		},
		"543": {
			"tier": "LC",
			"bestTier": "RUBL",
			"bestName": "Scolipede"
		},
		"544": {
			"tier": "NFE",
			"bestTier": "RUBL",
			"bestName": "Scolipede"
		},
		"545": {
			"tier": "RUBL",
			"bestTier": "RUBL",
			"bestName": "Scolipede"
		},
		"546": {
			"tier": "LC",
			"bestTier": "ZU",
			"bestName": "Whimsicott"
		},
		"547": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Whimsicott"
		},
		"548": {
			"tier": "LC",
			"bestTier": "NUBL",
			"bestName": "Lilligant-Hisui"
		},
		"549": {
			"tier": "ZU",
			"bestTier": "NUBL",
			"bestName": "Lilligant-Hisui"
		},
		"550": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Basculin"
		},
		"551": {
			"tier": "LC",
			"bestTier": "RU",
			"bestName": "Krookodile"
		},
		"552": {
			"tier": "NFE",
			"bestTier": "RU",
			"bestName": "Krookodile"
		},
		"553": {
			"tier": "RU",
			"bestTier": "RU",
			"bestName": "Krookodile"
		},
		"554": {
			"tier": "LC",
			"bestTier": "UU",
			"bestName": "Darmanitan"
		},
		"555": {
			"tier": "UU",
			"bestTier": "UU",
			"bestName": "Darmanitan"
		},
		"556": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Maractus"
		},
		"557": {
			"tier": "LC",
			"bestTier": "ZU",
			"bestName": "Crustle"
		},
		"558": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Crustle"
		},
		"559": {
			"tier": "NFE",
			"bestTier": "NU",
			"bestName": "Scrafty"
		},
		"560": {
			"tier": "NU",
			"bestTier": "NU",
			"bestName": "Scrafty"
		},
		"561": {
			"tier": "NUBL",
			"bestTier": "NUBL",
			"bestName": "Sigilyph"
		},
		"562": {
			"tier": "LC",
			"bestTier": "ZU",
			"bestName": "Cofagrigus"
		},
		"563": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Cofagrigus"
		},
		"564": {
			"tier": "LC",
			"bestTier": "ZU",
			"bestName": "Carracosta"
		},
		"565": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Carracosta"
		},
		"566": {
			"tier": "LC",
			"bestTier": "PU",
			"bestName": "Archeops"
		},
		"567": {
			"tier": "PU",
			"bestTier": "PU",
			"bestName": "Archeops"
		},
		"568": {
			"tier": "LC",
			"bestTier": "PU",
			"bestName": "Garbodor"
		},
		"569": {
			"tier": "PU",
			"bestTier": "PU",
			"bestName": "Garbodor"
		},
		"570": {
			"tier": "LC",
			"bestTier": "PU",
			"bestName": "Zoroark"
		},
		"571": {
			"tier": "PU",
			"bestTier": "PU",
			"bestName": "Zoroark"
		},
		"572": {
			"tier": "LC",
			"bestTier": "NU",
			"bestName": "Cinccino"
		},
		"573": {
			"tier": "NU",
			"bestTier": "NU",
			"bestName": "Cinccino"
		},
		"574": {
			"tier": "LC",
			"bestTier": "ZU",
			"bestName": "Gothitelle"
		},
		"575": {
			"tier": "NFE",
			"bestTier": "ZU",
			"bestName": "Gothitelle"
		},
		"576": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Gothitelle"
		},
		"577": {
			"tier": "LC",
			"bestTier": "RU",
			"bestName": "Reuniclus"
		},
		"578": {
			"tier": "NFE",
			"bestTier": "RU",
			"bestName": "Reuniclus"
		},
		"579": {
			"tier": "RU",
			"bestTier": "RU",
			"bestName": "Reuniclus"
		},
		"580": {
			"tier": "LC",
			"bestTier": "ZU",
			"bestName": "Swanna"
		},
		"581": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Swanna"
		},
		"582": {
			"tier": "LC",
			"bestTier": "PUBL",
			"bestName": "Vanilluxe"
		},
		"583": {
			"tier": "NFE",
			"bestTier": "PUBL",
			"bestName": "Vanilluxe"
		},
		"584": {
			"tier": "PUBL",
			"bestTier": "PUBL",
			"bestName": "Vanilluxe"
		},
		"585": {
			"tier": "LC",
			"bestTier": "ZU",
			"bestName": "Sawsbuck"
		},
		"586": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Sawsbuck"
		},
		"587": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Emolga"
		},
		"588": {
			"tier": "LC",
			"bestTier": "NU",
			"bestName": "Escavalier"
		},
		"589": {
			"tier": "NU",
			"bestTier": "NU",
			"bestName": "Escavalier"
		},
		"590": {
			"tier": "LC",
			"bestTier": "PU",
			"bestName": "Amoonguss"
		},
		"591": {
			"tier": "PU",
			"bestTier": "PU",
			"bestName": "Amoonguss"
		},
		"592": {
			"tier": "LC",
			"bestTier": "PU",
			"bestName": "Jellicent"
		},
		"593": {
			"tier": "PU",
			"bestTier": "PU",
			"bestName": "Jellicent"
		},
		"594": {
			"tier": "OU",
			"bestTier": "OU",
			"bestName": "Alomomola"
		},
		"595": {
			"tier": "LC",
			"bestTier": "NU",
			"bestName": "Galvantula"
		},
		"596": {
			"tier": "NU",
			"bestTier": "NU",
			"bestName": "Galvantula"
		},
		"597": {
			"tier": "PU",
			"bestTier": "OU",
			"bestName": "Ferrothorn"
		},
		"598": {
			"tier": "OU",
			"bestTier": "OU",
			"bestName": "Ferrothorn"
		},
		"599": {
			"tier": "LC",
			"bestTier": "ZU",
			"bestName": "Klinklang"
		},
		"600": {
			"tier": "NFE",
			"bestTier": "ZU",
			"bestName": "Klinklang"
		},
		"601": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Klinklang"
		},
		"602": {
			"tier": "LC",
			"bestTier": "ZU",
			"bestName": "Eelektross"
		},
		"603": {
			"tier": "NFE",
			"bestTier": "ZU",
			"bestName": "Eelektross"
		},
		"604": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Eelektross"
		},
		"605": {
			"tier": "LC",
			"bestTier": "ZU",
			"bestName": "Beheeyem"
		},
		"606": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Beheeyem"
		},
		"607": {
			"tier": "LC",
			"bestTier": "NU",
			"bestName": "Chandelure"
		},
		"608": {
			"tier": "NFE",
			"bestTier": "NU",
			"bestName": "Chandelure"
		},
		"609": {
			"tier": "NU",
			"bestTier": "NU",
			"bestName": "Chandelure"
		},
		"610": {
			"tier": "LC",
			"bestTier": "RUBL",
			"bestName": "Haxorus"
		},
		"611": {
			"tier": "NFE",
			"bestTier": "RUBL",
			"bestName": "Haxorus"
		},
		"612": {
			"tier": "RUBL",
			"bestTier": "RUBL",
			"bestName": "Haxorus"
		},
		"613": {
			"tier": "LC",
			"bestTier": "ZU",
			"bestName": "Beartic"
		},
		"614": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Beartic"
		},
		"615": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Cryogonal"
		},
		"616": {
			"tier": "LC",
			"bestTier": "ZU",
			"bestName": "Accelgor"
		},
		"617": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Accelgor"
		},
		"618": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Stunfisk"
		},
		"619": {
			"tier": "LC",
			"bestTier": "NUBL",
			"bestName": "Mienshao"
		},
		"620": {
			"tier": "NUBL",
			"bestTier": "NUBL",
			"bestName": "Mienshao"
		},
		"621": {
			"tier": "PU",
			"bestTier": "PU",
			"bestName": "Druddigon"
		},
		"622": {
			"tier": "LC",
			"bestTier": "PU",
			"bestName": "Golurk"
		},
		"623": {
			"tier": "PU",
			"bestTier": "PU",
			"bestName": "Golurk"
		},
		"624": {
			"tier": "LC",
			"bestTier": "OU",
			"bestName": "Kingambit"
		},
		"625": {
			"tier": "RU",
			"bestTier": "OU",
			"bestName": "Kingambit"
		},
		"626": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Bouffalant"
		},
		"627": {
			"tier": "NFE",
			"bestTier": "NU",
			"bestName": "Braviary"
		},
		"628": {
			"tier": "NU",
			"bestTier": "NU",
			"bestName": "Braviary"
		},
		"629": {
			"tier": "LC",
			"bestTier": "UU",
			"bestName": "Mandibuzz"
		},
		"630": {
			"tier": "UU",
			"bestTier": "UU",
			"bestName": "Mandibuzz"
		},
		"631": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Heatmor"
		},
		"632": {
			"tier": "RUBL",
			"bestTier": "RUBL",
			"bestName": "Durant"
		},
		"633": {
			"tier": "LC",
			"bestTier": "RUBL",
			"bestName": "Hydreigon"
		},
		"634": {
			"tier": "NFE",
			"bestTier": "RUBL",
			"bestName": "Hydreigon"
		},
		"635": {
			"tier": "RUBL",
			"bestTier": "RUBL",
			"bestName": "Hydreigon"
		},
		"636": {
			"tier": "LC",
			"bestTier": "Uber",
			"bestName": "Volcarona"
		},
		"637": {
			"tier": "Uber",
			"bestTier": "Uber",
			"bestName": "Volcarona"
		},
		"638": {
			"tier": "UU",
			"bestTier": "UU",
			"bestName": "Cobalion"
		},
		"639": {
			"tier": "RU",
			"bestTier": "RU",
			"bestName": "Terrakion"
		},
		"640": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Virizion"
		},
		"641": {
			"tier": "NU",
			"bestTier": "NU",
			"bestName": "Tornadus"
		},
		"642": {
			"tier": "RUBL",
			"bestTier": "RUBL",
			"bestName": "Thundurus"
		},
		"643": {
			"tier": "Uber",
			"bestTier": "Uber",
			"bestName": "Reshiram"
		},
		"644": {
			"tier": "Uber",
			"bestTier": "Uber",
			"bestName": "Zekrom"
		},
		"645": {
			"tier": "Uber",
			"bestTier": "Uber",
			"bestName": "Landorus"
		},
		"646": {
			"tier": "OU",
			"bestTier": "OU",
			"bestName": "Kyurem"
		},
		"647": {
			"tier": "UU",
			"bestTier": "UU",
			"bestName": "Keldeo"
		},
		"648": {
			"tier": "NU",
			"bestTier": "NU",
			"bestName": "Meloetta"
		},
		"649": {
			"tier": "Uber",
			"bestTier": "Uber",
			"bestName": "Genesect"
		},
		"650": {
			"tier": "LC",
			"bestTier": "RU",
			"bestName": "Chesnaught"
		},
		"651": {
			"tier": "NFE",
			"bestTier": "RU",
			"bestName": "Chesnaught"
		},
		"652": {
			"tier": "RU",
			"bestTier": "RU",
			"bestName": "Chesnaught"
		},
		"653": {
			"tier": "LC",
			"bestTier": "PU",
			"bestName": "Delphox"
		},
		"654": {
			"tier": "NFE",
			"bestTier": "PU",
			"bestName": "Delphox"
		},
		"655": {
			"tier": "PU",
			"bestTier": "PU",
			"bestName": "Delphox"
		},
		"656": {
			"tier": "LC",
			"bestTier": "UU",
			"bestName": "Greninja"
		},
		"657": {
			"tier": "NFE",
			"bestTier": "UU",
			"bestName": "Greninja"
		},
		"658": {
			"tier": "UU",
			"bestTier": "UU",
			"bestName": "Greninja"
		},
		"659": {
			"tier": "LC",
			"bestTier": "RUBL",
			"bestName": "Diggersby"
		},
		"660": {
			"tier": "RUBL",
			"bestTier": "RUBL",
			"bestName": "Diggersby"
		},
		"661": {
			"tier": "LC",
			"bestTier": "RU",
			"bestName": "Talonflame"
		},
		"662": {
			"tier": "NFE",
			"bestTier": "RU",
			"bestName": "Talonflame"
		},
		"663": {
			"tier": "RU",
			"bestTier": "RU",
			"bestName": "Talonflame"
		},
		"664": {
			"tier": "LC",
			"bestTier": "ZU",
			"bestName": "Vivillon-Fancy"
		},
		"665": {
			"tier": "NFE",
			"bestTier": "ZU",
			"bestName": "Vivillon-Fancy"
		},
		"666": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Vivillon-Fancy"
		},
		"667": {
			"tier": "LC",
			"bestTier": "ZU",
			"bestName": "Pyroar"
		},
		"668": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Pyroar"
		},
		"669": {
			"tier": "LC",
			"bestTier": "PU",
			"bestName": "Florges"
		},
		"670": {
			"tier": "NFE",
			"bestTier": "PU",
			"bestName": "Florges"
		},
		"671": {
			"tier": "PU",
			"bestTier": "PU",
			"bestName": "Florges"
		},
		"672": {
			"tier": "LC",
			"bestTier": "ZU",
			"bestName": "Gogoat"
		},
		"673": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Gogoat"
		},
		"674": {
			"tier": "LC",
			"bestTier": "NUBL",
			"bestName": "Pangoro"
		},
		"675": {
			"tier": "NUBL",
			"bestTier": "NUBL",
			"bestName": "Pangoro"
		},
		"676": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Furfrou"
		},
		"677": {
			"tier": "LC",
			"bestTier": "ZU",
			"bestName": "Meowstic-F"
		},
		"678": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Meowstic-F"
		},
		"679": {
			"tier": "LC",
			"bestTier": "UUBL",
			"bestName": "Aegislash"
		},
		"680": {
			"tier": "PU",
			"bestTier": "UUBL",
			"bestName": "Aegislash"
		},
		"681": {
			"tier": "UUBL",
			"bestTier": "UUBL",
			"bestName": "Aegislash"
		},
		"682": {
			"tier": "LC",
			"bestTier": "PU",
			"bestName": "Aromatisse"
		},
		"683": {
			"tier": "PU",
			"bestTier": "PU",
			"bestName": "Aromatisse"
		},
		"684": {
			"tier": "NFE",
			"bestTier": "NUBL",
			"bestName": "Slurpuff"
		},
		"685": {
			"tier": "NUBL",
			"bestTier": "NUBL",
			"bestName": "Slurpuff"
		},
		"686": {
			"tier": "LC",
			"bestTier": "ZU",
			"bestName": "Malamar"
		},
		"687": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Malamar"
		},
		"688": {
			"tier": "LC",
			"bestTier": "NUBL",
			"bestName": "Barbaracle"
		},
		"689": {
			"tier": "NUBL",
			"bestTier": "NUBL",
			"bestName": "Barbaracle"
		},
		"690": {
			"tier": "LC",
			"bestTier": "PUBL",
			"bestName": "Dragalge"
		},
		"691": {
			"tier": "PUBL",
			"bestTier": "PUBL",
			"bestName": "Dragalge"
		},
		"692": {
			"tier": "LC",
			"bestTier": "ZU",
			"bestName": "Clawitzer"
		},
		"693": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Clawitzer"
		},
		"694": {
			"tier": "LC",
			"bestTier": "NU",
			"bestName": "Heliolisk"
		},
		"695": {
			"tier": "NU",
			"bestTier": "NU",
			"bestName": "Heliolisk"
		},
		"696": {
			"tier": "LC",
			"bestTier": "NU",
			"bestName": "Tyrantrum"
		},
		"697": {
			"tier": "NU",
			"bestTier": "NU",
			"bestName": "Tyrantrum"
		},
		"698": {
			"tier": "LC",
			"bestTier": "ZUBL",
			"bestName": "Aurorus"
		},
		"699": {
			"tier": "ZUBL",
			"bestTier": "ZUBL",
			"bestName": "Aurorus"
		},
		"700": {
			"tier": "NU",
			"bestTier": "RU",
			"bestName": "Umbreon"
		},
		"701": {
			"tier": "UU",
			"bestTier": "UU",
			"bestName": "Hawlucha"
		},
		"702": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Dedenne"
		},
		"703": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Carbink"
		},
		"704": {
			"tier": "LC",
			"bestTier": "RU",
			"bestName": "Goodra-Hisui"
		},
		"705": {
			"tier": "NFE",
			"bestTier": "RU",
			"bestName": "Goodra-Hisui"
		},
		"706": {
			"tier": "PU",
			"bestTier": "RU",
			"bestName": "Goodra-Hisui"
		},
		"707": {
			"tier": "NU",
			"bestTier": "NU",
			"bestName": "Klefki"
		},
		"708": {
			"tier": "LC",
			"bestTier": "ZU",
			"bestName": "Trevenant"
		},
		"709": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Trevenant"
		},
		"710": {
			"tier": "LC",
			"bestTier": "ZU",
			"bestName": "Gourgeist"
		},
		"711": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Gourgeist"
		},
		"712": {
			"tier": "LC",
			"bestTier": "NU",
			"bestName": "Avalugg"
		},
		"713": {
			"tier": "NU",
			"bestTier": "NU",
			"bestName": "Avalugg"
		},
		"714": {
			"tier": "LC",
			"bestTier": "RU",
			"bestName": "Noivern"
		},
		"715": {
			"tier": "RU",
			"bestTier": "RU",
			"bestName": "Noivern"
		},
		"716": {
			"tier": "Uber",
			"bestTier": "Uber",
			"bestName": "Xerneas"
		},
		"717": {
			"tier": "Uber",
			"bestTier": "Uber",
			"bestName": "Yveltal"
		},
		"718": {
			"tier": "Uber",
			"bestTier": "Uber",
			"bestName": "Zygarde"
		},
		"719": {
			"tier": "NU",
			"bestTier": "NU",
			"bestName": "Diancie"
		},
		"720": {
			"tier": "PU",
			"bestTier": "PU",
			"bestName": "Hoopa"
		},
		"721": {
			"tier": "RU",
			"bestTier": "RU",
			"bestName": "Volcanion"
		},
		"722": {
			"tier": "LC",
			"bestTier": "NU",
			"bestName": "Decidueye"
		},
		"723": {
			"tier": "NFE",
			"bestTier": "NU",
			"bestName": "Decidueye"
		},
		"724": {
			"tier": "NU",
			"bestTier": "NU",
			"bestName": "Decidueye"
		},
		"725": {
			"tier": "LC",
			"bestTier": "NU",
			"bestName": "Incineroar"
		},
		"726": {
			"tier": "NFE",
			"bestTier": "NU",
			"bestName": "Incineroar"
		},
		"727": {
			"tier": "NU",
			"bestTier": "NU",
			"bestName": "Incineroar"
		},
		"728": {
			"tier": "LC",
			"bestTier": "OU",
			"bestName": "Primarina"
		},
		"729": {
			"tier": "NFE",
			"bestTier": "OU",
			"bestName": "Primarina"
		},
		"730": {
			"tier": "OU",
			"bestTier": "OU",
			"bestName": "Primarina"
		},
		"731": {
			"tier": "LC",
			"bestTier": "ZU",
			"bestName": "Toucannon"
		},
		"732": {
			"tier": "NFE",
			"bestTier": "ZU",
			"bestName": "Toucannon"
		},
		"733": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Toucannon"
		},
		"734": {
			"tier": "LC",
			"bestTier": "ZU",
			"bestName": "Gumshoos"
		},
		"735": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Gumshoos"
		},
		"736": {
			"tier": "LC",
			"bestTier": "ZU",
			"bestName": "Vikavolt"
		},
		"737": {
			"tier": "NFE",
			"bestTier": "ZU",
			"bestName": "Vikavolt"
		},
		"738": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Vikavolt"
		},
		"739": {
			"tier": "LC",
			"bestTier": "ZU",
			"bestName": "Crabominable"
		},
		"740": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Crabominable"
		},
		"741": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Oricorio"
		},
		"742": {
			"tier": "NFE",
			"bestTier": "RU",
			"bestName": "Ribombee"
		},
		"743": {
			"tier": "RU",
			"bestTier": "RU",
			"bestName": "Ribombee"
		},
		"744": {
			"tier": "LC",
			"bestTier": "ZU",
			"bestName": "Lycanroc-Midnight"
		},
		"745": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Lycanroc-Midnight"
		},
		"746": {
			"tier": "PU",
			"bestTier": "PU",
			"bestName": "Wishiwashi"
		},
		"747": {
			"tier": "LC",
			"bestTier": "UU",
			"bestName": "Toxapex"
		},
		"748": {
			"tier": "UU",
			"bestTier": "UU",
			"bestName": "Toxapex"
		},
		"749": {
			"tier": "LC",
			"bestTier": "PU",
			"bestName": "Mudsdale"
		},
		"750": {
			"tier": "PU",
			"bestTier": "PU",
			"bestName": "Mudsdale"
		},
		"751": {
			"tier": "LC",
			"bestTier": "OU",
			"bestName": "Araquanid"
		},
		"752": {
			"tier": "OU",
			"bestTier": "OU",
			"bestName": "Araquanid"
		},
		"753": {
			"tier": "LC",
			"bestTier": "ZU",
			"bestName": "Lurantis"
		},
		"754": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Lurantis"
		},
		"755": {
			"tier": "LC",
			"bestTier": "ZU",
			"bestName": "Shiinotic"
		},
		"756": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Shiinotic"
		},
		"757": {
			"tier": "LC",
			"bestTier": "PU",
			"bestName": "Salazzle"
		},
		"758": {
			"tier": "PU",
			"bestTier": "PU",
			"bestName": "Salazzle"
		},
		"759": {
			"tier": "LC",
			"bestTier": "NUBL",
			"bestName": "Bewear"
		},
		"760": {
			"tier": "NUBL",
			"bestTier": "NUBL",
			"bestName": "Bewear"
		},
		"761": {
			"tier": "LC",
			"bestTier": "NU",
			"bestName": "Tsareena"
		},
		"762": {
			"tier": "NFE",
			"bestTier": "NU",
			"bestName": "Tsareena"
		},
		"763": {
			"tier": "NU",
			"bestTier": "NU",
			"bestName": "Tsareena"
		},
		"764": {
			"tier": "UU",
			"bestTier": "UU",
			"bestName": "Comfey"
		},
		"765": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Oranguru"
		},
		"766": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Passimian"
		},
		"767": {
			"tier": "LC",
			"bestTier": "RU",
			"bestName": "Golisopod"
		},
		"768": {
			"tier": "RU",
			"bestTier": "RU",
			"bestName": "Golisopod"
		},
		"769": {
			"tier": "LC",
			"bestTier": "PU",
			"bestName": "Palossand"
		},
		"770": {
			"tier": "PU",
			"bestTier": "PU",
			"bestName": "Palossand"
		},
		"771": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Pyukumuku"
		},
		"772": {
			"tier": "NFE",
			"bestTier": "ZU",
			"bestName": "Silvally"
		},
		"773": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Silvally"
		},
		"774": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Minior"
		},
		"775": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Komala"
		},
		"776": {
			"tier": "ZUBL",
			"bestTier": "ZUBL",
			"bestName": "Turtonator"
		},
		"777": {
			"tier": "PU",
			"bestTier": "PU",
			"bestName": "Togedemaru"
		},
		"778": {
			"tier": "RU",
			"bestTier": "RU",
			"bestName": "Mimikyu"
		},
		"779": {
			"tier": "PU",
			"bestTier": "PU",
			"bestName": "Bruxish"
		},
		"780": {
			"tier": "PUBL",
			"bestTier": "PUBL",
			"bestName": "Drampa"
		},
		"781": {
			"tier": "NU",
			"bestTier": "NU",
			"bestName": "Dhelmise"
		},
		"782": {
			"tier": "LC",
			"bestTier": "UUBL",
			"bestName": "Kommo-o"
		},
		"783": {
			"tier": "NFE",
			"bestTier": "UUBL",
			"bestName": "Kommo-o"
		},
		"784": {
			"tier": "UUBL",
			"bestTier": "UUBL",
			"bestName": "Kommo-o"
		},
		"785": {
			"tier": "OU",
			"bestTier": "OU",
			"bestName": "Tapu Koko"
		},
		"786": {
			"tier": "OU",
			"bestTier": "OU",
			"bestName": "Tapu Lele"
		},
		"787": {
			"tier": "UU",
			"bestTier": "UU",
			"bestName": "Tapu Bulu"
		},
		"788": {
			"tier": "OU",
			"bestTier": "OU",
			"bestName": "Tapu Fini"
		},
		"789": {
			"tier": "LC",
			"bestTier": "Uber",
			"bestName": "Lunala"
		},
		"790": {
			"tier": "NFE",
			"bestTier": "Uber",
			"bestName": "Lunala"
		},
		"791": {
			"tier": "Uber",
			"bestTier": "Uber",
			"bestName": "Lunala"
		},
		"792": {
			"tier": "Uber",
			"bestTier": "Uber",
			"bestName": "Lunala"
		},
		"793": {
			"tier": "UU",
			"bestTier": "UU",
			"bestName": "Nihilego"
		},
		"794": {
			"tier": "OU",
			"bestTier": "OU",
			"bestName": "Buzzwole"
		},
		"795": {
			"tier": "Uber",
			"bestTier": "Uber",
			"bestName": "Pheromosa"
		},
		"796": {
			"tier": "RU",
			"bestTier": "RU",
			"bestName": "Xurkitree"
		},
		"797": {
			"tier": "UU",
			"bestTier": "UU",
			"bestName": "Celesteela"
		},
		"798": {
			"tier": "OU",
			"bestTier": "OU",
			"bestName": "Kartana"
		},
		"799": {
			"tier": "PUBL",
			"bestTier": "PUBL",
			"bestName": "Guzzlord"
		},
		"800": {
			"tier": "NUBL",
			"bestTier": "NUBL",
			"bestName": "Necrozma"
		},
		"801": {
			"tier": "Uber",
			"bestTier": "Uber",
			"bestName": "Magearna"
		},
		"802": {
			"tier": "Uber",
			"bestTier": "Uber",
			"bestName": "Marshadow"
		},
		"803": {
			"tier": "NFE",
			"bestTier": "Uber",
			"bestName": "Naganadel"
		},
		"804": {
			"tier": "Uber",
			"bestTier": "Uber",
			"bestName": "Naganadel"
		},
		"805": {
			"tier": "NU",
			"bestTier": "NU",
			"bestName": "Stakataka"
		},
		"806": {
			"tier": "OU",
			"bestTier": "OU",
			"bestName": "Blacephalon"
		},
		"807": {
			"tier": "OU",
			"bestTier": "OU",
			"bestName": "Zeraora"
		},
		"808": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Meltan"
		},
		"809": {
			"tier": "OU",
			"bestTier": "OU",
			"bestName": "Melmetal"
		},
		"810": {
			"tier": "LC",
			"bestTier": "UUBL",
			"bestName": "Rillaboom"
		},
		"811": {
			"tier": "NFE",
			"bestTier": "UUBL",
			"bestName": "Rillaboom"
		},
		"812": {
			"tier": "UUBL",
			"bestTier": "UUBL",
			"bestName": "Rillaboom"
		},
		"813": {
			"tier": "LC",
			"bestTier": "OU",
			"bestName": "Cinderace"
		},
		"814": {
			"tier": "NFE",
			"bestTier": "OU",
			"bestName": "Cinderace"
		},
		"815": {
			"tier": "OU",
			"bestTier": "OU",
			"bestName": "Cinderace"
		},
		"816": {
			"tier": "LC",
			"bestTier": "NU",
			"bestName": "Inteleon"
		},
		"817": {
			"tier": "NFE",
			"bestTier": "NU",
			"bestName": "Inteleon"
		},
		"818": {
			"tier": "NU",
			"bestTier": "NU",
			"bestName": "Inteleon"
		},
		"819": {
			"tier": "LC",
			"bestTier": "ZU",
			"bestName": "Greedent"
		},
		"820": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Greedent"
		},
		"821": {
			"tier": "LC",
			"bestTier": "OU",
			"bestName": "Corviknight"
		},
		"822": {
			"tier": "NFE",
			"bestTier": "OU",
			"bestName": "Corviknight"
		},
		"823": {
			"tier": "OU",
			"bestTier": "OU",
			"bestName": "Corviknight"
		},
		"824": {
			"tier": "LC",
			"bestTier": "ZU",
			"bestName": "Orbeetle"
		},
		"825": {
			"tier": "NFE",
			"bestTier": "ZU",
			"bestName": "Orbeetle"
		},
		"826": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Orbeetle"
		},
		"827": {
			"tier": "LC",
			"bestTier": "ZU",
			"bestName": "Thievul"
		},
		"828": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Thievul"
		},
		"829": {
			"tier": "LC",
			"bestTier": "PU",
			"bestName": "Eldegoss"
		},
		"830": {
			"tier": "PU",
			"bestTier": "PU",
			"bestName": "Eldegoss"
		},
		"831": {
			"tier": "LC",
			"bestTier": "ZU",
			"bestName": "Dubwool"
		},
		"832": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Dubwool"
		},
		"833": {
			"tier": "LC",
			"bestTier": "NU",
			"bestName": "Drednaw"
		},
		"834": {
			"tier": "NU",
			"bestTier": "NU",
			"bestName": "Drednaw"
		},
		"835": {
			"tier": "LC",
			"bestTier": "ZU",
			"bestName": "Boltund"
		},
		"836": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Boltund"
		},
		"837": {
			"tier": "LC",
			"bestTier": "PU",
			"bestName": "Coalossal"
		},
		"838": {
			"tier": "NFE",
			"bestTier": "PU",
			"bestName": "Coalossal"
		},
		"839": {
			"tier": "PU",
			"bestTier": "PU",
			"bestName": "Coalossal"
		},
		"840": {
			"tier": "LC",
			"bestTier": "UU",
			"bestName": "Hydrapple"
		},
		"841": {
			"tier": "ZU",
			"bestTier": "UU",
			"bestName": "Hydrapple"
		},
		"842": {
			"tier": "ZU",
			"bestTier": "UU",
			"bestName": "Hydrapple"
		},
		"843": {
			"tier": "LC",
			"bestTier": "ZU",
			"bestName": "Sandaconda"
		},
		"844": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Sandaconda"
		},
		"845": {
			"tier": "PU",
			"bestTier": "PU",
			"bestName": "Cramorant"
		},
		"846": {
			"tier": "LC",
			"bestTier": "NU",
			"bestName": "Barraskewda"
		},
		"847": {
			"tier": "NU",
			"bestTier": "NU",
			"bestName": "Barraskewda"
		},
		"848": {
			"tier": "LC",
			"bestTier": "NU",
			"bestName": "Toxtricity-Low-Key"
		},
		"849": {
			"tier": "NU",
			"bestTier": "NU",
			"bestName": "Toxtricity-Low-Key"
		},
		"850": {
			"tier": "LC",
			"bestTier": "ZUBL",
			"bestName": "Centiskorch"
		},
		"851": {
			"tier": "ZUBL",
			"bestTier": "ZUBL",
			"bestName": "Centiskorch"
		},
		"852": {
			"tier": "LC",
			"bestTier": "ZU",
			"bestName": "Grapploct"
		},
		"853": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Grapploct"
		},
		"854": {
			"tier": "LC",
			"bestTier": "UUBL",
			"bestName": "Polteageist"
		},
		"855": {
			"tier": "UUBL",
			"bestTier": "UUBL",
			"bestName": "Polteageist"
		},
		"856": {
			"tier": "LC",
			"bestTier": "OU",
			"bestName": "Hatterene"
		},
		"857": {
			"tier": "ZU",
			"bestTier": "OU",
			"bestName": "Hatterene"
		},
		"858": {
			"tier": "OU",
			"bestTier": "OU",
			"bestName": "Hatterene"
		},
		"859": {
			"tier": "LC",
			"bestTier": "PU",
			"bestName": "Grimmsnarl"
		},
		"860": {
			"tier": "NFE",
			"bestTier": "PU",
			"bestName": "Grimmsnarl"
		},
		"861": {
			"tier": "PU",
			"bestTier": "PU",
			"bestName": "Grimmsnarl"
		},
		"862": {
			"tier": "RUBL",
			"bestTier": "RUBL",
			"bestName": "Obstagoon"
		},
		"863": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Perrserker"
		},
		"864": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Cursola"
		},
		"865": {
			"tier": "NUBL",
			"bestTier": "NUBL",
			"bestName": "Sirfetch’d"
		},
		"866": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Mr. Rime"
		},
		"867": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Runerigus"
		},
		"868": {
			"tier": "LC",
			"bestTier": "ZUBL",
			"bestName": "Alcremie"
		},
		"869": {
			"tier": "ZUBL",
			"bestTier": "ZUBL",
			"bestName": "Alcremie"
		},
		"870": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Falinks"
		},
		"871": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Pincurchin"
		},
		"872": {
			"tier": "LC",
			"bestTier": "PU",
			"bestName": "Frosmoth"
		},
		"873": {
			"tier": "PU",
			"bestTier": "PU",
			"bestName": "Frosmoth"
		},
		"874": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Stonjourner"
		},
		"875": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Eiscue"
		},
		"876": {
			"tier": "PUBL",
			"bestTier": "PUBL",
			"bestName": "Indeedee"
		},
		"877": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Morpeko"
		},
		"878": {
			"tier": "LC",
			"bestTier": "NU",
			"bestName": "Copperajah"
		},
		"879": {
			"tier": "NU",
			"bestTier": "NU",
			"bestName": "Copperajah"
		},
		"880": {
			"tier": "UUBL",
			"bestTier": "UUBL",
			"bestName": "Dracozolt"
		},
		"881": {
			"tier": "UUBL",
			"bestTier": "UUBL",
			"bestName": "Arctozolt"
		},
		"882": {
			"tier": "Uber",
			"bestTier": "Uber",
			"bestName": "Dracovish"
		},
		"883": {
			"tier": "ZUBL",
			"bestTier": "ZUBL",
			"bestName": "Arctovish"
		},
		"884": {
			"tier": "PU",
			"bestTier": "Uber",
			"bestName": "Archaludon"
		},
		"885": {
			"tier": "LC",
			"bestTier": "OU",
			"bestName": "Dragapult"
		},
		"886": {
			"tier": "NFE",
			"bestTier": "OU",
			"bestName": "Dragapult"
		},
		"887": {
			"tier": "OU",
			"bestTier": "OU",
			"bestName": "Dragapult"
		},
		"888": {
			"tier": "Uber",
			"bestTier": "Uber",
			"bestName": "Zacian"
		},
		"889": {
			"tier": "OU",
			"bestTier": "OU",
			"bestName": "Zamazenta"
		},
		"890": {
			"tier": "Uber",
			"bestTier": "Uber",
			"bestName": "Eternatus"
		},
		"891": {
			"tier": "NFE",
			"bestTier": "Uber",
			"bestName": "Urshifu-Rapid-Strike"
		},
		"892": {
			"tier": "Uber",
			"bestTier": "Uber",
			"bestName": "Urshifu-Rapid-Strike"
		},
		"893": {
			"tier": "UU",
			"bestTier": "UU",
			"bestName": "Zarude"
		},
		"894": {
			"tier": "Uber",
			"bestTier": "Uber",
			"bestName": "Regieleki"
		},
		"895": {
			"tier": "NUBL",
			"bestTier": "NUBL",
			"bestName": "Regidrago"
		},
		"896": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Glastrier"
		},
		"897": {
			"tier": "Uber",
			"bestTier": "Uber",
			"bestName": "Spectrier"
		},
		"898": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Calyrex"
		},
		"899": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Wyrdeer"
		},
		"900": {
			"tier": "RU",
			"bestTier": "OU",
			"bestName": "Scizor"
		},
		"901": {
			"tier": "UUBL",
			"bestTier": "UUBL",
			"bestName": "Ursaluna"
		},
		"902": {
			"tier": "NU",
			"bestTier": "RU",
			"bestName": "Basculegion-F"
		},
		"903": {
			"tier": "Uber",
			"bestTier": "Uber",
			"bestName": "Sneasler"
		},
		"904": {
			"tier": "NU",
			"bestTier": "NU",
			"bestName": "Overqwil"
		},
		"905": {
			"tier": "OU",
			"bestTier": "OU",
			"bestName": "Enamorus"
		},
		"906": {
			"tier": "LC",
			"bestTier": "UUBL",
			"bestName": "Meowscarada"
		},
		"907": {
			"tier": "NFE",
			"bestTier": "UUBL",
			"bestName": "Meowscarada"
		},
		"908": {
			"tier": "UUBL",
			"bestTier": "UUBL",
			"bestName": "Meowscarada"
		},
		"909": {
			"tier": "LC",
			"bestTier": "UU",
			"bestName": "Skeledirge"
		},
		"910": {
			"tier": "NFE",
			"bestTier": "UU",
			"bestName": "Skeledirge"
		},
		"911": {
			"tier": "UU",
			"bestTier": "UU",
			"bestName": "Skeledirge"
		},
		"912": {
			"tier": "LC",
			"bestTier": "UUBL",
			"bestName": "Quaquaval"
		},
		"913": {
			"tier": "NFE",
			"bestTier": "UUBL",
			"bestName": "Quaquaval"
		},
		"914": {
			"tier": "UUBL",
			"bestTier": "UUBL",
			"bestName": "Quaquaval"
		},
		"915": {
			"tier": "LC",
			"bestTier": "ZU",
			"bestName": "Oinkologne-F"
		},
		"916": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Oinkologne-F"
		},
		"917": {
			"tier": "LC",
			"bestTier": "ZU",
			"bestName": "Spidops"
		},
		"918": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Spidops"
		},
		"919": {
			"tier": "LC",
			"bestTier": "UU",
			"bestName": "Lokix"
		},
		"920": {
			"tier": "UU",
			"bestTier": "UU",
			"bestName": "Lokix"
		},
		"921": {
			"tier": "LC",
			"bestTier": "PU",
			"bestName": "Pawmot"
		},
		"922": {
			"tier": "NFE",
			"bestTier": "PU",
			"bestName": "Pawmot"
		},
		"923": {
			"tier": "PU",
			"bestTier": "PU",
			"bestName": "Pawmot"
		},
		"924": {
			"tier": "LC",
			"bestTier": "RU",
			"bestName": "Maushold-Four"
		},
		"925": {
			"tier": "RU",
			"bestTier": "RU",
			"bestName": "Maushold-Four"
		},
		"926": {
			"tier": "LC",
			"bestTier": "ZU",
			"bestName": "Dachsbun"
		},
		"927": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Dachsbun"
		},
		"928": {
			"tier": "LC",
			"bestTier": "ZU",
			"bestName": "Arboliva"
		},
		"929": {
			"tier": "NFE",
			"bestTier": "ZU",
			"bestName": "Arboliva"
		},
		"930": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Arboliva"
		},
		"931": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Squawkabilly"
		},
		"932": {
			"tier": "LC",
			"bestTier": "OU",
			"bestName": "Garganacl"
		},
		"933": {
			"tier": "NFE",
			"bestTier": "OU",
			"bestName": "Garganacl"
		},
		"934": {
			"tier": "OU",
			"bestTier": "OU",
			"bestName": "Garganacl"
		},
		"935": {
			"tier": "LC",
			"bestTier": "OU",
			"bestName": "Ceruledge"
		},
		"936": {
			"tier": "RU",
			"bestTier": "OU",
			"bestName": "Ceruledge"
		},
		"937": {
			"tier": "OU",
			"bestTier": "OU",
			"bestName": "Ceruledge"
		},
		"938": {
			"tier": "LC",
			"bestTier": "NU",
			"bestName": "Bellibolt"
		},
		"939": {
			"tier": "NU",
			"bestTier": "NU",
			"bestName": "Bellibolt"
		},
		"940": {
			"tier": "LC",
			"bestTier": "NU",
			"bestName": "Kilowattrel"
		},
		"941": {
			"tier": "NU",
			"bestTier": "NU",
			"bestName": "Kilowattrel"
		},
		"942": {
			"tier": "LC",
			"bestTier": "ZU",
			"bestName": "Mabosstiff"
		},
		"943": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Mabosstiff"
		},
		"944": {
			"tier": "LC",
			"bestTier": "PU",
			"bestName": "Grafaiai"
		},
		"945": {
			"tier": "PU",
			"bestTier": "PU",
			"bestName": "Grafaiai"
		},
		"946": {
			"tier": "LC",
			"bestTier": "NU",
			"bestName": "Brambleghast"
		},
		"947": {
			"tier": "NU",
			"bestTier": "NU",
			"bestName": "Brambleghast"
		},
		"948": {
			"tier": "LC",
			"bestTier": "ZU",
			"bestName": "Toedscruel"
		},
		"949": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Toedscruel"
		},
		"950": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Klawf"
		},
		"951": {
			"tier": "LC",
			"bestTier": "ZU",
			"bestName": "Scovillain"
		},
		"952": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Scovillain"
		},
		"953": {
			"tier": "LC",
			"bestTier": "ZU",
			"bestName": "Rabsca"
		},
		"954": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Rabsca"
		},
		"955": {
			"tier": "NFE",
			"bestTier": "Uber",
			"bestName": "Espathra"
		},
		"956": {
			"tier": "Uber",
			"bestTier": "Uber",
			"bestName": "Espathra"
		},
		"957": {
			"tier": "LC",
			"bestTier": "UU",
			"bestName": "Tinkaton"
		},
		"958": {
			"tier": "NFE",
			"bestTier": "UU",
			"bestName": "Tinkaton"
		},
		"959": {
			"tier": "UU",
			"bestTier": "UU",
			"bestName": "Tinkaton"
		},
		"960": {
			"tier": "LC",
			"bestTier": "ZU",
			"bestName": "Wugtrio"
		},
		"961": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Wugtrio"
		},
		"962": {
			"tier": "PU",
			"bestTier": "PU",
			"bestName": "Bombirdier"
		},
		"963": {
			"tier": "LC",
			"bestTier": "Uber",
			"bestName": "Palafin"
		},
		"964": {
			"tier": "Uber",
			"bestTier": "Uber",
			"bestName": "Palafin"
		},
		"965": {
			"tier": "LC",
			"bestTier": "UU",
			"bestName": "Revavroom"
		},
		"966": {
			"tier": "UU",
			"bestTier": "UU",
			"bestName": "Revavroom"
		},
		"967": {
			"tier": "RU",
			"bestTier": "RU",
			"bestName": "Cyclizar"
		},
		"968": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Orthworm"
		},
		"969": {
			"tier": "LC",
			"bestTier": "OU",
			"bestName": "Glimmora"
		},
		"970": {
			"tier": "OU",
			"bestTier": "OU",
			"bestName": "Glimmora"
		},
		"971": {
			"tier": "LC",
			"bestTier": "PU",
			"bestName": "Houndstone"
		},
		"972": {
			"tier": "PU",
			"bestTier": "PU",
			"bestName": "Houndstone"
		},
		"973": {
			"tier": "NU",
			"bestTier": "NU",
			"bestName": "Flamigo"
		},
		"974": {
			"tier": "LC",
			"bestTier": "NUBL",
			"bestName": "Cetitan"
		},
		"975": {
			"tier": "NUBL",
			"bestTier": "NUBL",
			"bestName": "Cetitan"
		},
		"976": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Veluza"
		},
		"977": {
			"tier": "OU",
			"bestTier": "OU",
			"bestName": "Dondozo"
		},
		"978": {
			"tier": "PU",
			"bestTier": "PU",
			"bestName": "Tatsugiri"
		},
		"979": {
			"tier": "Uber",
			"bestTier": "Uber",
			"bestName": "Annihilape"
		},
		"980": {
			"tier": "UU",
			"bestTier": "UU",
			"bestName": "Clodsire"
		},
		"981": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Farigiraf"
		},
		"982": {
			"tier": "PU",
			"bestTier": "PU",
			"bestName": "Dudunsparce-Three-Segment"
		},
		"983": {
			"tier": "OU",
			"bestTier": "OU",
			"bestName": "Kingambit"
		},
		"984": {
			"tier": "OU",
			"bestTier": "OU",
			"bestName": "Great Tusk"
		},
		"985": {
			"tier": "NU",
			"bestTier": "NU",
			"bestName": "Scream Tail"
		},
		"986": {
			"tier": "PU",
			"bestTier": "PU",
			"bestName": "Brute Bonnet"
		},
		"987": {
			"tier": "Uber",
			"bestTier": "Uber",
			"bestName": "Flutter Mane"
		},
		"988": {
			"tier": "UU",
			"bestTier": "UU",
			"bestName": "Slither Wing"
		},
		"989": {
			"tier": "UU",
			"bestTier": "UU",
			"bestName": "Sandy Shocks"
		},
		"990": {
			"tier": "OU",
			"bestTier": "OU",
			"bestName": "Iron Treads"
		},
		"991": {
			"tier": "Uber",
			"bestTier": "Uber",
			"bestName": "Iron Bundle"
		},
		"992": {
			"tier": "UUBL",
			"bestTier": "UUBL",
			"bestName": "Iron Hands"
		},
		"993": {
			"tier": "UU",
			"bestTier": "UU",
			"bestName": "Iron Jugulis"
		},
		"994": {
			"tier": "OU",
			"bestTier": "OU",
			"bestName": "Iron Moth"
		},
		"995": {
			"tier": "NUBL",
			"bestTier": "NUBL",
			"bestName": "Iron Thorns"
		},
		"996": {
			"tier": "LC",
			"bestTier": "Uber",
			"bestName": "Baxcalibur"
		},
		"997": {
			"tier": "NFE",
			"bestTier": "Uber",
			"bestName": "Baxcalibur"
		},
		"998": {
			"tier": "Uber",
			"bestTier": "Uber",
			"bestName": "Baxcalibur"
		},
		"999": {
			"tier": "LC",
			"bestTier": "OU",
			"bestName": "Gholdengo"
		},
		"1000": {
			"tier": "OU",
			"bestTier": "OU",
			"bestName": "Gholdengo"
		},
		"1001": {
			"tier": "PU",
			"bestTier": "PU",
			"bestName": "Wo-Chien"
		},
		"1002": {
			"tier": "Uber",
			"bestTier": "Uber",
			"bestName": "Chien-Pao"
		},
		"1003": {
			"tier": "OU",
			"bestTier": "OU",
			"bestName": "Ting-Lu"
		},
		"1004": {
			"tier": "Uber",
			"bestTier": "Uber",
			"bestName": "Chi-Yu"
		},
		"1005": {
			"tier": "Uber",
			"bestTier": "Uber",
			"bestName": "Roaring Moon"
		},
		"1006": {
			"tier": "OU",
			"bestTier": "OU",
			"bestName": "Iron Valiant"
		},
		"1007": {
			"tier": "Uber",
			"bestTier": "Uber",
			"bestName": "Koraidon"
		},
		"1008": {
			"tier": "AG",
			"bestTier": "AG",
			"bestName": "Miraidon"
		},
		"1009": {
			"tier": "OU",
			"bestTier": "OU",
			"bestName": "Walking Wake"
		},
		"1010": {
			"tier": "RUBL",
			"bestTier": "RUBL",
			"bestName": "Iron Leaves"
		},
		"1011": {
			"tier": "ZU",
			"bestTier": "UU",
			"bestName": "Hydrapple"
		},
		"1012": {
			"tier": "LC",
			"bestTier": "UU",
			"bestName": "Sinistcha"
		},
		"1013": {
			"tier": "UU",
			"bestTier": "UU",
			"bestName": "Sinistcha"
		},
		"1014": {
			"tier": "UUBL",
			"bestTier": "UUBL",
			"bestName": "Okidogi"
		},
		"1015": {
			"tier": "NU",
			"bestTier": "NU",
			"bestName": "Munkidori"
		},
		"1016": {
			"tier": "UU",
			"bestTier": "UU",
			"bestName": "Fezandipiti"
		},
		"1017": {
			"tier": "RUBL",
			"bestTier": "RUBL",
			"bestName": "Ogerpon"
		},
		"1018": {
			"tier": "Uber",
			"bestTier": "Uber",
			"bestName": "Archaludon"
		},
		"1019": {
			"tier": "UU",
			"bestTier": "UU",
			"bestName": "Hydrapple"
		},
		"1020": {
			"tier": "Uber",
			"bestTier": "Uber",
			"bestName": "Gouging Fire"
		},
		"1021": {
			"tier": "OU",
			"bestTier": "OU",
			"bestName": "Raging Bolt"
		},
		"1022": {
			"tier": "UUBL",
			"bestTier": "UUBL",
			"bestName": "Iron Boulder"
		},
		"1023": {
			"tier": "OU",
			"bestTier": "OU",
			"bestName": "Iron Crown"
		},
		"1024": {
			"tier": "Uber",
			"bestTier": "Uber",
			"bestName": "Terapagos"
		},
		"1025": {
			"tier": "OU",
			"bestTier": "OU",
			"bestName": "Pecharunt"
		},
		"19:alola": {
			"tier": "LC",
			"bestTier": "ZUBL",
			"bestName": "Raticate-Alola"
		},
		"20:alola": {
			"tier": "ZUBL",
			"bestTier": "ZUBL",
			"bestName": "Raticate-Alola"
		},
		"25:alola": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Pikachu-Alola"
		},
		"26:alola": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Raichu-Alola"
		},
		"27:alola": {
			"tier": "LC",
			"bestTier": "PU",
			"bestName": "Sandslash-Alola"
		},
		"28:alola": {
			"tier": "PU",
			"bestTier": "PU",
			"bestName": "Sandslash-Alola"
		},
		"37:alola": {
			"tier": "NFE",
			"bestTier": "NU",
			"bestName": "Ninetales-Alola"
		},
		"38:alola": {
			"tier": "NU",
			"bestTier": "NU",
			"bestName": "Ninetales-Alola"
		},
		"50:alola": {
			"tier": "LC",
			"bestTier": "ZU",
			"bestName": "Dugtrio-Alola"
		},
		"51:alola": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Dugtrio-Alola"
		},
		"52:alola": {
			"tier": "LC",
			"bestTier": "ZU",
			"bestName": "Persian-Alola"
		},
		"52:galar": {
			"tier": "LC",
			"bestTier": "ZU",
			"bestName": "Perrserker"
		},
		"53:alola": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Persian-Alola"
		},
		"58:hisui": {
			"tier": "LC",
			"bestTier": "UU",
			"bestName": "Arcanine-Hisui"
		},
		"59:hisui": {
			"tier": "UU",
			"bestTier": "UU",
			"bestName": "Arcanine-Hisui"
		},
		"74:alola": {
			"tier": "LC",
			"bestTier": "ZU",
			"bestName": "Golem-Alola"
		},
		"75:alola": {
			"tier": "NFE",
			"bestTier": "ZU",
			"bestName": "Golem-Alola"
		},
		"76:alola": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Golem-Alola"
		},
		"77:galar": {
			"tier": "LC",
			"bestTier": "ZU",
			"bestName": "Rapidash-Galar"
		},
		"78:galar": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Rapidash-Galar"
		},
		"79:galar": {
			"tier": "LC",
			"bestTier": "OU",
			"bestName": "Slowking-Galar"
		},
		"80:galar": {
			"tier": "PU",
			"bestTier": "OU",
			"bestName": "Slowking-Galar"
		},
		"83:galar": {
			"tier": "LC",
			"bestTier": "NUBL",
			"bestName": "Sirfetch’d"
		},
		"88:alola": {
			"tier": "LC",
			"bestTier": "RU",
			"bestName": "Muk-Alola"
		},
		"89:alola": {
			"tier": "RU",
			"bestTier": "RU",
			"bestName": "Muk-Alola"
		},
		"100:hisui": {
			"tier": "NFE",
			"bestTier": "ZUBL",
			"bestName": "Electrode-Hisui"
		},
		"101:hisui": {
			"tier": "ZUBL",
			"bestTier": "ZUBL",
			"bestName": "Electrode-Hisui"
		},
		"103:alola": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Exeggutor-Alola"
		},
		"105:alola": {
			"tier": "RU",
			"bestTier": "RU",
			"bestName": "Marowak-Alola"
		},
		"110:galar": {
			"tier": "OU",
			"bestTier": "OU",
			"bestName": "Weezing-Galar"
		},
		"122:galar": {
			"tier": "NFE",
			"bestTier": "ZU",
			"bestName": "Mr. Rime"
		},
		"128:paldea": {
			"tier": "NU",
			"bestTier": "NU",
			"bestName": "Tauros-Paldea-Aqua"
		},
		"144:galar": {
			"tier": "PU",
			"bestTier": "PU",
			"bestName": "Articuno-Galar"
		},
		"145:galar": {
			"tier": "RU",
			"bestTier": "RU",
			"bestName": "Zapdos-Galar"
		},
		"146:galar": {
			"tier": "UUBL",
			"bestTier": "UUBL",
			"bestName": "Moltres-Galar"
		},
		"157:hisui": {
			"tier": "PU",
			"bestTier": "PU",
			"bestName": "Typhlosion-Hisui"
		},
		"194:paldea": {
			"tier": "LC",
			"bestTier": "UU",
			"bestName": "Clodsire"
		},
		"199:galar": {
			"tier": "OU",
			"bestTier": "OU",
			"bestName": "Slowking-Galar"
		},
		"211:hisui": {
			"tier": "PU",
			"bestTier": "NU",
			"bestName": "Overqwil"
		},
		"215:hisui": {
			"tier": "ZU",
			"bestTier": "Uber",
			"bestName": "Sneasler"
		},
		"222:galar": {
			"tier": "NFE",
			"bestTier": "ZU",
			"bestName": "Cursola"
		},
		"263:galar": {
			"tier": "LC",
			"bestTier": "RUBL",
			"bestName": "Obstagoon"
		},
		"264:galar": {
			"tier": "NFE",
			"bestTier": "RUBL",
			"bestName": "Obstagoon"
		},
		"503:hisui": {
			"tier": "OU",
			"bestTier": "OU",
			"bestName": "Samurott-Hisui"
		},
		"549:hisui": {
			"tier": "NUBL",
			"bestTier": "NUBL",
			"bestName": "Lilligant-Hisui"
		},
		"554:galar": {
			"tier": "LC",
			"bestTier": "Uber",
			"bestName": "Darmanitan-Galar"
		},
		"555:galar": {
			"tier": "Uber",
			"bestTier": "Uber",
			"bestName": "Darmanitan-Galar"
		},
		"562:galar": {
			"tier": "LC",
			"bestTier": "ZU",
			"bestName": "Runerigus"
		},
		"570:hisui": {
			"tier": "LC",
			"bestTier": "RUBL",
			"bestName": "Zoroark-Hisui"
		},
		"571:hisui": {
			"tier": "RUBL",
			"bestTier": "RUBL",
			"bestName": "Zoroark-Hisui"
		},
		"618:galar": {
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Stunfisk-Galar"
		},
		"628:hisui": {
			"tier": "PU",
			"bestTier": "NU",
			"bestName": "Braviary"
		},
		"705:hisui": {
			"tier": "NFE",
			"bestTier": "RU",
			"bestName": "Goodra-Hisui"
		},
		"706:hisui": {
			"tier": "RU",
			"bestTier": "RU",
			"bestName": "Goodra-Hisui"
		},
		"713:hisui": {
			"tier": "PU",
			"bestTier": "NU",
			"bestName": "Avalugg"
		},
		"724:hisui": {
			"tier": "PU",
			"bestTier": "NU",
			"bestName": "Decidueye"
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
	var UNKNOWN = "?";
	function shortLabel(resolved) {
		return resolved.bestTier ?? UNKNOWN;
	}
	function fullLabel(resolved) {
		if (!resolved.bestTier) return UNKNOWN;
		const current = resolved.tier ?? UNKNOWN;
		if (resolved.tier === resolved.bestTier) return resolved.bestTier;
		const evolution = resolved.bestName ? ` (${resolved.bestName})` : "";
		return `${current} → ${resolved.bestTier}${evolution}`;
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
	var EMPTY = {
		tier: null,
		bestTier: null,
		bestName: null
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
			bestName: entry.bestName
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
