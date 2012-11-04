/**
*	@filename	TorchSystem.js
*	@author		kolton
*	@desc		Works in conjunction with OrgTorch script. Allows the uber killer to get keys from other profiles.
*/

var TorchSystem = {
// ############################ S E T U P ##########################################

	// Put uber killer profile names here. Example - FarmerProfiles: ["Uber Killer 1", "Uber Killer 2"],
	FarmerProfiles: [""],

	// Put key finder profiles here. Example - KeyFinderProfiles: ["MF 1", "MF 2"],
	KeyFinderProfiles: [""],

	// Put the game name of uber killer here (without numbers). Key finders will join this game to drop keys. Example - FarmGames: ["Ubers-", "Torchrun"],
	FarmGames: [""],

// #################################################################################

	// Don't touch
	inGameCheck: function () {
		if (this.KeyFinderProfiles.indexOf(me.profile) === -1) {
			return false;
		}

		var i, items;

		for (i = 0; i < this.FarmGames.length; i += 1) {
			if (me.gamename.toLowerCase().match(this.FarmGames[i].toLowerCase())) {
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
		if (this.KeyFinderProfiles.indexOf(me.profile) === -1) {
			return false;
		}

		if (me.getItem("pk1") && me.getItem("pk2") && me.getItem("pk3")) {
			//D2Bot.printToConsole("We have enough keys.");

			return true;
		}

		return false;
	},

	outOfGameCheck: function () {
		//D2Bot.printToConsole("Trying to get in touch with Torch Farmers.");

		var i, game;

		function CheckEvent(mode, msg) {
			var i;

			for (i = 0; i < TorchSystem.FarmGames.length; i += 1) {
				if (msg.toLowerCase().match(TorchSystem.FarmGames[i].toLowerCase())) {
					game = msg.split('/');

					break;
				}
			}

			return true;
		}

		addEventListener('copydata', CheckEvent);

		for (i = 0; i < this.FarmerProfiles.length; i += 1) {
			sendCopyData(null, this.FarmerProfiles[i], 0, me.profile);
			delay(300);

			if (game) {
				break;
			}
		}

		removeEventListener('copydata', CheckEvent);

		if (game) {
			D2Bot.printToConsole("Joining key drop game." + ";7");
			delay(2000);
			joinGame(game[0], game[1]);
			delay(4000);
		}

		return true;
	}
};