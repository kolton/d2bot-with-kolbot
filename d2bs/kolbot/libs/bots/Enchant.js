/**
*	@filename	Enchant.js
*	@author		kolton
*	@desc		Enchant other players, open cow portal and give waypoints on command
*/

function Enchant() {
	var command, hostile, nick,
		shitList = [],
		wpNicks = {},
		greet = [];

	this.enchant = function (nick) {
		if (!Misc.inMyParty(nick)) {
			say("Accept party invite, noob.");

			return false;
		}

		var unit = getUnit(0, nick);

		if (!unit || getDistance(me, unit) > 40 ) {
			say("Get closer.");

			return false;
		}

		if (unit) {
			do {
				if (!unit.dead) { // player is alive
					Skill.setSkill(52, 0);
					sendPacket(1, 0x11, 4, unit.type, 4, unit.gid);
					delay(500);
				}
			} while (unit.getNext());
		}

		unit = getUnit(1);

		if (unit) {
			do {
				if (unit.getParent() && unit.getParent().name === nick) { // merc or any other owned unit
					Skill.setSkill(52, 0);
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
		unit = getUnit(0);

		if (unit) {
			do {
				if (unit.name !== me.name && !unit.dead && shitList.indexOf(unit.name) === -1 && Misc.inMyParty(unit.name) && !unit.getState(16) && getDistance(me, unit) <= 40) {
					Skill.setSkill(52, 0);
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
				if (unit.getParent() && chanted.indexOf(unit.getParent().name) > -1 && !unit.getState(16) && getDistance(me, unit) <= 40) {
					Skill.setSkill(52, 0);
					sendPacket(1, 0x11, 4, unit.type, 4, unit.gid);
					delay(500);
				}
			} while (unit.getNext());
		}

		return true;
	};

	this.getLeg = function () {
		var i, portal, wirt, leg, gid;

		if (!Config.Enchant.GetLeg) {
			leg = getUnit(4, 88);

			if (leg) {
				gid = leg.gid;

				Pickit.pickItem(leg);

				return me.getItem(-1, -1, gid);
			}

			say("Bring the leg to me.");

			return false;
		}

		if (me.getItem(88)) {
			return me.getItem(88);
		}

		Pather.useWaypoint(4);
		Precast.doPrecast(true);
		Pather.moveToPreset(me.area, 1, 737, 8, 8);

		for (i = 0; i < 6; i += 1) {
			portal = Pather.getPortal(38);

			if (portal) {
				Pather.usePortal(null, null, portal);

				break;
			}

			delay(500);
		}

		if (!portal) {
			throw new Error("Tristram portal not found");
		}

		Pather.moveTo(25048, 5177);

		wirt = getUnit(2, 268);

		for (i = 0; i < 8; i += 1) {
			wirt.interact();
			delay(500);

			leg = getUnit(4, 88);

			if (leg) {
				gid = leg.gid;

				Pickit.pickItem(leg);
				Town.goToTown();

				return me.getItem(-1, -1, gid);
			}
		}

		Town.goToTown();

		return false;
	};

	this.getTome = function () {
		var tome,
			myTome = me.findItem("tbk", 0, 3),
			akara = Town.initNPC("Shop");

		tome = me.getItem("tbk");

		if (tome) {
			do {
				if (!myTome || tome.gid !== myTome.gid) {
					return copyUnit(tome);
				}
			} while (tome.getNext());
		}

		if (!akara) {
			throw new Error("Failed to buy tome");
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

		if (Pather.getPortal(39)) {
			return true;
		}

		if (me.getQuest(4, 10) || !me.getQuest(4, 0)) { // king dead or cain not saved
			return false;
		}

		switch (me.gametype) {
		case 0: // classic
			if (!me.getQuest(26, 0)) { // diablo not completed
				return false;
			}

			break;
		case 1: // expansion
			if (!me.getQuest(40, 0)) { // baal not completed
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
			if (Pather.getPortal(39)) {
				return true;
			}

			delay(200);
		}

		return false;
	};

	this.getWpNick = function (nick) {
		if (wpNicks.hasOwnProperty(nick)) {
			if (wpNicks[nick].requests > 4) {
				return "maxrequests";
			}

			if (getTickCount() - wpNicks[nick].timer < 60000) {
				return "mintime";
			}

			return true;
		}

		return false;
	};

	this.addWpNick = function (nick) {
		wpNicks[nick] = {timer: getTickCount(), requests: 0};
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
			wpList = [3, 4, 5, 6, 27, 29, 32, 35];

			break;
		case 2:
			wpList = [48, 42, 57, 43, 44, 52, 74, 46];

			break;
		case 3:
			wpList = [76, 77, 78, 79, 80, 81, 83, 101];

			break;
		case 4:
			wpList = [106, 107];

			break;
		case 5:
			wpList = [111, 112, 113, 115, 123, 117, 118, 129];

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

		Town.goToTown(1);
		Town.doChores();
		Town.move("portalspot");

		wpNicks[nick].requests += 1;
		wpNicks[nick].timer = getTickCount();

		return true;
	};

	this.getPlayerAct = function (name) {
		var unit = getParty();

		if (unit) {
			do {
				if (unit.name === name) {
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

	function ChatEvent(nick, msg) {
		command = [msg, nick];
	}

	function GreetEvent(mode, param1, param2, name1, name2) {
		switch (mode) {
		case 0x02:
			if (me.inTown && me.mode === 5) { // idle in town
				greet.push(name1);
			}

			break;
		}
	}

	if (Config.ShitList) {
		shitList = ShitList.read();
	}

	addEventListener("chatmsg", ChatEvent);
	addEventListener("gameevent", GreetEvent);
	Town.goToTown(1);
	Town.doChores();
	Town.move("portalspot");

	while (true) {
		while (greet.length > 0) {
			nick  = greet.shift();

			if (shitList.indexOf(nick) === -1) {
				say("Welcome, " + nick + "! For a list of commands say 'help'");
			}
		}

		if (command) {
			switch (command[0].toLowerCase()) {
			case "help":
				this.checkHostiles();

				if (shitList.indexOf(command[1]) > -1) {
					say("No " + command[0] + " for the shitlisted.");

					break;
				}

				say("Commands:");
				say("Chant: " + (Config.Enchant.Triggers[0] || "disabled") + "| Open cow level: " + (Config.Enchant.Triggers[1] || "disabled") + "| Give waypoints: " + (Config.Enchant.Triggers[2] || "disabled"));

				if (Config.Enchant.AutoChant) {
					say("Auto enchant is ON");
				}

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

				if (hostile) {
					say("Command disabled because of hostiles.");

					break;
				}

				if (!this.openPortal(command[1])) {
					say("Failed to open cow portal.");
				}

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

		if (Config.Enchant.AutoChant) {
			this.autoChant();
		}

		if (getTickCount() - me.gamestarttime >= Config.Enchant.GameLength * 6e4) {
			say("Use kolbot or die!");
			delay(1000);

			break;
		}

		delay(200);
	}

	return true;
}