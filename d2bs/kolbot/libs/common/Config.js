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
				configFilename =  me.profile + "." + classes[me.classid] + "." + me.charname + ".js";

				break;
			}

			if (FileTools.exists("libs/config/" + configFilename)) {
				break;
			}
		}

		if (!FileTools.exists("libs/config/" + configFilename)) {
			if (notify) {
				print("ÿc1" + classes[me.classid] + "." + me.charname + ".js not found!"); // Use the primary format
				print("ÿc1Loading default config.");
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
				print("ÿc8Error in " + e2.fileName.substring(e2.fileName.lastIndexOf("\\") + 1, e2.fileName.length) + "(line " + e2.lineNumber + "): " + e2.message);

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
	HealStatus: false,
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
	Leader: "",
	QuitList: [],
	HPBuffer: 0,
	MPBuffer: 0,
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
	ScanShrines: [],

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
	MFSwitch: 0,
	MFSwitchPercent: 0,
	LogExperience: false,
	TownCheck: false,
	PingQuit: [{Ping: 0, Duration: 0}],

	// Fastmod
	FCR: 0,
	FHR: 0,
	FBR: 0,
	IAS: 0,
	PacketCasting: 0,

	// Anti-hostile
	AntiHostile: false,
	RandomPrecast: false,
	HostileAction: 0,
	TownOnHostile: false,
	ViperCheck: false,

	// DClone
	StopOnDClone: false,
	SoJWaitTime: 0,

	// Attack specific
	Dodge: false,
	AttackSkill: [],
	LowManaSkill: [],
	TeleStomp: false,
	ClearType: false,
	BossPriority: false,

	// Amazon specific
	LightningFuryDelay: 0,
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
		FindShrine: false,
		LeechSpot: [15115, 5050],
		LongRangeSupport: false
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
		DollQuit: false,
		SoulQuit: false,
		KillBaal: false,
		HotTPMessage: "Hot TP!",
		SafeTPMessage: "Safe TP!",
		BaalMessage: "Baal!"
	},
	BaalAssistant: {
		KillNihlathak: false,
		FastChaos: false,
		Wait: 120,
		Helper: false,
		GetShrine: false,
		GetShrineWaitForHotTP: false,
		DollQuit: false,
		SoulQuit: false,
		SkipTP: false,
		WaitForSafeTP: false,
		KillBaal: false,
		HotTPMessage: [],
		SafeTPMessage: [],
		BaalMessage: [],
		NextGameMessage: []
	},
	BaalHelper: {
		Wait: 120,
		KillNihlathak: false,
		FastChaos: false,
		DollQuit: false,
		KillBaal: false,
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
		Getters: [],
		Wait: false
	},
	Enchant: {
		Triggers: ["chant", "cows", "wps"],
		GetLeg: false,
		AutoChant: false,
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
		GetFade: false,
		MakeTorch: true
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
	},
	SkillStat: {
		Skills: []
	},
	Bonesaw: {
		ClearDrifterCavern: false
	},
	ChestMania: {
		Act1: [],
		Act2: [],
		Act3: [],
		Act4: [],
		Act5: []
	}
};