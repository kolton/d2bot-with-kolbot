/*
* Follower by kolton
* To initiate the follow sequence make a TP and send command "1".
*
* Commands:
* Main commands:
*	1 - take leader's tp from town / move to leader's town
*	2 - take leader's tp to town
*	3 - town manager
*	c - get corpse
*	p - pick items
*	s - toggle stop
*	<charname> s - toggle stop <charname>
* Attack:
*	a - attack toggle for all
*	<charname> a - attack toggle for <charname>
*	aon - attack on for all
*	<charname> aon - attack on for <charname>
*	aoff - attack off for all
*	<charname> aoff - attack off for <charname>
* Teleport: *** characters without teleport skill will ignore tele command ***
*	tele - toggle teleport for all
*	<charname> tele - toggle teleport for <charname>
*	tele on - teleport on for all
*	<charname> tele on -  teleport on for <charname>
*	tele off - teleport off for all
*	<charname> tele off - teleport off for <charname>
* Skills: *** refer to skills.txt ***
*	all skill <skillid> - change skill for all. refer to skills.txt
*	<charname> skill <skillid> - change skill for <charname>
*	<class> skill <skillid> - change skill for all characters of certain class *** any part of class name will do *** for example: "sorc skill 36", "zon skill 0", "din skill 106"
* Auras: *** refer to skills.txt ***
*	all aura <skillid> - change aura for all paladins
*	<charname> aura <skillid> - change aura for <charname>
* Town:
*	a2-5 - move to appropriate act (after quest) !NOTE: Disable 'no sound' or game will crash!
*	talk <npc name> - talk to a npc in town
* Misc.
*	cow - enter red cow portal
*	wp - all players activate a nearby wp
*	<charname> wp - <charname> activates a nearby wp
*	bo - barbarian precast
*	<charname> tp - make a TP. Needs a TP tome if not using custom libs.
*	move - move in a random direction (use if you're stuck by followers)
*	reload - reload script. Use only in case of emergency, or after editing character config.
*	quit - exit game
*/

function Follower() {
	var i, j, stop, leader, leaderUnit, charClass, piece, skill, result, unit, player, coord,
		commanders = [Config.Leader],
		attack = true,
		openContainers = true,
		classes = ["amazon", "sorceress", "necromancer", "paladin", "barbarian", "druid", "assassin"],
		action = "";

	// Get leader's Party Unit
	this.getLeader = function (name) {
		var player = getParty();

		if (player) {
			do {
				if (player.name === name) {
					return player;
				}
			} while (player.getNext());
		}

		return false;
	};

	// Get leader's Unit
	this.getLeaderUnit = function (name) {
		var player = getUnit(0, name);

		if (player) {
			do {
				if (!player.dead) {
					return player;
				}
			} while (player.getNext());
		}

		return false;
	};

	// Get leader's act from Party Unit
	this.checkLeaderAct = function (unit) {
		if (unit.area <= 39) {
			return 1;
		}

		if (unit.area >= 40 && unit.area <= 74) {
			return 2;
		}

		if (unit.area >= 75 && unit.area <= 102) {
			return 3;
		}

		if (unit.area >= 103 && unit.area <= 108) {
			return 4;
		}

		return 5;
	};

	// Change areas to where leader is
	this.checkExit = function (unit, area) {
		if (unit.inTown) {
			return false;
		}

		var i, target,
			exits = getArea().exits;

		for (i = 0; i < exits.length; i += 1) {
			if (exits[i].target === area) {
				return 1;
			}
		}

		if (unit.inTown) {
			target = getUnit(2, "waypoint");

			if (target && getDistance(me, target) < 20) {
				return 3;
			}
		}

		target = getUnit(2, "portal");

		if (target) {
			do {
				if (target.objtype === area) {
					Pather.usePortal(null, null, target);

					return 2;
				}
			} while (target.getNext());
		}

		// Arcane<->Cellar portal
		if ((me.area === 74 && area === 54) || (me.area === 54 && area === 74)) {
			Pather.usePortal(null);

			return 4;
		}

		// Tal-Rasha's tomb->Duriel's lair
		if (me.area >= 66 && me.area <= 72 && area === 73) {
			Pather.useUnit(2, 100, area);

			return 4;
		}

		// Throne->Chamber
		if (me.area === 131 && area === 132) {
			target = getUnit(2, 563);

			if (target) {
				Pather.usePortal(null, null, target);

				return 4;
			}
		}

		return false;
	};

	// Talk to a NPC
	this.talk = function (name) {
		if (!me.inTown) {
			say("I'm not in town!");

			return false;
		}

		if (typeof name === "string") {
			name = name.toLowerCase();
		} else {
			say("No NPC name given.");

			return false;
		}

		var npc, names;

		switch (me.act) {
		case 1:
			names = [NPC.Gheed, NPC.Charsi, NPC.Akara, NPC.Kashya, NPC.Cain, NPC.Warriv];

			break;
		case 2:
			names = [NPC.Fara, NPC.Lysander, NPC.Greiz, NPC.Elzix, NPC.Jerhyn, NPC.Meshif, NPC.Drognan, NPC.Atma, NPC.Cain];

			break;
		case 3:
			names = [NPC.Alkor, NPC.Asheara, NPC.Ormus, NPC.Hratli, NPC.Cain];

			break;
		case 4:
			names = [NPC.Halbu, NPC.Tyrael, NPC.Jamella, NPC.Cain];

			break;
		case 5:
			names = [NPC.Larzuk, NPC.Malah, NPC.Qual_Kehk, NPC.Anya, NPC.Nihlathak, NPC.Cain];

			break;
		}

		if (names.indexOf(name) === -1) {
			say("Invalid NPC.");

			return false;
		}

		if (!Town.move(name === NPC.Jerhyn ? "palace" : name)) {
			Town.move("portalspot");
			say("Failed to move to town spot.");

			return false;
		}

		npc = getUnit(1);

		if (npc) {
			do {
				if (npc.name.replace(/ /g, "").toLowerCase().indexOf(name) > -1) {
					npc.openMenu();
					me.cancel();
					Town.move("portalspot");
					say("Done talking.");

					return true;
				}
			} while (npc.getNext());
		}

		say("NPC not found.");
		Town.move("portalspot");

		return false;
	};

	// Change act after completing last act quest
	this.changeAct = function (act) {
		var npc, preArea, target;

		preArea = me.area;

		switch (act) {
		case 2:
			if (me.area >= 40) {
				break;
			}

			Town.move(NPC.Warriv);

			npc = getUnit(1, 155);

			if (npc) {
				npc.openMenu();
				Misc.useMenu(0x0D36);
			}

			break;
		case 3:
			if (me.area >= 75) {
				break;
			}

			Town.move("palace");

			npc = getUnit(1, 201);

			if (npc) {
				npc.openMenu();
				me.cancel();
			}

			Town.move(NPC.Meshif);

			npc = getUnit(1, 210);

			if (npc) {
				npc.openMenu();
				Misc.useMenu(0x0D38);
			}

			break;
		case 4:
			if (me.area >= 103) {
				break;
			}

			if (me.inTown) {
				Town.move(NPC.Cain);

				npc = getUnit(1, 245);

				if (npc) {
					npc.openMenu();
					me.cancel();
				}

				Town.move("portalspot");
				Pather.usePortal(102, null);
			}

			delay(1500);

			target = getUnit(2, 342);

			if (target) {
				Pather.moveTo(target.x - 3, target.y - 1);
			}

			Pather.usePortal(null);

			break;
		case 5:
			if (me.area >= 109) {
				break;
			}

			Town.move(NPC.Tyrael);

			npc = getUnit(1, NPC.Tyrael);

			if (npc) {
				npc.openMenu();
				me.cancel();

				try {
					Pather.useUnit(2, 566, 109);
				} catch (a5e) {

				}
			}

			break;
		}

		delay(2000);

		while (!me.area) {
			delay(500);
		}

		if (me.area === preArea) {
			me.cancel();
			Town.move("portalspot");
			say("Act change failed.");

			return false;
		}

		Town.move("portalspot");
		say("Act change successful.");

		if (act === 2) {
			say("Don't forget to talk to Drognan after getting the Viper Amulet!");
		}

		return true;
	};

	this.pickPotions = function (range) {
		if (me.dead) {
			return false;
		}

		Town.clearBelt();

		while (!me.idle) {
			delay(40);
		}

		var status,
			pickList = [],
			item = getUnit(4);

		if (item) {
			do {
				if ((item.mode === 3 || item.mode === 5) && item.itemType >= 76 && item.itemType <= 78 && getDistance(me, item) <= range) {
					pickList.push(copyUnit(item));
				}
			} while (item.getNext());
		}

		pickList.sort(Pickit.sortItems);

		while (pickList.length > 0) {
			item = pickList.shift();

			if (item && copyUnit(item).x) {
				status = Pickit.checkItem(item).result;

				if (status && Pickit.canPick(item)) {
					Pickit.pickItem(item, status);
				}
			}
		}

		return true;
	};

	this.openContainers = function (range) {
		var unit, ox, oy,
			unitList = [],
			containers = ["chest", "loose rock", "hidden stash", "loose boulder", "corpseonstick", "casket", "armorstand", "weaponrack", "barrel", "holeanim",
							"roguecorpse", "ratnest", "corpse", "goo pile", "largeurn", "urn", "chest3", "jug", "skeleton", "guardcorpse", "sarcophagus",
							"cocoon", "basket", "stash", "hollow log", "hungskeleton", "pillar", "skullpile", "skull pile", "jar3", "jar2", "jar1", "bonechest", "woodchestl",
							"woodchestr", "barrel wilderness", "burialchestr", "burialchestl", "explodingchest", "chestl", "chestr", "icecavejar1", "icecavejar2",
							"icecavejar3", "icecavejar4", "deadperson", "deadperson2", "evilurn", "tomb1l", "tomb3l", "tomb2", "tomb3", "object2", "groundtomb", "groundtombl"
						];

		ox = me.x;
		oy = me.y;
		unit = getUnit(2);

		if (unit) {
			do {
				if (containers.indexOf(unit.name.toLowerCase()) > -1 && unit.mode === 0 && getDistance(me, unit) <= range) {
					unitList.push(copyUnit(unit));
				}
			} while (unit.getNext());
		}

		while (unitList.length > 0) {
			unitList.sort(Sort.units);

			unit = unitList.shift();

			if (unit) {
				Misc.openChest(unit);
				Pickit.pickItems();
			}
		}

		return true;
	};

	this.chatEvent = function (nick, msg) {
		if (msg && nick === Config.Leader) {
			switch (msg) {
			case "tele":
			case me.name + " tele":
				if (Pather.teleport) {
					Pather.teleport = false;

					say("Teleport off.");
				} else {
					Pather.teleport = true;

					say("Teleport on.");
				}

				break;
			case "tele off":
			case me.name + " tele off":
				Pather.teleport = false;

				say("Teleport off.");

				break;
			case "tele on":
			case me.name + " tele on":
				Pather.teleport = true;

				say("Teleport on.");

				break;
			case "a":
			case me.name + " a":
				if (attack) {
					attack = false;

					say("Attack off.");
				} else {
					attack = true;

					say("Attack on.");
				}

				break;
			case "flash":
				Packet.flash(me.gid);

				break;
			case "aoff":
			case me.name + " aoff":
				attack = false;

				say("Attack off.");

				break;
			case "aon":
			case me.name + " aon":
				attack = true;

				say("Attack on.");

				break;
			case "quit":
			case me.name + " quit":
				quit();

				break;
			case "s":
			case me.name + " s":
				if (stop) {
					stop = false;

					say("Resuming.");
				} else {
					stop = true;

					say("Stopping.");
				}

				break;
			case "r":
				if (me.mode === 17) {
					me.revive();
				}

				break;
			default:
				if (me.classid === 3 && msg.indexOf("aura ") > -1) {
					piece = msg.split(" ")[0];

					if (piece === me.name || piece === "all") {
						skill = parseInt(msg.split(" ")[2], 10);

						if (me.getSkill(skill, 1)) {
							say("Active aura is: " + skill);

							Config.AttackSkill[2] = skill;
							Config.AttackSkill[4] = skill;

							Skill.setSkill(skill, 0);
							//Attack.init();
						} else {
							say("I don't have that aura.");
						}
					}

					break;
				}

				if (msg.indexOf("skill ") > -1) {
					piece = msg.split(" ")[0];

					if (charClass.indexOf(piece) > -1 || piece === me.name || piece === "all") {
						skill = parseInt(msg.split(" ")[2], 10);

						if (me.getSkill(skill, 1)) {
							say("Attack skill is: " + skill);

							Config.AttackSkill[1] = skill;
							Config.AttackSkill[3] = skill;

							//Attack.init();
						} else {
							say("I don't have that skill.");
						}
					}

					break;
				}

				action = msg;

				break;
			}
		}

		if (msg && msg.split(" ")[0] === "leader" && commanders.indexOf(nick) > -1) {
			piece = msg.split(" ")[1];

			if (typeof piece === "string") {
				if (commanders.indexOf(piece) === -1) {
					commanders.push(piece);
				}

				say("Switching leader to " + piece);

				Config.Leader = piece;
				leader = this.getLeader(Config.Leader);
				leaderUnit = this.getLeaderUnit(Config.Leader);
			}
		}
	};

	addEventListener("chatmsg", this.chatEvent);

	// Override config values that use TP
	Config.TownCheck = false;
	Config.TownHP = 0;
	Config.TownMP = 0;
	charClass = classes[me.classid];

	for (i = 0; i < 20; i += 1) {
		leader = this.getLeader(Config.Leader);

		if (leader) {
			break;
		}

		delay(1000);
	}

	if (!leader) {
		say("Leader not found.");
		delay(1000);
		quit();
	} else {
		say("Leader found.");
	}

	while (!Misc.inMyParty(Config.Leader)) {
		delay(500);
	}

	say("Partied.");

	if (me.inTown) {
		Town.move("portalspot");
	}

	// Main Loop
	while (Misc.inMyParty(Config.Leader)) {
		if (me.mode === 17) {
			while (!me.inTown) {
				me.revive();
				delay(1000);
			}

			Town.move("portalspot");
			say("I'm alive!");
		}

		while (stop) {
			delay(500);
		}

		if (!me.inTown) {
			if (!leaderUnit || !copyUnit(leaderUnit).x) {
				leaderUnit = this.getLeaderUnit(Config.Leader);

				if (leaderUnit) {
					say("Leader unit found.");
				}
			}

			if (!leaderUnit) {
				player = getUnit(0);

				if (player) {
					do {
						if (player.name !== me.name) {
							Pather.moveToUnit(player);

							break;
						}
					} while (player.getNext());
				}
			}

			if (leaderUnit && getDistance(me.x, me.y, leaderUnit.x, leaderUnit.y) <= 60) {
				if (getDistance(me.x, me.y, leaderUnit.x, leaderUnit.y) > 4) {
					Pather.moveToUnit(leaderUnit);
				}
			}

			if (attack) {
				Attack.clear(20, false, false, false, false);
				this.pickPotions(20);
			}

			if (me.classid === 3 && Config.AttackSkill[2] > 0) {
				Skill.setSkill(Config.AttackSkill[2], 0);
			}

			if (leader.area !== me.area && !me.inTown) {
				while (leader.area === 0) {
					delay(100);
				}

				result = this.checkExit(leader, leader.area);

				switch (result) {
				case 1:
					say("Taking exit.");
					delay(500);
					Pather.moveToExit(leader.area, true);

					break;
				case 2:
					say("Taking portal.");

					break;
				case 3:
					say("Taking waypoint.");
					delay(500);
					Pather.useWaypoint(leader.area, true);

					break;
				case 4:
					say("Special transit.");

					break;
				}

				while (me.area === 0) {
					delay(100);
				}

				leaderUnit = this.getLeaderUnit(Config.Leader);
			}
		}

		switch (action) {
		case "cow":
			if (me.area === 1) {
				Town.move("portalspot");

				if (!Pather.usePortal(39)) {
					say("Failed to use cow portal.");
				}
			}

			break;
		case "move":
			coord = CollMap.getRandCoordinate(me.x, -5, 5, me.y, -5, 5);
			Pather.moveTo(coord.x, coord.y);

			break;
		case "wp":
		case me.name + "wp":
			if (me.inTown) {
				break;
			}

			delay(rand(1, 3) * 500);

			unit = getUnit(2, "waypoint");

			if (unit) {
WPLoop:
				for (i = 0; i < 3; i += 1) {
					if (getDistance(me, unit) > 3) {
						Pather.moveToUnit(unit);
					}

					unit.interact();

					for (j = 0; j < 100; j += 1) {
						if (j % 20 === 0) {
							me.cancel();
							delay(300);
							unit.interact();
						}

						if (getUIFlag(0x14)) {
							break WPLoop;
						}

						delay(10);
					}
				}
			}

			if (getUIFlag(0x14)) {
				say("Got wp.");
			} else {
				say("Failed to get wp.");
			}

			me.cancel();

			break;
		case "c":
			if (!me.inTown) {
				Town.getCorpse();
			}

			break;
		case "p":
			say("!Picking items.");
			Pickit.pickItems();

			if (openContainers) {
				this.openContainers(20);
			}

			say("!Done picking.");

			break;
		case "1":
			if (me.inTown && leader.inTown && this.checkLeaderAct(leader) !== me.act) {
				say("Going to leader's town.");
				Town.goToTown(this.checkLeaderAct(leader));
				Town.move("portalspot");
			} else if (me.inTown) {
				say("Going outside.");
				Town.goToTown(this.checkLeaderAct(leader));
				Town.move("portalspot");

				if (!Pather.usePortal(null, leader.name)) {
					break;
				}

				while (!this.getLeaderUnit(Config.Leader) && !me.dead) {
					Attack.clear(10);
					delay(200);
				}
			}

			break;
		case "2":
			if (!me.inTown) {
				delay(150);
				say("Going to town.");
				Pather.usePortal(null, leader.name);
			}

			break;
		case "3":
			if (me.inTown) {
				say("Running town chores");
				Town.doChores();
				Town.move("portalspot");
				say("Ready");
			}

			break;
		case "h":
			if (me.classid === 4) {
				Skill.cast(130);
			}

			break;
		case "bo":
			if (me.classid === 4) {
				Precast.doPrecast(true);
			}

			break;
		case "a2":
		case "a3":
		case "a4":
		case "a5":
			this.changeAct(parseInt(action[1], 10));

			break;
		case me.name + " tp":
			unit = me.findItem("tbk", 0, 3);

			if (unit && unit.getStat(70)) {
				unit.interact();

				break;
			}

			unit = me.findItem("tsc", 0, 3);

			if (unit) {
				unit.interact();

				break;
			}

			say("No TP scrolls or tomes.");

			break;
		}

		if (action.indexOf("talk") > -1) {
			this.talk(action.split(" ")[1]);
		}

		action = "";

		delay(100);
	}

	return true;
}