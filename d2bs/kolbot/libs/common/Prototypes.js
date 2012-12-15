/**
*	@filename	Prototypes.js
*	@author		kolton
*	@desc		various 'Unit' and 'me' prototypes
*/

// Check if unit is idle
Unit.prototype.__defineGetter__("idle",
	function () {
		if (this.type > 0) {
			throw new Error("Unit.idle: Must be used with player units.");
		}

		return (this.mode === 1 || this.mode === 5);
	}
	);

// Death check
Unit.prototype.__defineGetter__("dead",
	function () {
		if (this.type > 0) {
			throw new Error("Unit.dead: Must be used with player units.");
		}

		return (this.mode === 0 || this.mode === 17);
	}
	);

// Check if unit is in town
Unit.prototype.__defineGetter__("inTown",
	function () {
		if (this.type > 0) {
			throw new Error("Unit.inTown: Must be used with player units.");
		}

		return [1, 40, 75, 103, 109].indexOf(this.area) > -1;
	}
	);

// Check if party unit is in town
Party.prototype.__defineGetter__("inTown",
	function () {
		return [1, 40, 75, 103, 109].indexOf(this.area) > -1;
	}
	);

Unit.prototype.__defineGetter__("attacking",
	function () {
		if (this.type > 0) {
			throw new Error("Unit.attacking: Must be used with player units.");
		}

		return [7, 8, 10, 11, 12, 13, 14, 15, 16, 18].indexOf(me.mode) > -1;
	}
	);

// Open NPC menu
Unit.prototype.openMenu = function (addDelay) {
	if (this.type !== 1) {
		throw new Error("Unit.openMenu: Must be used on NPCs.");
	}

	if (typeof addDelay === "undefined") {
		addDelay = 0;
	}

	if (getUIFlag(0x08)) {
		return true;
	}

	var i, j;

	for (i = 0; i < 3; i += 1) {
		if (getDistance(me, this) > 3) {
			Pather.moveToUnit(this);
		}

		if (i > 0) {
			Packet.flash(me.gid);
		}

		this.interact();
		//sendPacket(1, 0x13, 4, 1, 4, this.gid);

		for (j = 0; j < 40; j += 1) {
			if (j % 10 === 0) {
				me.cancel();
				delay(400);
				this.interact();
				//sendPacket(1, 0x13, 4, 1, 4, this.gid);
			}

			if (getUIFlag(0x08)) {
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
	if (this.type !== 1) {
		throw new Error("Unit.startTrade: Must be used on NPCs.");
	}

	if (getUIFlag(0x0C)) {
		return true;
	}

	var i, tick,
		menuId = mode === "Gamble" ? 0x0D46 : mode === "Repair" ? 0x0D06 : 0x0D44;

	for (i = 0; i < 3; i += 1) {
		if (this.openMenu(i)) { // Incremental delay on retries
			Misc.useMenu(menuId);
			delay(1000);

			tick = getTickCount();

			while (getTickCount() - tick < 1000) {
				if (getUIFlag(0x0C) && this.itemcount > 0) {
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

Unit.prototype.buy = function (shiftBuy) {
	if (this.type !== 4) { // Check if it's an item we want to buy
		throw new Error("Unit.buy: Must be used on items.");
	}

	if (!getUIFlag(0xC) || this.getParent().gid !== getInteractedNPC().gid) { // Check if it's an item belonging to a NPC
		throw new Error("Unit.buy: Must be used in shops.");
	}

	if (me.getStat(14) + me.getStat(15) < this.getItemCost(0)) { // Can we afford the item?
		return false;
	}

	var i, tick, container,
		itemCount = me.itemcount;

	for (i = 0; i < 3; i += 1) {
		this.shop(shiftBuy ? 6 : 2);

		tick = getTickCount();

		while (getTickCount() - tick < 2000) {
			if (shiftBuy) {
				switch (this.classid) {
				case 529: // tp scroll
					container = me.getItem(518); // tp tome

					if (container && container.getStat(70) === 20) {
						delay(500);

						return true;
					}

					break;
				case 530: // id scroll
					container = me.getItem(519); // id tome

					if (container && container.getStat(70) === 20) {
						delay(500);

						return true;
					}

					break;
				case 543: // key
					container = me.getItem(543); // key stack

					if (container && container.getStat(70) === 12) {
						delay(500);

						return true;
					}

					break;
				}

				delay(90);
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

// You MUST use a delay after Unit.sell() if using custom scripts. delay(500) works best, dynamic delay is used when identifying/selling (500 - item id time)
Unit.prototype.sell = function () {
	if (this.type !== 4) { // Check if it's an item we want to buy
		throw new Error("Unit.sell: Must be used on items.");
	}

	if (!getUIFlag(0xC)) { // Check if it's an item belonging to a NPC
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
	if (this.type !== 4) {
		throw new Error("Unit.toCursor: Must be used with items.");
	}

	var i, tick;

	for (i = 0; i < 3; i += 1) {
		if (this.mode === 1) {
			clickItem(0, this.bodylocation); // fix for equipped items (cubing viper staff fro example)
		} else {
			clickItem(0, this);
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
	if (this.type !== 4) {
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

me.findItem = function (id, mode, loc) {
	if (typeof id === "undefined") {
		id = -1;
	}

	if (typeof mode === "undefined") {
		mode = -1;
	}

	if (typeof loc === "undefined") {
		loc = false;
	}

	var item = me.getItem(id, mode);

	if (!item) {
		return false;
	}

	if (loc) {
		while (item.location !== loc) {
			if (!item.getNext()) {
				break;
			}
		}

		if (item.location !== loc) {
			return false;
		}
	}

	return item;
};

me.findItems = function (id, mode, loc) {
	if (typeof id === "undefined") {
		id = -1;
	}

	if (typeof mode === "undefined") {
		mode = -1;
	}

	if (typeof loc === "undefined") {
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
	if (typeof this.prefixnums !== "object") {
		return this.prefixnum === id;
	}

	var i,
		prefixList = this.prefixnums;

	for (i = 0; i < prefixList.length; i += 1) {
		if (id === prefixList[i]) {
			return true;
		}
	}

	return false;
};

Unit.prototype.getSuffix = function (id) {
	if (typeof this.suffixnums !== "object") {
		return this.suffixnum === id;
	}

	var i,
		suffixList = this.suffixnums;

	for (i = 0; i < suffixList.length; i += 1) {
		if (id === suffixList[i]) {
			return true;
		}
	}

	return false;
};

Unit.prototype.__defineGetter__('itemclass',
	function () {
		if (getBaseStat(0, this.classid, 'code') === undefined) {
			return 0;
		}

		if (getBaseStat(0, this.classid, 'code') === getBaseStat(0, this.classid, 'ultracode')) {
			return 2;
		}

		if (getBaseStat(0, this.classid, 'code') === getBaseStat(0, this.classid, 'ubercode')) {
			return 1;
		}

		return 0;
	}
	);

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
	var i, colors, Color = {
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
	if ([2, 3, 15, 16, 19, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 42, 43, 44, 67, 68, 71, 72, 85, 86, 87, 88].indexOf(this.itemType) === -1) {
		return -1;
	}

	// check quality
	if ([4, 5, 6, 7].indexOf(this.quality) === -1) {
		return -1;
	}

	if (this.quality === 4 || this.quality === 6) {
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
			// changed skill tabs to 15 from 14 because it looks more appropriate
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
		case 15: // boots
			colors["of Precision"] = Color.darkgold;

			break;
		case 16: // gloves
			colors["of Alacrity"] = Color.darkyellow;
			colors["of the Leech"] = Color.crystalred;
			colors["of the Bat"] = Color.crystalred;
			colors["of the Giant"] = Color.darkgold;

			break;
		}
	} else if (this.quality === 5) {
		for (i = 0; i < 127; i += 1) {
			if (this.fname.split("\n").reverse()[0].indexOf(getLocaleString(getBaseStat(16, i, 3))) > -1) {
				return getBaseStat(16, i, 12) > 20 ? -1 : getBaseStat(16, i, 12);
			}
		}
	} else if (this.quality === 7) {
		for (i = 0; i < 401; i += 1) {
			if (this.fname.split("\n").reverse()[0].indexOf(getLocaleString(getBaseStat(17, i, 2))) > -1) {
				return getBaseStat(17, i, 13) > 20 ? -1 : getBaseStat(17, i, 13);
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