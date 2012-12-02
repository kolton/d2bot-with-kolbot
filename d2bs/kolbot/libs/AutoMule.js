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
			muleGameName: ["mulegame", "pw"], // ["gamename", "password"]

			// List of profiles that will mule items.
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
			muleGameName: ["mulegame", "pw"], // ["gamename", "password"]

			// List of profiles that will mule items.
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
	getMaster: function (profile) {
		var i, j, k,
			mule = this.Mules;

		for (i = 0; i < TorchSystem.FarmerProfiles.length; i += 1) {
			// Make a difference between normal mule and torch mule request coming from torch profile
			if (profile.toLowerCase().indexOf("|torch") > -1 && profile.split("|torch")[0].toLowerCase() === TorchSystem.FarmerProfiles[i].toLowerCase()) {
				return [TorchSystem.FarmerProfiles[i], 1];
			}
		}

		for (i in mule) {
			if (mule.hasOwnProperty(i)) {
				for (j in mule[i]) {
					if (mule[i].hasOwnProperty(j) && j === "enabledProfiles") {
						for (k = 0; k < mule[i][j].length; k += 1) {
							if (mule[i][j][k].toLowerCase() === profile.toLowerCase()) {
								return [mule[i][j][k], 0];
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
		var i, j, mule, name;

		mode = mode || 0;
		mule = mode === 1 ? this.TorchMules : this.Mules;

MainLoop:
		for (i in mule) {
			if (mule.hasOwnProperty(i)) {
				for (j in mule[i]) {
					if (mule[i].hasOwnProperty(j) && j === "muleProfile" && mule[i][j].toLowerCase() === me.profile.toLowerCase()) {
						name = i;

						break MainLoop;
					}
				}
			}
		}

		return mode === 0 ? "logs/AutoMule." + name + ".json" : "logs/TorchMule." + name + ".json";
	},

	outOfGameCheck: function (mode) {
		mode = mode || 0;

		var muleObj,
			status = "",
			failCount = 0;

		muleObj = this.getMule(mode);

		function MuleCheckEvent(mode, msg) {
			if (mode === 10) {
				status = msg;
			}
		}

		addEventListener("copydata", MuleCheckEvent);
		D2Bot.printToConsole("Starting" + (mode === 1 ? " torch " : " ")  + "mule profile: " + muleObj.muleProfile + ";7");

		if (muleObj.stopProfile) {
			D2Bot.stop(muleObj.stopProfile);
		}

		delay(1000);
		D2Bot.start(muleObj.muleProfile);

MainLoop:
		while (true) {
			sendCopyData(null, muleObj.muleProfile, 10, me.profile + (mode === 1 ? "|torch" : ""));
			delay(1000);

			switch (status) {
			case "begin":
				D2Bot.printToConsole("Mule profile is busy." + ";9");

				break MainLoop;
			case "ready":
				delay(2000);
				joinGame(muleObj.muleGameName[0], muleObj.muleGameName[1]);
				delay(5000);

				return true;
			default:
				failCount += 1;

				if (failCount >= 60) {
					D2Bot.printToConsole("No response from mule profile." + ";9");

					break MainLoop;
				}

				break;
			}
		}

		removeEventListener("copydata", MuleCheckEvent);

		while (me.ingame) {
			delay(1000);
		}

		D2Bot.stop(muleObj.muleProfile);
		delay(1000);

		if (muleObj.stopProfile) {
			D2Bot.start(muleObj.stopProfile);
		}

		return false;
	},

	inGameCheck: function () {
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
				D2Bot.printToConsole("In torch mule game." + ";7");

				mode = 1;

				break;
			case "normal":
				D2Bot.printToConsole("In mule game." + ";7");

				mode = 0;

				break;
			}
		}

		function DropStatusEvent(mode, msg) {
			switch (msg) {
			case "report": // reply to status request
				sendCopyData(null, muleObj.muleProfile, 12, status);

				break;
			case "quit": // quit command
				status = "quit";

				break;
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
				D2Bot.printToConsole("Mule didn't rejoin. Picking up items." + ";9");
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
						((TorchSystem.FarmerProfiles.indexOf(me.profile) === -1 && TorchSystem.KeyFinderProfiles.indexOf(me.profile) === -1) || [647, 648, 649].indexOf(items[i].classid) === -1) &&
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
						((TorchSystem.FarmerProfiles.indexOf(me.profile) === -1 && TorchSystem.KeyFinderProfiles.indexOf(me.profile) === -1) || [647, 648, 649].indexOf(items[i].classid) === -1) &&
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

		var item = me.getItem("cm2");

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