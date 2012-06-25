/**
*	@filename	Enchant.js
*	@author		kolton
*	@desc		Enchant other players, open cow portal and give waypoints on command
*/

function Enchant() {
	this.enchant = function (nick) {
		var unit;

		if (!Misc.inMyParty(nick)) {
			say("Accept party invite, noob.");

			return false;
		}

		unit = getUnit(0, nick);

		if (unit) {
			do {
				if (unit.mode !== 0 && unit.mode !== 17) { // player is alive
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

	this.getLeg = function () {
		var i, portal, wirt, leg, gid;

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

	this.openPortal = function () {
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

	this.giveWps = function (nick) {
		var i, act, timeout, wpList;

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

		return true;
	};

	this.getPlayerAct = function (name) {
		var unit = getParty();

		if (unit) {
			do {
				if (unit.name === name) {
					if (unit.area <= 39) {
						return 1;
					} else if (unit.area >= 40 && unit.area <= 74) {
						return 2;
					} else if (unit.area >= 75 && unit.area <= 102) {
						return 3;
					} else if (unit.area >= 103 && unit.area <= 108) {
						return 4;
					}

					return 5;
				}
			} while (unit.getNext());
		}

		return false;
	};

	var command,
		greet = [];

	function ChatEvent(nick, msg) {
		command = [msg, nick];
	}

	function GreetEvent(mode, param1, param2, name1, name2) {
		switch (mode) {
		case 0x02:
			greet.push(name1);

			break;
		}
	}

	addEventListener("chatmsg", ChatEvent);
	addEventListener("gameevent", GreetEvent);
	Town.goToTown(1);
	Town.doChores();
	Town.move("portalspot");

	while (true) {
		while (greet.length > 0) {
			say("/w " + greet.shift() + " Welcome to my chant games! For a list of commands say 'help'");
		}

		if (command) {
			switch (command[0].toLowerCase()) {
			case "help":
				say("Commands:");
				say("Chant: " + Config.Enchant.Triggers[0] + "| Open cow level: " + Config.Enchant.Triggers[1] + "| Give waypoints: " + Config.Enchant.Triggers[2]);

				break;
			case "cows":
				if (!this.openPortal()) {
					say("Failed to open cow portal");
				}

				me.cancel();

				break;
			case "chant":
				this.enchant(command[1]);

				break;
			case "wps":
				this.giveWps(command[1]);

				break;
			}
		}

		command = "";

		if (getTickCount() - me.gamestarttime >= Config.Enchant.GameLength * 1e6) {
			say("Next Game!");

			break;
		}

		delay(100);
	}

	return true;
}