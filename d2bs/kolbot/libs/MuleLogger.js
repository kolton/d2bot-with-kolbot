/**
*	@filename	MuleLogger.js
*	@author		kolton
*	@desc		Log items on configurable accounts/characters
*/

var MuleLogger = {
	LogAccounts: {
		/* Format: 
			"account1/password1/realm": ["charname1", "charname2 etc"],
			"account2/password2/realm": ["charnameX", "charnameY etc"],
			"account3/password3/realm": ["all"]

			To log a full account, put "accountname/password/realm": ["all"]

			realm = useast, uswest, europe or asia
		*/

		"account/password/realm": ["all"]
	},

	LogGame: ["muleloggame", "password"], // ["gamename", "password"]
	LogNames: true, // Put account/character name on the picture
	LogItemLevel: true, // Add item level to the picture
	SaveScreenShot: false, // Save pictures in jpg format (saved in 'Images' folder)
	IngameTime: 20, // Time to wait after leaving game

	// don't edit
	getItemDesc: function (unit) {
		var i, code, desc,
			stringColor = "",
			gid = "",
			header = "",
			name = unit.fname.split("\n").reverse().join(" ").replace(/ÿc[0-9!"+<;.*]|^ /, "");

		desc = unit.description.split("\n");

		// Lines are normally in reverse. Add color tags if needed and reverse order.
		for (i = 0; i < desc.length; i += 1) {
			if (desc[i].match(/^ÿ/)) {
				stringColor = desc[i].substring(0, 3);
			} else {
				desc[i] = stringColor + desc[i];
			}

			// process line for d2bot
			desc[i] = desc[i].replace("ÿ", "\\xff").replace("\xFF", "\\xff");
		}

		desc = desc.reverse().join("\\n");

		if (this.LogItemLevel) {
			desc += ("\\n\\xffc0Item Level: " + unit.ilvl);
		}

		code = getBaseStat(0, unit.classid, 'normcode') || unit.code;
		code = code.replace(" ", "");

		if ([10, 12, 58, 82, 83, 84].indexOf(unit.itemType) > -1) {
			code += (unit.gfx + 1);
		}

		if (this.LogNames && me.account) {
			header = me.account + " / " + me.name;
		}

		// d2bot# optimization for runes, gems and set/unique items
		if ([5, 7].indexOf(unit.quality) > -1 || [74, 96, 97, 98, 99, 100, 101, 102].indexOf(unit.itemType) > -1) {
			gid = unit.gid;
		}

		return (name + "$" + desc + "$" + code + "$" + header + "$" + gid);
	},

	logChar: function () {
		while (!me.gameReady) {
			delay(500);
		}

		var i, folder,
			items = me.getItems(),
			color = -1,
			realm = me.realm || "Single Player",
			finalString = "",
			screenShot = "";

		if (!FileTools.exists("mules/" + realm)) {
			folder = dopen("mules");

			folder.create(realm);
		}

		if (!FileTools.exists("mules/" + realm + "/" + me.account)) {
			folder = dopen("mules/" + realm);

			folder.create(me.account);
		}

		if (!items.length) {
			return;
		}

		for (i = 0; i < items.length; i += 1) {
			if (items[i].mode === 0) {
				color = items[i].getColor();
				finalString += (this.getItemDesc(items[i]) + ";" + "0" + ";" + color + "\n");

				if (this.SaveScreenShot) {
					screenShot = items[i].itemType + this.getItemDesc(items[i]) + ";" + color;
					sendCopyData(null, "D2Bot #", 0, "saveItem;" + screenShot);
					delay(500);
				}
			}
		}

		FileTools.writeText("mules/" + realm + "/" + me.account + "/" + me.name + ".txt", finalString);
	}
};