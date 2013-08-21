/**
*	@filename	Town.js
*	@author		kolton
*	@desc		do town chores like buying, selling and gambling
*/

var NPC = {
	Akara: getLocaleString(2892).toLowerCase(),
	Gheed: getLocaleString(2891).toLowerCase(),
	Charsi: getLocaleString(2894).toLowerCase(),
	Kashya: getLocaleString(2893).toLowerCase(),

	Fara: getLocaleString(3025).toLowerCase(),
	Drognan: getLocaleString(3023).toLowerCase(),
	Elzix: getLocaleString(3030).toLowerCase(),
	Greiz: getLocaleString(3031).toLowerCase(),
	Lysander: getLocaleString(3026).toLowerCase(),

	Ormus: getLocaleString(1011).toLowerCase(),
	Alkor: getLocaleString(1010).toLowerCase(),
	Hratli: getLocaleString(1009).toLowerCase(),
	Asheara: getLocaleString(1008).toLowerCase(),

	Jamella: getLocaleString(1016).toLowerCase(),
	Halbu: getLocaleString(1017).toLowerCase(),
	Tyrael: getLocaleString(1013).toLowerCase(),

	Malah: getLocaleString(22478).toLowerCase(),
	Anya: getLocaleString(22477).toLowerCase(),
	Larzuk: getLocaleString(22476).toLowerCase(),
	"Qual-Kehk": getLocaleString(22480).toLowerCase(),

	Cain: getLocaleString(2890).toLowerCase()
};

var Town = {
	sellTimer: getTickCount(), // shop speedup test
	beltSize: false,

	tasks: [
		{Heal: NPC.Akara, Shop: NPC.Akara, Gamble: NPC.Gheed, Repair: NPC.Charsi, Merc: NPC.Kashya, Key: NPC.Akara, CainID: NPC.Cain},
		{Heal: NPC.Fara, Shop: NPC.Drognan, Gamble: NPC.Elzix, Repair: NPC.Fara, Merc: NPC.Greiz, Key: NPC.Lysander, CainID: NPC.Cain},
		{Heal: NPC.Ormus, Shop: NPC.Ormus, Gamble: NPC.Alkor, Repair: NPC.Hratli, Merc: NPC.Asheara, Key: NPC.Hratli, CainID: NPC.Cain},
		{Heal: NPC.Jamella, Shop: NPC.Jamella, Gamble: NPC.Jamella, Repair: NPC.Halbu, Merc: NPC.Tyrael, Key: NPC.Jamella, CainID: NPC.Cain},
		{Heal: NPC.Malah, Shop: NPC.Malah, Gamble: NPC.Anya, Repair: NPC.Larzuk, Merc: NPC["Qual-Kehk"], Key: NPC.Malah, CainID: NPC.Cain}
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
		if (!me.inTown) {
			this.goToTown();
		}

		var i,
			cancelFlags = [0x01, 0x02, 0x04, 0x08, 0x14, 0x16, 0x0c, 0x0f];

		if (me.classid === 4 && Config.FindItem && Config.FindItemSwitch) { // weapon switch fix in case last game dropped with item find switch on
			Precast.weaponSwitch(Math.abs(Config.FindItemSwitch - 1));
		}

		if (Config.MFSwitchPercent) {
			Precast.weaponSwitch(Math.abs(Config.MFSwitch - 1));
		}

		this.heal();
		this.fillTome("tbk");

		if (Config.FieldID) {
			this.fillTome("ibk");
		}

		this.buyPotions();
		this.identify();
		this.shopItems();
		this.buyKeys();
		this.repair();
		this.gamble();
		this.reviveMerc();
		Cubing.doCubing();
		Runewords.makeRunewords();
		this.stash(true);
		this.clearScrolls();

		for (i = 0; i < cancelFlags.length; i += 1) {
			if (getUIFlag(cancelFlags[i])) {
				delay(500);
				me.cancel();

				break;
			}
		}

		me.cancel();

		return true;
	},

	// Start a task and return the NPC Unit
	initNPC: function (task) {
		var npc = getInteractedNPC();

		if (npc && npc.name.toLowerCase() !== this.tasks[me.act - 1][task]) {
			me.cancel();

			npc = null;
		}

		if (!npc) {
			npc = getUnit(1, this.tasks[me.act - 1][task]);

			if (!npc) {
				this.move(this.tasks[me.act - 1][task]);

				npc = getUnit(1, this.tasks[me.act - 1][task]);
			}
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
		case "CainID":
			Misc.useMenu(0x0FB4);
			me.cancel();

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
		if (me.hp * 100 / me.hpmax <= Config.HealHP || me.mp * 100 / me.mpmax <= Config.HealMP) {
			return true;
		}

		// Status effects
		if (Config.HealStatus && (me.getState(2) || me.getState(9) || me.getState(61))) {
			return true;
		}

		return false;
	},

	buyPotions: function () {
		var i, j, npc, useShift, col, beltSize, pot;

		if (!this.beltSize) {
			this.beltSize = Storage.BeltSize();
		}

		beltSize = this.beltSize;
		col = this.checkColumns(beltSize);

		// Check if we need to buy potions based on Config.MinColumn
		for (i = 0; i < 4; i += 1) {
			if (["hp", "mp"].indexOf(Config.BeltColumn[i]) > -1 && col[i] > (beltSize - Config.MinColumn[i])) {
				break;
			}
		}

		// No columns to fill
		if (i === 4) {
			return true;
		}

		if (me.diff === 0 && Pather.accessToAct(4)) {
			Town.goToTown(4);
		}

		npc = this.initNPC("Shop");

		if (!npc) {
			return false;
		}

		for (i = 0; i < 4; i += 1) {
			if (col[i] > 0) {
				useShift = this.shiftCheck(col, beltSize);
				pot = this.getPotion(npc, Config.BeltColumn[i]);

				if (pot) {
					//print("�c2column �c0" + i + "�c2 needs �c0" + col[i] + " �c2potions");

					// Shift+buy will trigger if there's no empty columns or if only the current column is empty
					if (useShift) {
						pot.buy(true);
					} else {
						for (j = 0; j < col[i]; j += 1) {
							pot.buy(false);
						}
					}
				}
			}

			col = this.checkColumns(beltSize); // Re-initialize columns (needed because 1 shift-buy can fill multiple columns)
		}

		return true;
	},

	// Check when to shift-buy potions
	shiftCheck: function (col, beltSize) {
		var i, fillType;

		for (i = 0; i < col.length; i += 1) {
			// Set type based on non-empty column
			if (!fillType && col[i] > 0 && col[i] < beltSize) {
				fillType = Config.BeltColumn[i];
			}

			if (col[i] >= beltSize) {
				switch (Config.BeltColumn[i]) {
				case "hp":
					// Set type based on empty column
					if (!fillType) {
						fillType = "hp";
					}

					// Can't shift+buy if we need to get differnt potion types
					if (fillType !== "hp") {
						return false;
					}

					break;
				case "mp":
					if (!fillType) {
						fillType = "mp";
					}

					if (fillType !== "mp") {
						return false;
					}

					break;
				case "rv": // Empty rejuv column = can't shift-buy
					return false;
				}
			}
		}

		return true;
	},

	// Return column status (needed potions in each column)
	checkColumns: function (beltSize) {
		var col = [beltSize, beltSize, beltSize, beltSize],
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
		if (this.checkScrolls(code) >= 13) {
			return true;
		}

		var scroll, tome,
			npc = this.initNPC("Shop");

		if (!npc) {
			return false;
		}

		delay(500);

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
			switch (id) {
			case "ibk":
				return 20; // Ignore missing ID tome
			case "tbk":
				return 0; // Force TP tome check
			}
		}

		return tome.getStat(70);
	},

	identify: function () {
		var i, item, tome, scroll, npc, list, timer, tpTome, result,
			tpTomePos = {};

		this.cainID();

		list = Storage.Inventory.Compare(Config.Inventory);

		if (!list) {
			return false;
		}

		// Avoid unnecessary NPC visits
		for (i = 0; i < list.length; i += 1) {
			// Only unid items or sellable junk (low level) should trigger a NPC visit
			if ((!list[i].getFlag(0x10) || Config.LowGold > 0) && [-1, 4].indexOf(Pickit.checkItem(list[i]).result) > -1) {
				break;
			}
		}

		if (i === list.length) {
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
			result = Pickit.checkItem(item);

			if (item.location === 3 && this.ignoredItemTypes.indexOf(item.itemType) === -1) {
				switch (result.result) {
				// Items for gold, will sell magics, etc. w/o id, but at low levels
				// magics are often not worth iding.
				case 4:
					Misc.itemLogger("Sold", item);
					item.sell();

					break;
				case -1:
					if (tome) {
						this.identifyItem(item, tome);
					} else {
						scroll = npc.getItem("isc");

						if (scroll) {
							if (!Storage.Inventory.CanFit(scroll)) {
								tpTome = me.findItem("tbk", 0, 3);

								if (tpTome) {
									tpTomePos = {x: tpTome.x, y: tpTome.y};

									tpTome.sell();
									delay(500);
								}
							}

							delay(500);
							scroll.buy();
						}

						scroll = me.findItem("isc", 0, 3);

						if (!scroll) {
							break MainLoop;
						}

						this.identifyItem(item, scroll);
					}

					result = Pickit.checkItem(item);

					switch (result.result) {
					case 1:
						Misc.itemLogger("Kept", item);
						Misc.logItem("Kept", item, result.line);

						break;
					case -1:
					case 2:
					case 3: // just in case
						break;
					default:
						Misc.itemLogger("Sold", item);
						item.sell();

						timer = getTickCount() - this.sellTimer; // shop speedup test

						if (timer > 0 && timer < 500) {
							delay(timer);
						}

						break;
					}

					break;
				}
			}
		}

		this.fillTome("tbk"); // Check for TP tome in case it got sold for ID scrolls

		return true;
	},

	cainID: function () {
		if (!Config.CainID.Enable) {
			return false;
		}

		// Check if we're already in a shop. It would be pointless to go to Cain if so.
		var i, cain, unids, result,
			npc = getInteractedNPC();

		if (npc && npc.name.toLowerCase() === this.tasks[me.act - 1].Shop) {
			return false;
		}

		// Check if we may use Cain - minimum gold
		if (me.getStat(14) + me.getStat(15) < Config.CainID.MinGold) {
			//print("Can't use Cain - not enough gold.");

			return false;
		}

		me.cancel();
		this.stash(false);

		unids = this.getUnids();

		if (unids) {
			// Check if we may use Cain - number of unid items
			if (unids.length < Config.CainID.MinUnids) {
				//print("Can't use Cain - not enough unid items.");

				return false;
			}

			// Check if we may use Cain - kept unid items
			for (i = 0; i < unids.length; i += 1) {
				if (Pickit.checkItem(unids[i]).result > 0) {
					//print("Can't use Cain - can't id a valid item.");

					return false;
				}
			}

			cain = this.initNPC("CainID");

			if (!cain) {
				return false;
			}

			for (i = 0; i < unids.length; i += 1) {
				result = Pickit.checkItem(unids[i]);

				switch (result.result) {
				case 0:
					Misc.itemLogger("Dropped", unids[i]);
					unids[i].drop();

					break;
				case 1:
					Misc.itemLogger("Kept", unids[i]);
					Misc.logItem("Kept", unids[i], result.line);

					break;
				default:
					break;
				}
			}
		}

		return true;
	},

	fieldID: function () { // not exactly a town function but whateva
		var list, tome, item, result;

		list = this.getUnids();

		if (!list) {
			return false;
		}

		tome = me.findItem("ibk", 0, 3);

		if (!tome || tome.getStat(70) < list.length) {
			return false;
		}

		while (list.length > 0) {
			item = list.shift();
			result = Pickit.checkItem(item);

			if (result.result === -1) { // unid item that should be identified
				this.identifyItem(item, tome);
				delay(me.ping + 1);

				result = Pickit.checkItem(item);

				switch (result.result) {
				case 0:
					Misc.itemLogger("Dropped", item);
					item.drop();

					break;
				case 1:
					Misc.itemLogger("Field Kept", item);
					Misc.logItem("Field Kept", item, result.line);

					break;
				default:
					break;
				}
			}
		}

		delay(200);
		me.cancel();

		return true;
	},

	getUnids: function () {
		var list = [],
			item = me.getItem(-1, 0);

		if (!item) {
			return false;
		}

		do {
			if (item.location === 3 && !item.getFlag(0x10)) {
				list.push(copyUnit(item));
			}
		} while (item.getNext());

		if (!list.length) {
			return false;
		}

		return list;
	},

	identifyItem: function (unit, tome) {
		if (Config.PacketShopping) {
			return Packet.identifyItem(unit, tome);
		}

		var i, tick;

		if (!unit || unit.getFlag(0x10)) {
			return false;
		}

		this.sellTimer = getTickCount(); // shop speedup test

CursorLoop:
		for (i = 0; i < 3; i += 1) {
			clickItem(1, tome);

			tick = getTickCount();

			while (getTickCount() - tick < 500) {
				if (getCursorType() === 6) {
					break CursorLoop;
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
					delay(50);

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

		var i, item, result,
			items = [],
			npc = getInteractedNPC();

		if (!npc || !getUIFlag(0x0C) || !npc.itemcount) {
			return false;
		}

		item = npc.getItem();

		if (!item) {
			return false;
		}

		print("�c4MiniShopBot�c0: Scanning " + npc.itemcount + " items.");

		do {
			if (this.ignoredItemTypes.indexOf(item.itemType) === -1) {
				items.push(copyUnit(item));
			}
		} while (item.getNext());

		for (i = 0; i < items.length; i += 1) {
			result = Pickit.checkItem(items[i]);

			if (result.result === 1) {
				try {
					if (Storage.Inventory.CanFit(items[i]) && me.getStat(14) + me.getStat(15) >= items[i].getItemCost(0)) {
						Misc.itemLogger("Shopped", items[i]);
						Misc.logItem("Shopped", items[i], result.line);
						items[i].buy();
					}
				} catch (e) {
					print(e);
				}
			}

			delay(2);
		}

		return true;
	},

	gamble: function () {
		if (!this.needGamble() || !Config.GambleItems.length) {
			return true;
		}

		if (getUIFlag(0x0C)) {
			me.cancel(); // cancel trade screen so it doesn't buy certain sold items back from Jamella
		}

		var i, item, items, npc, newItem, result,
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

			item = npc.getItem();
			items = [];

			if (item) {
				do {
					if (Config.GambleItems.indexOf(item.classid) > -1) {
						items.push(copyUnit(item));
					}
				} while (item.getNext());

				for (i = 0; i < items.length; i += 1) {
					if (!Storage.Inventory.CanFit(items[i])) {
						return false;
					}

					items[i].buy(false, true);

					newItem = this.getGambledItem(list);

					if (newItem) {
						result = Pickit.checkItem(newItem);

						switch (result.result) {
						case 1:
							Misc.itemLogger("Gambled", newItem);
							Misc.logItem("Gambled", newItem, result.line);
							list.push(newItem.gid);

							break;
						case 2:
							list.push(newItem.gid);
							Cubing.buildLists();

							break;
						default:
							Misc.itemLogger("Sold", newItem);
							newItem.sell();
							delay(500);

							break;
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
		if (!this.wantKeys()) {
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

	checkKeys: function () {
		if (!Config.OpenChests || me.classid === 6) {
			return 12;
		}

		var key = me.findItem("key", 0, 3);

		if (key) {
			return key.getStat(70);
		}

		return 0;
	},

	needKeys: function () {
		return this.checkKeys() <= 0;
	},

	wantKeys: function () {
		return this.checkKeys() <= 6;
	},

	repair: function () {
		var i, quiver, myQuiver, npc, repairAction, bowCheck;

		repairAction = this.needRepair();

		if (!repairAction || !repairAction.length) {
			return true;
		}

		npc = this.initNPC("Repair");

		if (!npc) {
			return false;
		}

		for (i = 0; i < repairAction.length; i += 1) {
			switch (repairAction[i]) {
			case "repair":
				me.repair();

				break;
			case "buyQuiver":
				bowCheck = Attack.usingBow();

				if (bowCheck) {
					quiver = bowCheck === "bow" ? npc.getItem("aqv") : quiver = npc.getItem("cqv");

					if (quiver) {
						myQuiver = me.getItem(quiver.code, 1);

						if (myQuiver) {
							myQuiver.sell();
							delay(500);
						}

						quiver.buy();
					}
				}

				break;
			}
		}

		//this.shopItems();

		return true;
	},

	needRepair: function () {
		var i, durability, quantity, charge, quiver, bowCheck, item,
			repairAction = [],
			repairPercent = 40,
			canAfford = me.getStat(14) + me.getStat(15) >= me.getRepairCost();

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
				repairAction.push("buyQuiver");
			} else {
				quantity = quiver.getStat(70);

				if (typeof quantity === "number" && quantity * 100 / getBaseStat("items", quiver.classid, "maxstack") <= repairPercent) {
					repairAction.push("buyQuiver");
				}
			}
		}

		// Repair durability/quantity/charges
		if (canAfford) {
			item = me.getItem(-1, 1);

			if (item) {
RepairLoop:
				do {
					if (!item.getFlag(0x400000)) { // Skip ethereal items
						switch (item.itemType) {
						// Quantity check
						case 42: // Throwing knives
						case 43: // Throwing axes
						case 44: // Javelins
						case 87: // Amazon javelins
							quantity = item.getStat(70);

							if (typeof quantity === "number" && quantity * 100 / (getBaseStat("items", item.classid, "maxstack") + item.getStat(254)) <= repairPercent) { // Stat 254 = increased stack size
								repairAction.push("repair");

								break RepairLoop;
							}

							break;
						// Durability check
						default:
							durability = item.getStat(72);

							if (typeof durability === "number" && durability * 100 / item.getStat(73) <= repairPercent) {
								repairAction.push("repair");

								break RepairLoop;
							}

							break;
						}

						// Charged item check
						charge = item.getStat(-2)[204];

						if (typeof (charge) === "object") {
							if (charge instanceof Array) {
								for (i = 0; i < charge.length; i += 1) {
									if (charge[i] !== undefined && charge[i].hasOwnProperty("charges") && charge[i].charges * 100 / charge[i].maxcharges <= repairPercent) {
										repairAction.push("repair");

										break RepairLoop;
									}
								}
							} else if (charge.charges * 100 / charge.maxcharges <= repairPercent) {
								repairAction.push("repair");

								break RepairLoop;
							}
						}
					}
				} while (item.getNext());
			}
		} else {
			print("�c4Town: �c1Can't afford repairs.");
		}

		return repairAction;
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

MainLoop:
		for (i = 0; i < 3; i += 1) {
			Misc.useMenu(0x1507);

			tick = getTickCount();

			while (getTickCount() - tick < 2000) {
				if (me.getMerc()) {
					break MainLoop;
				}

				delay(200);
			}
		}

		delay(Math.max(750, me.ping * 2));
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

	stash: function (stashGold) {
		if (stashGold === undefined) {
			stashGold = true;
		}

		if (!this.needStash()) {
			return true;
		}

		me.cancel();

		var i, result,
			items = Storage.Inventory.Compare(Config.Inventory);

		if (items) {
			for (i = 0; i < items.length; i += 1) {
				if (this.ignoredItemTypes.indexOf(items[i].itemType) === -1 && Storage.Stash.CanFit(items[i])) {
					result = Pickit.checkItem(items[i]).result > 0 && Pickit.checkItem(items[i]).result < 4 ? "pickit" :
							Cubing.keepItem(items[i]) ? "cubing" :
									Runewords.keepItem(items[i]) ? "runewords" : false;

					if (result) {
						Misc.itemLogger("Stashed", items[i]);
						Storage.Stash.MoveTo(items[i]);
					}
				}
			}
		}

		// Stash gold
		if (stashGold) {
			if (me.getStat(14) >= Config.StashGold && me.getStat(15) < 25e5 && this.openStash()) {
				gold(me.getStat(14), 3);
				delay(1000);
				me.cancel();
			}
		}

		return true;
	},

	needStash: function () {
		if (Config.StashGold && me.getStat(14) >= Config.StashGold && me.getStat(15) < 25e5) {
			return true;
		}

		var i,
			items = Storage.Inventory.Compare(Config.Inventory);

		for (i = 0; i < items.length; i += 1) {
			if (Storage.Stash.CanFit(items[i])) {
				return true;
			}
		}

		return false;
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
			for (i = 0; i < 5; i += 1) {
				if (useTK) {
					Skill.cast(43, 0, stash);
				} else {
					Misc.click(0, 0, stash);
					//stash.interact();
				}

				tick = getTickCount();

				while (getTickCount() - tick < 1000) {
					if (getUIFlag(0x19)) {
						delay(200);

						return true;
					}

					delay(10);
				}

				if (i > 1) {
					Packet.flash(me.gid);
					this.move("waypoint");
					this.move("stash");
				}
			}
		}

		return false;
	},

	getCorpse: function () {
		var corpse, gid,
			corpseList = [],
			timer = getTickCount();

		corpse = getUnit(0, me.name, 17);

		if (!corpse) {
			return true;
		}

		do {
			if (getDistance(me.x, me.y, corpse.x, corpse.y) <= 20) {
				corpseList.push(copyUnit(corpse));
			}
		} while (corpse.getNext());

		while (corpseList.length > 0) {
			if (me.dead) {
				return false;
			}

			gid = corpseList[0].gid;

			Pather.moveToUnit(corpseList[0]);
			Misc.click(0, 0, corpseList[0]);
			delay(500);

			if (getTickCount() - timer > 3000) {
				Pather.moveTo(me.x + rand(-1, 1) * 4, me.y + rand(-1, 1) * 4);
			}

			if (getTickCount() - timer > 30000) {
				D2Bot.printToConsole("Failed to get corpse, stopping.", 9);
				D2Bot.stop();
			}

			if (!getUnit(0, -1, -1, gid)) {
				corpseList.shift();
			}
		}

		if (me.gametype === 0) {
			this.checkShard();
		}

		return true;
	},

	checkShard: function () {
		var shard,
			check = {left: false, right: false},
			item = me.getItem("bld", 0);

		if (item) {
			do {
				if (item.location === 3 && item.quality === 7) {
					shard = copyUnit(item);

					break;
				}
			} while (item.getNext());
		}

		if (!shard) {
			return true;
		}

		item = me.getItem(-1, 1);

		if (item) {
			do {
				if (item.bodylocation === 4) {
					check.right = true;
				}

				if (item.bodylocation === 5) {
					check.left = true;
				}
			} while (item.getNext());
		}

		if (!check.right) {
			shard.toCursor();

			while (me.itemoncursor) {
				clickItem(0, 4);
				delay(500);
			}
		} else if (!check.left) {
			shard.toCursor();

			while (me.itemoncursor) {
				clickItem(0, 5);
				delay(500);
			}
		}

		return true;
	},

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

	clearScrolls: function () {
		var i,
			items = me.getItems();

		for (i = 0; !!items && i < items.length; i += 1) {
			if (items[i].location === 3 && items[i].mode === 0 && items[i].itemType === 22) {
				Misc.itemLogger("Dropped", items[i]);
				items[i].drop();
			}
		}

		return true;
	},

	clearInventory: function () {
		var i, loseItemAction,
			dropAction = 0,
			sellAction = 1,
			item = me.getItem(-1, 0),
			items = [];

		if (item) {
			do {
				if (item.location === 3) {
					switch (item.itemType) {
					case 76:
						if (!Config.HPBuffer) {
							items.push(copyUnit(item));
						}

						break;
					case 77:
						if (!Config.MPBuffer) {
							items.push(copyUnit(item));
						}

						break;
					case 78:
						if (!Config.RejuvBuffer) {
							items.push(copyUnit(item));
						}

						break;
					}
				}
			} while (item.getNext());

			while (items.length) {
				items.shift().interact();
				delay(200);
			}
		}

		// Any leftover items from a failed ID (crashed game, disconnect etc.)
		items = Storage.Inventory.Compare(Config.Inventory);

		// If low on gold
		if (me.getStat(14) + me.getStat(15) < Config.LowGold) {
			this.initNPC("Shop");

			loseItemAction = sellAction;
		} else {
			loseItemAction = dropAction;
		}

		for (i = 0; !!items && i < items.length; i += 1) {
			if ([18, 41, 78].indexOf(items[i].itemType) === -1 &&
					items[i].classid !== 549 &&
					(items[i].code !== "tsc" || !!me.findItem("tbk", 0, 3)) &&
					(items[i].code !== "isc" || !!me.findItem("ibk", 0, 3)) &&
					(Pickit.checkItem(items[i]).result === 0 || Pickit.checkItem(items[i]).result === 4) &&
					!Cubing.keepItem(items[i]) &&
					!Runewords.keepItem(items[i])
					) {
				try {
					if (loseItemAction === sellAction) {
						Misc.itemLogger("Sold", items[i]);
						items[i].sell();
					} else {
						Misc.itemLogger("Dropped", items[i]);
						items[i].drop();
					}
				} catch (e) {
					print(e);
				}
			}
		}

		return true;
	},

	act : [{}, {}, {}, {}, {}],

	initialize: function () {
		//print("Initialize town " + me.act);

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
			this.act[0].spot[NPC.Kashya] = [fire[0] + 14, fire[1] - 4];
			this.act[0].spot[NPC.Akara] = [fire[0] + 56, fire[1] - 30];
			this.act[0].spot[NPC.Charsi] = [fire[0] - 39, fire[1] - 25];
			this.act[0].spot[NPC.Gheed] = [fire[0] - 34, fire[1] + 36];
			this.act[0].spot.portalspot = [fire[0] + 10, fire[1] + 18];
			this.act[0].spot.waypoint = [wp.roomx * 5 + wp.x, wp.roomy * 5 + wp.y];
			this.act[0].initialized = true;

			break;
		case 2:
			this.act[1].spot = {};
			this.act[1].spot[NPC.Fara] = [5124, 5082];
			this.act[1].spot.cain = [5124, 5082];
			this.act[1].spot[NPC.Lysander] = [5118, 5104];
			this.act[1].spot[NPC.Greiz] = [5033, 5053];
			this.act[1].spot[NPC.Elzix] = [5032, 5102];
			this.act[1].spot.palace = [5088, 5153];
			this.act[1].spot.sewers = [5221, 5181];
			this.act[1].spot.meshif = [5205, 5058];
			this.act[1].spot[NPC.Drognan] = [5097, 5035];
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
			this.act[2].spot[NPC.Hratli] = [5223, 5048, 5127, 5172];
			this.act[2].spot[NPC.Ormus] = [5129, 5093];
			this.act[2].spot[NPC.Asheara] = [5043, 5093];
			this.act[2].spot[NPC.Alkor] = [5083, 5016];
			this.act[2].spot.cain = [5148, 5066];
			this.act[2].spot.stash = [5144, 5059];
			this.act[2].spot.portalspot = [5150, 5063];
			this.act[2].spot.waypoint = [5158, 5050];
			this.act[2].initialized = true;

			break;
		case 4:
			this.act[3].spot = {};
			this.act[3].spot.cain = [5027, 5027];
			this.act[3].spot[NPC.Halbu] = [5089, 5031];
			this.act[3].spot[NPC.Tyrael] = [5027, 5027];
			this.act[3].spot[NPC.Jamella] = [5088, 5054];
			this.act[3].spot.stash = [5022, 5040];
			this.act[3].spot.portalspot = [5045, 5042];
			this.act[3].spot.waypoint = [5043, 5018];
			this.act[3].initialized = true;

			break;
		case 5:
			this.act[4].spot = {};
			this.act[4].spot.portalspot = [5098, 5019];
			this.act[4].spot.stash = [5129, 5061];
			this.act[4].spot[NPC.Larzuk] = [5141, 5045];
			this.act[4].spot[NPC.Malah] = [5078, 5029];
			this.act[4].spot.cain = [5119, 5061];
			this.act[4].spot[NPC["Qual-Kehk"]] = [5066, 5083];
			this.act[4].spot[NPC.Anya] = [5112, 5120];
			this.act[4].spot.portal = [5118, 5120];
			this.act[4].spot.waypoint = [5113, 5068];
			this.act[4].spot.nihlathak = [5071, 5111];
			this.act[4].initialized = true;

			break;
		}

		return true;
	},

	move: function (spot) {
		if (!me.inTown) {
			throw new Error("move: Not in town");
		}

		var i, townSpot, path,
			rval = false,
			useTK = me.classid === 1 && ((me.getSkill(43, 1) && ["stash", "portalspot"].indexOf(spot) > -1) || spot === "waypoint");

		if (!this.act[me.act - 1].initialized) {
			this.initialize();
		}

		if (typeof (this.act[me.act - 1].spot[spot]) === "object") {
			townSpot = this.act[me.act - 1].spot[spot];
		} else {
			return false;
		}

		// Act 5 wp->portalspot override - ActMap.cpp crash
		if (me.act === 5 && spot === "portalspot" && getDistance(me.x, me.y, 5113, 5068) <= 8) {
			path = [5113, 5068, 5108, 5051, 5106, 5046, 5104, 5041, 5102, 5027, 5098, 5018];

			for (i = 0; i < path.length; i += 2) {
				Pather.walkTo(path[i], path[i + 1]);
			}

			return true;
		}

		if (useTK) {
			if (getDistance(me.x, me.y, townSpot[0], townSpot[1]) > 14) {
				rval = Attack.getIntoPosition({x: townSpot[0], y: townSpot[1]}, 13, 0x4);
			}

			rval = true;
		} else {
			print("Townmove: " + spot + " from " + me.x + ", " + me.y);
			delay(100);

			for (i = 0; i < 3; i += 1) {
				rval = Pather.moveTo(townSpot[0], townSpot[1]);

				// If unit has more than one location and it's not here, search
				if (townSpot.length > 2 && !getUnit(1, spot)) {
					for (i = 0; i < townSpot.length / 2; i += 1) {
						rval = Pather.moveTo(townSpot[i * 2], townSpot[i * 2 + 1]);

						if (!!getUnit(1, spot)) {
							break;
						}
					}
				}

				if (rval) {
					break;
				}

				Packet.flash(me.gid);
			}
		}

		return rval;
	},

	goToTown: function (act) {
		var towns = [1, 40, 75, 103, 109];

		if (!me.inTown) {
			if (!Pather.makePortal()) {
				throw new Error("Town.goToTown: Failed to make TP");
			}

			if (!Pather.usePortal(null, me.name)) {
				throw new Error("Town.goToTown: Failed to take TP");
			}
		}

		if (act === undefined) {
			return true;
		}

		if (act < 1 || act > 5) {
			throw new Error("Town.goToTown: Invalid act");
		}

		if (act !== me.act && !Pather.useWaypoint(towns[act - 1])) {
			throw new Error("Town.goToTown: Failed to go to town");
		}

		return true;
	},

	visitTown: function () {
		if (me.inTown) {
			this.doChores();
			this.move("stash");

			return true;
		}

		var preArea = me.area,
			preAct = me.act;

		try { // not an essential function -> handle thrown errors
			this.goToTown();
		} catch (e) {
			return false;
		}

		this.doChores();

		if (me.act !== preAct) {
			this.goToTown(preAct);
		}

		this.move("portalspot");

		if (!Pather.usePortal(preArea, me.name)) { // this part is essential
			throw new Error("Town.visitTown: Failed to go back from town");
		}

		if (Config.PublicMode) {
			Pather.makePortal();
		}

		return true;
	}
};