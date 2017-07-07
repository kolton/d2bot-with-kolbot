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
include("CraftingSystem.js");
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
if (!isIncluded("common/Enums.js")) { include("common/Enums.js"); };

function main() {
	// Variables and functions
	var player, attackCount, prevPos, check, missile,
		charClass = ["Amazon", "Sorceress", "Necromancer", "Paladin", "Barbarian", "Druid", "Assassin"],
		hostiles = [];

	// AntiHostile gets game event info from ToolsThread
	this.scriptEvent = function (msg) {
		switch (msg.split(" ")[0]) {
		case "remove": // Remove a hostile player that left the game
			if (hostiles.indexOf(msg.split(" ")[1]) > -1) {
				hostiles.splice(hostiles.indexOf(msg.split(" ")[1]), 1);
			}

			break;
		case "mugshot": // Take a screenshot and log the kill
			D2Bot.printToConsole(msg.split(" ")[1] + " has been neutralized.", 4);
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
					D2Bot.printToConsole(party.name + " (Level " + party.level + " " + charClass[party.classid] + ")" + " has declared hostility.", 8);
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

	// Find hostile player Units
	this.findPlayer = function () {
		var i, player;

		for (i = 0; i < hostiles.length; i += 1) {
            player = getUnit(UnitType.Player, hostiles[i]);

			if (player) {
				do {
                    if (player.mode !== PlayerModes.Death && player.mode !== PlayerModes.Dead && getPlayerFlag(me.gid, player.gid, 8) && !player.inTown && !me.inTown) {
						return player;
					}
				} while (player.getNext());
			}
		}

		return false;
	};

	// Find a missile type
	this.findMissile = function (owner, id, range) {
		if (range === undefined) {
			range = 999;
		}

        var missile = getUnit(UnitType.Missile, id);

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

	this.checkSummons = function (player) {
		var unit,
			name = player.name;

        unit = getUnit(UnitType.NPC);

		if (unit) {
			do {
				// Revives and spirit wolves
                if (unit.getParent() && unit.getParent().name === name && (unit.getState(States.REVIVE) || unit.classid === UnitClassID.spiritwolf)) {
					return true;
				}
			} while (unit.getNext());
		}

		return false;
	};

	// Init config and attacks
	D2Bot.init();
	Config.init();
	Attack.init();
	Storage.Init();

	// Use PVP range for attacks
	Skill.usePvpRange = true;

	// Attack sequence adjustments - this only affects the AntiHostile thread
    switch (me.classid) {
        case ClassID.Assassin: // Assassin - use Mind Blast with trapsins
            if (me.getSkill(Skills.Assassin.Mind_Blast, 1) && [Skills.Assassin.Fire_Trauma, Skills.Assassin.Shock_Field].indexOf(Config.AttackSkill[1]) > -1) {
                Config.AttackSkill[1] = Skills.Assassin.Mind_Blast; // Mind Blast
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

	// Main Loop
	while (true) {
		if (me.gameReady) {
			// Scan for hostiles
			this.findHostiles();

			if (hostiles.length > 0 && (Config.HostileAction === 0 || (Config.HostileAction === 1 && me.inTown))) {
				if (Config.TownOnHostile) {
					this.pause();
					Town.goToTown();

					while (hostiles.length > 0) {
						delay(500);
					}

					Pather.usePortal(null, me.name);
					this.resume();
				} else {
					scriptBroadcast("quit");
				}

				return;
			}

			// Mode 3 - Spam entrance (still experimental)
            if (Config.HostileAction === 3 && hostiles.length > 0 && me.area === Areas.Act5.Throne_Of_Destruction) {
				switch (me.classid) {
				case ClassID.Sorceress: // Sorceress
					prevPos = {x: me.x, y: me.y};
					this.pause();
                    Pather.moveTo(15103, 5247); Skills.Druid.Tornado

					while (!this.findPlayer() && hostiles.length > 0) {
                        if (!me.getState(States.SKILLDELAY)) {
							Skill.cast(Config.AttackSkill[1], Skill.getHand(Config.AttackSkill[1]), 15099, 5237);
						} else {
							if (Config.AttackSkill[2] > -1) {
								Skill.cast(Config.AttackSkill[2], Skill.getHand(Config.AttackSkill[2]), 15099, 5237);
							} else {
                                while (me.getState(States.SKILLDELAY)) {
									delay(40);
								}
							}
						}
					}

					break;
                case ClassID.Druid: // Druid
					// Don't bother if it's not a tornado druid
					if (Config.AttackSkill[1] !== 245) {
						break;
					}

					prevPos = {x: me.x, y: me.y};
					this.pause();
					Pather.moveTo(15103, 5247);

					while (!this.findPlayer() && hostiles.length > 0) {
						// Tornado path is a function of target x. Slight randomization will make sure it can't always miss
						Skill.cast(Config.AttackSkill[1], Skill.getHand(Config.AttackSkill[1]), 15099 + rand(-2, 2), 5237);
					}

					break;
                case ClassID.Assassin: // Assassin
					prevPos = {x: me.x, y: me.y};
					this.pause();
					Pather.moveTo(15103, 5247);

					while (!this.findPlayer() && hostiles.length > 0) {
						if (Config.UseTraps) {
                            check = ClassAttack.checkTraps({ x: 15099, y: 5242, classid: UnitClassID.baalcrab});

							if (check) {
                                ClassAttack.placeTraps({ x: 15099, y: 5242, classid: UnitClassID.baalcrab}, 5);
							}
						}

						Skill.cast(Config.AttackSkill[1], Skill.getHand(Config.AttackSkill[1]), 15099, 5237);

                        while (me.getState(States.SKILLDELAY)) {
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
						scriptBroadcast("quit");
					}

					return;
				}

				// Kill the hostile player
				if (!prevPos) {
					prevPos = {x: me.x, y: me.y};
				}

				this.pause();

				Config.UseMerc = false; // Don't go revive the merc mid-fight
				attackCount = 0;

				while (attackCount < 100) {
                    if (!copyUnit(player).x || player.inTown || me.mode === PlayerModes.Dead) { // Invalidated Unit (out of getUnit range) or player in town
						break;
					}

					ClassAttack.doAttack(player, false);

					// Specific attack additions
					switch (me.classid) {
                        case ClassID.Sorceress: // Sorceress
                        case ClassID.Necromancer: // Necromancer
						// Dodge missiles - experimental
                            missile = getUnit(UnitType.Missile);

						if (missile) {
							do {
								if (getPlayerFlag(me.gid, missile.owner, 8) && (getDistance(me, missile) < 15 || (missile.targetx && getDistance(me, missile.targetx, missile.targety) < 15))) {
									this.moveAway(missile, Skill.getRange(Config.AttackSkill[1]));

									break;
								}
							} while (missile.getNext());
						}

						// Move away if the player is too close or if he tries to move too close (telestomp)
						if (Skill.getRange(Config.AttackSkill[1]) > 20 && (getDistance(me, player) < 30 || (player.targetx && getDistance(me, player.targetx, player.targety) < 15))) {
							this.moveAway(player, Skill.getRange(Config.AttackSkill[1]));
						}

						break;
                        case ClassID.Paladin: // Paladin
						// Smite summoners
                            if (Config.AttackSkill[1] === Skills.Paladin.Blessed_Hammer && me.getSkill(Skills.Paladin.Smite, 1)) {
                                if ([ClassID.Necromancer, ClassID.Druid].indexOf(player.classid) > -1 && getDistance(me, player) < 4 && this.checkSummons(player)) {
                                    Skill.cast(Skills.Paladin.Smite, 1, player);
							}
						}

						break;
					}

					attackCount += 1;

                    if (player.mode === PlayerModes.Death || player.mode === PlayerModes.Dead) {
						break;
					}
				}

				Pather.moveTo(prevPos.x, prevPos.y);
				this.resume();
			}
		}

		delay(200);
	}
}