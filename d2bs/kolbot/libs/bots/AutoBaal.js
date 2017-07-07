/**
*	@filename	AutoBaal.js
*	@author		kolton
*	@desc		Universal Baal leecher by Kolton with Autoleader by Ethic
*				Pure leech script for throne and Baal
*				Reenters throne/chamber upon death and picks the corpse back up
*				Make sure you setup safeMsg and baalMsg accordingly
*/
if (!isIncluded("common/Enums.js")) { include("common/Enums.js"); };

function AutoBaal() {
	// editable variables
	var i, baalCheck, throneCheck, hotCheck, leader, suspect, solofail, portal, baal,
		// internal variables
		safeMsg = ["safe", "throne clear", "leechers can come", "tp is up", "1 clear"], // safe message - casing doesn't matter
		baalMsg = ["baal"], // baal message - casing doesn't matter
		hotMsg = ["hot", "warm", "dangerous", "lethal"]; // used for shrine hunt

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
		});

	// test
	this.longRangeSupport = function () {
		var monster, monList, index;

		switch (me.classid) {
            case ClassID.Amazon:
			break;
            case ClassID.Sorceress:
			break;
            case ClassID.Necromancer:
			ClassAttack.raiseArmy(50);

			if (Config.Curse[1] > 0) {
                monster = getUnit(UnitType.NPC);

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
            case ClassID.Paladin:
			break;
            case ClassID.Barbarian:
			break;
            case ClassID.Druid:
			break;
            case ClassID.Assassin:
			break;
		}

        if ([Skills.Amazon.Charged_Strike, Skills.Sorceress.Lightning, Skills.Sorceress.Fire_Wall, Skills.Sorceress.Meteor, Skills.Sorceress.Blizzard,
        Skills.Necromancer.Bone_Spear, Skills.Necromancer.Bone_Spirit, Skills.Barbarian.Double_Throw, Skills.Druid.Volcano].indexOf(Config.AttackSkill[1]) === -1 &&
            [Skills.Amazon.Charged_Strike, Skills.Sorceress.Lightning, Skills.Sorceress.Fire_Wall, Skills.Sorceress.Meteor, Skills.Sorceress.Blizzard,
            Skills.Necromancer.Bone_Spear, Skills.Necromancer.Bone_Spirit, Skills.Barbarian.Double_Throw, Skills.Druid.Volcano].indexOf(Config.AttackSkill[3]) === -1) {
			return false;
		}

        monster = getUnit(UnitType.NPC);
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
						ClassAttack.doCast(monster, Config.AttackSkill[index], Config.AttackSkill[index + 1]);
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

    if (leader || autoLeaderDetect(Areas.Act5.Throne_Of_Destruction)) { // find the first player in area 131 - throne of destruction
		while (Misc.inMyParty(leader)) { // do our stuff while partied
			if (hotCheck) {
                Pather.useWaypoint(Areas.Act1.Stony_Field);
				Precast.doPrecast(true);

                for (i = Areas.Act1.Stony_Field; i > Areas.Act1.Rogue_Encampment; i -= 1) {
					if (Misc.getShrinesInArea(i, 15, true)) {
						break;
					}
				}

				if (i === 1) {
					Town.goToTown();
                    Pather.useWaypoint(Areas.Act1.Dark_Wood);

                    for (i = Areas.Act1.Dark_Wood; i < Areas.Act1.Den_Of_Evil; i += 1) {
						if (Misc.getShrinesInArea(i, 15, true)) {
							break;
						}
					}
				}

				Town.goToTown(5);
				Town.move("portalspot");

				hotCheck = false;
			}

            if (throneCheck && me.area === Areas.Act5.Harrogath) { // wait for throne signal - leader's safe message
				print("ÿc4AutoBaal: ÿc0Trying to take TP to throne.");
                Pather.usePortal(Areas.Act5.Throne_Of_Destruction, null); // take TP to throne
				Pather.moveTo(Config.AutoBaal.LeechSpot[0], Config.AutoBaal.LeechSpot[1]); // move to a safe spot
				Precast.doPrecast(true);
				Town.getCorpse(); // check for corpse - happens if you die and reenter
			}

            if (!baalCheck && me.area === Areas.Act5.Throne_Of_Destruction && Config.AutoBaal.LongRangeSupport) {
				this.longRangeSupport();
			}

            if (baalCheck && me.area === Areas.Act5.Throne_Of_Destruction) { // wait for baal signal - leader's baal message
				Pather.moveTo(15092, 5010); // move closer to chamber portal
				Precast.doPrecast(false);

                while (getUnit(UnitType.NPC, UnitClassID.baalthrone)) { // wait for baal to go through the portal
					delay(500);
				}

                portal = getUnit(UnitType.Object, UniqueObjectIds.Worldstone_Chamber);

				delay(2000); // wait for others to enter first - helps  with curses and tentacles from spawning around you
				print("ÿc4AutoBaal: ÿc0Entering chamber.");

				if (Pather.usePortal(null, null, portal)) { // enter chamber
					Pather.moveTo(15166, 5903); // go to a safe position
				}

				Town.getCorpse(); // check for corpse - happens if you die and reenter
			}

            baal = getUnit(UnitType.NPC, UnitClassID.baalcrab);

			if (baal) {
                if (baal.mode === NPCModes.death || baal.mode === NPCModes.dead) {
					break;
				}

				this.longRangeSupport();
			}

            if (me.mode === PlayerModes.Dead) { // death check
				me.revive(); // revive if dead
			}

			delay(500);
		}
	} else {
		throw new Error("Empty game.");
	}

	return true;
}