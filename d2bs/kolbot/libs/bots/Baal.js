/**
*	@filename	Baal.js
*	@author		kolton
*	@desc		clear Throne of Destruction and kill Baal
*/

function Baal() {
	var tick, portal;

	this.preattack = function () {
		var check;

		switch (me.classid) {
		case 1:
			if ([56, 59, 64].indexOf(Config.AttackSkill[1]) > -1) {
				if (me.getState(121)) {
					delay(500);
				} else {
					Skill.cast(Config.AttackSkill[1], 0, 15093, 5029);
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
		case 6:
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
		var i,
			pos = [15097, 5054, 15085, 5053, 15085, 5040, 15098, 5040, 15099, 5022, 15086, 5024];

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

	Town.doChores();
	Pather.useWaypoint(129);
	Precast.doPrecast(true);

	if (!Pather.moveToExit([130, 131], true)) {
		throw new Error("Failed to move to Throne of Destruction.");
	}

	if (Config.PublicMode) {
		Pather.moveTo(15113, 5040);
		Pather.makePortal();
		say(Config.Baal.HotTPMsg);
	}

	this.clearThrone();

	if (Config.PublicMode) {
		say(Config.Baal.SafeTPMsg);
	}

	Pather.moveTo(15093, me.classid === 3 ? 5029 : 5039);

	tick = getTickCount();

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
			Precast.doPrecast(true);
			break;
		case 2:
		case 4:
			Attack.clear(40);

			break;
		case 3:
			Attack.clear(40);

			this.checkHydra();
			break;
		case 5:
			Attack.clear(40);

			break MainLoop;
		default:
			if (!this.preattack()) {
				delay(100);
			}

			break;
		}

		Precast.doPrecast(false);
		delay(10);
	}

	Pather.moveTo(15092, 5011);
	Precast.doPrecast(true);

	while (getUnit(1, 543)) {
		delay(500);
	}

	if (Config.PublicMode) {
		say(Config.Baal.BaalMsg);
	}

	delay(1000);

	portal = getUnit(2, 563);

	if (portal) {
		Pather.usePortal(null, null, portal);
	} else {
		throw new Error("Couldn't find portal.");
	}

	Pather.moveTo(15134, 5923);
	Attack.kill(544); // Baal
	Pickit.pickItems();

	return true;
}