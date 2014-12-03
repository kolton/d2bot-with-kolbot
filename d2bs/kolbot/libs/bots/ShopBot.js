function ShopBot() {
	var i, tickCount,
		cycles = 0,
		cyclesText = new Text("Cycles in last minute:", 50, 260, 2, 1),
		title = new Text("kolbot shopbot", 50, 245, 2, 1),
		frequency = new Text("Valid item frequency:", 50, 275, 2, 1),
		totalCyclesText = new Text("Total cycles:", 50, 290, 2, 1),
		validItems = 0,
		leadRetry = 10,
		totalCycles = 0,
		leadTimeout = 20; // NPC move timeout in seconds

	this.pickEntries = [];
	this.npcs = {};
	this.paths = {};

	this.buildPickList = function () {
		var i, nipfile, line, lines, info,
			filepath = "pickit/shopbot.nip",
			filename = filepath.substring(filepath.lastIndexOf("/") + 1, filepath.length);

		if (!FileTools.exists(filepath)) {
			Misc.errorReport("ÿc1NIP file doesn't exist: ÿc0" + filepath);

			return false;
		}

		try {
			nipfile = File.open(filepath, 0);
		} catch (fileError) {
			Misc.errorReport("ÿc1Failed to load NIP: ÿc0" + filename);
		}

		if (!nipfile) {
			return false;
		}

		lines = nipfile.readAllLines();

		nipfile.close();

		for (i = 0; i < lines.length; i += 1) {
			info = {
				line: i + 1,
				file: filename,
				string: lines[i]
			};

			line = NTIP.ParseLineInt(lines[i], info);

			if (line) {
				this.pickEntries.push(line);
			}
		}

		return true;
	};

	this.processPath = function (npc, path) {
		var i,
			cutIndex = 0,
			dist = 100;

		for (i = 0; i < path.length; i += 2) {
			if (getDistance(npc, path[i], path[i + 1]) < dist) {
				cutIndex = i;
				dist = getDistance(npc, path[i], path[i + 1]);
			}
		}

		return path.slice(cutIndex);
	};

	this.mover = function (npc, path) {
		var i, j;

		path = this.processPath(npc, path);

		if (path.length === 2 && getDistance(npc.x, npc.y, path[0], path[1]) < 4) {
			return true;
		}

		for (i = 0; i < path.length; i += 2) {
			if (i === path.length - 2) {
				Pather.moveTo(path[i] - 3, path[i + 1] - 3);
			} else {
				Pather.moveTo(path[i], path[i + 1]);
			}

			moveNPC(npc, path[i], path[i + 1]);

			for (j = 0; j < leadTimeout; j += 1) {
				while (npc.mode === 2) {
					delay(100);
				}

				if (getDistance(me, npc) < (i === path.length - 2 ? 8 : 5)) {
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

		var i, tick,
			interactedNPC = getInteractedNPC();

		if (interactedNPC && interactedNPC.name !== npc.name) {
			sendPacket(1, 0x30, 4, interactedNPC.type, 4, interactedNPC.gid);
			me.cancel();
		}

		if (getUIFlag(0x08)) {
			return true;
		}

		for (i = 0; i < 10; i += 1) {
			if (getDistance(me.x, me.y, npc.x, npc.y) > 5) {
				Pather.walkTo(npc.x, npc.y);
			}

			if (!getUIFlag(0x08)) {
				sendPacket(1, 0x13, 4, 1, 4, npc.gid);
				sendPacket(1, 0x2f, 4, 1, 4, npc.gid);
			}

			tick = getTickCount();

			while (getTickCount() - tick < Math.max(Math.round((i + 1) * 250 / (i / 3 + 1)), me.ping + 1)) {
				if (getUIFlag(0x08)) {
					//print("openMenu try: " + i);

					return true;
				}

				delay(10);
			}
		}

		me.cancel();

		return false;
	};

	this.shopItems = function (npc, menuId) {
		var i, item, items, bought;

		if (!Storage.Inventory.CanFit({sizex: 2, sizey: 4}) && AutoMule.getMuleItems().length > 0) {
			D2Bot.printToConsole("Mule triggered");
			scriptBroadcast("mule");
			scriptBroadcast("quit");

			return true;
		}

		if (!npc) {
			return false;
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

		items = [];

		do {
			if (Config.ShopBot.ScanIDs.indexOf(item.classid) > -1 || Config.ShopBot.ScanIDs.length === 0) {
				items.push(copyUnit(item));
			}
		} while (item.getNext());

		me.overhead(npc.itemcount + " items, " + items.length + " valid");

		validItems += items.length;
		frequency.text = "Valid base items / cycle: " + ((validItems / totalCycles).toFixed(2).toString());

		for (i = 0; i < items.length; i += 1) {
			if (Storage.Inventory.CanFit(items[i]) && Pickit.canPick(items[i]) &&
					me.gold >= items[i].getItemCost(0) &&
					NTIP.CheckItem(items[i], this.pickEntries)
					) {
				beep();
				D2Bot.printToConsole("Match found!", 7);
				delay(1000);

				if (npc.startTrade(menuId)) {
					Misc.logItem("Shopped", items[i]);
					items[i].buy();

					bought = true;
				}

				if (Config.ShopBot.QuitOnMatch) {
					scriptBroadcast("quit");
				}
			}
		}

		if (bought) {
			me.cancel();
			Town.stash();
		}

		return true;
	};

	this.useWp = function (area) {
		if (totalCycles === 0) {
			me.cancel();

			return Pather.useWaypoint(area, true);
		}

		var i, tick, unit, interactedNPC;

		if (me.area === area) {
			return true;
		}

		unit = getUnit(2, "waypoint");

		if (!unit) {
			return false;
		}

		if (getUIFlag(0x08)) {
			interactedNPC = getInteractedNPC();

			if (interactedNPC) {
				sendPacket(1, 0x30, 4, interactedNPC.type, 4, interactedNPC.gid);
			}

			me.cancel();
		}

		for (i = 0; i < 10; i += 1) {
			if (me.area === unit.area && getDistance(me, unit) > 5) {
				Pather.walkTo(unit.x, unit.y);
			}

			unit.interact(area);

			tick = getTickCount();

			while (getTickCount() - tick < Math.max(Math.round((i + 1) * 250 / (i / 3 + 1)), me.ping + 1)) {
				if (me.area === area) {
					return true;
				}

				delay(10);
			}
		}

		return false;
	};

	this.shopAtNPC = function (name) {
		var i, path, npc, menuId, wp, temp;

		switch (name) {
		case "akara":
		case "charsi":
			if (me.inTown) {
				if (!Town.goToTown(1)) {
					break;
				}
			} else {
				if (!this.useWp(1)) {
					break;
				}
			}

			npc = this.npcs[name] || getUnit(1, name);

			if (!npc) {
				Town.move(name);

				npc = getUnit(1, name);
			}

			if (!npc) {
				Town.move("waypoint");

				npc = getUnit(1, name);
			}

			if (!npc) {
				break;
			}

			if (!this.npcs[name]) {
				this.npcs[name] = copyUnit(npc);
			}

			if (!this.paths[name]) {
				if (!getUnit(2, "waypoint")) {
					Town.move("waypoint");
				}

				wp = getUnit(2, "waypoint");
				wp = {x: wp.x, y: wp.y};

				Town.move(name);

				path = getPath(me.area, npc.x, npc.y, wp.x + 2, wp.y + 2, 0, 8);
				this.paths[name] = [];

				for (i = 0; i < path.length; i += 1) {
					temp = Pather.getNearestWalkable(path[i].x, path[i].y, 5, 1, 0x1 | 0x400, 4);

					if (temp) {
						this.paths[name] = this.paths[name].concat(temp);
					} else {
						this.paths[name].push(path[i].x);
						this.paths[name].push(path[i].y);
					}
				}
			}

			path = this.paths[name];
			menuId = "Shop";

			break;
		case "elzix":
			if (me.inTown) {
				if (!Town.goToTown(2)) {
					break;
				}
			} else {
				if (!this.useWp(40)) {
					break;
				}
			}

			npc = this.npcs[name] || getUnit(1, NPC.Elzix);

			if (!npc) {
				Town.move(NPC.Elzix);

				npc = getUnit(1, NPC.Elzix);
			}

			if (!npc) {
				Town.move("waypoint");

				npc = getUnit(1, NPC.Elzix);
			}

			if (!npc) {
				break;
			}

			if (!this.npcs[name]) {
				this.npcs[name] = copyUnit(npc);
			}

			path = [5038, 5099, 5059, 5102, 5068, 5090, 5067, 5086];
			menuId = "Shop";

			break;
		case "fara":
			if (me.inTown) {
				if (!Town.goToTown(2)) {
					break;
				}
			} else {
				if (!this.useWp(40)) {
					break;
				}
			}

			npc = this.npcs[name] || getUnit(1, NPC.Fara);

			if (!npc) {
				Town.move(NPC.Fara);

				npc = getUnit(1, NPC.Fara);
			}

			if (!npc) {
				Town.move("waypoint");

				npc = getUnit(1, NPC.Fara);
			}

			if (!npc) {
				break;
			}

			if (!this.npcs[name]) {
				this.npcs[name] = copyUnit(npc);
			}

			path = [5112, 5094, 5092, 5096, 5078, 5098, 5070, 5085];
			menuId = "Repair";

			break;
		case "drognan":
			if (me.inTown) {
				if (!Town.goToTown(2)) {
					break;
				}
			} else {
				if (!this.useWp(40)) {
					break;
				}
			}

			npc = this.npcs[name] || getUnit(1, NPC.Drognan);

			if (!npc) {
				Town.move(NPC.Drognan);

				npc = getUnit(1, NPC.Drognan);
			}

			if (!npc) {
				Town.move("waypoint");

				npc = getUnit(1, NPC.Drognan);
			}

			if (!npc) {
				break;
			}

			if (!this.npcs[name]) {
				this.npcs[name] = copyUnit(npc);
			}

			path = [5093, 5049, 5088, 5060, 5093, 5079, 5078, 5087, 5070, 5085];
			menuId = "Shop";

			break;
		case "ormus":
			if (me.inTown) {
				if (!Town.goToTown(3)) {
					break;
				}
			} else {
				if (!this.useWp(75)) {
					break;
				}
			}

			npc = this.npcs[name] || getUnit(1, NPC.Ormus);

			if (!npc) {
				Town.move(NPC.Ormus);

				npc = getUnit(1, NPC.Ormus);
			}

			if (!npc) {
				Town.move("waypoint");

				npc = getUnit(1, NPC.Ormus);
			}

			if (!npc) {
				break;
			}

			if (!this.npcs[name]) {
				this.npcs[name] = copyUnit(npc);
			}

			path = [5135, 5093, 5147, 5089, 5156, 5075, 5157, 5063, 5160, 5050];
			menuId = "Shop";

			break;
		case "asheara":
			if (me.inTown) {
				if (!Town.goToTown(3)) {
					break;
				}
			} else {
				if (!this.useWp(75)) {
					break;
				}
			}

			npc = this.npcs[name] || getUnit(1, NPC.Asheara);

			if (!npc) {
				Town.move(NPC.Asheara);

				npc = getUnit(1, NPC.Asheara);
			}

			if (!npc) {
				Town.move("waypoint");

				npc = getUnit(1, NPC.Asheara);
			}

			if (!npc) {
				break;
			}

			if (!this.npcs[name]) {
				this.npcs[name] = copyUnit(npc);
			}

			path = [5049, 5093, 5067, 5092, 5084, 5093, 5110, 5093, 5132, 5093, 5147, 5086, 5154, 5070, 5160, 5049];
			menuId = "Shop";

			break;
		case "anya":
			if (me.inTown) {
				if (!Town.goToTown(5)) {
					break;
				}
			} else {
				if (!this.useWp(109)) {
					break;
				}
			}

			npc = this.npcs[name] || getUnit(1, NPC.Anya);

			if (!npc) {
				Town.move(NPC.Anya);

				npc = getUnit(1, NPC.Anya);
			}

			if (!npc) {
				Town.move("waypoint");

				npc = getUnit(1, NPC.Anya);
			}

			if (!npc) {
				break;
			}

			if (!this.npcs[name]) {
				this.npcs[name] = copyUnit(npc);
			}

			path = [5122, 5119, 5129, 5105, 5123, 5087, 5115, 5070];
			menuId = "Shop";

			break;
		default:
			throw new Error("Invalid NPC");
		}

		if (npc) {
			if (!this.mover(npc, path)) {
				return false;
			}

			if (Config.ShopBot.CycleDelay) {
				delay(Config.ShopBot.CycleDelay);
			}

			if (this.openMenu(npc)) {
				this.shopItems(npc, menuId);
			}
		}

		return true;
	};

	// START
	for (i = 0; i < Config.ShopBot.ScanIDs.length; i += 1) {
		if (isNaN(Config.ShopBot.ScanIDs[i])) {
			if (NTIPAliasClassID.hasOwnProperty(Config.ShopBot.ScanIDs[i].replace(/\s+/g, "").toLowerCase())) {
				Config.ShopBot.ScanIDs[i] = NTIPAliasClassID[Config.ShopBot.ScanIDs[i].replace(/\s+/g, "").toLowerCase()];
			} else {
				Misc.errorReport("ÿc1Invalid ShopBot entry:ÿc0 " + Config.ShopBot.ScanIDs[i]);
				Config.ShopBot.ScanIDs.splice(i, 1);

				i -= 1;
			}
		}
	}

	if (typeof Config.ShopBot.ShopNPC === "string") {
		Config.ShopBot.ShopNPC = [Config.ShopBot.ShopNPC];
	}

	for (i = 0; i < Config.ShopBot.ShopNPC.length; i += 1) {
		Config.ShopBot.ShopNPC[i] = Config.ShopBot.ShopNPC[i].toLowerCase();
	}

	if (Config.ShopBot.MinGold && me.getStat(14) + me.getStat(15) < Config.ShopBot.MinGold) {
		return true;
	}

	this.buildPickList();
	print("Shopbot: Pickit entries: " + this.pickEntries.length);
	Town.doChores();

	tickCount = getTickCount();

	while (!Config.ShopBot.Cycles || totalCycles < Config.ShopBot.Cycles) {
		if (getTickCount() - tickCount >= 60 * 1000) {
			cyclesText.text = "Cycles in last minute: " + cycles.toString();
			totalCyclesText.text = "Total cycles: " + totalCycles.toString();
			cycles = 0;
			tickCount = getTickCount();
		}

		for (i = 0; i < Config.ShopBot.ShopNPC.length; i += 1) {
			this.shopAtNPC(Config.ShopBot.ShopNPC[i]);
		}

		if (me.inTown) {
			this.useWp([35, 48, 101, 107, 113][me.act - 1]);
		}

		cycles += 1;
		totalCycles += 1;
	}

	return true;
}