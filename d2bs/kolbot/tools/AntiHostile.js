/**
*	@filename	AntiHostile.js
*	@author		kolton
*	@desc		handle hostile threats
*/

function main() {
	// Include libraries
	include("json2.js");
	include("NTItemParser.dbl");
	include("OOG.js");
	include("Gambling.js");
	include("common/Attack.js");
	include("common/Cubing.js");
	include("common/Config.js");
	include("common/Loader.js");
	include("common/Misc.js");
	include("common/Pickit.js");
	include("common/Pather.js");
	include("common/Precast.js");
	include("common/Prototypes.js");
	include("common/Runewords.js");
	include("common/Storage.js");
	include("common/Town.js");

	// Init config and attacks
	Config.init();
	Attack.init();
	Storage.Init();

	// Variables and functions
	var i, player, findTrigger, attackCount,
		hostiles = [];

	// Filps the 'find' trigger - allows the main loop to scan for hostiles
	this.hostileEvent = function (mode, param1, param2, name1, name2) {
		if (mode === 7 && param2 === 3) {
			findTrigger = true;
		}
	};

	// Find all hostile players and add their names to the 'hostiles' list
	this.findHostiles = function () {
		var party = getParty();

		if (party) {
			do {
				if (party.name !== me.name && getPlayerFlag(me.gid, party.gid, 8) && hostiles.indexOf(party.name) === -1) {
					D2Bot.printToConsole(party.name + " has declared hostility.;6");
					hostiles.push(party.name);
				}
			} while (party.getNext());
		}

		return true;
	};

	// Pause default so actions don't conflict
	this.togglePause = function () {
		var script = getScript("default.dbj");

		if (script) {
			if (script.running) {
				print("ÿc1Pausing.");
				script.pause();
			} else {
				print("ÿc2Resuming.");
				script.resume();
			}
		}
	};

	addEventListener("gameevent", this.hostileEvent);
	print("ÿc2Anti-Hostile thread loaded.");
	this.findHostiles();

	// Main Loop
	while (true) {
		// Scan for hostiles or quit
		if (findTrigger) {
			if (Config.HostileAction === 0) {
				quit();
			}

			this.findHostiles();

			findTrigger = false;
		}

		for (i = 0; i < hostiles.length; i += 1) {
			player = getUnit(0, hostiles[i]);

			if (player) {
				do {
					if (player.mode !== 0 && player.mode !== 17 && getPlayerFlag(me.gid, player.gid, 8) && !player.inTown) {
						// Quit if hostile player is nearby
						if (Config.HostileAction === 1) {
							quit();
						}

						// Kill the hostile player
						this.togglePause();

						Config.UseMerc = false; // Don't go revive the merc mid-fight
						attackCount = 0;

						while (attackCount < 100) {
							if (!copyUnit(player).x) { // Invalidated unit (out of getUnit range)
								break;
							}

							ClassAttack.doAttack(player, false);

							attackCount += 1;

							if (player.mode === 0 || player.mode === 17) {
								D2Bot.printToConsole(player.name + " has been neutralized.;3");
								delay(500);
								takeScreenshot();

								break;
							}
						}

						if (me.area === 131) {
							Pather.moveTo(15093, 5029);
						}

						this.togglePause();
					}
				} while (player.getNext()); // cycle through eventual corpses
			}
		}
		
		delay(500);
	}
}