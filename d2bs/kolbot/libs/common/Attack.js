/**
*	@filename	Attack.js
*	@author		kolton
*	@desc		handle player attacks
*/

var Attack = {
	classes: ["Amazon", "Sorceress", "Necromancer", "Paladin", "Barbarian", "Druid", "Assassin"],
	infinity: false,

	// Initialize attacks
	init: function () {
		if (Config.Wereform) {
			include("common/Attacks/wereform.js");
		} else {
			include("common/Attacks/" + this.classes[me.classid] + ".js");
		}

		ClassAttack.init();

		if (Config.AttackSkill[1] < 0 || Config.AttackSkill[3] < 0) {
			showConsole();
			print("ÿc1Bad attack config. Don't expect your bot to attack.");
		}

		if (me.gametype === 1) {
			this.checkInfinity();
			this.getCharges();
		}
	},

	// Get items with charges
	getCharges: function () {
		if (!Skill.charges) {
			Skill.charges = [];
		}

		var i, stats,
			item = me.getItem(-1, 1);

		if (item) {
			do {
				stats = item.getStat(-2);

				if (stats.hasOwnProperty(204)) {
					if (stats[204] instanceof Array) {
						for (i = 0; i < stats[204].length; i += 1) {
							if (stats[204][i] !== undefined) {
								Skill.charges.push({
									unit: copyUnit(item),
									gid: item.gid,
									skill: stats[204][i].skill,
									level: stats[204][i].level,
									charges: stats[204][i].charges,
									maxcharges: stats[204][i].maxcharges
								});
							}
						}
					} else {
						Skill.charges.push({
							unit: copyUnit(item),
							gid: item.gid,
							skill: stats[204].skill,
							level: stats[204].level,
							charges: stats[204].charges,
							maxcharges: stats[204].maxcharges
						});
					}
				}
			} while (item.getNext());
		}

		return true;
	},

	// Check if player or his merc are using Infinity, and adjust resistance checks based on that
	checkInfinity: function () {
		var i, merc, item;

		for (i = 0; i < 3; i += 1) {
			merc = me.getMerc();

			if (merc) {
				break;
			}

			delay(50);
		}

		// Check merc infinity
		if (merc) {
			item = merc.getItem();

			if (item) {
				do {
					if (item.getPrefix(20566)) {
						this.infinity = true;

						return true;
					}
				} while (item.getNext());
			}
		}

		// Check player infinity
		item = me.getItem(-1, 1);

		if (item) {
			do {
				if (item.getPrefix(20566)) {
					this.infinity = true;

					return true;
				}
			} while (item.getNext());
		}

		return false;
	},

	// Kill a monster based on its classId, can pass a unit as well
	kill: function (classId) {
		if (Config.AttackSkill[1] < 0) {
			return false;
		}

		var i, target, gid,
			attackCount = 0;

		if (typeof classId === "object") {
			target = classId;
		}

		for (i = 0; !target && i < 5; i += 1) {
			target = getUnit(1, classId);

			delay(200);
		}

		if (!target) {
			throw new Error("Attack.kill: Target not found");
		}

		gid = target.gid;

		if (Config.MFLeader) {
			Pather.makePortal();
			say("kill " + classId);
		}

		while (attackCount < 300 && this.checkMonster(target) && this.skipCheck(target)) {
			// Get the target again if the bot went to town and back
			if (Misc.townCheck()) {
				target = getUnit(1, -1, -1, gid);
			}

			if (copyUnit(target).x === undefined) { // Check if unit got invalidated, happens if necro raises a skeleton from the boss's corpse.
				break;
			}

			if (Config.Dodge && me.hp * 100 / me.hpmax <= Config.DodgeHP) {
				this.deploy(target, Config.DodgeRange, 5, 9);
			}

			if (Config.MFSwitchPercent && target.hp / 128 * 100 < Config.MFSwitchPercent) {
				Precast.weaponSwitch(Math.abs(Config.MFSwitch));
			}

			if (ClassAttack.doAttack(target, attackCount % 15 === 0) < 2) {
				break;
			}

			attackCount += 1;
		}

		if (Config.MFSwitchPercent) {
			Precast.weaponSwitch(Math.abs(Config.MFSwitch - 1));
		}

		ClassAttack.afterAttack();

		if (copyUnit(target).x === undefined) {
			return true;
		}

		if (target.hp > 0 && target.mode !== 0 && target.mode !== 12) {
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

		if (range === undefined) {
			range = 25;
		}

		if (spectype === undefined) {
			spectype = 0;
		}

		if (bossId === undefined) {
			bossId = false;
		}

		if (sortfunc === undefined) {
			sortfunc = false;
		}

		if (pickit === undefined) {
			pickit = true;
		}

		if (typeof (range) !== "number") {
			throw new Error("Attack.clear: range must be a number.");
		}

		var i, boss, orgx, orgy, target, result, monsterList, start,
			gidAttack = [],
			attackCount = 0;

		if (Config.AttackSkill[1] < 0 || Config.AttackSkill[3] < 0) {
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
				if ((!spectype || (target.spectype & spectype)) && this.checkMonster(target) && this.skipCheck(target)) {
					// Speed optimization - don't go through monster list until there's at least one within clear range
					if (!start && getDistance(target, orgx, orgy) <= range &&
							(me.getSkill(54, 1) || !Scripts.Follower || !checkCollision(me, target, 0x1))) {
						start = true;
					}

					monsterList.push(copyUnit(target));
				}
			} while (target.getNext());
		}

		if (!start) {
			return true;
		}

		while (monsterList.length > 0) {
			if (boss) {
				orgx = boss.x;
				orgy = boss.y;
			}

			if (me.dead) {
				return false;
			}

			//monsterList.sort(Sort.units);
			monsterList.sort(sortfunc);

			target = copyUnit(monsterList[0]);

			if (target.x !== undefined && (getDistance(target, orgx, orgy) <= range || (this.getScarinessLevel(target) > 7 && getDistance(me, target) <= range)) && this.checkMonster(target)) {
				if (Config.Dodge && me.hp * 100 / me.hpmax <= Config.DodgeHP) {
					this.deploy(target, Config.DodgeRange, 5, 9);
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

		if (attackCount > 0 && pickit) {
			Pickit.pickItems();
		}

		return true;
	},

	// Filter monsters based on classId, spectype and range
	getMob: function (classid, spectype, range) {
		var monsterList = [],
			monster = getUnit(1);

		switch (classid) {
		case -1:
			break;
		default:
			if (typeof classid === "number") {
				classid = [classid];
			}

			break;
		}

		if (monster) {
			do {
				if ((classid === -1 || classid.indexOf(monster.classid) > -1) && getDistance(me, monster) <= range &&
						(!spectype || (monster.spectype & spectype)) && this.checkMonster(monster)) {
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
	clearList: function (mainArg, sortFunc) {
		var i, target, result, monsterList,
			gidAttack = [],
			attackCount = 0;

		switch (typeof mainArg) {
		case "function":
			monsterList = mainArg.call();

			break;
		case "object":
			monsterList = mainArg.slice(0);

			break;
		case "boolean":
			return false;
		default:
			throw new Error("clearList: Invalid argument");
		}

		if (!sortFunc) {
			sortFunc = this.sortMonsters;
		}

		while (monsterList.length > 0) {
			delay(5);

			if (me.dead) {
				return false;
			}

			monsterList.sort(Sort.units);
			monsterList.sort(sortFunc);

			target = copyUnit(monsterList[0]);

			if (target.x !== undefined && this.checkMonster(target)) {
				if (Config.Dodge && me.hp * 100 / me.hpmax <= Config.DodgeHP) {
					this.deploy(target, Config.DodgeRange, 5, 9);
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

		if (attackCount > 0) {
			Pickit.pickItems();
		}

		return true;
	},

	securePosition: function (x, y, range, timer) {
		if (arguments.length < 4) {
			throw new Error("securePosition needs 4 arguments");
		}

		var monster, monList, tick;

		while (true) {
			if (getDistance(me, x, y) > 5) {
				Pather.moveTo(x, y);
			}

			monster = getUnit(1);
			monList = [];

			if (monster) {
				do {
					if (getDistance(monster, x, y) <= range && this.checkMonster(monster) &&
							((me.classid === 1 && me.getSkill(54, 1)) || me.getStat(97, 54) || !checkCollision(me, monster, 0x1))) {
						monList.push(copyUnit(monster));
					}
				} while (monster.getNext());
			}

			if (!monList.length) {
				if (!tick) {
					tick = getTickCount();
				}

				// only return if it's been safe long enough
				if (getTickCount() - tick >= timer) {
					return true;
				}
			} else {
				this.clearList(monList);

				// reset the timer when there's monsters in range
				if (tick) {
					tick = false;
				}
			}

			delay(200);
		}

		return true;
	},

	// Draw lines around a room on minimap
	markRoom: function (room, color) {
		var arr = [];

		arr.push(new Line(room.x * 5, room.y * 5, room.x * 5, room.y * 5 + room.ysize, color, true));
		arr.push(new Line(room.x * 5, room.y * 5, room.x * 5 + room.xsize, room.y * 5, color, true));
		arr.push(new Line(room.x * 5 + room.xsize, room.y * 5, room.x * 5 + room.xsize, room.y * 5 + room.ysize, color, true));
		arr.push(new Line(room.x * 5, room.y * 5 + room.ysize, room.x * 5 + room.xsize, room.y * 5 + room.ysize, color, true));
	},

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

		if (spectype === undefined) {
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

				if (!this.clear(40, spectype)) {
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
		// No special sorting for were-form
		if (Config.Wereform) {
			return getDistance(me, unitA) - getDistance(me, unitB);
		}

		// Classic barb optimization
		if (me.gametype === 0 && me.classid === 4) {
			if (!Attack.checkResist(unitA, ClassAttack.skillElement[(unitA.spectype & 0x7) ? 1 : 3])) {
				return 1;
			}

			if (!Attack.checkResist(unitB, ClassAttack.skillElement[(unitB.spectype & 0x7) ? 1 : 3])) {
				return -1;
			}
		}

		var ids = [58, 59, 60, 61, 62, 101, 102, 103, 104, 105, 278, 279, 280, 281, 282, 298, 299, 300, 645, 646, 647, 662, 663, 664, 667, 668, 669, 670, 675, 676];

		if (me.area !== 61 && ids.indexOf(unitA.classid) > -1 && ids.indexOf(unitB.classid) > -1) {
			// Kill "scary" uniques first (like Bishibosh)
			if ((unitA.spectype & 0x04) && (unitB.spectype & 0x04)) {
				return getDistance(me, unitA) - getDistance(me, unitB);
			}

			if (unitA.spectype & 0x04) {
				return -1;
			}

			if (unitB.spectype & 0x04) {
				return 1;
			}

			return getDistance(me, unitA) - getDistance(me, unitB);
		}

		if (ids.indexOf(unitA.classid) > -1) {
			return -1;
		}

		if (ids.indexOf(unitB.classid) > -1) {
			return 1;
		}

		if (Config.BossPriority) {
			if ((unitA.spectype & 0x5) && (unitB.spectype & 0x5)) {
				return getDistance(me, unitA) - getDistance(me, unitB);
			}

			if (unitA.spectype & 0x5) {
				return -1;
			}

			if (unitB.spectype & 0x5) {
				return 1;
			}
		}

		return getDistance(me, unitA) - getDistance(me, unitB);
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

	buildDodgeList: function () {
		var monster,
			monList = [];

		monster = getUnit(1);

		if (monster) {
			do {
				if (this.checkMonster(monster)) {
					monList.push(copyUnit(monster));
				}
			} while (monster.getNext());
		}

		return monList;
	},

	deploy: function (unit, distance, spread, range) {
		if (arguments.length < 4) {
			throw new Error("deploy: Not enough arguments supplied");
		}

		var i, grid, index, currCount,
			tick = getTickCount(),
			monList = [],
			count = 999,
			idealPos = {
				x: Math.round(Math.cos(Math.atan2(me.y - unit.y, me.x - unit.x)) * Config.DodgeRange + unit.x),
				y: Math.round(Math.sin(Math.atan2(me.y - unit.y, me.x - unit.x)) * Config.DodgeRange + unit.y)
			};

		monList = this.buildDodgeList();

		monList.sort(Sort.units);

		if (this.getMonsterCount(me.x, me.y, range, monList) === 0) {
			return true;
		}

		CollMap.getNearbyRooms(unit.x, unit.y);

		grid = this.buildGrid(unit.x - distance, unit.x + distance, unit.y - distance, unit.y + distance, spread);

		//print("Grid build time: " + (getTickCount() - tick));

		if (!grid.length) {
			return false;
		}

		function sortGrid(a, b) {
			return getDistance(a.x, a.y, idealPos.x, idealPos.y) - getDistance(b.x, b.y, idealPos.x, idealPos.y);
		}

		grid.sort(sortGrid);

		for (i = 0; i < grid.length; i += 1) {
			if (!(CollMap.getColl(grid[i].x, grid[i].y, true) & 0x1) && !CollMap.checkColl(unit, {x: grid[i].x, y: grid[i].y}, 0x4)) {
				currCount = this.getMonsterCount(grid[i].x, grid[i].y, range, monList);

				if (currCount < count) {
					index = i;
					count = currCount;
				}

				if (currCount === 0) {
					break;
				}
			}
		}

		//print("Safest spot with " + count + " monsters.");

		if (typeof index === "number") {
			//print("Dodge build time: " + (getTickCount() - tick));

			return Pather.moveTo(grid[index].x, grid[index].y, 3);
		}

		return false;
	},

	getMonsterCount: function (x, y, range, list) {
		var i,
			count = 0;

		for (i = 0; i < list.length; i += 1) {
			if (this.checkMonster(list[i]) && getDistance(x, y, list[i].x, list[i].y) <= range) {
				count += 1;
			}
		}

		return count;
	},

	buildGrid: function (xmin, xmax, ymin, ymax, spread) {
		if (xmin >= xmax || ymin >= ymax || spread < 1) {
			throw new Error("buildGrid: Bad parameters");
		}

		var i, j, coll,
			grid = [];

		for (i = xmin; i <= xmax; i += spread) {
			for (j = ymin; j <= ymax; j += spread) {
				coll = CollMap.getColl(i, j, true);

				if (typeof coll === "number") {
					grid.push({x: i, y: j, coll: coll});
				}
			}
		}

		return grid;
	},

	// Check if a monster is attackable
	checkMonster: function (unit) {
		if (!unit || !copyUnit(unit).x) {
			return false;
		}

		if (unit.type === 0 && unit.mode !== 17) { // Player
			return true;
		}

		if (unit.hp === 0 || unit.mode === 0 || unit.mode === 12) { // Dead monster
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
		case 144: // Concentrate
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
		if (walk === undefined) {
			walk = false;
		}

		if (walk && distance < 4) {
			if (getDistance(me, unit) > 8 || checkCollision(me, unit, coll)) {
				Pather.moveToUnit(unit, 0, 0, 0, 1);
			}

			return true;
		}

		var n, i, cx, cy, t,
			coords = [],
			angle = Math.round(Math.atan2(me.y - unit.y, me.x - unit.x) * 180 / Math.PI),
			angles = [0, 15, -15, 30, -30, 45, -45, 60, -60, 75, -75, 90, -90, 135, -135, 180];

		t = getTickCount();

		CollMap.getNearbyRooms(unit.x, unit.y);

		for (n = 0; n < 3; n += 1) {
			if (n > 0) {
				distance = Math.floor(distance / 2);
			}

			for (i = 0; i < angles.length; i += 1) {
				cx = Math.round((Math.cos((angle + angles[i]) * Math.PI / 180)) * distance + unit.x);
				cy = Math.round((Math.sin((angle + angles[i]) * Math.PI / 180)) * distance + unit.y);

				if (Pather.checkSpot(cx, cy, true)) {
					coords.push({x: cx, y: cy});
				}
			}

			//print("ÿc9potential spots: ÿc2" + coords.length);

			if (coords.length > 0) {
				coords.sort(Sort.units);

				for (i = 0; i < coords.length; i += 1) {
					if (!CollMap.checkColl(unit, {x: coords[i].x, y: coords[i].y}, coll, 2)) {
						//print("ÿc9optimal pos build time: ÿc2" + (getTickCount() - t)); // + " ÿc9distance from target: ÿc2" + getDistance(cx, cy, unit.x, unit.y));

						return walk ? Pather.walkTo(coords[i].x, coords[i].y, 2) : Pather.moveTo(coords[i].x, coords[i].y, 0);
					}
				}
			}
		}

		//print("optimal pos fail.");

		return false;
	}
};