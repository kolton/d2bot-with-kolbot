/**
*	@filename	AutoStat.js
*	@author		IMBA
*	@desc		Automatically allocate stat points
*/

var AutoStat = new function () {
	this.statBuildOrder = [];
	this.save = 0;
	this.block = 0;
	this.bulkStat = true;

	/*	statBuildOrder - array of stat points to spend in order
		save - remaining stat points that will not be spent and saved.
		block - an integer value set to desired block chance. This is ignored in classic.
		bulkStat - set true to spend multiple stat points at once (up to 100), or false to spend 1 point at a time.

		statBuildOrder Settings
		The script will stat in the order of precedence. You may want to stat strength or dexterity first.

		Set stats to desired integer value, and it will stat *hard points up to the desired value.
		You can also set to string value "all", and it will spend all the remaining points.
		Dexterity can be set to "block" and it will stat dexterity up the the desired block value specified in arguemnt (ignored in classic).

		statBuildOrder = [
			["strength", 25], ["energy", 75], ["vitality", 75],
			["strength", 55], ["vitality", "all"]
		];
	*/

	this.getBlock = function () {
		var shield = false,
			item = me.getItem(-1, 1);

		// make sure character has shield equipped
		if (item) {
			do {
				if ([4, 5].indexOf(item.bodylocation) > -1 && [2, 51, 69, 70].indexOf(item.itemType) > -1) {
					shield = true;
				}
			} while (item.getNext());
		}

		if (!shield) {
			return this.block;
		}

		// cast holy shield if available
		if (me.getSkill(117, 0) && !me.getState(101)) {
			if (Precast.precastSkill(117)) {
				delay(1000);
			} else {
				return this.block;
			}
		}

		if (me.gametype === 0) { // classic
			return Math.floor(me.getStat(20) + getBaseStat(15, me.classid, 23));
		}

		return Math.min(75, Math.floor((me.getStat(20) + getBaseStat(15, me.classid, 23)) * (me.getStat(2) - 15) / (me.charlvl * 2)));
	};

	// this check may not be necessary with this.validItem(), but consider it double check
	this.verifySetStats = function (unit, type, stats) { //verify that the set bonuses are there
		var i, temp, string;

		if (type === 0) {
			string = 3473 //to strength
		} else {
			string = 3474 //to dexterity
		}

		if (unit) {
			temp = unit.description.split("\n");

			for (i = 0; i < temp.length; i += 1) {
				if (temp[i].match(getLocaleString(string), "i")) {
					if (parseInt(temp[i].replace(/(y|ÿ)c[0-9!"+<;.*]/, ""), 10) === stats) {
						return true;
					}
				}
			}
		}

		return false;
	};

	this.validItem = function (item) {
		// ignore item bonuses from secondary weapon slot
		if (me.gametype === 1 && [11, 12].indexOf(item.bodylocation) > -1) {
			return false;
		}

		// check if character meets str, dex, and level requirement since stat bonuses only apply when they are active
		return me.getStat(0) >= item.strreq && me.getStat(2) >= item.dexreq && me.charlvl >= item.lvlreq;
	};

	this.setBonus = function (type) { //get stats from set bonuses
		if (type === 1 || type === 3) { //set bonuses do not have energy or vitality (we can ignore this)
			return 0;
		}

		var sets = { //these are the only sets with possible stat bonuses
			"angelic": [], "artic": [], "civerb": [], "iratha": [],
			"isenhart": [], "vidala": [], "cowking": [], "disciple": [],
			"griswold": [], "mavina": [], "naj": [], "orphan": []
		};

		var i, j, setStat = 0,
			items = me.getItems();

		if (items) {
			for (i = 0; i < items.length; i += 1) {
				if (items[i].mode === 1 && items[i].quality === 5 && this.validItem(items[i])) {
idSwitch:
					switch (items[i].classid) {
					case 311: //crown
						if (items[i].getStat(41) === 30) { //light resist
							sets.iratha.push(items[i]);
						}

						break;
					case 337: //light gauntlet
						if (items[i].getStat(7) === 20) { //life
							sets.artic.push(items[i]);
						} else if (items[i].getStat(43) === 30) { //cold resist
							sets.iratha.push(items[i]);
						}

						break;
					case 340: //heavy boots
						if (items[i].getStat(2) === 20) { //dexterity
							sets.cowking.push(items[i]);
						}

						break;
					case 347: //heavy belt
						if (items[i].getStat(21) === 5) { //min damage
							sets.iratha.push(items[i]);
						}

						break;
					case 520: //amulet
						if (items[i].getStat(114) === 20) { //damage to mana
							sets.angelic.push(items[i]);
						} else if (items[i].getStat(74) === 4) { //replenish life
							sets.civerb.push(items[i]);
						} else if (items[i].getStat(110) === 75) { //poison length reduced
							sets.iratha.push(items[i]);
						} else if (items[i].getStat(43) === 20) { //cold resist
							sets.vidala.push(items[i]);
						} else if (items[i].getStat(43) === 18) { //cold resist
							sets.disciple.push(items[i]);
						}

						break;
					case 522: //ring
						if (items[i].getStat(74) === 6) { //replenish life
							for (j = 0; j < sets.angelic.length; j += 1) { //do not count ring twice
								if (sets.angelic[j].classid === items[i].classid) {
									break idSwitch;
								}
							}

							sets.angelic.push(items[i]);
						}

						break;
					case 27: //sabre
						for (j = 0; j < sets.angelic.length; j += 1) { //do not count twice in case of dual wield
							if (sets.angelic[j].classid === items[i].classid) {
								break idSwitch;
							}
						}

						sets.angelic.push(items[i]);

						break;
					case 317: //ring mail
						sets.angelic.push(items[i]);

						break;
					case 74: //short war bow
					case 313: //quilted armor
					case 345: //light belt
						sets.artic.push(items[i]);

						break;
					case 16: //grand scepter
						for (j = 0; j < sets.civerb.length; j += 1) { //do not count twice in case of dual wield
							if (sets.civerb[j].classid === items[i].classid) {
								break idSwitch;
							}
						}

						sets.civerb.push(items[i]);

						break;
					case 330:
						sets.civerb.push(items[i]);

						break;
					case 30: //broad sword
						for (j = 0; j < sets.isenhart.length; j += 1) { //do not count twice in case of dual wield
							if (sets.isenhart[j].classid === items[i].classid) {
								break idSwitch;
							}
						}

						sets.isenhart.push(items[i]);

						break;
					case 309: //full helm
					case 320: //breast plate
					case 333: //gothic shield
						sets.isenhart.push(items[i]);

						break;
					case 73: //long battle bow
					case 314: //leather armor
					case 342: //light plated boots
						sets.vidala.push(items[i]);

						break;
					case 316: //studded leather
					case 352: //war hat
						sets.cowking.push(items[i]);

						break;
					case 385: //demonhide boots
					case 429: //dusk shroud
					case 450: //bramble mitts
					case 462: //mithril coil
						sets.disciple.push(items[i]);

						break;
					case 213: //caduceus
						for (j = 0; j < sets.griswold.length; j += 1) { //do not count twice in case of dual wield
							if (sets.griswold[j].classid === items[i].classid) {
								break idSwitch;
							}
						}

						sets.griswold.push(items[i]);

						break;
					case 372: //ornate plate
					case 427: //corona
					case 502: //vortex shield
						sets.griswold.push(items[i]);

						break;
					case 302: //grand matron bow
					case 383: //battle gauntlets
					case 391: //sharkskin belt
					case 421: //diadem
					case 439: //kraken shell
						sets.mavina.push(items[i]);

						break;
					case 261: //elder staff
					case 418: //circlet
					case 438: //hellforge plate
						sets.naj.push(items[i]);

						break;
					case 356: //winged helm
					case 375: //round shield
					case 381: //sharkskin gloves
					case 393: //battle belt
						sets.orphan.push(items[i]);

						break;
					}
				}
			}
		}

		for (i in sets) {
			if (sets.hasOwnProperty(i)) {
MainSwitch:
				switch (i) {
				case "angelic":
					if (sets[i].length >= 2 && type === 2) {
						for (j = 0; j < sets[i].length; j += 1) {
							if (!this.verifySetStats(sets[i][j], type, 10)) {
								break MainSwitch;
							}
						}

						setStat += 10;
					}

					break;
				case "artic":
					if (sets[i].length >= 2 && type === 0) {
						for (j = 0; j < sets[i].length; j += 1) {
							if (!this.verifySetStats(sets[i][j], type, 5)) {
								break MainSwitch;
							}
						}

						setStat += 5;
					}

					break;
				case "civerb":
					if (sets[i].length === 3 && type === 0) {
						for (j = 0; j < sets[i].length; j += 1) {
							if (!this.verifySetStats(sets[i][j], type, 15)) {
								break MainSwitch;
							}
						}

						setStat += 15;
					}

					break;
				case "iratha":
					if (sets[i].length === 4 && type === 2) {
						for (j = 0; j < sets[i].length; j += 1) {
							if (!this.verifySetStats(sets[i][j], type, 15)) {
								break MainSwitch;
							}
						}

						setStat += 15;
					}

					break;
				case "isenhart":
					if (sets[i].length >= 2 && type === 0) {
						for (j = 0; j < sets[i].length; j += 1) {
							if (!this.verifySetStats(sets[i][j], type, 10)) {
								break MainSwitch;
							}
						}

						setStat += 10;
					}

					if (sets[i].length >= 3 && type === 2) {
						for (j = 0; j < sets[i].length; j += 1) {
							if (!this.verifySetStats(sets[i][j], type, 10)) {
								break MainSwitch;
							}
						}

						setStat += 10;
					}

					break;
				case "vidala":
					if (sets[i].length >= 3 && type === 2) {
						for (j = 0; j < sets[i].length; j += 1) {
							if (!this.verifySetStats(sets[i][j], type, 15)) {
								break MainSwitch;
							}
						}

						setStat += 15;
					}

					if (sets[i].length === 4 && type === 0) {
						for (j = 0; j < sets[i].length; j += 1) {
							if (!this.verifySetStats(sets[i][j], type, 10)) {
								break MainSwitch;
							}
						}

						setStat += 10;
					}

					break;
				case "cowking":
					if (sets[i].length === 3 && type === 0) {
						for (j = 0; j < sets[i].length; j += 1) {
							if (!this.verifySetStats(sets[i][j], type, 20)) {
								break MainSwitch;
							}
						}

						setStat += 20;
					}

					break;
				case "disciple":
					if (sets[i].length >= 4 && type === 0) {
						for (j = 0; j < sets[i].length; j += 1) {
							if (!this.verifySetStats(sets[i][j], type, 10)) {
								break MainSwitch;
							}
						}

						setStat += 10;
					}

					break;
				case "griswold":
					if (sets[i].length >= 2 && type === 0) {
						for (j = 0; j < sets[i].length; j += 1) {
							if (!this.verifySetStats(sets[i][j], type, 20)) {
								break MainSwitch;
							}
						}

						setStat += 20;
					}

					if (sets[i].length >= 3 && type === 2) {
						for (j = 0; j < sets[i].length; j += 1) {
							if (!this.verifySetStats(sets[i][j], type, 30)) {
								break MainSwitch;
							}
						}

						setStat += 30;
					}

					break;
				case "mavina":
					if (sets[i].length >= 2 && type === 0) {
						for (j = 0; j < sets[i].length; j += 1) {
							if (!this.verifySetStats(sets[i][j], type, 20)) {
								break MainSwitch;
							}
						}

						setStat += 20;
					}

					if (sets[i].length >= 3 && type === 2) {
						for (j = 0; j < sets[i].length; j += 1) {
							if (!this.verifySetStats(sets[i][j], type, 30)) {
								break MainSwitch;
							}
						}

						setStat += 30;
					}

					break;
				case "naj":
					if (sets[i].length === 3 && type === 2) {
						for (j = 0; j < sets[i].length; j += 1) {
							if (!this.verifySetStats(sets[i][j], type, 15)) {
								break MainSwitch;
							}
						}

						setStat += 15;
					}

					if (sets[i].length === 3 && type === 0) {
						for (j = 0; j < sets[i].length; j += 1) {
							if (!this.verifySetStats(sets[i][j], type, 20)) {
								break MainSwitch;
							}
						}

						setStat += 20;
					}

					break;
				case "orphan":
					if (sets[i].length === 4 && type === 2) {
						for (j = 0; j < sets[i].length; j += 1) {
							if (!this.verifySetStats(sets[i][j], type, 10)) {
								break MainSwitch;
							}
						}

						setStat += 10;
					}

					if (sets[i].length === 4 && type === 0) {
						for (j = 0; j < sets[i].length; j += 1) {
							if (!this.verifySetStats(sets[i][j], type, 20)) {
								break MainSwitch;
							}
						}

						setStat += 20;
					}

					break;
				}
			}
		}

		return setStat;
	};

	this.getHardStats = function (type) { // return stat values excluding stat bonuses from sets and/or items
		var i, statID,
			addedStat = 0,
			items = me.getItems();

		switch (type) {
		case 0: // strength
			type = 0;
			statID = 220;

			break;
		case 1: // energy
			type = 1;
			statID = 222;

			break;
		case 2: // dexterity
			type = 2;
			statID = 221;

			break;
		case 3: // vitality
			type = 3;
			statID = 223;

			break;
		}

		if (items) {
			for (i = 0; i < items.length; i += 1) {
				// items equipped or charms in inventory
				if ((items[i].mode === 1 || (items[i].location === 3 && [82, 83, 84].indexOf(items[i].itemType) > -1)) && this.validItem(items[i])) {
					// stats
					if (items[i].getStat(type)) {
						addedStat += items[i].getStat(type);
					}

					// stats per level
					if (items[i].getStat(statID)) {
						addedStat += Math.floor(items[i].getStat(statID) / 8 * me.charlvl);
					}
				}
			}
		}

		return (me.getStat(type) - addedStat - this.setBonus(type));
	};

	this.requiredDex = function () {
		var i, set = false,
			inactiveDex = 0,
			items = me.getItems();

		if (items) {
			for (i = 0; i < items.length; i += 1) {
				// items equipped but inactive (these are possible dex sources unseen by me.getStat(2))
				if (items[i].mode === 1 && [11, 12].indexOf(items[i].bodylocation) === -1 && !this.validItem(items[i])) {
					if (items[i].quality === 5) {
						set = true;

						break;
					}

					// stats
					if (items[i].getStat(2)) {
						inactiveDex += items[i].getStat(2);
					}

					// stats per level
					if (items[i].getStat(221)) {
						inactiveDex += Math.floor(items[i].getStat(221) / 8 * me.charlvl);
					}
				}
			}
		}

		// just stat 1 at a time if there's set item (there could be dex bonus for currently inactive set)
		if (set) {
			return 1;
		}

		// returns amount of dexterity required to get the desired block chance
		return Math.ceil((2 * me.charlvl * this.block) / (me.getStat(20) + getBaseStat(15, me.classid, 23)) + 15) - me.getStat(2) - inactiveDex;
	};

	this.useStats = function (type, goal = false) {
		var currStat = me.getStat(4),
			tick = getTickCount(),
			statIDToString = [getLocaleString(4060), getLocaleString(4069), getLocaleString(4062), getLocaleString(4066)];

		// use 0x3a packet to spend multiple stat points at once (up to 100)
		if (this.bulkStat) {
			if (goal) {
				sendPacket(1, 0x3a, 1, type, 1, Math.min(me.getStat(4) - this.save - 1, goal - 1, 99));
			} else {
				sendPacket(1, 0x3a, 1, type, 1, Math.min(me.getStat(4) - this.save - 1, 99));
			}
		} else {
			useStatPoint(type);
		}

		while (getTickCount() - tick < 3000) {
			if (currStat > me.getStat(4)) {
				print("AutoStat: Using " + (currStat - me.getStat(4)) + " stat points in " + statIDToString[type]);
				return true;
			}

			delay(100);
		}

		return false;
	};

	this.addStatPoint = function () {
		var i, hardStats;

		this.remaining = me.getStat(4);

		for (i = 0; i < this.statBuildOrder.length; i += 1) {
			switch (this.statBuildOrder[i][0]) {
			case 0:
			case "s":
			case "str":
			case "strength":
				if (typeof this.statBuildOrder[i][1] === "string") {
					switch (this.statBuildOrder[i][1]) {
					case "all":
						return this.useStats(0);
					default:
						break;
					}
				} else {
					hardStats = this.getHardStats(0);

					if (hardStats < this.statBuildOrder[i][1]) {
						return this.useStats(0, this.statBuildOrder[i][1] - hardStats);
					}
				}

				break;
			case 1:
			case "e":
			case "enr":
			case "energy":
				if (typeof this.statBuildOrder[i][1] === "string") {
					switch (this.statBuildOrder[i][1]) {
					case "all":
						return this.useStats(1);
					default:
						break;
					}
				} else {
					hardStats = this.getHardStats(1);

					if (hardStats < this.statBuildOrder[i][1]) {
						return this.useStats(1, this.statBuildOrder[i][1] - hardStats);
					}
				}

				break;
			case 2:
			case "d":
			case "dex":
			case "dexterity":
				if (typeof this.statBuildOrder[i][1] === "string") {
					switch (this.statBuildOrder[i][1]) {
					case "block":
						if (me.gametype === 1) {
							if (this.getBlock() < this.block) {
								return this.useStats(2, this.requiredDex());
							}
						}

						break;
					case "all":
						return this.useStats(2);
					default:
						break;
					}
				} else {
					hardStats = this.getHardStats(2);

					if (hardStats < this.statBuildOrder[i][1]) {
						return this.useStats(2, this.statBuildOrder[i][1] - hardStats);
					}
				}

				break;
			case 3:
			case "v":
			case "vit":
			case "vitality":
				if (typeof this.statBuildOrder[i][1] === "string") {
					switch (this.statBuildOrder[i][1]) {
					case "all":
						return this.useStats(3);
					default:
						break;
					}
				} else {
					hardStats = this.getHardStats(3);

					if (hardStats < this.statBuildOrder[i][1]) {
						return this.useStats(3, this.statBuildOrder[i][1] - hardStats);
					}
				}

				break;
			}
		}

		return false;
	};

	this.remaining = 0;
	this.count = 0;

	this.init = function (statBuildOrder, save = 0, block = 0, bulkStat = true) {
		this.statBuildOrder = statBuildOrder;
		this.save = save;
		this.block = block;
		this.bulkStat = bulkStat;

		if (!this.statBuildOrder || !this.statBuildOrder.length) {
			print("AutoStat: No build array specified");

			return false;
		}

		while (me.getStat(4) > this.save) {
			this.addStatPoint();
			delay(150 + me.ping); // spending multiple single stat at a time with short delay may cause r/d

			// break out of loop if we have stat points available but finished allocating as configured
			if (me.getStat(4) === this.remaining) {
				this.count += 1;
			}

			if (this.count > 2) {
				break;
			}
		}

		print("AutoStat: Finished allocating stat points");

		return true;
	};

	return true;
};