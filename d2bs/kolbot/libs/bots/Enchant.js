/**
*	@filename	Enchant.js
*	@author		kolton
*	@desc		Enchant other players, open cow portal and give waypoints on command
*/
if (!isIncluded("common/Enums.js")) { include("common/Enums.js"); };

function Enchant() {
	var command, hostile, nick, spot, tick, s, m,
		startTime = getTickCount(),
		shitList = [],
		greet = [];

	this.enchant = function (nick) {
		if (!Misc.inMyParty(nick)) {
			say("Accept party invite, noob.");

			return false;
		}

		var partyUnit,
            unit = getUnit(UnitType.Player, nick);

		if (getDistance(me, unit) > 35) {
			say("Get closer.");

			return false;
		}

		if (!unit) {
			partyUnit = getParty(nick);

			// wait until party area is readable?

            if ([Areas.Act2.Lut_Gholein, Areas.Act3.Kurast_Docktown, Areas.Act4.The_Pandemonium_Fortress, Areas.Act5.Harrogath].indexOf(partyUnit.area) > -1) {
				say("Wait for me at waypoint.");
                Town.goToTown([Areas.Act1.Rogue_Encampment, Areas.Act2.Lut_Gholein, Areas.Act3.Kurast_Docktown, Areas.Act4.The_Pandemonium_Fortress, Areas.Act5.Harrogath].indexOf(partyUnit.area) + 1); // index+1 for town 2,3,4,5

                unit = getUnit(UnitType.Player, nick);
			} else {
				say("You need to be in one of the towns.");

				return false;
			}
		}

		if (unit) {
			do {
				if (!unit.dead) { // player is alive
					if (getDistance(me, unit) >= 35) {
						say("You went too far away.");

						return false;
					}

                    Skill.setSkill(Skills.Sorceress.Enchant, 0);
					sendPacket(1, 0x11, 4, unit.type, 4, unit.gid);
					delay(500);
				}
			} while (unit.getNext());
		} else {
			say("Couldn't find you, champ.");
		}

        unit = getUnit(UnitType.NPC);

		if (unit) {
			do {
				if (unit.getParent() && unit.getParent().name === nick) { // merc or any other owned unit
                    Skill.setSkill(Skills.Sorceress.Enchant, 0);
					sendPacket(1, 0x11, 4, unit.type, 4, unit.gid);
					delay(500);
				}
			} while (unit.getNext());
		}

		return true;
	};

	this.autoChant = function () {
		var unit,
			chanted = [];

		// Player
        unit = getUnit(UnitType.Player);

		if (unit) {
			do {
                if (unit.name !== me.name && !unit.dead && shitList.indexOf(unit.name) === -1 && Misc.inMyParty(unit.name) && !unit.getState(States.ENCHANT) && getDistance(me, unit) <= 40) {
                    Skill.setSkill(Skills.Sorceress.Enchant, 0);
					sendPacket(1, 0x11, 4, unit.type, 4, unit.gid);
					delay(500);
					chanted.push(unit.name);
				}
			} while (unit.getNext());
		}

		// Minion
		unit = getUnit(1);

		if (unit) {
			do {
                if (unit.getParent() && chanted.indexOf(unit.getParent().name) > -1 && !unit.getState(States.ENCHANT) && getDistance(me, unit) <= 40) {
                    Skill.setSkill(Skills.Sorceress.Enchant, 0);
					sendPacket(1, 0x11, 4, unit.type, 4, unit.gid);
					delay(500);
				}
			} while (unit.getNext());
		}

		return true;
	};

	this.getLeg = function () {
		var i, portal, wirt, leg, gid, wrongLeg;

        if (me.getItem(ItemClassIds.Wirts_Leg)) {
            return me.getItem(ItemClassIds.Wirts_Leg);
		}

		if (!Config.Enchant.GetLeg) {
            leg = getUnit(UnitType.Item, ItemClassIds.Wirts_Leg);

			if (leg) {
				do {
					if (leg.name.indexOf("ÿc1") > -1) {
						wrongLeg = true;
					} else if (getDistance(me, leg) <= 15) {
						gid = leg.gid;

						Pickit.pickItem(leg);

						return me.getItem(-1, -1, gid);
					}
				} while (leg.getNext());
			}

			say("Bring the leg " + (wrongLeg ? "from this difficulty" : "") + " close to me.");

			return false;
		}

        Pather.useWaypoint(Areas.Act1.Stony_Field);
		Precast.doPrecast(true);
        Pather.moveToPreset(me.area, UnitType.NPC, SuperUniques.Rakanishu, 8, 8);

		for (i = 0; i < 6; i += 1) {
            portal = Pather.getPortal(Areas.Act1.Tristram);

			if (portal) {
				Pather.usePortal(null, null, portal);

				break;
			}

			delay(500);
		}

		if (!portal) {
			say("Failed to enter Tristram :(");
			Town.goToTown();

			return false;
		}

		Pather.moveTo(25048, 5177);

        wirt = getUnit(UnitType.Object, UniqueObjectIds.Wirts_Body);

		for (i = 0; i < 8; i += 1) {
			wirt.interact();
			delay(500);

            leg = getUnit(UnitType.Item, ItemClassIds.Wirts_Leg);

			if (leg) {
				gid = leg.gid;

				Pickit.pickItem(leg);
				Town.goToTown();

				return me.getItem(-1, -1, gid);
			}
		}

		Town.goToTown();
		say("Failed to get the leg :(");

		return false;
	};

	this.getTome = function () {
		var tome, akara, myTome;

        myTome = me.findItem("tbk", ItemModes.Item_In_Inventory_Stash_Cube_Or_Store, ItemLocation.Inventory);
		tome = me.getItem("tbk");

		// In case of 2 tomes or tome stuck in cube
		if (tome) {
			do {
				if (!myTome || tome.gid !== myTome.gid) {
					return copyUnit(tome);
				}
			} while (tome.getNext());
		}

		Town.move("akara");

        akara = getUnit(UnitType.NPC, NPC.Akara);

		if (!akara || akara.area !== me.area || getDistance(me, akara) > 20) {
			say("Akara not found.");

			return false;
		}

        myTome = me.findItem("tbk", ItemModes.Item_In_Inventory_Stash_Cube_Or_Store, ItemLocation.Inventory);
		tome = me.getItem("tbk");

		if (tome) {
			do {
				if (!myTome || tome.gid !== myTome.gid) {
					return copyUnit(tome);
				}
			} while (tome.getNext());
		}

		akara = Town.initNPC("Shop");

		if (!akara) {
			say("Failed to buy tome :(");

			return false;
		}

		tome = akara.getItem("tbk");

		if (tome.buy()) {
			tome = me.getItem("tbk");

			if (tome) {
				do {
					if (!myTome || tome.gid !== myTome.gid) {
						return copyUnit(tome);
					}
				} while (tome.getNext());
			}
		}

		return false;
	};

	this.openPortal = function (nick) {
		if (!Misc.inMyParty(nick)) {
			say("Accept party invite, noob.");

			return true;
		}

        if (Pather.getPortal(Areas.Act1.Moo_Moo_Farm)) {
			say("Cow portal already open.");

			return true;
		}

        if (me.getQuest(Quests.Act1.The_Search_for_Cain, 10)) { // king dead or cain not saved
			say("Can't open the portal because I killed Cow King.");

			return false;
		}

        if (Config.Enchant.GetLeg && !me.getQuest(Quests.Act1.The_Search_for_Cain, 0)) {
			say("Can't get leg because I don't have Cain quest.");

			return false;
		}

		switch (me.gametype) {
		case GameType.Classic: // classic
                if (!me.getQuest(Quests.Act4.Terrors_End, 0)) { // diablo not completed
				say("I don't have Diablo quest.");

				return false;
			}

			break;
		case GameType.Expansion: // expansion
                if (!me.getQuest(Quests.Act5.Eve_of_Destruction, 0)) { // baal not completed
				say("I don't have Baal quest.");

				return false;
			}

			break;
		}

		var i, leg, tome;

		leg = this.getLeg();

		if (!leg) {
			return false;
		}

		tome = this.getTome();

		if (!tome) {
			return false;
		}

		if (!Town.openStash() || !Cubing.emptyCube() || !Storage.Cube.MoveTo(leg) || !Storage.Cube.MoveTo(tome) || !Cubing.openCube()) {
			return false;
		}

		transmute();
		delay(500);

		for (i = 0; i < 10; i += 1) {
            if (Pather.getPortal(Areas.Act1.Moo_Moo_Farm)) {
				return true;
			}

			delay(200);
		}

		say("Failed to open cow portal.");

		return false;
	};

	this.getWpNick = function (nick) {
		if (!this.wpNicks) {
			this.wpNicks = {};
		}

		if (this.wpNicks.hasOwnProperty(nick)) {
			if (this.wpNicks[nick].requests > 4) {
				return "maxrequests";
			}

			if (getTickCount() - this.wpNicks[nick].timer < 60000) {
				return "mintime";
			}

			return true;
		}

		return false;
	};

	this.addWpNick = function (nick) {
		this.wpNicks[nick] = {timer: getTickCount(), requests: 0};
	};

	this.giveWps = function (nick) {
		if (!Misc.inMyParty(nick)) {
			say("Accept party invite, noob.");

			return false;
		}

		var i, act, timeout, wpList;

		switch (this.getWpNick(nick)) {
		case "maxrequests":
			say(nick + ", you have spent all your waypoint requests for this game.");

			return false;
		case "mintime":
			say(nick + ", you may request waypoints every 60 seconds.");

			return false;
		case false:
			this.addWpNick(nick);

			break;
		}

		act = this.getPlayerAct(nick);

		switch (act) {
		case 1:
                wpList = [Areas.Act1.Cold_Plains, Areas.Act1.Stony_Field, Areas.Act1.Dark_Wood, Areas.Act1.Black_Marsh, Areas.Act1.Outer_Cloister, Areas.Act1.Jail_Level_1, Areas.Act1.Inner_Cloister, Areas.Act1.Catacombs_Level_2];

			break;
		case 2:
                wpList = [Areas.Act2.A2_Sewers_Level_2, Areas.Act2.Dry_Hills, Areas.Act2.Halls_Of_The_Dead_Level_2, Areas.Act2.Far_Oasis, Areas.Act2.Lost_City, Areas.Act2.Palace_Cellar_Level_1, Areas.Act2.Arcane_Sanctuary, Areas.Act2.Canyon_Of_The_Magi];

			break;
		case 3:
                wpList = [Areas.Act3.Spider_Forest, Areas.Act3.Great_Marsh, Areas.Act3.Flayer_Jungle, Areas.Act3.Lower_Kurast, Areas.Act3.Kurast_Bazaar, Areas.Act3.Upper_Kurast, Areas.Act3.Travincal, Areas.Act3.Durance_Of_Hate_Level_2];

			break;
		case 4:
                wpList = [Areas.Act4.City_Of_The_Damned, Areas.Act4.River_Of_Flame];

			break;
		case 5:
                wpList = [Areas.Act5.Frigid_Highlands, Areas.Act5.Arreat_Plateau, Areas.Act5.Crystalized_Passage, Areas.Act5.Glacial_Trail, Areas.Act5.Halls_Of_Pain, Areas.Act5.Frozen_Tundra, Areas.Act5.Ancients_Way, Areas.Act5.The_Worldstone_Keep_Level_2];

			break;
		}

MainLoop:
		for (i = 0; i < wpList.length; i += 1) {
			if (this.checkHostiles()) {
				break;
			}

			try {
				Pather.useWaypoint(wpList[i], true);
				Pather.makePortal();
				say(getArea().name + " TP up");

				for (timeout = 0; timeout < 20; timeout += 1) {
					if (getUnit(0, nick)) {
						break;
					}

					delay(1000);
				}

				if (timeout >= 20) {
					say("Aborting wp giving.");

					break MainLoop;
				}

				delay(5000);
			} catch (error) {

			}
		}

		Town.doChores();
		Town.goToTown(1);
		Town.move("portalspot");

		this.wpNicks[nick].requests += 1;
		this.wpNicks[nick].timer = getTickCount();

		return true;
	};

	this.getPlayerAct = function (name) {
		var unit = getParty();

		if (unit) {
			do {
				if (unit.name === name) {
                    if (unit.area <= Areas.Act1.Moo_Moo_Farm) {
						return 1;
					}

                    if (unit.area >= Areas.Act2.Lut_Gholein && unit.area <= Areas.Act2.Arcane_Sanctuary) {
						return 2;
					}

                    if (unit.area >= Areas.Act3.Kurast_Docktown && unit.area <= Areas.Act3.Durance_Of_Hate_Level_3) {
						return 3;
					}

                    if (unit.area >= Areas.Act4.The_Pandemonium_Fortress && unit.area <= Areas.Act4.Chaos_Sanctuary) {
						return 4;
					}

					return 5;
				}
			} while (unit.getNext());
		}

		return false;
	};

	this.checkHostiles = function () {
		var rval = false,
			party = getParty();

		if (party) {
			do {
				if (party.name !== me.name && getPlayerFlag(me.gid, party.gid, 8)) {
					rval = true;

					if (Config.ShitList && shitList.indexOf(party.name) === -1) {
						shitList.push(party.name);
					}
				}
			} while (party.getNext());
		}

		return rval;
	};

	this.floodCheck = function (command) {
		var cmd = command[0],
			nick = command[1];

		if ([	"help", "timeleft",
				Config.Enchant.Triggers[0].toLowerCase(),
				Config.Enchant.Triggers[1].toLowerCase(),
				Config.Enchant.Triggers[2].toLowerCase()
				].indexOf(cmd.toLowerCase()) === -1) {
			return false;
		}

		if (!this.cmdNicks) {
			this.cmdNicks = {};
		}

		if (!this.cmdNicks.hasOwnProperty(nick)) {
			this.cmdNicks[nick] = {
				firstCmd: getTickCount(),
				commands: 0,
				ignored: false
			};
		}

		if (this.cmdNicks[nick].ignored) {
			if (getTickCount() - this.cmdNicks[nick].ignored < 60000) {
				return true; // ignore flooder
			}

			// unignore flooder
			this.cmdNicks[nick].ignored = false;
			this.cmdNicks[nick].commands = 0;
		}

		this.cmdNicks[nick].commands += 1;

		if (getTickCount() - this.cmdNicks[nick].firstCmd < 10000) {
			if (this.cmdNicks[nick].commands > 5) {
				this.cmdNicks[nick].ignored = getTickCount();

				say(nick + ", you are being ignored for 60 seconds because of flooding.");
			}
		} else {
			this.cmdNicks[nick].firstCmd = getTickCount();
			this.cmdNicks[nick].commands = 0;
		}

		return false;
	};

	function ChatEvent(nick, msg) {
		command = [msg, nick];
	}

	function GreetEvent(mode, param1, param2, name1, name2) {
		switch (mode) {
		case 0x02:
                if (me.inTown && me.mode === PlayerModes.Town_Neutral) { // idle in town
				greet.push(name1);
			}

			break;
		}
	}

	// START
	if (Config.ShitList) {
		shitList = ShitList.read();
	}

	addEventListener("chatmsg", ChatEvent);
	addEventListener("gameevent", GreetEvent);
	Town.doChores();
	Town.goToTown(1);
	Town.move("portalspot");

	spot = {
		x: me.x,
		y: me.y
	};

	while (true) {
		while (greet.length > 0) {
			nick  = greet.shift();

			if (shitList.indexOf(nick) === -1) {
				say("Welcome, " + nick + "! For a list of commands say 'help'");
			}
		}

		if (spot && getDistance(me, spot) > 10) {
			Pather.moveTo(spot.x, spot.y);
		}

		if (command && !this.floodCheck(command)) {
			switch (command[0].toLowerCase()) {
			case "help":
				this.checkHostiles();

				if (shitList.indexOf(command[1]) > -1) {
					say("No " + command[0] + " for the shitlisted.");

					break;
				}

				say("Commands:");
				say("Remaining time: timeleft" +
						(Config.Enchant.Triggers[0] ? " | Enhant: " + Config.Enchant.Triggers[0] : "") +
						(Config.Enchant.Triggers[1] ? " | Open cow level: " + Config.Enchant.Triggers[1] : "") +
						(Config.Enchant.Triggers[2] ? " | Give waypoints: " + Config.Enchant.Triggers[2] : ""));

				if (Config.Enchant.AutoChant) {
					say("Auto enchant is ON");
				}

				break;
			case "timeleft":
				tick = Config.Enchant.GameLength * 6e4 - getTickCount() + startTime;
				m = Math.floor(tick / 60000);
				s = Math.floor((tick / 1000) % 60);

				say("Time left: " + (m ? m + " minute" + (m > 1 ? "s" : "") + ", " : "") + s + " second" + (s > 1 ? "s." : "."));

				break;
			case Config.Enchant.Triggers[0].toLowerCase(): // chant
				this.checkHostiles();

				if (shitList.indexOf(command[1]) > -1) {
					say("No chant for the shitlisted.");

					break;
				}

				this.enchant(command[1]);

				break;
			case Config.Enchant.Triggers[1].toLowerCase(): // cows
				hostile = this.checkHostiles();

				if (shitList.indexOf(command[1]) > -1) {
					say("No cows for the shitlisted.");

					break;
				}

				this.openPortal(command[1]);
				me.cancel();

				break;
			case Config.Enchant.Triggers[2].toLowerCase(): // wps
				hostile = this.checkHostiles();

				if (shitList.indexOf(command[1]) > -1) {
					say("No waypoints for the shitlisted.");

					break;
				}

				if (hostile) {
					say("Command disabled because of hostiles.");

					break;
				}

				this.giveWps(command[1]);

				break;
			}
		}

		command = "";

		if (me.act > 1) {
			Town.goToTown(1);
		}

		if (Config.Enchant.AutoChant) {
			this.autoChant();
		}

		if (getTickCount() - startTime >= Config.Enchant.GameLength * 6e4) {
			say("Use kolbot or die!");
			delay(1000);

			break;
		}

		delay(200);
	}

	return true;
}