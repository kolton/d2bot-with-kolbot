/**
*	@filename	Attack.js
*	@author		kolton
*	@desc		handle player attacks
*/
if (!isIncluded("common/Enums.js")) { include("common/Enums.js"); };

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

		if (Config.AttackSkill[1] < 0 || Config.AttackSkill[3] < 0) {
			showConsole();
			print("ÿc1Bad attack config. Don't expect your bot to attack.");
		}

        if (me.gametype === GameType.Expansion) {
			this.checkInfinity();
			this.getCharges();
		}
	},

	getCustomAttack: function (unit) {
		var i;

		// Check if unit got invalidated
		if (!unit || !unit.name || !copyUnit(unit).x) {
			return false;
		}

		for (i in Config.CustomAttack) {
			if (Config.CustomAttack.hasOwnProperty(i) && unit.name.toLowerCase() === i.toLowerCase()) {
				return Config.CustomAttack[i];
			}
		}

		return false;
	},

	// Get items with charges
	getCharges: function () {
		if (!Skill.charges) {
			Skill.charges = [];
		}

		var i, stats,
            item = me.getItem(-1, ItemModes.Item_equipped_self_or_merc);

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
        item = me.getItem(-1, ItemModes.Item_equipped_self_or_merc);

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
			errorInfo = "",
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
			Misc.townCheck();

			if (!target || !copyUnit(target).x) { // Check if unit got invalidated, happens if necro raises a skeleton from the boss's corpse.
                target = getUnit(UnitType.NPC, -1, -1, gid);

				if (!target) {
					break;
				}
			}

			if (Config.Dodge && me.hp * 100 / me.hpmax <= Config.DodgeHP) {
				this.deploy(target, Config.DodgeRange, 5, 9);
			}

			if (Config.MFSwitchPercent && target.hp / 128 * 100 < Config.MFSwitchPercent) {
				Precast.weaponSwitch(Math.abs(Config.MFSwitch));
			}

			if (attackCount > 0 && attackCount % 15 === 0 && Skill.getRange(Config.AttackSkill[1]) < 4) {
				Packet.flash(me.gid);
			}

			if (!ClassAttack.doAttack(target, attackCount % 15 === 0)) {
				errorInfo = " (doAttack failed)";

				break;
			}

			attackCount += 1;
		}

		if (attackCount === 300) {
			errorInfo = " (attackCount exceeded)";
		}

		if (Config.MFSwitchPercent) {
			Precast.weaponSwitch(Math.abs(Config.MFSwitch - 1));
		}

		ClassAttack.afterAttack();

		if (!target || !copyUnit(target).x) {
			return true;
		}

        if (target.hp > 0 && target.mode !== NPCModes.death && target.mode !== NPCModes.dead) {
			throw new Error("Failed to kill " + target.name + errorInfo);
		}

		return true;
	},

	hurt: function (classId, percent) {
		var i, target,
			attackCount = 0;

		for (i = 0; i < 5; i += 1) {
            target = getUnit(UnitType.NPC, classId);

			if (target) {
				break;
			}

			delay(200);
		}

		while (attackCount < 300 && Attack.checkMonster(target) && Attack.skipCheck(target)) {
			if (!ClassAttack.doAttack(target, attackCount % 15 === 0)) {
				break;
			}

			if (!copyUnit(target).x) {
				return true;
			}

			attackCount += 1;

			if (target.hp * 100 / 128 <= percent) {
				break;
			}
		}

		return true;
	},

	getScarinessLevel: function (unit) {
        var scariness = 0, ids = [UnitClassID.fallenshaman1, UnitClassID.fallenshaman2, UnitClassID.fallenshaman3, UnitClassID.fallenshaman4, UnitClassID.fallenshaman5,
            UnitClassID.unraveler1, UnitClassID.unraveler2, UnitClassID.unraveler3, UnitClassID.unraveler4, UnitClassID.unraveler5, UnitClassID.fetishshaman1, UnitClassID.fetishshaman2,
            UnitClassID.fetishshaman3, UnitClassID.fetishshaman4, UnitClassID.fetishshaman5, UnitClassID.vilemother1, UnitClassID.vilemother2, UnitClassID.vilemother3,
            UnitClassID.fallenshaman6, UnitClassID.fallenshaman7, UnitClassID.fallenshaman8, UnitClassID.fetishshaman6, UnitClassID.fetishshaman7, UnitClassID.fetishshaman8,
            UnitClassID.unraveler6, UnitClassID.unraveler7, UnitClassID.unraveler8, UnitClassID.unraveler9, UnitClassID.vilemother4, UnitClassID.vilemother5];

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
		while (!me.gameReady) {
			delay(40);
		}

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
                boss = bossId > 999 ? getUnit(UnitType.NPC, -1, -1, bossId) : getUnit(UnitType.NPC, bossId);

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
        target = getUnit(UnitType.NPC);

		if (target) {
			do {
				if ((!spectype || (target.spectype & spectype)) && this.checkMonster(target) && this.skipCheck(target)) {
					// Speed optimization - don't go through monster list until there's at least one within clear range
					if (!start && getDistance(target, orgx, orgy) <= range &&
                        (me.getSkill(Skills.Sorceress.Teleport, 1) || !Scripts.Follower || !checkCollision(me, target, 0x1))) {
						start = true;
					}

					monsterList.push(copyUnit(target));
				}
			} while (target.getNext());
		}

		while (start && monsterList.length > 0 && attackCount < 300) {
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

				if (result) {
					for (i = 0; i < gidAttack.length; i += 1) {
						if (gidAttack[i].gid === target.gid) {
							break;
						}
					}

					if (i === gidAttack.length) {
						gidAttack.push({gid: target.gid, attacks: 0, name: target.name});
					}

					gidAttack[i].attacks += 1;
					attackCount += 1;

					// Desync/bad position handler
					switch (Config.AttackSkill[(target.spectype & 0x7) ? 1 : 3]) {
                        case Skills.Paladin.Blessed_Hammer:
						//print(gidAttack[i].name + " " + gidAttack[i].attacks);

						// Tele in random direction with Blessed Hammer
						if (gidAttack[i].attacks > 0 && gidAttack[i].attacks % ((target.spectype & 0x7) ? 4 : 2) === 0) {
							//print("random move m8");
							Pather.moveTo(me.x + rand(-1, 1) * 5, me.y + rand(-1, 1) * 5);
						}

						break;
					default:
						// Flash with melee skills
						if (gidAttack[i].attacks > 0 && gidAttack[i].attacks % ((target.spectype & 0x7) ? 15 : 5) === 0 && Skill.getRange(Config.AttackSkill[(target.spectype & 0x7) ? 1 : 3]) < 4) {
							Packet.flash(me.gid);
						}

						break;
					}

					// Skip non-unique monsters after 15 attacks, except in Throne of Destruction
					if (me.area !== Areas.Act5.Throne_Of_Destruction && !(target.spectype & 0x7) && gidAttack[i].attacks > 15) {
						print("ÿc1Skipping " + target.name + " " + target.gid + " " + gidAttack[i].attacks);
						monsterList.shift();
					}

                    if (target.mode === NPCModes.death || target.mode === NPCModes.dead || Config.FastPick === 2) {
						Pickit.fastPick();
					}
				} else {
					monsterList.shift();
				}
			} else {
				monsterList.shift();
			}
		}

		ClassAttack.afterAttack(pickit);
		this.openChests(range, orgx, orgy);

		if (attackCount > 0 && pickit) {
			Pickit.pickItems();
		}

		return true;
	},

	// Filter monsters based on classId, spectype and range
	getMob: function (classid, spectype, range, center) {
		var monsterList = [],
            monster = getUnit(UnitType.NPC);

		if (range === undefined) {
			range = 25;
		}

		if (!center) {
			center = me;
		}

		switch (typeof classid) {
		case "number":
		case "string":
                monster = getUnit(UnitType.NPC, classid);

			if (monster) {
				do {
					if (getDistance(center.x, center.y, monster.x, monster.y) <= range && (!spectype || (monster.spectype & spectype)) && this.checkMonster(monster)) {
						monsterList.push(copyUnit(monster));
					}
				} while (monster.getNext());
			}

			break;
		case "object":
                monster = getUnit(UnitType.NPC);

			if (monster) {
				do {
					if (classid.indexOf(monster.classid) > -1 && getDistance(center.x, center.y, monster.x, monster.y) <= range && (!spectype || (monster.spectype & spectype)) && this.checkMonster(monster)) {
						monsterList.push(copyUnit(monster));
					}
				} while (monster.getNext());
			}

			break;
		}

		if (!monsterList.length) {
			return false;
		}

		return monsterList;
	},

	// Clear an already formed array of monstas
	clearList: function (mainArg, sortFunc, refresh) {
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
		case "boolean": // false from Attack.getMob()
			return false;
		default:
			throw new Error("clearList: Invalid argument");
		}

		if (!sortFunc) {
			sortFunc = this.sortMonsters;
		}

		while (monsterList.length > 0 && attackCount < 300) {
			if (refresh && attackCount > 0 && attackCount % refresh === 0) {
				monsterList = mainArg.call();
			}

			if (me.dead) {
				return false;
			}

			monsterList.sort(sortFunc);

			target = copyUnit(monsterList[0]);

			if (target.x !== undefined && this.checkMonster(target)) {
				if (Config.Dodge && me.hp * 100 / me.hpmax <= Config.DodgeHP) {
					this.deploy(target, Config.DodgeRange, 5, 9);
				}

				Misc.townCheck(true);
				//me.overhead("attacking " + target.name + " spectype " + target.spectype + " id " + target.classid);

				result = ClassAttack.doAttack(target, attackCount % 15 === 0);

				if (result) {
					for (i = 0; i < gidAttack.length; i += 1) {
						if (gidAttack[i].gid === target.gid) {
							break;
						}
					}

					if (i === gidAttack.length) {
						gidAttack.push({gid: target.gid, attacks: 0});
					}

					gidAttack[i].attacks += 1;

					// Desync/bad position handler
					switch (Config.AttackSkill[(target.spectype & 0x7) ? 1 : 3]) {
					case 112:
						// Tele in random direction with Blessed Hammer
						if (gidAttack[i].attacks > 0 && gidAttack[i].attacks % ((target.spectype & 0x7) ? 5 : 15) === 0) {
							Pather.moveTo(me.x + rand(-1, 1) * 4, me.y + rand(-1, 1) * 4);
						}

						break;
					default:
						// Flash with melee skills
						if (gidAttack[i].attacks > 0 && gidAttack[i].attacks % ((target.spectype & 0x7) ? 5 : 15) === 0 && Skill.getRange(Config.AttackSkill[(target.spectype & 0x7) ? 1 : 3]) < 4) {
							Packet.flash(me.gid);
						}

						break;
					}

                    // Skip non-unique monsters after 15 attacks, except in Throne of Destruction
                    if (me.area !== Areas.Act5.Throne_Of_Destruction && !(target.spectype & 0x7) && gidAttack[i].attacks > 15) {
						print("ÿc1Skipping " + target.name + " " + target.gid + " " + gidAttack[i].attacks);
						monsterList.shift();
					}

					attackCount += 1;

                    if (target.mode === NPCModes.death || target.mode === NPCModes.dead || Config.FastPick === 2) {
						Pickit.fastPick();
					}
				} else {
					monsterList.shift();
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

	securePosition: function (x, y, range, timer, skipBlocked, special) {
		/*if (arguments.length < 4) {
			throw new Error("securePosition needs 4 arguments");
		}*/

		var monster, monList, tick;

		if (skipBlocked === true) {
			skipBlocked = 0x4;
		}

		while (true) {
			if (getDistance(me, x, y) > 5) {
				Pather.moveTo(x, y);
			}

            monster = getUnit(UnitType.NPC);
			monList = [];

			if (monster) {
				do {
					if (getDistance(monster, x, y) <= range && this.checkMonster(monster) && this.canAttack(monster) &&
							(!skipBlocked || !checkCollision(me, monster, skipBlocked)) &&
                        ((me.classid === ClassID.Sorceress && me.getSkill(Skills.Sorceress.Teleport, 1)) || me.getStat(Stats.item_nonclassskill, Skills.Sorceress.Teleport) || !checkCollision(me, monster, 0x1))) {
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

			if (special) {
				switch (me.classid) {
				case ClassID.Paladin: // Paladin Redemption addon
					if (me.getSkill(Skills.Paladin.Redemption, 1)) {
						Skill.setSkill(Skills.Paladin.Redemption, 0);
						delay(1000);
					}

					break;
				}
			}

			delay(100);
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

	countUniques: function () {
		if (!this.uniques) {
			this.uniques = 0;
		}

		if (!this.ignoredGids) {
			this.ignoredGids = [];
		}

		var monster = getUnit(1);

		if (monster) {
			do {
				if ((monster.spectype & 0x5) && this.ignoredGids.indexOf(monster.gid) === -1) {
					this.uniques += 1;
					this.ignoredGids.push(monster.gid);
				}
			} while (monster.getNext());
		}
	},

	storeStatistics: function (area) {
		var obj;

		if (!FileTools.exists("statistics.json")) {
			Misc.fileAction("statistics.json", 1, "{}");
		}

		obj = JSON.parse(Misc.fileAction("statistics.json", 0));

		if (obj) {
			if (obj[area] === undefined) {
				obj[area] = {
					runs: 0,
					averageUniques: 0
				};
			}

			obj[area].averageUniques = ((obj[area].averageUniques * obj[area].runs + this.uniques) / (obj[area].runs + 1)).toFixed(4);
			obj[area].runs += 1;

			Misc.fileAction("statistics.json", 1, JSON.stringify(obj));
		}

		this.uniques = 0;
		this.ignoredGids = [];
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

			result = Pather.getNearestWalkable(room[0], room[1], 18, 3);

			if (result) {
				Pather.moveTo(result[0], result[1], 3, spectype);
				//this.countUniques();

				if (!this.clear(40, spectype)) {
					break;
				}
			}
		}

		//this.storeStatistics(Pather.getAreaName(me.area));

		return true;
	},

	// Sort monsters based on distance, spectype and classId (summoners are attacked first)
	sortMonsters: function (unitA, unitB) {
		// No special sorting for were-form
		if (Config.Wereform) {
			return getDistance(me, unitA) - getDistance(me, unitB);
		}

		// Barb optimization
		if (me.classid === ClassID.Barbarian) {
			if (!Attack.checkResist(unitA, Attack.getSkillElement(Config.AttackSkill[(unitA.spectype & 0x7) ? 1 : 3]))) {
				return 1;
			}

			if (!Attack.checkResist(unitB, Attack.getSkillElement(Config.AttackSkill[(unitB.spectype & 0x7) ? 1 : 3]))) {
				return -1;
			}
		}

        var ids = [UnitClassID.fallenshaman1, UnitClassID.fallenshaman2, UnitClassID.fallenshaman3, UnitClassID.fallenshaman4, UnitClassID.fallenshaman5,
            UnitClassID.unraveler1, UnitClassID.unraveler2, UnitClassID.unraveler3, UnitClassID.unraveler4, UnitClassID.unraveler5,
            UnitClassID.fetishshaman1, UnitClassID.fetishshaman2, UnitClassID.fetishshaman3, UnitClassID.fetishshaman4, UnitClassID.fetishshaman5,
            UnitClassID.vilemother1, UnitClassID.vilemother2, UnitClassID.vilemother3,
            UnitClassID.fallenshaman6, UnitClassID.fallenshaman7, UnitClassID.fallenshaman8,
            UnitClassID.fetishshaman6, UnitClassID.fetishshaman7, UnitClassID.fetishshaman8,
            UnitClassID.unraveler6, UnitClassID.unraveler7, UnitClassID.unraveler8, UnitClassID.unraveler9,
            UnitClassID.vilemother4, UnitClassID.vilemother5];
        

        if (me.area !== Areas.Act2.Claw_Viper_Temple_Level_2 && ids.indexOf(unitA.classid) > -1 && ids.indexOf(unitB.classid) > -1) {
			// Kill "scary" uniques first (like Bishibosh)
            if ((unitA.spectype & SpecType.Boss) && (unitB.spectype & SpecType.Boss)) {
				return getDistance(me, unitA) - getDistance(me, unitB);
			}

            if (unitA.spectype & SpecType.Boss) {
				return -1;
			}

            if (unitB.spectype & SpecType.Boss) {
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
		if (result === undefined || (result & 0x1) || (result & 0x400)) {
			return false;
		}

		return true;
	},

	// Open chests when clearing
	openChests: function (range, x, y) {
		if (!Config.OpenChests) {
			return false;
		}

		if (x === undefined || y === undefined) {
			x = me.x;
			y = me.y;
		}

		var i, unit,
			list = [],
			ids = ["chest", "chest3", "weaponrack", "armorstand"];

        unit = getUnit(UnitType.Object);

		if (unit) {
			do {
				if (unit.name && getDistance(unit, x, y) <= range && ids.indexOf(unit.name.toLowerCase()) > -1) {
					list.push(copyUnit(unit));
				}
			} while (unit.getNext());
		}

		while (list.length) {
			list.sort(Sort.units);

			if (Misc.openChest(list.shift())) {
				Pickit.pickItems();
			}
		}

		return true;
	},

	buildMonsterList: function () {
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

		monList = this.buildMonsterList();

		monList.sort(Sort.units);

		if (this.getMonsterCount(me.x, me.y, 15, monList) === 0) {
			return true;
		}

		CollMap.getNearbyRooms(unit.x, unit.y);

		grid = this.buildGrid(unit.x - distance, unit.x + distance, unit.y - distance, unit.y + distance, spread);

		//print("Grid build time: " + (getTickCount() - tick));

		if (!grid.length) {
			return false;
		}

		function sortGrid(a, b) {
			//return getDistance(a.x, a.y, idealPos.x, idealPos.y) - getDistance(b.x, b.y, idealPos.x, idealPos.y);
			return getDistance(b.x, b.y, unit.x, unit.y) - getDistance(a.x, a.y, unit.x, unit.y);
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

			return Pather.moveTo(grid[index].x, grid[index].y, 0);
		}

		return false;
	},

	getMonsterCount: function (x, y, range, list) {
		var i,
			fire,
			count = 0,
            ignored = [UnitClassID.diablo];

		for (i = 0; i < list.length; i += 1) {
			if (ignored.indexOf(list[i].classid) === -1 && this.checkMonster(list[i]) && getDistance(x, y, list[i].x, list[i].y) <= range) {
				count += 1;
			}
		}

        fire = getUnit(UnitType.Object, "fire");

		if (fire) {
			do {
				if (getDistance(x, y, fire.x, fire.y) <= 4) {
					count += 100;
				}
			} while (fire.getNext());
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

		if (unit.area !== me.area) {
			return false;
		}

        if (unit.type === UnitType.Player && unit.mode !== PlayerModes.Dead) { // Player
			return true;
		}

        if (unit.hp === 0 || unit.mode === NPCModes.death || unit.mode === NPCModes.dead) { // Dead monster
			return false;
		}

		if (unit.getStat(Stats.alignment) === 2) {	// Friendly monster/NPC
			return false;
		}

		if (getBaseStat("monstats", unit.classid, "neverCount")) { // neverCount base stat - hydras, traps etc.
			return false;
		}

		switch (unit.classid) {
            case UnitClassID.cow: // An evil force - cow (lol)
			    return false;
            case UnitClassID.baalthrone: // Baal in Throne
			    if (me.area === Areas.Act5.Throne_Of_Destruction) {
			    	return false;
			    }
                break;

            case UnitClassID.vulture1: // Vultures
            case UnitClassID.vulture2:
            case UnitClassID.vulture3:
            case UnitClassID.vulture4:
            case UnitClassID.mosquito1:
            case UnitClassID.vulture5:
			    if (unit.mode === NPCModes.skill1) { // Flying
			    	return false;
			    }
                break;

            case UnitClassID.sandmaggot1: // Sand Maggots
            case UnitClassID.sandmaggot2:
            case UnitClassID.sandmaggot3:
            case UnitClassID.sandmaggot4:
            case UnitClassID.sandmaggot5:
            case UnitClassID.sandmaggot6:
            case UnitClassID.tentacle1: // Water Watchers
            case UnitClassID.tentacle2:
            case UnitClassID.tentacle3:
            case UnitClassID.tentaclehead1:
            case UnitClassID.tentaclehead2:
            case UnitClassID.tentaclehead3:
			    if (unit.mode === NPCModes.sequence) { // Submerged/Burrowed
			    	return false;
			    }
			    break;
		}

		return true;
	},

	skipCheck: function (unit) {
		if (me.area === Areas.Act5.Throne_Of_Destruction) {
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
				//print("Skip Enchanted: " + unit.name);

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
                    if (unit.getState(States.FANATICISM)) {
					rval = false;
				}

				break;
			case "might":
                    if (unit.getState(States.MIGHT)) {
					rval = false;
				}

				break;
			case "holy fire":
                    if (unit.getState(States.HOLYFIRE)) {
					rval = false;
				}

				break;
			case "blessed aim":
                    if (unit.getState(States.BLESSEDAIM)) {
					rval = false;
				}

				break;
			case "conviction":
                    if (unit.getState(States.CONVICTION)) {
					rval = false;
				}

				break;
			case "holy freeze":
                    if (unit.getState(States.HOLYWIND)) {
					rval = false;
				}

				break;
			case "holy shock":
                    if (unit.getState(States.HOLYSHOCK)) {
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
		case Skills.Necromancer.Corpse_Explosion: // Corpse Explosion
		case Skills.Barbarian.Concentrate: // Concentrate
		case Skills.Barbarian.Frenzy: // Frenzy
		case Skills.Assassin.Mind_Blast: // Minge Blast
		case 500: // Summoner
			return "physical";
		case Skills.Paladin.Holy_Bolt: // Holy Bolt
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
        if (unit.type === UnitType.Player) { // player
			return 0;
		}

		switch (type) {
		case "physical":
                return unit.getStat(Stats.damageresist);
		case "fire":
                return unit.getStat(Stats.fireresist);
		case "lightning":
                return unit.getStat(Stats.lightresist);
		case "magic":
                return unit.getStat(Stats.magicresist);
		case "cold":
                return unit.getStat(Stats.coldresist);
		case "poison":
                return unit.getStat(Stats.poisonresist);
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
	checkResist: function (unit, val, maxres) {
		// Ignore player resistances
        if (unit.type === UnitType.Player) {
			return true;
		}

		var damageType = typeof val === "number" ? this.getSkillElement(val) : val;

		if (maxres === undefined) {
			maxres = 100;
		}

		// Static handler
		if (val === 42 && this.getResist(unit, damageType) < 100) {
			return (unit.hp * 100 / 128) > Config.CastStatic;
		}

		if (this.infinity && ["fire", "lightning", "cold"].indexOf(damageType) > -1) {
            if (!unit.getState(States.CONVICTION)) {
				return this.getResist(unit, damageType) < 117;
			}

			return this.getResist(unit, damageType) < maxres;
		}

		return this.getResist(unit, damageType) < maxres;
	},

	// Check if we have valid skills to attack a monster
	canAttack: function (unit) {
        if (unit.type === UnitType.NPC) {
			if (unit.spectype & 0x7) { // Unique/Champion
				if (Attack.checkResist(unit, this.getSkillElement(Config.AttackSkill[1])) || Attack.checkResist(unit, this.getSkillElement(Config.AttackSkill[2]))) {
					return true;
				}
			} else {
				if (Attack.checkResist(unit, this.getSkillElement(Config.AttackSkill[3])) || Attack.checkResist(unit, this.getSkillElement(Config.AttackSkill[4]))) {
					return true;
				}
			}

			if (Config.AttackSkill.length === 7) {
				return Attack.checkResist(unit, this.getSkillElement(Config.AttackSkill[5])) || Attack.checkResist(unit, this.getSkillElement(Config.AttackSkill[6]));
			}
		}

		return false;
	},

	// Detect use of bows/crossbows
	usingBow: function () {
		var item;

		item = me.getItem(-1, ItemLocation.Equipped);

		if (item) {
			do {
                if (item.bodylocation === ItemBodyLocation.RIGHT_ARM || item.bodylocation === ItemBodyLocation.LEFT_ARM) {
                    switch (item.itemType) {
                        case NTItemTypes.bow: // Bows
                        case NTItemTypes.amazonbow: // Amazon Bows
						    return "bow";
                        case NTItemTypes.crossbow: // Crossbows
						    return "crossbow";
					}
				}
			} while (item.getNext());
		}

		return false;
	},

	// Find an optimal attack position and move or walk to it
	getIntoPosition: function (unit, distance, coll, walk) {
		if (!unit || !unit.x || !unit.y) {
			return false;
		}

		if (walk === true) {
			walk = 1;
		}

		if (distance < 4 && (!unit.hasOwnProperty("mode") || (unit.mode !== NPCModes.death && unit.mode !== NPCModes.dead))) {
			//me.overhead("Short range");

			if (walk) {
				if (getDistance(me, unit) > 8 || checkCollision(me, unit, coll)) {
					Pather.walkTo(unit.x, unit.y, 3);
				}
			} else {
				Pather.moveTo(unit.x, unit.y, 0);
			}

			return !CollMap.checkColl(me, unit, coll);
		}

		var n, i, cx, cy, t,
			coords = [],
			fullDistance = distance,
			name = unit.hasOwnProperty("name") ? unit.name : "",
			angle = Math.round(Math.atan2(me.y - unit.y, me.x - unit.x) * 180 / Math.PI),
			angles = [0, 15, -15, 30, -30, 45, -45, 60, -60, 75, -75, 90, -90, 135, -135, 180];

		t = getTickCount();

		for (n = 0; n < 3; n += 1) {
			if (n > 0) {
				distance -= Math.floor(fullDistance / 3 - 1);
			}

			for (i = 0; i < angles.length; i += 1) {
				cx = Math.round((Math.cos((angle + angles[i]) * Math.PI / 180)) * distance + unit.x);
				cy = Math.round((Math.sin((angle + angles[i]) * Math.PI / 180)) * distance + unit.y);

				if (Pather.checkSpot(cx, cy, 0x1, false)) {
					coords.push({x: cx, y: cy});
				}
			}

			//print("ÿc9potential spots: ÿc2" + coords.length);

			if (coords.length > 0) {
				coords.sort(Sort.units);

				for (i = 0; i < coords.length; i += 1) {
					// Valid position found
					if (!CollMap.checkColl({x: coords[i].x, y: coords[i].y}, unit, coll, 1)) {
						//print("ÿc9optimal pos build time: ÿc2" + (getTickCount() - t) + " ÿc9distance from target: ÿc2" + getDistance(cx, cy, unit.x, unit.y));

						switch (walk) {
						case 1:
							Pather.walkTo(coords[i].x, coords[i].y, 2);

							break;
						case 2:
							if (getDistance(me, coords[i]) < 6 && !CollMap.checkColl(me, coords[i], 0x5)) {
								Pather.walkTo(coords[i].x, coords[i].y, 2);
							} else {
								Pather.moveTo(coords[i].x, coords[i].y, 1);
							}

							break;
						default:
							Pather.moveTo(coords[i].x, coords[i].y, 1);

							break;
						}

						return true;
					}
				}
			}
		}

		if (name) {
			print("ÿc4Attackÿc0: No valid positions for: " + name);
		}

		return false;
	}
};