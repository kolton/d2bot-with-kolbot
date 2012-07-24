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
				delay(900);

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
			delay(10);
			this.useMenu(menuId);
			delay(10);

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

	var i, tick,
		gold = me.getStat(14) + me.getStat(15);

	for (i = 0; i < 3; i += 1) {
		this.shop(shiftBuy ? 6 : 2);

		tick = getTickCount();

		while (getTickCount() - tick < 2000) {
			if (me.getStat(14) + me.getStat(15) !== gold) {
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

	if (!list.length) {
		return false;
	}

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