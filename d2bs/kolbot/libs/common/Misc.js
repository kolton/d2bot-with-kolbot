/**
*	@filename	Misc.js
*	@author		kolton
*	@desc		misc library containing Skill, Misc and Sort classes
*/

var Skill = {
	usePvpRange: false,

	getRange: function (skillId) {
		switch (skillId) {
		case 0: // Normal Attack
			return Attack.usingBow() ? 20 : 3;
		case 10: // Jab
		case 14: // Power Strike
		case 19: // Impale
		case 30: // Fend
		case 34: // Lightning Strike
		case 73: // Poison Dagger
		case 96: // Sacrifice
		case 97: // Smite
		case 106: // Zeal
		case 112: // Blessed Hammer
		case 116: // Conversion
		case 126: // Bash
		case 133: // Double Swing
		case 139: // Stun
		case 144: // Concentrate
		case 147: // Frenzy
		case 152: // Berserk
		case 232: // Feral Rage
		case 233: // Maul
		case 238: // Rabies
		case 239: // Fire Claws
		case 242: // Hunger
		case 248: // Fury
		case 255: // Dragon Talon
		case 260: // Dragon Claw
		case 270: // Dragon Tail
			return 3;
		case 146: // Battle Cry
		case 154: // War Cry
			return 4;
		case 44: // Frost Nova
		case 240: // Twister
		case 245: // Tornado
		case 500: // Summoner
			return 5;
		case 38: // Charged Bolt
			return 6;
		case 48: // Nova
		case 151: // Whirlwind
			return 7;
		case 92: // Poison Nova
			return 8;
		case 101: // Holy Bolt
		case 107: // Charge
		case 130: // Howl
		case 132: // Leap
		case 225: // Firestorm
		case 229: // Molten Boulder
		case 230: // Arctic Blast
		case 243: // Shock Wave
			return 10;
		case 64: // Frozen Orb
		case 67: // Teeth
		case 234: // Fissure
		case 244: // Volcano
		case 251: // Fire Blast
		case 256: // Shock Web
		case 257: // Blade Sentinel
		case 266: // Blade Fury
			return 15;
		case 121: // Fist of the Heavens
		case 253: // Psychic Hammer
		case 275: // Dragon Flight
			return 20;
		// Variable range
		case 42: // Static Field
			if (me.gametype === 1) {
				return Math.floor((me.getSkill(42, 1) + 4) * 2 / 3);
			}

			return 20;
		case 49: // Lightning
		case 84: // Bone Spear
		case 93: // Bone Spirit
			if (this.usePvpRange) {
				return 40;
			}

			return 15;
		case 24: // Charged Strike
		case 47:
		case 51:
		case 53:
		case 56:
		case 59:
		case 273: // Mind Blast
			if (this.usePvpRange) {
				return 40;
			}

			return 20;
		}

		// Every other skill
		if (this.usePvpRange) {
			return 40;
		}

		return 20;
	},

	getHand: function (skillId) {
		switch (skillId) {
		case 6:
		case 7:
		case 9:
		case 10:
		case 11:
		case 12:
		case 13:
		case 14:
		case 15:
		case 16:
		case 18:
		case 19:
		case 20:
		case 21:
		case 22:
		case 23:
		case 24:
		case 25:
		case 26:
		case 27:
		case 29:
		case 30:
		case 31:
		case 33:
		case 34:
		case 35:
		case 36:
		case 37:
		case 38:
		case 39:
		case 41:
		case 45:
		case 47:
		case 49:
		case 53:
		case 55:
		case 61:
		case 63:
		case 64:
		case 65:
		case 67:
		case 73:
		case 79:
		case 84:
		case 89:
		case 93:
		case 101:
		case 107:
		case 111:
		case 112:
		case 121:
		case 132:
		case 140:
		case 143:
		case 151:
		case 225:
		case 229:
		case 230:
		case 240:
		case 243:
		case 245:
		case 251:
		case 254:
		case 256:
		case 257:
		case 259:
		case 263:
		case 265:
		case 266:
		case 269:
		case 274:
		case 275:
			return 1;
		case 0: // Normal Attack
		case 96: // Sacrifice
		case 97: // Smite
		case 106: // Zeal
		case 116: // Conversion
		case 126: // Bash
		case 133: // Double Swing
		case 139: // Stun
		case 144: // Concentrate
		case 147: // Frenzy
		case 152: // Berserk
		case 232: // Feral Rage
		case 233: // Maul
		case 238: // Rabies
		case 239: // Fire Claws
		case 242: // Hunger
		case 248: // Fury
		case 255: // Dragon Talon
		case 260: // Dragon Claw
		case 270: // Dragon Tail
			return 2; // Shift bypass
		}

		// Every other skill
		return 0;
	},

	charges: [],

	// Cast a skill on self, Unit or coords
	cast: function (skillId, hand, x, y) {
		if (me.inTown && !this.townSkill(skillId)) {
			return false;
		}

		if (!me.getSkill(skillId, 1)) {
			return false;
		}

		if (!this.wereFormCheck(skillId)) {
			return false;
		}

		// No mana to cast
		if (this.getManaCost(skillId) > me.mp) {
			// Maybe delay on ALL skills that we don't have enough mana for?
			if (Config.AttackSkill.concat([42, 54]).concat(Config.LowManaSkill).indexOf(skillId) > -1) {
				delay(300);
			}

			return false;
		}

		if (skillId === undefined) {
			throw new Error("Skill.cast: Must supply a skill ID");
		}

		var i, n, clickType, shift;

		if (hand === undefined) {
			hand = 0;
		}

		if (x === undefined) {
			x = me.x;
		}

		if (y === undefined) {
			y = me.y;
		}

		if (!this.setSkill(skillId, hand)) {
			return false;
		}

		if (Config.PacketCasting > 1) {
			switch (typeof x) {
			case "number":
				Packet.castSkill(hand, x, y);
				delay(250);

				break;
			case "object":
				Packet.unitCast(hand, x);
				delay(250);

				break;
			}
		} else {
			switch (hand) {
			case 0: // Right hand + No Shift
				clickType = 3;
				shift = 0;

				break;
			case 1: // Left hand + Shift
				clickType = 0;
				shift = 1;

				break;
			case 2: // Left hand + No Shift
				clickType = 0;
				shift = 0;

				break;
			case 3: // Right hand + Shift
				clickType = 3;
				shift = 1;

				break;
			}

MainLoop:
			for (n = 0; n < 3; n += 1) {
				if (typeof x === "object") {
					clickMap(clickType, shift, x);
				} else {
					clickMap(clickType, shift, x, y);
				}

				delay(20);

				if (typeof x === "object") {
					clickMap(clickType + 2, shift, x);
				} else {
					clickMap(clickType + 2, shift, x, y);
				}

				for (i = 0; i < 8; i += 1) {
					if (me.attacking) {
						break MainLoop;
					}

					delay(20);
				}
			}

			while (me.attacking) {
				delay(10);
			}
		}

		if (this.isTimed(skillId)) { // account for lag, state 121 doesn't kick in immediately
			for (i = 0; i < 10; i += 1) {
				if ([4, 9].indexOf(me.mode) > -1) {
					break;
				}

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
		// Check if the skill is already set
		if (me.getSkill(hand === 0 ? 2 : 3) === skillId) {
			return true;
		}

		if (!me.getSkill(skillId, 1)) {
			return false;
		}

		if (hand === undefined || hand === 3) {
			hand = 0;
		}

		var charge = this.getCharge(skillId);

		if (!!charge) {
			// charge.charges is a cached value from Attack.getCharges
			/*if (charge.charges > 0 && me.setSkill(skillId, hand, charge.unit)) {
				return true;
			}*/

			return false;
		}

		if (me.setSkill(skillId, hand)) {
			return true;
		}

		return false;
	},

	// Charged skill
	getCharge: function (skillId) {
		var i;

		for (i = 0; i < this.charges.length; i += 1) {
			if (this.charges[i].skill === skillId && me.getSkill(skillId, 0) === this.charges[i].level && me.getSkill(skillId, 0) === me.getSkill(skillId, 1)) {
				return this.charges[i];
			}
		}

		return false;
	},

	// Timed skills
	isTimed: function (skillId) {
		return [15, 25, 27, 51, 56, 59, 62, 64, 121, 225, 223, 228, 229, 234, 244, 247, 249, 250, 256, 268, 275, 277, 279].indexOf(skillId) > -1;
	},

	// Wereform skill check
	wereFormCheck: function (skillId) {
		if (!me.getState(139) && !me.getState(140)) {
			return true;
		}

		// Can be cast by both
		if ([0, 1, 221, 222, 226, 227, 231, 236, 237, 239, 241, 242, 246, 247, 249].indexOf(skillId) > -1) {
			return true;
		}

		// Can be cast by werewolf only
		if (me.getState(139) && [223, 232, 238, 248].indexOf(skillId) > -1) {
			return true;
		}

		// Can be cast by werebear only
		if (me.getState(140) && [228, 233, 243].indexOf(skillId) > -1) {
			return true;
		}

		return false;
	},

	// Skills that cn be cast in town
	townSkill: function (skillId) {
		return [32, 40, 43, 50, 52, 58, 60, 68, 75, 85, 94, 117, 221, 222, 226, 227, 235, 236, 237, 246, 247, 258, 267, 268, 277, 278, 279].indexOf(skillId) > -1;
	},

	manaCostList: {},

	// Get mana cost of the skill (mBot)
	getManaCost: function (skillId) {
		if (skillId < 6) {
			return 0;
		}

		if (this.manaCostList.hasOwnProperty(skillId)) {
			return this.manaCostList[skillId];
		}

		var skillLvl = me.getSkill(skillId, 1),
			effectiveShift = [1, 2, 4, 8, 16, 32, 64, 128, 256, 512, 1024],
			lvlmana = getBaseStat(3, skillId, "lvlmana") === 65535 ? -1 : getBaseStat(3, skillId, "lvlmana"), // Correction for skills that need less mana with levels (kolton)
			ret = Math.max((getBaseStat(3, skillId, "mana") + lvlmana * (skillLvl - 1)) * (effectiveShift[getBaseStat(3, skillId, "manashift")] / 256), getBaseStat(3, skillId, "minmana"));

		if (!this.manaCostList.hasOwnProperty(skillId)) {
			this.manaCostList[skillId] = ret;
		}

		return ret;
	}
};

var Item = {
	hasTier: function (item) {
		return Config.AutoEquip && NTIP.GetTier(item) > 0;
	},

	canEquip: function (item) {
		if (item.type !== 4) { // Not an item
			return false;
		}

		if (!item.getFlag(0x10)) { // Unid item
			return false;
		}

		if (item.getStat(92) > me.getStat(12) || item.dexreq > me.getStat(2) || item.strreq > me.getStat(0)) { // Higher requirements
			return false;
		}

		return true;
	},

	// Equips an item and throws away the old equipped item
	equip: function (item, bodyLoc) {
		if (!this.canEquip(item)) {
			return false;
		}

		// Already equipped in the right slot
		if (item.mode === 1 && item.bodylocation === bodyLoc) {
			return true;
		}

		var i, cursorItem;

		if (item.location === 7) {
			if (!Town.openStash()) {
				return false;
			}
		}

		for (i = 0; i < 3; i += 1) {
			if (item.toCursor()) {
				clickItem(0, bodyLoc);
				delay(me.ping * 2 + 500);

				if (item.bodylocation === bodyLoc) {
					if (getCursorType() === 3) {
						//Misc.click(0, 0, me);

						cursorItem = getUnit(100);

						if (cursorItem && Pickit.checkItem(cursorItem).result > 0 && (NTIP.GetTier(cursorItem) < 1 || NTIP.GetTier(cursorItem) > 99)) {
							if (Storage.Inventory.CanFit(cursorItem)) {
								Storage.Inventory.MoveTo(cursorItem);
							}
						}
					}

					return true;
				}
			}
		}

		return false;
	},

	getEquippedItem: function (bodyLoc) {
		var item = me.getItem();

		if (item) {
			do {
				if (item.bodylocation === bodyLoc) {
					return {
						classid: item.classid,
						tier: NTIP.GetTier(item)
					};
				}
			} while (item.getNext());
		}

		// Don't have anything equipped in there
		return {
			classid: -1,
			tier: -1
		};
	},

	getBodyLoc: function (item) {
		var bodyLoc;

		switch (item.itemType) {
		case 2: // Shield
		case 70: // Auric Shields
			bodyLoc = 5;

			break;
		case 3: // Armor
			bodyLoc = 3;

			break;
		case 5: // Arrows
		case 6: // Bolts
			bodyLoc = 5;

			break;
		case 10: // Ring
			bodyLoc = [6, 7];

			break;
		case 12: // Amulet
			bodyLoc = 2;

			break;
		case 15: // Boots
			bodyLoc = 9;

			break;
		case 16: // Gloves
			bodyLoc = 10;

			break;
		case 19: // Belt
			bodyLoc = 8;

			break;
		case 37: // Helm
		case 71: // Barb Helm
		case 75: // Circlet
			bodyLoc = 1;

			break;
		case 24: // 
		case 25: // 
		case 26: // 
		case 27: // 
		case 28: // 
		case 29: // 
		case 30: // 
		case 31: // 
		case 32: // 
		case 33: // 
		case 34: // 
		case 35: // 
		case 36: // 
		case 42: // 
		case 43: // 
		case 44: // 
		case 67: // Handtohand (Assasin Claw)
		case 68: // 
		case 69: // 
		case 72: // 
		case 85: // 
		case 86: // 
		case 87: // 
		case 88: // 
			bodyLoc = 4;

			break;
		default:
			return false;
		}

		if (typeof bodyLoc === "number") {
			bodyLoc = [bodyLoc];
		}

		return bodyLoc;
	},

	autoEquipCheck: function (item) {
		if (!Config.AutoEquip) {
			return true;
		}

		var i,
			tier = NTIP.GetTier(item),
			bodyLoc = this.getBodyLoc(item);

		if (tier > 0 && bodyLoc) {
			for (i = 0; i < bodyLoc.length; i += 1) {
				// Low tier items shouldn't be kept if they can't be equipped
				if (tier > this.getEquippedItem(bodyLoc[i]).tier && (this.canEquip(item) || !item.getFlag(0x10))) {
					return true;
				}
			}
		}

		// Sell/ignore low tier items, keep high tier
		if (tier > 0 && tier < 100) {
			return false;
		}

		return true;
	},

	// returns true if the item should be kept+logged, false if not
	autoEquip: function () {
		if (!Config.AutoEquip) {
			return true;
		}

		var i, j, tier, bodyLoc, tome, gid,
			items = me.findItems(-1, 0);

		if (!items) {
			return false;
		}

		function sortEq(a, b) {
			if (Item.canEquip(a)) {
				return -1;
			}

			if (Item.canEquip(b)) {
				return 1;
			}

			return 0;
		}

		me.cancel();

		// Remove items without tier
		for (i = 0; i < items.length; i += 1) {
			if (NTIP.GetTier(items[i]) === 0) {
				items.splice(i, 1);

				i -= 1;
			}
		}

		while (items.length > 0) {
			items.sort(sortEq);

			tier = NTIP.GetTier(items[0]);
			bodyLoc = this.getBodyLoc(items[0]);

			if (tier > 0 && bodyLoc) {
				for (j = 0; j < bodyLoc.length; j += 1) {
					if ([3, 7].indexOf(items[0].location) > -1 && tier > this.getEquippedItem(bodyLoc[j]).tier && this.getEquippedItem(bodyLoc[j]).classid !== 174) { // khalim's will adjustment
						if (!items[0].getFlag(0x10)) { // unid
							tome = me.findItem(519, 0, 3);

							if (tome && tome.getStat(70) > 0) {
								if (items[0].location === 7) {
									Town.openStash();
								}

								Town.identifyItem(items[0], tome);
							}
						}

						gid = items[0].gid;

						print(items[0].name);

						if (this.equip(items[0], bodyLoc[j])) {
							Misc.logItem("Equipped", me.getItem(-1, -1, gid));
						}

						break;
					}
				}
			}

			items.shift();
		}

		return true;
	}
};

var Misc = {
	// Click something
	click: function (button, shift, x, y) {
		if (arguments.length < 2) {
			throw new Error("Misc.click: Needs at least 2 arguments.");
		}

		while (!me.gameReady) {
			delay(100);
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
		if (me.name === name) {
			return true;
		}

		while (!me.gameReady) {
			delay(100);
		}

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

	// Get number of players within getUnit distance
	getNearbyPlayerCount: function () {
		var count = 0,
			player = getUnit(0);

		if (player) {
			do {
				if (!player.dead) {
					count += 1;
				}
			} while (player.getNext());
		}

		return count;
	},

	// Get total number of players in game
	getPlayerCount: function () {
		var count = 0,
			party = getParty();

		if (party) {
			do {
				count += 1;
			} while (party.getNext());
		}

		return count;
	},

	// Open a chest Unit
	openChest: function (unit) {
		// Skip invalid and Countess chests
		if (!unit || unit.x === 12526 || unit.x === 12565) {
			return false;
		}

		// already open
		if (unit.mode) {
			return true;
		}

		// locked chest, no keys
		if (me.classid !== 6 && unit.islocked && !me.findItem(543, 0, 3)) {
			return false;
		}

		var i, tick;

		for (i = 0; i < 3; i += 1) {
			if (Pather.moveTo(unit.x + 1, unit.y + 2, 3) && getDistance(me, unit.x + 1, unit.y + 2) < 5) {
				//Misc.click(0, 0, unit);
				sendPacket(1, 0x13, 4, unit.type, 4, unit.gid);
			}

			tick = getTickCount();

			while (getTickCount() - tick < 1000) {
				if (unit.mode) {
					return true;
				}

				delay(10);
			}
		}

		if (!me.idle) {
			Misc.click(0, 0, me.x, me.y); // Click to stop walking in case we got stuck
		}

		return false;
	},

	// Open all chests that have preset units in an area
	openChestsInArea: function (area, chestIds) {
		var i, coords, presetUnits;

		if (!area) {
			area = me.area;
		}

		// testing
		if (area !== me.area) {
			Pather.journeyTo(area);
		}

		coords = [];
		presetUnits = getPresetUnits(area, 2);

		if (!chestIds) {
			chestIds = [
				5, 6, 87, 104, 105, 106, 107, 143, 140, 141, 144, 146, 147, 148, 176, 177, 181, 183, 198, 240, 241,
				242, 243, 329, 330, 331, 332, 333, 334, 335, 336, 354, 355, 356, 371, 387, 389, 390, 391, 397, 405,
				406, 407, 413, 420, 424, 425, 430, 431, 432, 433, 454, 455, 501, 502, 504, 505, 580, 581
			];
		}

		if (!presetUnits) {
			return false;
		}

		while (presetUnits.length > 0) {
			if (chestIds.indexOf(presetUnits[0].id) > -1) {
				coords.push({
					x: presetUnits[0].roomx * 5 + presetUnits[0].x,
					y: presetUnits[0].roomy * 5 + presetUnits[0].y
				});
			}

			presetUnits.shift();
		}

		while (coords.length) {
			coords.sort(Sort.units);
			Pather.moveToUnit(coords[0], 1, 2);
			this.openChests(20);

			for (i = 0; i < coords.length; i += 1) {
				if (getDistance(coords[i].x, coords[i].y, coords[0].x, coords[0].y) < 20) {
					coords.shift();
				}
			}
		}

		return true;
	},

	openChests: function (range) {
		var unit,
			unitList = [],
			containers = ["chest", "chest3", "armorstand", "weaponrack"];

		if (!range) {
			range = 15;
		}

		// Testing all container code
		if (Config.OpenChests === 2) {
			containers = [
				"chest", "loose rock", "hidden stash", "loose boulder", "corpseonstick", "casket", "armorstand", "weaponrack", "barrel", "holeanim", "tomb2",
				"tomb3", "roguecorpse", "ratnest", "corpse", "goo pile", "largeurn", "urn", "chest3", "jug", "skeleton", "guardcorpse", "sarcophagus", "object2",
				"cocoon", "basket", "stash", "hollow log", "hungskeleton", "pillar", "skullpile", "skull pile", "jar3", "jar2", "jar1", "bonechest", "woodchestl",
				"woodchestr", "barrel wilderness", "burialchestr", "burialchestl", "explodingchest", "chestl", "chestr", "groundtomb", "icecavejar1", "icecavejar2",
				"icecavejar3", "icecavejar4", "deadperson", "deadperson2", "evilurn", "tomb1l", "tomb3l", "groundtombl"
			];
		}

		unit = getUnit(2);

		if (unit) {
			do {
				if (unit.name && unit.mode === 0 && getDistance(me.x, me.y, unit.x, unit.y) <= range && containers.indexOf(unit.name.toLowerCase()) > -1) {
					unitList.push(copyUnit(unit));
				}
			} while (unit.getNext());
		}

		while (unitList.length > 0) {
			unitList.sort(Sort.units);

			unit = unitList.shift();

			if (unit && (Pather.useTeleport || !checkCollision(me, unit, 0x4)) && this.openChest(unit)) {
				Pickit.pickItems();
			}
		}

		return true;
	},

	shrineStates: false,

	scanShrines: function (range) {
		if (!Config.ScanShrines.length) {
			return false;
		}

		if (!range) {
			range = Pather.useTeleport ? 25 : 15;
		}

		var i, j, shrine,
			index  = -1,
			shrineList = [];

		// Initiate shrine states
		if (!this.shrineStates) {
			this.shrineStates = [];

			for (i = 0; i < Config.ScanShrines.length; i += 1) {
				switch (Config.ScanShrines[i]) {
				case 0: // None
				case 1: // Refilling
				case 2: // Health
				case 3: // Mana
				case 4: // Health Exchange (doesn't exist)
				case 5: // Mana Exchange (doesn't exist)
				case 16: // Enirhs (doesn't exist)
				case 17: // Portal
				case 18: // Gem
				case 19: // Fire
				case 20: // Monster
				case 21: // Exploding
				case 22: // Poison
					this.shrineStates[i] = 0; // no state

					break;
				case 6: // Armor
				case 7: // Combat
				case 8: // Resist Fire
				case 9: // Resist Cold
				case 10: // Resist Lightning
				case 11: // Resist Poison
				case 12: // Skill
				case 13: // Mana recharge
				case 14: // Stamina
				case 15: // Experience
					// Both states and shrines are arranged in same order with armor shrine starting at 128
					this.shrineStates[i] = Config.ScanShrines[i] + 122;

					break;
				}
			}
		}

		shrine = getUnit(2, "shrine");

		if (shrine) {
			// Build a list of nearby shrines
			do {
				if (shrine.mode === 0 && getDistance(me.x, me.y, shrine.x, shrine.y) <= range) {
					shrineList.push(copyUnit(shrine));
				}
			} while (shrine.getNext());

			// Check if we have a shrine state, store its index if yes
			for (i = 0; i < this.shrineStates.length; i += 1) {
				if (me.getState(this.shrineStates[i])) {
					index = i;

					break;
				}
			}

			for (i = 0; i < Config.ScanShrines.length; i += 1) {
				for (j = 0; j < shrineList.length; j += 1) {
					// Get the shrine if we have no active state or to refresh current state or if the shrine has no state
					// Don't override shrine state with a lesser priority shrine
					if (index === -1 || i <= index || this.shrineStates[i] === 0) {
						if (shrineList[j].objtype === Config.ScanShrines[i] && (Pather.useTeleport || !checkCollision(me, shrineList[j], 0x4))) {
							this.getShrine(shrineList[j]);

							// Gem shrine - pick gem
							if (Config.ScanShrines[i] === 18) {
								Pickit.pickItems();
							}
						}
					}
				}
			}
		}

		return true;
	},

	// Use a shrine Unit
	getShrine: function (unit) {
		if (unit.mode) {
			return false;
		}

		var i, tick;

		for (i = 0; i < 3; i += 1) {
			if (getDistance(me, unit) < 4 || Pather.moveToUnit(unit, 3, 0)) {
				Misc.click(0, 0, unit);
				//unit.interact();
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
	getShrinesInArea: function (area, type, use) {
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

			Pather.moveTo(coords[0], coords[1], 2);

			shrine = getUnit(2, "shrine");

			if (shrine) {
				do {
					if (shrine.objtype === type && shrine.mode === 0) {
						Pather.moveTo(shrine.x - 2, shrine.y - 2);

						if (!use || this.getShrine(shrine)) {
							return true;
						}
					}
				} while (shrine.getNext());
			}
		}

		return false;
	},

	getItemDesc: function (unit) {
		var i, desc,
			stringColor = "";

		desc = unit.description;

		if (!desc) {
			return "";
		}

		desc = desc.split("\n");

		// Lines are normally in reverse. Add color tags if needed and reverse order.
		for (i = 0; i < desc.length; i += 1) {
			if (desc[i].indexOf(getLocaleString(3331)) > -1) { // Remove sell value
				desc.splice(i, 1);

				i -= 1;
			} else {
				if (desc[i].match(/^(y|ÿ)c/)) {
					stringColor = desc[i].substring(0, 3);
				} else {
					desc[i] = stringColor + desc[i];
				}
			}

			desc[i] = desc[i].replace(/(y|ÿ)c([0-9!"+<;.*])/g, "\\xffc$2");
		}

		if (desc[desc.length - 1]) {
			desc[desc.length - 1] = desc[desc.length - 1].trim() + " (" + unit.ilvl + ")";
		}

		desc = desc.reverse().join("\n");

		return desc;
	},

	getItemSockets: function (unit) {
		var i, code,
			sockets = unit.getStat(194),
			subItems = unit.getItems(),
			tempArray = [];

		if (subItems) {
			switch (unit.sizex) {
			case 2:
				switch (unit.sizey) {
				case 3: // 2 x 3
					switch (sockets) {
					case 4:
						tempArray = [subItems[0], subItems[3], subItems[2], subItems[1]];

						break;
					case 5:
						tempArray = [subItems[1], subItems[4], subItems[0], subItems[3], subItems[2]];

						break;
					case 6:
						tempArray = [subItems[0], subItems[3], subItems[1], subItems[4], subItems[2], subItems[5]];

						break;
					}

					break;
				case 4: // 2 x 4
					switch (sockets) {
					case 5:
						tempArray = [subItems[1], subItems[4], subItems[0], subItems[3], subItems[2]];

						break;
					case 6:
						tempArray = [subItems[0], subItems[3], subItems[1], subItems[4], subItems[2], subItems[5]];

						break;
					}

					break;
				}

				break;
			}

			if (tempArray.length === 0 && subItems.length > 0) {
				tempArray = subItems.slice(0);
			}
		}

		for (i = 0; i < sockets; i += 1) {
			if (tempArray[i]) {
				code = tempArray[i].code;

				if ([10, 12, 58, 82, 83, 84].indexOf(tempArray[i].itemType) > -1) {
					code += (tempArray[i].gfx + 1);
				}
			} else {
				code = "gemsocket";
			}

			tempArray[i] = code;
		}

		return tempArray;
	},

	useItemLog: true, // Might be a bit dirty

	itemLogger: function (action, unit, text) {
		if (!Config.ItemInfo || !this.useItemLog) {
			return false;
		}

		var desc,
			date = new Date(),
			h = date.getHours(),
			m = date.getMinutes(),
			s = date.getSeconds(),
			dateString = "[" + (h < 10 ? "0" + h : h) + ":" + (m < 10 ? "0" + m : m) + ":" + (s < 10 ? "0" + s : s) + "]";

		switch (action) {
		case "Sold":
			if (Config.ItemInfoQuality.indexOf(unit.quality) === -1) {
				return false;
			}

			desc = this.getItemDesc(unit).split("\n").join(" | ").replace(/(\\xff|ÿ)c[0-9!"+<;.*]/gi, "").trim();

			break;
		case "Kept":
		case "Field Kept":
		case "Runeword Kept":
		case "Cubing Kept":
		case "Shopped":
		case "Gambled":
		case "Dropped":
			desc = this.getItemDesc(unit).split("\n").join(" | ").replace(/(\\xff|ÿ)c[0-9!"+<;.*]/gi, "").trim();

			break;
		case "No room for":
			desc = unit.name;

			break;
		default:
			desc = unit.fname.split("\n").reverse().join(" ").replace(/(\\xff|ÿ)c[0-9!"+<;.*]/gi, "").trim();

			break;
		}

		return this.fileAction("logs/ItemLog.txt", 2, dateString + " <" + me.profile + "> <" + action + "> (" + Pickit.itemQualityToName(unit.quality) + ") " + desc + (text ? " {" + text + "}" : "") + "\n");
	},

	// Log kept item stats in the manager.
	logItem: function (action, unit, keptLine) {
		if (!this.useItemLog) {
			return false;
		}

		var i, lastArea, code, desc, sock, itemObj,
			color = -1,
			name = unit.fname.split("\n").reverse().join(" ").replace(/ÿc[0-9!"+<;.*]/, "").trim();

		desc = this.getItemDesc(unit);
		color = unit.getColor();

		if (action.match("kept", "i")) {
			lastArea = DataFile.getStats().lastArea;

			if (lastArea) {
				desc += ("\n\\xffc0Area: " + lastArea);
			}
		}

		if (unit.getFlag(0x10)) {
			switch (unit.quality) {
			case 5: // Set
				switch (unit.classid) {
				case 27: // Angelic sabre
					code = "inv9sbu";

					break;
				case 74: // Arctic short war bow
					code = "invswbu";

					break;
				case 308: // Berserker's helm
					code = "invhlmu";

					break;
				case 330: // Civerb's large shield
					code = "invlrgu";

					break;
				case 31: // Cleglaw's long sword
				case 227: // Szabi's cryptic sword
					code = "invlsdu";

					break;
				case 329: // Cleglaw's small shield
					code = "invsmlu";

					break;
				case 328: // Hsaru's buckler
					code = "invbucu";

					break;
				case 306: // Infernal cap / Sander's cap
					code = "invcapu";

					break;
				case 30: // Isenhart's broad sword
					code = "invbsdu";

					break;
				case 309: // Isenhart's full helm
					code = "invfhlu";

					break;
				case 333: // Isenhart's gothic shield
					code = "invgtsu";

					break;
				case 326: // Milabrega's ancient armor
				case 442: // Immortal King's sacred armor
					code = "invaaru";

					break;
				case 331: // Milabrega's kite shield
					code = "invkitu";

					break;
				case 332: // Sigon's tower shield
					code = "invtowu";

					break;
				case 325: // Tancred's full plate mail
					code = "invfulu";

					break;
				case 3: // Tancred's military pick
					code = "invmpiu";

					break;
				case 113: // Aldur's jagged star
					code = "invmstu";

					break;
				case 234: // Bul-Kathos' colossus blade
					code = "invgsdu";

					break;
				case 372: // Grizwold's ornate plate
					code = "invxaru";

					break;
				case 366: // Heaven's cuirass
				case 215: // Heaven's reinforced mace
				case 449: // Heaven's ward
				case 426: // Heaven's spired helm
					code = "inv" + unit.code + "s";

					break;
				case 357: // Hwanin's grand crown
					code = "invxrnu";

					break;
				case 195: // Nalya's scissors suwayyah
					code = "invskru";

					break;
				case 395: // Nalya's grim helm
				case 465: // Trang-Oul's bone visage
					code = "invbhmu";

					break;
				case 261: // Naj's elder staff
					code = "invcstu";

					break;
				case 375: // Orphan's round shield
					code = "invxmlu";

					break;
				case 12: // Sander's bone wand
					code = "invbwnu";

					break;
				}

				break;
			case 7: // Unique
				for (i = 0; i < 401; i += 1) {
					if (unit.fname.split("\n").reverse()[0].indexOf(getLocaleString(getBaseStat(17, i, 2))) > -1) {
						code = getBaseStat(17, i, "invfile");

						break;
					}
				}

				break;
			}
		}

		if (!code) {
			if (["ci2", "ci3"].indexOf(unit.code) > -1) { // Tiara/Diadem
				code = unit.code;
			} else {
				code = getBaseStat(0, unit.classid, 'normcode') || unit.code;
			}

			code = code.replace(" ", "");

			if ([10, 12, 58, 82, 83, 84].indexOf(unit.itemType) > -1) {
				code += (unit.gfx + 1);
			}
		}

		sock = unit.getItem();

		if (sock) {
			do {
				if (sock.itemType === 58) {
					desc += "\n\n";
					desc += this.getItemDesc(sock);
				}
			} while (sock.getNext());
		}

		if (keptLine) {
			desc += ("\n\\xffc0Line: " + keptLine);
		}

		itemObj = {
			title: action + " " + name,
			description: desc,
			image: code,
			textColor: unit.quality,
			itemColor: color,
			header: "",
			sockets: this.getItemSockets(unit)
		};

		D2Bot.printToItemLog(itemObj);

		return true;
	},

	// Change into werewolf or werebear
	shapeShift: function (mode) {
		var i, tick, skill, state;

		switch (mode.toString().toLowerCase()) {
		case "0":
			return false;
		case "1":
		case "werewolf":
			state = 139;
			skill = 223;

			break;
		case "2":
		case "werebear":
			state = 140;
			skill = 228;

			break;
		default:
			throw new Error("shapeShift: Invalid parameter");
		}

		if (me.getState(state)) {
			return true;
		}

		for (i = 0; i < 3; i += 1) {
			Skill.cast(skill, 0);

			tick = getTickCount();

			while (getTickCount() - tick < 2000) {
				if (me.getState(state)) {
					delay(250);

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
						delay(250);

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
	townCheck: function () {
		var i, potion, check,
			needhp = true,
			needmp = true;

		// Can't tp from uber trist or when dead
		if (me.area === 136 || me.dead) {
			return false;
		}

		if (Config.TownCheck && !me.inTown) {
			try {
				if (me.gold > 1000) {
					for (i = 0; i < 4; i += 1) {
						if (Config.BeltColumn[i] === "hp" && Config.MinColumn[i] > 0) {
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

						if (Config.BeltColumn[i] === "mp" && Config.MinColumn[i] > 0) {
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
				}

				if (Config.OpenChests && Town.needKeys()) {
					check = true;
				}
			} catch (e) {
				check = false;
			}
		}

		if (check) {
			scriptBroadcast("townCheck");
			delay(500);

			return true;
		}

		return false;
	},

	// Log someone's gear
	spy: function (name) {
		if (!isIncluded("oog.js")) {
			include("oog.js");
		}

		if (!isIncluded("common/prototypes.js")) {
			include("common/prototypes.js");
		}

		var item,
			unit = getUnit(-1, name);

		if (!unit) {
			print("player not found");

			return false;
		}

		item = unit.getItem();

		if (item) {
			do {
				this.logItem(unit.name, item);
			} while (item.getNext());
		}

		return true;
	},

	// hopefully multi-thread and multi-profile friendly txt func
	/*fileAction: function (path, mode, msg) {
		var i, file,
			contents = "";

MainLoop:
		for (i = 0; i < 30; i += 1) {
			try {
				file = File.open(path, mode);

				switch (mode) {
				case 0: // read
					contents = file.readLine();

					break MainLoop;
				case 1: // write
				case 2: // append
					file.write(msg);

					break MainLoop;
				}
			} catch (e) {

			} finally {
				if (file) {
					file.close();
				}
			}

			delay(100);
		}

		return mode === 0 ? contents : true;
	},*/

	fileAction: function (path, mode, msg) {
		var i,
			contents = "";

MainLoop:
		for (i = 0; i < 30; i += 1) {
			try {
				switch (mode) {
				case 0: // read
					contents = FileTools.readText(path);

					break MainLoop;
				case 1: // write
					FileTools.writeText(path, msg);

					break MainLoop;
				case 2: // append
					FileTools.appendText(path, msg);

					break MainLoop;
				}
			} catch (e) {

			}

			delay(100);
		}

		return mode === 0 ? contents : true;
	},

	errorConsolePrint: true,
	screenshotErrors: false,

	// Report script errors to logs/ScriptErrorLog.txt
	errorReport: function (error, script) {
		var i, h, m, s, date, msg, oogmsg, filemsg, source, stack,
			stackLog = "";

		date = new Date();
		h = date.getHours();
		m = date.getMinutes();
		s = date.getSeconds();

		if (typeof error === "string") {
			msg = error;
			oogmsg = error.replace(/ÿc[0-9!"+<;.*]/gi, "");
			filemsg = "[" + (h < 10 ? "0" + h : h) + ":" + (m < 10 ? "0" + m : m) + ":" + (s < 10 ? "0" + s : s) + "] <" + me.profile + "> " + error.replace(/ÿc[0-9!"+<;.*]/gi, "") + "\n";
		} else {
			source = error.fileName.substring(error.fileName.lastIndexOf("\\") + 1, error.fileName.length);
			msg = "ÿc1Error in ÿc0" + script + " ÿc1(" + source + " line ÿc1" + error.lineNumber + "): ÿc1" + error.message;
			oogmsg = " Error in " + script + " (" + source + " #" + error.lineNumber + ") " + error.message + " (Area: " + me.area + ", Ping:" + me.ping + ", Game: " + me.gamename + ")";
			filemsg = "[" + (h < 10 ? "0" + h : h) + ":" + (m < 10 ? "0" + m : m) + ":" + (s < 10 ? "0" + s : s) + "] <" + me.profile + "> " + msg.replace(/ÿc[0-9!"+<;.*]/gi, "") + "\n";

			if (error.hasOwnProperty("stack")) {
				stack = error.stack;

				if (stack) {
					stack = stack.split("\n");

					if (stack && typeof stack === "object") {
						stack.reverse();
					}

					for (i = 0; i < stack.length; i += 1) {
						if (stack[i]) {
							stackLog += stack[i].substr(0, stack[i].indexOf("@") + 1) + stack[i].substr(stack[i].lastIndexOf("\\") + 1, stack[i].length - 1);

							if (i < stack.length - 1) {
								stackLog += ", ";
							}
						}
					}
				}
			}

			if (stackLog) {
				filemsg += "Stack: " + stackLog + "\n";
			}
		}

		if (this.errorConsolePrint) {
			D2Bot.printToConsole(oogmsg, 10);
		}

		showConsole();
		print(msg);
		this.fileAction("logs/ScriptErrorLog.txt", 2, filemsg);

		if (this.screenshotErrors) {
			takeScreenshot();
			delay(500);
		}
	},

	debugLog: function (msg) {
		if (!Config.Debug) {
			return;
		}

		debugLog(me.profile + ": " + msg);
	},

	// Use a NPC menu. Experimental function, subject to change
	// id = string number (with exception of Ressurect merc). http://www.blizzhackers.cc/viewtopic.php?f=209&t=378493
	useMenu: function (id) {
		//print("useMenu " + getLocaleString(id));

		var i, npc, lines;

		switch (id) {
		case 0x1507: // Resurrect (non-English dialog)
		case 0x0D44: // Trade (crash dialog)
			npc = getInteractedNPC();

			if (npc) {
				npc.useMenu(id);
				delay(750);

				return true;
			}

			break;
		}

		lines = getDialogLines();

		if (!lines) {
			return false;
		}

		for (i = 0; i < lines.length; i += 1) {
			if (lines[i].selectable && lines[i].text.indexOf(getLocaleString(id)) > -1) {
				getDialogLines()[i].handler();
				delay(750);

				return true;
			}
		}

		return false;
	},

	clone: function (obj) {
		var i, copy, attr;

		// Handle the 3 simple types, and null or undefined
		if (null === obj || "object" !== typeof obj) {
			return obj;
		}

		// Handle Date
		if (obj instanceof Date) {
			copy = new Date();

			copy.setTime(obj.getTime());

			return copy;
		}

		// Handle Array
		if (obj instanceof Array) {
			copy = [];

			for (i = 0; i < obj.length; i += 1) {
				copy[i] = this.clone(obj[i]);
			}

			return copy;
		}

		// Handle Object
		if (obj instanceof Object) {
			copy = {};

			for (attr in obj) {
				if (obj.hasOwnProperty(attr)) {
					copy[attr] = this.clone(obj[attr]);
				}
			}

			return copy;
		}

		throw new Error("Unable to copy obj! Its type isn't supported.");
	},

	copy: function (from) {
		var i,
			obj = {};

		for (i in from) {
			if (from.hasOwnProperty(i)) {
				obj[i] = this.clone(from[i]);
			}
		}

		return obj;
	}
};

var Sort = {
	// Sort units by comparing distance between the player
	units: function (a, b) {
		return Math.round(getDistance(me.x, me.y, a.x, a.y)) - Math.round(getDistance(me.x, me.y, b.x, b.y));
	},

	// Sort preset units by comparing distance between the player (using preset x/y calculations)
	presetUnits: function (a, b) {
		return getDistance(me, a.roomx * 5 + a.x, a.roomy * 5 + a.y) - getDistance(me, b.roomx * 5 + b.x, b.roomy * 5 + b.y);
	},

	// Sort arrays of x,y coords by comparing distance between the player
	points: function (a, b) {
		return getDistance(me, a[0], a[1]) - getDistance(me, b[0], b[1]);
	},

	numbers: function (a, b) {
		return a - b;
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

	// Total time till next level
	timeToLevel: function () {
		var tTLrawSeconds = (Math.floor((getTickCount() - me.gamestarttime) / 1000)).toString(),
			tTLrawtimeToLevel = this.runsToLevel() * tTLrawSeconds,
			tTLDays = Math.floor(tTLrawtimeToLevel / 86400),
			tTLHours = Math.floor((tTLrawtimeToLevel % 86400) / 3600),
			tTLMinutes = Math.floor(((tTLrawtimeToLevel % 86400) % 3600) / 60),
			tTLSeconds = ((tTLrawtimeToLevel % 86400) % 3600) % 60;

		//return tDays + "d " + tTLHours + "h " + tTLMinutes + "m " + tTLSeconds + "s";
		//return tTLDays + "d " + tTLHours + "h " + tTLMinutes + "m";
		return (tTLDays ? tTLDays + " d " : "") + (tTLHours ? tTLHours + " h " : "") + (tTLMinutes ? tTLMinutes + " m" : "");
	},

	// Get Game Time
	getGameTime: function () {
		var rawMinutes = Math.floor((getTickCount() - me.gamestarttime) / 60000).toString(),
			rawSeconds = (Math.floor((getTickCount() - me.gamestarttime) / 1000) % 60).toString();

		if (rawMinutes <= 9) {
			rawMinutes = "0" + rawMinutes;
		}

		if (rawSeconds <= 9) {
			rawSeconds = "0" + rawSeconds;
		}

		//return rawMinutes + "m " + rawSeconds + "s";
		return " (" + rawMinutes + ":" + rawSeconds + ")";
	},

	// Log to manager
	log: function () {
		var string,
			gain = this.gain(),
			progress = this.progress(),
			runsToLevel = this.runsToLevel(),
			totalRunsToLevel = this.totalRunsToLevel(),
			getGameTime = this.getGameTime(),
			timeToLevel = this.timeToLevel();

		//string = "[Game: " + me.gamename + (me.gamepassword ? "//" + me.gamepassword : "") + getGameTime + "] [Level: " + me.getStat(12) + " (" + progress + "%)] [XP: " + gain + "] [Games ETA: " + runsToLevel + "] [Time ETA: " + timeToLevel + "]";
		string = "[Game: " + me.gamename + (me.gamepassword ? "//" + me.gamepassword : "") + getGameTime + "] [Level: " + me.getStat(12) + " (" + progress + "%)] [XP: " + gain + "] [Games ETA: " + runsToLevel + "]";

		if (gain) {
			D2Bot.printToConsole(string, 4);

			if (me.getStat(12) > DataFile.getStats().level) {
				D2Bot.printToConsole("Congrats! You gained a level. Current level:" + me.getStat(12), 5);
			}
		}
	}
};

var Packet = {
	openMenu: function (unit) {
		if (unit.type !== 1) {
			throw new Error("openMenu: Must be used on NPCs.");
		}

		if (getUIFlag(0x08)) {
			return true;
		}

		var i, j;

		for (i = 0; i < 5; i += 1) {
			if (getDistance(me, unit) > 5) {
				Pather.moveToUnit(unit);
			}

			if (i > 0) {
				Packet.flash(me.gid);
			}

			if (!getUIFlag(0x08)) {
				sendPacket(1, 0x13, 4, 1, 4, unit.gid);
			}

			for (j = 0; j < 40; j += 1) {
				if (j > 0 && j % 8 === 0 && !getUIFlag(0x08)) {
					me.cancel();
					delay(300);
					sendPacket(1, 0x13, 4, 1, 4, unit.gid);
				}

				if (getUIFlag(0x08)) {
					delay(Math.max(500, me.ping * 2));

					return true;
				}

				delay(25);
			}
		}

		return false;
	},

	startTrade: function (unit, mode) {
		if (unit.type !== 1) {
			throw new Error("Unit.startTrade: Must be used on NPCs.");
		}

		if (getUIFlag(0x0C)) {
			return true;
		}

		var i,
			gamble = mode === "Gamble";

		if (this.openMenu(unit)) {
			for (i = 0; i < 10; i += 1) {
				delay(200);

				if (i % 2 === 0) {
					sendPacket(1, 0x38, 4, gamble ? 2 : 1, 4, unit.gid, 4, 0);
				}

				if (unit.itemcount > 0) {
					delay(200);

					return true;
				}
			}
		}

		return false;
	},

	buyItem: function (unit, shiftBuy, gamble) {
		var i, tick,
			oldGold = me.getStat(14) + me.getStat(15),
			itemCount = me.itemcount,
			npc = getInteractedNPC();

		if (!npc) {
			throw new Error("buyItem: No NPC menu open.");
		}

		if (me.getStat(14) + me.getStat(15) < unit.getItemCost(0)) { // Can we afford the item?
			return false;
		}

		for (i = 0; i < 3; i += 1) {
			sendPacket(1, 0x32, 4, npc.gid, 4, unit.gid, 4, shiftBuy ? 0x80000000 : gamble ? 0x2 : 0x0, 4, 0);

			tick = getTickCount();

			while (getTickCount() - tick < Math.max(2000, me.ping * 2 + 500)) {
				if (shiftBuy && me.getStat(14) + me.getStat(15) < oldGold) {
					return true;
				}

				if (itemCount !== me.itemcount) {
					return true;
				}

				delay(10);
			}
		}

		return false;
	},

	sellItem: function (unit) {
		if (unit.type !== 4) { // Check if it's an item we want to buy
			throw new Error("Unit.sell: Must be used on items.");
		}

		var i, tick, npc,
			itemCount = me.itemcount;

		npc = getInteractedNPC();

		if (!npc) {
			return false;
		}

		for (i = 0; i < 5; i += 1) {
			sendPacket(1, 0x33, 4, npc.gid, 4, unit.gid, 4, 0, 4, 0);

			tick = getTickCount();

			while (getTickCount() - tick < 2000) {
				if (me.itemcount !== itemCount) {
					return true;
				}

				delay(10);
			}
		}

		return false;
	},

	identifyItem: function (unit, tome) {
		var i, tick;

		if (!unit || unit.getFlag(0x10)) {
			return false;
		}

CursorLoop:
		for (i = 0; i < 3; i += 1) {
			sendPacket(1, 0x27, 4, unit.gid, 4, tome.gid);

			tick = getTickCount();

			while (getTickCount() - tick < 2000) {
				if (getCursorType() === 6) {
					break CursorLoop;
				}

				delay(10);
			}
		}

		if (getCursorType() !== 6) {
			return false;
		}

		for (i = 0; i < 3; i += 1) {
			if (getCursorType() === 6) {
				sendPacket(1, 0x27, 4, unit.gid, 4, tome.gid);
			}

			tick = getTickCount();

			while (getTickCount() - tick < 2000) {
				if (unit.getFlag(0x10)) {
					delay(50);

					return true;
				}

				delay(10);
			}
		}

		return false;
	},

	itemToCursor: function (item) {
		var i, tick;

		if (me.itemoncursor) { // Something already on cursor
			if (getUnit(100).gid === item.gid) { // Return true if the item is already on cursor
				return true;
			}

			this.dropItem(getUnit(100)); // If another item is on cursor, drop it
		}

		for (i = 0; i < 15; i += 1) {
			if (item.mode === 1) { // equipped
				sendPacket(1, 0x1c, 2, item.bodylocation);
			} else {
				sendPacket(1, 0x19, 4, item.gid);
			}

			tick = getTickCount();

			while (getTickCount() - tick < Math.max(500, me.ping * 2 + 200)) {
				if (me.itemoncursor) {
					return true;
				}

				delay(10);
			}
		}

		return false;
	},

	dropItem: function (item) {
		var i, tick;

		if (!this.itemToCursor(item)) {
			return false;
		}

		for (i = 0; i < 15; i += 1) {
			sendPacket(1, 0x17, 4, item.gid);

			tick = getTickCount();

			while (getTickCount() - tick < Math.max(500, me.ping * 2 + 200)) {
				if (!me.itemoncursor) {
					return true;
				}

				delay(10);
			}
		}

		return false;
	},

	castSkill: function (hand, wX, wY) {
		hand = (hand === 0) ? 0x0c : 0x05;
		sendPacket(1, hand, 2, wX, 2, wY);
	},

	unitCast: function (hand, who) {
		hand = (hand === 0) ? 0x11 : 0x0a;
		sendPacket(1, hand, 4, who.type, 4, who.gid);
	},

	moveNPC: function (npc, dwX, dwY) {
		sendPacket(1, 0x59, 4, npc.type, 4, npc.gid, 4, dwX, 4, dwY);
	},

	teleWalk: function (x, y, maxDist) {
		var i;

		if (maxDist === undefined) {
			maxDist = 5;
		}

		if (!this.telewalkTick) {
			this.telewalkTick = 0;
		}

		if (getDistance(me, x, y) > 10 && getTickCount() - this.telewalkTick > 3000 && Attack.validSpot(x, y)) {
			for (i = 0; i < 5; i += 1) {
				sendPacket(1, 0x5f, 2, x + rand(-1, 1), 2, y + rand(-1, 1));
				delay(me.ping + 1);
				sendPacket(1, 0x4b, 4, me.type, 4, me.gid);
				delay(me.ping + 1);

				if (getDistance(me, x, y) < maxDist) {
					delay(200);

					return true;
				}
			}

			this.telewalkTick = getTickCount();
		}

		return false;
	},

	flash: function (gid) {
		sendPacket(1, 0x4b, 4, 0, 4, gid);
	},

	changeStat: function (stat, value) {
		if (value > 0) {
			getPacket(1, 0x1d, 1, stat, 1, value);
		}
	}
};

var Messaging = {
	sendToScript: function (name, msg) {
		var script = getScript(name);

		if (script && script.running) {
			script.send(msg);

			return true;
		}

		return false;
	},

	sendToProfile: function (profileName, mode, message, getResponse) {
		var response;

		function copyDataEvent(mode2, msg) {
			if (mode2 === mode) {
				var obj;

				try {
					obj = JSON.parse(msg);
				} catch (e) {
					return false;
				}

				if (obj.hasOwnProperty("sender") && obj.sender === profileName) {
					response = Misc.copy(obj);
				}

				return true;
			}

			return false;
		}

		if (getResponse) {
			addEventListener("copydata", copyDataEvent);
		}

		if (!sendCopyData(null, profileName, mode, JSON.stringify({message: message, sender: me.profile}))) {
			//print("sendToProfile: failed to get response from " + profileName);

			if (getResponse) {
				removeEventListener("copydata", copyDataEvent);
			}

			return false;
		}

		if (getResponse) {
			delay(200);
			removeEventListener("copydata", copyDataEvent);

			if (!!response) {
				return response;
			}

			return false;
		}

		return true;
	}
};

var Events = {
	// gamepacket
	gamePacket: function (bytes) {
		var temp;

		switch (bytes[0]) {
		// Block movement after using TP/WP/Exit
		case 0x0D: // Player Stop
			// This can mess up death screen so disable for characters that are allowed to die
			if (Config.LifeChicken > 0) {
				return true;
			}

			break;
		// Block poison skills that might crash the client
		case 0x4C: // Cast skill on target
		case 0x4D: // Cast skill on coords
			temp = Number("0x" + bytes[7].toString(16) + bytes[6].toString(16));

			// Match Poison Javelin, Plague Javelin or Poison Nova
			if (temp && [15, 25, 92].indexOf(temp) > -1) {
				return true;
			}

			break;
		}

		return false;
	}
};