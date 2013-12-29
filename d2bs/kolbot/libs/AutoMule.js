var AutoMule = {
	Mules: {
		"Mule1":  {
			muleProfile: "",  // The name of mule profile in d2bot#. It will be started and stopped when needed.
			accountPrefix: "",  // Account prefix. Numbers added automatically when making accounts.
			accountPassword: "",  // Account password.
			charPrefix: "",  // Character prefix. Suffix added automatically when making characters.
			realm: "", // Available options: "useast", "uswest", "europe", "asia"
			expansion: true,
			ladder: true,
			hardcore: false,

			// Game name and password of the mule game. Never use the same game name as for mule logger.
			muleGameName: ["", ""], // ["gamename", "password"]

			// List of profiles that will mule items. Example: enabledProfiles: ["profile 1", "profile 2"],
			enabledProfiles: [""],

			// Stop a profile prior to muling. Useful when running 8 bots without proxies.
			stopProfile: "",

			// Trigger muling at the end of a game if used space in stash and inventory is equal to or more than given percent.
			// Both conditions need to be met in order to trigger muling.
			usedStashTrigger: 80,
			usedInventoryTrigger: 80
		}
	},

	TorchMules: {
		"Mule1":  {
			muleProfile: "",  // The name of mule profile in d2bot#. It will be started and stopped when needed.
			accountPrefix: "",  // Account prefix. Numbers added automatically when making accounts.
			accountPassword: "",  // Account password.
			charPrefix: "",  // Character prefix. Suffix added automatically when making characters.
			realm: "", // Available options: "useast", "uswest", "europe", "asia"
			expansion: true,
			ladder: true,
			hardcore: false,

			// Game name and password of the mule game. Never use the same game name as for mule logger.
			muleGameName: ["", ""], // ["gamename", "password"]

			// List of profiles that will mule items. Example: enabledProfiles: ["profile 1", "profile 2"],
			enabledProfiles: [""],

			// Stop a profile prior to muling. Useful when running 8 bots without proxies.
			stopProfile: ""
		}
//##########################################################################################
	},

	inGame: false,
	check: false,
	torchCheck: false,

	// *** Master functions ***
	getInfo: function () {
		var i, j, info;

		for (i in this.Mules) {
			if (this.Mules.hasOwnProperty(i)) {
				for (j = 0; j < this.Mules[i].enabledProfiles.length; j += 1) {
					if (this.Mules[i].enabledProfiles[j].toLowerCase() === me.profile.toLowerCase()) {
						if (!info) {
							info = {};
						}

						info.muleInfo = this.Mules[i];
					}
				}
			}
		}

		for (i in this.TorchMules) {
			if (this.TorchMules.hasOwnProperty(i)) {
				for (j = 0; j < this.TorchMules[i].enabledProfiles.length; j += 1) {
					if (this.TorchMules[i].enabledProfiles[j].toLowerCase() === me.profile.toLowerCase()) {
						if (!info) {
							info = {};
						}

						info.torchMuleInfo = this.TorchMules[i];
					}
				}
			}
		}

		return info;
	},

	muleCheck: function () {
		var info = this.getInfo();

		if (info && info.hasOwnProperty("muleInfo") && info.muleInfo.hasOwnProperty("usedStashTrigger") && info.muleInfo.hasOwnProperty("usedInventoryTrigger") &&
				Storage.Inventory.UsedSpacePercent() >= info.muleInfo.usedInventoryTrigger && Storage.Stash.UsedSpacePercent() >= info.muleInfo.usedStashTrigger &&
					this.getMuleItems().length > 0) {
			D2Bot.printToConsole("MuleCheck triggered!", 7);

			return true;
		}

		return false;
	},

	getMule: function () {
		var info;

		info = this.getInfo();

		if (info) {
			if (this.check && info.hasOwnProperty("muleInfo")) {
				return info.muleInfo;
			}

			if (this.torchCheck && info.hasOwnProperty("torchMuleInfo")) {
				return info.torchMuleInfo;
			}
		}

		return false;
	},

	outOfGameCheck: function () {
		if (!this.check && !this.torchCheck) {
			return false;
		}

		var muleObj,
			stopCheck = false,
			muleInfo = {status: ""},
			failCount = 0;

		muleObj = this.getMule();

		if (!muleObj) {
			return false;
		}

		function MuleCheckEvent(mode, msg) {
			if (mode === 10) {
				muleInfo = JSON.parse(msg);
			}
		}

		addEventListener("copydata", MuleCheckEvent);
		D2Bot.printToConsole("Starting" + (this.torchCheck ? " torch " : " ")  + "mule profile: " + muleObj.muleProfile, 7);

MainLoop:
		while (true) {
			// If nothing received our copy data start the mule profile
			if (!sendCopyData(null, muleObj.muleProfile, 10, JSON.stringify({profile: me.profile, mode: this.torchCheck ? 1 : 0}))) {
				D2Bot.start(muleObj.muleProfile);
			}

			delay(1000);

			switch (muleInfo.status) {
			case "loading":
				if (!stopCheck && muleObj.stopProfile && me.profile.toLowerCase() !== muleObj.stopProfile.toLowerCase()) {
					D2Bot.stop(muleObj.stopProfile);

					stopCheck = true;
				}

				failCount += 1;

				break;
			case "busy":
			case "begin":
				D2Bot.printToConsole("Mule profile is busy.", 9);

				break MainLoop;
			case "ready":
				var control = getControl(6, 652, 469, 120, 20);

				if (control) {
					delay(200);
					control.click();
				}

				delay(2000);

				this.inGame = true;
				me.blockMouse = true;

				joinGame(muleObj.muleGameName[0], muleObj.muleGameName[1]);

				me.blockMouse = false;

				delay(5000);

				break MainLoop;
			default:
				failCount += 1;

				break;
			}

			if (failCount >= 60) {
				D2Bot.printToConsole("No response from mule profile.", 9);

				break;
			}
		}

		removeEventListener("copydata", MuleCheckEvent);

		while (me.ingame) {
			delay(1000);
		}

		this.inGame = false;
		this.check = false;
		this.torchCheck = false;

		// No response - stop mule profile
		if (failCount >= 60) {
			D2Bot.stop(muleObj.muleProfile);
			delay(1000);
		}

		if (stopCheck && muleObj.stopProfile) {
			D2Bot.start(muleObj.stopProfile);
		}

		return true;
	},

	inGameCheck: function () {
		var muleObj, tick, info,
			timeout = 150 * 1000, // Ingame mule timeout
			status = "muling";

		// Single player
		if (!me.gamename) {
			return false;
		}

		info = this.getInfo();

		// Profile is not a part of AutoMule
		if (!info) {
			return false;
		}

		// Profile is not in mule or torch mule game
		if (!((info.hasOwnProperty("muleInfo") && me.gamename.toLowerCase() === info.muleInfo.muleGameName[0].toLowerCase()) ||
				(info.hasOwnProperty("torchMuleInfo") && me.gamename.toLowerCase() === info.torchMuleInfo.muleGameName[0].toLowerCase()))) {
			return false;
		}

		function DropStatusEvent(mode, msg) {
			if (mode === 10) {
				switch (JSON.parse(msg).status) {
				case "report": // reply to status request
					sendCopyData(null, muleObj.muleProfile, 12, JSON.stringify({status: status}));

					break;
				case "quit": // quit command
					status = "quit";

					break;
				}
			}
		}

		function MuleModeEvent(msg) {
			switch (msg) {
			case "1":
				AutoMule.torchCheck = true;

				break;
			case "0":
				AutoMule.check = true;

				break;
			}
		}

		addEventListener("copydata", DropStatusEvent);
		addEventListener("scriptmsg", MuleModeEvent);
		scriptBroadcast("getMuleMode");
		delay(500);

		if (!this.check && !this.torchCheck) {
			print("Error - Unable to determine mule mode");
			quit();

			return false;
		}

		muleObj = this.getMule();
		me.maxgametime = 0;

		if (!Town.goToTown(1)) {
			print("Error - Failed to go to Act 1");
			quit();

			return false;
		}

		sendCopyData(null, muleObj.muleProfile, 11, "begin");

		if (this.torchCheck) {
			print("ÿc4AutoMuleÿc0: In torch mule game.");
			D2Bot.printToConsole("AutoMule: Transfering torch.", 7);
			D2Bot.updateStatus("AutoMule: In game.");
			this.dropTorch();
		} else {
			print("ÿc4AutoMuleÿc0: In mule game.");
			D2Bot.printToConsole("AutoMule: Transfering items.", 7);
			D2Bot.updateStatus("AutoMule: In game.");
			this.dropStuff();
		}

		status = "done";
		tick = getTickCount();

		while (true) {
			if (status === "quit") {
				break;
			}

			if (getTickCount() - tick > timeout) {
				D2Bot.printToConsole("Mule didn't rejoin. Picking up items.", 9);
				Pickit.pickItems();

				break;
			}

			delay(500);
		}

		removeEventListener("copydata", DropStatusEvent);
		D2Bot.stop(muleObj.muleProfile);
		delay(1000);

		if (muleObj.stopProfile) {
			D2Bot.start(muleObj.stopProfile);
		}

		if (getScript("AnniStarter.dbj")) {
			scriptBroadcast("exit");
		}

		quit();
		//delay(10000);

		return true;
	},

	dropStuff: function () {
		if (!Town.openStash()) {
			return false;
		}

		var i,
			items = this.getMuleItems();

		for (i = 0; i < items.length; i += 1) {
			items[i].drop();
		}

		delay(1000);
		me.cancel();

		return true;
	},

	// get a list of items to mule
	getMuleItems: function () {
		var items = [],
			item = me.getItem(-1, 0);

		if (item) {
			do {
				if (Town.ignoredItemTypes.indexOf(item.itemType) === -1 && Pickit.checkItem(item).result > 0 && item.classid !== 549 &&
						(item.location === 7 || (item.location === 3 && !Storage.Inventory.IsLocked(item, Config.Inventory))) &&
						[76, 77, 78].indexOf(item.itemType) === -1 && // don't drop potions
						((!TorchSystem.getFarmers() && !TorchSystem.isFarmer()) || [647, 648, 649].indexOf(item.classid) === -1) &&
						!this.cubingIngredient(item) && !this.runewordIngredient(item)) {
					items.push(copyUnit(item));
				}
			} while (item.getNext());
		}

		return items;
	},

	// check if an item is a cubing ingredient
	cubingIngredient: function (item) {
		var i;

		for (i = 0; i < Cubing.validIngredients.length; i += 1) {
			if (item.gid === Cubing.validIngredients[i].gid) {
				return true;
			}
		}

		return false;
	},

	// check if an item is a runeword ingrediend - rune, empty base or bad rolled base
	runewordIngredient: function (item) {
		if (Runewords.validGids.indexOf(item.gid) > -1) {
			return true;
		}

		if (!this.baseGids) {
			var i, base;

			this.baseGids = [];

			for (i = 0; i < Config.Runewords.length; i += 1) {
				base = Runewords.getBase(Config.Runewords[i][0], Config.Runewords[i][1]) || Runewords.getBase(Config.Runewords[i][0], Config.Runewords[i][1], true);

				if (base) {
					this.baseGids.push(base.gid);
				}
			}
		}

		if (this.baseGids.indexOf(item.gid) > -1) {
			return true;
		}

		return false;
	},

	dropTorch: function () {
		if (!Town.openStash()) {
			return false;
		}

		var item = me.getItem(getScript("AnniStarter.dbj") ? "cm1" : "cm2");

		if (item) {
			do {
				if (item.quality === 7) {
					item.drop();
					delay(1000);
					me.cancel();

					return true;
				}
			} while (item.getNext());
		}

		return false;
	},

	// *** Mule functions ***
	getMaster: function (info) {
		var i, j, k, muleObj;

		muleObj = info.mode === 1 ? this.TorchMules : this.Mules;

		for (i in muleObj) {
			if (muleObj.hasOwnProperty(i)) {
				for (j in muleObj[i]) {
					if (muleObj[i].hasOwnProperty(j) && j === "enabledProfiles") {
						for (k = 0; k < muleObj[i][j].length; k += 1) {
							if (muleObj[i][j][k].toLowerCase() === info.profile.toLowerCase()) {
								return {
									profile: muleObj[i][j][k],
									mode: info.mode
								};
							}
						}
					}
				}
			}
		}

		return false;
	},

	getMuleObject: function (mode, master) {
		var i, mule;

		mode = mode || 0;
		mule = mode === 1 ? this.TorchMules : this.Mules;

		for (i in mule) {
			if (mule.hasOwnProperty(i)) {
				if (mule[i].muleProfile && mule[i].enabledProfiles &&
						mule[i].muleProfile.toLowerCase() === me.profile.toLowerCase() && mule[i].enabledProfiles.indexOf(master) > -1) {
					return mule[i];
				}
			}
		}

		return false;
	},

	getMuleFilename: function (mode) {
		var i, mule, jsonObj, jsonStr, file;

		mode = mode || 0;
		mule = mode === 1 ? this.TorchMules : this.Mules;

		// Iterate through mule object
		for (i in mule) {
			if (mule.hasOwnProperty(i)) {
				// Mule profile matches config
				if (mule[i].muleProfile && mule[i].muleProfile.toLowerCase() === me.profile.toLowerCase()) {
					file = mode === 0 ? "logs/AutoMule." + i + ".json" : "logs/TorchMule." + i + ".json";

					// If file exists check for valid info
					if (FileTools.exists(file)) {
						try {
							jsonStr = FileTools.readText(file);
							jsonObj = JSON.parse(jsonStr);

							// Return filename containing correct mule info
							if (mule[i].accountPrefix && jsonObj.account && jsonObj.account.match(mule[i].accountPrefix)) {
								return file;
							}
						} catch (e) {
							print(e);
						}
					} else {
						return file;
					}
				}
			}
		}

		// File exists but doesn't contain valid info - remake
		FileTools.remove(file);

		return file;
	}
};