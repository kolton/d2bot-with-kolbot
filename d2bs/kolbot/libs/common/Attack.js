/**
*	@filename	Attack.js
*	@author		kolton
*	@desc		handle player attacks
*/

var Attack = {
	classes: ["Amazon", "Sorceress", "Necromancer", "Paladin", "Barbarian", "Druid", "Assassin"],
	infinity: false,
	dodgePos: [],

	// Initialize attacks
	init: function () {
		if (include("common/Attacks/" + this.classes[me.classid] + ".js")) {
			ClassAttack.init();
		}

		if (Config.AttackSkill[1] < 0 && Config.AttackSkill[3] < 0) {
			showConsole();
			print("ÿc1No attack skills set. Don't expect your bot to attack.");
		}

		if (me.gametype === 1) {
			this.checkInfinity();
		}
	},

	// Check if player or his merc are using Infinity, and adjust resistance checks based on that
	checkInfinity: function () {
		var i, merc, items;

		for (i = 0; i < 3; i += 1) {
			merc = me.getMerc();

			if (merc) {
				break;
			}

			delay(50);
		}

		// Check merc infinity
		if (merc) {
			items = merc.getItems();

			if (items) {
				for (i = 0; i < items.length; i += 1) {
					if (items[i].getPrefix(20566)) {
						//print("Infinity detected");

						this.infinity = true;

						return true;
					}
				}
			}
		}

		// Check player infinity
		items = me.findItems(-1, 1);

		if (items) {
			for (i = 0; i < items.length; i += 1) {
				if (items[i].getPrefix(20566)) {
					//print("Infinity detected");

					this.infinity = true;

					return true;
				}
			}
		}

		return false;
	},

	// Kill a monster based on its classId
	kill: function (classId) {
		if (Config.AttackSkill[1] < 0) {
			return false;
		}

		var i, target, test,
			dodgeList = [],
			attackCount = 0;

		for (i = 0; !target && i < 5; i += 1) {
			target = getUnit(1, classId);

			delay(200);
		}

		if (!target) {
			throw new Error("Attack.kill: Target not found");
		}

		if (Config.MFLeader) {
			Pather.makePortal();
			say("kill " + classId);
		}

		while (attackCount < 300 && this.checkMonster(target) && this.skipCheck(target)) {
			if (Config.Dodge) {
				if (attackCount % 5 === 0) {
					dodgeList = this.buildDodgeList();
				}

				if (dodgeList.length) {
					dodgeList.sort(Sort.units);

					if (typeof test === "undefined") {
						test = {x: target.x, y: target.y};
					}

					if (getDistance(me, dodgeList[0]) < 13) {
						this.dodge(test, ClassAttack.skillRange[1] || 15, dodgeList);
					}
				}
			}

			Misc.townCheck();

			if (Config.MFSwitchPercent && target.hp / 128 * 100 < Config.MFSwitchPercent) {
				Precast.weaponSwitch(Math.abs(Config.MFSwitch));
			}

			if (ClassAttack.doAttack(target, attackCount % 15 === 0) < 2) {
				break;
			}

			if (!copyUnit(target).x) { // Check if unit got invalidated, happens if necro raises a skeleton from the boss's corpse.
				break;
			}

			attackCount += 1;
		}

		this.dodgePos = [];

		if (Config.MFSwitchPercent) {
			Precast.weaponSwitch(Math.abs(Config.MFSwitch - 1));
		}

		if (!copyUnit(target).x) {
			return true;
		}

		if (target.mode !== 0 && target.mode !== 12) {
			throw new Error("Failed to kill " + target.name);
		}

		return true;
	},

	getScarinessLevel: function (unit) {
		var scariness = 0, ids = [58, 59, 60, 61, 62, 101, 102, 103, 104, 105, 278, 279, 280, 281, 282, 298, 299, 300, 645, 646, 647, 662, 663, 664, 667, 668, 669, 670, 675, 676];

		// Only handling monsters for now
		if (unit.type !== 1) {
			return undefined;
		}

		// Minion
		if (unit.spectype & 0x08) {
			scariness += 1;
		}

		// Champion
		if (unit.spectype & 0x02) {
			scariness += 2;
		}

		// Boss
		if (unit.spectype & 0x04) {
			scariness += 4;
		}

		// Summoner or the like
		if (ids.indexOf(unit.classid) > -1) {
			scariness += 8;
		}

		return scariness;
	},

	// Clear monsters in a section based on range and spectype or clear monsters around a boss monster
	clear: function (range, spectype, bossId, sortfunc, pickit) { // probably going to change to passing an object
		if (Config.MFLeader && !!bossId) {
			Pather.makePortal();
			say("clear " + bossId);
		}

		if (typeof range === "undefined") {
			range = 25;
		}

		if (typeof spectype === "undefined") {
			spectype = 0;
		}

		if (typeof bossId === "undefined") {
			bossId = false;
		}

		if (typeof sortfunc === "undefined") {
			sortfunc = false;
		}

		if (typeof pickit === "undefined") {
			pickit = true;
		}

		if (typeof (range) !== "number") {
			throw new Error("Attack.clear: range must be a number.");
		}

		var i, boss, orgx, orgy, target, result, monsterList,
			dodgeList = [],
			gidAttack = [],
			attackCount = 0;

		if (Config.AttackSkill[1] < 0 || Config.AttackSkill[me.classid === 4 ? 2 : 3] < 0) {
			return false;
		}

		if (!sortfunc) {
			sortfunc = this.sortMonsters;
		}

		if (bossId) {
			for (i = 0; !boss && i < 5; i += 1) {
				boss = getUnit(1, bossId);

				delay(200);
			}

			if (!boss) {
				throw new Error("Attack.clear: " + bossId + " not found");
			}

			orgx = boss.x;
			orgy = boss.y;
		} else {
			orgx = me.x;
			orgy = me.y;
		}

		monsterList = [];
		target = getUnit(1);

		if (target) {
			do {
				if (this.checkMonster(target) && this.skipCheck(target)) {
					monsterList.push(copyUnit(target));
				}
			} while (target.getNext());
		}

		while (monsterList.length > 0) {
			delay(5);

			if (me.dead) {
				return false;
			}

			monsterList.sort(Sort.units);
			monsterList.sort(sortfunc);

			target = copyUnit(monsterList[0]);

			if (typeof target.x !== "undefined" &&
					((Math.abs(orgx - target.x) <= range && Math.abs(orgy - target.y) <= range) ||
					(this.getScarinessLevel(target) > 7 && Math.abs(me.x - target.x) <= range && Math.abs(me.y - target.y) <= range)) &&
					(!spectype || (target.spectype & spectype)) &&
					this.checkMonster(target) &&
					(me.getSkill(54, 1) || !checkCollision(me, target, 0x1))
					) {
				if (Config.Dodge) {
					if (attackCount % 5 === 0) {
						dodgeList = this.buildDodgeList();
					}

					if (attackCount > 0 && dodgeList.length > 0) {
						dodgeList.sort(Sort.units);

						if (getDistance(me, dodgeList[0]) < 13) {
							//this.dodge(dodgeList[0], 15, dodgeList);
							this.dodge(target, 20, dodgeList);
						}
					}
				}

				Misc.townCheck(true);
				//me.overhead("attacking " + target.name + " spectype " + target.spectype + " id " + target.classid);

				result = ClassAttack.doAttack(target, attackCount % 15 === 0);

				switch (result) {
				case 1:
					monsterList.shift();

					break;
				case 2:
				case 3:
					if (!(target.spectype & 0x7) && me.area !== 131) {
						for (i = 0; i < gidAttack.length; i += 1) {
							if (gidAttack[i].gid === target.gid) {
								break;
							}
						}

						if (i === gidAttack.length) {
							gidAttack.push({gid: target.gid, attacks: 0});
						}

						gidAttack[i].attacks += 1;

						if (gidAttack[i].attacks > 15) {
							print("ÿc1Skipping " + target.name + " " + target.gid + " " + gidAttack[i].attacks);
							monsterList.shift();
						}
					}

					attackCount += 1;

					if (target.mode === 0 || target.mode === 12) {
						Pickit.fastPick();
					}

					break;
				default:
					return false;
				}
			} else {
				monsterList.shift();
			}
		}

		ClassAttack.afterAttack(pickit);
		this.openChests(range);
		this.dodgePos = [];

		if (attackCount > 0 && pickit) {
			Pickit.pickItems();
		}

		return true;
	},

	// Filter monsters based on classId, spectype and range
	getMob: function (classid, spectype, range) {
		var monsterList = [],
			monster = getUnit(1, classid);

		if (monster) {
			do {
				if (getDistance(me, monster) <= range && (!spectype || (monster.spectype & spectype)) && this.checkMonster(monster)) {
					monsterList.push(copyUnit(monster));
				}
			} while (monster.getNext());
		}

		if (!monsterList.length) {
			return false;
		}

		return monsterList;
	},

	// Clear an already formed array of monstas
	clearList: function (list, sortfunc) {
		var i, target, result,
			dodgeList = [],
			gidAttack = [],
			attackCount = 0,
			monsterList = list.slice(0);

		if (!sortfunc) {
			sortfunc = this.sortMonsters;
		}

		while (monsterList.length > 0) {
			monsterList.sort(Sort.units);
			monsterList.sort(sortfunc);

			target = copyUnit(monsterList[0]);

			if (typeof target.x !== "undefined" && this.checkMonster(target)) {
				if (Config.Dodge) {
					if (attackCount % 5 === 0) {
						dodgeList = this.buildDodgeList();
					}

					if (attackCount > 0 && dodgeList.length > 0) {
						dodgeList.sort(Sort.units);

						if (getDistance(me, dodgeList[0]) < 13) {
							//this.dodge(dodgeList[0], 15, dodgeList);
							this.dodge(target, 20, dodgeList);
						}
					}
				}

				Misc.townCheck(true);
				//me.overhead("attacking " + target.name + " spectype " + target.spectype + " id " + target.classid);

				result = ClassAttack.doAttack(target, attackCount % 15 === 0);

				switch (result) {
				case 1:
					monsterList.shift();

					break;
				case 2:
				case 3:
					if (!(target.spectype & 0x7) && me.area !== 131) {
						for (i = 0; i < gidAttack.length; i += 1) {
							if (gidAttack[i].gid === target.gid) {
								break;
							}
						}

						if (i === gidAttack.length) {
							gidAttack.push({gid: target.gid, attacks: 0});
						}

						gidAttack[i].attacks += 1;

						if (gidAttack[i].attacks > 15) {
							print("ÿc1Skipping " + target.name + " " + target.gid + " " + gidAttack[i].attacks);
							monsterList.shift();
						}
					}

					attackCount += 1;

					break;
				default:
					return false;
				}
			} else {
				monsterList.shift();
			}
		}

		ClassAttack.afterAttack(true);
		this.openChests(30);
		this.dodgePos = [];

		if (attackCount > 0) {
			Pickit.pickItems();
		}

		return true;
	},

	// Draw lines around a room on minimap
	/*markRoom: function (room, color) {
		new Line(room.x * 5, room.y * 5, room.x * 5, room.y * 5 + room.ysize, color, true);
		new Line(room.x * 5, room.y * 5, room.x * 5 + room.xsize, room.y * 5, color, true);
		new Line(room.x * 5 + room.xsize, room.y * 5, room.x * 5 + room.xsize, room.y * 5 + room.ysize, color, true);
		new Line(room.x * 5, room.y * 5 + room.ysize, room.x * 5 + room.xsize, room.y * 5 + room.ysize, color, true);
	},*/

	// Clear an entire area based on monster spectype
	clearLevel: function (spectype) {
		if (Config.MFLeader) {
			Pather.makePortal();
			say("clearlevel " + getArea().name);
		}

		var room, result, rooms, myRoom;

		function RoomSort(a, b) {
			return getDistance(myRoom[0], myRoom[1], a[0], a[1]) - getDistance(myRoom[0], myRoom[1], b[0], b[1]);
		}

		room = getRoom();

		if (!room) {
			return false;
		}

		if (typeof spectype === "undefined") {
			spectype = 0;
		}

		rooms = [];

		do {
			rooms.push([room.x * 5 + room.xsize / 2, room.y * 5 + room.ysize / 2]);
		} while (room.getNext());

		while (rooms.length > 0) {
			// get the first room + initialize myRoom var
			if (!myRoom) {
				room = getRoom(me.x, me.y);
			}

			if (room) {
				if (room instanceof Array) { // use previous room to calculate distance
					myRoom = [room[0], room[1]];
				} else { // create a new room to calculate distance (first room, done only once)
					myRoom = [room.x * 5 + room.xsize / 2, room.y * 5 + room.ysize / 2];
				}
			}

			rooms.sort(RoomSort);
			room = rooms.shift();

			result = Pather.getNearestWalkable(room[0], room[1], 15, 3);

			if (result) {
				//this.markRoom(getRoom(room[0], room[1]), 0x84);
				Pather.moveTo(result[0], result[1], 3);

				if (!this.clear(30, spectype)) {
					return false;
				}
			}/* else {
				this.markRoom(getRoom(room[0], room[1]), 0x62);
			}*/
		}

		return true;
	},

	// Sort monsters based on distance, spectype and classId (summoners are attacked first)
	sortMonsters: function (unitA, unitB) {
		var ids = [58, 59, 60, 61, 62, 101, 102, 103, 104, 105, 278, 279, 280, 281, 282, 298, 299, 300, 645, 646, 647, 662, 663, 664, 667, 668, 669, 670, 675, 676];

		if (ids.indexOf(unitA.classid) > -1 &&
				ids.indexOf(unitB.classid) > -1) {
			// Kill "scary" uniques first (like Bishibosh)
			if ((unitA.spectype & 0x04) !== 0 &&
					(unitB.spectype & 0x04) !== 0) {
				return 0;
			}

			if ((unitA.spectype & 0x04) !== 0) {
				return -1;
			}

			if ((unitB.spectype & 0x04) !== 0) {
				return 1;
			}

			return 0;
		}

		if (ids.indexOf(unitA.classid) > -1) {
			return -1;
		}

		if (ids.indexOf(unitB.classid) > -1) {
			return 1;
		}

		if (Config.BossPriority) {
			if (unitA.spectype & 0x5) {
				return -1;
			}

			if (unitB.spectype & 0x5) {
				return 1;
			}
		}

		return 0;
	},

	// Check if a set of coords is valid/accessable
	validSpot: function (x, y) {
		var result;

		if (!me.area || !x || !y) { // Just in case
			return false;
		}

		try { // Treat thrown errors as invalid spot
			result = getCollision(me.area, x, y);
		} catch (e) {
			return false;
		}

		// Avoid non-walkable spots, objects
		if (result === undefined || result & 0x1 || result & 0x400) {
			return false;
		}

		return true;
	},

	// Open chests when clearing
	openChests: function (range) {
		if (!Config.OpenChests) {
			return false;
		}

		var i, unit,
			ids = ["chest", "weaponrack", "armorstand"];

		for (i = 0; i < ids.length; i += 1) {
			unit = getUnit(2, ids[i]);

			if (unit) {
				do {
					if ((getDistance(me, unit) <= range) && Misc.openChest(unit)) {
						Pickit.pickItems();
					}
				} while (unit.getNext());
			}
		}

		return true;
	},

	// Make a list of monsters that will be monitored for dodging
	buildDodgeList: function () {
		var ignoreList = [243, 544],
			monster = getUnit(1),
			list = [];

		if (monster) {
			do {
				if (ignoreList.indexOf(monster.classid) === -1 && this.checkMonster(monster)) {
					list.push(copyUnit(monster));
				}
			} while (monster.getNext());
		}

		return list;
	},

	// Move away from a nearby monster into a more safe position
	dodge: function (unit, distance, list) {
		var i, j, coordx, coordy, count,
			maxcount = 99,
			coords = [],
			goodCoords = [],
			angle = Math.round(Math.atan2(me.y - unit.y, me.x - unit.x) * 180 / Math.PI),
			angles = [0, 30, -30, 60, -60, 90, -90, 120, -120, 150, -150, 180];

		if (!this.dodgePos.length || getDistance(me.x, me.y, this.dodgePos[0][0], this.dodgePos[0][1]) > 50) {
			print("Build dodgePos");

			// step 1 - build possible dodge positions based on angles
			for (i = 0; i < angles.length; i = i + 1) {
				coordx = Math.round((Math.cos((angle + angles[i]) * Math.PI / 180)) * distance + unit.x);
				coordy = Math.round((Math.sin((angle + angles[i]) * Math.PI / 180)) * distance + unit.y);

				if (this.validSpot(coordx, coordy)) {
					coords.push([coordx, coordy]);
				}
			}

			if (coords.length === 0) { // no valid positions - don't move
				me.overhead("Can't dodge :(");

				return true;
			}

			this.dodgePos = coords.slice();
		} else {
			coords = this.dodgePos.slice();
		}

		coords.sort(Sort.points);

		for (i = 0; i < coords.length; i += 1) {
			count = 0;

			for (j = 0; j < list.length; j += 1) {
				if (list[j].hp > 0 && getDistance(list[j].x, list[j].y, coords[i][0], coords[i][1]) < 13) {
					count += 1;
				}
			}

			if (count < maxcount) {
				goodCoords = [coords[i][0], coords[i][1]];
				maxcount = count;

				if (count === 0) {
					break;
				}
			}
		}

		if (goodCoords.length > 0) { // just in case goodCoords is empty (shouldn't happen)
			if (getDistance(me, goodCoords[0], goodCoords[1]) < 4) { // close enough
				return true;
			}

			me.overhead("Dodge!");
			Pather.moveTo(goodCoords[0], goodCoords[1], 1);
		}

		return true;
	},

	// Check if a monster is attackable
	checkMonster: function (unit) {
		if (!unit || !copyUnit(unit).x) {
			return false;
		}

		if (unit.type === 0 && unit.mode !== 17) { // Player
			return true;
		}

		if (unit.mode === 0 || unit.mode === 12) { // Dead monster
			return false;
		}

		if (unit.getStat(172) === 2) {	// Friendly monster/NPC
			return false;
		}

		if (getBaseStat("monstats", unit.classid, "neverCount")) { // neverCount base stat - hydras, traps etc.
			return false;
		}

		switch (unit.classid) {
		case 179: // An evil force - cow (lol)
			return false;
		case 543: // Baal in Throne
			if (me.area === 131) {
				return false;
			}

			break;
		case 110: // Vultures
		case 111:
		case 112:
		case 113:
		case 114:
		case 608:
			if (unit.mode === 8) { // Flying
				return false;
			}

			break;
		case 68: // Sand Maggots
		case 69:
		case 70:
		case 71:
		case 72:
		case 679:
		case 258: // Water Watchers
		case 259:
		case 260:
		case 261:
		case 262:
		case 263:
			if (unit.mode === 14) { // Submerged/Burrowed
				return false;
			}

			break;
		}

		return true;
	},

	skipCheck: function (unit) {
		if (me.area === 131) {
			return true;
		}

		var i, j, rval,
			tempArray = [];

EnchantLoop: // Skip enchanted monsters
		for (i = 0; i < Config.SkipEnchant.length; i += 1) {
			tempArray = Config.SkipEnchant[i].toLowerCase().split(" and ");

			for (j = 0; j < tempArray.length; j += 1) {
				switch (tempArray[j]) {
				case "extra strong":
					tempArray[j] = 5;

					break;
				case "extra fast":
					tempArray[j] = 6;

					break;
				case "cursed":
					tempArray[j] = 7;

					break;
				case "magic resistant":
					tempArray[j] = 8;

					break;
				case "fire enchanted":
					tempArray[j] = 9;

					break;
				case "lightning enchanted":
					tempArray[j] = 17;

					break;
				case "cold enchanted":
					tempArray[j] = 18;

					break;
				case "mana burn":
					tempArray[j] = 25;

					break;
				case "teleportation":
					tempArray[j] = 26;

					break;
				case "spectral hit":
					tempArray[j] = 27;

					break;
				case "stone skin":
					tempArray[j] = 28;

					break;
				case "multiple shots":
					tempArray[j] = 29;

					break;
				}
			}

			for (j = 0; j < tempArray.length; j += 1) {
				if (!unit.getEnchant(tempArray[j])) {
					break;
				}
			}

			if (j === tempArray.length) {
				return false;
			}
		}

ImmuneLoop: // Skip immune monsters
		for (i = 0; i < Config.SkipImmune.length; i += 1) {
			tempArray = Config.SkipImmune[i].toLowerCase().split(" and ");

			for (j = 0; j < tempArray.length; j += 1) {
				if (this.checkResist(unit, tempArray[j])) { // Infinity calculations are built-in
					break;
				}
			}

			if (j === tempArray.length) {
				return false;
			}
		}

AuraLoop: // Skip monsters with auras
		for (i = 0; i < Config.SkipAura.length; i += 1) {
			rval = true;

			switch (Config.SkipAura[i].toLowerCase()) {
			case "fanaticism":
				if (unit.getState(49)) {
					rval = false;
				}

				break;
			case "might":
				if (unit.getState(33)) {
					rval = false;
				}

				break;
			case "holy fire":
				if (unit.getState(35)) {
					rval = false;
				}

				break;
			case "blessed aim":
				if (unit.getState(40)) {
					rval = false;
				}

				break;
			case "conviction":
				if (unit.getState(28)) {
					rval = false;
				}

				break;
			case "holy freeze":
				if (unit.getState(43)) {
					rval = false;
				}

				break;
			case "holy shock":
				if (unit.getState(46)) {
					rval = false;
				}

				break;
			}

			if (!rval) {
				return false;
			}
		}

		return true;
	},

	// Get element by skill number
	getSkillElement: function (skillId) {
		this.elements = ["physical", "fire", "lightning", "magic", "cold", "poison", "none"];

		switch (skillId) {
		case 74: // Corpse Explosion
		case 147: // Frenzy
		case 273: // Minge Blast
		case 500: // Summoner
			return "physical";
		case 101: // Holy Bolt
			return "holybolt"; // no need to use this.elements array because it returns before going over the array
		}

		var eType = getBaseStat("skills", skillId, "etype");

		if (typeof (eType) === "number") {
			return this.elements[eType];
		}

		return false;
	},

	// Get a monster's resistance to specified element
	getResist: function (unit, type) {
		if (unit.type === 0) { // player
			return 0;
		}

		switch (type) {
		case "physical":
			return unit.getStat(36);
		case "fire":
			return unit.getStat(39);
		case "lightning":
			return unit.getStat(41);
		case "magic":
			return unit.getStat(37);
		case "cold":
			return unit.getStat(43);
		case "poison":
			return unit.getStat(45);
		case "none":
			return 0;
		case "holybolt": // check if a monster is undead
			if (getBaseStat("monstats", unit.classid, "lUndead") || getBaseStat("monstats", unit.classid, "hUndead")) {
				return 0;
			}

			return 100;
		}

		return 100;
	},

	// Check if a monster is immune to specified attack type
	checkResist: function (unit, type, maxres) {
		if (unit.type === 0) { // player
			return true;
		}

		if (typeof maxres !== "number") {
			maxres = 100;
		}

		if (this.infinity && ["fire", "lightning", "cold"].indexOf(type) > -1) {
			if (!unit.getState(28)) {
				return this.getResist(unit, type) < 117;
			}

			return this.getResist(unit, type) < maxres;
		}

		return this.getResist(unit, type) < maxres;
	},

	// Detect use of bows/crossbows
	usingBow: function () {
		var item;

		item = me.getItem(-1, 1);

		if (item) {
			do {
				if (item.bodylocation === 4 || item.bodylocation === 5) {
					switch (item.itemType) {
					case 27: // Bows
					case 85: // Amazon Bows
						return "bow";
					case 35: // Crossbows
						return "crossbow";
					}
				}
			} while (item.getNext());
		}

		return false;
	},

	// Find an optimal attack position and move or walk to it
	getIntoPosition: function (unit, distance, coll, walk) {
		if (typeof walk === "undefined") {
			walk = false;
		}

		var n, i, cx, cy, t,
			coords = [],
			angle = Math.round(Math.atan2(me.y - unit.y, me.x - unit.x) * 180 / Math.PI),
			angles = [0, 45, 90, 135, 180, 225, 270, 305];

		t = getTickCount();

		for (n = 0; n < 3; n += 1) {
			if (n > 0) {
				distance = Math.floor(distance / 2);
			}

			for (i = 0; i < angles.length; i += 1) {
				cx = Math.round((Math.cos((angle + angles[i]) * Math.PI / 180)) * distance + unit.x);
				cy = Math.round((Math.sin((angle + angles[i]) * Math.PI / 180)) * distance + unit.y);

				//if (this.validSpot(cx, cy)) {
				if (Pather.checkSpot(cx, cy)) {
					coords.push([cx, cy]);
				}
			}

			//print("ÿc9potential spots: ÿc2" + coords.length);

			if (coords.length > 0) {
				coords.sort(Sort.points); // sort angles by final spot distance

				for (i = 0; i < coords.length; i += 1) { // sorted angles are coords[i][2]
					if (!CollMap.checkColl(unit, {x: coords[i][0], y: coords[i][1]}, coll)) {
						CollMap.reset();
						//print("ÿc9optimal pos build time: ÿc2" + (getTickCount() - t)); // + " ÿc9distance from target: ÿc2" + getDistance(cx, cy, unit.x, unit.y));

						return (walk ? Pather.walkTo(coords[i][0], coords[i][1]) : Pather.moveTo(coords[i][0], coords[i][1], 3));
					}
				}
			}
		}

		//print("optimal pos fail.");
		CollMap.reset();

		return false;
	}
};