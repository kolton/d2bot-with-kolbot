/**
*	@filename	Questing.js
*	@author		kolton
*	@desc		Do quests, only most popular ones for now
*/

function Questing() {
	var i, j,
		quests = [
			[1, "clearDen"],
			[9, "killRadament"],
			[17, "lamEssen"],
			[25, "killIzual"],
			[35, "killShenk"],
			[37, "freeAnya"]
		];

	this.checkQuest = function (id, state) {
		sendPacket(1, 0x40);
		delay(500);

		return me.getQuest(id, state);
	};

	this.clearDen = function () {
		print("starting den");

		var akara;

		if (!Town.goToTown(1) || !Pather.moveToExit([2, 8], true)) {
			throw new Error();
		}

		Precast.doPrecast(true);
		Attack.clearLevel();
		Town.goToTown();
		Town.move(NPC.Akara);

		akara = getUnit(1, NPC.Akara);

		akara.openMenu();
		me.cancel();

		return true;
	};

	this.killRadament = function () {
		if (!Pather.accessToAct(2)) {
			return false;
		}

		print("starting radament");

		var book, atma;

		if (!Town.goToTown() || !Pather.useWaypoint(48, true)) {
			throw new Error();
		}

		Precast.doPrecast(true);

		if (!Pather.moveToExit(49, true) || !Pather.moveToPreset(me.area, 2, 355)) {
			throw new Error();
		}

		Attack.kill(229); // Radament

		book = getUnit(4, 552);

		if (book) {
			Pickit.pickItem(book);
			delay(300);
			clickItem(1, book);
		}

		Town.goToTown();
		Town.move(NPC.Atma);

		atma = getUnit(1, NPC.Atma);

		atma.openMenu();
		me.cancel();

		return true;
	};

	this.killIzual = function () {
		if (!Pather.accessToAct(4)) {
			return false;
		}

		print("starting izual");

		var tyrael;

		if (!Town.goToTown() || !Pather.useWaypoint(106, true)) {
			throw new Error();
		}

		Precast.doPrecast(true);

		if (!Pather.moveToPreset(105, 1, 256)) {
			return false;
		}

		Attack.kill(256); // Izual
		Town.goToTown();
		Town.move(NPC.Tyrael);

		tyrael = getUnit(1, NPC.Tyrael);

		tyrael.openMenu();
		me.cancel();

		if (getUnit(2, 566)) {
			Pather.useUnit(2, 566, 109);
		}

		return true;
	};

	this.lamEssen = function () {
		if (!Pather.accessToAct(3)) {
			return false;
		}

		print("starting lam essen");

		var stand, book, alkor;

		if (!Town.goToTown() || !Pather.useWaypoint(80, true)) {
			throw new Error();
		}

		Precast.doPrecast(true);

		if (!Pather.moveToExit(94, true) || !Pather.moveToPreset(me.area, 2, 193)) {
			throw new Error();
		}

		stand = getUnit(2, 193);

		Misc.openChest(stand);
		delay(300);

		book = getUnit(4, 548);

		Pickit.pickItem(book);
		Town.goToTown();
		Town.move(NPC.Alkor);

		alkor = getUnit(1, NPC.Alkor);

		alkor.openMenu();
		me.cancel();

		return true;
	};

	this.killShenk = function () {
		if (!Pather.accessToAct(5)) {
			return false;
		}

		if (this.checkQuest(35, 1)) {
			return true;
		}

		print("starting shenk");

		if (!Town.goToTown() || !Pather.useWaypoint(111, true)) {
			throw new Error();
		}

		Precast.doPrecast(true);
		Pather.moveTo(3883, 5113);
		Attack.kill(getLocaleString(22435)); // Shenk the Overseer
		Town.goToTown();

		return true;
	};

	this.freeAnya = function () {
		if (!Pather.accessToAct(5)) {
			return false;
		}

		if (this.checkQuest(37, 1)) {
			return true;
		}

		print("starting anya");

		var anya, malah, scroll;

		if (!Town.goToTown() || !Pather.useWaypoint(113, true)) {
			throw new Error();
		}

		Precast.doPrecast(true);

		if (!Pather.moveToExit(114, true) || !Pather.moveToPreset(me.area, 2, 460)) {
			throw new Error();
		}

		delay(1000);

		anya = getUnit(2, 558);

		Pather.moveToUnit(anya);
		//anya.interact();
		sendPacket(1, 0x13, 4, 0x2, 4, anya.gid);
		delay(300);
		me.cancel();
		Town.goToTown();
		Town.move(NPC.Malah);

		malah = getUnit(1, NPC.Malah);

		malah.openMenu();
		me.cancel();
		Town.move("portalspot");
		Pather.usePortal(114, me.name);
		anya.interact();
		delay(300);
		me.cancel();
		Town.goToTown();
		Town.move(NPC.Malah);
		malah.openMenu();
		me.cancel();
		delay(500);

		scroll = me.getItem(646);

		if (scroll) {
			clickItem(1, scroll);
		}

		return true;
	};

	for (i = 0; i < quests.length; i += 1) {
		if (me.inTown) {
			Town.doChores();
		}

		for (j = 0; j < 3; j += 1) {
			if (!this.checkQuest(quests[i][0], 0)) {
				try {
					if (this[quests[i][1]]()) {
						break;
					}
				} catch (e) {

				}
			} else {
				break;
			}
		}

		if (j === 3) {
			D2Bot.printToConsole("Quest " + quests[i][1] + " failed.");
		}
	}

	D2Bot.printToConsole("All quests done. Stopping profile.");
	D2Bot.stop();

	return true;
}