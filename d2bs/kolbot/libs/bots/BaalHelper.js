/**
*	@filename	BaalHelper.js
*	@author		kolton
*	@desc		help the leading player in clearing Throne of Destruction and killing Baal
*/

function BaalHelper() { // experi-mental
	this.preattack = function () {
		var check;

		switch (me.classid) {
		case 1:
			if ([56, 59, 64].indexOf(Config.AttackSkill[1]) > -1) {
				if (me.getState(121)) {
					delay(500);
				} else {
					Skill.cast(Config.AttackSkill[1], 0, 15093, 5024);
				}
			}

			return true;
		case 3: // Paladin
			if (Config.AttackSkill[3] !== 112) {
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
		case 5: // Druid
			if (Config.AttackSkill[3] === 245) {
				Skill.cast(Config.AttackSkill[3], 0, 15093, 5029);

				return true;
			}

			break;
		case 6: // Assassin
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
		var monster = getUnit(1, "hydra");

		if (monster) {
			do {
				if (monster.mode !== 12 && monster.getStat(172) !== 2) {
					Pather.moveTo(15118, 5002);

					while (monster.mode !== 12) {
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
			Nihlathak();
		} catch (e) {
			print(e);
		}
	}

	if (Config.BaalHelper.FastChaos) {
		include("bots/FastDiablo.js");

		try {
			Town.goToTown();
			FastDiablo();
		} catch (e2) {
			print(e2);
		}
	}

	var i, tick, portal, party, entrance;

	Town.goToTown(5);
	Town.doChores();

	if (Config.RandomPrecast) {
		Pather.useWaypoint("random");
		Precast.doPrecast(true);
	} else {
		Pather.useWaypoint(129);
		Precast.doPrecast(true);
	}

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
					if (party.area === 131) {
						break WSKLoop;
					}
				} while (party.getNext());
			}

			delay(1000);
		}

		if (i === Config.BaalHelper.Wait) {
			throw new Error("No players in Throne.");
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

		if (!Pather.moveToExit(131, true) || !Pather.moveTo(15113, 5040)) {
			throw new Error("Failed to move to Throne of Destruction.");
		}
	} else {
		Pather.useWaypoint(109);
		Town.move("portalspot");

		for (i = 0; i < Config.BaalHelper.Wait; i += 1) {
			if (Pather.usePortal(131, null)) {
				break;
			}

			delay(1000);
		}

		if (i === Config.BaalHelper.Wait) {
			throw new Error("No portals to Throne.");
		}
	}

	if (Config.BaalHelper.DollQuit && getUnit(1, 691)) {
		print("Soul Killers found.");

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