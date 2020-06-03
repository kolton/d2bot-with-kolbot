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
			charsPerAcc: 8, // Maximum number of mules to create per account (between 1 to 18)

			// Game name and password of the mule game. Never use the same game name as for mule logger.
			muleGameName: ["", ""], // ["gamename", "password"]

			// List of profiles that will mule items. Example: enabledProfiles: ["profile 1", "profile 2"],
			enabledProfiles: [""],

			// Stop a profile prior to muling. Useful when running 8 bots without proxies.
			stopProfile: "",
			stopProfileKeyRelease: false, // true = stopProfile key will get released on stop. useful when using 100% of your keys for botting.

			// Trigger muling at the end of a game if used space in stash and inventory is equal to or more than given percent.
			usedStashTrigger: 80,
			usedInventoryTrigger: 80,

			// Mule items that have been stashed at some point but are no longer in pickit.
			muleOrphans: true
		}
	},

	/** Torch/Anni mules
		- Torch is muled in OrgTorch script after finishing uber Tristram successfully or when starting OrgTorch script with a Torch already on the character.
		- Anni is muled after successfully killing Diablo in Palace Cellar level 3 using Config.KillDclone option or KillDClone script.
			If a profile is listed in Torch/Anni mule's enabledProfiles list, it will also do a check to mule Anni at the end of each game.
			Anni that is in locked inventory slot will not be muled.

		* Each mule will hold either a Torch or an Anni, but not both. As soon as the current mule has either one, a new one will be created.
	*/
	TorchAnniMules: {
		"Mule1":  {
			muleProfile: "",  // The name of mule profile in d2bot#. It will be started and stopped when needed.
			accountPrefix: "",  // Account prefix. Numbers added automatically when making accounts.
			accountPassword: "",  // Account password.
			charPrefix: "",  // Character prefix. Suffix added automatically when making characters.
			realm: "", // Available options: "useast", "uswest", "europe", "asia"
			expansion: true,
			ladder: true,
			hardcore: false,
			charsPerAcc: 8, // Maximum number of mules to create per account (between 1 to 18)

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
	torchAnniCheck: false,

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

		for (i in this.TorchAnniMules) {
			if (this.TorchAnniMules.hasOwnProperty(i)) {
				for (j = 0; j < this.TorchAnniMules[i].enabledProfiles.length; j += 1) {
					if (this.TorchAnniMules[i].enabledProfiles[j].toLowerCase() === me.profile.toLowerCase()) {
						if (!info) {
							info = {};
						}

						info.torchMuleInfo = this.TorchAnniMules[i];
					}
				}
			}
		}

		return info;
	},

	muleCheck: function () {
		var i, items,
			info = this.getInfo();

		if (info && info.hasOwnProperty("muleInfo")) {
			items = this.getMuleItems();

			if (info.muleInfo.hasOwnProperty("usedStashTrigger") && info.muleInfo.hasOwnProperty("usedInventoryTrigger") &&
					Storage.Inventory.UsedSpacePercent() >= info.muleInfo.usedInventoryTrigger && Storage.Stash.UsedSpacePercent() >= info.muleInfo.usedStashTrigger &&
						items.length > 0) {
				D2Bot.printToConsole("MuleCheck triggered!", 7);

				return true;
			}

			for (i = 0; i < items.length; i += 1) {
				if (this.matchItem(items[i], Config.AutoMule.Trigger)) {
					D2Bot.printToConsole("MuleCheck triggered!", 7);
					return true;
				}
			}
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

			if (this.torchAnniCheck && info.hasOwnProperty("torchMuleInfo")) {
				return info.torchMuleInfo;
			}
		}

		return false;
	},

	outOfGameCheck: function () {
		if (!this.check && !this.torchAnniCheck) {
			return false;
		}

		var i, control, muleObj,
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
		D2Bot.printToConsole("Starting " + (this.torchAnniCheck === 2 ? "anni" : this.torchAnniCheck === 1 ? "torch" : "")  + " mule profile: " + muleObj.muleProfile, 7);

MainLoop:
		while (true) {
			// If nothing received our copy data start the mule profile
			if (!sendCopyData(null, muleObj.muleProfile, 10, JSON.stringify({profile: me.profile, mode: this.torchAnniCheck || 0}))) {
				// if the mule profile isn't already running and there is a profile to be stopped, stop it before starting the mule profile
				if (!stopCheck && muleObj.stopProfile && me.profile.toLowerCase() !== muleObj.stopProfile.toLowerCase()) {
					D2Bot.stop(muleObj.stopProfile, muleObj.stopProfileKeyRelease);

					stopCheck = true;

					delay(2000); // prevents cd-key in use error if using -skiptobnet on mule profile
				}

				D2Bot.start(muleObj.muleProfile);
			}

			delay(1000);

			switch (muleInfo.status) {
			case "loading":
				if (!stopCheck && muleObj.stopProfile && me.profile.toLowerCase() !== muleObj.stopProfile.toLowerCase()) {
					D2Bot.stop(muleObj.stopProfile, muleObj.stopProfileKeyRelease);

					stopCheck = true;
				}

				failCount += 1;

				break;
			case "busy":
			case "begin":
				D2Bot.printToConsole("Mule profile is busy.", 9);

				break MainLoop;
			case "ready":
				control = getControl(6, 652, 469, 120, 20);

				if (control) {
					delay(200);
					control.click();
				}

				delay(2000);

				this.inGame = true;
				me.blockMouse = true;

				try {
					joinGame(muleObj.muleGameName[0], muleObj.muleGameName[1]);
				} catch (joinError) {

				}

				me.blockMouse = false;

				// Untested change 11.Feb.14.
				for (i = 0; i < 8; i += 1) {
					delay(1000);

					if (me.ingame && me.gameReady) {
						break MainLoop;
					}
				}

				break;
			default:
				failCount += 1;

				break;
			}

			if (failCount >= 260) {
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
		this.torchAnniCheck = false;

		// No response - stop mule profile
		if (failCount >= 260) {
			D2Bot.stop(muleObj.muleProfile, true);
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
			case "2":
				AutoMule.torchAnniCheck = 2;

				break;
			case "1":
				AutoMule.torchAnniCheck = 1;

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

		if (!this.check && !this.torchAnniCheck) {
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

		if (this.torchAnniCheck === 2) {
			print("ÿc4AutoMuleÿc0: In anni mule game.");
			D2Bot.updateStatus("AutoMule: In game.");
			this.dropCharm(true);
		} else if (this.torchAnniCheck === 1) {
			print("ÿc4AutoMuleÿc0: In torch mule game.");
			D2Bot.updateStatus("AutoMule: In game.");
			this.dropCharm(false);
		} else {
			print("ÿc4AutoMuleÿc0: In mule game.");
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

				Misc.useItemLog = false; // Don't log items picked back up in town.

				Pickit.pickItems();

				break;
			}

			delay(500);
		}

		removeEventListener("copydata", DropStatusEvent);
		D2Bot.stop(muleObj.muleProfile, true);
		delay(1000);

		if (muleObj.stopProfile) {
			D2Bot.start(muleObj.stopProfile);
		}

		if (getScript("AnniStarter.dbj")) {
			scriptBroadcast("exit");
		}

		delay(2000);
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

		if (!items || items.length === 0) {
			return false;
		}

		D2Bot.printToConsole("AutoMule: Transfering items.", 7);

		for (i = 0; i < items.length; i += 1) {
			items[i].drop();
		}

		delay(1000);
		me.cancel();

		return true;
	},

	matchItem: function (item, list) {
		var i, info, parsedLine,
			parsedPickit = [], classIDs = [];

		for (i = 0; i < list.length; i += 1) {
			info = {
				file: "Character Config",
				line: list[i]
			};

			if (typeof list[i] === "number") { // classids
				classIDs.push(list[i]);
			} else if (typeof list[i] === "string") { // pickit entries
				parsedLine = NTIP.ParseLineInt(list[i], info);

				if (parsedLine) {
					parsedPickit.push(parsedLine);
				}
			}
		}

		return (classIDs.indexOf(item.classid) > -1 || NTIP.CheckItem(item, parsedPickit));
	},

	// get a list of items to mule
	getMuleItems: function () {
		var item, items,
			info = this.getInfo();

		if (!info || !info.hasOwnProperty("muleInfo")) {
			return false;
		}

		item = me.getItem(-1, 0);
		items = [];

		if (item) {
			do {
				if (Town.ignoredItemTypes.indexOf(item.itemType) === -1 &&
						(Pickit.checkItem(item).result > 0 || (item.location === 7 && info.muleInfo.hasOwnProperty("muleOrphans") && info.muleInfo.muleOrphans)) &&
						item.classid !== 549 && // Don't drop Horadric Cube
						(item.classid !== 603 || item.quality !== 7) && // Don't drop Annihilus
						(item.classid !== 604 || item.quality !== 7) && // Don't drop Hellfire Torch
						(item.location === 7 || (item.location === 3 && !Storage.Inventory.IsLocked(item, Config.Inventory))) && // Don't drop items in locked slots
						((!TorchSystem.getFarmers() && !TorchSystem.isFarmer()) || [647, 648, 649].indexOf(item.classid) === -1)) { // Don't drop Keys if part of TorchSystem
					if (this.matchItem(item, Config.AutoMule.Force.concat(Config.AutoMule.Trigger)) || // Always drop items on Force or Trigger list
						(!this.matchItem(item, Config.AutoMule.Exclude) && (!this.cubingIngredient(item) && !this.runewordIngredient(item) && !this.utilityIngredient(item)))) { // Don't drop Excluded items or Runeword/Cubing/CraftingSystem ingredients
						items.push(copyUnit(item));
					}
				}
			} while (item.getNext());
		}

		return items;
	},

	utilityIngredient: function (item) {
		return CraftingSystem.validGids.indexOf(item.gid) > -1;
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
				base = Runewords.getBase(Config.Runewords[i][0], Config.Runewords[i][1], (Config.Runewords[i][2]||0)) || Runewords.getBase(Config.Runewords[i][0], Config.Runewords[i][1], (Config.Runewords[i][2]||0), true);

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

	dropCharm: function (dropAnni) {
		if (!Town.openStash()) {
			return false;
		}

		var item;

		if (dropAnni) {
			item = me.findItem(603, 0, -1, 7);

			if (item && !Storage.Inventory.IsLocked(item, Config.Inventory)) {
				D2Bot.printToConsole("AutoMule: Transfering Anni.", 7);
				item.drop();
				delay(1000);
				me.cancel();

				return true;
			}

			return false;
		}

		item = me.findItem(604, 0, -1, 7);

		if (item) {
			D2Bot.printToConsole("AutoMule: Transfering Torch.", 7);
			item.drop();
			delay(1000);
			me.cancel();

			return true;
		}

		me.cancel();

		return true;
	},

	// *** Mule functions ***
	getMaster: function (info) {
		var i, j, k, muleObj;

		muleObj = info.mode === 1 ? this.TorchAnniMules : this.Mules;

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
		mule = mode > 0 ? this.TorchAnniMules : this.Mules;

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

	getMuleFilename: function (mode, master) {
		var i, mule, jsonObj, jsonStr, file;

		mode = mode || 0;
		mule = mode > 0 ? this.TorchAnniMules : this.Mules;

		// Iterate through mule object
		for (i in mule) {
			if (mule.hasOwnProperty(i)) {
				// Mule profile matches config
				if (mule[i].muleProfile && mule[i].muleProfile.toLowerCase() === me.profile.toLowerCase() && mule[i].enabledProfiles.indexOf(master) > -1) {
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
