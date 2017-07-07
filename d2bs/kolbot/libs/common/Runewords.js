/**
*	@filename	Runewords.js
*	@author		kolton
*	@desc		make and reroll runewords
*/

// TODO: Config.Runewords[i][0] can be false, but array methods can be used on it

if (!isIncluded("common/Enums.js")) { include("common/Enums.js"); };

var Runeword = {
    // 1.09
    AncientsPledge: [ItemClassIds.Ral_Rune, ItemClassIds.Ort_Rune, ItemClassIds.Tal_Rune], // Ral + Ort + Tal
    Black: [ItemClassIds.Thul_Rune, ItemClassIds.Io_Rune, ItemClassIds.Nef_Rune], // Thul + Io + Nef
    Fury: [ItemClassIds.Jah_Rune, ItemClassIds.Gul_Rune, ItemClassIds.Eth_Rune], // Jah + Gul + Eth
    HolyThunder: [ItemClassIds.Eth_Rune, ItemClassIds.Ral_Rune, ItemClassIds.Ort_Rune, ItemClassIds.Tal_Rune], // Eth + Ral + Ort + Tal
    Honor: [ItemClassIds.Amn_Rune, ItemClassIds.El_Rune, ItemClassIds.Ith_Rune, ItemClassIds.Tir_Rune, ItemClassIds.Sol_Rune], // Amn + El + Ith + Tir + Sol
    KingsGrace: [ItemClassIds.Amn_Rune, ItemClassIds.Ral_Rune, ItemClassIds.Thul_Rune], // Amn + Ral + Thul
    Leaf: [ItemClassIds.Tir_Rune, ItemClassIds.Ral_Rune], // Tir + Ral
    Lionheart: [ItemClassIds.Hel_Rune, ItemClassIds.Lum_Rune, ItemClassIds.Fal_Rune], // Hel + Lum + Fal
    Lore: [ItemClassIds.Ort_Rune, ItemClassIds.Sol_Rune], // Ort + Sol
    Malice: [ItemClassIds.Ith_Rune, ItemClassIds.El_Rune, ItemClassIds.Eth_Rune], // Ith + El + Eth
    Melody: [ItemClassIds.Shael_Rune, ItemClassIds.Ko_Rune, ItemClassIds.Nef_Rune], // Shael + Ko + Nef
    Memory: [ItemClassIds.Lum_Rune, ItemClassIds.Io_Rune, ItemClassIds.Sol_Rune, ItemClassIds.Eth_Rune], // Lum + Io + Sol + Eth
    Nadir: [ItemClassIds.Nef_Rune, ItemClassIds.Tir_Rune], // Nef + Tir
    Radiance: [ItemClassIds.Nef_Rune, ItemClassIds.Sol_Rune, ItemClassIds.Ith_Rune], // Nef + Sol + Ith
    Rhyme: [ItemClassIds.Shael_Rune, ItemClassIds.Eth_Rune], // Shael + Eth
    Silence: [ItemClassIds.Dol_Rune, ItemClassIds.Eld_Rune, ItemClassIds.Hel_Rune, ItemClassIds.Ist_Rune, ItemClassIds.Tir_Rune, ItemClassIds.Vex_Rune], // Dol + Eld + Hel + Ist + Tir + Vex
    Smoke: [ItemClassIds.Nef_Rune, ItemClassIds.Lum_Rune], // Nef + Lum
    Stealth: [ItemClassIds.Tal_Rune, ItemClassIds.Eth_Rune], // Tal + Eth
    Steel: [ItemClassIds.Tir_Rune, ItemClassIds.El_Rune], // Tir + El
    Strength: [ItemClassIds.Amn_Rune, ItemClassIds.Tir_Rune], // Amn + Tir
    Venom: [ItemClassIds.Tal_Rune, ItemClassIds.Dol_Rune, ItemClassIds.Mal_Rune], // Tal + Dol + Mal
    Wealth: [ItemClassIds.Lem_Rune, ItemClassIds.Ko_Rune, ItemClassIds.Tir_Rune], // Lem + Ko + Tir
    White: [ItemClassIds.Dol_Rune, ItemClassIds.Io_Rune], // Dol + Io
    Zephyr: [ItemClassIds.Ort_Rune, ItemClassIds.Eth_Rune], // Ort + Eth

	// 1.10
    Beast: [ItemClassIds.Ber_Rune, ItemClassIds.Tir_Rune, ItemClassIds.Um_Rune, ItemClassIds.Mal_Rune, ItemClassIds.Lum_Rune], // Ber + Tir + Um + Mal + Lum
    Bramble: [ItemClassIds.Ral_Rune, ItemClassIds.Ohm_Rune, ItemClassIds.Sur_Rune, ItemClassIds.Eth_Rune], // Ral + Ohm + Sur + Eth
    BreathoftheDying: [ItemClassIds.Vex_Rune, ItemClassIds.Hel_Rune, ItemClassIds.El_Rune, ItemClassIds.Eld_Rune, ItemClassIds.Zod_Rune, ItemClassIds.Eth_Rune], // Vex + Hel + El + Eld + Zod + Eth
    CallToArms: [ItemClassIds.Amn_Rune, ItemClassIds.Ral_Rune, ItemClassIds.Mal_Rune, ItemClassIds.Ist_Rune, ItemClassIds.Ohm_Rune], // Amn + Ral + Mal + Ist + Ohm
    ChainsofHonor: [ItemClassIds.Dol_Rune, ItemClassIds.Um_Rune, ItemClassIds.Ber_Rune, ItemClassIds.Ist_Rune], // Dol + Um + Ber + Ist
    Chaos: [ItemClassIds.Fal_Rune, ItemClassIds.Ohm_Rune, ItemClassIds.Um_Rune], // Fal + Ohm + Um
    CrescentMoon: [ItemClassIds.Shael_Rune, ItemClassIds.Um_Rune, ItemClassIds.Tir_Rune], // Shael + Um + Tir
    Delirium: [ItemClassIds.Lem_Rune, ItemClassIds.Ist_Rune, ItemClassIds.Io_Rune], // Lem + Ist + Io
    Doom: [ItemClassIds.Hel_Rune, ItemClassIds.Ohm_Rune, ItemClassIds.Um_Rune, ItemClassIds.Lo_Rune, ItemClassIds.Cham_Rune], // Hel + Ohm + Um + Lo + Cham
    Duress: [ItemClassIds.Shael_Rune, ItemClassIds.Um_Rune, ItemClassIds.Thul_Rune], // Shael + Um + Thul
    Enigma: [ItemClassIds.Jah_Rune, ItemClassIds.Ith_Rune, ItemClassIds.Ber_Rune], // Jah + Ith + Ber
    Eternity: [ItemClassIds.Amn_Rune, ItemClassIds.Ber_Rune, ItemClassIds.Ist_Rune, ItemClassIds.Sol_Rune, ItemClassIds.Sur_Rune], // Amn + Ber + Ist + Sol + Sur
    Exile: [ItemClassIds.Vex_Rune, ItemClassIds.Ohm_Rune, ItemClassIds.Ist_Rune, ItemClassIds.Dol_Rune], // Vex + Ohm + Ist + Dol
    Famine: [ItemClassIds.Fal_Rune, ItemClassIds.Ohm_Rune, ItemClassIds.Ort_Rune, ItemClassIds.Jah_Rune], // Fal + Ohm + Ort + Jah
    Gloom: [ItemClassIds.Fal_Rune, ItemClassIds.Um_Rune, ItemClassIds.Pul_Rune], // Fal + Um + Pul
    HandofJustice: [ItemClassIds.Sur_Rune, ItemClassIds.Cham_Rune, ItemClassIds.Amn_Rune, ItemClassIds.Lo_Rune], // Sur + Cham + Amn + Lo
    HeartoftheOak: [ItemClassIds.Ko_Rune, ItemClassIds.Vex_Rune, ItemClassIds.Pul_Rune, ItemClassIds.Thul_Rune], // Ko + Vex + Pul + Thul
    Kingslayer: [ItemClassIds.Mal_Rune, ItemClassIds.Um_Rune, ItemClassIds.Gul_Rune, ItemClassIds.Fal_Rune], // Mal + Um + Gul + Fal
    Passion: [ItemClassIds.Dol_Rune, ItemClassIds.Ort_Rune, ItemClassIds.Eld_Rune, ItemClassIds.Lem_Rune], // Dol + Ort + Eld + Lem
    Prudence: [ItemClassIds.Mal_Rune, ItemClassIds.Tir_Rune], // Mal + Tir
    Sanctuary: [ItemClassIds.Ko_Rune, ItemClassIds.Ko_Rune, ItemClassIds.Mal_Rune], // Ko + Ko + Mal
    Splendor: [ItemClassIds.Eth_Rune, ItemClassIds.Lum_Rune], // Eth + Lum
    Stone: [ItemClassIds.Shael_Rune, ItemClassIds.Um_Rune, ItemClassIds.Pul_Rune, ItemClassIds.Lum_Rune], // Shael + Um + Pul + Lum
    Wind: [ItemClassIds.Sur_Rune, ItemClassIds.El_Rune], // Sur + El

	// Don't use ladder-only on NL
    Brand: me.ladder ? [ItemClassIds.Jah_Rune, ItemClassIds.Lo_Rune, ItemClassIds.Mal_Rune, ItemClassIds.Gul_Rune] : false, // Jah + Lo + Mal + Gul
    Death: me.ladder ? [ItemClassIds.Hel_Rune, ItemClassIds.El_Rune, ItemClassIds.Vex_Rune, ItemClassIds.Ort_Rune, ItemClassIds.Gul_Rune] : false, // Hel + El + Vex + Ort + Gul
    Destruction: me.ladder ? [ItemClassIds.Vex_Rune, ItemClassIds.Lo_Rune, ItemClassIds.Ber_Rune, ItemClassIds.Jah_Rune, ItemClassIds.Ko_Rune] : false, // Vex + Lo + Ber + Jah + Ko
    Dragon: me.ladder ? [ItemClassIds.Sur_Rune, ItemClassIds.Lo_Rune, ItemClassIds.Sol_Rune] : false, // Sur + Lo + Sol
    Dream: me.ladder ? [ItemClassIds.Io_Rune, ItemClassIds.Jah_Rune, ItemClassIds.Pul_Rune] : false, // Io + Jah + Pul
    Edge: me.ladder ? [ItemClassIds.Tir_Rune, ItemClassIds.Tal_Rune, ItemClassIds.Amn_Rune] : false, // Tir + Tal + Amn
    Faith: me.ladder ? [ItemClassIds.Ohm_Rune, ItemClassIds.Jah_Rune, ItemClassIds.Lem_Rune, ItemClassIds.Eld_Rune] : false, // Ohm + Jah + Lem + Eld
    Fortitude: me.ladder ? [ItemClassIds.El_Rune, ItemClassIds.Sol_Rune, ItemClassIds.Dol_Rune, ItemClassIds.Lo_Rune] : false, // El + Sol + Dol + Lo
    Grief: me.ladder ? [ItemClassIds.Eth_Rune, ItemClassIds.Tir_Rune, ItemClassIds.Lo_Rune, ItemClassIds.Mal_Rune, ItemClassIds.Ral_Rune] : false, // Eth + Tir + Lo + Mal + Ral
    Harmony: me.ladder ? [ItemClassIds.Tir_Rune, ItemClassIds.Ith_Rune, ItemClassIds.Sol_Rune, ItemClassIds.Ko_Rune] : false, // Tir + Ith + Sol + Ko
    Ice: me.ladder ? [ItemClassIds.Amn_Rune, ItemClassIds.Shael_Rune, ItemClassIds.Jah_Rune, ItemClassIds.Lo_Rune] : false, // Amn + Shael + Jah + Lo
    "Infinity": me.ladder ? [ItemClassIds.Ber_Rune, ItemClassIds.Mal_Rune, ItemClassIds.Ber_Rune, ItemClassIds.Ist_Rune] : false, // Ber + Mal + Ber + Ist
    Insight: me.ladder ? [ItemClassIds.Ral_Rune, ItemClassIds.Tir_Rune, ItemClassIds.Tal_Rune, ItemClassIds.Sol_Rune] : false, // Ral + Tir + Tal + Sol
    LastWish: me.ladder ? [ItemClassIds.Jah_Rune, ItemClassIds.Mal_Rune, ItemClassIds.Jah_Rune, ItemClassIds.Sur_Rune, ItemClassIds.Jah_Rune, ItemClassIds.Ber_Rune] : false, // Jah + Mal + Jah + Sur + Jah + Ber
    Lawbringer: me.ladder ? [ItemClassIds.Amn_Rune, ItemClassIds.Lem_Rune, ItemClassIds.Ko_Rune] : false, // Amn + Lem + Ko
    Oath: me.ladder ? [ItemClassIds.Shael_Rune, ItemClassIds.Pul_Rune, ItemClassIds.Mal_Rune, ItemClassIds.Lum_Rune] : false, // Shael + Pul + Mal + Lum
    Obedience: me.ladder ? [ItemClassIds.Hel_Rune, ItemClassIds.Ko_Rune, ItemClassIds.Thul_Rune, ItemClassIds.Eth_Rune, ItemClassIds.Fal_Rune] : false, // Hel + Ko + Thul + Eth + Fal
    Phoenix: me.ladder ? [ItemClassIds.Vex_Rune, ItemClassIds.Vex_Rune, ItemClassIds.Lo_Rune, ItemClassIds.Jah_Rune] : false, // Vex + Vex + Lo + Jah
    Pride: me.ladder ? [ItemClassIds.Cham_Rune, ItemClassIds.Sur_Rune, ItemClassIds.Io_Rune, ItemClassIds.Lo_Rune] : false, // Cham + Sur + Io + Lo
    Rift: me.ladder ? [ItemClassIds.Hel_Rune, ItemClassIds.Ko_Rune, ItemClassIds.Lem_Rune, ItemClassIds.Gul_Rune] : false, // Hel + Ko + Lem + Gul
    Spirit: me.ladder ? [ItemClassIds.Tal_Rune, ItemClassIds.Thul_Rune, ItemClassIds.Ort_Rune, ItemClassIds.Amn_Rune] : false, // Tal + Thul + Ort + Amn
    VoiceofReason: me.ladder ? [ItemClassIds.Lem_Rune, ItemClassIds.Ko_Rune, ItemClassIds.El_Rune, ItemClassIds.Eld_Rune] : false, // Lem + Ko + El + Eld
    Wrath: me.ladder ? [ItemClassIds.Pul_Rune, ItemClassIds.Lum_Rune, ItemClassIds.Ber_Rune, ItemClassIds.Mal_Rune] : false, // Pul + Lum + Ber + Mal

	// 1.11
    Bone: [ItemClassIds.Sol_Rune, ItemClassIds.Um_Rune, ItemClassIds.Um_Rune], // Sol + Um + Um
    Enlightenment: [ItemClassIds.Pul_Rune, ItemClassIds.Ral_Rune, ItemClassIds.Sol_Rune], // Pul + Ral + Sol
    Myth: [ItemClassIds.Hel_Rune, ItemClassIds.Amn_Rune, ItemClassIds.Nef_Rune], // Hel + Amn + Nef
    Peace: [ItemClassIds.Shael_Rune, ItemClassIds.Thul_Rune, ItemClassIds.Amn_Rune], // Shael + Thul + Amn
    Principle: [ItemClassIds.Ral_Rune, ItemClassIds.Gul_Rune, ItemClassIds.Eld_Rune], // Ral + Gul + Eld
    Rain: [ItemClassIds.Ort_Rune, ItemClassIds.Mal_Rune, ItemClassIds.Ith_Rune], // Ort + Mal + Ith
    Treachery: [ItemClassIds.Shael_Rune, ItemClassIds.Thul_Rune, ItemClassIds.Lem_Rune], // Shael + Thul + Lem

    Test: [ItemClassIds.Hel_Rune, ItemClassIds.Hel_Rune, ItemClassIds.Hel_Rune]
};

var Runewords = {
	needList: [],
	pickitEntries: [],
	validGids: [],

	init: function () {
		if (!Config.MakeRunewords) {
			return;
		}

		var i, info, parsedLine;

		this.pickitEntries = [];

		// initiate pickit entries
		for (i = 0; i < Config.KeepRunewords.length; i += 1) {
			info = {
				file: "Character Config",
				line: Config.KeepRunewords[i]
			};

			parsedLine = NTIP.ParseLineInt(Config.KeepRunewords[i], info);

			if (parsedLine) {
				this.pickitEntries.push(NTIP.ParseLineInt(Config.KeepRunewords[i], info));
			}
		}

		// change text to classid
		for (i = 0; i < Config.Runewords.length; i += 1) {
			if (Config.Runewords[i][0] !== false) {
				if (isNaN(Config.Runewords[i][1])) {
					if (NTIPAliasClassID.hasOwnProperty(Config.Runewords[i][1].replace(/\s+/g, "").toLowerCase())) {
						Config.Runewords[i][1] = NTIPAliasClassID[Config.Runewords[i][1].replace(/\s+/g, "").toLowerCase()];
					} else {
						Misc.errorReport("ÿc1Invalid runewords entry:ÿc0 " + Config.Runewords[i][1]);
						Config.Runewords.splice(i, 1);

						i -= 1;
					}
				}
			}
		}

		this.buildLists();
	},

	validItem: function (item) {
		if (CraftingSystem.validGids.indexOf(item.gid) > -1) {
			return false;
		}

		return true;
	},

	// build a list of needed runes. won't count runes until the base item is found for a given runeword
	buildLists: function () {
		var i, j, k, items, hel, baseCheck;

		this.validGids = [];
		this.needList = [];
        items = me.findItems(-1, ItemModes.Item_In_Inventory_Stash_Cube_Or_Store);

		for (i = 0; i < Config.Runewords.length; i += 1) {
			if (!baseCheck) {
				baseCheck = this.getBase(Config.Runewords[i][0], Config.Runewords[i][1]) || this.getBase(Config.Runewords[i][0], Config.Runewords[i][1], true);
			}

			if (this.getBase(Config.Runewords[i][0], Config.Runewords[i][1])) {
RuneLoop:
				for (j = 0; j < Config.Runewords[i][0].length; j += 1) {
					for (k = 0; k < items.length; k += 1) {
						if (items[k].classid === Config.Runewords[i][0][j] && this.validItem(items[k])) {
							this.validGids.push(items[k].gid);
							items.splice(k, 1);

							k -= 1;

							continue RuneLoop;
						}
					}

					this.needList.push(Config.Runewords[i][0][j]);
				}
			}
		}

		// hel rune for rerolling purposes
        if (baseCheck) {
            hel = me.getItem(ItemClassIds.Hel_Rune, ItemModes.Item_In_Inventory_Stash_Cube_Or_Store);

			if (hel) {
				do {
					if (this.validGids.indexOf(hel.gid) === -1 && this.validItem(hel)) {
						this.validGids.push(hel.gid);

						return;
					}
				} while (hel.getNext());
			}

            this.needList.push(ItemClassIds.Hel_Rune);
		}
	},

	update: function (classid, gid) {
		var i;

		for (i = 0; i < this.needList.length; i += 1) {
			if (this.needList[i] === classid) {
				this.needList.splice(i, 1);

				i -= 1;

				break;
			}
		}

		this.validGids.push(gid);
	},

	// returns an array of items that make a runeword if found, false if we don't have enough items for any
	checkRunewords: function () {
		var i, j, k, items, base, itemList;

        items = me.findItems(-1, ItemModes.Item_In_Inventory_Stash_Cube_Or_Store); // get items in inventory/stash

		for (i = 0; i < Config.Runewords.length; i += 1) {
			itemList = []; // reset item list
			base = this.getBase(Config.Runewords[i][0], Config.Runewords[i][1]); // check base

			if (base) {
				itemList.push(base); // push the base

RuneLoop:
				for (j = 0; j < Config.Runewords[i][0].length; j += 1) {
					for (k = 0; k < items.length; k += 1) {
						if (items[k].classid === Config.Runewords[i][0][j]) { // rune matched
							itemList.push(items[k]); // push into the item list
							items.splice(k, 1); // remove from item list as to not count it twice

							k -= 1;

							break; // stop item cycle - we found the item
						}
					}

					if (itemList.length !== j + 2) { // can't complete runeword - go to next one
						break RuneLoop;
					}

					if (itemList.length === Config.Runewords[i][0].length + 1) { // runes + base
						return itemList; // these items are our runeword
					}
				}
			}
		}

		return false;
	},

	checkItem: function (unit) { // for pickit
		if (!Config.MakeRunewords) {
			return false;
		}

        if (unit.itemType === NTItemTypes.rune && this.needList.indexOf(unit.classid) > -1) { // rune
			return true;
		}

		return false;
	},

	keepItem: function (unit) { // for clearInventory - don't drop runes that are a part of runeword recipe
		return this.validGids.indexOf(unit.gid) > -1;
	},

	/* get the base item based on classid and runeword recipe
		optional reroll argument = gets a runeword that needs rerolling
		rigged to accept item or classid as 2nd arg
	*/
	getBase: function (runeword, base, reroll) {
		var item;

		if (typeof base === "object") {
			item = base;
		} else {
            item = me.getItem(base, ItemModes.Item_In_Inventory_Stash_Cube_Or_Store);
		}

		if (item) {
			do {
                if (item && item.quality < ItemQuality.Magic && item.getStat(Stats.item_numsockets) === runeword.length) {
					/* check if item has items socketed in it
						better check than getFlag(0x4000000) because randomly socketed items return false for it
					*/

					if (reroll && item.getItem() && !NTIP.CheckItem(item, this.pickitEntries)) {
						return copyUnit(item);
					}

					if (!reroll && !item.getItem()) {
						return copyUnit(item);
					}
				}
			} while (typeof base !== "object" && item.getNext());
		}

		return false;
	},

	socketItem: function (base, rune) { // args named this way to prevent confusion
		var i, tick;

		if (!rune.toCursor()) {
			return false;
		}

		for (i = 0; i < 3; i += 1) {
			clickItem(0, base.x, base.y, base.location);

			tick = getTickCount();

			while (getTickCount() - tick < 2000) {
				if (!me.itemoncursor) {
					delay(300);

					return true;
				}

				delay(10);
			}
		}

		return false;
	},

	getScroll: function () {
		var i, scroll, npc;

        scroll = me.getItem(ItemClassIds.Scroll_Of_Town_Portal, ItemModes.Item_In_Inventory_Stash_Cube_Or_Store); // check if we already have the scroll

		if (scroll) {
			return scroll;
		}

		npc = Town.initNPC("Shop");

		if (!npc) {
			return false;
		}

        scroll = npc.getItem(ItemClassIds.Scroll_Of_Town_Portal);

		if (scroll) {
			for (i = 0; i < 3; i += 1) {
				scroll.buy(true);

                if (me.getItem(ItemClassIds.Scroll_Of_Town_Portal)) {
					break;
				}
			}
		}

		me.cancel();

        return me.getItem(ItemClassIds.Scroll_Of_Town_Portal, ItemModes.Item_In_Inventory_Stash_Cube_Or_Store);
	},

	makeRunewords: function () {
		if (!Config.MakeRunewords) {
			return false;
		}

		var i, items;

		while (true) {
			this.buildLists();

			items = this.checkRunewords(); // get a runeword. format = [base, runes...]

			if (!items) { // can't make runewords - exit loop
				break;
			}

			if (!Town.openStash()) {
				return false;
			}

			for (i = 1; i < items.length; i += 1) {
				this.socketItem(items[0], items[i]);
			}

			print("ÿc4Runewords: ÿc0Made runeword: " + items[0].fname.split("\n").reverse().join(" ").replace(/ÿc[0-9!"+<;.*]/, ""));
			D2Bot.printToConsole("Made runeword: " + items[0].fname.split("\n").reverse().join(" ").replace(/ÿc[0-9!"+<;.*]/, ""), 5);

			if (NTIP.CheckItem(items[0], this.pickitEntries)) {
				Misc.itemLogger("Runeword Kept", items[0]);
				Misc.logItem("Runeword Kept", items[0]);
			}
		}

		me.cancel();

		this.rerollRunewords();

		return true;
	},

	rerollRunewords: function () {
		var i, base, scroll, hel;

        for (i = 0; i < Config.Runewords.length; i += 1) {
            hel = me.getItem(ItemClassIds.Hel_Rune, ItemModes.Item_In_Inventory_Stash_Cube_Or_Store);

			if (!hel) {
				return false;
			}

			base = this.getBase(Config.Runewords[i][0], Config.Runewords[i][1], true); // get a bad runeword

			if (base) {
				scroll = this.getScroll();

				// failed to get scroll or open stash most likely means we're stuck somewhere in town, so it's better to return false
				if (!scroll || !Town.openStash() || !Cubing.emptyCube()) {
					return false;
				}

				// not a fatal error, if the cube can't be emptied, the func will return false on next cycle
				if (!Storage.Cube.MoveTo(base) || !Storage.Cube.MoveTo(hel) || !Storage.Cube.MoveTo(scroll)) {
					continue;
				}

				if (!Cubing.openCube()) { // probably only happens on server crash
					return false;
				}

				print("ÿc4Runewords: ÿc0Rerolling runeword: " + base.fname.split("\n").reverse().join(" ").replace(/ÿc[0-9!"+<;.*]/, ""));
				D2Bot.printToConsole("Rerolling runeword: " + base.fname.split("\n").reverse().join(" ").replace(/ÿc[0-9!"+<;.*]/, ""), 5);
				transmute();
				delay(500);

				if (!Cubing.emptyCube()) { // can't pull the item out = no space = fail
					return false;
				}
			}
		}

		this.buildLists();

        while (getUIFlag(UIFlags.Cube_is_open) || getUIFlag(UIFlags.Stash_is_open)) {
			me.cancel();
			delay(300);
		}

		return true;
	}
};