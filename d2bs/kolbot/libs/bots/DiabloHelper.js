/**
*	@filename	DiabloHelper.js
*	@author		kolton
*	@desc		help leading player in clearing Chaos Sanctuary and killing Diablo
*/

function DiabloHelper() {
	// Sort function
	this.sort = function (a, b) {
		if (Config.BossPriority) {
			if ((a.spectype & 0x5) && (b.spectype & 0x5)) {
				return getDistance(me, a) - getDistance(me, b);
			}

			if (a.spectype & 0x5) {
				return -1;
			}

			if (b.spectype & 0x5) {
				return 1;
			}
		}

		// Entrance to Star / De Seis
		if (me.y > 5325 || me.y < 5260) {
			if (a.y > b.y) {
				return -1;
			}

			return 1;
		}

		// Vizier
		if (me.x < 7765) {
			if (a.x > b.x) {
				return -1;
			}

			return 1;
		}

		// Infector
		if (me.x > 7825) {
			if (!checkCollision(me, a, 0x1) && a.x < b.x) {
				return -1;
			}

			return 1;
		}

		return getDistance(me, a) - getDistance(me, b);
	};

	// general functions
	this.getLayout = function (seal, value) {
		var sealPreset = getPresetUnit(108, 2, seal);

		if (!seal) {
			throw new Error("Seal preset not found. Can't continue");
		}

		if (sealPreset.roomy * 5 + sealPreset.y === value || sealPreset.roomx * 5 + sealPreset.x === value) {
			return 1;
		}

		return 2;
	};

	this.initLayout = function () {
		this.vizLayout = this.getLayout(396, 5275); // 1 = "Y", 2 = "L"
		this.seisLayout = this.getLayout(394, 7773); // 1 = "2", 2 = "5"
		this.infLayout = this.getLayout(392, 7893); // 1 = "I", 2 = "J"
	};

	this.getBoss = function (name) {
		var i, boss, glow;

		while (true) {
			if (!this.preattack(name)) {
				delay(500);
			}

			glow = getUnit(2, 131);

			if (glow) {
				break;
			}
		}

		for (i = 0; i < 16; i += 1) {
			boss = getUnit(1, name);

			if (boss) {
				return Attack.clear(40, 0, name, this.sort);
			}

			delay(250);
		}

		return !!glow;
	};

	this.vizierSeal = function () {
		this.followPath(this.vizLayout === 1 ? this.starToVizA : this.starToVizB, this.sort);

		if (this.vizLayout === 1) {
			Pather.moveTo(7691, 5292);
		} else {
			Pather.moveTo(7695, 5316);
		}

		if (!this.getBoss(getLocaleString(2851))) {
			throw new Error("Failed to kill Vizier");
		}

		if (Config.FieldID) {
			Town.fieldID();
		}

		return true;
	};

	this.seisSeal = function () {
		this.followPath(this.seisLayout === 1 ? this.starToSeisA : this.starToSeisB, this.sort);

		if (this.seisLayout === 1) {
			Pather.moveTo(7771, 5196);
		} else {
			Pather.moveTo(7798, 5186);
		}

		if (!this.getBoss(getLocaleString(2852))) {
			throw new Error("Failed to kill de Seis");
		}

		if (Config.FieldID) {
			Town.fieldID();
		}

		return true;
	};

	this.infectorSeal = function () {
		this.followPath(this.infLayout === 1 ? this.starToInfA : this.starToInfB, this.sort);

		if (this.infLayout === 1) {
			delay(1);
		} else {
			Pather.moveTo(7928, 5295); // temp
		}

		if (!this.getBoss(getLocaleString(2853))) {
			throw new Error("Failed to kill Infector");
		}

		if (Config.FieldID) {
			Town.fieldID();
		}

		return true;
	};

	this.diabloPrep = function () {
		var trapCheck,
			tick = getTickCount();

		while (getTickCount() - tick < 30000) {
			if (getTickCount() - tick >= 8000) {
				switch (me.classid) {
				case 1: // Sorceress
					if ([56, 59, 64].indexOf(Config.AttackSkill[1]) > -1) {
						if (me.getState(121)) {
							delay(500);
						} else {
							Skill.cast(Config.AttackSkill[1], 0, 7793, 5293);
						}

						break;
					}

					delay(500);

					break;
				case 3: // Paladin
					Skill.setSkill(Config.AttackSkill[2]);
					Skill.cast(Config.AttackSkill[1], 1);

					break;
				case 5: // Druid
					if (Config.AttackSkill[1] === 245) {
						Skill.cast(Config.AttackSkill[1], 0, 7793, 5293);

						break;
					}

					delay(500);

					break;
				case 6: // Assassin
					if (Config.UseTraps) {
						trapCheck = ClassAttack.checkTraps({x: 7793, y: 5293});

						if (trapCheck) {
							ClassAttack.placeTraps({x: 7793, y: 5293, classid: 243}, trapCheck);

							break;
						}
					}

					delay(500);

					break;
				default:
					delay(500);

					break;
				}
			} else {
				delay(500);
			}

			if (getUnit(1, 243)) {
				return true;
			}
		}

		throw new Error("Diablo not found");
	};

	this.preattack = function (id) {
		var trapCheck,
			coords = [];

		switch (id) {
		case getLocaleString(2851):
			if (this.vizLayout === 1) {
				coords = [7676, 5295];
			}

			coords = [7684, 5318];

			break;
		case getLocaleString(2852):
			if (this.seisLayout === 1) {
				coords = [7778, 5216];
			}

			coords = [7775, 5208];

			break;
		case getLocaleString(2853):
			if (this.infLayout === 1) {
				coords = [7913, 5292];
			}

			coords = [7915, 5280];

			break;
		}

		switch (me.classid) {
		case 1:
			if ([56, 59, 64].indexOf(Config.AttackSkill[1]) > -1) {
				if (me.getState(121)) {
					delay(500);
				} else {
					Skill.cast(Config.AttackSkill[1], 0, coords[0], coords[1]);
				}

				return true;
			}

			break;
		case 3:
			break;
		case 6:
			if (Config.UseTraps) {
				trapCheck = ClassAttack.checkTraps({x: coords[0], y: coords[1]});

				if (trapCheck) {
					ClassAttack.placeTraps({x: coords[0], y: coords[1]}, 5);

					return true;
				}
			}

			break;
		}

		return false;
	};

	this.followPath = function (path) {
		var i;

		for (i = 0; i < path.length; i += 2) {
			if (this.cleared.length) {
				this.clearStrays();
			}

			Pather.moveTo(path[i], path[i + 1], 3, getDistance(me, path[i], path[i + 1]) > 50);
			Attack.clear(30, 0, false, this.sort);

			// Push cleared positions so they can be checked for strays
			this.cleared.push([path[i], path[i + 1]]);

			// After 5 nodes go back 2 nodes to check for monsters
			if (i === 10 && path.length > 16) {
				path = path.slice(6);
				i = 0;
			}
		}
	};

	this.clearStrays = function () {
		/*if (!Config.PublicMode) {
			return false;
		}*/

		var i,
			oldPos = {x: me.x, y: me.y},
			monster = getUnit(1);

		if (monster) {
			do {
				if (Attack.checkMonster(monster)) {
					for (i = 0; i < this.cleared.length; i += 1) {
						if (getDistance(monster, this.cleared[i][0], this.cleared[i][1]) < 30 && Attack.validSpot(monster.x, monster.y)) {
							me.overhead("we got a stray");
							Pather.moveToUnit(monster);
							Attack.clear(15, 0, false, this.sort);

							break;
						}
					}
				}
			} while (monster.getNext());
		}

		if (getDistance(me, oldPos.x, oldPos.y) > 5) {
			Pather.moveTo(oldPos.x, oldPos.y);
		}

		return true;
	};

	this.cleared = [];

	// path coordinates
	this.entranceToStar = [7794, 5517, 7791, 5491, 7768, 5459, 7775, 5424, 7817, 5458, 7777, 5408, 7769, 5379, 7777, 5357, 7809, 5359, 7805, 5330, 7780, 5317, 7774, 5305];
	this.starToVizA = [7759, 5295, 7734, 5295, 7716, 5295, 7718, 5276, 7697, 5292, 7678, 5293, 7665, 5276, 7662, 5314];
	this.starToVizB = [7759, 5295, 7734, 5295, 7716, 5295, 7701, 5315, 7666, 5313, 7653, 5284];
	this.starToSeisA = [7781, 5259, 7805, 5258, 7802, 5237, 7776, 5228, 7775, 5205, 7804, 5193, 7814, 5169, 7788, 5153];
	this.starToSeisB = [7781, 5259, 7805, 5258, 7802, 5237, 7776, 5228, 7811, 5218, 7807, 5194, 7779, 5193, 7774, 5160, 7803, 5154];
	this.starToInfA = [7809, 5268, 7834, 5306, 7852, 5280, 7852, 5310, 7869, 5294, 7895, 5295, 7919, 5290];
	this.starToInfB = [7809, 5268, 7834, 5306, 7852, 5280, 7852, 5310, 7869, 5294, 7895, 5274, 7927, 5275, 7932, 5297, 7923, 5313];

	var i, party;

	// start
	Town.doChores();

	if (Config.DiabloHelper.SkipIfBaal) {
AreaInfoLoop:
		while (true) {
			me.overhead("Getting party area info");

			if (Misc.getPlayerCount() <= 1) {
				throw new Error("Empty game"); // Alone in game
			}

			party = getParty();

			if (party) {
				do {
					if (party.name !== me.name && party.area) {
						break AreaInfoLoop; // Can read player area
					}
				} while (party.getNext());
			}

			delay(1000);
		}

		party = getParty();

		if (party) {
			do {
				if (party.area === 131 || party.area === 132) { // Player is in Throne of Destruction or Worldstone Chamber
					return false; // End script
				}
			} while (party.getNext());
		}
	}

	Pather.useWaypoint(Config.RandomPrecast ? "random" : 107);
	Precast.doPrecast(true);

	if (Config.DiabloHelper.SkipTP) {
		if (me.area !== 107) {
			Pather.useWaypoint(107);
		}

		if (!Pather.moveTo(7790, 5544)) {
			throw new Error("Failed to move to Chaos Sanctuary");
		}

		if (!Config.DiabloHelper.Entrance) {
			Pather.moveTo(7774, 5305);
		}

CSLoop:
		for (i = 0; i < Config.DiabloHelper.Wait; i += 1) {
			party = getParty();

			if (party) {
				do {
					if (party.name !== me.name && party.area === 108 && (!Config.Leader || party.name === Config.Leader)) {
						break CSLoop;
					}
				} while (party.getNext());
			}

			Attack.clear(30, 0, false, this.sort);
			delay(1000);
		}

		if (i === Config.DiabloHelper.Wait) {
			throw new Error("Player wait timed out (" + (Config.Leader ? "Leader not" : "No players") + " found in Chaos)");
		}
	} else {
		Pather.useWaypoint(103);
		Town.move("portalspot");

		for (i = 0; i < Config.DiabloHelper.Wait; i += 1) {
			if (Pather.getPortal(108, Config.Leader || null) && Pather.usePortal(108, Config.Leader || null)) {
				break;
			}

			delay(1000);
		}

		if (i === Config.DiabloHelper.Wait) {
			throw new Error("Player wait timed out (" + (Config.Leader ? "No leader" : "No player") + " portals found)");
		}
	}

	this.initLayout();

	if (Config.DiabloHelper.Entrance) {
		Attack.clear(35, 0, false, this.sort);
		this.followPath(this.entranceToStar);
	} else {
		Pather.moveTo(7774, 5305);
		Attack.clear(35, 0, false, this.sort);
	}

	Pather.moveTo(7774, 5305);
	Attack.clear(35, 0, false, this.sort);
	this.vizierSeal();
	this.seisSeal();
	Precast.doPrecast(true);
	this.infectorSeal();

	switch (me.classid) {
	case 1:
		Pather.moveTo(7793, 5291);

		break;
	default:
		Pather.moveTo(7788, 5292);

		break;
	}

	this.diabloPrep();
	Attack.kill(243); // Diablo
	Pickit.pickItems();

	return true;
}
