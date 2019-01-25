/**
*	@filename	Crafting.js
*	@author		kolton
*	@desc		Part of CraftingSystem
*/

var info,
	gameRequest = false;

function Crafting() {
	var i, npcName, num;

	info = CraftingSystem.getInfo();

	if (!info || !info.worker) {
		throw new Error("Bad Crafting System config.");
	}

	me.maxgametime = 0;
	Town.goToTown(1);
	Town.doChores();
	Town.move("stash");
	updateInfo();
	pickItems();

	addEventListener('copydata',
		function (mode, msg) {
			var i, obj, rval;

			if (mode === 0) {
				try {
					obj = JSON.parse(msg);
				} catch (e) {
					return false;
				}

				if (obj) {
					switch (obj.name) {
					case "GetGame":
						if (info.Collectors.indexOf(obj.profile) > -1) {
							print("GetGame: " + obj.profile);
							sendCopyData(null, obj.profile, 4, me.gamename + "/" + me.gamepassword);

							gameRequest = true;
						}

						break;
					case "GetSetInfo":
						if (info.Collectors.indexOf(obj.profile) > -1) {
							print("GetSetInfo: " + obj.profile);

							rval = [];

							for (i = 0; i < info.Sets.length; i += 1) {
								rval.push(info.Sets[i].Enabled ? 1 : 0);
							}

							print(rval);

							sendCopyData(null, obj.profile, 4, JSON.stringify({name: "SetInfo", value: rval}));
						}

						break;
					}
				}
			}

			return true;
		});

	for (i = 0; i < Cubing.recipes.length; i += 1) {
		Cubing.recipes[i].Level = 0;
	}

	while (true) {
		for (i = 0; i < info.Sets.length; i += 1) {
			switch (info.Sets[i].Type) {
			case "crafting":
				num = 0;
				npcName = getNPCName(info.Sets[i].BaseItems);

				if (npcName) {
					num = countItems(info.Sets[i].BaseItems, 4);

					if (num < info.Sets[i].SetAmount) {
						shopStuff(npcName, info.Sets[i].BaseItems, info.Sets[i].SetAmount);
					}
				}

				break;
			case "cubing": // Nothing to do currently
				break;
			case "runewords": // Nothing to do currently
				break;
			}
		}

		if (me.act !== 1) {
			Town.goToTown(1);
			Town.move("stash");
		}

		if (gameRequest) {
			for (i = 0; i < 10; i += 1) {
				if (othersInGame()) {
					while (othersInGame()) {
						delay(200);
					}

					break;
				} else {
					break;
				}

				delay(1000);
			}

			gameRequest = false;
		}

		pickItems();
		Cubing.update();
		Runewords.buildLists();
		Cubing.doCubing();
		Runewords.makeRunewords();
		delay(2000);
	}
}

function getNPCName(idList) {
	var i;

	for (i = 0; i < idList.length; i += 1) {
		switch (idList[i]) {
		case 345: // Light Belt
		case 391: // Sharkskin Belt
			return "elzix";
		case 346: // Belt
		case 392: // Mesh Belt
		case 342: // Light Plated Boots
		case 388: // Battle Boots
			return "fara";
		}
	}

	return false;
}

function othersInGame() {
	var p = getParty();

	if (p) {
		do {
			if (p.name !== me.name) {
				return true;
			}
		} while (p.getNext());
	}

	return false;
}

function countItems(idList, quality) {
	var item,
		count = 0;

	item = me.getItem(-1, 0);

	if (item) {
		do {
			if (idList.indexOf(item.classid) > -1 && item.quality === quality) {
				count += 1;
			}
		} while (item.getNext());
	}

	return count;
}

function updateInfo() {
	var i, j, items;

	if (info) {
		items = me.findItems(-1, 0);

		for (i = 0; i < info.Sets.length; i += 1) {
MainSwitch:
			switch (info.Sets[i].Type) {
			// Always enable crafting because the base can be shopped
			// Recipes with bases that can't be shopped don't need to be used with CraftingSystem
			case "crafting":
				info.Sets[i].Enabled = true;

				break;
			// Enable only if we have a viable item to cube
			// Currently the base needs to be added manually to the crafter
			case "cubing":
				if (!items) {
					items = [];
				}

				// Enable the recipe if we have an item that matches both bases list and Cubing list
				// This is not a perfect check, it might not handle every case
				for (j = 0; j < items.length; j += 1) {
					if (info.Sets[i].BaseItems.indexOf(items[j].classid) > -1 && // Item is on the bases list
							AutoMule.cubingIngredient(items[j])) { // Item is a valid Cubing ingredient
						print("Base found: " + items[j].classid);

						info.Sets[i].Enabled = true;

						break MainSwitch;
					}
				}

				info.Sets[i].Enabled = false;

				break;
			// Enable only if we have a viable runeword base
			// Currently the base needs to be added manually to the crafter
			case "runewords":
				if (!items) {
					items = [];
				}

				// Enable the recipe if we have an item that matches both bases list and Cubing list
				// This is not a perfect check, it might not handle every case
				for (j = 0; j < items.length; j += 1) {
					if (info.Sets[i].BaseItems.indexOf(items[j].classid) > -1 && // Item is on the bases list
							runewordIngredient(items[j])) { // Item is a valid Runeword ingredient
						print("Base found: " + items[j].classid);

						info.Sets[i].Enabled = true;

						break MainSwitch;
					}
				}

				info.Sets[i].Enabled = false;

				break;
			}
		}

		return true;
	}

	return false;
}

function runewordIngredient(item) {
	if (Runewords.validGids.indexOf(item.gid) > -1) {
		return true;
	}

	var i, base, baseGids;

	baseGids = [];

	for (i = 0; i < Config.Runewords.length; i += 1) {
		base = Runewords.getBase(Config.Runewords[i][0], Config.Runewords[i][1], (Config.Runewords[i][2]||0)) || Runewords.getBase(Config.Runewords[i][0], Config.Runewords[i][1], (Config.Runewords[i][2]||0), true);

		if (base) {
			baseGids.push(base.gid);
		}
	}

	if (baseGids.indexOf(item.gid) > -1) {
		return true;
	}

	return false;
}

function pickItems() {
	var items = [],
		item = getUnit(4, -1, 3);

	if (item) {
		updateInfo();

		do {
			if (checkItem(item) || item.classid === 523 || Pickit.checkItem(item).result > 0) {
				items.push(copyUnit(item));
			}
		} while (item.getNext());
	}

	while (items.length) {
		if (Pickit.canPick(items[0]) && Storage.Inventory.CanFit(items[0])) {
			Pickit.pickItem(items[0]);
		}

		items.shift();
		delay(1);
	}

	Town.stash();
}

function checkItem(item) {
	var i;

	for (i = 0; i < info.Sets.length; i += 1) {
		if (info.Sets[i].Enabled) {
			switch (info.Sets[i].Type) {
			case "crafting":
				// Magic item
				if (item.quality === 4 && info.Sets[i].BaseItems.indexOf(item.classid) > -1) {
					return true; // Valid crafting base
				}

				if (info.Sets[i].Ingredients.indexOf(item.classid) > -1) {
					return true; // Valid crafting ingredient
				}

				break;
			case "cubing":
				// There is no base check, item has to be put manually on the character

				if (info.Sets[i].Ingredients.indexOf(item.classid) > -1) {
					return true;
				}

				break;
			case "runewords":
				// There is no base check, item has to be put manually on the character

				if (info.Sets[i].Ingredients.indexOf(item.classid) > -1) {
					return true;
				}

				break;
			}
		}
	}

	return false;
}

function shopStuff(npcId, classids, amount) {
	print("shopStuff: " + npcId + " " + amount);

	var wpArea, town, path, menuId, npc, tickCount,
		leadTimeout = 30,
		leadRetry = 3;

	this.mover = function (npc, path) {
		var i, j;

		path = this.processPath(npc, path);

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

	this.shopItems = function (classids, amount) {
		var i, items,
			num = 0,
			npc = getInteractedNPC();

		if (npc) {
			items = npc.getItems();

			if (items) {
				for (i = 0; i < items.length; i += 1) {
					if (Storage.Inventory.CanFit(items[i]) &&
							Pickit.canPick(items[i]) &&
							me.getStat(14) + me.getStat(15) >= items[i].getItemCost(0) &&
							classids.indexOf(items[i].classid) > -1) {

						//print("Bought " + items[i].name);
						items[i].buy();

						num = countItems(classids, 4);

						if (num >= amount) {
							return true;
						}
					}
				}
			}
		}

		return gameRequest;
	};

	Town.doChores();

	switch (npcId.toLowerCase()) {
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

		Town.goToTown(2);

		if (!getUnit(1, NPC.Elzix)) {
			Town.move(NPC.Elzix);
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
		if (me.area === town) {
			if (npc.startTrade(menuId)) {
				if (this.shopItems(classids, amount)) {
					return true;
				}
			}

			me.cancel();
		}

		if (me.area === town) {
			Pather.useWaypoint(wpArea);
		}

		if (me.area === wpArea) {
			Pather.useWaypoint(town);
		}

		delay(5);
	}

	return true;
}