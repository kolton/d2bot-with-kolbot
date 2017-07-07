/**
*	@filename	Pickit.js
*	@author		kolton
*	@desc		handle item pickup
*/

if (!isIncluded("common/Enums.js")) { include("common/Enums.js"); };

var Pickit = {
	gidList: [],
	beltSize: 1,
    ignoreLog: [NTItemTypes.gold, NTItemTypes.bowquiver, NTItemTypes.crossbowquiver, NTItemTypes.scroll, NTItemTypes.key, NTItemTypes.healingpotion, NTItemTypes.manapotion, NTItemTypes.rejuvpotion, NTItemTypes.staminapotion,
        NTItemTypes.antidotepotion, NTItemTypes.thawingpotion], // Ignored item types for item logging

	init: function (notify) {
		var i, filename;

		for (i = 0; i < Config.PickitFiles.length; i += 1) {
			filename = "pickit/" + Config.PickitFiles[i];

			NTIP.OpenFile(filename, notify);
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
		var rval = NTIP.CheckItem(unit, false, true);

        if ((unit.classid === ItemClassIds.Ral_Rune || unit.classid === ItemClassIds.Ort_Rune) && Town.repairIngredientCheck(unit)) {
			return {
				result: 6,
				line: null
			};
		}

		if (CraftingSystem.checkItem(unit)) {
			return {
				result: 5,
				line: null
			};
		}

		if (Cubing.checkItem(unit)) {
			return {
				result: 2,
				line: null
			};
		}

		if (Runewords.checkItem(unit)) {
			return {
				result: 3,
				line: null
			};
		}

		// If total gold is less than 10k pick up anything worth 10 gold per
		// square to sell in town.
        if (rval.result === 0 && Town.ignoredItemTypes.indexOf(unit.itemType) === -1 && me.gold < Config.LowGold && unit.itemType !== NTItemTypes.quest) {
            // Gold doesn't take up room, just pick it up
            if (unit.classid === ItemClassIds.Gold) {
				return {
					result: 4,
					line: null
				};
			}

			if (unit.getItemCost(1) / (unit.sizex * unit.sizey) >= 10) {
				return {
					result: 4,
					line: null
				};
			}
		}

		return rval;
	},

	pickItems: function () {
		var status, item, canFit,
			needMule = false,
			pickList = [];

		Town.clearBelt();

		if (me.dead) {
			return false;
		}

		while (!me.idle) {
			delay(40);
		}

        item = getUnit(UnitType.Item);

		if (item) {
            do {
                if ((item.mode === ItemModes.Item_on_ground || item.mode === ItemModes.Item_being_dropped) && getDistance(me, item) <= Config.PickRange) {
					pickList.push(copyUnit(item));
				}
			} while (item.getNext());
		}

		while (pickList.length > 0) {
			if (me.dead) {
				return false;
			}

			pickList.sort(this.sortItems);

			// Check if the item unit is still valid and if it's on ground or being dropped
            if (copyUnit(pickList[0]).x !== undefined && (pickList[0].mode === ItemModes.Item_on_ground || pickList[0].mode === ItemModes.Item_being_dropped) &&
					(Pather.useTeleport || me.inTown || !checkCollision(me, pickList[0], 0x1))) { // Don't pick items behind walls/obstacles when walking
				// Check if the item should be picked
				status = this.checkItem(pickList[0]);

				if (status.result && this.canPick(pickList[0]) && Item.autoEquipCheck(pickList[0])) {
                    // Override canFit for scrolls, potions and gold
                    canFit = Storage.Inventory.CanFit(pickList[0]) || [NTItemTypes.gold, NTItemTypes.scroll, NTItemTypes.healingpotion, NTItemTypes.manapotion, NTItemTypes.rejuvpotion].indexOf(pickList[0].itemType) > -1;

					// Try to make room with FieldID
					if (!canFit && Config.FieldID && Town.fieldID()) {
                        canFit = Storage.Inventory.CanFit(pickList[0]) || [NTItemTypes.gold, NTItemTypes.scroll, NTItemTypes.healingpotion, NTItemTypes.manapotion, NTItemTypes.rejuvpotion].indexOf(pickList[0].itemType) > -1;
					}

					// Try to make room by selling items in town
					if (!canFit) {
						// Check if any of the current inventory items can be stashed or need to be identified and eventually sold to make room
						if (this.canMakeRoom()) {
							print("ÿc7Trying to make room for " + this.itemColor(pickList[0]) + pickList[0].name);

							// Go to town and do town chores
							if (Town.visitTown()) {
								// Recursive check after going to town. We need to remake item list because gids can change.
								// Called only if room can be made so it shouldn't error out or block anything.

								return this.pickItems();
							}

							// Town visit failed - abort
							print("ÿc7Not enough room for " + this.itemColor(pickList[0]) + pickList[0].name);

							return false;
						}

						// Can't make room - trigger automule
						Misc.itemLogger("No room for", pickList[0]);
						print("ÿc7Not enough room for " + this.itemColor(pickList[0]) + pickList[0].name);

						needMule = true;
					}

					// Item can fit - pick it up
					if (canFit) {
						this.pickItem(pickList[0], status.result, status.line);
					}
				}
			}

			pickList.shift();
		}

		// Quit current game and transfer the items to mule
		if (needMule && AutoMule.getInfo() && AutoMule.getInfo().hasOwnProperty("muleInfo") && AutoMule.getMuleItems().length > 0) {
			scriptBroadcast("mule");
			scriptBroadcast("quit");
		}

		return true;
	},

	// Check if we can even free up the inventory
	canMakeRoom: function () {
		if (!Config.MakeRoom) {
			return false;
		}

		var i,
			items = Storage.Inventory.Compare(Config.Inventory);

		if (items) {
			for (i = 0; i < items.length; i += 1) {
				switch (this.checkItem(items[i]).result) {
				case -1: // Item needs to be identified
					// For low level chars that can't actually get id scrolls -> prevent an infinite loop
                        if (me.getStat(Stats.gold) + me.getStat(Stats.goldbank) < 100) {
						return false;
					}

					return true;
				case 0:
					break;
				default: // Check if a kept item can be stashed
					if (Town.canStash(items[i])) {
						return true;
					}

					break;
				}
			}
		}

		return false;
	},

	pickItem: function (unit, status, keptLine) {
		function ItemStats(unit) {
			this.ilvl = unit.ilvl;
			this.type = unit.itemType;
			this.classid = unit.classid;
            this.name = unit.name; 
			this.color = Pickit.itemColor(unit);
            this.gold = unit.getStat(Stats.gold);
            this.useTk = Config.UseTelekinesis && me.classid === ClassID.Sorceress && me.getSkill(Skills.Sorceress.Telekinesis, 1) && (this.type === NTItemTypes.gold || this.type === NTItemTypes.scroll || (this.type > NTItemTypes.healingpotion && this.type < NTItemTypes.smallcharm)) &&
						getDistance(me, unit) > 5 && getDistance(me, unit) < 20 && !checkCollision(me, unit, 0x4);
			this.picked = false;
		}

		var i, item, tick, gid, stats,
			itemCount = me.itemcount;

		if (unit.gid) {
			gid = unit.gid;
            item = getUnit(UnitType.Item, -1, -1, gid);
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

            if (item.mode !== ItemModes.Item_on_ground && item.mode !== ItemModes.Item_being_dropped) {
				break MainLoop;
			}

            if (stats.useTk) {
                Skill.cast(Skills.Sorceress.Telekinesis, 0, item);
			} else {
				if (getDistance(me, item) > (Config.FastPick === 2 && i < 1 ? 6 : 4) || checkCollision(me, item, 0x1)) {
					if (Pather.useTeleport) {
						Pather.moveToUnit(item);
					} else if (!Pather.moveTo(item.x, item.y, 0)) {
						continue MainLoop;
					}
				}

				if (Config.FastPick < 2) {
					Misc.click(0, 0, item);
				} else {
					sendPacket(1, 0x16, 4, 0x4, 4, item.gid, 4, 0);
				}
			}

			tick = getTickCount();

			while (getTickCount() - tick < 1000) {
				item = copyUnit(item);

                if (stats.classid === ItemClassIds.Gold) {
                    if (!item.getStat(Stats.gold) || item.getStat(Stats.gold) < stats.gold) {
                        print("ÿc7Picked up " + stats.color + (item.getStat(Stats.gold) ? (item.getStat(Stats.gold) - stats.gold) : stats.gold) + " " + stats.name);

						return true;
					}
				}

                if (item.mode !== ItemModes.Item_on_ground && item.mode !== ItemModes.Item_being_dropped) {
                    switch (stats.classid) {
                        case ItemClassIds.Key: // Key
						print("ÿc7Picked up " + stats.color + stats.name + " ÿc7(" + Town.checkKeys() + "/12)");

						return true;
                        case ItemClassIds.Scroll_Of_Town_Portal: // Scroll of Town Portal
                        case ItemClassIds.Scroll_Of_Identify: // Scroll of Identify
                            print("ÿc7Picked up " + stats.color + stats.name + " ÿc7(" + Town.checkScrolls(stats.classid === ItemClassIds.Scroll_Of_Town_Portal ? "tbk" : "ibk") + "/20)");

						return true;
					}

					break MainLoop;
				}

				delay(20);
			}

			// TK failed, disable it
			stats.useTk = false;

			//print("pick retry");
		}

		stats.picked = me.itemcount > itemCount || !!me.getItem(-1, -1, gid);

		if (stats.picked) {
			DataFile.updateStats("lastArea");

			switch (status) {
			case 1:
				print("ÿc7Picked up " + stats.color + stats.name + " ÿc0(ilvl " + stats.ilvl + (keptLine ? ") (" + keptLine + ")" : ")"));

				if (this.ignoreLog.indexOf(stats.type) === -1) {
					Misc.itemLogger("Kept", item);

					if (["pk1", "pk2", "pk3"].indexOf(item.code) > -1 && !TorchSystem.LogKeys) {
						break;
					}

					if (["dhn", "bey", "mbr"].indexOf(item.code) > -1 && !TorchSystem.LogOrgans) {
						break;
					}

					Misc.logItem("Kept", item, keptLine);
				}

				break;
			case 2:
				print("ÿc7Picked up " + stats.color + stats.name + " ÿc0(ilvl " + stats.ilvl + ")" + " (Cubing)");
				Misc.itemLogger("Kept", item, "Cubing " + me.findItems(item.classid).length);
				Cubing.update();

				break;
			case 3:
				print("ÿc7Picked up " + stats.color + stats.name + " ÿc0(ilvl " + stats.ilvl + ")" + " (Runewords)");
				Misc.itemLogger("Kept", item, "Runewords");
				Runewords.update(stats.classid, gid);

				break;
			case 5: // Crafting System
				print("ÿc7Picked up " + stats.color + stats.name + " ÿc0(ilvl " + stats.ilvl + ")" + " (Crafting System)");
				CraftingSystem.update(item);

				break;
			default:
				print("ÿc7Picked up " + stats.color + stats.name + " ÿc0(ilvl " + stats.ilvl + (keptLine ? ") (" + keptLine + ")" : ")"));

				break;
			}
		}

		return true;
	},

	itemQualityToName: function (quality) {
		var qualNames = ["", "lowquality", "normal", "superior", "magic", "set", "rare", "unique", "crafted"];

		return qualNames[quality];
	},

	itemColor: function (unit, type) {
		if (type === undefined) {
			type = true;
		}

		if (type) {
            switch (unit.itemType) {
                case NTItemTypes.gold: // gold
                    return "ÿc4";
                case NTItemTypes.rune: // runes
				return "ÿc8";
                case NTItemTypes.healingpotion: // healing potions
				return "ÿc1";
                case NTItemTypes.manapotion: // mana potions
				return "ÿc3";
                case NTItemTypes.rejuvpotion: // juvs
				return "ÿc;";
			}
		}

        switch (unit.quality) {
            case ItemQuality.Magic: // magic
			return "ÿc3";
            case ItemQuality.Set: // set
			return "ÿc2";
            case ItemQuality.Rare: // rare
			return "ÿc9";
            case ItemQuality.Unique: // unique
			return "ÿc4";
            case ItemQuality.Crafted: // crafted
			return "ÿc8";
		}

		return "ÿc0";
	},

	canPick: function (unit) {
		var tome, charm, i, potion, needPots, buffers, pottype, myKey, key;

        switch (unit.classid) {
            case ItemClassIds.Staff_of_Kings: // Staff of Kings
            case ItemClassIds.Khalims_Flail: // Khalim's Flail
            case ItemClassIds.Viper_Amulet: // Viper Amulet
            case ItemClassIds.A_Jade_Figurine: // Jade Figurine
            case ItemClassIds.Horadric_Cube: // Cube
            case ItemClassIds.Mephistos_Soulstone: // Mephisto's Soulstone
            case ItemClassIds.Book_Of_Skill: // Book of Skill
            case ItemClassIds.Khalims_Eye: // Khalim's Eye
            case ItemClassIds.Khalims_Heart: // Khalim's Heart
            case ItemClassIds.Khalims_Brain: // Khalim's Brain
			if (me.getItem(unit.classid)) {
				return false;
			}

			break;
		}

        switch (unit.itemType) {
            case NTItemTypes.gold: // Gold
                if (me.getStat(Stats.gold) === me.getStat(Stats.level) * 10000) { // Check current gold vs max capacity (cLvl*10000)
				return false; // Skip gold if full
			}

                break;
            case NTItemTypes.scroll: // Scroll
			tome = me.getItem(unit.classid - 11, 0); // 518 - Tome of Town Portal or 519 - Tome of Identify, mode 0 - inventory/stash

			if (tome) {
                do {
                    if (tome.location === ItemLocation.Inventory && tome.getStat(Stats.quantity) === 20) { // In inventory, contains 20 scrolls
						return false; // Skip a scroll if its tome is full
					}
				} while (tome.getNext());
			} else {
				return false; // Don't pick scrolls if there's no tome
			}

            break;
            case NTItemTypes.key: // Key (new 26.1.2013)
            if (me.classid === ClassID.Assassin) { // Assassins don't ever need keys
				return false;
			}

            myKey = me.getItem(ItemClassIds.Key, ItemModes.Item_In_Inventory_Stash_Cube_Or_Store); // 543 = key
			key = getUnit(4, -1, -1, unit.gid); // Passed argument isn't an actual unit, we need to get it

			if (myKey && key) {
                do {
                    if (myKey.location === ItemLocation.Inventory && myKey.getStat(Stats.quantity) + key.getStat(Stats.quantity) > 12) {
						return false;
					}
				} while (myKey.getNext());
			}

            break;
            case NTItemTypes.smallcharm: // Small Charm
            case NTItemTypes.mediumcharm: // Large Charm
            case NTItemTypes.largecharm: // Grand Charm
            if (unit.quality === ItemQuality.Unique) { // Unique
                charm = me.getItem(unit.classid, ItemModes.Item_In_Inventory_Stash_Cube_Or_Store);

				if (charm) {
                    do {
                        if (charm.quality === ItemQuality.Unique) {
							return false; // Skip Gheed's Fortune, Hellfire Torch or Annihilus if we already have one
						}
					} while (charm.getNext());
				}
			}

			break;
		case NTItemTypes.healingpotion: // Healing Potion
		case NTItemTypes.manapotion: // Mana Potion
        case NTItemTypes.rejuvpotion: // Rejuvenation Potion
			needPots = 0;

			for (i = 0; i < 4; i += 1) {
				if (typeof unit.code === "string" && unit.code.indexOf(Config.BeltColumn[i]) > -1) {
					needPots += this.beltSize;
				}
			}

            potion = me.getItem(-1, ItemLocation.Belt);

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
                                pottype = NTItemTypes.healingpotion;

							break;
						case "MPBuffer":
                                pottype = NTItemTypes.manapotion;

							break;
						case "RejuvBuffer":
                                pottype = NTItemTypes.rejuvpotion;

							break;
						}

						if (unit.itemType === pottype) {
							if (!Storage.Inventory.CanFit(unit)) {
								return false;
							}

                            needPots = Config[buffers[i]];
                            potion = me.getItem(-1, ItemLocation.Ground);

							if (potion) {
                                do {
                                    if (potion.itemType === pottype && potion.location === ItemLocation.Inventory) {
										needPots -= 1;
									}
								} while (potion.getNext());
							}
						}
					}
				}
			}

			if (needPots < 1) {
				potion = me.getItem();

				if (potion) {
                    do {
                        if (potion.itemType === unit.itemType && ((potion.mode === ItemModes.Item_In_Inventory_Stash_Cube_Or_Store && potion.location === ItemLocation.Inventory) || potion.mode === ItemModes.Item_in_belt)) {
							if (potion.classid < unit.classid) {
								potion.interact();
								needPots += 1;

								break;
							}
						}
					} while (potion.getNext());
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
            item = me.getItem(-1, ItemLocation.Belt);

		if (item) {
			do {
				if (item.x < 4) {
					check += 1;
				}
			} while (item.getNext());
		}

		return check === 4;
	},

	// Just sort by distance for general item pickup
	sortItems: function (unitA, unitB) {
		return getDistance(me, unitA) - getDistance(me, unitB);
	},

	// Prioritize runes and unique items for fast pick
    sortFastPickItems: function (unitA, unitB) {
        if (unitA.itemType === NTItemTypes.rune || unitA.quality === ItemQuality.Unique) {
			return -1;
		}

        if (unitB.itemType === NTItemTypes.rune || unitB.quality === ItemQuality.Unique) {
			return 1;
		}

		return getDistance(me, unitA) - getDistance(me, unitB);
	},

	fastPick: function () {
		var item, gid, status,
			itemList = [];

		while (this.gidList.length > 0) {
			gid = this.gidList.shift();
            item = getUnit(UnitType.Item, -1, -1, gid);

            if (item && (item.mode === ItemModes.Item_on_ground || item.mode === ItemModes.Item_being_dropped) && Town.ignoredItemTypes.indexOf(item.itemType) === -1 && getDistance(me, item) <= Config.PickRange) {
				itemList.push(copyUnit(item));
			}
		}

		while (itemList.length > 0) {
			itemList.sort(this.sortFastPickItems);

			item = copyUnit(itemList.shift());

			// Check if the item unit is still valid
			if (item.x !== undefined) {
				status = this.checkItem(item);

                if (status.result && this.canPick(item) && (Storage.Inventory.CanFit(item) || [NTItemTypes.gold, NTItemTypes.scroll, NTItemTypes.healingpotion, NTItemTypes.manapotion, NTItemTypes.rejuvpotion].indexOf(item.itemType) > -1)) {
					this.pickItem(item, status.result, status.line);
				}
			}
		}

		return true;
	}
};