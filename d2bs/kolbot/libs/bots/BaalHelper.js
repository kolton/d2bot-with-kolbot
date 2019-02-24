/**
*	@filename	BaalHelper.js
*	@author		kolton
*	@desc		help the leading player in clearing Throne of Destruction and killing Baal
*/

function BaalHelper() { // experi-mental
	this.preattack = function () {
		var check;

		switch (me.classid) {
		case 1: // Sorceress
			switch (Config.AttackSkill[3]) {
			case 49:
			case 53:
			case 56:
			case 59:
			case 64:
				if (me.getState(121)) {
					while (me.getState(121)) {
						delay(100);
					}
				} else {
					return Skill.cast(Config.AttackSkill[1], 0, 15094 + rand(-1, 1), 5028);
				}

				break;
			}

			break;
		case 3: // Paladin
			if (Config.AttackSkill[3] === 112) {
				if (Config.AttackSkill[4] > 0) {
					Skill.setSkill(Config.AttackSkill[4], 0);
				}

				return Skill.cast(Config.AttackSkill[3], 1);
			}

			break;
		case 5: // Druid
			if (Config.AttackSkill[3] === 245) {
				return Skill.cast(Config.AttackSkill[3], 0, 15094 + rand(-1, 1), 5028);
			}

			break;
		case 6: // Assassin
			if (Config.UseTraps) {
				check = ClassAttack.checkTraps({x: 15094, y: 5028});

				if (check) {
					return ClassAttack.placeTraps({x: 15094, y: 5028}, 5);
				}
			}

			if (Config.AttackSkill[3] === 256) { // shock-web
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
					case 23:
					case 62:
						return 1;
					case 105:
					case 381:
						return 2;
					case 557:
						return 3;
					case 558:
						return 4;
					case 571:
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
			monster = getUnit(1, 691);

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
		var hydra = getUnit(1, getLocaleString(3325));

		if (hydra) {
			do {
				if (hydra.mode !== 12 && hydra.getStat(172) !== 2) {
					Pather.moveTo(15118, 5002);

					while (hydra.mode !== 12) {
						delay(500);

						if (!copyUnit(hydra).x) {
							break;
						}
					}

					break;
				}
			} while (hydra.getNext());
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
	Pather.useWaypoint(Config.RandomPrecast ? "random" : 129);
	Precast.doPrecast(true);

	if (Config.BaalHelper.SkipTP) {
		if (me.area !== 129) {
			Pather.useWaypoint(129);
		}

		if (!Pather.moveToExit([130, 131], false)) {
			throw new Error("Failed to move to WSK3.");
		}

WSKLoop:
		for (i = 0; i < Config.BaalHelper.Wait; i += 1) {
			party = getParty();

			if (party) {
				do {
					if ((!Config.Leader || party.name === Config.Leader) && party.area === 131) {
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
			entrance = getUnit(5, 82);

			if (entrance) {
				break;
			}

			delay(200);
		}

		if (entrance) {
			Pather.moveTo(entrance.x > me.x ? entrance.x - 5 : entrance.x + 5, entrance.y > me.y ? entrance.y - 5 : entrance.y + 5);
		}

		if (!Pather.moveToExit([130, 131], false)) {
			throw new Error("Failed to move to WSK3.");
		}

		if (!Pather.moveToExit(131, true)) {
			throw new Error("Failed to move to Throne of Destruction.");
		}

		if (!Pather.moveTo(15113, 5040)) {
			D2Bot.printToConsole("path fail");
		}
	} else {
		Pather.useWaypoint(109);
		Town.move("portalspot");

		for (i = 0; i < Config.BaalHelper.Wait; i += 1) {
			if (Pather.getPortal(131, Config.Leader || null) && Pather.usePortal(131, Config.Leader || null)) {
				break;
			}

			delay(1000);
		}

		if (i === Config.BaalHelper.Wait) {
			throw new Error("Player wait timed out (" + (Config.Leader ? "No leader" : "No player") + " portals found)");
		}
	}

	if (Config.BaalHelper.DollQuit && getUnit(1, 691)) {
		print("Undead Soul Killers found.");

		return true;
	}

	Precast.doPrecast(false);
	Attack.clear(15);
	this.clearThrone();

	tick = getTickCount();

	Pather.moveTo(15093, me.classid === 3 ? 5029 : 5039);

MainLoop:
	while (true) {
		if (getDistance(me, 15093, me.classid === 3 ? 5029 : 5039) > 3) {
			Pather.moveTo(15093, me.classid === 3 ? 5029 : 5039);
		}

		if (!getUnit(1, 543)) {
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
				if (me.getState(2)) {
					Skill.setSkill(109, 0);
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

		while (getUnit(1, 543)) {
			delay(500);
		}

		delay(1000);
		Pather.moveTo(15092, 5011);

		portal = getUnit(2, 563);

		if (portal) {
			Pather.usePortal(null, null, portal);
		} else {
			throw new Error("Couldn't find portal.");
		}

		Pather.moveTo(15134, 5923);
		Attack.kill(544); // Baal
		Pickit.pickItems();
	} else {
		while (true) {
			delay(500);
		}
	}

	return true;
}