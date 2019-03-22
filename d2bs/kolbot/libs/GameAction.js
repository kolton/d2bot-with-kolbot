/**
*	@filename	GameAction.js
*	@author		noah-@github.com
*	@desc		Perform task based actions specified by Profile Tag
*/

var GameAction = {
	LogNames: true, // Put account/character name on the picture
	LogItemLevel: true, // Add item level to the picture
	LogEquipped: false, // include equipped items
	LogMerc: false, // include items merc has equipped (if alive)
	SaveScreenShot: false, // Save pictures in jpg format (saved in 'Images' folder)
	IngameTime: 60, // Time to wait after leaving game

	// don't edit
	init: function (task) {
		this.task = JSON.parse(task);

		if (this.task["data"] && typeof this.task.data === 'string') {
			this.task.data = JSON.parse(this.task.data);
		}

		return true;
	},

	update: function (action, data) {
		if (typeof action !== 'string') {
			throw new Error("Action must be a string!");
		}

		if (typeof data !== 'string') {
			data = JSON.stringify(data);
		}

		D2Bot.printToConsole(data);

		var tag = JSON.parse(JSON.stringify(this.task)); // deep copy
		tag.action = action;
		tag.data = data;
		D2Bot.setTag(tag);
	},

	gameInfo: function () {
		var gi = { gameName: null, gamePass: null };

		switch (this.task.action) {
		case "doMule":
			gi = null;
			break; // create random game
		case "doDrop":
			gi.gameName = this.task.data.gameName;
			gi.gamePass = this.task.data.gamePass;
			break; // join game
		default:
			gi = null;
			break;
		}

		return gi;
	},

	getLogin: function () {
		var li = { realm: null, account: null, password: null };

		if (this.task && this.task.data) {
			li.password = this.load(this.task.hash);
		}

		// drop specific object
		if  (this.task.data["items"] && this.task.data.items.length > 0) {
			li.realm = this.task.data.items[0].realm
			li.account = this.task.data.items[0].account;
		}

		// mule log specific objects
		if  (this.task.data["realm"]) {
			li.realm = this.task.data.realm;
		}

		if  (this.task.data["account"]) {
			li.account = this.task.data.account;
		}

		if (!li.password || !li.account || !li.realm) {
			this.update("done", "Realm, Account, or Password was invalid!");
			D2Bot.stop();
			delay(500);
		}

		return li;
	},

	getCharacters: function () {
		var i = 0;
		var chars = [];

		// drop specific object
		if  (this.task.data["items"]) {
			for (i = 0; i < this.task.data.items.length; i += 1) {
				if (chars.indexOf(this.task.data.items[i].character) === -1) {
					chars.push(this.task.data.items[i].character);
				}
			}
		}

		// mule log specific object
		if  (this.task.data["chars"]) {
			chars = this.task.data.chars;
		}

		return chars;
	},

	getItemDesc: function (unit, logIlvl) {
		var i, desc, index,
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
				// Add color info
				if (!desc[i].match(/^(y|ÿ)c/)) {
					desc[i] = stringColor + desc[i];
				}

				// Find and store new color info
				index = desc[i].lastIndexOf("ÿc");

				if (index > -1) {
					stringColor = desc[i].substring(index, index + "ÿ".length + 2);
				}
			}

			desc[i] = desc[i].replace(/(y|ÿ)c([0-9!"+<:;.*])/g, "\\xffc$2").replace("ÿ", "\\xff", "g");
		}

		if (logIlvl && desc[desc.length - 1]) {
			desc[desc.length - 1] = desc[desc.length - 1].trim() + " (" + unit.ilvl + ")";
		}

		desc = desc.reverse().join("\\n");

		return desc;
	},

	inGameCheck: function () {
		if (getScript("D2BotGameAction.dbj")) {
			while (!this["task"]) {
				D2Bot.getProfile();
				delay(500);
			}

			switch (this.task.action) {
			case "doMule":
				this.logChar();
				break;
			case "doDrop":
				this.dropItems(this.task.data.items);
				this.logChar();
				break;
			default:
				break;
			}

			while ((getTickCount() - me.gamestarttime) < this.IngameTime * 1000) {
				delay(1000);
			}

			quit();

			return true;
		}

		return false;
	},

	load: function (hash) {
		var filename = "data/secure/" + hash + ".txt";

		if (!FileTools.exists(filename)) {
			this.update("done", "File " + filename + " does not exist!");
			D2Bot.stop();
			delay(5000);
			quitGame();
		}

		return FileTools.readText(filename);
	},

	save: function (hash, data) {
		var filename = "data/secure/" + hash + ".txt";
		FileTools.writeText(filename, data);
	},

	dropItems: function (droplist) {
		if (!droplist) {
			return;
		}

		while (!me.gameReady) {
			delay(100);
		}

		var i, items = me.getItems();

		if (!items || !items.length) {
			return;
		}

		for (i = 0; i < droplist.length; i += 1) {
			if (droplist[i].character !== me.charname) {
				continue;
			}

			var info = droplist[i].itemid.split(":");//":" + unit.classid + ":" + unit.location + ":" + unit.x + ":" + unit.y;

			var classid = info[1];
			var loc = info[2];
			var unitX = info[3];
			var unitY = info[4];

			// for debug purposes
			print("classid: " + classid + " location: " + loc + " X: " + unitX + " Y: " + unitY);

			for (var j = 0; j < items.length; j += 1) {
				if (items[j].classid.toString() === classid &&  items[j].location.toString() === loc &&  items[j].x.toString() === unitX && items[j].y.toString() === unitY) {
					items[j].drop();
				}
			}
		}
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
			name = unit.itemType + "_" + unit.fname.split("\n").reverse().join(" ").replace(/(y|ÿ)c[0-9!"+<:;.*]|\/|\\/g, "").trim();

		desc = this.getItemDesc(unit, logIlvl) + "$" + unit.gid + ":" + unit.classid + ":" + unit.location + ":" + unit.x + ":" + unit.y + (unit.getFlag(0x400000) ? ":eth" : "");
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
				if (unit.code === getBaseStat(17, i, 4).trim() && unit.fname.split("\n").reverse()[0].indexOf(getLocaleString(getBaseStat(17, i, 2))) > -1) {
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

		items.sort(function (a, b) { return b.itemType - a.itemType; });

		for (i = 0; i < items.length; i += 1) {
			if (this.LogEquipped || (!this.LogEquipped && items[i].mode === 0)) {
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

		// hcl = hardcore class ladder
		// sen = softcore expan nonladder
		FileTools.writeText("mules/" + realm + "/" + me.account + "/" + me.name + "." + ( me.playertype ? "h" : "s" ) + (me.gametype ? "e" : "c" ) + ( me.ladder > 0 ? "l" : "n" ) + ".txt", finalString);
		print("Item logging done.");
	}
};
