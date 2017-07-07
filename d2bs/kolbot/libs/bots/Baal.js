/**
 *	@filename	Baal.js
 *	@author		kolton, modified by YGM
 *	@desc		clear Throne of Destruction and kill Baal
 */
if (!isIncluded("common/Enums.js")) { include("common/Enums.js"); };

function Baal() {
	var portal, tick;

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
			pos = [15094, 5022, 15094, 5041, 15094, 5060, 15094, 5041, 15094, 5022];

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
			Attack.clear(25);
		}
	};

	this.checkHydra = function () {
        var monster = getUnit(UnitType.NPC, "hydra");
		if (monster) {
			do {
                if (monster.mode !== NPCModes.dead && monster.getStat(Stats.alignment) !== 2) {
					Pather.moveTo(15072, 5002);
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

	this.announce = function () {
		var count, string, souls, dolls,
            monster = getUnit(UnitType.NPC);

		if (monster) {
			count = 0;

			do {
				if (Attack.checkMonster(monster) && monster.y < 5094) {
					if (getDistance(me, monster) <= 40) {
						count += 1;
					}

                    if (!souls && monster.classid === UnitClassID.willowisp7) {
						souls = true;
					}

                    if (!dolls && monster.classid === UnitClassID.bonefetish7) {
						dolls = true;
					}
				}
			} while (monster.getNext());
		}

		if (count > 30) {
			string = "DEADLY!!!" + " " + count + " monster" + (count > 1 ? "s " : " ") + "nearby.";
		} else if (count > 20) {
			string = "Lethal!" + " " + count + " monster" + (count > 1 ? "s " : " ") + "nearby.";
		} else if (count > 10) {
			string = "Dangerous!" + " " + count + " monster" + (count > 1 ? "s " : " ") + "nearby.";
		} else if (count > 0) {
			string = "Warm" + " " + count + " monster" + (count > 1 ? "s " : " ") + "nearby.";
		} else {
			string = "Cool TP. No immediate monsters.";
		}

		if (souls) {
			string += " Souls ";

			if (dolls) {
				string += "and Dolls ";
			}

			string += "in area.";
		} else if (dolls) {
			string += " Dolls in area.";
		}

		say(string);
	};

	Town.doChores();
    Pather.useWaypoint(Config.RandomPrecast ? "random" : Areas.Act5.The_Worldstone_Keep_Level_2);
	Precast.doPrecast(true);

    if (me.area !== Areas.Act5.The_Worldstone_Keep_Level_2) {
        Pather.useWaypoint(Areas.Act5.The_Worldstone_Keep_Level_2);
	}

    if (!Pather.moveToExit([Areas.Act5.The_Worldstone_Keep_Level_3, Areas.Act5.Throne_Of_Destruction], true)) {
		throw new Error("Failed to move to Throne of Destruction.");
	}

	Pather.moveTo(15095, 5029);

    if (Config.Baal.DollQuit && getUnit(UnitType.NPC, UnitClassID.bonefetish7)) {
		say("Dolls found! NG.");

		return true;
	}

    if (Config.Baal.SoulQuit && getUnit(UnitType.NPC, UnitClassID.willowisp7)) {
		say("Souls found! NG.");

		return true;
	}

	if (Config.PublicMode) {
		this.announce();
		Pather.moveTo(15118, 5002);
		Pather.makePortal();
		say(Config.Baal.HotTPMessage);
		Attack.clear(15);
	}

	this.clearThrone();

	if (Config.PublicMode) {
		Pather.moveTo(15118, 5045);
		Pather.makePortal();
		say(Config.Baal.SafeTPMessage);
		Precast.doPrecast(true);
	}

	tick = getTickCount();

    Pather.moveTo(15094, me.classid === ClassID.Paladin ? 5029 : 5038);

MainLoop:
	while (true) {
        if (getDistance(me, 15094, me.classid === ClassID.Paladin ? 5029 : 5038) > 3) {
            Pather.moveTo(15094, me.classid === ClassID.Paladin ? 5029 : 5038);
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

		delay(10);
	}

	if (Config.Baal.KillBaal) {
		if (Config.PublicMode) {
			say(Config.Baal.BaalMessage);
		}

		Pather.moveTo(15090, 5008);
		delay(5000);
		Precast.doPrecast(true);

        while (getUnit(UnitType.NPC, UnitClassID.baalthrone)) {
			delay(500);
		}

        portal = getUnit(UnitType.Object, UniqueObjectIds.Worldstone_Chamber);

		if (portal) {
			Pather.usePortal(null, null, portal);
		} else {
			throw new Error("Couldn't find portal.");
		}

		Pather.moveTo(15134, 5923);
        Attack.kill(UnitClassID.baalcrab); // Baal
		Pickit.pickItems();
	}

	return true;
}