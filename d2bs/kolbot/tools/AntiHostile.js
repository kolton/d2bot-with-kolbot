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
	var player, findTrigger, attackCount, prevPos, check, missile,
		charClass = ["Amazon", "Sorceress", "Necromancer", "Paladin", "Barbarian", "Druid", "Assassin"],
		hostiles = [];

	// AntiHostile gets game event info from ToolsThread
	this.scriptEvent = function (msg) {
		switch (msg.split(" ")[0]) {
		case "findHostiles": // Scan for hostile players
			findTrigger = true;

			break;
		case "remove": // Remove a hostile player that left the game
			if (hostiles.indexOf(msg.split(" ")[1]) > -1) {
				hostiles.splice(hostiles.indexOf(msg.split(" ")[1]), 1);
			}

			break;
		case "mugshot": // Take a screenshot and log the kill
			D2Bot.printToConsole(msg.split(" ")[1] + " has been neutralized.;4");
			hideConsole();
			delay(500);
			takeScreenshot();

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

	// Initiate flashing sequence
	this.startFlash = function (gid) {
		var script = getScript("tools/FlashThread.js");

		if (script) {
			script.send("flash " + gid);
		}
	};

	// Abort flashing sequence
	this.stopFlash = function () {
		var script = getScript("tools/FlashThread.js");

		if (script) {
			script.send("unflash");
		}
	};

	// Find hostile player Units
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

	// Find a missile type
	this.findMissile = function (owner, id, range) {
		if (typeof range === "undefined") {
			range = 999;
		}

		var missile = getUnit(3, id);

		if (!missile) {
			return false;
		}

		do {
			if (missile.owner === owner.gid && getDistance(owner, missile) < range) {
				return missile;
			}
		} while (missile.getNext());

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

	// Attack sequence adjustments - this only affects the AntiHostile thread
	switch (me.classid) {
	case 0: // Amazon - increase skill range
		if ([24].indexOf(Config.AttackSkill[1]) > -1) {
			ClassAttack.skillRange[1] = 40;
			ClassAttack.skillRange[2] = 40;
		}

		break;
	case 1: // Sorceress - increase skill range
		if ([47, 49, 51, 53, 56, 59].indexOf(Config.AttackSkill[1]) > -1) {
			ClassAttack.skillRange[1] = 40;
			ClassAttack.skillRange[2] = 40;
		}

		break;
	case 2: // Necromancer - increase skill range
		if ([84, 93].indexOf(Config.AttackSkill[1]) > -1) {
			ClassAttack.skillRange[1] = 40;
			ClassAttack.skillRange[2] = 40;
		}

		break;
	case 6: // Assassin - use Mind Blast with trapsins
		if (me.getSkill(273, 1) && [251, 256].indexOf(Config.AttackSkill[1]) > -1) {
			Config.AttackSkill[1] = 273; // Mind Blast
			ClassAttack.skillRange[1] = 40;
			ClassAttack.trapRange = 40;
		}

		break;
	}

	// A simple but fast player dodge function
	this.moveAway = function (unit, range) {
		var i, coordx, coordy,
			angle = Math.round(Math.atan2(me.y - unit.y, me.x - unit.x) * 180 / Math.PI),
			angles = [0, 45, -45, 90, -90, 135, -135, 180];

		for (i = 0; i < angles.length; i += 1) {
			// Avoid the position where the player actually tries to move to
			coordx = Math.round((Math.cos((angle + angles[i]) * Math.PI / 180)) * range + unit.x); // unit.targetx
			coordy = Math.round((Math.sin((angle + angles[i]) * Math.PI / 180)) * range + unit.y); // unit.targety

			if (Attack.validSpot(coordx, coordy)) {
				return Pather.moveTo(coordx, coordy);
			}
		}

		return false;
	};

	addEventListener("scriptmsg", this.scriptEvent);
	print("ÿc2Anti-Hostile thread loaded.");
	this.findHostiles();

	// Main Loop
	while (true) {
		// Scan for hostiles or quit
		if (findTrigger) {
			if (Config.HostileAction === 0) {
				if (Config.TownOnHostile) {
					this.pause();
					Town.goToTown();

					while (hostiles.length > 0) {
						delay(500);
					}
					
					Pather.usePortal(null, me.name);
					this.resume();
				} else {
					quit();
				}

				return;
			}

			this.findHostiles();

			findTrigger = false;
		}

		// Mode 3 - Spam entrance (still experimental)
		if (Config.HostileAction === 3 && hostiles.length > 0 && me.area === 131) {
			switch (me.classid) {
			case 1: // Sorceress
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

				break;
			case 5: // Druid
				// Don't bother if it's not a tornado druid
				if (Config.AttackSkill[1] !== 245) {
					break;
				}

				prevPos = {x: me.x, y: me.y};
				this.pause();
				Pather.moveTo(15103, 5247);

				while (!this.findPlayer() && hostiles.length > 0) {
					// Tornado path is a function of target x. Slight randomization will make sure it can't always miss
					Skill.cast(Config.AttackSkill[1], ClassAttack.skillHand[1], 15099 + rand(-2, 2), 5237);
				}

				break;
			case 6: // Assassin
				prevPos = {x: me.x, y: me.y};
				this.pause();
				Pather.moveTo(15103, 5247);

				while (!this.findPlayer() && hostiles.length > 0) {
					if (Config.UseTraps) {
						check = ClassAttack.checkTraps({x: 15099, y: 5242, classid: 544});

						if (check) {
							ClassAttack.placeTraps({x: 15099, y: 5242, classid: 544}, 5);
						}
					}

					Skill.cast(Config.AttackSkill[1], ClassAttack.skillHand[1], 15099, 5237);

					while (me.getState(121)) {
						delay(40);
					}
				}

				break;
			}
		}

		// Player left, return to old position
		if (!hostiles.length && prevPos) {
			Pather.moveTo(prevPos.x, prevPos.y);
			this.resume();

			// Reset position
			prevPos = false;
		}

		player = this.findPlayer();

		if (player) {
			// Mode 1 - Quit if hostile player is nearby
			if (Config.HostileAction === 1) {
				if (Config.TownOnHostile) {
					this.pause();
					Town.goToTown();

					while (hostiles.length > 0) {
						delay(500);
					}

					Pather.usePortal(null, me.name);
					this.resume();
				} else {
					quit();
				}

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
				if (!copyUnit(player).x || player.inTown || me.mode === 17) { // Invalidated Unit (out of getUnit range) or player in town
					break;
				}

				// Specific attack additions
				switch (me.classid) {
				case 1: // Sorceress
				case 2: // Necromancer
					// Dodge missiles - experimental
					missile = getUnit(3);

					if (missile) {
						do {
							if (getPlayerFlag(me.gid, missile.owner, 8) && (getDistance(me, missile) < 15 || (missile.targetx && getDistance(me, missile.targetx, missile.targety) < 15))) {
								this.moveAway(missile, ClassAttack.skillRange[1]);

								break;
							}
						} while (missile.getNext());
					}

					// Move away if the player is too close or if he tries to move too close (telestomp)
					if (ClassAttack.skillRange[1] > 20 && (getDistance(me, player) < 30 || (player.targetx && getDistance(me, player.targetx, player.targety) < 15))) {
						this.moveAway(player, ClassAttack.skillRange[1]);
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

		delay(200);
	}
}