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
								print("ÿc2Loading custom config: ÿc9" + n + ".js");
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

		if (FileTools.exists("libs/config/" + configFilename)) {
			try {
				if (!include("config/" + configFilename)) {
					throw new Error();
				}
			} catch (e1) {
				throw new Error("Failed to load character config.");
			}
		} else {
			if (notify) {
				print("ÿc1" + classes[me.classid] + "." + me.charname + ".js not found!"); // Use the primary format
				print("ÿc1Loading default config.");
			}

			// Try to find default config
			if (!FileTools.exists("libs/config/" + classes[me.classid] + ".js")) {
				D2Bot.printToConsole("Not going well? Read the wiki: https://github.com/kolton/d2bot-with-kolbot/wiki");
				throw new Error("ÿc1Default config not found. \nÿc9     Try reading the kolbot wiki.");
			}

			try {
				if (!include("config/" + classes[me.classid] + ".js")) {
					throw new Error();
				}
			} catch (e) {
				throw new Error("ÿc1Failed to load default config.");
			}
		}

		try {
			LoadConfig.call();
		} catch (e2) {
			if (notify) {
				print("ÿc8Error in " + e2.fileName.substring(e2.fileName.lastIndexOf("\\") + 1, e2.fileName.length) + "(line " + e2.lineNumber + "): " + e2.message);

				throw new Error("Config.init: Error in character config.");
			}
		}

		try {
			if (Config.AutoBuild.Enabled === true && !isIncluded("common/AutoBuild.js") && include("common/AutoBuild.js")) {
				AutoBuild.initialize();
			}
		} catch (e3) {
			print("ÿc8Error in libs/common/AutoBuild.js (AutoBuild system is not active!)");
			print(e3.toSource());
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
	AutoMap: false,
	LastMessage: "",
	UseMerc: false,
	MercWatch: false,
	LowGold: 0,
	StashGold: 0,
	FieldID: false,
	DroppedItemsAnnounce: {
		Enable: false,
		Quality: [],
		LogToOOG: false,
		OOGQuality: []
	},
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
	LocalChat: {
		Enabled: false,
		Toggle: false,
		Mode: 0
	},
	PublicMode: false,
	PartyAfterScript: false,
	Greetings: [],
	DeathMessages: [],
	Congratulations: [],
	ShitList: false,
	UnpartyShitlisted: false,
	Leader: "",
	QuitList: [],
	QuitListMode: 0,
	QuitListDelay: [],
	HPBuffer: 0,
	MPBuffer: 0,
	RejuvBuffer: 0,
	PickRange: 40,
	MakeRoom: true,
	FastPick: false,
	OpenChests: false,
	PickitFiles: [],
	BeltColumn: [],
	MinColumn: [],
	SkipEnchant: [],
	SkipImmune: [],
	SkipAura: [],
	SkipException: [],
	ScanShrines: [],
	Debug: false,

	AutoMule: {
		Trigger: [],
		Force: [],
		Exclude: []
	},

	ItemInfo: false,
	ItemInfoQuality: [],

	LogKeys: false,
	LogOrgans: true,
	LogLowRunes: false,
	LogMiddleRunes: false,
	LogHighRunes: true,
	LogLowGems: false,
	LogHighGems: false,
	SkipLogging: [],
	ShowCubingInfo: true,

	Cubing: false,
	CubeRepair: false,
	RepairPercent: 40,
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
	MFSwitchPercent: 0,
	PrimarySlot: -1,
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
	WaypointMenu: true,

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
	DCloneQuit: false,

	// Experimental
	FastParty: false,
	AutoEquip: false,

	// GameData
	ChampionBias: 60,

	// Attack specific
	Dodge: false,
	DodgeRange: 15,
	DodgeHP: 100,
	AttackSkill: [],
	LowManaSkill: [],
	CustomAttack: {},
	TeleStomp: false,
	ClearType: false,
	ClearPath: false,
	BossPriority: false,

	// Amazon specific
	LightningFuryDelay: 0,
	SummonValkyrie: false,

	// Sorceress specific
	UseTelekinesis: false,
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
	Charge: false,
	Vigor: false,
	AvoidDolls: false,

	// Barbarian specific
	FindItem: false,
	FindItemSwitch: false,

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
	AggressiveCloak: false,
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
		DiabloMsg: "Diablo",
		WalkClear: false
	},
	DiabloHelper: {
		Wait: 120,
		Entrance: false,
		SkipIfBaal: false,
		SkipTP: false
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
		ShopNPC: "anya",
		CycleDelay: 0,
		QuitOnMatch: false
	},
	Coldworm: {
		KillBeetleburst: false,
		ClearMaggotLair: false
	},
	Summoner: {
		FireEye: false
	},
	AncientTunnels: {
		OpenChest: false,
		KillDarkElder: false
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
		PortalLeech: false,
		WalkClear: false
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
	},
	Rusher: {
		WaitPlayerCount: 0,
		Radament: false,
		LamEsen: false,
		Izual: false,
		Shenk: false,
		Anya: false,
		LastRun: ""
	},
	Rushee: {
		Quester: false,
		Bumper: false
	},
	AutoSkill: {
		Enabled: false,
		Build: [],
		Save: 0
	},
	AutoStat: {
		Enabled: false,
		Build: [],
		Save: 0,
		BlockChance: 0,
		UseBulk: true
	},
	AutoBuild: {
		Enabled: false,
		Template: "",
		Verbose: false,
		DebugMode: false
	}
};
