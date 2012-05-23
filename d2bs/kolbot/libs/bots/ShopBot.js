function ShopBot() {
	var npc, tickCount, town, wpArea, path,
		cycles = 0,
		cyclesText = new Text("Cycles in last minute: " + cycles, 50, 260, 2, 1),
		leadRetry = 10,
		leadTimeout = 20; // NPC move timeout in seconds

	this.mover = function (npc, path) {
		var i, j;

		for (i = 0; i < path.length; i += 2) {
			Pather.moveTo(path[i] - 3, path[i + 1] - 3);

			moveNPC(npc, path[i], path[i + 1]);

			for (j = 0; j < leadTimeout; j += 1) {
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

	this.shopItems = function () {
		var i, items,
			npc = getInteractedNPC();

		if (!npc) {
			return false;
		}

		items = npc.getItems();

		if (!items || !items.length) {
			return false;
		}

		for (i = 0; i < items.length; i += 1) {
			if (Config.ShopBot.ScanIDs.indexOf(items[i].classid) > -1) {
				//print("Scanning " + items[i].name);

				if (Pickit.checkItem(items[i]) === 1) {
					try {
						if (Storage.Inventory.CanFit(items[i]) && me.getStat(14) + me.getStat(15) >= items[i].getItemCost(0)) {
							Misc.logItem("Shopped", items[i]);
							items[i].buy();
						}
					} catch (e) {
						print(e);
					}
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

		unit = getUnit(2, "Waypoint");

		if (!unit) {
			return false;
		}

		if (me.inTown) {
			me.cancel();
		}

		for (i = 0; i < 80; i += 1) {
			if (i % 20 === 0) {
				if (getDistance(me, unit) > 5) {
					Pather.moveToUnit(unit);
				}

				unit.interact(area);
			}

			delay(100);

			if (me.area === area) {
				return true;
			}
		}

		return false;
	};

	Town.doChores();

	switch (Config.ShopBot.ShopNPC.toLowerCase()) {
	case "anya":
		wpArea = 129;
		town = 109;
		path = [5122, 5119, 5129, 5105, 5123, 5087, 5115, 5070];

		if (!Town.goToTown(5) || !Town.move(NPC.Anya)) {
			throw new Error("Failed to get to NPC");
		}

		npc = getUnit(1, NPC.Anya);

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
			cyclesText.text = "Cycles in last minute: " + cycles;
			tickCount = getTickCount();
			cycles = 0;
		}

		if (me.area === town) {
			npc.startTrade();
			this.shopItems();
			me.cancel();
		}

		if (me.area === town) {
			this.useWp(wpArea);
		}

		if (me.area === wpArea) {
			this.useWp(town);
		}

		cycles += 1;
	}

	return true;
}