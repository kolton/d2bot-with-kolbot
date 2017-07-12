/**
 *	@filename	Baal.js
 *	@author		kolton, modified by YGM
 *	@desc		clear Throne of Destruction and kill Baal
 */

function Baal() {
	var portal, tick;
		
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
			    check = ClassAttack.checkTraps({ x: 15094, y: 5028 });

				if (check) {
					return ClassAttack.placeTraps({x: 15094, y: 5028}, 5);
				}
			}

			if (Config.AttackSkill[3] === 256) { // shock-web
			    return Skill.cast(Config.AttackSkill[3], 0, 15094 + rand(-1, 1), 5028);
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
					switch (Math.floor(Math.random() * 2)) {
					    case 0:
					        Pather.moveTo(15075 + rand(0, 2), 5002);
					        break;
					    case 1:
					        Pather.moveTo(15113 + rand(0, 2), 5006 + rand(-1, 1));
					        break;
					}
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
	Pather.useWaypoint(Config.RandomPrecast ? "random" : 129);
	Precast.doPrecast(true);

	if (me.area !== 129) {
		Pather.useWaypoint(129);
	}

	if (!Pather.moveToExit([130, 131], true)) {
		throw new Error("Failed to move to Throne of Destruction.");
	}

	Pather.moveTo(15095 + rand(-1, 1), 5029 + rand(-1, 1));

	if (Config.Baal.DollQuit && getUnit(1, 691)) {

		return true;
	}

	if (Config.Baal.SoulQuit && getUnit(1, 641)) {

		return true;
	}

	if (Config.PublicMode) {
	    switch (rand(0, 4)) {
	        case 0:
	            Pather.moveTo(15077 + rand(-1 , 2), 5041 + rand(0, 2));
	            break;
	        case 1:
	            Pather.moveTo(15075 + rand(-1, 2), 5069 + rand(0, 2));
	            break;
	        case 2:
	            Pather.moveTo(15115 + rand(-1, 2), 5070 + rand(0, 2));
	            break;
	        case 3:
	            Pather.moveTo(15113 + rand(0, 2), 5042 + rand(0, 2));
	            break;
	        case 4:
	            Pather.moveTo(15112 + rand(0, 2), 5010 + rand(0, 2));
	            break;
		}
		Pather.makePortal();
		Attack.clear(15);
	}

	this.clearThrone();

	if (Config.PublicMode) {
		var i, msg = "safe";
		if (Config.Baal.SafeProfiles.length > 0) {
		    for (i = 0; i < Config.Baal.SafeProfiles.length; i++) {
		        sendCopyData(null, Config.Baal.SafeProfiles[i], 6969, msg);
		    }
		}
		else {
		Precast.doPrecast(true);
		}
	}

	tick = getTickCount();

	Pather.moveTo(15094 - rand(-2, 2), me.classid === 3 ? 5029 + rand(0, 2) : 5038 + rand(0, 2));

MainLoop:
	while (true) {
		if (getDistance(me, 15094, me.classid === 3 ? 5029 : 5038) > 3) {
			Pather.moveTo(15094 - rand(-2, 2), me.classid === 3 ? 5029 + rand(0, 2) : 5038 + rand(0, 2));
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

	if (Config.Baal.KillBaal) {

		Pather.moveTo(15090, 5008);
		delay(5000);
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