/**
*	@filename	Config.js
*	@author		kolton
*	@desc		config loading and default config values storage
*/

var Scripts = {};

var Config = {
	init: function (notify) {
		var i, n,
			configFilename = "",
			classes = ["Amazon", "Sorceress", "Necromancer", "Paladin", "Barbarian", "Druid", "Assassin"];

		for (i = 0; i < 5; i += 1) {
			switch (i) {
			case 0: // Custom config
				if (!isIncluded("config/_customconfig.js")) {
					include("config/_customconfig.js");
				}

				for (n in CustomConfig) {
					if (CustomConfig.hasOwnProperty(n)) {
						if (CustomConfig[n].indexOf(me.profile) > -1) {
							if (notify) {
								print("�c2Loading custom config: �c9" + n + ".js");
							}

							configFilename = n + ".js";

							break;
						}
					}
				}

				break;
			case 1:// Class.Profile.js
				configFilename = classes[me.classid] + "." + me.profile + ".js";

				break;
			case 2: // Realm.Class.Charname.js
				configFilename = me.realm + "." + classes[me.classid] + "." + me.charname + ".js";

				break;
			case 3: // Class.Charname.js
				configFilename = classes[me.classid] + "." + me.charname + ".js";

				break;
			case 4: // Profile.js
				configFilename = me.profile + ".js";

				break;
			}

			if (configFilename && FileTools.exists("libs/config/" + configFilename)) {
				break;
			}
		}

		if (!FileTools.exists("libs/config/" + configFilename)) {
			if (notify) {
				print("�c1" + classes[me.classid] + "." + me.charname + ".js not found!"); // Use the primary format
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
			LoadConfig.call();
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
	Debug: false,

	ItemInfo: false,
	ItemInfoQuality: [],

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
	PacketShopping: false,

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
	KillDclone: false,

	// Attack specific
	Dodge: false,
	DodgeRange: 15,
	DodgeHP: 100,
	AttackSkill: [],
	LowManaSkill: [],
	TeleStomp: false,
	ClearType: false,
	ClearPath: false,
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
	Wereform: 0,
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
		UseWaypoint: false,
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
		StarTP: "Star TP up",
		DiabloMsg: "Diablo"
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
	},
	ClearAnyArea: {
		AreaList: []
	}
};