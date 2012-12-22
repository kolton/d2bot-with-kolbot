/**
*	@filename	TorchSystem.js
*	@author		kolton
*	@desc		Works in conjunction with OrgTorch script. Allows the uber killer to get keys from other profiles.
*/

var TorchSystem = {
	FarmerProfiles: {
// ############################ S E T U P ##########################################

		/* Each uber killer profile can have their own army of key finders
			Multiple entries are separated with a comma
			Example config:

			"Farmer 1": { // Farmer profile name
				// Put key finder profiles here. Example - KeyFinderProfiles: ["MF 1", "MF 2"],
				KeyFinderProfiles: ["mf 1", "mf 2"],

				// Put the game name of uber killer here (without numbers). Key finders will join this game to drop keys. Example - FarmGame: "Ubers-",
				FarmGame: "torch1-"
			},

			"Farmer 2": { // Farmer profile name
				// Put key finder profiles here. Example - KeyFinderProfiles: ["MF 1", "MF 2"],
				KeyFinderProfiles: ["mf 3", "mf 4"],

				// Put the game name of uber killer here (without numbers). Key finders will join this game to drop keys. Example - FarmGame: "Ubers-",
				FarmGame: "torch2-"
			}
		*/

		// Edit here!

		"Farmer 1": { // Farmer profile name
			// Put key finder profiles here. Example - KeyFinderProfiles: ["MF 1", "MF 2"],
			KeyFinderProfiles: [""],

			// Put the game name of uber killer here (without numbers). Key finders will join this game to drop keys. Example - FarmGame: "Ubers-",
			FarmGame: ""
		}

// #################################################################################
	},

	// Don't touch
	getFarmers: function () {
		var i, j,
			list = [];

		for (i in this.FarmerProfiles) {
			if (this.FarmerProfiles.hasOwnProperty(i)) {
				for (j = 0; j < this.FarmerProfiles[i].KeyFinderProfiles.length; j += 1) {
					if (this.FarmerProfiles[i].KeyFinderProfiles[j].toLowerCase() === me.profile.toLowerCase()) {
						this.FarmerProfiles[i].profile = i;

						list.push(this.FarmerProfiles[i]);
					}
				}
			}
		}

		if (list.length) {
			return list;
		}

		return false;
	},

	isFarmer: function () {
		if (this.FarmerProfiles.hasOwnProperty(me.profile)) {
			this.FarmerProfiles[me.profile].profile = me.profile;

			return this.FarmerProfiles[me.profile];
		}

		return false;
	},

	inGameCheck: function () {
		var i, items, farmers;

		farmers = this.getFarmers();

		if (!farmers) {
			return false;
		}

		for (i = 0; i < farmers.length; i += 1) {
			if (farmers[i].FarmGame.length > 0 && me.gamename.toLowerCase().match(farmers[i].FarmGame.toLowerCase())) {
				print("ÿc4Torch Systemÿc0: In Farm game.");
				Town.goToTown(1);
				Town.openStash();

				items = me.getItems();

				if (items) {
					for (i = 0; i < items.length; i += 1) {
						if (["pk1", "pk2", "pk3"].indexOf(items[i].code) > -1) {
							items[i].drop();
						}
					}
				}

				delay(5000); // give the killer enough time to pick the stuff up
				quit();
				delay(10000);

				return true;
			}
		}

		return false;
	},

	keyCheck: function () {
		if (!this.getFarmers()) {
			return false;
		}

		if (me.getItem("pk1") && me.getItem("pk2") && me.getItem("pk3")) {
			return true;
		}

		return false;
	},

	outOfGameCheck: function () {
		var i, game, farmers;

		function CheckEvent(mode, msg) {
			var i,
				farmers = TorchSystem.getFarmers();

			for (i = 0; i < farmers.length; i += 1) {
				if (msg.toLowerCase().match(farmers[i].FarmGame.toLowerCase())) {
					game = msg.split('/');
				}
			}

			return true;
		}

		farmers = this.getFarmers();

		if (!farmers) {
			return false;
		}

		addEventListener('copydata', CheckEvent);

		for (i = 0; i < farmers.length; i += 1) {
			sendCopyData(null, farmers[i].profile, 0, me.profile);
			delay(500);

			if (game) {
				break;
			}
		}

		removeEventListener('copydata', CheckEvent);

		if (game) {
			D2Bot.printToConsole("Joining key drop game." + ";7");
			delay(2000);

			me.blockMouse = true;

			joinGame(game[0], game[1]);

			me.blockMouse = false;

			delay(5000);

			return true;
		}

		return false;
	}
};