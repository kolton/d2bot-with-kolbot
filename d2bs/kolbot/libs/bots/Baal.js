/**
 *	@filename	Baal.js
 *	@author		kolton, modified by YGM
 *	@desc		clear Throne of Destruction and kill Baal
 */

function Baal() {
	var portal, tick,
		RandomPrecast = Config.Baal.RandomPrecast,
		DollQuit = Config.Baal.DollQuit,
		SoulQuit = Config.Baal.SoulQuit,
		KillBaal = Config.Baal.KillBaal,
		hotTPMessage = Config.Baal.HotTPMessage,
		safeTPMessage = Config.Baal.SafeTPMessage,
		baalMessage = Config.Baal.BaalMessage;

	this.preattack = function () {
		var check;
		switch (me.classid) {
		case 1:
			// Sorceress
			switch (Config.AttackSkill[1]) {
			case 49:
			case 53:
			case 64:
				if (me.getState(121)) {
					delay(500);
				} else {
					Skill.cast(Config.AttackSkill[1], 0, 15094, 5028);
				}

				break;
			case 56:
				if (me.getState(121)) {
					delay(500);
				} else {
					Skill.cast(Config.AttackSkill[1], 0, 15093, 5028);
				}

				break;
			case 59:
				if (me.getState(121)) {
					delay(500);
				} else {
					Skill.cast(Config.AttackSkill[1], 0, 15095, 5028);
				}

				break;
			}

			return true;
		case 3:
			// Paladin
			if (Config.AttackSkill[3] !== 112) {
				return false;
			}

			if (getDistance(me, 15094, 5029) > 3) {
				Pather.moveTo(15094, 5029);
			}

			if (Config.AttackSkill[4] > 0) {
				Skill.setSkill(Config.AttackSkill[4], 0);
			}

			Skill.cast(Config.AttackSkill[3], 1);

			return true;
		case 5:
			// Druid
			if (Config.AttackSkill[3] === 245) {
				Skill.cast(Config.AttackSkill[3], 0, 15094, 5028);
				return true;
			}
			break;
		case 6:
			// Assassin
			if (Config.UseTraps) {
				check = ClassAttack.checkTraps({
					x: 15094,
					y: 5028
				});

				if (check) {
					ClassAttack.placeTraps({
						x: 15094,
						y: 5028
					}, 5);

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
			pos = [15094, 5022, 15094, 5041, 15094, 5060, 15094, 5041, 15094, 5022];

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
			Attack.clear(25);
		}
	};

	this.checkHydra = function () {
		var monster = getUnit(1, "hydra");
		if (monster) {
			do {
				if (monster.mode !== 12 && monster.getStat(172) !== 2) {
					Pather.moveTo(15072, 5002);
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

	this.announce = function () {
		var count, string, souls, dolls,
			monster = getUnit(1);

		if (monster) {
			count = 0;

			do {
				if (Attack.checkMonster(monster) && monster.y < 5094) {
					if (getDistance(me, monster) <= 40) {
						count += 1;
					}

					if (!souls && monster.classid === 641) {
						souls = true;
					}

					if (!dolls && monster.classid === 691) {
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

	if (RandomPrecast) {
		Pather.useWaypoint("random");
		Precast.doPrecast(true);
	} else {
		Pather.useWaypoint(129);
		Precast.doPrecast(true);
	}

	if (me.area !== 129) {
		Pather.useWaypoint(129);
	}

	if (!Pather.moveToExit([130, 131], true)) {
		throw new Error("Failed to move to Throne of Destruction.");
	}

	Pather.moveTo(15095, 5029);

	if ((SoulQuit && getUnit(1, 691)) || (DollQuit && getUnit(1, 690))) {
		say("Too many undead soul killers and undead stygian dolls, next game!");
		print("Undead soul killers or Undead stygian dolls found, ending script.");

		return true;
	}

	if (Config.PublicMode) {
		this.announce();
		Pather.moveTo(15118, 5002);
		Pather.makePortal();
		say(hotTPMessage);
		Attack.clear(15);
	}

	this.clearThrone();

	if (Config.PublicMode) {
		Pather.moveTo(15118, 5045);
		Pather.makePortal();
		say(safeTPMessage);
		Precast.doPrecast(true);
	}

	tick = getTickCount();

	Pather.moveTo(15094, me.classid === 3 ? 5029 : 5038);

MainLoop:
	while (true) {
		if (getDistance(me, 15094, me.classid === 3 ? 5029 : 5038) > 3) {
			Pather.moveTo(15094, me.classid === 3 ? 5029 : 5038);
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

		delay(10);
	}

	if (KillBaal) {
		if (Config.PublicMode) {
			say(baalMessage);
		}

		Pather.moveTo(15090, 5008);
		delay(7000);
		Precast.doPrecast(true);

		while (getUnit(1, 543)) {
			delay(500);
		}

		portal = getUnit(2, 563);

		if (portal) {
			Pather.usePortal(null, null, portal);
		} else {
			throw new Error("Couldn't find portal.");
		}

		Pather.moveTo(15134, 5923);
		Attack.kill(544); // Baal
		Pickit.pickItems();
	}

	return true;
}