/**
*	@filename	AntiHostile.js
*	@author		kolton
*	@desc		handle hostile threats
*/

js_strict(true);

include("json2.js");
include("NTItemParser.dbl");
include("OOG.js");
include("Gambling.js");
include("common/Attack.js");
include("common/Cubing.js");
include("common/Config.js");
include("common/CollMap.js");
include("common/Loader.js");
include("common/Misc.js");
include("common/Pickit.js");
include("common/Pather.js");
include("common/Precast.js");
include("common/Prototypes.js");
include("common/Runewords.js");
include("common/Storage.js");
include("common/Town.js");

function main() {
	// Variables and functions
	var i, player, findTrigger, attackCount,
		hostiles = [],
		prevPos = {};

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
					D2Bot.printToConsole(party.name + " has declared hostility.;8");
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

	// Init config and attacks
	Config.init();
	Attack.init();
	Storage.Init();

	// Attack sequence adjustments
	switch (me.classid) {
	case 1: // Sorceress - increase skill range
		if ([47, 49, 53, 56, 59].indexOf(Config.AttackSkill[1]) > -1) {
			ClassAttack.skillRange[1] = 40;
			ClassAttack.skillRange[2] = 40;
		}

		break;
	case 6: // Assassin - use Mind Blast with trapsins
		if (me.getSkill(273, 1) && [251, 256].indexOf(Config.AttackSkill[1]) > -1) {
			Config.AttackSkill[1] = 273; // Mind Blast
		}

		break;
	}

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
					if (player.mode !== 0 && player.mode !== 17 && getPlayerFlag(me.gid, player.gid, 8) && !player.inTown && !me.inTown) {
						// Quit if hostile player is nearby
						if (Config.HostileAction === 1) {
							quit();
						}

						// Kill the hostile player
						prevPos = {x: me.x, y: me.y};

						this.togglePause();

						Config.UseMerc = false; // Don't go revive the merc mid-fight
						attackCount = 0;

						while (attackCount < 100) {
							if (!copyUnit(player).x) { // Invalidated unit (out of getUnit range)
								break;
							}

							switch (me.classid) {
							case 1: // Sorceress
								if (ClassAttack.skillRange[1] > 20 && getDistance(me, player) < 30) {
									print(ClassAttack.skillRange[1]);
									
									Attack.getIntoPosition(player, ClassAttack.skillRange[1], 0x4);
								}

								break;
							}

							ClassAttack.doAttack(player, false);

							attackCount += 1;

							if (player.mode === 0 || player.mode === 17) {
								D2Bot.printToConsole(player.name + " has been neutralized.;4");
								hideConsole();
								delay(500);
								takeScreenshot();

								break;
							}
						}

						Pather.moveTo(prevPos.x, prevPos.y);
						this.togglePause();
					}
				} while (player.getNext()); // cycle through eventual corpses
			}
		}

		delay(200);
	}
}