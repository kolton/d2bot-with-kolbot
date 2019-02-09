/**
*	@filename  GameData.js
*	@author    Nishimura-Katsuo
*	@desc      game data library
*/

include('StringLib.js');
include('LocaleStringID.js'); /* global LocaleStringName */

const MONSTER_INDEX_COUNT = 734;
const PRESET_MON_COUNT = 734;
const PRESET_SUPER_COUNT = 66;
const PRESET_PLACE_COUNT = 37;
const AREA_INDEX_COUNT = 137;
const SUPER = [0, 0, 0, 1, 1, 1, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 1, 0, 0, 1, 0, 0, 0, 1, 1, 1, 0, 0, 0, 1, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 1, 1, 0, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 1, 0, 0, 0, 3, 0, 1, 0, 0, 0, 0, 0, 1, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 4, 0, 0, 1, 0, 1, 4, 0, 2, 3, 1, 0, 1, 1, 0, 0, 0, 1, 3, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 5, 1, 1, 1, 1, 3];
const AREA_LOCALE_STRING = [5389, 5055, 5054, 5053, 5052, 5051, 5050, 5049, 5048, 5047, 5046, 5045, 5044, 5043, 5042, 5041, 5040, 5039, 5038, 5037, 5036, 5035, 5034, 5033, 5032, 5031, 5030, 5029, 5028, 5027, 5026, 5025, 5024, 5023, 5022, 5021, 5020, 5019, 5018, 788, 852, 851, 850, 849, 848, 847, 846, 845, 844, 843, 842, 841, 840, 839, 838, 837, 836, 835, 834, 833, 832, 831, 830, 829, 828, 827, 826, 826, 826, 826, 826, 826, 826, 825, 824, 820, 819, 818, 817, 816, 815, 814, 813, 812, 810, 811, 809, 808, 806, 805, 807, 804, 845, 844, 803, 802, 801, 800, 799, 798, 797, 796, 795, 790, 792, 793, 794, 791, 789, 22646, 22647, 22648, 22649, 22650, 22651, 22652, 22653, 22654, 22655, 22656, 22657, 22658, 22659, 22660, 22662, 21865, 21866, 21867, 22663, 22664, 22665, 22667, 22666, 5389, 5389, 5389, 5018];
const MONSTER_KEYS = [
	['mon1', 'mon2', 'mon3', 'mon4', 'mon5', 'mon6', 'mon7', 'mon8', 'mon9', 'mon10'],
	['nmon1', 'nmon2', 'nmon3', 'nmon4', 'nmon5', 'nmon6', 'nmon7', 'nmon8', 'nmon9', 'nmon10'],
][me.diff && 1]; // mon is for normal, nmon is for nm/hell, umon is specific to picking champion/uniques in normal

var Experience = {
	totalExp: [0, 0, 500, 1500, 3750, 7875, 14175, 22680, 32886, 44396, 57715, 72144, 90180, 112725, 140906, 176132, 220165, 275207, 344008, 430010, 537513, 671891, 839864, 1049830, 1312287, 1640359, 2050449, 2563061, 3203826, 3902260, 4663553, 5493363, 6397855, 7383752, 8458379, 9629723, 10906488, 12298162, 13815086, 15468534, 17270791, 19235252, 21376515, 23710491, 26254525, 29027522, 32050088, 35344686, 38935798, 42850109, 47116709, 51767302, 56836449, 62361819, 68384473, 74949165, 82104680, 89904191, 98405658, 107672256, 117772849, 128782495, 140783010, 153863570, 168121381, 183662396, 200602101, 219066380, 239192444, 261129853, 285041630, 311105466, 339515048, 370481492, 404234916, 441026148, 481128591, 524840254, 572485967, 624419793, 681027665, 742730244, 809986056, 883294891, 963201521, 1050299747, 1145236814, 1248718217, 1361512946, 1484459201, 1618470619, 1764543065, 1923762030, 2097310703, 2286478756, 2492671933, 2717422497, 2962400612, 3229426756, 3520485254, 0, 0],
	nextExp: [0, 500, 1000, 2250, 4125, 6300, 8505, 10206, 11510, 13319, 14429, 18036, 22545, 28181, 35226, 44033, 55042, 68801, 86002, 107503, 134378, 167973, 209966, 262457, 328072, 410090, 512612, 640765, 698434, 761293, 829810, 904492, 985897, 1074627, 1171344, 1276765, 1391674, 1516924, 1653448, 1802257, 1964461, 2141263, 2333976, 2544034, 2772997, 3022566, 3294598, 3591112, 3914311, 4266600, 4650593, 5069147, 5525370, 6022654, 6564692, 7155515, 7799511, 8501467, 9266598, 10100593, 11009646, 12000515, 13080560, 14257811, 15541015, 16939705, 18464279, 20126064, 21937409, 23911777, 26063836, 28409582, 30966444, 33753424, 36791232, 40102443, 43711663, 47645713, 51933826, 56607872, 61702579, 67255812, 73308835, 79906630, 87098226, 94937067, 103481403, 112794729, 122946255, 134011418, 146072446, 159218965, 173548673, 189168053, 206193177, 224750564, 244978115, 267026144, 291058498, 0, 0],
	expCurve: [13, 16, 110, 159, 207, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 225, 174, 92, 38, 5],
	expPenalty: [1024, 976, 928, 880, 832, 784, 736, 688, 640, 592, 544, 496, 448, 400, 352, 304, 256, 192, 144, 108, 81, 61, 46, 35, 26, 20, 15, 11, 8, 6, 5],
	monsterExp: [
		[1, 1, 1], [30, 78, 117], [40, 104, 156], [50, 131, 197], [60, 156, 234], [70, 182, 273], [80, 207, 311], [90, 234, 351], [100, 260, 390], [110, 285, 428], [120, 312, 468],
		[130, 338, 507], [140, 363, 545], [154, 401, 602], [169, 440, 660], [186, 482, 723], [205, 533, 800], [225, 584, 876], [248, 644, 966], [273, 708, 1062], [300, 779, 1169],
		[330, 857, 1286], [363, 942, 1413], [399, 1035, 1553], [439, 1139, 1709], [470, 1220, 1830], [503, 1305, 1958], [538, 1397, 2096], [576, 1494, 2241], [616, 1598, 2397],
		[659, 1709, 2564], [706, 1832, 2748], [755, 1958, 2937], [808, 2097, 3146], [864, 2241, 3362], [925, 2399, 3599], [990, 2568, 3852], [1059, 2745, 4118], [1133, 2939, 4409],
		[1212, 3144, 4716], [1297, 3365, 5048], [1388, 3600, 5400], [1485, 3852, 5778], [1589, 4121, 6182], [1693, 4409, 6614], [1797, 4718, 7077], [1901, 5051, 7577],
		[2005, 5402, 8103], [2109, 5783, 8675], [2213, 6186, 9279], [2317, 6618, 9927], [2421, 7080, 10620], [2525, 7506, 11259], [2629, 7956, 11934], [2733, 8435, 12653],
		[2837, 8942, 13413], [2941, 9477, 14216], [3045, 10044, 15066], [3149, 10647, 15971], [3253, 11286, 16929], [3357, 11964, 17946], [3461, 12680, 19020],
		[3565, 13442, 20163], [3669, 14249, 21374], [3773, 15104, 22656], [3877, 16010, 24015], [3981, 16916, 25374], [4085, 17822, 26733], [4189, 18728, 28092],
		[4293, 19634, 29451], [4397, 20540, 30810], [4501, 21446, 32169], [4605, 22352, 33528], [4709, 23258, 34887], [4813, 24164, 36246], [4917, 25070, 37605],
		[5021, 25976, 38964], [5125, 26882, 40323], [5229, 27788, 41682], [5333, 28694, 43041], [5437, 29600, 44400], [5541, 30506, 45759], [5645, 31412, 47118],
		[5749, 32318, 48477], [5853, 33224, 49836], [5957, 34130, 51195], [6061, 35036, 52554], [6165, 35942, 53913], [6269, 36848, 55272], [6373, 37754, 56631],
		[6477, 38660, 57990], [6581, 39566, 59349], [6685, 40472, 60708], [6789, 41378, 62067], [6893, 42284, 63426], [6997, 43190, 64785], [7101, 44096, 66144],
		[7205, 45002, 67503], [7309, 45908, 68862], [7413, 46814, 70221], [7517, 47720, 71580], [7621, 48626, 72939], [7725, 49532, 74298], [7829, 50438, 75657],
		[7933, 51344, 77016], [8037, 52250, 78375], [8141, 53156, 79734], [8245, 54062, 81093], [8349, 54968, 82452], [8453, 55874, 83811], [160000, 160000, 160000]
	]
};

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
 *  .MinionCount.Min = minimum number of minions that can spawn with this unit
 *  .MinionCount.Max = maximum number of minions that can spawn with this unit
 */

var MonsterData = Array(MONSTER_INDEX_COUNT);

for (let i = 0; i < MonsterData.length; i++) {
	let index = i;
	MonsterData[i] = ({
		Index: index,
		ClassID: index,
		Level: getBaseStat('monstats', index, 'Level'), // normal only, nm/hell are determined by area's LevelEx
		Ranged: getBaseStat('monstats', index, 'RangedType'),
		Rarity: getBaseStat('monstats', index, 'Rarity'),
		Threat: getBaseStat('monstats', index, 'threat'),
		PetIgnore: getBaseStat('monstats', index, 'petignore'),
		Align: getBaseStat('monstats', index, 'Align'),
		Melee: getBaseStat('monstats', index, 'isMelee'),
		NPC: getBaseStat('monstats', index, 'npc'),
		Demon: getBaseStat('monstats', index, 'demon'),
		Flying: getBaseStat('monstats', index, 'flying'),
		Boss: getBaseStat('monstats', index, 'boss'),
		ActBoss: getBaseStat('monstats', index, 'primeevil'),
		Killable: getBaseStat('monstats', index, 'killable'),
		Convertable: getBaseStat('monstats', index, 'switchai'),
		NeverCount: getBaseStat('monstats', index, 'neverCount'),
		DeathDamage: getBaseStat('monstats', index, 'deathDmg'),
		Regeneration: getBaseStat('monstats', index, 'DamageRegen'),
		LocaleString: getLocaleString(getBaseStat('monstats', index, 'NameStr')),
		InternalName: LocaleStringName[getBaseStat('monstats', index, 'NameStr')],
		ExperienceModifier: getBaseStat('monstats', index, ['Exp', 'Exp(N)', 'Exp(H)'][me.diff]),
		Undead: (getBaseStat('monstats', index, 'hUndead') && 2) | (getBaseStat('monstats', index, 'lUndead') && 1),
		Drain: getBaseStat('monstats', index, ["Drain", "Drain(N)", "Drain(H)"][me.diff]),
		Block: getBaseStat('monstats', index, ["ToBlock", "ToBlock(N)", "ToBlock(H)"][me.diff]),
		Physical: getBaseStat('monstats', index, ["ResDm", "ResDm(N)", "ResDm(H)"][me.diff]),
		Magic: getBaseStat('monstats', index, ["ResMa", "ResMa(N)", "ResMa(H)"][me.diff]),
		Fire: getBaseStat('monstats', index, ["ResFi", "ResFi(N)", "ResFi(H)"][me.diff]),
		Lightning: getBaseStat('monstats', index, ["ResLi", "ResLi(N)", "ResLi(H)"][me.diff]),
		Cold: getBaseStat('monstats', index, ["ResCo", "ResCo(N)", "ResCo(H)"][me.diff]),
		Poison: getBaseStat('monstats', index, ["ResPo", "ResPo(N)", "ResPo(H)"][me.diff]),
		Minions: ([getBaseStat('monstats', index, 'minion1'), getBaseStat('monstats', index, 'minion2')].filter(mon => mon !== 65535)),
		GroupCount: ({Min: getBaseStat('monstats', index, 'MinGrp'), Max: getBaseStat('monstats', index, 'MaxGrp')}),
		MinionCount: ({Min: getBaseStat('monstats', index, 'PartyMin'), Max: getBaseStat('monstats', index, 'PartyMax')}),
	});
}

MonsterData.findByName = function (whatToFind) {
	let matches = MonsterData.map(mon => [Math.min(whatToFind.diffCount(mon.LocaleString), whatToFind.diffCount(mon.InternalName)), mon]).sort((a, b) => a[0] - b[0]);

	return matches[0][1];
};

(MonsterData);

/**
 *  PresetMonsters[presetID]
 */

var PresetMonsters = Array(PRESET_MON_COUNT + PRESET_SUPER_COUNT + PRESET_PLACE_COUNT);

if (PresetMonsters) {
	let ind = 0;

	for (let i = 0; i < PRESET_MON_COUNT; i++, ind++) {
		PresetMonsters[ind] = MonsterData[i];
	}

	for (let i = 0; i < PRESET_SUPER_COUNT; i++, ind++) {
		let sourceMonster = MonsterData[getBaseStat('superuniques', i, 'class')];
		PresetMonsters[ind] = {};

		for (let k in sourceMonster) {
			PresetMonsters[ind] = sourceMonster[k];
		}

		PresetMonsters[ind].Index = ind;
		PresetMonsters[ind].LocaleString = getLocaleString(getBaseStat('superuniques', i, 'name'));
		PresetMonsters[ind].InternalName = LocaleStringName[getBaseStat('superuniques', i, 'name')];
		PresetMonsters[ind].Mods = ([
			getBaseStat('superuniques', i, 'Mod1'),
			getBaseStat('superuniques', i, 'Mod2'),
			getBaseStat('superuniques', i, 'Mod3')
		].filter(Boolean));

		(PresetMonsters[ind]);
	}

	PresetMonsters[805] = Object.create(MonsterData[267], {
		Index: {
			value: 805,
			enumerable: true,
		},
	});
	(PresetMonsters[805]);
}

PresetMonsters.findByName = function (whatToFind) {
	let matches = PresetMonsters.map(mon => [Math.min(whatToFind.diffCount(mon.LocaleString), whatToFind.diffCount(mon.InternalName)), mon]).sort((a, b) => a[0] - b[0]);

	return matches[0][1];
};

(PresetMonsters);

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
	AreaData[i] = ({
		Super: SUPER[index],
		Index: index,
		Act: getBaseStat('levels', index, 'Act'),
		MonsterDensity: getBaseStat('levels', index, ['MonDen', 'MonDen(N)', 'MonDen(H)'][me.diff]),
		ChampionPacks: ({Min: getBaseStat('levels', index, ['MonUMin', 'MonUMin(N)', 'MonUMin(H)'][me.diff]), Max: getBaseStat('levels', index, ['MonUMax', 'MonUMax(N)', 'MonUMax(H)'][me.diff])}),
		Waypoint: getBaseStat('levels', index, 'Waypoint'),
		Level: getBaseStat('levels', index, ['MonLvl1Ex', 'MonLvl2Ex', 'MonLvl3Ex'][me.diff]),
		Size: (() => {
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
		})(),
		Monsters: (MONSTER_KEYS.map(key => getBaseStat('levels', index, key)).filter(key => key !== 65535)),
		forEachMonster: function (cb) {
			if (typeof cb === 'function') {
				this.Monsters.forEach(monID => {
					cb(MonsterData[monID], MonsterData[monID].Rarity * (MonsterData[monID].GroupCount.Min + MonsterData[monID].GroupCount.Max) / 2);
				});
			}
		},
		forEachMonsterAndMinion: function (cb) {
			if (typeof cb === 'function') {
				this.Monsters.forEach(monID => {
					let rarity = MonsterData[monID].Rarity * (MonsterData[monID].GroupCount.Min + MonsterData[monID].GroupCount.Max) / 2;
					cb(MonsterData[monID], rarity, null);
					MonsterData[monID].Minions.forEach(minionID => {
						let minionrarity = MonsterData[monID].Rarity * (MonsterData[monID].MinionCount.Min + MonsterData[monID].MinionCount.Max) / 2 / MonsterData[monID].Minions.length;
						cb(MonsterData[minionID], minionrarity, MonsterData[monID]);
					});
				});
			}
		},
		LocaleString: getLocaleString(AREA_LOCALE_STRING[index]),
		InternalName: LocaleStringName[AREA_LOCALE_STRING[index]],
	});
}

AreaData.findByName = function (whatToFind) {
	let matches = AreaData.map(area => [Math.min(whatToFind.diffCount(area.LocaleString), whatToFind.diffCount(area.InternalName)), area]).sort((a, b) => a[0] - b[0]);

	return matches[0][1];
};

(AreaData);

function isAlive (unit) {
	return Boolean(unit && unit.hp);
}

function isEnemy (unit) {
	return Boolean(unit && isAlive(unit) && unit.getStat(172) !== 2 && typeof unit.classid === 'number' && MonsterData[unit.classid].Killable);
}

function onGround (item) {
	if (item.mode === 3 || item.mode === 5) {
		return true;
	}

	return false;
}

function itemTier (item) {
	if (getBaseStat(0, item.classid, 'code') === getBaseStat(0, item.classid, 'ubercode')) {
		return 1;
	}

	if (getBaseStat(0, item.classid, 'code') === getBaseStat(0, item.classid, 'ultracode')) {
		return 2;
	}

	return 0;
}

var GameData = {
	townAreas: [0, 1, 40, 75, 103, 109],
	HPLookup: [["1", "1", "1"], ["7", "107", "830"], ["9", "113", "852"], ["12", "120", "875"], ["15", "125", "897"], ["17", "132", "920"], ["20", "139", "942"], ["23", "145", "965"], ["27", "152", "987"], ["31", "157", "1010"], ["35", "164", "1032"], ["36", "171", "1055"], ["40", "177", "1077"], ["44", "184", "1100"], ["48", "189", "1122"], ["52", "196", "1145"], ["56", "203", "1167"], ["60", "209", "1190"], ["64", "216", "1212"], ["68", "221", "1235"], ["73", "228", "1257"], ["78", "236", "1280"], ["84", "243", "1302"], ["89", "248", "1325"], ["94", "255", "1347"], ["100", "261", "1370"], ["106", "268", "1392"], ["113", "275", "1415"], ["120", "280", "1437"], ["126", "287", "1460"], ["134", "320", "1482"], ["142", "355", "1505"], ["150", "388", "1527"], ["158", "423", "1550"], ["166", "456", "1572"], ["174", "491", "1595"], ["182", "525", "1617"], ["190", "559", "1640"], ["198", "593", "1662"], ["206", "627", "1685"], ["215", "661", "1707"], ["225", "696", "1730"], ["234", "729", "1752"], ["243", "764", "1775"], ["253", "797", "1797"], ["262", "832", "1820"], ["271", "867", "1842"], ["281", "900", "1865"], ["290", "935", "1887"], ["299", "968", "1910"], ["310", "1003", "1932"], ["321", "1037", "1955"], ["331", "1071", "1977"], ["342", "1105", "2000"], ["352", "1139", "2030"], ["363", "1173", "2075"], ["374", "1208", "2135"], ["384", "1241", "2222"], ["395", "1276", "2308"], ["406", "1309", "2394"], ["418", "1344", "2480"], ["430", "1379", "2567"], ["442", "1412", "2653"], ["454", "1447", "2739"], ["466", "1480", "2825"], ["477", "1515", "2912"], ["489", "1549", "2998"], ["501", "1583", "3084"], ["513", "1617", "3170"], ["525", "1651", "3257"], ["539", "1685", "3343"], ["552", "1720", "3429"], ["565", "1753", "3515"], ["579", "1788", "3602"], ["592", "1821", "3688"], ["605", "1856", "3774"], ["618", "1891", "3860"], ["632", "1924", "3947"], ["645", "1959", "4033"], ["658", "1992", "4119"], ["673", "2027", "4205"], ["688", "2061", "4292"], ["702", "2095", "4378"], ["717", "2129", "4464"], ["732", "2163", "4550"], ["746", "2197", "4637"], ["761", "2232", "4723"], ["775", "2265", "4809"], ["790", "2300", "4895"], ["805", "2333", "4982"], ["821", "2368", "5068"], ["837", "2403", "5154"], ["853", "2436", "5240"], ["868", "2471", "5327"], ["884", "2504", "5413"], ["900", "2539", "5499"], ["916", "2573", "5585"], ["932", "2607", "5672"], ["948", "2641", "5758"], ["964", "2675", "5844"], ["982", "2709", "5930"], ["999", "2744", "6017"], ["1016", "2777", "6103"], ["1033", "2812", "6189"], ["1051", "2845", "6275"], ["1068", "2880", "6362"], ["1085", "2915", "6448"], ["1103", "2948", "6534"], ["1120", "2983", "6620"], ["1137", "3016", "6707"], ["10000", "10000", "10000"]],
	monsterLevel: function (monsterID, areaID) {
		return me.diff ? AreaData[areaID].Level : MonsterData[monsterID].Level; // levels on nm/hell are determined by area, not by monster data
	},
	monsterExp: function (monsterID, areaID, adjustLevel = 0) {
		return Experience.monsterExp[Math.min(Experience.monsterExp.length - 1, this.monsterLevel(monsterID, areaID) + adjustLevel)][me.diff] * MonsterData[monsterID].ExperienceModifier / 100;
	},
	eliteExp: function (monsterID, areaID) {
		return this.monsterExp(monsterID, areaID, 2) * 3;
	},
	monsterAvgHP: function (monsterID, areaID, adjustLevel = 0) {
		return this.HPLookup[Math.min(this.HPLookup.length - 1, this.monsterLevel(monsterID, areaID) + adjustLevel)][me.diff] * (getBaseStat('monstats', monsterID, 'minHP') + getBaseStat('monstats', monsterID, 'maxHP')) / 200;
	},
	monsterMaxHP: function (monsterID, areaID, adjustLevel = 0) {
		return this.HPLookup[Math.min(this.HPLookup.length - 1, this.monsterLevel(monsterID, areaID) + adjustLevel)][me.diff] * getBaseStat('monstats', monsterID, 'maxHP') / 100;
	},
	eliteAvgHP: function (monsterID, areaID) {
		return (6 - me.diff) / 2 * this.monsterAvgHP(monsterID, areaID, 2);
	},
	averagePackSize: monsterID => (MonsterData[monsterID].GroupCount.Min + MonsterData[monsterID].MinionCount.Min + MonsterData[monsterID].GroupCount.Max + MonsterData[monsterID].MinionCount.Max) / 2,
	areaLevel: function (areaID) {
		let levels = 0, total = 0;

		if (me.diff) { // levels on nm/hell are determined by area, not by monster data
			return AreaData[areaID].Level;
		}

		AreaData[areaID].forEachMonsterAndMinion((mon, rarity) => {
			levels += mon.Level * rarity;
			total += rarity;
		});

		return Math.round(levels / total);
	},
	areaImmunities: function (areaID) {
		let resists = {Physical: 0, Magic: 0, Fire: 0, Lightning: 0, Cold: 0, Poison: 0};

		AreaData[areaID].forEachMonsterAndMinion(mon => {
			for (let k in resists) {
				resists[k] = Math.max(resists[k], mon[k]);
			}
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
	baseLevel: function (...skillIDs) {
		return skillIDs.reduce((total, skillID) => total + me.getSkill(skillID, 0), 0);
	},
	skillLevel: function (...skillIDs) {
		return skillIDs.reduce((total, skillID) => total + me.getSkill(skillID, 1), 0);
	},
	skillCooldown: function (skillID) {
		return getBaseStat('Skills', skillID, 'delay') !== -1;
	},
	stagedDamage: function (l, a, b, c, d, e, f, hitshift = 0, mult = 1) {
		if (l > 28) {
			a += f * (l - 28);
			l = 28;
		}

		if (l > 22) {
			a += e * (l - 22);
			l = 22;
		}

		if (l > 16) {
			a += d * (l - 16);
			l = 16;
		}

		if (l > 8) {
			a += c * (l - 8);
			l = 8;
		}

		a += b * (Math.max(0, l) - 1);

		return (mult * a) << hitshift;
	},
	damageTypes: ["Physical", "Fire", "Lightning", "Magic", "Cold", "Poison", "?", "?", "?", "Physical"], // 9 is Stun, but stun isn't an element
	synergyCalc: { // TODO: add melee skill damage and synergies - they are poop
		// sorc fire spells
		36: [47, 0.16, 56, 0.16],			// fire bolt
		41: [37, 0.13],	// inferno
		46: [37, 0.04, 51, 0.01],	// blaze
		47: [36, 0.14, 56, 0.14],			// fire ball
		51: [37, 0.04, 41, 0.01],	// fire wall
		52: [37, 0.09],						// enchant
		56: [36, 0.05, 47, 0.05],			// meteor
		62: [36, 0.03, 47, 0.03],			// hydra

		// sorc lightning spells
		38: [49, 0.06],						// charged bolt
		49: [38, 0.08, 48, 0.08, 53, 0.08], // lightning
		53: [38, 0.04, 48, 0.04, 49, 0.04], // chain lightning

		// sorc cold spells
		39: [44, 0.15, 45, 0.15, 55, 0.15, 59, 0.15, 64, 0.15],	// ice bolt
		44: [59, 0.10, 64, 0.10],			// frost nova
		45: [39, 0.08, 59, 0.08, 64, 0.08],	// ice blast
		55: [39, 0.05, 45, 0.05, 64, 0.05],	// glacial spike
		59: [39, 0.05, 45, 0.05, 55, 0.05],	// blizzard
		64: [39, 0.02],						// frozen orb

		// assassin traps
		251: [256, 0.09, 261, 0.09, 262, 0.09, 271, 0.09, 272, 0.09, 276, 0.09],	// fireblast
		256: [261, 0.11, 271, 0.11, 276, 0.11],	// shock web
		261: [251, 0.06, 271, 0.06, 276, 0.06],	// charged bolt sentry
		262: [251, 0.08, 272, 0.08],	// wake of fire sentry
		271: [256, 0.12, 261, 0.12, 276, 0.12],	// lightning sentry
		272: [251, 0.10, 276, 0.10, 262, 0.07],	// inferno sentry
		276: [271, 0.12],	// death sentry

		// necro bone spells
		67: [78, 0.15, 84, 0.15, 88, 0.15, 93, 0.15],	// teeth
		73: [83, 0.20, 92, 0.20],	// poison dagger
		83: [73, 0.15, 92, 0.15], // poison explosion
		84: [67, 0.07, 78, 0.07, 88, 0.07, 93, 0.07], // bone spear
		92: [73, 0.10, 83, 0.10], // poison nova
		93: [67, 0.06, 78, 0.06, 84, 0.06, 88, 0.06], // bone spirit

		// barb war cry
		154: [130, 0.06, 137, 0.06, 146, 0.06], // war cry

		// paladin combat spells
		101: [112, 0.50, 121, 0.50], // holy bolt
		112: [108, 0.14, 115, 0.14], // blessed hammer
		121: [118, 0.07], // fist of heavens

		// paladin auras
		102: [100, 0.18, 125, 0.06],	// holy fire
		114: [105, 0.15, 125, 0.07],	// holy freeze
		118: [110, 0.12, 125, 0.04],	// holy shock

		// durid elemental skills
		225: [229, 0.23, 234, 0.23],	// firestorm
		229: [244, 0.10, 225, 0.08],	// molten boulder
		234: [225, 0.12, 244, 0.12],	// fissure (eruption)
		244: [229, 0.12, 234, 0.12, 249, 0.12],	// volcano
		249: [225, 0.14, 229, 0.14, 244, 0.14],	// armageddon
		230: [250, 0.15, 235, 0.15],	// arctic blast
		240: [245, 0.10, 250, 0.10],	// twister
		245: [235, 0.09, 240, 0.09, 250, 0.09],	// tornado
		250: [240, 0.09, 245, 0.09],	// hurricane

		// durid feral skills
		238: [222, 0.18],	// rabies
		239: [225, 0.22, 229, 0.22, 234, 0.22, 244, 0.22],	// fire claws

		// amazon bow/xbow skills
		11: [21, 0.12], // cold arrow
		21: [11, 0.08],	// ice arrow
		31: [11, 0.12],	// freezing arrow
		7: [16, 0.12],	// fire arrow
		16: [7, 0.12],	// exploding arrow
		27:	[16, 0.10],	// immolation arrow

		// amazon spear/javalin skills
		14: [20, 0.10, 24, 0.10, 34, 0.10, 35, 0.10],	// power strike
		20: [14, 0.03, 24, 0.03, 34, 0.03, 35, 0.03], // lightning bolt
		24: [14, 0.10, 20, 0.10, 34, 0.10, 35, 0.10],	// charged strike
		34: [14, 0.08, 20, 0.08, 24, 0.10, 35, 0.10],	// lightning strike
		35: [14, 0.01, 20, 0.01, 24, 0.01, 34, 0.01],	// lightning fury
		15: [25, 0.12],	// poison javalin
		25: [15, 0.10],	// plague javalin
	},
	noMinSynergy: [14, 20, 24, 34, 35, 49, 53, 118, 256, 261, 271, 276],
	skillMult: {15: 25, 25: 25, 41: 25, 46: 75, 51: 75, 73: 25, 83: 25, 92: 25, 222: 25, 225: 75, 230: 25, 238: 25, 272: 25 / 3},
	baseSkillDamage: function (skillID) { // TODO: rework skill damage to use both damage fields
		let l = this.skillLevel(skillID), m = this.skillMult[skillID] || 1;
		let dmgFields = [['MinDam', 'MinLevDam1', 'MinLevDam2', 'MinLevDam3', 'MinLevDam4', 'MinLevDam5', 'MaxDam', 'MaxLevDam1', 'MaxLevDam2', 'MaxLevDam3', 'MaxLevDam4', 'MaxLevDam5'], ['EMin', 'EMinLev1', 'EMinLev2', 'EMinLev3', 'EMinLev4', 'EMinLev5', 'EMax', 'EMaxLev1', 'EMaxLev2', 'EMaxLev3', 'EMaxLev4', 'EMaxLev5']];

		if (skillID === 70) {
			return {type: "Physical",
				pmin: this.stagedDamage(l, getBaseStat('skills', skillID, dmgFields[1][0]), getBaseStat('skills', skillID, dmgFields[1][1]), getBaseStat('skills', skillID, dmgFields[1][2]), getBaseStat('skills', skillID, dmgFields[1][3]), getBaseStat('skills', skillID, dmgFields[1][4]), getBaseStat('skills', skillID, dmgFields[1][5]), getBaseStat('skills', skillID, 'HitShift'), m),
				pmax: this.stagedDamage(l, getBaseStat('skills', skillID, dmgFields[1][0]), getBaseStat('skills', skillID, dmgFields[1][1]), getBaseStat('skills', skillID, dmgFields[1][2]), getBaseStat('skills', skillID, dmgFields[1][3]), getBaseStat('skills', skillID, dmgFields[1][4]), getBaseStat('skills', skillID, dmgFields[1][5]), getBaseStat('skills', skillID, 'HitShift'), m),
				min: 0, max: 0};
		} else {
			let type = getBaseStat('skills', skillID, 'EType');

			return {
				type: this.damageTypes[type],
				pmin: this.stagedDamage(l, getBaseStat('skills', skillID, dmgFields[0][0]), getBaseStat('skills', skillID, dmgFields[0][1]), getBaseStat('skills', skillID, dmgFields[0][2]), getBaseStat('skills', skillID, dmgFields[0][3]), getBaseStat('skills', skillID, dmgFields[0][4]), getBaseStat('skills', skillID, dmgFields[0][5]), getBaseStat('skills', skillID, 'HitShift'), m),
				pmax: this.stagedDamage(l, getBaseStat('skills', skillID, dmgFields[0][6]), getBaseStat('skills', skillID, dmgFields[0][7]), getBaseStat('skills', skillID, dmgFields[0][8]), getBaseStat('skills', skillID, dmgFields[0][9]), getBaseStat('skills', skillID, dmgFields[0][10]), getBaseStat('skills', skillID, dmgFields[0][11]), getBaseStat('skills', skillID, 'HitShift'), m),
				min: type ? this.stagedDamage(l, getBaseStat('skills', skillID, dmgFields[1][0]), getBaseStat('skills', skillID, dmgFields[1][1]), getBaseStat('skills', skillID, dmgFields[1][2]), getBaseStat('skills', skillID, dmgFields[1][3]), getBaseStat('skills', skillID, dmgFields[1][4]), getBaseStat('skills', skillID, dmgFields[1][5]), getBaseStat('skills', skillID, 'HitShift'), m) : 0,
				max: type ? this.stagedDamage(l, getBaseStat('skills', skillID, dmgFields[1][6]), getBaseStat('skills', skillID, dmgFields[1][7]), getBaseStat('skills', skillID, dmgFields[1][8]), getBaseStat('skills', skillID, dmgFields[1][9]), getBaseStat('skills', skillID, dmgFields[1][10]), getBaseStat('skills', skillID, dmgFields[1][11]), getBaseStat('skills', skillID, 'HitShift'), m) : 0
			};
		}
	},
	skillRadius: {
		47: 8,
		55: 3,
		56: 12,
		92: 24,
		154: 12,
		249: 24,
		250: 24,
		251: 3,
	},
	novaLike: {
		44: true,
		48: true,
		92: true,
		112: true,
		154: true,
		249: true,
		250: true,
	},
	wolfBanned: {
		225: true,
		229: true,
		230: true,
		233: true,
		234: true,
		235: true,
		240: true,
		243: true,
		244: true,
		245: true,
		250: true,
	},
	bearBanned: {
		225: true,
		229: true,
		230: true,
		232: true,
		234: true,
		235: true,
		238: true,
		240: true,
		244: true,
		245: true,
		248: true,
	},
	humanBanned: {
		232: true,
		233: true,
		238: true,
		239: true,
		242: true,
		243: true,
		248: true,
	},
	shiftState: function () {
		if (me.getState(139)) {
			return "wolf";
		}

		if (me.getState(140)) {
			return "bear";
		}

		return "human";
	},
	bestForm: function (skillID) {
		if (this.shiftState() === "human" && this.humanBanned[skillID]) {
			let highest = {ID: 0, Level: 0};

			if (!this.wolfBanned[skillID] && this.skillLevel(223) > highest.Level) {
				highest.ID = 223;
				highest.Level = this.skillLevel(223);
			}

			if (!this.bearBanned[skillID] && this.skillLevel(228) > highest.Level) {
				highest.ID = 228;
				highest.Level = this.skillLevel(228);
			}

			return highest.ID;
		} else if (this.shiftState() === "wolf" && this.wolfBanned[skillID]) {
			return 223;
		} else if (this.shiftState() === "bear" && this.bearBanned[skillID]) {
			return 228;
		}

		return 0;
	},
	dmgModifier: function (skillID, target) {
		let aps = (typeof target === 'number' ? this.averagePackSize(target) : 1), eliteBonus = (target.spectype && target.spectype & 0x7) ? 1 : 0, hitcap = 1;

		switch (skillID) { // charged bolt/strike excluded, it's so unreliably random
		case 15: // poison javalin
		case 25: // plague javalin
		case 16: // exploding arrow
		case 27: // immolation arrow
		case 31: // freezing arrow
		case 35: // lightning fury
		case 44: // frost nova
		case 48: // nova
		case 56: // meteor
		case 59: // blizzard
		case 64: // frozen orb
		case 83: // poison explosion
		case 92: // poison nova
		case 112: // blessed hammer
		case 154: // war cry
		case 229: // molten boulder
		case 234: // fissure
		case 249: // armageddon
		case 244: // volcano
		case 250: // hurricane
		case 251: // fireblast
		case 261: // charged bolt sentry
		case 262: // wake of fire
		case 55: // glacial spike
		case 47: // fire ball
			hitcap = Infinity;
			break;
		case 34: // lightning strike
			hitcap = 1 + this.skillLevel(34);
			break;
		case 38: // charged bolt
			hitcap = 2 + this.skillLevel(38);
			break;
		case 67: // teeth
			hitcap = 1 + this.skillLevel(67);
			break;
		case 53: // chain lightning
			hitcap = 5 + ((this.skillLevel(53) / 5) | 0);
			break;
		case 49: // lightning
		case 84: // bone spear
		case 271: // lightning sentry
		case 276: // death sentry
			hitcap = aps ? Math.sqrt(aps / Math.PI) * 2 : 1;
			break;
		default:
			hitcap = 1;
			break;
		}

		if (typeof target !== 'number') {
			let unit = getUnit(1);
			let radius = this.skillRadius[skillID] || 18;

			if (unit) {
				do {
					if (aps >= hitcap) {
						break;
					}

					if (target.gid !== unit.gid && getDistance(unit, this.novaLike[skillID] ? me : target) <= radius && isEnemy(unit)) {
						aps++;

						if (unit.spectype & 0x7) {
							eliteBonus++;
						}
					}
				} while (unit.getNext());
			}
		} else {
			aps = Math.min(aps, hitcap);
		}

		aps += eliteBonus * (4 - me.diff) / 2;

		return aps;
	},
	skillDamage: function (skillID) {
		if (skillID === 0) {
			return {type: "Physical", pmin: 2, pmax: 8, min: 0, max: 0}; // short sword, no reqs
		}

		if (this.skillLevel(skillID) < 1) {
			return {type: this.damageTypes[getBaseStat('skills', skillID, 'EType')], pmin: 0, pmax: 0, min: 0, max: 0};
		}

		let dmg = this.baseSkillDamage(skillID), mastery = 1, psynergy = 1, synergy = 1, shots = 1, sl = 0;

		if (this.synergyCalc[skillID]) {
			let sc = this.synergyCalc[skillID];

			for (let c = 0; c < sc.length; c += 2) {
				sl = this.baseLevel(sc[c]);

				if (skillID === 229 || skillID === 244) {
					if (sc[c] === 229 || sc[c] === 244) { // molten boulder and volcano
						psynergy += sl * sc[c + 1]; // they only synergize physical with each other
					} else {
						synergy += sl * sc[c + 1]; // all other skills synergize only fire with these skills
					}
				} else {
					psynergy += sl * sc[c + 1];
					synergy += sl * sc[c + 1];
				}
			}
		}

		if (skillID === 227 || skillID === 237 || skillID === 247) {
			sl = this.skillLevel(247);
			psynergy += 0.15 + sl * 0.10;
			synergy += 0.15 + sl * 0.10;
		}

		switch (dmg.type) {
		case "Fire": // fire mastery
			mastery = 1 + me.getStat(329) / 100;
			dmg.min *= mastery;
			dmg.max *= mastery;
			break;
		case "Lightning": // lightning mastery
			mastery = 1 + me.getStat(330) / 100;
			dmg.min *= mastery;
			dmg.max *= mastery;
			break;
		case "Cold": // cold mastery
			mastery = 1 + me.getStat(331) / 100;
			dmg.min *= mastery;
			dmg.max *= mastery;
			break;
		case "Poison": // poison mastery
			mastery = 1 + me.getStat(332) / 100;
			dmg.min *= mastery;
			dmg.max *= mastery;
			break;
		case "Magic": // magic mastery
			mastery = 1 + me.getStat(357) / 100;
			dmg.min *= mastery;
			dmg.max *= mastery;
			break;
		}

		dmg.pmin *= psynergy;
		dmg.pmax *= psynergy;

		if (this.noMinSynergy.indexOf(skillID) < 0) {
			dmg.min *= synergy;
		}

		dmg.max *= synergy;

		switch (skillID) {
		case 102: // holy fire
			dmg.min *= 6; // weapon damage is 6x the aura damage
			dmg.max *= 6;
			break;
		case 114: // holy freeze
			dmg.min *= 5; // weapon damage is 5x the aura damage
			dmg.max *= 5;
			break;
		case 118: // holy shock
			dmg.min *= 6; // weapon damage is 6x the aura damage
			dmg.max *= 6;
			break;
		case 249: // armageddon
			dmg.pmin = dmg.pmax = 0;
			break;
		}

		dmg.pmin >>= 8;
		dmg.pmax >>= 8;
		dmg.min >>= 8;
		dmg.max >>= 8;

		switch (skillID) {
		case 59: // blizzard - on average hits twice
			dmg.min *= 2;
			dmg.max *= 2;
			break;
		case 62: // hydra - 3 heads
			dmg.min *= 3;
			dmg.max *= 3;
			break;
		case 64: // frozen orb - on average hits ~5 times
			dmg.min *= 5;
			dmg.max *= 5;
			break;
		case 70: // skeleton - a hit per skeleton
			sl = this.skillLevel(70);
			shots = sl < 4 ? sl : (2 + sl / 3) | 0;
			sl = Math.max(0, sl - 3);
			dmg.pmin = shots * (dmg.pmin + 1 + this.skillLevel(69) * 2) * (1 + sl * 0.07);
			dmg.pmax = shots * (dmg.pmax + 2 + this.skillLevel(69) * 2) * (1 + sl * 0.07);
			break;
		case 94: // fire golem
			sl = this.skillLevel(94);
			dmg.min = [10, 15, 18][me.diff] + dmg.min + (this.stagedDamage(sl + 7, 2, 1, 2, 3, 5, 7) >> 1) * 6; // basically holy fire added
			dmg.max = [27, 39, 47][me.diff] + dmg.max + (this.stagedDamage(sl + 7, 6, 1, 2, 3, 5, 7) >> 1) * 6;
			break;
		case 101: // holy bolt
			dmg.undeadOnly = true;
			break;
		case 112: // blessed hammer
			sl = this.skillLevel(113);

			if (sl > 0) {
				mastery = (100 + ((45 + this.skillLevel(113) * 15) >> 1)) / 100;	// hammer gets half concentration dmg bonus
				dmg.min *= mastery;
				dmg.max *= mastery;
			}

			break;
		case 221: // raven - a hit per raven
			shots = Math.min(5, this.skillLevel(221)); // 1-5 ravens
			dmg.pmin *= shots;
			dmg.pmax *= shots;
			break;
		case 227: // spirit wolf - a hit per wolf
			shots = Math.min(5, this.skillLevel(227));
			dmg.pmin *= shots;
			dmg.pmax *= shots;
			break;
		case 237: // dire wolf - a hit per wolf
			shots = Math.min(3, this.skillLevel(237));
			dmg.pmin *= shots;
			dmg.pmax *= shots;
			break;
		case 240: // twister
			dmg.pmin *= 3;
			dmg.pmax *= 3;
			break;
		case 261: // charged bolt sentry
		case 262: // wake of fire
		case 271: // lightning sentry
		case 272: // inferno sentry
		case 276: // death sentry
			dmg.min *= 5;	// can have 5 traps out at a time
			dmg.max *= 5;
			break;
		}

		dmg.pmin |= 0;
		dmg.pmax |= 0;
		dmg.min |= 0;
		dmg.max |= 0;

		return dmg;
	},
	allSkillDamage: function () {
		let skills = {};

		me.getSkill(4).forEach(skill => (skills[skill[0]] = this.skillDamage(skill[0])));

		return skills;
	},
	convictionEligible: {
		Fire: true,
		Lightning: true,
		Cold: true,
	},
	lowerResistEligible: {
		Fire: true,
		Lightning: true,
		Cold: true,
		Poison: true,
	},
	resistMap: {
		Physical: 36,
		Fire: 39,
		Lightning: 41,
		Cold: 43,
		Poison: 45,
		Magic: 37,
	},
	masteryMap: {
		Fire: 329,
		Lightning: 330,
		Cold: 331,
		Poison: 332,
		Magic: 357,
	},
	pierceMap: {
		Fire: 333,
		Lightning: 334,
		Cold: 335,
		Poison: 336,
		Magic: 358,
	},
	ignoreSkill: {
		40: true,
		50: true,
		60: true,
	},
	buffs: {
		8: 1,
		9: 1,
		13: 1,
		17: 1,
		18: 1,
		23: 1,
		28: 1,
		29: 1,
		32: 1,
		37: 1,
		40: 2,
		46: 1,
		50: 2,
		52: 1,
		57: 1,
		58: 1,
		60: 2,
		61: 1,
		63: 1,
		65: 1,
		68: 1,
		69: 1,
		79: 1,
		89: 1,
		98: 3,
		99: 3,
		100: 3,
		102: 3,
		103: 3,
		104: 3,
		105: 3,
		108: 3,
		109: 3,
		110: 3,
		113: 3,
		114: 3,
		115: 3,
		118: 3,
		119: 3,
		120: 3,
		122: 3,
		123: 3,
		124: 3,
		125: 3,
		127: 1,
		128: 1,
		129: 1,
		134: 1,
		135: 1,
		136: 1,
		138: 1,
		141: 1,
		145: 1,
		148: 1,
		149: 1,
		153: 1,
		155: 1,
		221: 1,
		222: 4,
		223: 5,
		224: 1,
		226: 6,
		227: 7,
		228: 5,
		231: 4,
		235: 1,
		236: 6,
		237: 7,
		241: 4,
		246: 6,
		247: 7,
		249: 1,
		250: 1,
		258: 8,
		267: 8,
		268: 9,
		279: 9,
	},
	monsterResist: function (unit, type) {
		let stat = this.resistMap[type];

		return stat ? (unit.getStat ? unit.getStat(stat) : MonsterData[unit][type]) : 0;
	},
	getConviction: function () {
		let sl = this.skillLevel(123); // conviction

		return sl > 0 ? Math.min(150, 30 + (sl - 1) * 5) : 0;
	},
	getAmp: function () {
		return this.skillLevel(66) ? 100 : (this.skillLevel(87) ? 50 : 0);
	},
	monsterEffort: function (unit, areaID, skillDamageInfo, parent = undefined) {
		let eret = {effort: Infinity, skill: -1, type: "Physical"};
		let useCooldown = (typeof unit === 'number' ? false : Boolean(me.getState(121))), hp = this.monsterMaxHP(typeof unit.classid === 'number' ? unit.classid : unit, areaID);
		let conviction = this.getConviction(), ampDmg = this.getAmp(), isUndead = (typeof unit === 'number' ? MonsterData[unit].Undead : MonsterData[unit.classid].Undead);
		skillDamageInfo = skillDamageInfo || this.allSkillDamage();

		let buffDmg = [], buffDamageInfo = {}, newSkillDamageInfo = {};

		for (let sk in skillDamageInfo) {
			if (this.buffs[sk]) {
				if (typeof unit === 'number') {
					buffDmg[this.buffs[sk]] = 0;
					buffDamageInfo[sk] = skillDamageInfo[sk];
				}
			} else {
				newSkillDamageInfo[sk] = skillDamageInfo[sk];
			}
		}

		skillDamageInfo = newSkillDamageInfo;

		for (let sk in buffDamageInfo) {
			let avgPDmg = (buffDamageInfo[sk].pmin + buffDamageInfo[sk].pmax) / 2;
			let avgDmg = (buffDamageInfo[sk].min + buffDamageInfo[sk].max) / 2;
			let tmpDmg = 0;

			if (avgPDmg > 0) {
				let presist = this.monsterResist(unit, "Physical");

				presist -= (presist >= 100 ? ampDmg / 5 : ampDmg);
				presist = Math.max(-100, Math.min(100, presist));
				tmpDmg += avgPDmg * (100 - presist) / 100;
			}

			if (avgDmg > 0 && (!isUndead || !buffDamageInfo[sk].undeadOnly)) {
				let resist = this.monsterResist(unit, buffDamageInfo[sk].type);
				let pierce = me.getStat(this.pierceMap[buffDamageInfo[sk].type]);

				if (this.convictionEligible[buffDamageInfo[sk].type]) {
					resist -= (resist >= 100 ? conviction / 5 : conviction);
				}

				if (resist < 100) {
					resist = Math.max(-100, resist - pierce);
				} else {
					resist = 100;
				}

				tmpDmg += avgDmg * (100 - resist) / 100;
			}

			if (this.buffs[sk] === 1) {
				buffDmg[this.buffs[sk]] += tmpDmg;
			} else {
				buffDmg[this.buffs[sk]] = Math.max(buffDmg[this.buffs[sk]], tmpDmg);
			}
		}

		buffDmg = buffDmg.reduce((t, v) => t + v, 0);

		for (let sk in skillDamageInfo) {
			if (!this.ignoreSkill[sk] && (!useCooldown || !this.skillCooldown(sk | 0))) {
				let avgPDmg = (skillDamageInfo[sk].pmin + skillDamageInfo[sk].pmax) / 2, totalDmg = buffDmg;
				let avgDmg = (skillDamageInfo[sk].min + skillDamageInfo[sk].max) / 2;

				if (avgPDmg > 0) {
					let presist = this.monsterResist(unit, "Physical");

					presist -= (presist >= 100 ? ampDmg / 5 : ampDmg);
					presist = Math.max(-100, Math.min(100, presist));
					totalDmg += avgPDmg * (100 - presist) / 100;
				}

				if (avgDmg > 0 && (!isUndead || !skillDamageInfo[sk].undeadOnly)) {
					let resist = this.monsterResist(unit, skillDamageInfo[sk].type);
					let pierce = me.getStat(this.pierceMap[skillDamageInfo[sk].type]);

					if (this.convictionEligible[skillDamageInfo[sk].type]) {
						resist -= (resist >= 100 ? conviction / 5 : conviction);
					}

					if (resist < 100) {
						resist = Math.max(-100, resist - pierce);
					} else {
						resist = 100;
					}

					totalDmg += avgDmg * (100 - resist) / 100;

				}

				let tmpEffort = Math.ceil(hp / totalDmg);

				tmpEffort /= this.dmgModifier(sk | 0, parent || unit);

				if (tmpEffort <= eret.effort) {
					eret.effort = tmpEffort;
					eret.skill = sk | 0;
					eret.type = skillDamageInfo[eret.skill].type;
				}
			}
		}

		return eret.skill >= 0 ? eret : null;
	},
	areaEffort: function (areaID, skills) {
		let effortpool = 0, raritypool = 0;
		skills = skills || this.allSkillDamage();

		AreaData[areaID].forEachMonsterAndMinion((mon, rarity, parent) => {
			effortpool += rarity * this.monsterEffort(mon.Index, areaID, skills, parent && parent.Index).effort;
			raritypool += rarity;
		});

		return raritypool ? effortpool / raritypool : Infinity;
	},
	areaSoloExp: function (areaID, skills) {
		let effortpool = 0, raritypool = 0;
		skills = skills || this.allSkillDamage();
		AreaData[areaID].forEachMonsterAndMinion((mon, rarity, parent) => {
			effortpool += rarity * this.monsterExp(mon.Index, areaID) * this.levelModifier(me.charlvl, this.monsterLevel(mon.Index, areaID)) / this.monsterEffort(mon.Index, areaID, skills, parent && parent.Index).effort;
			raritypool += rarity;
		});

		return raritypool ? effortpool / raritypool : 0;
	},
};
