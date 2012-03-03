var Runeword = {
	Beast: [639, 612, 631, 632, 626], // Ber + Tir + Um + Mal + Lum
	Bramble: [617, 636, 638, 614], // Ral + Ohm + Sur + Eth
	BreathoftheDying: [635, 624, 610, 611, 642, 614], // Vex + Hel + El + Eld + Zod + Eth
	CallToArms: [620, 617, 632, 633, 636], // Amn + Ral + Mal + Ist + Ohm
	ChainsofHonor: [623, 631, 639, 633], // Dol + Um + Ber + Ist
	Chaos: [628, 636, 631], // Fal + Ohm + Um
	CrescentMoon: [622, 631, 612], // Shael + Um + Tir
	Delirium: [629, 633, 625], // Lem + Ist + Io
	Doom: [624, 636, 631, 637, 641], // Hel + Ohm + Um + Lo + Cham
	Duress: [622, 631, 619], // Shael + Um + Thul
	Enigma: [640, 615, 639], // Jah + Ith + Ber
	Eternity: [620, 639, 633, 621, 638], // Amn + Ber + Ist + Sol + Sur
	Exile: [635, 636, 633, 623], // Vex + Ohm + Ist + Dol
	Famine: [628, 636, 618, 640], // Fal + Ohm + Ort + Jah
	Gloom: [628, 631, 630], // Fal + Um + Pul
	HandofJustice: [638, 641, 620, 637], // Sur + Cham + Amn + Lo
	HeartoftheOak: [627, 635, 630, 619], // Ko + Vex + Pul + Thul
	Kingslayer: [632, 631, 634, 628], // Mal + Um + Gul + Fal
	Passion: [623, 618, 611, 629], // Dol + Ort + Eld + Lem
	Prudence: [632, 612], // Mal + Tir
	Sanctuary: [627, 627, 632], // Ko + Ko + Mal
	Splendor: [614, 626], // Eth + Lum
	Stone: [622, 631, 630, 626], // Shael + Um + Pul + Lum
	Wind: [638, 610], // Sur + El
	Brand: [640, 637, 632, 634], // Jah + Lo + Mal + Gul
	Death: [624, 610, 635, 618, 634], // Hel + El + Vex + Ort + Gul
	Destruction:[635, 637, 639, 640, 627], // Vex + Lo + Ber + Jah + Ko
	Dragon: [638, 637, 621], // Sur + Lo + Sol
	Dream: [625, 640, 630], // Io + Jah + Pul
	Edge: [612, 616, 620], // Tir + Tal + Amn
	Faith: [636, 640, 629, 611], // Ohm + Jah + Lem + Eld
	Fortitude: [610, 621, 623, 637], // El + Sol + Dol + Lo
	Grief: [614, 612, 637, 632, 617], // Eth + Tir + Lo + Mal + Ral
	Harmony: [612, 615, 621, 627], // Tir + Ith + Sol + Ko
	Ice: [620, 622, 640, 637], // Amn + Shael + Jah + Lo
	Infinity: [639, 632, 639, 633], // Ber + Mal + Ber + Ist
	Insight: [617, 612, 616, 621], // Ral + Tir + Tal + Sol
	LastWish: [640, 632, 640, 638, 640, 639], // Jah + Mal + Jah + Sur + Jah + Ber
	Lawbringer: [620, 629, 627], // Amn + Lem + Ko
	Oath: [622, 630, 632, 626], // Shael + Pul + Mal + Lum
	Obedience: [624, 627, 619, 614, 628], // Hel + Ko + Thul + Eth + Fal
	Phoenix: [635, 635, 637, 640], // Vex + Vex + Lo + Jah
	Pride: [641, 638, 625, 637], // Cham + Sur + Io + Lo
	Rift: [624, 627, 629, 634], // Hel + Ko + Lem + Gul
	Spirit: [616, 619, 618, 620], // Tal + Thul + Ort + Amn
	VoiceofReason: [629, 627, 610, 611], // Lem + Ko + El + Eld
	Wrath: [630, 626, 639, 632], // Pul + Lum + Ber + Mal

	Test: [624, 624, 624]
}

var Runewords = {
	needList: [],
	pickitEntries: [],
	validGids: [],

	init: function () {
		if (!Config.MakeRunewords) {
			return;
		}

		var i;

		this.pickitEntries = [];

		// initiate pickit entries
		for (i = 0; i < Config.KeepRunewords.length; i += 1) {
			this.pickitEntries.push(NTIPParseLineInt(Config.KeepRunewords[i]));
		}

		this.buildLists();
	},

	// build a list of needed runes. won't count runes until the base item is found for a given runeword
	buildLists: function () {
		var i, j, k, items, hel, baseCheck;

		this.validGids = [];
		this.needList = [];
		items = me.findItems(-1, 0);

		for (i = 0; i < Config.Runewords.length; i += 1) {
			if (!baseCheck) {
				baseCheck = this.getBase(Config.Runewords[i][0], Config.Runewords[i][1]) || this.getBase(Config.Runewords[i][0], Config.Runewords[i][1], true);
			}

			if (this.getBase(Config.Runewords[i][0], Config.Runewords[i][1])) {
RuneLoop: for (j = 0; j < Config.Runewords[i][0].length; j += 1) {
					for (k = 0; k < items.length; k += 1) {
						if (items[k].classid === Config.Runewords[i][0][j]) {
							this.validGids.push(items[k].gid);
							items.splice(k, 1);

							continue RuneLoop;
						}
					}

					this.needList.push(Config.Runewords[i][0][j]);
				}
			}
		}

		// hel rune for rerolling purposes
		if (baseCheck) {
			hel = me.getItem(624, 0);

			if (hel) {
				do {
					if (this.validGids.indexOf(hel.gid) === -1) {
						this.validGids.push(hel.gid);

						return;
					}
				} while (hel.getNext());
			}

			this.needList.push(624);
		}
	},

	update: function (classid, gid) {
		var i;

		for (i = 0; i < this.needList.length; i += 1) {
			if (this.needList[i] === classid) {
				this.needList.splice(i, 1);

				break;
			}
		}

		this.validGids.push(gid);
	},

	// returns an array of items that make a runeword if found, false if we don't have enough items for any
	checkRunewords: function () {
		var i, j, k, items, base, itemList;

		items = me.findItems(-1, 0); // get items in inventory/stash

		for (i = 0; i < Config.Runewords.length; i += 1) {
			itemList = []; // reset item list
			base = this.getBase(Config.Runewords[i][0], Config.Runewords[i][1]); // check base

			if (base) {
				itemList.push(base); // push the base

RuneLoop: for (j = 0; j < Config.Runewords[i][0].length; j += 1) {
					for (k = 0; k < items.length; k += 1) {
						if (items[k].classid === Config.Runewords[i][0][j]) { // rune matched
							itemList.push(items[k]); // push into the item list
							items.splice(k, 1); // remove from item list as to not count it twice

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

		var i;

		if (unit.itemType === 74 && this.needList.indexOf(unit.classid) > -1) { // rune
			return true;
		}

		// this code will be able to limit base item pickup
		/*if (unit.quality < 4 && NTIPCheckItem(unit)) {
			for (i = 0; i < Config.Runewords.length; i += 1) {
				if (this.getBase(Config.Runewords[i][0], unit)) {
					return true;
				}
			}
		}*/

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
			item = me.getItem(base, 0);
		}

		if (item) {
			do {
				if (item && item.quality < 4 && item.getStat(194) === runeword.length) {
					/* check if item has items socketed in it
						better check than getFlag(0x4000000) because randomly socketed items return false for it
					*/

					if (reroll && item.getItem() && !NTIPCheckItem(item, this.pickitEntries)) {
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

		scroll = me.getItem(529, 0); // check if we already have the scroll

		if (scroll) {
			return scroll;
		}

		npc = Town.initNPC("Shop");

		if (!npc) {
			return false;
		}

		scroll = npc.getItem(529);

		if (scroll) {
			for (i = 0; i < 3; i += 1) {
				scroll.buy(true);

				if (me.getItem(529)) {
					break;
				}
			}
		}

		me.cancel();

		return me.getItem(529, 0);
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

			print("ÿc4Runewords: ÿc0Made runeword: " + items[0].fname.split("\n").reverse().join(" ").replace(/ÿc./, ""));
			D2Bot.printToConsole("Made runeword: " + items[0].fname.split("\n").reverse().join(" ").replace(/ÿc./, "") + ";3");

			if (NTIPCheckItem(items[0], this.pickitEntries)) {
				Misc.logItem("Runeword kept", items[0]);
			}
		}

		me.cancel();

		this.rerollRunewords();

		return true;
	},

	rerollRunewords: function () {
		var i, base, scroll, hel;

		for (i = 0; i < Config.Runewords.length; i += 1) {
			hel = me.getItem(624, 0);

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

				print("ÿc4Runewords: ÿc0Rerolling runeword: " + base.fname.split("\n").reverse().join(" ").replace(/ÿc./, ""));
				D2Bot.printToConsole("Rerolling runeword:" + base.fname.split("\n").reverse().join(" ").replace(/ÿc./, "") + ";3");
				transmute();
				delay(500);

				if (!Cubing.emptyCube()) { // can't pull the item out = no space = fail
					return false;
				}
			}
		}

		this.buildLists();

		while (getUIFlag(0x1A) || getUIFlag(0x19)) {
			me.cancel();
			delay(300)
		}

		return true;
	}
};