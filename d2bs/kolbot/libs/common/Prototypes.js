/**
*	@filename	Prototypes.js
*	@author		kolton
*	@desc		various 'Unit' and 'me' prototypes
*/
if (!isIncluded("common/Enums.js")) { include("common/Enums.js"); };

// Shuffle Array
// http://stackoverflow.com/questions/6274339/how-can-i-shuffle-an-array-in-javascript
Array.prototype.shuffle = function () {
	var temp, index,
		counter = this.length;

	// While there are elements in the array
	while (counter > 0) {
		// Pick a random index
		index = Math.floor(Math.random() * counter);

		// Decrease counter by 1
		counter -= 1;

		// And swap the last element with it
		temp = this[counter];
		this[counter] = this[index];
		this[index] = temp;
	}

	return this;
};

// Trim String
String.prototype.trim = function () {
	return this.replace(/^\s+|\s+$/g, "");
};

// Check if unit is idle
Unit.prototype.__defineGetter__("idle",
	function () {
		if (this.type > 0) {
			throw new Error("Unit.idle: Must be used with player units.");
		}

        return (this.mode === PlayerModes.Neutral || this.mode === PlayerModes.Town_Neutral || this.mode === PlayerModes.Dead); // Dead is pretty idle too
	});

Unit.prototype.__defineGetter__("gold",
	function () {
		return this.getStat(Stats.gold) + this.getStat(Stats.goldbank);
	});

// Death check
Unit.prototype.__defineGetter__("dead",
	function () {
		switch (this.type) {
            case UnitType.Player: // Player
                return this.mode === PlayerModes.Death || this.mode === PlayerModes.Dead;
            case UnitType.NPC: // Monster
                return this.mode === NPCModes.death || this.mode === NPCModes.dead;
		default:
			return false;
		}
	});

// Check if unit is in town
Unit.prototype.__defineGetter__("inTown",
	function () {
		if (this.type > 0) {
			throw new Error("Unit.inTown: Must be used with player units.");
		}

        return [Areas.Act1.Rogue_Encampment, Areas.Act2.Lut_Gholein, Areas.Act3.Kurast_Docktown, Areas.Act4.The_Pandemonium_Fortress, Areas.Act5.Harrogath].indexOf(this.area) > -1;
	});

// Check if party unit is in town
Party.prototype.__defineGetter__("inTown",
	function () {
        return [Areas.Act1.Rogue_Encampment, Areas.Act2.Lut_Gholein, Areas.Act3.Kurast_Docktown, Areas.Act4.The_Pandemonium_Fortress, Areas.Act5.Harrogath].indexOf(this.area) > -1;
	});

Unit.prototype.__defineGetter__("attacking",
	function () {
		if (this.type > 0) {
			throw new Error("Unit.attacking: Must be used with player units.");
		}

        return [PlayerModes.Attack1, PlayerModes.Attack2, PlayerModes.Cast, PlayerModes.Throw, PlayerModes.Kick, PlayerModes.Skill1,
                PlayerModes.Skill2, PlayerModes.Skill3, PlayerModes.Skill4, PlayerModes.Sequence].indexOf(this.mode) > -1;
	});

// Open NPC menu
Unit.prototype.openMenu = function (addDelay) {
	if (Config.PacketShopping) {
		return Packet.openMenu(this);
	}

	if (this.type !== 1) {
		throw new Error("Unit.openMenu: Must be used on NPCs.");
	}

	if (addDelay === undefined) {
		addDelay = 0;
	}

	if (getUIFlag(UIFlags.npc_menu)) {
		return true;
	}

	var i, j;

	for (i = 0; i < 5; i += 1) {
		if (getDistance(me, this) > 4) {
			Pather.moveToUnit(this);
		}

		if (i > 0) {
			Packet.flash(me.gid);
			// delay?
		}

        if (!getUIFlag(UIFlags.npc_menu)) {
			delay(100);
			this.interact();
		}

		for (j = 0; j < 40; j += 1) {
            if (j > 0 && j % 10 === 0 && !getUIFlag(UIFlags.npc_menu)) {
				me.cancel();
				delay(400);
				this.interact();
			}

            if (getUIFlag(UIFlags.npc_menu)) {
				delay(Math.max(700 + me.ping, 500 + me.ping * 2 + addDelay * 500));

				return true;
			}

			delay(25);
		}
	}

	return false;
};

// mode = "Gamble", "Repair" or "Shop"
Unit.prototype.startTrade = function (mode) {
	if (Config.PacketShopping) {
		return Packet.startTrade(this, mode);
	}

	if (this.type !== 1) {
		throw new Error("Unit.startTrade: Must be used on NPCs.");
	}

    if (getUIFlag(UIFlags.Shop_open_at_NPC)) {
		return true;
	}

	var i, tick,
		menuId = mode === "Gamble" ? 0x0D46 : mode === "Repair" ? 0x0D06 : 0x0D44;

	for (i = 0; i < 3; i += 1) {
		if (this.openMenu(i)) { // Incremental delay on retries
			Misc.useMenu(menuId);

			tick = getTickCount();

			while (getTickCount() - tick < 1000) {
                if (getUIFlag(UIFlags.Shop_open_at_NPC) && this.itemcount > 0) {
					delay(200);

					return true;
				}

				delay(25);
			}

			me.cancel();
		}
	}

	return false;
};

Unit.prototype.buy = function (shiftBuy, gamble) {
	if (Config.PacketShopping) {
		return Packet.buyItem(this, shiftBuy, gamble);
	}

    if (this.type !== UnitType.Item) { // Check if it's an item we want to buy
		throw new Error("Unit.buy: Must be used on items.");
	}

    if (!getUIFlag(UIFlags.Shop_open_at_NPC) || (this.getParent() && this.getParent().gid !== getInteractedNPC().gid)) { // Check if it's an item belonging to a NPC
		throw new Error("Unit.buy: Must be used in shops.");
	}

	if (me.getStat(Stats.gold) + me.getStat(Stats.goldbank) < this.getItemCost(0)) { // Can we afford the item?
		return false;
	}

	var i, tick,
        oldGold = me.getStat(Stats.gold) + me.getStat(Stats.goldbank),
		itemCount = me.itemcount;

	for (i = 0; i < 3; i += 1) {
		//print("BUY " + this.name + " " + i);

		this.shop(shiftBuy ? 6 : 2);

		tick = getTickCount();

		while (getTickCount() - tick < Math.max(2000, me.ping * 2 + 500)) {
            if (shiftBuy && me.getStat(Stats.gold) + me.getStat(Stats.goldbank) < oldGold) {
				delay(500);

				return true;
			}

			if (itemCount !== me.itemcount) {
				delay(500);

				return true;
			}

			delay(10);
		}
	}

	return false;
};

// Item owner name
Unit.prototype.__defineGetter__("parentName",
	function () {
        if (this.type !== UnitType.Item) {
			throw new Error("Unit.parentName: Must be used with item units.");
		}

		var parent = this.getParent();

		if (parent) {
			return parent.name;
		}

		return false;
	});

// You MUST use a delay after Unit.sell() if using custom scripts. delay(500) works best, dynamic delay is used when identifying/selling (500 - item id time)
Unit.prototype.sell = function () {
	if (Config.PacketShopping) {
		return Packet.sellItem(this);
	}

    if (this.type !== UnitType.Item) { // Check if it's an item we want to buy
		throw new Error("Unit.sell: Must be used on items.");
	}

    if (!getUIFlag(UIFlags.Shop_open_at_NPC)) { // Check if it's an item belonging to a NPC
		throw new Error("Unit.sell: Must be used in shops.");
	}

	var i, tick,
		itemCount = me.itemcount;

	for (i = 0; i < 5; i += 1) {
		this.shop(1);

		tick = getTickCount();

		while (getTickCount() - tick < 2000) {
			if (me.itemcount !== itemCount) {
				//delay(500);

				return true;
			}

			delay(10);
		}
	}

	return false;
};

Unit.prototype.toCursor = function () {
    if (this.type !== UnitType.Item) {
		throw new Error("Unit.toCursor: Must be used with items.");
	}

    if (me.itemoncursor && this.mode === ItemModes.Item_on_cursor) {
		return true;
	}

	var i, tick;

	for (i = 0; i < 3; i += 1) {
        try {
            if (this.mode === ItemModes.Item_equipped_self_or_merc) {
				clickItem(ClickType.Left_Click, this.bodylocation); // fix for equipped items (cubing viper staff for example)
			} else {
                clickItem(ClickType.Left_Click, this);
			}
		} catch (e) {
			return false;
		}

		tick = getTickCount();

		while (getTickCount() - tick < 1000) {
			if (me.itemoncursor) {
				delay(200);

				return true;
			}

			delay(10);
		}
	}

	return false;
};

Unit.prototype.drop = function () {
    if (this.type !== UnitType.Item) {
		throw new Error("Unit.drop: Must be used with items.");
	}

	var i, tick;

	if (!this.toCursor()) {
		return false;
	}

	for (i = 0; i < 3; i += 1) {
		clickMap(0, 0, me.x, me.y);
		delay(40);
		clickMap(2, 0, me.x, me.y);

		tick = getTickCount();

		while (getTickCount() - tick < 500) {
			if (!me.itemoncursor) {
				delay(200);

				return true;
			}

			delay(10);
		}
	}

	return false;
};

me.findItem = function (id, mode, loc, quality) {
	if (id === undefined) {
		id = -1;
	}

	if (mode === undefined) {
		mode = -1;
	}

	if (loc === undefined) {
		loc = -1;
	}

	if (quality === undefined) {
		quality = -1;
	}

	var item = me.getItem(id, mode);

	if (item) {
		do {
			if ((loc === -1 || item.location === loc) && (quality === -1 || item.quality === quality)) {
				return item;
			}
		} while (item.getNext());
	}

	return false;
};

me.findItems = function (id, mode, loc) {
	if (id === undefined) {
		id = -1;
	}

	if (mode === undefined) {
		mode = -1;
	}

	if (loc === undefined) {
		loc = false;
	}

	var list = [],
		item = me.getItem(id, mode);

	if (!item) {
		return false;
	}

	do {
		if (loc) {
			if (item.location === loc) {
				list.push(copyUnit(item));
			}
		} else {
			list.push(copyUnit(item));
		}
	} while (item.getNext());

	return list;
};

Unit.prototype.getPrefix = function (id) {
	var i;

	switch (typeof id) {
	case "number":
		if (typeof this.prefixnums !== "object") {
			return this.prefixnum === id;
		}

		for (i = 0; i < this.prefixnums.length; i += 1) {
			if (id === this.prefixnums[i]) {
				return true;
			}
		}

		break;
	case "string":
		if (typeof this.prefixes !== "object") {
			return this.prefix.replace(/\s+/g, "").toLowerCase() === id.replace(/\s+/g, "").toLowerCase();
		}

		for (i = 0; i < this.prefixes.length; i += 1) {
			if (id.replace(/\s+/g, "").toLowerCase() === this.prefixes[i].replace(/\s+/g, "").toLowerCase()) {
				return true;
			}
		}

		break;
	}

	return false;
};

Unit.prototype.getSuffix = function (id) {
	var i;

	switch (typeof id) {
	case "number":
		if (typeof this.suffixnums !== "object") {
			return this.suffixnum === id;
		}

		for (i = 0; i < this.suffixnums.length; i += 1) {
			if (id === this.suffixnums[i]) {
				return true;
			}
		}

		break;
	case "string":
		if (typeof this.suffixes !== "object") {
			return this.suffix.replace(/\s+/g, "").toLowerCase() === id.replace(/\s+/g, "").toLowerCase();
		}

		for (i = 0; i < this.suffixes.length; i += 1) {
			if (id.replace(/\s+/g, "").toLowerCase() === this.suffixes[i].replace(/\s+/g, "").toLowerCase()) {
				return true;
			}
		}

		break;
	}

	return false;
};

Unit.prototype.__defineGetter__("dexreq",
	function () {
		var finalReq,
            ethereal = this.getFlag(ItemFlags.isEthereal),
            reqModifier = this.getStat(Stats.item_req_percent),
			baseReq = getBaseStat("items", this.classid, "reqdex");

		finalReq = baseReq + Math.floor(baseReq * reqModifier / 100);

		if (ethereal) {
			finalReq -= 10;
		}

		return Math.max(finalReq, 0);
	});

Unit.prototype.__defineGetter__("strreq",
	function () {
		var finalReq,
            ethereal = this.getFlag(ItemFlags.isEthereal),
            reqModifier = this.getStat(Stats.item_req_percent),
			baseReq = getBaseStat("items", this.classid, "reqstr");

		finalReq = baseReq + Math.floor(baseReq * reqModifier / 100);

		if (ethereal) {
			finalReq -= 10;
		}

		return Math.max(finalReq, 0);
	});

Unit.prototype.__defineGetter__('itemclass',
	function () {
        if (getBaseStat(BaseStat.items, this.classid, 'code') === undefined) {
			return 0;
		}

        if (getBaseStat(BaseStat.items, this.classid, 'code') === getBaseStat(BaseStat.items, this.classid, 'ultracode')) {
			return 2;
		}

        if (getBaseStat(BaseStat.items, this.classid, 'code') === getBaseStat(BaseStat.items, this.classid, 'ubercode')) {
			return 1;
		}

		return 0;
	});

Unit.prototype.getStatEx = function (id, subid) {
	var i, temp, rval, regex;

	switch (id) {
        case Stats.toblock: // toblock
            switch (this.classid) {
                case ItemClassIds.Buckler: // buckler
                return this.getStat(Stats.toblock);
                case ItemClassIds.Preserved_Head: // preserved
		case ItemClassIds.Mummified_Trophy: // mummified
        case ItemClassIds.Minion_Skull: // minion
                return this.getStat(Stats.toblock) - 3;
        case ItemClassIds.Small_Shield: // small
        case ItemClassIds.Zombie_Head: // zombie
        case ItemClassIds.Fetish_Trophy: // fetish
        case ItemClassIds.Hellspawn_Skull: // hellspawn
                return this.getStat(Stats.toblock) - 5;
        case ItemClassIds.Kite_Shield: // kite
        case ItemClassIds.Unraveller_Head: // unraveller
        case ItemClassIds.Sexton_Trophy: // sexton
        case ItemClassIds.Overseer_Skull: // overseer
                return this.getStat(Stats.toblock) - 8;
        case ItemClassIds.Spiked_Shield: // spiked
        case ItemClassIds.Defender: // deefender
        case ItemClassIds.Gargoyle_Head: // gargoyle
        case ItemClassIds.Cantor_Trophy: // cantor
        case ItemClassIds.Succubus_Skull: // succubus
        case ItemClassIds.Targe: // targe
        case ItemClassIds.Akaran_Targe: // akaran t
                return this.getStat(Stats.toblock) - 10;
        case ItemClassIds.Large_Shield: // large
        case ItemClassIds.Round_Shield: // round
        case ItemClassIds.Demon_Head: // demon
        case ItemClassIds.Hierophant_Trophy: // hierophant
        case ItemClassIds.Bloodlord_Skull: // bloodlord
                return this.getStat(Stats.toblock) - 12;
        case ItemClassIds.Scutum: // scutum
                return this.getStat(Stats.toblock) - 14;
        case ItemClassIds.Rondache: // rondache
        case ItemClassIds.Akaran_Rondache: // akaran r
                return this.getStat(Stats.toblock) - 15;
        case ItemClassIds.Gothic_Shield: // goth
        case ItemClassIds.Ancient_Shield: // ancient
                return this.getStat(Stats.toblock) - 16;
        case ItemClassIds.Barbed_Shield: // barbed
                return this.getStat(Stats.toblock) - 17;
        case ItemClassIds.Dragon_Shield: // dragon
                return this.getStat(Stats.toblock) - 18;
        case ItemClassIds.Vortex_Shield: // vortex
                return this.getStat(Stats.toblock) - 19;
        case ItemClassIds.Bone_Shield: // bone
        case ItemClassIds.Grim_Shield: // grim
        case ItemClassIds.Luna: // luna
        case ItemClassIds.Blade_Barrier: // blade barr
        case ItemClassIds.Troll_Nest: // troll
        case ItemClassIds.Heraldic_Shield: // heraldic
        case ItemClassIds.Protector_Shield: // protector
                return this.getStat(Stats.toblock) - 20;
        case ItemClassIds.Heater: // heater
        case ItemClassIds.Monarch: // monarch
        case ItemClassIds.Aerin_Shield: // aerin
        case ItemClassIds.Gilded_Shield: // gilded
        case ItemClassIds.Zakarum_Shield: // zakarum
                return this.getStat(Stats.toblock) - 22;
        case ItemClassIds.Tower_Shield: // tower
        case ItemClassIds.Pavise: // pavise
        case ItemClassIds.Hyperion: // hyperion
        case ItemClassIds.Aegis: // aegis
        case ItemClassIds.Ward: // ward
                return this.getStat(Stats.toblock) - 24;
        case ItemClassIds.Crown_Shield: // crown
        case ItemClassIds.Royal_Shield: // royal
        case ItemClassIds.Kurast_Shield: // kurast
                return this.getStat(Stats.toblock) - 25;
        case ItemClassIds.Sacred_Rondache: // sacred r
                return this.getStat(Stats.toblock) - 28;
        case ItemClassIds.Sacred_Targe: // sacred t
                return this.getStat(Stats.toblock) - 30;
		}

		break;
        case Stats.mindamage: // plusmindamage
        case Stats.maxdamage: // plusmaxdamage
		if (subid === 1) {
			temp = this.getStat(-1);
			rval = 0;

			for (i = 0; i < temp.length; i += 1) {
				switch (temp[i][0]) {
				case id: // plus one handed dmg
				case id + 2: // plus two handed dmg
					// There are 2 occurrences of min/max if the item has +damage. Total damage is the sum of both.
					// First occurrence is +damage, second is base item damage.

					if (rval) { // First occurence stored, return if the second one exists
						return rval;
					}

					if (this.getStat(temp[i][0]) > 0 && this.getStat(temp[i][0]) > temp[i][2]) {
						rval = temp[i][2]; // Store the potential +dmg value
					}

					break;
				}
			}

			return 0;
		}

		break;
        case Stats.armorclass: // plusdefense
		if (subid === 0) {
			if ([0, 1].indexOf(this.mode) < 0) {
				break;
			}

            switch (this.itemType) {
                case NTItemTypes.jewel: // jewel
                case NTItemTypes.smallcharm: // charms
                case NTItemTypes.mediumcharm:
                case NTItemTypes.largecharm:
				// defense is the same as plusdefense for these items
                    return this.getStat(Stats.armorclass);
			}

			if (!this.desc) {
				this.desc = this.description;
			}

			temp = this.desc.split("\n");
			regex = new RegExp("\\+\\d+ " + getLocaleString(3481));

			for (i = 0; i < temp.length; i += 1) {
				if (temp[i].match(regex, "i")) {
					return parseInt(temp[i].replace(/ÿc[0-9!"+<;.*]/, ""), 10);
				}
			}

			return 0;
		}

		break;
        case Stats.poisonmindam:
		if (subid === 1) {
            return Math.round(this.getStat(Stats.poisonmindam) * this.getStat(Stats.poisonlength) / 256);
		}

		break;
        case Stats.item_addclassskills: // itemaddclassskills
		if (subid === undefined) {
			for (i = 0; i < 7; i += 1) {
                if (this.getStat(Stats.item_addclassskills, i)) {
                    return this.getStat(Stats.item_addclassskills, i);
				}
			}

			return 0;
		}

		break;
        case Stats.item_addskill_tab: // itemaddskilltab
		if (subid === undefined) {
			temp = [0, 1, 2, 8, 9, 10, 16, 17, 18, 24, 25, 26, 32, 33, 34, 40, 41, 42, 48, 49, 50];

			for (i = 0; i < temp.length; i += 1) {
                if (this.getStat(Stats.item_addskill_tab, temp[i])) {
                    return this.getStat(Stats.item_addskill_tab, temp[i]);
				}
			}

			return 0;
		}

		break;
        case Stats.item_skillonattack: // itemskillonattack
        case Stats.item_skillonhit: // itemskillonhit
        case Stats.item_charged_skill: // itemchargedskill
		if (subid === undefined) {
			temp = this.getStat(-2);

			if (temp.hasOwnProperty(id)) {
				if (temp[id] instanceof Array) {
					for (i = 0; i < temp[id].length; i += 1) {
						if (temp[id][i] !== undefined) {
							return temp[id][i].skill;
						}
					}
				} else {
					return temp[id].skill;
				}
			}

			return 0;
		}

		break;
	}

    if (this.getFlag(ItemFlags.isRuneword)) { // Runeword
		switch (id) {
		case 16: // enhanceddefense
			if ([0, 1].indexOf(this.mode) < 0) {
				break;
			}

			if (!this.desc) {
				this.desc = this.description;
			}

			temp = this.desc.split("\n");

			for (i = 0; i < temp.length; i += 1) {
				if (temp[i].match(getLocaleString(3520), "i")) {
					return parseInt(temp[i].replace(/ÿc[0-9!"+<;.*]/, ""), 10);
				}
			}

			return 0;
		case 18: // enhanceddamage
			if ([0, 1].indexOf(this.mode) < 0) {
				break;
			}

			if (!this.desc) {
				this.desc = this.description;
			}

			temp = this.desc.split("\n");

			for (i = 0; i < temp.length; i += 1) {
				if (temp[i].match(getLocaleString(10038), "i")) {
					return parseInt(temp[i].replace(/ÿc[0-9!"+<;.*]/, ""), 10);
				}
			}

			return 0;
		}
	}

	if (subid === undefined) {
		return this.getStat(id);
	}

	return this.getStat(id, subid);
};

/*
	_NTIPAliasColor["black"] = 3;
	_NTIPAliasColor["lightblue"] = 4;
	_NTIPAliasColor["darkblue"] = 5;
	_NTIPAliasColor["crystalblue"] = 6;
	_NTIPAliasColor["lightred"] = 7;
	_NTIPAliasColor["darkred"] = 8;
	_NTIPAliasColor["crystalred"] = 9;
	_NTIPAliasColor["darkgreen"] = 11;
	_NTIPAliasColor["crystalgreen"] = 12;
	_NTIPAliasColor["lightyellow"] = 13;
	_NTIPAliasColor["darkyellow"] = 14;
	_NTIPAliasColor["lightgold"] = 15;
	_NTIPAliasColor["darkgold"] = 16;
	_NTIPAliasColor["lightpurple"] = 17;
	_NTIPAliasColor["orange"] = 19;
	_NTIPAliasColor["white"] = 20;
*/

Unit.prototype.getColor = function () {
	var i, colors,
		Color = {
			black: 3,
			lightblue: 4,
			darkblue: 5,
			crystalblue: 6,
			lightred: 7,
			darkred: 8,
			crystalred: 9,
			darkgreen: 11,
			crystalgreen: 12,
			lightyellow: 13,
			darkyellow: 14,
			lightgold: 15,
			darkgold: 16,
			lightpurple: 17,
			orange: 19,
			white: 20
		};

    // check type
    
    if ([NTItemTypes.shield, NTItemTypes.armor, NTItemTypes.boots, NTItemTypes.gloves, NTItemTypes.belt,
        NTItemTypes.scepter, NTItemTypes.wand, NTItemTypes.staff, NTItemTypes.bow, NTItemTypes.axe,
        NTItemTypes.club, NTItemTypes.sword, NTItemTypes.hammer, NTItemTypes.knife, NTItemTypes.spear,
        NTItemTypes.polearm, NTItemTypes.crossbow, NTItemTypes.mace, NTItemTypes.helm, NTItemTypes.throwingknife,
        NTItemTypes.throwingaxe, NTItemTypes.javelin, NTItemTypes.handtohand, NTItemTypes.orb, NTItemTypes.primalhelm,
        NTItemTypes.pelt, NTItemTypes.amazonbow, NTItemTypes.amazonspear, NTItemTypes.amazonjavelin, NTItemTypes.assassinclaw].indexOf(this.itemType) === -1) {
		return -1;
	}

    // check quality
    if ([ItemQuality.Magic, ItemQuality.Set, ItemQuality.Rare, ItemQuality.Unique].indexOf(this.quality) === -1) {
		return -1;
	}

    if (this.quality === ItemQuality.Magic || this.quality === ItemQuality.Rare) {
		colors = {
			"Screaming": Color.orange,
			"Howling": Color.orange,
			"Wailing": Color.orange,
			"Sapphire": Color.lightblue,
			"Snowy": Color.lightblue,
			"Shivering": Color.lightblue,
			"Boreal": Color.lightblue,
			"Hibernal": Color.lightblue,
			"Ruby": Color.lightred,
			"Amber": Color.lightyellow,
			"Static": Color.lightyellow,
			"Glowing": Color.lightyellow,
			"Buzzing": Color.lightyellow,
			"Arcing": Color.lightyellow,
			"Shocking": Color.lightyellow,
			"Emerald": Color.crystalgreen,
			"Saintly": Color.darkgold,
			"Holy": Color.darkgold,
			"Godly": Color.darkgold,
			"Visionary": Color.white,
			"Mnemonic": Color.crystalblue,
			"Bowyer's": Color.lightgold,
			"Gymnastic": Color.lightgold,
			"Spearmaiden's": Color.lightgold,
			"Archer's": Color.lightgold,
			"Athlete's": Color.lightgold,
			"Lancer's": Color.lightgold,
			"Charged": Color.lightgold,
			"Blazing": Color.lightgold,
			"Freezing": Color.lightgold,
			"Glacial": Color.lightgold,
			"Powered": Color.lightgold,
			"Volcanic": Color.lightgold,
			"Blighting": Color.lightgold,
			"Noxious": Color.lightgold,
			"Mojo": Color.lightgold,
			"Cursing": Color.lightgold,
			"Venomous": Color.lightgold,
			"Golemlord's": Color.lightgold,
			"Warden's": Color.lightgold,
			"Hawk Branded": Color.lightgold,
			"Commander's": Color.lightgold,
			"Marshal's": Color.lightgold,
			"Rose Branded": Color.lightgold,
			"Guardian's": Color.lightgold,
			"Veteran's": Color.lightgold,
			"Resonant": Color.lightgold,
			"Raging": Color.lightgold,
			"Echoing": Color.lightgold,
			"Furious": Color.lightgold,
			"Master's": Color.lightgold, // there's 2x masters...
			"Caretaker's": Color.lightgold,
			"Terrene": Color.lightgold,
			"Feral": Color.lightgold,
			"Gaean": Color.lightgold,
			"Communal": Color.lightgold,
			"Keeper's": Color.lightgold,
			"Sensei's": Color.lightgold,
			"Trickster's": Color.lightgold,
			"Psychic": Color.lightgold,
			"Kenshi's": Color.lightgold,
			"Cunning": Color.lightgold,
			"Shadow": Color.lightgold,
			"Faithful": Color.white,
			"Priest's": Color.crystalgreen,
			"Dragon's": Color.crystalblue,
			"Vulpine": Color.crystalblue,
			"Shimmering": Color.lightpurple,
			"Rainbow": Color.lightpurple,
			"Scintillating": Color.lightpurple,
			"Prismatic": Color.lightpurple,
			"Chromatic": Color.lightpurple,
			"Hierophant's": Color.crystalgreen,
			"Berserker's": Color.crystalgreen,
			"Necromancer's": Color.crystalgreen,
			"Witch-hunter's": Color.crystalgreen,
			"Arch-Angel's": Color.crystalgreen,
			"Valkyrie's": Color.crystalgreen,
			"Massive": Color.darkgold,
			"Savage": Color.darkgold,
			"Merciless": Color.darkgold,
			"Ferocious": Color.black,
			"Grinding": Color.white,
			"Cruel": Color.black,
			"Gold": Color.lightgold,
			"Platinum": Color.lightgold,
			"Meteoric": Color.lightgold,
			"Strange": Color.lightgold,
			"Weird": Color.lightgold,
			"Knight's": Color.darkgold,
			"Lord's": Color.darkgold,
			"Fool's": Color.white,
			"King's": Color.darkgold,
			//"Master's": Color.darkgold,
			"Elysian": Color.darkgold,
			"Fiery": Color.darkred,
			"Smoldering": Color.darkred,
			"Smoking": Color.darkred,
			"Flaming": Color.darkred,
			"Condensing": Color.darkred,
			"Septic": Color.darkgreen,
			"Foul": Color.darkgreen,
			"Corrosive": Color.darkgreen,
			"Toxic": Color.darkgreen,
			"Pestilent": Color.darkgreen,
			"of Quickness": Color.darkyellow,
			"of the Glacier": Color.darkblue,
			"of Winter": Color.darkblue,
			"of Burning": Color.darkred,
			"of Incineration": Color.darkred,
			"of Thunder": Color.darkyellow,
			"of Storms": Color.darkyellow,
			"of Carnage": Color.black,
			"of Slaughter": Color.black,
			"of Butchery": Color.black,
			"of Evisceration": Color.black,
			"of Performance": Color.black,
			"of Transcendence": Color.black,
			"of Pestilence": Color.darkgreen,
			"of Anthrax": Color.darkgreen,
			"of the Locust": Color.crystalred,
			"of the Lamprey": Color.crystalred,
			"of the Wraith": Color.crystalred,
			"of the Vampire": Color.crystalred,
			"of Icebolt": Color.lightblue,
			"of Nova": Color.crystalblue,
			"of the Mammoth": Color.crystalred,
			"of Frost Shield": Color.lightblue,
			"of Nova Shield": Color.crystalblue,
			"of Wealth": Color.lightgold,
			"of Fortune": Color.lightgold,
			"of Luck": Color.lightgold,
			"of Perfection": Color.darkgold,
			"of Regrowth": Color.crystalred,
			"of Spikes": Color.orange,
			"of Razors": Color.orange,
			"of Swords": Color.orange,
			"of Stability": Color.darkyellow,
			"of the Colosuss": Color.crystalred,
			"of the Squid": Color.crystalred,
			"of the Whale": Color.crystalred,
			"of Defiance": Color.darkred,
			"of the Titan": Color.darkgold,
			"of Atlas": Color.darkgold,
			"of Wizardry": Color.darkgold
		};

        switch (this.itemType) {
            case NTItemTypes.boots: // boots
			colors["of Precision"] = Color.darkgold;

			break;
            case NTItemTypes.gloves: // gloves
			colors["of Alacrity"] = Color.darkyellow;
			colors["of the Leech"] = Color.crystalred;
			colors["of the Bat"] = Color.crystalred;
			colors["of the Giant"] = Color.darkgold;

			break;
		}
	} else if (this.quality === ItemQuality.Set) { // Set
        if (this.getFlag(ItemFlags.isIdentified)) {
			for (i = 0; i < 127; i += 1) {
                if (this.fname.split("\n").reverse()[0].indexOf(getLocaleString(getBaseStat(BaseStat.setitems, i, 3))) > -1) {
                    return getBaseStat(BaseStat.setitems, i, 12) > 20 ? -1 : getBaseStat(BaseStat.setitems, i, 12);
				}
			}
		} else {
			return Color.lightyellow; // Unidentified set item
		}
	} else if (this.quality === ItemQuality.Unique) { // Unique
		for (i = 0; i < 401; i += 1) {
            if (this.fname.split("\n").reverse()[0].indexOf(getLocaleString(getBaseStat(BaseStat.uniqueitems, i, 2))) > -1) {
                return getBaseStat(BaseStat.uniqueitems, i, 13) > 20 ? -1 : getBaseStat(BaseStat.uniqueitems, i, 13);
			}
		}
	}

	for (i = 0; i < this.suffixes.length; i += 1) {
		if (colors.hasOwnProperty(this.suffixes[i])) {
			return colors[this.suffixes[i]];
		}
	}

	for (i = 0; i < this.prefixes.length; i += 1) {
		if (colors.hasOwnProperty(this.prefixes[i])) {
			return colors[this.prefixes[i]];
		}
	}

	return -1;
};