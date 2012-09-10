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

		return (me.mode === 1 || me.mode === 5);
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
Unit.prototype.openMenu = function () {
	if (this.type !== 1) {
		throw new Error("Unit.openMenu: Must be used on NPCs.");
	}

	if (getUIFlag(0x08)) {
		return true;
	}

	var i, j;

	for (i = 0; i < 3; i += 1) {
		if (getDistance(me, this) > 3) {
			Pather.moveToUnit(this);
		}

		this.interact();

		for (j = 0; j < 40; j += 1) {
			if (j % 10 === 0) {
				me.cancel();
				delay(400);
				this.interact();
			}

			if (getUIFlag(0x08)) {
				delay(500 + me.ping * 2);

				return true;
			}

			delay(25);
		}
	}

	return false;
};

// mode = "Gamble", "Repair" or "Trade"
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
		if (this.openMenu()) {
			this.useMenu(menuId);
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
	_NTIPAliasColor["lightgold"] = 14;
	_NTIPAliasColor["darkyellow"] = 15;
	_NTIPAliasColor["darkgold"] = 16;
	_NTIPAliasColor["lightpurple"] = 17;
	_NTIPAliasColor["orange"] = 19;
	_NTIPAliasColor["white"] = 20;
*/

Unit.prototype.getColor = function () {
	// check type
	if ([2, 3, 15, 16, 19, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 42, 43, 44, 67, 68, 71, 72, 85, 86, 87, 88].indexOf(this.itemType) === -1) {
		return -1;
	}

	// check quality
	if ([4, 5, 6, 7].indexOf(this.quality) === -1) {
		return -1;
	}

	var i, colors;

	if (this.quality === 4 || this.quality === 6) {
		colors = {
			"Screaming": 19,
			"Howling": 19,
			"Wailing": 19,
			"Sapphire": 4,
			"Snowy": 4,
			"Shivering": 4,
			"Boreal": 4,
			"Hibernal": 4,
			"Ruby": 7,
			"Amber": 13,
			"Static": 13,
			"Glowing": 13,
			"Buzzing": 13,
			"Arcing": 13,
			"Shocking": 13,
			"Emerald": 12,
			"Saintly": 16,
			"Holy": 16,
			"Godly": 16,
			"Visionary": 20,
			"Mnemonic": 6,
			// changed skill tabs to 15 from 14 because it looks more appropriate
			"Bowyer's": 15,
			"Gymnastic": 15,
			"Spearmaiden's": 15,
			"Archer's": 15,
			"Athlete's": 15,
			"Lancer's": 15,
			"Charged": 15,
			"Blazing": 15,
			"Freezing": 15,
			"Glacial": 15,
			"Powered": 15,
			"Volcanic": 15,
			"Blighting": 15,
			"Noxious": 15,
			"Mojo": 15,
			"Cursing": 15,
			"Venomous": 15,
			"Golemlord's": 15,
			"Warden's": 15,
			"Hawk Branded": 15,
			"Commander's": 15,
			"Marshal's": 15,
			"Rose Branded": 15,
			"Guardian's": 15,
			"Veteran's": 15,
			"Resonant": 15,
			"Raging": 15,
			"Echoing": 15,
			"Furious": 15,
			"Master's": 15, // there's 2x masters...
			"Caretaker's": 15,
			"Terrene": 15,
			"Feral": 15,
			"Gaean": 15,
			"Communal": 15,
			"Keeper's": 15,
			"Sensei's": 15,
			"Trickster's": 15,
			"Psychic": 15,
			"Kenshi's": 15,
			"Cunning": 15,
			"Shadow": 15,
			"Faithful": 20,
			"Priest's": 12,
			"Dragon's": 6,
			"Vulpine": 6,
			"Shimmering": 17,
			"Rainbow": 17,
			"Scintillating": 17,
			"Prismatic": 17,
			"Hierophant's": 12,
			"Berserker's": 12,
			"Necromancer's": 12,
			"Witch-hunter's": 12,
			"Arch-Angel's": 12,
			"Valkyrie's": 12,
			"Massive": 16,
			"Savage": 16,
			"Merciless": 16,
			"Ferocious": 3,
			"Grinding": 20,
			"Cruel": 3,
			"Gold": 14,
			"Platinum": 14,
			"Meteoric": 14,
			"Strange": 14,
			"Weird": 14,
			"Knight's": 16,
			"Lord's": 16,
			"Fool's": 20,
			"King's": 16,
			//"Master's": 16,
			"Elysian": 16,
			"Fiery": 8,
			"Smoldering": 8,
			"Smoking": 8,
			"Flaming": 8,
			"Condensing": 8,
			"Septic": 11,
			"Foul": 11,
			"Corrosive": 11,
			"Toxic": 11,
			"Pestilent": 11,
			"of Quickness": 14,
			"of the Glacier": 5,
			"of Winter": 5,
			"of Burning": 8,
			"of Incineration": 8,
			"of Thunder": 14,
			"of Storms": 14,
			"of Carnage": 3,
			"of Slaughter": 3,
			"of Butchery": 3,
			"of Evisceration": 3,
			"of Performance": 3,
			"of Transcendence": 3,
			"of Pestilence": 11,
			"of Anthrax": 11,
			"of the Locust": 9,
			"of the Lamprey": 9,
			"of the Wraith": 9,
			"of the Vampire": 9,
			"of Icebolt": 4,
			"of Nova": 6,
			"of the Mammoth": 9,
			"of Frost Shield": 4,
			"of Nova Shield": 6,
			"of Wealth": 14,
			"of Fortune": 14,
			"of Luck": 14,
			"of Perfection": 16,
			"of Regrowth": 9,
			"of Spikes": 19,
			"of Razors": 19,
			"of Swords": 19,
			"of Stability": 14,
			"of the Colosuss": 9,
			"of the Squid": 9,
			"of the Whale": 9,
			"of Defiance": 8,
			"of the Titan": 16,
			"of Atlas": 16,
			"of Wizardry": 16
		};

		switch (this.itemType) {
		case 15: // boots
			colors["of Precision"] = 16;

			break;
		case 16: // gloves
			colors["of Alacrity"] = 14;
			colors["of the Leech"] = 9;
			colors["of the Bat"] = 9;
			colors["of the Giant"] = 16;

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