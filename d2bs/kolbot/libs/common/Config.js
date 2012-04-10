var Scripts = {};

var Config = {
	init: function (notify) {
		var classes = ["Amazon", "Sorceress", "Necromancer", "Paladin", "Barbarian", "Druid", "Assassin"];

		if (!FileTools.exists("libs/config/" + classes[me.classid] + "." + me.charname + ".js")) {
			if (notify) {
				print("ÿc1" + classes[me.classid] + "." + me.charname + ".js not found!");
				print("ÿc1Loading default config.");
			}

			try {
				include("config/" + classes[me.classid] + ".js");
			} catch (e) {
				throw new Error("Failed to load default config.");
			}
		}

		try {
			include("config/" + classes[me.classid] + "." + me.charname + ".js");
		} catch (e) {
			throw new Error("Failed to load default config.");
		}

		try {
			LoadConfig();
		} catch (e) {
			if (notify) {
				print("ÿc8Error in " + e.fileName.substring(e.fileName.lastIndexOf("\\") + 1, e.fileName.length) + "(line " + e.lineNumber + "): " + e.message);

				throw new Error("Config.init: Error in character config.");
			}
		}
	},

	// Time
	StartDelay: 0,
	PickDelay: 0,
	AreaDelay: 0,
	MinGameTime: 0,

	// Healing and chicken
	LifeChicken: 0,
	ManaChicken: 0,
	UseHP: 0,
	UseMP: 0,
	UseRejuvHP: 0,
	UseRejuvMP: 0,
	UseMercHP: 0,
	UseMercRejuv: 0,
	MercChicken: 0,
	IronGolemChicken: 0,
	HealHP: 0,
	HealMP: 0,
	TownHP: 0,
	TownMP: 0,

	// General
	UseMerc: false,
	StashGold: 0,
	Inventory: [
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
	],
	PublicMode: false,
	QuitList: [],
	RejuvBuffer: 0,
	PickRange: 40,
	OpenChests: false,
	PickitFiles: [],
	BeltColumn: [],
	MinColumn: [],
	SkipEnchant: [],
	SkipImmune: [],
	SkipAura: [],

	Cubing: false,
	Recipes: [],
	MakeRunewords: false,
	Runewords: [],
	KeepRunewords: [],
	Gamble: false,
	GambleItems: [],
	GambleGoldStart: 0,
	GambleGoldStop: 0,
	MiniShopBot: false,
	TeleSwitch: false,
	LogExperience: false,
	TownCheck: false,

	// DClone
	StopOnDClone: false,
	SoJWaitTime: 0,

	// Attack specific
	Dodge: false,
	AttackSkill: [],
	TeleStomp: false,
	ClearType: false,
	BossPriority: false,

	// Amazon specific
	SummonValkyrie: false,

	// Sorceress specific
	CastStatic: false,
	StaticList: [],

	// Necromancer specific
	Golem: 0,
	ActiveSummon: false,
	Skeletons: 0,
	SkeletonMages: 0,
	Revives: 0,
	ReviveUnstackable: false,
	PoisonNovaDelay: 2000,
	Curse: [],
	ExplodeCorpses: 0,

	// Paladin speficic
	Redemption: [0, 0],
	Vigor: false,

	// Barbarian specific
	FindItem: false,
	FindItemSwitch: 1,

	// Druid specific
	SummonRaven: 0,
	SummonAnimal: 0,
	SummonVine: 0,
	SummonSpirit: 0,

	// Assassin specific
	UseTraps: false,
	Traps: [],
	BossTraps: [],
	UseFade: false,
	UseBoS: false,
	UseVenom: false,
	UseCloakofShadows: false,
	SummonShadow: false,

	// Script specific
	Mausoleum: {
		KillBloodRaven: false,
		ClearCrypt: true
	},
	Eldritch: {
		OpenChest: false,
		KillSharptooth: false,
		KillShenk: false,
		KillDacFarren: false
	},
	Pindleskin: {
		KillNihlathak: false
	},
	Pit: {
		ClearPath: false,
		ClearPit1: false
	},
	Snapchip: {
		ClearIcyCellar: false
	},
	Frozenstein: {
		ClearFrozenRiver: false
	},
	Rakanishu: {
		KillGriswold: false
	},
	AutoBaal: {
		FindShrine: false
	},
	KurastChests: {
		Bazaar: false
	},
	Countess: {
		KillGhosts: false
	},
	Baal: {
		HotTPMsg: "Hot TP!",
		SafeTPMsg: "TP safe!",
		BaalMsg: "Baal"
	},
	BaalHelper: {
		KillNihlathak: false,
		FastChaos: false
	},
	Corpsefire: {
		ClearDen: false
	},
	Diablo: {
		Entrance: false,
		SealWarning: "Leave the seals alone!",
		EntranceTP: "Entrance TP up",
		StarTP: "Star TP up"
	},
	DiabloHelper: {
		Entrance: false
	},
	BattleOrders: {
		Mode: 0,
		Wait: false
	},
	Enchant: {
		Trigger: ".chant",
		GameLength: 20
	},
	IPHunter: {
		IPList: [],
		GameLength: 3
	}
};