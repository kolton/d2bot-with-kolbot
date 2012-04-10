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
		return [15, 25, 27, 51, 56, 62, 59, 64, 121, 225, 229, 234, 244, 249, 250, 223, 228, 247, 275, 277, 268, 279].indexOf(skillId) > -1;
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
			name = unit.fname.split("\n").reverse().join(" ").replace(/ÿc./, ""),
			desc = "";

		desc += (Pickit.itemColor(unit) + unit.fname.split("\n").reverse().join("\n").replace(/ÿc./, "") + "ÿc0");
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