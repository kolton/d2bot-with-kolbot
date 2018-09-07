/**
*	@filename  GameData.js
*	@author    Nishimura-Katsuo
*	@desc      game data library
*/

/* globals areaData, monsterData, expCurve, expPenalty, monsterExp */

include ('AreaData.js');
include ('MonsterData.js');
include ('ExpData.js');
include ("common/Config.js");

const GameData = {
	townAreas: [0, 1, 40, 75, 103, 109],
	monsters: function (areaID) {
		return areaData[areaID].Monsters[me.diff && 1]; // index 0 is normal, index 1 is nm/hell, index 2 is uniques in normal
	},
	monsterLevel: function (monsterID, areaID) {
		if (me.diff) { // levels on nm/hell are determined by area, not by monster data
			return areaData[areaID].LevelEx[me.diff];
		}

		return monsterData[monsterID].Level[me.diff];
	},
	monsterExp: function (monsterID, areaID) {
		if (me.diff) {
			return monsterExp[areaData[areaID].LevelEx[me.diff]][me.diff];
		}

		return monsterData[monsterID].Exp[me.diff];
	},
	areaLevel: function (areaID) {
		let levels = 0, total = 0;

		if (me.diff) {// levels on nm/hell are determined by area, not by monster data
			return areaData[areaID].Level[me.diff];
		}

		areaData[areaID].Monsters[me.diff].forEach(mon => {
			levels += monsterData[mon].Level[me.diff] * monsterData[mon].Rarity;
			total += monsterData[mon].Rarity;
		});

		return Math.round(levels / total);
	},
	areaImmunities: function (areaID) {
		let resists = {Physical: 0, Magic: 0, Fire: 0, Light: 0, Cold: 0, Poison: 0};

		function checkmon (monID) {
			for (let k in resists) {
				resists[k] = Math.max(resists[k], monsterData[monID][k][me.diff]);
			}
		}

		areaData[areaID].Monsters[me.diff].forEach(mon => {
			checkmon(mon);
			monsterData[mon].minions.forEach(checkmon);
		});

		return Object.keys(resists).filter(key => resists[key] >= 100);
	},
	levelModifier: function (clvl, mlvl) {
		let bonus;

		if (clvl < 25 || mlvl < clvl) {
			bonus = expCurve[Math.min(20, Math.max(0, Math.floor(mlvl - clvl + 10)))] / 255;
		} else {
			bonus = clvl / mlvl;
		}

		return bonus * expPenalty[Math.min(30, Math.max(0, Math.round(clvl - 69)))] / 1024;
	},
	multiplayerModifier: function (count) {
		if (!count) {
			let party = getParty(me);

			if (!party) {
				return 1;
			}

			count = 1;

			while (party.getNext()) {
				count++;
			}
		}

		return (count + 1) / 2;
	},
	partyModifier: function (playerID) {
		let party = getParty(me), partyid = -1, level = 0, total = 0;

		if (!party) {
			return 1;
		}

		partyid = party.partyid;

		do {
			if (party.partyid === partyid) {
				total += party.level;

				if (playerID === party.name || playerID === party.gid) {
					level = party.level;
				}
			}
		} while (party.getNext());

		return level / total;
	},
	killExp: function (playerID, monsterID, areaID) {
		let exp = this.monsterExp(monsterID, areaID), party = getParty(me), partyid = -1, level = 0, total = 0, gamesize = 0;

		if (!party) {
			return 0;
		}

		partyid = party.partyid;

		do {
			gamesize++;

			if (party.partyid === partyid) {
				total += party.level;

				if (playerID === party.name || playerID === party.gid) {
					level = party.level;
				}
			}
		} while (party.getNext());

		return Math.floor(exp * this.levelModifier(level, this.monsterLevel(monsterID, areaID)) * this.multiplayerModifier(gamesize) * level / total);
	},
	areaPartyExp: function (areaID, exclude = null, onlytown = true) { // amount of total party exp gained per kill on average
		let party = getParty(me), partyid = -1, partylevels = 0, gamesize = 0, exp = 0, playerexp = 0, poolsize = 0;

		if (!party) {
			return 0;
		}

		// very rough approximation of unique population ratio, could be approved but this works well enough
		let uniqueratio = parseFloat(Config.ChampionBias) * (areaData[areaID].MonUMin[me.diff] + areaData[areaID].MonUMax[me.diff] + areaData[areaID].super * 2) / (areaData[areaID].Size[me.diff].x * areaData[areaID].Size[me.diff].y);

		partyid = party.partyid;

		do {
			gamesize++;

			if (party.partyid === partyid && party.name !== exclude && party.gid !== exclude && (!onlytown || this.townAreas.indexOf(party.area) > -1)) {
				partylevels += party.level;
				poolsize = 0;
				playerexp = 0;

				this.monsters(areaID).forEach(mon => {
					print(mon);

					if (monsterData[mon].Rarity > 0) {
						playerexp += (1 - uniqueratio) * this.monsterExp(mon, areaID) * this.levelModifier(party.level, this.monsterLevel(mon, areaID)) * monsterData[mon].Rarity;
						playerexp += 3 * uniqueratio * this.monsterExp(mon, areaID) * this.levelModifier(party.level, this.monsterLevel(mon, areaID)) * monsterData[mon].Rarity;
						poolsize += monsterData[mon].Rarity;
					}
				});

				if (poolsize) {
					exp += party.level * playerexp / poolsize;
				}
			}
		} while (party.getNext());

		if (partylevels) {
			return exp * this.multiplayerModifier(gamesize) / partylevels;
		} else {
			return 0;
		}
	}
};
