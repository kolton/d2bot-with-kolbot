function ShopBot() {
	var npc, tickCount, town, wpArea, path, menuId,
		cycles = 0,
		cyclesText = new Text("Cycles in last minute:", 50, 260, 2, 1),
		title = new Text("kolbot shopbot", 50, 245, 2, 1),
		frequency = new Text("Valid item frequency:", 50, 275, 2, 1),
		totalCyclesText = new Text("Total cycles:", 50, 290, 2, 1),
		validItems = 0,
		leadRetry = 10,
		totalCycles = 0,
		leadTimeout = 30; // NPC move timeout in seconds

	this.mover = function (npc, path) {
		var i, j;

		for (i = 0; i < path.length; i += 2) {
			Pather.moveTo(path[i] - 3, path[i + 1] - 3);
			moveNPC(npc, path[i], path[i + 1]);

			for (j = 0; j < leadTimeout; j += 1) {
				while (npc.mode === 2) {
					delay(100);
				}

				if (getDistance(npc.x, npc.y, path[i], path[i + 1]) < 4) {
					break;
				}

				if (j > 0 && j % leadRetry === 0) {
					moveNPC(npc, path[i], path[i + 1]);
				}

				delay(1000);
			}

			if (j === leadTimeout) {
				return false;
			}
		}

		delay(1000);

		return true;
	};

	this.openMenu = function (npc) {
		if (npc.type !== 1) {
			throw new Error("Unit.openMenu: Must be used on NPCs.");
		}

		if (getUIFlag(0x08)) {
			return true;
		}

		var i, j;

		for (i = 0; i < 3; i += 1) {
			if (getDistance(me.x, me.y, npc.x, npc.y) > 5) {
				Pather.walkTo(npc.x, npc.y);
			}

			//npc.interact();
			sendPacket(1, 0x13, 4, 1, 4, npc.gid);

			for (j = 0; j < 20; j += 1) {
				if (j % 4 === 0) {
					me.cancel();
					delay(300);
					//npc.interact();
					sendPacket(1, 0x13, 4, 1, 4, npc.gid);
				}

				if (getUIFlag(0x08)) {
					return true;
				}

				delay(50);
			}
		}

		D2Bot.printToConsole("Failed to open NPC menu");

		return false;
	};

	this.shopItems = function (npc) {
		var i, item,
			items = [];

		if (!npc) {
			return false;
		}

		while (me.ping > 700) {
			delay(100);
		}

		for (i = 0; i < 10; i += 1) {
			delay(150);

			if (i % 2 === 0) {
				sendPacket(1, 0x38, 4, 1, 4, npc.gid, 4, 0);
			}

			if (npc.itemcount > 0) {
				//delay(200);

				break;
			}
		}

		item = npc.getItem();

		if (!item) {
			return false;
		}

		me.overhead(npc.itemcount + " items");

		do {
			if (Config.ShopBot.ScanIDs.length === 0 || Config.ShopBot.ScanIDs.indexOf(item.classid) > -1) {
				items.push(copyUnit(item));
			}
		} while (item.getNext());

		validItems += items.length;
		frequency.text = "Valid item frequency: " + ((validItems * 100 / totalCycles).toFixed(2).toString()) + " %";

		for (i = 0; i < items.length; i += 1) {
			//print("Scanning " + items[i].name);

			if (Storage.Inventory.CanFit(items[i]) &&
					Pickit.canPick(items[i]) &&
					me.getStat(14) + me.getStat(15) >= items[i].getItemCost(0) &&
					Pickit.checkItem(items[i]).result === 1
					) {
				D2Bot.printToConsole("Match found!", 7);
				delay(1000);

				if (npc.startTrade(menuId)) {
					Misc.logItem("Shopped", items[i]);
					items[i].buy();
				}
			}
		}

		return true;
	};

	this.useWp = function (area) {
		var i, unit;

		if (me.area === area) {
			return true;
		}

		unit = getUnit(2, "waypoint");

		if (!unit) {
			return false;
		}

		if (getUIFlag(0x08)) {
			me.cancel();
		}

		for (i = 0; i < 80; i += 1) {
			if (i % 20 === 0) {
				if (getDistance(me.x, me.y, unit.x, unit.y) > 5) {
					Pather.walkTo(unit.x, unit.y);
				}

				unit.interact(area);
			}

			delay(75);

			while (!me.area || !me.gameReady) {
				delay(20);
			}

			if (me.area === area) {
				return true;
			}
		}

		print("Failed to use WP");

		return false;
	};

	Town.doChores();

	switch (Config.ShopBot.ShopNPC.toLowerCase()) {
	case "fara":
		wpArea = 48;
		town = 40;
		path = [5112, 5094, 5092, 5096, 5078, 5098, 5070, 5085];
		menuId = "Repair";

		if (!Town.goToTown(2) || !Town.move(NPC.Fara)) {
			throw new Error("Failed to get to NPC");
		}

		npc = getUnit(1, NPC.Fara);

		break;
	case "elzix":
		wpArea = 48;
		town = 40;
		path = [5038, 5099, 5059, 5102, 5068, 5090, 5067, 5086];
		menuId = "Shop";

		if (!Town.goToTown(2) || !Town.move(NPC.Elzix)) {
			throw new Error("Failed to get to NPC");
		}

		npc = getUnit(1, NPC.Elzix);

		break;
	case "drognan":
		wpArea = 48;
		town = 40;
		path = [5093, 5049, 5088, 5060, 5093, 5079, 5078, 5087, 5070, 5085];
		menuId = "Shop";

		if (!Town.goToTown(2) || !Town.move(NPC.Drognan)) {
			throw new Error("Failed to get to NPC");
		}

		npc = getUnit(1, NPC.Drognan);

		break;
	case "ormus":
		wpArea = 101;
		town = 75;
		path = [5147, 5089, 5156, 5075, 5157, 5063, 5160, 5050];
		menuId = "Shop";

		if (!Town.goToTown(3) || !Town.move(NPC.Ormus)) {
			throw new Error("Failed to get to NPC");
		}

		npc = getUnit(1, NPC.Ormus);

		break;
	case "anya":
		wpArea = 129;
		town = 109;
		path = [5122, 5119, 5129, 5105, 5123, 5087, 5115, 5068];
		menuId = "Shop";

		if (!Town.goToTown(5) || !Town.move(NPC.Anya)) {
			throw new Error("Failed to get to NPC");
		}

		npc = getUnit(1, NPC.Anya);

		break;
	case "malah":
		wpArea = 113;
		town = 109;
		path = [5077, 5032, 5089, 5025, 5100, 5021, 5106, 5051, 5116, 5071];
		menuId = "Shop";

		if (!Town.goToTown(5) || !Town.move(NPC.Malah)) {
			throw new Error("Failed to get to NPC");
		}

		npc = getUnit(1, NPC.Malah);

		break;
	default:
		throw new Error("Invalid shopbot NPC.");
	}

	if (!npc) {
		throw new Error("Failed to find NPC.");
	}

	if (!this.mover(npc, path)) {
		throw new Error("Failed to move NPC");
	}

	Town.move("waypoint");

	tickCount = getTickCount();

	while (true) {
		if (getTickCount() - tickCount >= 60 * 1000) {
			cyclesText.text = "Cycles in last minute: " + cycles.toString();
			totalCyclesText.text = "Total cycles: " + totalCycles.toString();
			cycles = 0;
			tickCount = getTickCount();
		}

		if (me.area === town) {
			if (copyUnit(npc).x === undefined) {
				throw new Error("NPC unit reference lost");
			}

			if (this.openMenu(npc)) {
				this.shopItems(npc);
			}

			me.cancel();
		}

		if (me.area === town) {
			if (totalCycles === 0) {
				Pather.useWaypoint(wpArea, true);
			} else {
				this.useWp(wpArea);
			}
		}

		if (me.area === wpArea) {
			this.useWp(town);
		}

		cycles += 1;
		totalCycles += 1;

		delay(5);
	}

	return true;
}