function BaalHelper() { // experi-mental
	this.preattack = function () {
		var check;

		switch (me.classid) {
		case 0:
			break;
		case 1:
			break;
		case 2:
			break;
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
		case 4:
			break;
		case 5:
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
			pos = [15097, 5054, 15085, 5053, 15085, 5040, 15098, 5040, 15099, 5022, 15086, 5024]

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

	if (Config.BaalHelper.FaskChaos) {
		include("bots/FastDiablo.js");

		try {
			Town.goToTown();
			FastDiablo();
		} catch (e) {
			print(e);
		}
	}

	var i, tick, portal;

	Town.goToTown(5);
	Town.move("portalspot");

	for (i = 0; i < 180; i += 1) {
		if (Pather.usePortal(131, null)) {
			break;
		}

		delay(1000);
	}

	if (i === 60) {
		throw new Error("No portals to Throne");
	}

	Precast.doPrecast(false);
	this.clearThrone();
	Pather.moveTo(15093, me.classid === 3 ? 5029 : 5039);

	tick = getTickCount();

MainLoop: while (true) {
		if (getDistance(me, 15093, me.classid === 3 ? 5029 : 5039) > 3) {
			Pather.moveTo(15093, me.classid === 3 ? 5029 : 5039);
		}

		if (!getUnit(1, 543)) {
			break MainLoop;
		}

		switch (this.checkThrone()) {
		case 1:
			Attack.clear(40);
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
			this.preattack();
			break;
		}

		Precast.doPrecast(false);
		delay(100);
	}

	Pather.moveTo(15092, 5011);
	Precast.doPrecast(false);

	while (getUnit(1, 543)) {
		delay(500);
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