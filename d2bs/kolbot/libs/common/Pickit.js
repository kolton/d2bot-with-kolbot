/**
*	@filename	Pickit.js
*	@author		kolton
*	@desc		handle item pickup
*/

var Pickit = {
	pickList: [],
	beltSize: 1,
	ignoreLog: [4, 5, 6, 22, 41, 76, 77, 78, 79, 80, 81], // Ignored item types for item logging

	init: function () {
		var i, filename;

		for (i = 0; i < Config.PickitFiles.length; i += 1) {
			filename = "pickit/" + Config.PickitFiles[i];

			NTIPOpenFile(filename);
		}

		this.beltSize = Storage.BeltSize();
	},

	// Returns:
	// -1 - Needs iding
	// 0 - Unwanted
	// 1 - NTIP wants
	// 2 - Cubing wants
	// 3 - Runeword wants
	// 4 - Pickup to sell (triggered when low on gold)
	checkItem: function (unit) {
		var rval = NTIPCheckItem(unit, false, true);

		if (Cubing.checkItem(unit)) {
			return {result: 2, line: null};
		}

		if (Runewords.checkItem(unit)) {
			return {result: 3, line: null};
		}

		// If total gold is less than 10k pick up anything worth 10 gold per
		// square to sell in town.
		if (me.getStat(14) + me.getStat(15) < Config.LowGold && rval.result === 0 && Town.ignoredItemTypes.indexOf(unit.itemType) === -1) {
			// Gold doesn't take up room, just pick it up
			if (unit.classid === 523) {
				return {result: 4, line: null};
			}

			if (unit.getItemCost(1) / (unit.sizex * unit.sizey) >= 10) {
				return {result: 4, line: null};
			}
		}

		return rval;
	},

	pickItems: function () {
		function ItemStats(unit) {
			this.itemType = unit.itemType;
			this.quality = unit.quality;
			this.classid = unit.classid;
			this.code = unit.code;
			this.name = unit.name;
			this.x = unit.x;
			this.y = unit.y;
			this.sizex = unit.sizex; // cache for CanFit
			this.sizey = unit.sizey;
			this.gid = unit.gid;
		}

		var status, gid, item, canFit, color;

		Town.clearBelt();

		while (!me.idle) {
			delay(40);
		}

		if (me.dead) {
			return false;
		}

		item = getUnit(4);
		this.pickList = [];

		if (item) {
			do {
				if ((item.mode === 3 || item.mode === 5) && getDistance(me, item) <= Config.PickRange) {
					this.pickList.push(new ItemStats(item));
				}
			} while (item.getNext());
		}

		this.pickList.sort(this.sortItems);

		while (this.pickList.length > 0) {
			gid = this.pickList[0].gid;

			if (gid) {
				item = getUnit(4, -1, -1, gid);

				if (item && (item.mode === 3 || item.mode === 5)) {
					status = this.checkItem(item);

					if (status.result && this.canPick(this.pickList[0])) {
						// Check room, don't check gold, scrolls and potions
						canFit = Storage.Inventory.CanFit(this.pickList[0]) || [4, 22, 76, 77, 78].indexOf(this.pickList[0].itemType) > -1;
						color = this.itemColor(this.pickList[0]);

						if (!canFit && Config.FieldID && Town.fieldID()) {
							canFit = Storage.Inventory.CanFit(this.pickList[0]) || [4, 22, 76, 77, 78].indexOf(this.pickList[0].itemType) > -1;
						}

						if (!canFit && this.canMakeRoom()) {
							print("ÿc7Trying to make room for " + color + this.pickList[0].name);

							if (!Town.visitTown()) {
								print("ÿc7Not enough room for " + color + this.pickList[0].name);

								return false;
							}

							canFit = Storage.Inventory.CanFit(this.pickList[0]) || [4, 22, 76, 77, 78].indexOf(this.pickList[0].itemType) > -1;
						}

						if (canFit) {
							this.pickItem(item, status.result, status.line);
						} else {
							print("ÿc7Not enough room for " + color + this.pickList[0].name);

							if (!!AutoMule.getMule()) {
								scriptBroadcast("mule");
								quit();
							}
						}
					}
				}
			}

			this.pickList.shift();
		}

		return true;
	},

	// check if we can even free up the inventory
	canMakeRoom: function () {
		var i,
			items = Storage.Inventory.Compare(Config.Inventory);

		if (items) {
			for (i = 0; i < items.length; i += 1) {
				switch (this.checkItem(items[i]).result) {
				case -1: // item needs to be identified
					return true;
				case 0:
					break;
				default: // check if a kept item can be stashed
					if (Storage.Stash.CanFit(items[i])) {
						return true;
					}
				}
			}
		}

		return false;
	},

	pickItem: function (unit, status, keptLine) {
		function ItemStats(unit) {
			this.type = unit.itemType;
			this.classid = unit.classid;
			this.name = unit.name;
			this.color = Pickit.itemColor(unit);
			this.gold = unit.getStat(14);
			this.useTk = me.classid === 1 && me.getSkill(43, 1) && (this.type === 4 || this.type === 22 || (this.type > 75 && this.type < 82)) &&
						getDistance(me, unit) > 5 && getDistance(me, unit) < 20 && !checkCollision(me, unit, 0x4);
			this.picked = false;
		}

		var i, item, tick, gid, stats;

		if (unit.gid) {
			gid = unit.gid;
			item = getUnit(4, -1, -1, gid);
		}

		if (!item) {
			return false;
		}

		stats = new ItemStats(item);

MainLoop:
		for (i = 0; i < 3; i += 1) {
			if (!getUnit(4, -1, -1, gid)) {
				break MainLoop;
			}

			if (me.dead) {
				return false;
			}

			while (!me.idle) {
				delay(40);
			}

			if (item.mode !== 3 && item.mode !== 5) {
				break MainLoop;
			}

			if (stats.useTk) {
				Skill.cast(43, 0, item);
			} else if (getDistance(me, item) < 4 || Pather.moveToUnit(item)) {
				item.interact();
			}

			tick = getTickCount();

			while (getTickCount() - tick < 1000) {
				item = copyUnit(item);

				if (stats.classid === 523) {
					if (!item.getStat(14) || item.getStat(14) < stats.gold) {
						print("ÿc7Picked up " + stats.color + (item.getStat(14) ? (item.getStat(14) - stats.gold) : stats.gold) + " " + stats.name);

						break MainLoop;
					}
				}

				if (item.mode !== 3 && item.mode !== 5) {
					switch (stats.classid) {
					case 529: // Scroll of Town Portal
					case 530: // Scroll of Identify
						print("ÿc7Picked up " + stats.color + stats.name + " ÿc7(" + Town.checkScrolls(stats.classid === 529 ? "tbk" : "ibk") + "/20)");

						break MainLoop;
					}

					break MainLoop;
				}

				delay(20);
			}

			//print("pick retry");
		}

		stats.picked = !!me.getItem(-1, -1, gid);

		if (stats.picked) {
			print("ÿc7Picked up " + stats.color + stats.name);
			DataFile.updateStats("lastArea");

			switch (status) {
			case 1:
				if (this.ignoreLog.indexOf(stats.type) === -1) {
					Misc.logItem("Kept", item, keptLine);
				}

				break;
			case 2:
				Cubing.update(stats.classid);

				break;
			case 3:
				Runewords.update(stats.classid, gid);

				break;
			}
		}

		return true;
	},

	itemColor: function (unit, type) {
		if (typeof type === "undefined") {
			type = true;
		}

		if (type) {
			switch (unit.itemType) {
			case 4: // gold
				return "ÿc4";
			case 74: // runes
				return "ÿc8";
			case 76: // healing potions
				return "ÿc1";
			case 77: // mana potions
				return "ÿc3";
			case 78: // juvs
				return "ÿc;";
			}
		}

		switch (unit.quality) {
		case 4: // magic
			return "ÿc3";
		case 5: // set
			return "ÿc2";
		case 6: // rare
			return "ÿc9";
		case 7: // unique
			return "ÿc4";
		case 8: // crafted
			return "ÿc8";
		}

		return "ÿc0";
	},

	sortItems: function (unitA, unitB) {
		// TODO: Add some kind of advanced sorting

		return getDistance(me, unitA) - getDistance(me, unitB);
	},

	canPick: function (unit) {
		var tome, charm, i, potion, needPots, buffers, pottype;

		switch (unit.itemType) {
		case 4: // Gold
			if (me.getStat(14) === me.getStat(12) * 10000) { // Check current gold vs max capacity (cLvl*10000)
				return false; // Skip gold if full
			}

			break;
		case 22: // Scroll
			tome = me.getItem(unit.classid - 11, 0); // 518 - Tome of Town Portal or 519 - Tome of Identify, mode 0 - inventory/stash

			if (tome) {
				do {
					if (tome.location === 3 && tome.getStat(70) === 20) { // In inventory, contains 20 scrolls
						return false; // Skip a scroll if its tome is full
					}
				} while (tome.getNext());
			} else {
				return false; // Don't pick scrolls if there's no tome
			}

			break;
		case 82: // Small Charm
		case 83: // Large Charm
		case 84: // Grand Charm
			if (unit.quality === 7) { // Unique
				charm = me.getItem(unit.classid, 0);

				if (charm) {
					do {
						if (charm.quality === 7) {
							return false; // Skip Gheed's Fortune, Hellfire Torch or Annihilus if we already have one
						}
					} while (charm.getNext());
				}
			}

			break;
		case 76: // Healing Potion
		case 77: // Mana Potion
		case 78: // Rejuvenation Potion
			needPots = 0;

			for (i = 0; i < 4; i += 1) {
				if (typeof unit.code === "string" && unit.code.indexOf(Config.BeltColumn[i]) > -1) {
					needPots += this.beltSize;
				}
			}

			potion = me.getItem(-1, 2);

			if (potion) {
				do {
					if (potion.itemType === unit.itemType) {
						needPots -= 1;
					}
				} while (potion.getNext());
			}

			if (needPots < 1 && this.checkBelt()) {
				buffers = ["HPBuffer", "MPBuffer", "RejuvBuffer"];

				for (i = 0; i < buffers.length; i += 1) {
					if (Config[buffers[i]]) {
						switch (buffers[i]) {
						case "HPBuffer":
							pottype = 76;

							break;
						case "MPBuffer":
							pottype = 77;

							break;
						case "RejuvBuffer":
							pottype = 78;

							break;
						}

						if (unit.itemType === pottype) {
							if (!Storage.Inventory.CanFit(unit)) {
								return false;
							}

							needPots = Config[buffers[i]];
							potion = me.getItem(-1, 0);

							if (potion) {
								do {
									if (potion.itemType === pottype && potion.location === 3) {
										needPots -= 1;
									}
								} while (potion.getNext());
							}
						}
					}
				}
			}

			if (needPots < 1) {
				return false;
			}

			break;
		case undefined: // Yes, it does happen
			print("undefined item (!?)");

			return false;
		}

		return true;
	},

	checkBelt: function () {
		var check = 0,
			item = me.getItem(-1, 2);

		if (item) {
			do {
				if (item.x < 4) {
					check += 1;
				}
			} while (item.getNext());
		}

		return check === 4;
	},

	fastPick: function () {
		var item, gid, status;

		while (gidList.length > 0) {
			gid = gidList.shift();
			item = getUnit(4, -1, -1, gid);

			if (item && (item.mode === 3 || item.mode === 5) && getDistance(me, item) <= Config.PickRange) {
				status = this.checkItem(item);

				if (status.result && this.canPick(item) && (Storage.Inventory.CanFit(item) || [4, 22, 76, 77, 78].indexOf(item.itemType) > -1)) {
					this.pickItem(item, status.result, status.line);
				}
			}
		}

		return true;
	}
};