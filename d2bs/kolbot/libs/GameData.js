/**
*	@filename  GameData.js
*	@author    Nishimura-Katsuo
*	@desc      game data library
*/

/* globals AreaData, MonsterData, ExpCurve, ExpPenalty, MonsterExp */

include ('AreaData.js');
include ('MonsterData.js');
include ('ExpData.js');

var GameData = {
	townAreas: [0, 1, 40, 75, 103, 109],
	monsters: function (areaID) {
		return AreaData[areaID].Monsters[me.diff && 1]; // index 0 is normal, index 1 is nm/hell, index 2 is uniques in normal
	},
	monsterLevel: function (monsterID, areaID) {
		if (me.diff) { // levels on nm/hell are determined by area, not by monster data
			return AreaData[areaID].LevelEx[me.diff];
		}

		return MonsterData[monsterID].Level[me.diff];
	},
	MonsterExp: function (monsterID, areaID) {
		if (me.diff) {
			return MonsterExp[AreaData[areaID].LevelEx[me.diff]][me.diff];
		}

		return MonsterData[monsterID].Exp[me.diff];
	},
	areaLevel: function (areaID) {
		let levels = 0, total = 0;

		if (me.diff) { // levels on nm/hell are determined by area, not by monster data
			return AreaData[areaID].Level[me.diff];
		}

		AreaData[areaID].Monsters[me.diff].forEach(mon => {
			levels += MonsterData[mon].Level[me.diff] * MonsterData[mon].Rarity;
			total += MonsterData[mon].Rarity;
		});

		return Math.round(levels / total);
	},
	areaImmunities: function (areaID) {
		let resists = {Physical: 0, Magic: 0, Fire: 0, Light: 0, Cold: 0, Poison: 0};

		function checkmon (monID) {
			for (let k in resists) {
				resists[k] = Math.max(resists[k], MonsterData[monID][k][me.diff]);
			}
		}

		AreaData[areaID].Monsters[me.diff].forEach(mon => {
			checkmon(mon);
			MonsterData[mon].minions.forEach(checkmon);
		});

		return Object.keys(resists).filter(key => resists[key] >= 100);
	},
	levelModifier: function (clvl, mlvl) {
		let bonus;

		if (clvl < 25 || mlvl < clvl) {
			bonus = ExpCurve[Math.min(20, Math.max(0, Math.floor(mlvl - clvl + 10)))] / 255;
		} else {
			bonus = clvl / mlvl;
		}

		return bonus * ExpPenalty[Math.min(30, Math.max(0, Math.round(clvl - 69)))] / 1024;
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
		let exp = this.MonsterExp(monsterID, areaID), party = getParty(me), partyid = -1, level = 0, total = 0, gamesize = 0;

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
		let uniqueratio = parseFloat(Config.ChampionBias) * (AreaData[areaID].MonUMin[me.diff] + AreaData[areaID].MonUMax[me.diff] + AreaData[areaID].super * 2) / (AreaData[areaID].Size[me.diff].x * AreaData[areaID].Size[me.diff].y);

		partyid = party.partyid;

		do {
			gamesize++;

			if (party.partyid === partyid && party.name !== exclude && party.gid !== exclude && (!onlytown || this.townAreas.indexOf(party.area) > -1)) {
				partylevels += party.level;
				poolsize = 0;
				playerexp = 0;

				this.monsters(areaID).forEach(mon => {
					print(mon);

					if (MonsterData[mon].Rarity > 0) {
						playerexp += (1 - uniqueratio) * this.MonsterExp(mon, areaID) * this.levelModifier(party.level, this.monsterLevel(mon, areaID)) * MonsterData[mon].Rarity;
						playerexp += 3 * uniqueratio * this.MonsterExp(mon, areaID) * this.levelModifier(party.level, this.monsterLevel(mon, areaID)) * MonsterData[mon].Rarity;
						poolsize += MonsterData[mon].Rarity;
					}
				});

				if (poolsize) {
					exp += party.level * playerexp / poolsize;
				}
			}
		} while (party.getNext());

		return (partylevels ? exp * this.multiplayerModifier(gamesize) / partylevels : 0);
	}
};
