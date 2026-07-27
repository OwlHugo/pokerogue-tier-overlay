// ==UserScript==
// @name         PokeRogue Tier Overlay
// @namespace    https://github.com/hugoadriano/pokerogue-tier-overlay
// @version      2.0.0
// @description  Mostra o melhor tier competitivo do Smogon que a linha evolutiva de cada Pokemon alcanca, na batalha e na selecao de starter
// @license      AGPL-3.0-only
// @icon         https://pokerogue.net/logo512.png
// @homepageURL  https://github.com/hugoadriano/pokerogue-tier-overlay
// @supportURL   https://github.com/hugoadriano/pokerogue-tier-overlay/issues
// @match        https://pokerogue.net/*
// @grant        none
// @run-at       document-start
// ==/UserScript==

(function() {
	"use strict";
	var BIOME_TABLE = {
		"0": {
			"name": "TOWN",
			"pools": {
				"COMMON": [
					10,
					13,
					16,
					19,
					21,
					161,
					163,
					165,
					167,
					187,
					191,
					261,
					263,
					265,
					266,
					268,
					276,
					396,
					399,
					504,
					506,
					509,
					519,
					546,
					661,
					664,
					734,
					819,
					824,
					831,
					915
				],
				"UNCOMMON": [
					23,
					29,
					32,
					43,
					46,
					48,
					52,
					69,
					261,
					270,
					273,
					285,
					293,
					300,
					401,
					415,
					420,
					543,
					572,
					921,
					926
				],
				"RARE": [
					63,
					173,
					174,
					283,
					440,
					821,
					924
				],
				"SUPER_RARE": [
					133,
					172,
					175,
					280,
					290,
					447
				],
				"ULTRA_RARE": [
					132,
					446,
					570
				]
			},
			"links": [1]
		},
		"1": {
			"name": "PLAINS",
			"pools": {
				"COMMON": [
					41,
					52,
					161,
					261,
					263,
					399,
					734,
					819,
					915
				],
				"UNCOMMON": [
					16,
					21,
					25,
					56,
					84,
					261,
					396,
					519,
					661,
					744,
					827,
					921
				],
				"RARE": [
					63,
					108,
					403,
					427,
					821,
					8128
				],
				"SUPER_RARE": [
					83,
					113,
					133,
					143,
					206
				],
				"ULTRA_RARE": [
					132,
					380,
					381
				],
				"BOSS": [
					53,
					83,
					85,
					143,
					162,
					262,
					264,
					380,
					381,
					400,
					428,
					463,
					735,
					745,
					820,
					916,
					923,
					982,
					8128
				]
			},
			"links": [
				2,
				4,
				9
			]
		},
		"2": {
			"name": "GRASS",
			"pools": {
				"COMMON": [
					187,
					266,
					268,
					285,
					543,
					546,
					548
				],
				"UNCOMMON": [
					108,
					191,
					241,
					273,
					415,
					420,
					590
				],
				"RARE": [
					1,
					58,
					387,
					438,
					714
				],
				"ULTRA_RARE": [640],
				"BOSS": [
					3,
					59,
					185,
					189,
					241,
					389,
					416,
					545,
					547,
					549,
					640,
					715
				]
			},
			"links": [3]
		},
		"3": {
			"name": "TALL_GRASS",
			"pools": {
				"COMMON": [
					29,
					32,
					43,
					46,
					167,
					401,
					664,
					753,
					761,
					919
				],
				"UNCOMMON": [
					37,
					48,
					290,
					335,
					336
				],
				"RARE": [
					127,
					152,
					203,
					352,
					357,
					531,
					624
				],
				"SUPER_RARE": [123, 292],
				"ULTRA_RARE": [243, 244],
				"BOSS": [
					31,
					34,
					45,
					123,
					127,
					154,
					168,
					182,
					243,
					244,
					291,
					335,
					336,
					352,
					402,
					754,
					763,
					920,
					981,
					983
				]
			},
			"links": [5, 13]
		},
		"4": {
			"name": "METROPOLIS",
			"pools": {
				"COMMON": [
					19,
					228,
					263,
					504,
					506,
					835
				],
				"UNCOMMON": [
					25,
					431,
					676,
					677,
					876,
					926,
					931
				],
				"RARE": [
					235,
					351,
					877,
					924,
					965
				],
				"SUPER_RARE": [132, 133],
				"BOSS": [
					351,
					508,
					676,
					678,
					836,
					925,
					927,
					966
				]
			},
			"links": [30]
		},
		"5": {
			"name": "FOREST",
			"pools": {
				"COMMON": [
					12,
					15,
					48,
					69,
					167,
					204,
					267,
					269,
					273,
					285,
					415,
					543,
					548,
					585,
					666,
					917,
					919,
					944
				],
				"UNCOMMON": [
					23,
					163,
					216,
					315,
					412,
					414,
					511,
					540,
					744,
					825
				],
				"RARE": [
					102,
					123,
					214,
					234,
					252,
					357,
					588,
					616,
					650,
					722,
					931,
					948
				],
				"SUPER_RARE": [632, 8901],
				"ULTRA_RARE": [798, 1001],
				"BOSS": [
					49,
					71,
					164,
					168,
					205,
					214,
					234,
					254,
					267,
					269,
					275,
					286,
					413,
					414,
					416,
					512,
					545,
					549,
					586,
					589,
					617,
					632,
					652,
					724,
					745,
					798,
					826,
					898,
					918,
					920,
					945,
					949,
					1001,
					8901
				]
			},
			"links": [16, 27]
		},
		"6": {
			"name": "SEA",
			"pools": {
				"COMMON": [
					72,
					79,
					278,
					320,
					456,
					686,
					845,
					963
				],
				"UNCOMMON": [
					60,
					79,
					90,
					116,
					118,
					120,
					129,
					170,
					318,
					418,
					515,
					940
				],
				"RARE": [
					131,
					393,
					728
				],
				"SUPER_RARE": [230, 564],
				"BOSS": [
					73,
					130,
					230,
					249,
					279,
					319,
					395,
					419,
					457,
					516,
					687,
					730,
					845,
					941,
					964
				]
			},
			"links": [10, 15]
		},
		"7": {
			"name": "SWAMP",
			"pools": {
				"COMMON": [
					23,
					60,
					194,
					270,
					316,
					422,
					535,
					8194
				],
				"UNCOMMON": [
					23,
					54,
					339,
					451,
					453,
					618,
					747
				],
				"RARE": [158, 258],
				"SUPER_RARE": [
					186,
					4079,
					4618,
					6705
				],
				"ULTRA_RARE": [482, 803],
				"BOSS": [
					24,
					62,
					160,
					186,
					195,
					260,
					272,
					317,
					340,
					423,
					482,
					537,
					618,
					748,
					803,
					980,
					4080,
					4199,
					4618,
					6706
				]
			},
			"links": [3, 19]
		},
		"8": {
			"name": "BEACH",
			"pools": {
				"COMMON": [
					90,
					98,
					120,
					341,
					557,
					688,
					747,
					960
				],
				"UNCOMMON": [
					412,
					692,
					769
				],
				"RARE": [912, 978],
				"SUPER_RARE": [564],
				"ULTRA_RARE": [
					488,
					647,
					788
				],
				"BOSS": [
					91,
					99,
					121,
					342,
					413,
					488,
					558,
					565,
					647,
					689,
					693,
					748,
					770,
					788,
					914
				]
			},
			"links": [6, 40]
		},
		"9": {
			"name": "LAKE",
			"pools": {
				"COMMON": [
					54,
					118,
					183,
					194,
					270,
					283,
					580,
					833
				],
				"UNCOMMON": [
					79,
					129,
					746,
					751
				],
				"RARE": [
					7,
					501,
					656,
					816,
					973
				],
				"SUPER_RARE": [
					134,
					199,
					2658
				],
				"ULTRA_RARE": [245, 481],
				"BOSS": [
					9,
					55,
					80,
					119,
					130,
					134,
					184,
					199,
					245,
					284,
					481,
					503,
					581,
					658,
					746,
					752,
					818,
					834,
					2658
				]
			},
			"links": [
				7,
				8,
				26
			]
		},
		"10": {
			"name": "SEABED",
			"pools": {
				"COMMON": [
					170,
					223,
					366,
					550,
					592,
					846,
					976
				],
				"UNCOMMON": [
					72,
					90,
					320,
					370,
					422,
					690,
					871,
					977
				],
				"RARE": [
					211,
					222,
					224,
					349,
					458,
					594,
					602,
					781,
					6550
				],
				"SUPER_RARE": [
					138,
					140,
					369,
					771,
					883,
					4222,
					6211
				],
				"ULTRA_RARE": [793],
				"BOSS": [
					139,
					141,
					171,
					211,
					222,
					224,
					226,
					321,
					350,
					367,
					368,
					369,
					370,
					382,
					593,
					594,
					604,
					691,
					771,
					781,
					793,
					847,
					864,
					883,
					902,
					904,
					977
				]
			},
			"links": [13, 18]
		},
		"11": {
			"name": "MOUNTAIN",
			"pools": {
				"COMMON": [
					16,
					21,
					111,
					276,
					304,
					333,
					396,
					519,
					524,
					661,
					672
				],
				"UNCOMMON": [
					66,
					74,
					111,
					177,
					218,
					304,
					524,
					627,
					629,
					821,
					955,
					962
				],
				"RARE": [
					198,
					227,
					255,
					325,
					701,
					932
				],
				"SUPER_RARE": [
					246,
					408,
					410,
					443,
					567,
					610
				],
				"ULTRA_RARE": [
					641,
					1003,
					1017
				],
				"BOSS": [
					18,
					22,
					227,
					250,
					257,
					277,
					306,
					334,
					398,
					409,
					411,
					521,
					628,
					630,
					641,
					663,
					673,
					701,
					823,
					934,
					956,
					1003,
					1017,
					6628
				]
			},
			"links": [
				18,
				23,
				25
			]
		},
		"12": {
			"name": "BADLANDS",
			"pools": {
				"COMMON": [
					50,
					74,
					104,
					111,
					231,
					529,
					749
				],
				"UNCOMMON": [
					27,
					322,
					524,
					850,
					878,
					951
				],
				"RARE": [
					95,
					207,
					950,
					1012
				],
				"ULTRA_RARE": [645, 1014],
				"BOSS": [
					51,
					76,
					105,
					208,
					232,
					383,
					464,
					472,
					530,
					645,
					750,
					851,
					879,
					952,
					1013,
					1014
				]
			},
			"links": [11, 14]
		},
		"13": {
			"name": "CAVE",
			"pools": {
				"COMMON": [
					41,
					46,
					216,
					293,
					524,
					527,
					659
				],
				"UNCOMMON": [
					74,
					296,
					299,
					714,
					744,
					767
				],
				"RARE": [
					95,
					597,
					703,
					932,
					969
				],
				"SUPER_RARE": [213],
				"ULTRA_RARE": [480],
				"BOSS": [
					47,
					95,
					169,
					213,
					217,
					295,
					476,
					480,
					526,
					528,
					598,
					660,
					715,
					745,
					768,
					934,
					970,
					1024
				]
			},
			"links": [
				9,
				12,
				41
			]
		},
		"14": {
			"name": "DESERT",
			"pools": {
				"COMMON": [
					27,
					328,
					331,
					451,
					694,
					843,
					946,
					953
				],
				"UNCOMMON": [
					207,
					322,
					449,
					551,
					556,
					562,
					968
				],
				"RARE": [
					84,
					554,
					561,
					874
				],
				"SUPER_RARE": [
					345,
					347,
					443
				],
				"ULTRA_RARE": [
					377,
					787,
					795
				],
				"BOSS": [
					28,
					85,
					330,
					332,
					346,
					348,
					377,
					445,
					450,
					452,
					472,
					553,
					555,
					556,
					561,
					563,
					695,
					787,
					795,
					844,
					874,
					947
				]
			},
			"links": [22, 26]
		},
		"15": {
			"name": "ICE_CAVE",
			"pools": {
				"COMMON": [
					86,
					220,
					361,
					582,
					613,
					712,
					739,
					872
				],
				"UNCOMMON": [
					199,
					215,
					238,
					363,
					875,
					974
				],
				"RARE": [
					131,
					225,
					615
				],
				"SUPER_RARE": [698],
				"ULTRA_RARE": [144, 378],
				"BOSS": [
					87,
					124,
					131,
					144,
					362,
					365,
					378,
					461,
					471,
					473,
					478,
					584,
					614,
					615,
					646,
					699,
					713,
					740,
					975
				]
			},
			"links": [31]
		},
		"16": {
			"name": "MEADOW",
			"pools": {
				"COMMON": [
					165,
					315,
					522,
					546,
					572,
					669,
					742,
					829,
					831
				],
				"UNCOMMON": [
					39,
					77,
					179,
					209,
					280,
					300,
					431,
					626,
					741,
					928
				],
				"RARE": [
					128,
					133,
					241,
					313,
					314,
					327,
					840,
					906
				],
				"SUPER_RARE": [113, 700],
				"ULTRA_RARE": [
					492,
					648,
					905
				],
				"BOSS": [
					128,
					166,
					210,
					241,
					242,
					282,
					301,
					407,
					432,
					492,
					523,
					573,
					626,
					648,
					671,
					700,
					743,
					832,
					841,
					842,
					905,
					908,
					930,
					1019,
					6549
				]
			},
			"links": [1, 28]
		},
		"17": {
			"name": "POWER_PLANT",
			"pools": {
				"COMMON": [
					25,
					100,
					309,
					403,
					702,
					736,
					921,
					938
				],
				"UNCOMMON": [
					81,
					125,
					311,
					312,
					417,
					587,
					777
				],
				"RARE": [179, 479],
				"SUPER_RARE": [135, 6100],
				"ULTRA_RARE": [
					145,
					642,
					796,
					807,
					894
				],
				"BOSS": [
					26,
					135,
					145,
					181,
					310,
					405,
					462,
					466,
					642,
					644,
					702,
					738,
					777,
					796,
					807,
					894,
					923,
					939,
					6101
				]
			},
			"links": [21]
		},
		"18": {
			"name": "VOLCANO",
			"pools": {
				"COMMON": [
					37,
					58,
					77,
					218,
					261,
					322,
					325,
					333,
					837
				],
				"UNCOMMON": [
					126,
					307,
					324,
					513,
					631,
					757,
					776,
					2050
				],
				"RARE": [
					4,
					155,
					390,
					498,
					653,
					725,
					813,
					935
				],
				"SUPER_RARE": [
					136,
					636,
					6058
				],
				"ULTRA_RARE": [
					146,
					485,
					721,
					1004
				],
				"BOSS": [
					6,
					38,
					59,
					78,
					136,
					146,
					157,
					219,
					323,
					324,
					392,
					467,
					485,
					500,
					514,
					631,
					637,
					643,
					655,
					721,
					727,
					758,
					776,
					815,
					839,
					936,
					1004,
					2051,
					6059
				]
			},
			"links": [8, 15]
		},
		"19": {
			"name": "GRAVEYARD",
			"pools": {
				"COMMON": [
					92,
					353,
					355,
					425,
					607,
					708,
					710,
					971
				],
				"UNCOMMON": [
					104,
					562,
					854
				],
				"RARE": [
					200,
					778,
					909,
					937
				],
				"SUPER_RARE": [442],
				"ULTRA_RARE": [802, 897],
				"BOSS": [
					94,
					105,
					354,
					426,
					429,
					477,
					487,
					609,
					709,
					711,
					778,
					802,
					855,
					897,
					911,
					937,
					972,
					6157
				]
			},
			"links": [24]
		},
		"20": {
			"name": "DOJO",
			"pools": {
				"COMMON": [
					56,
					296,
					307,
					759,
					852
				],
				"UNCOMMON": [
					453,
					559,
					619
				],
				"RARE": [
					106,
					107,
					448,
					538,
					539,
					674
				],
				"SUPER_RARE": [
					237,
					475,
					4083
				],
				"ULTRA_RARE": [
					639,
					891,
					4145
				],
				"BOSS": [
					106,
					107,
					237,
					297,
					308,
					448,
					454,
					475,
					538,
					539,
					560,
					620,
					639,
					675,
					760,
					853,
					865,
					889,
					891,
					979,
					4145,
					6724
				]
			},
			"links": [
				1,
				27,
				29
			]
		},
		"21": {
			"name": "FACTORY",
			"pools": {
				"COMMON": [
					66,
					100,
					436,
					532,
					599
				],
				"UNCOMMON": [
					81,
					239,
					240,
					707
				],
				"RARE": [137],
				"SUPER_RARE": [374],
				"ULTRA_RARE": [649, 801],
				"BOSS": [
					376,
					437,
					466,
					467,
					601,
					649,
					707,
					801
				]
			},
			"links": [1, 41]
		},
		"22": {
			"name": "RUINS",
			"pools": {
				"COMMON": [
					96,
					177,
					201,
					325,
					343,
					605
				],
				"UNCOMMON": [
					63,
					561,
					957
				],
				"RARE": [
					122,
					202,
					574,
					874
				],
				"SUPER_RARE": [
					196,
					566,
					4562
				],
				"ULTRA_RARE": [379, 1016],
				"BOSS": [
					65,
					97,
					122,
					178,
					196,
					202,
					326,
					344,
					379,
					561,
					567,
					576,
					606,
					867,
					959,
					1007,
					1016
				]
			},
			"links": [5, 11]
		},
		"23": {
			"name": "WASTELAND",
			"pools": {
				"COMMON": [
					246,
					329,
					371,
					443,
					610,
					704,
					706,
					782
				],
				"UNCOMMON": [
					333,
					633,
					780,
					967
				],
				"RARE": [
					147,
					885,
					996
				],
				"SUPER_RARE": [
					142,
					621,
					696,
					880,
					882
				],
				"ULTRA_RARE": [895],
				"BOSS": [
					142,
					149,
					248,
					330,
					373,
					445,
					483,
					612,
					621,
					697,
					706,
					780,
					784,
					880,
					882,
					887,
					895,
					998
				]
			},
			"links": [12]
		},
		"24": {
			"name": "ABYSS",
			"pools": {
				"COMMON": [
					41,
					46,
					200,
					302,
					527,
					859
				],
				"UNCOMMON": [
					92,
					206,
					228,
					293,
					303
				],
				"RARE": [
					359,
					442,
					478,
					570
				],
				"SUPER_RARE": [
					197,
					633,
					885
				],
				"ULTRA_RARE": [491, 4146],
				"BOSS": [
					94,
					169,
					197,
					229,
					302,
					442,
					478,
					484,
					491,
					571,
					635,
					717,
					861,
					887,
					4146
				]
			},
			"links": [
				13,
				23,
				25
			]
		},
		"25": {
			"name": "SPACE",
			"pools": {
				"COMMON": [
					173,
					337,
					338,
					436,
					517,
					774
				],
				"UNCOMMON": [343, 605],
				"RARE": [
					120,
					561,
					577
				],
				"SUPER_RARE": [137, 374],
				"ULTRA_RARE": [789, 797],
				"BOSS": [
					36,
					337,
					338,
					376,
					384,
					437,
					474,
					518,
					579,
					774,
					791,
					792,
					797,
					800
				]
			},
			"links": [22]
		},
		"26": {
			"name": "CONSTRUCTION_SITE",
			"pools": {
				"COMMON": [
					50,
					66,
					88,
					231,
					296,
					299,
					532
				],
				"UNCOMMON": [
					81,
					109,
					111,
					529,
					559,
					2074
				],
				"RARE": [
					95,
					236,
					4052
				],
				"SUPER_RARE": [132, 884],
				"ULTRA_RARE": [638, 805],
				"BOSS": [
					68,
					462,
					476,
					534,
					638,
					805,
					863,
					1018,
					2076
				]
			},
			"links": [17, 20]
		},
		"27": {
			"name": "JUNGLE",
			"pools": {
				"COMMON": [
					167,
					190,
					285,
					416,
					420,
					509,
					522,
					540,
					590,
					731
				],
				"UNCOMMON": [
					102,
					114,
					357,
					415,
					511,
					513,
					515,
					595,
					667,
					674,
					753,
					775,
					870
				],
				"RARE": [
					123,
					193,
					287,
					336,
					455,
					495,
					590,
					765,
					766,
					810,
					4077
				],
				"SUPER_RARE": [
					115,
					441,
					900
				],
				"ULTRA_RARE": [
					786,
					794,
					893,
					1015
				],
				"BOSS": [
					103,
					115,
					212,
					286,
					289,
					336,
					357,
					421,
					424,
					455,
					465,
					469,
					470,
					497,
					542,
					591,
					596,
					668,
					675,
					733,
					754,
					775,
					786,
					794,
					812,
					870,
					893,
					900,
					1015,
					4078
				]
			},
			"links": [29]
		},
		"28": {
			"name": "FAIRY_CAVE",
			"pools": {
				"COMMON": [
					39,
					183,
					303,
					682,
					684,
					742,
					755,
					868
				],
				"UNCOMMON": [
					35,
					176,
					280,
					703,
					764,
					856
				],
				"RARE": [
					531,
					653,
					859
				],
				"ULTRA_RARE": [719, 2670],
				"BOSS": [
					40,
					303,
					468,
					531,
					655,
					683,
					685,
					703,
					716,
					719,
					743,
					756,
					764,
					858,
					861,
					869,
					2670
				]
			},
			"links": [15, 25]
		},
		"29": {
			"name": "TEMPLE",
			"pools": {
				"COMMON": [
					92,
					177,
					355,
					562,
					622,
					679
				],
				"UNCOMMON": [
					104,
					343,
					433,
					451,
					607
				],
				"RARE": [999],
				"ULTRA_RARE": [720, 785],
				"BOSS": [
					358,
					486,
					563,
					623,
					681,
					720,
					785,
					1e3
				]
			},
			"links": [
				7,
				14,
				22
			]
		},
		"30": {
			"name": "SLUM",
			"pools": {
				"COMMON": [
					19,
					88,
					96,
					109,
					198,
					353,
					431,
					559,
					568
				],
				"UNCOMMON": [
					228,
					413,
					434,
					674,
					942,
					2019,
					4263
				],
				"RARE": [
					215,
					574,
					624,
					848,
					931,
					965
				],
				"ULTRA_RARE": [799],
				"BOSS": [
					89,
					110,
					435,
					461,
					560,
					569,
					675,
					799,
					849,
					862,
					966,
					2020,
					4110
				]
			},
			"links": [7, 26]
		},
		"31": {
			"name": "SNOWY_FOREST",
			"pools": {
				"COMMON": [
					161,
					215,
					220,
					362,
					459,
					478,
					613,
					872
				],
				"UNCOMMON": [
					216,
					234,
					672,
					875
				],
				"RARE": [
					225,
					615,
					713,
					2027,
					2037,
					4554
				],
				"SUPER_RARE": [
					881,
					4122,
					6215,
					6570,
					6713
				],
				"ULTRA_RARE": [
					896,
					1002,
					4144
				],
				"BOSS": [
					362,
					460,
					461,
					473,
					478,
					614,
					866,
					881,
					888,
					896,
					899,
					901,
					903,
					1002,
					2028,
					2038,
					4144,
					4555,
					6571
				]
			},
			"links": [
				5,
				9,
				11
			]
		},
		"40": {
			"name": "ISLAND",
			"pools": {
				"COMMON": [
					741,
					2019,
					2027,
					2037,
					2050,
					2052,
					2074,
					2088
				],
				"UNCOMMON": [
					779,
					2026,
					2103,
					2105
				],
				"ULTRA_RARE": [806],
				"BOSS": [
					741,
					779,
					806,
					2020,
					2026,
					2028,
					2038,
					2051,
					2053,
					2076,
					2089,
					2103,
					2105
				]
			},
			"links": [6]
		},
		"41": {
			"name": "LABORATORY",
			"pools": {
				"COMMON": [
					88,
					100,
					436,
					517,
					599
				],
				"UNCOMMON": [
					81,
					577,
					707
				],
				"RARE": [
					132,
					137,
					479
				],
				"ULTRA_RARE": [772],
				"BOSS": [
					89,
					101,
					150,
					437,
					462,
					474,
					479,
					579,
					601,
					718,
					772,
					1008
				]
			},
			"links": [26]
		},
		"50": {
			"name": "END",
			"pools": {
				"COMMON": [
					984,
					985,
					986,
					987,
					988,
					989,
					990,
					991,
					992,
					993,
					994,
					995
				],
				"UNCOMMON": [1005, 1006],
				"RARE": [
					1009,
					1010,
					1020,
					1021,
					1022,
					1023
				],
				"BOSS": [890]
			},
			"links": []
		}
	};
	var MOVESET_TABLE = {
		"1": [
			"Celebrate",
			"Giga Drain",
			"Hidden Power Fire",
			"Sleep Powder",
			"Sludge Bomb"
		],
		"2": [
			"Giga Drain",
			"Knock Off",
			"Leech Seed",
			"Sludge Bomb",
			"Synthesis"
		],
		"3": [
			"Sludge Bomb",
			"Giga Drain",
			"Earth Power",
			"Growth",
			"Synthesis",
			"Weather Ball"
		],
		"4": [
			"Fire Blast",
			"Overheat",
			"Sleep Talk",
			"Weather Ball"
		],
		"5": [
			"Flamethrower",
			"Focus Blast",
			"Overheat",
			"Weather Ball"
		],
		"6": [
			"Roost",
			"Scorching Sands",
			"Weather Ball",
			"Fire Blast",
			"Focus Blast",
			"Solar Beam"
		],
		"7": [
			"Aqua Jet",
			"Fake Out",
			"Ice Punch",
			"Rapid Spin",
			"Waterfall",
			"Yawn"
		],
		"8": [
			"Hydro Pump",
			"Ice Beam",
			"Rapid Spin",
			"Shell Smash",
			"Substitute",
			"Surf"
		],
		"9": [
			"Ice Beam",
			"Shell Smash",
			"Surf",
			"Tera Blast"
		],
		"10": ["String Shot", "Tackle"],
		"12": [
			"Hurricane",
			"Quiver Dance",
			"Sleep Powder",
			"Substitute"
		],
		"13": [
			"Bug Bite",
			"Poison Sting",
			"String Shot"
		],
		"14": [
			"Bug Bite",
			"Poison Sting",
			"Iron Defense",
			"String Shot"
		],
		"15": [
			"Pursuit",
			"Drill Run",
			"Knock Off",
			"Poison Jab",
			"U-turn"
		],
		"16": [
			"Brave Bird",
			"Defog",
			"Heat Wave",
			"Return",
			"U-turn"
		],
		"17": [
			"Aerial Ace",
			"Double-Edge",
			"Hidden Power Fighting",
			"Quick Attack",
			"Return",
			"Steel Wing"
		],
		"18": [
			"Heat Wave",
			"Hurricane",
			"Roost",
			"U-turn",
			"Toxic"
		],
		"19": [
			"Double-Edge",
			"Flame Wheel",
			"Hidden Power Grass",
			"Return",
			"Sucker Punch",
			"Zen Headbutt"
		],
		"20": [
			"Sucker Punch",
			"U-turn",
			"Crunch",
			"Facade",
			"Stomping Tantrum",
			"Double-Edge"
		],
		"21": [
			"Double-Edge",
			"Drill Peck",
			"Drill Run",
			"U-turn"
		],
		"22": [
			"Drill Peck",
			"Drill Run",
			"Frustration",
			"U-turn"
		],
		"23": [
			"Earthquake",
			"Glare",
			"Gunk Shot",
			"Knock Off"
		],
		"24": [
			"Earthquake",
			"Gunk Shot",
			"Sucker Punch",
			"Coil",
			"Aqua Tail",
			"Crunch"
		],
		"25": [
			"Knock Off",
			"Fake Out",
			"Quick Attack",
			"Surf",
			"Thunderbolt",
			"Volt Switch"
		],
		"26": [
			"Focus Blast",
			"Nasty Plot",
			"Surf",
			"Thunderbolt"
		],
		"27": [
			"Earthquake",
			"Leech Life",
			"Rapid Spin",
			"Swords Dance"
		],
		"28": [
			"Earthquake",
			"Knock Off",
			"Rapid Spin",
			"Gunk Shot",
			"Spikes",
			"Stealth Rock"
		],
		"29": [
			"Poison Jab",
			"Super Fang",
			"Thief",
			"Toxic Spikes"
		],
		"30": [
			"Curse",
			"Ice Beam",
			"Moonlight",
			"Return"
		],
		"31": [
			"Earth Power",
			"Ice Beam",
			"Sludge Wave",
			"Stealth Rock",
			"Flamethrower",
			"Protect"
		],
		"32": [
			"Drill Run",
			"Hone Claws",
			"Poison Jab",
			"Sucker Punch"
		],
		"33": [
			"Facade",
			"Hidden Power Fighting",
			"Return",
			"Sludge Bomb"
		],
		"34": [
			"Earth Power",
			"Flamethrower",
			"Ice Beam",
			"Stealth Rock",
			"Thunderbolt",
			"Sludge Wave"
		],
		"35": [
			"Night Shade",
			"After You",
			"Encore",
			"Follow Me",
			"Helping Hand",
			"Knock Off"
		],
		"36": [
			"Moonblast",
			"Knock Off",
			"Thunder Wave",
			"Calm Mind",
			"Moonlight",
			"Stealth Rock"
		],
		"37": [
			"Energy Ball",
			"Fire Blast",
			"Overheat",
			"Weather Ball",
			"Flame Charge",
			"Hypnosis"
		],
		"38": [
			"Encore",
			"Healing Wish",
			"Weather Ball",
			"Will-O-Wisp",
			"Overheat",
			"Flamethrower"
		],
		"39": [
			"Body Slam",
			"Counter",
			"Thunder Wave",
			"Thunderbolt",
			"Blizzard",
			"Ice Beam"
		],
		"40": [
			"Knock Off",
			"Protect",
			"Teleport",
			"Wish"
		],
		"41": [
			"Brave Bird",
			"Defog",
			"Pursuit",
			"U-turn"
		],
		"42": [
			"Brave Bird",
			"Roost",
			"Super Fang",
			"Taunt",
			"Toxic"
		],
		"43": [
			"Giga Drain",
			"Sleep Powder",
			"Sludge Bomb",
			"Strength Sap",
			"Synthesis"
		],
		"44": [
			"Giga Drain",
			"Leech Seed",
			"Sludge Bomb",
			"Synthesis"
		],
		"45": [
			"Giga Drain",
			"Leech Seed",
			"Sludge Bomb",
			"Strength Sap",
			"Stun Spore"
		],
		"46": [
			"Knock Off",
			"Leech Life",
			"Seed Bomb",
			"Spore"
		],
		"47": [
			"Knock Off",
			"Leech Life",
			"Spore",
			"Synthesis"
		],
		"48": [
			"Morning Sun",
			"Psychic",
			"Sleep Powder",
			"Sludge Bomb"
		],
		"49": [
			"Bug Buzz",
			"Energy Ball",
			"Psychic Noise",
			"Sludge Bomb",
			"Morning Sun",
			"Quiver Dance"
		],
		"50": [
			"Beat Up",
			"Earthquake",
			"Final Gambit",
			"Rock Slide",
			"Earth Power",
			"Memento"
		],
		"51": [
			"Earthquake",
			"Stealth Rock",
			"Stone Edge",
			"Beat Up",
			"Memento",
			"Reversal"
		],
		"52": [
			"Fake Out",
			"Feint",
			"Knock Off",
			"Play Rough",
			"U-turn"
		],
		"53": [
			"Double-Edge",
			"Fake Out",
			"Knock Off",
			"U-turn"
		],
		"54": [
			"Ice Beam",
			"Nasty Plot",
			"Psychic",
			"Surf",
			"Tera Blast"
		],
		"55": [
			"Flip Turn",
			"Hydro Pump",
			"Ice Beam",
			"Psychic"
		],
		"56": [
			"Assurance",
			"Close Combat",
			"Earthquake",
			"Ice Punch",
			"U-turn"
		],
		"57": [
			"Rage Fist",
			"Taunt",
			"Bulk Up",
			"Close Combat",
			"Drain Punch",
			"Stealth Rock"
		],
		"58": [
			"Flare Blitz",
			"Hidden Power Grass",
			"Morning Sun",
			"Wild Charge",
			"Will-O-Wisp"
		],
		"59": [
			"Extreme Speed",
			"Flare Blitz",
			"Close Combat",
			"Morning Sun",
			"Bulldoze",
			"Curse"
		],
		"60": [
			"Thief",
			"Belly Drum",
			"Hypnosis",
			"Return",
			"Waterfall"
		],
		"61": [
			"Belly Drum",
			"Earthquake",
			"Lovely Kiss",
			"Return",
			"Ice Beam",
			"Substitute"
		],
		"62": [
			"Bulk Up",
			"Drain Punch",
			"Knock Off",
			"Liquidation",
			"Substitute"
		],
		"63": [
			"Dazzling Gleam",
			"Psychic",
			"Fire Punch",
			"Protect",
			"Substitute",
			"Shadow Ball"
		],
		"64": [
			"Psychic",
			"Shadow Ball",
			"Dazzling Gleam",
			"Counter",
			"Hidden Power Fire",
			"Taunt"
		],
		"65": [
			"Counter",
			"Focus Blast",
			"Shadow Ball",
			"Dazzling Gleam",
			"Encore",
			"Expanding Force"
		],
		"66": [
			"Dynamic Punch",
			"Knock Off",
			"Poison Jab",
			"Rock Slide"
		],
		"67": [
			"Knock Off",
			"Bullet Punch",
			"Close Combat",
			"Heavy Slam",
			"Dynamic Punch",
			"Earthquake"
		],
		"68": [
			"Bullet Punch",
			"Close Combat",
			"Facade",
			"Knock Off",
			"Stone Edge"
		],
		"69": [
			"Growth",
			"Sleep Powder",
			"Sludge Bomb",
			"Solar Beam",
			"Weather Ball"
		],
		"70": [
			"Giga Drain",
			"Knock Off",
			"Sludge Bomb",
			"Strength Sap",
			"Synthesis"
		],
		"71": [
			"Knock Off",
			"Poison Jab",
			"Power Whip",
			"Strength Sap",
			"Sucker Punch"
		],
		"72": [
			"Flip Turn",
			"Gunk Shot",
			"Knock Off",
			"Rapid Spin"
		],
		"73": [
			"Flip Turn",
			"Rapid Spin",
			"Knock Off",
			"Sludge Bomb",
			"Toxic Spikes",
			"Haze"
		],
		"74": [
			"Counter",
			"Earthquake",
			"Explosion",
			"Rock Blast",
			"Stealth Rock",
			"Sucker Punch"
		],
		"75": [
			"Earthquake",
			"Explosion",
			"Smack Down",
			"Stealth Rock",
			"Stone Edge",
			"Sucker Punch"
		],
		"76": [
			"Earthquake",
			"Stone Edge",
			"Sucker Punch",
			"Stealth Rock",
			"Explosion",
			"Protect"
		],
		"77": [
			"Flame Charge",
			"Flare Blitz",
			"High Horsepower",
			"Morning Sun",
			"Wild Charge",
			"Will-O-Wisp"
		],
		"78": [
			"Flare Blitz",
			"High Horsepower",
			"Morning Sun",
			"Swords Dance",
			"Play Rough",
			"Solar Blade"
		],
		"79": [
			"Scald",
			"Slack Off",
			"Teleport",
			"Thunder Wave",
			"Future Sight",
			"Psychic"
		],
		"80": [
			"Slack Off",
			"Scald",
			"Body Press",
			"Future Sight",
			"Thunder Wave",
			"Teleport"
		],
		"81": [
			"Flash Cannon",
			"Tera Blast",
			"Thunderbolt",
			"Volt Switch"
		],
		"82": [
			"Flash Cannon",
			"Thunderbolt",
			"Volt Switch",
			"Steel Beam",
			"Tri Attack"
		],
		"83": [
			"Brave Bird",
			"Close Combat",
			"First Impression",
			"Knock Off"
		],
		"84": [
			"Brave Bird",
			"Knock Off",
			"Protect",
			"Quick Attack",
			"Tera Blast"
		],
		"85": [
			"Acrobatics",
			"Brave Bird",
			"Knock Off",
			"Low Kick",
			"Quick Attack",
			"Swords Dance"
		],
		"86": [
			"Perish Song",
			"Protect",
			"Rest",
			"Whirlpool"
		],
		"87": [
			"Perish Song",
			"Rain Dance",
			"Rest",
			"Whirlpool"
		],
		"88": [
			"Fire Punch",
			"Giga Drain",
			"Gunk Shot",
			"Memento",
			"Thief"
		],
		"89": [
			"Knock Off",
			"Protect",
			"Toxic",
			"Drain Punch",
			"Haze",
			"Poison Jab"
		],
		"90": [
			"Ice Shard",
			"Icicle Spear",
			"Liquidation",
			"Protect",
			"Rock Blast",
			"Shell Smash"
		],
		"91": [
			"Icicle Spear",
			"Shell Smash",
			"Ice Shard",
			"Drill Run",
			"Hydro Pump",
			"Rock Blast"
		],
		"92": [
			"Mean Look",
			"Perish Song",
			"Rest",
			"Shadow Ball"
		],
		"93": [
			"Nasty Plot",
			"Psychic",
			"Shadow Ball",
			"Sludge Bomb",
			"Trick"
		],
		"94": [
			"Focus Blast",
			"Shadow Ball",
			"Nasty Plot",
			"Trick",
			"Destiny Bond",
			"Sludge Bomb"
		],
		"95": [
			"Earthquake",
			"Explosion",
			"High Horsepower",
			"Stealth Rock",
			"Rock Blast",
			"Dragon Dance"
		],
		"96": [
			"Counter",
			"Protect",
			"Psychic",
			"Wish"
		],
		"97": [
			"Belly Drum",
			"Drain Punch",
			"Hypnosis",
			"Zen Headbutt"
		],
		"98": [
			"Body Slam",
			"Knock Off",
			"Liquidation",
			"Superpower"
		],
		"99": [
			"High Horsepower",
			"Knock Off",
			"Liquidation",
			"Superpower",
			"Swords Dance"
		],
		"100": [
			"Volt Switch",
			"Explosion",
			"Light Screen",
			"Reflect",
			"Taunt"
		],
		"101": [
			"Taunt",
			"Explosion",
			"Light Screen",
			"Reflect",
			"Volt Switch",
			"Thunderbolt"
		],
		"102": [
			"Giga Drain",
			"Hidden Power Fighting",
			"Hidden Power Fire",
			"Leech Seed",
			"Psychic",
			"Sleep Powder"
		],
		"103": [
			"Ancient Power",
			"Giga Drain",
			"Leaf Storm",
			"Psyshock",
			"Sludge Bomb"
		],
		"104": [
			"Bonemerang",
			"Fire Punch",
			"Knock Off",
			"Rock Slide"
		],
		"105": [
			"Bonemerang",
			"Earthquake",
			"Knock Off",
			"Stone Edge",
			"Swords Dance",
			"Fire Punch"
		],
		"106": [
			"Close Combat",
			"Earthquake",
			"Knock Off",
			"Poison Jab",
			"Stone Edge",
			"Swords Dance"
		],
		"107": [
			"Drain Punch",
			"Knock Off",
			"Mach Punch",
			"Rapid Spin"
		],
		"108": [
			"Body Slam",
			"Knock Off",
			"Protect",
			"Wish"
		],
		"109": [
			"Fire Blast",
			"Flamethrower",
			"Pain Split",
			"Sludge Bomb",
			"Thief",
			"Will-O-Wisp"
		],
		"110": [
			"Pain Split",
			"Sludge Bomb",
			"Will-O-Wisp",
			"Flamethrower",
			"Haze",
			"Taunt"
		],
		"111": [
			"Earthquake",
			"Rock Polish",
			"Stone Edge",
			"Swords Dance"
		],
		"112": [
			"Earthquake",
			"Stealth Rock",
			"Stone Edge",
			"Swords Dance",
			"Rock Polish"
		],
		"113": [
			"Seismic Toss",
			"Soft-Boiled",
			"Thunder Wave",
			"Stealth Rock",
			"Toxic",
			"Aromatherapy"
		],
		"114": [
			"Synthesis",
			"Giga Drain",
			"Knock Off",
			"Sludge Bomb",
			"Sleep Powder",
			"Leaf Storm"
		],
		"115": [
			"Fake Out",
			"Sucker Punch",
			"Ice Punch",
			"Low Kick",
			"Power-Up Punch",
			"Protect"
		],
		"116": [
			"Hidden Power Grass",
			"Hydro Pump",
			"Ice Beam",
			"Rain Dance"
		],
		"117": [
			"Flip Turn",
			"Rest",
			"Sleep Talk",
			"Surf"
		],
		"118": [
			"Bounce",
			"Drill Run",
			"Knock Off",
			"Waterfall"
		],
		"119": [
			"Flip Turn",
			"Knock Off",
			"Rest",
			"Sleep Talk"
		],
		"120": [
			"Recover",
			"Rapid Spin",
			"Scald",
			"Thunderbolt",
			"Hydro Pump",
			"Ice Beam"
		],
		"121": [
			"Rapid Spin",
			"Recover",
			"Hydro Pump",
			"Ice Beam",
			"Scald",
			"Teleport"
		],
		"122": [
			"Dazzling Gleam",
			"Healing Wish",
			"Psychic",
			"Trick"
		],
		"123": [
			"Close Combat",
			"Defog",
			"Dual Wingbeat",
			"Swords Dance",
			"Trailblaze",
			"U-turn"
		],
		"124": [
			"Focus Blast",
			"Ice Beam",
			"Psychic",
			"Lovely Kiss",
			"Nasty Plot",
			"Psyshock"
		],
		"125": [
			"Follow Me",
			"Taunt",
			"Electroweb",
			"Feint",
			"Protect",
			"Thunderbolt"
		],
		"126": [
			"Clear Smog",
			"Follow Me",
			"Heat Wave",
			"Overheat",
			"Protect",
			"Will-O-Wisp"
		],
		"127": [
			"Close Combat",
			"Earthquake",
			"Quick Attack",
			"Return",
			"Swords Dance"
		],
		"128": [
			"Body Slam",
			"Close Combat",
			"Earthquake",
			"Throat Chop",
			"Ice Beam",
			"Iron Head"
		],
		"129": [
			"Bounce",
			"Flail",
			"Splash",
			"Tackle"
		],
		"130": [
			"Waterfall",
			"Taunt",
			"Earthquake",
			"Dragon Dance",
			"Substitute",
			"Thunder Wave"
		],
		"131": [
			"Alluring Voice",
			"Dragon Dance",
			"Earthquake",
			"Freeze-Dry",
			"Hydro Pump",
			"Ice Beam"
		],
		"132": [
			"Transform",
			"Court Change",
			"Glare",
			"Rapid Spin",
			"Soft-Boiled",
			"Tidy Up"
		],
		"133": [
			"Baton Pass",
			"Last Resort",
			"Protect",
			"Stored Power",
			"Substitute"
		],
		"134": [
			"Flip Turn",
			"Haze",
			"Protect",
			"Scald",
			"Wish",
			"Roar"
		],
		"135": [
			"Alluring Voice",
			"Shadow Ball",
			"Thunderbolt",
			"Volt Switch",
			"Calm Mind"
		],
		"136": [
			"Facade",
			"Flare Blitz",
			"Quick Attack",
			"Superpower"
		],
		"137": [
			"Ice Beam",
			"Recover",
			"Thunderbolt",
			"Tri Attack",
			"Trick Room"
		],
		"138": [
			"Earth Power",
			"Ice Beam",
			"Hydro Pump",
			"Shell Smash",
			"Spikes",
			"Stealth Rock"
		],
		"139": [
			"Earth Power",
			"Hidden Power Grass",
			"Hydro Pump",
			"Ice Beam",
			"Shell Smash"
		],
		"140": [
			"Knock Off",
			"Rapid Spin",
			"Rock Slide",
			"Stealth Rock",
			"Waterfall"
		],
		"141": [
			"Stone Edge",
			"Knock Off",
			"Liquidation",
			"Rapid Spin",
			"Aqua Jet",
			"Flip Turn"
		],
		"142": [
			"Dual Wingbeat",
			"Earthquake",
			"Stone Edge",
			"Dragon Dance",
			"Ice Fang",
			"Pursuit"
		],
		"143": [
			"Body Slam",
			"Curse",
			"Rest",
			"Crunch",
			"Heat Crash",
			"Body Press"
		],
		"144": [
			"Freeze-Dry",
			"Haze",
			"Roost",
			"U-turn",
			"Roar",
			"Substitute"
		],
		"145": [
			"Hurricane",
			"Roost",
			"Heat Wave",
			"Volt Switch",
			"Thunderbolt",
			"Discharge"
		],
		"146": [
			"Roost",
			"U-turn",
			"Flamethrower",
			"Will-O-Wisp",
			"Hurricane",
			"Scorching Sands"
		],
		"147": [
			"Extreme Speed",
			"Fire Blast",
			"Iron Tail",
			"Draco Meteor",
			"Dragon Dance",
			"Outrage"
		],
		"148": [
			"Dragon Dance",
			"Extreme Speed",
			"Outrage",
			"Rest"
		],
		"149": [
			"Extreme Speed",
			"Earthquake",
			"Roost",
			"Dragon Dance",
			"Outrage",
			"Fire Punch"
		],
		"150": [
			"Psystrike",
			"Nasty Plot",
			"Ice Beam",
			"Earth Power",
			"Fire Blast",
			"Focus Blast"
		],
		"151": [
			"Spikes",
			"Will-O-Wisp",
			"Taunt",
			"Ice Beam",
			"Stealth Rock",
			"Body Press"
		],
		"152": [
			"Aromatherapy",
			"Giga Drain",
			"Hidden Power Fire",
			"Synthesis"
		],
		"153": [
			"Hidden Power Grass",
			"Synthesis",
			"Toxic",
			"Hidden Power Ground",
			"Leech Seed",
			"Light Screen"
		],
		"154": [
			"Aromatherapy",
			"Dragon Tail",
			"Giga Drain",
			"Synthesis"
		],
		"155": [
			"Eruption",
			"Extrasensory",
			"Fire Blast",
			"Hidden Power Grass"
		],
		"156": [
			"Eruption",
			"Extrasensory",
			"Flamethrower",
			"Overheat"
		],
		"157": [
			"Eruption",
			"Fire Blast",
			"Focus Blast",
			"Scorching Sands",
			"Flamethrower"
		],
		"158": [
			"Aqua Jet",
			"Dragon Dance",
			"Ice Punch",
			"Superpower",
			"Waterfall"
		],
		"159": [
			"Aqua Jet",
			"Dragon Dance",
			"Ice Punch",
			"Substitute",
			"Trailblaze",
			"Waterfall"
		],
		"160": [
			"Aqua Jet",
			"Crunch",
			"Dragon Dance",
			"Ice Punch",
			"Liquidation",
			"Swords Dance"
		],
		"161": [
			"Flamethrower",
			"Hyper Voice",
			"Shadow Ball",
			"Surf",
			"Trick"
		],
		"162": [
			"Brick Break",
			"Double-Edge",
			"Knock Off",
			"Return",
			"Trick",
			"U-turn"
		],
		"163": [
			"Air Slash",
			"Defog",
			"Hypnosis",
			"Reflect",
			"Roost"
		],
		"164": [
			"Hurricane",
			"Hypnosis",
			"Nasty Plot",
			"Roost"
		],
		"165": [
			"Acrobatics",
			"Drain Punch",
			"Knock Off",
			"Swords Dance"
		],
		"166": [
			"Drain Punch",
			"Ice Punch",
			"Power-Up Punch",
			"Thunder Punch"
		],
		"167": [
			"Megahorn",
			"Poison Jab",
			"Protect",
			"Sticky Web",
			"Toxic Spikes"
		],
		"168": [
			"Megahorn",
			"Sticky Web",
			"Sucker Punch",
			"Toxic Spikes",
			"Toxic Thread"
		],
		"169": [
			"Brave Bird",
			"Defog",
			"Roost",
			"U-turn",
			"Super Fang",
			"Taunt"
		],
		"170": [
			"Ice Beam",
			"Volt Switch",
			"Flip Turn",
			"Hydro Pump",
			"Scald",
			"Thunder Wave"
		],
		"171": [
			"Rest",
			"Scald",
			"Sleep Talk",
			"Volt Switch"
		],
		"172": [
			"Encore",
			"Fake Out",
			"Iron Tail",
			"Volt Switch",
			"Volt Tackle"
		],
		"173": [
			"Counter",
			"Encore",
			"Endeavor",
			"Thunder Wave"
		],
		"174": [
			"Fire Blast",
			"Hyper Voice",
			"Protect",
			"Psychic",
			"Wish"
		],
		"175": [
			"Dazzling Gleam",
			"Fire Blast",
			"Heal Bell",
			"Morning Sun",
			"Nasty Plot",
			"Soft-Boiled"
		],
		"176": [
			"Dazzling Gleam",
			"Flamethrower",
			"Roost",
			"Defog",
			"Nasty Plot",
			"Psyshock"
		],
		"177": [
			"Heat Wave",
			"Psychic",
			"Roost",
			"Thunder Wave",
			"Cosmic Power",
			"Light Screen"
		],
		"178": [
			"Roost",
			"Teleport",
			"Heat Wave",
			"Psychic",
			"Thunder Wave",
			"U-turn"
		],
		"179": [
			"Heal Bell",
			"Light Screen",
			"Reflect",
			"Thunderbolt",
			"Toxic"
		],
		"180": [
			"Fire Punch",
			"Heal Bell",
			"Hidden Power Grass",
			"Thunderbolt"
		],
		"181": [
			"Dragon Pulse",
			"Focus Blast",
			"Thunderbolt",
			"Volt Switch"
		],
		"182": [
			"Giga Drain",
			"Moonblast",
			"Quiver Dance",
			"Safeguard",
			"Strength Sap"
		],
		"183": [
			"Aqua Jet",
			"Ice Punch",
			"Knock Off",
			"Play Rough",
			"Waterfall"
		],
		"184": [
			"Aqua Jet",
			"Liquidation",
			"Play Rough",
			"Knock Off",
			"Belly Drum",
			"Superpower"
		],
		"185": [
			"Head Smash",
			"Stealth Rock",
			"Sucker Punch",
			"Wood Hammer"
		],
		"186": [
			"Encore",
			"Ice Beam",
			"Perish Song",
			"Earth Power",
			"Helping Hand",
			"Icy Wind"
		],
		"187": [
			"Bullet Seed",
			"Cotton Guard",
			"Sleep Powder",
			"Strength Sap",
			"Toxic",
			"U-turn"
		],
		"189": [
			"Encore",
			"Leaf Storm",
			"Pollen Puff",
			"Rage Powder",
			"Sleep Powder",
			"Sunny Day"
		],
		"190": [
			"Brick Break",
			"Fake Out",
			"Fire Punch",
			"Fury Swipes",
			"Knock Off",
			"Seed Bomb"
		],
		"191": [
			"Hidden Power Fire",
			"Hidden Power Ice",
			"Return",
			"Seed Bomb",
			"Swords Dance"
		],
		"192": [
			"Earth Power",
			"Giga Drain",
			"Sludge Bomb",
			"Solar Beam"
		],
		"193": [
			"Air Slash",
			"Bug Buzz",
			"Hidden Power Ground",
			"Hypnosis",
			"Protect"
		],
		"194": [
			"Earthquake",
			"Encore",
			"Recover",
			"Scald",
			"Yawn"
		],
		"195": [
			"Earthquake",
			"Recover",
			"Toxic",
			"Spikes",
			"Stealth Rock",
			"Counter"
		],
		"196": [
			"Shadow Ball",
			"Alluring Voice",
			"Morning Sun",
			"Psyshock",
			"Tera Blast",
			"Trick"
		],
		"197": [
			"Foul Play",
			"Protect",
			"Wish",
			"Moonlight",
			"Taunt",
			"Thunder Wave"
		],
		"198": [
			"Dark Pulse",
			"Heat Wave",
			"Hurricane",
			"Nasty Plot"
		],
		"199": [
			"Scald",
			"Future Sight",
			"Slack Off",
			"Chilly Reception",
			"Thunder Wave",
			"Teleport"
		],
		"200": [
			"Foul Play",
			"Hex",
			"Pain Split",
			"Taunt",
			"Will-O-Wisp"
		],
		"201": ["Hidden Power Fighting", "Hidden Power Psychic"],
		"202": [
			"Counter",
			"Destiny Bond",
			"Encore",
			"Mirror Coat"
		],
		"203": [
			"Hyper Voice",
			"Nasty Plot",
			"Psychic",
			"Thunderbolt",
			"Substitute",
			"Trick"
		],
		"204": [
			"Explosion",
			"Payback",
			"Rapid Spin",
			"Spikes",
			"Stealth Rock"
		],
		"205": [
			"Spikes",
			"Gyro Ball",
			"Rapid Spin",
			"Volt Switch",
			"Body Press",
			"Counter"
		],
		"206": [
			"Roost",
			"Glare",
			"Headbutt",
			"Ice Beam",
			"Bite",
			"Body Slam"
		],
		"207": [
			"Stealth Rock",
			"Toxic",
			"Earthquake",
			"Knock Off",
			"Spikes",
			"U-turn"
		],
		"208": [
			"Curse",
			"Earthquake",
			"Gyro Ball",
			"Stealth Rock",
			"Heavy Slam",
			"Rest"
		],
		"209": [
			"Earthquake",
			"Play Rough",
			"Psychic Fangs",
			"Thief",
			"Thunder Wave"
		],
		"210": [
			"Earthquake",
			"Play Rough",
			"Heal Bell",
			"Thunder Wave",
			"Close Combat",
			"Fire Punch"
		],
		"211": [
			"Aqua Jet",
			"Barb Barrage",
			"Flip Turn",
			"Gunk Shot",
			"Liquidation",
			"Pain Split"
		],
		"212": [
			"Bullet Punch",
			"Knock Off",
			"Close Combat",
			"Swords Dance",
			"U-turn",
			"Dual Wingbeat"
		],
		"213": [
			"Encore",
			"Final Gambit",
			"Stealth Rock",
			"Sticky Web",
			"Toxic"
		],
		"214": [
			"Close Combat",
			"Knock Off",
			"Swords Dance",
			"Megahorn",
			"Trailblaze",
			"Earthquake"
		],
		"215": [
			"Ice Shard",
			"Knock Off",
			"Triple Axel",
			"Low Kick",
			"Swords Dance"
		],
		"216": [
			"Close Combat",
			"Crunch",
			"Facade",
			"Protect",
			"Swords Dance"
		],
		"217": [
			"Crunch",
			"Earthquake",
			"Facade",
			"Swords Dance",
			"Body Slam",
			"Close Combat"
		],
		"218": [
			"Clear Smog",
			"Earth Power",
			"Lava Plume",
			"Memento",
			"Will-O-Wisp"
		],
		"219": [
			"Lava Plume",
			"Recover",
			"Stealth Rock",
			"Toxic",
			"Yawn"
		],
		"220": [
			"Earthquake",
			"Endeavor",
			"Ice Shard",
			"Stealth Rock"
		],
		"221": [
			"Earthquake",
			"Ice Shard",
			"Icicle Crash",
			"Stealth Rock",
			"High Horsepower",
			"Roar"
		],
		"222": [
			"Recover",
			"Rock Slide",
			"Stealth Rock",
			"Toxic"
		],
		"223": [
			"Bullet Seed",
			"Fire Blast",
			"Hydro Pump",
			"Water Spout"
		],
		"224": [
			"Energy Ball",
			"Fire Blast",
			"Hydro Pump",
			"Ice Beam"
		],
		"225": [
			"Freeze-Dry",
			"Memento",
			"Rapid Spin",
			"Spikes"
		],
		"226": [
			"Defog",
			"Haze",
			"Roost",
			"Scald"
		],
		"227": [
			"Body Press",
			"Roost",
			"Spikes",
			"Iron Defense",
			"Whirlwind",
			"Brave Bird"
		],
		"228": [
			"Dark Pulse",
			"Fire Blast",
			"Pursuit",
			"Destiny Bond",
			"Flame Charge",
			"Snarl"
		],
		"229": [
			"Dark Pulse",
			"Fire Blast",
			"Nasty Plot",
			"Flamethrower",
			"Hidden Power Grass",
			"Overheat"
		],
		"230": [
			"Draco Meteor",
			"Hydro Pump",
			"Surf",
			"Flip Turn",
			"Hurricane",
			"Ice Beam"
		],
		"231": [
			"Earthquake",
			"Ice Shard",
			"Knock Off",
			"Stealth Rock"
		],
		"232": [
			"Earthquake",
			"Knock Off",
			"Bulldoze",
			"Counter",
			"Gunk Shot",
			"Head Smash"
		],
		"233": [
			"Ice Beam",
			"Recover",
			"Tri Attack",
			"Discharge",
			"Foul Play",
			"Shadow Ball"
		],
		"234": [
			"Bite",
			"Calm Mind",
			"Double-Edge",
			"Earth Power",
			"Earthquake",
			"Shadow Ball"
		],
		"235": [
			"Ceaseless Edge",
			"Spore",
			"Sticky Web",
			"Stone Axe",
			"Mortal Spin",
			"Rapid Spin"
		],
		"236": [
			"Bullet Punch",
			"Fake Out",
			"High Jump Kick",
			"Mach Punch"
		],
		"237": [
			"Bullet Punch",
			"Close Combat",
			"Mach Punch",
			"Rapid Spin",
			"Triple Axel"
		],
		"238": [
			"Blizzard",
			"Hidden Power Fighting",
			"Ice Beam",
			"Psychic",
			"Substitute"
		],
		"239": [
			"Focus Blast",
			"Knock Off",
			"Psychic",
			"Tera Blast",
			"Thunderbolt",
			"Volt Switch"
		],
		"240": [
			"Mach Punch",
			"Return",
			"Thunder Punch",
			"Belly Drum",
			"Cross Chop",
			"Fire Punch"
		],
		"241": [
			"Heal Bell",
			"Milk Drink",
			"Stealth Rock",
			"Body Slam",
			"Seismic Toss",
			"Toxic"
		],
		"242": [
			"Soft-Boiled",
			"Stealth Rock",
			"Seismic Toss",
			"Calm Mind",
			"Shadow Ball",
			"Thunder Wave"
		],
		"243": [
			"Scald",
			"Thunderbolt",
			"Calm Mind",
			"Aura Sphere",
			"Substitute",
			"Volt Switch"
		],
		"244": [
			"Extreme Speed",
			"Sacred Fire",
			"Stone Edge",
			"Stomping Tantrum",
			"Crunch",
			"Tera Blast"
		],
		"245": [
			"Scald",
			"Calm Mind",
			"Protect",
			"Substitute",
			"Ice Beam",
			"Toxic Spikes"
		],
		"246": [
			"Dragon Dance",
			"Earthquake",
			"Rock Slide",
			"Stone Edge",
			"Superpower"
		],
		"247": [
			"Dragon Dance",
			"Earthquake",
			"Hidden Power Bug",
			"Protect",
			"Rock Slide",
			"Endure"
		],
		"248": [
			"Knock Off",
			"Stone Edge",
			"Ice Punch",
			"Stealth Rock",
			"Low Kick",
			"Earthquake"
		],
		"249": [
			"Recover",
			"Calm Mind",
			"Earth Power",
			"Air Slash",
			"Ice Beam",
			"Psychic Noise"
		],
		"250": [
			"Sacred Fire",
			"Brave Bird",
			"Earthquake",
			"Recover",
			"Whirlwind",
			"Substitute"
		],
		"251": [
			"Earth Power",
			"Nasty Plot",
			"Recover",
			"Giga Drain",
			"Hidden Power Fire",
			"Psychic"
		],
		"252": [
			"Acrobatics",
			"Bullet Seed",
			"Drain Punch",
			"Rock Slide",
			"Swords Dance"
		],
		"253": [
			"Acrobatics",
			"Drain Punch",
			"Leaf Blade",
			"Rock Slide",
			"Swords Dance"
		],
		"254": [
			"Earthquake",
			"Leaf Blade",
			"Rock Slide",
			"Swords Dance",
			"Acrobatics",
			"Dragon Pulse"
		],
		"255": [
			"Fire Blast",
			"Hidden Power Grass",
			"Overheat",
			"Protect",
			"Substitute"
		],
		"256": [
			"Protect",
			"Brick Break",
			"Flamethrower",
			"Flare Blitz",
			"Focus Blast",
			"Substitute"
		],
		"257": [
			"Swords Dance",
			"Close Combat",
			"Flare Blitz",
			"Pyro Ball",
			"Thunder Punch",
			"Bitter Blade"
		],
		"258": [
			"Double-Edge",
			"Ice Beam",
			"Return",
			"Superpower",
			"Waterfall"
		],
		"259": [
			"Earthquake",
			"Ice Punch",
			"Stealth Rock",
			"Waterfall",
			"Rest",
			"Sleep Talk"
		],
		"260": [
			"Earthquake",
			"Flip Turn",
			"Stealth Rock",
			"Roar",
			"Knock Off",
			"Ice Punch"
		],
		"261": [
			"Crunch",
			"Fire Fang",
			"Howl",
			"Play Rough"
		],
		"262": [
			"Crunch",
			"Iron Tail",
			"Play Rough",
			"Sucker Punch"
		],
		"263": [
			"Belly Drum",
			"Extreme Speed",
			"Protect",
			"Seed Bomb",
			"Thief"
		],
		"264": [
			"Belly Drum",
			"Extreme Speed",
			"Seed Bomb",
			"Stomping Tantrum",
			"Throat Chop"
		],
		"267": [
			"Bug Buzz",
			"Hidden Power Fighting",
			"Quiver Dance",
			"Roost"
		],
		"269": [
			"Bug Buzz",
			"Iron Defense",
			"Quiver Dance",
			"Roost"
		],
		"270": [
			"Giga Drain",
			"Ice Beam",
			"Rain Dance",
			"Surf"
		],
		"271": [
			"Hidden Power Grass",
			"Hydro Pump",
			"Ice Beam",
			"Leech Seed",
			"Protect",
			"Rain Dance"
		],
		"272": [
			"Encore",
			"Giga Drain",
			"Hydro Pump",
			"Ice Beam",
			"Knock Off",
			"Rain Dance"
		],
		"273": [
			"Explosion",
			"Growth",
			"Hidden Power Fire",
			"Solar Beam"
		],
		"275": [
			"Knock Off",
			"Sucker Punch",
			"Swords Dance",
			"Defog",
			"Growth",
			"Heat Wave"
		],
		"276": [
			"Brave Bird",
			"U-turn",
			"Boomburst",
			"Facade",
			"Heat Wave",
			"Hidden Power Grass"
		],
		"277": [
			"Air Slash",
			"Boomburst",
			"Heat Wave",
			"U-turn"
		],
		"278": [
			"Hurricane",
			"Ice Beam",
			"Protect",
			"Substitute",
			"Surf",
			"Tera Blast"
		],
		"279": [
			"Hurricane",
			"Roost",
			"U-turn",
			"Weather Ball",
			"Knock Off",
			"Protect"
		],
		"280": [
			"Dazzling Gleam",
			"Destiny Bond",
			"Memento",
			"Psychic",
			"Thunderbolt"
		],
		"282": [
			"Psyshock",
			"Moonblast",
			"Mystical Fire",
			"Trick",
			"Focus Blast",
			"Hyper Voice"
		],
		"283": [
			"Aqua Jet",
			"Giga Drain",
			"Hydro Pump",
			"Ice Beam",
			"Icy Wind",
			"Scald"
		],
		"284": [
			"Air Slash",
			"Bug Buzz",
			"Hydro Pump",
			"Quiver Dance",
			"Sticky Web"
		],
		"285": [
			"Bullet Seed",
			"Drain Punch",
			"Spore",
			"Synthesis"
		],
		"286": [
			"Close Combat",
			"Bulldoze",
			"Bullet Seed",
			"Mach Punch",
			"Spore",
			"Swords Dance"
		],
		"287": [
			"Fire Punch",
			"Hammer Arm",
			"Ice Punch",
			"Pursuit",
			"Return"
		],
		"288": [
			"Bulk Up",
			"Facade",
			"Return",
			"Slack Off",
			"Substitute",
			"Taunt"
		],
		"289": [
			"Earthquake",
			"Fire Blast",
			"Fire Punch",
			"Giga Impact",
			"Hammer Arm",
			"Ice Punch"
		],
		"290": [
			"Final Gambit",
			"Giga Drain",
			"Leech Life",
			"Toxic"
		],
		"291": [
			"Acrobatics",
			"Protect",
			"Swords Dance",
			"U-turn",
			"Dual Wingbeat"
		],
		"292": [
			"Protect",
			"Shadow Sneak",
			"Toxic",
			"Will-O-Wisp"
		],
		"293": [
			"Fire Blast",
			"Hammer Arm",
			"Hyper Voice",
			"Ice Beam",
			"Shadow Ball"
		],
		"294": [
			"Earthquake",
			"Fire Blast",
			"Flamethrower",
			"Return",
			"Shadow Ball",
			"Substitute"
		],
		"295": [
			"Boomburst",
			"Focus Blast",
			"Overheat",
			"Surf"
		],
		"296": [
			"Belly Drum",
			"Bullet Punch",
			"Close Combat",
			"Heavy Slam",
			"Knock Off"
		],
		"297": [
			"Bullet Punch",
			"Drain Punch",
			"Knock Off",
			"Close Combat",
			"Bulk Up",
			"Earthquake"
		],
		"298": [
			"Aqua Jet",
			"Belly Drum",
			"Facade",
			"Protect"
		],
		"299": [
			"Rock Blast",
			"Stealth Rock",
			"Thunder Wave",
			"Volt Switch"
		],
		"300": [
			"Double-Edge",
			"Fake Out",
			"Foresight",
			"Sucker Punch",
			"Thunder Wave"
		],
		"301": [
			"Double-Edge",
			"Fake Out",
			"Return",
			"Sucker Punch",
			"Thunder Wave"
		],
		"302": [
			"Recover",
			"Will-O-Wisp",
			"Knock Off",
			"Protect",
			"Encore",
			"Hex"
		],
		"303": [
			"Knock Off",
			"Play Rough",
			"Brick Break",
			"Fire Fang",
			"Ice Punch",
			"Sucker Punch"
		],
		"304": [
			"Toxic",
			"Earthquake",
			"Endeavor",
			"Head Smash",
			"Heavy Slam",
			"Iron Head"
		],
		"305": [
			"Double-Edge",
			"Head Smash",
			"Heavy Slam",
			"Stealth Rock",
			"Superpower"
		],
		"306": [
			"Body Press",
			"Earthquake",
			"Fire Punch",
			"Heavy Slam",
			"Curse",
			"Iron Defense"
		],
		"307": [
			"Bullet Punch",
			"Close Combat",
			"Ice Punch",
			"Psycho Cut",
			"Trick",
			"Zen Headbutt"
		],
		"308": [
			"Close Combat",
			"Ice Punch",
			"Zen Headbutt",
			"Trick",
			"Bullet Punch",
			"Fake Out"
		],
		"309": [
			"Thunderbolt",
			"Flamethrower",
			"Hidden Power Grass",
			"Switcheroo",
			"Volt Switch"
		],
		"310": [
			"Flamethrower",
			"Hidden Power Grass",
			"Hidden Power Ice",
			"Overheat",
			"Thunderbolt",
			"Toxic"
		],
		"311": [
			"Encore",
			"Grass Knot",
			"Hidden Power Ice",
			"Nasty Plot",
			"Substitute",
			"Thunderbolt"
		],
		"312": [
			"Encore",
			"Grass Knot",
			"Hidden Power Ice",
			"Nasty Plot",
			"Substitute",
			"Thunderbolt"
		],
		"313": [
			"Roost",
			"Encore",
			"Rain Dance",
			"Thunder Wave",
			"U-turn"
		],
		"314": [
			"Encore",
			"Charm",
			"Infestation",
			"Rain Dance",
			"Roost",
			"Sunny Day"
		],
		"315": [
			"Giga Drain",
			"Sludge Bomb",
			"Spikes",
			"Synthesis",
			"Leaf Storm",
			"Covet"
		],
		"316": [
			"Encore",
			"Ice Beam",
			"Pain Split",
			"Sludge Bomb",
			"Stockpile",
			"Toxic"
		],
		"317": [
			"Acid Armor",
			"Body Press",
			"Encore",
			"Ice Beam",
			"Knock Off",
			"Pain Split"
		],
		"318": [
			"Protect",
			"Crunch",
			"Dark Pulse",
			"Flip Turn",
			"Hydro Pump",
			"Ice Beam"
		],
		"319": [
			"Ice Fang",
			"Crunch",
			"Protect",
			"Psychic Fangs",
			"Close Combat",
			"Destiny Bond"
		],
		"320": [
			"Hidden Power Fire",
			"Hidden Power Grass",
			"Hydro Pump",
			"Ice Beam",
			"Water Spout"
		],
		"321": [
			"Block",
			"Noble Roar",
			"Rest",
			"Toxic"
		],
		"322": [
			"Flame Charge",
			"Body Press",
			"Earth Power",
			"Fire Blast",
			"Flamethrower",
			"Growth"
		],
		"323": [
			"Earth Power",
			"Lava Plume",
			"Roar",
			"Rock Slide",
			"Stealth Rock"
		],
		"324": [
			"Lava Plume",
			"Stealth Rock",
			"Rapid Spin",
			"Body Press",
			"Eruption",
			"Protect"
		],
		"325": [
			"Calm Mind",
			"Hidden Power Fighting",
			"Power Gem",
			"Psychic"
		],
		"326": [
			"Calm Mind",
			"Focus Blast",
			"Psychic",
			"Shadow Ball",
			"Taunt",
			"Thunder Wave"
		],
		"327": [
			"Return",
			"Sucker Punch",
			"Superpower",
			"Trick Room"
		],
		"328": [
			"Earthquake",
			"First Impression",
			"Stone Edge",
			"Feint",
			"Quick Attack",
			"Superpower"
		],
		"329": [
			"Defog",
			"Earthquake",
			"Roost",
			"Toxic",
			"U-turn"
		],
		"330": [
			"Earthquake",
			"U-turn",
			"Stone Edge",
			"Scale Shot",
			"Outrage",
			"Stealth Rock"
		],
		"331": [
			"Drain Punch",
			"Seed Bomb",
			"Sucker Punch",
			"Swords Dance",
			"Thunder Punch"
		],
		"332": [
			"Sucker Punch",
			"Dark Pulse",
			"Giga Drain",
			"Spikes",
			"Energy Ball",
			"Seed Bomb"
		],
		"333": [
			"Heat Wave",
			"Agility",
			"Cotton Guard",
			"Return",
			"Roost"
		],
		"334": [
			"Roost",
			"Brave Bird",
			"Defog",
			"Haze",
			"Will-O-Wisp",
			"Dragon Dance"
		],
		"335": [
			"Close Combat",
			"Facade",
			"Knock Off",
			"Quick Attack",
			"Swords Dance"
		],
		"336": [
			"Earthquake",
			"Flamethrower",
			"Giga Drain",
			"Sludge Wave",
			"Sucker Punch"
		],
		"337": [
			"Earth Power",
			"Meteor Beam",
			"Psyshock",
			"Rock Polish",
			"Stealth Rock"
		],
		"338": [
			"Morning Sun",
			"Rock Slide",
			"Stealth Rock",
			"Will-O-Wisp"
		],
		"339": [
			"Bounce",
			"Dragon Dance",
			"Earthquake",
			"Waterfall"
		],
		"340": [
			"Spikes",
			"Earth Power",
			"Ice Beam",
			"Stealth Rock",
			"Stone Edge",
			"Surf"
		],
		"341": [
			"Aqua Jet",
			"Crabhammer",
			"Dragon Dance",
			"Knock Off",
			"X-Scissor"
		],
		"342": [
			"Knock Off",
			"Aqua Jet",
			"Crabhammer",
			"Close Combat",
			"Swords Dance",
			"Jet Punch"
		],
		"343": [
			"Earth Power",
			"Psychic",
			"Rapid Spin",
			"Stealth Rock"
		],
		"344": [
			"Protect",
			"Psychic",
			"Rapid Spin",
			"Scorching Sands",
			"Stealth Rock",
			"Teleport"
		],
		"345": [
			"Ancient Power",
			"Earth Power",
			"Giga Drain",
			"Recover",
			"Stealth Rock",
			"Toxic"
		],
		"346": [
			"Recover",
			"Rock Blast",
			"Stealth Rock",
			"Toxic"
		],
		"347": [
			"Knock Off",
			"Rapid Spin",
			"Rock Blast",
			"Stealth Rock"
		],
		"348": [
			"Knock Off",
			"Rapid Spin",
			"Stealth Rock",
			"Stone Edge"
		],
		"350": [
			"Flip Turn",
			"Haze",
			"Recover",
			"Scald",
			"Ice Beam",
			"Alluring Voice"
		],
		"351": [
			"Hydro Pump",
			"Ice Beam",
			"Rain Dance",
			"Thunder"
		],
		"352": [
			"Drain Punch",
			"Knock Off",
			"Shadow Sneak",
			"Sucker Punch",
			"Fake Out",
			"Ice Beam"
		],
		"353": [
			"Destiny Bond",
			"Knock Off",
			"Shadow Sneak",
			"Trick Room"
		],
		"354": [
			"Gunk Shot",
			"Knock Off",
			"Shadow Claw",
			"Shadow Sneak",
			"Sucker Punch",
			"Will-O-Wisp"
		],
		"355": [
			"Hex",
			"Pain Split",
			"Shadow Sneak",
			"Substitute",
			"Will-O-Wisp"
		],
		"356": [
			"Night Shade",
			"Will-O-Wisp",
			"Haze",
			"Pain Split",
			"Ally Switch",
			"Helping Hand"
		],
		"357": [
			"Air Slash",
			"Leech Seed",
			"Protect",
			"Substitute",
			"Toxic"
		],
		"358": [
			"Defog",
			"Healing Wish",
			"Psychic",
			"Psyshock",
			"Recover",
			"Taunt"
		],
		"359": [
			"Close Combat",
			"Iron Tail",
			"Knock Off",
			"Play Rough",
			"Sucker Punch",
			"Pursuit"
		],
		"360": [
			"Counter",
			"Encore",
			"Mirror Coat",
			"Safeguard",
			"Tickle"
		],
		"361": [
			"Frost Breath",
			"Hidden Power Fighting",
			"Shadow Ball",
			"Spikes"
		],
		"362": [
			"Freeze-Dry",
			"Spikes",
			"Double-Edge",
			"Earthquake",
			"Explosion",
			"Frustration"
		],
		"363": [
			"Hidden Power Electric",
			"Hidden Power Grass",
			"Ice Beam",
			"Surf",
			"Yawn"
		],
		"364": [
			"Encore",
			"Hidden Power Grass",
			"Ice Beam",
			"Protect",
			"Substitute",
			"Surf"
		],
		"365": [
			"Earthquake",
			"Icicle Spear",
			"Liquidation",
			"Swords Dance"
		],
		"366": [
			"Hidden Power Grass",
			"Ice Beam",
			"Shell Smash",
			"Substitute",
			"Surf"
		],
		"367": [
			"Ice Beam",
			"Shell Smash",
			"Sucker Punch",
			"Waterfall"
		],
		"368": [
			"Hidden Power Fire",
			"Hidden Power Grass",
			"Hydro Pump",
			"Ice Beam",
			"Shell Smash",
			"Substitute"
		],
		"369": [
			"Head Smash",
			"Liquidation",
			"Stealth Rock",
			"Toxic"
		],
		"370": [
			"Hidden Power Grass",
			"Hydro Pump",
			"Ice Beam",
			"Rain Dance"
		],
		"371": [
			"Substitute",
			"Dragon Dance",
			"Fire Fang",
			"Outrage",
			"Zen Headbutt"
		],
		"372": [
			"Dragon Claw",
			"Dragon Dance",
			"Outrage",
			"Rest",
			"Sleep Talk",
			"Protect"
		],
		"373": [
			"Earthquake",
			"Dragon Dance",
			"Fire Blast",
			"Draco Meteor",
			"Roost",
			"Dragon Darts"
		],
		"374": [
			"Headbutt",
			"Iron Defense",
			"Iron Head",
			"Take Down",
			"Zen Headbutt"
		],
		"375": [
			"Bullet Punch",
			"Meteor Mash",
			"Toxic",
			"Earthquake",
			"Stealth Rock",
			"Trick"
		],
		"376": [
			"Bullet Punch",
			"Earthquake",
			"Heavy Slam",
			"Knock Off",
			"Psychic Fangs",
			"Meteor Mash"
		],
		"377": [
			"Body Press",
			"Iron Defense",
			"Stealth Rock",
			"Thunder Wave",
			"Rock Blast",
			"Stone Edge"
		],
		"378": [
			"Amnesia",
			"Charge Beam",
			"Focus Blast",
			"Frost Breath",
			"Ice Beam",
			"Rest"
		],
		"379": [
			"Body Press",
			"Iron Defense",
			"Heavy Slam",
			"Amnesia",
			"Protect",
			"Rest"
		],
		"380": [
			"Draco Meteor",
			"Aura Sphere",
			"Calm Mind",
			"Recover",
			"Psychic",
			"Psyshock"
		],
		"381": [
			"Luster Purge",
			"Draco Meteor",
			"Aura Sphere",
			"Trick",
			"Recover",
			"Flip Turn"
		],
		"382": [
			"Ice Beam",
			"Origin Pulse",
			"Thunder",
			"Water Spout",
			"Calm Mind",
			"Surf"
		],
		"383": [
			"Precipice Blades",
			"Stone Edge",
			"Heat Crash",
			"Rock Tomb",
			"Stealth Rock",
			"Swords Dance"
		],
		"384": [
			"Dragon Ascent",
			"Earthquake",
			"Extreme Speed",
			"Dragon Dance",
			"Swords Dance",
			"V-create"
		],
		"385": [
			"Iron Head",
			"U-turn",
			"Healing Wish",
			"Stealth Rock",
			"Encore",
			"Ice Punch"
		],
		"386": [
			"Psycho Boost",
			"Extreme Speed",
			"Focus Blast",
			"Ice Beam",
			"Knock Off",
			"Shadow Ball"
		],
		"387": [
			"Bullet Seed",
			"Stealth Rock",
			"Superpower",
			"Synthesis"
		],
		"388": [
			"Leech Seed",
			"Return",
			"Seed Bomb",
			"Stealth Rock",
			"Superpower",
			"Synthesis"
		],
		"389": [
			"Headlong Rush",
			"Shell Smash",
			"Bullet Seed",
			"Rock Blast",
			"Stone Edge",
			"Wood Hammer"
		],
		"390": [
			"Fake Out",
			"Hidden Power Grass",
			"Overheat",
			"Stealth Rock"
		],
		"391": [
			"Close Combat",
			"Flare Blitz",
			"Knock Off",
			"U-turn",
			"Fire Blast",
			"Focus Blast"
		],
		"392": [
			"Close Combat",
			"Flare Blitz",
			"U-turn",
			"Grass Knot",
			"Fire Blast",
			"Gunk Shot"
		],
		"393": [
			"Defog",
			"Ice Beam",
			"Scald",
			"Stealth Rock"
		],
		"394": [
			"Defog",
			"Scald",
			"Stealth Rock",
			"Toxic",
			"Ice Beam"
		],
		"395": [
			"Roost",
			"Flip Turn",
			"Stealth Rock",
			"Knock Off",
			"Surf",
			"Roar"
		],
		"396": [
			"Brave Bird",
			"Double-Edge",
			"Heat Wave",
			"Hidden Power Grass",
			"U-turn"
		],
		"397": [
			"Brave Bird",
			"U-turn",
			"Defog",
			"Double-Edge",
			"Pursuit",
			"Roost"
		],
		"398": [
			"Brave Bird",
			"Close Combat",
			"U-turn",
			"Double-Edge",
			"Final Gambit",
			"Quick Attack"
		],
		"399": [
			"Aqua Tail",
			"Crunch",
			"Quick Attack",
			"Return",
			"Swords Dance"
		],
		"400": [
			"Aqua Jet",
			"Return",
			"Swords Dance",
			"Liquidation",
			"Quick Attack",
			"Waterfall"
		],
		"401": [
			"Bug Bite",
			"Endeavor",
			"Growl",
			"String Shot"
		],
		"402": [
			"Bug Bite",
			"Endeavor",
			"Sticky Web",
			"Taunt"
		],
		"403": [
			"Fire Fang",
			"Ice Fang",
			"Thief",
			"Volt Switch",
			"Wild Charge"
		],
		"405": [
			"Crunch",
			"Facade",
			"Superpower",
			"Wild Charge"
		],
		"406": [
			"Giga Drain",
			"Sludge Bomb",
			"Hidden Power Fire",
			"Sleep Powder",
			"Spikes",
			"Synthesis"
		],
		"407": [
			"Sleep Powder",
			"Sludge Bomb",
			"Giga Drain",
			"Spikes",
			"Synthesis",
			"Hidden Power Fire"
		],
		"408": [
			"Fire Punch",
			"Head Smash",
			"Rock Slide",
			"Crunch",
			"Earthquake",
			"Thunder Punch"
		],
		"409": [
			"Fire Punch",
			"Head Smash",
			"Rock Slide",
			"Superpower",
			"Zen Headbutt",
			"Earthquake"
		],
		"410": [
			"Endure",
			"Metal Burst",
			"Protect",
			"Rock Blast",
			"Stealth Rock"
		],
		"411": [
			"Body Press",
			"Foul Play",
			"Heavy Slam",
			"Iron Defense",
			"Roar",
			"Stealth Rock"
		],
		"412": [
			"Bug Bite",
			"Hidden Power Ice",
			"Protect",
			"String Shot"
		],
		"413": [
			"Bug Buzz",
			"Giga Drain",
			"Hidden Power Ground",
			"Quiver Dance"
		],
		"414": [
			"Air Slash",
			"Bug Buzz",
			"Energy Ball",
			"U-turn"
		],
		"416": [
			"Air Slash",
			"Defog",
			"Roost",
			"U-turn"
		],
		"417": [
			"Nuzzle",
			"Super Fang",
			"Toxic",
			"U-turn"
		],
		"418": [
			"Aqua Jet",
			"Brick Break",
			"Bulk Up",
			"Ice Spinner",
			"Wave Crash"
		],
		"419": [
			"Aqua Jet",
			"Ice Spinner",
			"Wave Crash",
			"Flip Turn",
			"Liquidation",
			"Low Kick"
		],
		"420": [
			"Healing Wish",
			"Solar Beam",
			"Sunny Day",
			"Weather Ball"
		],
		"421": [
			"Growth",
			"Play Rough",
			"Solar Blade",
			"Weather Ball"
		],
		"422": [
			"Earth Power",
			"Ice Beam",
			"Recover",
			"Stealth Rock"
		],
		"423": [
			"Spikes",
			"Earthquake",
			"Recover",
			"Stealth Rock",
			"Ice Beam",
			"Earth Power"
		],
		"424": [
			"Double-Edge",
			"Fake Out",
			"Knock Off",
			"Triple Axel",
			"U-turn",
			"Double Hit"
		],
		"425": [
			"Calm Mind",
			"Psychic",
			"Shadow Ball",
			"Thunderbolt",
			"Will-O-Wisp"
		],
		"426": [
			"Hex",
			"Strength Sap",
			"Will-O-Wisp",
			"Air Slash",
			"Calm Mind",
			"Defog"
		],
		"427": [
			"Drain Punch",
			"Fire Punch",
			"Quick Attack",
			"Return",
			"Healing Wish",
			"Jump Kick"
		],
		"428": [
			"Close Combat",
			"Return",
			"Fake Out",
			"Triple Axel",
			"U-turn",
			"Encore"
		],
		"429": [
			"Shadow Ball",
			"Dazzling Gleam",
			"Draining Kiss",
			"Nasty Plot",
			"Substitute",
			"Destiny Bond"
		],
		"430": [
			"Brave Bird",
			"Night Slash",
			"Sucker Punch",
			"U-turn"
		],
		"431": [
			"Fake Out",
			"Knock Off",
			"Play Rough",
			"Return",
			"Sucker Punch"
		],
		"432": [
			"Fake Out",
			"Knock Off",
			"Return",
			"Sucker Punch",
			"U-turn"
		],
		"433": [
			"Grass Knot",
			"Hidden Power Fighting",
			"Hypnosis",
			"Knock Off",
			"Psychic",
			"Recover"
		],
		"434": [
			"Gunk Shot",
			"Knock Off",
			"Sucker Punch",
			"Temper Flare",
			"Substitute",
			"Toxic Spikes"
		],
		"435": [
			"Sucker Punch",
			"Gunk Shot",
			"Knock Off",
			"Taunt",
			"Crunch",
			"Play Rough"
		],
		"436": [
			"Stealth Rock",
			"Psywave",
			"Rest",
			"Toxic",
			"Earthquake",
			"Heavy Slam"
		],
		"437": [
			"Body Press",
			"Stealth Rock",
			"Heavy Slam",
			"Iron Defense",
			"Earthquake",
			"Night Shade"
		],
		"438": [
			"Counter",
			"Rock Slide",
			"Stealth Rock",
			"Stomping Tantrum",
			"Sucker Punch"
		],
		"439": [
			"Healing Wish",
			"Hidden Power Fighting",
			"Psychic",
			"Trick"
		],
		"440": [
			"Flamethrower",
			"Heal Bell",
			"Light Screen",
			"Thunder Wave",
			"Toxic"
		],
		"441": [
			"Boomburst",
			"Heat Wave",
			"U-turn",
			"Chatter",
			"Encore",
			"Hidden Power Fighting"
		],
		"442": [
			"Dark Pulse",
			"Nasty Plot",
			"Psyshock",
			"Trick Room",
			"Foul Play",
			"Hex"
		],
		"443": [
			"Earthquake",
			"Endure",
			"Scale Shot",
			"Swords Dance"
		],
		"444": [
			"Earthquake",
			"Scale Shot",
			"Stealth Rock",
			"Dragon Tail",
			"Outrage",
			"Rest"
		],
		"445": [
			"Earthquake",
			"Scale Shot",
			"Stealth Rock",
			"Swords Dance",
			"Spikes",
			"Stone Edge"
		],
		"446": [
			"Body Slam",
			"Curse",
			"Facade",
			"Fire Punch",
			"Recycle"
		],
		"447": [
			"Copycat",
			"Crunch",
			"Dig",
			"Endure",
			"High Jump Kick",
			"Iron Tail"
		],
		"448": [
			"Close Combat",
			"Dark Pulse",
			"Earthquake",
			"Swords Dance",
			"Bullet Punch",
			"Extreme Speed"
		],
		"449": [
			"Earthquake",
			"Slack Off",
			"Stealth Rock",
			"Ice Fang",
			"Whirlwind"
		],
		"450": [
			"Earthquake",
			"Slack Off",
			"Stealth Rock",
			"Whirlwind",
			"Toxic",
			"Body Press"
		],
		"451": [
			"Knock Off",
			"Poison Jab",
			"Taunt",
			"Toxic Spikes"
		],
		"452": [
			"Knock Off",
			"Poison Jab",
			"Earthquake",
			"Swords Dance",
			"Toxic Spikes",
			"Aqua Tail"
		],
		"453": [
			"Drain Punch",
			"Earthquake",
			"Ice Punch",
			"Sucker Punch"
		],
		"454": [
			"Close Combat",
			"Gunk Shot",
			"Sucker Punch",
			"Knock Off",
			"Swords Dance",
			"Dark Pulse"
		],
		"455": [
			"Knock Off",
			"Power Whip",
			"Sleep Powder",
			"Swords Dance"
		],
		"456": [
			"Defog",
			"Hidden Power Fighting",
			"Scald",
			"U-turn"
		],
		"457": [
			"Defog",
			"Scald",
			"Toxic",
			"U-turn"
		],
		"458": [
			"Air Slash",
			"Hidden Power Grass",
			"Hidden Power Ground",
			"Hydro Pump",
			"Rain Dance"
		],
		"459": [
			"Blizzard",
			"Giga Drain",
			"Ice Shard",
			"Protect"
		],
		"460": [
			"Aurora Veil",
			"Blizzard",
			"Earth Power",
			"Giga Drain",
			"Leaf Storm",
			"Avalanche"
		],
		"461": [
			"Knock Off",
			"Ice Shard",
			"Triple Axel",
			"Swords Dance",
			"Low Kick",
			"Glacial Lance"
		],
		"462": [
			"Flash Cannon",
			"Volt Switch",
			"Thunderbolt",
			"Body Press",
			"Thunderclap",
			"Electro Drift"
		],
		"463": [
			"Heal Bell",
			"Knock Off",
			"Protect",
			"Wish"
		],
		"464": [
			"Earthquake",
			"Stone Edge",
			"Ice Punch",
			"Megahorn",
			"Stealth Rock",
			"Swords Dance"
		],
		"465": [
			"Focus Blast",
			"Giga Drain",
			"Knock Off",
			"Hidden Power Fire",
			"Sleep Powder",
			"Earthquake"
		],
		"466": [
			"Darkest Lariat",
			"Earthquake",
			"Flamethrower",
			"Focus Blast",
			"Thunderbolt"
		],
		"467": [
			"Fire Blast",
			"Focus Blast",
			"Knock Off",
			"Scorching Sands",
			"Taunt",
			"Thunderbolt"
		],
		"468": [
			"Air Slash",
			"Roost",
			"Nasty Plot",
			"Flamethrower",
			"Aura Sphere",
			"Dazzling Gleam"
		],
		"469": [
			"Bug Buzz",
			"Air Slash",
			"Giga Drain",
			"Psychic Noise",
			"U-turn",
			"Aeroblast"
		],
		"470": [
			"Double-Edge",
			"Knock Off",
			"Leaf Blade",
			"Solar Blade",
			"Swords Dance"
		],
		"471": [
			"Freeze-Dry",
			"Ice Beam",
			"Shadow Ball",
			"Water Pulse"
		],
		"472": [
			"Earthquake",
			"Knock Off",
			"Protect",
			"Toxic",
			"Spikes",
			"Stealth Rock"
		],
		"473": [
			"Ice Shard",
			"Earthquake",
			"Icicle Crash",
			"Knock Off",
			"Stealth Rock",
			"Glacial Lance"
		],
		"474": [
			"Ice Beam",
			"Thunderbolt",
			"Hyper Beam",
			"Uproar",
			"Shadow Ball",
			"Dark Pulse"
		],
		"475": [
			"Psycho Cut",
			"Sacred Sword",
			"Knock Off",
			"Leaf Blade",
			"Trick",
			"Triple Axel"
		],
		"476": [
			"Dazzling Gleam",
			"Earth Power",
			"Flash Cannon",
			"Meteor Beam"
		],
		"477": [
			"Earthquake",
			"Leech Life",
			"Pain Split",
			"Poltergeist",
			"Shadow Sneak"
		],
		"478": [
			"Spikes",
			"Destiny Bond",
			"Taunt",
			"Will-O-Wisp",
			"Ice Beam",
			"Shadow Ball"
		],
		"479": [
			"Shadow Ball",
			"Thunderbolt",
			"Volt Switch",
			"Nasty Plot",
			"Substitute",
			"Trick"
		],
		"480": [
			"Encore",
			"Psychic Noise",
			"Draining Kiss",
			"Knock Off",
			"Nasty Plot",
			"Shadow Ball"
		],
		"481": [
			"Healing Wish",
			"U-turn",
			"Encore",
			"Knock Off",
			"Psychic Noise",
			"Stealth Rock"
		],
		"482": [
			"Fire Blast",
			"Psychic",
			"Explosion",
			"Stealth Rock",
			"Taunt",
			"Dazzling Gleam"
		],
		"483": [
			"Draco Meteor",
			"Flash Cannon",
			"Earth Power",
			"Dragon Tail",
			"Fire Blast",
			"Heavy Slam"
		],
		"484": [
			"Spacial Rend",
			"Hydro Pump",
			"Draco Meteor",
			"Fire Blast",
			"Surf",
			"Dragon Tail"
		],
		"485": [
			"Earth Power",
			"Magma Storm",
			"Stealth Rock",
			"Taunt",
			"Flash Cannon",
			"Protect"
		],
		"486": [
			"Facade",
			"Glacial Lance",
			"Knock Off",
			"Precipice Blades",
			"V-create",
			"Wicked Blow"
		],
		"487": [
			"Defog",
			"Dragon Tail",
			"Rest",
			"Will-O-Wisp",
			"Sleep Talk",
			"Toxic"
		],
		"488": [
			"Moonlight",
			"Moonblast",
			"Ice Beam",
			"Calm Mind",
			"Stored Power",
			"Lunar Dance"
		],
		"489": [
			"Heal Bell",
			"Rain Dance",
			"Scald",
			"U-turn"
		],
		"490": [
			"Tail Glow",
			"Ice Beam",
			"Scald",
			"Energy Ball",
			"Surf",
			"Psychic"
		],
		"491": [
			"Ice Beam",
			"Sludge Bomb",
			"Dark Pulse",
			"Focus Blast",
			"Nasty Plot",
			"Trick"
		],
		"492": [
			"Air Slash",
			"Dazzling Gleam",
			"Earth Power",
			"Rest",
			"Seed Flare",
			"Synthesis"
		],
		"493": [
			"Extreme Speed",
			"Shadow Claw",
			"Recover",
			"Swords Dance",
			"Earthquake",
			"Taunt"
		],
		"494": [
			"Bolt Strike",
			"U-turn",
			"V-create",
			"Encore",
			"Toxic",
			"Celebrate"
		],
		"495": [
			"Defog",
			"Hidden Power Ground",
			"Leaf Storm",
			"Glare",
			"Hidden Power Fire",
			"Knock Off"
		],
		"496": [
			"Giga Drain",
			"Glare",
			"Knock Off",
			"Leaf Storm",
			"Synthesis",
			"Tera Blast"
		],
		"497": [
			"Leaf Storm",
			"Glare",
			"Synthesis",
			"Hidden Power Fire",
			"Knock Off",
			"Substitute"
		],
		"498": [
			"Flame Charge",
			"Flare Blitz",
			"Head Smash",
			"Sucker Punch",
			"Superpower",
			"Wild Charge"
		],
		"499": [
			"Close Combat",
			"Flare Blitz",
			"High Horsepower",
			"Knock Off",
			"Sucker Punch"
		],
		"500": [
			"Close Combat",
			"Flare Blitz",
			"Earthquake",
			"Head Smash",
			"Knock Off",
			"Sucker Punch"
		],
		"501": [
			"Aerial Ace",
			"Aqua Jet",
			"Aqua Tail",
			"Sacred Sword",
			"Swords Dance"
		],
		"503": [
			"Flip Turn",
			"Hydro Pump",
			"Ice Beam",
			"Knock Off"
		],
		"504": [
			"Crunch",
			"Hypnosis",
			"Return",
			"Swords Dance",
			"Zen Headbutt"
		],
		"505": [
			"Knock Off",
			"Low Kick",
			"Return",
			"Seed Bomb"
		],
		"506": [
			"Fire Fang",
			"Play Rough",
			"Return",
			"Thunder Wave"
		],
		"508": ["Last Resort", "Retaliate"],
		"509": [
			"Encore",
			"Knock Off",
			"Taunt",
			"Thunder Wave",
			"U-turn"
		],
		"510": [
			"Copycat",
			"Encore",
			"Knock Off",
			"U-turn",
			"Dark Pulse",
			"Gunk Shot"
		],
		"511": [
			"Bullet Seed",
			"Gunk Shot",
			"Knock Off",
			"Low Sweep"
		],
		"512": [
			"Hidden Power Ice",
			"Knock Off",
			"Leaf Storm",
			"Superpower",
			"Energy Ball",
			"Focus Blast"
		],
		"513": [
			"Flame Charge",
			"Recycle",
			"Substitute",
			"Will-O-Wisp"
		],
		"514": [
			"Fire Blast",
			"Focus Blast",
			"Grass Knot",
			"Hidden Power Ice",
			"Nasty Plot",
			"Flamethrower"
		],
		"515": [
			"Hidden Power Grass",
			"Hydro Pump",
			"Ice Beam",
			"Nasty Plot"
		],
		"516": [
			"Hydro Pump",
			"Ice Beam",
			"Nasty Plot",
			"Focus Blast",
			"Grass Knot",
			"Substitute"
		],
		"517": [
			"Calm Mind",
			"Dazzling Gleam",
			"Moonlight",
			"Stored Power"
		],
		"518": [
			"Calm Mind",
			"Heal Bell",
			"Moonblast",
			"Moonlight",
			"Psychic"
		],
		"519": [
			"Aerial Ace",
			"Hidden Power Grass",
			"Return",
			"Tailwind",
			"U-turn"
		],
		"521": [
			"Brave Bird",
			"Facade",
			"Night Slash",
			"U-turn",
			"Quick Attack"
		],
		"522": [
			"Double-Edge",
			"Flame Charge",
			"Hidden Power Grass",
			"Volt Switch",
			"Wild Charge"
		],
		"523": [
			"Overheat",
			"Thunderbolt",
			"Volt Switch",
			"Hidden Power Grass",
			"Hidden Power Ice"
		],
		"524": [
			"Earthquake",
			"Explosion",
			"Rock Blast",
			"Stealth Rock"
		],
		"526": [
			"Earthquake",
			"Stealth Rock",
			"Toxic",
			"Rock Blast",
			"Stone Edge",
			"Protect"
		],
		"527": [
			"Air Slash",
			"Calm Mind",
			"Roost",
			"Stored Power"
		],
		"528": [
			"Calm Mind",
			"Heat Wave",
			"Stored Power",
			"Air Slash",
			"Roost",
			"Substitute"
		],
		"529": [
			"Earthquake",
			"Poison Jab",
			"Rapid Spin",
			"Rock Slide",
			"Stealth Rock"
		],
		"530": [
			"Earthquake",
			"Rapid Spin",
			"Iron Head",
			"Rock Slide",
			"Swords Dance",
			"Stealth Rock"
		],
		"531": [
			"Knock Off",
			"Moonblast",
			"Mortal Spin",
			"Recover",
			"Teleport",
			"Topsy-Turvy"
		],
		"532": [
			"Bulk Up",
			"Drain Punch",
			"Ice Punch",
			"Knock Off",
			"Mach Punch"
		],
		"533": [
			"Bulk Up",
			"Defog",
			"Drain Punch",
			"Knock Off",
			"Mach Punch"
		],
		"534": [
			"Knock Off",
			"Mach Punch",
			"Drain Punch",
			"Earthquake",
			"Facade",
			"Bulk Up"
		],
		"535": [
			"Earth Power",
			"Hydro Pump",
			"Rain Dance",
			"Sludge Bomb"
		],
		"536": [
			"Earth Power",
			"Toxic",
			"Rest",
			"Scald",
			"Sleep Talk",
			"Sludge Bomb"
		],
		"537": [
			"Earthquake",
			"Stealth Rock",
			"Power Whip",
			"Knock Off",
			"Ice Punch",
			"Toxic"
		],
		"538": [
			"Circle Throw",
			"Knock Off",
			"Rest",
			"Sleep Talk"
		],
		"539": [
			"Close Combat",
			"Earthquake",
			"Knock Off",
			"Poison Jab",
			"Counter",
			"Stone Edge"
		],
		"540": [
			"Air Slash",
			"Energy Ball",
			"Hidden Power Fire",
			"Hidden Power Rock",
			"Sticky Web"
		],
		"542": [
			"Knock Off",
			"Leaf Blade",
			"Magic Coat",
			"Sticky Web",
			"X-Scissor"
		],
		"543": [
			"Endeavor",
			"Pin Missile",
			"Protect",
			"Spikes"
		],
		"544": [
			"Toxic Spikes",
			"Spikes",
			"Endeavor",
			"Infestation",
			"Protect",
			"Toxic"
		],
		"545": [
			"Poison Jab",
			"Aqua Tail",
			"Earthquake",
			"Megahorn",
			"Swords Dance",
			"Endeavor"
		],
		"546": [
			"Dazzling Gleam",
			"Giga Drain",
			"Memento",
			"Stun Spore"
		],
		"547": [
			"Moonblast",
			"Encore",
			"Tailwind",
			"Protect",
			"U-turn",
			"Fake Tears"
		],
		"548": [
			"Giga Drain",
			"Hidden Power Fire",
			"Sleep Powder",
			"Solar Beam",
			"Sunny Day"
		],
		"549": [
			"Alluring Voice",
			"Charm",
			"Encore",
			"Giga Drain",
			"Quiver Dance"
		],
		"550": [
			"Aqua Jet",
			"Crunch",
			"Flip Turn",
			"Ice Beam",
			"Liquidation",
			"Superpower"
		],
		"551": [
			"Earthquake",
			"Stealth Rock",
			"Stone Edge",
			"Tera Blast"
		],
		"552": [
			"Earthquake",
			"Knock Off",
			"Stealth Rock",
			"Aqua Tail",
			"Brick Break",
			"Rock Slide"
		],
		"553": [
			"Earthquake",
			"Knock Off",
			"Stealth Rock",
			"Close Combat",
			"Gunk Shot",
			"Pursuit"
		],
		"554": [
			"Flare Blitz",
			"Rock Slide",
			"Superpower",
			"U-turn",
			"Zen Headbutt"
		],
		"555": [
			"Flare Blitz",
			"Earthquake",
			"Rock Slide",
			"Rest",
			"Trick",
			"U-turn"
		],
		"556": [
			"Giga Drain",
			"Knock Off",
			"Spikes",
			"Synthesis"
		],
		"557": [
			"Knock Off",
			"Rock Blast",
			"Shell Smash",
			"Spikes",
			"Stealth Rock",
			"Earthquake"
		],
		"558": [
			"X-Scissor",
			"Counter",
			"Earthquake",
			"Rock Blast",
			"Rock Wrecker",
			"Shell Smash"
		],
		"559": [
			"Drain Punch",
			"Knock Off",
			"Bulk Up",
			"Dragon Dance",
			"High Jump Kick",
			"Rest"
		],
		"560": [
			"Drain Punch",
			"Knock Off",
			"Bulk Up",
			"Rest",
			"Throat Chop",
			"Close Combat"
		],
		"561": [
			"Defog",
			"Heat Wave",
			"Roost",
			"Air Slash",
			"Calm Mind",
			"Energy Ball"
		],
		"562": [
			"Hex",
			"Knock Off",
			"Toxic Spikes",
			"Will-O-Wisp"
		],
		"563": [
			"Body Press",
			"Iron Defense",
			"Rest",
			"Shadow Ball"
		],
		"564": [
			"Aqua Jet",
			"Stone Edge",
			"Earthquake",
			"Knock Off",
			"Liquidation",
			"Shell Smash"
		],
		"565": [
			"Aqua Jet",
			"Hydro Pump",
			"Ice Beam",
			"Shell Smash",
			"Meteor Beam",
			"Stone Edge"
		],
		"566": [
			"Dual Wingbeat",
			"Earthquake",
			"Acrobatics",
			"Head Smash",
			"Heat Wave",
			"Knock Off"
		],
		"567": [
			"Head Smash",
			"Earthquake",
			"Heat Wave",
			"Dual Wingbeat",
			"Roost",
			"Stealth Rock"
		],
		"568": [
			"Drain Punch",
			"Explosion",
			"Giga Drain",
			"Spikes"
		],
		"569": [
			"Corrosive Gas",
			"Gunk Shot",
			"Pain Split",
			"Spikes",
			"Stomping Tantrum",
			"Toxic"
		],
		"570": [
			"Extrasensory",
			"Knock Off",
			"Sucker Punch",
			"Tera Blast",
			"Trick",
			"U-turn"
		],
		"571": [
			"Knock Off",
			"Dark Pulse",
			"Flamethrower",
			"Focus Blast",
			"Low Kick",
			"Sludge Bomb"
		],
		"572": [
			"Knock Off",
			"Protect",
			"Substitute",
			"Tail Slap",
			"Tidy Up",
			"U-turn"
		],
		"573": [
			"Tail Slap",
			"Tidy Up",
			"Bullet Seed",
			"Encore",
			"Knock Off",
			"Endeavor"
		],
		"574": [
			"Energy Ball",
			"Psychic",
			"Thunderbolt",
			"Trick"
		],
		"575": [
			"Dark Pulse",
			"Nasty Plot",
			"Psychic",
			"Thunderbolt"
		],
		"576": [
			"Rest",
			"Taunt",
			"Charm",
			"Calm Mind",
			"Stored Power",
			"Trick"
		],
		"577": [
			"Hidden Power Fighting",
			"Psychic",
			"Thunder",
			"Trick Room"
		],
		"578": [
			"Night Shade",
			"Recover",
			"Acid Armor",
			"Calm Mind",
			"Encore",
			"Future Sight"
		],
		"579": [
			"Focus Blast",
			"Recover",
			"Calm Mind",
			"Psychic Noise",
			"Psyshock",
			"Knock Off"
		],
		"580": [
			"Air Slash",
			"Defog",
			"Hurricane",
			"Roost",
			"Scald"
		],
		"581": [
			"Brave Bird",
			"Defog",
			"Flip Turn",
			"Roost"
		],
		"582": [
			"Explosion",
			"Hidden Power Fighting",
			"Ice Beam",
			"Substitute"
		],
		"584": [
			"Blizzard",
			"Freeze-Dry",
			"Aurora Veil",
			"Ice Shard",
			"Taunt",
			"Flash Cannon"
		],
		"585": [
			"Bullet Seed",
			"Headbutt",
			"Synthesis",
			"Thunder Wave",
			"Zen Headbutt"
		],
		"586": [
			"Double-Edge",
			"Horn Leech",
			"Jump Kick",
			"Swords Dance",
			"Headbutt",
			"Toxic"
		],
		"587": [
			"Acrobatics",
			"Knock Off",
			"Roost",
			"U-turn"
		],
		"588": [
			"Drill Run",
			"Knock Off",
			"Megahorn",
			"Poison Jab",
			"Pursuit"
		],
		"589": [
			"Iron Head",
			"Close Combat",
			"Knock Off",
			"Megahorn",
			"Swords Dance",
			"Metal Burst"
		],
		"590": [
			"Giga Drain",
			"Sludge Bomb",
			"Spore",
			"Synthesis"
		],
		"591": [
			"Clear Smog",
			"Foul Play",
			"Sludge Bomb",
			"Spore",
			"Giga Drain",
			"Synthesis"
		],
		"592": [
			"Hex",
			"Hydro Pump",
			"Ice Beam",
			"Recover",
			"Scald",
			"Shadow Ball"
		],
		"593": [
			"Recover",
			"Hex",
			"Taunt",
			"Will-O-Wisp",
			"Scald",
			"Hydro Pump"
		],
		"594": [
			"Flip Turn",
			"Protect",
			"Wish",
			"Scald",
			"Play Rough",
			"Mirror Coat"
		],
		"595": [
			"Bug Buzz",
			"Giga Drain",
			"Thunderbolt",
			"Volt Switch"
		],
		"596": [
			"Energy Ball",
			"Sticky Web",
			"Thunder",
			"Bug Buzz",
			"Thunder Wave",
			"Volt Switch"
		],
		"597": [
			"Spikes",
			"Stealth Rock",
			"Gyro Ball",
			"Knock Off",
			"Leech Seed",
			"Bullet Seed"
		],
		"598": [
			"Knock Off",
			"Leech Seed",
			"Spikes",
			"Power Whip",
			"Protect",
			"Stealth Rock"
		],
		"599": [
			"Gear Grind",
			"Return",
			"Shift Gear",
			"Wild Charge"
		],
		"600": [
			"Gear Grind",
			"Shift Gear",
			"Volt Switch",
			"Rest",
			"Sleep Talk",
			"Substitute"
		],
		"601": [
			"Gear Grind",
			"Toxic",
			"Wild Charge",
			"Facade",
			"Magnet Rise",
			"Shift Gear"
		],
		"603": [
			"Discharge",
			"Knock Off",
			"Super Fang",
			"U-turn"
		],
		"604": [
			"Dragon Tail",
			"Knock Off",
			"Acid Spray",
			"Coil",
			"Discharge",
			"Drain Punch"
		],
		"605": [
			"Hidden Power Fighting",
			"Nasty Plot",
			"Psychic",
			"Trick Room"
		],
		"606": [
			"Thunderbolt",
			"Psychic",
			"Recover",
			"Future Sight",
			"Meteor Beam",
			"Nasty Plot"
		],
		"607": [
			"Fire Blast",
			"Memento",
			"Pain Split",
			"Trick Room",
			"Will-O-Wisp"
		],
		"608": [
			"Calm Mind",
			"Energy Ball",
			"Fire Blast",
			"Shadow Ball",
			"Substitute",
			"Trick"
		],
		"609": [
			"Flamethrower",
			"Energy Ball",
			"Shadow Ball",
			"Overheat",
			"Fire Blast",
			"Trick"
		],
		"610": [
			"Dragon Dance",
			"First Impression",
			"Iron Head",
			"Outrage",
			"Stomping Tantrum",
			"Substitute"
		],
		"611": [
			"Outrage",
			"Stomping Tantrum",
			"Dragon Claw",
			"First Impression",
			"Scale Shot",
			"Swords Dance"
		],
		"612": [
			"Outrage",
			"Earthquake",
			"First Impression",
			"Close Combat",
			"Iron Tail",
			"Poison Jab"
		],
		"613": [
			"Ice Punch",
			"Play Rough",
			"Superpower",
			"Surf"
		],
		"614": [
			"Close Combat",
			"Earthquake",
			"Icicle Crash",
			"Icicle Spear",
			"Substitute",
			"Swords Dance"
		],
		"615": [
			"Flash Cannon",
			"Freeze-Dry",
			"Haze",
			"Ice Beam",
			"Rapid Spin",
			"Recover"
		],
		"616": [
			"Infestation",
			"Recover",
			"Spikes",
			"Toxic"
		],
		"617": [
			"Bug Buzz",
			"Focus Blast",
			"Sludge Bomb",
			"Spikes",
			"Encore",
			"Energy Ball"
		],
		"618": [
			"Discharge",
			"Earth Power",
			"Stealth Rock",
			"Toxic",
			"Foul Play",
			"Pain Split"
		],
		"619": [
			"Knock Off",
			"High Jump Kick",
			"U-turn",
			"Close Combat",
			"Fake Out",
			"Taunt"
		],
		"620": [
			"Close Combat",
			"Fake Out",
			"Knock Off",
			"Poison Jab",
			"Triple Axel",
			"U-turn"
		],
		"621": [
			"Dragon Tail",
			"Earthquake",
			"Glare",
			"Stealth Rock",
			"Dragon Claw",
			"Endure"
		],
		"622": [
			"Dynamic Punch",
			"Earthquake",
			"Poltergeist",
			"Rock Slide"
		],
		"623": [
			"Dynamic Punch",
			"Earthquake",
			"Poltergeist",
			"Ice Punch",
			"Stealth Rock",
			"Close Combat"
		],
		"624": [
			"Iron Head",
			"Sucker Punch",
			"Stealth Rock",
			"Swords Dance",
			"Tera Blast",
			"Thunder Wave"
		],
		"625": [
			"Iron Head",
			"Sucker Punch",
			"Swords Dance",
			"Throat Chop",
			"Knock Off",
			"Low Kick"
		],
		"626": [
			"Close Combat",
			"Facade",
			"Head Charge",
			"Substitute",
			"Swords Dance",
			"Throat Chop"
		],
		"627": [
			"Aerial Ace",
			"Brave Bird",
			"Close Combat",
			"Facade",
			"Agility",
			"Bulk Up"
		],
		"628": [
			"Brave Bird",
			"Close Combat",
			"Roost",
			"Body Slam",
			"Bulk Up",
			"Defog"
		],
		"629": [
			"Roost",
			"Brave Bird",
			"Endure",
			"Heat Wave",
			"Knock Off",
			"U-turn"
		],
		"630": [
			"Toxic",
			"Defog",
			"Foul Play",
			"Roost",
			"U-turn",
			"Knock Off"
		],
		"631": [
			"Fire Lash",
			"Knock Off",
			"Sucker Punch",
			"Superpower"
		],
		"632": [
			"First Impression",
			"Iron Head",
			"Superpower",
			"Protect",
			"Rock Slide",
			"Stomping Tantrum"
		],
		"633": [
			"Crunch",
			"Outrage",
			"Superpower",
			"Zen Headbutt"
		],
		"634": [
			"Crunch",
			"Outrage",
			"Stomping Tantrum",
			"Zen Headbutt"
		],
		"635": [
			"Dark Pulse",
			"Draco Meteor",
			"Flash Cannon",
			"Nasty Plot",
			"Earth Power",
			"Flamethrower"
		],
		"636": [
			"Flare Blitz",
			"Morning Sun",
			"U-turn",
			"Will-O-Wisp"
		],
		"637": [
			"Quiver Dance",
			"Giga Drain",
			"Bug Buzz",
			"Flamethrower",
			"Fiery Dance",
			"Morning Sun"
		],
		"638": [
			"Stealth Rock",
			"Volt Switch",
			"Taunt",
			"Body Press",
			"Iron Head",
			"Thunder Wave"
		],
		"639": [
			"Close Combat",
			"Earthquake",
			"Stone Edge",
			"Swords Dance",
			"Diamond Storm",
			"Poison Jab"
		],
		"640": [
			"Close Combat",
			"Leaf Blade",
			"Stone Edge",
			"Swords Dance",
			"Synthesis",
			"Zen Headbutt"
		],
		"641": [
			"Bleakwind Storm",
			"Taunt",
			"Protect",
			"Tailwind",
			"Rain Dance",
			"Sunny Day"
		],
		"642": [
			"Thunderbolt",
			"Grass Knot",
			"Thunder Wave",
			"Focus Blast",
			"Knock Off",
			"Psychic"
		],
		"643": [
			"Blue Flare",
			"Draco Meteor",
			"Earth Power",
			"Fusion Flare",
			"Shadow Ball"
		],
		"644": [
			"Bolt Strike",
			"Dragon Dance",
			"Dragon Claw",
			"Substitute",
			"Draco Meteor",
			"Outrage"
		],
		"645": [
			"Earth Power",
			"Sludge Wave",
			"Focus Blast",
			"Sandsear Storm",
			"Psychic",
			"Sludge Bomb"
		],
		"646": [
			"Earth Power",
			"Freeze-Dry",
			"Draco Meteor",
			"Ice Beam",
			"Blizzard",
			"Flash Cannon"
		],
		"647": [
			"Secret Sword",
			"Vacuum Wave",
			"Surf",
			"Hydro Pump",
			"Flip Turn",
			"Calm Mind"
		],
		"648": [
			"Focus Blast",
			"Psyshock",
			"Hyper Voice",
			"Shadow Ball",
			"U-turn",
			"Knock Off"
		],
		"649": [
			"Iron Head",
			"Ice Beam",
			"U-turn",
			"Bug Buzz",
			"Flamethrower",
			"Protect"
		],
		"650": [
			"Bullet Seed",
			"Drain Punch",
			"Rock Slide",
			"Spikes",
			"Synthesis"
		],
		"651": [
			"Super Fang",
			"Roar",
			"Spikes",
			"Synthesis",
			"Taunt",
			"Wood Hammer"
		],
		"652": [
			"Body Press",
			"Knock Off",
			"Spikes",
			"Synthesis",
			"Iron Defense",
			"Cotton Guard"
		],
		"653": [
			"Fire Blast",
			"Psychic",
			"Solar Beam",
			"Will-O-Wisp"
		],
		"654": [
			"Calm Mind",
			"Fire Blast",
			"Flamethrower",
			"Psychic",
			"Substitute"
		],
		"655": [
			"Encore",
			"Fire Blast",
			"Flamethrower",
			"Grass Knot",
			"Nasty Plot",
			"Psyshock"
		],
		"656": [
			"Hidden Power Fire",
			"Hidden Power Ground",
			"Hydro Pump",
			"Ice Beam",
			"U-turn"
		],
		"657": [
			"Spikes",
			"Ice Beam",
			"Surf",
			"U-turn",
			"Switcheroo",
			"Hydro Pump"
		],
		"658": [
			"Ice Beam",
			"Dark Pulse",
			"Extrasensory",
			"Hydro Pump",
			"Water Shuriken",
			"Sludge Wave"
		],
		"659": [
			"Earthquake",
			"Quick Attack",
			"Stone Edge",
			"Strength",
			"Swords Dance"
		],
		"660": [
			"Earthquake",
			"Fire Punch",
			"Quick Attack",
			"Return",
			"Knock Off",
			"Swords Dance"
		],
		"661": [
			"Acrobatics",
			"Flame Charge",
			"Hidden Power Grass",
			"Overheat",
			"Substitute",
			"Swords Dance"
		],
		"662": [
			"Brave Bird",
			"Roost",
			"Taunt",
			"Defog",
			"Flare Blitz",
			"Swords Dance"
		],
		"663": [
			"Roost",
			"Will-O-Wisp",
			"Brave Bird",
			"Flare Blitz",
			"U-turn",
			"Defog"
		],
		"666": [
			"Hurricane",
			"Sleep Powder",
			"Protect",
			"Rage Powder",
			"Stun Spore",
			"Tailwind"
		],
		"667": [
			"Flame Charge",
			"Flare Blitz",
			"Hidden Power Grass",
			"Return",
			"Wild Charge"
		],
		"668": [
			"Work Up",
			"Fire Blast",
			"Hyper Voice",
			"Taunt",
			"Will-O-Wisp"
		],
		"669": [
			"Calm Mind",
			"Moonblast",
			"Psychic",
			"Synthesis"
		],
		"671": [
			"Moonblast",
			"Synthesis",
			"Psychic Noise",
			"Wish",
			"Calm Mind",
			"Trick"
		],
		"672": [
			"Brick Break",
			"Bulk Up",
			"Horn Leech",
			"Rock Slide",
			"Zen Headbutt"
		],
		"673": [
			"Bulk Up",
			"Earthquake",
			"Horn Leech",
			"Milk Drink",
			"Rock Slide"
		],
		"674": [
			"Drain Punch",
			"Knock Off",
			"Parting Shot",
			"Swords Dance",
			"Zen Headbutt"
		],
		"675": [
			"Knock Off",
			"Bullet Punch",
			"Close Combat",
			"Gunk Shot",
			"Iron Head",
			"Swords Dance"
		],
		"676": [
			"Return",
			"Sucker Punch",
			"Toxic",
			"U-turn",
			"Surf",
			"Thunder Wave"
		],
		"677": [
			"Hidden Power Fire",
			"Psychic",
			"Substitute",
			"Thunderbolt"
		],
		"678": [
			"Charm",
			"Light Screen",
			"Reflect",
			"Thunder Wave",
			"Yawn"
		],
		"679": [
			"Iron Head",
			"Pursuit",
			"Rock Slide",
			"Sacred Sword",
			"Shadow Sneak",
			"Swords Dance"
		],
		"680": [
			"Close Combat",
			"Iron Head",
			"Shadow Sneak",
			"Swords Dance",
			"Shadow Claw",
			"Rock Slide"
		],
		"681": [
			"Close Combat",
			"King's Shield",
			"Shadow Sneak",
			"Shadow Ball",
			"Shadow Claw",
			"Swords Dance"
		],
		"682": [
			"Moonblast",
			"Psychic",
			"Covet",
			"Nasty Plot",
			"Protect",
			"Trick Room"
		],
		"683": [
			"Moonblast",
			"Disable",
			"Draining Kiss",
			"Encore",
			"Trick Room",
			"Heal Bell"
		],
		"684": [
			"Calm Mind",
			"Draining Kiss",
			"Energy Ball",
			"Flamethrower",
			"Thunderbolt"
		],
		"685": [
			"Belly Drum",
			"Endeavor",
			"Magic Coat",
			"Misty Explosion",
			"Play Rough",
			"Sticky Web"
		],
		"686": [
			"Knock Off",
			"Psycho Cut",
			"Superpower",
			"Switcheroo"
		],
		"687": [
			"Knock Off",
			"Superpower",
			"Rest",
			"Sleep Talk",
			"Psycho Cut",
			"Trick"
		],
		"688": [
			"Cross Chop",
			"Liquidation",
			"Shell Smash",
			"Stone Edge"
		],
		"689": [
			"Liquidation",
			"Shell Smash",
			"Stone Edge",
			"Grass Knot",
			"Aerial Ace",
			"Low Kick"
		],
		"690": [
			"Flip Turn",
			"Hydro Pump",
			"Sludge Wave",
			"Thunderbolt",
			"Toxic Spikes"
		],
		"691": [
			"Flip Turn",
			"Gunk Shot",
			"Protect",
			"Sludge Bomb",
			"Toxic Spikes"
		],
		"692": [
			"Hidden Power Fire",
			"Hidden Power Grass",
			"Ice Beam",
			"U-turn",
			"Water Pulse"
		],
		"693": [
			"Aura Sphere",
			"Dark Pulse",
			"Dragon Pulse",
			"Sludge Bomb",
			"U-turn",
			"Water Pulse"
		],
		"694": [
			"Glare",
			"Hidden Power Ground",
			"Surf",
			"Thunderbolt",
			"U-turn"
		],
		"695": [
			"Grass Knot",
			"Thunderbolt",
			"Volt Switch",
			"Hyper Voice",
			"Dark Pulse",
			"Focus Blast"
		],
		"696": [
			"Close Combat",
			"Dragon Dance",
			"Fire Fang",
			"Psychic Fangs",
			"Rock Blast"
		],
		"697": [
			"Close Combat",
			"Head Smash",
			"Earthquake",
			"Outrage",
			"Scale Shot",
			"Dragon Dance"
		],
		"698": [
			"Aurora Veil",
			"Blizzard",
			"Earth Power",
			"Freeze-Dry",
			"Thunderbolt"
		],
		"699": [
			"Earth Power",
			"Blizzard",
			"Stealth Rock",
			"Encore",
			"Freeze-Dry",
			"Meteor Beam"
		],
		"700": [
			"Hyper Voice",
			"Calm Mind",
			"Psyshock",
			"Hyper Beam",
			"Protect",
			"Shadow Ball"
		],
		"701": [
			"Acrobatics",
			"Close Combat",
			"Swords Dance",
			"Encore",
			"Low Kick",
			"Roost"
		],
		"702": [
			"Dazzling Gleam",
			"Grass Knot",
			"Super Fang",
			"Volt Switch"
		],
		"703": [
			"Body Press",
			"Iron Defense",
			"Moonblast",
			"Rest"
		],
		"704": [
			"Dragon Pulse",
			"Hidden Power Fire",
			"Rest",
			"Sleep Talk",
			"Sludge Wave"
		],
		"705": [
			"Curse",
			"Draco Meteor",
			"Outrage",
			"Rest",
			"Sleep Talk",
			"Thunderbolt"
		],
		"706": [
			"Draco Meteor",
			"Dragon Tail",
			"Fire Blast",
			"Flamethrower",
			"Sludge Bomb",
			"Sludge Wave"
		],
		"707": [
			"Spikes",
			"Foul Play",
			"Thunder Wave",
			"Light Screen",
			"Reflect",
			"Magnet Rise"
		],
		"708": [
			"Forest's Curse",
			"Horn Leech",
			"Poison Jab",
			"Rock Slide",
			"Shadow Claw"
		],
		"709": [
			"Poltergeist",
			"Rest",
			"Sucker Punch",
			"Wood Hammer",
			"Drain Punch",
			"Horn Leech"
		],
		"710": [
			"Fire Blast",
			"Giga Drain",
			"Shadow Ball",
			"Trick-or-Treat"
		],
		"711": [
			"Flame Charge",
			"Poltergeist",
			"Power Whip",
			"Shadow Sneak"
		],
		"712": [
			"Avalanche",
			"Rapid Spin",
			"Recover",
			"Toxic"
		],
		"713": [
			"Body Press",
			"Recover",
			"Avalanche",
			"Iron Defense",
			"Rapid Spin",
			"Earthquake"
		],
		"714": [
			"Draco Meteor",
			"Heat Wave",
			"Hurricane",
			"Tailwind"
		],
		"715": [
			"Draco Meteor",
			"Flamethrower",
			"Hurricane",
			"Roost",
			"U-turn",
			"Defog"
		],
		"716": [
			"Moonblast",
			"Thunder",
			"Aromatherapy",
			"Geomancy",
			"Substitute",
			"Strength Sap"
		],
		"717": [
			"Knock Off",
			"Toxic",
			"Foul Play",
			"Sucker Punch",
			"Taunt",
			"Dark Pulse"
		],
		"718": [
			"Coil",
			"Dragon Tail",
			"Rest",
			"Thousand Arrows",
			"Dragon Dance",
			"Glare"
		],
		"719": [
			"Moonblast",
			"Diamond Storm",
			"Earth Power",
			"Stealth Rock",
			"Trick Room",
			"Spikes"
		],
		"720": [
			"Focus Blast",
			"Shadow Ball",
			"Psyshock",
			"Psychic",
			"Trick",
			"Psychic Noise"
		],
		"721": [
			"Steam Eruption",
			"Earth Power",
			"Flamethrower",
			"Sludge Bomb",
			"Overheat",
			"Substitute"
		],
		"722": [
			"Brave Bird",
			"Leaf Blade",
			"Sucker Punch",
			"Swords Dance"
		],
		"724": [
			"Leaf Blade",
			"Poltergeist",
			"Shadow Ball",
			"Shadow Sneak",
			"Spirit Shackle",
			"U-turn"
		],
		"725": [
			"Fake Out",
			"Flare Blitz",
			"U-turn",
			"Will-O-Wisp"
		],
		"726": [
			"Taunt",
			"Crunch",
			"Flamethrower",
			"Flare Blitz",
			"Nasty Plot",
			"Overheat"
		],
		"727": [
			"Flare Blitz",
			"Knock Off",
			"Fake Out",
			"Parting Shot",
			"U-turn",
			"Will-O-Wisp"
		],
		"730": [
			"Moonblast",
			"Psychic Noise",
			"Calm Mind",
			"Draining Kiss",
			"Flip Turn",
			"Surf"
		],
		"731": [
			"Brave Bird",
			"Brick Break",
			"Bullet Seed",
			"Drill Peck",
			"Flame Charge",
			"U-turn"
		],
		"733": [
			"Brave Bird",
			"Bullet Seed",
			"Overheat",
			"Boomburst",
			"Brick Break",
			"Knock Off"
		],
		"734": [
			"Fire Fang",
			"Crunch",
			"Earthquake",
			"Pursuit",
			"Return",
			"U-turn"
		],
		"735": [
			"Crunch",
			"Earthquake",
			"Return",
			"U-turn"
		],
		"736": [
			"Acrobatics",
			"Electroweb",
			"Volt Switch",
			"X-Scissor"
		],
		"737": [
			"Lunge",
			"Skitter Smack",
			"Sticky Web",
			"Thunder Wave",
			"Volt Switch"
		],
		"738": [
			"Bug Buzz",
			"Energy Ball",
			"Thunderbolt",
			"Sticky Web",
			"Volt Switch",
			"Mud Shot"
		],
		"739": [
			"Bulk Up",
			"Drain Punch",
			"Earthquake",
			"Ice Punch",
			"Thunder Punch"
		],
		"740": [
			"Earthquake",
			"Ice Hammer",
			"Bulk Up",
			"Close Combat",
			"Drain Punch",
			"Knock Off"
		],
		"741": [
			"Quiver Dance",
			"Revelation Dance",
			"Roost",
			"Hurricane",
			"Taunt"
		],
		"742": [
			"Moonblast",
			"Sticky Web",
			"Stun Spore",
			"U-turn"
		],
		"743": [
			"Moonblast",
			"Sticky Web",
			"Stun Spore",
			"Skill Swap",
			"Psychic Noise",
			"Quiver Dance"
		],
		"744": [
			"Fire Fang",
			"Stomping Tantrum",
			"Stone Edge",
			"Sucker Punch",
			"Zen Headbutt"
		],
		"745": [
			"Accelerock",
			"Close Combat",
			"Endeavor",
			"Rock Blast",
			"Stealth Rock",
			"Taunt"
		],
		"746": [
			"Rest",
			"Scald",
			"Sleep Talk",
			"U-turn"
		],
		"747": [
			"Recover",
			"Sludge Bomb",
			"Ice Beam",
			"Mud Shot",
			"Haze",
			"Infestation"
		],
		"748": [
			"Haze",
			"Recover",
			"Toxic",
			"Toxic Spikes",
			"Poison Jab",
			"Infestation"
		],
		"749": [
			"Close Combat",
			"Earthquake",
			"Roar",
			"Stealth Rock",
			"Stone Edge"
		],
		"750": [
			"Body Press",
			"Earthquake",
			"Roar",
			"Stealth Rock",
			"Heavy Slam",
			"Protect"
		],
		"751": [
			"Bug Buzz",
			"Hydro Pump",
			"Ice Beam",
			"Surf"
		],
		"752": [
			"Sticky Web",
			"Liquidation",
			"Leech Life",
			"Endeavor",
			"Endure",
			"Lunge"
		],
		"753": [
			"Defog",
			"Hidden Power Fire",
			"Leaf Storm",
			"Synthesis"
		],
		"754": [
			"Defog",
			"Knock Off",
			"Leaf Storm",
			"Superpower",
			"Synthesis"
		],
		"755": [
			"Giga Drain",
			"Moonblast",
			"Spore",
			"Synthesis"
		],
		"756": [
			"Giga Drain",
			"Moonblast",
			"Spore",
			"Strength Sap",
			"Toxic"
		],
		"757": [
			"Fire Blast",
			"Protect",
			"Sludge Wave",
			"Substitute",
			"Tera Blast"
		],
		"758": [
			"Encore",
			"Toxic",
			"Fire Blast",
			"Flamethrower",
			"Sludge Bomb",
			"Knock Off"
		],
		"759": [
			"Brick Break",
			"Earthquake",
			"Ice Punch",
			"Return",
			"Superpower",
			"Swords Dance"
		],
		"760": [
			"Darkest Lariat",
			"Close Combat",
			"Double-Edge",
			"Drain Punch",
			"Swords Dance",
			"Bulk Up"
		],
		"761": [
			"Play Rough",
			"Rapid Spin",
			"Seed Bomb",
			"Synthesis"
		],
		"763": [
			"Knock Off",
			"Power Whip",
			"Rapid Spin",
			"U-turn",
			"High Jump Kick",
			"Low Kick"
		],
		"764": [
			"Draining Kiss",
			"Calm Mind",
			"Synthesis",
			"Tera Blast",
			"Floral Healing",
			"Giga Drain"
		],
		"765": [
			"Nasty Plot",
			"Psychic",
			"Substitute",
			"Thunderbolt"
		],
		"766": [
			"Close Combat",
			"Earthquake",
			"Gunk Shot",
			"Knock Off",
			"U-turn"
		],
		"767": [
			"Aqua Jet",
			"Scald",
			"Spikes",
			"Taunt"
		],
		"768": [
			"Spikes",
			"First Impression",
			"Knock Off",
			"Liquidation",
			"Leech Life",
			"U-turn"
		],
		"769": [
			"Scorching Sands",
			"Shadow Ball",
			"Shore Up",
			"Stealth Rock"
		],
		"770": [
			"Scorching Sands",
			"Shadow Ball",
			"Shore Up",
			"Stealth Rock",
			"Earth Power",
			"Sludge Bomb"
		],
		"771": [
			"Recover",
			"Rest",
			"Spite",
			"Block",
			"Toxic",
			"Counter"
		],
		"772": [
			"Rest",
			"Confide",
			"Flame Charge",
			"Iron Defense",
			"Sleep Talk",
			"Toxic"
		],
		"773": [
			"Crunch",
			"Multi-Attack",
			"Flamethrower",
			"Surf",
			"U-turn",
			"Explosion"
		],
		"774": [
			"Acrobatics",
			"Earthquake",
			"Shell Smash",
			"Stone Edge",
			"Substitute",
			"Tera Blast"
		],
		"775": [
			"Earthquake",
			"Knock Off",
			"Rapid Spin",
			"Return",
			"U-turn",
			"Bulk Up"
		],
		"776": [
			"Draco Meteor",
			"Fire Blast",
			"Flash Cannon",
			"Shell Smash"
		],
		"777": [
			"Iron Head",
			"Toxic",
			"U-turn",
			"Zing Zap",
			"Spiky Shield",
			"Wish"
		],
		"778": [
			"Play Rough",
			"Shadow Sneak",
			"Swords Dance",
			"Shadow Claw",
			"Curse",
			"Drain Punch"
		],
		"779": [
			"Aqua Jet",
			"Psychic Fangs",
			"Crunch",
			"Flip Turn",
			"Ice Fang",
			"Wave Crash"
		],
		"780": [
			"Hyper Voice",
			"Surf",
			"Calm Mind",
			"Draco Meteor",
			"Fire Blast",
			"Flamethrower"
		],
		"781": [
			"Poltergeist",
			"Power Whip",
			"Rapid Spin",
			"Synthesis",
			"Swords Dance",
			"Grassy Glide"
		],
		"782": [
			"Dragon Dance",
			"Earthquake",
			"Outrage",
			"Substitute"
		],
		"783": [
			"Drain Punch",
			"Dragon Tail",
			"Iron Head",
			"Rest",
			"Scale Shot",
			"Sleep Talk"
		],
		"784": [
			"Flamethrower",
			"Clanging Scales",
			"Clangorous Soul",
			"Drain Punch",
			"Protect",
			"Body Press"
		],
		"785": [
			"Thunderbolt",
			"Dazzling Gleam",
			"Hidden Power Ice",
			"U-turn",
			"Roost",
			"Volt Switch"
		],
		"786": [
			"Moonblast",
			"Psychic",
			"Psyshock",
			"Focus Blast",
			"Hidden Power Fire",
			"Thunderbolt"
		],
		"787": [
			"High Horsepower",
			"Horn Leech",
			"Swords Dance",
			"Close Combat",
			"Stone Edge",
			"Substitute"
		],
		"788": [
			"Moonblast",
			"Calm Mind",
			"Hydro Pump",
			"Muddy Water",
			"Trick",
			"Dazzling Gleam"
		],
		"791": [
			"Morning Sun",
			"Teleport",
			"Sunsteel Strike",
			"Knock Off",
			"Trick Room",
			"Calm Mind"
		],
		"792": [
			"Moongeist Beam",
			"Moonblast",
			"Meteor Beam",
			"Calm Mind",
			"Focus Blast",
			"Moonlight"
		],
		"793": [
			"Grass Knot",
			"Sludge Wave",
			"Thunderbolt",
			"Power Gem",
			"Hidden Power Fire",
			"Hidden Power Ice"
		],
		"794": [
			"Close Combat",
			"Earthquake",
			"Roost",
			"Bulk Up",
			"Drain Punch",
			"Toxic"
		],
		"795": [
			"Close Combat",
			"Rapid Spin",
			"Triple Axel",
			"U-turn"
		],
		"796": [
			"Energy Ball",
			"Dazzling Gleam",
			"Thunderbolt",
			"Volt Switch",
			"Rising Voltage",
			"Grass Knot"
		],
		"797": [
			"Heavy Slam",
			"Protect",
			"Leech Seed",
			"Air Slash",
			"Flamethrower",
			"Toxic"
		],
		"798": [
			"Knock Off",
			"Leaf Blade",
			"Sacred Sword",
			"Defog",
			"Giga Impact",
			"Smart Strike"
		],
		"799": [
			"Knock Off",
			"Dragon Tail",
			"Rest",
			"Sleep Talk",
			"Earthquake",
			"Heavy Slam"
		],
		"800": [
			"Photon Geyser",
			"Heat Wave",
			"Meteor Beam",
			"Stealth Rock",
			"Autotomize",
			"Calm Mind"
		],
		"801": [
			"Fleur Cannon",
			"Draining Kiss",
			"Encore",
			"Shift Gear",
			"Spikes",
			"Calm Mind"
		],
		"802": [
			"Spectral Thief",
			"Shadow Sneak",
			"Low Kick",
			"Poltergeist",
			"Bulk Up",
			"Close Combat"
		],
		"804": [
			"Draco Meteor",
			"Fire Blast",
			"Sludge Wave",
			"Flamethrower",
			"Nasty Plot",
			"Protect"
		],
		"805": [
			"Gyro Ball",
			"Stone Edge",
			"Body Press",
			"Trick Room",
			"Earthquake",
			"Heat Crash"
		],
		"806": [
			"Flamethrower",
			"Shadow Ball",
			"Trick",
			"Fire Blast",
			"Calm Mind",
			"Hidden Power Ice"
		],
		"807": [
			"Close Combat",
			"Plasma Fists",
			"Knock Off",
			"Electroweb",
			"Snarl",
			"Volt Switch"
		],
		"808": [
			"Acid Armor",
			"Flash Cannon",
			"Rest",
			"Thunderbolt"
		],
		"809": [
			"Double Iron Bash",
			"Earthquake",
			"Thunder Punch",
			"Superpower",
			"Ice Punch",
			"Nuzzle"
		],
		"810": [
			"Grassy Glide",
			"Knock Off",
			"U-turn",
			"Wood Hammer"
		],
		"811": [
			"Grassy Glide",
			"Knock Off",
			"U-turn",
			"Wood Hammer",
			"Swords Dance",
			"Taunt"
		],
		"812": [
			"Grassy Glide",
			"Wood Hammer",
			"U-turn",
			"Knock Off",
			"High Horsepower",
			"Fake Out"
		],
		"813": [
			"Blaze Kick",
			"Gunk Shot",
			"High Jump Kick",
			"Sucker Punch",
			"U-turn"
		],
		"814": [
			"Flare Blitz",
			"High Jump Kick",
			"Sucker Punch",
			"Double-Edge",
			"Quick Attack",
			"Swords Dance"
		],
		"815": [
			"Pyro Ball",
			"U-turn",
			"High Jump Kick",
			"Court Change",
			"Gunk Shot",
			"Sucker Punch"
		],
		"818": [
			"Ice Beam",
			"U-turn",
			"Dark Pulse",
			"Hydro Pump",
			"Mud Shot",
			"Surf"
		],
		"820": [
			"Belly Drum",
			"Crunch",
			"Earthquake",
			"Facade"
		],
		"823": [
			"Roost",
			"U-turn",
			"Body Press",
			"Brave Bird",
			"Defog",
			"Iron Head"
		],
		"826": [
			"Agility",
			"Body Press",
			"Iron Defense",
			"Light Screen",
			"Reflect",
			"Sticky Web"
		],
		"828": [
			"Dark Pulse",
			"Burning Jealousy",
			"Grass Knot",
			"Psychic",
			"Knock Off",
			"Nasty Plot"
		],
		"830": [
			"Aromatherapy",
			"Rapid Spin",
			"Sleep Powder",
			"Grass Knot",
			"Leaf Storm",
			"Leech Seed"
		],
		"832": [
			"Body Press",
			"Cotton Guard",
			"Rest",
			"Sleep Talk"
		],
		"833": [
			"Crunch",
			"Ice Fang",
			"Liquidation",
			"Protect",
			"Shell Smash"
		],
		"834": [
			"Crunch",
			"Earthquake",
			"Liquidation",
			"Shell Smash",
			"Stone Edge"
		],
		"836": [
			"Crunch",
			"Fire Fang",
			"Thunder Fang",
			"Volt Switch"
		],
		"839": [
			"Flamethrower",
			"Rapid Spin",
			"Spikes",
			"Body Press",
			"Earth Power",
			"Stealth Rock"
		],
		"841": [
			"Grav Apple",
			"Sucker Punch",
			"Acrobatics",
			"Draco Meteor",
			"Dragon Dance",
			"Grassy Glide"
		],
		"842": [
			"Apple Acid",
			"Draco Meteor",
			"Leech Seed",
			"Recover",
			"Body Press",
			"Dragon Pulse"
		],
		"844": [
			"Earthquake",
			"Rest",
			"Glare",
			"Stealth Rock",
			"Stone Edge",
			"Coil"
		],
		"845": [
			"Brave Bird",
			"Defog",
			"Roost",
			"Surf",
			"Hurricane",
			"Ice Beam"
		],
		"847": [
			"Close Combat",
			"Flip Turn",
			"Liquidation",
			"Aqua Jet",
			"Psychic Fangs",
			"Crunch"
		],
		"849": [
			"Boomburst",
			"Overdrive",
			"Sludge Bomb",
			"Volt Switch",
			"Shift Gear",
			"Sludge Wave"
		],
		"851": [
			"Coil",
			"Fire Lash",
			"Knock Off",
			"Leech Life",
			"Power Whip"
		],
		"853": [
			"Drain Punch",
			"Ice Punch",
			"Octolock",
			"Substitute"
		],
		"855": [
			"Shadow Ball",
			"Shell Smash",
			"Stored Power",
			"Tera Blast",
			"Giga Drain"
		],
		"857": [
			"Mystical Fire",
			"Nuzzle",
			"Giga Drain",
			"Healing Wish",
			"Psychic",
			"Rest"
		],
		"858": [
			"Mystical Fire",
			"Nuzzle",
			"Draining Kiss",
			"Psychic Noise",
			"Calm Mind",
			"Psyshock"
		],
		"859": [
			"Dazzling Gleam",
			"Light Screen",
			"Parting Shot",
			"Reflect"
		],
		"860": [
			"Dazzling Gleam",
			"Foul Play",
			"Light Screen",
			"Parting Shot",
			"Reflect",
			"Taunt"
		],
		"861": [
			"Reflect",
			"Spirit Break",
			"Light Screen",
			"Parting Shot",
			"Taunt",
			"Thunder Wave"
		],
		"862": [
			"Facade",
			"Knock Off",
			"Bulk Up",
			"Close Combat",
			"Parting Shot",
			"Switcheroo"
		],
		"863": [
			"Close Combat",
			"Fake Out",
			"Iron Head",
			"Knock Off",
			"U-turn"
		],
		"864": [
			"Earth Power",
			"Hex",
			"Power Gem",
			"Shadow Ball"
		],
		"865": [
			"Brave Bird",
			"Close Combat",
			"First Impression",
			"Knock Off"
		],
		"866": [
			"Freeze-Dry",
			"Future Sight",
			"Rapid Spin",
			"Slack Off"
		],
		"867": [
			"Earthquake",
			"Stealth Rock",
			"Toxic Spikes",
			"Body Press",
			"Rest",
			"Will-O-Wisp"
		],
		"869": [
			"Acid Armor",
			"Calm Mind",
			"Draining Kiss",
			"Stored Power"
		],
		"870": [
			"Close Combat",
			"First Impression",
			"Rock Slide",
			"Throat Chop"
		],
		"871": [
			"Discharge",
			"Memento",
			"Recover",
			"Spikes",
			"Scald"
		],
		"873": [
			"Giga Drain",
			"Ice Beam",
			"Quiver Dance",
			"Substitute",
			"Bug Buzz",
			"Defog"
		],
		"874": [
			"Earthquake",
			"Heat Crash",
			"Stone Edge",
			"Superpower"
		],
		"875": [
			"Belly Drum",
			"Icicle Spear",
			"Substitute",
			"Zen Headbutt"
		],
		"876": [
			"Dazzling Gleam",
			"Expanding Force",
			"Healing Wish",
			"Encore",
			"Shadow Ball",
			"Trick"
		],
		"877": [
			"Aura Wheel",
			"Knock Off",
			"Parting Shot",
			"Rapid Spin",
			"Seed Bomb"
		],
		"879": [
			"Earthquake",
			"Iron Head",
			"Knock Off",
			"Play Rough",
			"Protect",
			"Stealth Rock"
		],
		"880": [
			"Bolt Beak",
			"Draco Meteor",
			"Protect",
			"Substitute"
		],
		"881": [
			"Blizzard",
			"Bolt Beak",
			"Freeze-Dry",
			"Substitute",
			"Low Kick",
			"Stomping Tantrum"
		],
		"882": [
			"Crunch",
			"Dragon Rush",
			"Fishious Rend",
			"Psychic Fangs",
			"Sleep Talk"
		],
		"883": [
			"Fishious Rend",
			"Icicle Crash",
			"Crunch",
			"Freeze-Dry",
			"Protect",
			"Psychic Fangs"
		],
		"884": [
			"Body Press",
			"Draco Meteor",
			"Flash Cannon",
			"Roar",
			"Stealth Rock",
			"Dragon Tail"
		],
		"886": [
			"Draco Meteor",
			"Hex",
			"Thunder Wave",
			"U-turn",
			"Curse",
			"Dragon Tail"
		],
		"887": [
			"Dragon Darts",
			"U-turn",
			"Draco Meteor",
			"Phantom Force",
			"Will-O-Wisp",
			"Shadow Ball"
		],
		"888": [
			"Close Combat",
			"Crunch",
			"Play Rough",
			"Wild Charge",
			"Glare",
			"Magical Torque"
		],
		"889": [
			"Crunch",
			"Stone Edge",
			"Close Combat",
			"Heavy Slam",
			"Ice Fang",
			"Body Press"
		],
		"890": [
			"Dynamax Cannon",
			"Recover",
			"Sludge Bomb",
			"Fire Blast",
			"Toxic Spikes",
			"Toxic"
		],
		"892": [
			"Wicked Blow",
			"Close Combat",
			"Sucker Punch",
			"U-turn",
			"Detect",
			"Poison Jab"
		],
		"893": [
			"Power Whip",
			"Jungle Healing",
			"Close Combat",
			"Knock Off",
			"Swords Dance",
			"Darkest Lariat"
		],
		"894": [
			"Rapid Spin",
			"Volt Switch",
			"Explosion",
			"Light Screen",
			"Reflect",
			"Thunderbolt"
		],
		"895": [
			"Draco Meteor",
			"Dragon Energy",
			"Earth Power",
			"Protect",
			"Tera Blast",
			"Dragon Pulse"
		],
		"896": [
			"Close Combat",
			"Icicle Crash",
			"Swords Dance",
			"High Horsepower",
			"Stomping Tantrum",
			"Substitute"
		],
		"897": [
			"Shadow Ball",
			"Draining Kiss",
			"Substitute",
			"Will-O-Wisp",
			"Calm Mind",
			"Nasty Plot"
		],
		"898": [
			"Glacial Lance",
			"High Horsepower",
			"Trick Room",
			"Swords Dance",
			"Leech Seed",
			"Protect"
		],
		"900": [
			"Stone Axe",
			"Close Combat",
			"U-turn",
			"X-Scissor",
			"Night Slash",
			"Dragon Ascent"
		],
		"901": [
			"Earthquake",
			"Facade",
			"Headlong Rush",
			"Swords Dance",
			"Protect",
			"Ice Punch"
		],
		"902": [
			"Aqua Jet",
			"Wave Crash",
			"Flip Turn",
			"Last Respects",
			"Liquidation",
			"Tera Blast"
		],
		"903": [
			"Close Combat",
			"Dire Claw",
			"U-turn",
			"Gunk Shot",
			"Acrobatics",
			"Switcheroo"
		],
		"904": [
			"Crunch",
			"Gunk Shot",
			"Liquidation",
			"Swords Dance",
			"Spikes",
			"Throat Chop"
		],
		"905": [
			"Moonblast",
			"Earth Power",
			"Healing Wish",
			"Mystical Fire",
			"Superpower",
			"Taunt"
		],
		"908": [
			"Flower Trick",
			"Knock Off",
			"U-turn",
			"Triple Axel",
			"Low Kick",
			"Play Rough"
		],
		"909": [
			"Flamethrower",
			"Roar",
			"Slack Off",
			"Will-O-Wisp"
		],
		"910": [
			"Flamethrower",
			"Roar",
			"Slack Off",
			"Will-O-Wisp",
			"Encore",
			"Fire Spin"
		],
		"911": [
			"Slack Off",
			"Torch Song",
			"Will-O-Wisp",
			"Earth Power",
			"Hex",
			"Shadow Ball"
		],
		"912": [
			"Aqua Jet",
			"Brave Bird",
			"Liquidation",
			"Rapid Spin"
		],
		"913": [
			"Encore",
			"Flip Turn",
			"Rapid Spin",
			"Roost",
			"Surf",
			"Triple Axel"
		],
		"914": [
			"Aqua Step",
			"Close Combat",
			"Knock Off",
			"Rapid Spin",
			"Roost",
			"Encore"
		],
		"919": [
			"Agility",
			"First Impression",
			"Leech Life",
			"Sucker Punch",
			"U-turn"
		],
		"920": [
			"First Impression",
			"Knock Off",
			"Sucker Punch",
			"U-turn",
			"Leech Life",
			"Swords Dance"
		],
		"923": [
			"Ice Punch",
			"Close Combat",
			"Double Shock",
			"Revival Blessing",
			"Mach Punch",
			"Volt Switch"
		],
		"925": [
			"Population Bomb",
			"Bite",
			"Taunt",
			"Tidy Up",
			"Encore",
			"Follow Me"
		],
		"930": [
			"Giga Drain",
			"Hyper Voice",
			"Earth Power",
			"Leaf Storm",
			"Leech Seed",
			"Strength Sap"
		],
		"933": [
			"Recover",
			"Salt Cure",
			"Body Press",
			"Stealth Rock",
			"Curse",
			"Protect"
		],
		"934": [
			"Recover",
			"Salt Cure",
			"Stealth Rock",
			"Body Press",
			"Curse",
			"Iron Defense"
		],
		"936": [
			"Armor Cannon",
			"Aura Sphere",
			"Energy Ball",
			"Expanding Force",
			"Stored Power",
			"Endure"
		],
		"937": [
			"Bitter Blade",
			"Shadow Sneak",
			"Poltergeist",
			"Swords Dance",
			"Close Combat",
			"Endure"
		],
		"939": [
			"Volt Switch",
			"Muddy Water",
			"Parabolic Charge",
			"Slack Off",
			"Soak",
			"Chilling Water"
		],
		"940": [
			"Discharge",
			"Hurricane",
			"Roost",
			"Volt Switch"
		],
		"941": [
			"Hurricane",
			"Volt Switch",
			"Thunderbolt",
			"Roost",
			"Air Slash",
			"Thunder"
		],
		"942": [
			"Crunch",
			"Fire Fang",
			"Ice Fang",
			"Play Rough",
			"Psychic Fangs"
		],
		"943": [
			"Crunch",
			"Destiny Bond",
			"Play Rough",
			"Psychic Fangs"
		],
		"944": [
			"Knock Off",
			"Double-Edge",
			"Gunk Shot",
			"Parting Shot",
			"Acrobatics",
			"Encore"
		],
		"946": [
			"Power Whip",
			"Rapid Spin",
			"Shadow Sneak",
			"Strength Sap",
			"Tera Blast"
		],
		"947": [
			"Rapid Spin",
			"Poltergeist",
			"Power Whip",
			"Shadow Sneak",
			"Spikes",
			"Strength Sap"
		],
		"948": [
			"Dazzling Gleam",
			"Earth Power",
			"Giga Drain",
			"Knock Off",
			"Rapid Spin",
			"Spikes"
		],
		"949": [
			"Earth Power",
			"Rapid Spin",
			"Spikes",
			"Knock Off",
			"Leaf Storm",
			"Toxic"
		],
		"952": [
			"Giga Drain",
			"Solar Beam",
			"Flamethrower",
			"Fire Blast",
			"Overheat",
			"Leaf Storm"
		],
		"956": [
			"Calm Mind",
			"Protect",
			"Dazzling Gleam",
			"Stored Power",
			"Tera Blast",
			"Roost"
		],
		"957": [
			"Draining Kiss",
			"Knock Off",
			"Stealth Rock",
			"Encore",
			"Thunder Wave"
		],
		"958": [
			"Encore",
			"Knock Off",
			"Stealth Rock",
			"Thunder Wave",
			"Ice Hammer",
			"Play Rough"
		],
		"959": [
			"Gigaton Hammer",
			"Encore",
			"Knock Off",
			"Stealth Rock",
			"Thunder Wave",
			"Swords Dance"
		],
		"962": [
			"Knock Off",
			"Roost",
			"Stealth Rock",
			"Sucker Punch",
			"Brave Bird",
			"Parting Shot"
		],
		"963": [
			"Boomburst",
			"Ice Beam",
			"Protect",
			"Surf"
		],
		"964": [
			"Jet Punch",
			"Drain Punch",
			"Bulk Up",
			"Flip Turn",
			"Close Combat",
			"Wave Crash"
		],
		"965": [
			"Parting Shot",
			"Poison Jab",
			"Thief",
			"Toxic Spikes"
		],
		"966": [
			"Gunk Shot",
			"High Horsepower",
			"Shift Gear",
			"Temper Flare"
		],
		"967": [
			"Knock Off",
			"Rapid Spin",
			"U-turn",
			"Draco Meteor",
			"Taunt",
			"Boomburst"
		],
		"968": [
			"Body Press",
			"Heavy Slam",
			"Spikes",
			"Stealth Rock",
			"Coil",
			"Iron Defense"
		],
		"969": [
			"Power Gem",
			"Spikes",
			"Stealth Rock",
			"Memento",
			"Mud Shot",
			"Sludge Bomb"
		],
		"970": [
			"Earth Power",
			"Mortal Spin",
			"Stealth Rock",
			"Power Gem",
			"Sludge Bomb",
			"Energy Ball"
		],
		"972": [
			"Body Press",
			"Pain Split",
			"Play Rough",
			"Poltergeist",
			"Shadow Sneak",
			"Will-O-Wisp"
		],
		"973": [
			"Close Combat",
			"Brave Bird",
			"Roost",
			"U-turn",
			"Throat Chop",
			"Acrobatics"
		],
		"975": [
			"Belly Drum",
			"Earthquake",
			"Ice Shard",
			"Ice Spinner",
			"Icicle Crash",
			"Icicle Spear"
		],
		"976": [
			"Aqua Cutter",
			"Aqua Jet",
			"Fillet Away",
			"Night Slash",
			"Psycho Cut",
			"Slash"
		],
		"977": [
			"Wave Crash",
			"Protect",
			"Rest",
			"Curse",
			"Earthquake",
			"Sleep Talk"
		],
		"978": [
			"Draco Meteor",
			"Muddy Water",
			"Dragon Pulse",
			"Icy Wind",
			"Nasty Plot",
			"Protect"
		],
		"979": [
			"Rage Fist",
			"Bulk Up",
			"Close Combat",
			"Drain Punch",
			"Final Gambit",
			"Taunt"
		],
		"980": [
			"Earthquake",
			"Recover",
			"Toxic",
			"Stealth Rock",
			"Spikes",
			"Poison Jab"
		],
		"981": [
			"Psychic",
			"Trick Room",
			"Helping Hand",
			"Hyper Voice",
			"Protect",
			"Psyshock"
		],
		"982": [
			"Boomburst",
			"Roost",
			"Calm Mind",
			"Earth Power",
			"Glare",
			"Hex"
		],
		"983": [
			"Sucker Punch",
			"Iron Head",
			"Kowtow Cleave",
			"Low Kick",
			"Swords Dance",
			"Knock Off"
		],
		"984": [
			"Knock Off",
			"Headlong Rush",
			"Rapid Spin",
			"Ice Spinner",
			"Close Combat",
			"Earthquake"
		],
		"985": [
			"Dazzling Gleam",
			"Encore",
			"Protect",
			"Psychic Noise",
			"Stealth Rock",
			"Thunder Wave"
		],
		"986": [
			"Sucker Punch",
			"Crunch",
			"Close Combat",
			"Seed Bomb",
			"Spore",
			"Growth"
		],
		"987": [
			"Moonblast",
			"Shadow Ball",
			"Icy Wind",
			"Power Gem",
			"Protect",
			"Taunt"
		],
		"988": [
			"Close Combat",
			"U-turn",
			"First Impression",
			"Earthquake",
			"Flare Blitz",
			"Morning Sun"
		],
		"989": [
			"Earth Power",
			"Thunderbolt",
			"Spikes",
			"Stealth Rock",
			"Volt Switch",
			"Power Gem"
		],
		"990": [
			"Rapid Spin",
			"Knock Off",
			"Earthquake",
			"Ice Spinner",
			"Stealth Rock",
			"Volt Switch"
		],
		"991": [
			"Freeze-Dry",
			"Hydro Pump",
			"Ice Beam",
			"Encore",
			"Flip Turn",
			"Icy Wind"
		],
		"992": [
			"Drain Punch",
			"Ice Punch",
			"Thunder Punch",
			"Swords Dance",
			"Heavy Slam",
			"Close Combat"
		],
		"993": [
			"Earth Power",
			"Hurricane",
			"Dark Pulse",
			"Taunt",
			"Air Slash",
			"Fire Blast"
		],
		"994": [
			"Sludge Wave",
			"Dazzling Gleam",
			"Energy Ball",
			"Fiery Dance",
			"Discharge",
			"Flamethrower"
		],
		"995": [
			"Dragon Dance",
			"Earthquake",
			"Ice Punch",
			"Wild Charge",
			"Pin Missile",
			"Rock Blast"
		],
		"998": [
			"Ice Shard",
			"Earthquake",
			"Icicle Spear",
			"Scale Shot",
			"Glaive Rush",
			"Icicle Crash"
		],
		"999": [
			"Nasty Plot",
			"Power Gem",
			"Shadow Ball",
			"Substitute"
		],
		"1000": [
			"Shadow Ball",
			"Make It Rain",
			"Nasty Plot",
			"Recover",
			"Focus Blast",
			"Trick"
		],
		"1001": [
			"Leech Seed",
			"Ruination",
			"Foul Play",
			"Knock Off",
			"Protect",
			"Taunt"
		],
		"1002": [
			"Icicle Crash",
			"Sucker Punch",
			"Ice Shard",
			"Sacred Sword",
			"Crunch",
			"Ice Spinner"
		],
		"1003": [
			"Ruination",
			"Spikes",
			"Stealth Rock",
			"Earthquake",
			"Whirlwind",
			"Throat Chop"
		],
		"1004": [
			"Dark Pulse",
			"Overheat",
			"Flamethrower",
			"Heat Wave",
			"Snarl",
			"Fire Blast"
		],
		"1005": [
			"Knock Off",
			"Earthquake",
			"Dragon Dance",
			"Acrobatics",
			"Iron Head",
			"Outrage"
		],
		"1006": [
			"Moonblast",
			"Close Combat",
			"Thunderbolt",
			"Knock Off",
			"Encore",
			"Shadow Ball"
		],
		"1007": [
			"Flare Blitz",
			"Close Combat",
			"Flame Charge",
			"Outrage",
			"Swords Dance",
			"Dragon Claw"
		],
		"1008": [
			"Electro Drift",
			"Draco Meteor",
			"Volt Switch",
			"Dazzling Gleam",
			"U-turn",
			"Calm Mind"
		],
		"1009": [
			"Draco Meteor",
			"Flamethrower",
			"Hydro Steam",
			"Flip Turn",
			"Hydro Pump",
			"Scald"
		],
		"1010": [
			"Close Combat",
			"Leaf Blade",
			"Psyblade",
			"Swords Dance",
			"Wild Charge",
			"Trailblaze"
		],
		"1011": [
			"Dragon Tail",
			"Giga Drain",
			"Growth",
			"Recover"
		],
		"1013": [
			"Matcha Gotcha",
			"Calm Mind",
			"Strength Sap",
			"Shadow Ball",
			"Hex",
			"Rage Powder"
		],
		"1014": [
			"Knock Off",
			"Drain Punch",
			"Gunk Shot",
			"Ice Punch",
			"Bulk Up",
			"Poison Jab"
		],
		"1015": [
			"Psychic",
			"Sludge Wave",
			"Focus Blast",
			"Shadow Ball",
			"U-turn",
			"Psyshock"
		],
		"1016": [
			"Roost",
			"Heat Wave",
			"U-turn",
			"Moonblast",
			"Beat Up",
			"Calm Mind"
		],
		"1017": [
			"Ivy Cudgel",
			"Knock Off",
			"U-turn",
			"Encore",
			"Diamond Storm",
			"Pyro Ball"
		],
		"1018": [
			"Body Press",
			"Draco Meteor",
			"Electro Shot",
			"Flash Cannon",
			"Stealth Rock",
			"Thunderbolt"
		],
		"1019": [
			"Earth Power",
			"Fickle Beam",
			"Nasty Plot",
			"Draco Meteor",
			"Giga Drain",
			"Leaf Storm"
		],
		"1020": [
			"Flare Blitz",
			"Dragon Dance",
			"Earthquake",
			"Morning Sun",
			"Heat Crash",
			"Breaking Swipe"
		],
		"1021": [
			"Thunderclap",
			"Thunderbolt",
			"Draco Meteor",
			"Dragon Pulse",
			"Calm Mind",
			"Volt Switch"
		],
		"1022": [
			"Mighty Cleave",
			"Close Combat",
			"Earthquake",
			"Zen Headbutt",
			"Swords Dance",
			"Megahorn"
		],
		"1023": [
			"Tachyon Cutter",
			"Focus Blast",
			"Calm Mind",
			"Psychic Noise",
			"Volt Switch",
			"Psyshock"
		],
		"1024": [
			"Tera Starstorm",
			"Earth Power",
			"Flamethrower",
			"Ice Beam",
			"Calm Mind",
			"Protect"
		],
		"1025": [
			"Recover",
			"Malignant Chain",
			"Parting Shot",
			"Hex",
			"Shadow Ball",
			"Foul Play"
		],
		"26:alola": [
			"Nasty Plot",
			"Draining Kiss",
			"Grass Knot",
			"Psyshock",
			"Thunderbolt",
			"Focus Blast"
		],
		"27:alola": [
			"Ice Shard",
			"Earthquake",
			"Rapid Spin",
			"Swords Dance",
			"Triple Axel"
		],
		"28:alola": [
			"Knock Off",
			"Earthquake",
			"Rapid Spin",
			"Spikes",
			"Stealth Rock",
			"Triple Axel"
		],
		"38:alola": [
			"Encore",
			"Moonblast",
			"Freeze-Dry",
			"Aurora Veil",
			"Blizzard",
			"Protect"
		],
		"50:alola": [
			"Earthquake",
			"Iron Head",
			"Rock Blast",
			"Substitute",
			"Sucker Punch"
		],
		"51:alola": [
			"Earthquake",
			"Iron Head",
			"Sucker Punch",
			"Endeavor",
			"Memento",
			"Stealth Rock"
		],
		"53:alola": [
			"Foul Play",
			"Knock Off",
			"Parting Shot",
			"Taunt",
			"Switcheroo",
			"Thunder Wave"
		],
		"58:hisui": [
			"Flare Blitz",
			"Head Smash",
			"Stealth Rock",
			"Close Combat",
			"Flame Charge",
			"Psychic Fangs"
		],
		"59:hisui": [
			"Flare Blitz",
			"Head Smash",
			"Extreme Speed",
			"Close Combat",
			"Morning Sun",
			"Rock Slide"
		],
		"75:alola": [
			"Body Slam",
			"Fire Punch",
			"Focus Punch",
			"Volt Switch"
		],
		"76:alola": [
			"Brick Break",
			"Earthquake",
			"Fire Punch",
			"Wild Charge"
		],
		"80:galar": [
			"Flamethrower",
			"Psyshock",
			"Slack Off",
			"Sludge Bomb",
			"Surf",
			"Calm Mind"
		],
		"88:alola": [
			"Knock Off",
			"Sleep Talk",
			"Drain Punch",
			"Gunk Shot",
			"Memento",
			"Poison Jab"
		],
		"89:alola": [
			"Knock Off",
			"Poison Jab",
			"Drain Punch",
			"Protect",
			"Pursuit",
			"Rest"
		],
		"101:hisui": [
			"Thunderbolt",
			"Volt Switch",
			"Leaf Storm",
			"Chloroblast",
			"Thunder Wave",
			"Worry Seed"
		],
		"103:alola": [
			"Draco Meteor",
			"Flamethrower",
			"Giga Drain",
			"Leaf Storm",
			"Knock Off",
			"Dragon Pulse"
		],
		"110:galar": [
			"Will-O-Wisp",
			"Strange Steam",
			"Defog",
			"Pain Split",
			"Toxic Spikes",
			"Protect"
		],
		"128:paldea": [
			"Close Combat",
			"Raging Bull",
			"Earthquake",
			"Flare Blitz",
			"Bulk Up",
			"Stone Edge"
		],
		"145:galar": [
			"Close Combat",
			"Knock Off",
			"Brave Bird",
			"U-turn",
			"Dragon Ascent",
			"Roost"
		],
		"146:galar": [
			"Fiery Wrath",
			"Hurricane",
			"Nasty Plot",
			"Agility",
			"Air Slash",
			"Taunt"
		],
		"157:hisui": [
			"Shadow Ball",
			"Eruption",
			"Focus Blast",
			"Fire Blast",
			"Flamethrower",
			"Infernal Parade"
		],
		"194:paldea": [
			"Earthquake",
			"Recover",
			"Spikes",
			"Toxic"
		],
		"199:galar": [
			"Future Sight",
			"Sludge Bomb",
			"Flamethrower",
			"Chilly Reception",
			"Ice Beam",
			"Slack Off"
		],
		"211:hisui": [
			"Crunch",
			"Aqua Jet",
			"Barb Barrage",
			"Gunk Shot",
			"Pain Split",
			"Self-Destruct"
		],
		"215:hisui": [
			"Close Combat",
			"Gunk Shot",
			"Swords Dance",
			"Throat Chop",
			"Trailblaze",
			"Switcheroo"
		],
		"222:galar": [
			"Mirror Coat",
			"Night Shade",
			"Stealth Rock",
			"Strength Sap",
			"Whirlpool",
			"Will-O-Wisp"
		],
		"503:hisui": [
			"Ceaseless Edge",
			"Aqua Cutter",
			"Razor Shell",
			"Sucker Punch",
			"Knock Off",
			"Flip Turn"
		],
		"549:hisui": [
			"Close Combat",
			"Ice Spinner",
			"Leaf Blade",
			"Sleep Powder",
			"Solar Blade",
			"Victory Dance"
		],
		"555:galar": [
			"Earthquake",
			"Icicle Crash",
			"U-turn",
			"Flare Blitz",
			"Rock Slide"
		],
		"570:hisui": [
			"Hex",
			"Knock Off",
			"Tera Blast",
			"U-turn",
			"Will-O-Wisp"
		],
		"571:hisui": [
			"Focus Blast",
			"Shadow Ball",
			"Flamethrower",
			"U-turn",
			"Hyper Voice",
			"Knock Off"
		],
		"628:hisui": [
			"Heat Wave",
			"Hurricane",
			"Agility",
			"Air Slash",
			"Esper Wing",
			"Psychic"
		],
		"705:hisui": [
			"Acid Spray",
			"Draco Meteor",
			"Flash Cannon",
			"Thunderbolt",
			"Ice Beam",
			"Rest"
		],
		"706:hisui": [
			"Heavy Slam",
			"Draco Meteor",
			"Dragon Tail",
			"Knock Off",
			"Flamethrower",
			"Protect"
		],
		"713:hisui": [
			"Body Press",
			"Mountain Gale",
			"Rapid Spin",
			"Stealth Rock",
			"Icicle Spear",
			"Recover"
		],
		"724:hisui": [
			"Knock Off",
			"Triple Arrows",
			"U-turn",
			"Roost",
			"Leaf Blade",
			"Sucker Punch"
		],
		"77:galar": [
			"Dazzling Gleam",
			"Morning Sun",
			"Mystical Fire",
			"Psychic"
		],
		"78:galar": [
			"Morning Sun",
			"Calm Mind",
			"Dazzling Gleam",
			"High Horsepower",
			"Mystical Fire",
			"Play Rough"
		],
		"83:galar": [
			"Close Combat",
			"Knock Off",
			"Brave Bird",
			"Final Gambit",
			"Quick Attack",
			"Swords Dance"
		],
		"105:alola": [
			"Poltergeist",
			"Flare Blitz",
			"Shadow Bone",
			"Earthquake",
			"Swords Dance",
			"Bonemerang"
		],
		"144:galar": [
			"Hurricane",
			"Freezing Glare",
			"Future Sight",
			"Recover",
			"U-turn",
			"Agility"
		],
		"264:galar": [
			"Knock Off",
			"Parting Shot",
			"Taunt",
			"Double-Edge",
			"Facade",
			"Protect"
		],
		"618:galar": [
			"Earthquake",
			"Stealth Rock",
			"Foul Play",
			"Rock Slide",
			"Yawn",
			"Curse"
		],
		"19:alola": [
			"Crunch",
			"Double-Edge",
			"Pursuit",
			"Quick Attack",
			"Return",
			"Sucker Punch"
		],
		"20:alola": [
			"Double-Edge",
			"Knock Off",
			"Sucker Punch",
			"Swords Dance"
		],
		"52:alola": [
			"Dark Pulse",
			"Hidden Power Fighting",
			"Parting Shot",
			"Thunderbolt",
			"Nasty Plot",
			"Taunt"
		],
		"74:alola": [
			"Fire Punch",
			"Rock Blast",
			"Stealth Rock",
			"Superpower"
		]
	};
	var ABILITY_NAMES = {
		"1": "Stench",
		"2": "Drizzle",
		"3": "Speed Boost",
		"4": "Battle Armor",
		"5": "Sturdy",
		"6": "Damp",
		"7": "Limber",
		"8": "Sand Veil",
		"9": "Static",
		"10": "Volt Absorb",
		"11": "Water Absorb",
		"12": "Oblivious",
		"13": "Cloud Nine",
		"14": "Compound Eyes",
		"15": "Insomnia",
		"16": "Color Change",
		"17": "Immunity",
		"18": "Flash Fire",
		"19": "Shield Dust",
		"20": "Own Tempo",
		"21": "Suction Cups",
		"22": "Intimidate",
		"23": "Shadow Tag",
		"24": "Rough Skin",
		"25": "Wonder Guard",
		"26": "Levitate",
		"27": "Effect Spore",
		"28": "Synchronize",
		"29": "Clear Body",
		"30": "Natural Cure",
		"31": "Lightning Rod",
		"32": "Serene Grace",
		"33": "Swift Swim",
		"34": "Chlorophyll",
		"35": "Illuminate",
		"36": "Trace",
		"37": "Huge Power",
		"38": "Poison Point",
		"39": "Inner Focus",
		"40": "Magma Armor",
		"41": "Water Veil",
		"42": "Magnet Pull",
		"43": "Soundproof",
		"44": "Rain Dish",
		"45": "Sand Stream",
		"46": "Pressure",
		"47": "Thick Fat",
		"48": "Early Bird",
		"49": "Flame Body",
		"50": "Run Away",
		"51": "Keen Eye",
		"52": "Hyper Cutter",
		"53": "Pickup",
		"54": "Truant",
		"55": "Hustle",
		"56": "Cute Charm",
		"57": "Plus",
		"58": "Minus",
		"59": "Forecast",
		"60": "Sticky Hold",
		"61": "Shed Skin",
		"62": "Guts",
		"63": "Marvel Scale",
		"64": "Liquid Ooze",
		"65": "Overgrow",
		"66": "Blaze",
		"67": "Torrent",
		"68": "Swarm",
		"69": "Rock Head",
		"70": "Drought",
		"71": "Arena Trap",
		"72": "Vital Spirit",
		"73": "White Smoke",
		"74": "Pure Power",
		"75": "Shell Armor",
		"76": "Air Lock",
		"77": "Tangled Feet",
		"78": "Motor Drive",
		"79": "Rivalry",
		"80": "Steadfast",
		"81": "Snow Cloak",
		"82": "Gluttony",
		"83": "Anger Point",
		"84": "Unburden",
		"85": "Heatproof",
		"86": "Simple",
		"87": "Dry Skin",
		"88": "Download",
		"89": "Iron Fist",
		"90": "Poison Heal",
		"91": "Adaptability",
		"92": "Skill Link",
		"93": "Hydration",
		"94": "Solar Power",
		"95": "Quick Feet",
		"96": "Normalize",
		"97": "Sniper",
		"98": "Magic Guard",
		"99": "No Guard",
		"100": "Stall",
		"101": "Technician",
		"102": "Leaf Guard",
		"103": "Klutz",
		"104": "Mold Breaker",
		"105": "Super Luck",
		"106": "Aftermath",
		"107": "Anticipation",
		"108": "Forewarn",
		"109": "Unaware",
		"110": "Tinted Lens",
		"111": "Filter",
		"112": "Slow Start",
		"113": "Scrappy",
		"114": "Storm Drain",
		"115": "Ice Body",
		"116": "Solid Rock",
		"117": "Snow Warning",
		"118": "Honey Gather",
		"119": "Frisk",
		"120": "Reckless",
		"121": "Multitype",
		"122": "Flower Gift",
		"123": "Bad Dreams",
		"124": "Pickpocket",
		"125": "Sheer Force",
		"126": "Contrary",
		"127": "Unnerve",
		"128": "Defiant",
		"129": "Defeatist",
		"130": "Cursed Body",
		"131": "Healer",
		"132": "Friend Guard",
		"133": "Weak Armor",
		"134": "Heavy Metal",
		"135": "Light Metal",
		"136": "Multiscale",
		"137": "Toxic Boost",
		"138": "Flare Boost",
		"139": "Harvest",
		"140": "Telepathy",
		"141": "Moody",
		"142": "Overcoat",
		"143": "Poison Touch",
		"144": "Regenerator",
		"145": "Big Pecks",
		"146": "Sand Rush",
		"147": "Wonder Skin",
		"148": "Analytic",
		"149": "Illusion",
		"150": "Imposter",
		"151": "Infiltrator",
		"152": "Mummy",
		"153": "Moxie",
		"154": "Justified",
		"155": "Rattled",
		"156": "Magic Bounce",
		"157": "Sap Sipper",
		"158": "Prankster",
		"159": "Sand Force",
		"160": "Iron Barbs",
		"161": "Zen Mode",
		"162": "Victory Star",
		"163": "Turboblaze",
		"164": "Teravolt",
		"165": "Aroma Veil",
		"166": "Flower Veil",
		"167": "Cheek Pouch",
		"168": "Protean",
		"169": "Fur Coat",
		"170": "Magician",
		"171": "Bulletproof",
		"172": "Competitive",
		"173": "Strong Jaw",
		"174": "Refrigerate",
		"175": "Sweet Veil",
		"176": "Stance Change",
		"177": "Gale Wings",
		"178": "Mega Launcher",
		"179": "Grass Pelt",
		"180": "Symbiosis",
		"181": "Tough Claws",
		"182": "Pixilate",
		"183": "Gooey",
		"184": "Aerilate",
		"185": "Parental Bond",
		"186": "Dark Aura",
		"187": "Fairy Aura",
		"188": "Aura Break",
		"189": "Primordial Sea",
		"190": "Desolate Land",
		"191": "Delta Stream",
		"192": "Stamina",
		"193": "Wimp Out",
		"194": "Emergency Exit",
		"195": "Water Compaction",
		"196": "Merciless",
		"197": "Shields Down",
		"198": "Stakeout",
		"199": "Water Bubble",
		"200": "Steelworker",
		"201": "Berserk",
		"202": "Slush Rush",
		"203": "Long Reach",
		"204": "Liquid Voice",
		"205": "Triage",
		"206": "Galvanize",
		"207": "Surge Surfer",
		"208": "Schooling",
		"209": "Disguise",
		"210": "Battle Bond",
		"211": "Power Construct",
		"212": "Corrosion",
		"213": "Comatose",
		"214": "Queenly Majesty",
		"215": "Innards Out",
		"216": "Dancer",
		"217": "Battery",
		"218": "Fluffy",
		"219": "Dazzling",
		"220": "Soul-Heart",
		"221": "Tangling Hair",
		"222": "Receiver",
		"223": "Power of Alchemy",
		"224": "Beast Boost",
		"225": "RKS System",
		"226": "Electric Surge",
		"227": "Psychic Surge",
		"228": "Misty Surge",
		"229": "Grassy Surge",
		"230": "Full Metal Body",
		"231": "Shadow Shield",
		"232": "Prism Armor",
		"233": "Neuroforce",
		"234": "Intrepid Sword",
		"235": "Dauntless Shield",
		"236": "Libero",
		"237": "Ball Fetch",
		"238": "Cotton Down",
		"239": "Propeller Tail",
		"240": "Mirror Armor",
		"241": "Gulp Missile",
		"242": "Stalwart",
		"243": "Steam Engine",
		"244": "Punk Rock",
		"245": "Sand Spit",
		"246": "Ice Scales",
		"247": "Ripen",
		"248": "Ice Face",
		"249": "Power Spot",
		"250": "Mimicry",
		"251": "Screen Cleaner",
		"252": "Steely Spirit",
		"253": "Perish Body",
		"254": "Wandering Spirit",
		"255": "Gorilla Tactics",
		"256": "Neutralizing Gas",
		"257": "Pastel Veil",
		"258": "Hunger Switch",
		"259": "Quick Draw",
		"260": "Unseen Fist",
		"261": "Curious Medicine",
		"262": "Transistor",
		"263": "Dragon’s Maw",
		"264": "Chilling Neigh",
		"265": "Grim Neigh",
		"266": "As One",
		"267": "As One",
		"268": "Lingering Aroma",
		"269": "Seed Sower",
		"270": "Thermal Exchange",
		"271": "Anger Shell",
		"272": "Purifying Salt",
		"273": "Well-Baked Body",
		"274": "Wind Rider",
		"275": "Guard Dog",
		"276": "Rocky Payload",
		"277": "Wind Power",
		"278": "Zero to Hero",
		"279": "Commander",
		"280": "Electromorphosis",
		"281": "Protosynthesis",
		"282": "Quark Drive",
		"283": "Good as Gold",
		"284": "Vessel of Ruin",
		"285": "Sword of Ruin",
		"286": "Tablets of Ruin",
		"287": "Beads of Ruin",
		"288": "Orichalcum Pulse",
		"289": "Hadron Engine",
		"290": "Opportunist",
		"291": "Cud Chew",
		"292": "Sharpness",
		"293": "Supreme Overlord",
		"294": "Costar",
		"295": "Toxic Debris",
		"296": "Armor Tail",
		"297": "Earth Eater",
		"298": "Mycelium Might",
		"299": "Mind’s Eye",
		"300": "Supersweet Syrup",
		"301": "Hospitality",
		"302": "Toxic Chain",
		"303": "Embody Aspect",
		"304": "Embody Aspect",
		"305": "Embody Aspect",
		"306": "Embody Aspect",
		"307": "Tera Shift",
		"308": "Tera Shell",
		"309": "Teraform Zero",
		"310": "Poison Puppeteer",
		"311": "Piercing Drill",
		"312": "Dragonize",
		"313": "Eelevate",
		"315": "Mega Sol",
		"316": "Fire Mane",
		"318": "Spicy Spray"
	};
	var BIOME_NAMES = {
		"0": "Cidade",
		"1": "Planície",
		"2": "Campo Gramado",
		"3": "Grama Alta",
		"4": "Metrópole",
		"5": "Floresta",
		"6": "Mar",
		"7": "Pântano",
		"8": "Praia",
		"9": "Lago",
		"10": "Fundo do Mar",
		"11": "Montanha",
		"12": "Terras Áridas",
		"13": "Caverna",
		"14": "Deserto",
		"15": "Caverna de Gelo",
		"16": "Prado",
		"17": "Usina Elétrica",
		"18": "Vulcão",
		"19": "Cemitério",
		"20": "Dojo",
		"21": "Fábrica",
		"22": "Ruínas Antigas",
		"23": "Terras Arrasadas",
		"24": "Abismo",
		"25": "Espaço",
		"26": "Canteiro de Obras",
		"27": "Selva",
		"28": "Caverna das Fadas",
		"29": "Templo",
		"30": "Favela",
		"31": "Floresta Nevada",
		"40": "Ilha",
		"41": "Laboratório",
		"50": "???"
	};
	var TIER_TABLE = {
		"1": {
			"name": "Bulbasaur",
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
			"name": "Ivysaur",
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
			"name": "Venusaur",
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
			"name": "Charmander",
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
			"name": "Charmeleon",
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
			"name": "Charizard",
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
			"name": "Squirtle",
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
			"name": "Wartortle",
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
			"name": "Blastoise",
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
			"name": "Caterpie",
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
			"name": "Metapod",
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
			"name": "Butterfree",
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
			"name": "Weedle",
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
			"name": "Kakuna",
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
			"name": "Beedrill",
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
			"name": "Pidgey",
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
			"name": "Pidgeotto",
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
			"name": "Pidgeot",
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
			"name": "Rattata",
			"tier": "LC",
			"bestTier": "ZU",
			"bestName": "Raticate",
			"mega": null,
			"gmax": null
		},
		"20": {
			"name": "Raticate",
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Raticate",
			"mega": null,
			"gmax": null
		},
		"21": {
			"name": "Spearow",
			"tier": "LC",
			"bestTier": "ZU",
			"bestName": "Fearow",
			"mega": null,
			"gmax": null
		},
		"22": {
			"name": "Fearow",
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Fearow",
			"mega": null,
			"gmax": null
		},
		"23": {
			"name": "Ekans",
			"tier": "LC",
			"bestTier": "ZU",
			"bestName": "Arbok",
			"mega": null,
			"gmax": null
		},
		"24": {
			"name": "Arbok",
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Arbok",
			"mega": null,
			"gmax": null
		},
		"25": {
			"name": "Pikachu",
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
			"name": "Raichu",
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Raichu",
			"mega": null,
			"gmax": null
		},
		"27": {
			"name": "Sandshrew",
			"tier": "LC",
			"bestTier": "ZU",
			"bestName": "Sandslash",
			"mega": null,
			"gmax": null
		},
		"28": {
			"name": "Sandslash",
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Sandslash",
			"mega": null,
			"gmax": null
		},
		"29": {
			"name": "Nidoran-F",
			"tier": "LC",
			"bestTier": "RU",
			"bestName": "Nidoqueen",
			"mega": null,
			"gmax": null
		},
		"30": {
			"name": "Nidorina",
			"tier": "NFE",
			"bestTier": "RU",
			"bestName": "Nidoqueen",
			"mega": null,
			"gmax": null
		},
		"31": {
			"name": "Nidoqueen",
			"tier": "RU",
			"bestTier": "RU",
			"bestName": "Nidoqueen",
			"mega": null,
			"gmax": null
		},
		"32": {
			"name": "Nidoran-M",
			"tier": "LC",
			"bestTier": "UU",
			"bestName": "Nidoking",
			"mega": null,
			"gmax": null
		},
		"33": {
			"name": "Nidorino",
			"tier": "NFE",
			"bestTier": "UU",
			"bestName": "Nidoking",
			"mega": null,
			"gmax": null
		},
		"34": {
			"name": "Nidoking",
			"tier": "UU",
			"bestTier": "UU",
			"bestName": "Nidoking",
			"mega": null,
			"gmax": null
		},
		"35": {
			"name": "Clefairy",
			"tier": "NFE",
			"bestTier": "OU",
			"bestName": "Clefable",
			"mega": null,
			"gmax": null
		},
		"36": {
			"name": "Clefable",
			"tier": "OU",
			"bestTier": "OU",
			"bestName": "Clefable",
			"mega": null,
			"gmax": null
		},
		"37": {
			"name": "Vulpix",
			"tier": "NFE",
			"bestTier": "ZU",
			"bestName": "Ninetales",
			"mega": null,
			"gmax": null
		},
		"38": {
			"name": "Ninetales",
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Ninetales",
			"mega": null,
			"gmax": null
		},
		"39": {
			"name": "Jigglypuff",
			"tier": "NFE",
			"bestTier": "ZU",
			"bestName": "Wigglytuff",
			"mega": null,
			"gmax": null
		},
		"40": {
			"name": "Wigglytuff",
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Wigglytuff",
			"mega": null,
			"gmax": null
		},
		"41": {
			"name": "Zubat",
			"tier": "LC",
			"bestTier": "RU",
			"bestName": "Crobat",
			"mega": null,
			"gmax": null
		},
		"42": {
			"name": "Golbat",
			"tier": "NFE",
			"bestTier": "RU",
			"bestName": "Crobat",
			"mega": null,
			"gmax": null
		},
		"43": {
			"name": "Oddish",
			"tier": "LC",
			"bestTier": "NU",
			"bestName": "Vileplume",
			"mega": null,
			"gmax": null
		},
		"44": {
			"name": "Gloom",
			"tier": "NFE",
			"bestTier": "NU",
			"bestName": "Vileplume",
			"mega": null,
			"gmax": null
		},
		"45": {
			"name": "Vileplume",
			"tier": "NU",
			"bestTier": "NU",
			"bestName": "Vileplume",
			"mega": null,
			"gmax": null
		},
		"46": {
			"name": "Paras",
			"tier": "LC",
			"bestTier": "ZU",
			"bestName": "Parasect",
			"mega": null,
			"gmax": null
		},
		"47": {
			"name": "Parasect",
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Parasect",
			"mega": null,
			"gmax": null
		},
		"48": {
			"name": "Venonat",
			"tier": "LC",
			"bestTier": "ZUBL",
			"bestName": "Venomoth",
			"mega": null,
			"gmax": null
		},
		"49": {
			"name": "Venomoth",
			"tier": "ZUBL",
			"bestTier": "ZUBL",
			"bestName": "Venomoth",
			"mega": null,
			"gmax": null
		},
		"50": {
			"name": "Diglett",
			"tier": "NFE",
			"bestTier": "ZU",
			"bestName": "Dugtrio",
			"mega": null,
			"gmax": null
		},
		"51": {
			"name": "Dugtrio",
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Dugtrio",
			"mega": null,
			"gmax": null
		},
		"52": {
			"name": "Meowth",
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
			"name": "Persian",
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Persian",
			"mega": null,
			"gmax": null
		},
		"54": {
			"name": "Psyduck",
			"tier": "LC",
			"bestTier": "ZU",
			"bestName": "Golduck",
			"mega": null,
			"gmax": null
		},
		"55": {
			"name": "Golduck",
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Golduck",
			"mega": null,
			"gmax": null
		},
		"56": {
			"name": "Mankey",
			"tier": "LC",
			"bestTier": "Uber",
			"bestName": "Annihilape",
			"mega": null,
			"gmax": null
		},
		"57": {
			"name": "Primeape",
			"tier": "ZU",
			"bestTier": "Uber",
			"bestName": "Annihilape",
			"mega": null,
			"gmax": null
		},
		"58": {
			"name": "Growlithe",
			"tier": "LC",
			"bestTier": "PU",
			"bestName": "Arcanine",
			"mega": null,
			"gmax": null
		},
		"59": {
			"name": "Arcanine",
			"tier": "PU",
			"bestTier": "PU",
			"bestName": "Arcanine",
			"mega": null,
			"gmax": null
		},
		"60": {
			"name": "Poliwag",
			"tier": "LC",
			"bestTier": "NUBL",
			"bestName": "Politoed",
			"mega": null,
			"gmax": null
		},
		"61": {
			"name": "Poliwhirl",
			"tier": "NFE",
			"bestTier": "NUBL",
			"bestName": "Politoed",
			"mega": null,
			"gmax": null
		},
		"62": {
			"name": "Poliwrath",
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Poliwrath",
			"mega": null,
			"gmax": null
		},
		"63": {
			"name": "Abra",
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
			"name": "Kadabra",
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
			"name": "Alakazam",
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
			"name": "Machop",
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
			"name": "Machoke",
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
			"name": "Machamp",
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
			"name": "Bellsprout",
			"tier": "LC",
			"bestTier": "ZU",
			"bestName": "Victreebel",
			"mega": null,
			"gmax": null
		},
		"70": {
			"name": "Weepinbell",
			"tier": "NFE",
			"bestTier": "ZU",
			"bestName": "Victreebel",
			"mega": null,
			"gmax": null
		},
		"71": {
			"name": "Victreebel",
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Victreebel",
			"mega": null,
			"gmax": null
		},
		"72": {
			"name": "Tentacool",
			"tier": "LC",
			"bestTier": "NU",
			"bestName": "Tentacruel",
			"mega": null,
			"gmax": null
		},
		"73": {
			"name": "Tentacruel",
			"tier": "NU",
			"bestTier": "NU",
			"bestName": "Tentacruel",
			"mega": null,
			"gmax": null
		},
		"74": {
			"name": "Geodude",
			"tier": "LC",
			"bestTier": "ZU",
			"bestName": "Golem",
			"mega": null,
			"gmax": null
		},
		"75": {
			"name": "Graveler",
			"tier": "NFE",
			"bestTier": "ZU",
			"bestName": "Golem",
			"mega": null,
			"gmax": null
		},
		"76": {
			"name": "Golem",
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Golem",
			"mega": null,
			"gmax": null
		},
		"77": {
			"name": "Ponyta",
			"tier": "LC",
			"bestTier": "ZU",
			"bestName": "Rapidash",
			"mega": null,
			"gmax": null
		},
		"78": {
			"name": "Rapidash",
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Rapidash",
			"mega": null,
			"gmax": null
		},
		"79": {
			"name": "Slowpoke",
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
			"name": "Slowbro",
			"tier": "RU",
			"bestTier": "RU",
			"bestName": "Slowbro",
			"mega": {
				"tier": "RUBL",
				"name": "Slowbro-Mega"
			},
			"gmax": null
		},
		"81": {
			"name": "Magnemite",
			"tier": "LC",
			"bestTier": "RU",
			"bestName": "Magnezone",
			"mega": null,
			"gmax": null
		},
		"82": {
			"name": "Magneton",
			"tier": "ZU",
			"bestTier": "RU",
			"bestName": "Magnezone",
			"mega": null,
			"gmax": null
		},
		"83": {
			"name": "Farfetch’d",
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Farfetch’d",
			"mega": null,
			"gmax": null
		},
		"84": {
			"name": "Doduo",
			"tier": "LC",
			"bestTier": "ZU",
			"bestName": "Dodrio",
			"mega": null,
			"gmax": null
		},
		"85": {
			"name": "Dodrio",
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Dodrio",
			"mega": null,
			"gmax": null
		},
		"86": {
			"name": "Seel",
			"tier": "LC",
			"bestTier": "ZU",
			"bestName": "Dewgong",
			"mega": null,
			"gmax": null
		},
		"87": {
			"name": "Dewgong",
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Dewgong",
			"mega": null,
			"gmax": null
		},
		"88": {
			"name": "Grimer",
			"tier": "LC",
			"bestTier": "ZU",
			"bestName": "Muk",
			"mega": null,
			"gmax": null
		},
		"89": {
			"name": "Muk",
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Muk",
			"mega": null,
			"gmax": null
		},
		"90": {
			"name": "Shellder",
			"tier": "LC",
			"bestTier": "NUBL",
			"bestName": "Cloyster",
			"mega": null,
			"gmax": null
		},
		"91": {
			"name": "Cloyster",
			"tier": "NUBL",
			"bestTier": "NUBL",
			"bestName": "Cloyster",
			"mega": null,
			"gmax": null
		},
		"92": {
			"name": "Gastly",
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
			"name": "Haunter",
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
			"name": "Gengar",
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
			"name": "Onix",
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
			"name": "Drowzee",
			"tier": "LC",
			"bestTier": "ZU",
			"bestName": "Hypno",
			"mega": null,
			"gmax": null
		},
		"97": {
			"name": "Hypno",
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Hypno",
			"mega": null,
			"gmax": null
		},
		"98": {
			"name": "Krabby",
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
			"name": "Kingler",
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
			"name": "Voltorb",
			"tier": "LC",
			"bestTier": "ZU",
			"bestName": "Electrode",
			"mega": null,
			"gmax": null
		},
		"101": {
			"name": "Electrode",
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Electrode",
			"mega": null,
			"gmax": null
		},
		"102": {
			"name": "Exeggcute",
			"tier": "LC",
			"bestTier": "ZU",
			"bestName": "Exeggutor-Alola",
			"mega": null,
			"gmax": null
		},
		"103": {
			"name": "Exeggutor",
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Exeggutor",
			"mega": null,
			"gmax": null
		},
		"104": {
			"name": "Cubone",
			"tier": "LC",
			"bestTier": "RU",
			"bestName": "Marowak-Alola",
			"mega": null,
			"gmax": null
		},
		"105": {
			"name": "Marowak",
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Marowak",
			"mega": null,
			"gmax": null
		},
		"106": {
			"name": "Hitmonlee",
			"tier": "PU",
			"bestTier": "PU",
			"bestName": "Hitmonlee",
			"mega": null,
			"gmax": null
		},
		"107": {
			"name": "Hitmonchan",
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Hitmonchan",
			"mega": null,
			"gmax": null
		},
		"108": {
			"name": "Lickitung",
			"tier": "LC",
			"bestTier": "ZU",
			"bestName": "Lickilicky",
			"mega": null,
			"gmax": null
		},
		"109": {
			"name": "Koffing",
			"tier": "LC",
			"bestTier": "OU",
			"bestName": "Weezing-Galar",
			"mega": null,
			"gmax": null
		},
		"110": {
			"name": "Weezing",
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Weezing",
			"mega": null,
			"gmax": null
		},
		"111": {
			"name": "Rhyhorn",
			"tier": "LC",
			"bestTier": "NU",
			"bestName": "Rhyperior",
			"mega": null,
			"gmax": null
		},
		"112": {
			"name": "Rhydon",
			"tier": "PU",
			"bestTier": "NU",
			"bestName": "Rhyperior",
			"mega": null,
			"gmax": null
		},
		"113": {
			"name": "Chansey",
			"tier": "RU",
			"bestTier": "RU",
			"bestName": "Blissey",
			"mega": null,
			"gmax": null
		},
		"114": {
			"name": "Tangela",
			"tier": "NFE",
			"bestTier": "UU",
			"bestName": "Tangrowth",
			"mega": null,
			"gmax": null
		},
		"115": {
			"name": "Kangaskhan",
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
			"name": "Horsea",
			"tier": "LC",
			"bestTier": "ZUBL",
			"bestName": "Kingdra",
			"mega": null,
			"gmax": null
		},
		"117": {
			"name": "Seadra",
			"tier": "NFE",
			"bestTier": "ZUBL",
			"bestName": "Kingdra",
			"mega": null,
			"gmax": null
		},
		"118": {
			"name": "Goldeen",
			"tier": "LC",
			"bestTier": "ZU",
			"bestName": "Seaking",
			"mega": null,
			"gmax": null
		},
		"119": {
			"name": "Seaking",
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Seaking",
			"mega": null,
			"gmax": null
		},
		"120": {
			"name": "Staryu",
			"tier": "LC",
			"bestTier": "NU",
			"bestName": "Starmie",
			"mega": null,
			"gmax": null
		},
		"121": {
			"name": "Starmie",
			"tier": "NU",
			"bestTier": "NU",
			"bestName": "Starmie",
			"mega": null,
			"gmax": null
		},
		"122": {
			"name": "Mr. Mime",
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Mr. Mime",
			"mega": null,
			"gmax": null
		},
		"123": {
			"name": "Scyther",
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
			"name": "Jynx",
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Jynx",
			"mega": null,
			"gmax": null
		},
		"125": {
			"name": "Electabuzz",
			"tier": "NFE",
			"bestTier": "ZU",
			"bestName": "Electivire",
			"mega": null,
			"gmax": null
		},
		"126": {
			"name": "Magmar",
			"tier": "NFE",
			"bestTier": "ZU",
			"bestName": "Magmortar",
			"mega": null,
			"gmax": null
		},
		"127": {
			"name": "Pinsir",
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
			"name": "Tauros",
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Tauros",
			"mega": null,
			"gmax": null
		},
		"129": {
			"name": "Magikarp",
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
			"name": "Gyarados",
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
			"name": "Lapras",
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
			"name": "Ditto",
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Ditto",
			"mega": null,
			"gmax": null
		},
		"133": {
			"name": "Eevee",
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
			"name": "Vaporeon",
			"tier": "NU",
			"bestTier": "NU",
			"bestName": "Vaporeon",
			"mega": null,
			"gmax": null
		},
		"135": {
			"name": "Jolteon",
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Jolteon",
			"mega": null,
			"gmax": null
		},
		"136": {
			"name": "Flareon",
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Flareon",
			"mega": null,
			"gmax": null
		},
		"137": {
			"name": "Porygon",
			"tier": "NFE",
			"bestTier": "NUBL",
			"bestName": "Porygon-Z",
			"mega": null,
			"gmax": null
		},
		"138": {
			"name": "Omanyte",
			"tier": "LC",
			"bestTier": "PUBL",
			"bestName": "Omastar",
			"mega": null,
			"gmax": null
		},
		"139": {
			"name": "Omastar",
			"tier": "PUBL",
			"bestTier": "PUBL",
			"bestName": "Omastar",
			"mega": null,
			"gmax": null
		},
		"140": {
			"name": "Kabuto",
			"tier": "LC",
			"bestTier": "ZU",
			"bestName": "Kabutops",
			"mega": null,
			"gmax": null
		},
		"141": {
			"name": "Kabutops",
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Kabutops",
			"mega": null,
			"gmax": null
		},
		"142": {
			"name": "Aerodactyl",
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
			"name": "Snorlax",
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
			"name": "Articuno",
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Articuno",
			"mega": null,
			"gmax": null
		},
		"145": {
			"name": "Zapdos",
			"tier": "OU",
			"bestTier": "OU",
			"bestName": "Zapdos",
			"mega": null,
			"gmax": null
		},
		"146": {
			"name": "Moltres",
			"tier": "OU",
			"bestTier": "OU",
			"bestName": "Moltres",
			"mega": null,
			"gmax": null
		},
		"147": {
			"name": "Dratini",
			"tier": "LC",
			"bestTier": "OU",
			"bestName": "Dragonite",
			"mega": null,
			"gmax": null
		},
		"148": {
			"name": "Dragonair",
			"tier": "NFE",
			"bestTier": "OU",
			"bestName": "Dragonite",
			"mega": null,
			"gmax": null
		},
		"149": {
			"name": "Dragonite",
			"tier": "OU",
			"bestTier": "OU",
			"bestName": "Dragonite",
			"mega": null,
			"gmax": null
		},
		"150": {
			"name": "Mewtwo",
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
			"name": "Mew",
			"tier": "RU",
			"bestTier": "RU",
			"bestName": "Mew",
			"mega": null,
			"gmax": null
		},
		"152": {
			"name": "Chikorita",
			"tier": "LC",
			"bestTier": "ZU",
			"bestName": "Meganium",
			"mega": null,
			"gmax": null
		},
		"153": {
			"name": "Bayleef",
			"tier": "NFE",
			"bestTier": "ZU",
			"bestName": "Meganium",
			"mega": null,
			"gmax": null
		},
		"154": {
			"name": "Meganium",
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Meganium",
			"mega": null,
			"gmax": null
		},
		"155": {
			"name": "Cyndaquil",
			"tier": "LC",
			"bestTier": "PU",
			"bestName": "Typhlosion-Hisui",
			"mega": null,
			"gmax": null
		},
		"156": {
			"name": "Quilava",
			"tier": "NFE",
			"bestTier": "PU",
			"bestName": "Typhlosion-Hisui",
			"mega": null,
			"gmax": null
		},
		"157": {
			"name": "Typhlosion",
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Typhlosion",
			"mega": null,
			"gmax": null
		},
		"158": {
			"name": "Totodile",
			"tier": "LC",
			"bestTier": "NUBL",
			"bestName": "Feraligatr",
			"mega": null,
			"gmax": null
		},
		"159": {
			"name": "Croconaw",
			"tier": "NFE",
			"bestTier": "NUBL",
			"bestName": "Feraligatr",
			"mega": null,
			"gmax": null
		},
		"160": {
			"name": "Feraligatr",
			"tier": "NUBL",
			"bestTier": "NUBL",
			"bestName": "Feraligatr",
			"mega": null,
			"gmax": null
		},
		"161": {
			"name": "Sentret",
			"tier": "LC",
			"bestTier": "ZU",
			"bestName": "Furret",
			"mega": null,
			"gmax": null
		},
		"162": {
			"name": "Furret",
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Furret",
			"mega": null,
			"gmax": null
		},
		"163": {
			"name": "Hoothoot",
			"tier": "LC",
			"bestTier": "ZU",
			"bestName": "Noctowl",
			"mega": null,
			"gmax": null
		},
		"164": {
			"name": "Noctowl",
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Noctowl",
			"mega": null,
			"gmax": null
		},
		"165": {
			"name": "Ledyba",
			"tier": "LC",
			"bestTier": "ZU",
			"bestName": "Ledian",
			"mega": null,
			"gmax": null
		},
		"166": {
			"name": "Ledian",
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Ledian",
			"mega": null,
			"gmax": null
		},
		"167": {
			"name": "Spinarak",
			"tier": "LC",
			"bestTier": "ZU",
			"bestName": "Ariados",
			"mega": null,
			"gmax": null
		},
		"168": {
			"name": "Ariados",
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Ariados",
			"mega": null,
			"gmax": null
		},
		"169": {
			"name": "Crobat",
			"tier": "RU",
			"bestTier": "RU",
			"bestName": "Crobat",
			"mega": null,
			"gmax": null
		},
		"170": {
			"name": "Chinchou",
			"tier": "LC",
			"bestTier": "ZU",
			"bestName": "Lanturn",
			"mega": null,
			"gmax": null
		},
		"171": {
			"name": "Lanturn",
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Lanturn",
			"mega": null,
			"gmax": null
		},
		"172": {
			"name": "Pichu",
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
			"name": "Cleffa",
			"tier": "LC",
			"bestTier": "OU",
			"bestName": "Clefable",
			"mega": null,
			"gmax": null
		},
		"174": {
			"name": "Igglybuff",
			"tier": "LC",
			"bestTier": "ZU",
			"bestName": "Wigglytuff",
			"mega": null,
			"gmax": null
		},
		"175": {
			"name": "Togepi",
			"tier": "LC",
			"bestTier": "RU",
			"bestName": "Togekiss",
			"mega": null,
			"gmax": null
		},
		"176": {
			"name": "Togetic",
			"tier": "NFE",
			"bestTier": "RU",
			"bestName": "Togekiss",
			"mega": null,
			"gmax": null
		},
		"177": {
			"name": "Natu",
			"tier": "LC",
			"bestTier": "NU",
			"bestName": "Xatu",
			"mega": null,
			"gmax": null
		},
		"178": {
			"name": "Xatu",
			"tier": "NU",
			"bestTier": "NU",
			"bestName": "Xatu",
			"mega": null,
			"gmax": null
		},
		"179": {
			"name": "Mareep",
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
			"name": "Flaaffy",
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
			"name": "Ampharos",
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
			"name": "Bellossom",
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Bellossom",
			"mega": null,
			"gmax": null
		},
		"183": {
			"name": "Marill",
			"tier": "NFE",
			"bestTier": "UU",
			"bestName": "Azumarill",
			"mega": null,
			"gmax": null
		},
		"184": {
			"name": "Azumarill",
			"tier": "UU",
			"bestTier": "UU",
			"bestName": "Azumarill",
			"mega": null,
			"gmax": null
		},
		"185": {
			"name": "Sudowoodo",
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Sudowoodo",
			"mega": null,
			"gmax": null
		},
		"186": {
			"name": "Politoed",
			"tier": "NUBL",
			"bestTier": "NUBL",
			"bestName": "Politoed",
			"mega": null,
			"gmax": null
		},
		"187": {
			"name": "Hoppip",
			"tier": "LC",
			"bestTier": "ZU",
			"bestName": "Jumpluff",
			"mega": null,
			"gmax": null
		},
		"188": {
			"name": "Skiploom",
			"tier": "NFE",
			"bestTier": "ZU",
			"bestName": "Jumpluff",
			"mega": null,
			"gmax": null
		},
		"189": {
			"name": "Jumpluff",
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Jumpluff",
			"mega": null,
			"gmax": null
		},
		"190": {
			"name": "Aipom",
			"tier": "NFE",
			"bestTier": "PU",
			"bestName": "Ambipom",
			"mega": null,
			"gmax": null
		},
		"191": {
			"name": "Sunkern",
			"tier": "LC",
			"bestTier": "ZU",
			"bestName": "Sunflora",
			"mega": null,
			"gmax": null
		},
		"192": {
			"name": "Sunflora",
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Sunflora",
			"mega": null,
			"gmax": null
		},
		"193": {
			"name": "Yanma",
			"tier": "NFE",
			"bestTier": "RUBL",
			"bestName": "Yanmega",
			"mega": null,
			"gmax": null
		},
		"194": {
			"name": "Wooper",
			"tier": "LC",
			"bestTier": "RU",
			"bestName": "Quagsire",
			"mega": null,
			"gmax": null
		},
		"195": {
			"name": "Quagsire",
			"tier": "RU",
			"bestTier": "RU",
			"bestName": "Quagsire",
			"mega": null,
			"gmax": null
		},
		"196": {
			"name": "Espeon",
			"tier": "PU",
			"bestTier": "PU",
			"bestName": "Espeon",
			"mega": null,
			"gmax": null
		},
		"197": {
			"name": "Umbreon",
			"tier": "RU",
			"bestTier": "RU",
			"bestName": "Umbreon",
			"mega": null,
			"gmax": null
		},
		"198": {
			"name": "Murkrow",
			"tier": "NFE",
			"bestTier": "ZU",
			"bestName": "Honchkrow",
			"mega": null,
			"gmax": null
		},
		"199": {
			"name": "Slowking",
			"tier": "UU",
			"bestTier": "UU",
			"bestName": "Slowking",
			"mega": null,
			"gmax": null
		},
		"200": {
			"name": "Misdreavus",
			"tier": "NFE",
			"bestTier": "ZU",
			"bestName": "Mismagius",
			"mega": null,
			"gmax": null
		},
		"201": {
			"name": "Unown",
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Unown",
			"mega": null,
			"gmax": null
		},
		"202": {
			"name": "Wobbuffet",
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Wobbuffet",
			"mega": null,
			"gmax": null
		},
		"203": {
			"name": "Girafarig",
			"tier": "NFE",
			"bestTier": "ZU",
			"bestName": "Farigiraf",
			"mega": null,
			"gmax": null
		},
		"204": {
			"name": "Pineco",
			"tier": "LC",
			"bestTier": "RU",
			"bestName": "Forretress",
			"mega": null,
			"gmax": null
		},
		"205": {
			"name": "Forretress",
			"tier": "RU",
			"bestTier": "RU",
			"bestName": "Forretress",
			"mega": null,
			"gmax": null
		},
		"206": {
			"name": "Dunsparce",
			"tier": "NFE",
			"bestTier": "PU",
			"bestName": "Dudunsparce-Three-Segment",
			"mega": null,
			"gmax": null
		},
		"207": {
			"name": "Gligar",
			"tier": "NU",
			"bestTier": "OU",
			"bestName": "Gliscor",
			"mega": null,
			"gmax": null
		},
		"208": {
			"name": "Steelix",
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
			"name": "Snubbull",
			"tier": "LC",
			"bestTier": "ZU",
			"bestName": "Granbull",
			"mega": null,
			"gmax": null
		},
		"210": {
			"name": "Granbull",
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Granbull",
			"mega": null,
			"gmax": null
		},
		"211": {
			"name": "Qwilfish",
			"tier": "PU",
			"bestTier": "PU",
			"bestName": "Qwilfish",
			"mega": null,
			"gmax": null
		},
		"212": {
			"name": "Scizor",
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
			"name": "Shuckle",
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Shuckle",
			"mega": null,
			"gmax": null
		},
		"214": {
			"name": "Heracross",
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
			"name": "Sneasel",
			"tier": "NFE",
			"bestTier": "OU",
			"bestName": "Weavile",
			"mega": null,
			"gmax": null
		},
		"216": {
			"name": "Teddiursa",
			"tier": "LC",
			"bestTier": "UUBL",
			"bestName": "Ursaluna",
			"mega": null,
			"gmax": null
		},
		"217": {
			"name": "Ursaring",
			"tier": "NFE",
			"bestTier": "UUBL",
			"bestName": "Ursaluna",
			"mega": null,
			"gmax": null
		},
		"218": {
			"name": "Slugma",
			"tier": "LC",
			"bestTier": "ZU",
			"bestName": "Magcargo",
			"mega": null,
			"gmax": null
		},
		"219": {
			"name": "Magcargo",
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Magcargo",
			"mega": null,
			"gmax": null
		},
		"220": {
			"name": "Swinub",
			"tier": "LC",
			"bestTier": "RU",
			"bestName": "Mamoswine",
			"mega": null,
			"gmax": null
		},
		"221": {
			"name": "Piloswine",
			"tier": "NFE",
			"bestTier": "RU",
			"bestName": "Mamoswine",
			"mega": null,
			"gmax": null
		},
		"222": {
			"name": "Corsola",
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Corsola",
			"mega": null,
			"gmax": null
		},
		"223": {
			"name": "Remoraid",
			"tier": "LC",
			"bestTier": "ZU",
			"bestName": "Octillery",
			"mega": null,
			"gmax": null
		},
		"224": {
			"name": "Octillery",
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Octillery",
			"mega": null,
			"gmax": null
		},
		"225": {
			"name": "Delibird",
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Delibird",
			"mega": null,
			"gmax": null
		},
		"226": {
			"name": "Mantine",
			"tier": "NU",
			"bestTier": "NU",
			"bestName": "Mantine",
			"mega": null,
			"gmax": null
		},
		"227": {
			"name": "Skarmory",
			"tier": "UU",
			"bestTier": "UU",
			"bestName": "Skarmory",
			"mega": null,
			"gmax": null
		},
		"228": {
			"name": "Houndour",
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
			"name": "Houndoom",
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
			"name": "Kingdra",
			"tier": "ZUBL",
			"bestTier": "ZUBL",
			"bestName": "Kingdra",
			"mega": null,
			"gmax": null
		},
		"231": {
			"name": "Phanpy",
			"tier": "LC",
			"bestTier": "UU",
			"bestName": "Donphan",
			"mega": null,
			"gmax": null
		},
		"232": {
			"name": "Donphan",
			"tier": "UU",
			"bestTier": "UU",
			"bestName": "Donphan",
			"mega": null,
			"gmax": null
		},
		"233": {
			"name": "Porygon2",
			"tier": "ZUBL",
			"bestTier": "NUBL",
			"bestName": "Porygon-Z",
			"mega": null,
			"gmax": null
		},
		"234": {
			"name": "Stantler",
			"tier": "NFE",
			"bestTier": "ZU",
			"bestName": "Wyrdeer",
			"mega": null,
			"gmax": null
		},
		"235": {
			"name": "Smeargle",
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Smeargle",
			"mega": null,
			"gmax": null
		},
		"236": {
			"name": "Tyrogue",
			"tier": "LC",
			"bestTier": "PU",
			"bestName": "Hitmonlee",
			"mega": null,
			"gmax": null
		},
		"237": {
			"name": "Hitmontop",
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Hitmontop",
			"mega": null,
			"gmax": null
		},
		"238": {
			"name": "Smoochum",
			"tier": "LC",
			"bestTier": "ZU",
			"bestName": "Jynx",
			"mega": null,
			"gmax": null
		},
		"239": {
			"name": "Elekid",
			"tier": "LC",
			"bestTier": "ZU",
			"bestName": "Electivire",
			"mega": null,
			"gmax": null
		},
		"240": {
			"name": "Magby",
			"tier": "NFE",
			"bestTier": "ZU",
			"bestName": "Magmortar",
			"mega": null,
			"gmax": null
		},
		"241": {
			"name": "Miltank",
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Miltank",
			"mega": null,
			"gmax": null
		},
		"242": {
			"name": "Blissey",
			"tier": "RU",
			"bestTier": "RU",
			"bestName": "Blissey",
			"mega": null,
			"gmax": null
		},
		"243": {
			"name": "Raikou",
			"tier": "NU",
			"bestTier": "NU",
			"bestName": "Raikou",
			"mega": null,
			"gmax": null
		},
		"244": {
			"name": "Entei",
			"tier": "RU",
			"bestTier": "RU",
			"bestName": "Entei",
			"mega": null,
			"gmax": null
		},
		"245": {
			"name": "Suicune",
			"tier": "NUBL",
			"bestTier": "NUBL",
			"bestName": "Suicune",
			"mega": null,
			"gmax": null
		},
		"246": {
			"name": "Larvitar",
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
			"name": "Pupitar",
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
			"name": "Tyranitar",
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
			"name": "Lugia",
			"tier": "Uber",
			"bestTier": "Uber",
			"bestName": "Lugia",
			"mega": null,
			"gmax": null
		},
		"250": {
			"name": "Ho-Oh",
			"tier": "Uber",
			"bestTier": "Uber",
			"bestName": "Ho-Oh",
			"mega": null,
			"gmax": null
		},
		"251": {
			"name": "Celebi",
			"tier": "RU",
			"bestTier": "RU",
			"bestName": "Celebi",
			"mega": null,
			"gmax": null
		},
		"252": {
			"name": "Treecko",
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
			"name": "Grovyle",
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
			"name": "Sceptile",
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
			"name": "Torchic",
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
			"name": "Combusken",
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
			"name": "Blaziken",
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
			"name": "Mudkip",
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
			"name": "Marshtomp",
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
			"name": "Swampert",
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
			"name": "Poochyena",
			"tier": "LC",
			"bestTier": "ZU",
			"bestName": "Mightyena",
			"mega": null,
			"gmax": null
		},
		"262": {
			"name": "Mightyena",
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Mightyena",
			"mega": null,
			"gmax": null
		},
		"263": {
			"name": "Zigzagoon",
			"tier": "NFE",
			"bestTier": "NUBL",
			"bestName": "Linoone",
			"mega": null,
			"gmax": null
		},
		"264": {
			"name": "Linoone",
			"tier": "NUBL",
			"bestTier": "NUBL",
			"bestName": "Linoone",
			"mega": null,
			"gmax": null
		},
		"265": {
			"name": "Wurmple",
			"tier": "LC",
			"bestTier": "ZU",
			"bestName": "Dustox",
			"mega": null,
			"gmax": null
		},
		"266": {
			"name": "Silcoon",
			"tier": "NFE",
			"bestTier": "ZU",
			"bestName": "Beautifly",
			"mega": null,
			"gmax": null
		},
		"267": {
			"name": "Beautifly",
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Beautifly",
			"mega": null,
			"gmax": null
		},
		"268": {
			"name": "Cascoon",
			"tier": "NFE",
			"bestTier": "ZU",
			"bestName": "Dustox",
			"mega": null,
			"gmax": null
		},
		"269": {
			"name": "Dustox",
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Dustox",
			"mega": null,
			"gmax": null
		},
		"270": {
			"name": "Lotad",
			"tier": "LC",
			"bestTier": "ZU",
			"bestName": "Ludicolo",
			"mega": null,
			"gmax": null
		},
		"271": {
			"name": "Lombre",
			"tier": "NFE",
			"bestTier": "ZU",
			"bestName": "Ludicolo",
			"mega": null,
			"gmax": null
		},
		"272": {
			"name": "Ludicolo",
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Ludicolo",
			"mega": null,
			"gmax": null
		},
		"273": {
			"name": "Seedot",
			"tier": "LC",
			"bestTier": "ZU",
			"bestName": "Shiftry",
			"mega": null,
			"gmax": null
		},
		"274": {
			"name": "Nuzleaf",
			"tier": "NFE",
			"bestTier": "ZU",
			"bestName": "Shiftry",
			"mega": null,
			"gmax": null
		},
		"275": {
			"name": "Shiftry",
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Shiftry",
			"mega": null,
			"gmax": null
		},
		"276": {
			"name": "Taillow",
			"tier": "LC",
			"bestTier": "RU",
			"bestName": "Swellow",
			"mega": null,
			"gmax": null
		},
		"277": {
			"name": "Swellow",
			"tier": "RU",
			"bestTier": "RU",
			"bestName": "Swellow",
			"mega": null,
			"gmax": null
		},
		"278": {
			"name": "Wingull",
			"tier": "LC",
			"bestTier": "UUBL",
			"bestName": "Pelipper",
			"mega": null,
			"gmax": null
		},
		"279": {
			"name": "Pelipper",
			"tier": "UUBL",
			"bestTier": "UUBL",
			"bestName": "Pelipper",
			"mega": null,
			"gmax": null
		},
		"280": {
			"name": "Ralts",
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
			"name": "Kirlia",
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
			"name": "Gardevoir",
			"tier": "RU",
			"bestTier": "RU",
			"bestName": "Gardevoir",
			"mega": {
				"tier": "UUBL",
				"name": "Gardevoir-Mega"
			},
			"gmax": null
		},
		"283": {
			"name": "Surskit",
			"tier": "LC",
			"bestTier": "ZU",
			"bestName": "Masquerain",
			"mega": null,
			"gmax": null
		},
		"284": {
			"name": "Masquerain",
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Masquerain",
			"mega": null,
			"gmax": null
		},
		"285": {
			"name": "Shroomish",
			"tier": "LC",
			"bestTier": "NU",
			"bestName": "Breloom",
			"mega": null,
			"gmax": null
		},
		"286": {
			"name": "Breloom",
			"tier": "NU",
			"bestTier": "NU",
			"bestName": "Breloom",
			"mega": null,
			"gmax": null
		},
		"287": {
			"name": "Slakoth",
			"tier": "LC",
			"bestTier": "ZU",
			"bestName": "Slaking",
			"mega": null,
			"gmax": null
		},
		"288": {
			"name": "Vigoroth",
			"tier": "NFE",
			"bestTier": "ZU",
			"bestName": "Slaking",
			"mega": null,
			"gmax": null
		},
		"289": {
			"name": "Slaking",
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Slaking",
			"mega": null,
			"gmax": null
		},
		"290": {
			"name": "Nincada",
			"tier": "LC",
			"bestTier": "ZUBL",
			"bestName": "Ninjask",
			"mega": null,
			"gmax": null
		},
		"291": {
			"name": "Ninjask",
			"tier": "ZUBL",
			"bestTier": "ZUBL",
			"bestName": "Ninjask",
			"mega": null,
			"gmax": null
		},
		"292": {
			"name": "Shedinja",
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Shedinja",
			"mega": null,
			"gmax": null
		},
		"293": {
			"name": "Whismur",
			"tier": "LC",
			"bestTier": "NU",
			"bestName": "Exploud",
			"mega": null,
			"gmax": null
		},
		"294": {
			"name": "Loudred",
			"tier": "NFE",
			"bestTier": "NU",
			"bestName": "Exploud",
			"mega": null,
			"gmax": null
		},
		"295": {
			"name": "Exploud",
			"tier": "NU",
			"bestTier": "NU",
			"bestName": "Exploud",
			"mega": null,
			"gmax": null
		},
		"296": {
			"name": "Makuhita",
			"tier": "LC",
			"bestTier": "PU",
			"bestName": "Hariyama",
			"mega": null,
			"gmax": null
		},
		"297": {
			"name": "Hariyama",
			"tier": "PU",
			"bestTier": "PU",
			"bestName": "Hariyama",
			"mega": null,
			"gmax": null
		},
		"298": {
			"name": "Azurill",
			"tier": "LC",
			"bestTier": "UU",
			"bestName": "Azumarill",
			"mega": null,
			"gmax": null
		},
		"299": {
			"name": "Nosepass",
			"tier": "LC",
			"bestTier": "ZU",
			"bestName": "Probopass",
			"mega": null,
			"gmax": null
		},
		"300": {
			"name": "Skitty",
			"tier": "LC",
			"bestTier": "ZU",
			"bestName": "Delcatty",
			"mega": null,
			"gmax": null
		},
		"301": {
			"name": "Delcatty",
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Delcatty",
			"mega": null,
			"gmax": null
		},
		"302": {
			"name": "Sableye",
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
			"name": "Mawile",
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
			"name": "Aron",
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
			"name": "Lairon",
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
			"name": "Aggron",
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
			"name": "Meditite",
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
			"name": "Medicham",
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
			"name": "Electrike",
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
			"name": "Manectric",
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
			"name": "Plusle",
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Plusle",
			"mega": null,
			"gmax": null
		},
		"312": {
			"name": "Minun",
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Minun",
			"mega": null,
			"gmax": null
		},
		"313": {
			"name": "Volbeat",
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Volbeat",
			"mega": null,
			"gmax": null
		},
		"314": {
			"name": "Illumise",
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Illumise",
			"mega": null,
			"gmax": null
		},
		"315": {
			"name": "Roselia",
			"tier": "NFE",
			"bestTier": "RU",
			"bestName": "Roserade",
			"mega": null,
			"gmax": null
		},
		"316": {
			"name": "Gulpin",
			"tier": "LC",
			"bestTier": "ZU",
			"bestName": "Swalot",
			"mega": null,
			"gmax": null
		},
		"317": {
			"name": "Swalot",
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Swalot",
			"mega": null,
			"gmax": null
		},
		"318": {
			"name": "Carvanha",
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
			"name": "Sharpedo",
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
			"name": "Wailmer",
			"tier": "LC",
			"bestTier": "ZU",
			"bestName": "Wailord",
			"mega": null,
			"gmax": null
		},
		"321": {
			"name": "Wailord",
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Wailord",
			"mega": null,
			"gmax": null
		},
		"322": {
			"name": "Numel",
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
			"name": "Camerupt",
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
			"name": "Torkoal",
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Torkoal",
			"mega": null,
			"gmax": null
		},
		"325": {
			"name": "Spoink",
			"tier": "LC",
			"bestTier": "ZU",
			"bestName": "Grumpig",
			"mega": null,
			"gmax": null
		},
		"326": {
			"name": "Grumpig",
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Grumpig",
			"mega": null,
			"gmax": null
		},
		"327": {
			"name": "Spinda",
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Spinda",
			"mega": null,
			"gmax": null
		},
		"328": {
			"name": "Trapinch",
			"tier": "LC",
			"bestTier": "NU",
			"bestName": "Flygon",
			"mega": null,
			"gmax": null
		},
		"329": {
			"name": "Vibrava",
			"tier": "NFE",
			"bestTier": "NU",
			"bestName": "Flygon",
			"mega": null,
			"gmax": null
		},
		"330": {
			"name": "Flygon",
			"tier": "NU",
			"bestTier": "NU",
			"bestName": "Flygon",
			"mega": null,
			"gmax": null
		},
		"331": {
			"name": "Cacnea",
			"tier": "LC",
			"bestTier": "ZU",
			"bestName": "Cacturne",
			"mega": null,
			"gmax": null
		},
		"332": {
			"name": "Cacturne",
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Cacturne",
			"mega": null,
			"gmax": null
		},
		"333": {
			"name": "Swablu",
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
			"name": "Altaria",
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
			"name": "Zangoose",
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Zangoose",
			"mega": null,
			"gmax": null
		},
		"336": {
			"name": "Seviper",
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Seviper",
			"mega": null,
			"gmax": null
		},
		"337": {
			"name": "Lunatone",
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Lunatone",
			"mega": null,
			"gmax": null
		},
		"338": {
			"name": "Solrock",
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Solrock",
			"mega": null,
			"gmax": null
		},
		"339": {
			"name": "Barboach",
			"tier": "LC",
			"bestTier": "ZU",
			"bestName": "Whiscash",
			"mega": null,
			"gmax": null
		},
		"340": {
			"name": "Whiscash",
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Whiscash",
			"mega": null,
			"gmax": null
		},
		"341": {
			"name": "Corphish",
			"tier": "LC",
			"bestTier": "RU",
			"bestName": "Crawdaunt",
			"mega": null,
			"gmax": null
		},
		"342": {
			"name": "Crawdaunt",
			"tier": "RU",
			"bestTier": "RU",
			"bestName": "Crawdaunt",
			"mega": null,
			"gmax": null
		},
		"343": {
			"name": "Baltoy",
			"tier": "LC",
			"bestTier": "PU",
			"bestName": "Claydol",
			"mega": null,
			"gmax": null
		},
		"344": {
			"name": "Claydol",
			"tier": "PU",
			"bestTier": "PU",
			"bestName": "Claydol",
			"mega": null,
			"gmax": null
		},
		"345": {
			"name": "Lileep",
			"tier": "LC",
			"bestTier": "ZU",
			"bestName": "Cradily",
			"mega": null,
			"gmax": null
		},
		"346": {
			"name": "Cradily",
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Cradily",
			"mega": null,
			"gmax": null
		},
		"347": {
			"name": "Anorith",
			"tier": "LC",
			"bestTier": "ZU",
			"bestName": "Armaldo",
			"mega": null,
			"gmax": null
		},
		"348": {
			"name": "Armaldo",
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Armaldo",
			"mega": null,
			"gmax": null
		},
		"349": {
			"name": "Feebas",
			"tier": "LC",
			"bestTier": "PU",
			"bestName": "Milotic",
			"mega": null,
			"gmax": null
		},
		"350": {
			"name": "Milotic",
			"tier": "PU",
			"bestTier": "PU",
			"bestName": "Milotic",
			"mega": null,
			"gmax": null
		},
		"351": {
			"name": "Castform",
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Castform",
			"mega": null,
			"gmax": null
		},
		"352": {
			"name": "Kecleon",
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Kecleon",
			"mega": null,
			"gmax": null
		},
		"353": {
			"name": "Shuppet",
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
			"name": "Banette",
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
			"name": "Duskull",
			"tier": "LC",
			"bestTier": "ZU",
			"bestName": "Dusknoir",
			"mega": null,
			"gmax": null
		},
		"356": {
			"name": "Dusclops",
			"tier": "NFE",
			"bestTier": "ZU",
			"bestName": "Dusknoir",
			"mega": null,
			"gmax": null
		},
		"357": {
			"name": "Tropius",
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Tropius",
			"mega": null,
			"gmax": null
		},
		"358": {
			"name": "Chimecho",
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Chimecho",
			"mega": null,
			"gmax": null
		},
		"359": {
			"name": "Absol",
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
			"name": "Wynaut",
			"tier": "LC",
			"bestTier": "ZU",
			"bestName": "Wobbuffet",
			"mega": null,
			"gmax": null
		},
		"361": {
			"name": "Snorunt",
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
			"name": "Glalie",
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Glalie",
			"mega": {
				"tier": "NU",
				"name": "Glalie-Mega"
			},
			"gmax": null
		},
		"363": {
			"name": "Spheal",
			"tier": "LC",
			"bestTier": "ZU",
			"bestName": "Walrein",
			"mega": null,
			"gmax": null
		},
		"364": {
			"name": "Sealeo",
			"tier": "NFE",
			"bestTier": "ZU",
			"bestName": "Walrein",
			"mega": null,
			"gmax": null
		},
		"365": {
			"name": "Walrein",
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Walrein",
			"mega": null,
			"gmax": null
		},
		"366": {
			"name": "Clamperl",
			"tier": "LC",
			"bestTier": "ZUBL",
			"bestName": "Gorebyss",
			"mega": null,
			"gmax": null
		},
		"367": {
			"name": "Huntail",
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Huntail",
			"mega": null,
			"gmax": null
		},
		"368": {
			"name": "Gorebyss",
			"tier": "ZUBL",
			"bestTier": "ZUBL",
			"bestName": "Gorebyss",
			"mega": null,
			"gmax": null
		},
		"369": {
			"name": "Relicanth",
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Relicanth",
			"mega": null,
			"gmax": null
		},
		"370": {
			"name": "Luvdisc",
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Luvdisc",
			"mega": null,
			"gmax": null
		},
		"371": {
			"name": "Bagon",
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
			"name": "Shelgon",
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
			"name": "Salamence",
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
			"name": "Beldum",
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
			"name": "Metang",
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
			"name": "Metagross",
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
			"name": "Regirock",
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Regirock",
			"mega": null,
			"gmax": null
		},
		"378": {
			"name": "Regice",
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Regice",
			"mega": null,
			"gmax": null
		},
		"379": {
			"name": "Registeel",
			"tier": "RU",
			"bestTier": "RU",
			"bestName": "Registeel",
			"mega": null,
			"gmax": null
		},
		"380": {
			"name": "Latias",
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
			"name": "Latios",
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
			"name": "Kyogre",
			"tier": "Uber",
			"bestTier": "Uber",
			"bestName": "Kyogre",
			"mega": null,
			"gmax": null
		},
		"383": {
			"name": "Groudon",
			"tier": "Uber",
			"bestTier": "Uber",
			"bestName": "Groudon",
			"mega": null,
			"gmax": null
		},
		"384": {
			"name": "Rayquaza",
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
			"name": "Jirachi",
			"tier": "RU",
			"bestTier": "RU",
			"bestName": "Jirachi",
			"mega": null,
			"gmax": null
		},
		"386": {
			"name": "Deoxys",
			"tier": "Uber",
			"bestTier": "Uber",
			"bestName": "Deoxys",
			"mega": null,
			"gmax": null
		},
		"387": {
			"name": "Turtwig",
			"tier": "LC",
			"bestTier": "PUBL",
			"bestName": "Torterra",
			"mega": null,
			"gmax": null
		},
		"388": {
			"name": "Grotle",
			"tier": "NFE",
			"bestTier": "PUBL",
			"bestName": "Torterra",
			"mega": null,
			"gmax": null
		},
		"389": {
			"name": "Torterra",
			"tier": "PUBL",
			"bestTier": "PUBL",
			"bestName": "Torterra",
			"mega": null,
			"gmax": null
		},
		"390": {
			"name": "Chimchar",
			"tier": "LC",
			"bestTier": "NU",
			"bestName": "Infernape",
			"mega": null,
			"gmax": null
		},
		"391": {
			"name": "Monferno",
			"tier": "NFE",
			"bestTier": "NU",
			"bestName": "Infernape",
			"mega": null,
			"gmax": null
		},
		"392": {
			"name": "Infernape",
			"tier": "NU",
			"bestTier": "NU",
			"bestName": "Infernape",
			"mega": null,
			"gmax": null
		},
		"393": {
			"name": "Piplup",
			"tier": "LC",
			"bestTier": "RU",
			"bestName": "Empoleon",
			"mega": null,
			"gmax": null
		},
		"394": {
			"name": "Prinplup",
			"tier": "NFE",
			"bestTier": "RU",
			"bestName": "Empoleon",
			"mega": null,
			"gmax": null
		},
		"395": {
			"name": "Empoleon",
			"tier": "RU",
			"bestTier": "RU",
			"bestName": "Empoleon",
			"mega": null,
			"gmax": null
		},
		"396": {
			"name": "Starly",
			"tier": "LC",
			"bestTier": "NU",
			"bestName": "Staraptor",
			"mega": null,
			"gmax": null
		},
		"397": {
			"name": "Staravia",
			"tier": "NFE",
			"bestTier": "NU",
			"bestName": "Staraptor",
			"mega": null,
			"gmax": null
		},
		"398": {
			"name": "Staraptor",
			"tier": "NU",
			"bestTier": "NU",
			"bestName": "Staraptor",
			"mega": null,
			"gmax": null
		},
		"399": {
			"name": "Bidoof",
			"tier": "LC",
			"bestTier": "ZU",
			"bestName": "Bibarel",
			"mega": null,
			"gmax": null
		},
		"400": {
			"name": "Bibarel",
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Bibarel",
			"mega": null,
			"gmax": null
		},
		"401": {
			"name": "Kricketot",
			"tier": "LC",
			"bestTier": "ZU",
			"bestName": "Kricketune",
			"mega": null,
			"gmax": null
		},
		"402": {
			"name": "Kricketune",
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Kricketune",
			"mega": null,
			"gmax": null
		},
		"403": {
			"name": "Shinx",
			"tier": "LC",
			"bestTier": "ZU",
			"bestName": "Luxray",
			"mega": null,
			"gmax": null
		},
		"404": {
			"name": "Luxio",
			"tier": "NFE",
			"bestTier": "ZU",
			"bestName": "Luxray",
			"mega": null,
			"gmax": null
		},
		"405": {
			"name": "Luxray",
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Luxray",
			"mega": null,
			"gmax": null
		},
		"406": {
			"name": "Budew",
			"tier": "LC",
			"bestTier": "RU",
			"bestName": "Roserade",
			"mega": null,
			"gmax": null
		},
		"407": {
			"name": "Roserade",
			"tier": "RU",
			"bestTier": "RU",
			"bestName": "Roserade",
			"mega": null,
			"gmax": null
		},
		"408": {
			"name": "Cranidos",
			"tier": "LC",
			"bestTier": "ZU",
			"bestName": "Rampardos",
			"mega": null,
			"gmax": null
		},
		"409": {
			"name": "Rampardos",
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Rampardos",
			"mega": null,
			"gmax": null
		},
		"410": {
			"name": "Shieldon",
			"tier": "LC",
			"bestTier": "ZU",
			"bestName": "Bastiodon",
			"mega": null,
			"gmax": null
		},
		"411": {
			"name": "Bastiodon",
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Bastiodon",
			"mega": null,
			"gmax": null
		},
		"412": {
			"name": "Burmy",
			"tier": "LC",
			"bestTier": "ZU",
			"bestName": "Mothim",
			"mega": null,
			"gmax": null
		},
		"413": {
			"name": "Wormadam",
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Wormadam",
			"mega": null,
			"gmax": null
		},
		"414": {
			"name": "Mothim",
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Mothim",
			"mega": null,
			"gmax": null
		},
		"415": {
			"name": "Combee",
			"tier": "LC",
			"bestTier": "ZU",
			"bestName": "Vespiquen",
			"mega": null,
			"gmax": null
		},
		"416": {
			"name": "Vespiquen",
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Vespiquen",
			"mega": null,
			"gmax": null
		},
		"417": {
			"name": "Pachirisu",
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Pachirisu",
			"mega": null,
			"gmax": null
		},
		"418": {
			"name": "Buizel",
			"tier": "LC",
			"bestTier": "ZU",
			"bestName": "Floatzel",
			"mega": null,
			"gmax": null
		},
		"419": {
			"name": "Floatzel",
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Floatzel",
			"mega": null,
			"gmax": null
		},
		"420": {
			"name": "Cherubi",
			"tier": "NFE",
			"bestTier": "ZU",
			"bestName": "Cherrim",
			"mega": null,
			"gmax": null
		},
		"421": {
			"name": "Cherrim",
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Cherrim",
			"mega": null,
			"gmax": null
		},
		"422": {
			"name": "Shellos",
			"tier": "LC",
			"bestTier": "RU",
			"bestName": "Gastrodon",
			"mega": null,
			"gmax": null
		},
		"423": {
			"name": "Gastrodon",
			"tier": "RU",
			"bestTier": "RU",
			"bestName": "Gastrodon",
			"mega": null,
			"gmax": null
		},
		"424": {
			"name": "Ambipom",
			"tier": "PU",
			"bestTier": "PU",
			"bestName": "Ambipom",
			"mega": null,
			"gmax": null
		},
		"425": {
			"name": "Drifloon",
			"tier": "LC",
			"bestTier": "ZU",
			"bestName": "Drifblim",
			"mega": null,
			"gmax": null
		},
		"426": {
			"name": "Drifblim",
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Drifblim",
			"mega": null,
			"gmax": null
		},
		"427": {
			"name": "Buneary",
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
			"name": "Lopunny",
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
			"name": "Mismagius",
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Mismagius",
			"mega": null,
			"gmax": null
		},
		"430": {
			"name": "Honchkrow",
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Honchkrow",
			"mega": null,
			"gmax": null
		},
		"431": {
			"name": "Glameow",
			"tier": "LC",
			"bestTier": "ZU",
			"bestName": "Purugly",
			"mega": null,
			"gmax": null
		},
		"432": {
			"name": "Purugly",
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Purugly",
			"mega": null,
			"gmax": null
		},
		"433": {
			"name": "Chingling",
			"tier": "LC",
			"bestTier": "ZU",
			"bestName": "Chimecho",
			"mega": null,
			"gmax": null
		},
		"434": {
			"name": "Stunky",
			"tier": "LC",
			"bestTier": "PU",
			"bestName": "Skuntank",
			"mega": null,
			"gmax": null
		},
		"435": {
			"name": "Skuntank",
			"tier": "PU",
			"bestTier": "PU",
			"bestName": "Skuntank",
			"mega": null,
			"gmax": null
		},
		"436": {
			"name": "Bronzor",
			"tier": "LC",
			"bestTier": "NU",
			"bestName": "Bronzong",
			"mega": null,
			"gmax": null
		},
		"437": {
			"name": "Bronzong",
			"tier": "NU",
			"bestTier": "NU",
			"bestName": "Bronzong",
			"mega": null,
			"gmax": null
		},
		"438": {
			"name": "Bonsly",
			"tier": "LC",
			"bestTier": "ZU",
			"bestName": "Sudowoodo",
			"mega": null,
			"gmax": null
		},
		"439": {
			"name": "Mime Jr.",
			"tier": "LC",
			"bestTier": "ZU",
			"bestName": "Mr. Rime",
			"mega": null,
			"gmax": null
		},
		"440": {
			"name": "Happiny",
			"tier": "LC",
			"bestTier": "RU",
			"bestName": "Blissey",
			"mega": null,
			"gmax": null
		},
		"441": {
			"name": "Chatot",
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Chatot",
			"mega": null,
			"gmax": null
		},
		"442": {
			"name": "Spiritomb",
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Spiritomb",
			"mega": null,
			"gmax": null
		},
		"443": {
			"name": "Gible",
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
			"name": "Gabite",
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
			"name": "Garchomp",
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
			"name": "Munchlax",
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
			"name": "Riolu",
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
			"name": "Lucario",
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
			"name": "Hippopotas",
			"tier": "LC",
			"bestTier": "RU",
			"bestName": "Hippowdon",
			"mega": null,
			"gmax": null
		},
		"450": {
			"name": "Hippowdon",
			"tier": "RU",
			"bestTier": "RU",
			"bestName": "Hippowdon",
			"mega": null,
			"gmax": null
		},
		"451": {
			"name": "Skorupi",
			"tier": "LC",
			"bestTier": "NU",
			"bestName": "Drapion",
			"mega": null,
			"gmax": null
		},
		"452": {
			"name": "Drapion",
			"tier": "NU",
			"bestTier": "NU",
			"bestName": "Drapion",
			"mega": null,
			"gmax": null
		},
		"453": {
			"name": "Croagunk",
			"tier": "LC",
			"bestTier": "NU",
			"bestName": "Toxicroak",
			"mega": null,
			"gmax": null
		},
		"454": {
			"name": "Toxicroak",
			"tier": "NU",
			"bestTier": "NU",
			"bestName": "Toxicroak",
			"mega": null,
			"gmax": null
		},
		"455": {
			"name": "Carnivine",
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Carnivine",
			"mega": null,
			"gmax": null
		},
		"456": {
			"name": "Finneon",
			"tier": "LC",
			"bestTier": "ZU",
			"bestName": "Lumineon",
			"mega": null,
			"gmax": null
		},
		"457": {
			"name": "Lumineon",
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Lumineon",
			"mega": null,
			"gmax": null
		},
		"458": {
			"name": "Mantyke",
			"tier": "LC",
			"bestTier": "NU",
			"bestName": "Mantine",
			"mega": null,
			"gmax": null
		},
		"459": {
			"name": "Snover",
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
			"name": "Abomasnow",
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
			"name": "Weavile",
			"tier": "OU",
			"bestTier": "OU",
			"bestName": "Weavile",
			"mega": null,
			"gmax": null
		},
		"462": {
			"name": "Magnezone",
			"tier": "RU",
			"bestTier": "RU",
			"bestName": "Magnezone",
			"mega": null,
			"gmax": null
		},
		"463": {
			"name": "Lickilicky",
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Lickilicky",
			"mega": null,
			"gmax": null
		},
		"464": {
			"name": "Rhyperior",
			"tier": "NU",
			"bestTier": "NU",
			"bestName": "Rhyperior",
			"mega": null,
			"gmax": null
		},
		"465": {
			"name": "Tangrowth",
			"tier": "UU",
			"bestTier": "UU",
			"bestName": "Tangrowth",
			"mega": null,
			"gmax": null
		},
		"466": {
			"name": "Electivire",
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Electivire",
			"mega": null,
			"gmax": null
		},
		"467": {
			"name": "Magmortar",
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Magmortar",
			"mega": null,
			"gmax": null
		},
		"468": {
			"name": "Togekiss",
			"tier": "RU",
			"bestTier": "RU",
			"bestName": "Togekiss",
			"mega": null,
			"gmax": null
		},
		"469": {
			"name": "Yanmega",
			"tier": "RUBL",
			"bestTier": "RUBL",
			"bestName": "Yanmega",
			"mega": null,
			"gmax": null
		},
		"470": {
			"name": "Leafeon",
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Leafeon",
			"mega": null,
			"gmax": null
		},
		"471": {
			"name": "Glaceon",
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Glaceon",
			"mega": null,
			"gmax": null
		},
		"472": {
			"name": "Gliscor",
			"tier": "OU",
			"bestTier": "OU",
			"bestName": "Gliscor",
			"mega": null,
			"gmax": null
		},
		"473": {
			"name": "Mamoswine",
			"tier": "RU",
			"bestTier": "RU",
			"bestName": "Mamoswine",
			"mega": null,
			"gmax": null
		},
		"474": {
			"name": "Porygon-Z",
			"tier": "NUBL",
			"bestTier": "NUBL",
			"bestName": "Porygon-Z",
			"mega": null,
			"gmax": null
		},
		"475": {
			"name": "Gallade",
			"tier": "RU",
			"bestTier": "RU",
			"bestName": "Gallade",
			"mega": {
				"tier": "UUBL",
				"name": "Gallade-Mega"
			},
			"gmax": null
		},
		"476": {
			"name": "Probopass",
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Probopass",
			"mega": null,
			"gmax": null
		},
		"477": {
			"name": "Dusknoir",
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Dusknoir",
			"mega": null,
			"gmax": null
		},
		"478": {
			"name": "Froslass",
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Froslass",
			"mega": null,
			"gmax": null
		},
		"479": {
			"name": "Rotom",
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Rotom",
			"mega": null,
			"gmax": null
		},
		"480": {
			"name": "Uxie",
			"tier": "PU",
			"bestTier": "PU",
			"bestName": "Uxie",
			"mega": null,
			"gmax": null
		},
		"481": {
			"name": "Mesprit",
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Mesprit",
			"mega": null,
			"gmax": null
		},
		"482": {
			"name": "Azelf",
			"tier": "RU",
			"bestTier": "RU",
			"bestName": "Azelf",
			"mega": null,
			"gmax": null
		},
		"483": {
			"name": "Dialga",
			"tier": "Uber",
			"bestTier": "Uber",
			"bestName": "Dialga",
			"mega": null,
			"gmax": null
		},
		"484": {
			"name": "Palkia",
			"tier": "Uber",
			"bestTier": "Uber",
			"bestName": "Palkia",
			"mega": null,
			"gmax": null
		},
		"485": {
			"name": "Heatran",
			"tier": "UU",
			"bestTier": "UU",
			"bestName": "Heatran",
			"mega": null,
			"gmax": null
		},
		"486": {
			"name": "Regigigas",
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Regigigas",
			"mega": null,
			"gmax": null
		},
		"487": {
			"name": "Giratina",
			"tier": "Uber",
			"bestTier": "Uber",
			"bestName": "Giratina",
			"mega": null,
			"gmax": null
		},
		"488": {
			"name": "Cresselia",
			"tier": "NUBL",
			"bestTier": "NUBL",
			"bestName": "Cresselia",
			"mega": null,
			"gmax": null
		},
		"489": {
			"name": "Phione",
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Phione",
			"mega": null,
			"gmax": null
		},
		"490": {
			"name": "Manaphy",
			"tier": "UU",
			"bestTier": "UU",
			"bestName": "Manaphy",
			"mega": null,
			"gmax": null
		},
		"491": {
			"name": "Darkrai",
			"tier": "OU",
			"bestTier": "OU",
			"bestName": "Darkrai",
			"mega": null,
			"gmax": null
		},
		"492": {
			"name": "Shaymin",
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Shaymin",
			"mega": null,
			"gmax": null
		},
		"493": {
			"name": "Arceus",
			"tier": "Uber",
			"bestTier": "Uber",
			"bestName": "Arceus",
			"mega": null,
			"gmax": null
		},
		"494": {
			"name": "Victini",
			"tier": "OU",
			"bestTier": "OU",
			"bestName": "Victini",
			"mega": null,
			"gmax": null
		},
		"495": {
			"name": "Snivy",
			"tier": "NFE",
			"bestTier": "RUBL",
			"bestName": "Serperior",
			"mega": null,
			"gmax": null
		},
		"496": {
			"name": "Servine",
			"tier": "NFE",
			"bestTier": "RUBL",
			"bestName": "Serperior",
			"mega": null,
			"gmax": null
		},
		"497": {
			"name": "Serperior",
			"tier": "RUBL",
			"bestTier": "RUBL",
			"bestName": "Serperior",
			"mega": null,
			"gmax": null
		},
		"498": {
			"name": "Tepig",
			"tier": "LC",
			"bestTier": "ZUBL",
			"bestName": "Emboar",
			"mega": null,
			"gmax": null
		},
		"499": {
			"name": "Pignite",
			"tier": "NFE",
			"bestTier": "ZUBL",
			"bestName": "Emboar",
			"mega": null,
			"gmax": null
		},
		"500": {
			"name": "Emboar",
			"tier": "ZUBL",
			"bestTier": "ZUBL",
			"bestName": "Emboar",
			"mega": null,
			"gmax": null
		},
		"501": {
			"name": "Oshawott",
			"tier": "LC",
			"bestTier": "OU",
			"bestName": "Samurott-Hisui",
			"mega": null,
			"gmax": null
		},
		"502": {
			"name": "Dewott",
			"tier": "NFE",
			"bestTier": "OU",
			"bestName": "Samurott-Hisui",
			"mega": null,
			"gmax": null
		},
		"503": {
			"name": "Samurott",
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Samurott",
			"mega": null,
			"gmax": null
		},
		"504": {
			"name": "Patrat",
			"tier": "LC",
			"bestTier": "ZU",
			"bestName": "Watchog",
			"mega": null,
			"gmax": null
		},
		"505": {
			"name": "Watchog",
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Watchog",
			"mega": null,
			"gmax": null
		},
		"506": {
			"name": "Lillipup",
			"tier": "LC",
			"bestTier": "ZU",
			"bestName": "Stoutland",
			"mega": null,
			"gmax": null
		},
		"507": {
			"name": "Herdier",
			"tier": "NFE",
			"bestTier": "ZU",
			"bestName": "Stoutland",
			"mega": null,
			"gmax": null
		},
		"508": {
			"name": "Stoutland",
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Stoutland",
			"mega": null,
			"gmax": null
		},
		"509": {
			"name": "Purrloin",
			"tier": "LC",
			"bestTier": "ZU",
			"bestName": "Liepard",
			"mega": null,
			"gmax": null
		},
		"510": {
			"name": "Liepard",
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Liepard",
			"mega": null,
			"gmax": null
		},
		"511": {
			"name": "Pansage",
			"tier": "LC",
			"bestTier": "ZU",
			"bestName": "Simisage",
			"mega": null,
			"gmax": null
		},
		"512": {
			"name": "Simisage",
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Simisage",
			"mega": null,
			"gmax": null
		},
		"513": {
			"name": "Pansear",
			"tier": "LC",
			"bestTier": "ZU",
			"bestName": "Simisear",
			"mega": null,
			"gmax": null
		},
		"514": {
			"name": "Simisear",
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Simisear",
			"mega": null,
			"gmax": null
		},
		"515": {
			"name": "Panpour",
			"tier": "LC",
			"bestTier": "ZU",
			"bestName": "Simipour",
			"mega": null,
			"gmax": null
		},
		"516": {
			"name": "Simipour",
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Simipour",
			"mega": null,
			"gmax": null
		},
		"517": {
			"name": "Munna",
			"tier": "LC",
			"bestTier": "ZU",
			"bestName": "Musharna",
			"mega": null,
			"gmax": null
		},
		"518": {
			"name": "Musharna",
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Musharna",
			"mega": null,
			"gmax": null
		},
		"519": {
			"name": "Pidove",
			"tier": "LC",
			"bestTier": "ZU",
			"bestName": "Unfezant",
			"mega": null,
			"gmax": null
		},
		"520": {
			"name": "Tranquill",
			"tier": "NFE",
			"bestTier": "ZU",
			"bestName": "Unfezant",
			"mega": null,
			"gmax": null
		},
		"521": {
			"name": "Unfezant",
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Unfezant",
			"mega": null,
			"gmax": null
		},
		"522": {
			"name": "Blitzle",
			"tier": "LC",
			"bestTier": "ZU",
			"bestName": "Zebstrika",
			"mega": null,
			"gmax": null
		},
		"523": {
			"name": "Zebstrika",
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Zebstrika",
			"mega": null,
			"gmax": null
		},
		"524": {
			"name": "Roggenrola",
			"tier": "LC",
			"bestTier": "PU",
			"bestName": "Gigalith",
			"mega": null,
			"gmax": null
		},
		"525": {
			"name": "Boldore",
			"tier": "NFE",
			"bestTier": "PU",
			"bestName": "Gigalith",
			"mega": null,
			"gmax": null
		},
		"526": {
			"name": "Gigalith",
			"tier": "PU",
			"bestTier": "PU",
			"bestName": "Gigalith",
			"mega": null,
			"gmax": null
		},
		"527": {
			"name": "Woobat",
			"tier": "NFE",
			"bestTier": "ZU",
			"bestName": "Swoobat",
			"mega": null,
			"gmax": null
		},
		"528": {
			"name": "Swoobat",
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Swoobat",
			"mega": null,
			"gmax": null
		},
		"529": {
			"name": "Drilbur",
			"tier": "LC",
			"bestTier": "UU",
			"bestName": "Excadrill",
			"mega": null,
			"gmax": null
		},
		"530": {
			"name": "Excadrill",
			"tier": "UU",
			"bestTier": "UU",
			"bestName": "Excadrill",
			"mega": null,
			"gmax": null
		},
		"531": {
			"name": "Audino",
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
			"name": "Timburr",
			"tier": "LC",
			"bestTier": "UU",
			"bestName": "Conkeldurr",
			"mega": null,
			"gmax": null
		},
		"533": {
			"name": "Gurdurr",
			"tier": "NFE",
			"bestTier": "UU",
			"bestName": "Conkeldurr",
			"mega": null,
			"gmax": null
		},
		"534": {
			"name": "Conkeldurr",
			"tier": "UU",
			"bestTier": "UU",
			"bestName": "Conkeldurr",
			"mega": null,
			"gmax": null
		},
		"535": {
			"name": "Tympole",
			"tier": "LC",
			"bestTier": "RU",
			"bestName": "Seismitoad",
			"mega": null,
			"gmax": null
		},
		"536": {
			"name": "Palpitoad",
			"tier": "NFE",
			"bestTier": "RU",
			"bestName": "Seismitoad",
			"mega": null,
			"gmax": null
		},
		"537": {
			"name": "Seismitoad",
			"tier": "RU",
			"bestTier": "RU",
			"bestName": "Seismitoad",
			"mega": null,
			"gmax": null
		},
		"538": {
			"name": "Throh",
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Throh",
			"mega": null,
			"gmax": null
		},
		"539": {
			"name": "Sawk",
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Sawk",
			"mega": null,
			"gmax": null
		},
		"540": {
			"name": "Sewaddle",
			"tier": "LC",
			"bestTier": "ZU",
			"bestName": "Leavanny",
			"mega": null,
			"gmax": null
		},
		"541": {
			"name": "Swadloon",
			"tier": "NFE",
			"bestTier": "ZU",
			"bestName": "Leavanny",
			"mega": null,
			"gmax": null
		},
		"542": {
			"name": "Leavanny",
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Leavanny",
			"mega": null,
			"gmax": null
		},
		"543": {
			"name": "Venipede",
			"tier": "LC",
			"bestTier": "RUBL",
			"bestName": "Scolipede",
			"mega": null,
			"gmax": null
		},
		"544": {
			"name": "Whirlipede",
			"tier": "NFE",
			"bestTier": "RUBL",
			"bestName": "Scolipede",
			"mega": null,
			"gmax": null
		},
		"545": {
			"name": "Scolipede",
			"tier": "RUBL",
			"bestTier": "RUBL",
			"bestName": "Scolipede",
			"mega": null,
			"gmax": null
		},
		"546": {
			"name": "Cottonee",
			"tier": "LC",
			"bestTier": "ZU",
			"bestName": "Whimsicott",
			"mega": null,
			"gmax": null
		},
		"547": {
			"name": "Whimsicott",
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Whimsicott",
			"mega": null,
			"gmax": null
		},
		"548": {
			"name": "Petilil",
			"tier": "LC",
			"bestTier": "NUBL",
			"bestName": "Lilligant-Hisui",
			"mega": null,
			"gmax": null
		},
		"549": {
			"name": "Lilligant",
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Lilligant",
			"mega": null,
			"gmax": null
		},
		"550": {
			"name": "Basculin",
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Basculin",
			"mega": null,
			"gmax": null
		},
		"551": {
			"name": "Sandile",
			"tier": "LC",
			"bestTier": "RU",
			"bestName": "Krookodile",
			"mega": null,
			"gmax": null
		},
		"552": {
			"name": "Krokorok",
			"tier": "NFE",
			"bestTier": "RU",
			"bestName": "Krookodile",
			"mega": null,
			"gmax": null
		},
		"553": {
			"name": "Krookodile",
			"tier": "RU",
			"bestTier": "RU",
			"bestName": "Krookodile",
			"mega": null,
			"gmax": null
		},
		"554": {
			"name": "Darumaka",
			"tier": "LC",
			"bestTier": "UU",
			"bestName": "Darmanitan",
			"mega": null,
			"gmax": null
		},
		"555": {
			"name": "Darmanitan",
			"tier": "UU",
			"bestTier": "UU",
			"bestName": "Darmanitan",
			"mega": null,
			"gmax": null
		},
		"556": {
			"name": "Maractus",
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Maractus",
			"mega": null,
			"gmax": null
		},
		"557": {
			"name": "Dwebble",
			"tier": "LC",
			"bestTier": "ZU",
			"bestName": "Crustle",
			"mega": null,
			"gmax": null
		},
		"558": {
			"name": "Crustle",
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Crustle",
			"mega": null,
			"gmax": null
		},
		"559": {
			"name": "Scraggy",
			"tier": "NFE",
			"bestTier": "NU",
			"bestName": "Scrafty",
			"mega": null,
			"gmax": null
		},
		"560": {
			"name": "Scrafty",
			"tier": "NU",
			"bestTier": "NU",
			"bestName": "Scrafty",
			"mega": null,
			"gmax": null
		},
		"561": {
			"name": "Sigilyph",
			"tier": "NUBL",
			"bestTier": "NUBL",
			"bestName": "Sigilyph",
			"mega": null,
			"gmax": null
		},
		"562": {
			"name": "Yamask",
			"tier": "LC",
			"bestTier": "ZU",
			"bestName": "Cofagrigus",
			"mega": null,
			"gmax": null
		},
		"563": {
			"name": "Cofagrigus",
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Cofagrigus",
			"mega": null,
			"gmax": null
		},
		"564": {
			"name": "Tirtouga",
			"tier": "LC",
			"bestTier": "ZU",
			"bestName": "Carracosta",
			"mega": null,
			"gmax": null
		},
		"565": {
			"name": "Carracosta",
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Carracosta",
			"mega": null,
			"gmax": null
		},
		"566": {
			"name": "Archen",
			"tier": "LC",
			"bestTier": "PU",
			"bestName": "Archeops",
			"mega": null,
			"gmax": null
		},
		"567": {
			"name": "Archeops",
			"tier": "PU",
			"bestTier": "PU",
			"bestName": "Archeops",
			"mega": null,
			"gmax": null
		},
		"568": {
			"name": "Trubbish",
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
			"name": "Garbodor",
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
			"name": "Zorua",
			"tier": "LC",
			"bestTier": "PU",
			"bestName": "Zoroark",
			"mega": null,
			"gmax": null
		},
		"571": {
			"name": "Zoroark",
			"tier": "PU",
			"bestTier": "PU",
			"bestName": "Zoroark",
			"mega": null,
			"gmax": null
		},
		"572": {
			"name": "Minccino",
			"tier": "LC",
			"bestTier": "NU",
			"bestName": "Cinccino",
			"mega": null,
			"gmax": null
		},
		"573": {
			"name": "Cinccino",
			"tier": "NU",
			"bestTier": "NU",
			"bestName": "Cinccino",
			"mega": null,
			"gmax": null
		},
		"574": {
			"name": "Gothita",
			"tier": "LC",
			"bestTier": "ZU",
			"bestName": "Gothitelle",
			"mega": null,
			"gmax": null
		},
		"575": {
			"name": "Gothorita",
			"tier": "NFE",
			"bestTier": "ZU",
			"bestName": "Gothitelle",
			"mega": null,
			"gmax": null
		},
		"576": {
			"name": "Gothitelle",
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Gothitelle",
			"mega": null,
			"gmax": null
		},
		"577": {
			"name": "Solosis",
			"tier": "LC",
			"bestTier": "RU",
			"bestName": "Reuniclus",
			"mega": null,
			"gmax": null
		},
		"578": {
			"name": "Duosion",
			"tier": "NFE",
			"bestTier": "RU",
			"bestName": "Reuniclus",
			"mega": null,
			"gmax": null
		},
		"579": {
			"name": "Reuniclus",
			"tier": "RU",
			"bestTier": "RU",
			"bestName": "Reuniclus",
			"mega": null,
			"gmax": null
		},
		"580": {
			"name": "Ducklett",
			"tier": "LC",
			"bestTier": "ZU",
			"bestName": "Swanna",
			"mega": null,
			"gmax": null
		},
		"581": {
			"name": "Swanna",
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Swanna",
			"mega": null,
			"gmax": null
		},
		"582": {
			"name": "Vanillite",
			"tier": "LC",
			"bestTier": "PUBL",
			"bestName": "Vanilluxe",
			"mega": null,
			"gmax": null
		},
		"583": {
			"name": "Vanillish",
			"tier": "NFE",
			"bestTier": "PUBL",
			"bestName": "Vanilluxe",
			"mega": null,
			"gmax": null
		},
		"584": {
			"name": "Vanilluxe",
			"tier": "PUBL",
			"bestTier": "PUBL",
			"bestName": "Vanilluxe",
			"mega": null,
			"gmax": null
		},
		"585": {
			"name": "Deerling",
			"tier": "LC",
			"bestTier": "ZU",
			"bestName": "Sawsbuck",
			"mega": null,
			"gmax": null
		},
		"586": {
			"name": "Sawsbuck",
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Sawsbuck",
			"mega": null,
			"gmax": null
		},
		"587": {
			"name": "Emolga",
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Emolga",
			"mega": null,
			"gmax": null
		},
		"588": {
			"name": "Karrablast",
			"tier": "LC",
			"bestTier": "NU",
			"bestName": "Escavalier",
			"mega": null,
			"gmax": null
		},
		"589": {
			"name": "Escavalier",
			"tier": "NU",
			"bestTier": "NU",
			"bestName": "Escavalier",
			"mega": null,
			"gmax": null
		},
		"590": {
			"name": "Foongus",
			"tier": "LC",
			"bestTier": "PU",
			"bestName": "Amoonguss",
			"mega": null,
			"gmax": null
		},
		"591": {
			"name": "Amoonguss",
			"tier": "PU",
			"bestTier": "PU",
			"bestName": "Amoonguss",
			"mega": null,
			"gmax": null
		},
		"592": {
			"name": "Frillish",
			"tier": "LC",
			"bestTier": "PU",
			"bestName": "Jellicent",
			"mega": null,
			"gmax": null
		},
		"593": {
			"name": "Jellicent",
			"tier": "PU",
			"bestTier": "PU",
			"bestName": "Jellicent",
			"mega": null,
			"gmax": null
		},
		"594": {
			"name": "Alomomola",
			"tier": "OU",
			"bestTier": "OU",
			"bestName": "Alomomola",
			"mega": null,
			"gmax": null
		},
		"595": {
			"name": "Joltik",
			"tier": "LC",
			"bestTier": "NU",
			"bestName": "Galvantula",
			"mega": null,
			"gmax": null
		},
		"596": {
			"name": "Galvantula",
			"tier": "NU",
			"bestTier": "NU",
			"bestName": "Galvantula",
			"mega": null,
			"gmax": null
		},
		"597": {
			"name": "Ferroseed",
			"tier": "PU",
			"bestTier": "OU",
			"bestName": "Ferrothorn",
			"mega": null,
			"gmax": null
		},
		"598": {
			"name": "Ferrothorn",
			"tier": "OU",
			"bestTier": "OU",
			"bestName": "Ferrothorn",
			"mega": null,
			"gmax": null
		},
		"599": {
			"name": "Klink",
			"tier": "LC",
			"bestTier": "ZU",
			"bestName": "Klinklang",
			"mega": null,
			"gmax": null
		},
		"600": {
			"name": "Klang",
			"tier": "NFE",
			"bestTier": "ZU",
			"bestName": "Klinklang",
			"mega": null,
			"gmax": null
		},
		"601": {
			"name": "Klinklang",
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Klinklang",
			"mega": null,
			"gmax": null
		},
		"602": {
			"name": "Tynamo",
			"tier": "LC",
			"bestTier": "ZU",
			"bestName": "Eelektross",
			"mega": null,
			"gmax": null
		},
		"603": {
			"name": "Eelektrik",
			"tier": "NFE",
			"bestTier": "ZU",
			"bestName": "Eelektross",
			"mega": null,
			"gmax": null
		},
		"604": {
			"name": "Eelektross",
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Eelektross",
			"mega": null,
			"gmax": null
		},
		"605": {
			"name": "Elgyem",
			"tier": "LC",
			"bestTier": "ZU",
			"bestName": "Beheeyem",
			"mega": null,
			"gmax": null
		},
		"606": {
			"name": "Beheeyem",
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Beheeyem",
			"mega": null,
			"gmax": null
		},
		"607": {
			"name": "Litwick",
			"tier": "LC",
			"bestTier": "NU",
			"bestName": "Chandelure",
			"mega": null,
			"gmax": null
		},
		"608": {
			"name": "Lampent",
			"tier": "NFE",
			"bestTier": "NU",
			"bestName": "Chandelure",
			"mega": null,
			"gmax": null
		},
		"609": {
			"name": "Chandelure",
			"tier": "NU",
			"bestTier": "NU",
			"bestName": "Chandelure",
			"mega": null,
			"gmax": null
		},
		"610": {
			"name": "Axew",
			"tier": "LC",
			"bestTier": "RUBL",
			"bestName": "Haxorus",
			"mega": null,
			"gmax": null
		},
		"611": {
			"name": "Fraxure",
			"tier": "NFE",
			"bestTier": "RUBL",
			"bestName": "Haxorus",
			"mega": null,
			"gmax": null
		},
		"612": {
			"name": "Haxorus",
			"tier": "RUBL",
			"bestTier": "RUBL",
			"bestName": "Haxorus",
			"mega": null,
			"gmax": null
		},
		"613": {
			"name": "Cubchoo",
			"tier": "LC",
			"bestTier": "ZU",
			"bestName": "Beartic",
			"mega": null,
			"gmax": null
		},
		"614": {
			"name": "Beartic",
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Beartic",
			"mega": null,
			"gmax": null
		},
		"615": {
			"name": "Cryogonal",
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Cryogonal",
			"mega": null,
			"gmax": null
		},
		"616": {
			"name": "Shelmet",
			"tier": "LC",
			"bestTier": "ZU",
			"bestName": "Accelgor",
			"mega": null,
			"gmax": null
		},
		"617": {
			"name": "Accelgor",
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Accelgor",
			"mega": null,
			"gmax": null
		},
		"618": {
			"name": "Stunfisk",
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Stunfisk",
			"mega": null,
			"gmax": null
		},
		"619": {
			"name": "Mienfoo",
			"tier": "LC",
			"bestTier": "NUBL",
			"bestName": "Mienshao",
			"mega": null,
			"gmax": null
		},
		"620": {
			"name": "Mienshao",
			"tier": "NUBL",
			"bestTier": "NUBL",
			"bestName": "Mienshao",
			"mega": null,
			"gmax": null
		},
		"621": {
			"name": "Druddigon",
			"tier": "PU",
			"bestTier": "PU",
			"bestName": "Druddigon",
			"mega": null,
			"gmax": null
		},
		"622": {
			"name": "Golett",
			"tier": "LC",
			"bestTier": "PU",
			"bestName": "Golurk",
			"mega": null,
			"gmax": null
		},
		"623": {
			"name": "Golurk",
			"tier": "PU",
			"bestTier": "PU",
			"bestName": "Golurk",
			"mega": null,
			"gmax": null
		},
		"624": {
			"name": "Pawniard",
			"tier": "LC",
			"bestTier": "OU",
			"bestName": "Kingambit",
			"mega": null,
			"gmax": null
		},
		"625": {
			"name": "Bisharp",
			"tier": "RU",
			"bestTier": "OU",
			"bestName": "Kingambit",
			"mega": null,
			"gmax": null
		},
		"626": {
			"name": "Bouffalant",
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Bouffalant",
			"mega": null,
			"gmax": null
		},
		"627": {
			"name": "Rufflet",
			"tier": "NFE",
			"bestTier": "NU",
			"bestName": "Braviary",
			"mega": null,
			"gmax": null
		},
		"628": {
			"name": "Braviary",
			"tier": "NU",
			"bestTier": "NU",
			"bestName": "Braviary",
			"mega": null,
			"gmax": null
		},
		"629": {
			"name": "Vullaby",
			"tier": "LC",
			"bestTier": "UU",
			"bestName": "Mandibuzz",
			"mega": null,
			"gmax": null
		},
		"630": {
			"name": "Mandibuzz",
			"tier": "UU",
			"bestTier": "UU",
			"bestName": "Mandibuzz",
			"mega": null,
			"gmax": null
		},
		"631": {
			"name": "Heatmor",
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Heatmor",
			"mega": null,
			"gmax": null
		},
		"632": {
			"name": "Durant",
			"tier": "RUBL",
			"bestTier": "RUBL",
			"bestName": "Durant",
			"mega": null,
			"gmax": null
		},
		"633": {
			"name": "Deino",
			"tier": "LC",
			"bestTier": "RUBL",
			"bestName": "Hydreigon",
			"mega": null,
			"gmax": null
		},
		"634": {
			"name": "Zweilous",
			"tier": "NFE",
			"bestTier": "RUBL",
			"bestName": "Hydreigon",
			"mega": null,
			"gmax": null
		},
		"635": {
			"name": "Hydreigon",
			"tier": "RUBL",
			"bestTier": "RUBL",
			"bestName": "Hydreigon",
			"mega": null,
			"gmax": null
		},
		"636": {
			"name": "Larvesta",
			"tier": "LC",
			"bestTier": "Uber",
			"bestName": "Volcarona",
			"mega": null,
			"gmax": null
		},
		"637": {
			"name": "Volcarona",
			"tier": "Uber",
			"bestTier": "Uber",
			"bestName": "Volcarona",
			"mega": null,
			"gmax": null
		},
		"638": {
			"name": "Cobalion",
			"tier": "UU",
			"bestTier": "UU",
			"bestName": "Cobalion",
			"mega": null,
			"gmax": null
		},
		"639": {
			"name": "Terrakion",
			"tier": "RU",
			"bestTier": "RU",
			"bestName": "Terrakion",
			"mega": null,
			"gmax": null
		},
		"640": {
			"name": "Virizion",
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Virizion",
			"mega": null,
			"gmax": null
		},
		"641": {
			"name": "Tornadus",
			"tier": "NU",
			"bestTier": "NU",
			"bestName": "Tornadus",
			"mega": null,
			"gmax": null
		},
		"642": {
			"name": "Thundurus",
			"tier": "RUBL",
			"bestTier": "RUBL",
			"bestName": "Thundurus",
			"mega": null,
			"gmax": null
		},
		"643": {
			"name": "Reshiram",
			"tier": "Uber",
			"bestTier": "Uber",
			"bestName": "Reshiram",
			"mega": null,
			"gmax": null
		},
		"644": {
			"name": "Zekrom",
			"tier": "Uber",
			"bestTier": "Uber",
			"bestName": "Zekrom",
			"mega": null,
			"gmax": null
		},
		"645": {
			"name": "Landorus",
			"tier": "Uber",
			"bestTier": "Uber",
			"bestName": "Landorus",
			"mega": null,
			"gmax": null
		},
		"646": {
			"name": "Kyurem",
			"tier": "OU",
			"bestTier": "OU",
			"bestName": "Kyurem",
			"mega": null,
			"gmax": null
		},
		"647": {
			"name": "Keldeo",
			"tier": "UU",
			"bestTier": "UU",
			"bestName": "Keldeo",
			"mega": null,
			"gmax": null
		},
		"648": {
			"name": "Meloetta",
			"tier": "NU",
			"bestTier": "NU",
			"bestName": "Meloetta",
			"mega": null,
			"gmax": null
		},
		"649": {
			"name": "Genesect",
			"tier": "Uber",
			"bestTier": "Uber",
			"bestName": "Genesect",
			"mega": null,
			"gmax": null
		},
		"650": {
			"name": "Chespin",
			"tier": "LC",
			"bestTier": "RU",
			"bestName": "Chesnaught",
			"mega": null,
			"gmax": null
		},
		"651": {
			"name": "Quilladin",
			"tier": "NFE",
			"bestTier": "RU",
			"bestName": "Chesnaught",
			"mega": null,
			"gmax": null
		},
		"652": {
			"name": "Chesnaught",
			"tier": "RU",
			"bestTier": "RU",
			"bestName": "Chesnaught",
			"mega": null,
			"gmax": null
		},
		"653": {
			"name": "Fennekin",
			"tier": "LC",
			"bestTier": "PU",
			"bestName": "Delphox",
			"mega": null,
			"gmax": null
		},
		"654": {
			"name": "Braixen",
			"tier": "NFE",
			"bestTier": "PU",
			"bestName": "Delphox",
			"mega": null,
			"gmax": null
		},
		"655": {
			"name": "Delphox",
			"tier": "PU",
			"bestTier": "PU",
			"bestName": "Delphox",
			"mega": null,
			"gmax": null
		},
		"656": {
			"name": "Froakie",
			"tier": "LC",
			"bestTier": "UU",
			"bestName": "Greninja",
			"mega": null,
			"gmax": null
		},
		"657": {
			"name": "Frogadier",
			"tier": "NFE",
			"bestTier": "UU",
			"bestName": "Greninja",
			"mega": null,
			"gmax": null
		},
		"658": {
			"name": "Greninja",
			"tier": "UU",
			"bestTier": "UU",
			"bestName": "Greninja",
			"mega": null,
			"gmax": null
		},
		"659": {
			"name": "Bunnelby",
			"tier": "LC",
			"bestTier": "RUBL",
			"bestName": "Diggersby",
			"mega": null,
			"gmax": null
		},
		"660": {
			"name": "Diggersby",
			"tier": "RUBL",
			"bestTier": "RUBL",
			"bestName": "Diggersby",
			"mega": null,
			"gmax": null
		},
		"661": {
			"name": "Fletchling",
			"tier": "LC",
			"bestTier": "RU",
			"bestName": "Talonflame",
			"mega": null,
			"gmax": null
		},
		"662": {
			"name": "Fletchinder",
			"tier": "NFE",
			"bestTier": "RU",
			"bestName": "Talonflame",
			"mega": null,
			"gmax": null
		},
		"663": {
			"name": "Talonflame",
			"tier": "RU",
			"bestTier": "RU",
			"bestName": "Talonflame",
			"mega": null,
			"gmax": null
		},
		"664": {
			"name": "Scatterbug",
			"tier": "LC",
			"bestTier": "ZU",
			"bestName": "Vivillon-Fancy",
			"mega": null,
			"gmax": null
		},
		"665": {
			"name": "Spewpa",
			"tier": "NFE",
			"bestTier": "ZU",
			"bestName": "Vivillon-Fancy",
			"mega": null,
			"gmax": null
		},
		"666": {
			"name": "Vivillon",
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Vivillon",
			"mega": null,
			"gmax": null
		},
		"667": {
			"name": "Litleo",
			"tier": "LC",
			"bestTier": "ZU",
			"bestName": "Pyroar",
			"mega": null,
			"gmax": null
		},
		"668": {
			"name": "Pyroar",
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Pyroar",
			"mega": null,
			"gmax": null
		},
		"669": {
			"name": "Flabébé",
			"tier": "LC",
			"bestTier": "PU",
			"bestName": "Florges",
			"mega": null,
			"gmax": null
		},
		"670": {
			"name": "Floette",
			"tier": "NFE",
			"bestTier": "PU",
			"bestName": "Florges",
			"mega": null,
			"gmax": null
		},
		"671": {
			"name": "Florges",
			"tier": "PU",
			"bestTier": "PU",
			"bestName": "Florges",
			"mega": null,
			"gmax": null
		},
		"672": {
			"name": "Skiddo",
			"tier": "LC",
			"bestTier": "ZU",
			"bestName": "Gogoat",
			"mega": null,
			"gmax": null
		},
		"673": {
			"name": "Gogoat",
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Gogoat",
			"mega": null,
			"gmax": null
		},
		"674": {
			"name": "Pancham",
			"tier": "LC",
			"bestTier": "NUBL",
			"bestName": "Pangoro",
			"mega": null,
			"gmax": null
		},
		"675": {
			"name": "Pangoro",
			"tier": "NUBL",
			"bestTier": "NUBL",
			"bestName": "Pangoro",
			"mega": null,
			"gmax": null
		},
		"676": {
			"name": "Furfrou",
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Furfrou",
			"mega": null,
			"gmax": null
		},
		"677": {
			"name": "Espurr",
			"tier": "LC",
			"bestTier": "ZU",
			"bestName": "Meowstic-F",
			"mega": null,
			"gmax": null
		},
		"678": {
			"name": "Meowstic",
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Meowstic",
			"mega": null,
			"gmax": null
		},
		"679": {
			"name": "Honedge",
			"tier": "LC",
			"bestTier": "UUBL",
			"bestName": "Aegislash",
			"mega": null,
			"gmax": null
		},
		"680": {
			"name": "Doublade",
			"tier": "PU",
			"bestTier": "UUBL",
			"bestName": "Aegislash",
			"mega": null,
			"gmax": null
		},
		"681": {
			"name": "Aegislash",
			"tier": "UUBL",
			"bestTier": "UUBL",
			"bestName": "Aegislash",
			"mega": null,
			"gmax": null
		},
		"682": {
			"name": "Spritzee",
			"tier": "LC",
			"bestTier": "PU",
			"bestName": "Aromatisse",
			"mega": null,
			"gmax": null
		},
		"683": {
			"name": "Aromatisse",
			"tier": "PU",
			"bestTier": "PU",
			"bestName": "Aromatisse",
			"mega": null,
			"gmax": null
		},
		"684": {
			"name": "Swirlix",
			"tier": "NFE",
			"bestTier": "NUBL",
			"bestName": "Slurpuff",
			"mega": null,
			"gmax": null
		},
		"685": {
			"name": "Slurpuff",
			"tier": "NUBL",
			"bestTier": "NUBL",
			"bestName": "Slurpuff",
			"mega": null,
			"gmax": null
		},
		"686": {
			"name": "Inkay",
			"tier": "LC",
			"bestTier": "ZU",
			"bestName": "Malamar",
			"mega": null,
			"gmax": null
		},
		"687": {
			"name": "Malamar",
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Malamar",
			"mega": null,
			"gmax": null
		},
		"688": {
			"name": "Binacle",
			"tier": "LC",
			"bestTier": "NUBL",
			"bestName": "Barbaracle",
			"mega": null,
			"gmax": null
		},
		"689": {
			"name": "Barbaracle",
			"tier": "NUBL",
			"bestTier": "NUBL",
			"bestName": "Barbaracle",
			"mega": null,
			"gmax": null
		},
		"690": {
			"name": "Skrelp",
			"tier": "LC",
			"bestTier": "PUBL",
			"bestName": "Dragalge",
			"mega": null,
			"gmax": null
		},
		"691": {
			"name": "Dragalge",
			"tier": "PUBL",
			"bestTier": "PUBL",
			"bestName": "Dragalge",
			"mega": null,
			"gmax": null
		},
		"692": {
			"name": "Clauncher",
			"tier": "LC",
			"bestTier": "ZU",
			"bestName": "Clawitzer",
			"mega": null,
			"gmax": null
		},
		"693": {
			"name": "Clawitzer",
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Clawitzer",
			"mega": null,
			"gmax": null
		},
		"694": {
			"name": "Helioptile",
			"tier": "LC",
			"bestTier": "NU",
			"bestName": "Heliolisk",
			"mega": null,
			"gmax": null
		},
		"695": {
			"name": "Heliolisk",
			"tier": "NU",
			"bestTier": "NU",
			"bestName": "Heliolisk",
			"mega": null,
			"gmax": null
		},
		"696": {
			"name": "Tyrunt",
			"tier": "LC",
			"bestTier": "NU",
			"bestName": "Tyrantrum",
			"mega": null,
			"gmax": null
		},
		"697": {
			"name": "Tyrantrum",
			"tier": "NU",
			"bestTier": "NU",
			"bestName": "Tyrantrum",
			"mega": null,
			"gmax": null
		},
		"698": {
			"name": "Amaura",
			"tier": "LC",
			"bestTier": "ZUBL",
			"bestName": "Aurorus",
			"mega": null,
			"gmax": null
		},
		"699": {
			"name": "Aurorus",
			"tier": "ZUBL",
			"bestTier": "ZUBL",
			"bestName": "Aurorus",
			"mega": null,
			"gmax": null
		},
		"700": {
			"name": "Sylveon",
			"tier": "NU",
			"bestTier": "NU",
			"bestName": "Sylveon",
			"mega": null,
			"gmax": null
		},
		"701": {
			"name": "Hawlucha",
			"tier": "UU",
			"bestTier": "UU",
			"bestName": "Hawlucha",
			"mega": null,
			"gmax": null
		},
		"702": {
			"name": "Dedenne",
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Dedenne",
			"mega": null,
			"gmax": null
		},
		"703": {
			"name": "Carbink",
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Carbink",
			"mega": null,
			"gmax": null
		},
		"704": {
			"name": "Goomy",
			"tier": "LC",
			"bestTier": "RU",
			"bestName": "Goodra-Hisui",
			"mega": null,
			"gmax": null
		},
		"705": {
			"name": "Sliggoo",
			"tier": "NFE",
			"bestTier": "PU",
			"bestName": "Goodra",
			"mega": null,
			"gmax": null
		},
		"706": {
			"name": "Goodra",
			"tier": "PU",
			"bestTier": "PU",
			"bestName": "Goodra",
			"mega": null,
			"gmax": null
		},
		"707": {
			"name": "Klefki",
			"tier": "NU",
			"bestTier": "NU",
			"bestName": "Klefki",
			"mega": null,
			"gmax": null
		},
		"708": {
			"name": "Phantump",
			"tier": "LC",
			"bestTier": "ZU",
			"bestName": "Trevenant",
			"mega": null,
			"gmax": null
		},
		"709": {
			"name": "Trevenant",
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Trevenant",
			"mega": null,
			"gmax": null
		},
		"710": {
			"name": "Pumpkaboo",
			"tier": "LC",
			"bestTier": "ZU",
			"bestName": "Gourgeist",
			"mega": null,
			"gmax": null
		},
		"711": {
			"name": "Gourgeist",
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Gourgeist",
			"mega": null,
			"gmax": null
		},
		"712": {
			"name": "Bergmite",
			"tier": "LC",
			"bestTier": "NU",
			"bestName": "Avalugg",
			"mega": null,
			"gmax": null
		},
		"713": {
			"name": "Avalugg",
			"tier": "NU",
			"bestTier": "NU",
			"bestName": "Avalugg",
			"mega": null,
			"gmax": null
		},
		"714": {
			"name": "Noibat",
			"tier": "LC",
			"bestTier": "RU",
			"bestName": "Noivern",
			"mega": null,
			"gmax": null
		},
		"715": {
			"name": "Noivern",
			"tier": "RU",
			"bestTier": "RU",
			"bestName": "Noivern",
			"mega": null,
			"gmax": null
		},
		"716": {
			"name": "Xerneas",
			"tier": "Uber",
			"bestTier": "Uber",
			"bestName": "Xerneas",
			"mega": null,
			"gmax": null
		},
		"717": {
			"name": "Yveltal",
			"tier": "Uber",
			"bestTier": "Uber",
			"bestName": "Yveltal",
			"mega": null,
			"gmax": null
		},
		"718": {
			"name": "Zygarde",
			"tier": "Uber",
			"bestTier": "Uber",
			"bestName": "Zygarde",
			"mega": null,
			"gmax": null
		},
		"719": {
			"name": "Diancie",
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
			"name": "Hoopa",
			"tier": "PU",
			"bestTier": "PU",
			"bestName": "Hoopa",
			"mega": null,
			"gmax": null
		},
		"721": {
			"name": "Volcanion",
			"tier": "RU",
			"bestTier": "RU",
			"bestName": "Volcanion",
			"mega": null,
			"gmax": null
		},
		"722": {
			"name": "Rowlet",
			"tier": "LC",
			"bestTier": "NU",
			"bestName": "Decidueye",
			"mega": null,
			"gmax": null
		},
		"723": {
			"name": "Dartrix",
			"tier": "NFE",
			"bestTier": "NU",
			"bestName": "Decidueye",
			"mega": null,
			"gmax": null
		},
		"724": {
			"name": "Decidueye",
			"tier": "NU",
			"bestTier": "NU",
			"bestName": "Decidueye",
			"mega": null,
			"gmax": null
		},
		"725": {
			"name": "Litten",
			"tier": "LC",
			"bestTier": "NU",
			"bestName": "Incineroar",
			"mega": null,
			"gmax": null
		},
		"726": {
			"name": "Torracat",
			"tier": "NFE",
			"bestTier": "NU",
			"bestName": "Incineroar",
			"mega": null,
			"gmax": null
		},
		"727": {
			"name": "Incineroar",
			"tier": "NU",
			"bestTier": "NU",
			"bestName": "Incineroar",
			"mega": null,
			"gmax": null
		},
		"728": {
			"name": "Popplio",
			"tier": "LC",
			"bestTier": "OU",
			"bestName": "Primarina",
			"mega": null,
			"gmax": null
		},
		"729": {
			"name": "Brionne",
			"tier": "NFE",
			"bestTier": "OU",
			"bestName": "Primarina",
			"mega": null,
			"gmax": null
		},
		"730": {
			"name": "Primarina",
			"tier": "OU",
			"bestTier": "OU",
			"bestName": "Primarina",
			"mega": null,
			"gmax": null
		},
		"731": {
			"name": "Pikipek",
			"tier": "LC",
			"bestTier": "ZU",
			"bestName": "Toucannon",
			"mega": null,
			"gmax": null
		},
		"732": {
			"name": "Trumbeak",
			"tier": "NFE",
			"bestTier": "ZU",
			"bestName": "Toucannon",
			"mega": null,
			"gmax": null
		},
		"733": {
			"name": "Toucannon",
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Toucannon",
			"mega": null,
			"gmax": null
		},
		"734": {
			"name": "Yungoos",
			"tier": "LC",
			"bestTier": "ZU",
			"bestName": "Gumshoos",
			"mega": null,
			"gmax": null
		},
		"735": {
			"name": "Gumshoos",
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Gumshoos",
			"mega": null,
			"gmax": null
		},
		"736": {
			"name": "Grubbin",
			"tier": "LC",
			"bestTier": "ZU",
			"bestName": "Vikavolt",
			"mega": null,
			"gmax": null
		},
		"737": {
			"name": "Charjabug",
			"tier": "NFE",
			"bestTier": "ZU",
			"bestName": "Vikavolt",
			"mega": null,
			"gmax": null
		},
		"738": {
			"name": "Vikavolt",
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Vikavolt",
			"mega": null,
			"gmax": null
		},
		"739": {
			"name": "Crabrawler",
			"tier": "LC",
			"bestTier": "ZU",
			"bestName": "Crabominable",
			"mega": null,
			"gmax": null
		},
		"740": {
			"name": "Crabominable",
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Crabominable",
			"mega": null,
			"gmax": null
		},
		"741": {
			"name": "Oricorio",
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Oricorio",
			"mega": null,
			"gmax": null
		},
		"742": {
			"name": "Cutiefly",
			"tier": "NFE",
			"bestTier": "RU",
			"bestName": "Ribombee",
			"mega": null,
			"gmax": null
		},
		"743": {
			"name": "Ribombee",
			"tier": "RU",
			"bestTier": "RU",
			"bestName": "Ribombee",
			"mega": null,
			"gmax": null
		},
		"744": {
			"name": "Rockruff",
			"tier": "LC",
			"bestTier": "ZU",
			"bestName": "Lycanroc-Midnight",
			"mega": null,
			"gmax": null
		},
		"745": {
			"name": "Lycanroc",
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Lycanroc",
			"mega": null,
			"gmax": null
		},
		"746": {
			"name": "Wishiwashi",
			"tier": "PU",
			"bestTier": "PU",
			"bestName": "Wishiwashi",
			"mega": null,
			"gmax": null
		},
		"747": {
			"name": "Mareanie",
			"tier": "LC",
			"bestTier": "UU",
			"bestName": "Toxapex",
			"mega": null,
			"gmax": null
		},
		"748": {
			"name": "Toxapex",
			"tier": "UU",
			"bestTier": "UU",
			"bestName": "Toxapex",
			"mega": null,
			"gmax": null
		},
		"749": {
			"name": "Mudbray",
			"tier": "LC",
			"bestTier": "PU",
			"bestName": "Mudsdale",
			"mega": null,
			"gmax": null
		},
		"750": {
			"name": "Mudsdale",
			"tier": "PU",
			"bestTier": "PU",
			"bestName": "Mudsdale",
			"mega": null,
			"gmax": null
		},
		"751": {
			"name": "Dewpider",
			"tier": "LC",
			"bestTier": "OU",
			"bestName": "Araquanid",
			"mega": null,
			"gmax": null
		},
		"752": {
			"name": "Araquanid",
			"tier": "OU",
			"bestTier": "OU",
			"bestName": "Araquanid",
			"mega": null,
			"gmax": null
		},
		"753": {
			"name": "Fomantis",
			"tier": "LC",
			"bestTier": "ZU",
			"bestName": "Lurantis",
			"mega": null,
			"gmax": null
		},
		"754": {
			"name": "Lurantis",
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Lurantis",
			"mega": null,
			"gmax": null
		},
		"755": {
			"name": "Morelull",
			"tier": "LC",
			"bestTier": "ZU",
			"bestName": "Shiinotic",
			"mega": null,
			"gmax": null
		},
		"756": {
			"name": "Shiinotic",
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Shiinotic",
			"mega": null,
			"gmax": null
		},
		"757": {
			"name": "Salandit",
			"tier": "LC",
			"bestTier": "PU",
			"bestName": "Salazzle",
			"mega": null,
			"gmax": null
		},
		"758": {
			"name": "Salazzle",
			"tier": "PU",
			"bestTier": "PU",
			"bestName": "Salazzle",
			"mega": null,
			"gmax": null
		},
		"759": {
			"name": "Stufful",
			"tier": "LC",
			"bestTier": "NUBL",
			"bestName": "Bewear",
			"mega": null,
			"gmax": null
		},
		"760": {
			"name": "Bewear",
			"tier": "NUBL",
			"bestTier": "NUBL",
			"bestName": "Bewear",
			"mega": null,
			"gmax": null
		},
		"761": {
			"name": "Bounsweet",
			"tier": "LC",
			"bestTier": "NU",
			"bestName": "Tsareena",
			"mega": null,
			"gmax": null
		},
		"762": {
			"name": "Steenee",
			"tier": "NFE",
			"bestTier": "NU",
			"bestName": "Tsareena",
			"mega": null,
			"gmax": null
		},
		"763": {
			"name": "Tsareena",
			"tier": "NU",
			"bestTier": "NU",
			"bestName": "Tsareena",
			"mega": null,
			"gmax": null
		},
		"764": {
			"name": "Comfey",
			"tier": "UU",
			"bestTier": "UU",
			"bestName": "Comfey",
			"mega": null,
			"gmax": null
		},
		"765": {
			"name": "Oranguru",
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Oranguru",
			"mega": null,
			"gmax": null
		},
		"766": {
			"name": "Passimian",
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Passimian",
			"mega": null,
			"gmax": null
		},
		"767": {
			"name": "Wimpod",
			"tier": "LC",
			"bestTier": "RU",
			"bestName": "Golisopod",
			"mega": null,
			"gmax": null
		},
		"768": {
			"name": "Golisopod",
			"tier": "RU",
			"bestTier": "RU",
			"bestName": "Golisopod",
			"mega": null,
			"gmax": null
		},
		"769": {
			"name": "Sandygast",
			"tier": "LC",
			"bestTier": "PU",
			"bestName": "Palossand",
			"mega": null,
			"gmax": null
		},
		"770": {
			"name": "Palossand",
			"tier": "PU",
			"bestTier": "PU",
			"bestName": "Palossand",
			"mega": null,
			"gmax": null
		},
		"771": {
			"name": "Pyukumuku",
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Pyukumuku",
			"mega": null,
			"gmax": null
		},
		"772": {
			"name": "Type: Null",
			"tier": "NFE",
			"bestTier": "ZU",
			"bestName": "Silvally",
			"mega": null,
			"gmax": null
		},
		"773": {
			"name": "Silvally",
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Silvally",
			"mega": null,
			"gmax": null
		},
		"774": {
			"name": "Minior",
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Minior",
			"mega": null,
			"gmax": null
		},
		"775": {
			"name": "Komala",
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Komala",
			"mega": null,
			"gmax": null
		},
		"776": {
			"name": "Turtonator",
			"tier": "ZUBL",
			"bestTier": "ZUBL",
			"bestName": "Turtonator",
			"mega": null,
			"gmax": null
		},
		"777": {
			"name": "Togedemaru",
			"tier": "PU",
			"bestTier": "PU",
			"bestName": "Togedemaru",
			"mega": null,
			"gmax": null
		},
		"778": {
			"name": "Mimikyu",
			"tier": "RU",
			"bestTier": "RU",
			"bestName": "Mimikyu",
			"mega": null,
			"gmax": null
		},
		"779": {
			"name": "Bruxish",
			"tier": "PU",
			"bestTier": "PU",
			"bestName": "Bruxish",
			"mega": null,
			"gmax": null
		},
		"780": {
			"name": "Drampa",
			"tier": "PUBL",
			"bestTier": "PUBL",
			"bestName": "Drampa",
			"mega": null,
			"gmax": null
		},
		"781": {
			"name": "Dhelmise",
			"tier": "NU",
			"bestTier": "NU",
			"bestName": "Dhelmise",
			"mega": null,
			"gmax": null
		},
		"782": {
			"name": "Jangmo-o",
			"tier": "LC",
			"bestTier": "UUBL",
			"bestName": "Kommo-o",
			"mega": null,
			"gmax": null
		},
		"783": {
			"name": "Hakamo-o",
			"tier": "NFE",
			"bestTier": "UUBL",
			"bestName": "Kommo-o",
			"mega": null,
			"gmax": null
		},
		"784": {
			"name": "Kommo-o",
			"tier": "UUBL",
			"bestTier": "UUBL",
			"bestName": "Kommo-o",
			"mega": null,
			"gmax": null
		},
		"785": {
			"name": "Tapu Koko",
			"tier": "OU",
			"bestTier": "OU",
			"bestName": "Tapu Koko",
			"mega": null,
			"gmax": null
		},
		"786": {
			"name": "Tapu Lele",
			"tier": "OU",
			"bestTier": "OU",
			"bestName": "Tapu Lele",
			"mega": null,
			"gmax": null
		},
		"787": {
			"name": "Tapu Bulu",
			"tier": "UU",
			"bestTier": "UU",
			"bestName": "Tapu Bulu",
			"mega": null,
			"gmax": null
		},
		"788": {
			"name": "Tapu Fini",
			"tier": "OU",
			"bestTier": "OU",
			"bestName": "Tapu Fini",
			"mega": null,
			"gmax": null
		},
		"789": {
			"name": "Cosmog",
			"tier": "LC",
			"bestTier": "Uber",
			"bestName": "Lunala",
			"mega": null,
			"gmax": null
		},
		"790": {
			"name": "Cosmoem",
			"tier": "NFE",
			"bestTier": "Uber",
			"bestName": "Lunala",
			"mega": null,
			"gmax": null
		},
		"791": {
			"name": "Solgaleo",
			"tier": "Uber",
			"bestTier": "Uber",
			"bestName": "Solgaleo",
			"mega": null,
			"gmax": null
		},
		"792": {
			"name": "Lunala",
			"tier": "Uber",
			"bestTier": "Uber",
			"bestName": "Lunala",
			"mega": null,
			"gmax": null
		},
		"793": {
			"name": "Nihilego",
			"tier": "UU",
			"bestTier": "UU",
			"bestName": "Nihilego",
			"mega": null,
			"gmax": null
		},
		"794": {
			"name": "Buzzwole",
			"tier": "OU",
			"bestTier": "OU",
			"bestName": "Buzzwole",
			"mega": null,
			"gmax": null
		},
		"795": {
			"name": "Pheromosa",
			"tier": "Uber",
			"bestTier": "Uber",
			"bestName": "Pheromosa",
			"mega": null,
			"gmax": null
		},
		"796": {
			"name": "Xurkitree",
			"tier": "RU",
			"bestTier": "RU",
			"bestName": "Xurkitree",
			"mega": null,
			"gmax": null
		},
		"797": {
			"name": "Celesteela",
			"tier": "UU",
			"bestTier": "UU",
			"bestName": "Celesteela",
			"mega": null,
			"gmax": null
		},
		"798": {
			"name": "Kartana",
			"tier": "OU",
			"bestTier": "OU",
			"bestName": "Kartana",
			"mega": null,
			"gmax": null
		},
		"799": {
			"name": "Guzzlord",
			"tier": "PUBL",
			"bestTier": "PUBL",
			"bestName": "Guzzlord",
			"mega": null,
			"gmax": null
		},
		"800": {
			"name": "Necrozma",
			"tier": "NUBL",
			"bestTier": "NUBL",
			"bestName": "Necrozma",
			"mega": null,
			"gmax": null
		},
		"801": {
			"name": "Magearna",
			"tier": "Uber",
			"bestTier": "Uber",
			"bestName": "Magearna",
			"mega": null,
			"gmax": null
		},
		"802": {
			"name": "Marshadow",
			"tier": "Uber",
			"bestTier": "Uber",
			"bestName": "Marshadow",
			"mega": null,
			"gmax": null
		},
		"803": {
			"name": "Poipole",
			"tier": "NFE",
			"bestTier": "Uber",
			"bestName": "Naganadel",
			"mega": null,
			"gmax": null
		},
		"804": {
			"name": "Naganadel",
			"tier": "Uber",
			"bestTier": "Uber",
			"bestName": "Naganadel",
			"mega": null,
			"gmax": null
		},
		"805": {
			"name": "Stakataka",
			"tier": "NU",
			"bestTier": "NU",
			"bestName": "Stakataka",
			"mega": null,
			"gmax": null
		},
		"806": {
			"name": "Blacephalon",
			"tier": "OU",
			"bestTier": "OU",
			"bestName": "Blacephalon",
			"mega": null,
			"gmax": null
		},
		"807": {
			"name": "Zeraora",
			"tier": "OU",
			"bestTier": "OU",
			"bestName": "Zeraora",
			"mega": null,
			"gmax": null
		},
		"808": {
			"name": "Meltan",
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Meltan",
			"mega": null,
			"gmax": null
		},
		"809": {
			"name": "Melmetal",
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
			"name": "Grookey",
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
			"name": "Thwackey",
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
			"name": "Rillaboom",
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
			"name": "Scorbunny",
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
			"name": "Raboot",
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
			"name": "Cinderace",
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
			"name": "Sobble",
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
			"name": "Drizzile",
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
			"name": "Inteleon",
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
			"name": "Skwovet",
			"tier": "LC",
			"bestTier": "ZU",
			"bestName": "Greedent",
			"mega": null,
			"gmax": null
		},
		"820": {
			"name": "Greedent",
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Greedent",
			"mega": null,
			"gmax": null
		},
		"821": {
			"name": "Rookidee",
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
			"name": "Corvisquire",
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
			"name": "Corviknight",
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
			"name": "Blipbug",
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
			"name": "Dottler",
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
			"name": "Orbeetle",
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
			"name": "Nickit",
			"tier": "LC",
			"bestTier": "ZU",
			"bestName": "Thievul",
			"mega": null,
			"gmax": null
		},
		"828": {
			"name": "Thievul",
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Thievul",
			"mega": null,
			"gmax": null
		},
		"829": {
			"name": "Gossifleur",
			"tier": "LC",
			"bestTier": "PU",
			"bestName": "Eldegoss",
			"mega": null,
			"gmax": null
		},
		"830": {
			"name": "Eldegoss",
			"tier": "PU",
			"bestTier": "PU",
			"bestName": "Eldegoss",
			"mega": null,
			"gmax": null
		},
		"831": {
			"name": "Wooloo",
			"tier": "LC",
			"bestTier": "ZU",
			"bestName": "Dubwool",
			"mega": null,
			"gmax": null
		},
		"832": {
			"name": "Dubwool",
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Dubwool",
			"mega": null,
			"gmax": null
		},
		"833": {
			"name": "Chewtle",
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
			"name": "Drednaw",
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
			"name": "Yamper",
			"tier": "LC",
			"bestTier": "ZU",
			"bestName": "Boltund",
			"mega": null,
			"gmax": null
		},
		"836": {
			"name": "Boltund",
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Boltund",
			"mega": null,
			"gmax": null
		},
		"837": {
			"name": "Rolycoly",
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
			"name": "Carkol",
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
			"name": "Coalossal",
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
			"name": "Applin",
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
			"name": "Flapple",
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Flapple",
			"mega": null,
			"gmax": {
				"tier": "AG",
				"name": "Flapple-Gmax"
			}
		},
		"842": {
			"name": "Appletun",
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Appletun",
			"mega": null,
			"gmax": {
				"tier": "AG",
				"name": "Appletun-Gmax"
			}
		},
		"843": {
			"name": "Silicobra",
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
			"name": "Sandaconda",
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
			"name": "Cramorant",
			"tier": "PU",
			"bestTier": "PU",
			"bestName": "Cramorant",
			"mega": null,
			"gmax": null
		},
		"846": {
			"name": "Arrokuda",
			"tier": "LC",
			"bestTier": "NU",
			"bestName": "Barraskewda",
			"mega": null,
			"gmax": null
		},
		"847": {
			"name": "Barraskewda",
			"tier": "NU",
			"bestTier": "NU",
			"bestName": "Barraskewda",
			"mega": null,
			"gmax": null
		},
		"848": {
			"name": "Toxel",
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
			"name": "Toxtricity",
			"tier": "NU",
			"bestTier": "NU",
			"bestName": "Toxtricity",
			"mega": null,
			"gmax": {
				"tier": "AG",
				"name": "Toxtricity-Gmax"
			}
		},
		"850": {
			"name": "Sizzlipede",
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
			"name": "Centiskorch",
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
			"name": "Clobbopus",
			"tier": "LC",
			"bestTier": "ZU",
			"bestName": "Grapploct",
			"mega": null,
			"gmax": null
		},
		"853": {
			"name": "Grapploct",
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Grapploct",
			"mega": null,
			"gmax": null
		},
		"854": {
			"name": "Sinistea",
			"tier": "LC",
			"bestTier": "UUBL",
			"bestName": "Polteageist",
			"mega": null,
			"gmax": null
		},
		"855": {
			"name": "Polteageist",
			"tier": "UUBL",
			"bestTier": "UUBL",
			"bestName": "Polteageist",
			"mega": null,
			"gmax": null
		},
		"856": {
			"name": "Hatenna",
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
			"name": "Hattrem",
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
			"name": "Hatterene",
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
			"name": "Impidimp",
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
			"name": "Morgrem",
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
			"name": "Grimmsnarl",
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
			"name": "Obstagoon",
			"tier": "RUBL",
			"bestTier": "RUBL",
			"bestName": "Obstagoon",
			"mega": null,
			"gmax": null
		},
		"863": {
			"name": "Perrserker",
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Perrserker",
			"mega": null,
			"gmax": null
		},
		"864": {
			"name": "Cursola",
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Cursola",
			"mega": null,
			"gmax": null
		},
		"865": {
			"name": "Sirfetch’d",
			"tier": "NUBL",
			"bestTier": "NUBL",
			"bestName": "Sirfetch’d",
			"mega": null,
			"gmax": null
		},
		"866": {
			"name": "Mr. Rime",
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Mr. Rime",
			"mega": null,
			"gmax": null
		},
		"867": {
			"name": "Runerigus",
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Runerigus",
			"mega": null,
			"gmax": null
		},
		"868": {
			"name": "Milcery",
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
			"name": "Alcremie",
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
			"name": "Falinks",
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Falinks",
			"mega": null,
			"gmax": null
		},
		"871": {
			"name": "Pincurchin",
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Pincurchin",
			"mega": null,
			"gmax": null
		},
		"872": {
			"name": "Snom",
			"tier": "LC",
			"bestTier": "PU",
			"bestName": "Frosmoth",
			"mega": null,
			"gmax": null
		},
		"873": {
			"name": "Frosmoth",
			"tier": "PU",
			"bestTier": "PU",
			"bestName": "Frosmoth",
			"mega": null,
			"gmax": null
		},
		"874": {
			"name": "Stonjourner",
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Stonjourner",
			"mega": null,
			"gmax": null
		},
		"875": {
			"name": "Eiscue",
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Eiscue",
			"mega": null,
			"gmax": null
		},
		"876": {
			"name": "Indeedee",
			"tier": "PUBL",
			"bestTier": "PUBL",
			"bestName": "Indeedee",
			"mega": null,
			"gmax": null
		},
		"877": {
			"name": "Morpeko",
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Morpeko",
			"mega": null,
			"gmax": null
		},
		"878": {
			"name": "Cufant",
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
			"name": "Copperajah",
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
			"name": "Dracozolt",
			"tier": "UUBL",
			"bestTier": "UUBL",
			"bestName": "Dracozolt",
			"mega": null,
			"gmax": null
		},
		"881": {
			"name": "Arctozolt",
			"tier": "UUBL",
			"bestTier": "UUBL",
			"bestName": "Arctozolt",
			"mega": null,
			"gmax": null
		},
		"882": {
			"name": "Dracovish",
			"tier": "Uber",
			"bestTier": "Uber",
			"bestName": "Dracovish",
			"mega": null,
			"gmax": null
		},
		"883": {
			"name": "Arctovish",
			"tier": "ZUBL",
			"bestTier": "ZUBL",
			"bestName": "Arctovish",
			"mega": null,
			"gmax": null
		},
		"884": {
			"name": "Duraludon",
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
			"name": "Dreepy",
			"tier": "LC",
			"bestTier": "OU",
			"bestName": "Dragapult",
			"mega": null,
			"gmax": null
		},
		"886": {
			"name": "Drakloak",
			"tier": "NFE",
			"bestTier": "OU",
			"bestName": "Dragapult",
			"mega": null,
			"gmax": null
		},
		"887": {
			"name": "Dragapult",
			"tier": "OU",
			"bestTier": "OU",
			"bestName": "Dragapult",
			"mega": null,
			"gmax": null
		},
		"888": {
			"name": "Zacian",
			"tier": "Uber",
			"bestTier": "Uber",
			"bestName": "Zacian",
			"mega": null,
			"gmax": null
		},
		"889": {
			"name": "Zamazenta",
			"tier": "OU",
			"bestTier": "OU",
			"bestName": "Zamazenta",
			"mega": null,
			"gmax": null
		},
		"890": {
			"name": "Eternatus",
			"tier": "Uber",
			"bestTier": "Uber",
			"bestName": "Eternatus",
			"mega": null,
			"gmax": null
		},
		"891": {
			"name": "Kubfu",
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
			"name": "Urshifu",
			"tier": "Uber",
			"bestTier": "Uber",
			"bestName": "Urshifu",
			"mega": null,
			"gmax": {
				"tier": "AG",
				"name": "Urshifu-Gmax"
			}
		},
		"893": {
			"name": "Zarude",
			"tier": "UU",
			"bestTier": "UU",
			"bestName": "Zarude",
			"mega": null,
			"gmax": null
		},
		"894": {
			"name": "Regieleki",
			"tier": "Uber",
			"bestTier": "Uber",
			"bestName": "Regieleki",
			"mega": null,
			"gmax": null
		},
		"895": {
			"name": "Regidrago",
			"tier": "NUBL",
			"bestTier": "NUBL",
			"bestName": "Regidrago",
			"mega": null,
			"gmax": null
		},
		"896": {
			"name": "Glastrier",
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Glastrier",
			"mega": null,
			"gmax": null
		},
		"897": {
			"name": "Spectrier",
			"tier": "Uber",
			"bestTier": "Uber",
			"bestName": "Spectrier",
			"mega": null,
			"gmax": null
		},
		"898": {
			"name": "Calyrex",
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Calyrex",
			"mega": null,
			"gmax": null
		},
		"899": {
			"name": "Wyrdeer",
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Wyrdeer",
			"mega": null,
			"gmax": null
		},
		"900": {
			"name": "Kleavor",
			"tier": "RU",
			"bestTier": "RU",
			"bestName": "Kleavor",
			"mega": null,
			"gmax": null
		},
		"901": {
			"name": "Ursaluna",
			"tier": "UUBL",
			"bestTier": "UUBL",
			"bestName": "Ursaluna",
			"mega": null,
			"gmax": null
		},
		"902": {
			"name": "Basculegion",
			"tier": "NU",
			"bestTier": "NU",
			"bestName": "Basculegion",
			"mega": null,
			"gmax": null
		},
		"903": {
			"name": "Sneasler",
			"tier": "Uber",
			"bestTier": "Uber",
			"bestName": "Sneasler",
			"mega": null,
			"gmax": null
		},
		"904": {
			"name": "Overqwil",
			"tier": "NU",
			"bestTier": "NU",
			"bestName": "Overqwil",
			"mega": null,
			"gmax": null
		},
		"905": {
			"name": "Enamorus",
			"tier": "OU",
			"bestTier": "OU",
			"bestName": "Enamorus",
			"mega": null,
			"gmax": null
		},
		"906": {
			"name": "Sprigatito",
			"tier": "LC",
			"bestTier": "UUBL",
			"bestName": "Meowscarada",
			"mega": null,
			"gmax": null
		},
		"907": {
			"name": "Floragato",
			"tier": "NFE",
			"bestTier": "UUBL",
			"bestName": "Meowscarada",
			"mega": null,
			"gmax": null
		},
		"908": {
			"name": "Meowscarada",
			"tier": "UUBL",
			"bestTier": "UUBL",
			"bestName": "Meowscarada",
			"mega": null,
			"gmax": null
		},
		"909": {
			"name": "Fuecoco",
			"tier": "LC",
			"bestTier": "UU",
			"bestName": "Skeledirge",
			"mega": null,
			"gmax": null
		},
		"910": {
			"name": "Crocalor",
			"tier": "NFE",
			"bestTier": "UU",
			"bestName": "Skeledirge",
			"mega": null,
			"gmax": null
		},
		"911": {
			"name": "Skeledirge",
			"tier": "UU",
			"bestTier": "UU",
			"bestName": "Skeledirge",
			"mega": null,
			"gmax": null
		},
		"912": {
			"name": "Quaxly",
			"tier": "LC",
			"bestTier": "UUBL",
			"bestName": "Quaquaval",
			"mega": null,
			"gmax": null
		},
		"913": {
			"name": "Quaxwell",
			"tier": "NFE",
			"bestTier": "UUBL",
			"bestName": "Quaquaval",
			"mega": null,
			"gmax": null
		},
		"914": {
			"name": "Quaquaval",
			"tier": "UUBL",
			"bestTier": "UUBL",
			"bestName": "Quaquaval",
			"mega": null,
			"gmax": null
		},
		"915": {
			"name": "Lechonk",
			"tier": "LC",
			"bestTier": "ZU",
			"bestName": "Oinkologne-F",
			"mega": null,
			"gmax": null
		},
		"916": {
			"name": "Oinkologne",
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Oinkologne",
			"mega": null,
			"gmax": null
		},
		"917": {
			"name": "Tarountula",
			"tier": "LC",
			"bestTier": "ZU",
			"bestName": "Spidops",
			"mega": null,
			"gmax": null
		},
		"918": {
			"name": "Spidops",
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Spidops",
			"mega": null,
			"gmax": null
		},
		"919": {
			"name": "Nymble",
			"tier": "LC",
			"bestTier": "UU",
			"bestName": "Lokix",
			"mega": null,
			"gmax": null
		},
		"920": {
			"name": "Lokix",
			"tier": "UU",
			"bestTier": "UU",
			"bestName": "Lokix",
			"mega": null,
			"gmax": null
		},
		"921": {
			"name": "Pawmi",
			"tier": "LC",
			"bestTier": "PU",
			"bestName": "Pawmot",
			"mega": null,
			"gmax": null
		},
		"922": {
			"name": "Pawmo",
			"tier": "NFE",
			"bestTier": "PU",
			"bestName": "Pawmot",
			"mega": null,
			"gmax": null
		},
		"923": {
			"name": "Pawmot",
			"tier": "PU",
			"bestTier": "PU",
			"bestName": "Pawmot",
			"mega": null,
			"gmax": null
		},
		"924": {
			"name": "Tandemaus",
			"tier": "LC",
			"bestTier": "RU",
			"bestName": "Maushold-Four",
			"mega": null,
			"gmax": null
		},
		"925": {
			"name": "Maushold",
			"tier": "RU",
			"bestTier": "RU",
			"bestName": "Maushold",
			"mega": null,
			"gmax": null
		},
		"926": {
			"name": "Fidough",
			"tier": "LC",
			"bestTier": "ZU",
			"bestName": "Dachsbun",
			"mega": null,
			"gmax": null
		},
		"927": {
			"name": "Dachsbun",
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Dachsbun",
			"mega": null,
			"gmax": null
		},
		"928": {
			"name": "Smoliv",
			"tier": "LC",
			"bestTier": "ZU",
			"bestName": "Arboliva",
			"mega": null,
			"gmax": null
		},
		"929": {
			"name": "Dolliv",
			"tier": "NFE",
			"bestTier": "ZU",
			"bestName": "Arboliva",
			"mega": null,
			"gmax": null
		},
		"930": {
			"name": "Arboliva",
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Arboliva",
			"mega": null,
			"gmax": null
		},
		"931": {
			"name": "Squawkabilly",
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Squawkabilly",
			"mega": null,
			"gmax": null
		},
		"932": {
			"name": "Nacli",
			"tier": "LC",
			"bestTier": "OU",
			"bestName": "Garganacl",
			"mega": null,
			"gmax": null
		},
		"933": {
			"name": "Naclstack",
			"tier": "NFE",
			"bestTier": "OU",
			"bestName": "Garganacl",
			"mega": null,
			"gmax": null
		},
		"934": {
			"name": "Garganacl",
			"tier": "OU",
			"bestTier": "OU",
			"bestName": "Garganacl",
			"mega": null,
			"gmax": null
		},
		"935": {
			"name": "Charcadet",
			"tier": "LC",
			"bestTier": "OU",
			"bestName": "Ceruledge",
			"mega": null,
			"gmax": null
		},
		"936": {
			"name": "Armarouge",
			"tier": "RU",
			"bestTier": "RU",
			"bestName": "Armarouge",
			"mega": null,
			"gmax": null
		},
		"937": {
			"name": "Ceruledge",
			"tier": "OU",
			"bestTier": "OU",
			"bestName": "Ceruledge",
			"mega": null,
			"gmax": null
		},
		"938": {
			"name": "Tadbulb",
			"tier": "LC",
			"bestTier": "NU",
			"bestName": "Bellibolt",
			"mega": null,
			"gmax": null
		},
		"939": {
			"name": "Bellibolt",
			"tier": "NU",
			"bestTier": "NU",
			"bestName": "Bellibolt",
			"mega": null,
			"gmax": null
		},
		"940": {
			"name": "Wattrel",
			"tier": "LC",
			"bestTier": "NU",
			"bestName": "Kilowattrel",
			"mega": null,
			"gmax": null
		},
		"941": {
			"name": "Kilowattrel",
			"tier": "NU",
			"bestTier": "NU",
			"bestName": "Kilowattrel",
			"mega": null,
			"gmax": null
		},
		"942": {
			"name": "Maschiff",
			"tier": "LC",
			"bestTier": "ZU",
			"bestName": "Mabosstiff",
			"mega": null,
			"gmax": null
		},
		"943": {
			"name": "Mabosstiff",
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Mabosstiff",
			"mega": null,
			"gmax": null
		},
		"944": {
			"name": "Shroodle",
			"tier": "LC",
			"bestTier": "PU",
			"bestName": "Grafaiai",
			"mega": null,
			"gmax": null
		},
		"945": {
			"name": "Grafaiai",
			"tier": "PU",
			"bestTier": "PU",
			"bestName": "Grafaiai",
			"mega": null,
			"gmax": null
		},
		"946": {
			"name": "Bramblin",
			"tier": "LC",
			"bestTier": "NU",
			"bestName": "Brambleghast",
			"mega": null,
			"gmax": null
		},
		"947": {
			"name": "Brambleghast",
			"tier": "NU",
			"bestTier": "NU",
			"bestName": "Brambleghast",
			"mega": null,
			"gmax": null
		},
		"948": {
			"name": "Toedscool",
			"tier": "LC",
			"bestTier": "ZU",
			"bestName": "Toedscruel",
			"mega": null,
			"gmax": null
		},
		"949": {
			"name": "Toedscruel",
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Toedscruel",
			"mega": null,
			"gmax": null
		},
		"950": {
			"name": "Klawf",
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Klawf",
			"mega": null,
			"gmax": null
		},
		"951": {
			"name": "Capsakid",
			"tier": "LC",
			"bestTier": "ZU",
			"bestName": "Scovillain",
			"mega": null,
			"gmax": null
		},
		"952": {
			"name": "Scovillain",
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Scovillain",
			"mega": null,
			"gmax": null
		},
		"953": {
			"name": "Rellor",
			"tier": "LC",
			"bestTier": "ZU",
			"bestName": "Rabsca",
			"mega": null,
			"gmax": null
		},
		"954": {
			"name": "Rabsca",
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Rabsca",
			"mega": null,
			"gmax": null
		},
		"955": {
			"name": "Flittle",
			"tier": "NFE",
			"bestTier": "Uber",
			"bestName": "Espathra",
			"mega": null,
			"gmax": null
		},
		"956": {
			"name": "Espathra",
			"tier": "Uber",
			"bestTier": "Uber",
			"bestName": "Espathra",
			"mega": null,
			"gmax": null
		},
		"957": {
			"name": "Tinkatink",
			"tier": "LC",
			"bestTier": "UU",
			"bestName": "Tinkaton",
			"mega": null,
			"gmax": null
		},
		"958": {
			"name": "Tinkatuff",
			"tier": "NFE",
			"bestTier": "UU",
			"bestName": "Tinkaton",
			"mega": null,
			"gmax": null
		},
		"959": {
			"name": "Tinkaton",
			"tier": "UU",
			"bestTier": "UU",
			"bestName": "Tinkaton",
			"mega": null,
			"gmax": null
		},
		"960": {
			"name": "Wiglett",
			"tier": "LC",
			"bestTier": "ZU",
			"bestName": "Wugtrio",
			"mega": null,
			"gmax": null
		},
		"961": {
			"name": "Wugtrio",
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Wugtrio",
			"mega": null,
			"gmax": null
		},
		"962": {
			"name": "Bombirdier",
			"tier": "PU",
			"bestTier": "PU",
			"bestName": "Bombirdier",
			"mega": null,
			"gmax": null
		},
		"963": {
			"name": "Finizen",
			"tier": "LC",
			"bestTier": "Uber",
			"bestName": "Palafin",
			"mega": null,
			"gmax": null
		},
		"964": {
			"name": "Palafin",
			"tier": "Uber",
			"bestTier": "Uber",
			"bestName": "Palafin",
			"mega": null,
			"gmax": null
		},
		"965": {
			"name": "Varoom",
			"tier": "LC",
			"bestTier": "UU",
			"bestName": "Revavroom",
			"mega": null,
			"gmax": null
		},
		"966": {
			"name": "Revavroom",
			"tier": "UU",
			"bestTier": "UU",
			"bestName": "Revavroom",
			"mega": null,
			"gmax": null
		},
		"967": {
			"name": "Cyclizar",
			"tier": "RU",
			"bestTier": "RU",
			"bestName": "Cyclizar",
			"mega": null,
			"gmax": null
		},
		"968": {
			"name": "Orthworm",
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Orthworm",
			"mega": null,
			"gmax": null
		},
		"969": {
			"name": "Glimmet",
			"tier": "LC",
			"bestTier": "OU",
			"bestName": "Glimmora",
			"mega": null,
			"gmax": null
		},
		"970": {
			"name": "Glimmora",
			"tier": "OU",
			"bestTier": "OU",
			"bestName": "Glimmora",
			"mega": null,
			"gmax": null
		},
		"971": {
			"name": "Greavard",
			"tier": "LC",
			"bestTier": "PU",
			"bestName": "Houndstone",
			"mega": null,
			"gmax": null
		},
		"972": {
			"name": "Houndstone",
			"tier": "PU",
			"bestTier": "PU",
			"bestName": "Houndstone",
			"mega": null,
			"gmax": null
		},
		"973": {
			"name": "Flamigo",
			"tier": "NU",
			"bestTier": "NU",
			"bestName": "Flamigo",
			"mega": null,
			"gmax": null
		},
		"974": {
			"name": "Cetoddle",
			"tier": "LC",
			"bestTier": "NUBL",
			"bestName": "Cetitan",
			"mega": null,
			"gmax": null
		},
		"975": {
			"name": "Cetitan",
			"tier": "NUBL",
			"bestTier": "NUBL",
			"bestName": "Cetitan",
			"mega": null,
			"gmax": null
		},
		"976": {
			"name": "Veluza",
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Veluza",
			"mega": null,
			"gmax": null
		},
		"977": {
			"name": "Dondozo",
			"tier": "OU",
			"bestTier": "OU",
			"bestName": "Dondozo",
			"mega": null,
			"gmax": null
		},
		"978": {
			"name": "Tatsugiri",
			"tier": "PU",
			"bestTier": "PU",
			"bestName": "Tatsugiri",
			"mega": null,
			"gmax": null
		},
		"979": {
			"name": "Annihilape",
			"tier": "Uber",
			"bestTier": "Uber",
			"bestName": "Annihilape",
			"mega": null,
			"gmax": null
		},
		"980": {
			"name": "Clodsire",
			"tier": "UU",
			"bestTier": "UU",
			"bestName": "Clodsire",
			"mega": null,
			"gmax": null
		},
		"981": {
			"name": "Farigiraf",
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Farigiraf",
			"mega": null,
			"gmax": null
		},
		"982": {
			"name": "Dudunsparce",
			"tier": "PU",
			"bestTier": "PU",
			"bestName": "Dudunsparce",
			"mega": null,
			"gmax": null
		},
		"983": {
			"name": "Kingambit",
			"tier": "OU",
			"bestTier": "OU",
			"bestName": "Kingambit",
			"mega": null,
			"gmax": null
		},
		"984": {
			"name": "Great Tusk",
			"tier": "OU",
			"bestTier": "OU",
			"bestName": "Great Tusk",
			"mega": null,
			"gmax": null
		},
		"985": {
			"name": "Scream Tail",
			"tier": "NU",
			"bestTier": "NU",
			"bestName": "Scream Tail",
			"mega": null,
			"gmax": null
		},
		"986": {
			"name": "Brute Bonnet",
			"tier": "PU",
			"bestTier": "PU",
			"bestName": "Brute Bonnet",
			"mega": null,
			"gmax": null
		},
		"987": {
			"name": "Flutter Mane",
			"tier": "Uber",
			"bestTier": "Uber",
			"bestName": "Flutter Mane",
			"mega": null,
			"gmax": null
		},
		"988": {
			"name": "Slither Wing",
			"tier": "UU",
			"bestTier": "UU",
			"bestName": "Slither Wing",
			"mega": null,
			"gmax": null
		},
		"989": {
			"name": "Sandy Shocks",
			"tier": "UU",
			"bestTier": "UU",
			"bestName": "Sandy Shocks",
			"mega": null,
			"gmax": null
		},
		"990": {
			"name": "Iron Treads",
			"tier": "OU",
			"bestTier": "OU",
			"bestName": "Iron Treads",
			"mega": null,
			"gmax": null
		},
		"991": {
			"name": "Iron Bundle",
			"tier": "Uber",
			"bestTier": "Uber",
			"bestName": "Iron Bundle",
			"mega": null,
			"gmax": null
		},
		"992": {
			"name": "Iron Hands",
			"tier": "UUBL",
			"bestTier": "UUBL",
			"bestName": "Iron Hands",
			"mega": null,
			"gmax": null
		},
		"993": {
			"name": "Iron Jugulis",
			"tier": "UU",
			"bestTier": "UU",
			"bestName": "Iron Jugulis",
			"mega": null,
			"gmax": null
		},
		"994": {
			"name": "Iron Moth",
			"tier": "OU",
			"bestTier": "OU",
			"bestName": "Iron Moth",
			"mega": null,
			"gmax": null
		},
		"995": {
			"name": "Iron Thorns",
			"tier": "NUBL",
			"bestTier": "NUBL",
			"bestName": "Iron Thorns",
			"mega": null,
			"gmax": null
		},
		"996": {
			"name": "Frigibax",
			"tier": "LC",
			"bestTier": "Uber",
			"bestName": "Baxcalibur",
			"mega": null,
			"gmax": null
		},
		"997": {
			"name": "Arctibax",
			"tier": "NFE",
			"bestTier": "Uber",
			"bestName": "Baxcalibur",
			"mega": null,
			"gmax": null
		},
		"998": {
			"name": "Baxcalibur",
			"tier": "Uber",
			"bestTier": "Uber",
			"bestName": "Baxcalibur",
			"mega": null,
			"gmax": null
		},
		"999": {
			"name": "Gimmighoul",
			"tier": "LC",
			"bestTier": "OU",
			"bestName": "Gholdengo",
			"mega": null,
			"gmax": null
		},
		"1000": {
			"name": "Gholdengo",
			"tier": "OU",
			"bestTier": "OU",
			"bestName": "Gholdengo",
			"mega": null,
			"gmax": null
		},
		"1001": {
			"name": "Wo-Chien",
			"tier": "PU",
			"bestTier": "PU",
			"bestName": "Wo-Chien",
			"mega": null,
			"gmax": null
		},
		"1002": {
			"name": "Chien-Pao",
			"tier": "Uber",
			"bestTier": "Uber",
			"bestName": "Chien-Pao",
			"mega": null,
			"gmax": null
		},
		"1003": {
			"name": "Ting-Lu",
			"tier": "OU",
			"bestTier": "OU",
			"bestName": "Ting-Lu",
			"mega": null,
			"gmax": null
		},
		"1004": {
			"name": "Chi-Yu",
			"tier": "Uber",
			"bestTier": "Uber",
			"bestName": "Chi-Yu",
			"mega": null,
			"gmax": null
		},
		"1005": {
			"name": "Roaring Moon",
			"tier": "Uber",
			"bestTier": "Uber",
			"bestName": "Roaring Moon",
			"mega": null,
			"gmax": null
		},
		"1006": {
			"name": "Iron Valiant",
			"tier": "OU",
			"bestTier": "OU",
			"bestName": "Iron Valiant",
			"mega": null,
			"gmax": null
		},
		"1007": {
			"name": "Koraidon",
			"tier": "Uber",
			"bestTier": "Uber",
			"bestName": "Koraidon",
			"mega": null,
			"gmax": null
		},
		"1008": {
			"name": "Miraidon",
			"tier": "AG",
			"bestTier": "AG",
			"bestName": "Miraidon",
			"mega": null,
			"gmax": null
		},
		"1009": {
			"name": "Walking Wake",
			"tier": "OU",
			"bestTier": "OU",
			"bestName": "Walking Wake",
			"mega": null,
			"gmax": null
		},
		"1010": {
			"name": "Iron Leaves",
			"tier": "RUBL",
			"bestTier": "RUBL",
			"bestName": "Iron Leaves",
			"mega": null,
			"gmax": null
		},
		"1011": {
			"name": "Dipplin",
			"tier": "ZU",
			"bestTier": "UU",
			"bestName": "Hydrapple",
			"mega": null,
			"gmax": null
		},
		"1012": {
			"name": "Poltchageist",
			"tier": "LC",
			"bestTier": "UU",
			"bestName": "Sinistcha",
			"mega": null,
			"gmax": null
		},
		"1013": {
			"name": "Sinistcha",
			"tier": "UU",
			"bestTier": "UU",
			"bestName": "Sinistcha",
			"mega": null,
			"gmax": null
		},
		"1014": {
			"name": "Okidogi",
			"tier": "UUBL",
			"bestTier": "UUBL",
			"bestName": "Okidogi",
			"mega": null,
			"gmax": null
		},
		"1015": {
			"name": "Munkidori",
			"tier": "NU",
			"bestTier": "NU",
			"bestName": "Munkidori",
			"mega": null,
			"gmax": null
		},
		"1016": {
			"name": "Fezandipiti",
			"tier": "UU",
			"bestTier": "UU",
			"bestName": "Fezandipiti",
			"mega": null,
			"gmax": null
		},
		"1017": {
			"name": "Ogerpon",
			"tier": "RUBL",
			"bestTier": "RUBL",
			"bestName": "Ogerpon",
			"mega": null,
			"gmax": null
		},
		"1018": {
			"name": "Archaludon",
			"tier": "Uber",
			"bestTier": "Uber",
			"bestName": "Archaludon",
			"mega": null,
			"gmax": null
		},
		"1019": {
			"name": "Hydrapple",
			"tier": "UU",
			"bestTier": "UU",
			"bestName": "Hydrapple",
			"mega": null,
			"gmax": null
		},
		"1020": {
			"name": "Gouging Fire",
			"tier": "Uber",
			"bestTier": "Uber",
			"bestName": "Gouging Fire",
			"mega": null,
			"gmax": null
		},
		"1021": {
			"name": "Raging Bolt",
			"tier": "OU",
			"bestTier": "OU",
			"bestName": "Raging Bolt",
			"mega": null,
			"gmax": null
		},
		"1022": {
			"name": "Iron Boulder",
			"tier": "UUBL",
			"bestTier": "UUBL",
			"bestName": "Iron Boulder",
			"mega": null,
			"gmax": null
		},
		"1023": {
			"name": "Iron Crown",
			"tier": "OU",
			"bestTier": "OU",
			"bestName": "Iron Crown",
			"mega": null,
			"gmax": null
		},
		"1024": {
			"name": "Terapagos",
			"tier": "Uber",
			"bestTier": "Uber",
			"bestName": "Terapagos",
			"mega": null,
			"gmax": null
		},
		"1025": {
			"name": "Pecharunt",
			"tier": "OU",
			"bestTier": "OU",
			"bestName": "Pecharunt",
			"mega": null,
			"gmax": null
		},
		"19:alola": {
			"name": "Rattata-Alola",
			"tier": "LC",
			"bestTier": "ZUBL",
			"bestName": "Raticate-Alola",
			"mega": null,
			"gmax": null
		},
		"20:alola": {
			"name": "Raticate-Alola",
			"tier": "ZUBL",
			"bestTier": "ZUBL",
			"bestName": "Raticate-Alola",
			"mega": null,
			"gmax": null
		},
		"25:alola": {
			"name": "Pikachu-Alola",
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
			"name": "Raichu-Alola",
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Raichu-Alola",
			"mega": null,
			"gmax": null
		},
		"27:alola": {
			"name": "Sandshrew-Alola",
			"tier": "LC",
			"bestTier": "PU",
			"bestName": "Sandslash-Alola",
			"mega": null,
			"gmax": null
		},
		"28:alola": {
			"name": "Sandslash-Alola",
			"tier": "PU",
			"bestTier": "PU",
			"bestName": "Sandslash-Alola",
			"mega": null,
			"gmax": null
		},
		"37:alola": {
			"name": "Vulpix-Alola",
			"tier": "NFE",
			"bestTier": "NU",
			"bestName": "Ninetales-Alola",
			"mega": null,
			"gmax": null
		},
		"38:alola": {
			"name": "Ninetales-Alola",
			"tier": "NU",
			"bestTier": "NU",
			"bestName": "Ninetales-Alola",
			"mega": null,
			"gmax": null
		},
		"50:alola": {
			"name": "Diglett-Alola",
			"tier": "LC",
			"bestTier": "ZU",
			"bestName": "Dugtrio-Alola",
			"mega": null,
			"gmax": null
		},
		"51:alola": {
			"name": "Dugtrio-Alola",
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Dugtrio-Alola",
			"mega": null,
			"gmax": null
		},
		"52:alola": {
			"name": "Meowth-Alola",
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
			"name": "Meowth-Galar",
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
			"name": "Persian-Alola",
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Persian-Alola",
			"mega": null,
			"gmax": null
		},
		"58:hisui": {
			"name": "Growlithe-Hisui",
			"tier": "LC",
			"bestTier": "UU",
			"bestName": "Arcanine-Hisui",
			"mega": null,
			"gmax": null
		},
		"59:hisui": {
			"name": "Arcanine-Hisui",
			"tier": "UU",
			"bestTier": "UU",
			"bestName": "Arcanine-Hisui",
			"mega": null,
			"gmax": null
		},
		"74:alola": {
			"name": "Geodude-Alola",
			"tier": "LC",
			"bestTier": "ZU",
			"bestName": "Golem-Alola",
			"mega": null,
			"gmax": null
		},
		"75:alola": {
			"name": "Graveler-Alola",
			"tier": "NFE",
			"bestTier": "ZU",
			"bestName": "Golem-Alola",
			"mega": null,
			"gmax": null
		},
		"76:alola": {
			"name": "Golem-Alola",
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Golem-Alola",
			"mega": null,
			"gmax": null
		},
		"77:galar": {
			"name": "Ponyta-Galar",
			"tier": "LC",
			"bestTier": "ZU",
			"bestName": "Rapidash-Galar",
			"mega": null,
			"gmax": null
		},
		"78:galar": {
			"name": "Rapidash-Galar",
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Rapidash-Galar",
			"mega": null,
			"gmax": null
		},
		"79:galar": {
			"name": "Slowpoke-Galar",
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
			"name": "Slowbro-Galar",
			"tier": "PU",
			"bestTier": "PU",
			"bestName": "Slowbro-Galar",
			"mega": {
				"tier": "RUBL",
				"name": "Slowbro-Mega"
			},
			"gmax": null
		},
		"83:galar": {
			"name": "Farfetch’d-Galar",
			"tier": "LC",
			"bestTier": "NUBL",
			"bestName": "Sirfetch’d",
			"mega": null,
			"gmax": null
		},
		"88:alola": {
			"name": "Grimer-Alola",
			"tier": "LC",
			"bestTier": "RU",
			"bestName": "Muk-Alola",
			"mega": null,
			"gmax": null
		},
		"89:alola": {
			"name": "Muk-Alola",
			"tier": "RU",
			"bestTier": "RU",
			"bestName": "Muk-Alola",
			"mega": null,
			"gmax": null
		},
		"100:hisui": {
			"name": "Voltorb-Hisui",
			"tier": "NFE",
			"bestTier": "ZUBL",
			"bestName": "Electrode-Hisui",
			"mega": null,
			"gmax": null
		},
		"101:hisui": {
			"name": "Electrode-Hisui",
			"tier": "ZUBL",
			"bestTier": "ZUBL",
			"bestName": "Electrode-Hisui",
			"mega": null,
			"gmax": null
		},
		"103:alola": {
			"name": "Exeggutor-Alola",
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Exeggutor-Alola",
			"mega": null,
			"gmax": null
		},
		"105:alola": {
			"name": "Marowak-Alola",
			"tier": "RU",
			"bestTier": "RU",
			"bestName": "Marowak-Alola",
			"mega": null,
			"gmax": null
		},
		"110:galar": {
			"name": "Weezing-Galar",
			"tier": "OU",
			"bestTier": "OU",
			"bestName": "Weezing-Galar",
			"mega": null,
			"gmax": null
		},
		"122:galar": {
			"name": "Mr. Mime-Galar",
			"tier": "NFE",
			"bestTier": "ZU",
			"bestName": "Mr. Rime",
			"mega": null,
			"gmax": null
		},
		"128:paldea": {
			"name": "Tauros-Paldea-Aqua",
			"tier": "NU",
			"bestTier": "NU",
			"bestName": "Tauros-Paldea-Aqua",
			"mega": null,
			"gmax": null
		},
		"144:galar": {
			"name": "Articuno-Galar",
			"tier": "PU",
			"bestTier": "PU",
			"bestName": "Articuno-Galar",
			"mega": null,
			"gmax": null
		},
		"145:galar": {
			"name": "Zapdos-Galar",
			"tier": "RU",
			"bestTier": "RU",
			"bestName": "Zapdos-Galar",
			"mega": null,
			"gmax": null
		},
		"146:galar": {
			"name": "Moltres-Galar",
			"tier": "UUBL",
			"bestTier": "UUBL",
			"bestName": "Moltres-Galar",
			"mega": null,
			"gmax": null
		},
		"157:hisui": {
			"name": "Typhlosion-Hisui",
			"tier": "PU",
			"bestTier": "PU",
			"bestName": "Typhlosion-Hisui",
			"mega": null,
			"gmax": null
		},
		"194:paldea": {
			"name": "Wooper-Paldea",
			"tier": "LC",
			"bestTier": "UU",
			"bestName": "Clodsire",
			"mega": null,
			"gmax": null
		},
		"199:galar": {
			"name": "Slowking-Galar",
			"tier": "OU",
			"bestTier": "OU",
			"bestName": "Slowking-Galar",
			"mega": null,
			"gmax": null
		},
		"211:hisui": {
			"name": "Qwilfish-Hisui",
			"tier": "PU",
			"bestTier": "NU",
			"bestName": "Overqwil",
			"mega": null,
			"gmax": null
		},
		"215:hisui": {
			"name": "Sneasel-Hisui",
			"tier": "ZU",
			"bestTier": "Uber",
			"bestName": "Sneasler",
			"mega": null,
			"gmax": null
		},
		"222:galar": {
			"name": "Corsola-Galar",
			"tier": "NFE",
			"bestTier": "ZU",
			"bestName": "Cursola",
			"mega": null,
			"gmax": null
		},
		"263:galar": {
			"name": "Zigzagoon-Galar",
			"tier": "LC",
			"bestTier": "RUBL",
			"bestName": "Obstagoon",
			"mega": null,
			"gmax": null
		},
		"264:galar": {
			"name": "Linoone-Galar",
			"tier": "NFE",
			"bestTier": "RUBL",
			"bestName": "Obstagoon",
			"mega": null,
			"gmax": null
		},
		"503:hisui": {
			"name": "Samurott-Hisui",
			"tier": "OU",
			"bestTier": "OU",
			"bestName": "Samurott-Hisui",
			"mega": null,
			"gmax": null
		},
		"549:hisui": {
			"name": "Lilligant-Hisui",
			"tier": "NUBL",
			"bestTier": "NUBL",
			"bestName": "Lilligant-Hisui",
			"mega": null,
			"gmax": null
		},
		"554:galar": {
			"name": "Darumaka-Galar",
			"tier": "LC",
			"bestTier": "Uber",
			"bestName": "Darmanitan-Galar",
			"mega": null,
			"gmax": null
		},
		"555:galar": {
			"name": "Darmanitan-Galar",
			"tier": "Uber",
			"bestTier": "Uber",
			"bestName": "Darmanitan-Galar",
			"mega": null,
			"gmax": null
		},
		"562:galar": {
			"name": "Yamask-Galar",
			"tier": "LC",
			"bestTier": "ZU",
			"bestName": "Runerigus",
			"mega": null,
			"gmax": null
		},
		"570:hisui": {
			"name": "Zorua-Hisui",
			"tier": "LC",
			"bestTier": "RUBL",
			"bestName": "Zoroark-Hisui",
			"mega": null,
			"gmax": null
		},
		"571:hisui": {
			"name": "Zoroark-Hisui",
			"tier": "RUBL",
			"bestTier": "RUBL",
			"bestName": "Zoroark-Hisui",
			"mega": null,
			"gmax": null
		},
		"618:galar": {
			"name": "Stunfisk-Galar",
			"tier": "ZU",
			"bestTier": "ZU",
			"bestName": "Stunfisk-Galar",
			"mega": null,
			"gmax": null
		},
		"628:hisui": {
			"name": "Braviary-Hisui",
			"tier": "PU",
			"bestTier": "PU",
			"bestName": "Braviary-Hisui",
			"mega": null,
			"gmax": null
		},
		"705:hisui": {
			"name": "Sliggoo-Hisui",
			"tier": "NFE",
			"bestTier": "RU",
			"bestName": "Goodra-Hisui",
			"mega": null,
			"gmax": null
		},
		"706:hisui": {
			"name": "Goodra-Hisui",
			"tier": "RU",
			"bestTier": "RU",
			"bestName": "Goodra-Hisui",
			"mega": null,
			"gmax": null
		},
		"713:hisui": {
			"name": "Avalugg-Hisui",
			"tier": "PU",
			"bestTier": "PU",
			"bestName": "Avalugg-Hisui",
			"mega": null,
			"gmax": null
		},
		"724:hisui": {
			"name": "Decidueye-Hisui",
			"tier": "PU",
			"bestTier": "PU",
			"bestName": "Decidueye-Hisui",
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
	var TYPE_NAMES = {
		0: "Normal",
		1: "Lutador",
		2: "Voador",
		3: "Venenoso",
		4: "Terrestre",
		5: "Pedra",
		6: "Inseto",
		7: "Fantasma",
		8: "Aço",
		9: "Fogo",
		10: "Água",
		11: "Planta",
		12: "Elétrico",
		13: "Psíquico",
		14: "Gelo",
		15: "Dragão",
		16: "Sombrio",
		17: "Fada"
	};
	var ALL_TYPES = Object.keys(TYPE_NAMES).map(Number);
	function typeNameOf(type) {
		return TYPE_NAMES[type] ?? null;
	}
	function missingTypes(team) {
		if (team.length === 0) return [];
		const present = new Set(team.flatMap((member) => member.types));
		return ALL_TYPES.filter((type) => !present.has(type));
	}
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
	var TOGGLE_OFFSET = 34;
	var PANEL_OFFSET = 44;
	var TAB_LABELS = {
		field: "Em campo",
		party: "Meu time",
		biome: "Bioma",
		destinations: "Para onde"
	};
	var POOL_LABELS = {
		BOSS: "Chefe",
		ULTRA_RARE: "Ultra raro",
		SUPER_RARE: "Super raro",
		RARE: "Raro",
		UNCOMMON: "Incomum",
		COMMON: "Comum"
	};
	var SOURCE_NOTE = {
		line: "",
		mega: "mega",
		gmax: "gmax"
	};
	var css = `
.ptr-root{position:fixed;inset:0;pointer-events:none;z-index:2147483000;font:500 12px/1.45 ui-sans-serif,system-ui,sans-serif;color:#e8e8ea}
.ptr-toggle{position:absolute;pointer-events:auto;display:flex;align-items:center;gap:6px;padding:5px 10px;border-radius:999px;
  background:rgba(18,18,22,.82);border:1px solid rgba(255,255,255,.14);cursor:pointer;user-select:none;
  backdrop-filter:blur(6px);transition:background .15s}
.ptr-toggle:hover{background:rgba(30,30,38,.94)}
.ptr-dot{width:7px;height:7px;border-radius:50%;background:#22c55e}
.ptr-panel{position:absolute;pointer-events:auto;width:310px;max-height:min(70vh,520px);display:flex;flex-direction:column;
  background:rgba(16,16,20,.95);border:1px solid rgba(255,255,255,.14);border-radius:10px;overflow:hidden;
  box-shadow:0 12px 34px rgba(0,0,0,.5);backdrop-filter:blur(10px)}
.ptr-tabs{display:flex;border-bottom:1px solid rgba(255,255,255,.1)}
.ptr-tab{flex:1;padding:8px 6px;text-align:center;cursor:pointer;color:#9b9ba4;border-bottom:2px solid transparent}
.ptr-tab[data-on="1"]{color:#fff;border-bottom-color:#6366f1;background:rgba(99,102,241,.1)}
.ptr-body{overflow-y:auto;padding:8px}
.ptr-row{display:flex;align-items:center;gap:8px;padding:5px 6px;border-radius:6px}
.ptr-row:nth-child(odd){background:rgba(255,255,255,.035)}
.ptr-name{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.ptr-lvl{color:#8b8b94;font-size:11px}
.ptr-tier{padding:1px 7px;border-radius:4px;font-weight:700;font-size:11px;letter-spacing:.02em}
.ptr-via{color:#a5a5ae;font-size:11px;max-width:120px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.ptr-facts{padding:1px 8px 5px;color:#8b8b94;font-size:11px}
.ptr-group{margin:6px 2px 3px;color:#8b8b94;font-size:11px;text-transform:uppercase;letter-spacing:.06em}
.ptr-empty{padding:16px 8px;text-align:center;color:#8b8b94}
.ptr-row{cursor:pointer}
.ptr-row:hover{background:rgba(99,102,241,.14)}
.ptr-moves{display:flex;flex-wrap:wrap;gap:4px;padding:2px 8px 8px}
.ptr-move{padding:2px 7px;border-radius:4px;background:rgba(255,255,255,.09);font-size:11px;color:#d7d7dd}
.ptr-moves-empty{padding:2px 8px 8px;font-size:11px;color:#8b8b94}
`;
	function tierChip(tier) {
		const chip = document.createElement("span");
		chip.className = "ptr-tier";
		chip.textContent = tier ?? "?";
		chip.style.background = backgroundFor(tier);
		return chip;
	}
	function movesElement(row) {
		if (!row.moves.length) {
			const empty = document.createElement("div");
			empty.className = "ptr-moves-empty";
			empty.textContent = "Sem golpes catalogados pelo Smogon";
			return empty;
		}
		const list = document.createElement("div");
		list.className = "ptr-moves";
		for (const move of row.moves) {
			const chip = document.createElement("span");
			chip.className = "ptr-move";
			chip.textContent = move;
			list.append(chip);
		}
		return list;
	}
	function rowElement(row) {
		const element = document.createElement("div");
		element.className = "ptr-row";
		const name = document.createElement("span");
		name.className = "ptr-name";
		name.textContent = row.name;
		element.append(name);
		if (row.level !== null) {
			const level = document.createElement("span");
			level.className = "ptr-lvl";
			level.textContent = `Nv.${row.level}`;
			element.append(level);
		}
		const note = SOURCE_NOTE[row.source];
		const via = row.reachName && row.reachName !== row.name ? row.reachName : note;
		if (via) {
			const detail = document.createElement("span");
			detail.className = "ptr-via";
			detail.textContent = note ? `${via} (${note})` : via;
			element.append(detail);
		}
		element.append(tierChip(row.reachTier));
		return element;
	}
	function factsElement(row) {
		const facts = [];
		if (row.hiddenAbility) facts.push(`HA ${row.hiddenAbility}`);
		if (row.catchRate !== null) facts.push(`Captura ${row.catchRate}`);
		if (!facts.length) return null;
		const element = document.createElement("div");
		element.className = "ptr-facts";
		element.textContent = facts.join(" · ");
		return element;
	}
	function emptyElement(message) {
		const element = document.createElement("div");
		element.className = "ptr-empty";
		element.textContent = message;
		return element;
	}
	var Panel = class {
		host;
		root;
		toggle;
		panel;
		body;
		tabs = new Map();
		open = false;
		active = "field";
		expanded = null;
		content = {
			field: [],
			party: [],
			biome: null,
			destinations: [],
			missingTypes: []
		};
		constructor(host = document.body) {
			this.host = host;
			this.root = document.createElement("div");
			this.root.className = "ptr-root";
			const style = document.createElement("style");
			style.textContent = css;
			this.root.append(style);
			this.toggle = document.createElement("div");
			this.toggle.className = "ptr-toggle";
			this.toggle.append(Object.assign(document.createElement("span"), { className: "ptr-dot" }));
			this.toggle.append(Object.assign(document.createElement("span"), { textContent: "Tiers" }));
			this.toggle.addEventListener("click", () => this.setOpen(!this.open));
			this.panel = document.createElement("div");
			this.panel.className = "ptr-panel";
			this.panel.style.display = "none";
			const tabs = document.createElement("div");
			tabs.className = "ptr-tabs";
			for (const id of [
				"field",
				"party",
				"biome",
				"destinations"
			]) {
				const tab = document.createElement("div");
				tab.className = "ptr-tab";
				tab.textContent = TAB_LABELS[id];
				tab.addEventListener("click", () => this.select(id));
				this.tabs.set(id, tab);
				tabs.append(tab);
			}
			this.body = document.createElement("div");
			this.body.className = "ptr-body";
			this.panel.append(tabs, this.body);
			this.root.append(this.toggle, this.panel);
			this.host.append(this.root);
			this.select("field");
		}
		get isOpen() {
			return this.open;
		}
		placeAt(rect) {
			const canvasRight = rect.left + rect.width;
			const canvasBottom = rect.top + rect.height;
			const right = Math.max(window.innerWidth - canvasRight, 0) + 10;
			this.toggle.style.top = `${canvasBottom - TOGGLE_OFFSET}px`;
			this.toggle.style.right = `${right}px`;
			this.panel.style.bottom = `${window.innerHeight - canvasBottom + PANEL_OFFSET}px`;
			this.panel.style.right = `${right}px`;
			this.panel.style.maxHeight = `${Math.max(rect.height - PANEL_OFFSET - 20, 160)}px`;
		}
		update(content) {
			this.content = content;
			if (this.open) this.render();
		}
		destroy() {
			this.root.remove();
		}
		setOpen(open) {
			this.open = open;
			this.panel.style.display = open ? "flex" : "none";
			if (open) this.render();
		}
		select(id) {
			this.active = id;
			for (const [key, tab] of this.tabs) tab.dataset.on = key === id ? "1" : "0";
			if (this.open) this.render();
		}
		render() {
			this.body.replaceChildren();
			if (this.active === "biome") {
				this.renderBiome();
				return;
			}
			if (this.active === "destinations") {
				this.renderDestinations();
				return;
			}
			const rows = this.active === "field" ? this.content.field : this.content.party;
			if (!rows.length) {
				this.body.append(emptyElement(this.active === "field" ? "Nenhum inimigo em campo" : "Time vazio"));
				return;
			}
			for (const row of rows) this.body.append(...this.expandable(row));
			if (this.active === "party" && this.content.missingTypes.length) {
				const gap = document.createElement("div");
				gap.className = "ptr-group";
				gap.textContent = `Sem cobertura: ${this.content.missingTypes.join(", ")}`;
				this.body.append(gap);
			}
		}
		expandable(row) {
			const id = `${this.active}:${row.key}`;
			const element = rowElement(row);
			element.addEventListener("click", () => {
				this.expanded = this.expanded === id ? null : id;
				this.render();
			});
			if (this.expanded !== id) return [element];
			const facts = factsElement(row);
			return facts ? [
				element,
				facts,
				movesElement(row)
			] : [element, movesElement(row)];
		}
		renderBiome() {
			const biome = this.content.biome;
			if (!biome?.groups.length) {
				this.body.append(emptyElement("Bioma desconhecido"));
				return;
			}
			const title = document.createElement("div");
			title.className = "ptr-group";
			title.textContent = biome.name;
			this.body.append(title);
			for (const group of biome.groups) {
				const heading = document.createElement("div");
				heading.className = "ptr-group";
				heading.textContent = POOL_LABELS[group.tier];
				this.body.append(heading);
				for (const entry of group.entries) this.body.append(...this.expandable(entry));
			}
		}
		renderDestinations() {
			if (!this.content.destinations.length) {
				this.body.append(emptyElement("Nenhuma rota a partir daqui"));
				return;
			}
			for (const group of this.content.destinations) {
				const heading = document.createElement("div");
				heading.className = "ptr-group";
				heading.textContent = group.name;
				this.body.append(heading);
				if (!group.highlights.length) {
					this.body.append(emptyElement("Sem encontros catalogados"));
					continue;
				}
				for (const entry of group.highlights) this.body.append(...this.expandable(entry));
			}
		}
	};
	var POOL_TIER_ORDER = [
		"BOSS",
		"ULTRA_RARE",
		"SUPER_RARE",
		"RARE",
		"UNCOMMON",
		"COMMON"
	];
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
	function keyFor(speciesId, formKey) {
		return formKey ? `${speciesId}:${formKey}` : `${speciesId}`;
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
	var HIGHLIGHT_LIMIT = 6;
	function rowFor(name, speciesId, level, table, movesets) {
		const ref = speciesRefOf(speciesId, "");
		const resolved = resolveTiers(table, ref, null);
		const reach = bestReachable(resolved);
		const moves = movesets[keyFor(ref.speciesId, ref.formKey)] ?? movesets[keyFor(ref.speciesId, "")];
		return {
			key: `${speciesId}`,
			name,
			level,
			tier: resolved.tier,
			reachTier: reach.tier,
			reachName: reach.name,
			source: reach.source,
			moves: moves ?? [],
			hiddenAbility: null,
			catchRate: null
		};
	}
	function detailsOf(pokemon, abilityNames) {
		const species = pokemon.species;
		const hidden = species.abilityHidden;
		return {
			hiddenAbility: hidden ? abilityNames[hidden] ?? null : null,
			catchRate: species.catchRate ?? null
		};
	}
	var rowForPokemon = (pokemon, table, movesets, abilityNames) => ({
		...rowFor(pokemon.species.name, pokemon.species.speciesId, pokemon.level ?? null, table, movesets),
		...detailsOf(pokemon, abilityNames)
	});
	var byReach = (a, b) => compareTier(a.reachTier, b.reachTier);
	function fieldView(scene, table, movesets = {}, abilityNames = {}) {
		if (!scene.currentBattle) return [];
		return scene.getEnemyField().map((pokemon) => rowForPokemon(pokemon, table, movesets, abilityNames));
	}
	function partyView(scene, table, movesets = {}, abilityNames = {}) {
		return (scene.party ?? []).map((pokemon) => rowForPokemon(pokemon, table, movesets, abilityNames));
	}
	function coverageView(scene) {
		return missingTypes((scene.party ?? []).map((pokemon) => ({ types: [pokemon.species.type1, pokemon.species.type2].filter((type) => typeof type === "number") })));
	}
	function destinationsView(biomeId, biomes, table, movesets = {}) {
		const current = biomeId === null ? void 0 : biomes[biomeId];
		if (!current) return [];
		return current.links.flatMap((destination) => {
			const entry = biomes[destination];
			if (!entry) return [];
			const highlights = Object.values(entry.pools).flat().map((speciesId) => {
				const known = table[`${speciesId}`];
				return rowFor(known?.name ?? `#${speciesId}`, speciesId, null, table, movesets);
			}).sort(byReach).slice(0, HIGHLIGHT_LIMIT);
			return [{
				biome: destination,
				name: entry.name,
				highlights
			}];
		});
	}
	function biomeView(biomeId, biomes, table, movesets = {}) {
		const biome = biomes[biomeId];
		if (!biome) return [];
		const groups = [];
		for (const poolTier of POOL_TIER_ORDER) {
			const ids = biome.pools[poolTier];
			if (!ids?.length) continue;
			const entries = ids.map((speciesId) => {
				const known = table[`${speciesRefOf(speciesId, "").speciesId}`];
				return rowFor(known?.name ?? `#${speciesId}`, speciesId, null, table, movesets);
			}).sort(byReach);
			groups.push({
				tier: poolTier,
				entries
			});
		}
		return groups;
	}
	var Hud = class {
		tiers;
		biomes;
		movesets;
		biomeNames;
		abilityNames;
		panel = new Panel();
		constructor(tiers, biomes, movesets = {}, biomeNames = {}, abilityNames = {}) {
			this.tiers = tiers;
			this.biomes = biomes;
			this.movesets = movesets;
			this.biomeNames = biomeNames;
			this.abilityNames = abilityNames;
		}
		sync(scene) {
			this.place();
			if (!this.panel.isOpen) return;
			const biomeId = scene.arena?.biomeId;
			const biome = biomeId === void 0 ? null : this.biomes[biomeId];
			this.panel.update({
				field: fieldView(scene, this.tiers, this.movesets, this.abilityNames),
				party: partyView(scene, this.tiers, this.movesets, this.abilityNames),
				biome: biome ? {
					name: this.biomeNames[biomeId] ?? biome.name,
					groups: biomeView(biomeId, this.biomes, this.tiers, this.movesets)
				} : null,
				destinations: destinationsView(biomeId ?? null, this.biomes, this.tiers, this.movesets).map((group) => ({
					...group,
					name: this.biomeNames[group.biome] ?? group.name
				})),
				missingTypes: coverageView(scene).flatMap((type) => typeNameOf(type) ?? [])
			});
		}
		destroy() {
			this.panel.destroy();
		}
		place() {
			const canvas = document.querySelector("canvas");
			if (!canvas) return;
			const rect = canvas.getBoundingClientRect();
			this.panel.placeAt({
				top: rect.top,
				left: rect.left,
				width: rect.width,
				height: rect.height
			});
		}
	};
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
	function formKeyOf(species, formIndex) {
		return species.forms?.[formIndex]?.formKey ?? "";
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
	function startOverlay(game, table, biomes = {}, movesets = {}, biomeNames = {}, abilityNames = {}) {
		let overlay = null;
		let hud = null;
		return {
			get started() {
				return overlay !== null;
			},
			tick() {
				const scene = battleSceneOf(game);
				if (!scene) return;
				overlay ??= overlayFor(scene, table);
				overlay.tick();
				hud ??= new Hud(table, biomes, movesets, biomeNames, abilityNames);
				hud.sync(scene);
			},
			destroy() {
				overlay?.destroy();
				hud?.destroy();
				overlay = null;
				hud = null;
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
		const runner = startOverlay(game, TIER_TABLE, BIOME_TABLE, MOVESET_TABLE, BIOME_NAMES, ABILITY_NAMES);
		window.setInterval(() => runner.tick(), TICK_INTERVAL_MS);
	});
	var timeout = window.setTimeout(() => {
		reportFailure(`tier overlay: nao capturou o jogo (${armed.join(", ")})`);
	}, CAPTURE_TIMEOUT_MS);
})();
