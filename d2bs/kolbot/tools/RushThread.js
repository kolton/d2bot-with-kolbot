/**
*	@filename	RushThread.js
*	@author		kolton
*	@desc		Second half of the Rusher script
*/

js_strict(true);

include("json2.js");
include("NTItemParser.dbl");
include("OOG.js");
include("Gambling.js");
include("AutoMule.js");
include("CraftingSystem.js");
include("TorchSystem.js");
include("common/Attack.js");
include("common/Cubing.js");
include("common/Config.js");
include("common/CollMap.js");
include("common/Loader.js");
include("common/Misc.js");
include("common/Pickit.js");
include("common/Pather.js");
include("common/Precast.js");
include("common/Prototypes.js");
include("common/Runewords.js");
include("common/Storage.js");
include("common/Town.js");
if (!isIncluded("common/Enums.js")) { include("common/Enums.js"); };

var gidList = [];

function main() {
	this.playerIn = function (area) {
		if (!area) {
			area = me.area;
		}

		var party = getParty();

		if (party) {
			do {
				if (party.name !== me.name && party.area === area) {
					return true;
				}
			} while (party.getNext());
		}

		return false;
	};

	this.bumperCheck = function () {
		var party = getParty();

		if (party) {
			do {
				if (party.name !== me.name) {
					switch (me.diff) {
					case 0:
						if (party.level >= 20) {
							return true;
						}

						break;
					case 1:
						if (party.level >= 40) {
							return true;
						}

						break;
					}
				}
			} while (party.getNext());
		}

		return false;
	};

	this.playersInAct = function (act) {
		var area, party,
            areas = [Areas.None, Areas.Act1.Rogue_Encampment, Areas.Act2.Lut_Gholein, Areas.Act3.Kurast_Docktown, Areas.Act4.The_Pandemonium_Fortress, Areas.Act5.Harrogath];

		if (!act) {
			act = me.act;
		}

		area = areas[act];
		party = getParty();

		if (party) {
			do {
				if (party.name !== me.name && party.area !== area) {
					return false;
				}
			} while (party.getNext());
		}

		return true;
	};

	this.andariel = function () {
		say("starting andariel");
		Town.doChores();
        Pather.useWaypoint(Areas.Act1.Catacombs_Level_2, true);
		Precast.doPrecast(true);

        if (!Pather.moveToExit([Areas.Act1.Catacombs_Level_3, Areas.Act1.Catacombs_Level_4], true) || !Pather.moveTo(22582, 9612)) {
			throw new Error("andy failed");
		}

		Pather.makePortal();
		Attack.securePosition(me.x, me.y, 40, 3000, true);
		say("1");

		while (!this.playerIn()) {
			Pather.moveTo(22582, 9612);
			delay(250);
		}

        Attack.kill(UnitClassID.andariel);
		say("2");
		Pather.moveTo(22582, 9612);

		while (this.playerIn()) {
			delay(250);
		}

		Pather.usePortal(null, me.name);
		say("a2");
        Pather.useWaypoint(Areas.Act2.Lut_Gholein, true);

		while (!this.playersInAct(2)) {
			delay(250);
		}

		return true;
	};

	this.cube = function () {
		if (me.diff === 0) {
			say("starting cube");
            Pather.useWaypoint(Areas.Act2.Halls_Of_The_Dead_Level_2, true);
			Precast.doPrecast(true);

            if (!Pather.moveToExit(Areas.Act2.Halls_Of_The_Dead_Level_3, true) || !Pather.moveToPreset(me.area, UnitType.Object, UnitClassID.trap_melee)) {
				throw new Error("cube failed");
			}

			Pather.makePortal();
			Attack.securePosition(me.x, me.y, 30, 3000, true);
			say("1");

			while (!this.playerIn()) {
				delay(100);
			}

			while (this.playerIn()) {
				delay(100);
			}

			Pather.usePortal(null, me.name);
		}

		return true;
	};

	this.amulet = function () {
		say("starting amulet");
		Town.doChores();
        Pather.useWaypoint(Areas.Act2.Lost_City, true);
		Precast.doPrecast(true);

        if (!Pather.moveToExit([Areas.Act2.Valley_Of_Snakes, Areas.Act2.Claw_Viper_Temple_Level_1, Areas.Act2.Claw_Viper_Temple_Level_2], true) || !Pather.moveTo(15044, 14045)) {
			throw new Error("amulet failed");
		}

		Pather.makePortal();

		if (me.diff < 2) {
			Attack.securePosition(me.x, me.y, 25, 3000);
		} else {
			Attack.securePosition(me.x, me.y, 25, 3000, true, true);
		}

		say("1");

		while (!this.playerIn()) {
			delay(100);
		}

		while (this.playerIn()) {
			delay(100);
		}

		Pather.usePortal(null, me.name);

		return true;
	};

	this.staff = function () {
		say("starting staff");
		Town.doChores();
        Pather.useWaypoint(Areas.Act2.Far_Oasis, true);
		Precast.doPrecast(true);

        if (!Pather.moveToExit([Areas.Act2.Maggot_Lair_Level_1, Areas.Act2.Maggot_Lair_Level_2, Areas.Act2.Maggot_Lair_Level_3], true) || !Pather.moveToPreset(me.area, UnitType.Object, UniqueObjectIds.Staff_Of_Kings_Chest)) {
			throw new Error("staff failed");
		}

		Pather.makePortal();
		Attack.securePosition(me.x, me.y, 30, 3000, true);
		say("1");

		while (!this.playerIn()) {
			//Pather.moveToPreset(me.area, 2, 356);
			delay(100);
		}

		while (this.playerIn()) {
			delay(100);
		}

		Pather.usePortal(null, me.name);

		return true;
	};

	this.summoner = function () {
		// right up 25449 5081 (25431, 5011)
		// left up 25081 5446 (25011, 5446)
		// right down 25830 5447 (25866, 5431)
		// left down 25447 5822 (25431, 5861)

		say("starting summoner");
		Town.doChores();
        Pather.useWaypoint(Areas.Act2.Arcane_Sanctuary, true);
		Precast.doPrecast(true);

		var i, journal,
            preset = getPresetUnit(me.area, UnitType.Object, UniqueObjectIds.Horazons_Journal),
			spot = {};

		switch (preset.roomx * 5 + preset.x) {
		case 25011:
			spot = {x: 25081, y: 5446};
			break;
		case 25866:
			spot = {x: 25830, y: 5447};
			break;
		case 25431:
			switch (preset.roomy * 5 + preset.y) {
			case 5011:
				spot = {x: 25449, y: 5081};
				break;
			case 5861:
				spot = {x: 25447, y: 5822};
				break;
			}

			break;
		}

		if (!Pather.moveToUnit(spot)) {
			throw new Error("summoner failed");
		}

		Pather.makePortal();
		Attack.securePosition(me.x, me.y, 25, 3000);
		say("1");

		while (!this.playerIn()) {
			Pather.moveToUnit(spot);
			Attack.securePosition(me.x, me.y, 25, 500);
			delay(250);
		}

        Pather.moveToPreset(me.area, UnitType.Object, UniqueObjectIds.Horazons_Journal);
		Attack.kill(250);
		say("2");

		while (this.playerIn()) {
			delay(100);
		}

		Pickit.pickItems();
        Pather.moveToPreset(me.area, UnitType.Object, UniqueObjectIds.Horazons_Journal);

        journal = getUnit(UnitType.Object, UniqueObjectIds.Horazons_Journal);

		for (i = 0; i < 5; i += 1) {
			journal.interact();
			delay(1000);
			me.cancel();

            if (Pather.getPortal(Areas.Act2.Canyon_Of_The_Magi)) {
				break;
			}
		}

		if (i === 5) {
			throw new Error("summoner failed");
		}

        Pather.usePortal(Areas.Act2.Canyon_Of_The_Magi);

		return true;
	};

	this.duriel = function () {
		say("starting duriel");

		if (me.inTown) {
			Town.doChores();
            Pather.useWaypoint(Areas.Act2.Canyon_Of_The_Magi, true);
		}

		Precast.doPrecast(true);

        if (!Pather.moveToExit(getRoom().correcttomb, true) || !Pather.moveToPreset(me.area, UnitType.Object, UniqueObjectIds.Holder_For_Horadric_Staff)) {
			throw new Error("duriel failed");
		}

		Pather.makePortal();
		Attack.securePosition(me.x, me.y, 30, 3000, true, me.diff === 2);
		say("1");

		while (!this.playerIn()) {
			//Pather.moveToPreset(me.area, 2, 152, 0, -5);
			delay(100);
		}

		while (this.playerIn()) {
			delay(100);
		}

        while (!getUnit(UnitType.Object, UniqueObjectIds.Portal_To_Duriel)) {
			delay(500);
		}

        Pather.useUnit(UnitType.Object, UniqueObjectIds.Portal_To_Duriel, Areas.Act2.Duriels_Lair);
        Attack.kill(UnitClassID.duriel);
		Pickit.pickItems();

		Pather.teleport = false;

		Pather.moveTo(22579, 15706);

		Pather.teleport = true;

		Pather.moveTo(22577, 15649, 10);
		Pather.moveTo(22577, 15609, 10);
		Pather.makePortal();
		say("1");

		while (!this.playerIn()) {
			delay(100);
		}

		if (!Pather.usePortal(null, me.name)) {
			Town.goToTown();
		}

        Pather.useWaypoint(Areas.Act2.Palace_Cellar_Level_1);
        Pather.moveToExit([Areas.Act2.Harem_Level_2, Areas.Act2.Harem_Level_1], true);
		Pather.moveTo(10022, 5047);
		say("a3");
		Town.goToTown(3);
		Town.doChores();

		while (!this.playersInAct(3)) {
			delay(250);
		}

		return true;
	};

	this.travincal = function () {
		say("starting travincal");
		Town.doChores();
        Pather.useWaypoint(Areas.Act3.Travincal, true);
		Precast.doPrecast(true);

		var coords = [me.x, me.y];

		Pather.moveTo(coords[0] + 23, coords[1] - 102);
		Pather.makePortal();
		Attack.securePosition(me.x, me.y, 40, 3000);
		say("1");

		while (!this.playerIn()) {
			delay(250);
		}

		Pather.moveTo(coords[0] + 30, coords[1] - 134);
		Pather.moveTo(coords[0] + 86, coords[1] - 130);
		Pather.moveTo(coords[0] + 71, coords[1] - 94);
		Attack.securePosition(me.x, me.y, 40, 3000);

		/*Attack.kill(getLocaleString(2863));
		Attack.kill(getLocaleString(2862));
		Attack.kill(getLocaleString(2860));*/

		say("2");
		Pather.moveTo(coords[0] + 23, coords[1] - 102);
		Pather.usePortal(null, me.name);

		return true;
	};

	this.mephisto = function () {
		say("starting mephisto");

		var hydra;

		Town.doChores();
        Pather.useWaypoint(Areas.Act3.Durance_Of_Hate_Level_2, true);
		Precast.doPrecast(true);
        Pather.moveToExit(Areas.Act3.Durance_Of_Hate_Level_3, true);
		Pather.moveTo(17692, 8023);
		Pather.makePortal();
		delay(2000);
		say("1");

		while (!this.playerIn()) {
			delay(250);
		}

		Pather.moveTo(17591, 8070);
        Attack.kill(UnitClassID.mephisto);
		Pickit.pickItems();
		Pather.moveTo(17692, 8023);
		Pather.makePortal();
		say("2");

		while (this.playerIn()) {
			delay(250);
		}

		Pather.moveTo(17591, 8070);
		Attack.securePosition(me.x, me.y, 40, 3000);

        hydra = getUnit(UnitType.NPC, "hydra");

		if (hydra) {
			do {
                while (hydra.mode !== NPCModes.death && hydra.mode !== NPCModes.dead && hydra.hp > 0) {
					delay(500);
				}
			} while (hydra.getNext());
		}

		Pather.makePortal();
		Pather.moveTo(17581, 8070);
		say("1");

		while (!this.playerIn()) {
			delay(250);
		}

		say("a4");
		//Pather.moveTo(17591, 8070);

		while (!this.playersInAct(4)) {
			delay(250);
		}

		delay(2000);
		Pather.usePortal(null);

		return true;
	};

	this.diablo = function () {
		say("starting diablo");

		this.getLayout = function (seal, value) {
            var sealPreset = getPresetUnit(Areas.Act4.Chaos_Sanctuary, States.POISON, seal);

			if (!seal) {
				throw new Error("Seal preset not found. Can't continue.");
			}

			if (sealPreset.roomy * 5 + sealPreset.y === value || sealPreset.roomx * 5 + sealPreset.x === value) {
				return 1;
			}

			return 2;
		};

		this.initLayout = function () {
            this.vizLayout = this.getLayout(UniqueObjectIds.Diablo_Seal5, 5275);
            this.seisLayout = this.getLayout(UniqueObjectIds.Diablo_Seal3, 7773);
            this.infLayout = this.getLayout(UniqueObjectIds.Diablo_Seal1, 7893);
		};

		this.getBoss = function (name) {
			var i, boss,
                glow = getUnit(UnitType.Object, UniqueObjectIds.Vile_Dog_Afterglow);

			for (i = 0; i < (name === getLocaleString(2853) ? 14 : 12); i += 1) {
                boss = getUnit(UnitType.NPC, name);

				if (boss) {
					if (name === getLocaleString(2852)) {
						this.chaosPreattack(getLocaleString(2852), 8);
					}

					Attack.kill(name);
					Pickit.pickItems();

					return true;
				}

				delay(250);
			}

			return !!glow;
		};

		this.chaosPreattack = function (name, amount) {
			var i, n, target, positions;

			switch (me.classid) {
                case UnitClassID.skeleton1:
				break;
                case UnitClassID.skeleton2:
				break;
                case UnitClassID.skeleton3:
				break;
                case UnitClassID.skeleton4:
				target = getUnit(1, name);

				if (!target) {
					return;
				}

				positions = [[6, 11], [0, 8], [8, -1], [-9, 2], [0, -11], [8, -8]];

				for (i = 0; i < positions.length; i += 1) {
					if (Attack.validSpot(target.x + positions[i][0], target.y + positions[i][1])) { // check if we can move there
						Pather.moveTo(target.x + positions[i][0], target.y + positions[i][1]);
						Skill.setSkill(Config.AttackSkill[2], 0);

						for (n = 0; n < amount; n += 1) {
							Skill.cast(Config.AttackSkill[1], 1);
						}

						break;
					}
				}

				break;
                case UnitClassID.skeleton5:
				break;
                case UnitClassID.zombie1:
				break;
                case UnitClassID.zombie2:
				break;
			}
		};

		this.openSeal = function (id) {
            Pather.moveToPreset(Areas.Act4.Chaos_Sanctuary, UnitType.Object, id, 4);

			var i, tick,
                seal = getUnit(UnitType.Object, id);

			if (seal) {
				for (i = 0; i < 3; i += 1) {
					seal.interact();

					tick = getTickCount();

					while (getTickCount() - tick < 500) {
						if (seal.mode) {
							return true;
						}

						delay(10);
					}
				}
			}

			return false;
		};

		Town.doChores();
        Pather.useWaypoint(Areas.Act4.River_Of_Flame, true);
		Precast.doPrecast(true);
		Pather.moveTo(7790, 5544);
		this.initLayout();

        if (!this.openSeal(UniqueObjectIds.Diablo_Seal4) || !this.openSeal(UniqueObjectIds.Diablo_Seal5)) {
			throw new Error("Failed to open seals");
		}

		if (this.vizLayout === 1) {
			Pather.moveTo(7691, 5292);
		} else {
			Pather.moveTo(7695, 5316);
		}

		if (!this.getBoss(getLocaleString(2851))) {
			throw new Error("Failed to kill Vizier");
		}

        if (!this.openSeal(UniqueObjectIds.Diablo_Seal3)) {
			throw new Error("Failed to open seals");
		}

		if (this.seisLayout === 1) {
			Pather.moveTo(7771, 5196);
		} else {
			Pather.moveTo(7798, 5186);
		}

		if (!this.getBoss(getLocaleString(2852))) {
			throw new Error("Failed to kill de Seis");
		}

        if (!this.openSeal(UniqueObjectIds.Diablo_Seal1) || !this.openSeal(UniqueObjectIds.Diablo_Seal2)) {
			throw new Error("Failed to open seals");
		}

		if (this.infLayout === 1) {
			delay(1);
		} else {
			Pather.moveTo(7928, 5295); // temp
		}

		if (!this.getBoss(getLocaleString(2853))) {
			throw new Error("Failed to kill Infector");
		}

		Pather.moveTo(7763, 5267);
		Pather.makePortal();
		Pather.moveTo(7727, 5267);
		say("1");

		while (!this.playerIn()) {
			delay(250);
		}

		Pather.moveTo(7763, 5267);

        while (!getUnit(UnitType.NPC, UnitClassID.diablo)) {
			delay(500);
		}

        Attack.kill(UnitClassID.diablo);
		say("2");

		if (me.gametype > 0) {
			say("a5");

			while (!this.playersInAct(5)) {
				delay(250);
			}
		}

		Pickit.pickItems();

		if (!Pather.usePortal(null, me.name)) {
			Town.goToTown();
		}

		return true;
	};

	this.ancients = function () {
		if (me.diff === 2) {
			say("Hell rush complete~");
			delay(500);
			quit();

			return false;
		}

		if (!this.bumperCheck()) {
			say("No eligible bumpers detected. Rush complete~");
			delay(500);
			quit();

			return false;
		}

		say("starting ancients");

		var altar;

		Town.doChores();
        Pather.useWaypoint(Areas.Act5.Ancients_Way, true);
		Precast.doPrecast(true);

        if (!Pather.moveToExit(Areas.Act5.Arreat_Summit, true)) {
			throw new Error("Failed to go to Ancients way.");
		}

		Pather.moveTo(10089, 12622);
		Pather.makePortal();
		say("3");

		while (!this.playerIn()) {
			delay(250);
		}

		Pather.moveTo(10048, 12628);

        altar = getUnit(UnitType.Object, UniqueObjectIds.AncientsAltar);

		if (altar) {
            while (altar.mode !== ObjectModes.Opened) {
				Pather.moveToUnit(altar);
				altar.interact();
				delay(2000 + me.ping);
				me.cancel();
			}
		}

        while (!getUnit(UnitType.NPC, UnitClassID.ancientbarb3)) {
			delay(250);
		}

		Attack.clear(50);
		Pather.moveTo(10089, 12622);
		me.cancel();
		Pather.makePortal();

		while (this.playerIn()) {
			delay(100);
		}

		if (!Pather.usePortal(null, me.name)) {
			Town.goToTown();
		}

		return true;
	};

	this.baal = function () {
		say("starting baal");

		var tick, portal;

		this.preattack = function () {
			var check;

			switch (me.classid) {
                case ClassID.Sorceress:
                    if ([Skills.Sorceress.Meteor, Skills.Sorceress.Blizzard, Skills.Sorceress.Frozen_Orb].indexOf(Config.AttackSkill[1]) > -1) {
                        if (me.getState(States.SKILLDELAY)) {
						delay(500);
					} else {
						Skill.cast(Config.AttackSkill[1], 0, 15093, 5024);
					}
				}

				return true;
                case ClassID.Paladin: // Paladin
                    if (Config.AttackSkill[3] !== Skills.Paladin.Blessed_Hammer) {
					return false;
				}

				if (getDistance(me, 15093, 5029) > 3) {
					Pather.moveTo(15093, 5029);
				}

				if (Config.AttackSkill[4] > 0) {
					Skill.setSkill(Config.AttackSkill[4], 0);
				}

				Skill.cast(Config.AttackSkill[3], 1);

				return true;
                case ClassID.Druid: // Druid
                    if (Config.AttackSkill[3] === Skills.Druid.Tornado) {
					Skill.cast(Config.AttackSkill[3], 0, 15093, 5029);

					return true;
				}

				break;
                case ClassID.Assassin:
				if (Config.UseTraps) {
					check = ClassAttack.checkTraps({x: 15093, y: 5029});

					if (check) {
						ClassAttack.placeTraps({x: 15093, y: 5029}, 5);

						return true;
					}
				}

				break;
			}

			return false;
		};

		this.checkThrone = function () {
            var monster = getUnit(UnitType.NPC);

			if (monster) {
				do {
					if (Attack.checkMonster(monster) && monster.y < 5080) {
						switch (monster.classid) {
                            case UnitClassID.fallen5:
                            case UnitClassID.fallenshaman5:
							return 1;
                            case UnitClassID.unraveler5:
                            case UnitClassID.skmage_cold3:
							return 2;
                            case UnitClassID.baalhighpriest:
							return 3;
                            case UnitClassID.venomlord:
							return 4;
                            case UnitClassID.baalminion1:
							return 5;
						default:
							Attack.getIntoPosition(monster, 10, 0x4);
							Attack.clear(15);

							return false;
						}
					}
				} while (monster.getNext());
			}

			return false;
		};

		this.clearThrone = function () {
			var i, monster,
				monList = [],
				pos = [15097, 5054, 15085, 5053, 15085, 5040, 15098, 5040, 15099, 5022, 15086, 5024];

			if (Config.AvoidDolls) {
                monster = getUnit(UnitType.NPC, UnitClassID.bonefetish7);

				if (monster) {
					do {
						if (monster.x >= 15072 && monster.x <= 15118 && monster.y >= 5002 && monster.y <= 5079 && Attack.checkMonster(monster) && Attack.skipCheck(monster)) {
							monList.push(copyUnit(monster));
						}
					} while (monster.getNext());
				}

				if (monList.length) {
					Attack.clearList(monList);
				}
			}

			for (i = 0; i < pos.length; i += 2) {
				Pather.moveTo(pos[i], pos[i + 1]);
				Attack.clear(30);
			}
		};

		this.checkHydra = function () {
            var monster = getUnit(UnitType.NPC, "hydra");

			if (monster) {
				do {
                    if (monster.mode !== NPCModes.dead && monster.getStat(Stats.alignment) !== 2) {
						Pather.moveTo(15118, 5002);

                        while (monster.mode !== NPCModes.dead) {
							delay(500);

							if (!copyUnit(monster).x) {
								break;
							}
						}

						break;
					}
				} while (monster.getNext());
			}

			return true;
		};

		if (me.inTown) {
			Town.doChores();
            Pather.useWaypoint(Areas.Act5.The_Worldstone_Keep_Level_2, true);
			Precast.doPrecast(true);

            if (!Pather.moveToExit([Areas.Act5.The_Worldstone_Keep_Level_3, Areas.Act5.Throne_Of_Destruction], true)) {
				throw new Error("Failed to move to Throne of Destruction.");
			}
		}

		Pather.moveTo(15113, 5040);
		Attack.clear(15);
		this.clearThrone();

		tick = getTickCount();
        Pather.moveTo(15093, me.classid === ClassID.Paladin ? 5029 : 5039);

MainLoop:
		while (true) {
            if (getDistance(me, 15093, me.classid === ClassID.Paladin ? 5029 : 5039) > 3) {
                Pather.moveTo(15093, me.classid === ClassID.Paladin ? 5029 : 5039);
			}

            if (!getUnit(UnitType.NPC, UnitClassID.baalthrone)) {
				break MainLoop;
			}

			switch (this.checkThrone()) {
			case 1:
				Attack.clear(40);

				tick = getTickCount();

				Precast.doPrecast(true);

				break;
			case 2:
				Attack.clear(40);

				tick = getTickCount();

				break;
			case 4:
				Attack.clear(40);

				tick = getTickCount();

				break;
			case 3:
				Attack.clear(40);
				this.checkHydra();

				tick = getTickCount();

				break;
			case 5:
				Attack.clear(40);

				break MainLoop;
			default:
				if (getTickCount() - tick < 7e3) {
                    if (me.getState(States.POISON)) {
                        Skill.setSkill(Skills.Paladin.Cleansing, 0);
					}

					break;
				}

				if (!this.preattack()) {
					delay(100);
				}

				break;
			}

			Precast.doPrecast(false);
			delay(10);
		}

		this.clearThrone();
		Pather.moveTo(15092, 5011);
		Precast.doPrecast(true);

        while (getUnit(UnitType.NPC, UnitClassID.baalthrone)) {
			delay(500);
		}

		delay(1000);

        portal = getUnit(UnitType.Object, UniqueObjectIds.Worldstone_Chamber);

		if (portal) {
			Pather.usePortal(null, null, portal);
		} else {
			throw new Error("Couldn't find portal.");
		}

		Pather.moveTo(15213, 5908);
		Pather.makePortal();
		Pather.moveTo(15170, 5950);
		delay(1000);
		say("3");

		while (!this.playerIn()) {
			delay(250);
		}

		Pather.moveTo(15134, 5923);
        Attack.kill(UnitClassID.baalcrab); // Baal
		Pickit.pickItems();

		return true;
	};

	this.clearArea = function (area) {
		Pather.journeyTo(area);
		Attack.clearLevel(0);
		say("Done clearing area: " + area);
	};

	// Quests
	this.radament = function () {
		if (!Config.Rusher.Radament) {
			return false;
		}

		say("starting radament");

		var i, radaCoords, rada, radaPreset, returnSpot,
			moveIntoPos = function (unit, range) {
				var i, coordx, coordy,
					coords = [],
					angle = Math.round(Math.atan2(me.y - unit.y, me.x - unit.x) * 180 / Math.PI),
					angles = [0, 15, -15, 30, -30, 45, -45, 60, -60, 75, -75, 90, -90, 105, -105, 120, -120, 135, -135, 150, -150, 180];

				for (i = 0; i < angles.length; i += 1) {
					coordx = Math.round((Math.cos((angle + angles[i]) * Math.PI / 180)) * range + unit.x);
					coordy = Math.round((Math.sin((angle + angles[i]) * Math.PI / 180)) * range + unit.y);

					try {
						if (!(getCollision(unit.area, coordx, coordy) & 0x1)) {
							coords.push({
								x: coordx,
								y: coordy
							});
						}
					} catch (e) {

					}
				}

				if (coords.length > 0) {
					coords.sort(Sort.units);

					return Pather.moveToUnit(coords[0]);
				}

				return false;
			};

        Pather.useWaypoint(Areas.Act2.A2_Sewers_Level_2, true);
		Precast.doPrecast(false);
        Pather.moveToExit(Areas.Act2.A2_Sewers_Level_3, true);

        radaPreset = getPresetUnit(Areas.Act2.A2_Sewers_Level_3, UnitType.Object, UniqueObjectIds.Horadric_Scroll_Chest);
		radaCoords = {
            area: Areas.Act2.A2_Sewers_Level_3,
			x: radaPreset.roomx * 5 + radaPreset.x,
			y: radaPreset.roomy * 5 + radaPreset.y
		};

		moveIntoPos(radaCoords, 50);

		for (i = 0; i < 3; i += 1) {
            rada = getUnit(UnitType.NPC, UnitClassID.radament);

			if (rada) {
				break;
			}

			delay(500);
		}

		if (rada) {
			moveIntoPos(rada, 60);
		} else {
			print("radament unit not found");
		}

		Attack.securePosition(me.x, me.y, 35, 3000);
		Pather.makePortal();
		say("1");

		while (!this.playerIn()) {
			delay(200);
		}

        Attack.kill(UnitClassID.radament); // Radament

		returnSpot = {
			x: me.x,
			y: me.y
		};

		say("2");
		Pickit.pickItems();
		Attack.securePosition(me.x, me.y, 30, 3000);

		while (this.playerIn()) {
			delay(200);
		}

		Pather.moveToUnit(returnSpot);
		Pather.makePortal();
		say("all in");

		while (!this.playerIn()) {
			delay(200);
		}

        while (getUnit(UnitType.Item, ItemClassIds.Book_Of_Skill)) {
			delay(1000);
		}

		while (this.playerIn()) {
			delay(200);
		}

		Pather.usePortal(null, null);

		return true;
	};

	this.lamesen = function () {
		if (!Config.Rusher.LamEsen) {
			return false;
		}

		say("starting lamesen");

        if (!Town.goToTown() || !Pather.useWaypoint(Areas.Act3.Kurast_Bazaar, true)) {
			throw new Error("Lam Essen quest failed");
		}

		Precast.doPrecast(false);

        if (!Pather.moveToExit(Areas.Act3.Ruined_Temple, true) || !Pather.moveToPreset(me.area, UnitType.Object, UniqueObjectIds.Lam_Esens_Tome)) {
			throw new Error("Lam Essen quest failed");
		}

		Attack.securePosition(me.x, me.y, 30, 2000);
		Pather.makePortal();
		say("1");

		while (!this.playerIn()) {
			delay(200);
		}

		while (this.playerIn()) {
			delay(200);
		}

		Pather.usePortal(null, null);

		return true;
	};

	this.izual = function () {
		if (!Config.Rusher.Izual) {
			return false;
		}

		say("starting izual");

		var i, izualCoords, izual, izualPreset, returnSpot,
			moveIntoPos = function (unit, range) {
				var i, coordx, coordy,
					coords = [],
					angle = Math.round(Math.atan2(me.y - unit.y, me.x - unit.x) * 180 / Math.PI),
					angles = [0, 15, -15, 30, -30, 45, -45, 60, -60, 75, -75, 90, -90, 105, -105, 120, -120, 135, -135, 150, -150, 180];

				for (i = 0; i < angles.length; i += 1) {
					coordx = Math.round((Math.cos((angle + angles[i]) * Math.PI / 180)) * range + unit.x);
					coordy = Math.round((Math.sin((angle + angles[i]) * Math.PI / 180)) * range + unit.y);

					try {
						if (!(getCollision(unit.area, coordx, coordy) & 0x1)) {
							coords.push({
								x: coordx,
								y: coordy
							});
						}
					} catch (e) {

					}
				}

				if (coords.length > 0) {
					coords.sort(Sort.units);

					return Pather.moveToUnit(coords[0]);
				}

				return false;
			};

        Pather.useWaypoint(Areas.Act4.City_Of_The_Damned, true);
		Precast.doPrecast(false);
        Pather.moveToExit(Areas.Act4.Plains_Of_Despair, true);

        izualPreset = getPresetUnit(Areas.Act4.Plains_Of_Despair, UnitType.NPC, UnitClassID.izual);
		izualCoords = {
            area: Areas.Act4.Plains_Of_Despair,
			x: izualPreset.roomx * 5 + izualPreset.x,
			y: izualPreset.roomy * 5 + izualPreset.y
		};

		moveIntoPos(izualCoords, 50);

		for (i = 0; i < 3; i += 1) {
            izual = getUnit(UnitType.NPC, UnitClassID.izual);

			if (izual) {
				break;
			}

			delay(500);
		}

		if (izual) {
			moveIntoPos(izual, 60);
		} else {
			print("izual unit not found");
		}

		returnSpot = {
			x: me.x,
			y: me.y
		};

		Attack.securePosition(me.x, me.y, 30, 3000);
		Pather.makePortal();
		say("1");

		while (!this.playerIn()) {
			delay(200);
		}

        Attack.kill(UnitClassID.izual); // Izual
		Pickit.pickItems();
		say("2");
		Pather.moveToUnit(returnSpot);

		while (this.playerIn()) {
			delay(200);
		}

		Pather.usePortal(null, null);

		return true;
	};

	this.shenk = function () {
		if (!Config.Rusher.Shenk) {
			return false;
		}

		say("starting shenk");

        Pather.useWaypoint(Areas.Act5.Frigid_Highlands, true);
		Precast.doPrecast(false);
		Pather.moveTo(3846, 5120);
		Attack.securePosition(me.x, me.y, 30, 3000);
		Pather.makePortal();
		say("1");

		while (!this.playerIn()) {
			delay(200);
		}

		Attack.kill(getLocaleString(22435)); // Shenk
		Pickit.pickItems();
		Pather.moveTo(3846, 5120);
		say("2");

		while (this.playerIn()) {
			delay(200);
		}

		Pather.usePortal(null, null);

		return true;
	};

	this.anya = function () {
		if (!Config.Rusher.Anya) {
			return false;
		}

		say("starting anya");

		var anya;

        if (!Town.goToTown() || !Pather.useWaypoint(Areas.Act5.Crystalized_Passage, true)) {
			throw new Error("Anya quest failed");
		}

		Precast.doPrecast(false);

        if (!Pather.moveToExit(Areas.Act5.Frozen_River, true) || !Pather.moveToPreset(me.area, UnitType.Object, UniqueObjectIds.Drehya_Outside_Town)) {
			throw new Error("Anya quest failed");
		}

		Attack.securePosition(me.x, me.y, 30, 2000);

        anya = getUnit(UnitType.Object, UniqueObjectIds.Frozen_Anya);

		if (anya) {
			Pather.moveToUnit(anya);
			sendPacket(1, 0x13, 4, 0x2, 4, anya.gid); // Rusher should be able to interact so quester can get the potion without entering
			delay(1000 + me.ping);
			me.cancel();
		}

		Pather.makePortal();
		say("1");

		while (!this.playerIn()) {
			delay(200);
		}

        while (getUnit(UnitType.Object, UniqueObjectIds.Frozen_Anya)) {
			delay(1000);
		}

		say("2"); // Mainly for non-questers to know when to get the scroll of resistance

		while (this.playerIn()) {
			delay(200);
		}

		Pather.usePortal(null, null);

		return true;
	};

	print("Loading RushThread");

	var i, command,
		current = 0,
		sequence = [
			"andariel", "radament", "cube", "amulet", "staff", "summoner", "duriel", "lamesen",
			"travincal", "mephisto", "izual", "diablo", "shenk", "anya", "ancients", "baal"
		];

	this.scriptEvent = function (msg) {
		command = msg;
	};

	addEventListener("scriptmsg", this.scriptEvent);

	// Start
	Config.init(false);
	Pickit.init(false);
	Attack.init();
	Storage.Init();
	CraftingSystem.buildLists();
	Runewords.init();
	Cubing.init();

	while (true) {
		if (command) {
			switch (command) {
			case "go":
				// End run if entire sequence is done or if Config.Rusher.LastRun is done
				if (current >= sequence.length || (Config.Rusher.LastRun && current > sequence.indexOf(Config.Rusher.LastRun))) {
					delay(3000);
					say("bye ~");

					while (Misc.getPlayerCount() > 1) {
						delay(1000);
					}

					scriptBroadcast("quit");

					return true;
				}

				try {
					this[sequence[current]]();
				} catch (sequenceError) {
					say(sequenceError.message);
					say("2");
					Town.goToTown();
				}

				current += 1;

				command = "go";

				break;
			default:
				if (command.split(" ")[0] !== undefined && command.split(" ")[0] === "skiptoact") {
					if (!isNaN(parseInt(command.split(" ")[1], 10))) {
						switch (parseInt(command.split(" ")[1], 10)) {
						case 2:
							current = sequence.indexOf("andariel") + 1;

							break;
						case 3:
							current = sequence.indexOf("duriel") + 1;

							break;
						case 4:
							current = sequence.indexOf("mephisto") + 1;

							break;
						case 5:
							current = sequence.indexOf("diablo") + 1;

							break;
						}
					}
				} else if (command.split(" ")[0] !== undefined && command.split(" ")[0] === "clear") {
					this.clearArea(Number(command.split(" ")[1]));
					Town.goToTown();

					command = "go";
				} else {
					for (i = 0; i < sequence.length; i += 1) {
						if (command && sequence[i].match(command, "gi")) {
							current = i;

							break;
						}
					}

					Town.goToTown();

					command = "go";

					break;
				}

				break;
			}

			//command = false;
		}

		delay(100);
	}

	return true;
}
