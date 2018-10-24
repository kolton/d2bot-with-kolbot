/**
*	@filename  GameData.js
*	@author    Nishimura-Katsuo
*	@desc      game data library
*/

const MONSTER_INDEX_COUNT = 734;
const AREA_INDEX_COUNT = 137;
const SUPER = [0, 0, 0, 1, 1, 1, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 1, 0, 0, 1, 0, 0, 0, 1, 1, 1, 0, 0, 0, 1, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 1, 1, 0, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 1, 0, 0, 0, 3, 0, 1, 0, 0, 0, 0, 0, 1, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 4, 0, 0, 1, 0, 1, 4, 0, 2, 3, 1, 0, 1, 1, 0, 0, 0, 1, 3, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 5, 1, 1, 1, 1, 3];
const AREA_LOCALE_STRING = [5389, 5055, 5054, 5053, 5052, 5051, 5050, 5049, 5048, 5047, 5046, 5045, 5044, 5043, 5042, 5041, 5040, 5039, 5038, 5037, 5036, 5035, 5034, 5033, 5032, 5031, 5030, 5029, 5028, 5027, 5026, 5025, 5024, 5023, 5022, 5021, 5020, 5019, 5018, 788, 852, 851, 850, 849, 848, 847, 846, 845, 844, 843, 842, 841, 840, 839, 838, 837, 836, 835, 834, 833, 832, 831, 830, 829, 828, 827, 826, 826, 826, 826, 826, 826, 826, 825, 824, 820, 819, 818, 817, 816, 815, 814, 813, 812, 810, 811, 809, 808, 806, 805, 807, 804, 845, 844, 803, 802, 801, 800, 799, 798, 797, 796, 795, 790, 792, 793, 794, 791, 789, 22646, 22647, 22648, 22649, 22650, 22651, 22652, 22653, 22654, 22655, 22656, 22657, 22658, 22659, 22660, 22662, 21865, 21866, 21867, 22663, 22664, 22665, 22667, 22666, 5389, 5389, 5389, 5018];
const MONSTER_KEYS = [
	['mon1', 'mon2', 'mon3', 'mon4', 'mon5', 'mon6', 'mon7', 'mon8', 'mon9', 'mon10'],
	['nmon1', 'nmon2', 'nmon3', 'nmon4', 'nmon5', 'nmon6', 'nmon7', 'nmon8', 'nmon9', 'nmon10'],
][me.diff && 1]; // mon is for normal, nmon is for nm/hell, umon is specific to picking champion/uniques in normal

/**
 *  MonsterData[classID]
 *  .Index = Index of this monster
 *  .Level = Level of this monster in normal (use GameData.monsterLevel to find monster levels)
 *  .Ranged = if monster is ranged
 *  .Rarity = weight of this monster in level generation
 *  .Threat = threat level used by mercs
 *  .Align = alignment of unit (determines what it will attack)
 *  .Melee = if monster is melee
 *  .NPC = if unit is NPC
 *  .Demon = if monster is demon
 *  .Flying = if monster is flying
 *  .Boss = if monster is a boss
 *  .ActBoss = if monster is act boss
 *  .Killable = if monster can be killed
 *  .Convertable = if monster is affected by convert or mind blast
 *  .NeverCount = if not counted as a minion
 *  .DeathDamage = explodes on death
 *  .Regeneration = hp regeneration
 *  .LocaleString = locale string index for getLocaleString
 *  .ExperienceModifier = percent of base monster exp this unit rewards when killed
 *  .Undead = 2 if greater undead, 1 if lesser undead, 0 if neither
 *  .Drain = drain effectiveness percent
 *  .Block = block percent
 *  .Physical = physical resist
 *  .Magic = magic resist
 *  .Fire = fire resist
 *  .Lightning = lightning resist
 *  .Poison = poison resist
 *  .Minions = array of minions that can spawn with this unit
 */

var MonsterData = Array(MONSTER_INDEX_COUNT);

for (let i = 0; i < MonsterData.length; i++) {
	let index = i;
	MonsterData[i] = Object.freeze(Object.defineProperties({}, {
		Index: {get: () => index, enumerable: true},
		Level: {get: () => getBaseStat('monstats', index, 'Level'), enumerable: true}, // normal only, nm/hell are determined by area's LevelEx
		Ranged: {get: () => getBaseStat('monstats', index, 'RangedType'), enumerable: true},
		Rarity: {get: () => getBaseStat('monstats', index, 'Rarity'), enumerable: true},
		Threat: {get: () => getBaseStat('monstats', index, 'threat'), enumerable: true},
		Align: {get: () => getBaseStat('monstats', index, 'Align'), enumerable: true},
		Melee: {get: () => getBaseStat('monstats', index, 'isMelee'), enumerable: true},
		NPC: {get: () => getBaseStat('monstats', index, 'npc'), enumerable: true},
		Demon: {get: () => getBaseStat('monstats', index, 'demon'), enumerable: true},
		Flying: {get: () => getBaseStat('monstats', index, 'flying'), enumerable: true},
		Boss: {get: () => getBaseStat('monstats', index, 'boss'), enumerable: true},
		ActBoss: {get: () => getBaseStat('monstats', index, 'primeevil'), enumerable: true},
		Killable: {get: () => getBaseStat('monstats', index, 'killable'), enumerable: true},
		Convertable: {get: () => getBaseStat('monstats', index, 'switchai'), enumerable: true},
		NeverCount: {get: () => getBaseStat('monstats', index, 'neverCount'), enumerable: true},
		DeathDamage: {get: () => getBaseStat('monstats', index, 'deathDmg'), enumerable: true},
		Regeneration: {get: () => getBaseStat('monstats', index, 'DamageRegen'), enumerable: true},
		LocaleString: {get: () => getBaseStat('monstats', index, 'NameStr'), enumerable: true},
		ExperienceModifier: {get: () => getBaseStat('monstats', index, ['Exp', 'Exp(N)', 'Exp(H)'][me.diff]), enumerable: true},
		Undead: {get: () => (getBaseStat('monstats', index, 'hUndead') && 2) | (getBaseStat('monstats', index, 'lUndead') && 1), enumerable: true},
		Drain: {get: () => getBaseStat('monstats', index, ["Drain", "Drain(N)", "Drain(H)"][me.diff]), enumerable: true},
		Block: {get: () => getBaseStat('monstats', index, ["ToBlock", "ToBlock(N)", "ToBlock(H)"][me.diff]), enumerable: true},
		Physical: {get: () => getBaseStat('monstats', index, ["ResDm", "ResDm(N)", "ResDm(H)"][me.diff]), enumerable: true},
		Magic: {get: () => getBaseStat('monstats', index, ["ResMa", "ResMa(N)", "ResMa(H)"][me.diff]), enumerable: true},
		Fire: {get: () => getBaseStat('monstats', index, ["ResFi", "ResFi(N)", "ResFi(H)"][me.diff]), enumerable: true},
		Lightning: {get: () => getBaseStat('monstats', index, ["ResLi", "ResLi(N)", "ResLi(H)"][me.diff]), enumerable: true},
		Cold: {get: () => getBaseStat('monstats', index, ["ResCo", "ResCo(N)", "ResCo(H)"][me.diff]), enumerable: true},
		Poison: {get: () => getBaseStat('monstats', index, ["ResPo", "ResPo(N)", "ResPo(H)"][me.diff]), enumerable: true},
		Minions: {get: () => [getBaseStat('monstats', index, 'minion1'), getBaseStat('monstats', index, 'minion2')].filter(mon => mon !== 65535), enumerable: true},
	}));
}

Object.freeze(MonsterData);

/**
 *  AreaData[areaID]
 *  .Super = number of super uniques present in this area
 *  .Index = areaID
 *  .Act = act this area is in [0-4]
 *  .MonsterDensity = value used to determine monster population density
 *  .ChampionPacks.Min = minimum number of champion or unique packs that spawn here
 *  .ChampionPacks.Max = maximum number of champion or unique packs that spawn here
 *  .Waypoint = number in waypoint menu that leads to this area
 *  .Level = level of area (use GameData.areaLevel)
 *  .Size.x = width of area
 *  .Size.y = depth of area
 *  .Monsters = array of monsters that can spawn in this area
 *  .LocaleString = locale string index for getLocaleString
 */

var AreaData = new Array(AREA_INDEX_COUNT);

for (let i = 0; i < AreaData.length; i++) {
	let index = i;
	AreaData[i] = Object.freeze(Object.defineProperties({}, {
		Super: {get: () => SUPER[index], enumerable: true},
		Index: {get: () => index, enumerable: true},
		Act: {get: () => getBaseStat('levels', index, 'Act'), enumerable: true},
		MonsterDensity: {get: () => getBaseStat('levels', index, ['MonDen', 'MonDen(N)', 'MonDen(H)'][me.diff]), enumerable: true},
		ChampionPacks: {get: () => ({Min: getBaseStat('levels', index, ['MonUMin', 'MonUMin(N)', 'MonUMin(H)'][me.diff]), Max: getBaseStat('levels', index, ['MonUMax', 'MonUMax(N)', 'MonUMax(H)'][me.diff])}), enumerable: true},
		Waypoint: {get: () => getBaseStat('levels', index, 'Waypoint'), enumerable: true},
		Level: {get: () => getBaseStat('levels', index, ['MonLvl1Ex', 'MonLvl2Ex', 'MonLvl3Ex'][me.diff]), enumerable: true},
		Size: {get: () => {
			if (index === 111) { // frigid highlands doesn't specify size, manual measurement
				return {x: 210, y: 710};
			}

			if (index === 112) { // arreat plateau doesn't specify size, manual measurement
				return {x: 690, y: 230};
			}

			return {
				x: getBaseStat('leveldefs', index, ['SizeX', 'SizeX(N)', 'SizeX(H)'][me.diff]),
				y: getBaseStat('leveldefs', index, ['SizeY', 'SizeY(N)', 'SizeY(H)'][me.diff])
			};
		}, enumerable: true},
		Monsters: {get: () => MONSTER_KEYS.map(key => getBaseStat('levels', index, key)).filter(key => key !== 65535), enumerable: true},
		LocaleString: {get: () => AREA_LOCALE_STRING[index], enumerable: true},
	}));
}

Object.freeze(AreaData);

var GameData = {
	townAreas: [0, 1, 40, 75, 103, 109],
	monsterLevel: function (monsterID, areaID) {
		if (me.diff) { // levels on nm/hell are determined by area, not by monster data
			return AreaData[areaID].Level;
		}

		return MonsterData[monsterID].Level;
	},
	monsterExp: function (monsterID, areaID) {
		return Experience.monsterExp[this.monsterLevel(monsterID, areaID)][me.diff] * MonsterData[monsterID].ExperienceModifier / 100;
	},
	areaLevel: function (areaID) {
		let levels = 0, total = 0;

		if (me.diff) { // levels on nm/hell are determined by area, not by monster data
			return AreaData[areaID].Level;
		}

		AreaData[areaID].Monsters.forEach(mon => {
			levels += MonsterData[mon].Level * MonsterData[mon].Rarity;
			total += MonsterData[mon].Rarity;
		});

		return Math.round(levels / total);
	},
	areaImmunities: function (areaID) {
		let resists = {Physical: 0, Magic: 0, Fire: 0, Lightning: 0, Cold: 0, Poison: 0};

		function checkmon (monID) {
			for (let k in resists) {
				resists[k] = Math.max(resists[k], MonsterData[monID][k]);
			}
		}

		AreaData[areaID].Monsters.forEach(mon => {
			checkmon(mon);
			MonsterData[mon].Minions.forEach(checkmon);
		});

		return Object.keys(resists).filter(key => resists[key] >= 100);
	},
	levelModifier: function (clvl, mlvl) {
		let bonus;

		if (clvl < 25 || mlvl < clvl) {
			bonus = Experience.expCurve[Math.min(20, Math.max(0, Math.floor(mlvl - clvl + 10)))] / 255;
		} else {
			bonus = clvl / mlvl;
		}

		return bonus * Experience.expPenalty[Math.min(30, Math.max(0, Math.round(clvl - 69)))] / 1024;
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
	areaPartyExp: function (areaID, exclude = null, onlytown = true, ignore = null) { // amount of total party exp gained per kill on average
		let party = getParty(me), partyid = -1, partylevels = 0, gamesize = 0, exp = 0, playerexp = 0, poolsize = 0;

		if (!party) {
			return 0;
		}

		// very rough approximation of unique population ratio, could be approved but this works well enough
		let uniqueratio = parseFloat(Config.ChampionBias) * (AreaData[areaID].ChampionPacks.Min + AreaData[areaID].ChampionPacks.Max + AreaData[areaID].Super * 2) / (AreaData[areaID].Size.x * AreaData[areaID].Size.y);

		partyid = party.partyid;

		do {
			gamesize++;

			if (party.partyid === partyid && party.name !== exclude && party.gid !== exclude && (!onlytown || this.townAreas.indexOf(party.area) > -1) && (areaID < 128 || party.level >= (1 + me.diff) * 20)) {
				partylevels += party.level;

				if (party.name !== ignore && party.gid !== ignore) {
					poolsize = 0;
					playerexp = 0;

					AreaData[areaID].Monsters.forEach(mon => {
						if (MonsterData[mon].Rarity > 0) {
							playerexp += ((1 - uniqueratio) + (3 * uniqueratio)) * this.monsterExp(mon, areaID) * this.levelModifier(party.level, this.monsterLevel(mon, areaID)) * MonsterData[mon].Rarity;
							poolsize += MonsterData[mon].Rarity;
						}
					});

					if (poolsize) {
						exp += party.level * playerexp / poolsize;
					}
				}
			}
		} while (party.getNext());

		return (partylevels ? exp * this.multiplayerModifier(gamesize) / partylevels : 0);
	}
};
