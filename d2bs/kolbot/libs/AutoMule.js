var AutoMule = {
	muleProfile: "",  // The name of mule profile in d2bot#. It will be started and stopped when needed.
	accountPrefix: "",  // Account prefix. Numbers added automatically when making accounts.
	accountPassword: "",  // Account password.
	charPrefix: "",  // Character prefix. Suffix added automatically when making characters.
	realm: "", // Available options: "useast", "uswest", "europe", "asia"
	expansion: true,
	ladder: true,
	hardcore: false,

	// Game name and password of the mule game
	muleGameName: ["mulegame", "mulepass"], // ["gamename", "password"]

	// List of profiles that will mule items
	enabledProfiles: [""],



	// internal functions, don't edit

	// check game name, override default.dbj actions
	inGameCheck: function () {
		if (me.gamename.toLowerCase() !== this.muleGameName[0].toLowerCase()) {
			return false;
		}

		D2Bot.printToConsole("In mule game.");

		var status = "muling";

		function DropStatusEvent(mode, msg) {
			switch (msg) {
			case "report": // reply to status request
				sendCopyData(null, AutoMule.muleProfile, 2, status);
				
				break;
			case "quit": // quit command
				status = "quit";

				break;
			}
		}

		print("ÿc4AutoMuleÿc0: In mule game.");
		addEventListener("copydata", DropStatusEvent);

		if (!Town.goToTown(1)) {
			throw new Error("Failed to go to stash in act 1");
		}

		sendCopyData(null, this.muleProfile, 1, "begin");
		this.dropStuff();

		status = "done";
		print("status done");

		while (true) {
			if (status === "quit") {
				break;
			}

			delay(500);
		}

		removeEventListener("copydata", DropStatusEvent);
		quit();

		return true;
	},

	// call mule profile, check if it's available for the mule session
	outOfGameCheck: function () {
		var status = "",
			failCount = 0;

		function MuleCheckEvent(mode, msg) {
			status = msg;
		}

		addEventListener("copydata", MuleCheckEvent);
		D2Bot.printToConsole("Starting mule profile: " + this.muleProfile);
		D2Bot.start(this.muleProfile);

MainLoop:
		while (true) {
			sendCopyData(null, this.muleProfile, 0, me.profile);
			delay(1000);

			switch (status) {
			case "begin":
				D2Bot.printToConsole("Mule profile is busy");

				break MainLoop;
			case "ready":
				joinGame(this.muleGameName[0], this.muleGameName[1]);
				delay(2000);

				break MainLoop;
			default:
				failCount += 1;

				if (failCount >= 45) {
					D2Bot.printToConsole("No response from mule profile.");

					break MainLoop;
				}

				break;
			}
		}

		removeEventListener("copydata", MuleCheckEvent);

		return true;
	},

	dropStuff: function () {
		this.emptyStash();
		this.emptyInventory();
		delay(1000);
		me.cancel();
	},

	// empty the stash while ignoring cubing/runeword ingredients TODO skip horadric cube
	emptyStash: function () {
		if (!Town.openStash()) {
			return false;
		}

		var i,
			items = me.getItems();

		if (items) {
			for (i = 0; i < items.length; i += 1) {
				if (items[i].mode === 0 && items[i].location === 7 && Pickit.checkItem(items[i]) > 0 && items[i].classid !== 549 &&
						!this.cubingIngredient(items[i]) && !this.runewordIngredient(items[i])) {
					items[i].drop();
				}
			}
		}

		return true;
	},

	// empty the inventory while ignoring cubing/runeword ingredients TODO skip horadric cube
	emptyInventory: function () {
		if (!Town.openStash()) {
			return false;
		}

		var i,
			items = Storage.Inventory.Compare(Config.Inventory);

		if (items) {
			for (i = 0; i < items.length; i += 1) {
				if (items[i].mode === 0 && items[i].location === 3 && Pickit.checkItem(items[i]) > 0 && items[i].classid !== 549 &&
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
	}
};