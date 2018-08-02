/**
*	@filename	MuleLogger.js
*	@author		kolton
*	@desc		Log items on configurable accounts/characters
*				+ option to perm the mules (use the 2nd line for IngameTime line ~ 32) with random moves in act 1
*/

var MuleLogger = {
	LogAccounts: {
		/* Format: 
			"account1/password1/realm": ["charname1", "charname2 etc"],
			"account2/password2/realm": ["charnameX", "charnameY etc"],
			"account3/password3/realm": ["all"]

			To log a full account, put "accountname/password/realm": ["all"]

			realm = useast, uswest, europe or asia

			Individual entries are separated with a comma.
		*/

		"accountname/password/realm": ["all"]
	},

	LogGame: ["", ""], // ["gamename", "password"]
	LogNames: false, // Put account/character name on the picture
	LogItemLevel: true, // Add item level to the picture
	LogEquipped: true, // include equipped items
	LogMerc: true, // include items merc has equipped (if alive)
	SaveScreenShot: false, // Save pictures in jpg format (saved in 'Images' folder)
	IngameTime: ((Math.random() * 30) + 180), // Time to wait in game to do not get RD
	//IngameTime: ((Math.random() * 90) + 7230), // Time to wait in game for mule perming

	// don't edit
	getItemDesc: function (unit, logIlvl) {
		var i, desc,
			stringColor = "";

		if (logIlvl === undefined) {
			logIlvl = this.LogItemLevel;
		}

		desc = unit.description.split("\n");

		// Lines are normally in reverse. Add color tags if needed and reverse order.
		for (i = 0; i < desc.length; i += 1) {
			if (desc[i].indexOf(getLocaleString(3331)) > -1) { // Remove sell value
				desc.splice(i, 1);

				i -= 1;
			} else {
				if (desc[i].match(/^(y|�)c/)) {
					stringColor = desc[i].substring(0, 3);
				} else {
					desc[i] = stringColor + desc[i];
				}
			}

			desc[i] = desc[i].replace(/(y|�)c([0-9!"+<;.*])/g, "\\xffc$2").replace("\xFF", "\\xff", "g");
		}

		if (logIlvl && desc[desc.length - 1]) {
			desc[desc.length - 1] = desc[desc.length - 1].trim() + " (" + unit.ilvl + ")";
		}

		desc = desc.reverse().join("\\n");

		return desc;
	},

	inGameCheck: function () {
		var	tick, loc, randloc,
			tick = ((Math.random() * 30) + 90); // antiidle movement trigger
			loc = ["stash", "waypoint", "portalspot", "akara", "charsi", "kashya", "cain", "gheed"];
			randloc = loc[Math.floor(Math.random() * loc.length)];

		if (getScript("D2BotMuleLog.dbj") && this.LogGame[0] && me.gamename.match(this.LogGame[0], "i")) {
			print("�c4MuleLogger�c0: Logging items on " + me.account + " - " + me.name + ".");
			D2Bot.printToConsole("MuleLogger: Logging items on " + me.account + " - " + me.name + ".", 7);
			this.logChar();
			print("�c2IngameTime �c0is set to: �c2" + parseInt(this.IngameTime) + "�c0 sec");

			delay((Math.random() * 5000) + 5000);
			Town.move(randloc);

			while ((getTickCount() - me.gamestarttime)/1000 < this.IngameTime) {
				me.overhead("�c2Log items done. �c4Stay in " + "�c4game more:�c0 " + parseInt(this.IngameTime - (getTickCount() - me.gamestarttime)/1000) + " sec");

				delay(1000);

				if ((getTickCount() - me.gamestarttime)/1000 >= tick ) { // antiidle random moves
					print("�c4AntiIdle - �c2ON �c0, moving to " + randloc);
					tick = tick + ((Math.random() * 30) + 90);
					Town.move(randloc);
				}
			}

			quit();

			return true;
		}

		return false;
	},

	// Log kept item stats in the manager.
	logItem: function (unit, logIlvl) {
		if (!isIncluded("common/misc.js")) {
			include("common/misc.js");
		}

		if (logIlvl === undefined) {
			logIlvl = this.LogItemLevel;
		}

		var i, code, desc, sock,
			header = "",
			color = -1,
			name = unit.itemType + "_" + unit.fname.split("\n").reverse().join(" ").replace(/(y|�)c[0-9!"+<;.*]|\/|\\/, "").trim();

		desc = this.getItemDesc(unit, logIlvl) + "$" + unit.gid;
		color = unit.getColor();

		switch (unit.quality) {
		case 5: // Set
			switch (unit.classid) {
			case 27: // Angelic sabre
				code = "inv9sbu";

				break;
			case 74: // Arctic short war bow
				code = "invswbu";

				break;
			case 308: // Berserker's helm
				code = "invhlmu";

				break;
			case 330: // Civerb's large shield
				code = "invlrgu";

				break;
			case 31: // Cleglaw's long sword
			case 227: // Szabi's cryptic sword
				code = "invlsdu";

				break;
			case 329: // Cleglaw's small shield
				code = "invsmlu";

				break;
			case 328: // Hsaru's buckler
				code = "invbucu";

				break;
			case 306: // Infernal cap / Sander's cap
				code = "invcapu";

				break;
			case 30: // Isenhart's broad sword
				code = "invbsdu";

				break;
			case 309: // Isenhart's full helm
				code = "invfhlu";

				break;
			case 333: // Isenhart's gothic shield
				code = "invgtsu";

				break;
			case 326: // Milabrega's ancient armor
			case 442: // Immortal King's sacred armor
				code = "invaaru";

				break;
			case 331: // Milabrega's kite shield
				code = "invkitu";

				break;
			case 332: // Sigon's tower shield
				code = "invtowu";

				break;
			case 325: // Tancred's full plate mail
				code = "invfulu";

				break;
			case 3: // Tancred's military pick
				code = "invmpiu";

				break;
			case 113: // Aldur's jagged star
				code = "invmstu";

				break;
			case 234: // Bul-Kathos' colossus blade
				code = "invgsdu";

				break;
			case 372: // Grizwold's ornate plate
				code = "invxaru";

				break;
			case 366: // Heaven's cuirass
			case 215: // Heaven's reinforced mace
			case 449: // Heaven's ward
			case 426: // Heaven's spired helm
				code = "inv" + unit.code + "s";

				break;
			case 357: // Hwanin's grand crown
				code = "invxrnu";

				break;
			case 195: // Nalya's scissors suwayyah
				code = "invskru";

				break;
			case 395: // Nalya's grim helm
			case 465: // Trang-Oul's bone visage
				code = "invbhmu";

				break;
			case 261: // Naj's elder staff
				code = "invcstu";

				break;
			case 375: // Orphan's round shield
				code = "invxmlu";

				break;
			case 12: // Sander's bone wand
				code = "invbwnu";

				break;
			}

			break;
		case 7: // Unique
			for (i = 0; i < 401; i += 1) {
				if (unit.fname.split("\n").reverse()[0].indexOf(getLocaleString(getBaseStat(17, i, 2))) > -1) {
					code = getBaseStat(17, i, "invfile");

					break;
				}
			}

			break;
		}

		if (!code) {
			if (["ci2", "ci3"].indexOf(unit.code) > -1) { // Tiara/Diadem
				code = unit.code;
			} else {
				code = getBaseStat(0, unit.classid, 'normcode') || unit.code;
			}

			code = code.replace(" ", "");

			if ([10, 12, 58, 82, 83, 84].indexOf(unit.itemType) > -1) {
				code += (unit.gfx + 1);
			}
		}

		sock = unit.getItems();

		if (sock) {
			for (i = 0; i < sock.length; i += 1) {
				if (sock[i].itemType === 58) {
					desc += "\n\n";
					desc += this.getItemDesc(sock[i]);
				}
			}
		}

		return {
			itemColor: color,
			image: code,
			title: name,
			description: desc,
			header: header,
			sockets: Misc.getItemSockets(unit)
		};
	},

	logChar: function (logIlvl, logName, saveImg) {
		while (!me.gameReady) {
			delay(100);
		}

		if (logIlvl === undefined) {
			logIlvl = this.LogItemLevel;
		}

		if (logName === undefined) {
			logName = this.LogNames;
		}

		if (saveImg === undefined) {
			saveImg = this.SaveScreenShot;
		}

		var i, folder, string, parsedItem,
			items = me.getItems(),
			realm = me.realm || "Single Player",
			merc,
			finalString = "";

		if (!FileTools.exists("mules/" + realm)) {
			folder = dopen("mules");

			folder.create(realm);
		}

		if (!FileTools.exists("mules/" + realm + "/" + me.account)) {
			folder = dopen("mules/" + realm);

			folder.create(me.account);
		}

		if (!items || !items.length) {
			return;
		}

		function itemSort(a, b) {
			return b.itemType - a.itemType;
		}

		items.sort(itemSort);

		for (i = 0; i < items.length; i += 1) {
			if (this.LogEquipped || (!this.LogEquipped && items[i].mode === 0)) {
				if (this.skipItem(items[i].classid)) {
					continue;
				}

				parsedItem = this.logItem(items[i], logIlvl);

				// Log names to saved image
				if (logName) {
					parsedItem.header = (me.account || "Single Player") + " / " + me.name;
				}

				if (saveImg) {
					D2Bot.saveItem(parsedItem);
				}

				// Always put name on Char Viewer items
				if (!parsedItem.header) {
					parsedItem.header = (me.account || "Single Player") + " / " + me.name;
				}

				// Remove itemtype_ prefix from the name
				parsedItem.title = parsedItem.title.substr(parsedItem.title.indexOf("_") + 1);

				if (items[i].mode === 1) {
					parsedItem.title += " (equipped)";
				}

				string = JSON.stringify(parsedItem);
				finalString += (string + "\n");
			}
		}

		if (this.LogMerc) {
			for (i = 0; i < 3; i += 1) {
				merc = me.getMerc();

				if (merc) {
					break;
				}

				delay(50);
			}

			if (merc) {
				items = merc.getItems();

				for (i = 0; i < items.length; i += 1) {
					parsedItem = this.logItem(items[i]);
					parsedItem.title += " (merc)";
					string = JSON.stringify(parsedItem);
					finalString += (string + "\n");

					if (this.SaveScreenShot) {
						D2Bot.saveItem(parsedItem);
					}
				}
			}
		}

		FileTools.writeText("mules/" + realm + "/" + me.account + "/" + me.name + ".txt", finalString);
		print("Item logging done.");
	},

	skipItem: function (id) {

		switch(id) {
			//case 549: // horadric cube
			case   0: // hand axe
			case  10: // wand
			case  14: // club
			case  25: // shortsword
			case  47: // javelin
			case  63: // shortstaff
			case 175: // katar
			case 328: // buckler
			case 513: // stamina potion
			case 514: // antidote potion
			case 515: // rejuvenationpotion
			case 516: // fullrejuvenationpotion
			case 517: // thawing potion
			case 518: // tomeoftownportal
			case 519: // tomeofidentify
			case 543: // key
			case 587: // minorhealingpotion
			case 588: // lighthealingpotion
			case 589: // healingpotion
			case 590: // greathealingpotion
			case 591: // superhealingpotion
			case 592: // minormanapotion
			case 593: // lightmanapotion
			case 594: // manapotion
			case 595: // greatermanapotion
			case 596: // supermanapotion
				return true;
		}
		return false;
	}
};