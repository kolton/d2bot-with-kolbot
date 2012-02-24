var Pickit = {
	range: 40,
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

	checkItem: function (unit) {
		var result = NTIPCheckItem(unit);

		if (Cubing.checkItem(unit)) {
			return 2;
		}

		if (Runewords.checkItem(unit)) {
			return 3;
		}

		return result;
	},

	pickItems: function () {
		Town.clearBelt();

		while (!me.idle) {
			delay(40);
		}

		var gid, checkedItem, status,
			item = getUnit(4);

		this.pickList = [];

		if (item) {
			do {
				if ((item.mode === 3 || item.mode === 5) && getDistance(me, item) <= this.range) {
					this.pickList.push(copyUnit(item));
				}
			} while (item.getNext());
		}

		this.pickList.sort(this.sortItems);

		while (this.pickList.length > 0) {
			item = this.pickList.shift();

			if (!item) {
				continue;
			}

			status = this.checkItem(item);

			if (!status) {
				continue;
			}

			if (!this.canPick(item)) {
				continue;
			}

			// Check room, don't check gold, scrolls and potions
			if (!Storage.Inventory.CanFit(item) && [4, 22, 76, 77, 78].indexOf(item.itemType) === -1) {
				print("ÿc7Trying to make room for " + item.name);

				if (!Town.visitTown()) {
					print("ÿc7Not enough room for " + item.name);
					return;
				}

				if (!Storage.Inventory.CanFit(item)) {
					print("ÿc7Not enough room for " + item.name);
					continue;
				}
			}

			this.pickItem(item, status);
		}
	},

	pickItem: function (unit, status) {
		var i, picked, tick,
			classid = unit.classid,
			gid = unit.gid,
			name = unit.name,
			type = unit.itemType,
			color = this.itemColor(unit),
			gold = unit.getStat(14),
			// TODO: Add config option for Telekinesis
			useTk = me.classid === 1 && me.getSkill(43, 1) && (type === 4 || type === 22 || (type > 75 && type < 82)) && getDistance(me, unit) > 5 && getDistance(me, unit) < 20 && !checkCollision(me, unit, 0x4);

MainLoop: for (i = 0; i < 3; i += 1) {
			while (!me.idle) {
				delay(40);
			}

			if (unit.mode !== 3 && unit.mode !== 5) {
				break MainLoop;
			}

			if (useTk) {
				Skill.cast(43, 0, unit);
			} else if (getDistance(me, unit) < 4 || Pather.moveToUnit(unit)) {
				unit.interact();
			}

			tick = getTickCount();

			while (getTickCount() - tick < 750) {
				unit = copyUnit(unit);

				if (classid === 523) {
					if (!unit.getStat(14) || unit.getStat(14) < gold) {
						print("ÿc7Picked up " + color + gold + " " + name);

						break MainLoop;
					}
				}

				if (unit.mode !== 3 && unit.mode !== 5) {
					switch (classid) {
					case 529: // Scroll of Town Portal
					case 530: // Scroll of Identify
						print("ÿc7Picked up " + color + name + " ÿc7(" + Town.checkScrolls(classid === 529 ? "tbk" : "ibk") + "/20)");

						break MainLoop;
					}

					if (unit.getParent() && unit.getParent().name === me.name) {
						picked = true;
					}

					break MainLoop;
				}

				delay(10);
			}

			print("pick retry");
		}

		if (picked) {
			print("ÿc7Picked up " + color + name);

			DataFile.updateStats("lastArea", getArea().name);

			switch (status) {
			case 1:
				if (this.ignoreLog.indexOf(type) === -1) {
					//D2Bot.printToItemLog("Kept " + name);
					Misc.logItem("Kept", unit);
				}

				break;
			case 2:
				Cubing.update(classid);
				break;
			case 3:
				Runewords.update(classid, gid);
				break;
			}
		}

		return true;
	},

	itemColor: function (unit) {
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
		var tome, charm, i, potion, needPots;

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
				// TODO: Change variable
				if (unit.code.indexOf(Config.BeltColumn[i]) > -1) {
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

			if (needPots < 1) {
				// For juvs in inventory
				// TODO: Change var
				if (Config.RejuvBuffer && unit.itemType === 78) {
					if (!Storage.Inventory.CanFit(unit)) {
						return false;
					}

					needPots = Config.RejuvBuffer;
					potion = me.getItem(-1, 0);

					if (potion) {
						do {
							if (potion.itemType === 78 && potion.location === 3) {
								needPots -= 1;
							}
						} while (potion.getNext());
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
	}
};