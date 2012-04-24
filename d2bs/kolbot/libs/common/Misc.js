/**
*	@filename	Misc.js
*	@author		kolton
*	@desc		misc library containing Skill, Misc and Sort classes
*/

var Skill = {
	// Cast a skill on self, Unit or coords
	cast: function (skillId, hand, x, y) {
		if (me.inTown && !this.townSkill(skillId)) {
			return false;
		}

		if (!me.getSkill(skillId, 1)) {
			return false;
		}

		if (!arguments.length) {
			throw new Error("Skill.cast: Must supply a skill ID");
		}

		var i, n, clickType, shift;

		if (arguments.length === 1) {
			hand = 0;
		}

		if (arguments.length < 3) {
			x = me.x;
			y = me.y;
		}

		switch (hand) {
		case 0:
			clickType = 3;
			shift = 0;
			break;
		case 1:
			clickType = 0;
			shift = 1;
			break;
		case 2: // For melee skills that don't need shift
			clickType = 0;
			shift = 0;
			break;
		}

		if (!this.setSkill(skillId, hand)) {
			return false;
		}

MainLoop:
		for (n = 0; n < 3; n += 1) {
			if (arguments.length === 3) {
				clickMap(clickType, shift, x);
			} else {
				clickMap(clickType, shift, x, y);
			}

			delay(30);

			if (arguments.length === 3) {
				clickMap(clickType + 2, shift, x);
			} else {
				clickMap(clickType + 2, shift, x, y);
			}

			for (i = 0; i < 4; i += 1) {
				if (me.attacking) {
					break MainLoop;
				}

				delay(40);
			}
		}

		while (me.attacking) {
			delay(10);
		}

		if (this.isTimed(skillId)) { // account for lag, state 121 doesn't kick in immediately
			for (i = 0; i < 10; i += 1) {
				if (me.getState(121)) {
					break;
				}

				delay(10);
			}
		}

		return true;
	},

	// Put a skill on desired slot
	setSkill: function (skillId, hand) {
		if (!me.getSkill(skillId, 1)) {
			return false;
		}

		if (arguments.length < 2) {
			hand = 0;
		}

		// Check if the skill is already set
		if (me.getSkill(hand === 0 ? 2 : 3) === skillId) {
			return true;
		}

		if (me.setSkill(skillId, hand)) {
			return true;
		}

		return false;
	},

	// Timed skills
	isTimed: function (skillId) {
		return [15, 25, 27, 51, 56, 59, 62, 64, 121, 225, 223, 228, 229, 234, 244, 247, 249, 250, 256, 268, 275, 277, 279].indexOf(skillId) > -1;
	},

	// Skills that cn be cast in town
	townSkill: function (skillId) {
		return [32, 40, 43, 50, 52, 58, 60, 68, 75, 85, 94, 117, 221, 222, 226, 227, 235, 236, 237, 246, 247, 258, 267, 268, 277, 278, 279].indexOf(skillId) > -1;
	}
};

var Misc = {
	// Click something
	click: function (button, shift, x, y) {
		if (arguments.length < 2) {
			throw new Error("Misc.click: Needs at least 2 arguments.");
		}

		switch (arguments.length) {
		case 2:
			clickMap(button, shift, me.x, me.y);
			delay(20);
			clickMap(button + 2, shift, me.x, me.y);
			break;
		case 3:
			if (typeof (x) !== "object") {
				throw new Error("Misc.click: Third arg must be a Unit.");
			}

			clickMap(button, shift, x);
			delay(20);
			clickMap(button + 2, shift, x);
			break;
		case 4:
			clickMap(button, shift, x, y);
			delay(20);
			clickMap(button + 2, shift, x, y);
			break;
		}

		return true;
	},

	// Check if a player is in your party
	inMyParty: function (name) {
		var player, myPartyId;

		try {
			player = getParty();

			if (!player) {
				return false;
			}

			myPartyId = player.partyid;
			player = getParty(name); // May throw an error

			if (player && player.partyid !== 65535 && player.partyid === myPartyId) {
				return true;
			}
		} catch (e) {
			player = getParty();

			if (player) {
				myPartyId = player.partyid;

				while (player.getNext()) {
					if (player.partyid !== 65535 && player.partyid === myPartyId) {
						return true;
					}
				}
			}
		}

		return false;
	},

	// OPen a chest Unit
	openChest: function (unit) {
		if (!unit || unit.mode || unit.x === 12526 || unit.x === 12565) { // Skip invalid, opened and Countess chests
			return false;
		}

		if (me.classid !== 6 && unit.islocked && !me.findItem("key", 0, 3)) { // locked chest, no keys
			return false;
		}

		var i, tick;

		for (i = 0; i < 3; i += 1) {
			if (getDistance(me, unit) < 4 || Pather.moveToUnit(unit, 2, 0)) {
				unit.interact();
			}

			tick = getTickCount();

			while (getTickCount() - tick < 1000) {
				if (unit.mode) {
					return true;
				}

				delay(10);
			}
		}

		return false;
	},

	// Open all chests that have preset units in an area
	openChestsInArea: function (area) {
		if (!area) {
			area = me.area;
		}

		var chest,
			presetUnits = getPresetUnits(area),
			chestIds = [5, 6, 87, 92, 104, 105, 106, 107, 143, 140, 141, 144, 146, 147, 148, 176, 177, 181, 183, 198, 240, 241, 242, 243, 329, 330, 331, 332, 333, 334, 335,
						336, 354, 355, 356, 371, 387, 389, 390, 391, 397, 405, 406, 407, 413, 420, 424, 425, 430, 431, 432, 433, 454, 455, 501, 502, 504, 505, 580, 581];

		if (!presetUnits) {
			return false;
		}

		while (presetUnits.length > 0) {
			presetUnits.sort(Sort.presetUnits);

			if (chestIds.indexOf(presetUnits[0].id) > -1) {
				Pather.moveToUnit(presetUnits[0], 2, 0);

				chest = getUnit(2);

				if (chest) {
					do {
						if (chestIds.indexOf(chest.classid) > -1 && getDistance(me, chest) < 5 && this.openChest(chest)) {
							Pickit.pickItems();
						}
					} while (chest.getNext());
				}
			}

			presetUnits.shift();
		}

		return true;
	},

	// Use a shrine Unit
	getShrine: function (unit) {
		var i, tick;

		for (i = 0; i < 3; i += 1) {
			if (getDistance(me, unit) < 4 || Pather.moveToUnit(unit, 2, 0)) {
				unit.interact();
			}

			tick = getTickCount();

			while (getTickCount() - tick < 1000) {
				if (unit.mode) {
					return true;
				}

				delay(10);
			}
		}

		return false;
	},

	// Check all shrines in area and get the first one of specified type
	getShrinesInArea: function (area, type) {
		var i, coords, shrine,
			shrineLocs = [],
			shrineIds = [2, 81, 83],
			unit = getPresetUnits(area);

		if (unit) {
			for (i = 0; i < unit.length; i += 1) {
				if (shrineIds.indexOf(unit[i].id) > -1) {
					shrineLocs.push([unit[i].roomx * 5 + unit[i].x, unit[i].roomy * 5 + unit[i].y]);
				}
			}
		}

		while (shrineLocs.length > 0) {
			shrineLocs.sort(Sort.points);

			coords = shrineLocs.shift();

			Pather.moveTo(coords[0], coords[1], 2, false, true);

			shrine = getUnit(2, "shrine");

			if (shrine) {
				do {
					if (shrine.objtype === type) {
						this.getShrine(shrine);

						return true;
					}
				} while (shrine.getNext());
			}
		}

		return false;
	},

	// Log kept item stats in the manager. It's buggy.
	logItem: function (action, unit) { // hackit to the max
		var val,
			name = unit.fname.split("\n").reverse().join(" ").replace(/ÿc[0-9!"+<;.*]/, ""),
			desc = "";

		desc += (Pickit.itemColor(unit) + unit.fname.split("\n").reverse().join("\n").replace(/ÿc[0-9!"+<;.*]/, "") + "ÿc0");
		val = unit.getStat(31);

		if (val) {
			desc += ("\nDefense: " + val);
		}

		if (unit.getStat(21)) {
			desc += ("\nOne-Hand Damage: " + unit.getStat(21) + " to " + unit.getStat(22));
		}

		if (unit.getStat(23)) {
			desc += ("\nTwo-Hand Damage: " + unit.getStat(23) + " to " + unit.getStat(24));
		}

		val = getBaseStat("items", unit.classid, 52);

		if (val) {
			desc += ("\nRequired Strength: " + val);
		}

		val = getBaseStat("items", unit.classid, 53);

		if (val) {
			desc += ("\nRequired Dexterity: " + val);
		}

		val = unit.getStat(92);

		if (val) {
			desc += ("\nRequired Level: " + val);
		}

		desc += ("ÿc3" + unit.description.split("\n").reverse().join("\n") + "ÿc0");
		val = unit.getStat(194);

		if (val) {
			desc += ("\nSockets: " + val);
		}

		if (!unit.getFlag(0x10)) {
			desc += "\nÿc1Unidentifiedÿc0";
		}

		if (unit.getFlag(0x400000)) {
			desc += "\nÿc3Etherealÿc0";
		}

		desc += ("\nItem Level: " + unit.ilvl);

		val = DataFile.getStats().lastArea;

		if (val) {
			desc += ("\nArea: " + val);
		}

		D2Bot.printToItemLog(action + " " + name + "$" + desc);
	},

	// Change into werewolf or werebear
	shapeShift: function (mode) { // 0 = werewolf, 1 = werebear
		if (arguments.length === 0 || mode < 0 || mode > 2) {
			throw new Error("Misc.shapeShift: Invalid parameter");
		}

		var i, tick,
			state = mode === 0 ? 139 : 140,
			skill = mode === 0 ? 223 : 228;

		for (i = 0; i < 3; i += 1) {
			Skill.cast(skill, 0);

			tick = getTickCount();

			while (getTickCount() - tick < 2000) {
				if (me.getState(state)) {
					return true;
				}

				delay(10);
			}
		}

		return false;
	},

	// Change back to human shape
	unShift: function () {
		var i, tick;

		if (me.getState(139) || me.getState(140)) {
			for (i = 0; i < 3; i += 1) {
				Skill.cast(me.getState(139) ? 223 : 228);

				tick = getTickCount();

				while (getTickCount() - tick < 2000) {
					if (!me.getState(139) && !me.getState(140)) {
						return true;
					}

					delay(10);
				}
			}
		} else {
			return true;
		}

		return false;
	},

	// Teleport with slot II
	teleSwitch: function () {
		this.oldSwitch = me.weaponswitch;

		Precast.weaponSwitch();

		return true;
	},

	// Go to town when low on hp/mp or when out of potions. can be upgraded to check for curses etc.
	townCheck: function (tpchicken) {
		var potion, check,
			needhp = true,
			needmp = true;

		if (tpchicken && ((Config.TownHP > 0 && me.hp < Math.floor(me.hpmax * Config.TownHP / 100)) || (Config.TownMP > 0 && me.hp < Math.floor(me.hpmax * Config.TownMP / 100)))) {
			check = true;
		}

		if (Config.TownCheck && !me.inTown) {
			if (Config.BeltColumn.indexOf("hp") > -1) {
				potion = me.getItem(-1, 2); // belt item

				if (potion) {
					do {
						if (potion.code.indexOf("hp") > -1) {
							needhp = false;

							break;
						}
					} while (potion.getNext());
				}

				if (needhp) {
					print("We need healing potions");

					check = true;
				}
			}

			if (Config.BeltColumn.indexOf("mp") > -1) {
				potion = me.getItem(-1, 2); // belt item

				if (potion) {
					do {
						if (potion.code.indexOf("mp") > -1) {
							needmp = false;

							break;
						}
					} while (potion.getNext());
				}

				if (needmp) {
					print("We need mana potions");

					check = true;
				}
			}
		}

		if (check) {
			Town.goToTown();
			Town.heal();
			Town.buyPotions();
			Town.reviveMerc();
			me.cancel();
			Town.move("portalspot");
			Pather.usePortal(null, me.name);

			return true;
		}

		return false;
	}
};

var Sort = {
	// Sort units by comparing distance between the player
	units: function (a, b) {
		return getDistance(me, a) - getDistance(me, b);
	},

	// Sort preset units by comparing distance between the player (using preset x/y calculations)
	presetUnits: function (a, b) {
		return getDistance(me, a.roomx * 5 + a.x, a.roomy * 5 + a.y) - getDistance(me, b.roomx * 5 + b.x, b.roomy * 5 + b.y);
	},

	// Sort arrays of x,y coords by comparing distance between the player
	points: function (a, b) {
		return getDistance(me, a[0], a[1]) - getDistance(me, b[0], b[1]);
	}
};

var Experience = {
	totalExp: [0, 0, 500, 1500, 3750, 7875, 14175, 22680, 32886, 44396, 57715, 72144, 90180, 112725, 140906, 176132, 220165, 275207, 344008, 430010, 537513, 671891, 839864, 1049830, 1312287, 1640359, 2050449, 2563061, 3203826, 3902260, 4663553, 5493363, 6397855, 7383752, 8458379, 9629723, 10906488, 12298162, 13815086, 15468534, 17270791, 19235252, 21376515, 23710491, 26254525, 29027522, 32050088, 35344686, 38935798, 42850109, 47116709, 51767302, 56836449, 62361819, 68384473, 74949165, 82104680, 89904191, 98405658, 107672256, 117772849, 128782495, 140783010, 153863570, 168121381, 183662396, 200602101, 219066380, 239192444, 261129853, 285041630, 311105466, 339515048, 370481492, 404234916, 441026148, 481128591, 524840254, 572485967, 624419793, 681027665, 742730244, 809986056, 883294891, 963201521, 1050299747, 1145236814, 1248718217, 1361512946, 1484459201, 1618470619, 1764543065, 1923762030, 2097310703, 2286478756, 2492671933, 2717422497, 2962400612, 3229426756, 3520485254, 0, 0],
	nextExp: [0, 500, 1000, 2250, 4125, 6300, 8505, 10206, 11510, 13319, 14429, 18036, 22545, 28181, 35226, 44033, 55042, 68801, 86002, 107503, 134378, 167973, 209966, 262457, 328072, 410090, 512612, 640765, 698434, 761293, 829810, 904492, 985897, 1074627, 1171344, 1276765, 1391674, 1516924, 1653448, 1802257, 1964461, 2141263, 2333976, 2544034, 2772997, 3022566, 3294598, 3591112, 3914311, 4266600, 4650593, 5069147, 5525370, 6022654, 6564692, 7155515, 7799511, 8501467, 9266598, 10100593, 11009646, 12000515, 13080560, 14257811, 15541015, 16939705, 18464279, 20126064, 21937409, 23911777, 26063836, 28409582, 30966444, 33753424, 36791232, 40102443, 43711663, 47645713, 51933826, 56607872, 61702579, 67255812, 73308835, 79906630, 87098226, 94937067, 103481403, 112794729, 122946255, 134011418, 146072446, 159218965, 173548673, 189168053, 206193177, 224750564, 244978115, 267026144, 291058498, 0, 0],

	// Percent progress into the current level. Format: xx.xx%
	progress: function () {
		return me.getStat(12) === 99 ? 0 : (((me.getStat(13) - this.totalExp[me.getStat(12)]) / this.nextExp[me.getStat(12)]) * 100).toFixed(2);
	},

	// Total experience gained in current run
	gain: function () {
		return (me.getStat(13) - DataFile.getStats().experience);
	},

	// Percent experience gained in current run
	gainPercent: function () {
		return me.getStat(12) === 99 ? 0 : (this.gain() * 100 / this.nextExp[me.getStat(12)]).toFixed(6);
	},

	// Runs until next level
	runsToLevel: function () {
		return Math.round(((100 - this.progress()) / 100) * this.nextExp[me.getStat(12)] / this.gain());
	},

	// Total runs needed for next level (not counting current progress)
	totalRunsToLevel: function () {
		return Math.round(this.nextExp[me.getStat(12)] / this.gain());
	},

	// Log to manager
	log: function () {
		var string,
			gain = this.gain(),
			progress = this.progress(),
			runsToLevel = this.runsToLevel(),
			totalRunsToLevel = this.totalRunsToLevel();

		string = "XP Gain: " + gain + ", Progress: " + me.getStat(12) + " (" + progress + "%), Est. runs until level-up: " + runsToLevel + "/" + totalRunsToLevel;

		if (gain) {
			D2Bot.printToConsole(string + ";2");

			if (me.getStat(12) > DataFile.getStats().level) {
				D2Bot.printToConsole("Congrats! You gained a level. Current level:" + me.getStat(12) + ";3");
			}
		}
	}
};