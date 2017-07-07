/**
*	@filename	BaalHelper.js
*	@author		kolton
*	@desc		help the leading player in clearing Throne of Destruction and killing Baal
*/
if (!isIncluded("common/Enums.js")) { include("common/Enums.js"); };

function BaalHelper() { // experi-mental
	this.preattack = function () {
		var check;

		switch (me.classid) {
            case ClassID.Sorceress: // Sorceress
			switch (Config.AttackSkill[3]) {
                case Skills.Sorceress.Lightning:
                case Skills.Sorceress.Chain_Lightning:
                case Skills.Sorceress.Meteor:
                case Skills.Sorceress.Blizzard:
                case Skills.Sorceress.Frozen_Orb:
                    if (me.getState(States.SKILLDELAY)) {
                        while (me.getState(States.SKILLDELAY)) {
						delay(100);
					}
				} else {
					return Skill.cast(Config.AttackSkill[1], 0, 15094 + rand(-1, 1), 5028);
				}

				break;
			}

			break;
            case ClassID.Paladin: // Paladin
                if (Config.AttackSkill[3] === Skills.Paladin.Blessed_Hammer) {
				if (Config.AttackSkill[4] > 0) {
					Skill.setSkill(Config.AttackSkill[4], 0);
				}

				return Skill.cast(Config.AttackSkill[3], 1);
			}

			break;
            case ClassID.Druid: // Druid
                if (Config.AttackSkill[3] === Skills.Druid.Tornado) {
				return Skill.cast(Config.AttackSkill[3], 0, 15094 + rand(-1, 1), 5028);
			}

			break;
            case ClassID.Assassin: // Assassin
			if (Config.UseTraps) {
				check = ClassAttack.checkTraps({x: 15094, y: 5028});

				if (check) {
					return ClassAttack.placeTraps({x: 15094, y: 5028}, 5);
				}
			}

            if (Config.AttackSkill[3] === Skills.Assassin.Shock_Field) { // shock-web
				return Skill.cast(Config.AttackSkill[3], 0, 15094, 5028);
			}

			break;
		}

		return false;
	};

	this.checkThrone = function () {
		var monster = getUnit(1);

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

	if (Config.BaalHelper.KillNihlathak) {
		include("bots/Nihlathak.js");

		try {
			Nihlathak.call();
		} catch (e) {
			print(e);
		}
	}

	if (Config.BaalHelper.FastChaos) {
		include("bots/FastDiablo.js");

		try {
			Town.goToTown();
			FastDiablo.call();
		} catch (e2) {
			print(e2);
		}
	}

	var i, tick, portal, party, entrance;

	Town.goToTown(5);
	Town.doChores();
    Pather.useWaypoint(Config.RandomPrecast ? "random" : Areas.Act5.The_Worldstone_Keep_Level_2);
	Precast.doPrecast(true);

	if (Config.BaalHelper.SkipTP) {
        if (me.area !== Areas.Act5.The_Worldstone_Keep_Level_2) {
            Pather.useWaypoint(Areas.Act5.The_Worldstone_Keep_Level_2);
		}

        if (!Pather.moveToExit([Areas.Act5.The_Worldstone_Keep_Level_3, Areas.Act5.Throne_Of_Destruction], false)) {
			throw new Error("Failed to move to WSK3.");
		}

WSKLoop:
		for (i = 0; i < Config.BaalHelper.Wait; i += 1) {
			party = getParty();

			if (party) {
				do {
                    if ((!Config.Leader || party.name === Config.Leader) && party.area === Areas.Act5.Throne_Of_Destruction) {
						break WSKLoop;
					}
				} while (party.getNext());
			}

			delay(1000);
		}

		if (i === Config.BaalHelper.Wait) {
			throw new Error("Player wait timed out (" + (Config.Leader ? "Leader not" : "No players") + " found in Throne)");
		}

		for (i = 0; i < 3; i += 1) {
            entrance = getUnit(UnitType.Warp, 82);

			if (entrance) {
				break;
			}

			delay(200);
		}

		if (entrance) {
			Pather.moveTo(entrance.x > me.x ? entrance.x - 5 : entrance.x + 5, entrance.y > me.y ? entrance.y - 5 : entrance.y + 5);
		}

        if (!Pather.moveToExit([Areas.Act5.The_Worldstone_Keep_Level_3, Areas.Act5.Throne_Of_Destruction], false)) {
			throw new Error("Failed to move to WSK3.");
		}

        if (!Pather.moveToExit(Areas.Act5.Throne_Of_Destruction, true)) {
			throw new Error("Failed to move to Throne of Destruction.");
		}

		if (!Pather.moveTo(15113, 5040)) {
			D2Bot.printToConsole("path fail");
		}
	} else {
        Pather.useWaypoint(Areas.Act5.Harrogath);
		Town.move("portalspot");

		for (i = 0; i < Config.BaalHelper.Wait; i += 1) {
            if (Pather.getPortal(Areas.Act5.Throne_Of_Destruction, Config.Leader || null) && Pather.usePortal(Areas.Act5.Throne_Of_Destruction, Config.Leader || null)) {
				break;
			}

			delay(1000);
		}

		if (i === Config.BaalHelper.Wait) {
			throw new Error("Player wait timed out (" + (Config.Leader ? "No leader" : "No player") + " portals found)");
		}
	}

    if (Config.BaalHelper.DollQuit && getUnit(UnitType.NPC, UnitClassID.bonefetish7)) {
		print("Soul Killers found.");

		return true;
	}

	Precast.doPrecast(false);
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

	if (Config.BaalHelper.KillBaal) {
		Pather.moveTo(15092, 5011);
		Precast.doPrecast(false);

        while (getUnit(UnitType.NPC, UnitClassID.baalthrone)) {
			delay(500);
		}

		delay(1000);
		Pather.moveTo(15092, 5011);

        portal = getUnit(UnitType.Object, UniqueObjectIds.Worldstone_Chamber);

		if (portal) {
			Pather.usePortal(null, null, portal);
		} else {
			throw new Error("Couldn't find portal.");
		}

		Pather.moveTo(15134, 5923);
        Attack.kill(UnitClassID.baalcrab); // Baal
		Pickit.pickItems();
	} else {
		while (true) {
			delay(500);
		}
	}

	return true;
}