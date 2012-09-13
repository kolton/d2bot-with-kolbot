/**
*	@filename	Config.js
*	@author		kolton
*	@desc		config loading and default config values storage
*/

var Scripts = {};

var Config = {
	init: function (notify) {
		var i,
			configFilename = "",
			classes = ["Amazon", "Sorceress", "Necromancer", "Paladin", "Barbarian", "Druid", "Assassin"];

		for (i = 0; i < 6; i += 1) {
			switch (i) {
			case 0:
				configFilename = me.realm + "." + classes[me.classid] + "." + me.profile + ".js";

				break;
			case 1:
				configFilename = classes[me.classid] + "." + me.profile + ".js";

				break;
			case 2:
				configFilename = me.realm + "." + classes[me.classid] + "." + me.charname + ".js";

				break;
			case 3:
				configFilename = classes[me.classid] + "." + me.charname + ".js";

				break;
			case 4:
				configFilename = me.profile + ".js";

				break;
			case 5:
				configFilename = "Config." + me.profile + "." + me.charname + ".js"; // Added to make it easier to have hundreds of configs.

				break;
			}

			if (FileTools.exists("libs/config/" + configFilename)) {
				break;
			}
		}

		if (!FileTools.exists("libs/config/" + configFilename)) {
			if (notify) {
				print("�c1" + configFilename + ".js not found!");
				print("�c1Loading default config.");
			}

			try {
				include("config/" + classes[me.classid] + ".js");
			} catch (e) {
				throw new Error("Failed to load default config.");
			}
		}

		try {
			include("config/" + configFilename);
		} catch (e1) {
			throw new Error("Failed to load character config.");
		}

		try {
			LoadConfig();
		} catch (e2) {
			if (notify) {
				print("�c8Error in " + e2.fileName.substring(e2.fileName.lastIndexOf("\\") + 1, e2.fileName.length) + "(line " + e2.lineNumber + "): " + e2.message);

				throw new Error("Config.init: Error in character config.");
			}
		}
	},

	// Time
	StartDelay: 0,
	PickDelay: 0,
	AreaDelay: 0,
	MinGameTime: 0,
	MaxGameTime: 0,

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
	LastMessage: "",
	UseMerc: false,
	MercWatch: false,
	LowGold: 0,
	StashGold: 0,
	FieldID: false,
	CainID: {
		Enable: false,
		MinGold: 0,
		MinUnids: 0
	},
	Inventory: [
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
	],
	PublicMode: false,
	ShitList: false,
	QuitList: [],
	RejuvBuffer: 0,
	PickRange: 40,
	FastPick: false,
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

	// Fastmod
	FCR: 0,
	FHR: 0,
	FBR: 0,
	IAS: 0,
	PacketTeleport: false,

	// Anti-hostile
	AntiHostile: false,
	HostileAction: 0,

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
	AvoidDolls: false,

	// Barbarian specific
	BOSwitch: 0,
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
	MFLeader: false,
	Mausoleum: {
		KillBloodRaven: false,
		ClearCrypt: false
	},
	Eldritch: {
		OpenChest: false,
		KillSharptooth: false,
		KillShenk: false,
		KillDacFarren: false
	},
	Pindleskin: {
		KillNihlathak: false,
		ViperQuit: false
	},
	Nihlathak: {
		ViperQuit: false
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
		Leader: "",
		FindShrine: false
	},
	KurastChests: {
		LowerKurast: false,
		Bazaar: false,
		Sewers1: false,
		Sewers2: false
	},
	Countess: {
		KillGhosts: false
	},
	Baal: {
		HotTPMsg: "Hot TP!",
		SafeTPMsg: "TP safe!",
		BaalMsg: "Baal",
		DollQuit: false,
		KillBaal: false,
		RandomPrecast: false
	},
	BaalHelper: {
		Wait: 120,
		KillNihlathak: false,
		FastChaos: false,
		DollQuit: false,
		KillBaal: false,
		RandomPrecast: false,
		SkipTP: false
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
		Wait: 120,
		Entrance: false
	},
	BattleOrders: {
		Mode: 0,
		Wait: false
	},
	Enchant: {
		Triggers: ["chant", "cows", "wps"],
		GameLength: 20
	},
	IPHunter: {
		IPList: [],
		GameLength: 3
	},
	Follower: {
		Leader: ""
	},
	Mephisto: {
		MoatTrick: false,
		KillCouncil: false,
		TakeRedPortal: false
	},
	ShopBot: {
		ScanIDs: [],
		ShopNPC: "anya"
	},
	Summoner: {
		FireEye: false
	},
	OrgTorch: {
		WaitForKeys: false,
		WaitTimeout: false,
		UseSalvation: false,
		GetFade: false
	},
	Synch: {
		WaitFor: []
	},
	TristramLeech: {
		Leader: "",
		Wait: 120
	},
	TravincalLeech: {
		Leader: "",
		Helper: false,
		Wait: 120
	},
	Tristram: {
		PortalLeech: false
	},
	Travincal: {
		PortalLeech: false
	}
};