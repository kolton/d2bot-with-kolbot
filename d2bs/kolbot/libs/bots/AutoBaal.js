/**
*	@filename	AutoBaal.js
*	@author		kolton
*	@desc		Universal Baal leecher by Kolton with Autoleader by Ethic
*				Pure leech script for throne and Baal
*				Reenters throne/chamber upon death and picks the corpse back up
*				Make sure you setup safeMsg and baalMsg accordingly
*/

function AutoBaal() {
	// editable variables
	var i, baalCheck, throneCheck, hotCheck, leader, suspect, solofail, portal, baal,
		// internal variables
		safeMsg = ["safe", "throne clear", "leechers can come", "tp is up", "1 clear"], // safe message - casing doesn't matter
		baalMsg = ["baal", "submortal"], // baal message - casing doesn't matter
		hotMsg = ["hot", "warm"]; // used for shrine hunt

	addEventListener('chatmsg', // chat event, listen to what leader says
		function (nick, msg) { // handler function
			var i;

			if (nick === leader) { // filter leader messages
				for (i = 0; i < hotMsg.length; i += 1) { // loop through all predefined messages to find a match
					if (msg.toLowerCase().indexOf(hotMsg[i].toLowerCase()) > -1 && Config.AutoBaal.FindShrine === 1) { // leader says a hot tp message
						hotCheck = true; // safe to enter baal chamber

						break;
					}
				}

				for (i = 0; i < safeMsg.length; i += 1) { // loop through all predefined messages to find a match
					if (msg.toLowerCase().indexOf(safeMsg[i].toLowerCase()) > -1) { // leader says a safe tp message
						throneCheck = true; // safe to enter throne

						break;
					}
				}

				for (i = 0; i < baalMsg.length; i += 1) { // loop through all predefined messages to find a match
					if (msg.toLowerCase().indexOf(baalMsg[i].toLowerCase()) > -1) { // leader says a baal message
						baalCheck = true; // safe to enter baal chamber

						break;
					}
				}
			}
		}
		);

	// test
	this.longRangeSupport = function () {
		var monster, monList, index;

		switch (me.classid) {
		case 0:
			break;
		case 1:
			break;
		case 2:
			ClassAttack.raiseArmy(50);

			if (Config.Curse[1] > 0) {
				monster = getUnit(1);

				if (monster) {
					do {
						if (Attack.checkMonster(monster) && getDistance(me, monster) < 50 && !checkCollision(me, monster, 0x4) &&
								ClassAttack.isCursable(monster) && !(monster.spectype & 0x7) && !monster.getState(ClassAttack.curseState[1])) {
							Skill.cast(Config.Curse[1], 0, monster);
						}
					} while (monster.getNext());
				}
			}

			break;
		case 3:
			break;
		case 4:
			break;
		case 5:
			break;
		case 6:
			break;
		}

		if ([24, 49, 51, 56, 59, 84, 93, 140, 244].indexOf(Config.AttackSkill[1]) === -1 &&
				[24, 49, 51, 56, 59, 84, 93, 140, 244].indexOf(Config.AttackSkill[3]) === -1) {
			return false;
		}

		monster = getUnit(1);
		monList = [];

		if (monster) {
			do {
				if (Attack.checkMonster(monster) && getDistance(me, monster) < 50 && !checkCollision(me, monster, 0x4)) {
					monList.push(copyUnit(monster));
				}
			} while (monster.getNext());
		}

		while (monList.length) {
			monList.sort(Sort.units);

			monster = copyUnit(monList[0]);

			if (monster && Attack.checkMonster(monster)) {
				index = monster.spectype & 0x7 ? 1 : 3;

				if (Attack.checkResist(monster, Attack.getSkillElement(Config.AttackSkill[index]))) {
					if (Config.AttackSkill[index] > -1) {
						if (!me.getState(121)) {
							Skill.cast(Config.AttackSkill[index], ClassAttack.skillHand[index], monster);
						} else if (Config.AttackSkill[index + 1] > -1) {
							Skill.cast(Config.AttackSkill[index + 1], ClassAttack.skillHand[index + 1], monster);
						} else {
							while (me.getState(121)) {
								delay(40);
							}
						}
					}
				} else {
					monList.shift();
				}
			} else {
				monList.shift();
			}

			delay(5);
		}

		return true;
	};

	function autoLeaderDetect(destination) { // autoleader by Ethic
		do {
			solofail = 0;
			suspect = getParty(); // get party object (players in game)

			do {
				if (suspect.name !== me.name) { // player isn't alone
					solofail += 1;
				}

				if (suspect.area === destination) { // first player in our party found in destination area...
					leader = suspect.name; // ... is our leader
					print("ÿc4AutoBaal: ÿc0Autodetected " + leader);
					return true;
				}
			} while (suspect.getNext());

			if (solofail === 0) { // empty game, nothing left to do
				return false;
			}

			delay(500);
		} while (!leader); // repeat until leader is found (or until game is empty)

		return false;
	}

	if (!Town.goToTown(5)) {
		throw new Error("Town.goToTown failed."); // critical error - can't reach harrogath
	}

	if (Config.Leader) {
		leader = Config.Leader;

		for (i = 0; i < 30; i += 1) {
			if (Misc.inMyParty(leader)) {
				break;
			}

			delay(1000);
		}

		if (i === 30) {
			throw new Error("Autobaal: Leader not partied");
		}
	}

	if (Config.AutoBaal.FindShrine === 2) {
		hotCheck = true;
	}

	Town.doChores();
	Town.move("portalspot");

	if (leader || autoLeaderDetect(131)) { // find the first player in area 131 - throne of destruction
		while (Misc.inMyParty(leader)) { // do our stuff while partied
			if (hotCheck) {
				Pather.useWaypoint(4);
				Precast.doPrecast(true);

				for (i = 4; i > 1; i -= 1) {
					if (Misc.getShrinesInArea(i, 15, true)) {
						break;
					}
				}

				if (i === 1) {
					Town.goToTown();
					Pather.useWaypoint(5);

					for (i = 5; i < 8; i += 1) {
						if (Misc.getShrinesInArea(i, 15, true)) {
							break;
						}
					}
				}

				Town.goToTown(5);
				Town.move("portalspot");

				hotCheck = false;
			}

			if (throneCheck && me.area === 109) { // wait for throne signal - leader's safe message
				print("ÿc4AutoBaal: ÿc0Trying to take TP to throne.");
				Pather.usePortal(131, null); // take TP to throne
				Pather.moveTo(Config.AutoBaal.LeechSpot[0], Config.AutoBaal.LeechSpot[1]); // move to a safe spot
				Precast.doPrecast(true);
				Town.getCorpse(); // check for corpse - happens if you die and reenter
			}

			if (!baalCheck && me.area === 131 && Config.AutoBaal.LongRangeSupport) {
				this.longRangeSupport();
			}

			if (baalCheck && me.area === 131) { // wait for baal signal - leader's baal message
				Pather.moveTo(15092, 5010); // move closer to chamber portal
				Precast.doPrecast(false);

				while (getUnit(1, 543)) { // wait for baal to go through the portal
					delay(500);
				}

				portal = getUnit(2, 563);

				delay(2000); // wait for others to enter first - helps  with curses and tentacles from spawning around you
				print("ÿc4AutoBaal: ÿc0Entering chamber.");

				if (Pather.usePortal(null, null, portal)) { // enter chamber
					Pather.moveTo(15166, 5903); // go to a safe position
				}

				Town.getCorpse(); // check for corpse - happens if you die and reenter
			}

			baal = getUnit(1, 544);

			if (baal) {
				if (baal.mode === 0 || baal.mode === 12) {
					break;
				}

				this.longRangeSupport();
			}

			if (me.mode === 17) { // death check
				me.revive(); // revive if dead
			}

			delay(500);
		}
	} else {
		throw new Error("Empty game.");
	}

	return true;
}