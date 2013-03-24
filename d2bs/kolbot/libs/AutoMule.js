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
			stopProfile: ""
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
	},

	// Get the Mule of the current profile
	getMule: function (mode) {
		var mule, i, j, k;

		mode = mode || 0;
		mule = mode === 1 ? this.TorchMules : this.Mules;

		for (i in mule) {
			if (mule.hasOwnProperty(i)) {
				for (j in mule[i]) {
					if (mule[i].hasOwnProperty(j) && j === "enabledProfiles") {
						for (k = 0; k < mule[i][j].length; k += 1) {
							if (mule[i][j][k].toLowerCase() === me.profile.toLowerCase()) {
								// Return the Mule it belongs to
								return mule[i];
							}
						}
					}
				}
			}
		}

		return false;
	},

	// Get the item dropper for current Mule. Returns [profilename, mulemode]
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

	// Get the object for the given Mule profile
	getMuleObject: function (mode) {
		var i, j, mule;

		mode = mode || 0;
		mule = mode === 1 ? this.TorchMules : this.Mules;

		for (i in mule) {
			if (mule.hasOwnProperty(i)) {
				for (j in mule[i]) {
					if (mule[i].hasOwnProperty(j) && j === "muleProfile" && mule[i][j].toLowerCase() === me.profile.toLowerCase()) {
						return mule[i];
					}
				}
			}
		}

		return false;
	},

	getMuleFilename: function (mode) {
		var i, mule, jsonObj, jsonStr, file;

		mode = mode || 0;
		mule = mode === 1 ? this.TorchMules : this.Mules;

		for (i in mule) {
			if (mule.hasOwnProperty(i)) {
				if (mule[i].muleProfile && mule[i].muleProfile.toLowerCase() === me.profile.toLowerCase()) {
					file = mode === 0 ? "logs/AutoMule." + i + ".json" : "logs/TorchMule." + i + ".json";

					if (FileTools.exists(file)) {
						try {
							jsonStr = FileTools.readText(file);
							jsonObj = JSON.parse(jsonStr);

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

		return false;
	},

	outOfGameCheck: function (mode) {
		mode = mode || 0;

		var muleObj,
			stopCheck = false,
			muleInfo = {status: ""},
			failCount = 0;

		muleObj = this.getMule(mode);

		// Sanity check
		if (!muleObj) {
			return false;
		}

		function MuleCheckEvent(mode, msg) {
			if (mode === 10) {
				print(msg);

				muleInfo = JSON.parse(msg);
			}
		}

		addEventListener("copydata", MuleCheckEvent);
		D2Bot.printToConsole("Starting" + (mode === 1 ? " torch " : " ")  + "mule profile: " + muleObj.muleProfile, 7);

MainLoop:
		while (true) {
			// If nothing received our copy data start the mule profile
			if (!sendCopyData(null, muleObj.muleProfile, 10, JSON.stringify({profile: me.profile, mode: mode}))) {
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
				delay(2000);
				joinGame(muleObj.muleGameName[0], muleObj.muleGameName[1]);
				delay(5000);

				return true;
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

		// No response - stop mule profile
		if (failCount >= 60) {
			D2Bot.stop(muleObj.muleProfile);
			delay(1000);
		}

		if (stopCheck && muleObj.stopProfile) {
			D2Bot.start(muleObj.stopProfile);
		}

		return false;
	},

	inGameCheck: function () {
		// Single player
		if (!me.gamename) {
			return false;
		}

		// Check if we're in mule or torch mule game
		if ((!this.getMule(0) || me.gamename.toLowerCase() !== this.getMule(0).muleGameName[0].toLowerCase()) &&
				(!this.getMule(1) || me.gamename.toLowerCase() !== this.getMule(1).muleGameName[0].toLowerCase())) {
			return false;
		}

		var mode, muleObj, tick,
			timeout = 150 * 1000, // Ingame mule timeout
			status = "muling";

		function CheckModeEvent(msg) {
			switch (msg) {
			case "torch":
				print("ÿc4AutoMuleÿc0: In torch mule game.");
				D2Bot.printToConsole("In torch mule game.", 7);

				mode = 1;

				break;
			case "normal":
				print("ÿc4AutoMuleÿc0: In mule game.");
				D2Bot.printToConsole("In mule game.", 7);

				mode = 0;

				break;
			}
		}

		function DropStatusEvent(mode, msg) {
			if (mode === 10) {
				print(msg);

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

		addEventListener("copydata", DropStatusEvent);
		addEventListener("scriptmsg", CheckModeEvent);
		scriptBroadcast("requestMuleMode");
		delay(500);
		muleObj = this.getMule(mode);

		if (me.gamename.toLowerCase() !== muleObj.muleGameName[0].toLowerCase()) {
			return false;
		}

		print("ÿc4AutoMuleÿc0: In mule game.");

		me.maxgametime = 0;

		if (!Town.goToTown(1)) {
			throw new Error("Failed to go to stash in act 1");
		}

		sendCopyData(null, muleObj.muleProfile, 11, "begin");

		switch (mode) {
		case 0:
			this.dropStuff();

			break;
		case 1:
			this.dropTorch();

			break;
		default:
			//D2Bot.printToConsole("Something got bjorked");
			print("Something got bjorked");

			break;
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
		delay(10000);

		return true;
	},

	dropStuff: function () {
		this.emptyStash();
		this.emptyInventory();
		delay(1000);
		me.cancel();
	},

	// empty the stash while ignoring cubing/runeword ingredients
	emptyStash: function () {
		if (!Town.openStash()) {
			return false;
		}

		var i,
			items = me.getItems();

		if (items) {
			for (i = 0; i < items.length; i += 1) {
				if (items[i].mode === 0 && items[i].location === 7 && Pickit.checkItem(items[i]).result > 0 && items[i].classid !== 549 &&
						[76, 77, 78].indexOf(items[i].itemType) === -1 && // don't drop potions
						((!TorchSystem.getFarmers() && !TorchSystem.isFarmer()) || [647, 648, 649].indexOf(items[i].classid) === -1) &&
						!this.cubingIngredient(items[i]) && !this.runewordIngredient(items[i])) {
					items[i].drop();
				}
			}
		}

		return true;
	},

	// empty the inventory while ignoring cubing/runeword ingredients
	emptyInventory: function () {
		if (!Town.openStash()) {
			return false;
		}

		var i,
			items = Storage.Inventory.Compare(Config.Inventory);

		if (items) {
			for (i = 0; i < items.length; i += 1) {
				if (items[i].mode === 0 && items[i].location === 3 && Pickit.checkItem(items[i]).result > 0 && items[i].classid !== 549 &&
						[76, 77, 78].indexOf(items[i].itemType) === -1 && // don't drop potions
						((!TorchSystem.getFarmers() && !TorchSystem.isFarmer()) || [647, 648, 649].indexOf(items[i].classid) === -1) &&
						!this.cubingIngredient(items[i]) && !this.runewordIngredient(items[i])) {
					items[i].drop();
				}
			}
		}

		return true;
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
	}
};