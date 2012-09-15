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
				if (getDistance(npc.x, npc.y, path[i], path[i + 1]) < 2) {
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
			if (getDistance(me, npc) > 3) {
				Pather.moveToUnit(npc);
			}

			//npc.interact();
			sendPacket(1, 0x13, 4, 1, 4, npc.gid);

			for (j = 0; j < 40; j += 1) {
				if (j % 8 === 0) {
					me.cancel();
					delay(300);
					//npc.interact();
					sendPacket(1, 0x13, 4, 1, 4, npc.gid);
				}

				if (getUIFlag(0x08)) {
					return true;
				}

				delay(25);
			}
		}

		return false;
	},

	this.shopItems = function () {
		var i, items,
			npc = getInteractedNPC();

		if (!npc) {
			return false;
		}

		for (i = 0; i < 10; i += 1) {
			delay(150);

			if (i % 2 === 0) {
				//sendPacket(1, 0x2f, 4, 1, 4, npc.gid);
				sendPacket(1, 0x38, 4, 1, 4, npc.gid, 4, 0);
			}

			if (npc.itemcount > 0) {
				//delay(200);

				break;
			}
		}

		items = npc.getItems();

		if (!items || !items.length) {
			return false;
		}

		me.overhead(items.length + " items");

		for (i = 0; i < items.length; i += 1) {
			if (Config.ShopBot.ScanIDs.indexOf(items[i].classid) > -1) {
				//print("Scanning " + items[i].name);

				if (Pickit.checkItem(items[i]).result === 1) {
					try {
						if (Storage.Inventory.CanFit(items[i]) && me.getStat(14) + me.getStat(15) >= items[i].getItemCost(0)) {
							delay(1000);

							if (npc.startTrade()) {
								Misc.logItem("Shopped", items[i]);
								items[i].buy();
							}
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

			delay(75);

			if (me.area === area) {
				return true;
			}
		}

		return false;
	};

	Town.doChores();

	switch (Config.ShopBot.ShopNPC.toLowerCase()) {
	case "ormus":
		wpArea = 101;
		town = 75;
		path = [5147, 5089, 5156, 5075, 5157, 5063, 5160, 5050];

		if (!Town.goToTown(3) || !Town.move(NPC.Ormus)) {
			throw new Error("Failed to get to NPC");
		}

		npc = getUnit(1, NPC.Ormus);

		break;
	case "anya":
		wpArea = 129;
		town = 109;
		path = [5122, 5119, 5129, 5105, 5123, 5087, 5115, 5068];

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
			if (this.openMenu(npc)) {
				this.shopItems();
			}

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