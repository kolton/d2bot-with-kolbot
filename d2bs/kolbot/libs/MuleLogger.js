var MuleLogger = {
	LogAccounts: {
		/* Format: 
			"account1/password1/realm": ["charname1", "charname2 etc"],
			"account2/password2/realm": ["charnameX", "charnameY etc"],
			"account3/password3/realm": ["all"]

			To log a full account, put "accountname/password/realm": ["all"]

			realm = useast, uswest, europe or asia
		*/

		"account/password/realm": ["character"]
	},

	LogGame: ["muleloggame", "password"], // ["gamename", "password"]

	IngameTime: 180,



	// don't edit
	getItemDesc: function (unit) {
		var val, code,
			gid = "",
			header = "",
			rval = "",
			color = -1,
			name = unit.fname.split("\n").reverse().join(" ").replace(/ÿc[0-9!"+<;.*]|^ /, ""),
			desc = "";

		if (unit.getFlag(0x4000000)) { // runeword
			desc += ("\\xffc4" + unit.fname.split("\n").reverse().join("\\n\\xffc5").replace(/ÿc[0-9!"+<;.*]/, "") + "\\xffc0");
		} else {
			desc += (Pickit.itemColor(unit, false).replace("ÿ", "\\xff") + unit.fname.split("\n").reverse().join("\\n").replace(/ÿc[0-9!"+<;.*]/, "") + "\\xffc0");
		}

		switch (unit.itemType) {
		case 2: // shield
		case 69: // voodoo shield
		case 70: // paladin shield
			val = unit.getStat(31);

			if (val) {
				desc += ("\\nDefense: " + val);
			}

			val = 20 + unit.getStat(20);

			switch (me.classid) {
			case 0:
			case 4:
			case 6:
				val += 5;

				break;
			case 3:
				val += 10;

				break;
			}

			desc += ("\\nChance to Block: \\xffc3" + Math.min(val, 75) + "%\\xffc0");

			if (unit.getStat(72)) {
				desc += ("\\nDurability: " + unit.getStat(72) + " of " + unit.getStat(73));
			}

			color = unit.getColor();

			break;
		case 3: // armor
		case 37: // helm
		case 71: // primal helm
		case 72: // pelt
		case 75: // circlet
		case 15: // boots
		case 16: // belt
		case 19: // gloves
			val = unit.getStat(31);

			if (val) {
				desc += ("\\nDefense: " + val);
			}

			if (unit.getStat(72)) {
				desc += ("\\nDurability: " + unit.getStat(72) + " of " + unit.getStat(73));
			}

			color = unit.getColor();

			break;
		// weapons
		case 24:
		case 25:
		case 26:
		case 28:
		case 29:
		case 30:
		case 31:
		case 32:
		case 33:
		case 34:
		case 36:
		case 67: // handtohand - claws with no staffmods
		case 68:
		case 86:
		case 87:
		case 88: // assassinclaw - claws with staffmods
			if (unit.getStat(21)) {
				desc += ("\\nOne-Hand Damage: " + unit.getStat(21) + " to " + unit.getStat(22));
			}

			if (unit.getStat(23)) {
				desc += ("\\nTwo-Hand Damage: " + unit.getStat(23) + " to " + unit.getStat(24));
			}

			if (unit.getStat(72)) {
				desc += ("\\nDurability: " + unit.getStat(72) + " of " + unit.getStat(73));
			}

			color = unit.getColor();

			break;
		// missile
		case 27:
		case 35:
		case 85:
			if (unit.getStat(23)) {
				desc += ("\\nTwo-Hand Damage: " + unit.getStat(23) + " to " + unit.getStat(24));
			}

			color = unit.getColor();

			break;
		// throwing
		case 42:
		case 43:
		case 44:
			if (unit.getStat(21)) {
				desc += ("\\nThrow Damage: " + unit.getStat(159) + " to " + unit.getStat(160));
			}

			if (unit.getStat(21)) {
				desc += ("\\nOne-Hand Damage: " + unit.getStat(21) + " to " + unit.getStat(22));
			}

			if (unit.getStat(70)) {
				desc += ("\\nQuantity: " + unit.getStat(70));
			}

			color = unit.getColor();

			break;
		default:
			break;
		}

		val = getBaseStat("items", unit.classid, 52);

		if (val) {
			desc += ("\\nRequired Strength: " + val);
		}

		val = getBaseStat("items", unit.classid, 53);

		if (val) {
			desc += ("\\nRequired Dexterity: " + val);
		}

		val = unit.getStat(92);

		if (val > 1 && unit.getFlag(0x10)) {
			desc += ("\\nRequired Level: " + val);
		}

		desc += ("\\xffc3" + unit.description.split("\n").reverse().join("\\n") + "\\xffc0");

		if (unit.getFlag(0x400000)) {
			desc += "\\n\\xffc3Ethereal (Cannot be Repaired)\\xffc0";
		}

		val = unit.getStat(194);

		if (val) {
			desc += ((unit.getFlag(0x400000) ? "\\xffc3, " : "\\n\\xffc3") + "Socketed (" + val + ")\\xffc0");
		}

		if (!unit.getFlag(0x10)) {
			desc += "\\n\\xffc1Unidentified\\xffc0";
		}

		desc += ("\\nItem Level: " + unit.ilvl);

		code = getBaseStat(0, unit.classid, 'normcode') || unit.code;
		code = code.replace(" ", "");

		if ([10, 12, 58, 82, 83, 84].indexOf(unit.itemType) > -1) {
			code += (unit.gfx + 1);
		}

		if (me.account) {
			header = me.account + " / " + me.name;
		}

		// d2bot# optimization for runes, gems and set/unique items
		if ([5, 7].indexOf(unit.quality) > -1 || [74, 96, 97, 98, 99, 100, 101, 102].indexOf(unit.itemType) > -1) {
			gid = unit.gid;
		}

		rval = (name + "$" + desc + "$" + code + "$" + header + "$" + gid + ";" + "0" + ";" + color);

		return rval;
	},

	logChar: function () {
		var i, folder,
			items = me.getItems(),
			realm = me.realm || "Single Player",
			finalString = "";

		if (!FileTools.exists("mules/" + realm)) {
			folder = dopen("mules");

			folder.create(realm);
		}

		if (!FileTools.exists("mules/" + realm + "/" + me.account)) {
			folder = dopen("mules/" + realm);

			folder.create(me.account);
		}

		for (i = 0; i < items.length; i += 1) {
			if (items[i].mode === 0) {
				finalString += (this.getItemDesc(items[i]) + "\n");
			}
		}

		FileTools.writeText("mules/" + realm + "/" + me.account + "/" + me.name + ".txt", finalString);
	}
};