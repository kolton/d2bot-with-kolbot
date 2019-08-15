/**
 * @description A unified configure script
 * @author Jaenster
 */
(function (module, require) {
	function Config() {
		let scripts = require(Config.file, '../config/');

		Object.keys(scripts)
			.forEach(x => Config.Scripts[x] = scripts[x]);

		return Config;
	}

	Config.file = (function () {
		try {
			!isIncluded("../config/_customconfig.js") && include("../config/_customconfig.js");
		} catch (e) {
			// Dont care if we cant load custom config
			print('Warning; cant load custom config');
		}

		// check if a custom config is set
		if (typeof CustomConfig === 'object' && CustomConfig)
			for (let n in CustomConfig)
				if (CustomConfig.hasOwnProperty(n) && CustomConfig[n].indexOf(me.profile) > -1)
					return n;

		return me.windowtitle;
	})();


	// Time
	Config.StartDelay = 0;
	Config.PickDelay = 0;
	Config.AreaDelay = 0;
	Config.MinGameTime = 0;
	Config.MaxGameTime = 0;

	// Healing and chicken
	Config.LifeChicken = 0;
	Config.ManaChicken = 0;
	Config.UseHP = 0;
	Config.UseMP = 0;
	Config.UseRejuvHP = 0;
	Config.UseRejuvMP = 0;
	Config.UseMercHP = 0;
	Config.UseMercRejuv = 0;
	Config.MercChicken = 0;
	Config.IronGolemChicken = 0;
	Config.HealHP = 0;
	Config.HealMP = 0;
	Config.HealStatus = false;
	Config.TownHP = 0;
	Config.TownMP = 0;

	// General
	Config.AutoMap = false;
	Config.LastMessage = "";
	Config.UseMerc = false;
	Config.MercWatch = false;
	Config.LowGold = 0;
	Config.StashGold = 0;
	Config.FieldID = false;
	Config.DroppedItemsAnnounce = {
		Enable: false,
		Quality: [],
		LogToOOG: false,
		OOGQuality: []
	};
	Config.CainID = {
		Enable: false,
		MinGold: 0,
		MinUnids: 0
	};
	Config.Inventory = [
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
	];
	Config.LocalChat = {
		Enabled: false,
		Toggle: false,
		Mode: 0
	};
	Config.PublicMode = false;
	Config.PartyAfterScript = false;
	Config.Greetings = [];
	Config.DeathMessages = [];
	Config.Congratulations = [];
	Config.ShitList = false;
	Config.UnpartyShitlisted = false;
	Config.Leader = "";
	Config.QuitList = [];
	Config.QuitListMode = 0;
	Config.HPBuffer = 0;
	Config.MPBuffer = 0;
	Config.RejuvBuffer = 0;
	Config.PickRange = 40;
	Config.MakeRoom = true;
	Config.FastPick = false;
	Config.OpenChests = false;
	Config.PickitFiles = [];
	Config.BeltColumn = [];
	Config.MinColumn = [];
	Config.SkipEnchant = [];
	Config.SkipImmune = [];
	Config.SkipAura = [];
	Config.SkipException = [];
	Config.ScanShrines = [];
	Config.Debug = false;

	Config.AutoMule = {
		Trigger: [],
		Force: [],
		Exclude: []
	};

	Config.ItemInfo = false;
	Config.ItemInfoQuality = [];

	Config.LogKeys = false;
	Config.LogOrgans = true;
	Config.LogLowRunes = false;
	Config.LogMiddleRunes = false;
	Config.LogHighRunes = true;
	Config.LogLowGems = false;
	Config.LogHighGems = false;
	Config.SkipLogging = [];
	Config.ShowCubingInfo = true;

	Config.Cubing = false;
	Config.CubeRepair = false;
	Config.RepairPercent = 40;
	Config.Recipes = [];
	Config.MakeRunewords = false;
	Config.Runewords = [];
	Config.KeepRunewords = [];
	Config.Gamble = false;
	Config.GambleItems = [];
	Config.GambleGoldStart = 0;
	Config.GambleGoldStop = 0;
	Config.MiniShopBot = false;
	Config.TeleSwitch = false;
	Config.MFSwitchPercent = 0;
	Config.PrimarySlot = -1;
	Config.LogExperience = false;
	Config.TownCheck = false;
	Config.PingQuit = [{Ping: 0, Duration: 0}],
		Config.PacketShopping = false;

	// Fastmod
	Config.FCR = 0;
	Config.FHR = 0;
	Config.FBR = 0;
	Config.IAS = 0;
	Config.PacketCasting = 0;
	Config.WaypointMenu = true;

	// Anti-hostile
	Config.AntiHostile = false;
	Config.RandomPrecast = false;
	Config.HostileAction = 0;
	Config.TownOnHostile = false;
	Config.ViperCheck = false;

	// DClone
	Config.StopOnDClone = false;
	Config.SoJWaitTime = 0;
	Config.KillDclone = false;
	Config.DCloneQuit = false;

	// Experimental
	Config.FastParty = false;
	Config.AutoEquip = false;

	// GameData
	Config.ChampionBias = 60;

	// Attack specific
	Config.Dodge = false;
	Config.DodgeRange = 15;
	Config.DodgeHP = 100;
	Config.AttackSkill = [];
	Config.LowManaSkill = [];
	Config.CustomAttack = {};
	Config.TeleStomp = false;
	Config.ClearType = false;
	Config.ClearPath = false;
	Config.BossPriority = false;

	// Amazon specific
	Config.SummonValkyrie = false;

	// Sorceress specific
	Config.UseTelekinesis = false;
	Config.CastStatic = false;
	Config.StaticList = [];

	// Necromancer specific
	Config.Golem = 0;
	Config.ActiveSummon = false;
	Config.Skeletons = 0;
	Config.SkeletonMages = 0;
	Config.Revives = 0;
	Config.ReviveUnstackable = false;
	Config.PoisonNovaDelay = 2000;
	Config.Curse = [];
	Config.ExplodeCorpses = 0;

	// Paladin speficic
	Config.Redemption = [0, 0];
	Config.Charge = false;
	Config.Vigor = false;
	Config.AvoidDolls = false;

	// Barbarian specific
	Config.FindItem = false;
	Config.FindItemSwitch = false;

	// Druid specific
	Config.Wereform = 0;
	Config.SummonRaven = 0;
	Config.SummonAnimal = 0;
	Config.SummonVine = 0;
	Config.SummonSpirit = 0;

	// Assassin specific
	Config.UseTraps = false;
	Config.Traps = [];
	Config.BossTraps = [];
	Config.UseFade = false;
	Config.UseBoS = false;
	Config.UseVenom = false;
	Config.UseCloakofShadows = false;
	Config.AggressiveCloak = false;
	Config.SummonShadow = false;

	// Script specific
	Config.MFLeader = false;
	Config.Mausoleum = {
		KillBloodRaven: false,
		ClearCrypt: false
	};
	Config.Eldritch = {
		OpenChest: false,
		KillSharptooth: false,
		KillShenk: false,
		KillDacFarren: false
	};
	Config.Pindleskin = {
		UseWaypoint: false,
		KillNihlathak: false,
		ViperQuit: false
	};
	Config.Nihlathak = {
		ViperQuit: false
	};
	Config.Pit = {
		ClearPath: false,
		ClearPit1: false
	};
	Config.Snapchip = {
		ClearIcyCellar: false
	};
	Config.Frozenstein = {
		ClearFrozenRiver: false
	};
	Config.Rakanishu = {
		KillGriswold: false
	};
	Config.AutoBaal = {
		Leader: "",
		FindShrine: false,
		LeechSpot: [15115, 5050],
		LongRangeSupport: false
	};
	Config.KurastChests = {
		LowerKurast: false,
		Bazaar: false,
		Sewers1: false,
		Sewers2: false
	};
	Config.Countess = {
		KillGhosts: false
	};
	Config.Baal = {
		DollQuit: false,
		SoulQuit: false,
		KillBaal: false,
		HotTPMessage: "Hot TP!",
		SafeTPMessage: "Safe TP!",
		BaalMessage: "Baal!"
	};
	Config.BaalAssistant = {
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
	};
	Config.BaalHelper = {
		Wait: 120,
		KillNihlathak: false,
		FastChaos: false,
		DollQuit: false,
		KillBaal: false,
		SkipTP: false
	};
	Config.Corpsefire = {
		ClearDen: false
	};
	Config.Diablo = {
		Entrance: false,
		SealWarning: "Leave the seals alone!",
		EntranceTP: "Entrance TP up",
		StarTP: "Star TP up",
		DiabloMsg: "Diablo",
		WalkClear: false
	};
	Config.DiabloHelper = {
		Wait: 120,
		Entrance: false,
		SkipIfBaal: false,
		SkipTP: false
	};
	Config.BattleOrders = {
		Mode: 0,
		Getters: [],
		Wait: false
	};
	Config.Enchant = {
		Triggers: ["chant", "cows", "wps"],
		GetLeg: false,
		AutoChant: false,
		GameLength: 20
	};
	Config.IPHunter = {
		IPList: [],
		GameLength: 3
	};
	Config.Follower = {
		Leader: ""
	};
	Config.Mephisto = {
		MoatTrick: false,
		KillCouncil: false,
		TakeRedPortal: false
	};
	Config.ShopBot = {
		ScanIDs: [],
		ShopNPC: "anya",
		CycleDelay: 0,
		QuitOnMatch: false
	};
	Config.Coldworm = {
		KillBeetleburst: false,
		ClearMaggotLair: false
	};
	Config.Summoner = {
		FireEye: false
	};
	Config.AncientTunnels = {
		OpenChest: false,
		KillDarkElder: false
	};
	Config.OrgTorch = {
		WaitForKeys: false,
		WaitTimeout: false,
		UseSalvation: false,
		GetFade: false,
		MakeTorch: true
	};
	Config.Synch = {
		WaitFor: []
	};
	Config.TristramLeech = {
		Leader: "",
		Wait: 120
	};
	Config.TravincalLeech = {
		Leader: "",
		Helper: false,
		Wait: 120
	};
	Config.Tristram = {
		PortalLeech: false,
		WalkClear: false
	};
	Config.Travincal = {
		PortalLeech: false
	};
	Config.SkillStat = {
		Skills: []
	};
	Config.Bonesaw = {
		ClearDrifterCavern: false
	};
	Config.ChestMania = {
		Act1: [],
		Act2: [],
		Act3: [],
		Act4: [],
		Act5: []
	};
	Config.ClearAnyArea = {
		AreaList: []
	};
	Config.Rusher = {
		WaitPlayerCount: 0,
		Radament: false,
		LamEsen: false,
		Izual: false,
		Shenk: false,
		Anya: false,
		LastRun: ""
	};
	Config.Rushee = {
		Quester: false,
		Bumper: false
	};
	Config.AutoSkill = {
		Enabled: false,
		Build: [],
		Save: 0
	};
	Config.AutoStat = {
		Enabled: false,
		Build: [],
		Save: 0,
		BlockChance: 0,
		UseBulk: true
	};
	Config.AutoBuild = {
		Enabled: false,
		Template: "",
		Verbose: false,
		DebugMode: false
	};
	Config.SpeedDiablo = {
		Fast: false,
		Follower: false,
		Entrance: true,
	};
	Config.Development = '';

	Config.Scripts = {};

	Config.StarterConfig = typeof StarterConfig === 'object' && StarterConfig && StarterConfig || {};

	module.exports = Config;

})(module, require);