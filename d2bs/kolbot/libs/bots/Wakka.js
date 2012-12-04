/**
*	@filename	Wakka.js
*	@author		kolton
*	@desc		walking Chaos Sanctuary leecher
*/

var stopLvl = 99;

function Wakka() {
	var i, safeTP, portal, vizClear, seisClear, infClear, tick, diablo,
		minDist = 40,
		maxDist = 80,
		leaderUnit = null,
		leaderPartyUnit = null,
		leader = "";

	function autoLeaderDetect(destination) { // autoleader by Ethic
		var solofail, suspect;

		do {
			solofail = 0;
			suspect = getParty(); // get party object (players in game)

			do {
				if (suspect.name !== me.name) { // player isn't alone
					solofail += 1;
				}

				if (suspect.area === destination) { // first player in our party found in destination area...
					leader = suspect.name; // ... is our leader

					if (suspect.area === 131) {
						return false;
					}

					print("ÿc4Wakka: ÿc0Autodetected " + leader);

					return true;
				}
			} while (suspect.getNext());

			if (solofail === 0) { // empty game, nothing left to do
				return false;
			}

			delay(500);
		} while (!leader); // repeat until leader is found (or until game is empty)

		return false;
	}

	this.checkMonsters = function (range, dodge) {
		var monList = [],
			monster = getUnit(1);

		if (monster) {
			do {
				if (monster.y < 5565 && Attack.checkMonster(monster) && getDistance(me, monster) <= range) {
					if (!dodge) {
						return true;
					}

					monList.push(copyUnit(monster));
				}
			} while (monster.getNext());
		}

		if (!monList.length) {
			return false;
		}

		monList.sort(Sort.units);

		if (getDistance(me, monList[0]) < 25 && !checkCollision(me, monList[0], 0x4)) {
			Attack.dodge(monList[0], 25, monList);
		}

		return true;
	};

	this.getLayout = function (seal, value) {
		var sealPreset = getPresetUnit(108, 2, seal);

		if (!seal) {
			throw new Error("Seal preset not found. Can't continue.");
		}

		switch (seal) {
		case 396:
			if (sealPreset.roomy * 5 + sealPreset.y === value) {
				return 1;
			}

			break;
		case 394:
		case 392:
			if (sealPreset.roomx * 5 + sealPreset.x === value) {
				return 1;
			}

			break;
		}

		return 2;
	};

	this.getCoords = function () {
		this.vizCoords = this.getLayout(396, 5275) === 1 ? [7707, 5274] : [7708, 5298];
		this.seisCoords = this.getLayout(394, 7773) === 1 ? [7812, 5223] : [7809, 5193];
		this.infCoords = this.getLayout(392, 7893) === 1 ? [7868, 5294] : [7882, 5306];
	};

	this.checkBoss = function (name) {
		var i, boss,
			glow = getUnit(2, 131);

		if (glow) {
			for (i = 0; i < 10; i += 1) {
				if (me.getStat(12) >= stopLvl) {
					D2Bot.stop();
				}

				boss = getUnit(1, name);

				if (boss && boss.mode === 12) {
					return true;
				}

				delay(500);
			}

			return true;
		}

		return false;
	};

	this.getCorpse = function () {
		if (me.mode === 17) {
			me.revive();
		}

		var corpse,
			rval = false;

		corpse = getUnit(0, me.name, 17);

		if (corpse) {
			do {
				if (getDistance(me, corpse) <= 15) {
					Pather.moveToUnit(corpse);
					corpse.interact();
					delay(500);

					rval = true;
				}
			} while (corpse.getNext());
		}

		return rval;
	};

	this.followPath = function (dest) {
		var path = getPath(me.area, me.x, me.y, dest[0], dest[1], 0, 15);

		if (!path) {
			throw new Error("Failed go get path");
		}

		while (path.length > 0) {
			if (me.getStat(12) >= stopLvl) {
				D2Bot.stop();
			}

			if (me.mode === 17 || me.inTown) {
				return false;
			}

			if (!leaderUnit || !copyUnit(leaderUnit).x) {
				leaderUnit = getUnit(0, leader);
			}

			if (leaderUnit) {
				if (this.checkMonsters(45, true) && getDistance(me, leaderUnit) <= maxDist) { // monsters nearby - don't move
					path = getPath(me.area, me.x, me.y, dest[0], dest[1], 0, 15);

					delay(200);

					continue;
				}

				if (getDistance(me, leaderUnit) <= minDist) { // leader within minDist range - don't move
					delay(200);

					continue;
				}
			} else {
				// leaderUnit out of getUnit range but leader is still within reasonable distance - check party unit's coords!
				leaderPartyUnit = getParty(leader);

				if (leaderPartyUnit) {
					if (leaderPartyUnit.area !== me.area) { // leader went to town - don't move
						delay(200);

						continue;
					}

					// if there's monsters between the leecher and leader, wait until monsters are dead or leader is out of maxDist range
					if (this.checkMonsters(45, true) && getDistance(me, leaderPartyUnit.x, leaderPartyUnit.y) <= maxDist) {
						path = getPath(me.area, me.x, me.y, dest[0], dest[1], 0, 15);

						delay(200);

						continue;
					}
				}
			}

			if (Pather.walkTo(path[0].x, path[0].y)) {
				path.shift();
			}

			this.getCorpse();
		}

		return true;
	};

	// start
	Town.goToTown(4);
	Town.doChores();
	Town.move("portalspot");

	if (Config.Leader) {
		leader = Config.Leader;

		for (i = 0; i < 30; i += 1) {
			if (Misc.inMyParty(leader)) {
				break;
			}

			delay(1000);
		}

		if (i === 30) {
			throw new Error("Wakka: Leader not partied");
		}
	}

	if (leader || autoLeaderDetect(108)) {
		while (Misc.inMyParty(leader)) {
			if (me.getStat(12) >= stopLvl) {
				D2Bot.stop();
			}

			switch (me.area) {
			case 103:
				portal = Pather.getPortal(108, leader);

				if (portal) {
					if (!safeTP) {
						delay(5000);
					}

					Pather.usePortal(108, leader);
				}

				break;
			case 108:
				if (!safeTP) {
					if (this.checkMonsters(25, false)) {
						me.overhead("hot tp");
						Pather.usePortal(103, leader);
						this.getCorpse();

						break;
					} else {
						this.getCoords();

						safeTP = true;
					}
				}

				if (!vizClear) {
					if (!this.followPath(this.vizCoords)) {
						break;
					}

					if (tick && getTickCount() - tick >= 5000) {
						vizClear = true;
						tick = false;

						break;
					}

					if (this.checkBoss(getLocaleString(2851))) {
						if (!tick) {
							tick = getTickCount();
						}

						me.overhead("vizier dead");
					}

					break;
				}

				if (!seisClear) {
					if (!this.followPath(this.seisCoords)) {
						break;
					}

					if (tick && getTickCount() - tick >= 7000) {
						seisClear = true;
						tick = false;

						break;
					}

					if (this.checkBoss(getLocaleString(2852))) {
						if (!tick) {
							tick = getTickCount();
						}

						me.overhead("seis dead");
					}

					break;
				}

				if (!infClear) {
					if (!this.followPath(this.infCoords)) {
						break;
					}

					if (tick && getTickCount() - tick >= 2000) {
						infClear = true;
						tick = false;

						break;
					}

					if (this.checkBoss(getLocaleString(2853))) {
						if (!tick) {
							tick = getTickCount();
						}

						me.overhead("infector dead");
					}

					break;
				}

				Pather.moveTo(7767, 5263);

				diablo = getUnit(1, 243);

				if (diablo && (diablo.mode === 0 || diablo.mode === 12)) {
					return true;
				}

				break;
			}

			if (me.mode === 17) {
				me.revive();
			}

			delay(200);
		}
	} else {
		throw new Error("Empty game.");
	}

	return true;
}