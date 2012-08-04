/**
*	@filename	AntiHostile.js
*	@author		kolton
*	@desc		handle hostile threats
*/

// TODO: more classes for entrance guard, timeout/leave event for hostiles array

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
	var player, findTrigger, attackCount, mugShot, prevPos,
		charClass = ["Amazon", "Sorceress", "Necromancer", "Paladin", "Barbarian", "Druid", "Assassin"],
		hostiles = [];

	// Flips the 'find' trigger - allows the main loop to scan for hostiles
	this.hostileEvent = function (mode, param1, param2, name1, name2) {
		switch (mode) {
		case 0x00: // "%Name1(%Name2) dropped due to time out."
		case 0x01: // "%Name1(%Name2) dropped due to errors."
		case 0x03: // "%Name1(%Name2) left our world. Diablo's minions weaken."
			if (hostiles.indexOf(name1) > -1) {
				hostiles.splice(hostiles.indexOf(name1), 1);
			}

			break;
		case 0x06: // "%Name1 was Slain by %Name2" 
			if (param2 === 0x00 && name2 === me.name) {
				D2Bot.printToConsole(name1 + " has been neutralized.;4");

				mugShot = true;
			}

			break;
		case 0x07:
			if (param2 === 0x03) { // "%Player has declared hostility towards you."
				findTrigger = true;
			}

			break;
		}
	};

	// Find all hostile players and add their names to the 'hostiles' list
	this.findHostiles = function () {
		var party = getParty();

		if (party) {
			do {
				if (party.name !== me.name && getPlayerFlag(me.gid, party.gid, 8) && hostiles.indexOf(party.name) === -1) {
					D2Bot.printToConsole(party.name + " (Level " + party.level + " " + charClass[party.classid] + ")" + " has declared hostility.;8");
					hostiles.push(party.name);
				}
			} while (party.getNext());
		}

		return true;
	};

	// Pause default so actions don't conflict
	this.pause = function () {
		var script = getScript("default.dbj");

		if (script && script.running) {
			print("ÿc1Pausing.");
			script.pause();
		}
	};

	// Resume default
	this.resume = function () {
		var script = getScript("default.dbj");

		if (script && !script.running) {
			print("ÿc2Resuming.");
			script.resume();
		}
	};

	this.startFlash = function (gid) {
		var script = getScript("tools/FlashThread.js");

		if (script) {
			script.send("flash " + gid);
		}
	};

	this.stopFlash = function () {
		var script = getScript("tools/FlashThread.js");

		if (script) {
			script.send("unflash");
		}
	};

	this.findPlayer = function () {
		var i, player;

		for (i = 0; i < hostiles.length; i += 1) {
			player = getUnit(0, hostiles[i]);

			if (player) {
				do {
					if (player.mode !== 0 && player.mode !== 17 && getPlayerFlag(me.gid, player.gid, 8) && !player.inTown && !me.inTown) {
						return player;
					}
				} while (player.getNext());
			}
		}

		return false;
	};

	// Init config and attacks
	Config.init();
	Attack.init();
	Storage.Init();

	// Load flash thread
	if (Config.HostileAction > 1) {
		load("tools/FlashThread.js");
	}

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

				return;
			}

			this.findHostiles();

			findTrigger = false;
		}

		if (Config.HostileAction === 3 && hostiles.length > 0 && me.area === 131 && me.classid === 1) { // Spam entrance test
			prevPos = {x: me.x, y: me.y};

			this.pause();
			Pather.moveTo(15103, 5247);

			while (!this.findPlayer() && hostiles.length > 0) {
				if (!me.getState(121)) {
					Skill.cast(Config.AttackSkill[1], ClassAttack.skillHand[1], 15099, 5237);
				} else {
					if (Config.AttackSkill[2] > -1) {
						Skill.cast(Config.AttackSkill[2], ClassAttack.skillHand[2], 15099, 5237);
					} else {
						while (me.getState(121)) {
							delay(40);
						}
					}
				}
			}
		}

		player = this.findPlayer();

		if (player) {
			// Quit if hostile player is nearby
			if (Config.HostileAction === 1) {
				quit();

				return;
			}

			// Kill the hostile player
			if (!prevPos) {
				prevPos = {x: me.x, y: me.y};
			}

			this.pause();
			this.startFlash(player.gid); // might need to be expanded

			Config.UseMerc = false; // Don't go revive the merc mid-fight
			attackCount = 0;

			while (attackCount < 100) {
				if (!copyUnit(player).x || player.inTown) { // Invalidated unit (out of getUnit range)
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
					break;
				}
			}

			Pather.moveTo(prevPos.x, prevPos.y);
			this.resume();
			this.stopFlash();
		}

		if (mugShot) {
			hideConsole();
			delay(500);
			takeScreenshot();

			mugShot = false;
		}

		delay(200);
	}
}