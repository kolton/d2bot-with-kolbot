/**
*	@filename	Party.js
*	@author		kolton
*	@desc		handle party procedure ingame
*/

function main() {
	include("OOG.js");
	include("json2.js");
	include("common/Config.js");
	include("common/Cubing.js");
	include("common/Runewords.js");
	include("common/Misc.js");
	include("common/Prototypes.js");
	include("common/Town.js");

	Config.init();

	var i, myPartyId, player, otherParty, shitList, currScript, scriptList,
		classes = ["Amazon", "Sorceress", "Necromancer", "Paladin", "Barbarian", "Druid", "Assassin"],
		playerLevels = {},
		partyTick = getTickCount();

	addEventListener("gameevent",
		function (mode, param1, param2, name1, name2) {
			var player;

			switch (mode) {
			case 0x02: // "%Name1(%Name2) joined our world. Diablo's minions grow stronger."
				if (Config.Greetings.length > 0) {
					try {
						player = getParty(name1);
					} catch (e1) {

					}

					if (player && player.name !== me.name) {
						say(Config.Greetings[rand(0, Config.Greetings.length - 1)].replace("$name", player.name).replace("$level", player.level).replace("$class", classes[player.classid]));
					}
				}

				break;
			case 0x06: // "%Name1 was Slain by %Name2"
				if (Config.DeathMessages.length > 0) {
					try {
						player = getParty(name1);
					} catch (e2) {

					}

					if (player && player.name !== me.name) {
						say(Config.DeathMessages[rand(0, Config.DeathMessages.length - 1)].replace("$name", player.name).replace("$level", player.level).replace("$class", classes[player.classid]).replace("$killer", name2));
					}
				}

				break;
			}
		});
	addEventListener("scriptmsg",
		function (msg) {
			var obj;

			try {
				obj = JSON.parse(msg);

				if (obj && obj.hasOwnProperty("currScript")) {
					currScript = obj.currScript;
				}
			} catch (e3) {

			}
		});

	print("ÿc2Party thread loaded. Mode: " + (Config.PublicMode === 2 ? "Accept" : "Invite"));

	if (Config.ShitList || Config.UnpartyShitlisted) {
		shitList = ShitList.read();

		print(shitList.length + " entries in shit list.");
	}

	if (Config.PartyAfterScript) {
		scriptList = [];

		for (i in Scripts) {
			if (Scripts.hasOwnProperty(i) && !!Scripts[i]) {
				scriptList.push(i);
			}
		}
	}

	// Main loop
	while (true) {
		if (me.gameReady && (!Config.PartyAfterScript || scriptList.indexOf(currScript) > scriptList.indexOf(Config.PartyAfterScript))) {
			player = getParty();

			if (player) {
				myPartyId = player.partyid;

				while (player.getNext()) {
					switch (Config.PublicMode) {
					case 1: // Invite others
					case 3: // Invite others but never accept
						if (getPlayerFlag(me.gid, player.gid, 8)) {
							if (Config.ShitList && shitList.indexOf(player.name) === -1) {
								say(player.name + " has been shitlisted.");
								shitList.push(player.name);
								ShitList.add(player.name);
							}

							if (player.partyflag === 4) {
								clickParty(player, 2); // cancel invitation
								delay(100);
							}

							break;
						}

						if (Config.ShitList && shitList.indexOf(player.name) > -1) {
							break;
						}

						if (player.partyflag !== 4 && (Config.PublicMode === 1 || player.partyflag !== 2) && player.partyid === 65535) {
							clickParty(player, 2);
							delay(100);
						}

						break;
					case 2: // Accept invites
						if (Config.Leader && player.name !== Config.Leader) {
							break;
						}

						if (player.partyid !== 65535 && player.partyid !== myPartyId) {
							otherParty = player.partyid;
						}

						if (player.partyflag === 2 && (!otherParty || player.partyid === otherParty) && (getTickCount() - partyTick >= 2000 || Config.FastParty)) {
							clickParty(player, 2);
							delay(100);
						}

						break;
					}

					if (Config.UnpartyShitlisted) {
						// Add new hostile players to temp shitlist, leader should have Config.ShitList set to true to update the permanent list.
						if (getPlayerFlag(me.gid, player.gid, 8) && shitList.indexOf(player.name) === -1) {
							shitList.push(player.name);
						}

						if (shitList.indexOf(player.name) > -1 && myPartyId !== 65535 && player.partyid === myPartyId) {
							// Only the one sending invites should say this.
							if ([1, 3].indexOf(Config.PublicMode) > -1) {
								say(player.name + " is shitlisted. Do not invite them.");
							}

							clickParty(player, 3);
							delay(100);
						}
					}
				}
			}

			if (Config.Congratulations.length > 0) {
				player = getParty();

				if (player) {
					do {
						if (player.name !== me.name) {
							if (!playerLevels[player.name]) {
								playerLevels[player.name] = player.level;
							}

							if (player.level > playerLevels[player.name]) {
								say(Config.Congratulations[rand(0, Config.Congratulations.length - 1)].replace("$name", player.name).replace("$level", player.level).replace("$class", classes[player.classid]));

								playerLevels[player.name] = player.level;
							}
						}
					} while (player.getNext());
				}
			}
		}

		delay(500);
	}
}