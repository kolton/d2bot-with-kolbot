var Gambling = {
	/*
####################################################################################################
		Gambling system for kolbot

		Allows lower level characters to get a steady income of gold to gamble LLD/VLLD items
		Not recommended for rings/amulets because of their high price (unless you want 3 gold finders to supply one gambler)

		Setting up:

		* goldFinders = PROFILE NAMES that will enter games and drop gold (profile names match window titles)
			example: goldFinders: ["GF 1", "GF 2"], // don't remove the comma

		* gamblers = PROFILE NAMES that gamble and pick up gold dropped by gold finders
			example: gamblers: ["Gamble 1", "Gamble 2"], // don't remove the comma

		* gambleGames = games that gold finders will join, don't use numbers. NOTE: d2 always makes first letter of game name uppercase
			example: gambleGames: ["Gamble1-", "Gamble2-"], // don't remove the comma

		* minGold = min amount to keep when dropping gold
			example: minGold: 150000, // don't remove the comma
			
		Once set up properly, the gold finders will run their own games and join gamblers' games when they're out of gold.
	*/

	goldFinders: [], // don't remove the comma
	gamblers: [], // don't remove the comma
	gambleGames: [], // don't remove the comma

	minGold: 200000, // don't remove the comma

	/*
####################################################################################################
		Internals, don't edit unless you know how to
	*/

	dropGold: function () {
		Town.goToTown(1);
		Town.move("stash");

		while (me.getStat(14) + me.getStat(15) > this.minGold) {
			gold(me.getStat(14)); // drop current gold
			Town.openStash();

			if (me.getStat(15) <= me.getStat(12) * 1e4) { // check stashed gold vs max carrying capacity
				gold(me.getStat(15) - this.minGold, 4); // leave minGold in stash, pick the rest
			} else {
				gold(me.getStat(12) * 1e4, 4); // pick max carrying capacity
			}

			delay(1000);
		}
	},

	checkGamblers: function () {
		if (this.goldFinders.indexOf(me.profile) === -1) {
			return false;
		}

		function CheckEvent(mode, msg) {
			var i;

			for (i = 0; i < Gambling.gambleGames.length; i += 1) {
				if (msg.match(Gambling.gambleGames[i])) {
					game = msg.split('/');

					break;
				}
			}

			removeEventListener('copydata', CheckEvent);

			return true;
		}

		var i, game;

		addEventListener('copydata', CheckEvent);
		game = null;

		for (i = 0; i < this.gamblers.length; i += 1) {
			sendCopyData(null, this.gamblers[i], 0, me.profile);
			delay(100);

			if (game) {
				return game;
			}
		}

		return false;
	}
};