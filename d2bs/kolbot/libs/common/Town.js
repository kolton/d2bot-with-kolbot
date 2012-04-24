/**
*	@filename	Town.js
*	@author		kolton
*	@desc		do town chores like buying, selling and gambling
*/

var Town = {
	sellTimer: getTickCount(), // shop speedup test

	tasks: [
		{Heal: "akara", Shop: "akara", Gamble: "gheed", Repair: "charsi", Merc: "kashya", Key: "akara"},
		{Heal: "fara", Shop: "drognan", Gamble: "elzix", Repair: "fara", Merc: "greiz", Key: "lysander"},
		{Heal: "ormus", Shop: "ormus", Gamble: "alkor", Repair: "hratli", Merc: "asheara", Key: "hratli"},
		{Heal: "jamella", Shop: "jamella", Gamble: "jamella", Repair: "halbu", Merc: "tyrael", Key: "jamella"},
		{Heal: "malah", Shop: "malah", Gamble: "anya", Repair: "larzuk", Merc: "qual-kehk", Key: "malah"}
	],

	ignoredItemTypes: [ // Items that won't be stashed
		5, // Arrows
		6, // Bolts
		18, // Book (Tome)
		22, // Scroll
		38, // Missile Potion
		41, // Key
		76, // Healing Potion
		77, // Mana Potion
		78, // Rejuvenation Potion
		79, // Stamina Potion
		80, // Antidote Potion
		81 // Thawing Potion
	],

	// Do town chores
	doChores: function () {
		if (me.classid === 4 && Config.FindItem) { // weapon switch fix in case last game dropped with item find switch on
			Precast.weaponSwitch(Math.abs(Config.FindItemSwitch - 1));
		}

		this.heal();
		this.fillTome("tbk");
		this.buyPotions();
		this.identify();
		this.shopItems();
		this.repair();
		this.buyKeys();
		this.gamble();
		this.reviveMerc();
		Cubing.doCubing();
		Runewords.makeRunewords();
		this.stash();

		while (getUIFlag(0x08) || getUIFlag(0x1A) || getUIFlag(0x19)) {
			me.cancel();
			delay(300);
		}
	},

	// Start a task and return the NPC Unit
	initNPC: function (task) {
		var npc = getInteractedNPC();

		if (npc && npc.name.toLowerCase() !== this.tasks[me.act - 1][task]) {
			me.cancel();

			npc = null;
		}

		if (!npc) {
			this.move(this.tasks[me.act - 1][task]);

			npc = getUnit(1, this.tasks[me.act - 1][task]);
		}

		if (!npc || (!getUIFlag(0x08) && !npc.openMenu())) {
			return false;
		}

		switch (task) {
		case "Shop":
		case "Repair":
		case "Gamble":
			if (!getUIFlag(0x0C) && !npc.startTrade(task)) {
				return false;
			}

			break;
		case "Key":
			if (!getUIFlag(0x0C) && !npc.startTrade(me.act === 3 ? "Repair" : "Shop")) {
				return false;
			}

			break;
		}

		return npc;
	},

	// Go to a town healer
	heal: function () {
		if (!this.needHealing()) {
			return true;
		}

		if (!this.initNPC("Heal")) {
			return false;
		}

		return true;
	},

	// Check if healing is needed, based on character config
	needHealing: function () {
		if (me.hp * 100 / me.hpmax > Config.HealHP && me.mp * 100 / me.mpmax > Config.HealMP) {
			return false;
		}

		return true;
	},

	// Buy potions from a NPC
	buyPotions: function () {
		var i, j, pot, npc, beltSize, col,
			emptyColumns = 0,
			useShift = true;

		col = this.checkColumns();
		beltSize = Storage.BeltSize();

		// Check if we need to buy potions based on Config.MinColumn
		for (i = 0; i < 4; i += 1) {
			if (["hp", "mp"].indexOf(Config.BeltColumn[i]) > -1 && col[i] > (beltSize - Config.MinColumn[i])) {
				break;
			}
		}

		if (i === 4) {
			return true;
		}

		npc = this.initNPC("Shop");

		if (!npc) {
			return false;
		}

		for (i = 0; i < 4; i += 1) {
			switch (Config.BeltColumn[i]) {
			case "hp":
			case "mp": // Increase emptyColumns if a buyable column is empty
				if (col[i] === beltSize) {
					emptyColumns += 1;
				}

				break;
			case "rv": // can't use shift buy if "rv" column is empty
				if (col[i] === beltSize) {
					useShift = false;
				}

				break;
			}
		}

		for (i = 0; i < 4; i += 1) {
			if (col[i] > 0) {
				pot = this.getPotion(npc, Config.BeltColumn[i]);

				if (pot) {
					print("ÿc2column ÿc0" + i + "ÿc2 needs ÿc0" + col[i] + " ÿc2potions");

					// Shift+buy will trigger if there's no empty columns or if only the current column is empty
					if (useShift && (emptyColumns === 0 || (emptyColumns === 1 && col[i] === beltSize))) {
						pot.buy(true);
					} else {
						for (j = 0; j < col[i]; j += 1) {
							pot.buy(false);
						}
					}
				}
			}

			// Switch to shift+buy on the fly (if possible, happens if 2+ buyable potion columns are empty)
			if (col[i] === beltSize && emptyColumns > 0) {
				emptyColumns -= 1;
			}

			col = this.checkColumns(); // Re-initialize columns (needed because 1 shift-buy can fill multiple columns)
		}

		return true;
	},

	// Return column status (needed potions in each column)
	checkColumns: function () {
		var beltSize = Storage.BeltSize(),
			col = [beltSize, beltSize, beltSize, beltSize],
			pot = me.getItem(-1, 2); // Mode 2 = in belt

		if (!pot) { // No potions
			return col;
		}

		do {
			col[pot.x % 4] -= 1;
		} while (pot.getNext());

		return col;
	},

	// Get the highest potion from current npc
	getPotion: function (npc, type) {
		var i, result;

		if (!type) {
			return false;
		}

		if (type === "hp" || type === "mp") {
			for (i = 5; i > 0; i -= 1) {
				result = npc.getItem(type + i);

				if (result) {
					return result;
				}
			}
		}

		return false;
	},

	fillTome: function (code) {
		if (this.checkScrolls(code) >= 10) {
			return true;
		}

		var scroll, tome,
			npc = this.initNPC("Shop");

		if (!npc) {
			return false;
		}

		if (!me.findItem("tbk", 0, 3)) {
			tome = npc.getItem("tbk");

			if (tome) {
				try {
					tome.buy();
				} catch (e1) {
					print(e1);
				}
			}
		}

		scroll = npc.getItem(code === "tbk" ? "tsc" : "isc");

		if (!scroll) {
			return false;
		}

		try {
			scroll.buy(true);
		} catch (e2) {
			print(e2.message);

			return false;
		}

		return true;
	},

	checkScrolls: function (id) {
		var tome = me.findItem(id, 0, 3);

		if (!tome) {
			return false;
		}

		return tome.getStat(70);
	},

	identify: function () {
		var item, tome, scroll, npc,
			list = this.getUnids();

		if (!list) {
			return false;
		}

		npc = this.initNPC("Shop");

		if (!npc) {
			return false;
		}

		tome = me.findItem("ibk", 0, 3);

		if (tome && tome.getStat(70) < list.length) {
			this.fillTome("ibk");
		}

MainLoop:
		while (list.length > 0) {
			item = list.shift();

			switch (Pickit.checkItem(item)) {
			case 1:
				if (item.getFlag(0x10)) {
					//D2Bot.printToItemLog("Kept " + item.fname.split("\n").reverse().join(" "));
					Misc.logItem("Kept", item);
				}

				break;
			case 2:
				break;
			case -1:
				if (tome) {
					this.identifyItem(item, tome);
				} else {
					scroll = npc.getItem("isc");

					if (scroll) {
						if (!Storage.Inventory.CanFit(scroll)) {
							try {
								me.findItem("tbk", 0, 3).sell();
							} catch (e) {
								print(e);
							}
						}

						scroll.buy();
					}

					scroll = me.findItem("isc", 0, 3);

					if (!scroll) {
						break MainLoop;
					}

					this.identifyItem(item, scroll);
				}

				switch (Pickit.checkItem(item)) {
				case 1:
					//D2Bot.printToItemLog("Kept " + item.fname.split("\n").reverse().join(" "));
					Misc.logItem("Kept", item);
					break;
				case -1:
				case 2:
				case 3: // just in case
					break;
				default:
					item.sell();

					break;
				}

				break;
			}
		}

		if (!me.findItem("tbk", 0, 3)) {
			this.fillTome("tbk");
		}

		return true;
	},

	getUnids: function () {
		var i,
			list = [],
			items = me.getItems();

		if (!items || !items.length) {
			return false;
		}

		for (i = 0; i < items.length; i += 1) {
			if (items[i].location === 3 && !items[i].getFlag(0x10)) {
				list.push(items[i]);
			}
		}

		if (!list.length) {
			return false;
		}

		return list;
	},

	identifyItem: function (unit, tome) {
		var i, tick;

		if (!unit || unit.getFlag(0x10)) {
			return false;
		}

		this.sellTimer = getTickCount(); // shop speedup test

		for (i = 0; i < 3; i += 1) {
			clickItem(1, tome);

			tick = getTickCount();

			while (getTickCount() - tick < 500) {
				if (getCursorType() === 6) {
					break;
				}

				delay(10);
			}
		}

		if (getCursorType() !== 6) {
			return false;
		}

		delay(270);

		for (i = 0; i < 3; i += 1) {
			if (getCursorType() === 6) {
				clickItem(0, unit);
			}

			tick = getTickCount();

			while (getTickCount() - tick < 500) {
				if (unit.getFlag(0x10)) {
					return true;
				}

				delay(10);
			}

			delay(300);
		}

		return false;
	},

	shopItems: function () {
		if (!Config.MiniShopBot) {
			return true;
		}

		var i, items,
			npc = getInteractedNPC();

		if (!npc) {
			return false;
		}

		items = npc.getItems();

		if (!items || !items.length) {
			return false;
		}

		print("Scanning " + items.length + " items.");

		for (i = 0; i < items.length; i += 1) {
			if (this.ignoredItemTypes.indexOf(items[i].itemType) === -1 && Pickit.checkItem(items[i]) === 1) {
				try {
					if (Storage.Inventory.CanFit(items[i]) && me.getStat(14) + me.getStat(15) >= items[i].getItemCost(0)) {
						Misc.logItem("Shopped", items[i]);
						items[i].buy();
					}
				} catch (e) {
					print(e);

					continue;
				}
			}
		}

		return true;
	},

	gamble: function () {
		if (!this.needGamble() || !Config.GambleItems.length) {
			return true;
		}

		var i, items, npc, newItem,
			list = [];

		npc = this.initNPC("Gamble");

		if (!npc) {
			return false;
		}

		items = me.findItems(-1, 0, 3);

		while (items.length > 0) {
			list.push(items.shift().gid);
		}

		while (me.getStat(14) + me.getStat(15) >= Config.GambleGoldStop) {
			if (!getInteractedNPC()) {
				npc.startTrade("Gamble");
			}

			items = npc.getItems();

			if (items) {
				for (i = 0; i < items.length; i += 1) {
					if (Config.GambleItems.indexOf(items[i].classid) > -1 && Storage.Inventory.CanFit(items[i])) {
						items[i].buy();

						newItem = this.getGambledItem(list);

						if (newItem) {
							switch (Pickit.checkItem(newItem)) {
							case 1:
								Misc.logItem("Gambled", newItem);
								list.push(newItem.gid);

								break;
							case 2:
								list.push(newItem.gid);
								Cubing.buildLists();

								break;
							default:
								newItem.sell();

								break;
							}
						}
					}
				}
			}

			me.cancel();
		}

		return true;
	},

	needGamble: function () {
		return Config.Gamble && me.getStat(14) + me.getStat(15) >= Config.GambleGoldStart;
	},

	getGambledItem: function (list) {
		var i, j,
			items = me.findItems(-1, 0, 3);

		for (i = 0; i < items.length; i += 1) {
			if (list.indexOf(items[i].gid) === -1) {
				for (j = 0; j < 3; j += 1) {
					if (items[i].getFlag(0x10)) {
						break;
					}

					delay(100);
				}

				return items[i];
			}
		}

		return false;
	},

	buyKeys: function () {
		if (!this.needKeys()) {
			return true;
		}

		var key,
			npc = this.initNPC("Key");

		if (!npc) {
			return false;
		}

		key = npc.getItem("key");

		if (!key) {
			return false;
		}

		try {
			key.buy(true);
		} catch (e) {
			print(e.message);

			return false;
		}

		return true;
	},

	needKeys: function () {
		if (!Config.OpenChests || me.classid === 6) {
			return false;
		}

		var key = me.findItem("key", 0, 3);

		if (key && key.getStat(70) > 6) {
			return false;
		}

		return true;
	},

	repair: function () {
		var quiver, myQuiver, npc, repairCheck, bowCheck;

		repairCheck = this.needRepair();

		if (!repairCheck) {
			return true;
		}

		npc = this.initNPC("Repair");

		if (!npc) {
			return false;
		}

		print("Repair trigger: " + repairCheck);

		switch (repairCheck) {
		case "durability":
		case "charges":
		case "quantity":
			me.repair();

			break;
		case "quiver":
			bowCheck = Attack.usingBow();

			if (bowCheck) {
				switch (bowCheck) {
				case "bow":
					quiver = npc.getItem("aqv");

					break;
				case "crossbow":
					quiver = npc.getItem("cqv");

					break;
				}

				if (quiver) {
					myQuiver = me.getItem(quiver.code, 1);

					if (myQuiver) {
						myQuiver.sell();
					}

					quiver.buy();
				}
			}

			break;
		}

		return true;
	},

	needRepair: function () {
		if (me.getStat(14) + me.getStat(15) < me.getRepairCost()) { // Check if we can afford repairs
			return false;
		}

		var i, durability, quantity, charge, quiver, bowCheck,
			repairPercent = 40, // TODO: Move this somewhere else
			item = me.getItem(-1, 1); // Id -1 = any, Mode 1 = equipped

		if (!item) { // No equipped items
			return false;
		}

		do {
			if (!item.getFlag(0x400000)) { // Skip ethereal items
				switch (item.itemType) {
				// Quantity check
				case 42: // Throwing knives
				case 43: // Throwing axes
				case 44: // Javelins
				case 87: // Amazon javelins
					quantity = item.getStat(70);

					if (quantity && quantity * 100 / (getBaseStat("items", item.classid, "maxstack") + item.getStat(254)) <= repairPercent) { // Stat 254 = increased stack size
						return "quantity";
					}

					break;
				// Durability check
				default:
					durability = item.getStat(72);

					if (durability && durability * 100 / item.getStat(73) <= repairPercent) {
						return "durability";
					}

					break;
				}

				// Charged item check
				charge = item.getStat(-2)[204];

				if (typeof (charge) === "object") {
					if (charge instanceof Array) {
						for (i = 0; i < charge.length; i += 1) {
							if (typeof charge[i] !== "undefined" && charge[i].hasOwnProperty("charges") && charge[i].charges * 100 / charge[i].maxcharges <= repairPercent) {
								return "charges";
							}
						}
					} else if (charge.charges * 100 / charge.maxcharges <= repairPercent) {
						return "charges";
					}
				}
			}
		} while (item.getNext());

		// Arrow/Bolt check
		bowCheck = Attack.usingBow();

		if (bowCheck) {
			switch (bowCheck) {
			case "bow":
				quiver = me.getItem("aqv", 1); // Equipped arrow quiver
				break;
			case "crossbow":
				quiver = me.getItem("cqv", 1); // Equipped bolt quiver
				break;
			}

			if (!quiver) { // Out of arrows/bolts
				return "quiver";
			}

			quantity = quiver.getStat(70);

			if (quantity && quantity * 100 / getBaseStat("items", quiver.classid, "maxstack") <= repairPercent) {
				return "quiver";
			}
		}

		return false;
	},

	reviveMerc: function () {
		if (!this.needMerc()) {
			return true;
		}

		var i, tick,
			npc = this.initNPC("Merc");

		if (!npc) {
			return false;
		}

		delay(300);

MainLoop:
		for (i = 0; i < 3; i += 1) {
			npc.useMenu(0x1507);

			tick = getTickCount();

			while (getTickCount() - tick < 1000) {
				if (me.getMerc()) {
					break MainLoop;
				}

				delay(10);
			}
		}

		delay(300);
		Attack.checkInfinity();

		return !!me.getMerc();
	},

	needMerc: function () {
		var i, merc;

		if (me.gametype === 0 || !Config.UseMerc || me.getStat(14) + me.getStat(15) < me.mercrevivecost) { // gametype 0 = classic
			return false;
		}

		// me.getMerc() might return null if called right after taking a portal, that's why there's retry attempts
		for (i = 0; i < 3; i += 1) {
			merc = me.getMerc();

			if (merc && merc.mode !== 0 && merc.mode !== 12) {
				return false;
			}

			delay(100);
		}

		if (!me.mercrevivecost) { // In case we never had a merc and Config.UseMerc is still set to true for some odd reason
			return false;
		}

		return true;
	},

	stash: function () {
		if (!this.needStash()) {
			return true;
		}

		var i,
			items = Storage.Inventory.Compare(Config.Inventory);

		if (items) {
			for (i = 0; i < items.length; i += 1) {
				if (this.ignoredItemTypes.indexOf(items[i].itemType) === -1 && (Pickit.checkItem(items[i]) > 0 || Cubing.keepItem(items[i]) || Runewords.keepItem(items[i]))) {
					Storage.Stash.MoveTo(items[i]);
				}
			}
		}

		// Stash gold
		if (me.getStat(14) >= Config.StashGold && me.getStat(15) < 25e5 && this.openStash()) {
			gold(me.getStat(14), 3);
			delay(500);
			me.cancel();
		}

		return true;
	},

	needStash: function () {
		return Storage.Inventory.Compare(Config.Inventory).length > 0 || (me.getStat(14) >= Config.StashGold && me.getStat(15) < 25e5);
	},

	openStash: function () {
		if (!this.move("stash")) {
			return false;
		}

		if (getUIFlag(0x19)) {
			return true;
		}

		var i, tick,
			useTK = me.classid === 1 && me.getSkill(43, 1),
			stash = getUnit(2, 267);

		if (stash) {
			for (i = 0; i < 3; i += 1) {
				//Pather.moveToUnit(stash, 0, 0, false, useTK);

				if (useTK) {
					Skill.cast(43, 0, stash);
				} else {
					stash.interact();
				}

				tick = getTickCount();

				while (getTickCount() - tick < 1000) {
					if (getUIFlag(0x19)) {
						delay(200);
						return true;
					}

					delay(10);
				}
			}
		}

		return false;
	},

	getCorpse: function () {
		var i, corpse, gid;

		corpse = getUnit(0, me.name, 17);

		if (corpse) {
			gid = corpse.gid;

			do {
				for (i = 0; i < 5; i += 1) {
					corpse.interact();

					if (!getUnit(0, me.name, 17, gid)) {
						break;
					}

					delay(500);
				}
			} while (corpse.getNext());
		}

		corpse = getUnit(0, me.name, 17);

		if (corpse) {
			throw new Error("Town.getCorpse: Failed to get the corpse");
		}

		return true;
	},

	// TODO: Determine if this func can be avoided with better potion pickup code.
	clearBelt: function () {
		var item = me.getItem(-1, 2),
			clearList = [];

		if (item) {
			do {
				switch (item.itemType) {
				case 76: // Healing
					if (Config.BeltColumn[item.x % 4] !== "hp") {
						clearList.push(copyUnit(item));
					}

					break;
				case 77: // Mana
					if (Config.BeltColumn[item.x % 4] !== "mp") {
						clearList.push(copyUnit(item));
					}

					break;
				case 78: // Rejuvenation
					if (Config.BeltColumn[item.x % 4] !== "rv") {
						clearList.push(copyUnit(item));
					}

					break;
				}
			} while (item.getNext());

			while (clearList.length > 0) {
				clearList.shift().interact();
				delay(200);
			}
		}

		return true;
	},

	clearInventory: function () {
		var i, items,
			clearList = [],
			item = me.getItem(-1, 0);

		// Potions (after death usually)
		if (item) {
			do {
				if (item.location === 3) {
					switch (item.itemType) {
					case 76: // Healing
					case 77: // Mana
						clearList.push(copyUnit(item));
						break;
					case 78: // Rejuv
						if (Config.RejuvBuffer) { // TODO: Improve
							break;
						}

						clearList.push(copyUnit(item));
						break;
					}
				}
			} while (item.getNext());

			while (clearList.length > 0) {
				clearList.shift().interact();
				delay(200);
			}
		}

		// Any leftover items from a failed ID (crashed game, disconnect etc.)
		items = Storage.Inventory.Compare(Config.Inventory);

		for (i = 0; !!items && i < items.length; i += 1) {
			if ([18, 41, 78].indexOf(items[i].itemType) === -1 && Pickit.checkItem(items[i]) === 0 && !Cubing.keepItem(items[i]) && !Runewords.keepItem(items[i])) {
				try {
					items[i].drop();
				} catch (e) {
					print(e);
				}
			}
		}

		return true;
	},

	act : [{}, {}, {}, {}, {}],
	initialize: function () {
		print("Initialize town " + me.act);

		switch (me.act) {
		case 1:
			var fire,
				wp = getPresetUnit(1, 2, 119),
				fireUnit = getPresetUnit(1, 2, 39);

			if (!fireUnit) {
				return false;
			}

			fire = [fireUnit.roomx * 5 + fireUnit.x, fireUnit.roomy * 5 + fireUnit.y];

			this.act[0].spot = {};
			this.act[0].spot.stash = [fire[0] - 7, fire[1] - 12];
			this.act[0].spot.warriv = [fire[0] - 5, fire[1] - 2];
			this.act[0].spot.cain = [fire[0] + 6, fire[1] - 5];
			this.act[0].spot.kashya = [fire[0] + 14, fire[1] - 4];
			this.act[0].spot.akara = [fire[0] + 56, fire[1] - 30];
			this.act[0].spot.charsi = [fire[0] - 39, fire[1] - 25];
			this.act[0].spot.gheed = [fire[0] - 34, fire[1] + 36];
			this.act[0].spot.portalspot = [fire[0] + 10, fire[1] + 18];
			this.act[0].spot.waypoint = [wp.roomx * 5 + wp.x, wp.roomy * 5 + wp.y];
			this.act[0].initialized = true;

			break;
		case 2:
			this.act[1].spot = {};
			this.act[1].spot.fara = [5124, 5082];
			this.act[1].spot.cain = [5124, 5082];
			this.act[1].spot.lysander = [5118, 5104];
			this.act[1].spot.greiz = [5033, 5053];
			this.act[1].spot.elzix = [5032, 5102];
			this.act[1].spot.palace = [5055, 5142];
			this.act[1].spot.sewers = [5221, 5181];
			this.act[1].spot.meshif = [5205, 5058];
			this.act[1].spot.drognan = [5097, 5035];
			this.act[1].spot.atma = [5140, 5055];
			this.act[1].spot.warriv = [5152, 5201];
			this.act[1].spot.portalspot = [5168, 5055];
			this.act[1].spot.stash = [5124, 5082];
			this.act[1].spot.waypoint = [5070, 5083];
			this.act[1].initialized = true;

			break;
		case 3:
			this.act[2].spot = {};
			this.act[2].spot.meshif = [5118, 5168];
			this.act[2].spot.hratli = [5223, 5048];
			this.act[2].spot.ormus = [5129, 5093];
			this.act[2].spot.asheara = [5043, 5093];
			this.act[2].spot.alkor = [5083, 5016];
			this.act[2].spot.cain = [5148, 5066];
			this.act[2].spot.stash = [5144, 5059];
			this.act[2].spot.portalspot = [5156, 5063];
			this.act[2].spot.waypoint = [5158, 5050];
			this.act[2].initialized = true;

			break;
		case 4:
			this.act[3].spot = {};
			this.act[3].spot.cain = [5027, 5027];
			this.act[3].spot.halbu = [5089, 5031];
			this.act[3].spot.tyrael = [5027, 5027];
			this.act[3].spot.jamella = [5088, 5054];
			this.act[3].spot.stash = [5022, 5040];
			this.act[3].spot.portalspot = [5045, 5042];
			this.act[3].spot.waypoint = [5043, 5018];
			this.act[3].initialized = true;

			break;
		case 5:
			this.act[4].spot = {};
			this.act[4].spot.portalspot = [5097, 5024];
			this.act[4].spot.stash = [5129, 5061];
			this.act[4].spot.larzuk = [5141, 5045];
			this.act[4].spot.malah = [5078, 5029];
			this.act[4].spot.cain = [5119, 5061];
			this.act[4].spot["qual-kehk"] = [5066, 5083]; // derp
			this.act[4].spot.anya = [5112, 5120];
			this.act[4].spot.portal = [5118, 5120];
			this.act[4].spot.waypoint = [5113, 5068];
			this.act[4].spot.nihlathak = [5071, 5111];
			this.act[4].initialized = true;
			break;
		}

		return true;
	},

	move: function (spot) {
		if (!me.inTown) { // To prevent long trips if tp to town failed
			throw new Error("Town.move: You're not in town!");
		}

		// TODO: Add character config variable for telekinesis
		while (!me.idle) {
			delay(40);
		}

		var townSpot,
			useTK = me.classid === 1 && me.getSkill(43, 1) && ["stash", "portalspot", "waypoint"].indexOf(spot) > -1;

		if (!this.act[me.act - 1].initialized) {
			this.initialize();
		}

		if (typeof (this.act[me.act - 1].spot[spot]) === "object") {
			print("Moving to " + spot + " from " + me.x + " " + me.y);
			townSpot = this.act[me.act - 1].spot[spot];
		} else {
			print("ÿc1Invalid town spot: " + spot);

			return false;
		}

		if (useTK) {
			if (getDistance(me, townSpot[0], townSpot[1]) > 14) {
				Attack.getIntoPosition({x: townSpot[0], y: townSpot[1]}, 14, 0x4);
			}
		} else {
			Pather.moveTo(townSpot[0], townSpot[1], 3);
		}

		return true;
	},

	goToTown: function (act) {
		if (!act) {
			act = me.act;
		}

		var towns = [1, 40, 75, 103, 109];

		if (!me.inTown) {
			if (!Pather.makePortal(true)) {
				throw new Error("Town.goToTown: Failed to make TP");
			}
		}

		if (arguments.length < 1) {
			return true;
		}

		if (act < 1 || act > 5) {
			throw new Error("Town.goToTown: Invalid act!");
		}

		if (act !== me.act) {
			if (!Pather.useWaypoint(towns[act - 1])) {
				throw new Error("Town.goToTown: Failed to go to town");
			}
		}

		return true;
	},

	visitTown: function () {
		var preArea = me.area;

		try { // not an essential function -> handle thrown errors
			this.goToTown();
		} catch (e) {
			return false;
		}

		this.doChores();
		this.move("portalspot");

		if (!Pather.usePortal(preArea, me.name)) {
			return false;
		}

		if (Config.PublicMode) {
			Pather.makePortal();
		}

		return true;
	}
};