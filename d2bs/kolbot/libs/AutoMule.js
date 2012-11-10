var AutoMule = {
	// Normal mule info
	Mule: {
		muleProfile: "",  // The name of mule profile in d2bot#. It will be started and stopped when needed.
		accountPrefix: "",  // Account prefix. Numbers added automatically when making accounts.
		accountPassword: "",  // Account password.
		charPrefix: "",  // Character prefix. Suffix added automatically when making characters.
		realm: "", // Available options: "useast", "uswest", "europe", "asia"
		expansion: true,
		ladder: true,
		hardcore: false
	},

	// Torch mule info - you can use the same profile as Normal mule, using the same accounts is possible but not recommended (8 premade chars can cause conflicts)
	TorchMule: {
		muleProfile: "",  // The name of mule profile in d2bot#. It will be started and stopped when needed.
		accountPrefix: "",  // Account prefix. Numbers added automatically when making accounts.
		accountPassword: "",  // Account password.
		charPrefix: "",  // Character prefix. Suffix added automatically when making characters.
		realm: "", // Available options: "useast", "uswest", "europe", "asia"
		expansion: true,
		ladder: true,
		hardcore: false
	},

	// Game name and password of the mule game
	muleGameName: ["mulegame", "mulepw"], // ["gamename", "password"]

	// List of profiles that will mule items. Casing matters!
	enabledProfiles: [""],



	// internal functions, don't edit

	// check game name, override default.dbj actions
	inGameCheck: function () {
		if (me.gamename.toLowerCase() !== this.muleGameName[0].toLowerCase()) {
			return false;
		}

		D2Bot.printToConsole("In mule game.");

		var mode, muleInfoObj,
			status = "muling";

		function CheckModeEvent(msg) {
			switch (msg) {
			case "torch":
				print("Torch muling mode");

				mode = 1;

				break;
			case "normal":
				print("Normal muling mode");

				mode = 0;

				break;
			}
		}

		function DropStatusEvent(mode, msg) {
			switch (msg) {
			case "report": // reply to status request
				sendCopyData(null, muleInfoObj.muleProfile, 12, status);

				break;
			case "quit": // quit command
				status = "quit";

				break;
			}
		}

		print("ÿc4AutoMuleÿc0: In mule game.");
		addEventListener("copydata", DropStatusEvent);
		addEventListener("scriptmsg", CheckModeEvent);
		scriptBroadcast("requestMuleMode");
		delay(500);
		muleInfoObj = mode === 0 ? this.Mule : this.TorchMule;

		if (!Town.goToTown(1)) {
			throw new Error("Failed to go to stash in act 1");
		}

		sendCopyData(null, muleInfoObj.muleProfile, 11, "begin");

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
		print("status done");
		//D2Bot.printToConsole("status done");

		while (true) {
			if (status === "quit") {
				//D2Bot.printToConsole("status quit");

				break;
			}

			delay(500);
		}

		removeEventListener("copydata", DropStatusEvent);
		quit();
		delay(10000);

		return true;
	},

	// call mule profile, check if it's available for the mule session
	outOfGameCheck: function (mode) {
		mode = mode || 0;

		var status = "", muleInfoObj,
			failCount = 0;

		muleInfoObj = mode === 1 ? this.TorchMule : this.Mule;

		function MuleCheckEvent(mode, msg) {
			if (mode === 10) {
				status = msg;
			}
		}

		addEventListener("copydata", MuleCheckEvent);
		D2Bot.printToConsole("Starting" + (mode === 1 ? " torch " : " ")  + "mule profile: " + muleInfoObj.muleProfile);
		D2Bot.start(muleInfoObj.muleProfile);

MainLoop:
		while (true) {
			sendCopyData(null, muleInfoObj.muleProfile, 10, me.profile.toString() + (mode === 1 ? "|torch" : ""));
			delay(1000);

			switch (status) {
			case "begin":
				D2Bot.printToConsole("Mule profile is busy");

				break MainLoop;
			case "ready":
				delay(2000);
				joinGame(this.muleGameName[0], this.muleGameName[1]);
				delay(5000);

				return true;
			default:
				failCount += 1;

				if (failCount >= 60) {
					D2Bot.printToConsole("No response from mule profile.");

					break MainLoop;
				}

				break;
			}
		}

		removeEventListener("copydata", MuleCheckEvent);

		while (me.ingame) {
			delay(1000);
		}

		return false;
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
						(TorchSystem.FarmerProfiles.indexOf(me.profile) === -1 && TorchSystem.KeyFinderProfiles.indexOf(me.profile) === -1 || [647, 648, 649].indexOf(items[i].classid) === -1) &&
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
						(TorchSystem.FarmerProfiles.indexOf(me.profile) === -1 && TorchSystem.KeyFinderProfiles.indexOf(me.profile) === -1 || [647, 648, 649].indexOf(items[i].classid) === -1) &&
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